export default function AdminUsers() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-ink-black uppercase">Gestión de Usuarios</h1>
        <button className="flex items-center gap-2 rounded border border-gold bg-gold px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:bg-gold-light">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Invitar Usuario
        </button>
      </div>

      <div className="rounded-lg border border-ink-black/10 bg-pure-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Buscar por Nombre o Email..."
              className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black placeholder:text-ink-black/40 focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <select className="rounded border border-ink-black/20 bg-pure-white px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none">
              <option>Todos los Roles</option>
              <option>Admin</option>
              <option>Customer B2B</option>
              <option>Customer B2C</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left text-sm text-ink-black/80">
          <thead>
            <tr className="border-b border-ink-black/10 text-xs tracking-widest text-ink-black/40 uppercase">
              <th className="pb-3 font-medium">Nombre</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Empresa</th>
              <th className="pb-3 font-medium">Rol</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Admin Principal', email: 'admin@stactical.com', company: 'Stactical HQ', role: 'ADMIN', status: 'Activo' },
              { name: 'Carlos Díaz', email: 'carlos@alphacorp.cl', company: 'Alpha Corp SpA', role: 'B2B', status: 'Activo' },
              { name: 'María Rojas', email: 'mrojas@vanguard.com', company: 'Vanguard Security', role: 'B2B', status: 'Pendiente Aprobación' },
              { name: 'Juan Pérez', email: 'jperez@gmail.com', company: '-', role: 'B2C', status: 'Activo' },
            ].map((user, i) => (
              <tr key={user.email} className="border-b border-ink-black/5 transition-colors hover:bg-ink-black/5">
                <td className="py-4 font-medium text-ink-black">{user.name}</td>
                <td className="py-4 text-ink-black/60">{user.email}</td>
                <td className="py-4 text-ink-black/60">{user.company}</td>
                <td className="py-4">
                  <span className={`text-xs font-bold tracking-widest uppercase ${user.role === 'ADMIN' ? 'text-gold' : 'text-ink-black/60'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${
                    user.status === 'Activo' ? 'text-gold' : 'text-ink-black/40'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-xs font-medium tracking-wider text-ink-black/40 hover:text-gold uppercase transition-colors">
                    Gestionar
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
