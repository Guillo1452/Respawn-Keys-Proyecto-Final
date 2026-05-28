import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServicio {

  private firestore: Firestore = inject(Firestore);

  constructor() {}

  obtenerJuegos(): Observable<any[]> {

    const juegosRef = collection(this.firestore, 'juegos');

    return collectionData(juegosRef, {
      idField: 'id'
    }) as Observable<any[]>;
  }
}