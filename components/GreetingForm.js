import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Building2 } from "lucide-react";

const COMPANIES = [
  "Select Company",
  "CHL","MSTS","CCS","CES","CMS","CTL","OCN","CEYMED",
  "CLL","STL","CSL","CWS","CNT","CSV","CAL","CHE","CHO",
];

// Fixed floating hearts
const BACK_HEARTS = Array.from({ length: 8 }).map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 12 + Math.random() * 14,
  color: ["#ff4d6d","#ff758f","#ffd166","#c77dff","#ff6b6b"][Math.floor(Math.random() * 5)],
}));

export default function GreetingForm({ onDone }) {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState(COMPANIES[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [answeredYes, setAnsweredYes] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [showMail, setShowMail] = useState(false);
  const [mailOpened, setMailOpened] = useState(false);
  const [error, setError] = useState("");
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
      setError("Please answer me 😭");
      return;
    }
    if (progress < 100) return;

    try {
      setLoading(true);
      await fetch("/api/greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, companyName, message }),
      });

      confetti({ particleCount: 180, spread: 140, origin: { y: 0.6 } });
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
      x: Math.random() * 120 - 60,
      y: Math.random() * 80 - 40,
    });
  };

  const openMail = () => {
    setMailOpened(true);
    setTimeout(() => {
      setShowMail(false);
      setShowQuestion(false);
    }, 3500);
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="
      relative mx-auto w-full max-w-md
      px-4 sm:px-8 py-6 sm:py-10
      rounded-3xl overflow-hidden
      bg-gradient-to-br from-pink-500/30 via-rose-400/20 to-red-500/30
      backdrop-blur-2xl border border-white/30
      shadow-[0_15px_40px_rgba(255,77,109,0.4)]
      space-y-6 text-white
      "
    >
      {/* Floating Hearts */}
      {BACK_HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: `${h.x}%`, top: `${h.y}%`, color: h.color }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Heart size={h.size} />
        </motion.div>
      ))}

      {/* HEADER */}
      <h1
        className="text-center text-2xl sm:text-3xl font-semibold"
        style={{ fontFamily: "Pacifico, cursive" }}
      >
        You Make{" "}
        <span className="text-pink-300 animate-pulse">
          My Heart Smile
        </span>
      </h1>

      {/* LOVE QUESTION */}
      <AnimatePresence>
        {showQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-5"
          >
            <p className="text-lg font-bold">
              Do you love me? 💕
            </p>

            {/* MOBILE SAFE BUTTON WRAPPER */}
            <div className="relative flex justify-center gap-6 h-16">
              
              {/* YES */}
              <motion.button
                type="button"
                onClick={handleYes}
                whileTap={{ scale: 0.95 }}
                className="
                min-w-[90px] h-12
                rounded-full font-bold text-white
                bg-gradient-to-r from-emerald-400 to-emerald-600
                shadow-lg active:scale-95
                "
              >
                YES 💚
              </motion.button>

              {/* NO */}
              <motion.button
                type="button"
                onMouseEnter={moveNo}
                onClick={moveNo}
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 200 }}
                className="
                min-w-[90px] h-12
                rounded-full font-bold text-white
                bg-gradient-to-r from-red-500 to-red-700
                shadow-lg
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
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              onClick={openMail}
              className="cursor-pointer text-center"
            >
              {!mailOpened ? (
                <div className="w-40 h-24 bg-red-500 rounded-xl shadow-xl flex items-center justify-center text-white font-bold">
                  💌 Tap Me
                </div>
              ) : (
                <div className="w-64 max-w-[90vw] bg-white rounded-2xl shadow-xl p-6 text-center">
                  <p className="text-4xl mb-2">💖</p>
                  <p className="text-pink-600 font-bold text-lg">
                    I love you too 💑
                  </p>
                  <p className="mt-2 text-gray-700 text-sm">
                    Your message was received with love 💌
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="text-center bg-red-500/20 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* INPUTS */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        className="w-full h-12 px-4 rounded-2xl bg-white/20 border border-white/30"
      />

      <div className="relative">
        <select
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-white/20 border border-white/30 appearance-none"
        >
          {COMPANIES.map((c, i) => (
            <option key={i} value={c} disabled={i === 0} className="text-black">
              {c}
            </option>
          ))}
        </select>
        <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300" />
      </div>

      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your Love Message"
        className="w-full p-4 rounded-2xl bg-white/20 border border-white/30 resize-none"
      />

      {/* LIQUID SUBMIT */}
      <button
        type="submit"
        disabled={loading || progress < 100}
        className="relative w-full h-14 rounded-full overflow-hidden border border-white/30 shadow-lg"
      >
        <motion.div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-800 via-blue-500 to-blue-300"
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative z-10 font-bold">
          {loading ? "Sending…" : "Send Love ❤️"}
        </span>
      </button>
    </motion.form>
  );
}
