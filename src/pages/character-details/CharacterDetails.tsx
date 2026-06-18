import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useCharacters } from '../../hooks/useCharacters'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STAT_KEYS, STAT_LABELS, CHAR_PROPERTY_KEYS, CHAR_PROPERTY_LABELS } from '../character-creation/constants'
import type { Equipment, CharProperties, Stats, Consumable, CharacterSheet } from '@/models/character.interface'
import { ALL_PROFICIENCIES } from '@/models/proficiencies'
import { XIcon } from 'lucide-react'

const STAT_TO_PROP: Partial<Record<keyof Stats, keyof CharProperties>> = {
  stamina:  'hp',
  combat:   'dmgDone',
  pockets:  'invSlots',
  reflexes: 'envRolls',
  healer:   'healingDone',
  stealth:  'stealth',
}

const RARITY_STAT_BONUS: Record<Equipment['rarity'], number> = {
  Legendary: 2, Rare: 1, Uncommon: 1, Common: 0,
}

const RARITY_HP_BONUS: Record<Equipment['rarity'], number> = {
  Legendary: 2, Rare: 2, Uncommon: 1, Common: 1,
}

const RARITIES: Equipment['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Legendary']

function applyEquipmentBonuses(
  baseProps: CharProperties,
  baseHp: number,
  equipments: Equipment[]
): { charProperties: CharProperties; hp: number } {
  const props = { ...baseProps }
  let hp = baseHp
  for (const eq of equipments) {
    hp += RARITY_HP_BONUS[eq.rarity]
    const statBonus = RARITY_STAT_BONUS[eq.rarity]
    if (statBonus > 0) {
      const prop = STAT_TO_PROP[eq.chosenStat]
      if (prop) {
        (props as unknown as Record<string, number>)[prop] = (props[prop] as number) + statBonus
        if (prop === 'hp') hp += statBonus
      }
    }
  }
  return { charProperties: props, hp }
}

function formatVal(val: number) {
  return val > 0 ? `+${val}` : `${val}`
}

function buildTextExport(sheet: Partial<CharacterSheet>, effectiveProps: CharProperties, effectiveHp: number): string {
  const lines: string[] = []
  lines.push('=== CHARACTER SHEET ===')
  lines.push(`Name:  ${sheet.name ?? '—'}`)
  lines.push(`Race:  ${sheet.race ?? '—'}`)
  lines.push(`Class: ${sheet.class?.name ?? '—'} (${sheet.class?.role?.roleName ?? '—'})`)
  lines.push(`HP:    ${effectiveHp}`)
  if (sheet.stats) {
    lines.push('\nSTATS')
    for (const key of STAT_KEYS) {
      const v = sheet.stats[key]
      if (v > 0) lines.push(`  ${STAT_LABELS[key]}: ${v}`)
    }
  }
  const propLines = CHAR_PROPERTY_KEYS
    .map(k => ({ label: CHAR_PROPERTY_LABELS[k]!, val: effectiveProps[k] as number }))
    .filter(({ val }) => val !== 0)
  if (propLines.length > 0) {
    lines.push('\nPROPERTIES')
    for (const { label, val } of propLines) lines.push(`  ${label}: ${formatVal(val)}`)
  }
  if (effectiveProps.bonus?.length) {
    lines.push('\nPASSIVES')
    for (const b of effectiveProps.bonus) lines.push(`  - ${b}`)
  }
  if (sheet.abilities?.length) {
    lines.push('\nABILITIES')
    for (const a of sheet.abilities) lines.push(`  - ${a.name}`)
  }
  if (sheet.proficiencies?.length) {
    lines.push('\nPROFICIENCIES')
    for (const p of sheet.proficiencies) lines.push(`  - ${p.name}`)
  }
  if (sheet.equipments?.length) {
    lines.push('\nEQUIPMENT')
    for (const e of sheet.equipments) lines.push(`  - ${e.name} (${e.rarity}, ${STAT_LABELS[e.chosenStat]})`)
  }
  lines.push(`\nGold: ${sheet.gold ?? 0}`)
  if (sheet.signet) lines.push('Signet Ring: Yes')
  if (sheet.consumables?.length) {
    lines.push('\nCONSUMABLES')
    for (const c of sheet.consumables) lines.push(`  - ${c.name}: ${c.effect}`)
  }
  return lines.join('\n')
}

