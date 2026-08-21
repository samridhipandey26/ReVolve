import React, { useState } from 'react'

/**
 * PATHWAYS_DATA - The 5 circular economy recovery pathways explained in plain language.
 */
const PATHWAYS_DATA = [
  {
    id: 'Reuse',
    name: 'Reuse',
    icon: '♺',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    barColor: 'from-emerald-500 to-green-400',
    borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-950/40',
    tagline: 'Direct Salvage & Deployment',
    description:
      'Structurally sound elements are cleaned and immediately redeployed in new construction or vehicles without energy-intensive remanufacturing.',
    example: 'Precast concrete slabs, hardwood timber trusses, structural steel I-beams.',
  },
  {
    id: 'Refurbishment',
    name: 'Refurbishment',
    icon: '🛠️',
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
    barColor: 'from-teal-500 to-emerald-400',
    borderHover: 'hover:border-teal-500/60 hover:shadow-teal-950/40',
    tagline: 'Mechanical Restoration & Repair',
    description:
      'Items with minor surface wear or degraded modules undergo reconditioning, cleaning, or cell rebalancing to return to full operational specification.',
    example: 'Masonry bricks with mortar removal, EV battery packs needing BMS calibration.',
  },
  {
    id: 'Repurposing',
    name: 'Repurposing',
    icon: '⚡',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    barColor: 'from-sky-500 to-cyan-400',
    borderHover: 'hover:border-sky-500/60 hover:shadow-sky-950/40',
    tagline: 'Cascaded Second-Life Transformation',
    description:
      'Items no longer suited for their original high-stress application are converted into high-utility secondary roles.',
    example: 'Retired EV battery packs converted into stationary solar storage (ESS), heavy beams cut into landscaping retaining walls.',
  },
  {
    id: 'Recycling',
    name: 'Recycling',
    icon: '♻️',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    barColor: 'from-amber-500 to-yellow-400',
    borderHover: 'hover:border-amber-500/60 hover:shadow-amber-950/40',
    tagline: 'Raw Material & Mineral Extraction',
    description:
      'Severely degraded or non-structural materials are crushed into engineered recycled concrete aggregate (RCA) or hydrometallurgically refined for cobalt, lithium, and nickel.',
    example: 'Cracked concrete crushed for highway sub-base, depleted battery cathode recycling.',
  },
  {
    id: 'Disposal',
    name: 'Safe Disposal',
    icon: '⚠️',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    barColor: 'from-rose-500 to-red-400',
    borderHover: 'hover:border-rose-500/60 hover:shadow-rose-950/40',
    tagline: 'Controlled Neutralization & Containment',
    description:
      'Items presenting severe structural instability, hazardous chemical contamination, or thermal runaway risks are safely contained and neutralized.',
    example: 'Swollen punctured battery cells, asbestos-contaminated demolition debris.',
  },
]

/**
 * FEATURES_DATA - 6 plain language feature cards without technical jargon
 */
const FEATURES_DATA = [
  {
    icon: '📸',
    title: 'Photo-Based Material Detection',
    description:
      'Simply snap or upload a photo of debris on the job site. The system identifies concrete, brick, wood, or steel automatically.',
  },
  {
    icon: '🔋',
    title: 'Instant Battery Health Triage',
    description:
      'Enter capacity, cycles, or resistance numbers to instantly find out if an EV battery pack is ready for direct reuse or stationary solar storage.',
  },
  {
    icon: '💰',
    title: 'Value Recovered, Not Just Waste Avoided',
    description:
      'Get clear rupee (₹) recovery estimates comparing circular salvage value against bottom-tier scrap dumping rates.',
  },
  {
    icon: '🌱',
    title: 'Environmental Impact on Every Result',
    description:
      'See exact metrics for landfill mass diverted (kg) and embodied carbon emissions (CO₂e) saved with every decision.',
  },
  {
    icon: '🛡️',
    title: 'Safety-First Hazard Detection',
    description:
      'Automatic warnings for thermal runaway risks, physical battery swelling, and structural micro-fractures protect field teams.',
  },
  {
    icon: '⚡',
    title: '1-Click Pre-Loaded Test Samples',
    description:
      'Explore real-world test cases in seconds — from Tesla battery packs to precast concrete slabs — with zero typing required.',
  },
]

