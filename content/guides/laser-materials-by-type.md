---
slug: laser-materials-by-type
title: "Laser Materials by Type: Quick Honest Reference"
description: What diode, CO₂, fiber, UV, and hybrid actually process well, and the materials you should not laser.
category: specialty
readTime: 22 min
lastUpdated: "2026-06-02"
status: published
---

Use this table before buying a machine for a **specific material**. Wattage alone does not override wavelength physics. A 40W diode still cannot cut clear acrylic honestly. A 55W CO₂ still cannot mark bare stainless like fiber.

The matrix below is a **quick honest reference** plus longer explanations of **why** each symbol applies, typical workflows, and buyer mistakes. Deep dives per technology: [diode](/guides/diode-lasers-explained) · [CO₂](/guides/co2-lasers-explained) · [fiber](/guides/fiber-lasers-explained) · [UV](/guides/uv-lasers-explained) · [hybrid](/guides/hybrid-lasers-explained)


## Legend

| Symbol | Meaning |
|--------|---------|
| **✓** | Common, honest fit |
| **~** | Possible with tricks, slow, or poor results |
| **✗** | Wrong tool or unsafe |

---

## The physics rule behind the table

Laser processing is **absorption**: photons must stay in the material long enough to heat, ablate, or mark. Wavelength drives absorption more than banner watts.

| Wavelength class | Typical source | Absorption story |
|------------------|----------------|------------------|
| ~450 nm blue | Diode | Strong on dark organics, anodize dye; weak on clear acrylic, bare metal |
| ~10,600 nm IR | CO₂ | Strong on organics and many plastics; weak on bare metal |
| ~1064 nm near-IR | Fiber, IR module | Strong on metals; weak on clear organics |
| ~355 nm UV | UV galvo | Cold mark on some plastics and glass; specialty |

**Hybrid** machines switch sources; they do not create a new material row. Pick fiber mode for metal, diode mode for wood.

→ [Hybrid lasers explained](/guides/hybrid-lasers-explained)

### Reflection and transmission traps

Materials can **transmit** (clear acrylic to blue light), **reflect** (bare polished metal), or **absorb** (dark wood, anodized dye). A high-watt machine cannot fix transmission or reflection. You need a wavelength that couples into the target.

---

## Organic and signage materials

| Material | Diode | CO₂ | Fiber | UV | Notes |
|----------|-------|-----|-------|-----|-------|
| Wood / plywood | ✓ | ✓ | ✗ | ✗ | CO₂ cuts thicker faster |
| Leather | ✓ | ✓ | ✗ | ~ | Ventilate leather hard |
| Paper / card | ✓ | ✓ | ✗ | ~ | Fire watch on cuts |
| Clear acrylic | ✗ | ✓ | ✗ | ~ | Diode beam passes through |
| Colored / black acrylic | ~ | ✓ | ✗ | ~ | Diode only on absorbing colors |
| Rubber stamp sheet | ~ | ✓ | ✗ | ✗ | CO₂ classic |

### Wood and plywood

**Diode (✓):** Excellent for engraving gift-grade items: cutting boards, ornaments, bamboo. Thin cuts (3-6 mm) possible with air assist and multiple passes on higher optical power.

**CO₂ (✓):** Production path for thicker plywood, faster cuts, deeper engraves. Sign shops standard.

**Fiber (✗):** 1064 nm does not couple into wood for useful cutting. Fiber on wood is a mistake purchase.

**Workflow tip:** Oily woods (cherry, some exotics) need more air assist and slower speeds on diode to control char.

→ [Air assist and honeycomb setup](/guides/air-assist-honeycomb-setup)

### Leather

Both diode and CO₂ engrave and cut leather with ventilation. Leather releases strong odor and particulates. **Never** assume enclosed box means no exhaust for leather cutting.

### Paper and card

Diode and CO₂ cut paper cleanly at light power. **Fire watch** mandatory on cuts, especially unattended temptation on open frames.

### Acrylic: the clearest diode trap

**Clear acrylic (✗ on diode):** Blue light transmits through. You may scar the table before the sheet.

**CO₂ (✓):** The desktop acrylic sign category exists because of CO₂ absorption at 10.6 µm.

**Colored/black acrylic (~ on diode):** Dark pigments absorb blue; results vary by brand and thickness. Not sign-shop reliable.

---

## Metals and coatings

| Material | Diode | CO₂ | Fiber | UV | Notes |
|----------|-------|-----|-------|-----|-------|
| Anodized aluminum | ✓ | ~ | ✓ | ~ | Diode favorite for tumblers |
| Bare stainless | ~ | ~ | ✓ | ~ | Diode needs [spray](/guides/metal-marking-without-fiber) |
| Bare brass / copper | ~ | ✗ | ✓ | ~ | Fiber primary |
| Painted / coated metal | ~ | ✓ | ✓ | ~ | CerMark on CO₂ |
| Deep metal machining | ✗ | ✗ | ~ | ✗ | Engrave only, not CNC depth |

### Anodized aluminum

**Diode (✓):** The honest "metal" demo for blue lasers. You mark the dye layer on tumblers and colored aluminum without spray.

**Fiber (✓):** Production marking, serial numbers, deeper marks on fixtures.

**CO₂ (~):** Can interact with coatings; not the default metal path.

### Bare stainless, brass, copper

**Fiber (✓):** Primary production tool for bare metal marks at speed.

**Diode (~):** Requires [marking spray or compounds](/guides/metal-marking-without-fiber). Valid for gifts; weak for daily wear items.

