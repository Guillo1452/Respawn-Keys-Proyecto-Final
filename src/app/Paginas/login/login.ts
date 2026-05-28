import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth-servicio';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  mostrarRegistro = false;
  mensaje = '';
  tipoMensaje = '';

 
  correoLogin = '';
  contrasenaLogin = '';


  correo = '';
  contrasena = '';
  confirmarContrasena = '';
  nombre = '';
  apellidos = '';
  nombreUsuario = '';
  fechaNacimiento = '';
  pais = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Captura de mensajes por restricciones
    this.route.queryParams.subscribe((params) => {
      if (params['mensaje']) {
        this.mostrarMensaje(params['mensaje'], params['tipo'] || 'error');
      }
    });
  }

  cambiarFormulario() {
    this.mostrarRegistro = !this.mostrarRegistro;
    this.mensaje = '';
  }

  mostrarMensaje(texto: string, tipo: string) {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 4000);
  }

  // Proceso de auntentificacion del firebase
  async resgistrar() {
    if (!this.correo || !this.contrasena || !this.confirmarContrasena || !this.nombre || 
        !this.apellidos || !this.nombreUsuario || !this.fechaNacimiento || !this.pais) {
      this.mostrarMensaje('Por favor completa todos los campos', 'error');
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.mostrarMensaje('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      await this.authService.registrar(
        this.correo, this.contrasena, this.nombre, this.apellidos, 
        this.nombreUsuario, this.fechaNacimiento, this.pais
      );
      this.mostrarMensaje('Usuario registrado correctamente', 'success');
      setTimeout(() => this.router.navigate(['/home']), 1500);
    } catch (error) {
      this.mostrarMensaje('Error al registrar', 'error');
    }
  }

  async iniciarSesion() {
    if (!this.correoLogin || !this.contrasenaLogin) {
      this.mostrarMensaje('Completa todos los campos', 'error');
      return;
    }

    try {
      await this.authService.login(this.correoLogin, this.contrasenaLogin);
      this.mostrarMensaje('Inicio de sesión exitoso', 'success');
      setTimeout(() => this.router.navigate(['/home']), 1500);
    } catch (error) {
      this.mostrarMensaje('Correo o contraseña incorrectos', 'error');
    }
  }
}