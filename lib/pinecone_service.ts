/**
 * Pinecone Service for Hierarchical Document Search
 * Uses official Pinecone JavaScript client with integrated embeddings
 */

import { Pinecone } from '@pinecone-database/pinecone';

interface PineconeMetadata {
  section_id: string;
  section_title: string;
  content_type: string;
  hierarchy_level: number;
  chunk_index: number;
  parent_section: string;
  total_tokens: number;
  document_type: string;
  created_at: string;
  source_file: string;
  page_number?: number;
}

interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: PineconeMetadata;
}

interface ContextualResponse {
  context: string;
  sources: string[];
  totalTokens: number;
  sectionsUsed: string[];
  hasRelevantInfo: boolean;
}

interface SuggestedQuestion {
  question: string;
  category: string;
  filter?: Record<string, any>;
}

export class PineconeService {
  private pc: Pinecone;
  private indexName: string;
  private namespace: string;

  constructor(
    apiKey: string = process.env.PINECONE_API_KEY || '',
    indexName: string = 'portfolio-knowledge-integrated',
    namespace: string = 'portfolio-hierarchy'
  ) {
    this.indexName = indexName;
    this.namespace = namespace;
    
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is required');
    }

    // Initialize Pinecone client with API key
    this.pc = new Pinecone({
      apiKey: apiKey
    });
  }

  /**
   * Get the Pinecone index instance
   */
  private getIndex() {
    return this.pc.index(this.indexName);
  }

  /**
   * Real Pinecone search using integrated embeddings via official JS client
   */
  async searchHierarchical(
    query: string,
    options: {
      topK?: number;
      filter?: Record<string, any>;
      minScore?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const { topK = 5, filter, minScore = 0.1 } = options;
    
    try {
      const index = this.getIndex();
      
      // Use the correct namespace method approach
      const nsIndex = this.namespace ? index.namespace(this.namespace) : index;
      
      const searchPayload = {
        query: {
          topK: topK,
          inputs: { text: query },
          ...(filter && { filter })
        },
        // Only fetch the fields we actually need to reduce bandwidth and improve performance
        fields: [
          'text',
          'section_id', 
          'section_title',
          'content_type',
          'hierarchy_level',
          'chunk_index',
          'parent_section',
          'total_tokens',
          'document_type',
          'created_at',
          'source_file',
          'page_number'
        ]
      };
      
      // Use official Pinecone client searchRecords method for integrated embeddings
      const searchResults = await nsIndex.searchRecords(searchPayload);
      
      // Parse response using the official format from the client
      const hits = searchResults.result?.hits || [];
      
      // Convert to our SearchResult format using correct field names
      const results: SearchResult[] = hits
        .filter((hit: any) => (hit._score || hit.score) >= minScore)
        .map((hit: any) => ({
          id: hit._id || hit.id,
          score: hit._score || hit.score,
          text: hit.fields?.text || '',
          metadata: {
            section_id: hit.fields?.section_id || '',
            section_title: hit.fields?.section_title || '',
            content_type: hit.fields?.content_type || 'text',
            hierarchy_level: hit.fields?.hierarchy_level || 1,
            chunk_index: hit.fields?.chunk_index || 0,
            parent_section: hit.fields?.parent_section || '',
            total_tokens: hit.fields?.total_tokens || 0,
            document_type: hit.fields?.document_type || 'general',
            created_at: hit.fields?.created_at || '',
            source_file: hit.fields?.source_file || '',
            page_number: hit.fields?.page_number
          }
        }));
      
      console.log(`Found ${results.length} results with scores >= ${minScore}`);
      return results;
      
    } catch (error) {
      console.error('Error searching Pinecone:', error);
      throw new Error(`Pinecone search failed: ${error}`);
    }
  }

  /**
   * Get contextual information for chatbot responses
   */
  async getContextForQuestion(query: string): Promise<ContextualResponse> {
    try {
      const results = await this.searchHierarchical(query, {
        topK: 5,
        minScore: 0.1
      });
      
      if (results.length === 0) {
        return {
          context: '',
          sources: [],
          totalTokens: 0,
          sectionsUsed: [],
          hasRelevantInfo: false
        };
      }
      
      // Assemble context from results
      const contextParts: string[] = [];
      const sources: string[] = [];
      const sectionsUsed: string[] = [];
      let totalTokens = 0;
      
      for (const result of results) {
        contextParts.push(`[${result.metadata.section_title}] ${result.text}`);
        sources.push(result.metadata.section_title);
        sectionsUsed.push(result.metadata.section_id);
        totalTokens += result.metadata.total_tokens || 0;
      }
      
      return {
        context: contextParts.join('\n\n'),
        sources: Array.from(new Set(sources)), // Remove duplicates
        sectionsUsed: Array.from(new Set(sectionsUsed)), // Remove duplicates
        totalTokens,
        hasRelevantInfo: true
      };
      
    } catch (error) {
      console.error('Error getting context:', error);
      return {
        context: '',
        sources: [],
        totalTokens: 0,
        sectionsUsed: [],
        hasRelevantInfo: false
      };
    }
  }

  /**
   * Get suggested questions for better UX
   */
  getSuggestedQuestions(): SuggestedQuestion[] {
    return [
      {
        question: "What are Daniel's main technical skills?",
        category: "Skills",
        filter: { document_type: { $eq: "skills" } }
      },
      {
        question: "Tell me about Daniel's work experience",
        category: "Experience", 
        filter: { document_type: { $eq: "experience" } }
      },
      {
        question: "What projects has Daniel worked on?",
        category: "Projects",
        filter: { document_type: { $eq: "projects" } }
      },
      {
        question: "What is Daniel's educational background?",
        category: "Education",
        filter: { content_type: { $eq: "education" } }
      },
      {
        question: "How can I contact Daniel?",
        category: "Contact",
        filter: { content_type: { $eq: "contact" } }
      }
    ];
  }

  /**
   * Health check for the service
   */
  async healthCheck(): Promise<{ status: string; indexName: string; namespace: string }> {
    try {
      // Test connection by performing a simple search
      const index = this.getIndex();
      const nsIndex = this.namespace ? index.namespace(this.namespace) : index;
      
      // Simple test search to verify the connection works
      await nsIndex.searchRecords({
        query: {
          topK: 1,
          inputs: { text: 'test' }
        },
        fields: ['text'] // Only fetch minimal field for health check
      });
      
      console.log('Health check passed');
      return {
        status: 'healthy',
        indexName: this.indexName,
        namespace: this.namespace
      };
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error(`Pinecone service unhealthy: ${error}`);
    }
  }
}

// Singleton instance for the application
let pineconeService: PineconeService | null = null;

export const getPineconeService = (): PineconeService => {
  if (!pineconeService) {
    pineconeService = new PineconeService();
  }
  return pineconeService;
};

export default PineconeService;