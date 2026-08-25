import { useState } from "react";
import { Link } from "react-router-dom";
import GraficoNivel from "./components/GraficoNivel";
import { useTanque } from "./hooks/useAljibe";
import type { LecturaHistorial } from "./types/aljibe";
import { formatearFecha } from "./utils/fecha";

const ALTO_CM = 180;
const ANCHO_CM = 200;
const LARGO_CM = 200;
const CAPACIDAD_LITROS = (ALTO_CM * ANCHO_CM * LARGO_CM) / 1000;

export default function App() {
  const { tiempoReal, historial, loading } = useTanque();

  if (loading) return <PantallaCarga />;

  const nivel = tiempoReal?.nivel ?? 0;
  const litrosActuales = Math.round((nivel / 100) * CAPACIDAD_LITROS);

  return (
    <main className="min-h-screen bg-canvas px-4 py-5 text-ink sm:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <Cabecera />

        <section className="mt-8 overflow-hidden rounded-[28px] border border-line bg-panel">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="order-2 flex flex-col justify-between p-6 sm:p-8 lg:order-1 lg:p-10">
              <div>
                <div className="hidden flex-wrap items-center gap-3 lg:flex">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                    Reserva disponible
                  </p>
                  <EstadoBadge estado={tiempoReal?.estado ?? "SIN DATOS"} />
                </div>

                <div className="grid grid-cols-2 gap-3 lg:hidden">
                  <div className="rounded-2xl border border-line bg-panel-raised p-4">
                    <p className="text-xs font-medium text-ink-muted">Nivel</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
                      {nivel}%
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line bg-panel-raised p-4">
                    <p className="text-xs font-medium text-ink-muted">Estado</p>
                    <p className="mt-1 text-xl font-semibold text-ink">
                      {tiempoReal?.estado ?? "Sin datos"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 hidden items-end gap-3 lg:flex">
                  <p className="text-[72px] font-semibold leading-[0.82] tracking-[-0.065em] text-ink tabular-nums sm:text-[96px]">
                    {nivel}
                  </p>
                  <span className="pb-1 text-3xl font-medium text-water sm:pb-2 sm:text-4xl">
                    %
                  </span>
                </div>

                <p className="mt-7 text-2xl font-medium tracking-[-0.025em] text-ink sm:text-3xl">
                  {litrosActuales.toLocaleString("es-EC")} litros
                  <span className="font-normal text-ink-muted"> estimados</span>
                </p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
                  Capacidad total de {CAPACIDAD_LITROS.toLocaleString("es-EC")} L
                  en un depósito de 2 × 2 metros.
                </p>
              </div>

              <div className="mt-10 border-t border-line pt-5">
                <DatoCompacto
                  label="Última lectura"
                  value={
                    tiempoReal?.fecha
                      ? formatearFecha(tiempoReal.fecha)
                      : "Sin datos"
                  }
                />
              </div>
            </div>

            <Deposito nivel={nivel} />
          </div>

          <div className="grid border-t border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
            <MetricaTecnica label="Profundidad" value={`${ALTO_CM} cm`} />
            <MetricaTecnica label="Superficie" value={`${ANCHO_CM} × ${LARGO_CM} cm`} />
            <MetricaTecnica label="Volumen útil" value="7,2 m³" />
          </div>
        </section>

        <div className="mt-6">
          <GraficoNivel historial={historial} />
        </div>

        <HistorialReciente historial={historial} />

        <footer className="grid gap-2 py-8 text-center text-xs text-ink-muted sm:grid-cols-3 sm:items-center">
          <span className="sm:text-left">DarIOT · Monitor de reserva de agua</span>
          <span>Desarrollado por Dario Valdez 🐧</span>
          <span className="sm:text-right">Datos en tiempo real</span>
        </footer>
      </div>
    </main>
  );
}

function Cabecera() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border border-water/20 bg-water/10 text-water-bright">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
          >
            <path d="M12 3.2s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" />
            <path d="M9.1 15.1a3.2 3.2 0 0 0 3 2.2" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-water-bright">
            DarIOT
          </p>
          <h1 className="text-sm font-medium text-ink-soft">
            Monitoreo del aljibe
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SelectorTema />
        <Link
          to="/admin"
          aria-label="Abrir configuración"
          title="Configuración"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-panel text-ink-muted transition-[background-color,color,transform] duration-150 hover:bg-panel-raised hover:text-ink active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
          >
            <circle cx="12" cy="12" r="3.2" />
            <path d="M19.4 15a1.8 1.8 0 0 0 .36 2l-1.8 1.8a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.66h-2.55a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-2 .36L7.4 17a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.66-1.1v-2.55a1.8 1.8 0 0 0 1.66-1.1 1.8 1.8 0 0 0-.36-2l1.8-1.8a1.8 1.8 0 0 0 2 .36 1.8 1.8 0 0 0 1.1-1.66h2.55a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 2-.36l1.8 1.8a1.8 1.8 0 0 0-.36 2 1.8 1.8 0 0 0 1.66 1.1v2.55A1.8 1.8 0 0 0 19.4 15Z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

function SelectorTema() {
  const [tema, setTema] = useState<"dark" | "light">(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark"
  );

  function alternarTema() {
    const nuevoTema = tema === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nuevoTema;
    localStorage.setItem("tema-aljibe", nuevoTema);
    setTema(nuevoTema);
  }

  const esOscuro = tema === "dark";

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={esOscuro ? "Activar modo claro" : "Activar modo oscuro"}
      title={esOscuro ? "Modo claro" : "Modo oscuro"}
      className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-panel text-ink-muted transition-[background-color,color,transform] duration-150 hover:bg-panel-raised hover:text-ink active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
    >
      {esOscuro ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-5"
        >
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-5"
        >
          <path d="M20.5 15.2A8 8 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
        </svg>
      )}
    </button>
  );
}

