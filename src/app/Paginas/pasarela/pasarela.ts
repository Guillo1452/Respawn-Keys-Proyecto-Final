import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PedidoService } from 'src/app/pedido';
import { CarritoService } from 'src/app/carrito';

@Component({
  selector: 'app-pasarela-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pasarela.html',
  styleUrl: './pasarela.css'
})
export class PasarelaPagos implements OnInit {
  procesando = false;
  total = 0;

  datosPago = {
    nombre: '',
    tarjeta: '',
    expiracion: '',
    cvv: ''
  };

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const itemsCarrito = this.carritoService.carrito;

    // Si se entra a la pasarela con el carrito vacio, redirige al inicio por seguridad
    if (!itemsCarrito || itemsCarrito.length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    // Calulo del total del carrito
    this.total = itemsCarrito.reduce((acc, juego) => acc + (juego.precio || 0), 0);
  }

  procesarPago(): void {
    // Bloqueo de seguridad si ya hay una transaccion activa
    if (this.procesando) return;

    // Valida de campos obligatorios del formulario.
    if (!this.datosPago.nombre || !this.datosPago.tarjeta || !this.datosPago.expiracion || !this.datosPago.cvv) {
      alert('Por favor, completa todos los campos de la tarjeta de crédito.');
      return;
    }

    this.procesando = true;

    // Simulador de respuesta de la pasarela 
    setTimeout(() => {
      // Quita los juegos del hisotria de pedidos 
      this.pedidoService.setPedido(this.carritoService.carrito);

      // Evento global de exito para las alertas
      this.carritoService.notificacion$.next('¡Compra realizada con éxito!');

      // Vacia el localstorage
      this.carritoService.limpiarCarrito();

      this.procesando = false;

      //Redirecciona a la pantalla de reclamo y la acticacion de las llaves digitales
      this.router.navigate(['/activacion']);
    }, 2000);
  }
  
  formatearTarjeta(): void {
    let valor = this.datosPago.tarjeta.replace(/[^0-9]/g, '');
    this.datosPago.tarjeta = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  formatearExpiracion(): void {
    let valor = this.datosPago.expiracion.replace(/[^0-9]/g, '');
    if (valor.length > 2) {
      this.datosPago.expiracion = valor.substring(0, 2) + '/' + valor.substring(2, 5);
    } else {
      this.datosPago.expiracion = valor;
    }
  }

  formatearCVV(): void {
    this.datosPago.cvv = this.datosPago.cvv.replace(/[^0-9]/g, '');
  }


}