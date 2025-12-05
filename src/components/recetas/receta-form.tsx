"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { recetaService } from "@/lib/db/recetas"
import { pacienteService } from "@/lib/db/pacientes"
import { RecetaFormData, Paciente } from "@/types"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PacienteForm } from "@/components/pacientes/paciente-form"
import { PlusCircle } from "lucide-react"

const medicamentoSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    dosis: z.string().min(1, "La dosis es requerida"),
    frecuencia: z.string().min(1, "La frecuencia es requerida"),
    duracion: z.string().min(1, "La duración es requerida"),
    indicaciones: z.string().optional(),
})

const recetaFormSchema = z.object({
    pacienteId: z.string().min(1, "Debe seleccionar un paciente"),
    diagnostico: z.string().min(1, "El diagnóstico es requerido"),
    medicamentos: z.array(medicamentoSchema).min(1, "Debe agregar al menos un medicamento"),
    instrucciones: z.string().optional(),
})

export function RecetaForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [isPacienteModalOpen, setIsPacienteModalOpen] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<RecetaFormData>({
        resolver: zodResolver(recetaFormSchema),
        defaultValues: {
            pacienteId: "",
            diagnostico: "",
            medicamentos: [{ nombre: "", dosis: "", frecuencia: "", duracion: "", indicaciones: "" }],
            instrucciones: "",
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "medicamentos",
    })

    const loadPacientes = async () => {
        const data = await pacienteService.getAll()
        setPacientes(data)
    }

    useEffect(() => {
        loadPacientes()
    }, [])

    const handlePacienteCreated = async (newPacienteId: string) => {
        await loadPacientes()
        form.setValue("pacienteId", newPacienteId)
        setIsPacienteModalOpen(false)
    }

    async function onSubmit(values: RecetaFormData) {
        // NOTE (funcional): La lógica de envío de la receta está implementada y funciona.
        // - Carga del paciente seleccionado mediante `pacienteService.getById`
        // - Creación de la receta mediante `recetaService.create`
        // - Mensajes de toast en caso de éxito/error y redirección a la receta creada
        // Pruebas manuales recomendadas: crear un paciente en la DB local y enviar una receta.
        setIsLoading(true)
        try {
            // Obtener datos del paciente seleccionado
            const paciente = await pacienteService.getById(values.pacienteId)
            if (!paciente) {
                throw new Error("Paciente no encontrado")
            }

            // Crear receta con datos del paciente
            const recetaId = await recetaService.create(values, {
                nombre: paciente.nombre,
                edad: paciente.edad ?? 0
            })

            toast({
                title: "Receta creada",
                description: `Receta guardada correctamente.`,
            })

            // Redirigir a la receta creada
            router.push(`/recetas/${recetaId}`)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Hubo un problema al guardar la receta.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/recetas">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold">Nueva Receta Médica</h2>
                </div>

                <div className="grid gap-6">
                    {/* Selección de Paciente y Diagnóstico */}
                    <Card>
                        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="pacienteId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paciente *</FormLabel>
                                        <div className="flex gap-2">
                                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="flex-1">
                                                        <SelectValue placeholder="Seleccionar paciente..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {pacientes.map((paciente) => (
                                                        <SelectItem key={paciente.id} value={paciente.id}>
                                                            {paciente.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Dialog open={isPacienteModalOpen} onOpenChange={setIsPacienteModalOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" type="button" title="Nuevo Paciente">
                                                        <PlusCircle className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
                                                        <DialogDescription>
                                                            Complete los datos para registrar un paciente rápidamente.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4">
                                                        <PacienteForm
                                                            afterSave={handlePacienteCreated}
                                                            onCancel={() => setIsPacienteModalOpen(false)}
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="diagnostico"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diagnóstico *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Diagnóstico principal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Medicamentos */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Medicamentos</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ nombre: "", dosis: "", frecuencia: "", duracion: "", indicaciones: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Medicamento
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <Card key={field.id} className="relative">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                                    onClick={() => remove(index)}
                                    disabled={fields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <CardContent className="pt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.nombre`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel>Medicamento {index + 1} *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre comercial / Genérico" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.dosis`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dosis *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: 500mg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.frecuencia`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frecuencia *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Cada 8 horas" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.duracion`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duración *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: 7 días" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`medicamentos.${index}.indicaciones`}
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-3">
                                                <FormLabel>Instrucciones Específicas</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ej: Tomar con alimentos" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Instrucciones Generales */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="instrucciones"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instrucciones Generales / Recomendaciones</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Dieta, reposo, cuidados generales..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/recetas">
                        <Button variant="outline" type="button">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Receta
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
