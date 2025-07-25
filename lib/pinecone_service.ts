/**
 * Pinecone Service for Hierarchical Document Search
 * Uses official Pinecone JavaScript client with integrated embeddings
 */

import { Pinecone } from '@pinecone-database/pinecone';

interface PineconeMetadata {
  section_title: string;
  source_file: string;
}

interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: PineconeMetadata;
}

interface UnifiedContextualResponse {
  context: string;
  results: SearchResult[];
  sources: string[];
  totalTokens: number;
  hasRelevantInfo: boolean;
}

export class PineconeService {
  private pc: Pinecone;
  private indexName: string;
  private namespace: string;

  constructor(
    apiKey: string = process.env.PINECONE_API_KEY || '',
    indexName: string = 'portfolio-knowledge-v2',
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
   * Pinecone search using integrated embeddings via official JS client.
   * Returns both raw results and an assembled context string for LLM use.
   * Uses rerank with model 'bge-reranker-v2-m3' and topN=5 by default.
   */
  async search(
    query: string,
    options: {
      topK?: number;
      filter?: Record<string, any>;
      minScore?: number;
      rerankTopN?: number;
    } = {}
  ): Promise<UnifiedContextualResponse> {
    const topK = options.topK ?? 10;
    const minScore = options.minScore ?? 0.1;
    const rerankTopN = options.rerankTopN ?? 10;
    const filter = options.filter;
    try {
      const index = this.getIndex();
      const nsIndex = this.namespace ? index.namespace(this.namespace) : index;
      const searchPayload = {
        query: {
          topK: topK,
          inputs: { text: query },
          ...(filter && { filter })
        },
        fields: [
          'text',
          'section_title',
          'source_file'
        ],
        // Use rerank to improve result relevance
        // rerank: {
        //   model: 'bge-reranker-v2-m3',
        //   rankFields: ['text'],
        //   topN: rerankTopN
        // }
      };
      
      // Use official Pinecone client searchRecords method for integrated embeddings
      const searchResults = await nsIndex.searchRecords(searchPayload);
      const hits = searchResults.result?.hits || [];
      
      // Convert to our SearchResult format using correct field names
      const results: SearchResult[] = hits
        .filter((hit: any) => (hit._score || hit.score) >= minScore)
        .map((hit: any) => ({
          id: hit._id || hit.id,
          score: hit._score || hit.score,
          text: hit.fields?.text || '',
          metadata: {
            section_title: hit.fields?.section_title || '',
            source_file: hit.fields?.source_file || ''
          }
        }));
      // Assemble context string for LLM
      const contextParts: string[] = [];
      const sources: string[] = [];
      let totalTokens = 0;
      for (const result of results) {
        contextParts.push(`[${result.metadata.section_title}] ${result.text}`);
        sources.push(result.metadata.section_title);
        totalTokens += result.text.split(/\s+/).length;
      }
      const unifiedResponse: UnifiedContextualResponse = {
        context: contextParts.join('\n\n'),
        results,
        sources: Array.from(new Set(sources)),
        totalTokens,
        hasRelevantInfo: results.length > 0
      };
      return unifiedResponse;
    } catch (error) {
      console.error('Error searching Pinecone:', error);
      return {
        context: '',
        results: [],
        sources: [],
        totalTokens: 0,
        hasRelevantInfo: false
      };
    }
  }

  /**
   * Get contextual information for chatbot responses (now just calls search)
   */
  async getContextForQuestion(query: string): Promise<UnifiedContextualResponse> {
    return this.search(query);
  }

  /**
   * Get suggested questions for better UX
   */
  getSuggestedQuestions(): { question: string }[] {
    return [
      { question: "What are Daniel's main technical skills?" },
      { question: "Tell me about Daniel's work experience" },
      { question: "What projects has Daniel worked on?" },
      { question: "What is Daniel's educational background?" },
      { question: "How can I contact Daniel?" }
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