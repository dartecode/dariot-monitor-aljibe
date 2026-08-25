export interface LecturaTiempoReal {
  distancia: number;
  nivel: number;
  estado: string;
  fecha: string;
  origen?: "sensor" | "manual";
}

export interface LecturaHistorial {
  id: string;
  distancia: number;
  nivel: number;
  estado: string;
  fecha: string;
  origen?: "sensor" | "manual";
}
