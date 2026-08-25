import { useEffect, useState, type FormEvent } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { Link } from "react-router-dom";
import RegistroManual from "../components/RegistroManual";
import { auth } from "../firebase/auth";
import { useTanque } from "../hooks/useAljibe";

export default function Admin() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (nuevoUsuario) => {
        setUsuario(nuevoUsuario);
        setVerificandoSesion(false);
      }),
    []
  );

  if (verificandoSesion) return <CargaAdmin />;
  if (!usuario) return <InicioSesion />;

  return <PanelAdmin usuario={usuario} />;
}

function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEnviando(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, correo.trim(), clave);
    } catch {
      setError("El correo o la contraseña no son correctos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4 text-ink sm:p-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-line bg-panel">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden min-h-[570px] overflow-hidden border-r border-line bg-inset p-10 md:flex md:flex-col md:justify-between">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl border border-water/20 bg-water/10 text-water-bright">
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
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-water">
                DarIOT · Mantenimiento
              </p>
              <h1 className="mt-3 max-w-xs text-4xl font-semibold leading-tight tracking-[-0.04em] text-ink">
                Control manual de la reserva.
              </h1>
            </div>

            <div className="relative mx-auto h-48 w-32 overflow-hidden rounded-b-[28px] rounded-t-lg border border-line-strong bg-panel-raised">
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-water-deep">
                <div className="absolute inset-x-0 top-0 h-px bg-water-bright" />
              </div>
              {[25, 50, 75].map((marca) => (
                <span
                  key={marca}
                  className="absolute inset-x-0 h-px bg-line"
                  style={{ bottom: `${marca}%` }}
                />
              ))}
            </div>

            <p className="max-w-xs text-sm leading-6 text-ink-muted">
              Acceso reservado para registrar una medición cuando el sensor no
              pueda reportarla.
            </p>
          </div>

          <div className="p-6 sm:p-10 md:p-12">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-water"
            >
              <span aria-hidden="true">←</span>
              Volver al monitor
            </Link>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-water">
                Área restringida
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink">
                Iniciar sesión
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Usa las credenciales del administrador del aljibe.
              </p>
            </div>

            <form onSubmit={iniciarSesion} className="mt-8 space-y-5">
              <CampoAcceso
                id="correo"
                label="Correo electrónico"
                type="email"
                autoComplete="username"
                value={correo}
                onChange={setCorreo}
              />
              <CampoAcceso
                id="clave"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={clave}
                onChange={setClave}
              />

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="min-h-12 w-full rounded-xl bg-water-bright px-5 py-3 text-sm font-semibold text-canvas transition-[background-color,transform,opacity] duration-150 hover:bg-water active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando ? "Verificando..." : "Acceder al control manual"}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-2 border-t border-line pt-5 text-xs text-ink-muted">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-4"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Sesión protegida por Firebase Authentication
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CampoAcceso({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: "email" | "password";
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-line-strong bg-inset px-4 text-ink outline-none transition-[border-color,box-shadow] focus:border-water focus:shadow-[0_0_0_3px_rgba(40,196,216,0.12)]"
      />
    </div>
  );
}

function PanelAdmin({ usuario }: { usuario: User }) {
  const { tiempoReal, guardarNivelManual, loading } = useTanque();

  return (
    <main className="min-h-screen bg-canvas px-4 py-5 text-ink sm:px-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-water"
            >
              <span aria-hidden="true">←</span>
              Volver al monitor
            </Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-water">
              DarIOT · Área administrativa
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
              Control manual
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-ink-soft">{usuario.email}</p>
              <p className="mt-0.5 text-[11px] text-positive">Sesión activa</p>
            </div>
            <button
              type="button"
              onClick={() => void signOut(auth)}
              className="min-h-11 rounded-xl border border-line bg-panel px-4 py-2 text-sm font-medium text-ink-soft transition-[background-color,color,transform] duration-150 hover:bg-panel-raised hover:text-ink active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-water"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="mt-8">
          {loading ? (
            <div className="h-[560px] animate-pulse rounded-[28px] border border-line bg-panel" />
          ) : (
            <RegistroManual
              nivelActual={tiempoReal?.nivel ?? 0}
              onGuardar={guardarNivelManual}
            />
          )}
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-ink-muted">
          La lectura manual se mantiene separada del sensor en Firebase y se
          integra automáticamente por fecha en el monitor público.
        </p>
      </div>
    </main>
  );
}

function CargaAdmin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 text-ink-muted">
      <div className="flex items-center gap-3 text-sm">
        <span className="size-2 animate-pulse rounded-full bg-water" />
        Verificando acceso seguro
      </div>
    </main>
  );
}
