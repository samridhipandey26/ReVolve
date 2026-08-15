import React, { useState, useEffect, useRef } from 'react'
import { classifyImageApi, assessConstructionApi, getConstructionSamplesApi } from '../services/api'

const MATERIAL_OPTIONS = [
  { id: 'concrete', label: 'Concrete (Slabs / Beams / RCA)' },
  { id: 'brick', label: 'Brick & Masonry' },
  { id: 'wood', label: 'Wood & Timber' },
  { id: 'metal', label: 'Metal & Steel Rebar' },
  { id: 'mixed', label: 'Mixed / Contaminated Rubble' },
]

export default function ConstructionInputFlow({ onAssessmentComplete, onError }) {
  // Form State
  const [itemLabel, setItemLabel] = useState('Demolition Material Item')
  const [materialType, setMaterialType] = useState('concrete')
  const [classificationConfidence, setClassificationConfidence] = useState(90.0)
  const [isMixed, setIsMixed] = useState(false)
  const [isStructuralGrade, setIsStructuralGrade] = useState(true)
  const [visibleDamageLevel, setVisibleDamageLevel] = useState('none')

  // Image upload state
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [classificationResult, setClassificationResult] = useState(null)
  const [isManuallyOverridden, setIsManuallyOverridden] = useState(false)
  // isUncertain=true when backend confidence < 75% — shows prominent override prompt
  const [isUncertain, setIsUncertain] = useState(false)

  // Assessment loading state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Samples preset state
  const [samplePresets, setSamplePresets] = useState([])
  const [loadingSamples, setLoadingSamples] = useState(false)

  const fileInputRef = useRef(null)

  // Fetch sample presets on component mount
  useEffect(() => {
    async function loadSamples() {
      try {
        setLoadingSamples(true)
        const samples = await getConstructionSamplesApi()
        setSamplePresets(samples)
      } catch (err) {
        console.warn('Could not load samples from API, using defaults:', err)
        // Fallback default presets if backend is initializing
        setSamplePresets([
          {
            item: 'Structural Concrete Slab — Sample 1',
            stream: 'construction',
            material_type: 'concrete',
            classification_confidence: 96.5,
            is_structural_grade: true,
            is_mixed_with_other_debris: false,
            visible_damage_level: 'none',
          },
          {
            item: 'Heritage Clay Brick — Sample 2',
            stream: 'construction',
            material_type: 'brick',
            classification_confidence: 94.0,
            is_structural_grade: true,
            is_mixed_with_other_debris: false,
            visible_damage_level: 'minor',
          },
          {
            item: 'Hardwood Timber Truss — Sample 3',
            stream: 'construction',
            material_type: 'wood',
            classification_confidence: 92.0,
            is_structural_grade: true,
            is_mixed_with_other_debris: false,
            visible_damage_level: 'none',
          },
          {
            item: 'Deformed Steel Rebar — Sample 4',
            stream: 'construction',
            material_type: 'metal',
            classification_confidence: 98.0,
            is_structural_grade: true,
            is_mixed_with_other_debris: true,
            visible_damage_level: 'minor',
          },
          {
            item: 'Contaminated Rubble — Sample 5',
            stream: 'construction',
            material_type: 'mixed',
            classification_confidence: 88.5,
            is_structural_grade: false,
            is_mixed_with_other_debris: true,
            visible_damage_level: 'significant',
          },
        ])
      } finally {
        setLoadingSamples(false)
      }
    }
    loadSamples()
  }, [])

  // Handle file selection and zero-shot CLIP classification
  const handleFileChange = async (file) => {
    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setIsClassifying(true)
    setClassificationResult(null)
    setIsManuallyOverridden(false)

    try {
      const res = await classifyImageApi(file)
      const detectedMat = res.material_type || 'concrete'
      const conf = typeof res.confidence === 'number' ? res.confidence : 90.0
      // uncertain flag from backend (confidence < 75%) — auto-expand override dropdown
      const uncertain = !!res.uncertain

      setMaterialType(detectedMat)
      setClassificationConfidence(conf)
      setIsUncertain(uncertain)
      setClassificationResult({
        material_type: detectedMat,
        confidence: conf,
        uncertain,
      })

      // Default contextual questions based on detected material
      if (detectedMat === 'metal' || detectedMat === 'mixed') {
        setIsStructuralGrade(false)
      } else {
        setIsStructuralGrade(true)
      }
      setItemLabel(`Classified Debris (${file.name})`)
    } catch (err) {
      console.error('Image classification error:', err)
      if (onError) onError(`Vision AI classification notice: ${err.message}. You can manually select the material below.`)
    } finally {
      setIsClassifying(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  // Handle manual dropdown override
  const handleMaterialOverride = (e) => {
    const val = e.target.value
    setMaterialType(val)
    setIsManuallyOverridden(true)
    if (val !== 'concrete' && val !== 'brick') {
      setIsStructuralGrade(false)
    }
  }

  // Submit assessment to backend
  const handleSubmitAssessment = async (e) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      item: itemLabel || 'Construction Debris Item',
      stream: 'construction',
      material_type: materialType,
      classification_confidence: classificationConfidence,
      is_mixed_with_other_debris: isMixed,
      is_structural_grade: isStructuralGrade,
      visible_damage_level: visibleDamageLevel,
    }

    try {
      const result = await assessConstructionApi(payload)
      if (onAssessmentComplete) {
        onAssessmentComplete(result)
      }
    } catch (err) {
      console.error('Assessment submission error:', err)
      if (onError) onError(`Assessment error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick preset click handler (direct assessment for fast demos)
  const handleSelectSample = async (sample) => {
    setItemLabel(sample.item || 'Demolition Sample')
    setMaterialType(sample.material_type || 'concrete')
    setClassificationConfidence(sample.classification_confidence || 95.0)
    setIsMixed(!!sample.is_mixed_with_other_debris)
    setIsStructuralGrade(!!sample.is_structural_grade)
    setVisibleDamageLevel(sample.visible_damage_level || 'none')
    setImagePreview(null)
    setImageFile(null)
    setClassificationResult({
      material_type: sample.material_type,
      confidence: sample.classification_confidence,
    })

    // Execute direct assessment via API
    setIsSubmitting(true)
    try {
      const result = await assessConstructionApi(sample)
      if (onAssessmentComplete) {
        onAssessmentComplete(result)
      }
    } catch (err) {
      console.error('Sample assessment failed:', err)
      if (onError) onError(`Sample evaluation failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isConcreteOrBrick = materialType === 'concrete' || materialType === 'brick'

  return (
    <div className="space-y-6">
      {/* 1. Try a Sample Preset Section (Quick Demo Access) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <span>⚡</span>
            <span>Try a Preset Sample</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">1-Click Live Assessment</span>
        </div>
        <p className="text-xs text-slate-400">
          Skip upload and execute standard test cases directly through the decision engine:
        </p>
        <div className="flex flex-wrap gap-2">
          {samplePresets.map((sample, idx) => {
            const icons = ['🏗️ Concrete', '🧱 Brick', '🪵 Timber', '⛓️ Rebar', '⚠️ Rubble']
            const iconLabel = icons[idx % icons.length]
            return (
              <button
                key={sample.item || idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 text-slate-200 hover:bg-emerald-600 hover:text-white border border-slate-700/80 hover:border-emerald-500 transition shadow-sm disabled:opacity-50"
              >
                {iconLabel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Behind the scenes "How this works" Collapsible Card */}
      <details className="group rounded-2xl border border-slate-800/90 bg-slate-900/40 p-4 transition text-xs text-slate-400">
        <summary className="font-semibold text-slate-300 cursor-pointer flex items-center justify-between list-none select-none">
          <span className="flex items-center space-x-2">
            <span className="text-emerald-400">💡</span>
            <span>How Module A Works (Behind the Scenes)</span>
          </span>
          <span className="text-slate-500 text-[10px] group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2 text-slate-400 text-[11px] leading-relaxed">
          <p>
            <strong className="text-slate-200">1. Zero-Shot Vision:</strong> Uses a pretrained CLIP model (OpenAI ViT-B/32) to match debris textures against 5 candidate prompts without task retraining.
          </p>
          <p>
            <strong className="text-slate-200">2. Circular Recovery Hierarchy:</strong> Applies multi-criteria decision rules prioritizing structural Reuse &gt; Refurbishment &gt; Repurposing &gt; Aggregate Recycling &gt; Controlled Disposal.
          </p>
        </div>
      </details>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmitAssessment}
        className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 space-y-6 shadow-xl shadow-black/20"
      >
        {/* Form Title & Item Label */}
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <span className="text-emerald-400 text-base">🏗️</span>
              <span>Demolition Waste Assessment</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Module A
            </span>
          </div>
          <input
            type="text"
            value={itemLabel}
            onChange={(e) => setItemLabel(e.target.value)}
            placeholder="Item Label / Batch Name (e.g. Concrete Slab - North Wing)"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        {/* 2. Image Upload Dropzone */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            1. Material Photo (CLIP Zero-Shot Vision AI)
          </label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 ${
              isClassifying
                ? 'border-emerald-500/60 bg-emerald-500/5 animate-pulse'
                : imagePreview
                ? 'border-emerald-500/40 bg-slate-950/60'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
            />

            {imagePreview ? (
              <div className="flex items-center space-x-4">
                <img
                  src={imagePreview}
                  alt="Debris Preview"
                  className="w-16 h-16 object-cover rounded-xl border border-slate-700 shadow-md shrink-0"
                />
                <div className="text-left flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {imageFile?.name || 'Uploaded Material Photo'}
                  </div>
                  <div className="text-[11px] text-slate-400">Click or drag to replace image</div>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-1">
                <div className="text-2xl mb-1">📸</div>
                <div className="text-xs font-medium text-slate-200">
                  Drop a photo of the demolished material here
                </div>
                <div className="text-[11px] text-slate-500">
                  Supports JPEG, PNG, WebP • Powered by CLIP zero-shot vision classifier
                </div>
              </div>
            )}
          </div>

          {/* Classification Status Banner — confident vs uncertain */}
          {isClassifying && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-xs text-emerald-300">
              <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Analysing your photo...</span>
            </div>
          )}

          {classificationResult && !isClassifying && (
            isUncertain ? (
              // LOW CONFIDENCE — amber warning, override dropdown will be highlighted
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400 font-bold">⚠</span>
                    <span className="text-amber-200 font-semibold">
                      Low confidence detection — please confirm below
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-[10px]">
                    {classificationResult.confidence.toFixed(1)}%
                  </span>
                </div>
                <p className="text-amber-300/80 leading-relaxed">
                  Best guess: <strong className="capitalize text-amber-200">{classificationResult.material_type}</strong> — but we're not confident. Please use the dropdown below to confirm or correct the material type before submitting.
                </p>
              </div>
            ) : (
              // HIGH CONFIDENCE — green confirmation
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-300">
                    Detected: <strong className="text-white capitalize">{classificationResult.material_type}</strong>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                    {classificationResult.confidence.toFixed(1)}% confidence
                  </span>
                </div>
                {isManuallyOverridden && (
                  <span className="text-[10px] text-amber-400 font-medium">Manually Modified</span>
                )}
              </div>
            )
          )}
        </div>

        {/* 3. Material Type Selector — highlighted amber ring when classification is uncertain */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Material Classification
            </label>
            {isUncertain && !isManuallyOverridden && (
              <span className="text-[10px] text-amber-400 font-semibold animate-pulse">⚠ Confirm required</span>
            )}
            {isManuallyOverridden && (
              <span className="text-[10px] text-emerald-400 font-semibold">✓ Confirmed</span>
            )}
          </div>
          <select
            value={materialType}
            onChange={handleMaterialOverride}
            className={`w-full bg-slate-950/90 border rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none transition ${
              isUncertain && !isManuallyOverridden
                ? 'border-amber-500/60 ring-2 ring-amber-400/30 focus:border-amber-400 focus:ring-amber-400/50'
                : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
            }`}
          >
            {MATERIAL_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          {isUncertain && !isManuallyOverridden && (
            <p className="text-[11px] text-amber-400/80 leading-relaxed">
              Select the correct material from the dropdown above, then submit your assessment.
            </p>
          )}
        </div>

        {/* 4. Follow-up Context Questions */}
        <div className="space-y-4 pt-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
            3. Physical & Site Condition Questions
          </div>

          {/* Question A: Mixed with other debris? */}
          <div className="space-y-1.5">
            <div className="text-xs text-slate-300 font-medium">
              Is it mixed with other construction debris / rubble?
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsMixed(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                  !isMixed
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                No (Clean / Segregated)
              </button>
              <button
                type="button"
                onClick={() => setIsMixed(true)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                  isMixed
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Yes (Co-mingled)
              </button>
            </div>
          </div>

          {/* Question B: Structural-grade material? (Conditional for Concrete & Brick) */}
          {isConcreteOrBrick && (
            <div className="space-y-1.5 transition-all">
              <div className="text-xs text-slate-300 font-medium">
                Is this load-bearing / structural-grade material?
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsStructuralGrade(true)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                    isStructuralGrade
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Yes (Structural Grade)
                </button>
                <button
                  type="button"
                  onClick={() => setIsStructuralGrade(false)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                    !isStructuralGrade
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 ring-1 ring-sky-500/30'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  No (Non-Structural)
                </button>
              </div>
            </div>
          )}

          {/* Question C: Visible Damage Level */}
          <div className="space-y-1.5">
            <div className="text-xs text-slate-300 font-medium">
              Visible physical damage level:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'None / Intact' },
                { id: 'minor', label: 'Minor / Surface' },
                { id: 'significant', label: 'Significant' },
              ].map((dmg) => (
                <button
                  key={dmg.id}
                  type="button"
                  onClick={() => setVisibleDamageLevel(dmg.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition text-center ${
                    visibleDamageLevel === dmg.id
                      ? 'bg-slate-800 text-white border border-slate-600 ring-2 ring-emerald-400/40'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {dmg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isClassifying}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-950/60 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Running Decision Engine...</span>
            </>
          ) : (
            <>
              <span>♺</span>
              <span>Get Circular Recommendation</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
