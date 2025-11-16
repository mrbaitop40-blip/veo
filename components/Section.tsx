import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700">
      <h2 className="text-lg font-semibold text-emerald-300 p-4 border-b border-gray-700 bg-gray-800/70 rounded-t-lg">
        {title}
      </h2>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Section;