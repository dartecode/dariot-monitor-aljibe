import { useState, type FormEvent } from "react";
import { obtenerEstadoNivel } from "../hooks/useAljibe";

interface Props {
  nivelActual: number;
  onGuardar: (nivel: number) => Promise<void>;
}

type EstadoGuardado = "inactivo" | "guardando" | "exito" | "error";

const nivelesRapidos = [25, 50, 75, 100];

export default function RegistroManual({ nivelActual, onGuardar }: Props) {
  const [nivel, setNivel] = useState(nivelActual.toString());
  const [estadoGuardado, setEstadoGuardado] =
    useState<EstadoGuardado>("inactivo");
  const [mensajeError, setMensajeError] = useState("");

  const nivelNumerico = Number(nivel);
  const nivelValido =
    nivel.trim() !== "" &&
    Number.isInteger(nivelNumerico) &&
    nivelNumerico >= 0 &&
    nivelNumerico <= 100;

  function cambiarNivel(valor: string) {
    setNivel(valor);
    setEstadoGuardado("inactivo");
    setMensajeError("");
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nivelValido) {
      setEstadoGuardado("error");
      setMensajeError("Ingresa un porcentaje entero entre 0 y 100.");
      return;
    }

    setEstadoGuardado("guardando");
    setMensajeError("");

    try {
      await onGuardar(nivelNumerico);
      setEstadoGuardado("exito");
    } catch {
      setEstadoGuardado("error");
      setMensajeError(
        "No se pudo guardar. Revisa la conexión y los permisos de Firebase."
      );
    }
  }

  const estadoPrevisto = nivelValido
    ? obtenerEstadoNivel(nivelNumerico)
    : "SIN NIVEL";

  return (
    <section className="overflow-hidden rounded-[28px] border border-line bg-panel">
      <div className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-caution">
            Respaldo del sensor
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-ink">
            Nueva lectura manual
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="size-1.5 rounded-full bg-caution" />
          Nivel actual: {nivelActual}%
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <form onSubmit={guardar} noValidate className="p-6 sm:p-8">
          <label
            htmlFor="nivel-manual"
            className="text-sm font-medium text-ink-soft"
          >
            Porcentaje observado
          </label>

          <div className="mt-3 flex items-end gap-3">
            <input
              id="nivel-manual"
              type="number"
              min="0"
              max="100"
              step="1"
              inputMode="numeric"
              value={nivel}
              onChange={(event) => cambiarNivel(event.target.value)}
              aria-describedby="nivel-ayuda nivel-mensaje"
              aria-invalid={estadoGuardado === "error"}
              className="h-20 w-40 rounded-2xl border border-line-strong bg-inset px-5 text-5xl font-semibold tracking-[-0.05em] text-ink outline-none tabular-nums transition-[border-color,box-shadow] focus:border-water focus:shadow-[0_0_0_3px_rgba(40,196,216,0.12)]"
            />
            <span className="pb-3 text-2xl font-medium text-water">%</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={nivelValido ? nivelNumerico : 0}
            onChange={(event) => cambiarNivel(event.target.value)}
            aria-label="Seleccionar porcentaje del nivel"
            className="range-water mt-8 h-11 w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
          />
          <div
            id="nivel-ayuda"
            className="-mt-2 flex justify-between text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted"
          >
            <span>Vacío</span>
            <span>Lleno</span>
          </div>

          <div className="mt-7">
            <p className="text-xs font-medium text-ink-muted">
              Selección rápida
            </p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {nivelesRapidos.map((valor) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => cambiarNivel(valor.toString())}
                  className={`min-h-11 rounded-xl border text-sm font-semibold tabular-nums transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-water ${
                    nivelNumerico === valor
                      ? "border-water/40 bg-water/10 text-water-bright"
                      : "border-line bg-panel-raised text-ink-soft hover:border-line-strong hover:text-ink"
                  }`}
                >
                  {valor}%
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={!nivelValido || estadoGuardado === "guardando"}
              className="min-h-12 rounded-xl bg-water-bright px-6 py-3 text-sm font-semibold text-canvas transition-[background-color,transform,opacity] duration-150 hover:bg-water active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
            >
              {estadoGuardado === "guardando"
                ? "Registrando lectura..."
                : "Confirmar y registrar"}
            </button>
            <p
              id="nivel-mensaje"
              role="status"
              className={`text-sm ${
                estadoGuardado === "error"
                  ? "text-danger"
                  : estadoGuardado === "exito"
                    ? "text-positive"
                    : "text-ink-muted"
              }`}
            >
              {estadoGuardado === "exito"
                ? `${nivelNumerico}% registrado correctamente.`
                : mensajeError || "Se guardará con la fecha y hora actuales."}
            </p>
          </div>
        </form>

        <div className="flex flex-col justify-between border-t border-line bg-inset p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Lectura resultante
            </p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <p className="text-6xl font-semibold leading-none tracking-[-0.06em] text-ink tabular-nums">
                {nivelValido ? nivelNumerico : "--"}
                <span className="ml-1 text-2xl text-water">%</span>
              </p>
              <span className="rounded-full bg-water/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-water-bright">
                {estadoPrevisto}
              </span>
            </div>
          </div>

          <div className="mt-10">
            <div className="relative h-32 overflow-hidden rounded-b-2xl rounded-t-md border border-line-strong bg-panel-raised">
              <div
                className="absolute inset-x-0 bottom-0 bg-water-deep"
                style={{ height: `${nivelValido ? nivelNumerico : 0}%` }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-water-bright" />
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-ink-muted">
              Se integrará al nivel actual, gráfico y bitácora como cualquier
              otra lectura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
