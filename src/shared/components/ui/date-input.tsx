import React, { useState, useEffect } from 'react';
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: Date;
    onDateChange: (date: Date | undefined) => void;
}

export function DateInput({ value, onDateChange, className, ...props }: DateInputProps) {
    const [inputValue, setInputValue] = useState("");

    // Sincronizar texto inputs cuando el valor externo (Date) cambia
    useEffect(() => {
        if (value instanceof Date && !isNaN(value.getTime())) {
            const d = value.getDate().toString().padStart(2, '0');
            const m = (value.getMonth() + 1).toString().padStart(2, '0');
            const y = value.getFullYear();
            setInputValue(`${d}/${m}/${y}`);
        } else if (!value) {
            setInputValue("");
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        const cleanVal = val.replace(/\s/g, '/').replace(/[^0-9/]/g, '');

        // Regex strict for complete date DD/MM/YYYY
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = cleanVal.match(dateRegex);

        if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);

            if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year > 1900 && year < 2100) {
                const newDate = new Date(year, month - 1, day);
                newDate.setHours(0, 0, 0, 0);
                onDateChange(newDate);
                return;
            }
        }

        // If empty
        if (val.trim() === "") {
            onDateChange(undefined);
        }
    };

    return (
        <Input
            {...props}
            type="text"
            placeholder="DD/MM/AAAA"
            value={inputValue}
            onChange={handleChange}
            className={cn("font-mono", className)}
            maxLength={10}
        />
    );
}
