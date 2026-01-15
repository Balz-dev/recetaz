/**
 * @fileoverview Componente compartido para la selección de especialidad médica.
 * 
 * Centraliza la carga desde el catálogo y el comportamiento del dropdown.
 */

"use client";

import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { db } from "@/shared/db/db.config";
import { EspecialidadCatalogo } from "@/types";

interface SpecialtySelectProps {
    value?: string;
    onValueChange: (key: string, label: string) => void;
    placeholder?: string;
    className?: string;
    /** Z-index personalizado para el dropdown (útil en modales) */
    contentClassName?: string;
}

export function SpecialtySelect({
    value,
    onValueChange,
    placeholder = "Seleccione su especialidad",
    className,
    contentClassName = "z-[250]"
}: SpecialtySelectProps) {
    const [especialidades, setEspecialidades] = useState<EspecialidadCatalogo[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await db.especialidades.toArray();
            setEspecialidades(data);
        };
        load();
    }, []);

    return (
        <Select
            key={`specialty-select-${especialidades.length}`}
            value={value}
            onValueChange={(val) => {
                const spec = especialidades.find(e => e.id === val);
                onValueChange(val, spec?.label || '');
            }}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
                {especialidades.map((esp) => (
                    <SelectItem key={esp.id} value={esp.id}>
                        {esp.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
