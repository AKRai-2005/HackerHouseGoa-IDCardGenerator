import { Share2, ImageIcon, Type, X, AlertTriangle } from 'lucide-react';

export default function ShareModal({ preview, ready, sharing, localOnly, onWithCard, onWithoutCard, onClose }) {
  const busy = sharing || !ready;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-[#0B3B2B] rounded-3xl overflow-hidden border-2 border-[#F5C518] shadow-2xl">
        <div className="flex items-center justify-between p-4 px-6 border-b border-[#F5F0E6]/20 text-[#F5C518] font-mono">
          <span className="font-black text-sm flex items-center gap-2">
            <Share2 size={16} /> POST TO X
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {preview && (
            <img
              src={preview}
              alt="Your builder pass"
              className="w-full h-auto rounded-xl border border-[#F5F0E6]/20 shadow-lg"
            />
          )}

          <p className="text-xs font-mono font-bold text-[#E5DEC9] text-center">
            How do you want to post it?
          </p>

          <div className="space-y-2.5">
            <button
              onClick={onWithCard}
              disabled={busy}
              className="w-full p-4 rounded-2xl bg-[#F5C518] hover:bg-yellow-400 disabled:opacity-70 text-[#0B3B2B] text-left transition-all shadow-md cursor-pointer"
            >
              <span className="flex items-center gap-2 font-mono font-black text-sm">
                <ImageIcon size={16} />
                {busy ? 'PREPARING…' : 'POST WITH MY ID CARD'}
              </span>
              <span className="block mt-1 text-[11px] font-semibold opacity-70">
                Your pass goes out with the tweet.
              </span>
            </button>

            <button
              onClick={onWithoutCard}
              disabled={busy}
              className="w-full p-4 rounded-2xl bg-black/30 hover:bg-black/50 disabled:opacity-70 border border-[#F5F0E6]/30 text-white text-left transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2 font-mono font-black text-sm">
                <Type size={16} /> POST WITHOUT MY ID CARD
              </span>
              <span className="block mt-1 text-[11px] font-semibold opacity-60">
                Just the caption. Your photo is never uploaded.
              </span>
            </button>
          </div>

          {localOnly && (
            <p className="flex gap-2 text-[11px] font-mono font-bold text-[#F5C518]/90 bg-black/30 rounded-xl p-3 leading-relaxed">
              <AlertTriangle size={14} className="shrink-0 mt-px" />
              <span>
                Running on localhost — X can&apos;t reach this machine, so the card
                preview only works once deployed to a public URL.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
