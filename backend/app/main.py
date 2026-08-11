"""
main.py - FastAPI Application Entrypoint

Exposes REST APIs for:
- GET  /api/health                -> Health check & platform status
- POST /api/assess/construction   -> Assesses construction debris inputs -> AssessmentOutput
- POST /api/assess/battery        -> Assesses EV battery inputs -> AssessmentOutput
- POST /api/assess                -> Unified polymorphic assessment endpoint
- POST /api/classify-image        -> Zero-shot CLIP debris image classification
- GET  /api/samples/construction  -> Returns standard sample test cases from sample_data
- GET  /api/samples/battery       -> Returns standard sample test cases from sample_data
- GET  /api/impact-summary        -> Returns running session-scoped cumulative impact
"""

import json
from pathlib import Path
from typing import Any, Dict, List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import AssessmentInput, AssessmentOutput
from app.decision_engine import (
    assess_construction,
    assess_battery,
    evaluate_item,
    get_cumulative_impact,
    clear_session_ledger,
)
from app.classifier import classify_material_image
from app.module_a_construction import get_sample_construction_inputs
from app.module_b_battery import get_sample_battery_inputs

app = FastAPI(
    title="S15 — Intelligent Waste-Recovery Platform API",
    description="Unified decision engine assessing demolition construction materials and end-of-life EV batteries for optimal 5-pathway circular recovery.",
    version="1.0.0"
)

# Enable CORS for frontend development server (Vite default is 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAMPLE_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "sample_data"


@app.get("/")
@app.get("/api/health")
def health_check():
    """Simple health check returning platform state and operational metadata."""
    return {
        "status": "healthy",
        "service": "S15 — Intelligent Waste-Recovery Platform",
        "version": "1.0.0",
        "supported_streams": ["construction", "battery"],
        "pathways": ["Reuse", "Refurbishment", "Repurposing", "Recycling", "Disposal"],
        "vision_engine": "CLIP zero-shot classification (openai/clip-vit-base-patch32)"
    }


@app.post("/api/assess/construction", response_model=AssessmentOutput)
def assess_construction_endpoint(payload: AssessmentInput):
    """
    Evaluates construction material debris (concrete, brick, wood, metal, mixed rubble).
    Guarantees the standardized AssessmentOutput data contract.
    """
    return assess_construction(payload)


@app.post("/api/assess/battery", response_model=AssessmentOutput)
def assess_battery_endpoint(payload: AssessmentInput):
    """
    Evaluates end-of-life EV battery packs/modules (SOH%, cycles, IR, chemistry, casing).
    Guarantees the standardized AssessmentOutput data contract.
    """
    return assess_battery(payload)


@app.post("/api/assess", response_model=AssessmentOutput)
def assess_unified_endpoint(payload: AssessmentInput):
    """
    Polymorphic unified assessment endpoint routing items dynamically based on payload.stream.
    """
    return evaluate_item(payload)


@app.post("/api/classify-image")
async def classify_image_endpoint(file: UploadFile = File(...)):
    """
    Accepts an uploaded image file and runs zero-shot CLIP classification against
    5 natural candidate debris descriptions, returning material_type and confidence.
    """
    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty image file provided.")
        
        material_type, confidence = classify_material_image(image_bytes)
        return {
            "material_type": material_type,
            "confidence": confidence,
            "filename": file.filename
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image classification error: {str(e)}")


@app.get("/api/samples/construction")
def get_construction_samples_endpoint() -> List[Dict[str, Any]]:
    """Reads and returns sample construction debris records for instant demo testing."""
    sample_file = SAMPLE_DATA_DIR / "construction_samples.json"
    if sample_file.exists():
        try:
            with open(sample_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return get_sample_construction_inputs()


@app.get("/api/samples/battery")
def get_battery_samples_endpoint() -> List[Dict[str, Any]]:
    """Reads and returns sample EV battery records for instant demo testing."""
    sample_file = SAMPLE_DATA_DIR / "battery_samples.json"
    if sample_file.exists():
        try:
            with open(sample_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return get_sample_battery_inputs()


@app.get("/api/impact-summary")
def get_impact_summary_endpoint() -> Dict[str, Any]:
    """
    Returns running cumulative impact metrics aggregated across all assessments
    evaluated during this session (INR recovered, kg diverted, pathway distributions).
    """
    return get_cumulative_impact()


@app.post("/api/reset-session")
def reset_session_endpoint():
    """Resets the in-memory assessment ledger for demo freshness."""
    clear_session_ledger()
    return {"status": "success", "message": "Session ledger reset successfully."}
