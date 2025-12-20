import { Metadata } from "next"
import { Hero } from "./components/Hero"
import { ComparisonSection } from "./components/ComparisonSection"
import { HowItWorks } from "./components/HowItWorks"
import { Features } from "./components/Features"
import { Pricing } from "./components/Pricing"
import { Philosophy } from "./components/Philosophy"
import { Confidence } from "./components/Confidence"
import { FAQ } from "./components/FAQ"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Metadata SEO para la landing page.
 * Siguiendo las mejores prácticas para Micro-SaaS B2B.
 */
export const metadata: Metadata = {
  title: "RecetaZ | Deja de hacer recetas en Word",
  description: "La forma más rápida y profesional de generar recetas médicas en México. Diseña tu propia receta membretada, captura pacientes y ahorra tiempo. Prueba la demo gratis.",
  keywords: ["receta medica", "software medico", "mexico", "recetario", "word vs recetaz", "digitalizar consultorio"],
  openGraph: {
    title: "RecetaZ | Recetas médicas profesionales en segundos",
    description: "Deja de usar Word. Usa tu propia receta membretada con más rapidez y orden. Diseñado para médicos independientes en México.",
    type: "website",
    locale: "es_MX",
    url: "https://recetaz.com",
    siteName: "RecetaZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecetaZ | Deja de hacer recetas en Word",
    description: "Genera recetas médicas profesionales en segundos usando tus propias hojas membretadas.",
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
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "description": "Micro-SaaS para médicos en México que ayuda a generar recetas médicas rápidas y ordenadas, reemplazando el uso de Microsoft Word.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "MXN",
      "lowPrice": "149",
      "highPrice": "299",
      "offerCount": "2"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Independent Doctors and Clinics"
    },
    "featureList": [
      "Diseño de recetas personalizadas",
      "Gestión de historial de pacientes",
      "Catálogo de medicamentos frecuentes",
      "Funcionamiento offline-first",
      "Panel de analytics de consultas"
    ]
  }

  return (
    <div className="flex flex-col gap-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <Hero />
      <ComparisonSection />
      <HowItWorks />
      <Features />
      <Philosophy />
      <Pricing />
      <Confidence />
      <FAQ />
      
      {/* Sección Final CTA */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center text-white">
          <h2 className="text-3xl sm:text-6xl font-extrabold mb-6 tracking-tight">
            ¿Listo para modernizar tu consulta?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a los médicos que ya ahorran horas a la semana dejando atrás el desorden de Word. 
            <strong> 14 días gratis, sin tarjetas.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="group w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-xl font-bold text-blue-600 hover:bg-slate-50 transition-all shadow-2xl hover:shadow-white/20 active:scale-95"
            >
              Empezar mi prueba gratuita
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="mt-8 text-sm text-blue-200 opacity-80">
            Sin instalación compleja. Funciona directamente en tu navegador.
          </p>
        </div>
        
        {/* Decoración premium */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-white rounded-full mix-blend-soft-light filter blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-300 rounded-full mix-blend-soft-light filter blur-[140px] opacity-20"></div>
      </section>
    </div>
  )
}
