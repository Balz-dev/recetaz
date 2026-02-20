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
import { Card, CardContent } from "@/shared/components/ui/card"

const formSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre es requerido.",
    }),
    nombreGenerico: z.string().optional(),
    presentacion: z.string().min(2, {
        message: "La presentación es requerida.",
    }),
    formaFarmaceutica: z.string().optional(),
    concentracion: z.string().optional(),
    viaAdministracionDefault: z.string().optional(),
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
            nombreGenerico: "",
            presentacion: "",
            formaFarmaceutica: "",
            concentracion: "",
            viaAdministracionDefault: "",
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
                nombreGenerico: initialData.nombreGenerico || "",
                presentacion: initialData.presentacion || "",
                formaFarmaceutica: initialData.formaFarmaceutica || "",
                concentracion: initialData.concentracion || "",
                viaAdministracionDefault: initialData.viaAdministracionDefault || "",
                dosisDefault: initialData.dosisDefault || "",
                frecuenciaDefault: initialData.frecuenciaDefault || "",
                duracionDefault: initialData.duracionDefault || "",
                palabrasClave: initialData.palabrasClave?.join(", ") || "",
            })
        } else {
            form.reset({
                nombre: "",
                nombreGenerico: "",
                presentacion: "",
                formaFarmaceutica: "",
                concentracion: "",
                viaAdministracionDefault: "",
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
            <DialogContent className="max-w-3xl flex flex-col max-h-[90vh] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-slate-50">
                <DialogHeader className="p-6 pb-2 bg-white">
                    <DialogTitle className="text-2xl font-black text-slate-900">
                        {isEditing ? "Editar Medicamento" : "Nuevo Medicamento"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Información Principal */}
                            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                                <CardContent className="p-5 space-y-5 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="nombre"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500">Nombre Comercial</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ej: Tylenol"
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
                                            name="nombreGenerico"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500">Sustancia Activa</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Ej: Paracetamol"
                                                            {...field}
                                                            className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50/50"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="formaFarmaceutica"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500">Forma</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ej: Tabs" {...field} className="rounded-xl border-slate-200 h-9 text-xs" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="concentracion"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold text-slate-500">Concentración</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ej: 500mg" {...field} className="rounded-xl border-slate-200 h-9 text-xs" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="presentacion"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2 md:col-span-2">
                                                    <FormLabel className="text-xs font-bold text-slate-500">Presentación</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ej: Caja con 20 tabletas" {...field} className="rounded-xl border-slate-200 h-9 text-xs" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tratamiento por Defecto */}
                            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                                <CardContent className="p-5 space-y-5 bg-white">
                                    <h4 className="text-sm font-bold text-slate-800">Tratamiento por Defecto</h4>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dosisDefault"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel className="text-xs font-bold text-slate-500">Dosis</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="1 tableta" {...field} className="rounded-xl border-slate-200 h-9 text-xs font-semibold" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="frecuenciaDefault"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel className="text-xs font-bold text-slate-500">Frecuencia</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="c/8h" {...field} className="rounded-xl border-slate-200 h-9 text-xs" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="duracionDefault"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel className="text-xs font-bold text-slate-500">Duración</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="5 días" {...field} className="rounded-xl border-slate-200 h-9 text-xs" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="viaAdministracionDefault"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2 md:col-span-1">
                                                    <FormLabel className="text-xs font-bold text-slate-500">Vía</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Oral" {...field} className="rounded-xl border-slate-200 h-9 text-xs" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="palabrasClave"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-500">Palabras Clave (Etiquetas)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Tags para búsqueda: fiebre, dolor, pediátrico..."
                                                        {...field}
                                                        className="rounded-xl border-slate-200 border-dashed bg-slate-50/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
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
                                {isEditing ? "Guardar Cambios" : "Crear Medicamento"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
