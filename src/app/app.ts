import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BarranaNavegacion } from './componentes/barrana-navegacion/barrana-navegacion';
import { PiePagina } from './componentes/pie-pagina/pie-pagina';
import { CarritoService } from './carrito';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BarranaNavegacion,
    PiePagina,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Respawn_Keys');
  mensaje: string | null = null;

  constructor(
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carritoService.notificacion$.subscribe((msg) => {
      this.mensaje = msg;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.mensaje = null;
        this.cdr.detectChanges();
      }, 4000);
    });
  }
}