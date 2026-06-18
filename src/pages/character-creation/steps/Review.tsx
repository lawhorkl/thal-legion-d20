import { useState } from "react"
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { buildSheet } from "../buildSheet"
import type { PartialSheet } from "../reducer"
import { STAT_LABELS, STAT_KEYS, CHAR_PROPERTY_LABELS, CHAR_PROPERTY_KEYS } from "../constants"
import { useCharacters } from "@/hooks/useCharacters"

interface ReviewProps {
    sheet: PartialSheet
    onFinish: () => void
}

function formatVal(val: number) {
    return val > 0 ? `+${val}` : `${val}`
}

function buildTextExport(sheet: PartialSheet, charProperties: ReturnType<typeof buildSheet>['charProperties'], hp: number): string {
    const lines: string[] = []

    lines.push('=== CHARACTER SHEET ===')
    lines.push(`Name:  ${sheet.name ?? '—'}`)
    lines.push(`Race:  ${sheet.race ?? '—'}`)
    lines.push(`Class: ${sheet.class?.name ?? '—'} (${sheet.class?.role?.roleName ?? '—'})`)
    lines.push(`HP:    ${hp}`)

    if (sheet.stats) {
        lines.push('\nSTATS')
        for (const key of STAT_KEYS) {
            const v = sheet.stats[key]
            if (v > 0) lines.push(`  ${STAT_LABELS[key]}: ${v}`)
        }
    }

    const propLines = CHAR_PROPERTY_KEYS
        .map(k => ({ label: CHAR_PROPERTY_LABELS[k]!, val: charProperties[k] as number }))
        .filter(({ val }) => val !== 0)
    if (propLines.length > 0) {
        lines.push('\nPROPERTIES')
        for (const { label, val } of propLines) lines.push(`  ${label}: ${formatVal(val)}`)
    }

    if (charProperties.bonus?.length) {
        lines.push('\nPASSIVES')
        for (const b of charProperties.bonus) lines.push(`  - ${b}`)
    }

    if (sheet.abilities?.length) {
        lines.push('\nABILITIES')
        for (const a of sheet.abilities) lines.push(`  - ${a.name}`)
    }

    if (sheet.proficiencies?.length) {
        lines.push('\nPROFICIENCIES')
        for (const p of sheet.proficiencies) lines.push(`  - ${p.name}`)
    }

    return lines.join('\n')
}

export function Review(props: ReviewProps) {
    const { charProperties, hp } = buildSheet(props.sheet)
    const { sheet } = props

    const { addCharacter } = useCharacters()
    const [modal, setModal] = useState<{ title: string; content: string } | null>(null)
    const [savedMsg, setSavedMsg] = useState(false)

    const openText = () => setModal({ title: 'Export as Text', content: buildTextExport(sheet, charProperties, hp) })
    const openJson = () => setModal({ title: 'Export as JSON', content: JSON.stringify({ sheet, charProperties, hp }, null, 2) })
    const saveLocal = () => {
        addCharacter({ sheet, charProperties, hp })
        setSavedMsg(true)
        setTimeout(() => { setSavedMsg(false); props.onFinish() }, 1500)
    }

    return (
        <>
            <Dialog open={modal !== null} onOpenChange={open => { if (!open) setModal(null) }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{modal?.title}</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        readOnly
                        rows={16}
                        value={modal?.content ?? ''}
                        className="resize-none font-mono text-xs"
                        onFocus={e => e.target.select()}
                    />
                    <p className="text-xs text-muted-foreground">Click the text area to select all.</p>
                </DialogContent>
            </Dialog>

            <FieldSet className="w-full max-w-lg">
                <FieldLegend>Character Summary</FieldLegend>

                <FieldGroup>
                    {/* Identity */}
                    <section className="space-y-1">
                        <h3 className="text-base font-semibold">{sheet.name}</h3>
                        <p className="text-sm text-muted-foreground">{sheet.race} &mdash; {sheet.class?.name} ({sheet.class?.role?.roleName})</p>
                    </section>

                    {/* HP */}
                    <section className="flex items-center gap-3">
                        <span className="text-sm font-medium">HP</span>
                        <span className="text-lg font-bold">{hp}</span>
                    </section>

                    {/* Stats */}
                    {sheet.stats && (
                        <section className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stats</p>
                            {STAT_KEYS.filter(k => sheet.stats![k] > 0).map(key => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span>{STAT_LABELS[key]}</span>
                                    <span className="font-medium">{sheet.stats![key]}</span>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Properties */}
                    <section className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Properties</p>
                        {CHAR_PROPERTY_KEYS.map(key => {
                            const val = charProperties[key] as number
                            if (val === 0) return null
                            return (
                                <div key={key} className="flex justify-between text-sm">
                                    <span>{CHAR_PROPERTY_LABELS[key]}</span>
                                    <span className="font-medium">{formatVal(val)}</span>
                                </div>
                            )
                        })}
                    </section>

                    {/* Passives */}
                    {(charProperties.bonus?.length ?? 0) > 0 && (
                        <section className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Passives & Abilities</p>
                            <ul className="space-y-0.5">
                                {charProperties.bonus!.map((b, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">{b}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Abilities */}
                    {(sheet.abilities?.length ?? 0) > 0 && (
                        <section className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Abilities</p>
                            <ul className="space-y-0.5">
                                {sheet.abilities!.map(a => (
                                    <li key={a.name} className="text-sm font-medium">{a.name}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Proficiencies */}
                    {(sheet.proficiencies?.length ?? 0) > 0 && (
                        <section className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Proficiencies</p>
                            <ul className="space-y-0.5">
                                {sheet.proficiencies!.map(p => (
                                    <li key={p.name} className="text-sm font-medium">{p.name}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </FieldGroup>

                <FieldGroup>
                    <div className="flex flex-wrap gap-2 justify-evenly">
                        <Button variant="outline" onClick={openText}>Export as Text</Button>
                        <Button variant="outline" onClick={openJson}>Export as JSON</Button>
                        <Button variant="outline" onClick={saveLocal}>
                            {savedMsg ? 'Saved!' : 'Save to Browser'}
                        </Button>
                    </div>
                    <Button size="lg" onClick={props.onFinish}>Finish</Button>
                </FieldGroup>
            </FieldSet>
        </>
    )
}