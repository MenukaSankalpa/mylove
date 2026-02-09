'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

const HEART_COLORS = [
  '#7f1d1d', // dark red
  '#991b1b',
  '#dc2626', // red
  '#ef4444',
  '#f87171', // light red
  '#fb7185', // pinkish
];

export default function Background({ darkMode = false }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showPopups, setShowPopups] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);

    // Hide popup hearts after 4 seconds
    const timer = setTimeout(() => setShowPopups(false), 4000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const heartsCount = isMobile ? 12 : 20;

  // fixed popup hearts positions (percent)
  const popupHearts = [
    { left: '30%', top: '25%' },
    { left: '50%', top: '15%' },
    { left: '70%', top: '30%' },
  ];

  return (
    <div
      className={`fixed inset-0 -z-20 overflow-hidden ${
        darkMode ? 'bg-gray-900' : 'bg-red-50'
      }`}
    >
      {/* Floating hearts */}
      {Array.from({ length: heartsCount }).map((_, i) => {
        const baseSize = isMobile ? 20 : 40;
        const maxExtra = isMobile ? 40 : 60;
        const color =
          HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];

        return (
          <motion.div
            key={`float-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-20%',
              fontSize: `${baseSize + Math.random() * maxExtra}px`,
              color,
              opacity: 0.75,
              filter: 'drop-shadow(0 0 8px rgba(255,0,0,0.35))',
            }}
            animate={{
              y: '-150vh',
              rotate: [0, 12, -12, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          >
            <FaHeart />
          </motion.div>
        );
      })}

      {/* Popup hearts */}
      <AnimatePresence>
        {showPopups &&
          popupHearts.map((pos, i) => (
            <motion.div
              key={`popup-${i}`}
              className="absolute"
              style={{
                left: pos.left,
                top: pos.top,
                fontSize: isMobile ? '40px' : '60px',
                color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
                opacity: 0.8,
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 12px rgba(255,0,0,0.5))',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 1, 0.9, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              <FaHeart />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
