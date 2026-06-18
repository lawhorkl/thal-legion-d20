import type { Ability } from './character.interface'

export const Overpower: Ability = {
  name: 'Overpower',
  abilityBonus: {
    bonus: ['Ignore your roll, deal 10 DMG to a target, and take 3 DMG. (2 Charges)'],
  },
}

export const Counter: Ability = {
  name: 'Counter',
  abilityBonus: {
    bonus: ['Ignore your roll and deal the incoming DMG back to the attacker. (2 Charges)'],
  },
}

export const Agile: Ability = {
  name: 'Agile',
  abilityBonus: {
    bonus: [
      'Double the value of Swift Reflexes Stat. (Passive)',
      'Avoid an incoming environmental attack. (1 Charge)',
    ],
  },
}

export const Precision: Ability = {
  name: 'Precision',
  abilityBonus: {
    combatRolls: 1,
  },
}

export const ImprovedIntervene: Ability = {
  name: 'Improved Intervene',
  abilityBonus: {
    bonus: ['Take Half-DMG when intervening for an ally. Roll 18+ negates all DMG. (Passive)'],
  },
}

export const Rugged: Ability = {
  name: 'Rugged',
  abilityBonus: {
    hp: 2,
    dmgTaken: -1,
  },
}

export const MastersCall: Ability = {
  name: "Master's Call",
  abilityBonus: {
    bonus: ['Command your pet/mount to your side, taking a blow for you. (2 Charges)'],
  },
}

export const AnkleBite: Ability = {
  name: 'Ankle Bite',
  abilityBonus: {
    bonus: [
      'Order your pet/mount to bite the ankle of your opponent, stunning them for one turn. Stunned enemies deal no damage. (2 Charges)',
    ],
  },
}

export const Assassination: Ability = {
  name: 'Assassination',
  abilityBonus: {
    bonus: [
      'Successful Stealth Rolls against an undamaged opponent receive +5 to DMG done. (Passive)',
    ],
  },
}

export const Mounted: Ability = {
  name: 'Mounted',
  abilityBonus: {
    hp: 3,
    dmgDone: 2,
    healingDone: 2,
    envRolls: -3,
    bonus: ['All bonuses apply only while mounted.'],
  },
}

export const BrutalStrikes: Ability = {
  name: 'Brutal Strikes',
  abilityBonus: {
    bonus: [
      'When a combat roll after modifiers results in 16+, deal 2 additional damage. (Passive)',
    ],
  },
}

export const TacticalMind: Ability = {
  name: 'Tactical Mind',
  abilityBonus: {
    bonus: [
      "Replace your roll before or after rolling, increasing an ally's current or next roll by +6. (3 Charges)",
    ],
  },
}

export const Medic: Ability = {
  name: 'Medic',
  abilityBonus: {
    bonus: [
      'Double the value of Healer Stat. (Passive)',
      "+5 healing against KO'd allies. (Passive)",
    ],
  },
}

export const ShadowsGambit: Ability = {
  name: "Shadow's Gambit",
  abilityBonus: {
    bonus: ['Reroll a Stealth Attack. (2 Charges)'],
  },
}

export const DesperateMeasures: Ability = {
  name: 'Desperate Measures',
  abilityBonus: {
    bonus: [
      'For each injured ally, heal 5 points of damage, distributed as you see fit. Does not interact with other abilities or modifiers. (1 Charge)',
    ],
  },
}

export const ThalassianFortitude: Ability = {
  name: 'Thalassian Fortitude',
  abilityBonus: {
    bonus: [
      'After failing a combat/environmental roll, add +2 to your next roll. Stacks until you have a successful roll. (Passive)',
    ],
  },
}

export const Onslaught: Ability = {
  name: 'Onslaught',
  abilityBonus: {
    bonus: [
      'Each successful combat roll deals 1 additional damage, stacking until you fail. (Passive)',
    ],
  },
}

export const VampiricVitality: Ability = {
  name: 'Vampiric Vitality',
  abilityBonus: {
    bonus: ['You heal for equal to half the damage you have dealt this turn. (2 Charges)'],
  },
}

export const VengefulBloodlust: Ability = {
  name: 'Vengeful Bloodlust',
  abilityBonus: {
    bonus: [
      'Each round you are damaged, gain +1 to either your next successful heal or damage dealt. (Passive)',
    ],
  },
}

export const CripplingDefense: Ability = {
  name: 'Crippling Defense',
  abilityBonus: {
    bonus: ['Deal all damage taken in the last three turns back as damage. (1 Charge)'],
  },
}

export const Recklessness: Ability = {
  name: 'Recklessness',
  abilityBonus: {
    bonus: ['Roll for combat again, attacking two separate times. (2 Charges)'],
  },
}

export const Triage: Ability = {
  name: 'Triage',
  abilityBonus: {
    bonus: ['Mirror the healing done to one character to another character. (2 Charges)'],
  },
}

export const BloodyInfusion: Ability = {
  name: 'Bloody Infusion',
  abilityBonus: {
    bonus: ['Roll a 1d10, sacrificing that much HP to heal another player. (2 Charges)'],
  },
}

export const EternalCharge: Ability = {
  name: 'Eternal Charge',
  abilityBonus: {
    bonus: [
      'Ignore the first time you are reduced to 0 HP, continuing to fight until you are harmed again. (Passive)',
    ],
  },
}

export const MedicinalEnhancement: Ability = {
  name: 'Medicinal Enhancement',
  abilityBonus: {
    bonus: ['Players you heal are given +1 to their next roll. (Passive)'],
  },
}
