import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CarritoService {
  private listaCarrito: any[] = [];

  notificacion$ = new Subject<string>();

  constructor() {
    this.cargarCarrito();
  }

  get carrito() {
    return this.listaCarrito;
  }

  agregarJuego(juegoNuevo: any) {
    // verifica si ya hay un juego con el mismo id en el carrito.
    const existe = this.listaCarrito.find(j => j.id === juegoNuevo.id);

    if (existe) {
      // Si ya existe envia el mensaje de que el juego ya esta en el carrito
      this.notificacion$.next(`"${juegoNuevo.titulo}" ya está en tu carrito`);
    } else {
      // Si no existe el juego lo se agrega el juego con normalidad
      this.listaCarrito.push(juegoNuevo);
      this.guardarCarrito();
      this.notificacion$.next(`¡${juegoNuevo.titulo} añadido con éxito!`);
    }
  }

  eliminarJuego(index: number) {
    this.listaCarrito.splice(index, 1);
    this.guardarCarrito();
  }

  obtenerTotal() {
    return this.listaCarrito.reduce((acc, juego) => acc + juego.precio, 0);
  }

  limpiarCarrito() {
    this.listaCarrito = [];
    this.guardarCarrito();
  }

  private guardarCarrito() {
    localStorage.setItem('carrito_gamer', JSON.stringify(this.listaCarrito));
  }

  private cargarCarrito() {
    const datos = localStorage.getItem('carrito_gamer');
    if (datos) {
      this.listaCarrito = JSON.parse(datos);
    }
  }
}