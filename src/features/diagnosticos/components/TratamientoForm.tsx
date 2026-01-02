
"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Plus, Trash2, Search } from "lucide-react"
import { Medicamento, TratamientoHabitual, MedicamentoCatalogo } from "@/types"
import { buscarMedicamentosAutocompletado } from "@/shared/services/medicamentos.service"
import { Card, CardContent } from "@/shared/components/ui/card"

interface TratamientoFormProps {
    diagnosticoId: string;
    onSave: (tratamiento: Omit<TratamientoHabitual, 'id' | 'usoCount' | 'fechaUltimoUso'>) => Promise<void>;
    onCancel: () => void;
}

export function TratamientoForm({ diagnosticoId, onSave, onCancel }: TratamientoFormProps) {
    const [nombreTratamiento, setNombreTratamiento] = useState("")
    const [instrucciones, setInstrucciones] = useState("")
    const [medicamentos, setMedicamentos] = useState<Partial<Medicamento>[]>([])

    // Estados de búsqueda
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null)
    const [suggestions, setSuggestions] = useState<MedicamentoCatalogo[]>([])

    const addMedicamento = () => {
        setMedicamentos([...medicamentos, {
            nombre: "", dosis: "", frecuencia: "", duracion: "", cantidadSurtir: "", indicaciones: ""
        }])
    }

    const removeMedicamento = (index: number) => {
        setMedicamentos(medicamentos.filter((_, i) => i !== index))
    }

    const updateMedicamento = (index: number, field: keyof Medicamento, value: string) => {
        const newMeds = [...medicamentos]
        newMeds[index] = { ...newMeds[index], [field]: value }
        setMedicamentos(newMeds)
    }

    const handleSearch = async (index: number, query: string) => {
        updateMedicamento(index, 'nombre', query)
        if (query.length < 2) {
            setSuggestions([])
            return
        }
        const results = await buscarMedicamentosAutocompletado(query, 5)
        setSuggestions(results)
        setActiveSearchIndex(index)
    }

    const selectMedicamento = (index: number, med: MedicamentoCatalogo) => {
        const newMeds = [...medicamentos]
        newMeds[index] = {
            ...newMeds[index],
            nombre: med.nombre,
            nombreGenerico: med.nombreGenerico,
            presentacion: med.presentacion,
            dosis: med.dosisDefault || "",
            frecuencia: med.frecuenciaDefault || "",
            duracion: med.duracionDefault || "",
            cantidadSurtir: med.cantidadSurtirDefault || "",
            indicaciones: med.indicacionesDefault || ""
        }
        setMedicamentos(newMeds)
        setSuggestions([])
        setActiveSearchIndex(null)
    }

    const handleSave = () => {
        if (!nombreTratamiento || medicamentos.length === 0) return;

        onSave({
            diagnosticoId,
            nombreTratamiento,
            instrucciones,
            medicamentos,
            especialidad: "General" // Podría ser parametrizable
        })
    }

    return (
        <div className="space-y-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
            <h3 className="font-semibold text-sm">Nuevo Tratamiento Habitual</h3>

            <div className="grid gap-2">
                <Label>Nombre del Tratamiento (Ej: Estándar Adulto)</Label>
                <Input
                    value={nombreTratamiento}
                    onChange={e => setNombreTratamiento(e.target.value)}
                    placeholder="Describe este protocolo..."
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Medicamentos</Label>
                    <Button variant="outline" size="sm" onClick={addMedicamento}>
                        <Plus className="h-3 w-3 mr-1" /> Agregar
                    </Button>
                </div>

                {medicamentos.map((med, idx) => (
                    <Card key={idx} className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6 text-red-500"
                            onClick={() => removeMedicamento(idx)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        <CardContent className="p-3 grid gap-2">
                            <div className="relative">
                                <Input
                                    placeholder="Buscar medicamento..."
                                    value={med.nombre}
                                    onChange={e => handleSearch(idx, e.target.value)}
                                    className="font-medium"
                                />
                                {activeSearchIndex === idx && suggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-auto">
                                        {suggestions.map(s => (
                                            <button
                                                key={s.id}
                                                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-sm"
                                                onClick={() => selectMedicamento(idx, s)}
                                            >
                                                {s.nombre} <span className="text-xs text-muted-foreground">{s.presentacion}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Dosis"
                                    value={med.dosis}
                                    onChange={e => updateMedicamento(idx, 'dosis', e.target.value)}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    placeholder="Frecuencia"
                                    value={med.frecuencia}
                                    onChange={e => updateMedicamento(idx, 'frecuencia', e.target.value)}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    placeholder="Duración"
                                    value={med.duracion}
                                    onChange={e => updateMedicamento(idx, 'duracion', e.target.value)}
                                    className="h-8 text-xs"
                                />
                                <Input
                                    placeholder="Cant. Surtir"
                                    value={med.cantidadSurtir}
                                    onChange={e => updateMedicamento(idx, 'cantidadSurtir', e.target.value)}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <Input
                                placeholder="Indicaciones (opcional)"
                                value={med.indicaciones}
                                onChange={e => updateMedicamento(idx, 'indicaciones', e.target.value)}
                                className="h-8 text-xs"
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-2">
                <Label>Instrucciones Generales / Recomendaciones</Label>
                <Textarea
                    value={instrucciones}
                    onChange={e => setInstrucciones(e.target.value)}
                    placeholder="Recomendaciones generales para el paciente..."
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSave} disabled={!nombreTratamiento || medicamentos.length === 0}>
                    Guardar Tratamiento
                </Button>
            </div>
        </div>
    )
}
