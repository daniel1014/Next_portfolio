'use client';
import React, { useState } from 'react';
import Link from 'next/link';
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
import { Trophy, Users, Calendar, Code } from 'lucide-react';
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

  const projectImages_1 = [
    '/photos/NISA_1.jpg',
    '/photos/NISA_2.jpg',
    '/photos/NISA_3.jpg',
    '/photos/NISA_4.jpg',
    '/photos/NISA_5.jpg',
  ];

  const projectImages_2 = [
    "/photos/chatbot_cv_1.jpg", 
    "/photos/chatbot_cv_2.jpg", 
    "/photos/chatbot_cv_3.jpg",
    "/photos/chatbot_cv_4.jpg",
  ];

  const projectImages_3 = [
    "/photos/trilodocs_1.png",
    "/photos/trilodocs_2.png",
    "/photos/trilodocs_3.png",
    "/photos/trilodocs_4.png",
  ];

  const experiences = [
    {
      title: "Data Analytics Consultant (with Artificial Intelligence specialization)",
      company: "AECOM",
      location: "London, UK",
      period: "January 2023 - Present",
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
      title: "TrilloDocs - AI Document Processing Platform",
      period: "May 2025 - July 2025",
      images: projectImages_3,
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
      title: "News Scraping Web App with LLM",
      period: "December 2023 - December 2024",
      images: projectImages_1,
      frontDescription: "LLM-powered news intelligence solution: scrape real-time news sources, summarise and chat with instant knowledge, upload lengthy PDF documents and chatbot is yours to keep.",
      backDetails: [
        {
          title: "Advanced RAG Architecture",
          description: "Implemented a hybrid search approach combining keyword (BM25) and vector (semantic) retrieval, optimized chunking strategies, and extraction methods. Adopted an open-source embedding model after evaluating multiple RAG setups. Integrated Cohere Reranker to further boost retrieval accuracy, balancing latency and quality."
        },
        {
          title: "Cloud Deployment & Scale",
          description: "Deployed to Azure and tuned for concurrent users and predictable costs. Explored Azure AI Search for efficient search and retrieval."
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
      title: "Team Internal Tool - CV Chatbot",
      period: "July 2024 - October 2024",
      images: projectImages_2,
      frontDescription: "Private LLM assistant that answers questions about team skills, roles, and projects with high precision.",
      backDetails: [
        {
          title: "Domain-tuned",
          description: "Embedded CVs into a vector store and prompt-tuned for grounded, accurate answers."
        },
        {
          title: "Systems integration",
          description: "Vector database + SharePoint connectors to keep knowledge up to date."
        },
        {
          title: "Focused UX",
          description: "Clean chat UI with auth and scoped search for faster retrieval."
        }
      ],
      technologies: ["Python", "LLM", "SharePoint", "Vector Database", "UI/UX"],
      links: {
        demo: "https://daniel-wong-portfolio.vercel.app/chat"
      }
    },
    {
      title: "Planning Context Report Automation",
      period: "2024",
      images: projectImages_1, // placeholder images
      frontDescription: "Automates planning context reports by searching, extracting, and summarising public documents into structured sections.",
      backDetails: [
        {
          title: "Data ingestion",
          description: "Scrapes PDFs/HTML and normalises geospatial and policy data for analysis."
        },
        {
          title: "LLM synthesis",
          description: "RAG pipeline produces concise, cited summaries and recommendations."
        },
        {
          title: "Delivery",
          description: "Exports structured content ready for client formatting and review."
        }
      ],
      technologies: ["Python", "LangChain", "Streamlit", "Azure", "Vector Database"]
    },
    {
      title: "Trustvibe - Reputation Intelligence Prototype",
      period: "2025",
      images: projectImages_2, // placeholder images
      frontDescription: "Prototype that analyses reviews and social signals to surface trust insights and risk flags.",
      backDetails: [
        {
          title: "Signal fusion",
          description: "Combines keyword, sentiment, and entity analysis with embedding-based clustering."
        },
        {
          title: "Explainable outputs",
          description: "Evidence-linked summaries and scorecards for transparent decisions."
        },
        {
          title: "Scalable design",
          description: "Next.js frontend with FastAPI services and vector search for low-latency queries."
        }
      ],
      technologies: ["Next.js", "TypeScript", "Python", "FastAPI", "Pinecone", "Tailwind CSS"]
    }
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
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-cyan-400" />
              <div className="absolute inset-0 animate-ping opacity-50">
                <Sparkles className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Daniel Wong
            </span>
          </div>

          {/* Center: Nav links */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
            {['about', 'experience', 'skills', 'projects', 'contact'].map((section) => (
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

          {/* Right: CTAs */}
          <div className="flex items-center gap-3">
            {/* Chat with Me button */}
            <Link
              href="/chat"
              className="group relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition-all duration-300 bg-white/10 hover:bg-white/15 hover:shadow-[0_8px_24px_rgba(59,130,246,0.25)]"
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
              end={3} 
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

        {/* Contact Section */}     
        <Section title="Contact" id="contact">
          {/* Full-viewport center wrapper (mobile-first) */}
          <div className="md:min-h-0 min-h-[100svh] grid place-items-center">
            <div className="bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-500 w-full">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-8 md:mb-0">
                <p className="flex items-center mb-4 text-gray-300"><Phone className="mr-3 text-blue-400" /> +44 7432 336788</p>
                <p className="flex items-center mb-4 text-gray-300">
                  <Mail className="mr-3 text-blue-400" /> 
                  <a href="mailto:chuenlik@hotmail.com" className="text-blue-400 hover:text-blue-300 transition duration-300">chuenlik@hotmail.com</a>
                </p>
                <p className="flex items-center mb-4 text-gray-300">
                  <Linkedin className="mr-3 text-blue-400" />
                  <a href="https://www.linkedin.com/in/chuenlik-daniel-wong/" className="text-blue-400 hover:text-blue-300 transition duration-300">LinkedIn: Chuen Lik Daniel Wong</a>
                </p>
                <p className="flex items-center mb-4 text-gray-300">
                  <Github className="mr-3 text-blue-400" />
                  <a href="https://github.com/daniel1014" className="text-blue-400 hover:text-blue-300 transition duration-300">GitHub: github.com/daniel1014</a>
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <form className="space-y-6">
                  <input className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 text-gray-300" type="text" placeholder="Your Name" />
                  <input className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 text-gray-300" type="email" placeholder="Your Email" />
                  <textarea className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 text-gray-300" rows={4} placeholder="Your Message"></textarea>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
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