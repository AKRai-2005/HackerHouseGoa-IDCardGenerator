import { useState } from 'react';
import { Upload, Download, Share2, ZoomIn, RefreshCw } from 'lucide-react';
import { decodeImageFile } from '../lib/image';
import { FORMATS } from '../lib/formats';

export default function UploadSection({
  image,
  setImage,
  zoom,
  setZoom,
  setOffset,
  formData,
  setFormData,
  onDownload,
  onShare,
  sharing,
  format,
  setFormat,
}) {
  const [status, setStatus] = useState(null);

  const loadFile = async (file) => {
    if (!file) return;
    setStatus({ busy: true, text: 'Reading photo…' });
    try {
      const decoded = await decodeImageFile(file);
      setImage((prev) => {
        prev?.close?.();
        return decoded;
      });
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setStatus(null);
    } catch (err) {
      setStatus({ error: true, text: err.message });
    }
  };

  const handleImageChange = (e) => {
    loadFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    loadFile(e.dataTransfer.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dropLabel = status
    ? status.text
    : image
      ? 'Change Photo'
      : 'Choose a file or drop it here';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold text-[#0B3B2B] uppercase">
          Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(FORMATS).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFormat(key)}
              className={`py-2 px-3 rounded-xl text-[11px] font-mono font-black border-2 transition-all cursor-pointer ${
                format === key
                  ? 'bg-[#0B3B2B] border-[#0B3B2B] text-[#F5C518]'
                  : 'bg-[#F5F0E6]/30 border-[#E5DEC9] text-[#0B3B2B] hover:bg-[#F5F0E6]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold text-[#0B3B2B] uppercase">
          Upload Photo
        </label>
        
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative border-2 border-dashed border-[#E5DEC9] rounded-2xl p-4 bg-[#F5F0E6]/50 hover:bg-[#F5F0E6] transition-colors text-center cursor-pointer"
        >
          <input
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-1">
            <Upload className="w-6 h-6 text-[#0B3B2B]" />
            <span
              className={`text-xs font-bold font-mono ${
                status?.error ? 'text-[#E11D48]' : 'text-[#0B3B2B]'
              }`}
            >
              {dropLabel}
            </span>
          </div>
        </div>
      </div>

      {image && (
        <div className="bg-[#F5F0E6]/60 p-3 rounded-xl space-y-2 border border-[#E5DEC9]">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-[#0B3B2B]">
            <span className="flex items-center gap-1.5">
              <ZoomIn size={14} /> PHOTO ZOOM
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#E11D48]">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
                className="text-[10px] text-slate-500 hover:text-black underline flex items-center gap-0.5"
              >
                <RefreshCw size={10} /> Reset
              </button>
            </div>
          </div>

          <input 
            type="range" 
            min="0.5" 
            max="2.5" 
            step="0.05" 
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[#0B3B2B] cursor-pointer h-1.5 bg-[#E5DEC9] rounded-lg appearance-none"
          />
        </div>
      )}

      <div className="space-y-3 pt-2">
        <div>
          <label className="block text-xs font-mono font-bold text-[#0B3B2B] uppercase mb-1">
            Name
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Cristiano Ronaldo"
            className="w-full px-3 py-2 border-2 border-[#E5DEC9] rounded-xl text-sm font-medium focus:outline-none focus:border-[#0B3B2B] bg-[#F5F0E6]/30"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#0B3B2B] uppercase mb-1">
            Role
          </label>
          <input 
            type="text" 
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g. Full-Stack Developer"
            className="w-full px-3 py-2 border-2 border-[#E5DEC9] rounded-xl text-sm font-medium focus:outline-none focus:border-[#0B3B2B] bg-[#F5F0E6]/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono font-bold text-[#0B3B2B] uppercase mb-1">
              From
            </label>
            <input 
              type="text" 
              name="from"
              value={formData.from}
              onChange={handleInputChange}
              placeholder="e.g. Lisbon"
              className="w-full px-3 py-2 border-2 border-[#E5DEC9] rounded-xl text-sm font-medium focus:outline-none focus:border-[#0B3B2B] bg-[#F5F0E6]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#0B3B2B] uppercase mb-1">
              Team
            </label>
            <input 
              type="text" 
              name="team"
              value={formData.team}
              onChange={handleInputChange}
              placeholder="e.g. Al Nassr"
              className="w-full px-3 py-2 border-2 border-[#E5DEC9] rounded-xl text-sm font-medium focus:outline-none focus:border-[#0B3B2B] bg-[#F5F0E6]/30"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <button 
          onClick={onDownload}
          className="w-full py-3 px-4 bg-[#0B3B2B] hover:bg-[#082b20] text-[#F5C518] font-mono font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={16} /> DOWNLOAD PASS
        </button>

        <button
          onClick={onShare}
          disabled={sharing}
          className="w-full py-3 px-4 bg-black hover:bg-zinc-800 disabled:opacity-70 text-white font-mono font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 size={16} /> {sharing ? 'PREPARING…' : 'SHARE TO X'}
        </button>
      </div>
    </div>
  );
}