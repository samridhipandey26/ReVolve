"""
module_a_construction.py - Stream A: Demolished Construction Materials Assessment Module

Assesses demolition waste items (concrete, brick, wood, metal, mixed rubble) using
a multi-criteria rule engine to determine the optimal circular economy recovery pathway:
- Reuse (1)
- Refurbishment (2)
- Repurposing (3)
- Recycling (4)
- Disposal (5)

Core Inputs:
- material_type: "concrete" | "brick" | "wood" | "metal" | "mixed"
- classification_confidence: float (0.0 to 100.0) from image classifier / sensor
- is_mixed_with_other_debris: bool (True if co-mingled with unsegregated site waste)
- is_structural_grade: bool (True if load-bearing grade concrete or structural brick/timber)
- visible_damage_level: "none" | "minor" | "significant"

Baseline Volume Assumption:
- Each evaluated batch/unit represents approximately ~500 kg of construction material.
"""

from typing import Any, Dict, List, Optional, Tuple, Union
from app.schemas import AssessmentInput, AssessmentOutput, PathwayEnum, WasteStreamEnum
from app.classifier import classify_material_image


# --- Heuristic Pricing and Environmental Constants (Placeholder heuristics for MVP) ---
ASSUMED_UNIT_WEIGHT_KG = 500  # Assumed standard batch weight for environmental diversion metrics


