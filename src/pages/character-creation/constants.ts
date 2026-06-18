import { CHAR_PROPERTY_LABELS, STAT_LABELS, type CharProperties, type Stats } from "../../models/character.interface"

export const STEPS = [
    { key: 'basic',         label: 'Basic Info' },
    { key: 'class',         label: 'Class' },
    { key: 'stats',         label: 'Stats' },
    { key: 'abilities',     label: 'Abilities' },
    { key: 'proficiencies', label: 'Proficiencies' },
    { key: 'review',        label: 'Review' },
]

export const STAT_KEYS = Object.keys(STAT_LABELS) as (keyof Stats)[]

export const CHAR_PROPERTY_KEYS = Object.keys(CHAR_PROPERTY_LABELS) as (keyof CharProperties)[]

export {CHAR_PROPERTY_LABELS, STAT_LABELS}