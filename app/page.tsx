"use client"

import { useEffect, useState } from "react";

export default function Home() {
  type Mode = 'junior' | 'middle' | 'senior';

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [mode, setMode] = useState<Mode>('middle');

  const cheerMessages = [
    "You Can Do It!",
    "I believe in you!",
    "You're amazing!",
    "Keep going!",
    "Stay focused!",
    "You've got this!",
    "Never give up!",
    "You're unstoppable!",
    "One step at a time!",
    "Push through!",
    "You're doing great!",
    "Almost there!",
    "You’re stronger than you think!",
    "Keep shining!",
    "Proud of you!"
  ];

  const breakMessages = [
    "Stay hydrated!",
    "Snacks, maybe?",
    "Text me!",
    "I love you <3",
    "Stretch your legs!",
    "Take a deep breath!",
    "Stand up and move a bit!",
    "Grab some fresh air!",
    "Quick eye break – look away!",
    "Time for a mini dance party!",
    "Eat something yummy!",
    "Close your eyes for a minute!",
    "Pet a pet if you have one!",
    "Hug yourself – you deserve it!",
    "Smile at yourself in the mirror!"
  ];

  // Encouragement message updater
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if (isRunning) {
      const messages = isBreak ? breakMessages : cheerMessages;
      setEncouragement(messages[0]);
      let index = 1;

      messageInterval = setInterval(() => {
        setEncouragement(messages[index]);
        index = (index + 1) % messages.length;
      }, 4000);
    } else {
      setEncouragement("");
    }

    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Optional: Add a sound or alert here in the future
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getWorkTime = (mode: Mode): number => {
    switch (mode) {
      case 'junior': return 15 * 60;
      case 'middle': return 25 * 60;
      case 'senior': return 45 * 60;
      default: return 25 * 60;
    }
  };

  const getBreakTime = (mode: Mode): number => {
    switch (mode) {
      case 'junior': return 3 * 60;
      case 'middle': return 5 * 60;
      case 'senior': return 10 * 60;
      default: return 5 * 60;
    }
  };

  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ? getBreakTime(mode) : getWorkTime(mode));
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(isBreak ? getBreakTime(newMode) : getWorkTime(newMode));
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setTimeLeft(breakMode ? getBreakTime(mode) : getWorkTime(mode));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Pomodoro Timer
        </h1>
        
        {/* Mode Selection */}
        <div className="flex justify-center space-x-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${mode === 'junior' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-400/50 text-blue-100 hover:bg-blue-500'}`}
            onClick={() => handleModeChange('junior')}
          >
            Junior
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${mode === 'middle' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-400/50 text-blue-100 hover:bg-blue-500'}`}
            onClick={() => handleModeChange('middle')}
          >
            Middle
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${mode === 'senior' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-400/50 text-blue-100 hover:bg-blue-500'}`}
            onClick={() => handleModeChange('senior')}
          >
            Senior
          </button>
        </div>
        
        {/* Work/Break Controls */}
        <div className="flex justify-center space-x-2 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${!isBreak ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-red-400/50 text-red-100 hover:bg-red-500'}`}
            onClick={() => switchMode(false)}
          >
            Work
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${isBreak ? 'bg-green-600 text-white shadow-lg scale-105' : 'bg-green-400/50 text-green-100 hover:bg-green-500'}`}
            onClick={() => switchMode(true)}
          >
            Break
          </button>
        </div>
        
        {/* Timer Display */}
        <div className="text-center mb-6">
          <h2 className={`text-7xl font-mono font-bold ${isBreak ? 'text-green-300' : 'text-red-300'} drop-shadow-lg`}>
            {formatTime(timeLeft)}
          </h2>
        </div>
        
        {/* Encouragement Message */}
        {encouragement && (
          <p className="text-center text-lg text-white/80 italic mb-6 animate-fade-in">
            {encouragement}
          </p>
        )}
        
        {/* Start/Reset Button */}
        <div className="flex justify-center">
          <button
            className={`px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300 ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-xl hover:shadow-2xl active:scale-95`}
            onClick={handleClick}
          >
            {isRunning ? 'Reset' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}