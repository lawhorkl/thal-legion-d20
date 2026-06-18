import { useReducer, useState } from "react"
import { characterReducer } from "./reducer"
import { BasicInfo } from "./steps/BasicInfo"
import { ClassPreset } from "./steps/ClassPreset"
import { Stats } from "./steps/Stats"
import { Abilities } from "./steps/Abilities"
import { Proficiencies } from "./steps/Proficiencies"
import { Review } from "./steps/Review"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CharacterCreationSidebar } from "./CharacterCreationSidebar"
import { STEPS } from "./constants"
import { useNavigate } from "react-router-dom"

export function CharacterCreation() {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [sheet, dispatch] = useReducer(characterReducer, {})

    const next = () => setStep(s => s + 1)

    return (
        <SidebarProvider>
            <CharacterCreationSidebar step={step} />

            <SidebarInset className="flex items-center justify-center p-8">
                {STEPS[step].key === 'basic' && <BasicInfo onNext={(data) => { dispatch({ type: 'SET_BASIC_INFO', payload: data }); next() }} />}
                {STEPS[step].key === 'class' && <ClassPreset onNext={(data) => { dispatch({ type: 'APPLY_CLASS_PRESET', payload: data }); next() }} />}
                {STEPS[step].key === 'stats' && <Stats onNext={(data) => { dispatch({ type: 'SET_STATS', payload: data }); next() }} />}
                {STEPS[step].key === 'abilities' && <Abilities onNext={(data) => { dispatch({ type: 'SET_ABILITIES', payload: data }); next() }} />}
                {STEPS[step].key === 'proficiencies' && <Proficiencies onNext={(data) => { dispatch({ type: 'SET_PROFICIENCIES', payload: data }); next() }} />}
                {STEPS[step].key === 'review' && <Review sheet={sheet} onFinish={() => { void navigate('/') }} />}
            </SidebarInset>
        </SidebarProvider>
    )
}
