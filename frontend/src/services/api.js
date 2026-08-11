/**
 * api.js - Centralized API Service for S15 Waste-Recovery Platform
 */

const API_BASE = '/api'

export async function classifyImageApi(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/classify-image`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Image classification failed')
    throw new Error(`Server returned ${response.status}: ${errText}`)
  }

  return response.json()
}

export async function assessConstructionApi(payload) {
  const response = await fetch(`${API_BASE}/assess/construction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Assessment request failed')
    throw new Error(`Server returned ${response.status}: ${errText}`)
  }

  return response.json()
}

export async function assessBatteryApi(payload) {
  const response = await fetch(`${API_BASE}/assess/battery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Assessment request failed')
    throw new Error(`Server returned ${response.status}: ${errText}`)
  }

  return response.json()
}

export async function getConstructionSamplesApi() {
  const response = await fetch(`${API_BASE}/samples/construction`)
  if (!response.ok) {
    throw new Error(`Failed to load construction samples (${response.status})`)
  }
  return response.json()
}

export async function getBatterySamplesApi() {
  const response = await fetch(`${API_BASE}/samples/battery`)
  if (!response.ok) {
    throw new Error(`Failed to load battery samples (${response.status})`)
  }
  return response.json()
}

export async function getImpactSummaryApi() {
  const response = await fetch(`${API_BASE}/impact-summary`)
  if (!response.ok) {
    throw new Error(`Failed to fetch cumulative impact (${response.status})`)
  }
  return response.json()
}

export async function resetSessionApi() {
  const response = await fetch(`${API_BASE}/reset-session`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error(`Failed to reset session (${response.status})`)
  }
  return response.json()
}
