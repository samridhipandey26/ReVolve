"""
decision_engine.py - Thin Unifying Decision Engine & Session Impact Aggregator

Acts as the central orchestrator and state tracker:
1. assess_construction(input_data) -> AssessmentOutput (delegates to Module A)
2. assess_battery(input_data) -> AssessmentOutput (delegates to Module B)
3. In-memory session log storing all evaluated items
4. get_cumulative_impact() -> Aggregates total value recovered (₹), landfill diverted (kg),
   CO2 offset (kg), and pathway distributions for the dashboard impact counter.
"""

import re
from typing import Any, Dict, List, Optional, Union
from app.schemas import AssessmentInput, AssessmentOutput, PathwayEnum, WasteStreamEnum
from app.module_a_construction import assess_construction_waste
from app.module_b_battery import assess_ev_battery

# In-memory session-scoped assessment ledger
_ASSESSMENT_LEDGER: List[AssessmentOutput] = []


def _extract_numeric_value(text: str, prefix_char: str = "₹") -> float:
    """Extracts the primary monetary figure following currency symbol, e.g. '₹4,200...' -> 4200.0"""
    if not text:
        return 0.0
    pattern = rf"{prefix_char}\s*([\d,]+(?:\.\d+)?)"
    match = re.search(pattern, text)
    if match:
        clean_num = match.group(1).replace(",", "")
        try:
            return float(clean_num)
        except ValueError:
            return 0.0
    return 0.0


def _extract_kg_diverted(text: str) -> float:
    """Extracts kilograms diverted or avoided from environmental impact description."""
    if not text or text.startswith("0 kg"):
        return 0.0
    # Match patterns like '~500 kg', '480 kg', 'Diverts ~400 kg'
    match = re.search(r"(\d+(?:\.\d+)?)\s*kg", text, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return 0.0
    return 0.0


def _extract_co2_kg(text: str) -> float:
    """Extracts CO2 equivalent kilograms saved from environmental impact text."""
    if not text:
        return 0.0
    match = re.search(r"(?:saves|Avoids)\s*~?(\d+(?:\.\d+)?)\s*kg\s*CO", text, re.IGNORECASE)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return 0.0
    return 0.0


def record_assessment(result: AssessmentOutput) -> AssessmentOutput:
    """Records an assessment into the in-memory ledger."""
    _ASSESSMENT_LEDGER.append(result)
    return result


def assess_construction(
    data: Optional[Union[AssessmentInput, Dict[str, Any]]] = None,
    **kwargs: Any
) -> AssessmentOutput:
    """
    Assesses demolition construction materials via Module A and logs the result.
    """
    result = assess_construction_waste(data, **kwargs)
    return record_assessment(result)


def assess_battery(
    data: Optional[Union[AssessmentInput, Dict[str, Any]]] = None,
    **kwargs: Any
) -> AssessmentOutput:
    """
    Assesses end-of-life EV batteries via Module B and logs the result.
    """
    result = assess_ev_battery(data, **kwargs)
    return record_assessment(result)


def evaluate_item(request: AssessmentInput) -> AssessmentOutput:
    """
    Unified entrypoint routing polymorphic requests by waste stream.
    """
    if request.stream == WasteStreamEnum.CONSTRUCTION:
        return assess_construction(request)
    elif request.stream == WasteStreamEnum.BATTERY:
        return assess_battery(request)
    else:
        raise ValueError(f"Unsupported waste stream: {request.stream}")


def get_recent_assessments(limit: int = 20) -> List[AssessmentOutput]:
    """Returns the most recent assessments recorded this session in reverse chronological order."""
    return list(reversed(_ASSESSMENT_LEDGER[-limit:]))


def get_cumulative_impact() -> Dict[str, Any]:
    """
    Sums estimated value recovered (INR), landfill diversion (kg), CO2 offsets,
    and circular pathway breakdowns across all assessments evaluated this session.
    """
    total_val = 0.0
    total_diverted_kg = 0.0
    total_co2_kg = 0.0

    pathway_counts = {p.value: 0 for p in PathwayEnum}
    stream_counts = {s.value: 0 for s in WasteStreamEnum}

    for item in _ASSESSMENT_LEDGER:
        # Tally pathways and streams
        pathway_counts[item.recommended_pathway.value] = pathway_counts.get(item.recommended_pathway.value, 0) + 1
        stream_counts[item.stream.value] = stream_counts.get(item.stream.value, 0) + 1

        # Tally metrics
        total_val += _extract_numeric_value(item.estimated_value_recovered)
        total_diverted_kg += _extract_kg_diverted(item.environmental_impact)
        total_co2_kg += _extract_co2_kg(item.environmental_impact)

    return {
        "session_assessments_count": len(_ASSESSMENT_LEDGER),
        "total_value_recovered_inr": round(total_val, 2),
        "formatted_total_value": f"₹{int(total_val):,}",
        "total_landfill_diverted_kg": round(total_diverted_kg, 1),
        "formatted_total_diverted": f"{total_diverted_kg:,.1f} kg",
        "total_co2_offset_kg": round(total_co2_kg, 1),
        "formatted_total_co2": f"{total_co2_kg:,.1f} kg CO₂e",
        "pathway_breakdown": pathway_counts,
        "stream_breakdown": stream_counts,
        "recent_assessments": [item.model_dump() for item in reversed(_ASSESSMENT_LEDGER[-10:])]
    }


def clear_session_ledger() -> None:
    """Resets the in-memory session ledger."""
    global _ASSESSMENT_LEDGER
    _ASSESSMENT_LEDGER = []
