export interface CharacterSheet {
    name: string;
    race: string;
    class: Class;
    stats: Stats;
    charProperties: CharProperties;
    hp: number;
    bonus?: Record<string, number>;
    equipments: Equipment[];
    signet: boolean;
    gold: number;
    consumables: Consumable[]
    abilities: Ability[]
    proficiencies?: Proficiency[]
}

export interface Equipment {
    rarity: 'Legendary' | 'Rare' | 'Uncommon' | 'Common',
    /**
     * The equipment rarity determines its bonuses
     * Legendary: +2 to chosenStat, +2 hp
     * Rare: +1 to chosenStat, +2 hp
     * Uncommon: +1 to chosenStat, +1 hp
     * Common: +0 to chosenStat, +1 hp
     * */ 
    name: string,
    chosenStat: keyof Stats
}

export interface Consumable {
    name: string;
    effect: string;
}

export interface Proficiency {
    name: string;
    description: string;
}

export interface Ability {
    name: string;
    abilityBonus: Partial<CharProperties>
}

export interface Stats {
    stamina: number; // +2 to HP
    combat: number; // +1 Dmg Done
    pockets: number; // +1 to Inventory Slots
    reflexes: number; // +1 Environmental Rolls
    healer: number; // +1 to Healing Done
    stealth: number; // +1 to Stealth Rolls
    highRoller: number; // Rolls above 20 increase outgoing DMG/Healing by +1
}

export const STAT_LABELS: Record<keyof Stats, string> = {
    stamina:    'Stamina',
    combat:     'Combat Proficiency',
    pockets:    'Extra Pockets',
    reflexes:   'Swift Reflexes',
    healer:     'Healer',
    stealth:    'Stealth',
    highRoller: 'High Roller',
}

export interface Class {
    name: string
    role: Role
}

export interface Role {
    roleName: string;
    roleBonus: Partial<CharProperties>
}

export interface CharProperties {
    dmgTaken: number;
    dmgDone: number;
    healingDone: number;
    invSlots: number;
    combatRolls: number;
    envRolls: number;
    stealth: number;
    hp: number;
    bonus?: string[]
}

export const CHAR_PROPERTY_LABELS: Partial<Record<keyof CharProperties, string>> = {
    hp:          'HP',
    dmgDone:     'Damage Done',
    dmgTaken:    'Damage Taken',
    healingDone: 'Healing Done',
    invSlots:    'Inventory Slots',
    combatRolls: 'Combat Rolls',
    envRolls:    'Environment Rolls',
    stealth:     'Stealth',
}