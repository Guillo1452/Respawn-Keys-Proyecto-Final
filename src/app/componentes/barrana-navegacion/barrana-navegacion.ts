import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from 'src/app/carrito';
import { AuthService } from 'src/app/auth-servicio';

@Component({
  selector: 'app-barrana-navegacion',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './barrana-navegacion.html',
  styleUrl: './barrana-navegacion.css',
})
export class BarranaNavegacion implements OnInit {

  //Estados de la intertaz y auth

  usuarioLogueado = false;
  menuAbierto = false;
  busqueda = '';
  buscadorAbierto = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verifica el estado de autenticacion del usuario de forma periodica
    this.authService.obtenerUsuario((user) => {
      this.usuarioLogueado = !!user;
    });
  }


  // retorna la cantidad de juegos en el carro para mostrar el valor.
  get cantidadJuegos(): number {
    return this.carritoService.carrito.length;
  }

  // Alterna los estados de apertura y cierre
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  // Cierra el manu al ahcer click afuera 
  cerrarMenu() {
    this.menuAbierto = false;
  }

  // Alterna la visibilidad de la barra de busqueda
  toggleBuscador() {
    this.buscadorAbierto = !this.buscadorAbierto;
  }

  // Procesa el texto ingresdado por los usuarios y dirige a un catalogo donde se veran los 
  // juegos con el mismo nombre o un catalogo completo de todos los juegos.
  buscarJuego() {
    console.log('Buscando:', this.busqueda);
    const texto = this.busqueda.trim();

    // Envia a un catalogo limpio en caso de no poner nada.
    if (!texto) {
      this.router.navigate(['/catalogo']);
      this.buscadorAbierto = false;
      return;
    }

    // Navega con los parametros de busqueda.
    this.router.navigate(
      ['/catalogo'],
      {
        queryParams: {
          buscar: texto
        }
      }
    );

    // Limpiea los estados despues de realizar la busqueda.
    this.buscadorAbierto = false;
    this.busqueda = '';
  }

  // Destruye la sesion en el firebase y limpia la memoria local.
  async cerrarSesion() {
    await this.authService.cerrarSesion();
    localStorage.removeItem('sesionIniciada');
    this.router.navigate(['/home']);
  }
}