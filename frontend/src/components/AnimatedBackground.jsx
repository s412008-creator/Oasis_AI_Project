// Old Money ambient background — muted warm tones, no neon
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] animate-blob"
           style={{ background: "rgba(184,151,90,0.04)" }} />
      <div className="absolute top-[30%] right-[-15%] w-[45%] h-[45%] rounded-full blur-[140px] animate-blob animation-delay-2000"
           style={{ background: "rgba(140,120,80,0.03)" }} />
      <div className="absolute bottom-[-15%] left-[25%] w-[55%] h-[55%] rounded-full blur-[160px] animate-blob animation-delay-4000"
           style={{ background: "rgba(100,90,60,0.03)" }} />
    </div>
  );
}
