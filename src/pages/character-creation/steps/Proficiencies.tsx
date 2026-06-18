import { useState } from "react"
import type { CharacterSheet, Proficiency } from "../../../models/character.interface"
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ALL_PROFICIENCIES } from "@/models/proficiencies"

const MAX_PICKS = 4

interface ProficienciesProps {
    onNext: (data: Pick<CharacterSheet, 'proficiencies'>) => void
}

export function Proficiencies({ onNext }: ProficienciesProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [craftSpec, setCraftSpec] = useState('')

    const toggle = (name: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(name)) {
                next.delete(name)
            } else if (next.size < MAX_PICKS) {
                next.add(name)
            }
            return next
        })
    }

    const handleNext = () => {
        const proficiencies: Proficiency[] = ALL_PROFICIENCIES
            .filter(p => selected.has(p.name))
            .map(p => p.name === 'Craft' && craftSpec.trim()
                ? { ...p, name: `Craft: ${craftSpec.trim()}` }
                : p
            )
        onNext({ proficiencies })
    }

    return (
        <FieldSet className="w-full">
            <FieldLegend>Non-Combat Proficiencies</FieldLegend>

            <p className="text-sm text-muted-foreground">
                Pick up to <span className="font-semibold text-foreground">{MAX_PICKS}</span> proficiencies.{" "}
                <span className="font-semibold text-foreground">{selected.size}/{MAX_PICKS}</span> selected.
            </p>

            <p className="text-xs text-muted-foreground">
                Proficiency bonus: Easy +2 · Moderate +4 · Hard +6.{" "}
                When two characters share a proficiency, one rolls with{" "}
                <span className="font-medium text-foreground">Advantage</span> (roll twice, take higher).
            </p>

            <FieldGroup>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ALL_PROFICIENCIES.map(prof => {
                        const isSelected = selected.has(prof.name)
                        const isDisabled = !isSelected && selected.size >= MAX_PICKS
                        return (
                            <div key={prof.name} className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => toggle(prof.name)}
                                    className={`rounded-md border p-3 text-left transition-colors ${
                                        isSelected
                                            ? 'border-primary bg-primary/10'
                                            : isDisabled
                                            ? 'cursor-not-allowed border-border opacity-40'
                                            : 'border-border hover:border-primary/50 hover:bg-muted'
                                    }`}
                                >
                                    <p className="text-sm font-medium">{prof.name}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{prof.description}</p>
                                </button>
                                {isSelected && prof.name === 'Craft' && (
                                    <Input
                                        placeholder="Specialization (e.g. Blacksmithing)"
                                        value={craftSpec}
                                        onChange={e => setCraftSpec(e.target.value)}
                                        className="h-7 text-sm"
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </FieldGroup>

            <FieldGroup>
                <Button
                    size="lg"
                    disabled={selected.size === 0}
                    onClick={handleNext}
                >
                    Next Step
                </Button>
            </FieldGroup>
        </FieldSet>
    )
}
