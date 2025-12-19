
/**
 * TrustSection: Prueba social filtrada por especialidad.
 * Enfoque en la tranquilidad del profesional.
 */
export function TrustSection() {
  const testimonials = [
    {
      quote: "Antes mi asistente tenía que reescribir todo en Word. Ahora ella captura los datos y yo solo firmo con confianza.",
      author: "Dra. Elena Gómez",
      specialty: "Pediatría"
    },
    {
      quote: "Me preocupaba que el software fuera difícil de usar, pero configuré mi receta en menos de 10 minutos.",
      author: "Dr. Ricardo Sosa",
      specialty: "Ginecología"
    },
    {
      quote: "Poder ver mis ingresos semanales al final de cada consulta me da una claridad administrativa que no tenía antes.",
      author: "Dr. Arturo Ruiz",
      specialty: "Medicina Interna"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    Profesionales que ya eligieron la <span className="text-blue-600 underline">claridad</span>.
                </h2>
                <div className="mt-8 h-1 w-20 bg-blue-600"></div>
                <p className="mt-8 text-slate-500 italic">
                    Únete a los médicos independientes que están modernizando su práctica privada sin complicaciones.
                </p>
            </div>
            
            <div className="md:w-2/3 grid gap-6">
                {testimonials.map((t, i) => (
                    <div key={i} className="bg-white p-8 border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-lg text-slate-700 font-light italic leading-relaxed mb-6">"{t.quote}"</p>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{t.author}</span>
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">{t.specialty}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
