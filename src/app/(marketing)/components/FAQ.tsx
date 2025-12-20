"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

/**
 * Sección de Preguntas Frecuentes (FAQ).
 */
export function FAQ() {
  const faqs = [
    {
      question: "¿Necesito internet para usar RecetaZ?",
      answer: "No. RecetaZ funciona incluso si no hay conexión en tu consultorio. La información se guarda en tu dispositivo para que puedas seguir trabajando sin interrupciones."
    },
    {
      question: "¿RecetaZ es una receta electrónica con validación COFEPRIS?",
      answer: "No. RecetaZ es una herramienta de productividad diseñada para imprimir sobre tus propias recetas membretadas físicas. No es un sistema de receta electrónica oficial."
    },
    {
      question: "¿Dónde se guarda la información de mis pacientes?",
      answer: "Toda la información de tus pacientes se guarda de manera local y segura en tu propia computadora o dispositivo. Tú eres el único dueño y responsable de tu información."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
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
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
