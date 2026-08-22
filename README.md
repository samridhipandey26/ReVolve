# ♻️ ReVolve

### One Platform. Two Waste Streams. Five Circular Pathways.

**ReVolve** is a circular-economy triage platform designed to transform how **demolished construction materials** and **end-of-life EV batteries** are assessed and routed.

Instead of treating waste as something to simply discard, ReVolve evaluates its condition and identifies the most suitable recovery pathway:

> **Reuse → Refurbishment → Repurposing → Recycling → Disposal**

Alongside the recommended pathway, ReVolve provides **instant value estimates** and **CO₂ impact estimates**, helping users understand both the economic and environmental potential of recovered resources.

---

## 🌍 The Problem

Construction and transportation are generating rapidly increasing quantities of material and battery waste.

Yet a material reaching its "end of life" does **not necessarily mean it has reached the end of its useful life**.

A demolished steel beam may still be reusable.

A damaged wooden structure may be refurbished.

An EV battery that is no longer suitable for a vehicle may still have value in another application.

The challenge is determining:

> **What should happen to this material next?**

Traditional disposal-oriented workflows often fail to capture this remaining value.

---

# 💡 The ReVolve Approach

ReVolve turns a waste assessment into a **circularity decision**.

```text
             MATERIAL / BATTERY
                    │
                    ▼
             ┌──────────────┐
             │   ASSESS     │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │   TRIAGE     │
             └──────┬───────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      REUSE    REFURBISH    REPURPOSE
        │           │           │
        └───────────┼───────────┘
                    ▼
                RECYCLE
                    │
                    ▼
                DISPOSAL
```

The platform prioritizes **higher-value circular pathways first**, while keeping disposal as the final option when recovery is not viable.

---

# 🏗️ Construction Material Triage

ReVolve currently supports major construction-material categories including:

* 🧱 Concrete
* 🧱 Brick
* 🪵 Wood
* 🔩 Steel
* 🪨 Rubble

Users provide relevant material information and receive a recommended circular pathway.

### Example

```text
Material
Steel

Condition
Good

Quantity
2.5 tonnes

        ↓

Recommended Pathway
♻️ REUSE

Estimated Value
₹XX,XXX

Estimated CO₂ Impact
XX kg CO₂e
```

---

# ⚡ EV Battery Triage

ReVolve also provides a dedicated assessment workflow for **EV battery packs**.

The assessment considers battery characteristics such as:

* Battery chemistry
* Capacity
* State of Health
* Degradation
* Battery condition

Supported chemistry options include:

* **NMC**
* **LFP**
* **NCA**
* **LTO**

The system then evaluates the battery and routes it toward the most appropriate circular pathway.

```text
              EV BATTERY
                   │
                   ▼
          Battery Assessment
                   │
                   ▼
          Condition Analysis
                   │
                   ▼
            Circular Triage
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
     REUSE    REFURBISH    REPURPOSE
       │           │           │
       └───────────┼───────────┘
                   ▼
               RECYCLE
                   │
                   ▼
               DISPOSAL
```

---

# ♻️ Five Circular Pathways

## 01 — Reuse

The material or battery remains suitable for its original or substantially similar purpose.

**Goal:** Preserve the highest possible value with minimal intervention.

---

## 02 — Refurbishment

The asset requires restoration, repair, or component-level intervention before being returned to productive use.

**Goal:** Extend useful life rather than replace the asset.

---

## 03 — Repurposing

The asset is no longer optimal for its original application but can serve another useful purpose.

**Example:**

An EV battery that is no longer ideal for vehicle use may have potential for stationary energy applications.

---

## 04 — Recycling

When further direct use is no longer viable, recoverable materials can be directed toward recycling.

**Goal:** Recover valuable resources instead of sending them directly to disposal.

---

## 05 — Disposal

Disposal is considered when the material or battery is not suitable for the other recovery pathways.

**Goal:** Make disposal the last resort rather than the default.

---

# 💰 Instant Value Estimation

ReVolve goes beyond simply recommending a pathway.

It also estimates the potential **economic value** associated with the recovered material or battery.

