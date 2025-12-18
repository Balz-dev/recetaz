
import Link from "next/link";
import { Pill } from "lucide-react";

/**
 * Footer de la aplicación.
 */
export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4 text-white">
            <div className="bg-blue-600 p-1 rounded text-white">
              <Pill size={20} />
            </div>
            <span className="text-lg font-bold">Recetaz</span>
          </Link>
          <p className="text-sm max-w-sm mb-6">
            La plataforma moderna para médicos que valoran su tiempo.
            Haz recetas en segundos, no minutos.
          </p>
          <p className="text-xs text-slate-600">© 2025 Recetaz Inc. Todos los derechos reservados.</p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Producto</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#features" className="hover:text-blue-400 transition-colors">Características</Link></li>
            <li><Link href="#pricing" className="hover:text-blue-400 transition-colors">Precios</Link></li>
            <li><Link href="/demo" className="hover:text-blue-400 transition-colors">Demo Gratis</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Legales</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Términos de Servicio</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Política de Privacidad</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Contacto</Link></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
