"""
module_b_battery.py - Stream B: End-of-Life EV Batteries Assessment Module

Assesses end-of-life electric vehicle battery modules and packs based on:
- State of Health (SOH %) / remaining_capacity_pct & Remaining Useful Life (RUL)
- Internal Resistance (IR / Impedance: low / moderate / high / numerical mΩ)
- Voltage Stability (stable / unstable) & Cell balance
- Charge/Discharge Cycle count & age in years
- Mechanical & Casing Integrity (has_physical_damage, swelling, punctures)
- Thermal Runaway Markers (has_thermal_irregularity)
- Battery Chemistry (NMC, LFP, NCA, LTO)

Pathway Rules:
1. SOH >= 80%, low IR, stable voltage, undamaged -> Reuse (second-life light EV or direct redeployment)
2. SOH 70-80% or voltage instability / BMS issue -> Refurbishment (cell balancing, BMS rebuild, repacking)
3. SOH 50-70%, moderate IR, undamaged -> Repurposing (Stationary BESS, telecom UPS, solar microgrids)
4. SOH < 50% or high IR (degraded) -> Recycling (Hydrometallurgical extraction for Li, Ni, Co, Mn)
5. Thermal irregularity / physical damage / extreme risk -> Disposal (Hazardous chemical deactivation)
"""

from typing import Any, Dict, List, Optional, Union
from app.schemas import AssessmentInput, AssessmentOutput, PathwayEnum, WasteStreamEnum


