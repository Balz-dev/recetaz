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
import { medicamentoService } from "@/features/medicamentos/services/medicamento.service"
import { MedicamentoCatalogo as Medicamento } from "@/types"
import { useToast } from "@/shared/components/ui/use-toast"
import { useEffect } from "react"

const formSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre es requerido.",
    }),
    presentacion: z.string().min(2, {
        message: "La presentación es requerida.",
    }),
    dosisDefault: z.string().min(1, {
        message: "La dosis es requerida.",
    }),
    frecuenciaDefault: z.string().min(1, {
        message: "La frecuencia es requerida.",
    }),
    duracionDefault: z.string().min(1, {
        message: "La duración es requerida.",
    }),
    palabrasClave: z.string().optional(),
})

interface MedicamentoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Medicamento | null
    isEditing?: boolean
}

export function MedicamentoDialog({
    open,
    onOpenChange,
    initialData,
    isEditing = false,
}: MedicamentoDialogProps) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            presentacion: "",
            dosisDefault: "",
            frecuenciaDefault: "",
            duracionDefault: "",
            palabrasClave: "",
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                nombre: initialData.nombre,
                presentacion: initialData.presentacion || "",
                dosisDefault: initialData.dosisDefault || "",
                frecuenciaDefault: initialData.frecuenciaDefault || "",
                duracionDefault: initialData.duracionDefault || "",
                palabrasClave: initialData.palabrasClave?.join(", ") || "",
            })
        } else {
            form.reset({
                nombre: "",
                presentacion: "",
                dosisDefault: "",
                frecuenciaDefault: "",
                duracionDefault: "",
                palabrasClave: "",
            })
        }
    }, [initialData, form, open])

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            const medicamentoData: Partial<Medicamento> = {
                ...values,
                palabrasClave: values.palabrasClave ? values.palabrasClave.split(",").map((t) => t.trim()) : [],
            }

            if (isEditing && initialData?.id) {
                await medicamentoService.update(initialData.id, medicamentoData)
                toast({
                    title: "Medicamento actualizado",
                    description: "Los cambios se han guardado correctamente.",
                })
            } else {
                await medicamentoService.create(medicamentoData as Medicamento)
                toast({
                    title: "Medicamento creado",
                    description: "El medicamento se ha añadido a tu catálogo.",
                })
            }

            onOpenChange(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un problema al guardar el medicamento.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Medicamento" : "Nuevo Medicamento"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Medicamento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Paracetamol" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="presentacion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Presentación</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Tabletas 500mg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dosisDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dosis Sugerida</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: 1 tableta" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="frecuenciaDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frecuencia Sugerida</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: cada 8 horas" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duracionDefault"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duración Sugerida</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: por 5 días" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="palabrasClave"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Palabras Clave (Etiquetas)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: fiebre, dolor cabeza, niños" {...field} />
                                            </FormControl>
                                            <p className="text-[0.8rem] text-muted-foreground">
                                                Separa las palabras con comas. Ayudan a encontrar el medicamento más rápido.
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex flex-row-reverse sm:flex-row-reverse justify-start sm:justify-start gap-2">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 text-white">
                                Guardar Medicamento
                            </Button>
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
