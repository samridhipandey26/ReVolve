import React from 'react'

/**
 * PATHWAY_CONFIG - Theme definitions for the 5 circular economy recovery pathways.
 * Reuse = Green, Refurbishment = Teal, Repurposing = Blue/Sky, Recycling = Amber, Disposal = Red/Rose.
 */
const PATHWAY_CONFIG = {
  Reuse: {
    label: 'Reuse',
    icon: '♺',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40',
    barColor: 'bg-gradient-to-r from-emerald-500 to-green-400',
    glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.12)] border-emerald-500/20',
    tagline: 'High-Value Direct Salvage & Deployment'
  },
  Refurbishment: {
    label: 'Refurbishment',
    icon: '🛠️',
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-teal-950/40',
    barColor: 'bg-gradient-to-r from-teal-500 to-emerald-400',
    glowClass: 'shadow-[0_0_25px_rgba(20,184,166,0.12)] border-teal-500/20',
    tagline: 'Mechanical Restoration, Cleaning & Rebalancing'
  },
  Repurposing: {
    label: 'Repurposing',
    icon: '⚡',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-sky-950/40',
    barColor: 'bg-gradient-to-r from-sky-500 to-cyan-400',
    glowClass: 'shadow-[0_0_25px_rgba(14,165,233,0.12)] border-sky-500/20',
    tagline: 'Cascaded Secondary Life Transformation'
  },
  Recycling: {
    label: 'Recycling',
    icon: '♻️',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-950/40',
    barColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.12)] border-amber-500/20',
    tagline: 'Strategic Raw Material & Mineral Extraction'
  },
  Disposal: {
    label: 'Disposal',
    icon: '⚠️',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-rose-950/40',
    barColor: 'bg-gradient-to-r from-rose-500 to-red-400',
    glowClass: 'shadow-[0_0_25px_rgba(244,63,94,0.12)] border-rose-500/20',
    tagline: 'Controlled Neutralization & Regulated Containment'
  }
}

/**
 * RecommendationCard - Shared polymorphic component rendering the AssessmentOutput contract.
 * Used for both Stream A (Construction Debris) and Stream B (EV Batteries).
 */
export default function RecommendationCard({ assessment }) {
  if (!assessment) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto mb-3 text-slate-500 text-xl">
          🔍
        </div>
        <h4 className="text-sm font-medium text-slate-300 mb-1">Awaiting Assessment Input</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Configure the stream parameters above or select a preset sample to execute the circular decision engine.
        </p>
      </div>
    )
  }

  const {
    item,
    stream,
    assessed_condition,
    recommended_pathway,
    confidence = 0,
    reasoning,
    estimated_value_recovered,
    environmental_impact,
    safety_flags = []
  } = assessment

  const config = PATHWAY_CONFIG[recommended_pathway] || PATHWAY_CONFIG.Reuse
  const hasSafetyFlags = Array.isArray(safety_flags) && safety_flags.length > 0
  const isConstruction = stream === 'construction'

  return (
    <div
      key={`${item}-${recommended_pathway}-${confidence}`}
      className={`rounded-2xl border bg-slate-900/80 backdrop-blur-md overflow-hidden transition-all duration-300 animate-card-appear ${config.glowClass}`}
    >
      {/* 1. Safety Hazard Warning Banner (Conditional) */}
      {hasSafetyFlags && (
        <div className="bg-rose-950/80 border-b border-rose-800/50 px-5 py-3 flex items-start space-x-3 text-rose-200">
          <span className="text-lg leading-none mt-0.5 text-rose-400">⚠️</span>
          <div className="flex-1 text-xs">
            <span className="font-bold tracking-wide uppercase text-rose-300 mr-2">
              Safety / Hazard Alert:
            </span>
            <span>{safety_flags.join(' • ')}</span>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-7 space-y-6">
        {/* 2. Top Bar: Stream Tag & Item Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/70 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {isConstruction ? '🏗️ Stream A: Construction Debris' : '⚡ Stream B: EV Battery'}
              </span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] text-slate-400">Triage Decision</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {item || 'Assessed Waste Item'}
            </h3>
          </div>

          {/* Pathway Big Badge */}
          <div className="flex items-center space-x-2">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl border text-sm font-bold shadow-md ${config.badgeClass}`}
            >
              <span className="text-base">{config.icon}</span>
              <span className="tracking-wide">{config.label}</span>
            </div>
          </div>
        </div>

        {/* 3. Assessed Condition & Confidence Bar */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Physical & Structural Condition
            </div>
            <div className="text-sm font-medium text-slate-200">
              {assessed_condition || 'Condition not specified'}
            </div>
          </div>

          {/* Confidence Progress Meter */}
          <div className="sm:w-48 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Rule Confidence</span>
              <span className="text-white font-bold font-mono">{confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
                style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. Decision Reasoning Text */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Engine Justification & Rule Logic
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 p-3.5 rounded-xl border-l-2 border-slate-700">
            {reasoning || 'No rule justification generated.'}
          </p>
        </div>

        {/* 5. Stat Callouts: Value Recovered & Environmental Impact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Estimated Value Recovered */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-slate-800/90 flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-base shrink-0">
              ₹
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                Estimated Value Recovered
              </div>
              <div className="text-sm font-semibold text-emerald-300 leading-tight">
                {estimated_value_recovered || 'N/A'}
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-slate-800/90 flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center text-base shrink-0">
              🌱
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                Environmental & Landfill Impact
              </div>
              <div className="text-sm font-semibold text-teal-300 leading-tight">
                {environmental_impact || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
