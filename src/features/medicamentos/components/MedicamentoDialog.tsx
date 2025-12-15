
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
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MedicamentoCatalogo, MedicamentoCatalogoFormData } from "@/types"
import { useEffect } from "react"

const formSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    presentacion: z.string().optional(),
})

interface MedicamentoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: MedicamentoCatalogoFormData) => Promise<void>
    medicamento?: MedicamentoCatalogo | null
}

export function MedicamentoDialog({
    open,
    onOpenChange,
    onSubmit,
    medicamento
}: MedicamentoDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            presentacion: "",
        },
    })

    useEffect(() => {
        if (medicamento) {
            form.reset({
                nombre: medicamento.nombre,
                presentacion: medicamento.presentacion || "",
            })
        } else {
            form.reset({
                nombre: "",
                presentacion: "",
            })
        }
    }, [medicamento, form, open])

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        await onSubmit(values)
        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {medicamento ? "Editar Medicamento" : "Nuevo Medicamento"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Comercial / Genérico</FormLabel>
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
                                    <FormLabel>Presentación (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Tabletas 500mg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
