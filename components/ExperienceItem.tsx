import React from 'react';

const ExperienceItem: React.FC<{ title: string; company: string; location: string; period: string; description: string[] }> = ({ title, company, location, period, description }) => (
  <div className="bg-gray-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition duration-300">
    <h3 className="text-2xl font-semibold text-blue-400 mb-2">{title}</h3>
    <p className="text-lg text-gray-400 mb-4">{company} | {location} | {period}</p>
    <ul className="list-disc list-inside text-gray-300 space-y-2">
      {description.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

export default ExperienceItem;