```text
Assessment
    ↓
Circular Pathway
    ↓
Estimated Recoverable Value
```

This allows users to understand:

> **"What could this waste stream still be worth?"**

Values shown by the platform are **estimates for decision support**, not guaranteed market prices.

---

# 🌱 CO₂ Impact Estimation

Circular recovery can avoid part of the environmental burden associated with producing new materials.

ReVolve therefore provides an estimated **CO₂ impact** for the selected pathway.

```text
             Circular Recovery
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   Material Recovery    Extended Lifetime
          │                   │
          └─────────┬─────────┘
                    ▼
            Estimated CO₂ Impact
```

This gives users a second dimension of value:

### 💰 Economic Value

and

### 🌱 Environmental Value

---

# 🧭 User Journey

ReVolve is designed around a simple assessment workflow.

```text
┌───────────────┐
│   Start       │
└───────┬───────┘
        ↓
┌───────────────┐
│ Choose Waste  │
│ Stream        │
└───────┬───────┘
        ↓
 ┌──────┴──────┐
 ↓             ↓
Construction   EV Battery
Materials
 ↓             ↓
Assessment    Assessment
 └──────┬──────┘
        ↓
┌───────────────┐
│ Triage Result │
└───────┬───────┘
        ↓
┌──────────────────────────┐
│ Pathway + Value + CO₂    │
└──────────────────────────┘
```

---

# 🖥️ Platform Experience

The interface is designed around a **step-by-step triage wizard** so that users do not have to understand complex waste-management processes.

### Core experience

* Simple guided assessment
* Separate construction and EV workflows
* Condition-based evaluation
* Clear pathway recommendation
* Estimated economic value
* Estimated environmental impact
* Easy reset and reassessment

---

# 🏛️ System Architecture

```text
                         ┌──────────────┐
                         │     USER     │
                         └──────┬───────┘
                                │
                                ▼
                     ┌───────────────────┐
                     │   ReVolve UI      │
                     │                   │
                     │ Assessment Wizard │
                     └─────────┬─────────┘
                               │
                               ▼
                     ┌───────────────────┐
                     │  Triage Workflow  │
                     └─────────┬─────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             Construction             EV Battery
              Assessment              Assessment
                    │                     │
                    └──────────┬──────────┘
                               ▼
                     ┌───────────────────┐
                     │  Decision Engine  │
                     └─────────┬─────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
              Reuse      Refurbishment    Repurposing
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                           Recycling
                               │
                               ▼
                           Disposal
                               │
                               ▼
                     ┌───────────────────┐
                     │ Impact Estimation │
                     ├───────────────────┤
                     │ 💰 Value          │
                     │ 🌱 CO₂ Impact     │
                     └───────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Python
* FastAPI
* Pydantic
* Uvicorn

### Development

* Git
* GitHub

---

# 📁 Project Structure

```text
ReVolve/
│
├── backend/
│   ├── ...
│   └── ...
│
├── frontend/
│   ├── ...
│   └── ...
│
├── sample_data/
│   └── ...
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/samridhipandey26/ReVolve.git
cd ReVolve
```

## Backend

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn app:app --reload
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the development URL displayed by Vite.

---

# 🎯 What ReVolve Delivers

| Capability                       | ReVolve |
| -------------------------------- | ------- |
| Construction material assessment | ✅       |
| EV battery assessment            | ✅       |
| Reuse pathway                    | ✅       |
| Refurbishment pathway            | ✅       |
| Repurposing pathway              | ✅       |
| Recycling pathway                | ✅       |
| Disposal pathway                 | ✅       |
| Economic value estimate          | ✅       |
| CO₂ impact estimate              | ✅       |
| Guided triage workflow           | ✅       |

---

# 🌎 Vision

ReVolve aims to move the conversation around waste from:

> **"Where should this be disposed of?"**

to:

> **"How much value can we recover from it?"**

By connecting **assessment, circular pathways, economic value, and environmental impact** in one platform, ReVolve provides a foundation for more informed resource-recovery decisions.

---

# ♻️ ReVolve

### **Waste isn't always waste. Sometimes, it just needs a second direction.**

**Assess. Recover. Reuse. ReVolve.**
