import React from 'react'

/**
 * PATHWAY_ROWS - Full display config for each pathway allocation row.
 * Matches PATHWAY_CONFIG color coding in RecommendationCard.
 */
const PATHWAY_ROWS = [
  {
    key: 'Reuse',
    label: 'Reused',
    icon: '♺',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    key: 'Refurbishment',
    label: 'Refurbished',
    icon: '🛠️',
    barColor: 'bg-teal-500',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
  },
  {
    key: 'Repurposing',
    label: 'Repurposed',
    icon: '⚡',
    barColor: 'bg-sky-500',
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
  },
  {
    key: 'Recycling',
    label: 'Recycled',
    icon: '♻️',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'Disposal',
    label: 'Disposed',
    icon: '⚠️',
    barColor: 'bg-rose-500',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
  },
]

/**
 * CumulativeImpactWidget - Displays real-time session impact aggregation:
 * Total value recovered (INR), Total landfill diverted (kg), CO₂e offset,
 * and Pathway breakdown with full labels, bar chart, and empty-state handling.
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
      Disposal: 0,
    },
  } = impactData || {}

  const isEmpty = session_assessments_count === 0
  const totalAssessed = PATHWAY_ROWS.reduce((sum, r) => sum + (pathway_breakdown[r.key] || 0), 0)

  return (
    <div
      className={`rounded-2xl border bg-slate-900/90 backdrop-blur-xl p-5 shadow-xl shadow-black/40 transition-all duration-500 ${
        isEmpty ? 'border-slate-800/50 opacity-70' : 'border-slate-800'
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2.5 mb-0.5">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isEmpty ? 'bg-slate-600' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Cumulative Impact
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-500 font-mono">
              {session_assessments_count} {session_assessments_count === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight pl-[22px]">
            Running total of value saved &amp; waste diverted this session.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <div className="py-6 text-center space-y-2">
          <div className="text-3xl opacity-30">🌱</div>
          <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
            Run your first assessment to see your circular impact tracked here.
          </p>
        </div>
      ) : (
        <>
          {/* Primary Key Metric Counters */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Metric 1: Total Value */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Value Recovered
              </div>
              <div className="text-base sm:text-lg font-extrabold text-emerald-300 font-mono leading-none">
                {formatted_total_value}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">estimated savings</div>
            </div>

            {/* Metric 2: Waste Diverted */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Landfill Diverted
              </div>
              <div className="text-base sm:text-lg font-extrabold text-teal-300 font-mono leading-none">
                {formatted_total_diverted}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">kept out of landfill</div>
            </div>
          </div>

          {/* Pathway Allocation — horizontal bar chart with full labels */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Pathway Breakdown
            </div>
            {PATHWAY_ROWS.map((row) => {
              const count = pathway_breakdown[row.key] || 0
              const pct = totalAssessed > 0 ? Math.round((count / totalAssessed) * 100) : 0
              return (
                <div key={row.key} className="flex items-center gap-2.5" title={`${count} item${count !== 1 ? 's' : ''} → ${row.label}`}>
                  {/* Icon + Label */}
                  <div className="flex items-center space-x-1.5 w-24 shrink-0">
                    <span className="text-sm leading-none">{row.icon}</span>
                    <span className={`text-[11px] font-semibold ${count > 0 ? row.textColor : 'text-slate-600'}`}>
                      {row.label}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${count > 0 ? row.barColor : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Count badge */}
                  <span
                    className={`text-xs font-bold font-mono w-5 text-right shrink-0 ${
                      count > 0 ? row.textColor : 'text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              )
            })}
          </div>

          {/* CO₂e Offset Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Estimated CO₂e avoided:</span>
            <span className="font-semibold text-slate-200 font-mono">{formatted_total_co2}</span>
          </div>
        </>
      )}
    </div>
  )
}
