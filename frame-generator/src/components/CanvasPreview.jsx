import { useEffect, useRef, useState } from 'react';
import { drawPass, passText, photoRect, PASS_W, PASS_H } from '../lib/drawPass';

const SCRAMBLE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&*@';
const SCRAMBLE_FRAMES = 12;

export default function CanvasPreview({ image, zoom = 1, offset, setOffset, formData, canvasRef }) {
  const target = passText(formData);
  const [text, setText] = useState(target);
  const drag = useRef(null);

  const { name, role, from, team } = target;

  useEffect(() => {
    const fields = { name, role, from, team };
    let frame = 0;
    let raf;

    const scramble = (value, progress) =>
      value
        .split('')
        .map((char, i) =>
          char === ' ' || char === '/' || i / value.length < progress
            ? char
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        )
        .join('');

    const step = () => {
      frame++;
      const progress = frame / SCRAMBLE_FRAMES;
      setText({
        name: scramble(fields.name, progress),
        role: scramble(fields.role, progress),
        from: scramble(fields.from, progress),
        team: scramble(fields.team, progress),
      });
      if (frame < SCRAMBLE_FRAMES) raf = requestAnimationFrame(step);
      else setText(fields);
    };

    step();
    return () => cancelAnimationFrame(raf);
  }, [name, role, from, team]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvas.width !== PASS_W) {
      canvas.width = PASS_W;
      canvas.height = PASS_H;
    }

    drawPass(canvas.getContext('2d'), { image, zoom, offset, text });
  }, [image, zoom, offset, text, canvasRef]);

  // Drag the photo inside its frame — phone snaps are rarely centred, and the
  // zoom slider alone can't fix that.
  const canPan = () => {
    if (!image) return false;
    const r = photoRect(image, zoom, offset);
    return r.limitX > 0.5 || r.limitY > 0.5;
  };

  const scaleOf = (canvas) => PASS_W / canvas.getBoundingClientRect().width;

  const onPointerDown = (e) => {
    if (!canPan()) return;
    drag.current = { x: e.clientX, y: e.clientY, from: offset };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    const s = scaleOf(e.currentTarget);
    setOffset({
      x: drag.current.from.x + (e.clientX - drag.current.x) * s,
      y: drag.current.from.y + (e.clientY - drag.current.y) * s,
    });
  };

  const onPointerUp = (e) => {
    if (!drag.current) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-3">
      <div className="w-full flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-[#0B3B2B] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE PREVIEW
        </span>
      </div>

      <div className="w-full bg-[#0B3B2B] p-2 rounded-2xl shadow-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: image ? 'none' : 'auto' }}
          className={`w-full h-auto block rounded-xl ${image ? 'cursor-grab active:cursor-grabbing' : ''}`}
        />
      </div>
    </div>
  );
}
