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
from document_processor import (
    UniversalDocumentProcessor, 
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
        index_name: str = "portfolio-knowledge-v2",
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
        self.document_processor = UniversalDocumentProcessor(
            chunk_size=1000
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
        """Prepare document chunks for Pinecone upsert with metadata aligned to document_processor.py schema."""
        vectors = []

        for chunk in chunks:
            # Metadata schema now matches document_processor.py output
            pinecone_metadata = {
                "text": chunk.text[:40000],  # Pinecone 40KB text limit
                "section_id": chunk.metadata.get("section_id"),  # Section group identifier
                "section_title": chunk.metadata.get("section_title"),
                "created_at": chunk.metadata.get("created_at"),
                "total_tokens": chunk.metadata.get("total_tokens", 0),
                "source_file": chunk.metadata.get("source_file", "unknown"),
                "page_number": chunk.metadata.get("page_number")
            }
            # Remove None values to keep metadata clean
            pinecone_metadata = {
                k: v for k, v in pinecone_metadata.items()
                if v is not None and v != ""
            }
            # 'id' is unique per chunk, 'section_id' groups chunks from the same section
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
            # Process document with universal processor
            processed_doc = self.document_processor.process_file(file_path)
            
            # Extract all chunks
            chunks = self.document_processor.get_all_chunks(processed_doc, file_path)
            
            logger.info(f"Processed {len(chunks)} chunks from {len(processed_doc.sections)} sections")
            
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
                "total_sections": processed_doc.total_chunks,
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
    
    def search(self, query_text: str, top_k: int = 5, filter_dict: dict = None) -> list:
        """Semantic search using Pinecone's integrated embedding, with optional metadata filtering."""
        try:
            from pinecone import SearchQuery
            search_query = SearchQuery(
                inputs={"text": query_text},
                top_k=top_k,
                filter=filter_dict if filter_dict else None
            )
            response = self.index.search(
                namespace=self.namespace,
                query=search_query
            )
            results = []
            response_dict = response.to_dict()
            if response_dict and 'result' in response_dict and 'hits' in response_dict['result']:
                hits = response_dict['result']['hits']
                for hit in hits:
                    fields = hit.get('fields', {})
                    result = {
                        "id": hit.get("_id", ""),
                        "score": hit.get("_score", 0.0),
                        "text": fields.get("text", ""),
                        "metadata": {k: v for k, v in fields.items() if k != "text"}
                    }
                    results.append(result)
            logger.info(f"Search results: {results}")
            return results
        except Exception as e:
            logger.error(f"Error searching index: {e}")
            raise
    
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

def main():
    """Main deployment and testing function"""
    
    docx_paths = [
        "/Users/daniel/Documents/javascript/Next_portfolio/docs/Background_20250722.docx",
        "/Users/daniel/Documents/javascript/Next_portfolio/docs/Resume.pdf",
        "/Users/daniel/Documents/javascript/Next_portfolio/docs/Cover_Letter.docx"
    ]
    
    # Check if all files exist before proceeding
    missing_files = [path for path in docx_paths if not os.path.exists(path)]
    if missing_files:
        for missing in missing_files:
            logger.error(f"Document file not found: {missing}")
        return
    
    try:
        # Initialize deployment system
        logger.info("Initializing Pinecone deployment system...")
        deployment = EnhancedPineconeDeployment()
        
        # Deploy document
        logger.info("Deploying document with hierarchical structure...")
        results = []
        for file_path in docx_paths:
            result = deployment.deploy_document(file_path)
            results.append(result)
        
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
                "filter": {"source_file": {"$eq": "Resume.pdf"}}
            },
            {
                "query": "Tell me about Daniel's recent work experience",
                "filter": {"source_file": {"$eq": "Resume.pdf"}}
            },
            {
                "query": "What projects has Daniel worked on?",
                "filter": {"source_file": {"$eq": "Background_20250722.docx"}}
            }
        ]
        
        print(f"\n=== Testing Semantic Search with and without Filters ===")
        for i, test in enumerate(test_queries, 1):
            print(f"\nTest {i}: {test['query']}")
            if 'filter' in test and test['filter']:
                print(f"Filter: {json.dumps(test['filter'])}")
            else:
                print("Filter: None")
            try:
                context_info = deployment.search(
                    query_text=test['query'],
                    top_k=10,
                    filter_dict=test.get('filter')
                )
                print(f"Found {len(context_info)} relevant matches")
                if context_info:
                    best_match = context_info[0]
                    print(f"Best match preview: {best_match['text'][:200]}...")
                    print(f"Source file: {best_match['metadata'].get('source_file', 'N/A')}")
            except Exception as e:
                print(f"Error in test query: {e}")
        
        logger.info("Deployment and testing completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in main: {e}")
        raise

if __name__ == "__main__":
    main()