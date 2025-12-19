
import { Star } from "lucide-react";

/**
 * Sección de testimonios (Social Proof) con enfoque local.
 */
export function Testimonials() {
  const reviews = [
    {
      name: "Dra. Elena Gómez",
      role: "Pediatra, CDMX",
      text: "Por fin dejé de pelear con los márgenes de Word. Mis recetas se ven más profesionales y tardo la mitad en consulta.",
    },
    {
      name: "Dr. Ricardo Sosa",
      role: "Ginecólogo, Monterrey",
      text: "Lo que más me gusta es que puedo seguir usando mi papelería impresa. No tuve que tirar nada y el ahorro de tiempo es real.",
    },
    {
      name: "Dra. Sofía Meza",
      role: "Médico General, Guadalajara",
      text: "Recetaz es tan simple que mi asistente aprendió a usarlo en 5 minutos. Ahora todo está más ordenado.",
    },
    {
      name: "Dr. Arturo Ruiz",
      role: "Internista, Puebla",
      text: "Poder ver cuántos pacientes atendí en la semana me ayuda mucho con mi administración. Excelente herramienta.",
    },
    {
      name: "Dr. Miguel Ángel Ortiz",
      role: "Dermatólogo, Querétaro",
      text: "Dejé de usar formatos de papel a mano y Word al mismo tiempo. RecetaZ es el punto medio perfecto.",
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Pensado para médicos que atienden en consultorio privado
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Cientos de médicos en México ya dejaron atrás las complicaciones de Word.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed">"{review.text}"</p>
              </div>
              <div className="border-t border-slate-50 pt-4">
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
