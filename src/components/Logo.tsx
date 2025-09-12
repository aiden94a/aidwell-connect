import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Background circle with gradient */}
          <circle cx="32" cy="32" r="30" fill="url(#gradient)" stroke="url(#borderGradient)" strokeWidth="2"/>
          
          {/* Heart icon */}
          <path 
            d="M32 48C32 48 20 36 20 28C20 24.5 22.5 22 26 22C28.5 22 30.5 23.5 32 25.5C33.5 23.5 35.5 22 38 22C41.5 22 44 24.5 44 28C44 36 32 48 32 48Z" 
            fill="white" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
          />
          
          {/* Blockchain connection dots */}
          <circle cx="16" cy="16" r="2" fill="white" opacity="0.8"/>
          <circle cx="48" cy="16" r="2" fill="white" opacity="0.8"/>
          <circle cx="16" cy="48" r="2" fill="white" opacity="0.8"/>
          <circle cx="48" cy="48" r="2" fill="white" opacity="0.8"/>
          
          {/* Connection lines */}
          <path 
            d="M16 16L32 32M48 16L32 32M16 48L32 32M48 48L32 32" 
            stroke="white" 
            strokeWidth="1" 
            opacity="0.6"
          />
          
          {/* Center connection point */}
          <circle cx="32" cy="32" r="3" fill="white" opacity="0.9"/>
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
              <stop offset="50%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#EC4899', stopOpacity:1}} />
            </linearGradient>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#1E40AF', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#BE185D', stopOpacity:1}} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          AidWell Connect
        </span>
      )}
    </div>
  );
};

export default Logo;
