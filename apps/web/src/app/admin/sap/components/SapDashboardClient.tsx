'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  testSapConnectionAction,
  checkSapConfigAction,
  syncMaterialsAction,
  syncStockAction,
  getIntegrationEventsAction,
  getSapStatsAction,
} from '@/features/catalog/actions/sap.actions';

type ConnectionStatus = {
  connected: boolean;
  latencyMs: number;
  serverVersion?: string;
  error?: string;
};

type SapStats = {
  totalProducts: number;
  syncedProducts: number;
  pendingProducts: number;
  failedProducts: number;
  lastSyncAt: string | null;
};

type IntegrationEvent = {
  id: string;
  type: string;
  payload: any;
  status: string;
  retries: number;
  lastError: string | null;
  processedAt: string | null;
  createdAt: string;
};

export function SapDashboardClient() {
  const [configured, setConfigured] = useState<{ configured: boolean; baseUrl: string; hasCredentials: boolean } | null>(null);
  const [connection, setConnection] = useState<ConnectionStatus | null>(null);
  const [stats, setStats] = useState<SapStats | null>(null);
  const [events, setEvents] = useState<IntegrationEvent[]>([]);
  const [loading, setLoading] = useState({ test: false, syncAll: false, syncStock: false });
  const [syncResult, setSyncResult] = useState<any>(null);

  const loadData = useCallback(async () => {
    const [configRes, statsRes, eventsRes] = await Promise.all([
      checkSapConfigAction(),
      getSapStatsAction(),
      getIntegrationEventsAction(),
    ]);

    if (configRes.success) setConfigured(configRes.data);
    if (statsRes.success) setStats(statsRes.data);
    if (eventsRes.success) setEvents(eventsRes.data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTestConnection = async () => {
    setLoading((l) => ({ ...l, test: true }));
    setConnection(null);
    const res = await testSapConnectionAction();
    if (res.success) setConnection(res.data);
    else setConnection({ connected: false, latencyMs: 0, error: res.error });
    setLoading((l) => ({ ...l, test: false }));
  };

  const handleSyncMaterials = async () => {
    setLoading((l) => ({ ...l, syncAll: true }));
    setSyncResult(null);
    const res = await syncMaterialsAction();
    if (res.success) setSyncResult(res.data);
    else setSyncResult({ errors: [res.error] });
    setLoading((l) => ({ ...l, syncAll: false }));
    loadData();
  };

  const handleSyncStock = async () => {
    setLoading((l) => ({ ...l, syncStock: true }));
    setSyncResult(null);
    const res = await syncStockAction();
    if (res.success) setSyncResult(res.data);
    else setSyncResult({ errors: [res.error] });
    setLoading((l) => ({ ...l, syncStock: false }));
    loadData();
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-ink-black uppercase">
          Integración SAP
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleTestConnection}
            disabled={loading.test}
            className="flex items-center gap-2 rounded border border-ink-black/20 bg-transparent px-5 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
          >
            {loading.test ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            )}
            Test Conexión
          </button>
          <button
            onClick={handleSyncStock}
            disabled={loading.syncStock}
            className="flex items-center gap-2 rounded border border-ink-black/20 bg-transparent px-5 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
          >
            {loading.syncStock && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            Sync Stock
          </button>
          <button
            onClick={handleSyncMaterials}
            disabled={loading.syncAll}
            className="flex items-center gap-2 rounded border border-gold bg-gold px-5 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:bg-gold-light disabled:opacity-50"
          >
            {loading.syncAll ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            )}
            Sincronizar Todo
          </button>
        </div>
      </div>

      {/* ─── Config Banner ─── */}
      {configured && !configured.configured && (
        <div className="rounded-lg border border-gold/40 bg-gold/5 p-5">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-ink-black">SAP no configurado</p>
              <p className="mt-1 text-xs text-ink-black/60 leading-relaxed">
                Para activar la integración SAP, agrega las siguientes variables a tu archivo{' '}
                <code className="rounded bg-ink-black/5 px-1.5 py-0.5 font-mono text-[11px]">.env</code>:
              </p>
              <div className="mt-3 rounded bg-ink-black/5 p-3 font-mono text-[11px] text-ink-black/80 leading-relaxed">
                <div>SAP_BASE_URL=&quot;https://your-sap-instance.com&quot;</div>
                <div>SAP_CLIENT_ID=&quot;your-company-db&quot;</div>
                <div>SAP_CLIENT_SECRET=&quot;your-password&quot;</div>
                <div>SAP_API_KEY=&quot;optional-api-key&quot;</div>
              </div>
              <p className="mt-2 text-[10px] text-ink-black/40">
                Reinicia el servidor después de agregar las variables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Connection Result ─── */}
      {connection && (
        <div className={`rounded-lg border p-4 ${connection.connected ? 'border-gold/30 bg-gold/5' : 'border-error/30 bg-error/5'}`}>
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${connection.connected ? 'bg-gold animate-pulse' : 'bg-error'}`} />
            <span className={`text-sm font-bold uppercase tracking-wider ${connection.connected ? 'text-gold' : 'text-error'}`}>
              {connection.connected ? 'Conexión Exitosa' : 'Conexión Fallida'}
            </span>
            {connection.latencyMs > 0 && (
              <span className="text-xs font-mono text-ink-black/40">{connection.latencyMs}ms</span>
            )}
          </div>
          {connection.error && (
            <p className="mt-2 text-xs text-error/80">{connection.error}</p>
          )}
        </div>
      )}

      {/* ─── Sync Result Banner ─── */}
      {syncResult && (
        <div className={`rounded-lg border p-4 ${syncResult.errors?.length > 0 ? 'border-error/30 bg-error/5' : 'border-gold/30 bg-gold/5'}`}>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-bold uppercase tracking-wider ${syncResult.errors?.length > 0 ? 'text-error' : 'text-gold'}`}>
              Sincronización Completada
            </span>
          </div>
          <div className="mt-2 flex gap-6 text-xs text-ink-black/60">
            {syncResult.total !== undefined && <span>Total: <strong className="text-ink-black">{syncResult.total}</strong></span>}
            {syncResult.created !== undefined && <span>Creados: <strong className="text-gold">{syncResult.created}</strong></span>}
            {syncResult.updated !== undefined && <span>Actualizados: <strong className="text-ink-black">{syncResult.updated}</strong></span>}
            {syncResult.failed !== undefined && syncResult.failed > 0 && <span>Fallidos: <strong className="text-error">{syncResult.failed}</strong></span>}
          </div>
          {syncResult.errors?.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto text-xs text-error/80 font-mono">
              {syncResult.errors.map((e: string, i: number) => <div key={i}>{e}</div>)}
            </div>
          )}
        </div>
      )}

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3 rounded-lg border border-gold/30 bg-pure-white p-6 shadow-sm">
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Conexión RFC</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Estado</span>
            {configured?.configured ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-gold uppercase">
                <span className="h-2 w-2 rounded-full bg-gold" /> Configurado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-ink-black/40 uppercase">
                <span className="h-2 w-2 rounded-full bg-ink-black/30" /> Sin Configurar
              </span>
            )}
          </div>
          {configured?.baseUrl && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-black/60">Host</span>
              <span className="max-w-[140px] truncate text-xs font-mono text-ink-black/80">{configured.baseUrl.replace(/https?:\/\//, '')}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-ink-black/10 bg-pure-white p-6 shadow-sm">
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-ink-black/40 uppercase">Maestro de Materiales</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Última Sincronización</span>
            <span className="text-xs font-mono text-ink-black/80">{formatDate(stats?.lastSyncAt ?? null)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Productos Totales</span>
            <span className="text-sm font-mono font-bold text-ink-black/80">{stats?.totalProducts ?? '—'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-ink-black/10 bg-pure-white p-6 shadow-sm">
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-ink-black/40 uppercase">Sincronizados</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Exitosos</span>
            <span className="text-sm font-mono font-bold text-gold">{stats?.syncedProducts ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Pendientes</span>
            <span className="text-sm font-mono text-ink-black/60">{stats?.pendingProducts ?? '—'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-ink-black/10 bg-pure-white p-6 shadow-sm">
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-ink-black/40 uppercase">Errores</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-black/60">Productos con Error</span>
            <span className={`text-sm font-mono font-bold ${(stats?.failedProducts ?? 0) > 0 ? 'text-error' : 'text-ink-black/40'}`}>
              {stats?.failedProducts ?? '—'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Event Log ─── */}
      <div className="rounded-lg border border-ink-black/10 bg-pure-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-bold tracking-[0.2em] text-ink-black/60 uppercase">Log de Eventos</h2>
          <button
            onClick={loadData}
            className="text-[10px] font-bold tracking-widest text-ink-black/40 uppercase hover:text-gold transition-colors"
          >
            Actualizar
          </button>
        </div>
        <div className="overflow-hidden rounded border border-ink-black/5">
          <table className="w-full text-left text-sm text-ink-black/80">
            <thead className="bg-ink-black/[0.02]">
              <tr className="border-b border-ink-black/10 text-[10px] tracking-widest text-ink-black/40 uppercase">
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Detalle</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Reintentos</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-black/40 font-sans text-sm">
                    No hay eventos registrados
                  </td>
                </tr>
              )}
              {events.map((event) => {
                const payload = typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload;
                const detail = payload.error
                  ? payload.error
                  : `C:${payload.created ?? '—'} U:${payload.updated ?? '—'} F:${payload.failed ?? '—'}`;

                return (
                  <tr key={event.id} className="border-b border-ink-black/5">
                    <td className="px-4 py-3 text-ink-black/40">{formatDate(event.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={event.type === 'ORDER_CREATED' ? 'text-gold' : 'text-ink-black/60'}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[240px] truncate" title={detail}>{detail}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase ${
                        event.status === 'SUCCESS' ? 'text-gold' :
                        event.status === 'FAILED' ? 'text-error' :
                        event.status === 'PROCESSING' ? 'text-ink-black/60' :
                        'text-ink-black/40'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          event.status === 'SUCCESS' ? 'bg-gold' :
                          event.status === 'FAILED' ? 'bg-error' :
                          event.status === 'PROCESSING' ? 'bg-ink-black/40 animate-pulse' :
                          'bg-ink-black/30'
                        }`} />
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-ink-black/40">{event.retries}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
