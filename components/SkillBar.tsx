import React from 'react';

const SkillBar: React.FC<{ skill: string; level: number }> = ({ skill, level }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <span className="text-lg font-medium text-gray-300">{skill}</span>
      <span className="text-sm font-medium text-blue-400">{level}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${level}%` }}></div>
    </div>
  </div>
);

export default SkillBar;