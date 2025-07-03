'use client';
import React from 'react';

const AuroraBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary Aurora Layer */}
      <div 
        className="absolute inset-0 bg-aurora-animated animate-aurora opacity-40"
        style={{
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* Secondary Aurora Layer */}
      <div 
        className="absolute inset-0 bg-aurora-gradient animate-aurora-slow opacity-30"
        style={{
          backgroundSize: '300% 300%',
          animationDelay: '-10s'
        }}
      />
      
      {/* Tertiary Floating Aurora Spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-aurora-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/08 to-pink-500/08 rounded-full blur-3xl animate-aurora" 
           style={{ animationDelay: '-15s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/06 to-blue-500/06 rounded-full blur-3xl animate-aurora-slow" 
           style={{ animationDelay: '-5s' }} />
    </div>
  );
};

export default AuroraBackground;