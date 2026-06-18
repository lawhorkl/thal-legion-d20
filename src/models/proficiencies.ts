import type { Proficiency } from './character.interface';

export const ALL_PROFICIENCIES: Proficiency[] = [
    { name: 'Arcana',        description: 'Knowledge of magic, rituals, and planes of existence.' },
    { name: 'Craft',         description: 'Knowledge of a chosen specialization, methodology, and creation.' },
    { name: 'Deception',     description: 'The ability to lie, bluff, or mislead others.' },
    { name: 'Engineering',   description: 'Knowledge of crafting, construction, and mechanical design.' },
    { name: 'Insight',       description: 'The ability to read people, detect lies, and gauge motives.' },
    { name: 'Intimidation',  description: 'The ability to influence others through fear or force of presence.' },
    { name: 'Investigation', description: 'Searching for specific clues, details, or patterns through reasoning or observation.' },
    { name: 'Medicine',      description: 'Knowledge of anatomy, treatment, and healing practices.' },
    { name: 'Nature',        description: 'Understanding of flora, fauna, ecosystems, and natural phenomena.' },
    { name: 'Occult',        description: 'Knowledge of forbidden lore, spirits, and esoteric practices.' },
    { name: 'Perception',    description: 'Awareness of surroundings; noticing hidden details, sounds, or movement.' },
    { name: 'Performance',   description: 'The ability to sing, dance, recite poetry, or otherwise captivate an audience.' },
    { name: 'Persuasion',    description: 'The ability to convince, charm, or negotiate.' },
    { name: 'Stealth',       description: 'The ability to move silently and avoid detection.' },
    { name: 'Survival',      description: 'Tracking, foraging, and enduring the wilderness.' },
    { name: 'Thievery',      description: 'Sleight of hand, pickpocketing, and disabling locks or traps.' },
];
