import { Metadata } from "next"
import { Hero } from "./components/Hero"
import { ComparisonSection } from "./components/ComparisonSection"
import { HowItWorks } from "./components/HowItWorks"
import { Features } from "./components/Features"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Metadata SEO para la landing page.
 */
export const metadata: Metadata = {
  title: "RecetaZ | Deja de hacer recetas en Word",
  description: "La herramienta para médicos que desean dejar de usar Word. Genera recetas en segundos usando tus propias hojas membretadas. Rápido, ordenado y profesional.",
  openGraph: {
    title: "RecetaZ | Recetas médicas profesionales en segundos",
    description: "Diseña tu receta, captura pacientes y genera prescripciones rápidamente. El micro-SaaS para médicos independientes.",
    type: "website",
    locale: "es_MX",
    url: "https://recetaz.com", // Ajustar si es necesario
  },
  alternates: {
    canonical: "/",
  },
}

/**
 * Página principal (Landing Page) de RecetaZ.
 * 
 * @returns Componente JSX de la landing page.
 */
export default function LandingPage() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "RecetaZ",
    "applicationCategory": "MedicalBusinessApplication",
    "operatingSystem": "Web",
    "description": "Aplicación para médicos que quieren dejar de usar Word para hacer recetas. Permite diseñar plantillas de recetas y gestionar pacientes.",
    "offers": {
      "@type": "Offer",
      "price": "0", // Ajustar si hay planes
      "priceCurrency": "MXN"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Medical professionals"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <Hero />
      <ComparisonSection />
      <HowItWorks />
      <Features />
      
      {/* Sección Final CTA */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Empieza hoy mismo a digitalizar tu consultorio
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            No pierdas más tiempo en Word. RecetaZ es la herramienta que necesitas para verte más profesional y ahorrar tiempo.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-100 transition-all shadow-xl hover:shadow-white/10 active:scale-95"
          >
            Probar RecetaZ Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-6 text-sm text-blue-200">
            Sin tarjetas de crédito. Prueba la demo al instante.
          </p>
        </div>
        
        {/* Decoración */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-50"></div>
      </section>
    </>
  )
}
