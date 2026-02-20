"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/shared/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { diagnosticoService } from "@/features/diagnosticos/services/diagnostico.service"
import { useToast } from "@/shared/components/ui/use-toast"
import { useEffect, useState } from "react"
import { Plus, Trash2, Search, Pill } from "lucide-react"
import { Medicamento, DiagnosticoCatalogo as Diagnostico, MedicamentoCatalogo } from "@/types"
import { medicamentoService } from "@/features/medicamentos/services/medicamento.service"
import { db } from "@/shared/db/db.config"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { treatmentLearningService } from "@/features/recetas/services/treatment-learning.service"


const formSchema = z.object({
    codigo: z.string().optional(),
    nombre: z.string().min(2, {
        message: "El nombre es requerido.",
    }),
    sinonimos: z.string().optional(),
    especialidad: z.string().optional(),
})

/**
 * Componente de diálogo para crear o editar diagnósticos.
 * Integra validación con Zod y persistencia en IndexedDB (Dexie).
 * 
 * @param props - Propiedades del componente.
 * @returns Componente de diálogo.
 */
interface DiagnosticoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    diagnostico?: Diagnostico | null
    onSubmit?: (data: Omit<Diagnostico, 'id'>) => Promise<void>
}

export function DiagnosticoDialog({
    open,
    onOpenChange,
    diagnostico,
    onSubmit,
}: DiagnosticoDialogProps) {
    const { toast } = useToast()
    const isEditing = !!diagnostico

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            codigo: "",
            nombre: "",
            sinonimos: "",
            especialidad: "",
        },
    })

    const [medicamentosSugeridos, setMedicamentosSugeridos] = useState<Partial<Medicamento>[]>([])
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null)
    const [suggestions, setSuggestions] = useState<MedicamentoCatalogo[]>([])

    useEffect(() => {
        const loadInitialData = async () => {
            if (diagnostico) {
                form.reset({
                    codigo: diagnostico.codigo || "",
                    nombre: diagnostico.nombre,
                    sinonimos: diagnostico.sinonimos?.join(", ") || "",
                    especialidad: diagnostico.especialidad?.join(", ") || "",
                })

                // Si ya tiene medicamentos sugeridos manuales, usarlos
                if (diagnostico.medicamentosSugeridos && diagnostico.medicamentosSugeridos.length > 0) {
                    setMedicamentosSugeridos(diagnostico.medicamentosSugeridos)
                } else {
                    // FALLBACK: Si no tiene, buscar tratamientos aprendidos automáticamente
                    try {
                        const learnedTreatments = await treatmentLearningService.getSuggestions(
                            diagnostico.codigo || diagnostico.nombre
                        );

                        if (learnedTreatments.length > 0) {
                            // Cargar el tratamiento más usado
                            setMedicamentosSugeridos(learnedTreatments[0].medicamentos);
                        } else {
                            setMedicamentosSugeridos([]);
                        }
                    } catch (err) {
                        console.error("Error al cargar tratamientos aprendidos:", err);
                        setMedicamentosSugeridos([]);
                    }
                }
            } else {
                form.reset({
                    codigo: "",
                    nombre: "",
                    sinonimos: "",
                    especialidad: "",
                })
                setMedicamentosSugeridos([])
            }
        };

        loadInitialData();
    }, [diagnostico, form, open])

    const addMedicamento = () => {
        setMedicamentosSugeridos([...medicamentosSugeridos, {
            nombre: "",
            nombreGenerico: "",
            formaFarmaceutica: "",
            concentracion: "",
            presentacion: "",
            dosis: "",
            frecuencia: "",
            duracion: "",
            viaAdministracion: "",
            cantidadSurtir: "",
            indicaciones: ""
        }])
    }

    const removeMedicamento = (index: number) => {
        setMedicamentosSugeridos(medicamentosSugeridos.filter((_, i) => i !== index))
    }

    const updateMedicamento = (index: number, field: keyof Medicamento, value: string) => {
        const newMeds = [...medicamentosSugeridos]
        newMeds[index] = { ...newMeds[index], [field]: value }
        setMedicamentosSugeridos(newMeds)
    }

    const handleSearchMed = async (index: number, query: string) => {
        updateMedicamento(index, 'nombre', query)
        if (query.length < 2) {
            setSuggestions([])
            return
        }
        const results = await medicamentoService.searchWithPriority(query)
        setSuggestions(results)
        setActiveSearchIndex(index)
    }

    const selectMedSugerido = (index: number, med: MedicamentoCatalogo) => {
        const newMeds = [...medicamentosSugeridos]
        newMeds[index] = {
            ...newMeds[index],
            nombre: med.nombre,
            nombreGenerico: med.nombreGenerico || "",
            formaFarmaceutica: med.formaFarmaceutica || "",
            concentracion: med.concentracion || "",
            presentacion: med.presentacion || "",
            dosis: med.dosisDefault || "",
            frecuencia: med.frecuenciaDefault || "",
            duracion: med.duracionDefault || "",
            viaAdministracion: med.viaAdministracionDefault || "",
            cantidadSurtir: med.cantidadSurtirDefault || "",
            indicaciones: med.indicacionesDefault || ""
        }
        setMedicamentosSugeridos(newMeds)
        setSuggestions([])
        setActiveSearchIndex(null)
    }

    /**
     * Maneja el envío del formulario procesando strings a arreglos.
     * Guarda automáticamente los medicamentos nuevos en el catálogo.
     * 
     * @param values - Valores del formulario.
     */
    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Procesar y guardar medicamentos nuevos en el catálogo
            const medsConIds = await Promise.all(medicamentosSugeridos.filter(m => m.nombre).map(async (med) => {
                const nombreNorm = med.nombre!.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                // Buscar si existe en el catálogo por nombre normalizado
                const existing = await db.medicamentos.where('nombreBusqueda').equals(nombreNorm).first();

                if (!existing) {
                    // Si no existe, crear un nuevo registro completo en el catálogo
                    await medicamentoService.create({
                        nombre: med.nombre!,
                        nombreGenerico: med.nombreGenerico,
                        formaFarmaceutica: med.formaFarmaceutica,
                        concentracion: med.concentracion,
                        presentacion: med.presentacion,
                        dosisDefault: med.dosis,
                        frecuenciaDefault: med.frecuencia,
                        duracionDefault: med.duracion,
                        viaAdministracionDefault: med.viaAdministracion,
                        cantidadSurtirDefault: med.cantidadSurtir,
                        indicacionesDefault: med.indicaciones,
                        esPersonalizado: true,
                        sincronizado: false,
                    });
                }

                return med;
            }));

            const data: Omit<Diagnostico, 'id'> = {
                codigo: values.codigo || "",
                nombre: values.nombre,
                sinonimos: values.sinonimos ? values.sinonimos.split(",").map(s => s.trim()).filter(Boolean) : [],
                especialidad: values.especialidad ? values.especialidad.split(",").map(e => e.trim()).filter(Boolean) : [],
                medicamentosSugeridos: medsConIds,
            }

            if (onSubmit) {
                await onSubmit(data)
            } else {
                if (isEditing && diagnostico?.id) {
                    await diagnosticoService.update(diagnostico.id, data)
                    toast({
                        title: "Diagnóstico actualizado",
                        description: "Los cambios se han guardado correctamente.",
                    })
                } else {
                    await diagnosticoService.create(data as Diagnostico)
                    toast({
                        title: "Diagnóstico creado",
                        description: "El diagnóstico se ha añadido a tu catálogo.",
                    })
                }
            }

            onOpenChange(false)
        } catch (error) {
            console.error("Error al guardar diagnóstico:", error)
            toast({
                title: "Error",
                description: "Hubo un problema al guardar el diagnóstico.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl flex flex-col max-h-[90vh] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50">
                <DialogHeader className="p-6 pb-2 bg-white">
                    <DialogTitle className="text-2xl font-black text-slate-900">
                        {isEditing ? "Editar Diagnóstico" : "Nuevo Diagnóstico"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Información Básica */}
                            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                                <CardContent className="p-5 space-y-5 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="codigo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500">Código (CIE-11)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ej: MG44"
                                                            {...field}
                                                            className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="nombre"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500">Nombre del Diagnóstico</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ej: Faringitis Aguda"
                                                            {...field}
                                                            className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="sinonimos"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-500">Sinónimos / Búsqueda</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Diferentes formas de llamar a este diagnóstico (separar por comas)"
                                                        {...field}
                                                        className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Sección de Medicamentos Sugeridos */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold flex items-center gap-2 text-slate-800">
                                            <Pill className="h-4 w-4 text-blue-500" />
                                            Medicamentos del Tratamiento Sugerido
                                        </h4>
                                        <p className="text-[10px] text-slate-400">Si un medicamento no existe, se guardará automáticamente en tu catálogo.</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addMedicamento}
                                        className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Agregar Medicamento
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {medicamentosSugeridos.map((med, idx) => (
                                        <Card key={idx} className="relative overflow-visible border-none shadow-sm rounded-2xl bg-white group">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -right-2 -top-2 h-7 w-7 text-white bg-red-500 hover:bg-red-600 shadow-lg rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeMedicamento(idx)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <CardContent className="p-5">
                                                <div className="grid gap-4">
                                                    {/* Primera Fila: Nombre y Autocompletado */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="relative">
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Nombre Comercial</Label>
                                                            <div className="relative">
                                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                                                <Input
                                                                    placeholder="Buscar o escribir nombre..."
                                                                    value={med.nombre}
                                                                    onChange={e => handleSearchMed(idx, e.target.value)}
                                                                    className="pl-9 rounded-xl border-slate-200 focus:border-blue-500 h-10 bg-slate-50/30"
                                                                />
                                                            </div>
                                                            {activeSearchIndex === idx && suggestions.length > 0 && (
                                                                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-auto py-2 animate-in fade-in zoom-in duration-200">
                                                                    {suggestions.map(s => (
                                                                        <button
                                                                            key={s.id}
                                                                            type="button"
                                                                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex flex-col"
                                                                            onClick={() => selectMedSugerido(idx, s)}
                                                                        >
                                                                            <span className="font-bold text-sm text-slate-900">{s.nombre}</span>
                                                                            <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                                                                                {s.nombreGenerico && <span>{s.nombreGenerico}</span>}
                                                                                {s.presentacion && <span>• {s.presentacion}</span>}
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Sustancia Activa (Genérico)</Label>
                                                            <Input
                                                                placeholder="Ej: Paracetamol"
                                                                value={med.nombreGenerico}
                                                                onChange={e => updateMedicamento(idx, 'nombreGenerico', e.target.value)}
                                                                className="rounded-xl border-slate-200 focus:border-blue-500 h-10 bg-slate-50/30"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Segunda Fila: Detalles del Fármaco */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        <div>
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Presentación</Label>
                                                            <Input
                                                                placeholder="Ej: Caja/20"
                                                                value={med.presentacion}
                                                                onChange={e => updateMedicamento(idx, 'presentacion', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Forma</Label>
                                                            <Input
                                                                placeholder="Ej: Tabletas"
                                                                value={med.formaFarmaceutica}
                                                                onChange={e => updateMedicamento(idx, 'formaFarmaceutica', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Conc.</Label>
                                                            <Input
                                                                placeholder="Ej: 500mg"
                                                                value={med.concentracion}
                                                                onChange={e => updateMedicamento(idx, 'concentracion', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Vía</Label>
                                                            <Input
                                                                placeholder="Ej: Oral"
                                                                value={med.viaAdministracion}
                                                                onChange={e => updateMedicamento(idx, 'viaAdministracion', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Fila Extra: Laboratorio y Categoría */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Laboratorio</Label>
                                                            <Input
                                                                placeholder="Ej: Pfizer, Bayer..."
                                                                value={(med as any).laboratorio || ""}
                                                                onChange={e => updateMedicamento(idx, 'laboratorio' as any, e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs bg-slate-50/30"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Categoría Terapéutica</Label>
                                                            <Input
                                                                placeholder="Ej: Antibiótico, Analgésico..."
                                                                value={(med as any).categoria || ""}
                                                                onChange={e => updateMedicamento(idx, 'categoria' as any, e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs bg-slate-50/30"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Tercera Fila: Dosificación */}
                                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                                                        <div className="col-span-2 md:col-span-2">
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Dosis Sugerida</Label>
                                                            <Input
                                                                placeholder="1 tab"
                                                                value={med.dosis}
                                                                onChange={e => updateMedicamento(idx, 'dosis', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs font-semibold"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 md:col-span-1">
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Canti.</Label>
                                                            <Input
                                                                placeholder="1"
                                                                value={med.cantidadSurtir}
                                                                onChange={e => updateMedicamento(idx, 'cantidadSurtir', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 md:col-span-1">
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Frec.</Label>
                                                            <Input
                                                                placeholder="c/8h"
                                                                value={med.frecuencia}
                                                                onChange={e => updateMedicamento(idx, 'frecuencia', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs"
                                                            />
                                                        </div>
                                                        <div className="col-span-2 md:col-span-2">
                                                            <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Duración</Label>
                                                            <Input
                                                                placeholder="7 días"
                                                                value={med.duracion}
                                                                onChange={e => updateMedicamento(idx, 'duracion', e.target.value)}
                                                                className="rounded-xl border-slate-200 h-9 text-xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Indicaciones Extra */}
                                                    <div>
                                                        <Label className="text-[10px] font-bold text-slate-400 mb-1.5 block">Indicaciones al Paciente</Label>
                                                        <Input
                                                            placeholder="Ej: Tomar después de los alimentos"
                                                            value={med.indicaciones}
                                                            onChange={e => updateMedicamento(idx, 'indicaciones', e.target.value)}
                                                            className="rounded-xl border-slate-200 h-9 text-xs italic bg-slate-50/50"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {medicamentosSugeridos.length === 0 && (
                                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white text-slate-400 shadow-inner">
                                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Pill className="h-8 w-8 opacity-20" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-300">Asocia medicamentos frecuentes</p>
                                            <p className="text-[10px] mt-1">Facilita la creación de tus recetas guardando tus tratamientos.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-6 pt-4 bg-white border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:space-x-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="text-slate-500 hover:bg-slate-100 rounded-xl px-6 font-bold"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xl shadow-blue-200 transition-all active:scale-95 text-white px-10 font-bold h-11"
                            >
                                {isEditing ? "Guardar Cambios" : "Crear Diagnóstico"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
