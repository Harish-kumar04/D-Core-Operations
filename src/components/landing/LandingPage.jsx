import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Cpu,
  Globe,
  Layers,
  Activity,
  CheckCircle2,
  Terminal
} from 'lucide-react';

export const LandingPage = () => {
  const { navigate, state } = useApp();

  const preloadedProjects = [
    {
      name: 'Periyar.net',
      url: 'https://periyar.net/',
      category: 'Digital Archive',
      description: 'Digital archive and educational repository platform for Periyar thought, historical literature, and public research.'
    },
    {
      name: 'Makkalveeran.com',
      url: 'https://makkalveeran.com/',
      category: 'Web Platform',
      description: 'Community engagement platform and digital publication network for public outreach and announcements.'
    },
    {
      name: 'Kalaignar.org',
      url: 'https://kalaignar.org/',
      category: 'Core Infrastructure',
      description: 'Official memorial & legacy portal showcasing historical contributions, digitized speeches, and interactive timeline.'
    },
    {
      name: 'TVK Files',
      url: 'https://tvkfiles.org/',
      category: 'Data & Storage',
      description: 'Centralized digital asset management, document storage, and media repository system for verified operational assets.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-100 selection:text-dcore-red">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden dcore-hero-gradient">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-dcore-red text-xs font-bold uppercase tracking-wider shadow-sm animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DMK Digital & IT Operations Command</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              D-CORE <span className="dcore-gradient-text">OPERATIONS</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-dcore-red tracking-wide">
              Technology at the Core. Operations at Scale.
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Building, operating, and evolving the digital technology ecosystem for DMK requirements, web platforms, and IT infrastructure.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('dashboard')}
              className="w-full sm:w-auto bg-gradient-to-r from-dcore-red to-dcore-maroon text-white px-8 py-4 rounded-2xl font-extrabold text-sm shadow-xl shadow-dcore-red/25 flex items-center justify-center gap-3 hover:scale-105 transition-all"
            >
              <span>Enter Operations Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#ecosystem"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-7 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Our Platforms</span>
            </a>
          </div>

        </div>
      </section>

      {/* OUR DIGITAL ECOSYSTEM Section */}
      <section id="ecosystem" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-dcore-red bg-red-50 px-3 py-1 rounded-full">
            OUR DIGITAL ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            DMK Core Platforms & Digital Repositories
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Maintained and operated under strict SLA, high-availability infrastructure, and security standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {preloadedProjects.map((proj, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-dcore-red/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {proj.category}
                  </span>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-dcore-red transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-dcore-red transition-colors">
                  {proj.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-slate-400">{proj.url}</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW WE WORK Section */}
      <section className="py-16 px-4 lg:px-8 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-dcore-red bg-white px-3 py-1 rounded-full border border-slate-200">
              HOW WE WORK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Operational Delivery Lifecycle
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              From requirement capture to continuous operational monitoring.
            </p>
          </div>

          {/* Process Flowchart */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center font-bold">
            {[
              { step: '01', title: 'IDEA', desc: 'Capture & evaluate tech innovation' },
              { step: '02', title: 'PLAN', desc: 'Scope, estimate & assign ownership' },
              { step: '03', title: 'BUILD', desc: 'Develop platforms & security rules' },
              { step: '04', title: 'DEPLOY', desc: 'Failover, DNS & production audit' },
              { step: '05', title: 'OPERATE', desc: '24/7 NOC monitoring & backups' },
              { step: '06', title: 'IMPROVE', desc: 'Optimization & user feedback' }
            ].map((st, i) => (
              <div key={i} className="glass-card p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-mono font-extrabold text-dcore-red bg-red-50 px-2 py-0.5 rounded">
                  {st.step}
                </span>
                <h4 className="text-sm font-black text-slate-900">{st.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-dcore-maroon text-white space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            D-CORE OPERATIONS CENTER
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Ready to inspect live current works, manage the work queue, or convert future ideas into projects?
          </p>
          <button
            onClick={() => navigate('dashboard')}
            className="bg-dcore-red hover:bg-dcore-red-hover text-white px-8 py-3.5 rounded-xl font-extrabold text-xs shadow-lg shadow-dcore-red/30 inline-flex items-center gap-2 hover:scale-105 transition-all"
          >
            <span>Open Operations Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>© 2026 D-CORE OPERATIONS — Technology at the Core. Operations at Scale.</p>
      </footer>
    </div>
  );
};
