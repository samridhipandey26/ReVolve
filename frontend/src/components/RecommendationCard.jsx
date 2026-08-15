import React from 'react'

/**
 * PATHWAY_CONFIG - Theme definitions for the 5 circular economy recovery pathways.
 * Reuse = Green, Refurbishment = Teal, Repurposing = Blue/Sky, Recycling = Amber, Disposal = Red/Rose.
 */
const PATHWAY_CONFIG = {
  Reuse: {
    label: 'Reuse',
    icon: '♺',
    checkIcon: '✅',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    bannerBg: 'bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-slate-900/80',
    bannerBorder: 'border-emerald-500/40',
    bannerText: 'text-emerald-300',
    bannerAccent: 'text-emerald-200',
    barColor: 'bg-gradient-to-r from-emerald-500 to-green-400',
    glowClass: 'shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/30',
    tagline: 'High-Value Direct Salvage & Deployment',
    summaryTemplate: (reasoning) =>
      reasoning
        ? `This item is in excellent condition and can be reused directly. ${reasoning.split('.')[0]}.`
        : 'This item qualifies for direct reuse — the highest-value circular outcome.',
  },
  Refurbishment: {
    label: 'Refurbishment',
    icon: '🛠️',
    checkIcon: '🔧',
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
    bannerBg: 'bg-gradient-to-r from-teal-950/90 via-teal-900/70 to-slate-900/80',
    bannerBorder: 'border-teal-500/40',
    bannerText: 'text-teal-300',
    bannerAccent: 'text-teal-200',
    barColor: 'bg-gradient-to-r from-teal-500 to-emerald-400',
    glowClass: 'shadow-[0_0_30px_rgba(20,184,166,0.15)] border-teal-500/30',
    tagline: 'Mechanical Restoration, Cleaning & Rebalancing',
    summaryTemplate: (reasoning) =>
      reasoning
        ? `This item needs repair or reconditioning before it can be redeployed. ${reasoning.split('.')[0]}.`
        : 'This item needs repair or cleaning before redeployment — send it to a refurbishment facility.',
  },
  Repurposing: {
    label: 'Repurposing',
    icon: '⚡',
    checkIcon: '🔄',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    bannerBg: 'bg-gradient-to-r from-sky-950/90 via-sky-900/70 to-slate-900/80',
    bannerBorder: 'border-sky-500/40',
    bannerText: 'text-sky-300',
    bannerAccent: 'text-sky-200',
    barColor: 'bg-gradient-to-r from-sky-500 to-cyan-400',
    glowClass: 'shadow-[0_0_30px_rgba(14,165,233,0.15)] border-sky-500/30',
    tagline: 'Cascaded Secondary Life Transformation',
    summaryTemplate: (reasoning) =>
      reasoning
        ? `This item has useful remaining life in a new role. ${reasoning.split('.')[0]}.`
        : 'This item is too degraded for its original purpose but has strong value in a new secondary application.',
  },
  Recycling: {
    label: 'Recycling',
    icon: '♻️',
    checkIcon: '♻️',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    bannerBg: 'bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-slate-900/80',
    bannerBorder: 'border-amber-500/40',
    bannerText: 'text-amber-300',
    bannerAccent: 'text-amber-200',
    barColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    glowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.15)] border-amber-500/30',
    tagline: 'Strategic Raw Material & Mineral Extraction',
    summaryTemplate: (reasoning) =>
      reasoning
        ? `This item cannot be reused or repaired — send it to a certified recycling facility. ${reasoning.split('.')[0]}.`
        : 'This item is not suitable for reuse or refurbishment — material recovery via recycling is the best outcome.',
  },
  Disposal: {
    label: 'Safe Disposal',
    icon: '⚠️',
    checkIcon: '⚠️',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    bannerBg: 'bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-slate-900/80',
    bannerBorder: 'border-rose-500/40',
    bannerText: 'text-rose-300',
    bannerAccent: 'text-rose-200',
    barColor: 'bg-gradient-to-r from-rose-500 to-red-400',
    glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.15)] border-rose-500/30',
    tagline: 'Controlled Neutralization & Regulated Containment',
    summaryTemplate: (reasoning) =>
      reasoning
        ? `This item is not safe or economical to reuse — it must be disposed of safely. ${reasoning.split('.')[0]}.`
        : 'This item presents safety or hazard risks that require controlled, regulated disposal — do not attempt reuse.',
  },
}

/**
 * Derives a short human-readable summary sentence from the pathway + reasoning.
 * Caps at ~160 chars so it never overflows the banner.
 */
function buildSummary(config, reasoning) {
  const full = config.summaryTemplate(reasoning)
  return full.length > 160 ? full.slice(0, 157).trimEnd() + '…' : full
}

/**
 * RecommendationCard - Shared polymorphic component rendering the AssessmentOutput contract.
 * Used for both Stream A (Construction Debris) and Stream B (EV Batteries).
 *
 * Layout (top to bottom):
 *  1. Safety Hazard Banner (conditional)
 *  2. Pathway Hero Banner — full-width, color-coded, never clips
 *  3. Item header + stream tag
 *  4. Assessed Condition + Confidence meter
 *  5. Why we recommend this (reasoning)
 *  6. Value Recovered + Environmental Impact stats
 */
