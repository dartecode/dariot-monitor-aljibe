import { useTanque } from "./hooks/useAljibe";
import { formatearFecha } from "./utils/fecha";
import GraficoNivel from "./components/GraficoNivel";
import "./index.css";


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

  const ALTO_CM = 180;
  const ANCHO_CM = 200;
  const LARGO_CM = 200;

  const capacidadCm3 = ALTO_CM * ANCHO_CM * LARGO_CM;
  const capacidadLitros = capacidadCm3 / 1000;
  const capacidadM3 = capacidadCm3 / 1_000_000;

  const litrosActuales = Math.round((nivel / 100) * capacidadLitros);

  return (
    <main className="min-h-screen bg-[#0B1120] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <p className="text-blue-400 font-semibold">DarIOT</p>
          <h1 className="text-3xl md:text-5xl font-bold">
            Monitoreo del Aljibe
          </h1>
          <p className="text-slate-400 mt-2">
            Nivel de agua en el aljibe tiempo real
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827] rounded-3xl p-6 border border-[#374151]">
            <div className="flex flex-col md:flex-row items-center gap-8 h-full">
              <div className="relative w-48 h-72 border-4 border-blue-500 rounded-b-3xl rounded-t-lg overflow-hidden bg-[#1F2937]">
                <div
                  className="absolute bottom-0 left-0 w-full transition-all duration-700"
                  style={{
                    height: `${nivel}%`,
                    background:
                      "linear-gradient(to top, #1d4ed8, #3b82f6, #60a5fa)",
                    boxShadow: "0 0 25px rgba(59,130,246,.45)",
                    animation: "waterGlow 3s ease-in-out infinite",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                      height: "8px",
                      background: "rgba(255,255,255,.25)",
                      filter: "blur(2px)",
                    }}
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold drop-shadow-lg">
                    {nivel}%
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Nivel" value={`${tiempoReal?.nivel ?? 0}%`} />

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

                <InfoCard
                  label="Litros actuales estimados"
                  value={`${litrosActuales.toLocaleString("es-EC")} L`}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-3xl p-6 border border-[#374151]">
            <h2 className="text-xl font-bold mb-4">Información del aljibe</h2>

            <div className="rounded-2xl p-4 mb-5 bg-blue-500/10 border border-blue-500/20">
              <p className="text-slate-400 text-sm">Capacidad total</p>

              <p className="text-3xl font-bold text-blue-400 mt-1">
                {capacidadLitros.toLocaleString("es-EC")} L
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Equivalente a {capacidadM3.toLocaleString("es-EC")} m³
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard label="Profundidad" value={`${ALTO_CM} cm`} />
              <InfoCard label="Ancho" value={`${ANCHO_CM} cm`} />
              <InfoCard label="Largo" value={`${LARGO_CM} cm`} />

              <InfoCard
                label="Volumen"
                value={`${capacidadM3.toLocaleString("es-EC")} m³`}
              />
            </div>
          </div>
        </section>

        <GraficoNivel historial={historial} />

        <section className="bg-[#111827] rounded-3xl p-6 border border-[#374151]">
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
                {historial.slice(0, 15).map((item) => (
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
    <div className="bg-[#1F2937] rounded-2xl p-4 border border-[#374151]">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ estado }: { estado: string }) {
  const estilos = {
    CRITICO: "bg-red-500/10 text-red-400",
    BAJO: "bg-amber-500/10 text-amber-400",
    MEDIO: "bg-yellow-500/10 text-yellow-400",
    ALTO: "bg-green-500/10 text-green-400",
    LLENO: "bg-blue-500/10 text-blue-400",
  };

  return (
    <div
      className={`rounded-2xl p-4 font-semibold ${estilos[estado as keyof typeof estilos] ??
        "bg-slate-500/10 text-slate-400"
        }`}
    >
      {estado}
    </div>
  );
}

function obtenerMensajeEstado(estado?: string) {
  switch (estado) {
    case "LLENO":
      return "El aljibe está lleno. No se requiere ninguna acción por el momento.";
    case "ALTO":
      return "El nivel de agua es alto. El sistema se encuentra en condiciones normales.";
    case "MEDIO":
      return "El nivel es medio. Se recomienda mantener el monitoreo activo.";
    case "BAJO":
      return "El nivel está bajo. Revisa el consumo o espera el ingreso de agua.";
    case "CRITICO":
      return "Nivel crítico. Se recomienda llamar un tanquero.";
    default:
      return "No hay datos suficientes para determinar el estado actual.";
  }
}

export default App;