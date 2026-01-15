/**
 * Calcula la edad en formato detallado para menores de 5 años.
 * Reglas médicas:
 * - 0-28 días: Solo días (ej: "10d")
 * - 29 días-11 meses: Meses y días (ej: "3m 5d")
 * - 1-4 años 11 meses: Años, meses y días (ej: "2a 4m 11d")
 * - ≥5 años: Solo años como número (ej: "5", "10")
 * 
 * @param birthDate Fecha de nacimiento del paciente
 * @returns Edad formateada según las reglas médicas
 */
export function calculatePediatricAge(birthDate: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dob = new Date(birthDate);
    dob.setHours(0, 0, 0, 0);

    if (dob > today) return "0d";

    // Calcular diferencia total
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    // Ajustar si los días son negativos
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // Ajustar si los meses son negativos
    if (months < 0) {
        years--;
        months += 12;
    }

    // Calcular edad total en días para regla de 0-28 días
    const totalDays = Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));

    // Regla 1: 0-28 días → solo días
    if (totalDays <= 28) {
        return `${totalDays}d`;
    }

    // Regla 2: 29 días-11 meses → meses y días
    if (years === 0 && months < 12) {
        if (days === 0) {
            return `${months}m`;
        }
        return `${months}m ${days}d`;
    }

    // Regla 3: 1-4 años 11 meses → años, meses y días
    if (years >= 1 && years < 5) {
        const parts = [`${years}a`];
        if (months > 0) parts.push(`${months}m`);
        if (days > 0) parts.push(`${days}d`);
        return parts.join(" ");
    }

    // Regla 4: ≥5 años → solo años como número
    return `${years}`;
}
