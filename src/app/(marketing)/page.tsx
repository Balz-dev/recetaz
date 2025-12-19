
import type { Metadata } from 'next';
import { HeroAlternative } from './components/HeroAlternative';
import { ComparisonSection } from './components/ComparisonSection';
import { VisualSteps } from './components/VisualSteps';
import { TrustSection } from './components/TrustSection';
import { FAQ } from './components/FAQ'; // Reutilizamos FAQ por ser robusto, pero lo integramos mejor
import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RecetaZ | Profesionaliza tu consulta sin complicaciones',
  description: 'Deja atrás el caos de Word. RecetaZ es la herramienta diseñada para médicos independientes en México que valoran su tiempo e imagen profesional.',
  keywords: [
    'recetas medicas profesionales', 
    'orden en consultorio medico', 
    'alternativa a word para medicos', 
    'impresion de recetas mexico', 
    'software medico minimalista'
  ],
  openGraph: {
    title: 'RecetaZ - Claridad Profesional para Médicos',
    description: 'Moderniza tu práctica privada. Genera recetas perfectas sobre tus hojas membretadas en segundos.',
    url: 'https://recetaz.mx',
    siteName: 'RecetaZ',
    locale: 'es_MX',
    type: 'website',
  },
};

/**
 * Landing page v2: Professional Clarity Edition.
 */
export default function MarketingPage() {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "RecetaZ",
        "applicationCategory": "MedicalBusinessApplication",
        "operatingSystem": "Web",
        "description": "Aplicación web enfocada en la eficiencia y profesionalismo del médico independiente, permitiendo la generación rápida de recetas sobre papelería membretada física.",
        "audience": { "@type": "Audience", "audienceType": "Medical professionals" },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "MXN",
          "description": "Acceso gratuito inicial"
        }
      }
    ]
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navbar Minimalista */}
      <nav className="absolute top-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
              <div className="text-2xl font-black tracking-tighter text-white">
                  Receta<span className="text-blue-500">Z</span>
              </div>
              <div className="flex items-center gap-8">
                  <Link href="/demo" className="hidden md:block text-slate-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase">
                    Tour del Producto
                  </Link>
                  <Link href="/demo">
                      <Button variant="outline" className="border-slate-700 text-white hover:bg-white hover:text-black rounded-full px-6 transition-all">
                          Ver Demo
                      </Button>
                  </Link>
              </div>
          </div>
      </nav>

      <main>
        <HeroAlternative />

        {/* Brand Statement / SEO Focus */}
        <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-blue-600 mb-6 underline decoration-blue-100 underline-offset-4">Manifesto de Claridad</h2>
                <p className="text-2xl md:text-3xl font-light text-slate-600 leading-relaxed">
                    RecetaZ nació para eliminar la fricción entre el médico y la tecnología. 
                    No es una herramienta compleja; es la forma más pura de <span className="text-slate-900 font-medium italic underline decoration-blue-500">recuperar tu tiempo</span> y proyectar el profesionalismo que tus pacientes merecen.
                </p>
            </div>
        </section>

        <ComparisonSection />
        <VisualSteps />
        <TrustSection />
        <FAQ />

        {/* Dark Mode Final CTA */}
        <section className="py-40 px-6 bg-[#0A0F1C] text-white text-center relative overflow-hidden">
             <div className="max-w-3xl mx-auto relative z-10 space-y-12">
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter">
                    Toma el control de tu consulta.
                </h2>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    Únete a la nueva generación de médicos que valoran la simplicidad y el orden sobre las herramientas genéricas.
                </p>
                <div className="pt-8">
                    <Link href="/demo">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-2xl px-16 h-20 shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] group">
                            Probar Gratis Ahora <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
             </div>
             
             {/* Background glow stuff */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-0"></div>
        </section>
      </main>

      <footer className="py-16 px-6 bg-white border-t border-slate-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
              <div className="space-y-4">
                  <div className="text-2xl font-black tracking-tighter">
                    Receta<span className="text-blue-600">Z</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed font-light">
                    Soluciones de productividad para el médico moderno en México.
                  </p>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Producto</h4>
                  <ul className="space-y-4 text-slate-500">
                      <li><Link href="/demo" className="hover:text-blue-600">Demo Interactiva</Link></li>
                      <li><a href="#" className="hover:text-blue-600 line-through opacity-50">Precios (Próximamente)</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Compañía</h4>
                  <ul className="space-y-4 text-slate-500">
                      <li><a href="#" className="hover:text-blue-600">Manifesto</a></li>
                      <li><a href="#" className="hover:text-blue-600">Contacto</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Legal</h4>
                  <ul className="space-y-4 text-slate-500">
                      <li><a href="#" className="hover:text-blue-600">Aviso de Privacidad</a></li>
                      <li><a href="#" className="hover:text-blue-600">Términos de Servicio</a></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto pt-16 border-t border-slate-50 mt-16 text-xs text-slate-400 tracking-[0.2em] uppercase text-center md:text-left">
            RecetaZ © 2025. Todos los derechos reservados.
          </div>
      </footer>
    </div>
  );
}
