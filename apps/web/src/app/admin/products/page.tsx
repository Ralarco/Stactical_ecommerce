export default function AdminProducts() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-ink-black uppercase">Gestión de Productos</h1>
        <button className="flex items-center gap-2 rounded border border-gold bg-gold px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:bg-gold-light">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Añadir Producto
        </button>
      </div>

      <div className="rounded-lg border border-ink-black/10 bg-pure-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Buscar por SKU o Nombre..."
              className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black placeholder:text-ink-black/40 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select className="rounded border border-ink-black/20 bg-pure-white px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none">
              <option>Categoría</option>
              <option>Ropa Táctica</option>
              <option>Botas</option>
              <option>Accesorios</option>
            </select>
            <select className="rounded border border-ink-black/20 bg-pure-white px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none">
              <option>Estado SAP</option>
              <option>Sincronizado</option>
              <option>Pendiente</option>
              <option>Error</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left text-sm text-ink-black/80">
          <thead>
            <tr className="border-b border-ink-black/10 text-xs tracking-widest text-ink-black/40 uppercase">
              <th className="pb-3 font-medium">SKU</th>
              <th className="pb-3 font-medium">Nombre</th>
              <th className="pb-3 font-medium">Categoría</th>
              <th className="pb-3 font-medium text-right">Precio B2B</th>
              <th className="pb-3 font-medium text-right">Stock</th>
              <th className="pb-3 pl-8 font-medium">Estado SAP</th>
              <th className="pb-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[
              { sku: 'TAC-JKT-01', name: 'Chaqueta Táctica X1', category: 'Ropa Táctica', price: '$120.00', stock: 45, sap: 'Sincronizado' },
              { sku: 'TAC-BT-09', name: 'Botas de Asalto V2', category: 'Botas', price: '$180.00', stock: 12, sap: 'Pendiente' },
              { sku: 'TAC-ACC-14', name: 'Mochila 40L', category: 'Accesorios', price: '$85.00', stock: 0, sap: 'Error' },
            ].map((product, i) => (
              <tr key={product.sku} className="border-b border-ink-black/5 transition-colors hover:bg-ink-black/5">
                <td className="py-4 font-mono text-gold">{product.sku}</td>
                <td className="py-4 font-medium">{product.name}</td>
                <td className="py-4 text-ink-black/60">{product.category}</td>
                <td className="py-4 text-right font-mono">{product.price}</td>
                <td className="py-4 text-right font-mono">
                  <span className={product.stock === 0 ? 'text-error font-bold' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="py-4 pl-8">
                  <span className={`inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase ${
                    product.sap === 'Sincronizado' ? 'text-gold' :
                    product.sap === 'Error' ? 'text-error' : 'text-ink-black/60'
                  }`}>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                      product.sap === 'Sincronizado' ? 'bg-gold' :
                      product.sap === 'Error' ? 'bg-error' : 'bg-ink-black/40'
                    }`} />
                    {product.sap}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-xs font-medium tracking-wider text-ink-black/40 hover:text-gold uppercase transition-colors">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
