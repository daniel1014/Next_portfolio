#!/usr/bin/env python3
"""
Universal Document Processor with Unstructured.io Integration
Processes .docx and .pdf files with simplified structure for Pinecone RAG
"""

import os
import re
import logging
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime

# Third-party imports
from unstructured.partition.docx import partition_docx
from unstructured.partition.pdf import partition_pdf
from unstructured.documents.elements import Title, NarrativeText, Element
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DocumentChunk:
    """Document chunk with essential metadata"""
    id: str
    text: str
    metadata: Dict[str, Any]
    
@dataclass
class ProcessedDocument:
    """Document with sections and metadata"""
    sections: List[Dict[str, Any]]
    total_chunks: int
    metadata: Dict[str, Any]

class UniversalDocumentProcessor:
    """Process documents (.docx, .pdf) with simplified structure using Unstructured.io"""
    
    def __init__(self, chunk_size: int = 950):
        """Initialize processor with chunk size"""
        self.chunk_size = chunk_size
        
    def estimate_tokens(self, text: str) -> int:
        """Estimate token count (approximately 4 chars per token)"""
        return len(text.strip()) // 4

    def extract_sections(self, elements: List[Element], source_filename: str) -> List[Dict[str, Any]]:
        """
        Extract sections - Title elements create new sections, everything else is content.
        If a section (title) has no content, it is removed.
        Section IDs are now generated as '<filename>-section-<number>'.
        """
        sections = []
        current_section = None
        section_counter = 1
        # Get filename without extension
        filename_base = os.path.splitext(os.path.basename(source_filename))[0]

        for element in elements:
            text = element.text.strip() if hasattr(element, 'text') else str(element).strip()
            if not text:
                continue

            if isinstance(element, Title):
                # If the previous element was also a Title (i.e., current_section exists but has no content),
                # append this title to the previous title instead of starting a new section.
                if current_section and not current_section.get("content"):
                    # Combine titles with a separator (e.g., " - ")
                    current_section["title"] = f"{current_section['title']} - {text}"
                else:
                    # If the current section exists and has content, keep it; otherwise, discard it
                    if current_section and current_section.get("content"):
                        sections.append(current_section)
                    # Section ID as '<filename>-section-<number>'
                    section_id = f"{filename_base}-section-{section_counter}"
                    section_counter += 1
                    current_section = {
                        "section_id": section_id,
                        "title": text,
                        "content": [],
                        "page_number": getattr(element.metadata, "page_number", None) if hasattr(element, 'metadata') else None
                    }
            else:
                if not current_section:
                    section_id = f"{filename_base}-section-0"
                    current_section = {
                        "section_id": section_id,
                        "title": "Introduction",
                        "content": [],
                        "page_number": 1  # default page number
                    }
                # Add the main content (text) to the current section content
                current_section["content"].append(text)

        if current_section and current_section.get("content"):
            sections.append(current_section)
        return sections

    def create_chunks(self, section: Dict[str, Any], source_filename: str) -> List[DocumentChunk]:
        """
        Create chunks with essential metadata.
        - If a section produces only one chunk, the chunk ID is just the section_id (e.g., Resume-section-1).
        - If a section produces multiple chunks, use section_id-0, section_id-1, etc.
        """
        section_title = section.get("title", "")
        content_list = section.get("content", [])

        # Combine section title and content into a single string
        if section_title:
            full_text = f"## {section_title}\n\n" + "\n\n".join(content_list)
        else:
            full_text = "\n\n".join(content_list)

        if not full_text.strip():
            return []

        # Split the full text into sentences for chunking
        sentences = re.split(r'(?<=[.!?])\s+', full_text)
        current_chunk_text = ""
        chunk_index = 0
        sentence_chunks = []  # List of (chunk_text, chunk_index) tuples

        # Build chunks by adding sentences until the estimated token limit is reached
        for sentence in sentences:
            test_chunk = current_chunk_text + " " + sentence if current_chunk_text else sentence
            if self.estimate_tokens(test_chunk) > self.chunk_size and current_chunk_text:
                # Save the current chunk and start a new one
                sentence_chunks.append((current_chunk_text.strip(), chunk_index))
                chunk_index += 1
                current_chunk_text = sentence
            else:
                current_chunk_text = test_chunk

        # Add the final chunk if any text remains
        if current_chunk_text.strip():
            sentence_chunks.append((current_chunk_text.strip(), chunk_index))

        # Assign chunk IDs: use only section_id if one chunk, or section_id-0, section_id-1, ... if multiple
        document_chunks = []
        for i, (chunk_text, idx) in enumerate(sentence_chunks):
            if len(sentence_chunks) == 1:
                chunk_id = section["section_id"]
            else:
                chunk_id = f"{section['section_id']}-{i}"
            chunk_metadata = {
                "section_id": section["section_id"],
                "section_title": section_title,
                "created_at": datetime.now().isoformat(),
                "total_tokens": self.estimate_tokens(chunk_text),
                "source_file": os.path.basename(source_filename),
                "page_number": section.get("page_number")
            }
            document_chunks.append(DocumentChunk(
                id=chunk_id,
                text=chunk_text,
                metadata=chunk_metadata
            ))
        return document_chunks
    
    def process_file(self, file_path: str) -> ProcessedDocument:
        """Process document file (.docx or .pdf) with simplified structure extraction"""
        logger.info(f"Processing document file: {file_path}")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        file_extension = os.path.splitext(file_path)[1].lower()
        try:
            # Use appropriate partitioner based on file type
            if file_extension == '.docx':
                elements = partition_docx(
                    filename=file_path,
                    include_page_breaks=True,
                    include_metadata=True
                )
            elif file_extension == '.pdf':
                elements = partition_pdf(
                    filename=file_path,
                    include_page_breaks=True,
                    include_metadata=True,
                    strategy="hi_res"   # hi_res parses the categories of the content better (i.e. title, list, text, etc.)
                )
            else:
                raise ValueError(f"Unsupported file type: {file_extension}. Supported types: .docx, .pdf")
            logger.info(f"Extracted {len(elements)} elements from document")
            # Pass file_path to extract_sections for filename-based section_id
            sections = self.extract_sections(elements, file_path)
            logger.info(f"Identified {len(sections)} sections (sections with no content are removed)")
            
            # Create chunks
            all_chunks = []
            for section in sections:
                section_chunks = self.create_chunks(section, file_path)
                all_chunks.extend(section_chunks)
            logger.info(f"Created {len(all_chunks)} chunks")
            
            # Build document metadata
            document_metadata = {
                "filename": os.path.basename(file_path),
                "file_type": file_extension,
                "total_sections": len(sections),
                "total_chunks": len(all_chunks),
                "processing_date": datetime.now().isoformat(),
                "chunk_size": self.chunk_size
            }
            return ProcessedDocument(
                sections=sections,
                total_chunks=len(all_chunks),
                metadata=document_metadata
            )
        except Exception as e:
            logger.error(f"Error processing document file: {e}")
            raise
    
    def get_all_chunks(self, processed_doc: ProcessedDocument, source_filename: str) -> List[DocumentChunk]:
        """Extract all chunks from processed document"""
        all_chunks = []
        
        for section in processed_doc.sections:
            section_chunks = self.create_chunks(section, source_filename)
            all_chunks.extend(section_chunks)
        
        return all_chunks

