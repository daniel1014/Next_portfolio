import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPineconeService } from '@/lib/pinecone_service';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
    
    // Get context and raw search results from Pinecone vector store (single call)
    const pineconeResponse = await pineconeService.search(message);
    
    // Mock person info since we have it in our context now
    const personInfo = {
      properties: {
        name: "Daniel Wong",
        headline: "Full-Stack Developer specializing in AI-powered, cross-platform applications",
        location: "London, UK",
        bio: "Expert in building scalable real-time systems with React, Next.js, TypeScript, and Node.js, delivering production-grade AI features across web, iOS, and Android",
        background: "Daniel is a Christian who is passionate about helping out in volunteer activities and serving the East London community. His wife is a church pastor and she just got pregnant with their first child."
      }
    };
    
    // Build context prompt
    const contextPrompt = `
You are an AI assistant representing Daniel Wong's portfolio. Use the following information to answer questions about Daniel's background, skills, projects, and experience.

Person Information:
${personInfo ? `
Name: ${personInfo.properties.name}
Headline: ${personInfo.properties.headline}
Location: ${personInfo.properties.location}
Bio: ${personInfo.properties.bio}
Background: ${personInfo.properties.background}
` : ''}

Relevant Context from Vector Database:
${pineconeResponse.context}

Sources Used: ${pineconeResponse.sources.join(', ')}

Previous Conversation:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}

Current Question: ${message}

Instructions:
1. Proactively answer questions about Daniel's professional background, skills, projects, and experience
2. Be conversational and friendly while remaining professional
3. If you don't have specific information, acknowledge this and suggest related topics you can help with
4. Use the vector database context to provide accurate and detailed responses
5. Don't make up information that isn't in the provided context
6. If asked about projects, mention specific technologies and details from the context
7. Reference the specific sections when providing information (e.g., "From his Technical Skills section...")
8. Format your response using markdown for better readability (use **bold**, *italic*, code blocks, lists, etc.)

Please provide a helpful response about Daniel's portfolio:
`;

    // Create a readable stream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate streaming response using Gemini
          const result = await model.generateContentStream(contextPrompt);
          
          let fullResponse = '';
          
          // Get suggested questions for better UX
          const suggestedQuestions = pineconeService.getSuggestedQuestions().map(q => q.question);
          
          // Send initial metadata
          const initialData = {
            type: 'metadata',
            suggestedQuestions: suggestedQuestions.slice(0, 3),
            context: {
              sources: pineconeResponse.sources,
              hasRelevantInfo: pineconeResponse.hasRelevantInfo,
              totalTokens: pineconeResponse.totalTokens
            },
            debugInfo: {
              query: message,
              rawSearchResults: pineconeResponse.results.map((result: any) => ({
                id: result.id,
                score: result.score,
                text: result.text.substring(0, 500) + (result.text.length > 500 ? '...' : ''),
                fullText: result.text,
                metadata: result.metadata
              })),
              contextUsed: pineconeResponse.context,
              searchResultsCount: pineconeResponse.results.length,
              timestamp: new Date().toISOString()
            }
          };
          
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(initialData)}\n\n`));
          
          // Stream the response chunks
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            
            const streamData = {
              type: 'chunk',
              content: chunkText,
              fullResponse: fullResponse
            };
            
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(streamData)}\n\n`));
          }
          
          // Send completion signal
          const completionData = {
            type: 'complete',
            fullResponse: fullResponse
          };
          
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(completionData)}\n\n`));
          controller.close();
          
        } catch (streamError) {
          console.error('Streaming error:', streamError);
          
          // Send error in stream format
          const errorData = {
            type: 'error',
            error: streamError?.toString() || 'Streaming failed',
            fallbackResponse: generateFallbackResponse(message || 'general inquiry')
          };
          
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(errorData)}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
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
    return `Daniel is currently a Full-Stack Developer at Talk Machine, building cross-platform AI-powered voice applications. Previously, he worked as a Software Developer at PlanningHub developing AI-driven SaaS platforms, as a Graduate Data Analytics Consultant at AECOM in London, and as a Corporate HSSE Officer at Shell in Hong Kong. He brings expertise in full-stack development, AI integration, and scalable system architecture.`;
  }
  
  if (lowerMessage.includes('skills') || lowerMessage.includes('technical')) {
    return `Daniel's key technical skills include React, Next.js, TypeScript, Node.js (Hono, Express), Python (FastAPI, Asyncio), AI/LLM integration (LangChain, Vertex AI, Elevenlabs), cloud platforms (AWS, Azure, GCP), vector databases (Pinecone, Qdrant), and modern DevOps practices. He specializes in building production-grade AI applications with type-safe APIs and real-time capabilities.`;
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