import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JuegoServicio } from 'src/app/juego-servicio';
import { CarritoService } from 'src/app/carrito';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Inicio implements OnInit {
  // Singnals reactivos para el UI
  juegos = signal<any[]>([]);
  juegosRecientes = signal<any[]>([]);
  juegosTop = signal<any[]>([]);

  constructor(
    private juegoServicio: JuegoServicio,
    private carritoService: CarritoService
  ) {}

  async ngOnInit() {
    try {
      const datos = await this.juegoServicio.getJuegos();
      console.log('🎮 JUEGOS FIREBASE:', datos);

      // Catalogo total
      this.juegos.set(datos);

      // Filtro para lanzamientos recientes.
      const recientes = datos
        .filter((juego: any) => {
          if (!juego.fechaLanzamiento) return false;
          const fecha = new Date(juego.fechaLanzamiento);
          return fecha.getFullYear() >= 2023 && juego.rating >= 3.5;
        })
        .sort((a: any, b: any) => 
          new Date(b.fechaLanzamiento).getTime() - new Date(a.fechaLanzamiento).getTime()
        )
        .slice(0, 8);

      this.juegosRecientes.set(recientes);

      // Filtro para juegos con buenos puntajes para la categoria de mejor calificados
      const top = datos
        .filter((juego: any) => juego.rating >= 4 || juego.metacritic >= 80)
        .sort((a: any, b: any) => {
          const scoreA = (a.rating || 0) + ((a.metacritic || 0) / 20);
          const scoreB = (b.rating || 0) + ((b.metacritic || 0) / 20);
          return scoreB - scoreA;
        })
        .slice(0, 8);

      this.juegosTop.set(top);

      console.log('🔥 RECIENTES:', recientes);
      console.log('⭐ TOP:', top);
    } catch (error) {
      console.error('❌ ERROR FIREBASE:', error);
    }
  }

  // Al hacer una compra rapida desde aqui dara por defecto juegos de steam,
  comprarRapido(juego: any) {
    const item = {
      id: juego.id,
      titulo: juego.titulo,
      precio: juego.precio,
      imagen: juego.fotocarrito || juego.principal,
      plataformaSeleccionada: 'Steam',
      edicionSeleccionada: 'Standard Edition',
      categoria: juego.categoria
    };

    console.log('🛒 Juego agregado:', item);
    this.carritoService.agregarJuego(item);
  }
}