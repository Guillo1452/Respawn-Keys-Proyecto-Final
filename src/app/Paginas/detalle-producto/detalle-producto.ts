import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarritoService } from 'src/app/carrito';
import { JuegoServicio } from 'src/app/juego-servicio';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
})
export class DetalleProducto implements OnInit {
  juegoActual: any = null;
  plataformasFiltradas: any[] = [];
  imagenPrincipal = '';
  imagenes: string[] = [];
  indiceImagenActual = 0;

  // Mapeo del catalogo estatico
  plataformas = [
    { nombre: 'Steam', tipo: 'PC Digital Key', icono: 'bi bi-steam' },
    { nombre: 'Xbox', tipo: 'Xbox Series X|S Key', icono: 'bi bi-xbox' },
    { nombre: 'PlayStation', tipo: 'PS5 Digital Key', icono: 'bi bi-playstation' },
    { nombre: 'Nintendo Switch 2', tipo: 'Nintendo Switch 2 Digital Key', icono: 'bi bi-nintendo-switch' }
  ];

  plataformaSeleccionada = 'Steam';
  edicionSeleccionada = 'Standard Edition';

  constructor(
    private carritoService: CarritoService,
    private juegoServicio: JuegoServicio,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      const juego = await this.juegoServicio.getJuegoPorId(id);
      if (!juego) return;

      this.juegoActual = juego;
      this.imagenPrincipal = juego.principal || juego.fotocarrito || '';

      // Fusion la portada de la galeria para que no hayan duplicados
      this.imagenes = [this.imagenPrincipal, ...(juego.galeria || [])]
        .filter((img, index, self) => self.indexOf(img) === index);

      // Asegura los string de plataforma en el firebase
      if (juego.plataforma) {
        const nombresPlatJuego = juego.plataforma.split(',').map((p: string) => p.trim().toLowerCase());

        this.plataformasFiltradas = this.plataformas.filter(p => {
          if (p.nombre === 'Steam') {
            return nombresPlatJuego.includes('pc') || nombresPlatJuego.includes('windows') || nombresPlatJuego.includes('macos');
          }
          return nombresPlatJuego.some((nombrePlat: string) => {
            if (p.nombre === 'Xbox' && nombrePlat.includes('xbox')) return true;
            if (p.nombre === 'PlayStation' && (nombrePlat.includes('playstation') || nombrePlat.includes('ps5') || nombrePlat.includes('ps4'))) return true;
            if (p.nombre === 'Nintendo Switch 2' && nombrePlat.includes('nintendo')) return true;
            return false;
          });
        });

        // Configuración de fallback seguro por defecto
        if (this.plataformasFiltradas.length === 0) {
          this.plataformasFiltradas = [this.plataformas[0]];
        }
        this.plataformaSeleccionada = this.plataformasFiltradas[0].nombre;
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error("ERROR CARGANDO JUEGO:", error);
    }
  }

  // logica del carrusel o galeria de imagenes
  cambiarImagen(imagen: string) {
    this.imagenPrincipal = '';
    this.cdr.detectChanges();
    
    // Da un delay de 10ms para el renderizado para el disparo de animacion
    setTimeout(() => {
      this.imagenPrincipal = imagen;
      this.indiceImagenActual = this.imagenes.indexOf(imagen);
      this.cdr.detectChanges();
    }, 10);
  }

  imagenSiguiente() {
    this.indiceImagenActual = (this.indiceImagenActual + 1) >= this.imagenes.length ? 0 : this.indiceImagenActual + 1;
    this.cambiarImagen(this.imagenes[this.indiceImagenActual]);
  }

  imagenAnterior() {
    this.indiceImagenActual = (this.indiceImagenActual - 1) < 0 ? this.imagenes.length - 1 : this.indiceImagenActual - 1;
    this.cambiarImagen(this.imagenes[this.indiceImagenActual]);
  }

  get plataformaActual() {
    return this.plataformas.find(p => p.nombre === this.plataformaSeleccionada) || this.plataformas[0];
  }

  // Persistencia y interaccion con el carrito.
  agregarAlCarrito() {
    if (!this.juegoActual) return;

    this.carritoService.agregarJuego({
      id: this.juegoActual.id,
      titulo: this.juegoActual.titulo,
      precio: this.juegoActual.precio,
      imagen: this.juegoActual.fotocarrito || this.juegoActual.principal,
      plataformaSeleccionada: this.plataformaSeleccionada,
      edicionSeleccionada: this.edicionSeleccionada,
      categoria: this.juegoActual.categoria
    });
  }
}