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

    const diasFiltro =
      filtro === "dia" ? 1 : filtro === "semana" ? 7 : 30;

    const fechaMinima = new Date();
    fechaMinima.setDate(ahora.getDate() - diasFiltro);

    return [...historial]
      .filter((item) => new Date(item.fecha) >= fechaMinima)
      .sort(
        (a, b) =>
          new Date(a.fecha).getTime() -
          new Date(b.fecha).getTime()
      )
      .map((item) => ({
        fecha: formatearFecha(item.fecha),
        nivel: item.nivel,
      }));
  }, [historial, filtro]);

  return (
    <section className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Evolución del nivel</h2>
          <p className="text-slate-400">
            Historial del nivel del aljibe.
          </p>
        </div>

        <div className="flex bg-slate-800 rounded-2xl p-1 w-fit">
          <BotonFiltro
            activo={filtro === "dia"}
            onClick={() => setFiltro("dia")}
          >
            Día
          </BotonFiltro>

          <BotonFiltro
            activo={filtro === "semana"}
            onClick={() => setFiltro("semana")}
          >
            Semana
          </BotonFiltro>

          <BotonFiltro
            activo={filtro === "mes"}
            onClick={() => setFiltro("mes")}
          >
            Mes
          </BotonFiltro>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

              <XAxis
                dataKey="fecha"
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString("es-EC", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value) => [`${value}%`, "Nivel"]}
                labelFormatter={(label) => `Fecha: ${label}`}
              />

              <Line
                type="monotone"
                dataKey="nivel"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72 flex items-center justify-center text-slate-400">
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
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activo
          ? "bg-cyan-500 text-slate-950"
          : "text-slate-400 hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}