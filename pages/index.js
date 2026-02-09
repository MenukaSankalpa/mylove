// index.js (Home Component) - Simplified for grid layout.

import { useEffect, useState, useRef } from 'react';
import GreetingForm from '../components/GreetingForm';
import GreetingCard from '../components/GreetingCard';
import Background from '../components/Background';
import FestiveAnimation from '../components/FestiveAnimation';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const trackAudioRef = useRef(null);
  const submitAudioRef = useRef(null);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Load messages from MongoDB (no position calculation needed)
  const loadMessages = async () => {
    try {
      const res = await fetch('/api/greetings');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Play track01.mp3 when form opens
  useEffect(() => {
    if (!trackAudioRef.current) {
      trackAudioRef.current = new Audio('../track04.mp3');
      trackAudioRef.current.loop = true;
      trackAudioRef.current.volume = 0.2;
      trackAudioRef.current.play().catch(() => {});
    }
  }, []);

  const handleFormDone = () => {
    // Stop track01
    if (trackAudioRef.current) trackAudioRef.current.pause();

    // Play music.mp3 after submission
    if (!submitAudioRef.current) {
      submitAudioRef.current = new Audio('../track02.mp3');
      submitAudioRef.current.loop = true;
      submitAudioRef.current.volume = 0.2;
    }
    submitAudioRef.current.play().catch(() => {});

    setSubmitted(true);
    // Reload messages to show the new submission
    loadMessages();
  };

  return (
    <div className="relative min-h-screen px-4 py-10">
      <Background darkMode={darkMode} showSnow={!submitted} />
      <FestiveAnimation show={!submitted} darkMode={darkMode} />

      {/* Dark/Light mode toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-white/20 dark:bg-black/20 text-white hover:scale-105 transition"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Form or Messages */}
      {!submitted ? (
        <GreetingForm onDone={handleFormDone} darkMode={darkMode} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {messages.map((msg, idx) => (
            // No top, left, or darkMode props needed for grid layout
            <GreetingCard key={msg._id} g={msg} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}