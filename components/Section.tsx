import React from "react";

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  id: string;
}> = ({ title, children, id }) => (
  <div className="mb-20" id={id}>
    <h2 className="text-3xl font-bold mb-8 text-blue-400 animate-fade-in-delay">
      {title}
    </h2>
    <div className="bg-gray-800 rounded-lg shadow-xl p-8 hover:shadow-2xl transition duration-300 animate-fade-in-delay">
      {children}
    </div>
  </div>
);

export default Section;
