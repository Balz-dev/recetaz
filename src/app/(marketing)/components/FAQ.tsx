
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "¿Recetaz funciona sin internet?",
      answer: "Sí. Recetaz es una PWA Offline-First. Esto significa que puedes crear recetas, guardar pacientes y consultar el historial sin conexión a internet. Los datos se sincronizan automáticamente cuando vuelves a conectarte."
    },
    {
      question: "¿Puedo usar mis hojas membretadas actuales?",
      answer: "Absolutamente. Nuestra función de 'Impresión Híbrida' te permite calibrar los márgenes para que imprimamos SOLO los datos del paciente y medicamentos sobre tu hoja actual, sin desperdiciar tinta en el fondo."
    },
    {
      question: "¿Es seguro mi historial clínico?",
      answer: "Tus datos viven en tu dispositivo (encriptados en el navegador). No compartimos información con terceros y cumplimos con la normativa de privacidad. Tú eres el único dueño de tu información."
    },
    {
      question: "¿Qué pasa si cambio de computadora?",
      answer: "Puedes exportar tu base de datos completa y restaurarla en cualquier otro dispositivo en segundos. En la versión Cloud (próximamente), tendrás sincronización automática entre dispositivos."
    },
    {
      question: "¿Cuánto cuesta realmente?",
      answer: "Tienes un plan gratuito de por vida con 50 recetas mensuales. Si necesitas más, el plan Pro cuesta $299 MXN al mes. También ofrecemos un pago único de por vida por lanzamiento."
    }
  ];

  return (
    <section id="faq" className="py-24 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Preguntas Frecuentes</h2>
        <p className="text-center text-slate-600 mb-12">
          Todo lo que necesitas saber antes de empezar.
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
    <div className="border-b border-slate-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-left group"
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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-600 leading-relaxed text-sm">
          {answer}
        </p>
      </div>
    </div>
  );
}

