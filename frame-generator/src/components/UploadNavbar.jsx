import DecryptedText from './DecryptedText';

export default function UploadNavbar() {
  return (
    <nav className="w-full bg-[#082B20] px-6 py-4 flex items-center justify-between border-b border-[#0B3B2B]">
      <div className="flex items-center gap-2 cursor-pointer select-none font-black text-2xl tracking-wide uppercase">
        <DecryptedText
          text="HACKER"
          animateOn="view"
          speed={40}
          maxIterations={12}
          className="text-[#F5C518] font-sans"
          encryptedClassName="text-[#F5C518]/60 font-mono"
        />

        <DecryptedText
          text="गोवा"
          animateOn="view"
          speed={40}
          maxIterations={12}
          useOriginalCharsOnly={true}
          className="text-[#E11D48] font-sans"
          encryptedClassName="text-[#E11D48]/60 font-sans"
        />

        <DecryptedText
          text="HOUSE"
          animateOn="view"
          speed={40}
          maxIterations={12}
          className="text-[#F5C518] font-sans"
          encryptedClassName="text-[#F5C518]/60 font-mono"
        />
      </div>
    </nav>
  );
}