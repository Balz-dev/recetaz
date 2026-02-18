import { Metadata } from "next"
import { Hero } from "./components/Hero"
import { ProblemSolution } from "./components/ProblemSolution"
import { ComparisonSection } from "./components/ComparisonSection"
import { HowItWorks } from "./components/HowItWorks"
import { Features } from "./components/Features"
import { TrustSection } from "./components/TrustSection"
import { Pricing } from "./components/Pricing"
import { Philosophy } from "./components/Philosophy"
import { Confidence } from "./components/Confidence"
import { FAQ } from "./components/FAQ"
import { FooterCTA } from "./components/FooterCTA"

/**
 * Metadata SEO para la landing page.
 * Optimizada para palabras clave: software recetas médicas México, médicos independientes, sin word.
 */
export const metadata: Metadata = {
  title: "Software para Recetas Médicas en México | RecetaZ",
  description: "Deja de perder tiempo con Word o Excel. Crea recetas médicas profesionales en segundos. Sistema offline para médicos independientes en México.",
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
    description: "Olvídate de Word. Crea recetas médicas profesionales, gestiona pacientes y medicamentos en segundos. Funciona sin internet y con total privacidad.",
    type: "website",
    locale: "es_MX",
    url: "https://recetaz.vercel.app",
    siteName: "RecetaZ",
    images: [
      {
        url: "/og-image.png",
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
        "description": "Herramienta profesional para médicos en México que ayuda a generar recetas médicas rápidas y ordenadas, reutilizando información histórica y reemplazando el uso de Microsoft Word.",
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
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <TrustSection />
      <Pricing />
      <Confidence />
      <FAQ />
      <FooterCTA />
    </div>
  )
}
