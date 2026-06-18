import type { CharacterSheet } from "../../models/character.interface";

export type PartialSheet = Partial<CharacterSheet>

type Action =
    | { type: 'SET_BASIC_INFO', payload: Pick<CharacterSheet, 'name' | 'race'> }
    | { type: 'APPLY_CLASS_PRESET', payload: Pick<CharacterSheet, 'class'> }
    | { type: 'SET_STATS', payload: Pick<CharacterSheet, 'stats'> }
    | { type: 'SET_ABILITIES', payload: Pick<CharacterSheet, 'abilities'> }
    | { type: 'SET_PROFICIENCIES', payload: Pick<CharacterSheet, 'proficiencies'> }

export function characterReducer(state: PartialSheet, action: Action) {
    switch (action.type) {
        case 'SET_BASIC_INFO': return { ...state, ...action.payload }
        case 'APPLY_CLASS_PRESET': return { ...state, ...action.payload }
        case 'SET_STATS': return { ...state, ...action.payload }
        case 'SET_ABILITIES': return { ...state, ...action.payload }
        case 'SET_PROFICIENCIES': return { ...state, ...action.payload }
    }
}