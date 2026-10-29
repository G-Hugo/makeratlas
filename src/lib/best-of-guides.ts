import type { Locale } from "@/i18n/config";

export interface BuyingGuideSection {
  heading: string;
  body: string;
}

/**
 * Buying guide shown under each best-of ranking: what to look for, price tiers and
 * pitfalls for that kind of laser. Keyed by BEST_OF_CATEGORIES slug.
 */
export const BEST_OF_GUIDES: Partial<Record<string, Record<Locale, BuyingGuideSection[]>>> = {
  "diode-lasers": {
    en: [
      {
        heading: "Optical or electrical watts: what does the number on a diode laser mean?",
        body: "Diode lasers should be sold by optical output, the light that actually reaches the material, but some listings still quote electrical input, which is four to six times higher. A '40W' machine that draws 40W at the wall only delivers about 5 to 6W of light. Look for 'optical power' or 'output power' on the spec sheet. In our catalog the usual steps are 5W, 10W, 20W and 40W optical, plus a few 70W multi-diode modules. For engraving wood, leather and slate, 5 to 10W is plenty; extra power mainly buys cutting speed and thickness. A small spot (under 0.1 mm on recent 10W modules) matters more for fine engraving than raw power.",
      },
      {
        heading: "What can a diode laser cut and engrave?",
        body: "Blue diode light at around 450 nm is absorbed well by wood, leather, cardboard, cork, fabric and dark or opaque acrylic. It passes through clear and blue acrylic and glass, so those cannot be cut, and it does not mark bare metal, apart from a slow dark mark on stainless steel, coated or anodized metal, or metal treated with a marking spray. As a rough guide, a 10W module cuts 3 mm plywood in one or two passes, a 20W module 5 to 6 mm, and a 40W module around 10 mm in several passes. Plywood quality matters as much as power: glue voids in cheap sheets stop the beam. If clear acrylic or bare metal is central to your plans, look at CO₂ or fiber instead.",
      },
      {
        heading: "How much does a good diode laser cost in 2026?",
        body: "Under $250 buys a 5W or 10W open frame such as the Creality Falcon 5W or Sculpfun S10: good for engraving, slow for cutting. Between $250 and $600 you get 20W modules with air assist and limit switches, like the Acmer P1 20W, Longer Ray5 20W or Sculpfun S30 Pro Max. From $600 to $1,100, 40W open frames such as the Algolaser Alpha MK2 40W or Longer Ray5 40W cut thicker stock much faster. Enclosed diodes start around $500 for 12W (Sculpfun E1) and pass $1,500 for the xTool S1 40W. Above roughly $1,500 for an open frame, a desktop CO₂ usually becomes the better buy.",
      },
      {
        heading: "Which extras do you actually need with a diode laser?",
        body: "Air assist is not optional for cutting: it clears smoke from the kerf, limits charring and protects the lens. Most 2026 machines include a pump; if not, budget $50 to $120. A honeycomb bed ($30 to $70) lifts the work so the underside does not scorch. A rotary roller or chuck ($80 to $250) is needed for tumblers and glasses. An open frame needs a way to send smoke outdoors, either an enclosure tent with an inline fan or a window duct. The glasses shipped in the box are often thin; buy a pair rated OD5+ at 445 to 450 nm from a known brand. On software, LightBurn costs about $99 for diode lasers, LaserGRBL is free, and most brands ship their own app.",
      },
      {
        heading: "Buying a used or discontinued diode laser",
        body: "Popular discontinued models such as the xTool D1 Pro, Sculpfun S9 or Atomstack A5 Pro still sell well second-hand, and parts remain easy to find because the frames are simple. Ask for the module's optical power and how much it has been used, and check that the lens or protective window is not pitted or smoked. Run a fine test engraving: fuzzy edges usually mean a dirty lens or a tired diode. Check the belts, the gantry wheels and the limit switches. A used 10W frame at $150 can make sense, and many frames accept a newer module later, but compare with a new 10W at $200 to $250 before paying close to the original price.",
      },
    ],
    fr: [
      {
        heading: "Watts optiques ou électriques : que veut dire la puissance d’un laser diode ?",
        body: "Un laser diode devrait être vendu sur sa puissance optique, la lumière qui atteint réellement le matériau, mais certaines annonces affichent encore la puissance électrique, quatre à six fois plus élevée. Une machine « 40W » qui consomme 40W à la prise ne délivre qu’environ 5 à 6W de lumière. Cherchez la mention « optical power » ou « output power » dans la fiche. Dans notre catalogue, les paliers courants sont 5W, 10W, 20W et 40W optiques, plus quelques modules multi-diodes de 70W. Pour graver le bois, le cuir ou l’ardoise, 5 à 10W suffisent largement ; la puissance sert surtout à découper plus vite et plus épais. Un point fin (moins de 0,1 mm sur les modules 10W récents) compte davantage pour la gravure fine.",
      },
      {
        heading: "Que peut découper et graver un laser diode ?",
        body: "La lumière bleue d’une diode, vers 450 nm, est bien absorbée par le bois, le cuir, le carton, le liège, le tissu et l’acrylique foncé ou opaque. Elle traverse l’acrylique transparent ou bleu et le verre, qui ne se découpent donc pas, et elle ne marque pas le métal nu, hormis l’inox (marquage sombre et lent), le métal peint ou anodisé, ou un métal traité au spray de marquage. En gros, un module 10W découpe du contreplaqué de 3 mm en une ou deux passes, un 20W 5 à 6 mm, un 40W environ 10 mm en plusieurs passes. La qualité du contreplaqué compte autant que la puissance : les poches de colle des panneaux bon marché arrêtent le faisceau. Si l’acrylique transparent ou le métal nu sont essentiels pour vous, regardez plutôt le CO₂ ou la fibre.",
      },
      {
        heading: "Combien coûte un bon laser diode en 2026 ?",
        body: "Sous 250 $, on trouve des cadres ouverts 5W ou 10W comme le Creality Falcon 5W ou le Sculpfun S10 : bons en gravure, lents en découpe. Entre 250 et 600 $, on passe aux modules 20W avec assistance d’air et capteurs de fin de course, comme l’Acmer P1 20W, le Longer Ray5 20W ou le Sculpfun S30 Pro Max. De 600 à 1 100 $, les cadres ouverts 40W comme l’Algolaser Alpha MK2 40W ou le Longer Ray5 40W découpent nettement plus vite et plus épais. Les diodes fermées commencent vers 500 $ en 12W (Sculpfun E1) et dépassent 1 500 $ pour le xTool S1 40W. Au-delà d’environ 1 500 $ pour un cadre ouvert, un CO₂ de bureau devient généralement le meilleur achat.",
      },
      {
        heading: "Quels accessoires sont vraiment nécessaires avec un laser diode ?",
        body: "L’assistance d’air n’est pas facultative pour découper : elle chasse la fumée de la saignée, limite le noircissement et protège la lentille. La plupart des machines de 2026 incluent une pompe ; sinon, comptez 50 à 120 $. Un plateau nid d’abeille (30 à 70 $) surélève la pièce pour que le dessous ne brûle pas. Un module rotatif à rouleaux ou à mandrin (80 à 250 $) est indispensable pour les gobelets et les verres. Un cadre ouvert demande d’évacuer la fumée dehors, avec une tente et un extracteur en ligne ou une gaine par la fenêtre. Les lunettes fournies sont souvent légères : achetez une paire OD5+ à 445-450 nm d’une marque connue. Côté logiciel, LightBurn coûte environ 99 $ pour les diodes, LaserGRBL est gratuit et la plupart des marques fournissent leur propre appli.",
      },
      {
        heading: "Acheter un laser diode d’occasion ou arrêté",
        body: "Des modèles arrêtés et répandus comme le xTool D1 Pro, le Sculpfun S9 ou l’Atomstack A5 Pro se revendent bien d’occasion, et les pièces restent faciles à trouver car les cadres sont simples. Demandez la puissance optique du module et son niveau d’utilisation, et vérifiez que la lentille ou la vitre de protection n’est ni piquée ni encrassée. Faites une gravure fine de test : des bords flous signalent souvent une lentille sale ou une diode fatiguée. Contrôlez les courroies, les roues du portique et les capteurs de fin de course. Un cadre 10W d’occasion à 150 $ peut valoir le coup, et beaucoup acceptent un module plus récent plus tard, mais comparez avec un 10W neuf à 200-250 $ avant de payer presque le prix d’origine.",
      },
    ],
  },

  "co2-lasers": {
    en: [
      {
        heading: "Glass tube or RF tube: which CO₂ laser should you buy?",
        body: "Nearly all CO₂ machines under $4,000 use a sealed glass tube. It is cheap to replace but wears out: expect roughly 1,000 to 3,000 hours depending on tube quality and how hard it is driven, and a replacement 40 to 80W tube costs about $150 to $500 plus the risk of shipping glass. RF metal tubes, as in the OMTech Polar 2 50W RF, last much longer, pulse faster and give sharper photo engraving, but at equal power they push the price up by more than $1,000. For hobby use or occasional sales, glass is the sensible choice; for heavy daily engraving, RF pays back over time.",
      },
      {
        heading: "How many watts do you need to cut acrylic and wood?",
        body: "CO₂ tube ratings are output powers, but budget 40W tubes usually behave more like 30 to 35W. That class cuts 3 to 5 mm acrylic and plywood comfortably. 50 to 60W tubes, as in the xTool P2S, Gweike Cloud or Atomstack Hurricane, cut 6 to 8 mm acrylic in one pass and around 10 mm at slower speed. 80 to 100W machines handle 12 to 15 mm and cut thin stock much faster. Unlike blue diodes, CO₂ light at 10.6 µm is absorbed by clear acrylic, glass, stone and fabric, and cast acrylic comes out with a polished edge. It still cannot cut or mark bare metal without a marking spray.",
      },
      {
        heading: "What do CO₂ lasers cost, and what changes at each price level?",
        body: "The cheapest are the 40W blue-box machines from OMTech and Monport at $600 to $1,300: a small 300 × 200 mm bed, manual focus and mirror alignment to learn. Between $1,600 and $3,000 you reach finished desktop machines with cameras, autofocus and simpler software, such as the Gweike Cloud ($1,650 to $2,540) or Monport Reno 65 ($1,600 to $2,750). From $3,000 to $5,000, the xTool P2S and OMTech Polar 2 add larger beds (600 × 300 to 710 × 360 mm), pass-through doors and better extraction. Above that, the xTool P3 (80W, 915 × 458 mm) and 80 to 100W cabinets such as the OMTech 90W target production work.",
      },
      {
        heading: "The hidden costs of a CO₂ laser",
        body: "The tube needs water cooling. A bucket and pump works on a 40W machine but is risky in summer; a CW-3000 style passive chiller costs $150 to $250, and 60W tubes and up really need a compressor chiller of the CW-5200 class, around $400 to $650. Some desktop machines, like the xTool P2S, have cooling built in. Exhaust is mandatory: CO₂ cutting produces a lot of smoke, so plan a 4-inch duct to a window and often a stronger inline fan. Add a new tube every few years, lenses and mirrors ($20 to $60 each), a compressor if the air pump is weak, and a LightBurn license (about $200 for Ruida controllers) if the bundled software is limited.",
      },
      {
        heading: "Used CO₂ lasers: what to check before buying",
        body: "Discontinued machines like the Glowforge Pro, xTool P2 or OMTech Polar remain good buys second-hand, but the tube is the main unknown. Ask for its age and hours, and test cut a known material at a known power: if 3 mm acrylic needs far more power than expected, the tube is fading. Look for cracks or white deposits in the tube, scratches on the lens and corrosion in the cooling loop. Check that the mirrors align and that the controller is supported by LightBurn or current vendor software. A Glowforge depends on its cloud service, so confirm the account transfer works. Price in a new tube ($200 to $500) when you negotiate.",
      },
    ],
    fr: [
      {
        heading: "Tube en verre ou tube RF : quel laser CO₂ choisir ?",
        body: "Presque toutes les machines CO₂ sous 4 000 $ utilisent un tube en verre scellé. Il coûte peu à remplacer mais s’use : comptez environ 1 000 à 3 000 heures selon sa qualité et la puissance à laquelle on le pousse, et un tube de rechange de 40 à 80W coûte de 150 à 500 $, plus le risque de casse au transport. Les tubes RF métalliques, comme sur l’OMTech Polar 2 50W RF, durent beaucoup plus longtemps, pulsent plus vite et donnent des gravures photo plus nettes, mais à puissance égale ils ajoutent plus de 1 000 $ au prix. Pour un usage loisir ou des ventes occasionnelles, le verre est le choix raisonnable ; pour de la gravure intensive au quotidien, le RF se rentabilise.",
      },
      {
        heading: "Quelle puissance pour découper l’acrylique et le bois ?",
        body: "La puissance d’un tube CO₂ est une puissance de sortie, mais les tubes 40W d’entrée de gamme se comportent plutôt comme des 30 à 35W. Cette classe découpe sans peine l’acrylique et le contreplaqué de 3 à 5 mm. Les tubes de 50 à 60W, comme sur le xTool P2S, le Gweike Cloud ou l’Atomstack Hurricane, découpent 6 à 8 mm d’acrylique en une passe et environ 10 mm en ralentissant. Les machines de 80 à 100W passent 12 à 15 mm et découpent les faibles épaisseurs bien plus vite. Contrairement à la diode bleue, la lumière CO₂ à 10,6 µm est absorbée par l’acrylique transparent, le verre, la pierre et le tissu, et l’acrylique coulé ressort avec un chant poli. Elle ne découpe ni ne marque le métal nu sans spray de marquage.",
      },
      {
        heading: "Combien coûte un laser CO₂, et que gagne-t-on à chaque palier ?",
        body: "Les moins chers sont les machines 40W de type K40 d’OMTech et Monport, de 600 à 1 300 $ : petit plateau de 300 × 200 mm, mise au point manuelle et alignement des miroirs à apprendre. Entre 1 600 et 3 000 $, on passe à des machines de bureau abouties avec caméra, mise au point automatique et logiciel plus simple, comme le Gweike Cloud (1 650 à 2 540 $) ou le Monport Reno 65 (1 600 à 2 750 $). De 3 000 à 5 000 $, le xTool P2S et l’OMTech Polar 2 offrent des plateaux plus grands (600 × 300 à 710 × 360 mm), une trappe traversante et une meilleure extraction. Au-delà, le xTool P3 (80W, 915 × 458 mm) et les armoires de 80 à 100W comme l’OMTech 90W visent la production.",
      },
      {
        heading: "Les coûts cachés d’un laser CO₂",
        body: "Le tube doit être refroidi à l’eau. Un seau et une pompe suffisent sur un 40W mais deviennent risqués l’été ; un refroidisseur passif type CW-3000 coûte 150 à 250 $, et dès 60W il faut vraiment un refroidisseur à compresseur de classe CW-5200, autour de 400 à 650 $. Certaines machines de bureau, comme le xTool P2S, intègrent le refroidissement. L’extraction est obligatoire : la découpe CO₂ produit beaucoup de fumée, prévoyez une gaine de 100 mm vers une fenêtre et souvent un extracteur en ligne plus puissant. Ajoutez un tube neuf tous les quelques ans, lentilles et miroirs (20 à 60 $ pièce), un compresseur si la pompe d’air est faible, et une licence LightBurn (environ 200 $ pour les contrôleurs Ruida) si le logiciel fourni est limité.",
      },
      {
        heading: "Laser CO₂ d’occasion : que vérifier avant d’acheter ?",
        body: "Les machines arrêtées comme le Glowforge Pro, le xTool P2 ou l’OMTech Polar restent de bons achats d’occasion, mais le tube est la grande inconnue. Demandez son âge et ses heures, et faites découper un matériau connu à une puissance connue : si l’acrylique de 3 mm demande bien plus de puissance que prévu, le tube faiblit. Cherchez fissures ou dépôts blancs dans le tube, rayures sur la lentille et corrosion dans le circuit d’eau. Vérifiez que les miroirs s’alignent et que le contrôleur est pris en charge par LightBurn ou par le logiciel actuel de la marque. Un Glowforge dépend de son service en ligne : assurez-vous que le transfert du compte fonctionne. Intégrez un tube neuf (200 à 500 $) dans la négociation.",
      },
    ],
  },

  "metal-engraving": {
    en: [
      {
        heading: "Which laser can actually mark metal?",
        body: "Bare metal reflects most blue diode and CO₂ light, so the real tool is a 1064 nm source: a fiber laser, a MOPA fiber, or the small infrared module found in hybrid machines. A diode or CO₂ can still mark metal in three cases: anodized or painted metal, where the coating is removed; steel coated with a marking spray such as Cermark or LaserBond, which fuses a black layer; or a slow, dark mark on stainless from a powerful diode. These methods work for occasional gifts but are slower and the result varies. If metal is a regular job, buy a 1064 nm source from the start.",
      },
      {
        heading: "How much power do you need to engrave metal?",
        body: "Surface marking of text, logos and serial numbers on stainless, tools and anodized aluminum needs little power: the 2W infrared module of an xTool F1 or Acmer GE1 does it, slowly. A 20W fiber marks the same parts in seconds and can engrave shallow depth in brass and steel. For deep engraving, relief, coin-style work or cutting thin silver and gold sheet, 50W is the realistic floor, and even then deep work takes many passes. Copper, gold and silver reflect strongly and need more power or slower settings than steel. Lens size matters too: the same source is less punchy on a 300 mm field than on a 110 mm field.",
      },
      {
        heading: "Price ranges for metal marking lasers in 2026",
        body: "Hybrids with a small infrared source cost $800 to $2,200: the Acmer GE1, the Acmer P3 10W + IR, or the xTool F2 with 5W infrared from $1,299. They suit occasional metal alongside wood. Desktop 20W fibers run about $900 to $1,600, such as the Atomstack A20 Pro 1064nm, Gweike G2 20W or Commarker B4. Q-switched fibers of 30 to 60W sit between $1,600 and $5,000. MOPA sources, which add color on stainless and black on anodized aluminum, start around $3,100 with the 30W Commarker B6 MOPA. Kilowatt sheet-metal cutters are another world, from about $57,000.",
      },
      {
        heading: "Fiber, MOPA or hybrid: which suits your work?",
        body: "Jewelry makers, knife makers and tumbler sellers who mostly mark stainless and anodized aluminum are well served by a 20 to 30W Q-switched fiber. Pick a MOPA if you want color on stainless, deep black on anodized aluminum or cleaner marks on plastics. A hybrid such as the xTool F2 or Longer Nano Duo AI suits people who engrave wood, leather and metal in small quantities and want one compact machine. To engrave around rings or tumblers, budget a rotary for galvo machines (roughly $150 to $400) and check that the software supports it.",
      },
      {
        heading: "Eye safety and fumes when marking metal",
        body: "1064 nm light is invisible, and many fiber galvos are open, with nothing between the beam and your eyes. Wear glasses rated for 1064 nm at OD5 or higher; the glasses sold for blue diode lasers do not protect against infrared. Shields or an enclosure matter if other people share the room. Marking anodized aluminum, coated tumblers and plated metals produces fine fumes, so extraction or a duct outside is still needed even when the smoke looks light. Keep shiny parts flat and in focus to limit stray reflections.",
      },
    ],
    fr: [
      {
        heading: "Quel laser peut vraiment marquer le métal ?",
        body: "Le métal nu réfléchit l’essentiel de la lumière d’une diode bleue ou d’un CO₂ : le véritable outil est une source 1064 nm, c’est-à-dire un laser fibre, une fibre MOPA ou le petit module infrarouge des machines hybrides. Une diode ou un CO₂ peuvent tout de même marquer le métal dans trois cas : le métal anodisé ou peint, dont on retire le revêtement ; l’acier recouvert d’un spray de marquage comme Cermark ou LaserBond, qui fusionne une couche noire ; ou un marquage sombre et lent sur l’inox avec une diode puissante. Ces méthodes conviennent pour des cadeaux ponctuels, mais elles sont lentes et le résultat varie. Si le métal est un travail régulier, partez directement sur une source 1064 nm.",
      },
      {
        heading: "Quelle puissance pour graver le métal ?",
        body: "Marquer en surface du texte, des logos ou des numéros de série sur l’inox, les outils et l’aluminium anodisé demande peu de puissance : le module infrarouge 2W d’un xTool F1 ou d’un Acmer GE1 le fait, lentement. Une fibre 20W marque les mêmes pièces en quelques secondes et grave une faible profondeur dans le laiton et l’acier. Pour la gravure profonde, le relief, les médailles ou la découpe de fines feuilles d’argent et d’or, 50W est le minimum réaliste, et il faut encore de nombreuses passes. Le cuivre, l’or et l’argent réfléchissent fortement et demandent plus de puissance ou des réglages plus lents que l’acier. La lentille compte aussi : la même source est moins incisive sur un champ de 300 mm que sur un champ de 110 mm.",
      },
      {
        heading: "Les gammes de prix des lasers pour le métal en 2026",
        body: "Les hybrides avec une petite source infrarouge coûtent de 800 à 2 200 $ : l’Acmer GE1, l’Acmer P3 10W + IR, ou le xTool F2 avec 5W infrarouge dès 1 299 $. Ils conviennent pour du métal occasionnel à côté du bois. Les fibres 20W de bureau tournent autour de 900 à 1 600 $, comme l’Atomstack A20 Pro 1064nm, le Gweike G2 20W ou le Commarker B4. Les fibres Q-switch de 30 à 60W se situent entre 1 600 et 5 000 $. Les sources MOPA, qui ajoutent la couleur sur l’inox et le noir sur l’aluminium anodisé, commencent vers 3 100 $ avec le Commarker B6 MOPA 30W. Les découpeuses de tôle de plusieurs kilowatts sont un autre monde, à partir d’environ 57 000 $.",
      },
      {
        heading: "Fibre, MOPA ou hybride : laquelle pour votre activité ?",
        body: "Bijoutiers, couteliers et vendeurs de gobelets qui marquent surtout l’inox et l’aluminium anodisé sont bien servis par une fibre Q-switch de 20 à 30W. Prenez une MOPA si vous voulez de la couleur sur l’inox, un noir profond sur l’aluminium anodisé ou des marquages plus propres sur les plastiques. Un hybride comme le xTool F2 ou le Longer Nano Duo AI convient à ceux qui gravent bois, cuir et métal en petites quantités et veulent une seule machine compacte. Pour graver le tour d’une bague ou d’un gobelet, prévoyez un module rotatif pour galvo (environ 150 à 400 $) et vérifiez que le logiciel le gère.",
      },
      {
        heading: "Protection des yeux et fumées sur le métal",
        body: "La lumière à 1064 nm est invisible, et beaucoup de galvos fibre sont ouverts, sans rien entre le faisceau et vos yeux. Portez des lunettes certifiées pour 1064 nm, OD5 ou plus ; les lunettes vendues pour les diodes bleues ne protègent pas de l’infrarouge. Un écran ou un caisson s’impose si d’autres personnes partagent la pièce. Le marquage de l’aluminium anodisé, des gobelets revêtus et des métaux plaqués dégage des fumées fines : une extraction ou une gaine vers l’extérieur reste nécessaire même quand la fumée paraît légère. Gardez les pièces brillantes à plat et bien au point pour limiter les reflets parasites.",
      },
    ],
  },

  beginners: {
    en: [
      {
        heading: "What makes a laser engraver easy for a beginner?",
        body: "Ease comes from three things: setup, focus and software. Pre-assembled or enclosed machines like the Creality Falcon A1C, Acmer K1 or Sculpfun iCube Ultra are running within half an hour, while open frames take one to two hours of assembly and belt adjustment. Autofocus or a simple focus gauge avoids the most common failure, a blurry engraving. Software matters most over time: a phone or desktop app with a material library is enough to start, and LightBurn becomes worth its price once you design your own projects. A camera for positioning removes much of the trial and error.",
      },
      {
        heading: "Diode or CO₂ for a first laser?",
        body: "Within a beginner budget of about $1,200, a 10 to 20W diode is the safer start. It needs no water cooling, no mirror alignment and no tube replacement, and it engraves wood, leather, slate and coated tumblers very well. A 40W CO₂ from OMTech or Monport costs about the same ($600 to $1,300) and cuts clear acrylic and thicker wood faster, but asks you to manage water cooling, align mirrors and vent much more smoke. Choose CO₂ only if acrylic signs or regular cutting are the reason you are buying. Neither will properly mark bare metal.",
      },
      {
        heading: "How much should you budget for a first laser?",
        body: "Count the whole setup, not just the machine. A capable first open-frame diode costs $200 to $450 for 10 to 20W (Ortur Laser Master 3, Acmer P1, Creality Falcon 10W). Add $30 to $70 for a honeycomb bed, $50 to $150 for an exhaust fan and duct, $40 or more for proper safety glasses and $50 to $100 of practice material such as basswood, plywood and leather offcuts. A rotary for tumblers adds $80 to $200. Small enclosed machines at $200 to $400 include the cover and often a fan, but their 150 × 150 mm area limits projects. A realistic first budget is $350 to $700 all in.",
      },
      {
        heading: "Beginner mistakes to avoid",
        body: "Never laser PVC, vinyl or anything containing chlorine: it releases a toxic, corrosive gas that also damages the machine. Avoid ABS and polycarbonate, which melt and burn badly. Do not leave a cutting job unattended, even briefly: flare-ups on plywood are common, so keep a fire extinguisher within reach. Running without ventilation in a bedroom or living room is a health risk. Many beginners also buy on advertised watts; on cheap marketplace listings, '80W' can mean 5W of light. Finally, test settings on scrap before each new material, since two sheets of the same plywood can behave differently.",
      },
      {
        heading: "Safety basics before your first engraving",
        body: "With an open diode, wear glasses certified for the laser's wavelength (around 450 nm, OD5 or higher), and so should anyone else in the room. An enclosed machine with a filtered window lets you watch without glasses, but check that opening the lid stops the laser. Place the machine on a non-flammable surface, away from curtains and paper. Smoke must go outside through a window duct or into a filter unit designed for laser fumes; a kitchen hood is not enough. Children should not run a laser on their own, and pets are better kept out of the room during jobs.",
      },
    ],
    fr: [
      {
        heading: "Qu’est-ce qui rend un graveur laser simple pour débuter ?",
        body: "La simplicité tient à trois choses : l’installation, la mise au point et le logiciel. Les machines préassemblées ou fermées comme le Creality Falcon A1C, l’Acmer K1 ou le Sculpfun iCube Ultra tournent en une demi-heure, alors qu’un cadre ouvert demande une à deux heures de montage et de réglage des courroies. Une mise au point automatique ou une simple cale évite l’échec le plus fréquent : la gravure floue. Le logiciel compte le plus sur la durée : une appli mobile ou de bureau avec une bibliothèque de matériaux suffit pour commencer, et LightBurn vaut son prix dès qu’on dessine ses propres projets. Une caméra de positionnement supprime une bonne partie des essais ratés.",
      },
      {
        heading: "Diode ou CO₂ pour un premier laser ?",
        body: "Avec un budget de débutant d’environ 1 200 $, une diode de 10 à 20W est le départ le plus sûr. Pas de refroidissement à eau, pas d’alignement de miroirs, pas de tube à remplacer, et elle grave très bien le bois, le cuir, l’ardoise et les gobelets revêtus. Un CO₂ 40W d’OMTech ou de Monport coûte à peu près autant (600 à 1 300 $) et découpe plus vite l’acrylique transparent et le bois épais, mais il faut gérer le refroidissement, aligner les miroirs et évacuer beaucoup plus de fumée. Ne choisissez le CO₂ que si les enseignes en acrylique ou la découpe régulière sont la raison de l’achat. Aucun des deux ne marque correctement le métal nu.",
      },
      {
        heading: "Quel budget prévoir pour un premier laser ?",
        body: "Comptez l’installation complète, pas seulement la machine. Une première diode à cadre ouvert correcte coûte 200 à 450 $ en 10 à 20W (Ortur Laser Master 3, Acmer P1, Creality Falcon 10W). Ajoutez 30 à 70 $ pour un plateau nid d’abeille, 50 à 150 $ pour un extracteur et sa gaine, 40 $ ou plus pour de vraies lunettes de protection et 50 à 100 $ de matériaux d’entraînement : tilleul, contreplaqué, chutes de cuir. Un module rotatif pour les gobelets ajoute 80 à 200 $. Les petites machines fermées à 200-400 $ incluent le capot et souvent un ventilateur, mais leur surface de 150 × 150 mm limite les projets. Un premier budget réaliste se situe entre 350 et 700 $ tout compris.",
      },
      {
        heading: "Les erreurs de débutant à éviter",
        body: "Ne passez jamais au laser du PVC, du vinyle ou quoi que ce soit contenant du chlore : cela dégage un gaz toxique et corrosif qui abîme aussi la machine. Évitez l’ABS et le polycarbonate, qui fondent et brûlent mal. Ne laissez jamais une découpe sans surveillance, même un instant : les flammes sur le contreplaqué sont fréquentes, gardez un extincteur à portée de main. Travailler sans ventilation dans une chambre ou un salon est un risque pour la santé. Beaucoup de débutants achètent aussi sur la foi des watts affichés : sur les places de marché bon marché, « 80W » peut signifier 5W de lumière. Enfin, testez vos réglages sur une chute avant chaque nouveau matériau, car deux panneaux du même contreplaqué peuvent réagir différemment.",
      },
      {
        heading: "Les règles de sécurité avant la première gravure",
        body: "Avec une diode à cadre ouvert, portez des lunettes certifiées pour la longueur d’onde du laser (environ 450 nm, OD5 ou plus), comme toute autre personne présente dans la pièce. Une machine fermée avec une vitre filtrante permet de regarder sans lunettes, mais vérifiez que l’ouverture du capot coupe le laser. Posez la machine sur une surface ininflammable, loin des rideaux et du papier. La fumée doit partir dehors par une gaine à la fenêtre, ou dans un purificateur prévu pour les fumées laser ; une hotte de cuisine ne suffit pas. Un enfant ne doit pas utiliser un laser seul, et mieux vaut sortir les animaux de la pièce pendant les travaux.",
      },
    ],
  },

  budget: {
    en: [
      {
        heading: "What can you really get for under $500?",
        body: "Under $200, you get 5 to 6W diodes like the Creality Falcon 5W, Ortur Aufero AL1 or Acmer S1: excellent for engraving wood, leather and slate, but limited to thin cuts, around 3 mm basswood in several passes. From $200 to $350, 10W machines such as the Sculpfun S10, and a few 20W models like the Comgrow Z1 20W, cut 3 mm plywood in one or two passes. Between $350 and $500, 20W machines such as the Acmer P1 20W or Longer Ray5 20W cut 5 to 6 mm plywood and engrave much faster. Some 40W modules dip under $500, but at that price check the frame and the module cooling carefully.",
      },
      {
        heading: "Where budget lasers cut corners",
        body: "Cheap frames use thinner aluminum profiles and softer wheels, which shows as wavy lines at high speed. Some still skip limit switches, so the machine cannot home itself and repeating a job in the same spot is harder. Air assist may be missing, or limited to a nozzle without a pump. Small enclosed machines under $300 keep a 130 to 150 mm work area. The lens is rarely protected by a replaceable window, so smoke deposits wear it out faster. None of this prevents good results, but plan for upgrades: an air pump ($50 to $100), a honeycomb bed ($30 to $70) and possibly a better exhaust fan.",
      },
      {
        heading: "How to spot fake wattage on cheap lasers",
        body: "The budget segment is where inflated numbers are most common. Marketplace listings advertising 80W, 100W or 130W for under $200 almost always describe electrical input, or simply invent a figure; the real optical output is typically 5 to 6W. Prefer brands that state optical power clearly and publish cutting tests. Another trick is 'equivalent' power: a compressed 10W spot sold as 'comparable to 40W'. Compare results on the same material and thickness instead, ideally from independent reviews, and check the module's model number when the seller gives it.",
      },
      {
        heading: "Is a used laser a better deal than a new cheap one?",
        body: "Often, yes. Discontinued 10 and 20W models like the Sculpfun S9, Atomstack A5 Pro 20W or Ortur Laser Master 2 Pro sell second-hand for roughly $100 to $250 and outperform many new sub-$200 machines. Check that the module engraves a clean test square, the lens is clear, the belts are tight and the controller connects to LightBurn or LaserGRBL. Ask whether the air assist and honeycomb bed are included, since they cost $80 to $170 new. Avoid modules of unknown origin and units with scorched wiring. Replacement modules for these common frames are still easy to buy.",
      },
    ],
    fr: [
      {
        heading: "Que peut-on vraiment avoir pour moins de 500 $ ?",
        body: "Sous 200 $, on trouve des diodes de 5 à 6W comme le Creality Falcon 5W, l’Ortur Aufero AL1 ou l’Acmer S1 : excellentes pour graver le bois, le cuir et l’ardoise, mais limitées en découpe, environ 3 mm de tilleul en plusieurs passes. De 200 à 350 $, les machines 10W comme le Sculpfun S10, et quelques 20W comme le Comgrow Z1 20W, découpent du contreplaqué de 3 mm en une ou deux passes. Entre 350 et 500 $, les 20W comme l’Acmer P1 20W ou le Longer Ray5 20W découpent 5 à 6 mm de contreplaqué et gravent bien plus vite. Certains modules 40W passent sous 500 $, mais à ce prix vérifiez de près le cadre et le refroidissement du module.",
      },
      {
        heading: "Où les lasers pas chers font des économies",
        body: "Les cadres bon marché utilisent des profilés d’aluminium plus fins et des roues plus souples, ce qui se voit en lignes ondulées à grande vitesse. Certains font encore l’impasse sur les capteurs de fin de course : la machine ne peut pas revenir à son origine, et reprendre un travail au même endroit devient plus difficile. L’assistance d’air peut manquer, ou se limiter à une buse sans pompe. Les petites machines fermées sous 300 $ gardent une surface de 130 à 150 mm. La lentille est rarement protégée par une vitre remplaçable, et les dépôts de fumée l’usent plus vite. Rien de tout cela n’empêche de bons résultats, mais prévoyez des améliorations : une pompe à air (50 à 100 $), un plateau nid d’abeille (30 à 70 $) et peut-être un meilleur extracteur.",
      },
      {
        heading: "Comment repérer les faux watts sur les lasers pas chers",
        body: "C’est dans l’entrée de gamme que les chiffres gonflés sont les plus fréquents. Les annonces des places de marché qui affichent 80W, 100W ou 130W pour moins de 200 $ décrivent presque toujours la puissance électrique, quand le chiffre n’est pas simplement inventé ; la puissance optique réelle tourne autour de 5 à 6W. Privilégiez les marques qui indiquent clairement la puissance optique et publient des tests de découpe. Autre astuce : la puissance « équivalente », un point compressé de 10W vendu comme « comparable à 40W ». Comparez plutôt les résultats sur le même matériau et la même épaisseur, idéalement dans des tests indépendants, et vérifiez la référence du module quand le vendeur la donne.",
      },
      {
        heading: "Un laser d’occasion vaut-il mieux qu’un neuf bon marché ?",
        body: "Souvent, oui. Des modèles 10 et 20W arrêtés comme le Sculpfun S9, l’Atomstack A5 Pro 20W ou l’Ortur Laser Master 2 Pro se revendent environ 100 à 250 $ et font mieux que beaucoup de machines neuves à moins de 200 $. Vérifiez que le module grave un carré de test net, que la lentille est propre, que les courroies sont tendues et que le contrôleur se connecte à LightBurn ou LaserGRBL. Demandez si l’assistance d’air et le plateau nid d’abeille sont inclus, car ils coûtent 80 à 170 $ neufs. Fuyez les modules d’origine inconnue et les machines aux câbles brûlés. Les modules de rechange pour ces cadres répandus restent faciles à trouver.",
      },
    ],
  },

  cutting: {
    en: [
      {
        heading: "What really determines laser cutting performance?",
        body: "Optical power is the starting point, but three other factors decide how thick and how fast you cut. Wavelength: CO₂ at 10.6 µm cuts acrylic of any color and thick wood faster than a diode of similar power, and diodes cannot cut clear acrylic at all. Beam quality: a compressed diode spot cuts deeper per watt, but the beam cone leaves angled edges on thick stock. Air assist: a strong pump of 30 L/min or more, or a compressor, clears smoke from the kerf and limits charring. The bed and focus matter too: a honeycomb or blade bed, and the option to set focus inside the material, help on thick cuts.",
      },
      {
        heading: "How thick can each type of laser cut?",
        body: "Typical figures on good basswood or birch plywood with air assist, in one to three passes: a 20W diode cuts 5 to 6 mm plywood and 8 to 10 mm basswood. A 40W diode reaches around 10 mm plywood, more in many passes, with darker edges. A 40W CO₂ of the K40 class cuts about 6 mm plywood and 5 to 6 mm acrylic. A 55W CO₂ such as the xTool P2S or Gweike Cloud handles 8 to 10 mm acrylic and 10 mm plywood. 80 to 100W CO₂ machines cut 15 mm acrylic and more in one or two passes. Maximum claims usually assume soft wood and many passes; expect less on hardwood and cheap plywood.",
      },
      {
        heading: "Price and work area for a cutting machine",
        body: "For cutting, bed size counts as much as power, because sheet stock comes in large formats. Open-frame 20 to 40W diodes cost $350 to $1,100 with about 400 × 400 mm areas; large frames like the Sculpfun S30 Ultra (590 × 595 mm) or the Sculpfun S70 Max and Atomstack A70 Max (830 × 800 mm) run from $450 to $3,000. Desktop CO₂ cutters at $1,600 to $5,000 offer 500 × 300 to 710 × 360 mm, often with a pass-through slot for longer pieces. The xTool P3 reaches 915 × 458 mm at 80W. Check whether a riser kit exists if you plan to cut or engrave thick blanks.",
      },
      {
        heading: "Common pitfalls when buying a laser for cutting",
        body: "Maximum cut claims are usually best cases on soft basswood with many passes; look for single-pass figures on plywood. Thick diode cuts are slow: 10 mm in several passes can take many times longer than on a 55W CO₂. Cutting produces far more smoke than engraving, so a weak fan becomes the bottleneck. An aquarium-style air pump is fine for engraving but weak for thick wood. Fire risk rises with cutting: flare-ups happen on plywood and MDF, so stay with the machine and keep an extinguisher close. Plywood and MDF glues vary widely; buy laser-grade sheets for predictable results.",
      },
      {
        heading: "Diode or CO₂ for a cutting-focused workshop?",
        body: "If you mostly cut wood under 6 mm and engrave from time to time, a 20 to 40W diode is cheaper to buy and to run, and easy to set up in a garage. If acrylic signs, earrings or cake toppers in clear or colored acrylic, or regular 6 to 12 mm wood, are part of the work, a 50 to 60W CO₂ pays for itself in time saved and cleaner edges. For large signs or furniture parts, look at bed size first: an 80W CO₂ like the xTool P3 or a 90W OMTech cabinet. Leather and fabric cut well on both; CO₂ leaves less soot on light-colored materials.",
      },
    ],
    fr: [
      {
        heading: "Qu’est-ce qui détermine vraiment les performances de découpe ?",
        body: "La puissance optique est le point de départ, mais trois autres facteurs décident de l’épaisseur et de la vitesse. La longueur d’onde : le CO₂ à 10,6 µm découpe l’acrylique de toutes les couleurs et le bois épais plus vite qu’une diode de puissance comparable, et la diode ne découpe pas du tout l’acrylique transparent. La qualité du faisceau : un point de diode compressé coupe plus profond par watt, mais le cône du faisceau laisse des chants en biais sur les fortes épaisseurs. L’assistance d’air : une pompe puissante de 30 L/min ou plus, ou un compresseur, chasse la fumée de la saignée et limite le noircissement. Le plateau et la mise au point comptent aussi : un nid d’abeille ou des lames, et la possibilité de focaliser dans la matière, aident sur les découpes épaisses.",
      },
      {
        heading: "Quelle épaisseur peut découper chaque type de laser ?",
        body: "Valeurs typiques sur du bon tilleul ou du contreplaqué de bouleau avec assistance d’air, en une à trois passes : une diode 20W découpe 5 à 6 mm de contreplaqué et 8 à 10 mm de tilleul. Une diode 40W atteint environ 10 mm de contreplaqué, davantage en de nombreuses passes, avec des chants plus sombres. Un CO₂ 40W de type K40 découpe environ 6 mm de contreplaqué et 5 à 6 mm d’acrylique. Un CO₂ 55W comme le xTool P2S ou le Gweike Cloud passe 8 à 10 mm d’acrylique et 10 mm de contreplaqué. Les CO₂ de 80 à 100W découpent 15 mm d’acrylique et plus en une ou deux passes. Les maximums annoncés supposent souvent du bois tendre et de nombreuses passes : comptez moins sur bois dur et contreplaqué bas de gamme.",
      },
      {
        heading: "Prix et surface de travail d’une machine de découpe",
        body: "En découpe, la surface compte autant que la puissance, car les panneaux sont vendus en grands formats. Les diodes à cadre ouvert de 20 à 40W coûtent 350 à 1 100 $ pour environ 400 × 400 mm ; les grands cadres comme le Sculpfun S30 Ultra (590 × 595 mm) ou les Sculpfun S70 Max et Atomstack A70 Max (830 × 800 mm) vont de 450 à 3 000 $. Les découpeuses CO₂ de bureau à 1 600-5 000 $ offrent de 500 × 300 à 710 × 360 mm, souvent avec une fente traversante pour les pièces longues. Le xTool P3 atteint 915 × 458 mm en 80W. Vérifiez qu’un kit de rehausse existe si vous comptez découper ou graver des pièces épaisses.",
      },
      {
        heading: "Les pièges fréquents quand on achète pour découper",
        body: "Les épaisseurs maximales annoncées sont en général des cas idéaux, sur du tilleul tendre en de nombreuses passes ; cherchez des résultats en une passe sur du contreplaqué. Une découpe épaisse à la diode est lente : 10 mm en plusieurs passes peut prendre bien plus de temps que sur un CO₂ 55W. La découpe produit beaucoup plus de fumée que la gravure, et un extracteur faible devient le facteur limitant. Une pompe d’aquarium suffit pour graver, pas pour le bois épais. Le risque d’incendie augmente : les flammes sont courantes sur le contreplaqué et le MDF, restez près de la machine et gardez un extincteur à côté. Les colles du contreplaqué et du MDF varient énormément ; achetez des panneaux qualité laser pour des résultats prévisibles.",
      },
      {
        heading: "Diode ou CO₂ pour un atelier tourné vers la découpe ?",
        body: "Si vous découpez surtout du bois de moins de 6 mm et gravez de temps en temps, une diode de 20 à 40W coûte moins cher à l’achat comme à l’usage et s’installe facilement dans un garage. Si les enseignes, boucles d’oreilles ou décorations de gâteau en acrylique transparent ou coloré, ou le bois de 6 à 12 mm, font partie du travail, un CO₂ de 50 à 60W se rentabilise en temps gagné et en chants plus propres. Pour de grandes enseignes ou des pièces de mobilier, regardez d’abord la surface : un CO₂ 80W comme le xTool P3 ou une armoire OMTech 90W. Le cuir et le tissu se découpent bien avec les deux ; le CO₂ laisse moins de suie sur les matières claires.",
      },
    ],
  },

  "small-business": {
    en: [
      {
        heading: "What matters when a laser has to make money?",
        body: "Throughput, uptime and consistency. A machine that engraves a cutting board in 6 minutes instead of 20 triples your daily capacity. Reliability counts more than peak specs: a stopped laser in the holiday season costs orders. Check spare-parts availability, warranty length and support response, and whether common parts such as the lens, belts, tube or module can be swapped by you. Consistency means the same result on the hundredth piece: a camera for alignment, a repeatable jig and stable focus. The software must also handle batch work: arrays, variable text for names and serial numbers, and saved material settings.",
      },
      {
        heading: "Which laser for which product?",
        body: "Wood signs, coasters and cutting boards: a 20 to 40W enclosed diode or a 50 to 60W CO₂. Acrylic earrings, signs and cake toppers: CO₂, since diodes cannot cut clear acrylic. Tumblers, pet tags, jewelry, knives and tools: a fiber or MOPA galvo, which marks small metal items in seconds rather than minutes. Small leather and wood items in volume: a galvo diode or hybrid like the xTool F2 or F1 Ultra, much faster than a gantry on small engravings. Many shops end up with two machines: a CO₂ or diode for cutting, and a fiber galvo for metal.",
      },
      {
        heading: "Budget and return on investment for a laser business",
        body: "Entry production setups start around $1,300 to $2,500: a 20W fiber like the Commarker B4 or Gweike G2, a Gweike Cloud CO₂, or an enclosed 40W diode. Shops built around one serious machine spend $3,000 to $5,000 on an xTool P2S, an OMTech Polar 2 or a 60W MOPA. Do the math per item: blank, machine time, packaging and platform fees. A $20 engraved tumbler with a $6 blank and 15% fees leaves about $11; a $1,500 fiber is paid back after roughly 140 sales, before counting your time. Design, listing and customer messages are usually the real limit, not the laser.",
      },
      {
        heading: "Hidden costs of running a laser business",
        body: "In a rented space where you cannot duct outside, a fume filter unit costs $400 to $1,000, plus replacement filters. CO₂ tubes, lenses and mirrors are consumables. A rotary attachment is close to mandatory for tumbler and glassware products. Software can add recurring fees: some vendors lock features behind a subscription, such as Glowforge Premium, while LightBurn is a one-time license with optional paid updates. Check insurance and local rules for running a laser at home or in commercial premises, and keep a stock of blanks, since supplier delays often hurt more than a slow machine.",
      },
      {
        heading: "Buying a used laser for a business",
        body: "A used machine can halve the startup cost, but downtime hurts more when orders are waiting. Prefer models with a large owner base and parts still available: the Glowforge Pro, xTool P2 or Monport 55W CO₂ are discontinued but widely used. For fibers, check the source brand and power on its label (JPT, Raycus, MAX), and test a marking across the full field to spot weak corners. For CO₂, assume the tube may need replacing soon. Ask for the original invoice for warranty and resale, and make sure the software account or license transfers with the machine.",
      },
    ],
    fr: [
      {
        heading: "Qu’est-ce qui compte quand un laser doit rapporter de l’argent ?",
        body: "La cadence, la disponibilité et la régularité. Une machine qui grave une planche à découper en 6 minutes au lieu de 20 triple votre capacité journalière. La fiabilité compte plus que les chiffres de pointe : un laser en panne pendant les fêtes, ce sont des commandes perdues. Regardez la disponibilité des pièces, la durée de garantie, la réactivité du support, et si les pièces courantes (lentille, courroies, tube, module) se changent soi-même. La régularité, c’est le même résultat sur la centième pièce : caméra d’alignement, gabarit reproductible, mise au point stable. Le logiciel doit aussi gérer les séries : duplication en grille, texte variable pour les prénoms et numéros de série, réglages de matériaux enregistrés.",
      },
      {
        heading: "Quel laser pour quel produit ?",
        body: "Enseignes en bois, sous-verres et planches à découper : une diode fermée de 20 à 40W ou un CO₂ de 50 à 60W. Boucles d’oreilles, enseignes et décorations de gâteau en acrylique : un CO₂, la diode ne découpant pas l’acrylique transparent. Gobelets, médailles pour animaux, bijoux, couteaux et outils : un galvo fibre ou MOPA, qui marque les petits objets métalliques en secondes plutôt qu’en minutes. Petits objets en cuir et en bois en volume : une diode galvo ou un hybride comme le xTool F2 ou le F1 Ultra, bien plus rapides qu’un portique sur les petites gravures. Beaucoup d’ateliers finissent avec deux machines : un CO₂ ou une diode pour la découpe, et un galvo fibre pour le métal.",
      },
      {
        heading: "Budget et rentabilité d’une activité laser",
        body: "Une première installation de production commence vers 1 300 à 2 500 $ : une fibre 20W comme le Commarker B4 ou le Gweike G2, un CO₂ Gweike Cloud ou une diode fermée 40W. Les ateliers bâtis autour d’une machine sérieuse investissent 3 000 à 5 000 $ dans un xTool P2S, un OMTech Polar 2 ou une MOPA 60W. Faites le calcul à la pièce : support vierge, temps machine, emballage et frais de plateforme. Un gobelet gravé vendu 20 $, avec un support à 6 $ et 15 % de frais, laisse environ 11 $ ; une fibre à 1 500 $ est remboursée après environ 140 ventes, sans compter votre temps. La conception, les annonces et les messages clients sont généralement la vraie limite, pas le laser.",
      },
      {
        heading: "Les coûts cachés d’une activité laser",
        body: "Dans un local loué où l’on ne peut pas évacuer dehors, un purificateur de fumées coûte 400 à 1 000 $, plus les filtres de rechange. Tubes CO₂, lentilles et miroirs sont des consommables. Un module rotatif est presque obligatoire pour les gobelets et la verrerie. Le logiciel peut ajouter des frais récurrents : certaines marques réservent des fonctions à un abonnement, comme Glowforge Premium, alors que LightBurn est une licence à payer une fois, avec mises à jour payantes facultatives. Renseignez-vous sur l’assurance et les règles locales pour faire tourner un laser chez soi ou dans un local commercial, et gardez un stock de supports vierges : les retards fournisseurs pénalisent souvent plus qu’une machine lente.",
      },
      {
        heading: "Acheter d’occasion pour une activité professionnelle",
        body: "Une machine d’occasion peut diviser par deux l’investissement de départ, mais une panne coûte plus cher quand des commandes attendent. Préférez des modèles très répandus dont les pièces restent disponibles : le Glowforge Pro, le xTool P2 ou le Monport 55W CO₂ sont arrêtés mais largement utilisés. Pour une fibre, vérifiez la marque et la puissance de la source sur son étiquette (JPT, Raycus, MAX), et faites un marquage sur tout le champ pour repérer des coins faibles. Pour un CO₂, partez du principe que le tube devra bientôt être changé. Demandez la facture d’origine pour la garantie et la revente, et assurez-vous que le compte logiciel ou la licence suit la machine.",
      },
    ],
  },

  "enclosed-lasers": {
    en: [
      {
        heading: "Does an enclosed laser mean Class 1 laser safety?",
        body: "Not always. A true Class 1 machine combines a closed cover, a filtered viewing window and an interlock that cuts the beam when the lid opens; the xTool S1 is sold as Class 1, for example. Many enclosed machines are only partly closed, use a tinted window of unknown rating, or are Class 4 lasers inside a box. Budget 40W CO₂ cabinets from OMTech and Monport have lids, but their interlocks and windows are basic. Check the stated laser class, the presence of a lid switch and an emergency stop. A tent around an open frame helps with smoke, but it is not a safety enclosure.",
      },
      {
        heading: "Do enclosed lasers still need ventilation?",
        body: "Yes. The cover keeps smoke inside, but it still has to go somewhere. Most enclosed machines have an exhaust port for a 4-inch duct to a window, which remains the cheapest and most effective setup. Without a window, a dedicated fume purifier costs roughly $300 to $1,000 and needs replacement filters every few weeks to months depending on use, which becomes a running cost. Several brands sell matching purifiers. Cutting thick wood or acrylic clogs filters much faster than light engraving. In a flat, also consider the noise of the exhaust fan, which runs for the whole job.",
      },
      {
        heading: "Enclosed diode or enclosed CO₂: prices and sizes",
        body: "Small enclosed diodes such as the Acmer K1, Creality Falcon A1C or Sculpfun iCube Ultra cost $180 to $500 and engrave objects up to about 150 × 150 mm. Mid-size enclosed diodes with 400 × 300 to 500 × 330 mm areas run $500 to $2,000: Sculpfun E1, Atezr P2, Acmer P3 and WeCreat Vision, with the xTool S1 at the top ($1,000 to $3,050). Compact CO₂ cabinets start at $600 with 40W blue boxes, then $1,650 to $2,550 for the Gweike Cloud and $2,900 to $5,000 for the Atomstack Hurricane or xTool P2S. For acrylic or production cutting, CO₂ is worth the extra; for engraving gifts, an enclosed diode is enough.",
      },
      {
        heading: "Who should choose an enclosed laser?",
        body: "Anyone working indoors with family, children, pets or housemates nearby. An enclosure contains reflections and flare-ups, keeps smoke under control and lets others watch through a rated window without glasses. It also keeps dust off the rails and lowers noise a little. The trade-offs: a smaller work area for the price, a heavier and bulkier machine, and less room for tall objects unless the base plate can be removed for a riser. If you mostly engrave large panels or need a rotary for long items, check the internal height and pass-through options before buying.",
      },
      {
        heading: "What to check on a mid-range enclosed machine",
        body: "A camera for positioning saves a lot of time when the lid is closed and the work is hard to see. Check the internal clearance, and whether a riser or removable base takes thicker objects. Flame detection with automatic stop is useful on long jobs. Make sure the built-in exhaust fan is strong enough for cutting, or plan an inline booster. Look at the software: brand apps are easy, LightBurn gives more control, and cloud-only software stops working without internet and can change its terms. Finally, the viewing window should state its optical density at the laser's wavelength.",
      },
    ],
    fr: [
      {
        heading: "Un laser fermé est-il forcément un laser de classe 1 ?",
        body: "Pas toujours. Une vraie machine de classe 1 combine un capot fermé, une vitre filtrante et une sécurité qui coupe le faisceau à l’ouverture ; le xTool S1, par exemple, est vendu en classe 1. Beaucoup de machines fermées ne le sont qu’en partie, ont une vitre teintée sans indice déclaré, ou sont des lasers de classe 4 placés dans une boîte. Les armoires CO₂ 40W bon marché d’OMTech et Monport ont un capot, mais leurs sécurités et leur vitre restent basiques. Vérifiez la classe laser annoncée, la présence d’un contacteur de capot et d’un arrêt d’urgence. Une tente autour d’un cadre ouvert aide pour la fumée, mais ce n’est pas un caisson de sécurité.",
      },
      {
        heading: "Un laser fermé a-t-il besoin de ventilation ?",
        body: "Oui. Le capot garde la fumée à l’intérieur, mais elle doit bien sortir quelque part. La plupart des machines fermées ont une sortie pour une gaine de 100 mm vers une fenêtre, qui reste la solution la moins chère et la plus efficace. Sans fenêtre, un purificateur de fumées dédié coûte environ 300 à 1 000 $ et demande des filtres de rechange toutes les quelques semaines à quelques mois selon l’usage, ce qui devient un coût récurrent. Plusieurs marques vendent des purificateurs assortis. La découpe de bois épais ou d’acrylique encrasse les filtres bien plus vite qu’une gravure légère. En appartement, pensez aussi au bruit de l’extracteur, qui tourne pendant toute la durée du travail.",
      },
      {
        heading: "Diode fermée ou CO₂ fermé : prix et tailles",
        body: "Les petites diodes fermées comme l’Acmer K1, le Creality Falcon A1C ou le Sculpfun iCube Ultra coûtent 180 à 500 $ et gravent des objets jusqu’à environ 150 × 150 mm. Les diodes fermées intermédiaires, de 400 × 300 à 500 × 330 mm, vont de 500 à 2 000 $ : Sculpfun E1, Atezr P2, Acmer P3 et WeCreat Vision, avec le xTool S1 en haut de gamme (1 000 à 3 050 $). Les armoires CO₂ compactes commencent à 600 $ avec les « boîtes bleues » 40W, puis 1 650 à 2 550 $ pour le Gweike Cloud et 2 900 à 5 000 $ pour l’Atomstack Hurricane ou le xTool P2S. Pour l’acrylique ou la découpe en série, le CO₂ vaut le surcoût ; pour graver des cadeaux, une diode fermée suffit.",
      },
      {
        heading: "À qui s’adresse un laser fermé ?",
        body: "À tous ceux qui travaillent à l’intérieur avec de la famille, des enfants, des animaux ou des colocataires à proximité. Le caisson contient les reflets et les départs de flamme, maîtrise la fumée et permet de regarder sans lunettes à travers une vitre certifiée. Il protège aussi les rails de la poussière et réduit un peu le bruit. Les contreparties : une surface plus petite pour le prix, une machine plus lourde et encombrante, et moins de place pour les objets hauts, sauf si le fond se retire pour une rehausse. Si vous gravez surtout de grands panneaux ou avez besoin d’un module rotatif pour des objets longs, vérifiez la hauteur intérieure et les options traversantes avant d’acheter.",
      },
      {
        heading: "Que vérifier sur une machine fermée de milieu de gamme ?",
        body: "Une caméra de positionnement fait gagner beaucoup de temps quand le capot est fermé et la pièce peu visible. Vérifiez la hauteur utile, et si une rehausse ou un fond amovible accepte des objets plus épais. La détection de flamme avec arrêt automatique est utile sur les longs travaux. Assurez-vous que l’extracteur intégré suffit pour la découpe, ou prévoyez un extracteur en ligne en renfort. Regardez le logiciel : les applis des marques sont simples, LightBurn offre plus de contrôle, et un logiciel uniquement en ligne cesse de fonctionner sans internet et peut changer ses conditions. Enfin, la vitre doit indiquer sa densité optique à la longueur d’onde du laser.",
      },
    ],
  },

  "fiber-lasers": {
    en: [
      {
        heading: "How many watts should a fiber laser have?",
        body: "For marking text, logos and serial numbers on stainless, anodized aluminum and tools, 20W is enough and the cheapest entry point. 30W marks faster and engraves deeper with fewer passes, a sensible middle for jewelry and small production runs. 50 to 60W is where deep engraving, embossing, coin-style relief and cutting thin precious-metal sheet become practical. 100W and above, as on the Monport GT 100W or Gweike G6 Split 100W, targets production deep engraving and faster cutting of thin metal. More power also means more heat in the part, so fine detail needs adjusted settings rather than full power.",
      },
      {
        heading: "Lens, field size and focus on a fiber galvo",
        body: "A galvo fiber marks inside a square field set by its lens: 110 × 110 mm, 150 × 150 mm, 200 × 200 mm or 300 × 300 mm are common. A larger field covers bigger plates but enlarges the spot and lowers energy density, so deep work gets slower. Most buyers are best served by a 110 or 150 mm lens, with a larger one added later if needed. Focus distance must be exact: dual red-dot pointers or a motorized Z axis, as on the Monport GPro Vision, make setup much faster than a hand crank. A camera for alignment is rare on budget units but helpful when marking existing parts.",
      },
      {
        heading: "Fiber laser prices in 2026",
        body: "Compact 20W fibers cost about $900 to $1,600: Atomstack A20 Pro 1064nm, Gweike G2 20W, Sculpfun G20 and Commarker B4. 30W runs $1,600 to $2,700, 50 to 60W Q-switched sources $2,500 to $5,000 (Gweike G2 50W, Monport GT 50W), and 100W $5,000 to $7,000. MOPA versions usually add $1,000 to $2,000 at similar power. All of these are galvo markers with fields of about 220 mm or less. The kilowatt sheet-metal cutters also in our catalog, such as the OMTech FC series from $57,000, are industrial gantry machines that need assist gas, a chiller and a dedicated space.",
      },
      {
        heading: "Fiber laser software and eye safety",
        body: "Most budget fibers ship with EZCAD2 or EZCAD3, which works but is dated and Windows-only. LightBurn supports many galvo controllers through its galvo-capable license, handy if you already use it on another laser. Some brands, such as xTool, provide their own app with presets. On safety, 1064 nm light is invisible and reflects off shiny metal; most desktop fibers are open, so wear OD5+ glasses rated for 1064 nm and consider a shield or enclosure if others share the room. Coated and anodized parts release fumes that need extraction, even when the smoke seems light.",
      },
      {
        heading: "Buying a used fiber laser",
        body: "Fiber sources are rated for very long life, often quoted around 100,000 hours, so a used fiber is a safer bet than a used CO₂. Check the source brand and power on its label (JPT, Raycus, MAX), ask for a test mark across the full field to spot weak corners, and inspect the field lens for scratches or burns. The galvo mirrors should move without noise or jitter. Confirm the controller board is supported by EZCAD or LightBurn, and that any license file or dongle comes with the machine. Ask whether a rotary is included, since buying one later adds a few hundred dollars.",
      },
    ],
    fr: [
      {
        heading: "Quelle puissance choisir pour un laser fibre ?",
        body: "Pour marquer du texte, des logos et des numéros de série sur l’inox, l’aluminium anodisé et les outils, 20W suffisent et constituent l’entrée la moins chère. Un 30W marque plus vite et grave plus profond en moins de passes : un bon compromis pour la bijouterie et les petites séries. À partir de 50 à 60W, la gravure profonde, l’embossage, le relief façon médaille et la découpe de fines feuilles de métal précieux deviennent réalistes. Le 100W et plus, comme sur le Monport GT 100W ou le Gweike G6 Split 100W, vise la gravure profonde en production et la découpe plus rapide du métal fin. Plus de puissance signifie aussi plus de chaleur dans la pièce : le détail fin demande des réglages adaptés plutôt que la pleine puissance.",
      },
      {
        heading: "Lentille, taille de champ et mise au point d’un galvo fibre",
        body: "Un galvo fibre marque à l’intérieur d’un champ carré défini par sa lentille : 110 × 110 mm, 150 × 150 mm, 200 × 200 mm ou 300 × 300 mm sont courants. Un grand champ couvre des plaques plus grandes mais élargit le point et réduit la densité d’énergie, ce qui ralentit la gravure profonde. La plupart des acheteurs sont bien servis par une lentille de 110 ou 150 mm, quitte à en ajouter une plus grande plus tard. La distance de mise au point doit être exacte : un double pointeur rouge ou un axe Z motorisé, comme sur le Monport GPro Vision, accélère beaucoup le réglage par rapport à une manivelle. Une caméra d’alignement est rare en entrée de gamme, mais utile pour marquer des pièces existantes.",
      },
      {
        heading: "Prix des lasers fibre en 2026",
        body: "Les fibres 20W compactes coûtent environ 900 à 1 600 $ : Atomstack A20 Pro 1064nm, Gweike G2 20W, Sculpfun G20 et Commarker B4. Comptez 1 600 à 2 700 $ en 30W, 2 500 à 5 000 $ pour les sources Q-switch de 50 à 60W (Gweike G2 50W, Monport GT 50W), et 5 000 à 7 000 $ en 100W. Les versions MOPA ajoutent en général 1 000 à 2 000 $ à puissance comparable. Ce sont toutes des machines de marquage galvo avec des champs d’environ 220 mm au plus. Les découpeuses de tôle de plusieurs kilowatts aussi présentes dans notre catalogue, comme la série OMTech FC à partir de 57 000 $, sont des machines industrielles à portique qui demandent gaz d’assistance, refroidisseur et local dédié.",
      },
      {
        heading: "Logiciel et protection des yeux sur un laser fibre",
        body: "La plupart des fibres d’entrée de gamme sont livrées avec EZCAD2 ou EZCAD3, fonctionnels mais datés et réservés à Windows. LightBurn prend en charge de nombreux contrôleurs galvo avec sa licence compatible galvo, pratique si vous l’utilisez déjà sur un autre laser. Certaines marques, comme xTool, fournissent leur propre appli avec des préréglages. Côté sécurité, la lumière à 1064 nm est invisible et se réfléchit sur le métal brillant ; la plupart des fibres de bureau sont ouvertes, portez donc des lunettes OD5+ certifiées pour 1064 nm et envisagez un écran ou un caisson si d’autres personnes partagent la pièce. Les pièces revêtues ou anodisées dégagent des fumées à extraire, même quand elles paraissent légères.",
      },
      {
        heading: "Acheter un laser fibre d’occasion",
        body: "Les sources fibre ont une durée de vie très longue, souvent annoncée autour de 100 000 heures : une fibre d’occasion est un pari plus sûr qu’un CO₂ d’occasion. Vérifiez la marque et la puissance de la source sur son étiquette (JPT, Raycus, MAX), demandez un marquage d’essai sur tout le champ pour repérer des coins faibles, et inspectez la lentille de champ à la recherche de rayures ou de brûlures. Les miroirs galvo doivent bouger sans bruit ni tremblement. Assurez-vous que la carte de commande est prise en charge par EZCAD ou LightBurn, et que le fichier de licence ou la clé USB éventuels sont fournis. Demandez si un module rotatif est inclus : l’acheter ensuite ajoute quelques centaines de dollars.",
      },
    ],
  },

  "portable-metal-markers": {
    en: [
      {
        heading: "What counts as a portable metal marking laser?",
        body: "These are compact galvo machines under $4,000 that mark metal with a fiber, infrared or UV source and fit on a desk or in a car: the xTool F1 Ultra, LaserPecker 5, Acmer GE1, Longer Nano Duo AI, or a small 20W desktop fiber. Portable here means light, quick to set up and powered from a normal outlet, rarely battery operated. The marking field is small, roughly 100 × 100 to 220 × 220 mm, which suits tags, rings, knives, pens and phone cases but not large plates. Some models extend the area with a slide or conveyor accessory.",
      },
      {
        heading: "2W infrared, 20W fiber or UV: which source?",
        body: "A 2W infrared module, as on the Acmer GE1 or xTool F1, marks stainless, painted and anodized metal and some plastics, but slowly and only at the surface. A 20W fiber, as on the xTool F1 Ultra or LaserPecker 5, marks in seconds, engraves shallow depth and handles brass, aluminum and titanium better. A UV source marks plastics, glass and ceramics without melting, but it only marks the surface of metal. Hybrids add a blue diode for wood and leather, which a pure fiber handles poorly. If metal is your main job, a 20W fiber is the better use of money; if it is one material among many, a hybrid makes sense.",
      },
      {
        heading: "Portable metal marker prices: what each level buys",
        body: "$800 to $1,300: diode plus 2W infrared hybrids such as the Acmer GE1, good for gifts and pet tags in small numbers. $900 to $1,600: compact 20W fibers like the Atomstack A20 Pro 1064nm, Commarker B4 or Sculpfun G20, usually open, with EZCAD or LightBurn. $1,300 to $2,100: the xTool F2, with a 15W diode and a 5W infrared source. $2,700 to $4,000: dual-source units like the LaserPecker 5 or xTool F1 Ultra, with a 20W fiber, camera and polished app, aimed at market stalls and small shops. Entry UV, such as the Monport UV Pro 6W, also starts just over $3,000.",
      },
      {
        heading: "Using a metal marker at markets and events",
        body: "On-site personalization is a common reason to buy these machines. Look for an enclosed or shielded design, since passers-by will not wear glasses, and fume filtering, because many venues do not allow smoke. Setup speed matters: autofocus or a fixed focus height, and an app with saved templates for names and dates. Bring jigs to place items consistently, plus spare blanks. Check the power available and whether the venue accepts lasers at all; some require enclosed equipment. A 20W fiber marks a stainless pet tag in well under a minute, which keeps a queue moving.",
      },
      {
        heading: "Pitfalls with compact metal markers",
        body: "Small fields catch buyers out: a 110 × 110 mm lens cannot mark a full cutting board, and accessories that extend the field cost extra. Infrared modules are low power: 2W will not deep-engrave anything. Open fibers need 1064 nm glasses, which many buyers forget. Rotary attachments for rings and tumblers are often sold separately, for roughly $150 to $400. Look at the software too: polished apps make design easy but may hide advanced settings, while EZCAD gives full control at the cost of a steep learning curve. Discontinued units like the xTool F1 or LaserPecker LP3 can be good used buys if the app still supports them.",
      },
    ],
    fr: [
      {
        heading: "Qu’appelle-t-on un marqueur laser métal portable ?",
        body: "Ce sont des machines galvo compactes de moins de 4 000 $ qui marquent le métal avec une source fibre, infrarouge ou UV et tiennent sur un bureau ou dans une voiture : le xTool F1 Ultra, le LaserPecker 5, l’Acmer GE1, le Longer Nano Duo AI ou une petite fibre de bureau 20W. Portable signifie ici léger, rapide à installer et branché sur une prise normale, rarement sur batterie. Le champ de marquage est petit, d’environ 100 × 100 à 220 × 220 mm : parfait pour les médailles, bagues, couteaux, stylos et coques de téléphone, pas pour les grandes plaques. Certains modèles étendent la surface avec une glissière ou un convoyeur en option.",
      },
      {
        heading: "Infrarouge 2W, fibre 20W ou UV : quelle source choisir ?",
        body: "Un module infrarouge 2W, comme sur l’Acmer GE1 ou le xTool F1, marque l’inox, le métal peint ou anodisé et certains plastiques, mais lentement et seulement en surface. Une fibre 20W, comme sur le xTool F1 Ultra ou le LaserPecker 5, marque en quelques secondes, grave une faible profondeur et gère mieux le laiton, l’aluminium et le titane. Une source UV marque les plastiques, le verre et la céramique sans les faire fondre, mais ne fait que marquer la surface du métal. Les hybrides ajoutent une diode bleue pour le bois et le cuir, que la fibre seule travaille mal. Si le métal est votre activité principale, la fibre 20W est le meilleur usage de votre argent ; si c’est un matériau parmi d’autres, un hybride se justifie.",
      },
      {
        heading: "Prix des marqueurs métal portables : que gagne-t-on à chaque palier ?",
        body: "De 800 à 1 300 $ : les hybrides diode et infrarouge 2W comme l’Acmer GE1, bien pour des cadeaux et médailles en petite quantité. De 900 à 1 600 $ : les fibres 20W compactes comme l’Atomstack A20 Pro 1064nm, le Commarker B4 ou le Sculpfun G20, en général ouvertes, avec EZCAD ou LightBurn. De 1 300 à 2 100 $ : le xTool F2, avec une diode 15W et une source infrarouge 5W. De 2 700 à 4 000 $ : les machines bi-source comme le LaserPecker 5 ou le xTool F1 Ultra, avec fibre 20W, caméra et appli soignée, pensées pour les marchés et les petites boutiques. L’UV d’entrée de gamme, comme le Monport UV Pro 6W, démarre aussi juste au-dessus de 3 000 $.",
      },
      {
        heading: "Utiliser un marqueur métal sur les marchés et salons",
        body: "La personnalisation sur place est une raison fréquente d’acheter ces machines. Privilégiez un modèle fermé ou protégé par un écran, car les passants ne porteront pas de lunettes, avec filtration des fumées, que beaucoup de lieux interdisent. La rapidité d’installation compte : mise au point automatique ou hauteur fixe, et une appli avec des modèles enregistrés pour les prénoms et les dates. Prévoyez des gabarits pour placer les objets toujours au même endroit, et des supports vierges en réserve. Vérifiez l’alimentation disponible et si le lieu accepte les lasers ; certains exigent un équipement fermé. Une fibre 20W marque une médaille en inox en bien moins d’une minute, ce qui fait avancer la file.",
      },
      {
        heading: "Les pièges des marqueurs métal compacts",
        body: "Les petits champs piègent les acheteurs : une lentille de 110 × 110 mm ne marque pas une planche à découper entière, et les accessoires qui agrandissent le champ coûtent en plus. Les modules infrarouges sont peu puissants : 2W ne gravent rien en profondeur. Une fibre ouverte impose des lunettes pour 1064 nm, que beaucoup oublient. Les modules rotatifs pour bagues et gobelets sont souvent vendus à part, environ 150 à 400 $. Regardez aussi le logiciel : une appli soignée simplifie la conception mais peut masquer les réglages avancés, alors qu’EZCAD donne tout le contrôle au prix d’un long apprentissage. Les modèles arrêtés comme le xTool F1 ou le LaserPecker LP3 peuvent être de bonnes affaires d’occasion si l’appli les prend encore en charge.",
      },
    ],
  },

  "high-power-diodes": {
    en: [
      {
        heading: "How do 40W and higher diode modules work?",
        body: "No single blue diode emits 40W. High-power modules combine several emitters, typically four to eight diodes, through optics into one spot, often marketed as a compressed spot. The combined spot is larger than on a good 10W module, so fine photo engraving is less sharp, although some modules offer a lower-power fine mode. A 40W module cuts 10 mm plywood far faster than a 20W, and the 70W class, as on the Sculpfun S70 Max or Atomstack A70 Max, pushes toward 15 to 20 mm wood in several passes. Heat management inside the module becomes as important as the diodes themselves.",
      },
      {
        heading: "Is a 40W diode laser as good as a CO₂?",
        body: "For wood, close on thickness but not on speed or finish. A 40W diode cuts plywood up to around 10 mm, comparable to an entry 40 to 50W CO₂, but more slowly and with darker, slightly angled edges caused by the beam cone. It still cannot cut clear or blue acrylic. In its favor: no water cooling, no tube to replace, simple repairs and a much lower price, often $400 to $1,100 for an open frame. If you mostly cut wood under 10 mm and want a garage-friendly setup, a high-power diode is a sound choice; for acrylic or volume cutting, CO₂ stays ahead.",
      },
      {
        heading: "Prices of high-power diode lasers in 2026",
        body: "Open-frame 40W machines cost $350 to $1,100: the TwoTrees TTS-55 40W at the low end, the Longer Ray5 40W, Algolaser Alpha MK2 40W and Ortur H10 40W in the middle. Enclosed 40 to 48W models run roughly $1,150 to $3,050, among them the Acmer P3 48W, Ortur H20 40W and xTool S1 40W. Large 48 to 70W frames like the Sculpfun S40 Max, Sculpfun S70 Max and Atomstack A70 Max cost $1,150 to $3,000 with about 830 × 800 mm of work area. The cheapest 40W modules are a gamble: check the brand, the stated spot size and the cooling design before buying.",
      },
      {
        heading: "What you need around a high-power diode laser",
        body: "Air assist becomes essential: a pump of 30 L/min at minimum, or a compressor for deep cuts, to stop flames and keep the lens clean. Smoke volume rises sharply, so plan a real exhaust with an inline fan, or an enclosure with a duct. A honeycomb or blade bed keeps cut parts from burning the table underneath. Fire risk is higher than with a 10W module: never leave a cut running alone, keep an extinguisher close, and prefer a machine with flame detection. Wear glasses rated OD5+ at 450 nm; reflections at this power can injure eyes quickly.",
      },
      {
        heading: "Pitfalls with 40W diode claims",
        body: "Some modules sold as 40W are 40W electrical, delivering 5 to 10W of light; others are genuine 40W optical but with a large spot that cuts less than expected. Look for single-pass cutting results on plywood from independent tests, and for the spot size in millimetres. Heat is another weak point: poorly cooled multi-diode modules can lose power during long jobs. Check the warranty on the module itself, since replacing a 40W head costs a large share of the machine price. Finally, a powerful module on a flimsy frame wastes its potential: look for rigid rails and belts.",
      },
    ],
    fr: [
      {
        heading: "Comment fonctionnent les modules diode de 40W et plus ?",
        body: "Aucune diode bleue n’émet 40W à elle seule. Les modules haute puissance combinent plusieurs émetteurs, généralement quatre à huit diodes, en un seul point grâce à des optiques : c’est le « point compressé » mis en avant par les marques. Ce point combiné est plus large que celui d’un bon module 10W, donc la gravure photo fine est moins nette, même si certains modules proposent un mode fin à puissance réduite. Un module 40W découpe le contreplaqué de 10 mm bien plus vite qu’un 20W, et la classe 70W, comme sur le Sculpfun S70 Max ou l’Atomstack A70 Max, approche 15 à 20 mm de bois en plusieurs passes. La gestion de la chaleur dans le module devient aussi importante que les diodes elles-mêmes.",
      },
      {
        heading: "Une diode 40W vaut-elle un laser CO₂ ?",
        body: "Sur le bois, elle s’en approche en épaisseur, pas en vitesse ni en finition. Une diode 40W découpe le contreplaqué jusqu’à environ 10 mm, comme un CO₂ d’entrée de gamme de 40 à 50W, mais plus lentement et avec des chants plus sombres et légèrement en biais à cause du cône du faisceau. Elle ne découpe toujours pas l’acrylique transparent ou bleu. En sa faveur : pas de refroidissement à eau, pas de tube à remplacer, des réparations simples et un prix bien plus bas, souvent 400 à 1 100 $ en cadre ouvert. Si vous découpez surtout du bois de moins de 10 mm et voulez une installation adaptée au garage, une diode haute puissance est un bon choix ; pour l’acrylique ou la découpe en volume, le CO₂ garde l’avantage.",
      },
      {
        heading: "Prix des lasers diode haute puissance en 2026",
        body: "Les machines 40W à cadre ouvert coûtent 350 à 1 100 $ : la TwoTrees TTS-55 40W en bas de gamme, le Longer Ray5 40W, l’Algolaser Alpha MK2 40W et l’Ortur H10 40W au milieu. Les modèles fermés de 40 à 48W vont d’environ 1 150 à 3 050 $, dont l’Acmer P3 48W, l’Ortur H20 40W et le xTool S1 40W. Les grands cadres de 48 à 70W comme les Sculpfun S40 Max et S70 Max ou l’Atomstack A70 Max coûtent 1 150 à 3 000 $ pour environ 830 × 800 mm de surface. Les modules 40W les moins chers sont un pari : vérifiez la marque, la taille de point annoncée et le refroidissement avant d’acheter.",
      },
      {
        heading: "De quoi s’équiper autour d’une diode haute puissance ?",
        body: "L’assistance d’air devient indispensable : une pompe d’au moins 30 L/min, ou un compresseur pour les découpes profondes, afin d’éviter les flammes et de garder la lentille propre. Le volume de fumée augmente fortement : prévoyez une vraie extraction avec un extracteur en ligne, ou un caisson relié à une gaine. Un plateau nid d’abeille ou à lames évite que les pièces découpées brûlent la table. Le risque d’incendie est plus élevé qu’avec un module 10W : ne laissez jamais une découpe tourner seule, gardez un extincteur à proximité et préférez une machine avec détection de flamme. Portez des lunettes OD5+ à 450 nm ; à cette puissance, un reflet peut blesser l’œil très vite.",
      },
      {
        heading: "Les pièges des diodes annoncées à 40W",
        body: "Certains modules vendus 40W sont des 40W électriques, qui délivrent 5 à 10W de lumière ; d’autres sont de vrais 40W optiques mais avec un point si large qu’ils découpent moins que prévu. Cherchez des résultats de découpe en une passe sur du contreplaqué dans des tests indépendants, et la taille du point en millimètres. La chaleur est l’autre point faible : un module multi-diodes mal refroidi peut perdre de la puissance pendant les longs travaux. Vérifiez la garantie du module lui-même, car remplacer une tête 40W représente une bonne part du prix de la machine. Enfin, un module puissant sur un cadre fragile gâche son potentiel : choisissez des rails et des courroies rigides.",
      },
    ],
  },

  "uv-lasers": {
    en: [
      {
        heading: "What is a UV laser engraver good at?",
        body: "At 355 nm, UV light is absorbed by many materials that infrared and blue light handle badly, and it marks with very little heat, which is why it is called cold marking. It gives crisp marks on plastics such as ABS, polycarbonate and silicone without melting, frosts the surface of glass and crystal, marks ceramics, and engraves paper and leather without burnt edges. Typical uses are electronics labels, lab and medical plastics, glassware personalization and fine jewelry detail. UV is not a tool for cutting wood or acrylic sheet, and on metal it only marks the surface.",
      },
      {
        heading: "Why UV laser watts are not comparable to other lasers",
        body: "A 5W UV source is not weak. Because the light is absorbed so efficiently and the spot is very small, 3 to 6W of UV handles most marking jobs, and 10 to 12W, as on the Sculpfun V12, mostly adds speed and a little depth. Do not compare UV wattage with diode or fiber numbers. What matters more is the quality of the source, its pulse frequency range, its cooling (air or water) and the field size: 150 × 150 mm is common, 200 × 200 mm on the xTool F2 Ultra UV and Sculpfun V12, which also offers a small 70 mm field for fine work.",
      },
      {
        heading: "How much does a UV laser cost?",
        body: "UV is the most expensive desktop source per watt. Discontinued 3W units like the Commarker Omni 1 now sell second-hand; new, it started around $1,500. Current 5 to 6W machines cost $3,200 to $4,300: the Monport UV Pro 6W, Commarker Omni XE and Omni X 6W, Creality Falcon T1 5W UV and xTool F2 Ultra UV. 10 to 12W models, like the Sculpfun V12 at about $5,500 or the 12W Commarker Omni X, run $5,000 to $7,000. A rotary, enclosure or fume extractor adds several hundred dollars on top.",
      },
      {
        heading: "Who should buy a UV laser rather than a fiber?",
        body: "Choose UV if your products are mostly plastic, glass, ceramic or delicate materials: phone cases, electronics labels, cosmetics packaging, wine glasses and acrylic awards. Choose fiber if most of your work is metal: it is cheaper and faster on stainless, aluminum and brass. For a mix, many sellers pair a UV with a diode or fiber machine rather than forcing one source onto everything. Note that 3D images inside a crystal block are made with dedicated subsurface engraving machines, usually green lasers, not with desktop UV galvos, which only mark the surface.",
      },
      {
        heading: "What to check before buying a UV laser",
        body: "UV sources are sensitive to heat and dust: check the cooling design and how long the warranty covers the source itself, not just the frame. Plastics still release fumes when marked, so extraction is required. Glasses must be rated for 355 nm, and an enclosure is safer since the beam is invisible. Ask for sample marks on your exact material, because results on plastics depend on pigments and additives. Software is usually EZCAD or LightBurn's galvo mode, or the brand's own app on xTool. Some models, like the LaserPecker U1 and Monport UV Pro 10W, are announced but not shipping yet.",
      },
    ],
    fr: [
      {
        heading: "À quoi sert un graveur laser UV ?",
        body: "À 355 nm, la lumière UV est absorbée par beaucoup de matériaux que l’infrarouge et la lumière bleue travaillent mal, et elle marque en chauffant très peu : on parle de marquage à froid. Elle donne des marquages nets sur les plastiques comme l’ABS, le polycarbonate ou le silicone sans les faire fondre, dépolit la surface du verre et du cristal, marque la céramique, et grave le papier et le cuir sans bords brûlés. Usages typiques : étiquettes d’électronique, plastiques de laboratoire et médicaux, personnalisation de verrerie, détails fins en bijouterie. L’UV n’est pas fait pour découper le bois ou les plaques d’acrylique, et sur le métal il ne marque que la surface.",
      },
      {
        heading: "Pourquoi les watts d’un laser UV ne se comparent pas aux autres",
        body: "Une source UV de 5W n’est pas faible. Comme la lumière est absorbée très efficacement et que le point est très petit, 3 à 6W d’UV suffisent pour la plupart des marquages, et 10 à 12W, comme sur le Sculpfun V12, apportent surtout de la vitesse et un peu de profondeur. Ne comparez pas les watts UV avec ceux d’une diode ou d’une fibre. Ce qui compte davantage : la qualité de la source, sa plage de fréquence d’impulsion, son refroidissement (air ou eau) et la taille du champ : 150 × 150 mm est courant, 200 × 200 mm sur le xTool F2 Ultra UV et le Sculpfun V12, qui propose aussi un petit champ de 70 mm pour le travail fin.",
      },
      {
        heading: "Combien coûte un laser UV ?",
        body: "L’UV est la source de bureau la plus chère au watt. Les machines 3W arrêtées comme le Commarker Omni 1 se revendent aujourd’hui d’occasion ; neuve, elle démarrait autour de 1 500 $. Les machines actuelles de 5 à 6W coûtent 3 200 à 4 300 $ : Monport UV Pro 6W, Commarker Omni XE et Omni X 6W, Creality Falcon T1 5W UV et xTool F2 Ultra UV. Les modèles de 10 à 12W, comme le Sculpfun V12 à environ 5 500 $ ou le Commarker Omni X 12W, vont de 5 000 à 7 000 $. Un module rotatif, un caisson ou un extracteur de fumées ajoutent plusieurs centaines de dollars.",
      },
      {
        heading: "Qui devrait choisir un laser UV plutôt qu’une fibre ?",
        body: "Choisissez l’UV si vos produits sont surtout en plastique, en verre, en céramique ou dans des matières délicates : coques de téléphone, étiquettes d’électronique, emballages de cosmétiques, verres à vin, trophées en acrylique. Choisissez la fibre si l’essentiel de votre travail porte sur le métal : elle est moins chère et plus rapide sur l’inox, l’aluminium et le laiton. Pour un mélange, beaucoup de vendeurs associent un UV à une diode ou une fibre plutôt que de forcer une seule source sur tout. Les images 3D à l’intérieur d’un bloc de cristal sont réalisées par des machines de gravure interne dédiées, généralement à laser vert, et non par les galvos UV de bureau, qui ne marquent que la surface.",
      },
      {
        heading: "Que vérifier avant d’acheter un laser UV ?",
        body: "Les sources UV sont sensibles à la chaleur et à la poussière : regardez le refroidissement et la durée pendant laquelle la garantie couvre la source elle-même, pas seulement le châssis. Les plastiques dégagent toujours des fumées au marquage, une extraction est donc nécessaire. Les lunettes doivent être certifiées pour 355 nm, et un caisson est plus sûr puisque le faisceau est invisible. Demandez des échantillons sur votre matériau exact, car les résultats sur plastique dépendent des pigments et des additifs. Le logiciel est en général EZCAD ou le mode galvo de LightBurn, ou l’appli de la marque chez xTool. Certains modèles, comme le LaserPecker U1 et le Monport UV Pro 10W, sont annoncés mais pas encore livrés.",
      },
    ],
  },

  "mopa-fiber": {
    en: [
      {
        heading: "What does a MOPA fiber laser add over a standard fiber?",
        body: "A MOPA (master oscillator power amplifier) source lets you set the pulse width, typically from a few nanoseconds to a few hundred, independently of the pulse frequency. A standard Q-switched fiber has a fixed pulse width. That control enables color marking on stainless steel and titanium, deep black marks on anodized aluminum where a Q-switch gives gray or white, cleaner marks on plastics with less melting, and smooth annealing marks on stainless. For plain text and logos on metal, a Q-switched fiber gives the same result for less money.",
      },
      {
        heading: "How many watts for a MOPA laser?",
        body: "A 30W MOPA, like the Commarker B6 MOPA, is enough for color marking, black on aluminum and jewelry work. 60W, as on the Creality Falcon T1 60W MOPA, Monport GPro Vision 60W or xTool F2 Ultra, adds speed and makes deep engraving more practical. 100W and 200W sources, on the Monport GA 100W or GPro Vision 200W, target production and deep relief. Color marking itself depends on low energy and precise settings rather than raw power, so a 30 to 60W unit covers most small-business needs.",
      },
      {
        heading: "MOPA fiber laser prices in 2026",
        body: "30W MOPA machines start around $3,100 for the Commarker B6 MOPA, up to about $4,000 with accessories. 60W units cost $4,300 to $5,500: the Creality Falcon T1 60W MOPA at $4,299, the Monport GPro Vision 60W, and the xTool F2 Ultra, which pairs a 60W MOPA with a 40W diode from $4,299. 100W MOPA runs $5,000 to $7,100, and 200W about $8,600 to $8,800. At equal power, the gap with a Q-switched fiber is typically $1,000 to $2,000, which is only worth paying if you will use color, black on aluminum or plastics.",
      },
      {
        heading: "Color marking on stainless steel: what to expect",
        body: "Colors on stainless steel come from oxide layers of different thickness, controlled by pulse width, frequency, speed and line spacing. Results depend on the alloy, the surface finish and even the part's temperature, so expect hours of testing and keep a library of saved settings. Colors are not possible on aluminum, brass or copper; on anodized aluminum a MOPA gives black and grays instead. Color marks resist abrasion less than a deep engraving and can locally reduce the corrosion resistance of stainless, so they suit decorative items better than tools used outdoors.",
      },
      {
        heading: "Pitfalls when buying a MOPA fiber laser",
        body: "Some listings put MOPA in the title for a Q-switched source, or describe it as 'MOPA-like', without an adjustable pulse width. Check the source model (the JPT M7 series is a common reference) and the pulse width range in the specifications. Make sure the software actually exposes pulse width, since some simplified apps hide it. For color work, a smaller field lens usually gives more consistent results. A rotary and a motorized Z axis make jewelry and tumbler work easier. Used MOPAs are less common and hold their value; check the hours and test color on a sample plate before buying.",
      },
    ],
    fr: [
      {
        heading: "Qu’apporte un laser fibre MOPA par rapport à une fibre classique ?",
        body: "Une source MOPA (oscillateur maître et amplificateur de puissance) permet de régler la largeur d’impulsion, en général de quelques nanosecondes à quelques centaines, indépendamment de la fréquence. Une fibre Q-switch classique a une largeur d’impulsion fixe. Ce réglage ouvre le marquage couleur sur l’inox et le titane, le noir profond sur l’aluminium anodisé là où un Q-switch donne du gris ou du blanc, des marquages plus propres sur les plastiques avec moins de fusion, et des marquages par recuit bien lisses sur l’inox. Pour du texte et des logos simples sur métal, une fibre Q-switch donne le même résultat pour moins cher.",
      },
      {
        heading: "Quelle puissance pour un laser MOPA ?",
        body: "Une MOPA 30W, comme le Commarker B6 MOPA, suffit pour le marquage couleur, le noir sur aluminium et la bijouterie. Le 60W, comme sur le Creality Falcon T1 60W MOPA, le Monport GPro Vision 60W ou le xTool F2 Ultra, apporte de la vitesse et rend la gravure profonde plus praticable. Les sources de 100W et 200W, sur le Monport GA 100W ou le GPro Vision 200W, visent la production et le relief profond. Le marquage couleur repose sur une faible énergie et des réglages précis plutôt que sur la puissance brute : une machine de 30 à 60W couvre la plupart des besoins d’une petite entreprise.",
      },
      {
        heading: "Prix des lasers fibre MOPA en 2026",
        body: "Les machines MOPA 30W démarrent vers 3 100 $ avec le Commarker B6 MOPA, jusqu’à environ 4 000 $ avec accessoires. Les 60W coûtent 4 300 à 5 500 $ : le Creality Falcon T1 60W MOPA à 4 299 $, le Monport GPro Vision 60W, et le xTool F2 Ultra, qui associe une MOPA 60W à une diode 40W dès 4 299 $. Comptez 5 000 à 7 100 $ en 100W, et environ 8 600 à 8 800 $ en 200W. À puissance égale, l’écart avec une fibre Q-switch tourne autour de 1 000 à 2 000 $, ce qui ne vaut la peine que si vous utiliserez la couleur, le noir sur aluminium ou les plastiques.",
      },
      {
        heading: "Le marquage couleur sur l’inox : à quoi s’attendre ?",
        body: "Les couleurs sur l’inox viennent de couches d’oxyde d’épaisseurs différentes, pilotées par la largeur d’impulsion, la fréquence, la vitesse et l’écart entre les lignes. Le résultat dépend de l’alliage, de l’état de surface et même de la température de la pièce : prévoyez des heures d’essais et gardez une bibliothèque de réglages. La couleur est impossible sur l’aluminium, le laiton ou le cuivre ; sur l’aluminium anodisé, la MOPA donne du noir et des gris. Les marquages couleur résistent moins à l’abrasion qu’une gravure profonde et peuvent réduire localement la résistance à la corrosion de l’inox : ils conviennent mieux aux objets décoratifs qu’aux outils utilisés dehors.",
      },
      {
        heading: "Les pièges à l’achat d’un laser fibre MOPA",
        body: "Certaines annonces mettent MOPA dans le titre pour une source Q-switch, ou parlent de rendu « type MOPA », sans largeur d’impulsion réglable. Vérifiez le modèle de la source (la série JPT M7 est une référence courante) et la plage de largeur d’impulsion dans la fiche technique. Assurez-vous que le logiciel donne réellement accès à ce réglage, certaines applis simplifiées le masquent. Pour la couleur, une lentille à petit champ donne en général des résultats plus réguliers. Un module rotatif et un axe Z motorisé facilitent le travail des bijoux et des gobelets. Les MOPA d’occasion sont plus rares et gardent leur valeur : vérifiez les heures et testez la couleur sur une plaque d’essai avant d’acheter.",
      },
    ],
  },
};
