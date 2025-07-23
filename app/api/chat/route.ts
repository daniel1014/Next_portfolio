import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPineconeService } from '@/lib/pinecone_service';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: NextRequest) {
  let message = '';
  
  try {
    const requestData = await request.json();
    message = requestData.message || '';
    const conversationHistory = requestData.conversationHistory || [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get Pinecone service instance
    const pineconeService = getPineconeService();
    
    // Get context from Pinecone vector store
    const contextResponse = await pineconeService.getContextForQuestion(message);
    
    // Get raw search results for debugging
    const rawSearchResults = await pineconeService.searchHierarchical(message, {
      topK: 5,
      minScore: 0.1
    });
    
    // Mock person info since we have it in our context now
    const personInfo = {
      properties: {
        name: "Daniel Wong",
        title: "Full-Stack Developer specializing in AI-driven applications",
        location: "London, UK",
        bio: "Expert in building scalable web platforms using React, Next.js, TypeScript, and Python"
      }
    };
    
    // Build context prompt
    const contextPrompt = `
You are an AI assistant representing Daniel Wong's portfolio. Use the following information to answer questions about Daniel's background, skills, projects, and experience.

Person Information:
${personInfo ? `
Name: ${personInfo.properties.name}
Title: ${personInfo.properties.title}
Location: ${personInfo.properties.location}
Bio: ${personInfo.properties.bio}
` : ''}

Relevant Context from Vector Database:
${contextResponse.context}

Sources Used: ${contextResponse.sources.join(', ')}

Previous Conversation:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Current Question: ${message}

Instructions:
1. Answer questions about Daniel's professional background, skills, projects, and experience
2. Be conversational and friendly while remaining professional
3. If you don't have specific information, acknowledge this and suggest related topics you can help with
4. Use the vector database context to provide accurate and detailed responses
5. Don't make up information that isn't in the provided context
6. If asked about projects, mention specific technologies and details from the context
7. Reference the specific sections when providing information (e.g., "From his Technical Skills section...")

Please provide a helpful response about Daniel's portfolio:
`;

    // Generate response using Gemini
    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    const responseText = response.text();

    // Get suggested questions for better UX
    const suggestedQuestions = pineconeService.getSuggestedQuestions().map(q => q.question);

    return NextResponse.json({
      response: responseText,
      suggestedQuestions: suggestedQuestions.slice(0, 3), // Limit to 3 suggestions
      context: {
        sources: contextResponse.sources,
        sectionsUsed: contextResponse.sectionsUsed,
        hasRelevantInfo: contextResponse.hasRelevantInfo,
        totalTokens: contextResponse.totalTokens
      },
      // Debug information - actual vector chunks retrieved
      debugInfo: {
        query: message,
        rawSearchResults: rawSearchResults.map(result => ({
          id: result.id,
          score: result.score,
          text: result.text.substring(0, 500) + (result.text.length > 500 ? '...' : ''), // Truncate for readability
          fullText: result.text, // Full text for detailed inspection
          metadata: result.metadata
        })),
        contextUsed: contextResponse.context,
        searchResultsCount: rawSearchResults.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Fallback response if Pinecone service fails
    const fallbackResponse = generateFallbackResponse(message || 'general inquiry');
    
    return NextResponse.json({
      response: fallbackResponse,
      suggestedQuestions: [
        "What are Daniel's main technical skills?",
        "Tell me about Daniel's work experience",
        "What projects has Daniel worked on?"
      ],
      context: {
        sources: [],
        sectionsUsed: [],
        hasRelevantInfo: false,
        totalTokens: 0,
        error: 'Vector database temporarily unavailable'
      },
      // Debug information for troubleshooting
      debugInfo: {
        query: message,
        error: error?.toString() || 'Unknown error',
        rawSearchResults: [],
        contextUsed: '',
        searchResultsCount: 0,
        timestamp: new Date().toISOString(),
        fallbackUsed: true
      }
    });
  }
}

export async function GET() {
  try {
    // Health check endpoint
    const pineconeService = getPineconeService();
    const healthStatus = await pineconeService.healthCheck();
    const suggestedQuestions = pineconeService.getSuggestedQuestions().map(q => q.question);
    
    return NextResponse.json({
      status: healthStatus.status,
      person: 'Daniel Wong',
      indexName: healthStatus.indexName,
      namespace: healthStatus.namespace,
      suggestedQuestions
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Pinecone vector database connection failed',
      suggestedQuestions: [
        "What are Daniel's main technical skills?",
        "Tell me about Daniel's work experience",
        "What projects has Daniel worked on?"
      ]
    }, { status: 500 });
  }
}

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
    return `Daniel has experience as a Graduate Cost and Carbon Intelligence Consultant at AECOM in London, UK, and previously worked as a Corporate HSSE Officer at Shell in Hong Kong, China. He brings expertise in cost analysis, carbon intelligence, and health, safety, security, and environmental management.`;
  }
  
  if (lowerMessage.includes('skills') || lowerMessage.includes('technical')) {
    return `Daniel's key technical skills include Python, Machine Learning, SQL, Azure, and PowerBI. He has experience with data analysis, web development, and cloud technologies. His background combines technical expertise with business consulting experience.`;
  }
  
  if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
    return `Daniel has a Master's degree in Computing and Information Systems from Queen Mary University of London. This advanced degree provided him with a strong foundation in computer science, data systems, and information technology.`;
  }
  
  if (lowerMessage.includes('project')) {
    return `Daniel has worked on several notable projects including a News Scraping Web App with LLM integration, NISA Investment Analytics platform, and this portfolio website built with Next.js and TypeScript. His projects demonstrate expertise in web development, data analysis, and machine learning applications.`;
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
    return `You can connect with Daniel through his portfolio website or professional networks. He's based in London, UK, and is open to discussing opportunities in cost intelligence, carbon analysis, and technology consulting.`;
  }
  
  return `I'm an AI assistant trained on Daniel Wong's portfolio information. I can help you learn about his professional experience, technical skills, education, and projects. Feel free to ask about his work at AECOM, his technical expertise, or his various development projects. The knowledge graph is temporarily unavailable, but I can still provide general information about Daniel's background.`;
}