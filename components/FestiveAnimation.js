'use client'; // Ensures this only runs on the client

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

export default function FestiveAnimation({ show = true, darkMode = false }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!show) return null;

  const heartsCount = isMobile ? 50 : 100; // fewer hearts on mobile

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {Array.from({ length: heartsCount }).map((_, i) => {
        const baseSize = isMobile ? 20 : 30;
        const extraSize = isMobile ? 30 : 70;

        return (
          <motion.div
            key={`heart-${i}`}
            className={`absolute ${darkMode ? 'text-pink-400/90' : 'text-red-600/90'}`}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-20%',
              fontSize: `${baseSize + Math.random() * extraSize}px`,
              opacity: 0.7 + Math.random() * 0.3,
            }}
            animate={{
              y: '-150vh',
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          >
            <FaHeart />
          </motion.div>
        );
      })}
    </div>
  );
}
