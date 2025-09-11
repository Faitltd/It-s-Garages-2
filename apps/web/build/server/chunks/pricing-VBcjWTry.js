const matrix_version = "2025-09-01";
const base = {
  "install-door": {
    single: {
      "steel-non-insulated": 9e4,
      "steel-insulated-r8": 12e4
    },
    double: {
      "steel-non-insulated": 14e4,
      "steel-insulated-r8": 18e4
    }
  },
  "install-opener": {
    chain: 35e3,
    "belt-quiet": 55e3
  },
  repair: {
    springsPair: 28e3,
    rollersSet: 12e3,
    haulAway: 5e3
  },
  maintenance: {
    base: 9900
  }
};
const addons = {
  windows: 2e4,
  smartAddon: 15e3,
  keypad: 8e3
};
const matrix = {
  matrix_version,
  base,
  addons
};
const urgency = {
  standard: 1,
  same_day: 1.25,
  after_hours: 1.5
};
const difficulty = {
  none: 1,
  low_headroom: 1.1,
  tight_space: 1.2
};
const tiers = {
  good: 1,
  better: 1.1,
  best: 1.25
};
const modifiers = {
  urgency,
  difficulty,
  tiers
};
function calcTotal(input) {
  let total = 0;
  const qty = input.qty || 1;
  switch (input.jobType) {
    case "install-door": {
      const size = input.door?.size || "single";
      const build = input.door?.build || "steel-non-insulated";
      total += matrix.base["install-door"][size][build] || 0;
      if (input.door?.windows) total += matrix.addons.windows;
      break;
    }
    case "install-opener": {
      const type = input.opener?.type || "chain";
      total += matrix.base["install-opener"][type] || 0;
      if (input.opener?.smartAddon) total += matrix.addons.smartAddon;
      if (input.opener?.keypad) total += matrix.addons.keypad;
      break;
    }
    case "repair": {
      const hw = input.hardware || {};
      if (hw.springsPair) total += matrix.base.repair.springsPair;
      if (hw.rollersSet) total += matrix.base.repair.rollersSet;
      if (hw.haulAway) total += matrix.base.repair.haulAway;
      break;
    }
    case "maintenance": {
      total += matrix.base.maintenance.base;
      break;
    }
  }
  const urgency2 = modifiers.urgency[input.urgency || "standard"] || 1;
  const difficulty2 = modifiers.difficulty[input.difficulty || "none"] || 1;
  total = Math.round(total * qty * urgency2 * difficulty2);
  return total;
}
function buildTiers(base2) {
  return [
    { name: "Good", factor: modifiers.tiers.good },
    { name: "Better", factor: modifiers.tiers.better },
    { name: "Best", factor: modifiers.tiers.best }
  ].map((t) => ({ name: t.name, total: Math.round(base2 * t.factor) }));
}
const pricingVersion = matrix.matrix_version;

export { buildTiers as b, calcTotal as c, pricingVersion as p };
//# sourceMappingURL=pricing-VBcjWTry.js.map