export default function RecommendationCard({ assessment }) {
  if (!assessment) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-10 text-center backdrop-blur-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-slate-500 text-2xl">
          🔍
        </div>
        <h4 className="text-sm font-semibold text-slate-300 mb-1.5">
          Run an assessment to see your recommendation here
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Choose a material category above, upload a photo or fill in the details, then hit{' '}
          <strong className="text-slate-400">Get Recommendation</strong> — or try a 1-click sample.
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
    safety_flags = [],
  } = assessment

  const config = PATHWAY_CONFIG[recommended_pathway] || PATHWAY_CONFIG.Reuse
  const hasSafetyFlags = Array.isArray(safety_flags) && safety_flags.length > 0
  const isConstruction = stream === 'construction'
  const summary = buildSummary(config, reasoning)

  return (
    <div
      key={`${item}-${recommended_pathway}-${confidence}`}
      className={`rounded-2xl border bg-slate-900/80 backdrop-blur-md overflow-hidden transition-all duration-300 animate-card-appear ${config.glowClass}`}
    >
      {/* 1. Safety Hazard Warning Banner (Conditional — above pathway banner) */}
      {hasSafetyFlags && (
        <div className="bg-rose-950/90 border-b border-rose-800/60 px-5 py-3 flex items-start space-x-3 text-rose-200">
          <span className="text-lg leading-none mt-0.5 text-rose-400 shrink-0">⚠️</span>
          <div className="flex-1 min-w-0 text-xs">
            <span className="font-bold tracking-wide uppercase text-rose-300 mr-2">
              Safety / Hazard Alert:
            </span>
            <span>{safety_flags.join(' • ')}</span>
          </div>
        </div>
      )}

      {/* 2. Pathway Hero Banner — full-width, unmissable, never clips */}
      <div className={`${config.bannerBg} border-b ${config.bannerBorder} px-5 py-5 sm:px-7 sm:py-6`}>
        {/* "Here's what we recommend" label */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
          Here's what we recommend
        </div>

        {/* Big pathway result — icon + label, full-width, can never be clipped */}
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className="text-3xl sm:text-4xl leading-none shrink-0">{config.icon}</span>
          <div className="min-w-0">
            <div className={`text-2xl sm:text-3xl font-black font-heading tracking-tight leading-none ${config.bannerAccent}`}>
              {config.label.toUpperCase()}
            </div>
            <div className={`text-xs font-semibold mt-0.5 ${config.bannerText} opacity-80`}>
              {config.tagline}
            </div>
          </div>
        </div>

        {/* Plain-language summary sentence */}
        <p className={`text-sm leading-relaxed font-normal ${config.bannerText}`}>
          {summary}
        </p>
      </div>

      <div className="p-5 sm:p-7 space-y-5">
        {/* 3. Item Header & Stream Tag */}
        <div className="border-b border-slate-800/70 pb-4">
          <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
              {isConstruction ? '🏗️ Construction Material' : '⚡ EV Battery Pack'}
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-[11px] text-slate-400">Circular Triage Result</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
            {item || 'Assessed Waste Item'}
          </h3>
        </div>

        {/* 4. Assessed Condition & Confidence Bar */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/60 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Assessed Condition
            </div>
            <div className="text-sm font-medium text-slate-200 leading-snug">
              {assessed_condition || 'Condition not specified'}
            </div>
          </div>

          {/* Confidence Progress Meter */}
          <div className="sm:w-44 shrink-0 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Recommendation confidence</span>
              <span className="text-white font-bold font-mono ml-2">{confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${config.barColor}`}
                style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5. Why We Recommend This (full reasoning) */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Why we recommend this
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 p-3.5 rounded-xl border-l-2 border-slate-700">
            {reasoning || 'No recommendation reasoning available.'}
          </p>
        </div>

        {/* 6. Stat Callouts: Value Recovered & Environmental Impact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Estimated Value Recovered */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-slate-800/90 flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-base shrink-0 font-bold">
              ₹
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                Value Recovered
              </div>
              <div className="text-sm font-semibold text-emerald-300 leading-snug">
                {estimated_value_recovered || 'N/A'}
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-slate-800/90 flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center text-base shrink-0">
              🌱
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                Environmental Impact
              </div>
              <div className="text-sm font-semibold text-teal-300 leading-snug">
                {environmental_impact || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Optional "How this works" technical detail — collapsed by default */}
        <details className="group rounded-xl border border-slate-800/80 bg-slate-950/30 text-xs">
          <summary className="px-4 py-2.5 font-medium text-slate-500 cursor-pointer hover:text-slate-300 transition-colors flex items-center justify-between list-none select-none">
            <span className="flex items-center space-x-1.5">
              <span>ℹ️</span>
              <span>Technical methodology</span>
            </span>
            <span className="text-slate-600 text-[10px] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-3 pt-1 border-t border-slate-800/60 text-slate-400 space-y-1 leading-relaxed">
            <p>
              <strong className="text-slate-300">Assessment contract:</strong>{' '}
              schemas.AssessmentOutput · Stream: {stream}
            </p>
            <p>
              <strong className="text-slate-300">Decision engine:</strong> Multi-criteria rule-based circular
              hierarchy with {isConstruction ? 'CLIP zero-shot vision classification' : 'degradation telemetry analysis'}.
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
