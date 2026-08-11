import React from 'react'

/**
 * CumulativeImpactWidget - Displays real-time session impact aggregation:
 * Total value recovered (INR), Total landfill diverted (kg), and Pathway breakdowns.
 */
export default function CumulativeImpactWidget({ impactData, onReset }) {
  const {
    session_assessments_count = 0,
    formatted_total_value = '₹0',
    formatted_total_diverted = '0.0 kg',
    formatted_total_co2 = '0.0 kg CO₂e',
    pathway_breakdown = {
      Reuse: 0,
      Refurbishment: 0,
      Repurposing: 0,
      Recycling: 0,
      Disposal: 0
    }
  } = impactData || {}

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-5 shadow-xl shadow-black/40">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live Cumulative Impact
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          {session_assessments_count} {session_assessments_count === 1 ? 'item' : 'items'} assessed
        </span>
      </div>

      {/* Primary Key Metric Counters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Metric 1: Total Value */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Value Recovered</span>
            <span className="text-emerald-400 font-bold">₹</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-300 font-mono">
            {formatted_total_value}
          </div>
        </div>

        {/* Metric 2: Waste Diverted */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Landfill Diverted</span>
            <span className="text-teal-400">🌱</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-teal-300 font-mono">
            {formatted_total_diverted}
          </div>
        </div>
      </div>

      {/* Pathway Distribution Mini Tally */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Pathway Allocations
        </div>
        <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold font-mono">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <div className="text-[9px] text-slate-400 uppercase">Reuse</div>
            <div className="text-xs">{pathway_breakdown.Reuse || 0}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <div className="text-[9px] text-slate-400 uppercase">Refurb</div>
            <div className="text-xs">{pathway_breakdown.Refurbishment || 0}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <div className="text-[9px] text-slate-400 uppercase">Repurp</div>
            <div className="text-xs">{pathway_breakdown.Repurposing || 0}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <div className="text-[9px] text-slate-400 uppercase">Recyc</div>
            <div className="text-xs">{pathway_breakdown.Recycling || 0}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <div className="text-[9px] text-slate-400 uppercase">Disp</div>
            <div className="text-xs">{pathway_breakdown.Disposal || 0}</div>
          </div>
        </div>
      </div>

      {/* CO2 Emissions Offset Footer */}
      <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Estimated CO₂e Offset:</span>
        <span className="font-semibold text-slate-200 font-mono">{formatted_total_co2}</span>
      </div>
    </div>
  )
}
