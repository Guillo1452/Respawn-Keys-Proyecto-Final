import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilServicio } from '../../perfil-servicio';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.css'
})
export class EditarPerfil implements OnInit {
  // modelo de los datos
  nombre = '';
  apellidos = '';
  correo = '';
  nombreUsuario = '';
  pais = '';

  // credenciales de seguridad
  contrasenaActual = '';
  nuevaContrasena = '';
  confirmarContrasena = '';

  // carga global
  cargando = true;

 
  constructor(
    private perfilServicio: PerfilServicio,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.cargando = true;
    try {
      // Consumo conectado al firebase y el auth
      const datos: any = await this.perfilServicio.obtenerDatosUsuario();
      if (datos) {
        this.nombre = datos.nombre || '';
        this.apellidos = datos.apellidos || '';
        this.correo = datos.correo || '';
        this.nombreUsuario = datos.nombreUsuario || '';
        this.pais = datos.pais || '';
      }
    } catch (error) {
      console.error("Error en Respawn Keys:", error);
    } finally {
      // Paga la carga de forma segura
      this.cargando = false;
      //Hace que el angular repita los inputs
      this.cdr.detectChanges();
    }
  }

  // Actualizacion de los datos
  // Envia los datos a editar
  async guardarCambios() {
    try {
      await this.perfilServicio.actualizarPerfil(
        this.nombre,
        this.apellidos,
        this.correo,
        this.nombreUsuario,
        this.pais
      );
      alert('Perfil actualizado');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  // Valida que los campos esten completos y coinsidan
  async cambiarContrasena() {
    if (!this.contrasenaActual || !this.nuevaContrasena || !this.confirmarContrasena) {
      alert('Completa todos los campos');
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      await this.perfilServicio.cambiarContrasena(this.contrasenaActual, this.nuevaContrasena);
      alert('Contraseña actualizada');
      
      // Se limpian los campos cuando se realizacon los cambios.
      this.contrasenaActual = '';
      this.nuevaContrasena = '';
      this.confirmarContrasena = '';
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }
}