def assess_construction_waste(
    data: Optional[Union[AssessmentInput, Dict[str, Any]]] = None,
    *,
    material_type: Optional[str] = None,
    classification_confidence: Optional[float] = None,
    is_mixed_with_other_debris: Optional[bool] = None,
    is_structural_grade: Optional[bool] = None,
    visible_damage_level: Optional[str] = None,
    item: Optional[str] = None,
) -> AssessmentOutput:
    """
    Evaluates construction material debris and outputs a standardized AssessmentOutput.

    Accepts inputs either as an AssessmentInput / dictionary or as direct keyword arguments
    for independent testing decoupled from computer vision models.
    """
    # 1. Normalize input parameters from polymorphic sources
    extracted_props: Dict[str, Any] = {}
    item_name = item or "Construction Debris Item"

    if isinstance(data, AssessmentInput):
        item_name = data.item or item_name
        material_type = data.material_type or material_type
        extracted_props = data.properties or {}
        # Also check properties dict if fields were passed there
        if classification_confidence is None:
            classification_confidence = extracted_props.get("classification_confidence")
        if is_mixed_with_other_debris is None:
            is_mixed_with_other_debris = extracted_props.get("is_mixed_with_other_debris")
        if is_structural_grade is None:
            is_structural_grade = extracted_props.get("is_structural_grade")
        if visible_damage_level is None:
            visible_damage_level = extracted_props.get("visible_damage_level")
    elif isinstance(data, dict):
        item_name = data.get("item", data.get("item_name", item_name))
        material_type = data.get("material_type", material_type)
        extracted_props = data.get("properties", data)
        if classification_confidence is None:
            classification_confidence = extracted_props.get("classification_confidence", 90.0)
        if is_mixed_with_other_debris is None:
            is_mixed_with_other_debris = extracted_props.get("is_mixed_with_other_debris", False)
        if is_structural_grade is None:
            is_structural_grade = extracted_props.get("is_structural_grade", False)
        if visible_damage_level is None:
            visible_damage_level = extracted_props.get("visible_damage_level", "none")

    # Set fallbacks for default values
    mat_type = (material_type or "mixed").strip().lower()
    conf_raw = float(classification_confidence if classification_confidence is not None else 90.0)
    conf_raw = max(0.0, min(100.0, conf_raw))
    is_mixed = bool(is_mixed_with_other_debris)
    is_structural = bool(is_structural_grade)
    damage = (visible_damage_level or "none").strip().lower()

    # Normalize damage strings
    if damage not in ["none", "minor", "significant"]:
        damage = "minor"

    # 2. Decision Logic Engine
    safety_flags: List[str] = []
    rule_certainty = 0.95  # baseline multiplier for confidence

    # RULE 1: Metal always routes to Recycling regardless of condition (high scrap recovery value)
    if mat_type in ["metal", "steel", "rebar", "iron"]:
        recommended_pathway = PathwayEnum.RECYCLING
        assessed_condition = "Structural metal/rebar with intact metallurgical integrity and high scrap value."
        reasoning = (
            "Metal and rebar possess significant recyclable scrap value. Direct remelting into secondary steel billets "
            "achieves high circular resource efficiency regardless of minor surface oxidation or deformation."
        )
        estimated_val = "₹3,800 (vs ₹0 landfill loss; high market scrap demand)"
        env_impact = (
            f"Diverts ~{ASSUMED_UNIT_WEIGHT_KG} kg from landfill; saves ~750 kg CO₂e equivalent compared to "
            "virgin steel smelting."
        )
        rule_certainty = 0.98

    # RULE 2: Mixed or contaminated rubble always routes to Disposal
    elif mat_type in ["mixed", "rubble", "contaminated"]:
        recommended_pathway = PathwayEnum.DISPOSAL
        assessed_condition = "Heterogeneous mixed construction rubble with high contamination and unsegregated debris."
        reasoning = (
            "Unsegregated mixed debris cannot be reliably reprocessed or crushed without severe contamination risk. "
            "Direct routing to authorized landfill or specialized municipal C&D sorting facility is mandatory."
        )
        safety_flags.append("High heterogeneity — unsegregated hazardous particulate risk")
        estimated_val = "₹0 (Cost avoidance: saves ₹1,200 by avoiding improper dumping penalties; hauling tip fee applies)"
        env_impact = (
            f"0 kg diverted from landfill; ~{ASSUMED_UNIT_WEIGHT_KG} kg landfill burden generated. "
            "Recommend pre-demolition selective sorting on future sites."
        )
        rule_certainty = 0.95

    # RULE 3: Concrete Debris
    elif mat_type in ["concrete", "cement", "rcc"]:
        if is_mixed:
            # Co-mingled with other debris pushes to recycling post-screening
            recommended_pathway = PathwayEnum.RECYCLING
            assessed_condition = "Concrete debris co-mingled with secondary rubble; mechanical sorting required."
            reasoning = (
                "Although the concrete possesses compression strength, co-mingling with other site debris precludes direct structural reuse. "
                "Crushing into Recycled Concrete Aggregate (RCA) for road sub-base provides optimal recovery."
            )
            estimated_val = "₹1,600 (vs ₹400 if dumped as generic low-grade fill)"
            env_impact = f"Diverts ~400 kg (80% yield) from landfill; offsets quarrying of virgin river gravel."
            rule_certainty = 0.88
        elif damage == "significant":
            # Heavily cracked/fragmented concrete
            recommended_pathway = PathwayEnum.RECYCLING
            assessed_condition = "Fractured concrete chunks with extensive structural micro-cracks."
            reasoning = (
                "Significant structural fracturing eliminates monolithic load-bearing capacity. "
                "Mechanical jaw-crushing produces high-density aggregate suitable for sub-grade foundation and asphalt mixes."
            )
            estimated_val = "₹1,800 (vs ₹0 landfill loss)"
            env_impact = f"Diverts ~450 kg (90% yield) from landfill; mitigates primary stone aggregate mining."
            rule_certainty = 0.92
        elif damage == "minor" or not is_structural:
            # Minor damage or non-structural grade concrete
            recommended_pathway = PathwayEnum.REPURPOSING
            assessed_condition = "Sound non-structural or lightly spalled concrete units with stable core matrix."
            reasoning = (
                "The material lacks certified structural grade rating for new high-rise builds but retains excellent compressive stability. "
                "Repurposing into non-structural retaining gabions, permeable pavement bases, or landscape embankment fill is recommended."
            )
            estimated_val = "₹2,900 (vs ₹1,100 if downcycled to standard aggregate)"
            env_impact = f"Diverts ~475 kg (95% yield) from landfill; preserves natural boulder formations."
            rule_certainty = 0.90
        else:
            # Clean, structural grade, no visible damage
            recommended_pathway = PathwayEnum.REUSE
            assessed_condition = "Pristine, structural-grade precast concrete units with intact compressive integrity."
            reasoning = (
                "Clean structural-grade concrete elements with zero visible micro-fractures qualify for direct modular reuse "
                "or high-specification engineered aggregate in new structural construction, maximizing embodied carbon retention."
            )
            estimated_val = "₹5,200 (vs ₹1,600 if crushed for road base)"
            env_impact = f"Diverts 100% (~{ASSUMED_UNIT_WEIGHT_KG} kg) from landfill; saves ~420 kg CO₂e embodied carbon."
            rule_certainty = 0.96

    # RULE 4: Clay Brick / Masonry
    elif mat_type in ["brick", "masonry", "clay"]:
        if is_mixed:
            recommended_pathway = PathwayEnum.RECYCLING
            assessed_condition = "Masonry fragments mixed with mortar lumps and foreign aggregates."
            reasoning = (
                "Intermixed debris prevents intact brick salvage. Crushing into surkhi (pozzolanic clay powder) "
                "or permeable sports turf base provides viable circular utilization."
            )
            estimated_val = "₹1,400 (vs ₹0 landfill dumping)"
            env_impact = f"Diverts ~380 kg (76% yield) from landfill; reduces clay mining for sports surfaces."
            rule_certainty = 0.87
        elif damage == "significant":
            recommended_pathway = PathwayEnum.RECYCLING
            assessed_condition = "Severely chipped and fractured clay brick rubble."
            reasoning = (
                "Severe fragmentation compromises compressive strength for masonry walls. "
                "Crushing and grading into pozzolanic binder additive or architectural brick dust is the optimal recovery route."
            )
            estimated_val = "₹1,500 (vs ₹0 landfill disposal fee)"
            env_impact = f"Diverts ~400 kg from landfill; replaces manufactured sand in specialty mortars."
            rule_certainty = 0.92
        elif damage == "minor":
            # Minor mortar adhesion / chipped corners -> Refurbishment
            recommended_pathway = PathwayEnum.REFURBISHMENT
            assessed_condition = "Structurally sound vintage clay bricks with surface mortar adhesion."
            reasoning = (
                "Individual bricks retain high core density but require mechanical mortar-chipping, acid wash cleaning, "
                "and palletization. Refurbished heritage bricks command premium market value for exposed architectural facades."
            )
            estimated_val = "₹4,400 (vs ₹1,200 if crushed into generic aggregate)"
            env_impact = f"Diverts ~480 kg (96% yield) from landfill; avoids kiln-firing emissions of new clay bricks."
            rule_certainty = 0.93
        else:
            # Intact, clean bricks -> Direct Reuse
            recommended_pathway = PathwayEnum.REUSE
            assessed_condition = "Intact, clean structural clay bricks with sharp edges and minimal mortar residue."
            reasoning = (
                "Intact reclaimed clay bricks exhibit high compressive load capacity and pristine geometry. "
                "Direct reuse in new masonry partition walls or architectural paving avoids all remanufacturing energy."
            )
            estimated_val = "₹5,800 (vs ₹1,500 if sent for mechanical crushing)"
            env_impact = f"Diverts 100% (~{ASSUMED_UNIT_WEIGHT_KG} kg) from landfill; saves ~380 kg CO₂e kiln emissions."
            rule_certainty = 0.97

    # RULE 5: Timber / Wood
    elif mat_type in ["wood", "timber", "lumber"]:
        if damage == "significant":
            recommended_pathway = PathwayEnum.DISPOSAL
            assessed_condition = "Rotten, pest-damaged or chemically treated structural timber beyond salvage."
            safety_flags.append("Biological decay or potential chemical preservative treatment")
            reasoning = (
                "Extensive dry rot and structural compromise prevent mechanical repurposing. "
                "Controlled non-hazardous disposal or regulated biomass energy recovery is required."
            )
            estimated_val = "₹0 (Cost avoidance: prevents biohazard/termite spread to secondary construction sites)"
            env_impact = "0 kg diverted as durable material; requires controlled incineration/disposal."
            rule_certainty = 0.91
        elif is_mixed:
            recommended_pathway = PathwayEnum.RECYCLING
            assessed_condition = "Assorted reclaimed timber cuts mixed with metal fasteners and drywall scrap."
            reasoning = (
                "Intermixed timber sections require mechanical fastener removal and chipping for engineered particleboard "
                "or industrial boiler biomass fuel."
            )
            estimated_val = "₹1,700 (vs ₹300 scrap salvage)"
            env_impact = f"Diverts ~350 kg (70% yield) from landfill; reduces virgin forestry timber harvesting."
            rule_certainty = 0.86
        elif damage == "minor":
            recommended_pathway = PathwayEnum.REFURBISHMENT
            assessed_condition = "Hardwood beams with embedded nails, minor surface weathering, and varnish coating."
            reasoning = (
                "Dense hardwood lumber requires de-nailing, surface thickness planing, and anti-termite sealant treatment "
                "to restore premium architectural structural grade."
            )
            estimated_val = "₹4,800 (vs ₹1,100 if chipped into low-grade mulch)"
            env_impact = f"Diverts ~460 kg (92% yield) from landfill; sequesters biogenic carbon for decades."
            rule_certainty = 0.93
        else:
            # Structurally sound wood -> Repurposing
            recommended_pathway = PathwayEnum.REPURPOSING
            assessed_condition = "Structurally sound reclaimed hardwood lumber with stable grain and low moisture."
            reasoning = (
                "High-grade seasoned timber is ideal for architectural repurposing into premium indoor furniture, "
                "acoustic partition baffles, or decorative wall paneling."
            )
            estimated_val = "₹4,600 (vs ₹900 if downcycled for firewood/mulch)"
            env_impact = f"Diverts ~490 kg (98% yield) from landfill; locks embodied carbon into permanent interior assets."
            rule_certainty = 0.95

    # Fallback for unrecognized materials
    else:
        recommended_pathway = PathwayEnum.DISPOSAL
        assessed_condition = f"Unclassified material '{mat_type}' lacking verifiable circular recovery certification."
        reasoning = (
            "The material parameters could not be conclusively matched with certified circular recovery specifications. "
            "Classified as provisional disposal pending physical lab assay."
        )
        safety_flags.append("Unverified chemical/mineral composition")
        estimated_val = "₹0"
        env_impact = f"0 kg diverted from landfill without certified assay."
        rule_certainty = 0.70

    # 3. Compute final synthesized confidence score
    final_confidence = round(conf_raw * rule_certainty, 1)

    return AssessmentOutput(
        item=item_name,
        stream=WasteStreamEnum.CONSTRUCTION,
        assessed_condition=assessed_condition,
        recommended_pathway=recommended_pathway,
        confidence=final_confidence,
        reasoning=reasoning,
        estimated_value_recovered=estimated_val,
        environmental_impact=env_impact,
        safety_flags=safety_flags,
    )


