
import type { Metadata } from 'next';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { FeatureSpotlight } from './components/FeatureSpotlight';
import { Benefits } from './components/Benefits';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export const metadata: Metadata = {
  title: 'Recetaz - Software Médico para Imprimir Recetas en Segundos',
  description: 'La forma más rápida de crear e imprimir recetas médicas. Software offline-first compatible con tus hojas membretadas. Prueba gratis hoy.',
  keywords: ['recetas medicas', 'software medico', 'imprimir recetas', 'historial clinico', 'expediente electronico', 'app para doctores', 'recetaz'],
  authors: [{ name: 'Recetaz Inc.' }],
  creator: 'Recetaz Team',
  publisher: 'Recetaz Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Recetaz - Tu receta lista en 30 segundos',
    description: 'Olvídate de Word. Usa la herramienta diseñada para médicos que quieren velocidad y profesionalismo. Impresión híbrida incluida.',
    url: 'https://recetaz.app',
    siteName: 'Recetaz',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recetaz - Recetas Médicas Rápidas',
    description: 'Genera recetas profesionales en segundos. Compatible con cualquier impresora y hoja membretada.',
    creator: '@recetaz_app',
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
};

export default function MarketingPage() {
  
  // JSON-LD para SoftwareApplication y FAQ
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Recetaz",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web, Windows, macOS, Android, iOS",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "MXN",
          "url": "https://recetaz.app/precios"
        },
        "description": "Software médico para la gestión rápida de recetas y pacientes. Funciona offline y permite impresión híbrida sobre hojas membretadas.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "120"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Recetaz funciona sin internet?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí. Recetaz es una PWA Offline-First que permite crear recetas y gestionar pacientes sin conexión."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo usar mis hojas membretadas actuales?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutamente. La función de Impresión Híbrida ajusta la impresión para usar solo el espacio necesario en tus hojas existentes."
            }
          },
          {
             "@type": "Question",
             "name": "¿Tiene costo?",
             "acceptedAnswer": {
               "@type": "Answer",
               "text": "Existe un plan gratuito mensual de 50 recetas. Los planes de pago comienzan desde $299 MXN al mes."
             }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <FeatureSpotlight />
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
