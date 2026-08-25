import { useEffect, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";

const INTERVALO_REVISION_MS = 60 * 60 * 1000;

export default function AvisoActualizacion() {
  const [hayActualizacion, setHayActualizacion] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const actualizarSW = useRef<(reloadPage?: boolean) => Promise<void>>(null);

  useEffect(() => {
    let detenerRevision: (() => void) | undefined;

    const updateSW = registerSW({
      onNeedRefresh() {
        setHayActualizacion(true);
      },
      onRegisteredSW(_url, registro) {
        if (!registro) return;

        const intervalo = window.setInterval(
          () => void registro.update().catch(() => undefined),
          INTERVALO_REVISION_MS,
        );
        detenerRevision = () => window.clearInterval(intervalo);
      },
    });

    actualizarSW.current = updateSW;

    return () => {
      detenerRevision?.();
      actualizarSW.current = null;
    };
  }, []);

  if (!hayActualizacion) return null;

  async function actualizar() {
    setActualizando(true);
    await actualizarSW.current?.(true);
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-line-strong bg-panel p-4 text-ink shadow-[0_16px_48px_rgba(0,0,0,0.35)] sm:bottom-6 sm:flex sm:max-w-xl sm:items-center sm:gap-5 sm:p-5"
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-water/10 text-water-bright">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
          >
            <path d="M20 7v5h-5" />
            <path d="M18.4 16a7.5 7.5 0 1 1 .9-7.7L20 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold">Nueva versión disponible</p>
          <p className="mt-1 text-xs leading-5 text-ink-soft">
            Actualiza para usar las últimas mejoras de DarIOT.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => setHayActualizacion(false)}
          disabled={actualizando}
          className="min-h-11 rounded-xl px-3 text-sm font-medium text-ink-muted transition-[background-color,color,transform] duration-150 hover:bg-panel-raised hover:text-ink active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
        >
          Más tarde
        </button>
        <button
          type="button"
          onClick={() => void actualizar()}
          disabled={actualizando}
          className="min-h-11 rounded-xl bg-water px-4 text-sm font-semibold text-canvas transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water"
        >
          {actualizando ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
    </aside>
  );
}