def process_document(file_path: str, chunk_size: int = 1000) -> ProcessedDocument:
    """Convenience function to process a document file"""
    processor = UniversalDocumentProcessor(chunk_size=chunk_size)
    return processor.process_file(file_path)

def main():
    """Test the universal document processor with different file types"""
    # Test files
    test_files = [
        "/Users/daniel/Documents/javascript/Next_portfolio/docs/daniel_background_20250722.docx",
        "/Users/daniel/Documents/javascript/Next_portfolio/docs/Daniel_Wong_Resume.pdf",
        "/Users/daniel/Documents/javascript/Next_portfolio/docs/Daniel Wong - Cover Letter.docx"
    ]
    
    processor = UniversalDocumentProcessor(chunk_size=1000)
    
    for file_path in test_files:
        if not os.path.exists(file_path):
            print(f"⚠️ File not found: {file_path}")
            continue
            
        try:
            print(f"\n{'='*60}")
            print(f"Processing: {os.path.basename(file_path)}")
            print(f"{'='*60}")
            
            # Process document
            processed_doc = processor.process_file(file_path)
            
            # Get chunks
            chunks = processor.get_all_chunks(processed_doc, file_path)
            
            # Display results
            print(f"\n=== Processing Results ===")
            print(f"File type: {processed_doc.metadata['file_type']}")
            print(f"Total sections: {processed_doc.metadata['total_sections']}")
            print(f"Total chunks: {len(chunks)}")
            
            # Show sample chunks
            print(f"\n=== Sample Chunks ===")
            for i, chunk in enumerate(chunks[:10]):
                print(f"\nChunk {i+1}:")
                print(f"ID: {chunk.id}")
                print(f"Section: {chunk.metadata.get('section_title', 'N/A')}")
                print(f"Tokens: {chunk.metadata.get('total_tokens', 'N/A')}")
                if chunk.metadata.get('page_number'):
                    print(f"Page: {chunk.metadata.get('page_number')}")
                print(f"Full text: {chunk.text}")
                
            # Show section structure
            print(f"\n=== Section Structure ===")
            for section in processed_doc.sections[:5]:  # Limit to first 5 sections
                content_count = len(section.get('content', []))
                print(f"- {section['title']}: {content_count} content items")
                if section.get('page_number'):
                    print(f"  (Page {section['page_number']})")
        
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
            
    print(f"\n{'='*60}")
    print("✅ Universal document processor test completed!")

if __name__ == "__main__":
    main()