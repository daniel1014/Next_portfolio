#!/usr/bin/env python3
"""
Enhanced Document Processor with Unstructured.io Integration
Processes .docx files with hierarchical structure preservation for Pinecone RAG
"""

import os
import re
import hashlib
import logging
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass
from datetime import datetime

# Third-party imports
from unstructured.partition.docx import partition_docx
from unstructured.documents.elements import (
    Header, 
    Title, 
    NarrativeText, 
    ListItem,
    Element
)
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DocumentChunk:
    """Enhanced document chunk with hierarchical metadata"""
    id: str
    text: str
    metadata: Dict[str, Any]
    
@dataclass
class HierarchicalDocument:
    """Document with preserved hierarchy structure"""
    sections: List[Dict[str, Any]]
    total_chunks: int
    metadata: Dict[str, Any]

class EnhancedDocumentProcessor:
    """Process documents with hierarchical structure using Unstructured.io"""
    
    def __init__(
        self,
        chunk_size: int = 1000,
        overlap: int = 200,
        preserve_hierarchy: bool = True
    ):
        """Initialize processor with chunking parameters"""
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.preserve_hierarchy = preserve_hierarchy
        
    def estimate_tokens(self, text: str) -> int:
        """Estimate token count (approximately 4 chars per token)"""
        return len(text.strip()) // 4
    
    def classify_element_type(self, element: Element) -> Tuple[str, int]:
        """Classify element type and determine hierarchy level"""
        if isinstance(element, Title):
            return "title", 1
        elif isinstance(element, Header):
            # Determine header level from metadata or text analysis
            hierarchy_level = self._determine_header_level(element)
            if hierarchy_level == 2:
                return "section_header", 2  # H2 for section titles
            elif hierarchy_level == 4:
                return "project_header", 4  # H4 for project names
            else:
                return "header", hierarchy_level
        elif isinstance(element, NarrativeText):
            return "content", 5
        elif isinstance(element, ListItem):
            return "list_item", 5
        else:
            return "other", 6
    
    def _determine_header_level(self, element: Element) -> int:
        """Determine header level from element metadata or text analysis"""
        # Check if metadata contains header level information
        if hasattr(element, 'metadata') and element.metadata:
            # Look for category_depth or header level indicators
            if hasattr(element.metadata, 'category_depth'):
                return element.metadata.category_depth
            
            # Check for styling information that might indicate level
            if hasattr(element.metadata, 'text_as_html'):
                html = element.metadata.text_as_html
                if '<h2' in html.lower():
                    return 2
                elif '<h4' in html.lower():
                    return 4
                elif '<h3' in html.lower():
                    return 3
                elif '<h1' in html.lower():
                    return 1
        
        # Fallback: analyze text characteristics
        text = element.text.strip() if hasattr(element, 'text') else str(element)
        
        # Heuristics for detecting section vs project headers
        if any(keyword in text.lower() for keyword in [
            'professional', 'experience', 'education', 'skills', 'projects', 
            'technical', 'background', 'summary', 'achievements', 'certifications'
        ]):
            return 2  # Section header (H2)
        elif any(keyword in text.lower() for keyword in [
            'project', 'application', 'system', 'platform', 'tool', 'web app',
            'mobile app', 'dashboard', 'api', 'service'
        ]) and len(text.split()) <= 6:  # Short project titles
            return 4  # Project header (H4)
        else:
            return 3  # Default subsection header
    
    def extract_section_structure(self, elements: List[Element]) -> List[Dict[str, Any]]:
        """Extract hierarchical section structure from document elements"""
        sections = []
        current_section = None
        current_subsection = None
        
        for i, element in enumerate(elements):
            element_type, hierarchy_level = self.classify_element_type(element)
            text = element.text.strip() if hasattr(element, 'text') else str(element).strip()
            
            if not text:
                continue
                
            # Extract metadata from element
            element_metadata = {
                "element_id": f"element_{i}",
                "element_type": element_type,
                "hierarchy_level": hierarchy_level,
                "category_depth": getattr(element, "category_depth", hierarchy_level),
                "parent_id": getattr(element, "parent_id", None),
                "page_number": getattr(element.metadata, "page_number", None) if hasattr(element, 'metadata') else None,
                "coordinates": getattr(element.metadata, "coordinates", None) if hasattr(element, 'metadata') else None,
                "filename": getattr(element.metadata, "filename", None) if hasattr(element, 'metadata') else None,
            }
            
            # Handle different hierarchy levels
            if element_type in ["title", "section_header"] and hierarchy_level <= 2:
                # Start new main section (H1, H2)
                if current_section:
                    sections.append(current_section)
                
                current_section = {
                    "section_id": f"section_{len(sections)}",
                    "title": text,
                    "type": element_type,
                    "hierarchy_level": hierarchy_level,
                    "content": [],
                    "subsections": [],
                    "projects": [],  # Special handling for projects
                    "metadata": element_metadata
                }
                current_subsection = None
                
            elif element_type == "project_header" and hierarchy_level == 4:
                # Handle project headers (H4)
                if current_section is None:
                    # Create default section if none exists
                    current_section = {
                        "section_id": f"section_{len(sections)}",
                        "title": "Projects",
                        "type": "default",
                        "hierarchy_level": 1,
                        "content": [],
                        "subsections": [],
                        "projects": [],
                        "metadata": {"element_type": "generated"}
                    }
                
                # Create new project
                project = {
                    "project_id": f"project_{len(current_section['projects'])}",
                    "title": text,
                    "type": "project",
                    "hierarchy_level": hierarchy_level,
                    "content": [],
                    "metadata": element_metadata
                }
                current_section["projects"].append(project)
                current_subsection = project  # Use project as current subsection
                
            elif element_type in ["header"] and hierarchy_level == 3:
                # Handle H3 subsections
                if current_section is None:
                    current_section = {
                        "section_id": f"section_{len(sections)}",
                        "title": "Introduction",
                        "type": "default",
                        "hierarchy_level": 1,
                        "content": [],
                        "subsections": [],
                        "projects": [],
                        "metadata": {"element_type": "generated"}
                    }
                
                current_subsection = {
                    "subsection_id": f"subsection_{len(current_section['subsections'])}",
                    "title": text,
                    "type": element_type,
                    "hierarchy_level": hierarchy_level,
                    "content": [],
                    "metadata": element_metadata
                }
                current_section["subsections"].append(current_subsection)
                
            else:
                # Add content to current section or subsection
                content_item = {
                    "text": text,
                    "type": element_type,
                    "metadata": element_metadata
                }
                
                if current_subsection:
                    current_subsection["content"].append(content_item)
                elif current_section:
                    current_section["content"].append(content_item)
                else:
                    # Create default section if none exists
                    current_section = {
                        "section_id": f"section_{len(sections)}",
                        "title": "Introduction",
                        "type": "default",
                        "hierarchy_level": 1,
                        "content": [content_item],
                        "subsections": [],
                        "metadata": {"element_type": "generated"}
                    }
        
        # Add final section
        if current_section:
            sections.append(current_section)
        
        return sections
    
    def create_contextual_chunks(
        self, 
        section: Dict[str, Any], 
        parent_context: str = ""
    ) -> List[DocumentChunk]:
        """Create chunks with hierarchical context preservation"""
        chunks = []
        
        # Build section context
        section_title = section.get("title", "")
        section_context = f"{parent_context} > {section_title}".strip(" > ")
        
        # Process section content
        section_content = []
        
        # Add section title if it's meaningful content
        if section_title and section.get("type") != "default":
            section_content.append(f"## {section_title}")
        
        # Add main section content
        for content_item in section.get("content", []):
            section_content.append(content_item["text"])
        
        # Process subsections
        for subsection in section.get("subsections", []):
            subsection_title = subsection.get("title", "")
            if subsection_title:
                section_content.append(f"### {subsection_title}")
            
            for content_item in subsection.get("content", []):
                section_content.append(content_item["text"])
        
        # Process projects (H4 level)
        for project in section.get("projects", []):
            project_title = project.get("title", "")
            if project_title:
                section_content.append(f"#### {project_title}")
            
            for content_item in project.get("content", []):
                section_content.append(content_item["text"])
        
        # Combine content
        full_text = "\n\n".join(section_content)
        
        if not full_text.strip():
            return chunks
        
        # Create chunks with overlap
        sentences = re.split(r'(?<=[.!?])\s+', full_text)
        current_chunk = ""
        chunk_index = 0
        
        for sentence in sentences:
            # Check if adding sentence would exceed chunk size
            test_chunk = current_chunk + " " + sentence if current_chunk else sentence
            
            if self.estimate_tokens(test_chunk) > self.chunk_size and current_chunk:
                # Create chunk
                chunk_id = f"{section['section_id']}_chunk_{chunk_index}_{hashlib.md5(current_chunk.encode()).hexdigest()[:8]}"
                
                chunk_metadata = {
                    "section_id": section["section_id"],
                    "section_title": section_title,
                    "section_type": section.get("type", "content"),
                    "hierarchy_level": section.get("hierarchy_level", 1),
                    "chunk_index": chunk_index,
                    "section_context": section_context,
                    "parent_section": parent_context,
                    "total_tokens": self.estimate_tokens(current_chunk),
                    "document_type": self._classify_document_section(section_title),
                    "created_at": datetime.now().isoformat(),
                    "source_file": "daniel_background_20250722.docx",
                    "has_projects": len(section.get("projects", [])) > 0,
                    "project_count": len(section.get("projects", [])),
                    "has_subsections": len(section.get("subsections", [])) > 0,
                    "subsection_count": len(section.get("subsections", []))
                }
                
                # Add element-specific metadata from first element in section
                if section.get("metadata"):
                    chunk_metadata.update({
                        "element_type": section["metadata"].get("element_type"),
                        "page_number": section["metadata"].get("page_number"),
                        "category_depth": section["metadata"].get("category_depth")
                    })
                
                chunks.append(DocumentChunk(
                    id=chunk_id,
                    text=current_chunk.strip(),
                    metadata=chunk_metadata
                ))
                
                # Start new chunk with overlap
                overlap_sentences = sentences[max(0, len(sentences) - sentences.index(sentence) - 3):]
                overlap_text = " ".join(overlap_sentences[-2:]) if len(overlap_sentences) >= 2 else ""
                current_chunk = overlap_text + " " + sentence if overlap_text else sentence
                chunk_index += 1
            else:
                current_chunk = test_chunk
        
        # Add final chunk
        if current_chunk.strip():
            chunk_id = f"{section['section_id']}_chunk_{chunk_index}_{hashlib.md5(current_chunk.encode()).hexdigest()[:8]}"
            
            chunk_metadata = {
                "section_id": section["section_id"],
                "section_title": section_title,
                "section_type": section.get("type", "content"),
                "hierarchy_level": section.get("hierarchy_level", 1),
                "chunk_index": chunk_index,
                "section_context": section_context,
                "parent_section": parent_context,
                "total_tokens": self.estimate_tokens(current_chunk),
                "document_type": self._classify_document_section(section_title),
                "created_at": datetime.now().isoformat(),
                "source_file": "daniel_background_20250722.docx",
                "has_projects": len(section.get("projects", [])) > 0,
                "project_count": len(section.get("projects", [])),
                "has_subsections": len(section.get("subsections", [])) > 0,
                "subsection_count": len(section.get("subsections", []))
            }
            
            if section.get("metadata"):
                chunk_metadata.update({
                    "element_type": section["metadata"].get("element_type"),
                    "page_number": section["metadata"].get("page_number"),
                    "category_depth": section["metadata"].get("category_depth")
                })
            
            chunks.append(DocumentChunk(
                id=chunk_id,
                text=current_chunk.strip(),
                metadata=chunk_metadata
            ))
        
        return chunks
    
    def _classify_document_section(self, section_title: str) -> str:
        """Classify document section type based on title"""
        title_lower = section_title.lower()
        
        if any(keyword in title_lower for keyword in ["experience", "work", "employment", "career"]):
            return "experience"
        elif any(keyword in title_lower for keyword in ["skill", "technical", "technology", "expertise"]):
            return "skills"
        elif any(keyword in title_lower for keyword in ["education", "degree", "university", "study"]):
            return "education"
        elif any(keyword in title_lower for keyword in ["project", "development", "application"]):
            return "projects"
        elif any(keyword in title_lower for keyword in ["summary", "profile", "bio", "about"]):
            return "summary"
        elif any(keyword in title_lower for keyword in ["contact", "information"]):
            return "contact"
        else:
            return "general"
    
    def process_docx_file(self, file_path: str) -> HierarchicalDocument:
        """Process .docx file and extract hierarchical structure"""
        logger.info(f"Processing .docx file: {file_path}")
        
        try:
            # Use Unstructured.io to partition the document
            elements = partition_docx(
                filename=file_path,
                include_page_breaks=True,
                include_metadata=True
            )
            
            logger.info(f"Extracted {len(elements)} elements from document")
            
            # Extract hierarchical structure
            sections = self.extract_section_structure(elements)
            logger.info(f"Identified {len(sections)} main sections")
            
            # Create chunks with hierarchical context
            all_chunks = []
            for section in sections:
                section_chunks = self.create_contextual_chunks(section)
                all_chunks.extend(section_chunks)
            
            logger.info(f"Created {len(all_chunks)} chunks with hierarchical metadata")
            
            # Build document metadata
            document_metadata = {
                "filename": os.path.basename(file_path),
                "total_sections": len(sections),
                "total_chunks": len(all_chunks),
                "processing_date": datetime.now().isoformat(),
                "chunk_size": self.chunk_size,
                "overlap": self.overlap,
                "preserve_hierarchy": self.preserve_hierarchy
            }
            
            return HierarchicalDocument(
                sections=sections,
                total_chunks=len(all_chunks),
                metadata=document_metadata
            )
            
        except Exception as e:
            logger.error(f"Error processing .docx file: {e}")
            raise
    
    def get_chunks_from_document(self, hierarchical_doc: HierarchicalDocument) -> List[DocumentChunk]:
        """Extract all chunks from hierarchical document"""
        all_chunks = []
        
        for section in hierarchical_doc.sections:
            section_chunks = self.create_contextual_chunks(section)
            all_chunks.extend(section_chunks)
        
        return all_chunks