def assess_ev_battery(
    data: Optional[Union[AssessmentInput, Dict[str, Any]]] = None,
    *,
    item: Optional[str] = None,
    chemistry: Optional[str] = None,
    soh_percentage: Optional[float] = None,
    remaining_capacity_pct: Optional[float] = None,
    cycle_count: Optional[int] = None,
    internal_resistance: Optional[Union[str, float]] = None,
    internal_resistance_mohm: Optional[float] = None,
    voltage_stability: Optional[Union[str, bool]] = None,
    age_years: Optional[float] = None,
    has_physical_damage: Optional[bool] = None,
    has_thermal_irregularity: Optional[bool] = None,
    nominal_capacity_ah: Optional[float] = None,
    casing_condition: Optional[str] = None,
    thermal_runaway_markers: Optional[bool] = None,
) -> AssessmentOutput:
    """
    Assesses an EV battery item and returns the unified AssessmentOutput schema.
    Seamlessly handles both UI parameter sets (remaining_capacity_pct, voltage_stability, etc.)
    and raw telemetry data (SOH%, mΩ, chemistry).
    """
    item_name = item or "EV Battery Pack"
    extracted_props: Dict[str, Any] = {}

    if isinstance(data, AssessmentInput):
        item_name = data.item or item_name
        chemistry = data.chemistry or chemistry
        soh_percentage = data.soh_percentage if soh_percentage is None else soh_percentage
        cycle_count = data.cycle_count if cycle_count is None else cycle_count
        internal_resistance_mohm = data.internal_resistance_mohm if internal_resistance_mohm is None else internal_resistance_mohm
        nominal_capacity_ah = data.nominal_capacity_ah if nominal_capacity_ah is None else nominal_capacity_ah
        casing_condition = data.casing_condition or casing_condition
        thermal_runaway_markers = data.thermal_runaway_markers if thermal_runaway_markers is None else thermal_runaway_markers
        extracted_props = data.properties or {}
        # Also extract UI-specific fields if passed in properties or top-level
        if remaining_capacity_pct is None:
            remaining_capacity_pct = extracted_props.get("remaining_capacity_pct")
        if internal_resistance is None:
            internal_resistance = extracted_props.get("internal_resistance")
        if voltage_stability is None:
            voltage_stability = extracted_props.get("voltage_stability")
        if age_years is None:
            age_years = extracted_props.get("age_years")
        if has_physical_damage is None:
            has_physical_damage = extracted_props.get("has_physical_damage")
        if has_thermal_irregularity is None:
            has_thermal_irregularity = extracted_props.get("has_thermal_irregularity")
    elif isinstance(data, dict):
        item_name = data.get("item", data.get("item_name", item_name))
        chemistry = data.get("chemistry", chemistry)
        soh_percentage = data.get("soh_percentage", soh_percentage)
        remaining_capacity_pct = data.get("remaining_capacity_pct", remaining_capacity_pct)
        cycle_count = data.get("cycle_count", cycle_count)
        internal_resistance = data.get("internal_resistance", internal_resistance)
        internal_resistance_mohm = data.get("internal_resistance_mohm", internal_resistance_mohm)
        voltage_stability = data.get("voltage_stability", voltage_stability)
        age_years = data.get("age_years", age_years)
        has_physical_damage = data.get("has_physical_damage", has_physical_damage)
        has_thermal_irregularity = data.get("has_thermal_irregularity", has_thermal_irregularity)
        nominal_capacity_ah = data.get("nominal_capacity_ah", nominal_capacity_ah)
        casing_condition = data.get("casing_condition", casing_condition)
        thermal_runaway_markers = data.get("thermal_runaway_markers", thermal_runaway_markers)
        extracted_props = data.get("properties", {})

    # 1. Normalize SOH / Remaining Capacity %
    final_soh = 75.0
    if remaining_capacity_pct is not None:
        final_soh = float(remaining_capacity_pct)
    elif soh_percentage is not None:
        final_soh = float(soh_percentage)
    final_soh = max(0.0, min(100.0, final_soh))

    # 2. Normalize Cycles & Age
    cycles = int(cycle_count if cycle_count is not None else (extracted_props.get("cycle_count", 1000)))
    age = float(age_years if age_years is not None else 3.5)

    # 3. Normalize Internal Resistance
    ir_level = "moderate"
    ir_value_mohm = 3.5
    if isinstance(internal_resistance, (int, float)):
        ir_value_mohm = float(internal_resistance)
        ir_level = "low" if ir_value_mohm < 2.5 else "moderate" if ir_value_mohm < 8.0 else "high"
    elif isinstance(internal_resistance, str):
        ir_level = internal_resistance.strip().lower()
        ir_value_mohm = 1.5 if ir_level == "low" else 4.0 if ir_level == "moderate" else 15.0
    elif internal_resistance_mohm is not None:
        ir_value_mohm = float(internal_resistance_mohm)
        ir_level = "low" if ir_value_mohm < 2.5 else "moderate" if ir_value_mohm < 8.0 else "high"

    # 4. Normalize Voltage Stability
    is_voltage_stable = True
    if isinstance(voltage_stability, bool):
        is_voltage_stable = voltage_stability
    elif isinstance(voltage_stability, str):
        is_voltage_stable = voltage_stability.strip().lower() in ["stable", "true", "yes", "good"]

    # 5. Normalize Physical Damage & Thermal Irregularities
    phys_damage = bool(has_physical_damage)
    if casing_condition and any(w in casing_condition.lower() for w in ["puncture", "impact", "crack", "degraded", "swollen"]):
        phys_damage = True

    thermal_hazard = bool(has_thermal_irregularity or thermal_runaway_markers)
    chem = (chemistry or "NMC").upper()

    # 6. Evaluate Decision Rules
    safety_flags: List[str] = []

    # RULE 1: Thermal Hazard / Active Runaway or Critical Physical Breach -> Disposal
    if thermal_hazard or (phys_damage and ir_level == "high"):
        recommended_pathway = PathwayEnum.DISPOSAL
        assessed_condition = f"Severely compromised {chem} pack with active thermal runaway or chemical breach risk."
        if thermal_hazard:
            safety_flags.append("Thermal irregularity / runaway risk detected")
        if phys_damage:
            safety_flags.append("Severe mechanical casing damage / puncture")
        if ir_level == "high":
            safety_flags.append("High internal impedance (>15 mΩ)")

        reasoning = (
            f"Thermal irregularities and structural casing damage present catastrophic fire and chemical runaway risks. "
            "Automated triage classifies this unit for immediate electrolyte immersion neutralization and hazardous containment."
        )
        estimated_val = "₹0 (Hazard avoidance: prevents severe fire liability; hazardous disposal fee applies)"
        env_impact = "0 kg diverted as active product; neutralized under hazardous chemical protocols."
        confidence = 98.0

    # RULE 2: High SOH >= 80%, low IR, stable voltage, no damage -> Direct Reuse
    elif final_soh >= 80.0 and ir_level == "low" and is_voltage_stable and not phys_damage and cycles <= 1000:
        recommended_pathway = PathwayEnum.REUSE
        assessed_condition = f"Premium grade {chem} pack with {final_soh:.1f}% capacity, low impedance ({ir_value_mohm:.1f} mΩ), and stable cell voltages."
        reasoning = (
            f"The pack retains {final_soh:.1f}% remaining capacity with low internal resistance and zero physical flaws. "
            "Qualified for direct second-life vehicular reuse in light electric vehicles, 2-wheelers, or delivery vans."
        )
        estimated_val = "₹48,000 (vs ₹12,000 if crushed for raw black mass)"
        env_impact = "Avoids ~210 kg embodied battery manufacturing emissions; extends active product lifespan by 4-6 years."
        confidence = 95.5

    # RULE 3: SOH 70-80% OR Voltage Instability / Minor Degradation -> Refurbishment
    elif (final_soh >= 70.0 and not phys_damage) or (not is_voltage_stable and final_soh >= 60.0):
        recommended_pathway = PathwayEnum.REFURBISHMENT
        assessed_condition = f"Healthy {chem} core ({final_soh:.1f}% capacity) with {'cell voltage imbalance' if not is_voltage_stable else 'moderate cycle wear'}."
        if not is_voltage_stable:
            safety_flags.append("Cell voltage imbalance detected — BMS rebalancing required")

        reasoning = (
            f"Core electrochemical retention is strong ({final_soh:.1f}% SOH), but {'voltage drift' if not is_voltage_stable else 'moderate wear'} necessitates "
            "module re-balancing, BMS firmware recalibration, and contactor refurbishment before secondary commissioning."
        )
        estimated_val = "₹36,000 (vs ₹10,500 scrap value)"
        env_impact = "Saves ~165 kg CO₂e manufacturing debt; delays mineral extraction for replacement cells."
        confidence = 92.0

    # RULE 4: SOH 50-70%, stable casing, moderate IR -> Repurposing (Stationary ESS)
    elif final_soh >= 50.0 and not phys_damage and ir_level != "high":
        recommended_pathway = PathwayEnum.REPURPOSING
        assessed_condition = f"Stable {chem} pack ({final_soh:.1f}% capacity, {cycles} cycles) ideal for stationary energy storage."
        reasoning = (
            f"Automotive acceleration demands are no longer met at {final_soh:.1f}% SOH, but stable impedance makes it "
            "optimal for stationary solar microgrid storage, telecom UPS, or commercial peak-shaving BESS."
        )
        estimated_val = "₹24,500 (vs ₹8,000 scrap yield)"
        env_impact = "Provides ~12 kWh of stationary clean storage; offsets diesel generator emissions."
        confidence = 93.5

    # RULE 5: SOH < 50% or High Internal Resistance or Physical Wear -> Recycling (Black Mass)
    else:
        recommended_pathway = PathwayEnum.RECYCLING
        assessed_condition = f"Deeply degraded {chem} pack ({final_soh:.1f}% capacity, {cycles} cycles) ready for strategic hydrometallurgical recycling."
        if phys_damage:
            safety_flags.append("Mechanical casing wear / minor deformation")

        reasoning = (
            f"Electrochemical capacity is exhausted at {final_soh:.1f}% SOH. Hydrometallurgical recycling will recover "
            "over 95% of strategic cathode materials including Lithium, Cobalt, Nickel, and Manganese."
        )
        estimated_val = "₹9,500 (High strategic critical mineral recovery value)"
        env_impact = "Recovers ~8.5 kg strategic battery-grade metals; avoids virgin open-pit lithium mining."
        confidence = 94.0

    return AssessmentOutput(
        item=item_name,
        stream=WasteStreamEnum.BATTERY,
        assessed_condition=assessed_condition,
        recommended_pathway=recommended_pathway,
        confidence=confidence,
        reasoning=reasoning,
        estimated_value_recovered=estimated_val,
        environmental_impact=env_impact,
        safety_flags=safety_flags,
    )