function Deposito({ nivel }: { nivel: number }) {
  return (
    <div className="relative order-1 flex min-h-[340px] items-center justify-center border-b border-line bg-inset p-6 sm:min-h-[390px] sm:p-8 lg:order-2 lg:border-b-0 lg:border-l">
      <div className="relative h-[260px] w-[176px] -translate-x-5 sm:h-[300px] sm:w-[190px]">
        {[100, 75, 50, 25, 0].map((marca) => (
          <div
            key={marca}
            className="absolute left-0 right-0 flex -translate-y-1/2 items-center gap-2"
            style={{ top: `${100 - marca}%` }}
          >
            <span className="w-7 text-right text-[10px] tabular-nums text-ink-muted">
              {marca}
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
        ))}

        <div className="absolute inset-y-0 left-10 right-0 overflow-hidden rounded-b-[34px] rounded-t-lg border border-line-strong bg-panel-raised">
          <div
            className="absolute inset-x-0 bottom-0 bg-water-deep"
            style={{ height: `${nivel}%` }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-water-bright" />
            <div
              className="absolute inset-x-5 top-2 h-4 rounded-[50%] bg-water/20 blur-sm"
              style={{ animation: "waterPulse 2.8s ease-in-out infinite" }}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035),transparent_35%)]" />
          <div className="absolute inset-0 flex items-center justify-center lg:hidden">
            <p className="text-4xl font-semibold tracking-[-0.05em] text-ink tabular-nums drop-shadow-lg">
              {nivel}%
            </p>
          </div>
        </div>
      </div>
      <p className="absolute bottom-2 left-0 right-0 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted sm:bottom-3">
        Escala de llenado
      </p>
    </div>
  );
}

function DatoCompacto({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink-soft">{value}</p>
    </div>
  );
}

function MetricaTecnica({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 last:border-b-0 sm:block sm:border-b-0 sm:px-8 sm:py-5">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="text-sm font-semibold text-ink sm:mt-1">{value}</p>
    </div>
  );
}

function HistorialReciente({ historial }: { historial: LecturaHistorial[] }) {
  const recientes = historial.slice(0, 15);

  return (
    <section className="mt-6 overflow-hidden rounded-[24px] border border-line bg-panel">
      <div className="flex items-end justify-between gap-4 px-6 py-5 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Bitácora
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-ink">
            Historial reciente
          </h2>
        </div>
        <span className="text-xs text-ink-muted">Últimas 15 lecturas</span>
      </div>

      {recientes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-[50%] sm:w-auto" />
              <col className="w-[20%] sm:w-auto" />
              <col className="w-[30%] sm:w-auto" />
            </colgroup>
            <thead>
              <tr className="border-y border-line bg-inset/50 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                <th className="px-4 py-3 sm:px-7">Fecha y hora</th>
                <th className="px-2 py-3 text-right sm:px-4">Nivel</th>
                <th className="px-3 py-3 sm:px-7">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-line last:border-0 hover:bg-panel-raised/50"
                >
                  <td className="px-4 py-3.5 font-medium text-ink-soft sm:px-7">
                    {formatearFecha(item.fecha)}
                  </td>
                  <td className="px-2 py-3.5 text-right font-semibold tabular-nums text-water-bright sm:px-4">
                    {item.nivel}%
                  </td>
                  <td className="px-3 py-3.5 sm:px-7">
                    <EstadoBadge estado={item.estado} compacto />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-t border-line px-6 py-12 text-center text-sm text-ink-muted">
          Todavía no hay lecturas registradas.
        </div>
      )}
    </section>
  );
}

function EstadoBadge({
  estado,
  compacto = false,
}: {
  estado: string;
  compacto?: boolean;
}) {
  const color =
    estado === "LLENO" || estado === "ALTO"
      ? "bg-positive/10 text-positive"
      : estado === "MEDIO"
        ? "bg-water/10 text-water-bright"
        : estado === "BAJO"
          ? "bg-caution/10 text-caution"
          : "bg-danger/10 text-danger";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${color} ${
        compacto
          ? "px-2.5 py-1 text-[10px] tracking-[0.08em]"
          : "px-3 py-1.5 text-xs tracking-[0.06em]"
      }`}
    >
      {estado}
    </span>
  );
}

function PantallaCarga() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-5 sm:px-6 md:py-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-11 w-48 rounded-xl bg-panel-raised" />
        <div className="mt-8 h-[520px] rounded-[28px] border border-line bg-panel" />
        <div className="mt-6 h-[420px] rounded-[24px] border border-line bg-panel" />
      </div>
    </main>
  );
}
