import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JuegoServicio } from 'src/app/juego-servicio';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class Categoria implements OnInit {
  //Esta en estado reactivo con signal para para almacenar las colecciones base
  juegos = signal<any[]>([]);
  juegosFiltrados = signal<any[]>([]);
  
  categoriaActual = '';
  plataformaFiltro = 'todas';
  ordenFiltro = 'rating';

  constructor(
    private route: ActivatedRoute,
    private juegoServicio: JuegoServicio
  ) {}

  async ngOnInit() {
    // Verifica los parametros de la URL para recalcular la categoria a buscar de forma dinamica
    this.route.paramMap.subscribe(async params => {
      this.categoriaActual = (params.get('nombre') || '').toLowerCase();
      
      // Verifica el catalogo del firebase
      const datos = await this.juegoServicio.getJuegos();
      this.juegos.set(datos);
      this.filtrarJuegos();
    });
  }

  // Motor para filtar y ordenar de forma dinamica
  filtrarJuegos() {
    let juegos = this.juegos();
    const plataformas = ['pc', 'playstation', 'xbox', 'nintendo'];
    const esPlataforma = plataformas.includes(this.categoriaActual);

    //Filtro principal  verifica la URL de la plataforma o el generode categoria
    juegos = juegos.filter((juego: any) => {
      const categoria = (juego.categoria || '').toLowerCase().trim();
      const plataforma = (juego.plataforma || '').toLowerCase().trim();

      if (esPlataforma) {
        return plataforma.includes(this.categoriaActual);
      }

      switch (this.categoriaActual) {
        case 'shooter':
          return categoria === 'shooter';
        case 'role-playing-games-rpg':
          return categoria.includes('rpg') || categoria.includes('role');
        case 'action':
          return categoria === 'action';
        case 'horror':
          return categoria.includes('horror') || categoria.includes('survival horror');
        case 'adventure':
          return categoria === 'adventure';
        case 'sports':
          return categoria === 'sports';
        case 'racing':
          return categoria === 'racing';
        case 'simulation':
          return categoria === 'simulation';
        default:
          return true;
      }
    });

    // Filtro secundario a la izquierda a la de seleccion
    if (this.plataformaFiltro !== 'todas') {
      juegos = juegos.filter((juego: any) => 
        (juego.plataforma || '').toLowerCase().includes(this.plataformaFiltro)
      );
    }

    // Algoritmo para ordenar la coleccion
    switch (this.ordenFiltro) {
      case 'rating':
        juegos.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'precio-menor':
        juegos.sort((a: any, b: any) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'precio-mayor':
        juegos.sort((a: any, b: any) => (b.precio || 0) - (a.precio || 0));
        break;
      case 'nuevos':
        juegos.sort((a: any, b: any) => 
          new Date(b.fechaLanzamiento).getTime() - new Date(a.fechaLanzamiento).getTime()
        );
        break;
    }
    this.juegosFiltrados.set(juegos);
  }

  // Captura las acciones en la seccion lateral
  cambiarPlataforma(event: any) {
    this.plataformaFiltro = event.target.value;
    this.filtrarJuegos();
  }

  cambiarOrden(event: any) {
    this.ordenFiltro = event.target.value;
    this.filtrarJuegos();
  }
}