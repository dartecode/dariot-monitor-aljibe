export interface LecturaTiempoReal {
  distancia_cm: number;
  nivel_actual: number;
  estado: string;
  fecha_captura: string;
}

export interface LecturaHistorial {
  id: string;
  distancia_cm: number;
  nivel: number;
  estado: string;
  fecha_captura: string;
}