def get_sample_construction_inputs() -> List[Dict[str, Any]]:
    """
    Returns 5 varied construction test cases covering all 5 circular recovery pathways:
    1. Reuse (Pristine structural concrete slab)
    2. Refurbishment (Reclaimed vintage heritage bricks with mortar)
    3. Repurposing (Seasoned hardwood roof trusses)
    4. Recycling (Structural steel I-beams & deformed rebar)
    5. Disposal (Unsegregated contaminated demolition rubble)
    """
    return [
        {
            "item": "Concrete Slab - Sample 1 (Structural Precast)",
            "stream": "construction",
            "material_type": "concrete",
            "classification_confidence": 96.5,
            "is_structural_grade": True,
            "is_mixed_with_other_debris": False,
            "visible_damage_level": "none",
            "properties": {
                "compressive_strength_mpa": 35.0,
                "rebar_exposure": "None",
            },
        },
        {
            "item": "Heritage Clay Brick - Sample 2 (Vintage Masonry)",
            "stream": "construction",
            "material_type": "brick",
            "classification_confidence": 94.0,
            "is_structural_grade": True,
            "is_mixed_with_other_debris": False,
            "visible_damage_level": "minor",
            "properties": {
                "mortar_adhesion": "Surface lime mortar",
                "intact_ratio_pct": 92.0,
            },
        },
        {
            "item": "Hardwood Timber Truss - Sample 3 (Seasoned Teak)",
            "stream": "construction",
            "material_type": "wood",
            "classification_confidence": 92.0,
            "is_structural_grade": True,
            "is_mixed_with_other_debris": False,
            "visible_damage_level": "none",
            "properties": {
                "moisture_content_pct": 11.5,
                "pest_damage": "None",
            },
        },
        {
            "item": "Deformed Steel Rebar - Sample 4 (Reinforcing Rods)",
            "stream": "construction",
            "material_type": "metal",
            "classification_confidence": 98.0,
            "is_structural_grade": True,
            "is_mixed_with_other_debris": True,
            "visible_damage_level": "minor",
            "properties": {
                "grade": "Fe500",
                "surface_condition": "Surface oxidation only",
            },
        },
        {
            "item": "Contaminated Mixed Debris - Sample 5 (Demolition Rubble)",
            "stream": "construction",
            "material_type": "mixed",
            "classification_confidence": 88.5,
            "is_structural_grade": False,
            "is_mixed_with_other_debris": True,
            "visible_damage_level": "significant",
            "properties": {
                "contaminants": ["Trace asbestos plaster", "chemical residue"],
                "heterogeneity": "Severe",
            },
        },
    ]
