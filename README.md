# Daniel's Portfolio Website 

This project showcases my personal portfolio built with Next.js, featuring an **AI-powered chatbot** with knowledge graph integration. It demonstrates my journey in modern web development while leveraging my extensive background in AI technologies, now including vector-based search and intelligent conversation capabilities.

🚀 **Live Demo**: https://daniel-wong-portfolio.vercel.app/  
🤖 **AI Chat**: https://daniel-wong-portfolio.vercel.app/chat

### Screenshots

#### Portfolio Homepage
<img width="1508" alt="Portfolio Homepage" src="https://github.com/user-attachments/assets/54e6a7eb-ee19-4a1f-8b75-67cc555958bf">

#### AI Chatbot Interface
*Enhanced chat interface with knowledge graph-powered responses and suggested questions*

### Key Features

#### 🤖 AI-Powered Chatbot
- **Knowledge Graph Integration**: Neo4j-powered knowledge graph for intelligent context-aware responses
- **Vector-Based Search**: Advanced search capabilities across projects, skills, and experiences
- **Gemini LLM Integration**: Google's Gemini AI for natural language understanding and generation
- **Suggested Questions**: Dynamic question suggestions based on portfolio content
- **Real-time Chat**: Interactive chat interface with typing indicators and timestamps
- **Contextual Responses**: Personalized answers about professional background, projects, and skills

#### 🎨 Modern Web Interface
- **Next.js Framework**: Utilizes the latest web technologies for a responsive and dynamic user experience
- **Floating Navigation Bar**: A visually appealing and functional navigation bar that remains accessible when users scroll up, meanwhile hides on scroll, thanks to [Aceternity UI](https://ui.aceternity.com/components/floating-navbar)
- **Error Monitoring**: Integrated Sentry for real-time error tracking and performance monitoring. User can provide any feedback/bug with the built-in screenshot functionality to the web developer (i.e. ME!)
- **Magical Button**: A absolute stunning, animated button inspired by [tailwindcss buttons](https://ui.aceternity.com/components/tailwindcss-buttons). It enhances user interaction and showcases advanced CSS and JavaScript techniques

### Technology Stack

#### 🧠 AI & Database
- **[Neo4j](https://neo4j.com/)**: Graph database for knowledge representation and vector search
- **[Google Gemini AI](https://ai.google.dev/)**: Large language model for natural language processing
- **[Neo4j Driver](https://neo4j.com/docs/javascript-manual/current/)**: TypeScript integration with Neo4j database
- **Knowledge Graph Architecture**: Custom-built entity relationship mapping

#### 🎨 Frontend & UI
- **[Next.js 14](https://nextjs.org/)** with App Router / **[React 18](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first styling
- **[Aceternity UI](https://ui.aceternity.com/)**: Modern UI components
- **[Framer Motion](https://www.framer.com/motion/)**: Smooth animations and interactions
- **[Lucide React](https://lucide.dev/)**: Beautiful icons

#### 🔧 Development & Deployment
- **[TSX](https://tsx.is/)**: TypeScript execution for build scripts
- **[Sentry](https://sentry.io/)**: Error monitoring and performance tracking
- **[Vercel](https://vercel.com/)**: Deployment platform
- **[Dotenv](https://github.com/motdotla/dotenv)**: Environment variable management

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm
- **Neo4j Database** (local or [Neo4j Aura](https://neo4j.com/cloud/aura/) cloud instance)
- **Google Gemini API Key** from [Google AI Studio](https://ai.google.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/next-portfolio.git
   cd next-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Neo4j Configuration
   NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=your-password
   
   # Gemini API Configuration
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Set up the knowledge graph**
   ```bash
   npm run setup-kg
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   - Portfolio: `http://localhost:3000`
   - AI Chat: `http://localhost:3000/chat`

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run setup-kg`: Initialize Neo4j knowledge graph
- `npm run lint`: Run ESLint

### Deployment 
This project is deployed on [Vercel](https://vercel.com/) with automatic deployments from the main branch. The Neo4j Aura database and Gemini API integrate seamlessly with the serverless environment.

## 🏗️ Architecture Overview

### Knowledge Graph Structure
The AI chatbot uses a sophisticated Neo4j knowledge graph with the following node types:
- **Person**: Professional profile information
- **Project**: Development projects with technologies and descriptions
- **Skill**: Technical skills with proficiency levels
- **Experience**: Work history and achievements
- **Education**: Academic background
- **Technology**: Programming languages and tools

### Chat Flow
1. **User Input**: Question processed through the chat interface
2. **Context Extraction**: Keywords extracted and mapped to graph entities
3. **Graph Query**: Neo4j queries retrieve relevant nodes and relationships
4. **AI Processing**: Gemini AI generates contextual responses using graph data
5. **Response Delivery**: Structured response with suggested follow-up questions

## 🎯 Future Roadmap

### 🤖 3D Avatar Integration
- **Interactive 3D Character**: Development of a 3D avatar for the AI chatbot
- **Real-time Animations**: Lip-sync and gesture animations during conversations
- **Personality Integration**: Avatar reactions based on conversation context
- **Technologies**: Three.js, React Three Fiber, Blender for 3D modeling

### 🚀 Enhanced AI Features
- **Advanced NLP**: Improved entity extraction and intent recognition
- **Multi-modal Responses**: Integration of images, code snippets, and diagrams
- **Conversation Memory**: Persistent chat history and context retention
- **Voice Integration**: Speech-to-text and text-to-speech capabilities

### 📊 Analytics & Insights
- **Chat Analytics**: User interaction patterns and popular topics
- **Performance Metrics**: Response time and accuracy measurements
- **Knowledge Graph Expansion**: Automated content updates and relationship discovery

## 🧠 Skills Demonstrated

This portfolio showcases:
1. **AI Integration**: Real-world application of LLMs and knowledge graphs
2. **Full-Stack Development**: End-to-end TypeScript/React application development
3. **Database Design**: Graph database architecture and query optimization
4. **Modern Web Technologies**: Next.js 14, server-side rendering, and API routes
5. **DevOps & Deployment**: Automated deployment pipelines and environment management

## 🤝 Contributing

This project represents my professional portfolio and learning journey. While it's primarily a personal showcase, I'm open to discussions about:
- AI/ML integration techniques
- Knowledge graph optimization
- Modern web development best practices
- Collaboration on similar projects

## 📞 Contact

**Daniel Wong**  
📧 Email: [chuenlik@hotmail.com](mailto:chuenlik@hotmail.com)  
💼 LinkedIn: [Professional Profile](https://www.linkedin.com/in/chuenlik-daniel-wong/)  
🤖 Try the AI Chat: [Chat with my AI assistant](https://daniel-wong-portfolio.vercel.app/chat)

---

*This portfolio combines my expertise in AI technologies with modern web development, creating an innovative showcase of skills and projects. The AI chatbot represents a practical application of knowledge graphs and large language models in a real-world scenario.*
