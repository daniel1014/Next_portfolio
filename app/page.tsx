'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Mail, Phone, Github, Linkedin } from 'lucide-react';
import ExperienceItem from '@/components/ExperienceItem';
import SkillCategory from '@/components/SkillCategory';
import Section from '@/components/Section';
import ProjectGallery from '@/components/ProjectGallery';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import MagicButton from '@/components/MagicButton';
import { FaLocationArrow } from 'react-icons/fa';

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
    "/photos/chatbot_cv_4.jpg"
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Floating Nav */}
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={[
          {name: 'About Me', link: '#about', icon: <IconHome />},
          {name: 'Experience', link: '#experience', icon: <IconMessage />},
          {name: 'Skills', link: '#skills', icon: <IconUser />},
          {name: 'Projects', link: '#projects', icon: <IconMessage />},
          {name: 'Contact', link: '#contact', icon: <IconMessage />},
        ]} />      
      </div>

      {/* Navigation */}
      <nav className="bg-gray-800 shadow-lg fixed w-full z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">Daniel Wong</h1>
            <div className="hidden md:flex space-x-6">
              {['about', 'experience', 'skills', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollTo(section)}
                  className={`text-gray-300 hover:text-blue-400 transition duration-300 ${activeSection === section ? 'text-blue-400 font-semibold' : ''}`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              <Link href="/chat" className="text-blue-400 hover:text-blue-300 font-semibold transition duration-300">Chat with CV</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-hero-gradient text-white h-screen flex items-center">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">Daniel (Chuen Lik) Wong</h1>
          <p className="text-2xl mb-10 animate-fade-in-delay">AI Engineer | Data Scientist | Innovation Enthusiast</p>
          {/* <button onClick={() => scrollTo('about')} className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition duration-300 shadow-lg animate-bounce">
            Explore My Work <ChevronDown className="inline ml-2" />
          </button> */}
          <a href="#about">
            <MagicButton
            title="Explore my work"
            icon={<FaLocationArrow />}
            position="right"
            />
          </a>
        </div>
      </header>      


      {/* Main content */}
      <main className="container mx-auto px-6 py-20" id="about">
        <Section title="About Me" id="about_me" >
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition duration-300">
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {`I'm a versatile and enthusiastic professional with a master's degree in computing and information systems.`}
              {`My passion lies in driving impactful innovation in AI, and I'm proficient in leveraging cutting-edge technologies such as Large Language Models (LLM) to tackle complex tasks.`}
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              With a strong background in data analytics, machine learning, and software development, I bring a unique 
              blend of technical skills and business acumen to every project. My goal is to contribute to groundbreaking 
              AI solutions that make a real difference in the world.
            </p>
          </div>
        </Section>

        {/* Experience Section */}
        <Section title="Experience" id="experience">
          <div className="space-y-8">
            <ExperienceItem 
              title="Graduate Cost and Carbon Intelligence Consultant"
              company="AECOM"
              location="London, UK"
              period="January 2023 - Present"
              description={[
                "Led the full-stack development of an AI solution, 'News Scraping App', for a prestigious client. Integrated a bespoke chatbot, external search engine, and advanced RAG technique, alongside an intuitive user interface and proprietary knowledge base. Utilised Azure Web App service and a reputable vector database for efficient data retrieval",
                "Implemented Monte Carlo simulation for sensitivity analysis over a hundred cost models, evaluating the impact of financial uncertainty for a £1 billion business plan",
                "Designed ETL pipeline for data consolidation (370k+ records) and created PowerBI dashboard",
                "Developed decarbonization tool for regional asset portfolio platform, by integrating real-time data streaming from open-source APIs into a python based GUI"
              ]}
            />
            <ExperienceItem 
              title="Corporate HSSE Officer"
              company="Shell"
              location="Hong Kong, China"
              period="August 2019 - May 2021"
              description={[
                `Launched Sustainability Project, awarded departmental 'Performance Recognition Award'`,
                `Collaborated on building tailor-made digital Permit-To-Work system (ePTW), boosting operational efficiency by 40%`,
                `Coordinated internal and external audits (ISO 9001 & 45001) with relevant stakeholders`
              ]}
            />
          </div>
        </Section>

        {/* Skills Section */}
        <Section title="Skills" id="skills">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition duration-300">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">Technical Skills</h3>
                <SkillCategory 
                  category="Python" 
                  skills={[
                    { name: "Core Python", level: 95 },
                    { name: "LLM frameworks (e.g. LangChain, LlamaIndex, CrewAI)", level: 90 },
                    { name: "Machine Learning", level: 85 },
                  ]} 
                />
                <SkillCategory 
                  category="Data" 
                  skills={[
                    { name: "Excel (VBA)", level: 90 },
                    { name: "SQL", level: 75 },
                    { name: "PowerBI", level: 90 },
                  ]} 
                />
                <SkillCategory 
                  category="Cloud" 
                  skills={[
                    { name: "Azure (e.g. Azure App Service, Azure AI Search)", level: 85 },
                    { name: "Vector Database (e.g. Qdrant, SingleStore, Pinecone)", level: 85 },
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

        {/* Projects Section */}
        <Section title="Projects" id="projects">
          <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-8 hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">News Scraping Web App with LLM</h3>
            <p className="text-gray-400 mb-6">December 2023 - Present</p>
            <ProjectGallery images={projectImages_1} />
            <ul className="list-none text-gray-300 space-y-6">
              <li>
                <h4 className="text-xl font-semibold text-blue-300 mb-2">RAG Technique Implementation</h4>
                <p>{`Implemented advanced Retrieval Augmented Generation (RAG) techniques to enhance the chatbot's knowledge base. Compared the performance of different RAG techniques (e.g., Hybrid Search, Vector Semantic Search) and data extraction methods (e.g., PDF tables) to determine the most effective approach for the project. Strategically selected a large language model (LLM) for production by comparing the performance of different models, such as Cohere, OpenAI, and other open-source options`}</p>
              </li>
              <li>
                <h4 className="text-xl font-semibold text-blue-300 mb-2">Cloud Deployment Optimization</h4>
                <p>{`Collaborated with Microsoft Technical Specialists to gain a deeper understanding of Azure cloud hosting specifications, ensuring the AI-powered web application can handle concurrent user logins and scale effectively at a production level (i.e., Azure Web App Service). Evaluated various vector database service providers, including Azure AI Search, Qdrant, and Singlestore, focusing on data security and scalability to identify a suitable permanent vector database for optimising data retrieval and storage`}</p>
              </li>
              <li>
                <h4 className="text-xl font-semibold text-blue-300 mb-2">Advanced Analytics Visualisation</h4>
                <p>{`Integrated advanced natural language processing techniques for news article summarization (using HuggingFace transformers), sentiment analysis (leveraging Textblob), and topic modeling (using Gensim and pyLDAvis) along with interactive visualisation built with Streamlit`}</p>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-8 hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-blue-400">Team Internal Tool - CV Chatbot</h3>
            <p className="text-gray-400 mb-6">January 2023 - March 2023</p>
            <ProjectGallery images={projectImages_2} />
            <ul className="list-none text-gray-300 space-y-6">
              <li>
                <h4 className="text-xl font-semibold text-blue-300 mb-2">Chatbot Development</h4>
                <p>{`Designed and developed a conversational AI chatbot for internal team use, utilizing a large language model (LLM) to simulate human-like conversations. The chatbot was trained on a dataset of CVs to provide information on team members&apos; skills, experience, and education.`}</p>
              </li>
              <li>
                <h4 className="text-xl font-semibold text-blue-300 mb-2">Integration with Existing Systems</h4>
                <p>{`Integrated the chatbot with a vector database and company's existing SharePoint site to fetch real-time data on team members, ensuring the chatbot's knowledge base was always up-to-date. This integration enabled the chatbot to provide accurate and relevant information to users.`}</p>
              </li>
              <li>
                <h4 className="text-xl font-semibold text-blue-300 mb-2">User Interface Design</h4>
                <p>{`Designed a user-friendly interface for the chatbot, ensuring a seamless user experience. The interface included features such as a chat window, user authentication, and a knowledge base search functionality.`}</p>
              </li>
            </ul>
          </div>
        </Section>

        {/* Contact Section */}     
        <Section title="Contact" id="contact">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition duration-300">
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
      <footer className="bg-gray-800 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p>© 2024 Daniel Wong. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPage;