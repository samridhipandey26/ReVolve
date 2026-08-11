import React, { useState, useEffect } from 'react'
import { assessBatteryApi, getBatterySamplesApi } from '../services/api'

export default function BatteryInputFlow({ onAssessmentComplete, onError }) {
  // Battery Form State
  const [itemLabel, setItemLabel] = useState('EV Battery Pack - Sample')
  const [chemistry, setChemistry] = useState('NMC')
  const [remainingCapacityPct, setRemainingCapacityPct] = useState(75.0)
  const [cycleCount, setCycleCount] = useState(1200)
  const [internalResistance, setInternalResistance] = useState('moderate')
  const [voltageStability, setVoltageStability] = useState('stable')
  const [ageYears, setAgeYears] = useState(3.0)
  const [hasPhysicalDamage, setHasPhysicalDamage] = useState(false)
  const [hasThermalIrregularity, setHasThermalIrregularity] = useState(false)

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [samplePresets, setSamplePresets] = useState([])
  const [loadingSamples, setLoadingSamples] = useState(false)

  // Fetch sample presets on component mount
  useEffect(() => {
    async function loadSamples() {
      try {
        setLoadingSamples(true)
        const samples = await getBatterySamplesApi()
        setSamplePresets(samples)
      } catch (err) {
        console.warn('Could not fetch battery samples from API, using defaults:', err)
        setSamplePresets([
          {
            item: 'Tesla Model 3 2170 Module — Sample 1',
            stream: 'battery',
            chemistry: 'NMC',
            remaining_capacity_pct: 91.5,
            cycle_count: 420,
            internal_resistance: 'low',
            voltage_stability: 'stable',
            age_years: 1.5,
            has_physical_damage: false,
            has_thermal_irregularity: false,
          },
          {
            item: 'Tata Nexon EV LFP Pack — Sample 2',
            stream: 'battery',
            chemistry: 'LFP',
            remaining_capacity_pct: 76.0,
            cycle_count: 1650,
            internal_resistance: 'moderate',
            voltage_stability: 'unstable',
            age_years: 3.2,
            has_physical_damage: false,
            has_thermal_irregularity: false,
          },
          {
            item: 'Nissan Leaf Gen 2 Module — Sample 3',
            stream: 'battery',
            chemistry: 'NMC',
            remaining_capacity_pct: 64.2,
            cycle_count: 2100,
            internal_resistance: 'moderate',
            voltage_stability: 'stable',
            age_years: 4.5,
            has_physical_damage: false,
            has_thermal_irregularity: false,
          },
          {
            item: 'Commercial Bus Pack Module — Sample 4',
            stream: 'battery',
            chemistry: 'NMC',
            remaining_capacity_pct: 41.0,
            cycle_count: 3400,
            internal_resistance: 'high',
            voltage_stability: 'unstable',
            age_years: 6.0,
            has_physical_damage: true,
            has_thermal_irregularity: false,
          },
          {
            item: 'Accident Damaged 2-Wheeler Pack — Sample 5',
            stream: 'battery',
            chemistry: 'NMC',
            remaining_capacity_pct: 22.0,
            cycle_count: 800,
            internal_resistance: 'high',
            voltage_stability: 'unstable',
            age_years: 2.0,
            has_physical_damage: true,
            has_thermal_irregularity: true,
          },
        ])
      } finally {
        setLoadingSamples(false)
      }
    }
    loadSamples()
  }, [])

  // Auto-fill and execute direct evaluation for sample presets
  const handleSelectSample = async (sample) => {
    setItemLabel(sample.item || 'EV Battery Sample')
    setChemistry(sample.chemistry || 'NMC')
    const cap = sample.remaining_capacity_pct ?? sample.soh_percentage ?? 75.0
    setRemainingCapacityPct(cap)
    setCycleCount(sample.cycle_count || 1000)
    setInternalResistance(sample.internal_resistance || 'moderate')
    setVoltageStability(sample.voltage_stability || 'stable')
    setAgeYears(sample.age_years || 3.0)
    setHasPhysicalDamage(!!sample.has_physical_damage)
    setHasThermalIrregularity(!!sample.has_thermal_irregularity)

    // Execute direct live assessment via API
    setIsSubmitting(true)
    try {
      const payload = {
        item: sample.item || 'EV Battery Sample',
        stream: 'battery',
        chemistry: sample.chemistry || 'NMC',
        soh_percentage: cap,
        remaining_capacity_pct: cap,
        cycle_count: sample.cycle_count || 1000,
        internal_resistance: sample.internal_resistance || 'moderate',
        voltage_stability: sample.voltage_stability || 'stable',
        age_years: sample.age_years || 3.0,
        has_physical_damage: !!sample.has_physical_damage,
        has_thermal_irregularity: !!sample.has_thermal_irregularity,
        properties: sample.properties || {},
      }
      const result = await assessBatteryApi(payload)
      if (onAssessmentComplete) {
        onAssessmentComplete(result)
      }
    } catch (err) {
      console.error('Battery sample evaluation failed:', err)
      if (onError) onError(`Battery evaluation error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit battery assessment to backend
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      item: itemLabel || 'EV Battery Pack',
      stream: 'battery',
      chemistry,
      soh_percentage: parseFloat(remainingCapacityPct),
      remaining_capacity_pct: parseFloat(remainingCapacityPct),
      cycle_count: parseInt(cycleCount, 10) || 0,
      internal_resistance: internalResistance,
      voltage_stability: voltageStability,
      age_years: parseFloat(ageYears) || 0,
      has_physical_damage: hasPhysicalDamage,
      has_thermal_irregularity: hasThermalIrregularity,
    }

    try {
      const result = await assessBatteryApi(payload)
      if (onAssessmentComplete) {
        onAssessmentComplete(result)
      }
    } catch (err) {
      console.error('Battery assessment error:', err)
      if (onError) onError(`Battery assessment error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Capacity color helpers
  const getCapacityBadgeColor = (val) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (val >= 70) return 'text-teal-400 border-teal-500/30 bg-teal-500/10'
    if (val >= 50) return 'text-sky-400 border-sky-500/30 bg-sky-500/10'
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  }

  return (
    <div className="space-y-6">
      {/* 1. Try a Sample Preset Section (Quick Demo Access) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <span>⚡</span>
            <span>Try a Preset Battery Sample</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-medium">1-Click Live Triage</span>
        </div>
        <p className="text-xs text-slate-400">
          Auto-fill telemetry and test all 5 circular recovery outcomes:
        </p>
        <div className="flex flex-wrap gap-2">
          {samplePresets.map((sample, idx) => {
            const labels = [
              '🚗 Tesla Module (91% SOH)',
              '⚡ Nexon Pack (76% SOH)',
              '🔋 Leaf Module (64% SOH)',
              '🚌 Bus Pack (41% SOH)',
              '⚠️ Damaged 2W (Hazard)',
            ]
            const btnLabel = labels[idx % labels.length]
            return (
              <button
                key={sample.item || idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 text-slate-200 hover:bg-cyan-600 hover:text-white border border-slate-700/80 hover:border-cyan-500 transition shadow-sm disabled:opacity-50"
              >
                {btnLabel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Behind the scenes "How this works" Collapsible Card */}
      <details className="group rounded-2xl border border-slate-800/90 bg-slate-900/40 p-4 transition text-xs text-slate-400">
        <summary className="font-semibold text-slate-300 cursor-pointer flex items-center justify-between list-none select-none">
          <span className="flex items-center space-x-2">
            <span className="text-cyan-400">💡</span>
            <span>How Module B Works (Behind the Scenes)</span>
          </span>
          <span className="text-slate-500 text-[10px] group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2 text-slate-400 text-[11px] leading-relaxed">
          <p>
            <strong className="text-slate-200">1. Degradation Telemetry Analysis:</strong> Multi-criteria engine evaluates Remaining Useful Life (SOH%), cell impedance (mΩ), cycle degradation, and voltage drift.
          </p>
          <p>
            <strong className="text-slate-200">2. Safety-First Circular Routing:</strong> Flags thermal runaway and mechanical breach for hazardous containment; routes healthy packs to secondary stationary storage (ESS) or direct vehicle reuse.
          </p>
        </div>
      </details>

      {/* Main Telemetry Input Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 space-y-6 shadow-xl shadow-black/20"
      >
        {/* Form Title & Item Label */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <span className="text-cyan-400 text-base">⚡</span>
              <span>EV Battery Telemetry Assessment</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Module B
            </span>
          </div>
          <input
            type="text"
            value={itemLabel}
            onChange={(e) => setItemLabel(e.target.value)}
            placeholder="Pack Label (e.g. Tata Nexon EV LFP Pack - Lot #41)"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
        </div>

        {/* 1. Remaining Capacity % (SOH Slider) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Remaining Capacity / SOH:
            </label>
            <span
              className={`px-2.5 py-0.5 rounded-lg border font-mono font-bold text-xs ${getCapacityBadgeColor(
                remainingCapacityPct
              )}`}
            >
              {remainingCapacityPct.toFixed(1)}% SOH
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={remainingCapacityPct}
            onChange={(e) => setRemainingCapacityPct(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Depleted)</span>
            <span>50% (ESS Cutoff)</span>
            <span>80% (EV Tier 1)</span>
            <span>100%</span>
          </div>
        </div>

        {/* 2. Battery Chemistry & Internal Resistance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Chemistry Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Chemistry
            </label>
            <select
              value={chemistry}
              onChange={(e) => setChemistry(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            >
              <option value="NMC">NMC (Nickel Manganese Cobalt)</option>
              <option value="LFP">LFP (Lithium Iron Phosphate)</option>
              <option value="NCA">NCA (Nickel Cobalt Aluminum)</option>
              <option value="LTO">LTO (Lithium Titanate)</option>
            </select>
          </div>

          {/* Internal Resistance Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              3. Internal Resistance
            </label>
            <select
              value={internalResistance}
              onChange={(e) => setInternalResistance(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            >
              <option value="low">Low (&lt; 2.5 mΩ — Healthy)</option>
              <option value="moderate">Moderate (2.5 - 8.0 mΩ — Degraded)</option>
              <option value="high">High (&gt; 8.0 mΩ — Severe Wear)</option>
            </select>
          </div>
        </div>

        {/* 3. Cycle Count & Age (Years) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cycle Count */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              4. Charge/Discharge Cycles
            </label>
            <input
              type="number"
              min="0"
              max="10000"
              value={cycleCount}
              onChange={(e) => setCycleCount(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Age in Years */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              5. Pack Age (Years)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={ageYears}
              onChange={(e) => setAgeYears(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>
        </div>

        {/* 4. Voltage Stability & Cell Balance */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            6. Voltage Stability & Cell Balance
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVoltageStability('stable')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                voltageStability === 'stable'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Stable (Delta &lt; 20mV)
            </button>
            <button
              type="button"
              onClick={() => setVoltageStability('unstable')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                voltageStability === 'unstable'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Unstable (Cell Drift / Imbalance)
            </button>
          </div>
        </div>

        {/* 5. Critical Safety Flags (Physical Damage & Thermal Irregularities) */}
        <div className="space-y-3 pt-1 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              7. Critical Safety & Hazard Flags
            </span>
            {(hasPhysicalDamage || hasThermalIrregularity) && (
              <span className="text-[11px] text-rose-400 flex items-center space-x-1 font-semibold animate-pulse">
                <span>⚠️</span>
                <span>Safety Warning Active</span>
              </span>
            )}
          </div>

          {/* Toggle A: Physical Damage */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              hasPhysicalDamage
                ? 'bg-rose-950/30 border-rose-800/60 ring-1 ring-rose-500/30'
                : 'bg-slate-950/50 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {hasPhysicalDamage && <span className="text-rose-400 text-sm">⚠️</span>}
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    Physical Casing Damage / Puncture / Swelling?
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Mechanical breach, structural deformation or cell bulging
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasPhysicalDamage(!hasPhysicalDamage)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  hasPhysicalDamage
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {hasPhysicalDamage ? 'YES' : 'NO'}
              </button>
            </div>
          </div>

          {/* Toggle B: Thermal Irregularity */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              hasThermalIrregularity
                ? 'bg-rose-950/30 border-rose-800/60 ring-1 ring-rose-500/30'
                : 'bg-slate-950/50 border-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {hasThermalIrregularity && <span className="text-rose-400 text-sm">🔥</span>}
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    Thermal Runaway Markers / Hotspots Detected?
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Thermal imaging hotspots, venting residue, or electrolyte odor
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasThermalIrregularity(!hasThermalIrregularity)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  hasThermalIrregularity
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {hasThermalIrregularity ? 'YES' : 'NO'}
              </button>
            </div>
          </div>
        </div>

        {/* 6. Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-950/60 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Running Battery Decision Engine...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Assess EV Battery Pathway</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