**CO₂ (~ on coated, ✗ on bare brass/copper):** CerMark-style workflows on coated plate if you already run CO₂ for acrylic.

**IR module note:** 1064 nm on S1 IR is not fiber-class throughput. See [infrared modules](/guides/infrared-laser-modules-explained).

### Deep metal "machining"

Desktop fiber **engraves**. It does not replace CNC mill depth. (~) on fiber means shallow production engraves, not pocketing steel.

---

## Plastics, glass, specialty

| Material | Diode | CO₂ | Fiber | UV | Notes |
|----------|-------|-----|-------|-----|-------|
| ABS / some plastics | ~ | ~ | ~ | ✓ | UV cold mark |
| Glass | ✗ | ~ | ✗ | ✓ | CO₂ with masking; UV fine mark |
| Slate / stone (dark) | ✓ | ~ | ✗ | ✗ | Diode contrast on dark stone |
| PCB / electronics mark | ✗ | ✗ | ~ | ✓ | Industrial UV/fiber |

### ABS and engineering plastics

Identify plastic before lasing. **Unknown plastic = do not cut.**

**UV (✓)** for some marking cases with lower heat input. **CO₂ (~)** can melt or foul edges depending on formulation.

### Glass

**Diode (✗):** Poor coupling for useful results.

**CO₂ (~):** Masking and fracture techniques exist; finicky for makers.

**UV (✓):** Fine surface mark without bulk heating on many glass marking jobs.

### Slate and dark stone

**Diode (✓):** Coasters and trophies on dark stone show good contrast.

---

## Never laser (any type)

| Material | Why |
|----------|-----|
| **PVC / vinyl** | Chlorine fumes, toxic |
| **Polycarbonate** | Bad fumes, messy melt |
| **Unknown plastics** | Assume toxic until MSDS says otherwise |
| **Mirrored acrylic facing beam** | Reflection hazard |

When a profile lists **material limits**, treat them as hard guardrails, not suggestions.

### PVC and vinyl

Chlorine-containing materials can release **toxic fumes** when heated. This includes many "mystery" flex materials and some faux leathers. Ask for MSDS or supplier laser-safety letter.

### Polycarbonate

Cuts poorly on CO₂ (melty edges, hazardous fumes per formulation). Do not assume "plastic is plastic."

### Mirrored and reflective faces

Beam reflection risks machine damage and eye hazard. Angle parts or avoid lasing mirror-facing surfaces.

---

## Hybrid machines: how to read the matrix

**Hybrid** (fiber + diode) follows the **same material rows**: you pick which source is active.

| Job | Active source |
|-----|---------------|
| Wood gift box | Diode mode |
| Stainless tag | Fiber mode |
| Clear acrylic sign | Neither hybrid mode saves you; need CO₂ |

Hybrid compresses **two wavelength classes** into one desk box with a **small galvo field**. It does not add CO₂ acrylic capability.

---

## Pick machine by material (workflow shortcut)

```
Mostly wood/leather engrave     → Diode
Acrylic signs + wood cuts       → CO₂
Bare metal production           → Fiber (+ MOPA if color)
Heat-sensitive plastic mark     → UV
Metal tags + wood gifts small   → Hybrid or two machines
Anodized drinkware only         → Diode (+ rotary)
```

### Scenario: Etsy drinkware

Anodized tumblers are **diode + rotary** territory. Bare stainless pet tags weekly push toward **fiber galvo**.

→ [Rotary laser engraving](/guides/rotary-laser-engraving)  
→ [Metal marking without fiber](/guides/metal-marking-without-fiber)

### Scenario: Sign shop acrylic + plywood

**CO₂** is the anchor machine. Diode speed on acrylic will disappoint. Fiber does not cut sheets.

### Scenario: Electronics enclosure marking

**UV** or fiber marking on specific plastics; verify with sample parts and client spec.

---

## Wattage vs wavelength (do not mix them up)

| Buyer thought | Reality |
|---------------|---------|
| "40W diode = 40W CO₂" | Different wavelengths, different materials |
| "More diode watts = acrylic" | Still ✗ on clear acrylic |
| "Fiber watts cut wood" | Still ✗ on wood cutting |
| "Hybrid = all materials" | No CO₂ row; field size limits |

→ [Laser wattage marketing explained](/guides/laser-wattage-marketing-explained)

---

## Common mistakes (and why they happen)

| Mistake | Why it fails |
|---------|--------------|
| Buying diode for clear acrylic signs | ✗ in table is physics, not settings |
| Fiber purchase for cutting boards | Wrong wavelength for wood production |
| Lasering mystery plastic sheet | Toxic fume risk |
| Assuming hybrid replaces CO₂ shop | Acrylic + thickness need CO₂ |
| Skipping ventilation on "~" leather | Odor and particulates still serious |
| Trusting demo video material label | Verify your supplier's actual stock |

---

## Using this matrix when comparing machines

Each machine profile may list **material limits** and **cut examples**. Cross-check those notes against this table. If a profile warns against a material, treat that as authoritative for that SKU.

Browse by type: [diode](/lasers/type/diode) · [CO₂](/lasers/type/co2) · [fiber](/lasers/type/fiber) · [UV](/lasers/type/uv) · [hybrid](/lasers/type/hybrid)

## What's next?

- [Understanding laser types](/guides/understanding-laser-types)
- [Laser buying guide 2026](/guides/laser-buying-guide-2026)
- [Compare machines](/compare)
