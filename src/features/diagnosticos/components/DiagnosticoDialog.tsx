
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
import { DiagnosticoCatalogo } from "@/types"
import { useEffect } from "react"

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

    // Resetear formulario al abrir/recibir datos
    useEffect(() => {
        if (diagnostico) {
            form.reset({
                codigo: diagnostico.codigo,
                nombre: diagnostico.nombre,
                sinonimos: diagnostico.sinonimos?.join(", ") || "",
                especialidad: diagnostico.especialidad?.join(", ") || "",
            })
        } else {
            form.reset({
                codigo: "",
                nombre: "",
                sinonimos: "",
                especialidad: ""
            })
        }
    }, [diagnostico, form, open])

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

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
