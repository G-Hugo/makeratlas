/** French material labels for overlays and runtime localization. */
const MATERIAL_PHRASES: Array<[RegExp, string]> = [
  [/\bThin fabric\b/gi, "Tissu fin"],
  [/\bThick plywood\b/gi, "Contreplaqué épais"],
  [/\bBasswood\b/gi, "Tilleul"],
  [/\bPlywood\b/gi, "Contreplaqué"],
  [/\bCardboard\b/gi, "Carton"],
  [/\bLeather\b/gi, "Cuir"],
  [/\bSlate\b/gi, "Ardoise"],
  [/\bWood\b/gi, "Bois"],
  [/\bPaper\b/gi, "Papier"],
  [/\bFabric\b/gi, "Tissu"],
  [/\bAcrylic\b/gi, "Acrylique"],
  [/\bStainless steel\b/gi, "Inox"],
  [/\bStainless\b/gi, "Inox"],
  [/\bAluminum anodized\b/gi, "Aluminium anodisé"],
  [/\bAluminum\b/gi, "Aluminium"],
  [/\bAnodized aluminum\b/gi, "Aluminium anodisé"],
  [/\bCoated metal\b/gi, "Métal avec spray"],
  [/\bBare metal\b/gi, "Métal nu"],
  [/\bCast acrylic\b/gi, "Acrylique coulé"],
  [/\bClear acrylic\b/gi, "Acrylique transparent"],
  [/\bDark acrylic\b/gi, "Acrylique foncé"],
  [/\bRubber\b/gi, "Caoutchouc"],
  [/\bGlass\b/gi, "Verre"],
  [/\bPlastic\b/gi, "Plastique"],
  [/\bCeramic\b/gi, "Céramique"],
];

export function translateMaterialLine(line: string): string {
  let out = line.trim();
  if (!out) return out;
  for (const [pattern, replacement] of MATERIAL_PHRASES) {
    out = out.replace(pattern, replacement);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

export function translateMaterialList(items: string[] | undefined): string[] | undefined {
  if (!items?.length) return items;
  return items.map(translateMaterialLine);
}
