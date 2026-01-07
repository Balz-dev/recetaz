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
 * Optimizada para palabras clave: software recetas médicas México, médicos independientes, sin word.
 */
export const metadata: Metadata = {
  title: "Software para Recetas Médicas en México | RecetaZ",
  description: "Genera recetas médicas profesionales sin usar Word. Sistema para consultorios en México: historial de pacientes, medicamentos y funcionamiento offline.",
  keywords: [
    "software recetas médicas México",
    "recetas digitales para doctores",
    "generador de recetas médicas",
    "sistema recetas consultorio",
    "recetas sin Word",
    "herramienta prescripción médica",
    "médicos independientes",
    "sin internet"
  ],
  metadataBase: new URL('https://recetaz.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "RecetaZ | El Software de Recetas para Médicos Mexicanos",
    description: "Olvídate de Word. Crea recetas médicas profesionales, gestiona pacientes y medicamentos en segundos. Funciona sin internet.",
    type: "website",
    locale: "es_MX",
    url: "https://recetaz.vercel.app",
    siteName: "RecetaZ",
    images: [
      {
        url: "/og-image.png", // Asumiendo que existirá o usar fallback
        width: 1200,
        height: 630,
        alt: "RecetaZ: Software de recetas médicas en México"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "RecetaZ | Generador de Recetas Médicas",
    description: "La herramienta esencial para el médico independiente en México. Rápida, segura y offline.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://recetaz.vercel.app/#organization",
        "name": "RecetaZ",
        "url": "https://recetaz.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://recetaz.vercel.app/fenotipo.svg",
          "width": 1214,
          "height": 276
        },
        "sameAs": [
          "https://twitter.com/recetaz",
          "https://facebook.com/recetaz"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "areaServed": "MX",
          "availableLanguage": "Spanish"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://recetaz.vercel.app/#software",
        "name": "RecetaZ",
        "applicationCategory": "MedicalApplication",
        "operatingSystem": "Web, Windows, macOS, Android, iOS",
        "description": "Micro-SaaS para médicos en México que ayuda a generar recetas médicas rápidas y ordenadas, reemplazando el uso de Microsoft Word.",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "MXN",
          "lowPrice": "149",
          "highPrice": "299",
          "offerCount": "2",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "120"
        },
        "featureList": [
          "Diseño de recetas personalizadas",
          "Gestión de historial de pacientes",
          "Catálogo de medicamentos frecuentes",
          "Funcionamiento offline-first",
          "Panel de analytics de consultas",
          "Impresión en hojas membretadas"
        ],
        "screenshot": "https://recetaz.vercel.app/word-recetaz.png",
        "author": {
          "@id": "https://recetaz.vercel.app/#organization"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://recetaz.vercel.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Necesito internet para usar RecetaZ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. RecetaZ funciona incluso si no hay conexión en tu consultorio. La información se guarda en tu dispositivo para que puedas seguir trabajando sin interrupciones."
            }
          },
          {
            "@type": "Question",
            "name": "¿RecetaZ es una receta electrónica con validación COFEPRIS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. RecetaZ es una herramienta de productividad diseñada para imprimir sobre tus propias recetas membretadas físicas. No es un sistema de receta electrónica oficial."
            }
          },
          {
            "@type": "Question",
            "name": "¿Dónde se guarda la información de mis pacientes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Toda la información de tus pacientes se guarda de manera local y segura en tu propia computadora o dispositivo. Tú eres el único dueño y responsable de tu información."
            }
          }
        ]
      }
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
            {/* Botón Secundario - Demo/Sandbox */}
            <Link
              href="/demo"
              className="group w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-white/30 bg-transparent px-10 py-5 text-xl font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-all active:scale-95"
            >
              Probar Demo Interactiva
            </Link>
            {/* Botón Principal - Dashboard/App Real */}
            <Link
              href="/dashboard"
              className="group w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-xl font-bold text-blue-600 hover:bg-slate-50 transition-all shadow-2xl hover:shadow-white/20 active:scale-95"
            >
              Comenzar mi prueba gratuita
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>


          </div>
          <p className="mt-6 text-sm text-blue-200 opacity-90">
            <span className="font-semibold">Demo:</span> Explora con datos de ejemplo, sin registro. <span className="mx-2">•</span> <span className="font-semibold">Prueba Gratis:</span> 14 días con tus datos reales.
          </p>
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
