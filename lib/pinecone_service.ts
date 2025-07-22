/**
 * Pinecone Service for Hierarchical Document Search
 * Provides metadata-driven vector search for the portfolio chatbot
 * Integrates with the enhanced Pinecone deployment created by Python scripts
 */

interface PineconeMetadata {
  // Optimized metadata structure (removed redundant fields)
  section_id: string;
  section_title: string;
  content_type: string;  // Unified type field (was section_type)
  hierarchy_level: number;
  chunk_index: number;
  parent_section: string;
  total_tokens: number;
  document_type: string;
  created_at: string;
  source_file: string;
  page_number?: number;
}

interface PineconeMatch {
  id: string;
  score: number;
  metadata: PineconeMetadata;
}

interface PineconeQueryResponse {
  matches: PineconeMatch[];
  namespace: string;
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
  private baseUrl: string;
  private apiKey: string;
  private indexName: string;
  private namespace: string;

  constructor(
    apiKey: string = process.env.PINECONE_API_KEY || '',
    indexName: string = 'portfolio-knowledge-integrated',  // Updated to new integrated index
    namespace: string = 'portfolio-hierarchy'
  ) {
    this.apiKey = apiKey;
    this.indexName = indexName;
    this.namespace = namespace;
    
    if (!this.apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is required');
    }

    // Pinecone REST API base URL (will need to be updated with actual host)
    this.baseUrl = `https://${indexName}-${this.getEnvironmentSuffix()}.svc.${this.getRegion()}.pinecone.io`;
  }

