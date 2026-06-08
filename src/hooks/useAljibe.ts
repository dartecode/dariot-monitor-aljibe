import { useEffect, useState } from "react";
import { ref, onValue, off, query, limitToLast } from "firebase/database";
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
    const historialRef = query(
      ref(database, "aljibe/historial"),
      limitToLast(5000)
    );

    const unsubscribeHistorial = onValue(historialRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setHistorial([]);
        return;
      }

      const lista: LecturaHistorial[] = Object.entries(data).map(
        ([id, value]) => ({
          id,
          ...(value as Omit<LecturaHistorial, "id">),
        })
      );

      setHistorial(lista.reverse());
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