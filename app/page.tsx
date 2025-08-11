'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Github, Linkedin, Sparkles } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import SkillCategory from '@/components/SkillCategory';
import Section from '@/components/Section';
import { FaGithub } from 'react-icons/fa';
import { FaLocationArrow } from 'react-icons/fa';
import MagicButton from '@/components/MagicButton';
import TimelineExperience from '@/components/TimelineExperience';
import FlipCard from '@/components/FlipCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Trophy, Users, Calendar, Code, ExternalLink } from 'lucide-react';
import AuroraDivider from '@/components/AuroraDivider';
import ParticleBackground from '@/components/ParticleBackground';
import ContactFormDialog from '@/components/ContactFormDialog';
import FeedbackButton from '@/components/FeedbackButton';


const PortfolioPage = () => {
  const [activeSection, setActiveSection] = useState('about');

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const projectImages_news_scraping = [
    '/photos/NISA_1.jpg',
    '/photos/NISA_2.jpg',
    '/photos/NISA_3.jpg',
    '/photos/NISA_4.jpg',
    '/photos/NISA_5.jpg',
  ];

  const projectImages_chatbot_cv = [
    "/photos/chatbot_cv_1.jpg", 
    "/photos/chatbot_cv_2.jpg", 
    "/photos/chatbot_cv_3.jpg",
    "/photos/chatbot_cv_4.jpg",
  ];

  const projectImages_trilodocs = [
    "/photos/trilodocs_1.png",
    "/photos/trilodocs_2.png",
    "/photos/trilodocs_3.png",
    "/photos/trilodocs_4.png",
  ];

  const projectImages_planning_context_report = [
    "/photos/planning_context_report_1.png",
    "/photos/planning_context_report_2.png",
    "/photos/planning_context_report_3.png",
    "/photos/planning_context_report_4.png",
  ];

  const projectImages_trustvibe = [
    "/photos/trustvibe_1.png",
    "/photos/trustvibe_2.png",
  ];

  // Added PlanningHub startup experience to reflect recent, relevant software engineering work in an early-stage AI SaaS environment.
  const experiences = [
    {
      title: "Software Developer",
      company: "PlanningHub (Early-stage Tech Startup)",
      location: "London, United Kingdom",
      period: "November 2024 - March 2025",
      description: [
        "Led the development of a greenfield, AI-driven SaaS platform, architecting both frontend and backend systems using React (TypeScript) and Python (asyncio, aiohttp).",
        "Integrated with an existing microservices-based architecture, ensuring seamless connectivity between frontend and backend services within a Dockerized embedded environment on WSL.",
        "Created an external API service to intermediate between frontend and other microservices, maintaining a multi-layered API ecosystem and optimising data flow and security.",
        "Enhanced frontend performance and usability, integrating Recoil for state management, Material-UI for a modern UI, and Google Maps API & Places Autocomplete for a seamless user experience.",
        "Designed an ETL pipeline to automate end-to-end data acquisition, integrating DeepSeek R1 from Ollama for local LLM processing, browser automation tools, geocoding services, and PostgreSQL—laying the foundation for the company’s strategic AI roadmap in geospatial intelligence.",
        "Collaborated cross-functionally with engineers and domain experts to optimize performance, scalability, and maintainability of the application, delivering actionable insights for real estate planning."
      ]
    },
    {
      title: "Data Analytics Consultant (with Artificial Intelligence specialization)",
      company: "AECOM",
      location: "London, United Kingdom",
      period: "January 2023 - October 2024",
      description: [
        "Led the full-stack development of an AI solution, 'News Scraping App', for a prestigious client. Integrated a bespoke chatbot, external search engine, and advanced RAG technique, alongside an intuitive user interface and proprietary knowledge base. Utilised Azure Web App service and a reputable vector database for efficient data retrieval",
        "Implemented Monte Carlo simulation for sensitivity analysis over a hundred cost models, evaluating the impact of financial uncertainty for a £1 billion business plan",
        "Designed ETL pipeline for data consolidation (370k+ records) and created PowerBI dashboard",
        "Developed decarbonization tool for regional asset portfolio platform, by integrating real-time data streaming from open-source APIs into a python based GUI"
      ]
    },
    {
      title: "Corporate HSSE Officer",
      company: "Shell",
      location: "Hong Kong, China",
      period: "August 2019 - May 2021",
      description: [
        "Launched Sustainability Project, awarded departmental 'Performance Recognition Award'",
        "Collaborated on building tailor-made digital Permit-To-Work system (ePTW), boosting operational efficiency by 40%",
        "Coordinated internal and external audits (ISO 9001 & 45001) with relevant stakeholders"
      ]
    }
  ];

  const projects = [
    {
      title: "News Scraping Web App with LLM",
      period: "December 2023 - December 2024",
      images: projectImages_news_scraping,
      frontDescription: "LLM-powered news intelligence solution: scrape real-time news sources, summarise and chat with instant knowledge, upload lengthy PDF documents and chatbot is yours to keep.",
      backDetails: [
        {
          title: "Advanced RAG Architecture",
          description: "Implemented a hybrid search approach combining keyword (BM25) and vector (semantic) retrieval, optimized chunking strategies, and extraction methods. Adopted an open-source embedding model after evaluating multiple RAG setups. Integrated Cohere Reranker to further boost retrieval accuracy, balancing latency and quality."
        },
        {
          title: "Cloud Deployment & Scale",
          description: "Deployed to Azure and tuned for concurrent users and predictable costs."
        },
        {
          title: "Intuitive Dashboard & Visualization",  
          description: "Interactive dashboard for real-time news monitoring with sentiment analysis, topic modeling, and quick summary."
        }
      ],
      technologies: ["Python", "Azure", "LangChain", "Streamlit", "Vector Database", "BM25", "Cohere Reranker", "Open-source Embedding Model"],
      links: {
        github: "https://github.com/daniel1014/Next_portfolio"
      }
    },
    {
      title: "TrilloDocs - AI Document Processing Platform",
      period: "May 2025 - July 2025",
      images: projectImages_trilodocs,
      frontDescription: "Turns PDF/DOCX into clean, structured JSON with one‑click downloads and local history. Built for speed, reliability, and clear results.",
      backDetails: [
        {
          title: "End-to-end stack",
          description: "Next.js + FastAPI with Gemini via LangChain. Async pipeline for parse → extract → validate, with local session processing history."
        },
        {
          title: "Modern Interactive UI/UX",
          description: "Designed a sophisticated interface featuring animated particle backgrounds, gradient effects, glowing elements, and smooth transitions using Tailwind CSS, Framer Motion, and Shadcn UI components for an engaging user experience."
        },
        {
          title: "Structured output with LangChain",
          description: "Uses LangChain tool calling to generate and validate structured outputs with custom schema design."
        }
      ],
      technologies: ["Next.js", "Python", "FastAPI", "Gemini LLM", "Langchain", "Tailwind CSS", "Framer Motion", "Shadcn UI"],
      links: {
        github: "https://github.com/daniel1014/Trilodocs",
        demo: "https://trilodocs.vercel.app/",
        sampleData: "/assets/demo_data.docx"
      }
    },
    {
      title: "Team Internal Tool - CV Chatbot",
      period: "July 2024 - October 2024",
      images: projectImages_chatbot_cv,
      frontDescription: "Private LLM assistant that answers questions about team skills, roles, and projects with high precision.",
      backDetails: [
        {
          title: "Domain-tuned",
          description: "Embedded CVs into a vector store and prompt-tuned for grounded, accurate answers."
        },
        {
          title: "Systems integration",
          description: "Vector database (Qdrant) + SharePoint connectors to keep knowledge up to date. Integrated Azure AI Search for efficient search and retrieval."
        },
        {
          title: "Focused UX",
          description: "Clean chat UI with auth and scoped search for faster retrieval."
        }
      ],
      technologies: ["Python", "LLM", "SharePoint", "Vector Database", "Qdrant", "Azure AI Search", "UI/UX"],
      links: {
        github: "https://github.com/daniel1014/chatbot_CV"
      }
    },
    {
      title: "Planning Context Report - AI-Powered SaaS Platform",
      period: "January 2025 - March 2025",
      images: projectImages_planning_context_report,
      frontDescription: "AI platform reducing planning report generation from 20-40 hours to under 5 minutes, processing 10,000+ datasets across UK cities.",
      backDetails: [
        {
          title: "Performance optimization",
          description: "Achieved 99.6% reduction in report generation time through parallel data fetching and LLM optimization."
        },
        {
          title: "Data processing",
          description: "Integrated heterogeneous sources (APIs, MSSQL, shapefiles) using PostGIS and GDAL for spatial operations."
        },
        {
          title: "Architecture",
          description: "Docker microservices with React 18/TypeScript frontend, Python AsyncIO backend, and LangGraph orchestration."
        }
      ],
      technologies: ["React 18", "TypeScript", "Python", "AsyncIO", "LangGraph", "Ollama", "PostGIS", "Docker", "Material-UI"]
    },
    {
      title: "TrustVibe - Christian Community Platform",
      period: "May 2025 - present (ongoing side project)",
      images: projectImages_trustvibe,
      frontDescription: "Cross-platform mobile app with real-time chat, social features, and GraphQL API serving faith communities.",
      backDetails: [
        {
          title: "Cross-platform development",
          description: "React Native with Expo for iOS/Android compatibility and Firebase real-time listeners."
        },
        {
          title: "Backend architecture",
          description: "GraphQL API layer with Firestore database and authentication system."
        },
        {
          title: "Marketing platform",
          description: "Next.js landing page with TailwindCSS for responsive design and SEO optimization."
        }
      ],
      technologies: ["React Native", "Expo", "Firebase", "GraphQL", "Next.js", "TypeScript", "TailwindCSS"],
      links: {
        demo: "https://trustvibe.vercel.app",
      }
    }
  ];

  const blogPosts = [
    {
      title: 'EasyApply - Browser Automation Agent',
      summary:
        'AI-powered job application automation system using browser agents. Automates form filling, cover letter generation, and application submission while handling dynamic web interfaces and CAPTCHAs.',
      date: '2025-06-20',
      cover: '/photos/easyapply.png',
      href: 'https://www.linkedin.com/posts/chuenlik-daniel-wong_ai-llmagents-agenticai-activity-7330590814475022337-qyoA?utm_source=share&utm_medium=member_desktop&rcm=ACoAADSXfzIBieynxSQImsUXsnSZC5S60cYwZeg',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Background layers */}
      <ParticleBackground />

      {/* Glow effects */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500 rounded-full filter blur-[100px] opacity-20"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-20 border-b border-gray-800 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-4 relative flex items-center justify-between">
          {/* Left: Brand (and AI Chatbot on mobile) */}
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Daniel Wong
            </span>
            {/* Show AI Chatbot button inline on mobile for compactness */}
            <Link
              href="/chat"
              className="ml-2 flex md:hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition-all duration-300 shadow-none"
              style={{ boxShadow: 'none' }}
            >
              <span className="relative z-10">AI Chatbot</span>
            </Link>
          </div>

          {/* Center: Nav links (hidden on mobile) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {['about', 'experience', 'skills', 'projects'].map((section) => (
              <button
                key={section}
                onClick={() => scrollTo(section)}
                className={`text-gray-300 hover:text-white transition-colors relative group ${activeSection === section ? 'text-white' : ''}`}
              >
                <span className="relative z-10">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* Right: CTAs (hidden AI Chatbot on mobile, show on desktop) */}
          <div className="flex items-center gap-3">
            {/* AI Chatbot button only on md+ screens */}
            <Link
              href="/chat"
              className="group relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition-all duration-300 bg-white/10 hover:bg-white/15 hover:shadow-[0_8px_24px_rgba(59,130,246,0.25)] hidden md:inline-flex"
            >
              {/* Glass highlight */}
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent opacity-70" />
              {/* Moving sheen */}
              <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[300%] group-hover:opacity-100" />
              <span className="relative z-10">AI Chatbot</span>
            </Link>
            {/* GitHub icon button */}
            <a
              href="https://github.com/daniel1014/Next_portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-700/30 text-gray-200 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="text-xl" />
            </a>
            {/* LinkedIn icon button */}
            <a
              href="https://www.linkedin.com/in/daniel-chuen-lik-wong/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-700/30 text-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="text-white h-screen flex items-center relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Daniel (Chuen Lik) Wong</h1>
          <p className="text-2xl mb-10 animate-fade-in-delay text-gray-300">Full-stack Developer | AI Engineer | Innovation Enthusiast</p>
          {/* <button onClick={() => scrollTo('about')} className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition duration-300 shadow-lg animate-bounce">
            Explore My Work <ChevronDown className="inline ml-2" />
          </button> */}
          <a href="/chat">
            <MagicButton
            title="Chat with Me!"
            icon={<FaLocationArrow />}
            position="right"
            />
          </a>
        </div>
      </header>      


      {/* Main content */}
      <main className="container mx-auto px-6 py-32 max-w-6xl relative z-10" id="about">
        <Section title="About Me" id="about_me">
          <div className="bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-500">
            <p className="text-base sm:text-lg text-gray-200 mb-8 leading-relaxed font-light">
              Curiosity has always driven my journey as a developer.
            </p>
            <p className="text-base sm:text-lg text-gray-200 mb-8 leading-relaxed font-light">
              I began my career in a multinational energy company, where I witnessed firsthand how technology transforms industries from the inside out. This experience inspired me to pivot into tech—teaching myself to code and later pursuing formal training in computing and AI.
            </p>
            <p className="text-base sm:text-lg text-gray-200 mb-8 leading-relaxed font-light">
              In 2023, after the release of ChatGPT, I built an AI-powered news scraping app. It quickly evolved into a full-stack system with LLMs (RAG), semantic search, PDF parsing, and sentiment analysis—all deployed on the cloud.
            </p>
            <p className="text-base sm:text-lg text-gray-200 mb-8 leading-relaxed font-light">
              That project sharpened my skills and ignited a passion for building scalable, data-driven applications that don’t just work, but think and adapt.
            </p>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-light">
              Today, I focus on delivering intelligent solutions that bring real impact to users and businesses alike.
            </p>
          </div>
          
          {/* Achievement Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <AnimatedCounter 
              end={5} 
              suffix="+" 
              label="Years Experience" 
              icon={<Calendar className="w-6 h-6 text-blue-400" />}
            />
            <AnimatedCounter 
              end={6} 
              suffix="+" 
              label="Major Projects" 
              icon={<Code className="w-6 h-6 text-blue-400" />}
            />
            <AnimatedCounter 
              end={370} 
              suffix="K+" 
              label="Records Processed" 
              icon={<Users className="w-6 h-6 text-blue-400" />}
            />
            <AnimatedCounter 
              end={1} 
              suffix=" Billion" 
              prefix="£"
              label="Business Plan Value" 
              icon={<Trophy className="w-6 h-6 text-blue-400" />}
            />
          </div>
        </Section>

        <AuroraDivider />

        {/* Experience Section */}
        <Section title="Experience" id="experience">
          <TimelineExperience experiences={experiences} />
        </Section>

        <AuroraDivider />

        {/* Skills Section */}
        <Section title="Skills" id="skills">
          <div className="relative bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-skill-gradient opacity-10 pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">Technical Skills</h3>
                <SkillCategory
                  category="AI / LLM"
                  skills={[
                    { name: "Prompt engineering & evaluation", level: 90 },
                    { name: "LangChain / LlamaIndex", level: 90 },
                    { name: "RAG (chunking, hybrid search)", level: 90 },
                    { name: "Agents (CrewAI)", level: 80 },
                  ]}
                />
                <SkillCategory
                  category="Backend"
                  skills={[
                    { name: "Python (FastAPI)", level: 90 },
                    { name: "REST APIs & webhooks", level: 85 },
                    { name: "Node.js / Next.js API routes", level: 80 },
                    { name: "Auth & sessions", level: 75 },
                  ]}
                />
                <SkillCategory
                  category="Frontend"
                  skills={[
                    { name: "Next.js / React", level: 80 },
                    { name: "TypeScript", level: 75 },
                    { name: "Tailwind CSS & Framer Motion", level: 85 },
                    { name: "Shadcn UI", level: 80 },
                  ]}
                />
                <SkillCategory
                  category="Data & Cloud"
                  skills={[
                    { name: "Vector DBs (Pinecone, Qdrant)", level: 90 },
                    { name: "Azure (App Service, AI Search)", level: 80 },
                    { name: "PostgreSQL / SQL", level: 80 },
                    { name: "Streamlit / Dash", level: 90 },
                  ]}
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">Certifications</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-3">
                  <li>Financial Risk Manager (FRM) Exam - Part 1 & 2</li>
                  <li>Multi AI Agent Systems with CrewAI</li>
                  <li>AWS Machine Learning Foundation 2022</li>
                  <li>Google Data Analytics Professional</li>
                  <li>ISO 9001:2015 Internal QMS Auditor</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <AuroraDivider />

        {/* Projects Section */}
        <Section title="Projects" id="projects">
          <div className="relative">
            <div className="absolute inset-0 bg-project-gradient opacity-5 rounded-3xl pointer-events-none" />
            <div className="relative z-0 grid gap-16 max-w-4xl mx-auto">
              {projects.map((project, index) => (
                <FlipCard key={index} project={project} />
              ))}
            </div>
          </div>
        </Section>

        <AuroraDivider />

        {/* Blog Section */}
        <Section title="Recent Blog" id="blog">
          <div className="relative">
            <div className="absolute inset-0 bg-project-gradient opacity-5 rounded-3xl pointer-events-none" />
            <div className="relative z-0 grid gap-8 max-w-4xl mx-auto">
              {blogPosts.map((post) => (
                <article
                  key={post.title}
                  className="group bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8"
                >
                  <Link href={post.href} className="block focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-xl">
                    <h3 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                      {post.title}
                    </h3>
                    <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        width={1200}
                        height={630}
                        className="w-full h-56 md:h-72 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        priority
                      />
                    </div>
                    <p className="mt-6 text-gray-300">
                      {post.summary}
                    </p>
                    <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                      <span>Published on {formatDate(post.date)}</span>
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Get in Touch */}
          <div className="flex items-center gap-3">
            <ContactFormDialog />
          </div>

          {/* Right: Socials */}
          <div className="flex items-center gap-4">
            <FeedbackButton />
            <a
              href="https://github.com/daniel1014"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-700/30 text-gray-200 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/chuenlik-daniel-wong/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-700/30 text-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPage;