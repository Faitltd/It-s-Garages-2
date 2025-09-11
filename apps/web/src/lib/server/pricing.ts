import matrix from '$lib/price/matrix.json';
import modifiers from '$lib/price/modifiers.json';

export function calcTotal(input: any) {
  let total = 0;
  const qty = input.qty || 1;
  switch (input.jobType) {
    case 'install-door': {
      const size = input.door?.size || 'single';
      const build = input.door?.build || 'steel-non-insulated';
      total += matrix.base['install-door'][size][build] || 0;
      if (input.door?.windows) total += matrix.addons.windows;
      break;
    }
    case 'install-opener': {
      const type = input.opener?.type || 'chain';
      total += matrix.base['install-opener'][type] || 0;
      if (input.opener?.smartAddon) total += matrix.addons.smartAddon;
      if (input.opener?.keypad) total += matrix.addons.keypad;
      break;
    }
    case 'repair': {
      const hw = input.hardware || {};
      if (hw.springsPair) total += matrix.base.repair.springsPair;
      if (hw.rollersSet) total += matrix.base.repair.rollersSet;
      if (hw.haulAway) total += matrix.base.repair.haulAway;
      break;
    }
    case 'maintenance': {
      total += matrix.base.maintenance.base;
      break;
    }
  }
  const urgency = modifiers.urgency[input.urgency || 'standard'] || 1;
  const difficulty = modifiers.difficulty[input.difficulty || 'none'] || 1;
  total = Math.round(total * qty * urgency * difficulty);
  return total;
}

export function buildTiers(base: number) {
  return [
    { name: 'Good', factor: modifiers.tiers.good },
    { name: 'Better', factor: modifiers.tiers.better },
    { name: 'Best', factor: modifiers.tiers.best }
  ].map(t => ({ name: t.name, total: Math.round(base * t.factor) }));
}

export const pricingVersion = matrix.matrix_version;

