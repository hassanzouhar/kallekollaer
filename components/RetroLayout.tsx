
import React from 'react';

interface RetroLayoutProps {
  children: React.ReactNode;
  title?: string;
  wallet?: number;
}

export const RetroLayout: React.FC<RetroLayoutProps> = ({ children, title, wallet }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#33ff00] font-mono overflow-hidden relative selection:bg-[#33ff00] selection:text-black">
      
      <style>{`
        @keyframes scanline {
          0% { background-position: 0 -100vh; }
          100% { background-position: 0 100vh; }
        }
        /* Removed heavy flicker for better UX */
        .text-glow {
          text-shadow: 0 0 2px rgba(51, 255, 0, 0.3);
        }
      `}</style>

      {/* 1. CRT Vignette - Reduced Opacity */}
      <div className="fixed inset-0 pointer-events-none z-50">
         <div className="absolute inset-0 border-[16px] border-[#111] rounded-[1rem] opacity-80"></div>
         <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] rounded-[1rem]"></div>
      </div>

      {/* 2. Static Scanlines - Very subtle now */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%]"></div>
      
      {/* 3. Moving Scanline - Slower and more transparent */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-gradient-to-b from-transparent via-[rgba(51,255,0,0.03)] to-transparent h-screen w-full animate-[scanline_8s_linear_infinite] bg-[length:100%_200%]"></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 h-screen flex flex-col pt-6">
        {/* Header */}
        <header className="border-b-2 border-green-800/50 pb-3 mb-4 flex justify-between items-end uppercase tracking-widest shrink-0">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-glow font-vt323 leading-none tracking-wide">NORDIC PUCK '98</h1>
            <p className="text-xs opacity-60 tracking-[0.2em] mt-1">U18 Elite Manager</p>
          </div>
          <div className="text-right hidden md:block text-xs font-mono opacity-80">
            <p>SYS.DATE: {new Date().toLocaleDateString()}</p>
            {wallet !== undefined && (
              <p className="text-green-400 font-bold text-lg mt-1">{wallet} PØKKS</p>
            )}
          </div>
        </header>

        {/* Content Frame */}
        <main className="flex-1 border-x border-green-900/30 bg-[#050a05] p-2 md:p-4 overflow-y-auto relative custom-scrollbar shadow-inner">
           {title && (
             <div className="flex justify-between items-center mb-6 border-b border-green-900/50 pb-2 sticky top-0 bg-[#050a05] z-30 pt-2">
               <div className="bg-green-900/20 text-green-300 px-3 py-1 inline-block font-bold text-lg border-l-4 border-green-600 uppercase">
                 {title}
               </div>
               {wallet !== undefined && (
                 <div className="md:hidden text-green-400 font-bold text-sm">
                   {wallet} PØKKS
                 </div>
               )}
             </div>
           )}
           {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-green-900/50 pt-2 mt-2 text-[10px] flex justify-between opacity-40 uppercase shrink-0 font-sans">
          <span>v1.4.0-CLEAN</span>
          <span>(C) 1998 SIM-NORDIC SOFT</span>
        </footer>
      </div>
    </div>
  );
};
