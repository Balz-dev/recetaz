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
import { DiagnosticoCatalogo as Diagnostico } from "@/types"
import { useToast } from "@/shared/components/ui/use-toast"
import { useEffect } from "react"

const formSchema = z.object({
    codigo: z.string().optional(),
    nombre: z.string().min(2, {
        message: "El nombre es requerido.",
    }),
})

interface DiagnosticoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Diagnostico | null
    isEditing?: boolean
}

export function DiagnosticoDialog({
    open,
    onOpenChange,
    initialData,
    isEditing = false,
}: DiagnosticoDialogProps) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            codigo: "",
            nombre: "",
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                codigo: initialData.codigo || "",
                nombre: initialData.nombre,
            })
        } else {
            form.reset({
                codigo: "",
                nombre: "",
            })
        }
    }, [initialData, form, open])

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            const diagnosticoData: Partial<Diagnostico> = {
                ...values,
            }

            if (isEditing && initialData?.id) {
                await diagnosticoService.update(initialData.id, diagnosticoData)
                toast({
                    title: "Diagnóstico actualizado",
                    description: "Los cambios se han guardado correctamente.",
                })
            } else {
                await diagnosticoService.create(diagnosticoData as Diagnostico)
                toast({
                    title: "Diagnóstico creado",
                    description: "El diagnóstico se ha añadido a tu catálogo.",
                })
            }

            onOpenChange(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un problema al guardar el diagnóstico.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Diagnóstico" : "Nuevo Diagnóstico"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="codigo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Código (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: CIE-10" {...field} />
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
                                            <FormLabel>Nombre del Diagnóstico</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Faringitis Aguda" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="sm:flex-row-reverse sm:justify-start">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 text-white">
                                Guardar Diagnóstico
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
