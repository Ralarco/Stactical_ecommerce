export default function AdminSapSync() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-ink-black uppercase">Estado de Integración SAP</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded border border-ink-black/20 bg-transparent px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:border-gold hover:text-gold">
            Test de Conexión
          </button>
          <button className="flex items-center gap-2 rounded border border-gold bg-gold px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:bg-gold-light">
            Sincronizar Ahora
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Blocks */}
        <div className="flex flex-col gap-4 rounded-lg border border-gold/30 bg-pure-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">Conexión RFC</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Estado Actual</span>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-gold uppercase">
              <span className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse" /> Online
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Latencia</span>
            <span className="text-sm font-mono text-ink-black/80">45ms</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-ink-black/10 bg-pure-white p-6">
          <h3 className="text-xs font-semibold tracking-[0.15em] text-ink-black/40 uppercase">Maestro de Materiales</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Última Sincronización</span>
            <span className="text-sm font-mono text-ink-black/80">07:00 AM (Hoy)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Registros</span>
            <span className="text-sm font-mono text-ink-black/80">1,240</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-ink-black/10 bg-pure-white p-6">
          <h3 className="text-xs font-semibold tracking-[0.15em] text-ink-black/40 uppercase">Órdenes de Venta (B2B)</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-ink-black/60">En Cola</span>
            <span className="text-sm font-mono text-ink-black/80">0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Procesadas Hoy</span>
            <span className="text-sm font-mono text-ink-black/80">12</span>
          </div>
        </div>
      </div>

      {/* Event Logs */}
      <div className="mt-4 rounded-lg border border-ink-black/10 bg-pure-white p-6">
        <h2 className="mb-6 text-xs font-semibold tracking-[0.2em] text-ink-black/60 uppercase">Log de Eventos (Event-driven sync)</h2>
        <div className="overflow-hidden rounded border border-ink-black/5">
          <table className="w-full text-left text-sm text-ink-black/80">
            <thead className="bg-ink-black/[0.02]">
              <tr className="border-b border-ink-black/10 text-[10px] tracking-widest text-ink-black/40 uppercase">
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Tipo de Evento</th>
                <th className="px-4 py-3 font-medium">Payload / Referencia</th>
                <th className="px-4 py-3 font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-ink-black/5">
                <td className="px-4 py-3 text-ink-black/40">2026-05-07 10:45:12</td>
                <td className="px-4 py-3 text-gold">ORDER_CREATED</td>
                <td className="px-4 py-3">ORD-001 (Alpha Corp SpA)</td>
                <td className="px-4 py-3 text-gold">SUCCESS</td>
              </tr>
              <tr className="border-b border-ink-black/5">
                <td className="px-4 py-3 text-ink-black/40">2026-05-07 10:45:10</td>
                <td className="px-4 py-3 text-ink-black/60">PAYMENT_CAPTURED</td>
                <td className="px-4 py-3">TRX-100234 (Webpay Plus)</td>
                <td className="px-4 py-3 text-gold">SUCCESS</td>
              </tr>
              <tr className="border-b border-ink-black/5">
                <td className="px-4 py-3 text-ink-black/40">2026-05-07 07:00:05</td>
                <td className="px-4 py-3 text-ink-black/60">MATERIAL_MASTER_SYNC</td>
                <td className="px-4 py-3">Batch 1240 items</td>
                <td className="px-4 py-3 text-gold">SUCCESS</td>
              </tr>
              <tr className="">
                <td className="px-4 py-3 text-ink-black/40">2026-05-06 16:30:22</td>
                <td className="px-4 py-3 text-error">ORDER_CREATED</td>
                <td className="px-4 py-3">ORD-003 (Juan Pérez)</td>
                <td className="px-4 py-3 text-error">PAYMENT_FAILED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