  /**
   * Get Pinecone index host URL
   * For serverless indexes, we need to get this dynamically
   */
  private async getIndexHost(): Promise<string> {
    try {
      // First, get the index description to find the host
      const response = await fetch(`https://api.pinecone.io/indexes/${this.indexName}`, {
        method: 'GET',
        headers: {
          'Api-Key': this.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get index info: ${response.status}`);
      }
      
      const indexInfo = await response.json();
      console.log('Pinecone index info:', indexInfo);
      return indexInfo.host;
      
    } catch (error) {
      // Fallback to constructed URL (less reliable but works for some cases)
      console.warn('Failed to get dynamic host, using fallback:', error);
      return `https://${this.indexName}-${this.getEnvironmentSuffix()}.svc.${this.getRegion()}.pinecone.io`;
    }
  }

  private getEnvironmentSuffix(): string {
    // This would typically be derived from your Pinecone environment
    // For now, using a placeholder - you'd need to get this from Pinecone console
    return 'gcp-starter';
  }

  private getRegion(): string {
    return 'us-central1-gcp'; // Default region, should be configurable
  }

  /**
   * Simple text similarity scoring since we're not using actual embeddings
   */
  private calculateTextSimilarity(query: string, text: string): number {
    const queryWords = new Set(query.toLowerCase().split(/\s+/));
    const textWords = new Set(text.toLowerCase().split(/\s+/));
    
    if (queryWords.size === 0 || textWords.size === 0) return 0;
    
    const queryWordsArray = Array.from(queryWords);
    const textWordsArray = Array.from(textWords);
    
    const intersection = new Set(queryWordsArray.filter(word => textWords.has(word)));
    const union = new Set([...queryWordsArray, ...textWordsArray]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  /**
   * Enhanced text matching with keyword scoring
   */
  private calculateEnhancedScore(query: string, result: SearchResult): number {
    const baseScore = this.calculateTextSimilarity(query, result.text);
    let enhancedScore = baseScore;
    
    const queryLower = query.toLowerCase();
    const textLower = result.text.toLowerCase();
    const sectionTitle = result.metadata.section_title.toLowerCase();
    
    // Boost score based on section relevance
    if (sectionTitle.includes(queryLower) || queryLower.includes(sectionTitle)) {
      enhancedScore += 0.3;
    }
    
    // Boost score for exact keyword matches
    const queryWords = queryLower.split(/\s+/);
    for (const word of queryWords) {
      if (word.length > 3 && textLower.includes(word)) {
        enhancedScore += 0.1;
      }
    }
    
    // Boost score for higher hierarchy levels (more important content)
    if (result.metadata.hierarchy_level <= 2) {
      enhancedScore += 0.2;
    }
    
    // Boost score for section headers
    if (result.metadata.content_type === 'section_header') {
      enhancedScore += 0.15;
    }
    
    return Math.min(enhancedScore, 1.0); // Cap at 1.0
  }

  /**
   * Real Pinecone search using integrated embeddings via official JS SDK approach
   * Connects to the portfolio-knowledge-integrated index
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
      // Get Pinecone index host URL
      const indexHost = await this.getIndexHost();
      
      // Use the official searchRecords endpoint for integrated embeddings
      const searchUrl = indexHost.startsWith('http') 
        ? `${indexHost}/searchRecords` 
        : `https://${indexHost}/searchRecords`;
      
      console.log('Pinecone searchRecords URL:', searchUrl);
      console.log('Index host from API:', indexHost);
      
      // Use the official JS SDK format for searchRecords
      const searchPayload = {
        query: {
          topK: topK,
          inputs: { text: query },
          ...(filter && { filter })
        },
        ...(this.namespace && { namespace: this.namespace })
      };
      
      console.log('Search payload:', JSON.stringify(searchPayload, null, 2));
      
      // Make actual API call to Pinecone using searchRecords endpoint
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pinecone API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText,
          url: searchUrl,
          payload: searchPayload
        });
        throw new Error(`Pinecone API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Pinecone searchRecords response:', JSON.stringify(data, null, 2));
      
      // Parse response using the official format: { result: { hits: [...] } }
      const hits = data.result?.hits || [];
      
      // Convert to our SearchResult format following the official example
      const results: SearchResult[] = hits
        .filter((hit: any) => hit.score >= minScore)
        .map((hit: any) => ({
          id: hit.id,
          score: hit.score,
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
   * Generate mock results for demonstration
   * In production, this would be replaced by actual Pinecone query results
   */
  private generateMockResults(query: string, filter?: Record<string, any>): SearchResult[] {
    const queryLower = query.toLowerCase();
    
    // Mock data based on the processed document structure
    const mockData: SearchResult[] = [
      {
        id: 'section_0_chunk_0_a1b2c3d4',
        text: 'Full-Stack Developer specializing in AI-driven applications with a unique journey from data analytics to software engineering. Expert in building scalable web platforms using React, Next.js, TypeScript, and Python, with deep experience integrating Large Language Models, vector databases, and cloud-native architectures.',
        score: 0,
        metadata: {
          text: 'Full-Stack Developer specializing in AI-driven applications...',
          section_id: 'section_0',
          section_title: 'Professional Summary',
          section_type: 'section_header',
          hierarchy_level: 2,
          chunk_index: 0,
          section_context: 'Professional Summary',
          parent_section: '',
          total_tokens: 89,
          document_type: 'summary',
          created_at: '2025-01-22T16:15:00Z',
          source_file: 'daniel_background_20250722.docx',
          has_projects: false,
          project_count: 0,
          has_subsections: false,
          subsection_count: 0
        }
      },
      {
        id: 'section_1_chunk_0_e5f6g7h8',
        text: 'Programming Languages: Python, TypeScript, JavaScript, SQL, HTML5, CSS. Frontend Technologies: React, Next.js, React Native, Expo, Material-UI, TailwindCSS, Streamlit, Dash, Recoil, Redux. Backend Technologies: FastAPI, Node.js, Express, AsyncIO, Aiohttp, RESTful APIs, GraphQL, WebSockets.',
        score: 0,
        metadata: {
          text: 'Programming Languages: Python, TypeScript, JavaScript, SQL...',
          section_id: 'section_1',
          section_title: 'Technical Skills Summary',
          section_type: 'section_header',
          hierarchy_level: 2,
          chunk_index: 0,
          section_context: 'Technical Skills Summary',
          parent_section: '',
          total_tokens: 67,
          document_type: 'skills',
          created_at: '2025-01-22T16:15:00Z',
          source_file: 'daniel_background_20250722.docx',
          has_projects: false,
          project_count: 0,
          has_subsections: false,
          subsection_count: 0
        }
      },
      {
        id: 'section_2_chunk_0_i9j0k1l2',
        text: 'Graduate Data Analytics Consultant, AECOM (Jan 2023 – Oct 2024): Discovered passion for building software while developing internal tools for Monte Carlo simulations in large infrastructure projects, leading to full-scale AI applications and a transition to software development.',
        score: 0,
        metadata: {
          text: 'Graduate Data Analytics Consultant, AECOM...',
          section_id: 'section_2',
          section_title: 'Professional Journey',
          section_type: 'section_header',
          hierarchy_level: 2,
          chunk_index: 0,
          section_context: 'Professional Journey',
          parent_section: '',
          total_tokens: 56,
          document_type: 'experience',
          created_at: '2025-01-22T16:15:00Z',
          source_file: 'daniel_background_20250722.docx',
          has_projects: false,
          project_count: 0,
          has_subsections: false,
          subsection_count: 0
        }
      },
      {
        id: 'section_3_chunk_0_m3n4o5p6',
        text: 'Planning Context Report – AI-Powered SaaS Platform at PlanningHub. AI-powered platform generating comprehensive planning reports in under 5 minutes, reducing manual research time from 20–40 hours. Processes geospatial data, planning policies, and demographic information across all UK cities.',
        score: 0,
        metadata: {
          text: 'Planning Context Report – AI-Powered SaaS Platform...',
          section_id: 'section_3',
          section_title: 'Major Project Deep Dives',
          section_type: 'section_header',
          hierarchy_level: 2,
          chunk_index: 0,
          section_context: 'Major Project Deep Dives',
          parent_section: '',
          total_tokens: 78,
          document_type: 'projects',
          created_at: '2025-01-22T16:15:00Z',
          source_file: 'daniel_background_20250722.docx',
          has_projects: true,
          project_count: 5,
          has_subsections: false,
          subsection_count: 0
        }
      },
      {
        id: 'section_4_chunk_0_q7r8s9t0',
        text: 'MSc Computing and Information Systems, Queen Mary University London (Distinction): Dissertation on time-series prediction (ARIMA, SVR). Focused on full-stack, AI/ML, distributed systems. BSc Environmental and Occupational Safety, Hong Kong Polytechnic University.',
        score: 0,
        metadata: {
          text: 'MSc Computing and Information Systems...',
          section_id: 'section_4',
          section_title: 'Education and Continuous Learning',
          section_type: 'section_header',
          hierarchy_level: 2,
          chunk_index: 0,
          section_context: 'Education and Continuous Learning',
          parent_section: '',
          total_tokens: 48,
          document_type: 'education',
          created_at: '2025-01-22T16:15:00Z',
          source_file: 'daniel_background_20250722.docx',
          has_projects: false,
          project_count: 0,
          has_subsections: false,
          subsection_count: 0
        }
      }
    ];
    
    // Apply filters if provided
    let filteredData = mockData;
    
    if (filter) {
      filteredData = mockData.filter(item => {
        return Object.entries(filter).every(([key, condition]) => {
          const value = item.metadata[key as keyof PineconeMetadata];
          
          if (typeof condition === 'object' && condition !== null) {
            if ('$eq' in condition) {
              return value === condition.$eq;
            }
            if ('$in' in condition) {
              return condition.$in.includes(value);
            }
            if ('$lte' in condition) {
              return typeof value === 'number' && value <= condition.$lte;
            }
            if ('$gte' in condition) {
              return typeof value === 'number' && value >= condition.$gte;
            }
          }
          
          return value === condition;
        });
      });
    }
    
    return filteredData;
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
      const sectionsUsed = new Set<string>();
      let totalTokens = 0;
      const maxTokens = 3000;
      
      for (const result of results) {
        if (totalTokens + result.metadata.total_tokens <= maxTokens) {
          const sectionTitle = result.metadata.section_title;
          contextParts.push(`[${sectionTitle}]\n${result.text}`);
          sources.push(`${sectionTitle} (Score: ${result.score.toFixed(2)})`);
          sectionsUsed.add(sectionTitle);
          totalTokens += result.metadata.total_tokens;
        }
      }
      
      return {
        context: contextParts.join('\n\n'),
        sources,
        totalTokens,
        sectionsUsed: Array.from(sectionsUsed),
        hasRelevantInfo: contextParts.length > 0
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
   * Get suggested questions based on available content
   */
  getSuggestedQuestions(): SuggestedQuestion[] {
    return [
      {
        question: "What are Daniel's main technical skills?",
        category: "skills",
        filter: { document_type: { $eq: "skills" } }
      },
      {
        question: "Tell me about Daniel's recent work experience",
        category: "experience",
        filter: { document_type: { $eq: "experience" } }
      },
      {
        question: "What projects has Daniel worked on?",
        category: "projects",
        filter: { has_projects: { $eq: true } }
      },
      {
        question: "What is Daniel's educational background?",
        category: "education",
        filter: { document_type: { $eq: "education" } }
      },
      {
        question: "What is Daniel's professional summary?",
        category: "summary",
        filter: { document_type: { $eq: "summary" } }
      }
    ];
  }

  /**
   * Search by document type with hierarchical filtering
   */
  async searchByDocumentType(
    query: string, 
    documentType: string,
    options: { topK?: number; minScore?: number } = {}
  ): Promise<SearchResult[]> {
    return this.searchHierarchical(query, {
      ...options,
      filter: { document_type: { $eq: documentType } }
    });
  }

  /**
   * Search by section with hierarchical filtering
   */
  async searchBySection(
    query: string,
    sectionTitle: string,
    options: { topK?: number; minScore?: number } = {}
  ): Promise<SearchResult[]> {
    return this.searchHierarchical(query, {
      ...options,
      filter: { section_title: { $eq: sectionTitle } }
    });
  }

  /**
   * Get high-level overview (section headers only)
   */
  async getDocumentOverview(): Promise<SearchResult[]> {
    return this.searchHierarchical('', {
      topK: 20,
      filter: { section_type: { $eq: 'section_header' } },
      minScore: 0
    });
  }

  /**
   * Health check for the service
   */
  async healthCheck(): Promise<{ status: string; indexName: string; namespace: string }> {
    try {
      // Test connection by getting index info (simpler than full search)
      const indexHost = await this.getIndexHost();
      console.log('Health check - got index host:', indexHost);
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