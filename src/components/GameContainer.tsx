import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SCENES, SceneId, Choice } from '../types';
import { Avatar } from './Avatar';
import { sound } from '../utils/sound';
import { Trophy, MessageSquare, ShieldCheck, Users, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { speak, stopSpeech } from '../services/speechService';
import { useRef } from 'react';
import confetti from 'canvas-confetti';

export const GameContainer: React.FC = () => {
  const [currentSceneId, setCurrentSceneId] = useState<SceneId>('splash');
  const [scores, setScores] = useState({ communication: 0, fairness: 0, leadership: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentScene = SCENES[currentSceneId];

  useEffect(() => {
    if (currentSceneId !== 'splash' && currentSceneId !== 'score') {
      sound.playPop();
    }
  }, [currentSceneId]);

  useEffect(() => {
    const playDialogueSpeech = () => {
      if (currentSceneId === 'splash' || currentSceneId === 'score' || isMuted) {
        stopSpeech();
        return;
      }

      const character = currentScene.character || 'narrator';
      speak(currentScene.dialogue, character);
    };

    // Small delay to ensure smooth transitions
    const timeoutId = setTimeout(playDialogueSpeech, 150);

    return () => {
      clearTimeout(timeoutId);
      stopSpeech();
    };
  }, [currentSceneId, currentScene.dialogue, isMuted]);

  useEffect(() => {
    // Timer removed to allow manual click-to-continue
  }, [currentSceneId]);

  useEffect(() => {
    if (currentSceneId === 'score') {
      const total = scores.communication + scores.fairness + scores.leadership;
      if (total > 12) {
        sound.playClapping();
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    }
  }, [currentSceneId, scores]);

  const handleChoice = (choice: Choice) => {
    sound.playClick();
    setScores(prev => ({
      communication: prev.communication + choice.impact.communication,
      fairness: prev.fairness + choice.impact.fairness,
      leadership: prev.leadership + choice.impact.leadership,
    }));
    setCurrentSceneId(choice.nextScene);
  };

  const getBackgroundImage = () => {
    switch (currentScene.background) {
      case 'meeting': return '/meeting_room_bg.png';
      case 'manager_office': return '/manager_office_bg.png';
      case 'office': return '/office_bg.png';
      default: return '';
    }
  };

  const renderSplash = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-950 bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-slate-900/60" style={{ backgroundImage: "url('/ubl-building.png')" }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-12 relative z-10 w-full max-w-6xl backdrop-blur-sm bg-black/30 rounded-[3rem] border border-white/10 shadow-2xl"
      >

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-8xl font-black mb-4 tracking-tighter text-white drop-shadow-2xl"
        >
          BANK<span className="text-blue-400">CONFLICT</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="h-px w-12 bg-white/20" />
          <p className="text-sm font-black uppercase tracking-[0.5em] text-white/40">Leadership Simulation</p>
          <div className="h-px w-12 bg-white/20" />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={() => { sound.playSuccess(); setCurrentSceneId('intro'); }}
          className="group relative px-20 py-6 bg-white text-slate-950 font-black rounded-2xl text-2xl transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity" />
          START EXPERIENCE
        </motion.button>
      </motion.div>
    </div>
  );

  const renderIntro = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6 bg-slate-950 bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-slate-900/80" style={{ backgroundImage: "url('/manager_office_bg.png')" }}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-16 max-w-4xl mx-auto relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-xl border border-white/20"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Users className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 fill-current" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">Mission Briefing</h2>
          </div>

          <p className="text-3xl leading-relaxed text-white/90 font-medium italic border-l-8 border-blue-500 pl-8">
            "{SCENES.intro.dialogue}"
          </p>

          <div className="grid grid-cols-2 gap-6 pt-6">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-2">Objective 01</h4>
              <p className="text-sm text-white/60">Resolve the tension between Ali and Sara.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">Objective 02</h4>
              <p className="text-sm text-white/60">Maintain bank productivity and team morale.</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playSuccess(); setCurrentSceneId('announcement'); }}
            className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl text-2xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95 border-b-4 border-black/30"
          >
            BEGIN SIMULATION
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderScore = () => {
    const total = scores.communication + scores.fairness + scores.leadership;
    const isExcellent = total > 12;
    const rating = isExcellent ? 'EXCELLENT' : total > 8 ? 'STABLE' : 'CRITICAL';
    const accentTheme = isExcellent ? 'from-emerald-400 to-teal-500' : total > 8 ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-red-500';
    const bgGlow = isExcellent ? 'bg-emerald-500/20' : total > 8 ? 'bg-amber-500/20' : 'bg-rose-500/20';

    const StatCard = ({ title, score, icon, delay }: any) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring" }}
        className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex flex-col items-center hover:bg-black/60 transition-colors group"
      >
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-white/70 group-hover:text-white border border-white/5">
          {icon}
        </div>
        <div className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 mb-1">{title}</div>
        <div className="text-4xl font-black text-white">{score}</div>
      </motion.div>
    );

    return (
      <div
        className="fixed inset-0 p-4 z-50 bg-slate-950 bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-slate-950/80 before:backdrop-blur-xl overflow-y-auto flex"
        style={{ backgroundImage: "url('/office_bg.png')" }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl m-auto relative z-10 flex flex-col items-center py-6"
        >
          {/* Animated Glow Behind Text */}
          <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] blur-[150px] rounded-full pointer-events-none ${bgGlow}`} />

          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] w-full relative overflow-hidden outline outline-1 outline-white/5">

            {/* Corner acccents */}
            <div className={`absolute top-0 left-0 w-24 h-1 bg-gradient-to-r ${accentTheme}`} />
            <div className={`absolute top-0 left-0 w-1 h-24 bg-gradient-to-b ${accentTheme}`} />
            <div className={`absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-l ${accentTheme}`} />
            <div className={`absolute bottom-0 right-0 w-1 h-24 bg-gradient-to-t ${accentTheme}`} />

            <div className="flex flex-col items-center text-center mb-8 relative z-10">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex items-center justify-center mb-5 bg-gradient-to-br ${accentTheme} shadow-[0_0_50px_rgba(0,0,0,0.4)]`}
              >
                <Trophy className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-md" />
              </motion.div>

              <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-white/50 mb-3">Final Leadership Evaluation</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${accentTheme} drop-shadow-sm`}
              >
                {rating}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10 w-full max-w-3xl mx-auto">
              <StatCard title="Communication" score={scores.communication} icon={<MessageSquare className="w-5 h-5" />} delay={0.6} />
              <StatCard title="Fairness" score={scores.fairness} icon={<ShieldCheck className="w-5 h-5" />} delay={0.7} />
              <StatCard title="Leadership" score={scores.leadership} icon={<Users className="w-5 h-5" />} delay={0.8} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col md:flex-row gap-4 justify-center relative z-10"
            >
              <button
                onClick={() => window.location.reload()}
                className="group relative px-8 py-4 md:px-10 md:py-4 bg-white text-slate-950 rounded-2xl font-black text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5 relative z-10" /> 
                <span className="relative z-10">RESTART SIMULATION</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleNext = () => {
    if (currentScene.autoNext && !currentScene.choices) {
      setCurrentSceneId(currentScene.autoNext);
    }
  };

  if (currentSceneId === 'splash') return renderSplash();
  if (currentSceneId === 'intro') return renderIntro();
  if (currentSceneId === 'score') return renderScore();

  return (
    <div
      className={`fixed inset-0 bg-slate-950 bg-cover bg-center transition-all duration-1000 flex flex-col overflow-hidden cursor-pointer before:content-[''] before:absolute before:inset-0 before:bg-black/30`}
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      onClick={handleNext}
    >
      {/* Background Speaker Image */}
      <AnimatePresence>
        {currentScene.character && currentScene.character !== 'narrator' && (
          <motion.div
            key={`bg-${currentScene.character}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.3, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className={`absolute bottom-0 ${currentScene.layout === 'dual' ? 'right-0 w-[50rem]' : 'left-[5%] w-[40rem] scale-x-[-1]'} h-[50rem] pointer-events-none origin-bottom z-0 drop-shadow-[0_0_50px_rgba(0,0,0,1)] mix-blend-luminosity grayscale`}
          >
            <img src={`/${currentScene.character}.png`} alt={currentScene.character} className="w-full h-full object-contain object-bottom filter blur-[2px]" />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Stage (Characters) */}
      <div className="absolute inset-x-0 bottom-0 top-[10%] flex justify-center px-6 md:px-20 z-10 overflow-hidden pointer-events-none">
        {/* <AnimatePresence mode="wait">
          {currentScene.layout === 'dual' ? (
            <div className="w-full max-w-7xl relative h-full">
              <Avatar
                key={`${currentSceneId}-left`}
                character={currentScene.character!}
                emotion={currentScene.emotion}
                side="left"
                isTalking={true}
              />
              <Avatar
                key={`${currentSceneId}-right`}
                character={currentScene.secondaryCharacter!}
                emotion={currentScene.secondaryEmotion}
                side="right"
                isTalking={false}
              />
            </div>
          ) : (
            <div className="w-full max-w-7xl relative h-full">
              {currentScene.character && (
                <Avatar
                  key={currentScene.character}
                  character={currentScene.character}
                  emotion={currentScene.emotion}
                  isTalking={true}
                />
              )}
            </div>
          )}
        </AnimatePresence> */}
      </div>

      {/* Dialogue & Choices Area */}
      <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-auto">
        {/* Gradient shadow to blend character bottoms */}
        <div className="h-48 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-[-1]" />

        <div className="p-6 md:p-12 pb-8 md:pb-16 flex flex-col items-center justify-end gap-6 w-full h-full relative">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl flex flex-col items-center gap-6 mt-auto relative"
          >
            {/* Media Rendering */}
            {(currentScene.type === 'image' || currentScene.type === 'video' || currentScene.type === 'voice') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-3xl mx-auto"
              >
                {currentScene.type === 'image' && currentScene.mediaUrl && (
                  <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black/50 backdrop-blur-sm pointer-events-auto">
                    <img src={currentScene.mediaUrl} alt="Scene Media" className="w-full max-h-[35vh] object-cover" />
                  </div>
                )}
                {currentScene.type === 'video' && currentScene.mediaUrl && (
                  <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black/50 backdrop-blur-sm pointer-events-auto">
                    <video src={currentScene.mediaUrl} autoPlay loop muted playsInline className="w-full max-h-[35vh] object-cover" />
                  </div>
                )}
                {currentScene.type === 'voice' && currentScene.mediaPrompt && (
                  <div className="p-6 md:p-8 bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex items-center gap-6 pointer-events-auto">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center relative shrink-0">
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                      <Volume2 className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-black uppercase text-blue-400 tracking-widest">Voicemail Message</div>
                      <p className="text-white/90 italic font-medium text-lg leading-relaxed">{currentScene.mediaPrompt}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <div className="w-full max-w-5xl relative">
              {/* Speaker Label */}
              {currentScene.character && currentScene.character !== 'narrator' && (
                <div className="absolute -top-7 md:-top-9 left-6 md:left-12 bg-blue-600 text-white px-6 md:px-8 py-2 rounded-t-2xl font-black text-sm md:text-lg uppercase tracking-widest shadow-lg z-10 border-t border-x border-blue-400/30">
                  {currentScene.character === 'ali' ? 'Ali Khan' : currentScene.character === 'sara' ? 'Sara Ahmed' : 'Mr. Ahmed'}
                </div>
              )}
  
              <div className="bg-slate-900/80 backdrop-blur-2xl p-8 md:p-12 md:py-16 rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <p className="text-xl md:text-3xl font-medium leading-relaxed italic text-white drop-shadow-md">
                  "{currentScene.dialogue}"
                </p>
              </div>
            </div>
          </motion.div>

          {/* Choices container sits safely below dialogue */}
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl z-20">
            {currentScene.choices?.map((choice, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={(e) => { e.stopPropagation(); handleChoice(choice); }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(79,70,229,0.8)] active:scale-95 border border-white/20"
              >
                {choice.text}
              </motion.button>
            ))}

            {!currentScene.choices && currentScene.autoNext && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-white/60 text-xs md:text-sm font-black uppercase tracking-[0.4em] flex items-center gap-3 pt-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Tap anywhere to continue
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* HUD (Top layer) */}
      <div className="absolute top-6 md:top-8 left-6 md:left-8 right-6 md:right-8 flex justify-between items-start z-40 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-5 py-2.5 flex items-center gap-3 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_12px_#60A5FA]" />
          <span className="text-xs font-black text-white uppercase tracking-[0.3em]">
            {currentScene.background.replace('_', ' ')}
          </span>
        </div>

        {/* Top Right Controls & Progress */}
        <div className="hidden md:flex flex-col items-end gap-3 pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md px-5 py-2.5 flex items-center gap-4 rounded-2xl border border-white/10 shadow-lg">
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="hover:scale-110 transition-transform text-white/70 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="w-px h-5 bg-white/20" />

            <div className="flex items-center gap-4">
              <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                Progress
              </div>
              <div className="w-32 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Object.keys(SCENES).indexOf(currentSceneId) / (Object.keys(SCENES).length - 1)) * 100}%` }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_#3B82F6]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
