import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../firebase/firebase";
import type { LecturaTiempoReal, LecturaHistorial } from "../types/aljibe";

export function useTanque() {
  const [tiempoReal, setTiempoReal] = useState<LecturaTiempoReal | null>(null);
  const [historial, setHistorial] = useState<LecturaHistorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tiempoRealRef = ref(database, "aljibe/tiempo_real");

    const unsubscribeTiempoReal = onValue(tiempoRealRef, (snapshot) => {
      if (snapshot.exists()) {
        setTiempoReal(snapshot.val());
      } else {
        setTiempoReal(null);
      }

      setLoading(false);
    });

    return () => {
      off(tiempoRealRef);
      unsubscribeTiempoReal();
    };
  }, []);

  useEffect(() => {
    const historialRef = ref(database, "aljibe/historial");

    const unsubscribeHistorial = onValue(historialRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setHistorial([]);
        return;
      }

      const lista: LecturaHistorial[] = [];

      Object.entries(data).forEach(([fechaDia, lecturasDia]) => {
        if (!lecturasDia || typeof lecturasDia !== "object") return;

        Object.entries(lecturasDia as Record<string, any>).forEach(
          ([horaClave, value]) => {
            lista.push({
              id: `${fechaDia}_${horaClave}`,
              ...(value as Omit<LecturaHistorial, "id">),
            });
          }
        );
      });

      lista.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      setHistorial(lista);
    });

    return () => {
      unsubscribeHistorial();
    };
  }, []);

  return {
    tiempoReal,
    historial,
    loading,
  };
}