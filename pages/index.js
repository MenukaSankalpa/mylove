'use client';

import { useEffect, useState, useRef } from 'react';
import GreetingForm from '../components/GreetingForm';
import GreetingCard from '../components/GreetingCard';
import Background from '../components/Background';
import FestiveAnimation from '../components/FestiveAnimation';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);

  const trackAudioRef = useRef<HTMLAudioElement | null>(null);
  const submitAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Start audio on first user interaction
  const startTrackAudio = () => {
    if (!audioStarted) {
      if (!trackAudioRef.current) {
        trackAudioRef.current = new Audio('/track04.mp3'); // must be in public/
        trackAudioRef.current.loop = true;
        trackAudioRef.current.volume = 0.2;
      }
      trackAudioRef.current
        .play()
        .catch(() => console.log('User interaction required to play audio'));
      setAudioStarted(true);
    }
  };

  // Form submission handler
  const handleFormDone = () => {
    // Stop opening track
    if (trackAudioRef.current) trackAudioRef.current.pause();

    // Play submission track
    if (!submitAudioRef.current) {
      submitAudioRef.current = new Audio('/track02.mp3'); // must be in public/
      submitAudioRef.current.loop = true;
      submitAudioRef.current.volume = 0.2;
    }
    submitAudioRef.current
      .play()
      .catch(() => console.log('User interaction required to play audio'));

    setSubmitted(true);
    loadMessages();
  };

  return (
    <div className="relative min-h-screen px-4 py-10">
      {/* Background animations */}
      <Background darkMode={darkMode} />
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
          startAudio={startTrackAudio} // function triggered on first click inside form
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
