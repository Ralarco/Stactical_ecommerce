export default function AdminTransactions() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-ink-black uppercase">Gestión de Transacciones</h1>
        <button className="flex items-center gap-2 rounded border border-ink-black/20 bg-transparent px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:border-gold hover:text-gold">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <div className="rounded-lg border border-ink-black/10 bg-pure-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Buscar por ID de Orden o Cliente..."
              className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black placeholder:text-ink-black/40 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm text-ink-black/80">
          <thead>
            <tr className="border-b border-ink-black/10 text-xs tracking-widest text-ink-black/40 uppercase">
              <th className="pb-3 font-medium">ID Transacción</th>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Fecha</th>
              <th className="pb-3 font-medium text-right">Monto</th>
              <th className="pb-3 pl-8 font-medium">Medio de Pago</th>
              <th className="pb-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'TRX-100234', client: 'Alpha Corp SpA', date: '07 May 2026, 10:45 AM', amount: '$1,250.00', method: 'Webpay Plus', status: 'Completado' },
              { id: 'TRX-100233', client: 'Vanguard Security', date: '07 May 2026, 09:12 AM', amount: '$840.00', method: 'Transferencia', status: 'Pendiente' },
              { id: 'TRX-100232', client: 'Juan Pérez', date: '06 May 2026, 16:30 PM', amount: '$120.00', method: 'Webpay Plus', status: 'Rechazado' },
            ].map((trx, i) => (
              <tr key={trx.id} className="border-b border-ink-black/5 transition-colors hover:bg-ink-black/5">
                <td className="py-4 font-mono text-gold">{trx.id}</td>
                <td className="py-4 font-medium">{trx.client}</td>
                <td className="py-4 text-ink-black/60">{trx.date}</td>
                <td className="py-4 text-right font-mono text-ink-black">{trx.amount}</td>
                <td className="py-4 pl-8 text-ink-black/80">{trx.method}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${
                    trx.status === 'Completado' ? 'border-gold text-gold bg-gold/10' :
                    trx.status === 'Rechazado' ? 'border-error text-error bg-error/10' : 'border-ink-black/30 text-ink-black/60 bg-ink-black/5'
                  }`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
