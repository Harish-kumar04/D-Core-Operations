import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Layers,
  Activity
} from 'lucide-react';

export const LandingPage = () => {
  const { navigate } = useApp();

  const preloadedProjects = [
    {
      name: 'Periyar.net',
      url: 'https://periyar.net/',
      category: 'Digital Archive',
      description: 'Digital archive and educational repository platform for Periyar thought, historical literature, and public research.',
      image: 'https://res.cloudinary.com/dikaxqooz/image/upload/v1790526460/2_mzfrjd.webp'
    },
    {
      name: 'Makkalveeran.com',
      url: 'https://makkalveeran.com/',
      category: 'Web Platform',
      description: 'Community engagement platform and digital publication network for public outreach and announcements.',
      image: 'https://res.cloudinary.com/dikaxqooz/image/upload/v1790526460/3_nvj3x1.webp'
    },
    {
      name: 'Kalaignar.org',
      url: 'https://kalaignar.org/',
      category: 'Core Infrastructure',
      description: 'Official memorial & legacy portal showcasing historical contributions, digitized speeches, and interactive timeline.',
      image: 'https://res.cloudinary.com/dikaxqooz/image/upload/v1790526461/4_bjljdl.webp'
    },
    {
      name: 'TVK Files',
      url: 'https://tvkfiles.org/',
      category: 'Data & Storage',
      description: 'Centralized digital asset management, document storage, and media repository system for verified operational assets.',
      image: 'https://res.cloudinary.com/dikaxqooz/image/upload/v1790526460/1_cavhvy.webp'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] selection:bg-red-100 selection:text-[#E42129]">
      
      {/* Hero Section — Editorial 2-Column Split Composition */}
      <section className="pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#E42129] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DMK Digital & IT Operations Command</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black text-[#111111] tracking-tight leading-tight">
                D-CORE <span className="dcore-gradient-text">OPERATIONS</span>
              </h1>
              <p className="text-xl sm:text-2xl font-black text-[#E42129] tracking-wide">
                Technology at the Core. Operations at Scale.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#333333] font-medium leading-relaxed max-w-xl">
              Building, operating, and evolving the digital technology ecosystem for DMK requirements, web platforms, and IT infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => navigate('dashboard')}
                className="btn-primary w-full sm:w-auto px-8 py-4 text-sm"
              >
                <span>Enter Operations Center</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#ecosystem"
                className="btn-secondary w-full sm:w-auto px-7 py-4 text-sm"
              >
                <span>Explore Our Platforms</span>
              </a>
            </div>

          </div>

          {/* Right Column: Featured Image Asset 4 */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#E8E8E8] shadow-card bg-[#F5F5F5] group">
              <img
                src="https://res.cloudinary.com/dikaxqooz/image/upload/v1790526460/1_cavhvy.webp"
                alt="D-Core Operations Command"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E42129] bg-white px-2.5 py-0.5 rounded">
                  FEATURED OPS
                </span>
                <h4 className="text-lg font-extrabold text-white">DMK Operational NOC & Platforms</h4>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Integrated Tamil Value Quote Section */}
      <section className="px-4 lg:px-8 max-w-7xl mx-auto mb-16">
        <QuoteCard
          quote="கல்வி, அறிவியல் அறிவு, தொழில்நுட்பம், ஒழுக்கம் ஆகியவை வளர்ந்தால்தான் மக்கள் முன்னேற முடியும்."
          speaker="தந்தை பெரியார்"
          variant="dark"
        />
      </section>

      {/* OUR DIGITAL ECOSYSTEM Section */}
      <section id="ecosystem" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E8E8]">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#E42129] bg-red-50 px-3 py-1 rounded-full border border-red-100">
            OUR DIGITAL ECOSYSTEM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            DMK Core Platforms & Digital Repositories
          </h2>
          <p className="text-xs text-[#666666] max-w-xl mx-auto font-medium">
            Maintained and operated under strict SLA, high-availability infrastructure, and security standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {preloadedProjects.map((proj, idx) => (
            <div
              key={idx}
              className="glass-card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 overflow-hidden relative bg-[#F5F5F5]">
                  <img
                    src={proj.image}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded bg-[#111111]/80 backdrop-blur-md text-white uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-[#111111] group-hover:text-[#E42129] transition-colors">
                      {proj.name}
                    </h3>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#666666] hover:text-[#E42129] transition-colors p-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-xs text-[#333333] leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-[#666666] font-bold">{proj.url}</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW WE WORK Section */}
      <section className="py-16 px-4 lg:px-8 bg-[#F5F5F5] border-y border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#E42129] bg-white px-3 py-1 rounded-full border border-[#E8E8E8]">
              HOW WE WORK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Operational Delivery Lifecycle
            </h2>
            <p className="text-xs text-[#666666] max-w-xl mx-auto font-medium">
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
              <div key={i} className="glass-card p-5 bg-white border border-[#E8E8E8] space-y-2">
                <span className="text-xs font-mono font-black text-[#E42129] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  {st.step}
                </span>
                <h4 className="text-sm font-black text-[#111111]">{st.title}</h4>
                <p className="text-[11px] text-[#666666] font-medium leading-tight">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-[#111111] text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E42129]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              D-CORE OPERATIONS CENTER
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
              Ready to inspect live current works, manage the work queue, or convert future ideas into projects?
            </p>
            <button
              onClick={() => navigate('dashboard')}
              className="btn-primary inline-flex px-8 py-3.5"
            >
              <span>Open Operations Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="py-6 border-t border-[#E8E8E8] text-center text-xs text-[#666666] font-medium">
        <p>© 2026 D-CORE OPERATIONS — Technology at the Core. Operations at Scale.</p>
      </footer>
    </div>
  );
};
