import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import GalaxyOrbit from "./home/GalaxyOrbit";

const Hero: React.FC = () => {

  return (
    <div className="relative min-h-[90vh] bg-brand-slate overflow-hidden flex items-center justify-center pt-20">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/10 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Content Area */}
        <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            LEARN.
            <br />
            BUILD.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">
              CREATE.
            </span>
            <br />
            GROW.
          </h1>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8">
            <Link
              to="/register"
              className="relative inline-flex overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-[0_10px_20px_rgba(223,70,39,0.3)] group"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#df4627_0%,#F8FAFC_50%,#df4627_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#df4627] to-[#b3290e] px-8 py-4 text-sm font-bold tracking-widest font-mono uppercase text-white backdrop-blur-3xl transition-colors group-hover:opacity-95 border border-transparent">
                START LEARNING
              </span>
            </Link>

            <Link
              to="/services"
              className="relative inline-flex overflow-hidden rounded-xl p-[2px] focus:outline-none hover:-translate-y-1 transition-transform shadow-lg group"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#475569_50%,#ffffff_100%)] opacity-30" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-brand-slate px-8 py-4 text-sm font-bold tracking-widest font-mono uppercase text-white backdrop-blur-3xl transition-colors group-hover:bg-slate-800 border border-white/10">
                HIRE US
              </span>
            </Link>

            <Link
              to="/portfolio"
              className="text-white/60 font-semibold hover:text-white transition-colors px-4 py-4 flex items-center gap-2"
            >
              SEE OUR WORK <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Animated Orb/Solar System Area (CRITICAL HERO REQUIREMENT) */}
        <div className="w-full max-w-[600px] mx-auto lg:-translate-y-8 mt-12 lg:mt-0">
          <GalaxyOrbit />
        </div>
      </div>
    </div>
  );
};

export default Hero;
