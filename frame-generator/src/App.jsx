import { useState, useRef } from 'react';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import UploadSection from './components/UploadSection';
import CanvasPreview from './components/CanvasPreview';
import ShareModal from './components/ShareModal';
import { createShareLink, tweetIntent, toBlob, isLocalOrigin } from './lib/share';
import { passText } from './lib/drawPass';
import { FORMATS, DEFAULT_FORMAT } from './lib/formats';
import { builderMeta } from './lib/builderId';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [sharing, setSharing] = useState(false);
  const [share, setShare] = useState({ open: false, preview: null, file: null });
  const [format, setFormat] = useState(DEFAULT_FORMAT);
  const canvasRef = useRef(null);

  const spec = FORMATS[format];

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    from: '',
    team: '',
  });

  const handleStartBuilding = () => {
    setCurrentPage('builder');
  };

  const slug = () =>
    (formData.name || 'BUILDER')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '') || 'BUILDER';

  const meta = builderMeta(formData.name);
  const shareUrl = window.location.origin;

  // The preview scrambles text into place over ~12 frames. Exporting has to be
  // independent of where that animation happens to be — and of whether rAF is
  // being throttled — so both exports repaint with the settled text first.
  const renderFinal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    spec.draw(canvas.getContext('2d'), {
      image,
      zoom,
      offset,
      text: passText(formData),
      meta,
      shareUrl,
    });
    return canvas;
  };

  const handleDownload = () => {
    const canvas = renderFinal();
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `HH_GOA_2026_${slug()}_${format.toUpperCase()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  // Encoded when the dialog opens rather than on click, so the pass is already
  // in hand when a choice is made and the upload starts immediately.
  const openShare = async () => {
    const canvas = renderFinal();
    if (!canvas) return;

    setShare({ open: true, preview: null, file: null });
    const blob = await toBlob(canvas);
    setShare({
      open: true,
      preview: URL.createObjectURL(blob),
      file: new File([blob], `HH_GOA_2026_${slug()}_PASS.jpg`, { type: 'image/jpeg' }),
    });
  };

  const closeShare = () => {
    if (share.preview) URL.revokeObjectURL(share.preview);
    setShare({ open: false, preview: null, file: null });
  };

  const openTweet = (url, tab) => {
    const intent = tweetIntent(url);
    if (tab) tab.location.replace(intent);
    else window.location.href = intent;
  };

  // Always straight to X. The pass rides along as the link's preview card,
  // which keeps this one hop — handing the file to the OS share sheet instead
  // would make the user pick an app first.
  const shareWithCard = async () => {
    if (sharing) return;

    const tab = window.open('', '_blank');
    setSharing(true);
    try {
      openTweet(await createShareLink(share.file, formData), tab);
    } catch (err) {
      console.error(err);
      openTweet(window.location.origin, tab);
    } finally {
      setSharing(false);
      closeShare();
    }
  };

  const shareWithoutCard = () => {
    openTweet(window.location.origin, window.open('', '_blank'));
    closeShare();
  };

  if (currentPage === 'landing') {
    return <LandingPage onStart={handleStartBuilding} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0B3B2B] flex flex-col justify-between font-sans selection:bg-[#F5C518] selection:text-[#0B3B2B]">
      <Navbar onBack={() => setCurrentPage('landing')} />

  
      <main className="max-w-6xl mx-auto w-full p-4 md:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Section (Form & Upload) - p-4 on mobile, p-6 on desktop */}
        <section className="lg:col-span-5 bg-white border-2 border-[#E5DEC9] p-4 sm:p-6 rounded-3xl shadow-sm space-y-5">
          <div className="border-b-2 border-[#F5F0E6] pb-3">
            <h2 className="text-base font-black text-[#0B3B2B] font-mono uppercase">
              Builder Pass Details
            </h2>
          </div>

          <UploadSection
            image={image}
            setImage={setImage}
            zoom={zoom}
            setZoom={setZoom}
            setOffset={setOffset}
            formData={formData}
            setFormData={setFormData}
            onDownload={handleDownload}
            onShare={openShare}
            sharing={sharing}
            format={format}
            setFormat={setFormat}
          />
        </section>

        
        <section className="lg:col-span-7 bg-white border-2 border-[#E5DEC9] p-4 sm:p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center">
          <CanvasPreview
            image={image}
            zoom={zoom}
            offset={offset}
            setOffset={setOffset}
            formData={formData}
            canvasRef={canvasRef}
            spec={spec}
            meta={meta}
            shareUrl={shareUrl}
          />
        </section>
      </main>

      {share.open && (
        <ShareModal
          preview={share.preview}
          ready={!!share.file}
          sharing={sharing}
          localOnly={isLocalOrigin()}
          onWithCard={shareWithCard}
          onWithoutCard={shareWithoutCard}
          onClose={closeShare}
        />
      )}

      <footer className="text-center py-4 text-xs font-bold text-white bg-[#0B3B2B] font-mono">
        Hacker Goa House 2026 • Build In Goa, Ship from Paradise
      </footer>
    </div>
  );
}