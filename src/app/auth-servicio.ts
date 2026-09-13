import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  setDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // registro
  async registrar(
    correo: string,
    contrasena: string,
    nombre: string,
    apellidos: string,
    nombreUsuario: string,
    fechaNacimiento: string,
    pais: string
  ) {

    //crea el usuario en el auth
    const usuarioCreado = await createUserWithEmailAndPassword(
      auth,
      correo,
      contrasena
    );

    // obtiene el uid
    const uid = usuarioCreado.user.uid;

    // guarda los datos en el firestore
    await setDoc(doc(db, 'usuarios', uid), {
      correo: correo,
      nombre: nombre,
      apellidos: apellidos,
      nombreUsuario: nombreUsuario,
      fechaNacimiento: fechaNacimiento,
      pais: pais,
      uid: uid
    });

    return usuarioCreado;
  }

  // login
  login(correo: string, contrasena: string) {
    return signInWithEmailAndPassword(
      auth,
      correo,
      contrasena
    );
  }
  // detecta si hay usuarios activos
obtenerUsuario(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Cerrar sesion
cerrarSesion() {
  return signOut(auth);
}
}
