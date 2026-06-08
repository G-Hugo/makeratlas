---
slug: galvo-laser-workstations-explained
title: "Galvo Laser Workstations Explained: Speed, Field Size & Modules"
description: "Galvo mirror scanning, field size limits, speed marketing, modular vs hybrid vs fiber-only, and production workflows."
category: specialty
readTime: 22 min
lastUpdated: "2026-06-02"
status: published
---

On a **gantry** engraver (typical diode or CO₂), the laser head moves on rails over a large bed — often 300 to 400 mm per side.

On a **galvo** engraver, the head barely moves: **motorized mirrors** steer the beam across a **small square** below. That is how almost every desktop **fiber, UV, and hybrid** machine works, plus some **modular** bases where you swap the source (diode, fiber, MOPA, UV) on the same chassis.

If you are used to a gantry, the surprise is usually **not wattage**. It is **work area**: often roughly 110 to 220 mm square. A ring, dog tag, or small plaque fits. A cutting board, cabinet door, or large sign does not — unless you split the job into tiles.

To choose between diode, CO₂, fiber, and UV before you buy: [understanding laser types](/guides/understanding-laser-types).


## Quick reference

| Topic | Galvo reality |
|-------|---------------|
| Motion | Motorized mirrors scan the beam |
| Typical field | Compact square, often 100-220 mm |
| Best for | Small metal parts, batches, jewelry |
| Weak fit | Full cabinet doors, large signage panels |
| Laser types | Fiber, UV, hybrid, modular swap-in heads |
| Speed quotes | Max scan rate, not job time |
| Class | Often Class 1 when fully enclosed |

---

## How galvo steering actually works

In a **gantry** machine, the laser head physically moves on X and Y rails. The beam path is relatively fixed; the **mass** of the head limits acceleration and repeat positioning time.

In a **galvo** system, the laser source stays put. Two small mirrors (X and Y galvanometers) tilt rapidly to redirect the beam across a **flat field** below. Because mirrors are light, they can achieve very high **scan speeds** over a limited area.

```
GANTRY (diode / CO₂)          GALVO (fiber / UV / hybrid)

  [Laser head]                     [Laser source fixed]
       |  moves on rails                 |
       v  over 300-400 mm bed            v
  +------------------+            [Mirror X] -> [Mirror Y]
  |    work bed      |                    |
  +------------------+                    v
                                   +-------------+
                                   | ~110-220 mm |
                                   | scan field  |
                                   +-------------+
```

Tradeoff: the optics that keep the beam focused over a square field impose a **hard size limit**. You cannot "zoom out" to a 400 mm bed without a completely different optical design (and usually a different machine category).

### Why field size matters more than watts

Two "20W fiber" galvo machines can have **different work areas**. A 110 mm square fits a ring and a dog tag. It does not fit a cutting board or a full acrylic panel.

Before you compare prices, check **work area (mm)** on each listing. A cheap machine you cannot fit your parts on is not a deal. Watts tell you how fast you mark **within** the field. Field size tells you whether the part **fits at all**.

→ Compare field and type on [fiber](/lasers/type/fiber), [hybrid](/lasers/type/hybrid), and [UV](/lasers/type/uv) catalogs.

### Flat-field lens physics in plain terms

The galvo mirrors aim the beam, but a **flat-field (F-theta) lens** corrects focus across the square. Lens design sets the maximum field before spot size grows and power density falls. That is why two machines with the same watt label can feel different at the corners.

Test corners on scrap before promising uniform depth across a full plaque.

---

## Galvo vs gantry: how to choose

| | Galvo workstation | Gantry (diode / CO₂) |
|---|-------------------|---------------------|
| **Motion** | Mirrors scan beam | Head moves X/Y |
| **Typical field** | Compact square 100-220 mm | 300-400+ mm |
| **Repeated small marks** | Very fast in field | Slower traverses |
| **Single large plate** | Tiling or impractical | Natural |
| **Laser types** | Fiber, UV, hybrid, modular swap-in heads | Diode, CO₂ |
| **Desk footprint** | Often smaller | Larger for same "shop presence" |

