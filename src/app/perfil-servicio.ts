import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged, User} from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

// Credenciales del firebase
const firebaseConfig = {
  apiKey: "AIzaSyBV3rfH4GlRx1XQ8wpj0jWX6KRzwu5r9Ss",
  authDomain: "respawnkeys-1f39b.firebaseapp.com",
  projectId: "respawnkeys-1f39b",
  storageBucket: "respawnkeys-1f39b.firebasestorage.app",
  messagingSenderId: "777666885058",
  appId: "1:777666885058:web:d49da6b0d5f5072540d25b",
  measurementId: "G-ZV3KQF7N8L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class PerfilServicio {
  //Almacena los datos del usuario
  private datosUsuarioCache$ = new BehaviorSubject<any>(null);

  constructor() {
    // Verificacion activa del estado de la autentificacion para limpiar el cache al ahcer el cierre de sesion
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        this.datosUsuarioCache$.next(null);
      }
    });
  }

   
  // Obtener los datos del usuario
  async obtenerDatosUsuario(forzarRefresco: boolean = false): Promise<any> {
    // Si ya estan los datos en el cache y exige refresco de la pagina
    if (this.datosUsuarioCache$.value && !forzarRefresco) {
      return this.datosUsuarioCache$.value;
    }

    // Espera de forma segura el auth del firebase para la inicializacion
    const usuario = await this.obtenerUsuarioActualAsincrono();
    if (!usuario) {
      throw new Error('No se detectó un usuario activo en el sistema.');
    }

    // Preticion a la coleccion del firebase
    const documento = await getDoc(doc(db, 'usuarios', usuario.uid));
    const datos = documento.data();

    // Actualiza la informacion del cache local para futuras consultas
    this.datosUsuarioCache$.next(datos);
    return datos;
  }

  // Actaulizacion de los datos del perfil

  async actualizarPerfil(
    nombre: string,
    apellidos: string,
    correo: string,
    nombreUsuario: string,
    pais: string
  ): Promise<void> {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error('No hay una sesión de usuario activa.');

    const nuevosDatos = { nombre, apellidos, correo, nombreUsuario, pais };

    // Actualiza los datos en el firestore
    await updateDoc(doc(db, 'usuarios', usuario.uid), nuevosDatos);

    // Actualiza el cache local para los componentes
    this.datosUsuarioCache$.next({ ...this.datosUsuarioCache$.value, ...nuevosDatos });

    // Modifica los credenciales de firebase auth por si el email cambio.
    if (correo !== usuario.email) {
      await updateEmail(usuario, correo);
    }
  }

  // Cambia las credenciales
  async cambiarContrasena(contrasenaActual: string, nuevaContrasena: string): Promise<void> {
    const usuario = auth.currentUser;
    if (!usuario || !usuario.email) throw new Error('Sesión inválida para cambiar credenciales.');

    // Verifica el token antes de realizar cambios
    const credencial = EmailAuthProvider.credential(usuario.email, contrasenaActual);
    await reauthenticateWithCredential(usuario, credencial);
    await updatePassword(usuario, nuevaContrasena);
  }

  // Asegura que el auth no devuelve null
  private obtenerUsuarioActualAsincrono(): Promise<User | null> {
    return new Promise((resolve) => {
      if (auth.currentUser) {
        resolve(auth.currentUser);
      } else {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
      }
    });
  }
}