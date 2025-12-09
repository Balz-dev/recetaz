import { PlantillaEditor } from "@/features/recetas/components/PlantillaEditor"

export default async function EditarPlantillaPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return (
        <div className="container mx-auto py-6">
            <PlantillaEditor plantillaId={params.id} />
        </div>
    )
}
