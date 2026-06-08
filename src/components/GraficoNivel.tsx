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

    let ticksEjeX: number[] = [];
    if (filtro === "dia") {
      const inicioDelDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);

      const saltoHoras = typeof window !== "undefined" && window.innerWidth < 768 ? 6 : 3;

      for (let i = 0; i <= 24; i += saltoHoras) {
        const horaTick = new Date(inicioDelDia.getTime() + i * 60 * 60 * 1000);
        ticksEjeX.push(horaTick.getTime());
      }
    }

    const factorMuestreo = filtro === "dia" ? 1 : filtro === "semana" ? 5 : 15;
    const datosMuestreados = datosFiltrados.filter((_, index) => index % factorMuestreo === 0);

    const puntosGrafico = datosMuestreados.map((item) => ({
      fechaOriginal: new Date(item.fecha).getTime(),
      fechaFormateada: formatearFecha(item.fecha),
      nivel: item.nivel,
    }));

    return { puntosGrafico, ticksEjeX };
  }, [historial, filtro]);

  const { puntosGrafico, ticksEjeX } = data;


  return (
    <section className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Evolución del nivel</h2>
          <p className="text-slate-400">Historial del nivel del aljibe.</p>
        </div>

        <div className="flex bg-slate-800 rounded-2xl p-1 w-fit">
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

      {puntosGrafico.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={puntosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis
                dataKey="fechaOriginal"
                stroke="#64748b"
                type="number"
                domain={filtro === "dia" ? [ticksEjeX[0], ticksEjeX[ticksEjeX.length - 1]] : ['auto', 'auto']}
                ticks={filtro === "dia" ? ticksEjeX : undefined}
                minTickGap={25} // <-- IMPORTANTE: Permite saltarse horas si el ancho de la pantalla no da abasto
                // Eliminamos interval={0} para evitar que colapsen en pantallas pequeñas
                tickFormatter={(value) => {
                  const date = new Date(value);

                  if (filtro === "dia") {
                    const horas = date.getHours();

                    if (horas === 0 && date.getMinutes() === 0) {
                      return value === ticksEjeX[ticksEjeX.length - 1] ? "24:00" : "00:00";
                    }

                    return date.toLocaleTimeString("es-EC", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    });
                  }

                  return date.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
                }}
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
                labelFormatter={(_, items) => {
                  return `Fecha: ${items[0]?.payload?.fechaFormateada || ""}`;
                }}
              />

              <Line
                type="monotone"
                dataKey="nivel"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, stroke: "#0f172a", strokeWidth: 2 }}
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
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${activo ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
        }`}
    >
      {children}
    </button>
  );
}