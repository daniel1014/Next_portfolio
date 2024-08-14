import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, children, id }) => (
  <div className="mb-20" id={id}>
    <h2 className="text-3xl font-bold mb-8 text-blue-400">{title}</h2>
    {children}
  </div>
);

export default Section;