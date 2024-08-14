import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SkillBar from './SkillBar';

const SkillCategory: React.FC<{ category: string; skills: { name: string; level: number }[] }> = ({ category, skills }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="flex items-center justify-between w-full text-left text-lg font-medium text-blue-400 mb-2"
      >
        {category}
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isExpanded && (
        <div className="pl-4">
          {skills.map((skill, index) => (
            <SkillBar key={index} skill={skill.name} level={skill.level} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillCategory;