"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { medicoService } from "@/lib/db/medico"
import { MedicoConfigFormDataWithoutLogo } from "@/types"
import { useEffect, useState, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Upload, X } from "lucide-react"
import Image from "next/image"

// Esquema de validación con Zod
const medicoFormSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
    especialidad: z.string().min(2, {
        message: "La especialidad es requerida.",
    }),
    cedula: z.string().min(5, {
        message: "La cédula es requerida.",
    }),
    telefono: z.string().min(8, {
        message: "El teléfono debe tener al menos 8 caracteres.",
    }),
    direccion: z.string().optional(),
})

interface MedicoConfigFormProps {
    onSuccess?: () => void;
}

export function MedicoConfigForm({ onSuccess }: MedicoConfigFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [logoBase64, setLogoBase64] = useState<string | undefined>(undefined)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    // Inicializar formulario
    const form = useForm<MedicoConfigFormDataWithoutLogo>({
        resolver: zodResolver(medicoFormSchema),
        defaultValues: {
            nombre: "",
            especialidad: "",
            cedula: "",
            telefono: "",
            direccion: "",
        },
    })

    // Cargar datos existentes al montar
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await medicoService.get()
                if (data) {
                    form.reset({
                        nombre: data.nombre,
                        especialidad: data.especialidad,
                        cedula: data.cedula,
                        telefono: data.telefono,
                        direccion: data.direccion || "",
                    })
                    if (data.logo) {
                        setLogoPreview(data.logo)
                        setLogoBase64(data.logo)
                    }
                }
            } catch (error) {
                console.error("Error cargando datos del médico:", error)
            }
        }
        loadData()
    }, [form])

    // Convertir imagen a Base64
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validar tamaño (máx 500KB)
        if (file.size > 500 * 1024) {
            toast({
                title: "Archivo muy grande",
                description: "El logo debe ser menor a 500KB",
                variant: "destructive",
            })
            return
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Formato inválido",
                description: "Solo se permiten imágenes",
                variant: "destructive",
            })
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            setLogoPreview(base64String)
            setLogoBase64(base64String)
        }
        reader.readAsDataURL(file)
    }

    // Eliminar logo
    const handleRemoveLogo = () => {
        setLogoPreview(null)
        setLogoBase64(undefined)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Manejar envío del formulario
    async function onSubmit(values: MedicoConfigFormDataWithoutLogo) {
        setIsLoading(true)
        try {
            await medicoService.save({
                ...values,
                logo: logoBase64,
            })
            toast({
                title: "Configuración guardada",
                description: "Los datos del médico han sido actualizados correctamente.",
            })
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Hubo un problema al guardar la configuración.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Logo Institucional */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Logo Institucional (Opcional)</label>
                        <p className="text-sm text-muted-foreground">Aparecerá en las recetas PDF. Tamaño máximo: 500KB</p>
                    </div>

                    {logoPreview ? (
                        <div className="flex items-start gap-4">
                            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-white">
                                <Image
                                    src={logoPreview}
                                    alt="Logo preview"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleRemoveLogo}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Eliminar
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                                id="logo-upload"
                            />
                            <label htmlFor="logo-upload">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    asChild
                                >
                                    <span>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Subir Logo
                                    </span>
                                </Button>
                            </label>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dr. Juan Pérez" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="especialidad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Especialidad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Medicina General" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cedula"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cédula Profesional</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345678" {...field} />
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
                                    <Input placeholder="+52 55 1234 5678" {...field} />
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
                            <FormLabel>Dirección del Consultorio (Opcional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Av. Principal #123, Col. Centro"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Esta dirección aparecerá en el pie de página de las recetas.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Configuración
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}
