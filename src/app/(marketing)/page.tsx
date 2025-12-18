
import type { Metadata } from 'next';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { FeatureSpotlight } from './components/FeatureSpotlight';
import { Benefits } from './components/Benefits';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';

export const metadata: Metadata = {
  title: 'Recetaz - Recetas Médicas Digitales en Segundos',
  description: 'Crea recetas médicas profesionales en segundos. Impresión híbrida para hojas membretadas, autocompletado inteligente y gestión de pacientes offline-first.',
};

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <FeatureSpotlight />
        <Benefits />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