def get_sample_battery_inputs() -> List[Dict[str, Any]]:
    """
    Returns 5 varied EV battery test cases covering all 5 circular recovery pathways:
    1. Reuse (Tesla Model 3 Module - 91.5% SOH)
    2. Refurbishment (Tata Nexon EV Pack - 76% SOH, voltage imbalance)
    3. Repurposing (Nissan Leaf Gen 2 Pack - 64.2% SOH, stationary ESS)
    4. Recycling (Commercial Bus Pack - 41% SOH, black mass recovery)
    5. Disposal (Accident Damaged 2-Wheeler Pack - Thermal hazard)
    """
    return [
        {
            "item": "Tesla Model 3 2170 Module — Sample 1",
            "stream": "battery",
            "chemistry": "NMC",
            "remaining_capacity_pct": 91.5,
            "soh_percentage": 91.5,
            "cycle_count": 420,
            "internal_resistance": "low",
            "voltage_stability": "stable",
            "age_years": 1.5,
            "has_physical_damage": false,
            "has_thermal_irregularity": false,
            "properties": {
                "nominal_capacity_ah": 230.0,
                "nominal_voltage_v": 3.7,
            },
        },
        {
            "item": "Tata Nexon EV LFP Pack — Sample 2",
            "stream": "battery",
            "chemistry": "LFP",
            "remaining_capacity_pct": 76.0,
            "soh_percentage": 76.0,
            "cycle_count": 1650,
            "internal_resistance": "moderate",
            "voltage_stability": "unstable",
            "age_years": 3.2,
            "has_physical_damage": false,
            "has_thermal_irregularity": false,
            "properties": {
                "nominal_capacity_ah": 100.0,
                "nominal_voltage_v": 3.2,
            },
        },
        {
            "item": "Nissan Leaf Gen 2 Module — Sample 3",
            "stream": "battery",
            "chemistry": "NMC",
            "remaining_capacity_pct": 64.2,
            "soh_percentage": 64.2,
            "cycle_count": 2100,
            "internal_resistance": "moderate",
            "voltage_stability": "stable",
            "age_years": 4.5,
            "has_physical_damage": false,
            "has_thermal_irregularity": false,
            "properties": {
                "nominal_capacity_ah": 60.0,
                "nominal_voltage_v": 7.4,
            },
        },
        {
            "item": "Commercial Bus Pack Module — Sample 4",
            "stream": "battery",
            "chemistry": "NMC",
            "remaining_capacity_pct": 41.0,
            "soh_percentage": 41.0,
            "cycle_count": 3400,
            "internal_resistance": "high",
            "voltage_stability": "unstable",
            "age_years": 6.0,
            "has_physical_damage": true,
            "has_thermal_irregularity": false,
            "properties": {
                "nominal_capacity_ah": 180.0,
                "nominal_voltage_v": 3.7,
            },
        },
        {
            "item": "Accident Damaged 2-Wheeler Pack — Sample 5",
            "stream": "battery",
            "chemistry": "NMC",
            "remaining_capacity_pct": 22.0,
            "soh_percentage": 22.0,
            "cycle_count": 800,
            "internal_resistance": "high",
            "voltage_stability": "unstable",
            "age_years": 2.0,
            "has_physical_damage": true,
            "has_thermal_irregularity": true,
            "properties": {
                "nominal_capacity_ah": 40.0,
                "nominal_voltage_v": 3.7,
            },
        },
    ]
