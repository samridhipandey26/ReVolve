"""
schemas.py - Pydantic Data Contracts for Unified Decision Engine

================================================================================
CRITICAL ARCHITECTURAL CONTRACT:
Both assessment modules (Stream A: Construction Debris & Stream B: EV Batteries)
MUST produce the exact `AssessmentOutput` shape defined below.

This unified data shape enables:
1. A single polymorphic decision engine orchestration layer.
2. A single shared card / dashboard UI component on the frontend to render results
   from either stream without stream-specific UI branching.
================================================================================
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class PathwayEnum(str, Enum):
    """The 5 standardized circular economy recovery pathways."""
    REUSE = "Reuse"
    REFURBISHMENT = "Refurbishment"
    REPURPOSING = "Repurposing"
    RECYCLING = "Recycling"
    DISPOSAL = "Disposal"


class WasteStreamEnum(str, Enum):
    """The 2 primary waste input streams assessed by the platform."""
    CONSTRUCTION = "construction"
    BATTERY = "battery"


class AssessmentInput(BaseModel):
    """
    Flexible input model capable of receiving assessment requests from either
    Stream A (Demolished Construction Materials) or Stream B (End-of-Life EV Batteries).
    
    Supports specific core attributes as well as flexible arbitrary key-value properties.
    """
    model_config = ConfigDict(extra="allow")

    item: str = Field(
        ...,
        description="Name or identifier of the item, e.g. 'Concrete Slab - Sample 2' or 'EV Battery Pack - Sample 3'"
    )
    stream: WasteStreamEnum = Field(
        ...,
        description="Source waste stream: 'construction' or 'battery'"
    )

    # --- Common & Construction Specific Fields (Optional) ---
    material_type: Optional[str] = Field(None, description="e.g. Concrete, Structural Steel, Timber, Clay Brick")
    structural_integrity_score: Optional[float] = Field(None, ge=0, le=100, description="Score 0-100")
    contamination_level: Optional[str] = Field(None, description="e.g. None, Surface rust, Trace plaster, Hazardous")
    dimensions_uniformity: Optional[str] = Field(None, description="e.g. High, Medium, Low")
    moisture_content_pct: Optional[float] = Field(None, description="Moisture percentage")
    pest_infestation: Optional[str] = Field(None, description="e.g. None, Moderate, Severe")

    # --- EV Battery Specific Fields (Optional) ---
    chemistry: Optional[str] = Field(None, description="e.g. NMC, LFP, NCA, LTO")
    soh_percentage: Optional[float] = Field(None, ge=0, le=100, description="State of Health percentage 0-100")
    cycle_count: Optional[int] = Field(None, ge=0, description="Total charge/discharge cycles elapsed")
    internal_resistance_mohm: Optional[float] = Field(None, ge=0, description="Internal resistance in milli-ohms")
    nominal_capacity_ah: Optional[float] = Field(None, description="Nominal capacity in Amp-hours")
    casing_condition: Optional[str] = Field(None, description="e.g. Pristine, Minor scratch, Swollen, Punctured")
    thermal_runaway_markers: Optional[bool] = Field(None, description="True if dangerous thermal runaway signs exist")

    # Flexible arbitrary key-value storage for additional parameters
    properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="Any additional custom telemetry or physical inspection metrics"
    )


class AssessmentOutput(BaseModel):
    """
    Unified output contract returned by the decision engine for every item.
    
    Both Stream A and Stream B assessment modules guarantee this exact shape.
    """
    item: str = Field(
        ...,
        description="Identifier or name of the assessed item"
    )
    stream: WasteStreamEnum = Field(
        ...,
        description="The source stream: 'construction' or 'battery'"
    )
    assessed_condition: str = Field(
        ...,
        description="Human-readable condition summary (e.g. 'Good structural capacity with surface oxidation')"
    )
    recommended_pathway: PathwayEnum = Field(
        ...,
        description="The optimal circular recovery pathway: 'Reuse' | 'Refurbishment' | 'Repurposing' | 'Recycling' | 'Disposal'"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Confidence level of the recommendation as a percentage (0.0 to 100.0)"
    )
    reasoning: str = Field(
        ...,
        description="1-3 sentence explanation justifying the rule-based decision"
    )
    estimated_value_recovered: str = Field(
        ...,
        description="Estimated monetary recovery comparison, e.g. '₹4,200 (vs ₹800 if sent directly to recycling)'"
    )
    environmental_impact: str = Field(
        ...,
        description="Calculated environmental savings, e.g. 'Avoids ~35 kg of landfill/hazardous waste'"
    )
    safety_flags: List[str] = Field(
        default_factory=list,
        description="List of detected safety or hazard flags, empty list [] if none"
    )
