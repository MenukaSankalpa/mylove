'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import GreetingForm from '../components/GreetingForm';
import GreetingCard from '../components/GreetingCard';

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
    document.documentElement.classList.toggle('dark', darkMode);
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

  // Initialize audio on client only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!trackAudioRef.current) {
      trackAudioRef.current = new Audio('/audio/track04.mp3');
      trackAudioRef.current.loop = true;
      trackAudioRef.current.volume = 0.2;
    }

    if (!submitAudioRef.current) {
      submitAudioRef.current = new Audio('/audio/track02.mp3');
      submitAudioRef.current.loop = true;
      submitAudioRef.current.volume = 0.2;
    }

    // Attempt autoplay on load
    trackAudioRef.current.play().catch(() => {
      console.log('Autoplay blocked, will start on first click');
    });
  }, []);

  // Start audio on first click if blocked
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!audioStarted && trackAudioRef.current) {
        trackAudioRef.current.play().catch(() => {});
        setAudioStarted(true);
      }
    };
    window.addEventListener('click', handleUserInteraction, { once: true });
    return () => window.removeEventListener('click', handleUserInteraction);
  }, [audioStarted]);

  const handleFormDone = () => {
    // Stop opening track
    if (trackAudioRef.current) trackAudioRef.current.pause();

    // Play submission track
    if (submitAudioRef.current) {
      submitAudioRef.current.play().catch(() => {});
    }

    setSubmitted(true);
    loadMessages();
  };

  return (
    <div className="relative min-h-screen px-4 py-10">
      <Background darkMode={darkMode} showSnow={!submitted} />
      <FestiveAnimation show={!submitted} darkMode={darkMode} />

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-white/20 dark:bg-black/20 text-white hover:scale-105 transition"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {!submitted ? (
        <GreetingForm
          onDone={handleFormDone}
          darkMode={darkMode}
          startAudio={() => {
            if (!audioStarted && trackAudioRef.current) {
              trackAudioRef.current.play().catch(() => {});
              setAudioStarted(true);
            }
          }}
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
