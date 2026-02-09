'use client'; // MUST be at the top

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import GreetingForm from '../components/GreetingForm';
import GreetingCard from '../components/GreetingCard';

// Dynamic import for client-only components
const Background = dynamic(() => import('../components/Background'), { ssr: false });
const FestiveAnimation = dynamic(() => import('../components/FestiveAnimation'), { ssr: false });

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);

  const trackAudioRef = useRef(null);
  const submitAudioRef = useRef(null);

  // Dark mode toggle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  // Load messages from MongoDB
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

  // Initialize audio references only on client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!trackAudioRef.current) {
      trackAudioRef.current = new Audio('/public/audio/track04.mp3');
      trackAudioRef.current.loop = true;
      trackAudioRef.current.volume = 0.2;
    }

    if (!submitAudioRef.current) {
      submitAudioRef.current = new Audio('/public/audio/track02.mp3');
      submitAudioRef.current.loop = true;
      submitAudioRef.current.volume = 0.2;
    }
  }, []);

  // Start audio on first user interaction
  const startTrackAudio = () => {
    if (!audioStarted && trackAudioRef.current) {
      trackAudioRef.current.play().catch(() => console.log('User interaction required to play audio'));
      setAudioStarted(true);
    }
  };

  // Handle form submission
  const handleFormDone = () => {
    if (trackAudioRef.current) trackAudioRef.current.pause();

    if (submitAudioRef.current) {
      submitAudioRef.current.play().catch(() => console.log('User interaction required to play audio'));
    }

    setSubmitted(true);
    loadMessages();
  };

  return (
    <div className="relative min-h-screen px-4 py-10">
      {/* Background & floating hearts */}
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
        <GreetingForm
          onDone={handleFormDone}
          darkMode={darkMode}
          startAudio={startTrackAudio} // trigger first audio
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {messages.map((msg, idx) => (
            <GreetingCard key={msg._id} g={msg} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
