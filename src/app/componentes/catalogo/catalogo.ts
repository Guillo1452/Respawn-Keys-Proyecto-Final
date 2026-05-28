import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from 'src/app/carrito';
import { JuegoServicio } from '../../juego-servicio';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {

  //Propiedades y estados.
  todosLosJuegos: any[] = [];
  listaJuegos: any[] = [];
  textoBusqueda = '';
  plataformaFiltro = 'todas';
  categoriaFiltro = 'todas';

  constructor(
    private juegosService: JuegoServicio,
    private carritoService: CarritoService,
    private route: ActivatedRoute
  ) { }

  // Inicicializacion y suscripcion
  async ngOnInit(): Promise<void> {
    try {
      // Carga la base de datos del firestore
      const data = await this.juegosService.getJuegos();
      this.todosLosJuegos = data;
      console.log('🎮 Juegos cargados:', this.todosLosJuegos);

      // Escucha activa de los paramecros de los catalogos para buscar
      this.route.queryParams.subscribe(params => {
        this.textoBusqueda = (params['buscar'] || '').toLowerCase().trim();
        console.log('🔍 Buscando:', this.textoBusqueda);

        // Cuaod cambia la URL calcula los filtros
        this.aplicarFiltros();
      });
    } catch (err) {
      console.error('❌ Error catálogo:', err);
    }
  }

  // motor de filtrado
  aplicarFiltros() {
    let juegos = [...this.todosLosJuegos];

    // Evalua las coincidencias por titulo, categoria y plataforma.
    if (this.textoBusqueda) {
      juegos = juegos.filter((juego: any) => {
        const titulo = (juego.titulo || '').toLowerCase();
        const categoria = (juego.categoria || '').toLowerCase();
        const plataforma = (juego.plataforma || '').toLowerCase();

        return (
          titulo.includes(this.textoBusqueda) ||
          categoria.includes(this.textoBusqueda) ||
          plataforma.includes(this.textoBusqueda)
        );
      });
    }

    // Filtro por plataforma.
    if (this.plataformaFiltro !== 'todas') {
      juegos = juegos.filter((juego: any) =>
        (juego.plataforma || '').toLowerCase().includes(this.plataformaFiltro)
      );
    }

    // Filtra por categoria o genero.
    if (this.categoriaFiltro !== 'todas') {
      juegos = juegos.filter((juego: any) =>
        (juego.categoria || '').toLowerCase().includes(this.categoriaFiltro)
      );
    }

    // Actualiza ek estado visual.
    this.listaJuegos = juegos;
    console.log('🎯 Resultados:', this.listaJuegos.length);
  }

  // Gestiona la entrada de los juegos al carrito.
  // Normaliza el estado del juego y lo envia a  cartoService.
  agregarAlCarrito(juego: any) {
    const item = {
      id: juego.id,
      titulo: juego.titulo,
      precio: juego.precio,
      imagen: juego.fotocarrito || juego.principal,
      plataformaSeleccionada: 'Steam',
      edicionSeleccionada: 'Standard Edition',
      categoria: juego.categoria
    };

    console.log('🛒 Agregado:', item);
    this.carritoService.agregarJuego(item);
  }
}