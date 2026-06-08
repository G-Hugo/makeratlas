---
slug: fiber-lasers-explained
title: "Fiber Lasers Explained: Metal Marking at 1064 nm"
description: "Complete guide to desktop fiber lasers: 1064 nm physics, galvo fields, MOPA vs standard, vs diode spray, workflows, and buyer mistakes."
category: laser-types
readTime: 24 min
lastUpdated: "2026-06-02"
status: published
---

Fiber lasers are the **right tool when bare metal is your daily material**. They deliver a **~1,064 nm infrared** beam that couples efficiently into stainless steel, aluminum, brass, copper, and many industrial coatings without marking spray.

They are also the category most confused with **IR modules on diode machines**, **MOPA marketing**, and **hybrid boxes** that also run a blue diode for wood. Do not let ads blur those lines. For the full map across technologies, see [understanding laser types](/guides/understanding-laser-types). Below: fiber only — physics, galvo fields, and buyer traps.


## Quick reference

| Topic | Fiber reality |
|-------|---------------|
| Wavelength | ~1064 nm (infrared) |
| Best materials | Bare and coated metals, some plastics (process-dependent) |
| Weak materials | Wood, acrylic, leather, organics |
| Typical optics | Galvo scan field (often 100–220 mm) |
| Power class | Commonly 20W–60W+ desktop marking |
| Market label | Sold as fiber; MOPA called out in name or specs |

---

## How fiber laser marking works

A **fiber laser source** uses an optical fiber doped with rare-earth elements (typically ytterbium) as the gain medium. Electrical pump diodes excite the fiber, producing a high-quality infrared beam. Desktop units route that beam through **galvo mirrors** that steer it across a small field at high speed.

### Why 1064 nm dominates metal marking

Metals absorb near-infrared energy efficiently compared to visible blue diodes. Energy deposits at the surface, vaporizing or oxidizing micro-layers to create **contrast marks and shallow engraves**. This is fundamentally different from diode+spray, where a chemical intermediary creates the visible mark.

### Marking vs deep engraving

**Marking** is fast, shallow contrast for logos, serial numbers, and barcodes.

**Deep engraving** removes more material for tactile designs or tool durability. Depth is still **laser-limited** compared to CNC milling: you are not buying a metal cutting center.

Power, speed, frequency, hatch spacing, and number of passes all trade off. Fiber is fast in galvo fields but not infinite depth per second.

---

## What fiber lasers do well

### Stainless, aluminum, brass, copper

Production jewelry, knife blades, dog tags, industrial tags, and promotional metal goods are core fiber applications. Anodized aluminum can also mark with process tuning, though some shops prefer diode for large anodized panels.

### Fine detail in small fields

Rings, watch backs, small tooling, and batch parts that fit in the galvo square benefit from **high scan speeds** and tight spot sizes. This is why most desktop fiber boxes look like compact enclosures rather than 400 mm gantry beds.

### Long source life

Fiber sources often quote **20,000+ hour** lifetimes, very different from CO₂ glass tubes. Maintenance shifts toward **optics cleaning, alignment, and software presets** rather than annual tube swaps.

---

## What fiber cannot do honestly

- Cut wood or acrylic productively (wrong wavelength absorption)
- Replace CO₂ for signage and thick organic cutting
- Engrave **full-sheet** layouts without tiling in a small galvo field
- Match CNC metal removal rates for deep 3D pockets
- Run without planning **fume extraction** even when enclosed (metal particulates and odors)

---

## Galvo field size: the ergonomics shock

Most desktop fiber machines use a **galvo head**. The beam scans a square **work field** while the part stays fixed (or sits on a small adjustable plate).

Typical fields run **roughly 100–220 mm** per side depending on lens and machine. Inside that square, marking is extremely fast. Outside it, you tile jobs in software or reposition fixtures.

If your mental model is a diode 400×400 mm bed, fiber will feel cramped for large art. If your model is **30 identical tags per batch**, fiber feels perfect.

→ [Galvo workstations explained](/guides/galvo-laser-workstations-explained)

---

## Fiber vs diode + spray vs CO₂ + CerMark

| Approach | Best for | Trade-offs |
|----------|----------|------------|
| **Fiber** | Daily metal production, jewelry, tools | Higher entry price, small field |
| **Diode + spray** | Occasional metal gifts, low volume | Consumables, slower, variable durability |
| **CO₂ + CerMark** | Shops already running CO₂ for organics | Extra step, not bare-metal native |

Rule of thumb: if metal is **more than half your revenue or machine time**, fiber usually wins on labor and repeatability. If metal is **a few gifts per month**, spray workflows may suffice.

