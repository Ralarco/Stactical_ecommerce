import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ink-black">
      <div className="h-[1px] w-full bg-gold" />

      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 sm:px-8 lg:px-12">
        {/* Top */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-heading text-sm font-bold tracking-[0.2em] text-pure-white uppercase">
              Stactical
            </p>
            <p className="mt-2 text-xs tracking-[0.1em] text-pure-white/40 uppercase">
              Diseñado para extremos
            </p>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8">
            {['Política de Privacidad', 'Términos de Servicio', 'Envíos y Devoluciones', 'Contacto'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs tracking-[0.1em] text-pure-white/40 no-underline uppercase transition-colors hover:text-gold"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-pure-white/10 pt-8">
          <p className="text-center text-xs tracking-[0.1em] text-pure-white/30 uppercase">
            © {new Date().getFullYear()} Stactical. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