Galvo excels when the part **fits in the square** and you run dozens: rings, tags, small plaques, tools, USB drives, knife scales.

Gantry excels when **one setup** must cover a large sheet: plywood panels, acrylic signs, leather hides.

For wood panels, full acrylic sheets, or cabinet doors: [CO₂ lasers explained](/guides/co2-lasers-explained) or [gantry diode](/guides/diode-lasers-explained).

---

## What galvo does well

### Jewelry and small metal personalization

Fiber galvo is the default for **bare stainless, brass, and aluminum** marks at production-friendly speeds. Engraves can be shallow branding or deeper serial numbers depending on power and passes.

### Batch work without repositioning every part

Place ten tags in a fixture inside the field, run one job, repeat. Gantry machines spend time **traversing** between parts. Galvo fires across the field with mirror motion.

### Enclosed Class 1 boxes

Most desktop fiber and hybrid galvos ship as **fully enclosed boxes** with lid interlocks. Shop safety and odor control are easier than open-frame gantry diodes, though exhaust still matters on production runs.

→ [Open frame vs enclosed lasers](/guides/open-frame-vs-enclosed-lasers)

### Hybrid metal + organics in one desk unit

**Hybrid galvo** machines integrate fiber (metal) and diode (wood/leather) with software mode switching. Field stays compact, but material breadth widens.

→ [Hybrid lasers explained](/guides/hybrid-lasers-explained)

---

## Limitations to accept before buying

### No full 300x300 engrave in one pass

If your portfolio is mostly **one large graphic per piece**, galvo will frustrate you. You will tile, register, and fight seams.

### Tiling has real cost

Wide logos on metal flasks or plaques can be done on galvo with **multiple registrations**. Each tile adds setup time, alignment risk, and client proofing. Budget that labor honestly.

### Speed marketing is not job time

Headline **mm/s** is not minutes per order. See dedicated section below.

### Wrong purchase signal

If you are comparing galvo to a **400x400 diode bed** for cutting boards and door signs, you are in the wrong category. Field size is the filter, not brand loyalty.

---

## Modular galvo: one chassis, swappable source

Some vendors sell a **galvo base** and **interchangeable source modules** (diode, fiber, MOPA, UV). **One module is active at a time.** You physically swap heads; you do not run fiber and diode in the same job.

That is different from an **integrated hybrid**, where two complete sources live in one box and you switch modes in firmware without swapping hardware.

Modular galvo fits buyers who want to **stage spending**: start with the module that matches today's revenue, add metal or UV later on the same enclosure.

Product names, bundled contents, and which modules exist for which chassis change every year. Compare specific platforms in [swappable laser modules explained](/guides/swappable-laser-modules-explained). For MOPA pulse control (not shopping): [MOPA fiber lasers explained](/guides/mopa-fiber-lasers-explained).

---

## "10,000 mm/s": read specs without getting sold

Vendors quote **maximum galvo scan speed** inside the field. Useful for comparing two galvo heads. Misleading for quoting client turnaround.

Real jobs include:

- **Fill patterns** and hatch spacing (not every vector runs at max speed)
- **Acceleration limits** at field edges
- **Power density limits** on hard metals (you slow down to get depth or contrast)
- **Cooling and duty cycle** on long sessions
- **Software overhead** and rotary indexing if used

Use headline speed to **compare two galvos**. Use timed sample runs on **your** artwork for client promises.

→ [Laser wattage marketing explained](/guides/laser-wattage-marketing-explained)

---

## Four galvo shapes you will see in ads

| Category | What it is | Best for |
|----------|------------|----------|
| **Fiber-only galvo** | 1064 nm source, metal-focused | Shops where bare metal is most revenue |
| **Hybrid galvo** | Fiber + diode integrated; firmware mode switch | Metal tags and wood gifts on one desk, small parts only |
| **Modular galvo** | Swappable source modules on one chassis | Staged budget; one wavelength at a time |
| **UV galvo** | ~355 nm source in compact field | Plastics, glass, fine marking |

