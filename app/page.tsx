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
      frontDescription: "A comprehensive AI-powered document processing platform that transforms PDF and DOCX files into structured data using advanced LLM technology with modern, interactive user interface.",
      backDetails: [
        {
          title: "Full-Stack AI Integration",
          description: "Built a complete document processing web application using Next.js frontend and Python FastAPI backend, leveraging Google's Gemini LLM with Langchain for intelligent document analysis and structured data extraction from PDF/DOCX files."
        },
        {
          title: "Modern Interactive UI/UX",
          description: "Designed a sophisticated interface featuring animated particle backgrounds, gradient effects, glowing elements, and smooth transitions using Tailwind CSS, Framer Motion, and Shadcn UI components for an engaging user experience."
        },
        {
          title: "Smart Document Management",
          description: "Implemented comprehensive document handling with upload validation, processing history tracking, downloadable JSON results, and real-time status updates, demonstrating scalable file processing architecture."
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
      frontDescription: "An advanced AI-powered web application that combines news scraping, chatbot functionality, and cutting-edge RAG techniques for intelligent data retrieval and analysis.",
      backDetails: [
        {
          title: "RAG Technique Implementation",
          description: "Implemented advanced Retrieval Augmented Generation (RAG) techniques to enhance the chatbot's knowledge base. Compared the performance of different RAG techniques (e.g., Hybrid Search, Vector Semantic Search) and data extraction methods to determine the most effective approach."
        },
        {
          title: "Cloud Deployment Optimization",
          description: "Collaborated with Microsoft Technical Specialists to gain a deeper understanding of Azure cloud hosting specifications, ensuring the AI-powered web application can handle concurrent user logins and scale effectively at production level."
        },
        {
          title: "Advanced Analytics Visualisation",
          description: "Integrated advanced natural language processing techniques for news article summarization, sentiment analysis, and topic modeling along with interactive visualisation built with Streamlit."
        }
      ],
      technologies: ["Python", "Azure", "LangChain", "Streamlit", "Vector Database"],
      links: {
        github: "https://github.com/daniel1014/Next_portfolio"
      }
    },
    {
      title: "Team Internal Tool - CV Chatbot",
      period: "July 2024 - October 2024",
      images: projectImages_2,
      frontDescription: "An intelligent conversational AI chatbot designed for internal team use, utilizing LLM technology to provide information about team members' skills, experience, and education.",
      backDetails: [
        {
          title: "Chatbot Development",
          description: "Designed and developed a conversational AI chatbot for internal team use, utilizing a large language model (LLM) to simulate human-like conversations. The chatbot was trained on a dataset of CVs to provide information on team members' skills and experience."
        },
        {
          title: "Integration with Existing Systems",
          description: "Integrated the chatbot with a vector database and company's existing SharePoint site to fetch real-time data on team members, ensuring the chatbot's knowledge base was always up-to-date."
        },
        {
          title: "User Interface Design",
          description: "Designed a user-friendly interface for the chatbot, ensuring a seamless user experience. The interface included features such as a chat window, user authentication, and knowledge base search functionality."
        }
      ],
      technologies: ["Python", "LLM", "SharePoint", "Vector Database", "UI/UX"],
      links: {
        demo: "https://daniel-wong-portfolio.vercel.app/chat"
      }
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
          <p className="text-2xl mb-10 animate-fade-in-delay text-gray-300">AI Engineer | Data Scientist | Innovation Enthusiast</p>
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
        <Section title="About Me" id="about_me" >
          <div className="bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-500">
            <p className="text-xl text-gray-200 mb-8 leading-relaxed font-light">
              {`I'm a versatile and enthusiastic professional with a master's degree in computing and information systems.`}
              {`My passion lies in driving impactful innovation in AI, and I'm proficient in leveraging cutting-edge technologies such as Large Language Models (LLM) to tackle complex tasks.`}
            </p>
            <p className="text-xl text-gray-200 leading-relaxed font-light">
              With a strong background in data analytics, machine learning, and software development, I bring a unique 
              blend of technical skills and business acumen to every project. My goal is to contribute to groundbreaking 
              AI solutions that make a real difference in the world.
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
                  category="Python" 
                  skills={[
                    { name: "Core Python", level: 95 },
                    { name: "LLM agentic frameworks (e.g. LangChain, LlamaIndex)", level: 90 },
                    { name: "ETL pipeline (e.g. Pandas)", level: 90 },
                    { name: "RESTful APIs (e.g. Flask)", level: 80 },
                  ]} 
                />
                <SkillCategory 
                  category="Data" 
                  skills={[
                    { name: "Excel (VBA)", level: 90 },
                    { name: "SQL", level: 75 },
                    { name: "Dashboard Visualisation (e.g. PowerBI)", level: 95 },
                  ]} 
                />
                <SkillCategory 
                  category="Cloud" 
                  skills={[
                    { name: "Azure (e.g. Web App Service, AI Search)", level: 80 },
                    { name: "Vector Database (e.g. Qdrant, Pinecone)", level: 90 },
                    { name: "Relational Database (e.g. SQL, PostgreSQL)", level: 80 }, 
                    { name: "Machine Learning (e.g. Regression, Time-series)", level: 90 }
                  ]} 
                />
                <SkillCategory 
                  category="Web Development" 
                  skills={[
                    { name: "Next.js/React", level: 70 },
                    { name: "JavaScript/TypeScript", level: 70 },
                    { name: "Streamlit", level: 95 },
                    { name: "Dash (Plotly)", level: 85 },
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
          <div className="bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-500">
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