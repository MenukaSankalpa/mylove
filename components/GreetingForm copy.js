import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Building2 } from 'lucide-react';

const COMPANIES = [
  'Select Company',
  'CHL','MSTS','CCS','CES','CMS','CTL','OCN','CEYMED',
  'CLL','STL','CSL','CWS','CNT','CSV','CAL','CHE','CHO',
];

// fixed hearts (don’t re-render)
const BACK_HEARTS = Array.from({ length: 10 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 14 + Math.random() * 18,
  color: ['#ff4d6d','#ff758f','#ffd166','#c77dff','#ff6b6b']
    [Math.floor(Math.random() * 5)],
}));

export default function GreetingForm({ onDone }) {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState(COMPANIES[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [answeredYes, setAnsweredYes] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [showMail, setShowMail] = useState(false);
  const [error, setError] = useState('');
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  // progress fill (0–100)
  const progress = useMemo(() => {
    let p = 0;
    if (name.trim()) p += 33;
    if (companyName !== COMPANIES[0]) p += 33;
    if (message.trim()) p += 34;
    return p;
  }, [name, companyName, message]);

  const submit = async (e) => {
    e.preventDefault();

    if (!answeredYes) {
      setError('Please answer me 😭');
      return;
    }

    if (progress < 100) return;

    try {
      setLoading(true);
      await fetch('/api/greetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, companyName, message }),
      });

      confetti({ particleCount: 220, spread: 160, origin: { y: 0.6 } });
      onDone();
    } finally {
      setLoading(false);
    }
  };

  const handleYes = () => {
    setAnsweredYes(true);
    setShowMail(true);
    setTimeout(() => {
      setShowMail(false);
      setShowQuestion(false);
    }, 3000);
  };

  const moveNo = () => {
    setNoPos({
      x: Math.random() * 160 - 80,
      y: Math.random() * 120 - 60,
    });
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto w-full max-w-md sm:max-w-xl p-8 sm:p-10
      rounded-[2.5rem] overflow-hidden
      bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-red-500/30
      backdrop-blur-2xl border border-white/30
      shadow-[0_30px_90px_rgba(255,77,109,0.6)]
      space-y-6 text-white"
    >

      {/* BACKGROUND HEARTS */}
      {BACK_HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            color: h.color,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Heart size={h.size} />
        </motion.div>
      ))}

      {/* HEADER */}
      <h1
        className="text-center text-3xl sm:text-4xl"
        style={{ fontFamily: 'Pacifico, cursive' }}
      >
        You make <span className="text-pink-300 animate-pulse">my heart smile</span>
      </h1>

      {/* LOVE QUESTION */}
      {showQuestion && (
        <div className="text-center space-y-4">
          <p className="text-xl font-bold">Do you love me? 💕</p>

          <div className="relative flex justify-center gap-6 h-16">
            <button
              type="button"
              onClick={handleYes}
              className="px-6 py-3 rounded-full bg-pink-500 font-bold shadow-lg"
            >
              YES ❤️
            </button>

            <motion.button
              type="button"
              onMouseEnter={moveNo}
              animate={noPos}
              transition={{ type: 'spring', stiffness: 260 }}
              className="px-6 py-3 rounded-full bg-gray-500 cursor-not-allowed absolute"
            >
              NO 💔
            </motion.button>
          </div>
        </div>
      )}

      {/* MAIL POPUP */}
      <AnimatePresence>
        {showMail && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center
            bg-black/50 backdrop-blur-xl rounded-[2.5rem]"
          >
            <motion.div
              initial={{ rotateX: -90 }}
              animate={{ rotateX: 0 }}
              className="bg-white text-pink-600 p-10 rounded-3xl text-center shadow-2xl"
            >
              <p className="text-3xl">💌</p>
              <p className="text-xl font-bold mt-4">
                I love you too ❤️
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="text-center bg-red-500/20 p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* FORM */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full p-4 rounded-2xl bg-white/20 border border-white/30"
      />

      <div className="relative">
        <select
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-4 rounded-2xl bg-white/20 border border-white/30 appearance-none"
        >
          {COMPANIES.map((c, i) => (
            <option key={i} value={c} disabled={i === 0} className="text-black">
              {c}
            </option>
          ))}
        </select>
        <Building2 className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-300" />
      </div>

      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Love Message"
        className="w-full p-4 rounded-2xl bg-white/20 border border-white/30 resize-none"
      />

      {/* LIQUID SUBMIT BUTTON */}
      <button
        disabled={loading}
        className="relative w-full h-14 rounded-full bg-gray-500/30 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r
          from-pink-500 via-red-500 to-rose-500"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          style={{ width: `${progress}%` }}
        />
        <span className="relative z-10 font-bold text-xl">
          {loading ? 'Sending Love…' : 'Send Love ❤️'}
        </span>
      </button>

    </motion.form>
  );
}
