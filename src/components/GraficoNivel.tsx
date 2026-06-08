import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { LecturaHistorial } from "../types/aljibe";
import { formatearFecha } from "../utils/fecha";

interface Props {
  historial: LecturaHistorial[];
}

type FiltroGrafico = "dia" | "semana" | "mes";

export default function GraficoNivel({ historial }: Props) {
  const [filtro, setFiltro] = useState<FiltroGrafico>("dia");

  const data = useMemo(() => {
    const ahora = new Date();
    const diasFiltro = filtro === "dia" ? 1 : filtro === "semana" ? 7 : 30;

    const fechaMinima = new Date();
    fechaMinima.setDate(ahora.getDate() - diasFiltro);

    const datosFiltrados = [...historial]
      .filter((item) => new Date(item.fecha) >= fechaMinima)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const factorMuestreo = filtro === "dia" ? 1 : filtro === "semana" ? 5 : 15;

    const puntosGrafico = datosFiltrados
      .filter((_, index) => index % factorMuestreo === 0)
      .map((item) => ({
        fechaOriginal: new Date(item.fecha).getTime(),
        fechaFormateada: formatearFecha(item.fecha),
        nivel: item.nivel,
      }));

    return puntosGrafico;
  }, [historial, filtro]);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Evolución del nivel
          </h2>
          <p className="text-slate-400">
            Historial del nivel del aljibe.
          </p>
        </div>

        <div className="flex w-fit rounded-2xl border border-white/10 bg-white/5 p-1">
          {(["dia", "semana", "mes"] as FiltroGrafico[]).map((tipo) => (
            <BotonFiltro
              key={tipo}
              activo={filtro === tipo}
              onClick={() => setFiltro(tipo)}
            >
              {tipo === "dia" ? "Día" : tipo === "semana" ? "Semana" : "Mes"}
            </BotonFiltro>
          ))}
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 24, right: 18, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#334155"
                strokeOpacity={0.35}
                vertical={false}
              />

              <XAxis
                dataKey="fechaOriginal"
                type="number"
                domain={["dataMin", "dataMax"]}
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                minTickGap={30}
                tickFormatter={(value) => {
                  const date = new Date(value);

                  if (filtro === "dia") {
                    return date.toLocaleTimeString("es-EC", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
                  }

                  return date.toLocaleDateString("es-EC", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />

              <YAxis
                domain={[0, 105]}
                ticks={[0, 25, 50, 75, 100]}
                stroke="#475569"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                cursor={{
                  stroke: "#38bdf8",
                  strokeOpacity: 0.25,
                }}
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  color: "#fff",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                }}
                labelStyle={{
                  color: "#94a3b8",
                }}
                formatter={(value) => [`${value}%`, "Nivel"]}
                labelFormatter={(_, items) =>
                  `Fecha: ${items[0]?.payload?.fechaFormateada || ""}`
                }
              />

              <Line
                type="monotone"
                dataKey="nivel"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#38bdf8",
                  stroke: "#020617",
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-400">
          No hay datos para este rango.
        </div>
      )}
    </section>
  );
}

function BotonFiltro({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activo
        ? "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}