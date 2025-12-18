
import Link from "next/link";
import { Pill } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

/**
 * Componente de barra de navegación para la landing page.
 * Incluye el logo, enlaces de navegación y botón de acción principal.
 */
export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
          <Pill size={24} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">Recetaz</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link href="#features" className="hover:text-blue-600 transition-colors">Características</Link>
        <Link href="#pricing" className="hover:text-blue-600 transition-colors">Precios</Link>
        <Link href="#faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
      </div>

      <div className="flex gap-4">
        <Link href="/demo">
           <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200">
             Empezar Gratis
           </Button>
        </Link>
      </div>
    </nav>
  );
}
