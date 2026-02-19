
"use client"

import { Button } from "@/shared/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { DiagnosticoCatalogo, TratamientoHabitual } from "@/types"
import { useEffect, useState } from "react"
import { TratamientoForm } from "./TratamientoForm"
import { treatmentLearningService } from "@/features/recetas/services/treatment-learning.service"
import { Plus, Trash2 } from "lucide-react"

// Esquema de validación
const formSchema = z.object({
    codigo: z.string().min(1, "El código es requerido (ej: J00)"),
    nombre: z.string().min(3, "El nombre del diagnóstico es requerido"),
    sinonimos: z.string().optional(),
    especialidad: z.string().optional(),
})

interface DiagnosticoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: Omit<DiagnosticoCatalogo, 'id'>) => Promise<void>
    diagnostico?: DiagnosticoCatalogo | null
}

export function DiagnosticoDialog({
    open,
    onOpenChange,
    onSubmit,
    diagnostico
}: DiagnosticoDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            codigo: "",
            nombre: "",
            sinonimos: "",
            especialidad: ""
        },
    })

    const [tratamientos, setTratamientos] = useState<TratamientoHabitual[]>([])
    const [showTratamientoForm, setShowTratamientoForm] = useState(false)

    // Resetear formulario al abrir/recibir datos
    useEffect(() => {
        if (diagnostico) {
            form.reset({
                codigo: diagnostico.codigo,
                nombre: diagnostico.nombre,
                sinonimos: diagnostico.sinonimos?.join(", ") || "",
                especialidad: diagnostico.especialidad?.join(", ") || "",
            })
            // Cargar tratamientos si existe código
            if (diagnostico.codigo) {
                loadTratamientos(diagnostico.codigo)
            }
        } else {
            form.reset({
                codigo: "",
                nombre: "",
                sinonimos: "",
                especialidad: ""
            })
            setTratamientos([])
            setShowTratamientoForm(false)
        }
    }, [diagnostico, form, open])

    const loadTratamientos = async (codigo: string) => {
        const data = await treatmentLearningService.getAllByDiagnostico(codigo)
        setTratamientos(data)
    }

    const handleSaveTratamiento = async (t: Omit<TratamientoHabitual, 'id' | 'usoCount' | 'fechaUltimoUso'>) => {
        await treatmentLearningService.saveManual(t)
        setShowTratamientoForm(false)
        if (diagnostico?.codigo) await loadTratamientos(diagnostico.codigo)
    }

    const handleDeleteTratamiento = async (id: number) => {
        if (confirm("¿Eliminar este tratamiento?")) {
            await treatmentLearningService.delete(id)
            if (diagnostico?.codigo) await loadTratamientos(diagnostico.codigo)
        }
    }

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        // Procesar arrays
        const sinonimosArray = values.sinonimos
            ? values.sinonimos.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const especialidadArray = values.especialidad
            ? values.especialidad.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const diagnosticoData: Omit<DiagnosticoCatalogo, 'id'> = {
            codigo: values.codigo,
            nombre: values.nombre,
            sinonimos: sinonimosArray,
            especialidad: especialidadArray,
            // uri se deja vacía si es creado manualmente, o se podría generar una ficticia
        }

        await onSubmit(diagnosticoData)
        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>
                        {diagnostico ? "Editar Diagnóstico" : "Nuevo Diagnóstico"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Código */}
                            <FormField
                                control={form.control}
                                name="codigo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código CIE-11</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: MG44" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Nombre */}
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nombre del Diagnóstico</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Dolor crónico generalizado" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Sinónimos */}
                            <FormField
                                control={form.control}
                                name="sinonimos"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Sinónimos (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Dolor persistente, algia crónica" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Separa con comas. Ayuda a encontrar el diagnóstico más rápido.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Especialidad */}
                            <FormField
                                control={form.control}
                                name="especialidad"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Especialidades Sugeridas</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Reumatología, Traumatología" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Especialidades donde este diagnóstico es común.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* SECCIÓN TRATAMIENTOS (Solo si ya existe el diagnóstico) */}
                        {diagnostico?.codigo && (
                            <div className="border-t pt-4 mt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-900">Tratamientos Habituales</h3>
                                    {!showTratamientoForm && (
                                        <Button type="button" variant="outline" size="sm" onClick={() => setShowTratamientoForm(true)}>
                                            <Plus className="h-4 w-4 mr-2" /> Agregar Tratamiento
                                        </Button>
                                    )}
                                </div>

                                {showTratamientoForm ? (
                                    <TratamientoForm
                                        diagnosticoId={diagnostico.codigo}
                                        onSave={handleSaveTratamiento}
                                        onCancel={() => setShowTratamientoForm(false)}
                                    />
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {tratamientos.length === 0 ? (
                                            <p className="text-sm text-slate-500 italic text-center py-2">No hay tratamientos configurados.</p>
                                        ) : (
                                            tratamientos.map(t => (
                                                <div key={t.id} className="flex justify-between items-center bg-slate-50 p-3 rounded border text-sm">
                                                    <div>
                                                        <div className="font-medium">{t.nombreTratamiento}</div>
                                                        <div className="text-slate-500 text-xs">{t.medicamentos.length} medicamentos</div>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteTratamiento(t.id!)}>
                                                        <Trash2 className="h-4 w-4 text-red-400" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter className="flex flex-row-reverse justify-end gap-2">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl">Guardar Diagnóstico</Button>
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-500 hover:bg-slate-100">
                                Cancelar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

// Imports adicionales necesarios (TratamientoForm, TratamientoHabitual, useState, etc) al inicio del archivo
// Se requiere actualizar los imports y agregar el estado 'tratamientos' y 'showTratamientoForm'

