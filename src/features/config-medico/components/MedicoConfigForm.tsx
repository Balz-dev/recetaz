"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/shared/components/ui/button"
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
import { Textarea } from "@/shared/components/ui/textarea"
import { medicoService } from "@/features/config-medico/services/medico.service"
import { MedicoConfig } from "@/types"
import { useEffect, useState, useRef } from "react"
import { useToast } from "@/shared/components/ui/use-toast"
import { Loader2, Save, X, Upload } from "lucide-react"
import Image from "next/image"
import { SpecialtySelect } from "@/shared/components/catalog/SpecialtySelect"
import { cn } from "@/shared/lib/utils"

const medicoConfigSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre es requerido.",
    }),
    especialidad: z.string().min(2, {
        message: "La especialidad es requerida.",
    }),
    especialidadKey: z.string().min(1, {
        message: "Seleccione una especialidad válida.",
    }),
    cedula: z.string().min(5, {
        message: "La cédula es requerida.",
    }),
    telefono: z.string().min(5, {
        message: "El teléfono es requerido.",
    }),
    direccion: z.string().optional(),
    logo: z.string().optional(),
})

interface MedicoConfigFormProps {
    initialData?: MedicoConfig | null
    onCancel?: () => void
    hideSubmitButton?: boolean
}

export function MedicoConfigForm({ initialData, onCancel, hideSubmitButton = false }: MedicoConfigFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo || null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof medicoConfigSchema>>({
        resolver: zodResolver(medicoConfigSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            especialidad: initialData?.especialidad || "",
            especialidadKey: initialData?.especialidadKey || "",
            cedula: initialData?.cedula || "",
            telefono: initialData?.telefono || "",
            direccion: initialData?.direccion || "",
            logo: initialData?.logo || "",
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset(initialData)
            setLogoPreview(initialData.logo || null)
        }
    }, [initialData, form])

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 500 * 1024) {
                toast({
                    title: "Imagen demasiado grande",
                    description: "El tamaño máximo es de 500KB.",
                    variant: "destructive",
                })
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setLogoPreview(base64String)
                form.setValue("logo", base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveLogo = () => {
        setLogoPreview(null)
        form.setValue("logo", "")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const onSubmit = async (values: z.infer<typeof medicoConfigSchema>) => {
        setIsLoading(true)
        try {
            await medicoService.save(values)
            toast({
                title: "Configuración guardada",
                description: "Tus datos se han actualizado correctamente.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Hubo un problema al guardar los cambios.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form id="medico-config-form" onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col h-[75vh]", !onCancel && "h-auto space-y-6")}>
                <div className={cn("flex-1 overflow-y-auto p-6 pt-0 space-y-6", !onCancel && "overflow-visible p-0")}>
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Subir Logo
                                </Button>
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
                            name="especialidadKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Especialidad</FormLabel>
                                    <FormControl>
                                        <SpecialtySelect
                                            value={field.value}
                                            onValueChange={(key, label) => {
                                                field.onChange(key);
                                                form.setValue('especialidad', label);
                                            }}
                                        />
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
                </div>

                {!hideSubmitButton && (
                    <div className={cn("flex flex-row-reverse items-center justify-start gap-4 p-6 border-t sticky bottom-0 bg-background z-10", !onCancel && "relative border-t-0 p-0")}>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 text-white">
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
                        {onCancel && (
                            <Button variant="ghost" type="button" onClick={onCancel} className="text-slate-500 hover:bg-slate-100">
                                Cancelar
                            </Button>
                        )}
                    </div>
                )}
            </form>
        </Form>
    )
}
