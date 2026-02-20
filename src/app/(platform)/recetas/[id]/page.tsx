"use client"

import { useParams } from "next/navigation";
import { DetalleRecetaView } from "@/features/recetas/components/DetalleRecetaView";

export default function DetalleRecetaPage() {
    const params = useParams();

    // En Next.js el params.id puede ser string o array. Nos aseguramos de tener el string.
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!id) return null;

    return <DetalleRecetaView recetaId={id} />;
}
