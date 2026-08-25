import { useEffect, useMemo, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../firebase/firebase";
import type { LecturaTiempoReal, LecturaHistorial } from "../types/aljibe";

const DISTANCIA_VACIO_CM = 160;
const DISTANCIA_LLENO_CM = 25;

export function obtenerEstadoNivel(nivel: number): string {
  if (nivel >= 95) return "LLENO";
  if (nivel >= 70) return "ALTO";
  if (nivel >= 40) return "MEDIO";
  if (nivel >= 20) return "BAJO";
  return "CRITICO";
}

function completarConCero(valor: number): string {
  return valor.toString().padStart(2, "0");
}

function crearFechaLocal(fecha: Date): {
  fechaIso: string;
  dia: string;
  hora: string;
} {
  const dia = `${fecha.getFullYear()}-${completarConCero(
    fecha.getMonth() + 1
  )}-${completarConCero(fecha.getDate())}`;
  const hora = `${completarConCero(fecha.getHours())}-${completarConCero(
    fecha.getMinutes()
  )}-${completarConCero(fecha.getSeconds())}`;

  return {
    fechaIso: `${dia}T${hora.replaceAll("-", ":")}`,
    dia,
    hora,
  };
}

function convertirHistorial(
  data: unknown,
  origen: "sensor" | "manual"
): LecturaHistorial[] {
  if (!data || typeof data !== "object") return [];

  const lista: LecturaHistorial[] = [];

  Object.entries(data).forEach(([fechaDia, lecturasDia]) => {
    if (!lecturasDia || typeof lecturasDia !== "object") return;

    Object.entries(
      lecturasDia as Record<string, Omit<LecturaHistorial, "id">>
    ).forEach(([horaClave, value]) => {
      lista.push({
        id: `${origen}_${fechaDia}_${horaClave}`,
        ...value,
        origen,
      });
    });
  });

  return lista;
}

export function useTanque() {
  const [lecturaSensor, setLecturaSensor] =
    useState<LecturaTiempoReal | null>(null);
  const [lecturaManual, setLecturaManual] =
    useState<LecturaTiempoReal | null>(null);
  const [historialSensor, setHistorialSensor] = useState<LecturaHistorial[]>([]);
  const [historialManual, setHistorialManual] = useState<LecturaHistorial[]>([]);
  const [cargandoSensor, setCargandoSensor] = useState(true);
  const [cargandoManual, setCargandoManual] = useState(true);

  useEffect(() => {
    const sensorRef = ref(database, "aljibe/tiempo_real");
    const manualRef = ref(database, "aljibe/manual/tiempo_real");

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      setLecturaSensor(
        snapshot.exists() ? { ...snapshot.val(), origen: "sensor" } : null
      );
      setCargandoSensor(false);
    });
    const unsubscribeManual = onValue(manualRef, (snapshot) => {
      setLecturaManual(
        snapshot.exists() ? { ...snapshot.val(), origen: "manual" } : null
      );
      setCargandoManual(false);
    });

    return () => {
      unsubscribeSensor();
      unsubscribeManual();
    };
  }, []);

  useEffect(() => {
    const sensorRef = ref(database, "aljibe/historial");
    const manualRef = ref(database, "aljibe/manual/historial");

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      setHistorialSensor(convertirHistorial(snapshot.val(), "sensor"));
    });
    const unsubscribeManual = onValue(manualRef, (snapshot) => {
      setHistorialManual(convertirHistorial(snapshot.val(), "manual"));
    });

    return () => {
      unsubscribeSensor();
      unsubscribeManual();
    };
  }, []);

  const tiempoReal =
    !lecturaSensor ||
    (lecturaManual &&
      new Date(lecturaManual.fecha).getTime() >
        new Date(lecturaSensor.fecha).getTime())
      ? lecturaManual
      : lecturaSensor;

  const historial = useMemo(
    () =>
      [...historialSensor, ...historialManual].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      ),
    [historialSensor, historialManual]
  );

  async function guardarNivelManual(nivel: number): Promise<void> {
    if (!Number.isInteger(nivel) || nivel < 0 || nivel > 100) {
      throw new Error("El nivel debe ser un número entero entre 0 y 100.");
    }

    const { fechaIso, dia, hora } = crearFechaLocal(new Date());
    const distancia = Math.round(
      DISTANCIA_VACIO_CM -
        (nivel / 100) * (DISTANCIA_VACIO_CM - DISTANCIA_LLENO_CM)
    );
    const lectura: LecturaTiempoReal = {
      distancia,
      nivel,
      estado: obtenerEstadoNivel(nivel),
      fecha: fechaIso,
    };

    await update(ref(database), {
      "aljibe/manual/tiempo_real": lectura,
      [`aljibe/manual/historial/${dia}/${hora}`]: lectura,
    });
  }

  return {
    tiempoReal,
    historial,
    loading: cargandoSensor || cargandoManual,
    guardarNivelManual,
  };
}