export function CharacterDetails() {
  const { id } = useParams<{ id: string }>()
  const { characters, updateCharacter } = useCharacters()
  const character = characters.find(c => c.id === id)

  const [draftEquipments, setDraftEquipments] = useState<Equipment[]>(character?.sheet.equipments ?? [])
  const [draftGold, setDraftGold] = useState(character?.sheet.gold ?? 0)
  const [draftSignet, setDraftSignet] = useState(character?.sheet.signet ?? false)
  const [draftConsumables, setDraftConsumables] = useState<Consumable[]>(character?.sheet.consumables ?? [])
  const [selectedProfNames, setSelectedProfNames] = useState<Set<string>>(() =>
    new Set((character?.sheet.proficiencies ?? []).map(p => p.name.startsWith('Craft') ? 'Craft' : p.name))
  )
  const [craftSpec, setCraftSpec] = useState(() => {
    const existing = (character?.sheet.proficiencies ?? []).find(p => p.name.startsWith('Craft'))
    return existing ? existing.name.replace(/^Craft:\s*/, '') : ''
  })
  const [newEq, setNewEq] = useState<{ name: string; rarity: Equipment['rarity']; chosenStat: keyof Stats }>({
    name: '', rarity: 'Common', chosenStat: 'combat',
  })
  const [newConsumable, setNewConsumable] = useState({ name: '', effect: '' })
  const [exportModal, setExportModal] = useState<{ title: string; content: string } | null>(null)

  if (!character) {
    return <div className="p-6"><p className="text-muted-foreground">Character not found.</p></div>
  }

  const { sheet, charProperties, hp } = character

  function computeSaveProficiencies() {
    return ALL_PROFICIENCIES
      .filter(p => selectedProfNames.has(p.name))
      .map(p => p.name === 'Craft' && craftSpec.trim()
        ? { ...p, name: `Craft: ${craftSpec.trim()}` }
        : p
      )
  }

  function toggleProf(name: string) {
    setSelectedProfNames(prev => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else if (next.size < 4) {
        next.add(name)
      }
      return next
    })
  }

  const pendingChanges =
    draftGold !== (sheet.gold ?? 0) ||
    draftSignet !== (sheet.signet ?? false) ||
    JSON.stringify(draftEquipments) !== JSON.stringify(sheet.equipments ?? []) ||
    JSON.stringify(draftConsumables) !== JSON.stringify(sheet.consumables ?? []) ||
    JSON.stringify(computeSaveProficiencies().map(p => p.name).sort()) !==
      JSON.stringify((sheet.proficiencies ?? []).map(p => p.name).sort())

  const { charProperties: effectiveProps, hp: effectiveHp } = applyEquipmentBonuses(charProperties, hp, draftEquipments)

  function save() {
    updateCharacter(id!, { ...sheet, equipments: draftEquipments, gold: draftGold, signet: draftSignet, consumables: draftConsumables, proficiencies: computeSaveProficiencies() })
  }

  function eqError(): string | null {
    if (draftEquipments.length >= 3) return 'Maximum of 3 equipment pieces reached.'
    if (newEq.rarity === 'Legendary' && draftEquipments.some(e => e.rarity === 'Legendary'))
      return 'Only 1 Legendary piece allowed.'
    if (RARITY_STAT_BONUS[newEq.rarity] > 0 && draftEquipments.some(e => RARITY_STAT_BONUS[e.rarity] > 0 && e.chosenStat === newEq.chosenStat))
      return `Another piece already benefits ${STAT_LABELS[newEq.chosenStat]}.`
    return null
  }

  function consumableError(): string | null {
    if (draftConsumables.length >= 5) return 'Maximum of 5 consumables reached.'
    const name = newConsumable.name.trim().toLowerCase()
    if (name && draftConsumables.filter(c => c.name.toLowerCase() === name).length >= 2)
      return 'Maximum of 2 of the same consumable.'
    return null
  }

  function addEquipment() {
    if (!newEq.name.trim() || eqError()) return
    setDraftEquipments(prev => [...prev, { ...newEq, name: newEq.name.trim() }])
    setNewEq({ name: '', rarity: 'Common', chosenStat: 'combat' })
  }

  function addConsumable() {
    if (!newConsumable.name.trim() || consumableError()) return
    setDraftConsumables(prev => [...prev, { name: newConsumable.name.trim(), effect: newConsumable.effect.trim() }])
    setNewConsumable({ name: '', effect: '' })
  }

  function openExportText() {
    const exportSheet = { ...sheet, equipments: draftEquipments, gold: draftGold, signet: draftSignet, consumables: draftConsumables }
    setExportModal({ title: 'Export as Text', content: buildTextExport(exportSheet, effectiveProps, effectiveHp) })
  }

  function openExportJson() {
    const exportSheet = { ...sheet, equipments: draftEquipments, gold: draftGold, signet: draftSignet, consumables: draftConsumables }
    setExportModal({ title: 'Export as JSON', content: JSON.stringify({ sheet: exportSheet, charProperties: effectiveProps, hp: effectiveHp }, null, 2) })
  }

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <Dialog open={exportModal !== null} onOpenChange={open => { if (!open) setExportModal(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{exportModal?.title}</DialogTitle>
          </DialogHeader>
          <Textarea
            readOnly
            rows={16}
            value={exportModal?.content ?? ''}
            className="resize-none font-mono text-xs"
            onFocus={e => e.target.select()}
          />
          <p className="text-xs text-muted-foreground">Click the text area to select all.</p>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-lg flex flex-row justify-between">
        <div>
          <h2 className="text-xl font-bold">{sheet.name}</h2>
          <p className="text-sm text-muted-foreground">
            {sheet.race} &mdash; {sheet.class?.name} ({sheet.class?.role?.roleName})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openExportText}>Export Text</Button>
          <Button variant="outline" onClick={openExportJson}>Export JSON</Button>
          <Button onClick={save} disabled={!pendingChanges}>Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full max-w-lg">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          <TabsTrigger value="inventory" className="flex-1">Inventory</TabsTrigger>
          <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
        </TabsList>

        {/* DETAILS TAB */}
        <TabsContent value="details" className="space-y-4">
          <section className="flex items-center gap-3">
            <span className="text-sm font-medium">HP</span>
            <span className="text-lg font-bold">{effectiveHp}</span>
          </section>

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

          <section className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Properties</p>
            {CHAR_PROPERTY_KEYS.map(key => {
              const val = effectiveProps[key] as number
              if (val === 0) return null
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span>{CHAR_PROPERTY_LABELS[key]}</span>
                  <span className="font-medium">{formatVal(val)}</span>
                </div>
              )
            })}
          </section>

          {(charProperties.bonus?.length ?? 0) > 0 && (
            <section className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Passives</p>
              <ul className="space-y-0.5">
                {charProperties.bonus!.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{b}</li>
                ))}
              </ul>
            </section>
          )}

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

          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Proficiencies <span className="font-normal normal-case">({selectedProfNames.size}/4)</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Bonus: Easy +2 · Moderate +4 · Hard +6.{' '}
              Two characters sharing a proficiency roll with <span className="font-medium text-foreground">Advantage</span>.
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {ALL_PROFICIENCIES.map(prof => {
                const isSelected = selectedProfNames.has(prof.name)
                const isDisabled = !isSelected && selectedProfNames.size >= 4
                return (
                  <div key={prof.name} className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => toggleProf(prof.name)}
                      className={`rounded-md border p-2.5 text-left transition-colors ${
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
          </section>
        </TabsContent>

        {/* INVENTORY TAB */}
        <TabsContent value="inventory" className="space-y-4">
          <section className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Gold</span>
              <Input
                type="number"
                min={0}
                value={draftGold}
                onChange={e => setDraftGold(Number(e.target.value))}
                className="w-20 h-7 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={draftSignet} onCheckedChange={val => setDraftSignet(val === true)} />
              <span className="text-sm font-medium">Signet Ring</span>
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Equipment <span className="font-normal normal-case">({draftEquipments.length}/3 · max 1 Legendary · no duplicate stat bonuses)</span>
            </p>
            {draftEquipments.length > 0 ? (
              <ul className="space-y-1">
                {draftEquipments.map((e, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span>{e.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{e.rarity} · {STAT_LABELS[e.chosenStat]}</span>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDraftEquipments(prev => prev.filter((_, j) => j !== i))}>
                        <XIcon />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No Equipment added.</p>
            )}
            <div className="flex gap-2 pt-1 flex-wrap">
              <Input
                placeholder="Name"
                value={newEq.name}
                onChange={e => setNewEq(prev => ({ ...prev, name: e.target.value }))}
                className="h-7 text-sm w-32"
              />
              <Select value={newEq.rarity} onValueChange={val => setNewEq(prev => ({ ...prev, rarity: val as Equipment['rarity'] }))}>
                <SelectTrigger size="sm" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RARITIES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={newEq.chosenStat} onValueChange={val => setNewEq(prev => ({ ...prev, chosenStat: val as keyof Stats }))}>
                <SelectTrigger size="sm" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAT_KEYS.map(k => <SelectItem key={k} value={k}>{STAT_LABELS[k]}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={addEquipment} disabled={!!eqError()}>Add</Button>
            </div>
            {eqError() && <p className="text-xs text-destructive">{eqError()}</p>}
          </section>

          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Consumables <span className="font-normal normal-case">({draftConsumables.length}/5 · max 2 of each)</span>
            </p>
            {draftConsumables.length > 0 ? (
              <ul className="space-y-1">
                {draftConsumables.map((c, i) => (
                  <li key={i} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.effect}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDraftConsumables(prev => prev.filter((_, j) => j !== i))}>
                      <XIcon />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No Consumables added.</p>
            )}
            <div className="flex gap-2 pt-1 flex-wrap">
              <Input
                placeholder="Name"
                value={newConsumable.name}
                onChange={e => setNewConsumable(prev => ({ ...prev, name: e.target.value }))}
                className="h-7 text-sm w-32"
              />
              <Input
                placeholder="Effect"
                value={newConsumable.effect}
                onChange={e => setNewConsumable(prev => ({ ...prev, effect: e.target.value }))}
                className="h-7 text-sm w-40"
              />
              <Button size="sm" variant="outline" onClick={addConsumable} disabled={!!consumableError()}>Add</Button>
            </div>
            {consumableError() && <p className="text-xs text-destructive">{consumableError()}</p>}
          </section>
        </TabsContent>

        {/* NOTES TAB */}
        <TabsContent value="notes" className="space-y-4">
          {sheet.bonus && Object.keys(sheet.bonus).length > 0 ? (
            <section className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bonus Notes</p>
              {Object.entries(sheet.bonus).map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-medium">{formatVal(val)}</span>
                </div>
              ))}
            </section>
          ) : (
            <p className="text-sm text-muted-foreground">No notes recorded.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
