// Server Backend
export const API_URL = 'http://172.30.40.241:3005';


export function obtenerNombreMes(numeroMes: number): string {
  const meses: string[] = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  if (numeroMes < 1 || numeroMes > 12) {
    throw new Error("El número debe estar entre 1 y 12.");
  }
  return meses[numeroMes - 1];
}
