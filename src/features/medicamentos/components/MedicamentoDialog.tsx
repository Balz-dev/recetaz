
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
    nombreGenerico: z.string().optional(),
    categoria: z.string().optional(),
    palabrasClave: z.string().optional(),
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
            nombreGenerico: "",
            categoria: "",
            palabrasClave: "",
        },
    })

    useEffect(() => {
        if (medicamento) {
            form.reset({
                nombre: medicamento.nombre,
                presentacion: medicamento.presentacion || "",
                nombreGenerico: medicamento.nombreGenerico || "",
                categoria: medicamento.categoria || "",
                palabrasClave: medicamento.palabrasClave ? medicamento.palabrasClave.join(", ") : "",
            })
        } else {
            form.reset({
                nombre: "",
                presentacion: "",
                nombreGenerico: "",
                categoria: "",
                palabrasClave: "",
            })
        }
    }, [medicamento, form, open])

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        // Procesar palabras clave: de string separado por comas a array
        const palabrasClaveArray = values.palabrasClave
            ? values.palabrasClave.split(',').map(s => s.trim()).filter(s => s.length > 0)
            : undefined;

        // Agregar campos requeridos por MedicamentoCatalogoFormData
        const medicamentoData: MedicamentoCatalogoFormData = {
            nombre: values.nombre,
            presentacion: values.presentacion,
            nombreGenerico: values.nombreGenerico,
            categoria: values.categoria,
            palabrasClave: palabrasClaveArray,
            esPersonalizado: true, // Siempre es personalizado cuando se agrega desde el diálogo
            sincronizado: false,
        }
        await onSubmit(medicamentoData)
        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>
                        {medicamento ? "Editar Medicamento" : "Nuevo Medicamento"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nombre Comercial</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Tylenol" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nombreGenerico"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre Genérico</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Paracetamol" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoria"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Analgésico" {...field} />
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
                                            <Input placeholder="Ej: Caja con 10 tabletas" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="palabrasClave"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Palabras Clave (Opcional)</FormLabel>
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
