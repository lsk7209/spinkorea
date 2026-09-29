/**
 * Known /spinflow/:slug preset aliases (SPK2-05).
 * Any other slug is a real 404 both on Vercel (rewrite allowlist in
 * vercel.json) and inside the SPA router. Keep the two lists in sync;
 * tests/spinflow-presets.test.mjs enforces it.
 */
export const SPINFLOW_PRESET_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  lunch: 'lunch-korean',
  'truth-or-dare': 'truth-dare',
  lotto: 'lotto',
});

export function getPresetIdForSlug(slug: string | undefined): string | undefined {
  if (!slug || !Object.prototype.hasOwnProperty.call(SPINFLOW_PRESET_ALIASES, slug)) return undefined;
  return SPINFLOW_PRESET_ALIASES[slug];
}