def main():
    """Test the enhanced document processor"""
    # File path
    docx_path = "/Users/daniel/Documents/javascript/Next_portfolio/docs/daniel_background_20250722.docx"
    
    # Initialize processor
    processor = EnhancedDocumentProcessor(
        chunk_size=1000,
        overlap=200,
        preserve_hierarchy=True
    )
    
    try:
        # Process document
        hierarchical_doc = processor.process_docx_file(docx_path)
        
        # Get chunks
        chunks = processor.get_chunks_from_document(hierarchical_doc)
        
        # Display results
        print(f"\n=== Document Processing Results ===")
        print(f"Total sections: {hierarchical_doc.total_chunks}")
        print(f"Total chunks: {len(chunks)}")
        
        # Show sample chunks
        print(f"\n=== Sample Chunks ===")
        for i, chunk in enumerate(chunks[:3]):
            print(f"\nChunk {i+1}:")
            print(f"ID: {chunk.id}")
            print(f"Section: {chunk.metadata.get('section_title', 'N/A')}")
            print(f"Type: {chunk.metadata.get('document_type', 'N/A')}")
            print(f"Hierarchy: {chunk.metadata.get('hierarchy_level', 'N/A')}")
            print(f"Text preview: {chunk.text[:200]}...")
            
        # Show section structure
        print(f"\n=== Section Structure ===")
        for section in hierarchical_doc.sections:
            print(f"Section: {section['title']} (Level {section['hierarchy_level']})")
            for subsection in section.get('subsections', []):
                print(f"  - {subsection['title']} (Level {subsection['hierarchy_level']})")
            for project in section.get('projects', []):
                print(f"    * {project['title']} (Level {project['hierarchy_level']}) [PROJECT]")
        
    except Exception as e:
        logger.error(f"Error in main: {e}")
        raise

if __name__ == "__main__":
    main()