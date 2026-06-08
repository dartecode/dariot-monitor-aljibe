import { useTanque } from "./hooks/useAljibe";
import { formatearFecha } from "./utils/fecha";
import GraficoNivel from "./components/GraficoNivel";

function App() {
  const { tiempoReal, historial, loading } = useTanque();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Cargando datos del aljibe...</p>
      </div>
    );
  }

  const nivel = tiempoReal?.nivel ?? 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <p className="text-cyan-400 font-semibold">DarIOT</p>
          <h1 className="text-3xl md:text-5xl font-bold">
            Monitoreo del Aljibe
          </h1>
          <p className="text-slate-400 mt-2">
            Nivel de agua en el aljibe tiempo real
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-72 border-4 border-cyan-400 rounded-b-3xl rounded-t-lg overflow-hidden bg-slate-800">
                <div
                  className="absolute bottom-0 left-0 w-full bg-cyan-500 transition-all duration-700"
                  style={{ height: `${nivel}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold drop-shadow-lg">
                    {nivel}%
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard
                    label="Nivel"
                    value={`${tiempoReal?.nivel ?? 0}%`}
                  />

                  <InfoCard
                    label="Estado"
                    value={tiempoReal?.estado ?? "Sin datos"}
                  />
                </div>

                <InfoCard
                  label="Última actualización"
                  value={
                    tiempoReal?.fecha
                      ? formatearFecha(tiempoReal.fecha)
                      : "Sin datos"
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>

            <div className="space-y-4">
              <StatusBadge nivel={nivel} />

              <p className="text-slate-400">
                El aljibe se encuentra actualmente en estado:
              </p>

              <p className="text-3xl font-bold text-cyan-400">
                {tiempoReal?.estado ?? "Sin datos"}
              </p>
            </div>
          </div>
        </section>

        <GraficoNivel historial={historial} />

        <section className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Historial reciente</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3">Fecha</th>
                  <th className="text-center py-3">Nivel</th>
                  <th className="text-center py-3">Estado</th>
                </tr>
              </thead>

              <tbody>
                {historial.slice(0,15).map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800 hover:bg-slate-800/30"
                  >
                    <td className="py-4">
                      {formatearFecha(item.fecha)}
                    </td>

                    <td className="text-center py-4">
                      <span className="font-bold text-cyan-400">
                        {item.nivel}%
                      </span>
                    </td>

                    <td className="text-center py-4">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
                        {item.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {historial.length === 0 && (
              <p className="text-slate-400 mt-4">
                No hay historial disponible.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ nivel }: { nivel: number }) {
  if (nivel <= 10) {
    return (
      <div className="rounded-2xl bg-red-500/10 text-red-400 p-4 font-semibold">
        Nivel crítico
      </div>
    );
  }

  if (nivel <= 30) {
    return (
      <div className="rounded-2xl bg-yellow-500/10 text-yellow-400 p-4 font-semibold">
        Nivel bajo
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-cyan-500/10 text-cyan-400 p-4 font-semibold">
      Nivel estable
    </div>
  );
}

export default App;