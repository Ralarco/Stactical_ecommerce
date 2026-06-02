import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center bg-ink-black px-6 py-32 sm:px-8 overflow-hidden">
        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(201,169,110,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.06)_0%,transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-[768px] text-center">
          <p className="text-xs font-semibold tracking-[0.4em] text-gold uppercase">
            Diseñado para Extremos
          </p>
          <div className="mx-auto mt-6 h-[1px] w-16 bg-gold" />
          <h1 className="mt-10 font-heading text-6xl font-bold tracking-tighter leading-none text-pure-white sm:text-6xl md:text-6xl lg:text-7xl">
            INQUEBRANTABLE
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-sm font-light tracking-wider leading-relaxed text-pure-white/40 uppercase">
            Despojado de excesos. El pináculo de la utilidad acromática.
            <br className="hidden sm:block" />
            Plataforma ecommerce B2B/B2C integrada con SAP.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center border border-gold bg-gold px-8 py-3.5 text-xs font-bold tracking-[0.15em] uppercase text-ink-black no-underline transition-colors hover:bg-gold-light sm:w-auto"
            >
              Descubrir Equipo
            </Link>
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center border border-pure-white/20 bg-transparent px-8 py-3.5 text-xs font-medium tracking-[0.12em] uppercase text-pure-white/60 no-underline transition-colors hover:border-gold hover:text-gold sm:w-auto"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Status ─── */}
      <section className="bg-surface px-6 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <SectionHeader label="Estado del Sistema" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatusCard title="Frontend" status="Online" description="Next.js App Router" />
            <StatusCard title="Base de Datos" status="Conectado" description="PostgreSQL + Prisma" />
            <StatusCard title="Auth" status="Pendiente" description="BetterAuth" />
            <StatusCard title="SAP" status="Pendiente" description="Sincronización por eventos" />
          </div>
        </div>
      </section>

      {/* ─── Quick Access ─── */}
      <section className="bg-ink-black px-6 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <SectionHeader label="Acceso Rápido" dark />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickLink href="/login" title="Ingresar" description="Accede a tu cuenta" />
            <QuickLink href="/register" title="Registrarse" description="Crea una nueva cuenta" />
            <QuickLink href="/products" title="Colecciones" description="Catálogo de productos" />
          </div>
        </div>
      </section>

      {/* ─── Architecture ─── */}
      <section className="bg-surface px-6 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <SectionHeader label="Arquitectura" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ArchCard title="Tecnologías" items={[
              'Next.js 15 (App Router)',
              'TypeScript (modo estricto)',
              'TailwindCSS v4',
              'Prisma ORM + PostgreSQL',
              'BetterAuth (JWT + RBAC)',
              'Transbank Webpay Plus',
            ]} />
            <ArchCard title="Principios" items={[
              'Desarrollo basado en especificaciones',
              'Aislamiento del frontend de SAP',
              'Persistencia local primero',
              'Integración orientada a eventos',
              'Consistencia eventual',
              'Arquitectura basada en características',
            ]} />
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Sub-components ─── */

function SectionHeader({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <div className="h-[1px] w-8 bg-gold" />
      <h2 className={`text-xs font-semibold tracking-[0.25em] uppercase ${dark ? 'text-pure-white/50' : 'text-on-surface-variant'}`}>
        {label}
      </h2>
    </div>
  );
}

function StatusCard({ title, status, description }: { title: string; status: string; description: string }) {
  const isOnline = status === 'Online' || status === 'Connected';
  return (
    <div className="rounded-lg bg-pure-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.15em] uppercase text-on-surface">{title}</span>
        <span className={`inline-flex items-center gap-2 text-xs tracking-wider uppercase ${isOnline ? 'text-gold' : 'text-steel-gray'}`}>
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-gold' : 'bg-steel-gray'}`} />
          {status}
        </span>
      </div>
      <p className="text-sm text-on-surface-variant">{description}</p>
    </div>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-lg border border-pure-white/5 bg-pure-white/[0.02] p-8 no-underline transition-all hover:border-gold/20 hover:bg-pure-white/5"
    >
      <div>
        <span className="text-2xl font-bold tracking-tight text-pure-white transition-colors group-hover:text-gold">
          {title}
        </span>
        <p className="mt-2 text-sm text-pure-white/40">{description}</p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">Ir</span>
        <span className="inline-block h-[1px] w-6 bg-gold transition-all group-hover:w-12" />
      </div>
    </Link>
  );
}

function ArchCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-surface-container-high bg-pure-white p-8 sm:p-10">
      <h3 className="mb-6 text-xs font-bold tracking-[0.2em] text-gold uppercase">{title}</h3>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="inline-block h-[1px] w-5 shrink-0 bg-gold/40" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
