import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// credenciales del firebase
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
const db = getFirestore(app);

@Injectable({
  providedIn: 'root'
})
export class JuegoServicio {

  constructor() {}

  // obtiene los juegos de la tabla juegos
  async getJuegos(): Promise<any[]> {
    try {
      const juegosRef = collection(db, 'juegos');
      const snapshot = await getDocs(juegosRef);
      
      const juegos = snapshot.docs.map(docItem => ({
        id: docItem.id,
        ...docItem.data()
      }));

      console.log("JUEGOS FIREBASE RECONOCIDOS:", juegos);
      return juegos;
    } catch (error) {
      console.error("ERROR OBTENIENDO JUEGOS DESDE FIRESTORE:", error);
      return [];
    }
  }

  // Obtiene los detalles de los juegos mediante la ID de estos
  async getJuegoPorId(id: string): Promise<any | null> {
    try {
      console.log("CONSULTANDO JUEGO POR ID CON:", id);
      const juegoRef = doc(db, 'juegos', id);
      const snapshot = await getDoc(juegoRef);

      if (snapshot.exists()) {
        const juego = {
          id: snapshot.id,
          ...snapshot.data()
        };
        console.log("JUEGO ENCONTRADO EN LA BD:", juego);
        return juego;
      }

      console.error("EL DOCUMENTO DE JUEGO SOLICITADO NO EXISTE EN FIRESTORE.");
      return null;
    } catch (error) {
      console.error("ERROR AL INTENTAR BUSCAR EL JUEGO POR ID:", error);
      return null;
    }
  }
}
