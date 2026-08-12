import { useState } from 'react';
import heroImage from '../assets/hero.webp';
import UploadNavbar from './UploadNavbar';
import DecryptedText from './DecryptedText';
import TextPressure from './TextPressure';
import { Sparkles, Play, Code, GlassWater, Bike, Dices, Trees, Lock, X } from 'lucide-react';

export default function LandingPage({ onStart }) {
  const [showHypeModal, setShowHypeModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B3B2B] flex flex-col justify-between font-sans selection:bg-[#F5C518] selection:text-[#0B3B2B] overflow-x-hidden">
      <UploadNavbar />

      <div className="bg-[#0B3B2B] px-6 py-2 flex justify-end items-center gap-3 border-t border-[#0B3B2B]/20">
        <button 
          onClick={() => setShowHypeModal(true)}
          className="px-4 py-2 rounded-full text-xs font-bold bg-black/30 hover:bg-black/50 border border-[#F5F0E6]/30 text-white transition-all flex items-center gap-2 cursor-pointer font-mono"
        >
          <Play size={12} className="fill-white text-white" /> Check hype
        </button>
        <button 
          onClick={onStart} 
          className="px-5 py-2 rounded-full text-xs font-black bg-[#F5C518] hover:bg-yellow-400 text-[#0B3B2B] shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-mono"
        >
          <Sparkles size={14} className="fill-[#0B3B2B]" /> CREATE
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 w-full relative z-10">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#E5DEC9] shadow-sm">
          <img
            src={heroImage}
            alt="Hacker House Goa Hero Banner"
            width="1306"
            height="1205"
            fetchPriority="high"
            className="w-full h-auto object-cover select-none pointer-events-none"
          />

          <button 
            onClick={onStart}
            className="absolute bottom-[16%] right-[5%] w-[22%] h-[14%] rounded-2xl opacity-0 cursor-pointer transition-opacity hover:opacity-10 bg-white z-10"
            title="Create Your Frame"
          />
        </div>
      </div>

      <div className="pt-8 pb-16 px-4 md:px-8 relative z-20 flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="max-w-2xl mx-auto flex justify-center items-center gap-6 md:gap-10">
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F5F0E6] group-hover:bg-[#F5C518]/30 flex items-center justify-center text-[#0B3B2B] transition-colors shadow-sm">
              <Code size={22} />
            </div>
            <span className="text-[11px] font-black font-mono tracking-wider text-[#E11D48]">CODE</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F5F0E6] group-hover:bg-[#F5C518]/30 flex items-center justify-center text-[#0B3B2B] transition-colors shadow-sm">
              <GlassWater size={22} />
            </div>
            <span className="text-[11px] font-black font-mono tracking-wider text-[#E11D48]">CHILL</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F5F0E6] group-hover:bg-[#F5C518]/30 flex items-center justify-center text-[#0B3B2B] transition-colors shadow-sm">
              <Bike size={22} />
            </div>
            <span className="text-[11px] font-black font-mono tracking-wider text-[#0B3B2B]">RIDE</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F5F0E6] group-hover:bg-[#F5C518]/30 flex items-center justify-center text-[#0B3B2B] transition-colors shadow-sm">
              <Dices size={22} />
            </div>
            <span className="text-[11px] font-black font-mono tracking-wider text-[#0B3B2B]">PLAY</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-pointer transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F5F0E6] group-hover:bg-[#F5C518]/30 flex items-center justify-center text-[#0B3B2B] transition-colors shadow-sm">
              <Trees size={22} />
            </div>
            <span className="text-[11px] font-black font-mono tracking-wider text-[#0B3B2B]">REPEAT</span>
          </div>
        </div>

        <div className="max-w-2xl w-full bg-white border-2 border-[#E5DEC9] p-8 md:p-12 rounded-[32px] shadow-sm flex flex-col items-center text-center space-y-6">
          {/* w-full so TextPressure measures the card, not its own text */}
          <div className="w-full space-y-1">
            <TextPressure text="ONE FRAME." />
            <TextPressure text="YOUR STORY." />
          </div>

          <p className="text-sm md:text-base text-slate-600 font-medium max-w-md leading-relaxed">
            Choose a format, upload your photo and create your Hacker House Goa 2026 identity in seconds.
          </p>

          <div className="inline-block bg-[#E11D48] text-white text-sm font-mono font-black px-5 py-2.5 rounded-xl transform -rotate-1 shadow-md tracking-wider">
            <DecryptedText text="#FRAMEINGOA" animateOn="view" speed={40} />
          </div>

          <div className="w-full pt-4 space-y-3">
            <button 
              onClick={onStart} 
              className="w-full py-4 px-6 bg-[#0B3B2B] hover:bg-[#082b20] text-[#F5C518] font-black rounded-2xl text-base transition-all shadow-md hover:shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <Sparkles size={18} className="fill-[#F5C518]" /> CREATE YOUR FRAME
            </button>

            <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5 pt-1 font-mono">
              <Lock size={14} className="text-slate-400" />
              <span>No sign up. No log in. Just you and your frame.</span>
            </div>
          </div>
        </div>
      </div>

      {showHypeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#0B3B2B] rounded-3xl overflow-hidden border-2 border-[#F5C518] shadow-2xl">
            <div className="flex items-center justify-between p-4 px-6 border-b border-[#F5F0E6]/20 text-[#F5C518] font-mono">
              <span className="font-black text-sm flex items-center gap-2">
                <Play size={16} className="fill-[#F5C518]" /> HACKER HOUSE GOA 2026 • HYPE TEASER
              </span>
              <button 
                onClick={() => setShowHypeModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-black flex items-center justify-center">
              <video 
                src="https://hhgoa.com/Prehype.mp4" 
                controls 
                autoPlay 
                playsInline
                className="w-full h-auto max-h-[75vh] object-contain"
              >
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#0B3B2B] text-white text-center py-5 text-xs font-mono space-y-2">
        <p className="font-bold tracking-wider text-[#F5C518]">
          HACKER GOA HOUSE 2026 • <span className="text-[#E11D48]">#FRAMEINGOA</span>
        </p>
      </footer>
    </div>
  );
}