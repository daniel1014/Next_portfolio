#!/usr/bin/env python3
"""
Enhanced Pinecone Deployment Script
Deploys hierarchically processed .docx documents to Pinecone with rich metadata filtering
"""

import os
import sys
import logging
import json
from typing import List, Dict, Any, Optional
from datetime import datetime

# Add the current directory to the path to import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Third-party imports
from pinecone import Pinecone
from dotenv import load_dotenv

# Local imports
from enhanced_document_processor import (
    EnhancedDocumentProcessor, 
    DocumentChunk
)

# Load environment variables from project root
# This script is in python_env/, so we need to go up one level to find .env.local
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(project_root, '.env.local')
print(f"Loading environment from: {env_path}")
print(f"Environment file exists: {os.path.exists(env_path)}")
load_dotenv(env_path)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class EnhancedPineconeDeployment:
    """Deploy hierarchical documents to Pinecone with metadata-rich indexing"""
    
    def __init__(
        self,
        api_key: str = None,
        index_name: str = "portfolio-knowledge-integrated",
        embedding_model: str = "llama-text-embed-v2",
        namespace: str = "portfolio-hierarchy",
        cloud: str = "aws",
        region: str = "us-east-1"
    ):
        """Initialize Pinecone deployment with enhanced configuration"""
        self.api_key = api_key or os.getenv("PINECONE_API_KEY")
        self.index_name = index_name
        self.embedding_model = embedding_model
        self.namespace = namespace
        self.cloud = cloud
        self.region = region
        
        if not self.api_key or self.api_key == "your-pinecone-api-key-here":
            raise ValueError(
                "PINECONE_API_KEY not configured. Please add your Pinecone API key to .env.local"
            )
        
        # Initialize Pinecone client
        self.pc = Pinecone(api_key=self.api_key)
        self.index = None
        
        # Initialize document processor
        self.document_processor = EnhancedDocumentProcessor(
            chunk_size=1000,
            overlap=200,
            preserve_hierarchy=True
        )
        
        self._initialize_index()
    
    def _initialize_index(self):
        """Initialize or create Pinecone index with enhanced configuration"""
        try:
            # Check if index exists
            existing_indexes = self.pc.list_indexes().names()
            
            if self.index_name not in existing_indexes:
                logger.info(f"Creating new index with integrated embeddings: {self.index_name}")
                
                # Create index with integrated embedding model for automatic vector generation
                self.pc.create_index_for_model(
                    name=self.index_name,
                    cloud=self.cloud,
                    region=self.region,
                    embed={
                        "model": self.embedding_model,
                        "field_map": {"text": "text"}  # Map 'text' field for embedding
                    }
                )
                
                # Wait for index to be ready
                import time
                time.sleep(10)
                logger.info("Index created with integrated embedding support")
            else:
                logger.info(f"Using existing index: {self.index_name}")
            
            # Connect to index
            self.index = self.pc.Index(self.index_name)
            logger.info(f"Connected to index: {self.index_name}")
            
        except Exception as e:
            logger.error(f"Error initializing index: {e}")
            raise
    
    def prepare_vectors_for_upsert(self, chunks: List[DocumentChunk]) -> List[Dict[str, Any]]:
        """Prepare document chunks for Pinecone upsert with metadata"""
        vectors = []
        
        for chunk in chunks:
            # Optimized metadata structure - removed redundant fields
            pinecone_metadata = {
                "text": chunk.text[:40000],  # Pinecone 40KB text limit
                "section_id": chunk.metadata.get("section_id"),
                "section_title": chunk.metadata.get("section_title"),
                "content_type": chunk.metadata.get("section_type", "text"),  # Unified type field
                "hierarchy_level": chunk.metadata.get("hierarchy_level", 1),
                "chunk_index": chunk.metadata.get("chunk_index", 0),
                "parent_section": chunk.metadata.get("parent_section", ""),
                "total_tokens": chunk.metadata.get("total_tokens", 0),
                "document_type": chunk.metadata.get("document_type", "general"),
                "created_at": chunk.metadata.get("created_at"),
                "source_file": chunk.metadata.get("source_file", "unknown"),
                "page_number": chunk.metadata.get("page_number")
            }
            
            # Remove None values to keep metadata clean
            pinecone_metadata = {
                k: v for k, v in pinecone_metadata.items() 
                if v is not None and v != ""
            }
            
            vector_record = {
                "id": chunk.id,
                "metadata": pinecone_metadata
            }
            
            vectors.append(vector_record)
        
        return vectors
    
    def deploy_document(self, file_path: str) -> Dict[str, Any]:
        """Deploy a document to Pinecone with hierarchical structure"""
        logger.info(f"Starting deployment of document: {file_path}")
        
        try:
            # Process document with hierarchical structure
            hierarchical_doc = self.document_processor.process_docx_file(file_path)
            
            # Extract all chunks
            chunks = self.document_processor.get_chunks_from_document(hierarchical_doc)
            
            logger.info(f"Processed {len(chunks)} chunks from {len(hierarchical_doc.sections)} sections")
            
            # Prepare vectors for upsert
            vectors = self.prepare_vectors_for_upsert(chunks)
            
            # Deploy to Pinecone in batches
            batch_size = 100
            deployed_count = 0
            
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                
                # Use Pinecone's integrated embedding API - text will be auto-embedded
                upsert_records = []
                for vector in batch:
                    upsert_records.append({
                        "_id": vector["id"],  # Required: unique identifier
                        "text": vector["metadata"]["text"],  # Text for automatic embedding
                        **{k: v for k, v in vector["metadata"].items() if k != "text"}  # Other metadata
                    })
                
                # Upsert records with automatic embedding generation
                self.index.upsert_records(
                    namespace=self.namespace,
                    records=upsert_records
                )
                
                deployed_count += len(batch)
                logger.info(f"Deployed batch {i//batch_size + 1}: {deployed_count}/{len(vectors)} vectors")
            
            # Get index stats
            stats = self.get_index_stats()
            
            deployment_result = {
                "status": "success",
                "file_path": file_path,
                "total_sections": hierarchical_doc.total_chunks,
                "total_chunks": len(chunks),
                "deployed_vectors": deployed_count,
                "index_stats": stats,
                "deployment_time": datetime.now().isoformat(),
                "namespace": self.namespace,
                "embedding_model": self.embedding_model
            }
            
            logger.info("Document deployment completed successfully")
            return deployment_result
            
        except Exception as e:
            logger.error(f"Error deploying document: {e}")
            raise
    
    def search_hierarchical(
        self,
        query_text: str,
        top_k: int = 5,
        filter_dict: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Search with hierarchical filtering support using text matching"""
        try:
            # Import required classes for search
            from pinecone import SearchQuery
            
            # Create search query with integrated embedding
            search_query = SearchQuery(
                inputs={"text": query_text},  # Text will be auto-embedded
                top_k=top_k,
                filter=filter_dict if filter_dict else None
            )
            
            # Search using integrated embedding - real vector similarity
            response = self.index.search(
                namespace=self.namespace,
                query=search_query
            )
            
            # Parse results with actual semantic similarity scores
            results = []
            
            # Convert response to dict for easy access
            response_dict = response.to_dict()
            
            # Handle the SearchRecordsResponse format: response.result.hits
            if response_dict and 'result' in response_dict and 'hits' in response_dict['result']:
                hits = response_dict['result']['hits']
                
                for hit in hits:
                    # Extract data from the hit structure: {_id, _score, fields: {...}}
                    fields = hit.get('fields', {})
                    
                    result = {
                        "id": hit.get("_id", ""),
                        "score": hit.get("_score", 0.0),  # Real vector similarity score (0-1)
                        "text": fields.get("text", ""),  # Text field is in fields
                        "metadata": {k: v for k, v in fields.items() if k != "text"}  # Other fields as metadata
                    }
                    results.append(result)
            logger.info(f"Search results: {results}")
            return results
            
        except Exception as e:
            logger.error(f"Error searching index: {e}")
            raise
    
    def get_contextual_information(
        self,
        query: str,
        max_tokens: int = 4000,
        min_score: float = 0.7,
        filter_by_section: Optional[str] = None,
        filter_by_document_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get contextual information with hierarchical filtering"""
        
        # Build filter
        filters = {}
        if filter_by_section:
            filters["section_title"] = {"$eq": filter_by_section}
        if filter_by_document_type:
            filters["document_type"] = {"$eq": filter_by_document_type}
        
        # Combine filters with AND if multiple
        filter_dict = None
        if filters:
            if len(filters) > 1:
                filter_dict = {"$and": [
                    {k: v} for k, v in filters.items()
                ]}
            else:
                filter_dict = filters
        
        # Search for relevant chunks
        results = self.search_hierarchical(
            query_text=query,
            top_k=10,
            filter_dict=filter_dict
        )
        
        # Filter by score and assemble context
        relevant_chunks = [r for r in results if r["score"] >= min_score]
        
        context_parts = []
        current_tokens = 0
        sections_used = set()
        
        for result in relevant_chunks:
            text_tokens = len(result["text"]) // 4  # Rough token estimate
            
            if current_tokens + text_tokens <= max_tokens:
                section_title = result["metadata"].get("section_title", "Unknown")
                context_parts.append({
                    "text": result["text"],
                    "section": section_title,
                    "score": result["score"],
                    "metadata": result["metadata"]
                })
                sections_used.add(section_title)
                current_tokens += text_tokens
            else:
                break
        
        return {
            "context_parts": context_parts,
            "total_tokens": current_tokens,
            "sections_used": list(sections_used),
            "total_matches": len(results),
            "relevant_matches": len(relevant_chunks)
        }
    
    def get_index_stats(self) -> Dict[str, Any]:
        """Get enhanced index statistics"""
        try:
            stats = self.index.describe_index_stats()
            return {
                "total_vectors": stats.total_vector_count,
                "dimension": stats.dimension,
                "index_fullness": stats.index_fullness,
                "namespaces": dict(stats.namespaces) if stats.namespaces else {}
            }
        except Exception as e:
            logger.error(f"Error getting index stats: {e}")
            return {}
    
    def delete_namespace(self, namespace: str = None):
        """Delete a specific namespace"""
        target_namespace = namespace or self.namespace
        try:
            self.index.delete(delete_all=True, namespace=target_namespace)
            logger.info(f"Deleted namespace: {target_namespace}")
        except Exception as e:
            logger.error(f"Error deleting namespace: {e}")
            raise
    
    def list_example_filters(self) -> Dict[str, Dict[str, Any]]:
        """Return example filters for different use cases"""
        return {
            "experience_only": {"document_type": {"$eq": "experience"}},
            "skills_and_technical": {"document_type": {"$in": ["skills", "projects"]}},
            "section_headers": {"section_type": {"$eq": "section_header"}},
            "project_content": {"has_projects": {"$eq": True}},
            "high_level_content": {"hierarchy_level": {"$lte": 2}},
            "recent_content": {
                "$and": [
                    {"document_type": {"$eq": "experience"}},
                    {"hierarchy_level": {"$lte": 3}}
                ]
            }
        }

def main():
    """Main deployment and testing function"""
    
    # File path
    docx_path = "/Users/daniel/Documents/javascript/Next_portfolio/docs/daniel_background_20250722.docx"
    
    # Check if file exists
    if not os.path.exists(docx_path):
        logger.error(f"Document file not found: {docx_path}")
        return
    
    try:
        # Initialize deployment system
        logger.info("Initializing Pinecone deployment system...")
        deployment = EnhancedPineconeDeployment()
        
        # Deploy document
        logger.info("Deploying document with hierarchical structure...")
        result = deployment.deploy_document(docx_path)
        
        # Display results
        print(f"\n=== Deployment Results ===")
        print(f"Status: {result['status']}")
        print(f"File: {result['file_path']}")
        print(f"Total sections: {result['total_sections']}")
        print(f"Total chunks: {result['total_chunks']}")
        print(f"Deployed vectors: {result['deployed_vectors']}")
        print(f"Namespace: {result['namespace']}")
        print(f"Embedding model: {result['embedding_model']}")
        
        # Show index stats
        print(f"\n=== Index Statistics ===")
        stats = result['index_stats']
        print(f"Total vectors: {stats.get('total_vectors', 'N/A')}")
        print(f"Dimension: {stats.get('dimension', 'N/A')}")
        print(f"Index fullness: {stats.get('index_fullness', 'N/A')}")
        
        # Test queries with different filters
        test_queries = [
            {
                "query": "What are Daniel's main technical skills?",
                "filter": {"document_type": {"$eq": "skills"}}
            },
            {
                "query": "Tell me about Daniel's recent work experience",
                "filter": {"document_type": {"$eq": "experience"}}
            },
            {
                "query": "What projects has Daniel worked on?",
                "filter": {"has_projects": {"$eq": True}}
            }
        ]
        
        print(f"\n=== Testing Hierarchical Search ===")
        for i, test in enumerate(test_queries, 1):
            print(f"\nTest {i}: {test['query']}")
            print(f"Filter: {test['filter']}")
            
            try:
                context_info = deployment.get_contextual_information(
                    query=test['query'],
                    filter_by_document_type=test['filter']['document_type']['$eq'] if 'document_type' in test['filter'] else None
                )
                
                print(f"Found {context_info['relevant_matches']} relevant matches")
                print(f"Sections used: {', '.join(context_info['sections_used'])}")
                
                if context_info['context_parts']:
                    best_match = context_info['context_parts'][0]
                    print(f"Best match preview: {best_match['text'][:200]}...")
                
            except Exception as e:
                print(f"Error in test query: {e}")
        
        # Show example filters
        print(f"\n=== Available Filter Examples ===")
        examples = deployment.list_example_filters()
        for name, filter_dict in examples.items():
            print(f"{name}: {json.dumps(filter_dict, indent=2)}")
        
        logger.info("Deployment and testing completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in main: {e}")
        raise

if __name__ == "__main__":
    main()