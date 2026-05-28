import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private juegosComprados: any[] = [];

  constructor() { }

  setPedido(juegos: any[]) {
    this.juegosComprados = juegos.map(juego => ({
      ...juego,
      key: this.generarKey(),
      revelado: false 
    }));
  }

  getPedido() {
    return this.juegosComprados;
  }


  private generarKey(): string {
    // Genera un codigo tipo: XXXX-XXXX-XXXX-XXXX para que muestre una simulacion de la entrega de los codigos
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segmento = () => Array.from({ length: 4 }, () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))).join('');
    return `${segmento()}-${segmento()}-${segmento()}-${segmento()}`;
  }
}