export default function LandingPage({ onStartAssessment }) {
  const [activeHeroTab, setActiveHeroTab] = useState('construction')
  const [activePathwayTab, setActivePathwayTab] = useState('Reuse')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Global Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3.5">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                    ♺
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl font-black font-heading tracking-tight text-white">
                  Re<span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Volve</span>
                </span>
              </div>
            </div>

            {/* Nav Links & CTA */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
              <a href="#the-problem" className="hover:text-emerald-400 transition-colors">
                The Problem
              </a>
              <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                How It Works
              </a>
              <a href="#pathways" className="hover:text-emerald-400 transition-colors">
                5 Pathways
              </a>
              <a href="#features" className="hover:text-emerald-400 transition-colors">
                Features
              </a>
            </nav>

            {/* Launch App CTA Button */}
            <button
              type="button"
              onClick={onStartAssessment}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-950/60 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Start Assessment</span>
              <span className="text-base">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-cyan-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Subtitle & CTAs */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Circular Economy Decision Engine</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-bold">Two Streams • Five Pathways</span>
              </div>

              {/* Primary Approved Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.1]">
                Don’t scrap it.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  ReVolve it.
                </span>
              </h1>

              {/* Subheading in plain language */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Upload a photo of demolished material or enter your EV battery's health data, and get an instant, AI-backed recommendation on the smartest way to reuse, repair, or recycle it.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={onStartAssessment}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 shadow-xl shadow-emerald-950/60 transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer group active:scale-95"
                >
                  <span>Start Assessment</span>
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </button>

                <a
                  href="#pathways"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore the 5 Pathways</span>
                  <span>↓</span>
                </a>
              </div>

              {/* Trust & Guarantee Markers */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Instant On-Site Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-teal-400">✓</span>
                  <span>Rupee Financial Arbitrage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-400">✓</span>
                  <span>Embodied Carbon Accounting</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Decision Showcase Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-slate-900/80 shadow-2xl shadow-black/80">
                <div className="rounded-[23px] bg-slate-900/95 backdrop-blur-xl p-6 sm:p-7 space-y-6">
                  {/* Interactive Switcher Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Interactive Live Showcase
                      </span>
                      <div className="text-sm font-bold text-white">Instant Triage In Action</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      LIVE PREVIEW
                    </span>
                  </div>

                  {/* Stream Tabs */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('construction')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${activeHeroTab === 'construction'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      <span>🏗️</span>
                      <span>Demolition Debris</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('battery')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${activeHeroTab === 'battery'
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      <span>⚡</span>
                      <span>EV Battery Pack</span>
                    </button>
                  </div>

                  {/* Showcase Content Card */}
                  {activeHeroTab === 'construction' ? (
                    <div className="space-y-4 animate-card-appear">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[11px] text-slate-400 font-medium">Assessed Item</div>
                          <div className="text-sm font-bold text-slate-100">
                            Precast Concrete Slab (Clean, Structural)
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold flex items-center space-x-1.5">
                          <span>♺</span>
                          <span>Reuse</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-emerald-400">Why we recommend this:</strong> Pristine structural concrete elements qualify for direct modular reuse in structural construction, retaining high embodied carbon.
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Value Recovered</div>
                          <div className="text-sm font-bold text-emerald-300">₹5,200 <span className="text-[10px] text-slate-500">(vs ₹1,600 scrap)</span></div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">CO₂e Embodied Saved</div>
                          <div className="text-sm font-bold text-teal-300">~420 kg CO₂e</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-card-appear">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[11px] text-slate-400 font-medium">Assessed Item</div>
                          <div className="text-sm font-bold text-slate-100">
                            Tesla Model 3 2170 Pack (76% SOH)
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/40 text-xs font-extrabold flex items-center space-x-1.5">
                          <span>⚡</span>
                          <span>Repurposing</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-sky-400">Why we recommend this:</strong> Moderate cell degradation exceeds stationary cut-offs. Ideal for secondary solar grid energy storage systems (ESS).
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Value Recovered</div>
                          <div className="text-sm font-bold text-emerald-300">₹48,000 <span className="text-[10px] text-slate-500">(vs ₹12,000 scrap)</span></div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Landfill Diverted</div>
                          <div className="text-sm font-bold text-cyan-300">320 kg Pack Mass</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Button */}
                  <button
                    type="button"
                    onClick={onStartAssessment}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Run Your Own Material Assessment</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Problem Section */}
      <section id="the-problem" className="py-16 sm:py-24 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              The Heavy Waste Crisis
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Valuable industrial assets are getting buried in landfills.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Every day, millions of tons of structurally sound demolition concrete and high-capacity EV batteries are prematurely crushed or landfilled. Without rapid, reliable on-site triage, circular salvage remains too slow and complex for field operators.
            </p>
          </div>

          {/* 3 Stat Callouts with visible developer TODO comments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            {/* TODO: replace with cited real stat */}
            <div className="glass-card rounded-2xl p-7 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider mb-3">
                Illustrative Metric
              </span>
              <div className="text-4xl sm:text-5xl font-black font-heading text-white mb-2 tracking-tight">
                3.2B <span className="text-emerald-400 text-2xl">Tons</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mb-1">
                Construction Debris Landfilled Yearly
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Global construction and demolition waste produced each year, with over 75% discarded into landfills without material sorting.
              </p>
            </div>

            {/* Stat 2 */}
            {/* TODO: replace with cited real stat */}
            <div className="glass-card rounded-2xl p-7 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider mb-3">
                Illustrative Metric
              </span>
              <div className="text-4xl sm:text-5xl font-black font-heading text-white mb-2 tracking-tight">
                11M <span className="text-cyan-400 text-2xl">Tons</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mb-1">
                EV Batteries Retiring by 2030
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lithium-ion battery packs reaching end-of-vehicle life, the majority retaining 70%+ health suitable for secondary stationary storage.
              </p>
            </div>

            {/* Stat 3 */}
            {/* TODO: replace with cited real stat */}
            <div className="glass-card rounded-2xl p-7 relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider mb-3">
                Illustrative Metric
              </span>
              <div className="text-4xl sm:text-5xl font-black font-heading text-white mb-2 tracking-tight">
                85% <span className="text-teal-400 text-2xl">Lost</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mb-1">
                Potential Circular Value Destroyed
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Economic value forfeited when pristine materials are crushed into basic fill instead of certified direct modular reuse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
              Streamlined 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              From waste intake to optimal circular pathway in seconds.
            </h2>
            <p className="text-base text-slate-300">
              A guided triage experience built for job-site managers, demolition contractors, and fleet operators.
            </p>
          </div>

          {/* 3 Step Visual Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="glass-card rounded-2xl p-8 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-2xl font-bold font-heading">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Choose your item</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Select between <strong className="text-slate-200">Demolition Materials</strong> (concrete, brick, timber, steel) or <strong className="text-slate-200">EV Battery Packs</strong> (NMC, LFP).
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                <span>🏗️ Construction or ⚡ Battery</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-2xl p-8 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center text-2xl font-bold font-heading">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Tell us about it</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upload an on-site photo for visual detection or input basic battery health metrics (capacity, cycles, age). Or try a 1-click preset sample!
              </p>
              <div className="pt-2 text-xs font-semibold text-teal-400 flex items-center space-x-1.5">
                <span>📸 Photo drop or Telemetry sliders</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-2xl p-8 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-2xl font-bold font-heading">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Get your pathway</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive an instant AI triage decision: Reuse, Refurbish, Repurpose, Recycle, or Safe Disposal — with transparent reasoning and financial returns.
              </p>
              <div className="pt-2 text-xs font-semibold text-cyan-400 flex items-center space-x-1.5">
                <span>♺ 5 Pathways + Rupee Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The 5 Circular Pathways Interactive Section */}
      <section id="pathways" className="py-16 sm:py-24 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              The Vocabulary of Circular Economy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              The 5 Circular Pathways of ReVolve
            </h2>
            <p className="text-base text-slate-300">
              Every assessed item is assigned to the highest possible value pathway in the circular hierarchy.
            </p>
          </div>

          {/* Pathway Tab Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {PATHWAYS_DATA.map((pathway) => (
              <button
                key={pathway.id}
                type="button"
                onClick={() => setActivePathwayTab(pathway.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${activePathwayTab === pathway.id
                    ? `${pathway.badgeClass} border shadow-lg ring-1 ring-white/10`
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
              >
                <span>{pathway.icon}</span>
                <span>{pathway.name}</span>
              </button>
            ))}
          </div>

          {/* Active Pathway Detail Card */}
          {(() => {
            const current = PATHWAYS_DATA.find((p) => p.id === activePathwayTab) || PATHWAYS_DATA[0]
            return (
              <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 sm:p-10 border border-slate-700/80 shadow-2xl space-y-6 animate-card-appear">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      {current.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Pathway Definition
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {current.name}
                      </h3>
                    </div>
                  </div>
                  <div className={`inline-flex px-4 py-1.5 rounded-xl border text-xs font-bold ${current.badgeClass}`}>
                    {current.tagline}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      What this means:
                    </h4>
                    <p className="text-base text-slate-200 leading-relaxed font-normal">
                      {current.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                      Real-World Examples:
                    </h4>
                    <p className="text-sm text-slate-300 font-medium">
                      {current.example}
                    </p>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* 5 Pathways Grid Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            {PATHWAYS_DATA.map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePathwayTab(p.id)}
                className={`p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 cursor-pointer transition-all duration-200 ${p.borderHover} ${activePathwayTab === p.id ? 'ring-2 ring-emerald-400/40 bg-slate-900' : ''
                  }`}
              >
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="text-sm font-bold text-white mb-1">{p.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{p.tagline}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Features Grid Section */}
      <section id="features" className="py-16 sm:py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Intelligent Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Built for speed, accuracy, and maximum circular value.
            </h2>
            <p className="text-base text-slate-300">
              Clear actionable outputs with zero confusing jargon or endless manual forms.
            </p>
          </div>

          {/* 6 Plain-Language Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_DATA.map((feature) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-7 space-y-3.5 hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-16 sm:py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-900/40 to-slate-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <span>⚡ Ready for Instant Triage</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
            Stop guessing. Start recovering circular value today.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Test real-world construction materials or EV battery packs in seconds with preloaded samples or custom inputs.
          </p>

          <div>
            <button
              type="button"
              onClick={onStartAssessment}
              className="px-10 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 shadow-2xl shadow-emerald-950/80 transition-all duration-200 inline-flex items-center space-x-3 cursor-pointer active:scale-95"
            >
              <span>Launch ReVolve Assessment</span>
              <span className="text-lg">➔</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400 font-bold">
                  ♺
                </div>
              </div>
              <div>
                <span className="text-sm font-bold text-white">ReVolve</span>
                <span className="text-slate-500 ml-2 font-normal">
                  One triage engine. Two waste streams. Five circular pathways.
                </span>
              </div>
            </div>

            {/* Right: Hackathon Tag */}
            <div className="flex items-center space-x-4 text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
                Smart India Hackathon MVP
              </span>
              <span>&copy; {new Date().getFullYear()} ReVolve</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
