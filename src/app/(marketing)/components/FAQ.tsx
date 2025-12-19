
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Sección de preguntas frecuentes enfocada en dudas de negocio y operatividad.
 */
export function FAQ() {
  const faqs = [
    {
      question: "¿Sigue siendo mi receta?",
      answer: "Sí. Tú diseñas el formato una sola vez para que coincida con tu hoja membretada tradicional. RecetaZ solo rellena los datos del paciente y el tratamiento."
    },
    {
      question: "¿Necesito internet?",
      answer: "No para el uso diario. RecetaZ funciona en tu dispositivo incluso sin conexión. Solo necesitas internet la primera vez que entras o para sincronizar tus datos."
    },
    {
      question: "¿Es receta electrónica?",
      answer: "No. RecetaZ es una herramienta de productividad para imprimir o generar PDFs de tu receta tradicional. Es tu receta de siempre, pero hecha de forma moderna."
    },
    {
      question: "¿Es complicado configurarlo?",
      answer: "Para nada. El diseño de tu plantilla se hace en un par de minutos arrastrando los campos a donde los necesites. Si sabes usar Facebook, sabes usar RecetaZ."
    }
  ];

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">Dudas comunes</h2>
        <p className="text-center text-slate-600 mb-12">
          Respuestas rápidas para que empieces hoy mismo.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 hover:border-blue-100">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 text-left group bg-white"
      >
        <span className={`font-semibold transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
        )}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 p-4 border-t border-slate-50' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}