→ [Metal marking without fiber](/guides/metal-marking-without-fiber)

---

## MOPA: same wavelength, different pulse engine

**MOPA** (Master Oscillator Power Amplifier) fiber sources add **adjustable pulse width and frequency**. That enables **color effects on stainless** (blues, golds, browns: process and alloy dependent) and finer process windows on some coated metals.

MOPA is still a **fiber laser** in shops and ads: same ~1064 nm wavelength. You are paying for **pulse control** on top of standard metal marking, not a new laser family.

When to pay the premium:
- Color stainless is part of your brand
- You run production batches and pulse tuning reduces rework

When to skip:
- First laser for wood gifts
- Grayscale steel marks only on standard fiber suffice

→ [MOPA fiber lasers explained](/guides/mopa-fiber-lasers-explained)

---

## Not the same as IR modules on diode enclosures

Optional **2W infrared accessories** on enclosed diode platforms emit 1064 nm but use **low power and gantry-class optics**. They cannot match fiber galvo speed, depth, or production reliability.

Same wavelength on a spec sheet ≠ same machine class.

→ [Infrared modules explained](/guides/infrared-laser-modules-explained)

---

## Hybrids and modular platforms

**Integrated hybrids** pack fiber + diode in one galvo box and switch modes in software.

**Modular galvo bases** let you install **one source module at a time** (diode, fiber, MOPA, or UV) on a shared chassis.

Both touch fiber economics but serve different shop layouts. Product-by-product comparisons belong in the dedicated guides:

→ [Hybrid lasers explained](/guides/hybrid-lasers-explained)  
→ [Swappable modules explained](/guides/swappable-laser-modules-explained)

---

## Software and fixtures

Fiber desktops commonly ship with vendor marking software or **EZCAD-class** workflows. Many users integrate **LightBurn** where supported. Expect a learning curve for **fill patterns, frequency, pulse width (MOPA), and rotary attachments** on cylinders.

Fixturing matters: small parts need **jigs** so batches stay in focus across the field. Even 0.2 mm Z drift shows on fine jewelry text.

---

## Safety and exhaust

Enclosed fiber boxes often achieve **Class 1 operation with lid closed**. Metal marking still produces **particulates and sometimes odor** on coated metals. Vent to filter or outside for long sessions.

Never bypass interlocks. Invisible infrared beams are not visible warning lights.

→ [Laser safety basics](/guides/laser-safety-basics)  
→ [Ventilation setup](/guides/laser-ventilation-setup)

---

## Who should buy fiber?

**Good fit:**
- Jewelry, knives, tools, metal promo products
- Daily bare metal marking without spray
- Batch sizes that fit galvo fields
- Budget for machine **and** extraction **and** fixture time

**Poor fit:**
- Primary income is acrylic signs or wood cutting boards
- Need full 300 mm single-image engraves without tiling
- Occasional metal only (spray on diode may suffice)

---

## Common mistakes

| Mistake | Reality |
|---------|---------|
| Buying fiber for wood+acrylic shop | Wrong wavelength; buy CO₂ or diode instead |
| Expecting large-bed ergonomics | Galvo field is the product constraint |
| Confusing low-power IR accessory with fiber galvo | Same nm on paper, not same capability |
| Skipping material test swatches | Alloy and finish change mark quality |
| Ignoring exhaust because "it's enclosed" | Metal dust and fumes still need management |

---

## Before you shop: size the job, then filter listings

1. Measure your **largest part** (ring, tag, blade). If it exceeds ~150–200 mm, plan tiling ([galvo guide](/guides/galvo-laser-workstations-explained))  
2. Open the [fiber catalog](/lasers/type/fiber) and filter by **work area (mm)** and watts  
3. For **color stainless**, look for MOPA in the name or specs — see [MOPA guide](/guides/mopa-fiber-lasers-explained) for process, not shopping  
4. If you also sell wood gifts on the same desk, compare [hybrid](/guides/hybrid-lasers-explained) vs fiber-only instead of assuming one box does everything  
5. Read cut/engrave examples on each listing; metal alloy in notes matters

For occasional metal without fiber capital: [metal marking without fiber](/guides/metal-marking-without-fiber).

---

## Browse fiber and MOPA profiles

See [fiber-type machines](/lasers/type/fiber). Filter by work area, MOPA in name, and software notes.

## What's next?

- [MOPA fiber lasers explained](/guides/mopa-fiber-lasers-explained)  
- [Galvo workstations explained](/guides/galvo-laser-workstations-explained)  
- [Laser buying guide 2026](/guides/laser-buying-guide-2026)
