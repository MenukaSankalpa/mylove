import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Building2 } from 'lucide-react';

const COMPANIES = [
  'Select Company',
  'CHL','MSTS','CCS','CES','CMS','CTL','OCN','CEYMED',
  'CLL','STL','CSL','CWS','CNT','CSV','CAL','CHE','CHO',
];

// fixed background hearts
const BACK_HEARTS = Array.from({ length: 10 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 14 + Math.random() * 18,
  color: ['#ff4d6d','#ff758f','#ffd166','#c77dff','#ff6b6b'][Math.floor(Math.random() * 5)],
}));

export default function GreetingForm({ onDone }) {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState(COMPANIES[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [answeredYes, setAnsweredYes] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [showMail, setShowMail] = useState(false);
  const [mailOpened, setMailOpened] = useState(false);
  const [error, setError] = useState('');
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

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
  };

  const moveNo = () => {
    setNoPos({
      x: Math.random() * 160 - 80,
      y: Math.random() * 120 - 60,
    });
  };

  const openMail = () => {
    setMailOpened(true);
    setTimeout(() => {
      setShowMail(false);
      setShowQuestion(false);
    }, 4000);
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto w-full max-w-md sm:max-w-xl p-6 sm:p-10
      rounded-3xl overflow-hidden
      bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-red-500/30
      backdrop-blur-2xl border border-white/30
      shadow-[0_20px_60px_rgba(255,77,109,0.5)]
      space-y-6 text-white"
    >

      {/* BACKGROUND HEARTS */}
      {BACK_HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: `${h.x}%`, top: `${h.y}%`, color: h.color }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Heart size={h.size} />
        </motion.div>
      ))}

      {/* HEADER */}
      <h1
        className="text-center text-2xl sm:text-3xl md:text-4xl"
        style={{ fontFamily: 'Pacifico, cursive' }}
      >
        You Make <span className="text-pink-300 animate-pulse">My Heart Smile</span>
      </h1>

      {/* LOVE QUESTION */}
      <AnimatePresence>
        {showQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-4"
          >
            <p className="text-lg sm:text-xl font-bold">Do you love me? 💕</p>

            <div className="relative h-16 sm:h-20">
  {/* YES BUTTON – modern green */}
  <motion.button
    type="button"
    onClick={handleYes}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="
      absolute left-1/4
      px-4 sm:px-7 py-2 sm:py-3
      rounded-full font-bold
      text-sm sm:text-base text-white
      bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600
      shadow-[0_0_25px_rgba(34,197,94,0.7)]
      backdrop-blur-md
    "
  >
    YES 💚
  </motion.button>

  {/* NO BUTTON – modern red (escaping) */}
  <motion.button
    type="button"
    onMouseEnter={moveNo}
    animate={{ x: noPos.x, y: noPos.y }}
    transition={{ type: 'spring', stiffness: 260, damping: 14 }}
    className="
      absolute
      px-4 sm:px-7 py-2 sm:py-3
      rounded-full font-bold
      text-sm sm:text-base text-white
      bg-gradient-to-r from-red-500 via-rose-600 to-red-700
      shadow-[0_0_25px_rgba(239,68,68,0.6)]
      cursor-not-allowed
    "
  >
    NO 💔
  </motion.button>
</div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIL POPUP */}
      <AnimatePresence>
        {showMail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              onClick={openMail}
              className="cursor-pointer relative flex flex-col items-center justify-center"
            >
              {/* envelope front */}
              {!mailOpened && (
                <motion.div
                  className="w-40 sm:w-48 h-24 sm:h-32 bg-red-500 rounded-xl shadow-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl"
                  whileHover={{ scale: 1.1 }}
                >
                  💌 Click Me
                </motion.div>
              )}

              {/* envelope opened */}
              {mailOpened && (
                <motion.div
                  className="w-64 sm:w-72 h-40 sm:h-48 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center p-4 sm:p-6"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <p className="text-4xl sm:text-5xl mb-2">💖</p>
                  <p className="text-lg sm:text-xl text-pink-600 font-bold">
                    I love you too 💑
                  </p>
                  <p className="mt-2 text-gray-700 text-sm sm:text-base">
                    Your message has been received with all my heart! 💌
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="text-center bg-red-500/20 p-2 sm:p-3 rounded-xl text-sm sm:text-base">{error}</div>
      )}

      {/* FORM FIELDS */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full p-3 sm:p-4 rounded-2xl bg-white/20 border border-white/30 text-sm sm:text-base"
      />

      <div className="relative">
        <select
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-3 sm:p-4 rounded-2xl bg-white/20 border border-white/30 appearance-none text-sm sm:text-base"
        >
          {COMPANIES.map((c, i) => (
            <option key={i} value={c} disabled={i === 0} className="text-black">
              {c}
            </option>
          ))}
        </select>
        <Building2 className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-pink-300" />
      </div>

      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Love Message"
        className="w-full p-3 sm:p-4 rounded-2xl bg-white/20 border border-white/30 resize-none text-sm sm:text-base"
      />

      {/* OCEAN WAVE LIQUID SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading || progress < 100}
        className="relative w-full h-14 sm:h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg mt-2"
      >
        {/* Water/Ocean fill */}
        <motion.div
          className="absolute bottom-0 left-0 w-full rounded-full bg-gradient-to-t from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]"
          style={{ zIndex: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Overlay waves */}
          <motion.div
            className="absolute w-[200%] h-full bg-[rgba(255,255,255,0.15)] rounded-full"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          />
        </motion.div>

        {/* Button Text */}
        <span className="relative z-10 font-bold text-white drop-shadow-lg text-base sm:text-lg">
          {loading ? "Sending…" : "Send Love ❤️"}
        </span>
      </button>
    </motion.form>
  );
}
