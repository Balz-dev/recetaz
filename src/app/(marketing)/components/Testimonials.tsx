
import { Star } from "lucide-react";

/**
 * Sección de testimonios (Social Proof).
 */
export function Testimonials() {
  const reviews = [
    {
      name: "Dr. Alejandro M.",
      role: "Dermatólogo",
      text: "Antes tardaba 5 minutos por receta manual. Con Recetaz tardo 30 segundos y se ve increíble en mis hojas membretadas.",
    },
    {
      name: "Dra. Sofía R.",
      role: "Pediatra",
      text: "Me encanta que puedo usar mis hojas de colores con ositos y el sistema imprime el texto perfectamente alineado.",
    },
    {
      name: "Dr. Carlos V.",
      role: "Ginecólogo",
      text: "Simple, rápido y sin suscripciones complicadas. Es exactamente lo que necesitaba para mi consultorio privado.",
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">
          Médicos felices, pacientes atendidos más rápido
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-6">"{review.text}"</p>
              <div>
                <p className="font-bold text-slate-900">{review.name}</p>
                <p className="text-sm text-slate-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
