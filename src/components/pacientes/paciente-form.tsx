"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { pacienteService } from "@/lib/db/pacientes"
import { PacienteFormData, Paciente } from "@/types"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const pacienteFormSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre es requerido.",
    }),
    edad: z.coerce.number().optional(), // Can be empty or 0, simple number coercion
    telefono: z.string().optional(),
    email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
    direccion: z.string().optional(),
    alergias: z.string().optional(),
    antecedentes: z.string().optional(),
})

interface PacienteFormProps {
    initialData?: Paciente
    isEditing?: boolean
    afterSave?: (newPacienteId: string) => void
    onCancel?: () => void
}

export function PacienteForm({ initialData, isEditing = false, afterSave, onCancel }: PacienteFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<PacienteFormData>({
        resolver: zodResolver(pacienteFormSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            edad: initialData?.edad, // Undefined by default to avoid 0
            telefono: initialData?.telefono || "",
            email: initialData?.email || "",
            direccion: initialData?.direccion || "",
            alergias: initialData?.alergias || "",
            antecedentes: initialData?.antecedentes || "",
        },
    })

    async function onSubmit(values: PacienteFormData) {
        setIsLoading(true)
        try {
            let pacienteId = "";
            if (isEditing && initialData) {
                await pacienteService.update(initialData.id, values)
                pacienteId = initialData.id;
                toast({
                    title: "Paciente actualizado",
                    description: "Los datos del paciente se han guardado correctamente.",
                })
            } else {
                pacienteId = await pacienteService.create(values)
                toast({
                    title: "Paciente registrado",
                    description: "El nuevo paciente ha sido creado exitosamente.",
                })
            }

            if (afterSave) {
                afterSave(pacienteId)
            } else {
                router.push("/pacientes")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Hubo un problema al guardar el paciente.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/pacientes">
                        <Button variant="ghost" size="icon" type="button">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold">
                        {isEditing ? "Editar Paciente" : "Nuevo Paciente"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del paciente" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="edad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Edad</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        value={field.value ?? ""} // Handle undefined/null to show empty or placeholder
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val === "" ? undefined : Number(val));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input placeholder="Número de contacto" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="correo@ejemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Dirección completa" className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="alergias"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-red-600 font-medium">Alergias</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Lista de alergias conocidas..."
                                        className="resize-none border-red-100 focus:border-red-400"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="antecedentes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Antecedentes Médicos</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enfermedades crónicas, cirugías previas..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    {onCancel ? (
                        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
                    ) : (
                        <Link href="/pacientes">
                            <Button variant="outline" type="button">Cancelar</Button>
                        </Link>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Paciente
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
