import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-12">
      {/* Metrics */}
      <section>
        <h2 className="mb-6 text-xs font-semibold tracking-[0.2em] text-ink-black/60 uppercase">Resumen de Actividad</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Ventas Totales" value="$124,500" trend="+12.5%" />
          <MetricCard title="Órdenes Pendientes" value="34" trend="-2.4%" negative />
          <MetricCard title="Nuevos Usuarios" value="128" trend="+18.2%" />
          <MetricCard title="Sincronización SAP" value="100%" status="Online" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Transactions */}
        <section className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-ink-black/60 uppercase">Últimas Transacciones</h2>
            <Link href="/admin/transactions" className="text-xs font-medium tracking-wider text-gold hover:underline">Ver todas</Link>
          </div>
          <div className="rounded-lg border border-ink-black/10 bg-pure-white p-6">
            <table className="w-full text-left text-sm text-ink-black/80">
              <thead>
                <tr className="border-b border-ink-black/10 text-xs tracking-widest text-ink-black/40 uppercase">
                  <th className="pb-3 font-medium">Orden</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'ORD-001', client: 'Alpha Corp SpA', date: 'Hoy, 10:45 AM', total: '$1,250.00' },
                  { id: 'ORD-002', client: 'Vanguard Security', date: 'Hoy, 09:12 AM', total: '$840.00' },
                  { id: 'ORD-003', client: 'Juan Pérez', date: 'Ayer, 16:30 PM', total: '$120.00' },
                ].map((row, i) => (
                  <tr key={row.id} className={i !== 2 ? 'border-b border-ink-black/5' : ''}>
                    <td className="py-4 text-gold">{row.id}</td>
                    <td className="py-4">{row.client}</td>
                    <td className="py-4 text-ink-black/50">{row.date}</td>
                    <td className="py-4 text-right font-mono">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Health / SAP */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-[0.2em] text-ink-black/60 uppercase">Estado SAP</h2>
            <Link href="/admin/sap" className="text-xs font-medium tracking-wider text-gold hover:underline">Detalles</Link>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-ink-black/10 bg-pure-white p-6">
            <div className="flex items-center justify-between border-b border-ink-black/5 pb-4">
              <span className="text-sm text-ink-black/60">Conexión RFC</span>
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-gold uppercase">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" /> Activo
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-ink-black/5 pb-4">
              <span className="text-sm text-ink-black/60">Última Sincronización</span>
              <span className="text-sm font-mono text-ink-black/80">Hace 5 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-black/60">Cola de Eventos</span>
              <span className="text-sm font-mono text-ink-black/80">0 pendientes</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, negative, status }: { title: string; value: string; trend?: string; negative?: boolean; status?: string }) {
  return (
    <div className="rounded-lg border border-ink-black/10 bg-pure-white p-6 transition-colors hover:border-gold/30">
      <h3 className="text-xs font-semibold tracking-[0.15em] text-ink-black/40 uppercase">{title}</h3>
      <div className="mt-4 flex items-end justify-between">
        <span className="font-heading text-3xl font-bold text-ink-black">{value}</span>
        {trend && (
          <span className={`text-xs font-bold tracking-wider ${negative ? 'text-error' : 'text-gold'}`}>
            {trend}
          </span>
        )}
        {status && (
          <span className="text-xs font-bold tracking-wider text-gold uppercase">{status}</span>
        )}
      </div>
    </div>
  );
}