**Fiber-only** is the honest pick when metal is nearly all revenue.

**Hybrid** wins desk space when you truly split time between metal and organics **and** accept the compact field.

**Modular** wins when you want optionality without a second enclosure, provided you accept swap downtime and verify what ships in the box.

Browse current listings by type: [fiber](/lasers/type/fiber) · [hybrid](/lasers/type/hybrid) · [UV](/lasers/type/uv). For named machines and which pattern each one uses: [swappable modules](/guides/swappable-laser-modules-explained).

---

## Typical galvo shop workflows

### Jewelry and rings

1. Fixture parts for consistent focus (same height = consistent mark depth)
2. Run fiber recipe for gray or [MOPA recipe](/guides/mopa-fiber-lasers-explained) for color
3. Batch inside field; avoid one-at-a-time unless rotary demands it

→ [Rotary laser engraving](/guides/rotary-laser-engraving)

### Tool and knife marking

Brushed stainless benefits from tuned speed/frequency. Log recipes per supplier batch. Galvo speed shines on **10-50 identical blanks**.

### Hybrid week: metal tags Monday, wood gifts Wednesday

On **integrated hybrid** galvos, switch software mode between metal and organics. Re-verify focus and exhaust path per source. Hybrid does not remove **material-specific tuning**.

### UV plastic marking

Lower heat input for some plastics. Still enclosed-galvo field limits. Verify plastic type; never laser unknown vinyl.

→ [UV lasers explained](/guides/uv-lasers-explained)

---

## Who should buy galvo?

**Good fit:**

- **Metal production** on small parts with recurring revenue
- Mixed **hybrid** shop accepting compact format
- UV or MOPA when material demands it, in enclosed box
- Batch personalization (tags, small plaques, tools)

**Poor fit:**

- 80% of portfolio is large organic surfaces (cutting boards, big signs)
- Expecting CO₂ acrylic throughput in galvo field
- Need lowest entry price for wood only ([diode](/guides/diode-lasers-explained) wins)

---

## Setup notes buyers skip

### Exhaust even on "clean" metal jobs

Coatings, oils, and marking compounds produce fumes. Enclosed galvo still needs ducting for production hours.

→ [Laser ventilation setup](/guides/laser-ventilation-setup)

### Software learning curve

Galvo fiber often ships with vendor software plus optional **LightBurn** galvo support depending on model. Budget time to learn hatch, fill, and frequency settings.

→ [LightBurn vs maker software](/guides/lightburn-vs-maker-software)

### Field corner performance

Power and focus can soften at field edges. Test corners on scrap before promising uniform depth across the full square.

---

## Common mistakes (and why they happen)

| Mistake | Why it fails |
|---------|--------------|
| Buying fiber galvo to engrave kitchen cabinet doors | Field size; tiling labor dominates |
| Underestimating tiling on wide logos | Registration error shows in client proofs |
| Treating integrated hybrid like modular single-module galvo | Hybrid switches in software; modular means physical swap and one source active |
| Treating 10,000 mm/s as order turnaround | Fills and metal depth limit real speed |
| Ignoring work area mm in profiles | Two 20W fibers are not interchangeable physically |
| Comparing galvo fiber to a 2W IR accessory on a diode gantry | [IR modules](/guides/infrared-laser-modules-explained) are low-power diode-ecosystem tools, not production fiber |

---

## Browse galvo-class machines

- [Fiber](/lasers/type/fiber)
- [Hybrid](/lasers/type/hybrid)
- [UV](/lasers/type/uv)

## What's next?

- [Fiber lasers explained](/guides/fiber-lasers-explained)
- [UV lasers explained](/guides/uv-lasers-explained)
- [Infrared laser modules explained](/guides/infrared-laser-modules-explained): not galvo fiber
- [Laser buying guide 2026](/guides/laser-buying-guide-2026)
