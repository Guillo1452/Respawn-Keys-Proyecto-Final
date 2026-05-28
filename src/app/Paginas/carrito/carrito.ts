import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink} from '@angular/router';

import { CarritoService } from 'src/app/carrito';
import { AuthService } from 'src/app/auth-servicio';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  usuarioLogueado = false;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Detecta si hay usuario con la cuenta iniciada
    this.authService.obtenerUsuario((user) => {
      this.usuarioLogueado = !!user;
    });
  }

  // Lista del carrito
  get carrito() {
    return this.carritoService.carrito;
  }

  // Eliminar jeugos del carrito
  eliminarJuego(index: number) {
    this.carritoService.eliminarJuego(index);
  }

  // Total del calor de los jeugos
  get total() {
    return this.carritoService.obtenerTotal();
  }

  // LLimpia el carrito de los juegos
  limpiarCarrito() {
    this.carritoService.limpiarCarrito();
  }

  // Continuar con el pago
  irAPagar() {
    // Verifica si el carro esta vacio
    if (this.carrito.length === 0) {
      return;
    }

    // Verifica si esta iniciada la sesion para continuar con el pago
    if (!this.usuarioLogueado) {
      this.router.navigate(['/login'], {
        queryParams: {
          mensaje: 'Debes iniciar sesión para continuar con el pago',
        },
      });

      return;
    }

    // Si el usuario esta iniciado envia la pasarela.
    this.router.navigate(['/pasarela-pagos']);
  }
}
