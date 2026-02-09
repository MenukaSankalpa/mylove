import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

export default function GreetingCard({ g, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      className="
        relative overflow-hidden
        rounded-3xl p-6
        bg-white/80 dark:bg-black/35
        backdrop-blur-xl
        border border-white/20
        shadow-[0_20px_50px_rgba(255,77,109,0.35)]
        text-black dark:text-white
      "
    >
      {/* BLINKING GLOW */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: index * 0.8,
          ease: 'easeInOut',
        }}
        style={{
          background:
            'linear-gradient(135deg, rgba(255,77,109,0.45), rgba(255,183,197,0.25))',
          filter: 'blur(18px)',
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold tracking-wide">
            {g.name}
          </h2>

          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <FaHeart className="text-red-500 drop-shadow-lg" />
          </motion.div>
        </div>

        <p className="text-xs sm:text-sm italic opacity-70 mt-1">
          {g.companyName}
        </p>

        <p className="mt-4 text-sm sm:text-base leading-relaxed">
          {g.message}
        </p>
      </div>
    </motion.div>
  );
}
