import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LecturaHistorial } from "../types/aljibe";
import { formatearFecha } from "../utils/fecha";

interface Props {
  historial: LecturaHistorial[];
}

type FiltroGrafico = "3horas" | "6horas" | "12horas" | "semana" | "mes";

const filtros: { valor: FiltroGrafico; etiqueta: string; horas: number }[] = [
  { valor: "3horas", etiqueta: "3 h", horas: 3 },
  { valor: "6horas", etiqueta: "6 h", horas: 6 },
  { valor: "12horas", etiqueta: "12 h", horas: 12 },
  { valor: "semana", etiqueta: "Semana", horas: 24 * 7 },
  { valor: "mes", etiqueta: "Mes", horas: 24 * 30 },
];

export default function GraficoNivel({ historial }: Props) {
  const [filtro, setFiltro] = useState<FiltroGrafico>("12horas");

  const data = useMemo(() => {
    const horasFiltro = filtros.find(({ valor }) => valor === filtro)!.horas;
    const ahora = new Date();
    const fechaMinima = ahora.getTime() - horasFiltro * 60 * 60 * 1000;
    const datosFiltrados = historial
      .filter((item) => new Date(item.fecha).getTime() >= fechaMinima)
      .toSorted(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
    const factorMuestreo =
      filtro === "semana" ? 5 : filtro === "mes" ? 15 : 1;

    return datosFiltrados
      .filter((_, index) => index % factorMuestreo === 0)
      .map((item) => ({
        fechaOriginal: new Date(item.fecha).getTime(),
        fechaFormateada: formatearFecha(item.fecha),
        nivel: item.nivel,
      }));
  }, [historial, filtro]);

  const variacion =
    data.length > 1 ? data[data.length - 1].nivel - data[0].nivel : 0;

  return (
    <section className="rounded-[24px] border border-line bg-panel">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-7 md:flex-row md:items-end md:justify-between">
        <div className="flex items-end gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Tendencia
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-ink">
              Evolución del nivel
            </h2>
          </div>
          {data.length > 1 && (
            <p
              className={`hidden pb-0.5 text-sm font-medium tabular-nums sm:block ${
                variacion > 0
                  ? "text-positive"
                  : variacion < 0
                    ? "text-caution"
                    : "text-ink-muted"
              }`}
            >
              {variacion > 0 ? "+" : ""}
              {variacion} pts
            </p>
          )}
        </div>

        <div
          className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-line bg-inset p-1"
          aria-label="Rango del gráfico"
        >
          {filtros.map(({ valor, etiqueta }) => (
            <button
              key={valor}
              type="button"
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
              className={`min-h-10 shrink-0 rounded-lg px-3 text-xs font-semibold transition-[background-color,color,transform] duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-water ${
                filtro === valor
                  ? "bg-panel-raised text-ink"
                  : "text-ink-muted hover:text-ink-soft"
              }`}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-line px-2 pb-5 pt-4 sm:px-5">
        {data.length > 0 ? (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 14, right: 14, left: -14, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--color-line)"
                  vertical={false}
                />
                <XAxis
                  dataKey="fechaOriginal"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={38}
                  tickFormatter={(value) => formatearMarca(value, filtro)}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  cursor={{
                    stroke: "var(--color-water)",
                    strokeOpacity: 0.28,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    backgroundColor: "var(--color-panel-raised)",
                    border: "1px solid var(--color-line-strong)",
                    borderRadius: "12px",
                    color: "var(--color-ink)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.24)",
                    fontSize: "13px",
                  }}
                  labelStyle={{
                    color: "var(--color-ink-muted)",
                    marginBottom: "4px",
                  }}
                  formatter={(value) => [`${value}%`, "Nivel"]}
                  labelFormatter={(_, items) =>
                    items[0]?.payload?.fechaFormateada || ""
                  }
                />
                <Area
                  type="monotone"
                  dataKey="nivel"
                  stroke="var(--color-water-bright)"
                  strokeWidth={2.5}
                  fill="rgba(40, 196, 216, 0.1)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "var(--color-water-bright)",
                    stroke: "var(--color-panel)",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[320px] flex-col items-center justify-center text-center">
            <div className="flex size-10 items-center justify-center rounded-full border border-line bg-inset text-ink-muted">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="size-5"
              >
                <path d="M4 17 9 12l3 3 7-8" />
                <path d="M17 7h2v2" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-ink-soft">
              Sin lecturas en este rango
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Prueba un período más amplio.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function formatearMarca(value: number, filtro: FiltroGrafico): string {
  const date = new Date(value);

  if (["3horas", "6horas", "12horas"].includes(filtro)) {
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
}
