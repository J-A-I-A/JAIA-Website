import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  href?: string;
}

export function NeonButton({ 
  children, 
  variant = 'primary', 
  onClick,
  className = '',
  href
}: NeonButtonProps) {
  const clipPath = "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)";
  
  const baseStyles = "relative group px-10 py-4 font-display font-bold uppercase tracking-[0.2em] transition-all duration-300";
  
  const variants = {
    primary: "bg-jaia-gold text-jaia-black hover:bg-jaia-neonGold",
    secondary: "bg-transparent text-jaia-green hover:text-white"
  };

  const content = (
    <>
      {/* Secondary Border Container (for secondary variant) */}
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-jaia-green/10 group-hover:bg-jaia-green/20 transition-colors"></div>
      )}
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 bg-white/40 translate-x-[-150%] skew-x-12 group-hover:translate-x-[150%] transition-transform duration-500 ease-out z-20"></div>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {variant === 'primary' && <span className="w-2 h-2 bg-jaia-black animate-pulse"></span>}
        {children}
        {variant === 'secondary' && <span className="text-xs opacity-50 ml-1">{'>>'}</span>}
      </span>

      {/* Tech Decoration Borders */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" overflow="visible">
        {variant === 'secondary' && (
          <path 
            d="M 15 0 L 100% 0 L 100% calc(100% - 15) L calc(100% - 15) 100% L 0 100% L 0 15 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="opacity-50 group-hover:opacity-100 group-hover:stroke-jaia-neonGreen transition-all"
          />
        )}
      </svg>
      
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${baseStyles} ${variants[variant]} ${className} inline-flex`}
        style={{ clipPath }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ clipPath }}
    >
      {content}
    </motion.button>
  );
}
