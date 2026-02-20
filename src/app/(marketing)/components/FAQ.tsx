"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { useMetrics } from "@/shared/hooks/useMetrics"

/**
 * Sección de Preguntas Frecuentes (FAQ).
 */
export function FAQ() {
  const faqs = [
    {
      question: "¿Puedo usar mi propia receta membretada?",
      answer: "Sí, ese es el punto fuerte de RecetaZ. Subes la imagen de tu receta y colocas los campos donde quieras."
    },
    {
      question: "¿Qué pasa si no tengo receta membretada?",
      answer: "Puedes usar nuestras plantillas profesionales y personalizarlas con tu logo y datos."
    },
    {
      question: "¿Cómo funciona el autocompletado?",
      answer: "RecetaZ recuerda información previamente registrada por ti. Si recetas ciprofloxacino para gastroenteritis, la próxima vez que escribas \"gastro...\" te mostrará el medicamento que usaste antes."
    },
    {
      question: "¿RecetaZ es un sistema de receta electrónica oficial?",
      answer: "No. RecetaZ no es un sistema de receta electrónica oficial ni genera recomendaciones médicas. Es una herramienta de productividad para imprimir sobre tus formatos físicos."
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Absolutamente. Todo se guarda en tu dispositivo con encriptación. Ni nosotros tenemos acceso a tu información."
    },
    {
      question: "¿Qué incluye el backup automático del plan PRO?",
      answer: "Respaldos periódicos a tu Google Drive personal, como WhatsApp. Tú controlas la frecuencia."
    },
    {
      question: "¿Necesito internet?",
      answer: "No. RecetaZ funciona offline. Solo necesitas internet para backups automáticos (PRO)."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { trackMarketing } = useMetrics()

  const toggleFaq = (index: number) => {
    const isOpening = openIndex !== index
    if (isOpening) {
      trackMarketing('lp_faq_question_expanded', { question: faqs[index].question })
    }
    setOpenIndex(isOpening ? index : null)
  }

  return (
    <section className="py-24 bg-white dark:bg-[#0F172A]" id="faq">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Resolvemos tus dudas sobre cómo RecetaZ se adapta a tu consulta.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {faq.question}
                </span>
                {openIndex === i ? (
                  <Minus className="h-5 w-5 text-blue-600 flex-shrink-0 ml-4" />
                ) : (
                  <Plus className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
                )}
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
