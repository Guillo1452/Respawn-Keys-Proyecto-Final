import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PedidoService } from 'src/app/pedido';

@Component({
  selector: 'app-activacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './activacion.html',
  styleUrl: './activacion.css'
})
export class ActivacionComponent implements OnInit {

  // Almacena y alimenta el listado de juegos dinamicos (*ngFor) en el HTML
  productos: any[] = [];

  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) {}


  ngOnInit() {
    //Intentamos recuperar los datos del pedido procesado desde el servicio compartido
    const pedidoGuardado = this.pedidoService.getPedido();

    //Verifica si hay datos, en caso de que no redirije para que no quede en una pagina vacia
    if (pedidoGuardado && pedidoGuardado.length > 0) {
      //Mapeamos los juegos agreagandoles el control visual
      this.productos = pedidoGuardado.map(juego => ({
        ...juego,
        revelado: false //Con false mantenemos los juegos con la capa de censura activa
      }));
    } else {
      //En caso de que el usuario refresco lo envia a home.
      console.warn("No se encontraron productos comprados.");
      this.router.navigate(['/home']);
    }
  }

  // Modifica la censura del juego para que se revele el codigo
  revelarKey(juego: any) {
    juego.revelado = true;
  }

  // Captura el codigo y lo transfiere a la memoria del navegador
  copiar(key: string) {
    if (key) {
      navigator.clipboard.writeText(key);

    }
  }
}