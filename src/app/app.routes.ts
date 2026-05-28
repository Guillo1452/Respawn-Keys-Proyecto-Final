import { Routes } from '@angular/router';

import { Inicio } from './Paginas/Inicio/home';
import { DetalleProducto } from './Paginas/detalle-producto/detalle-producto';
import { Login } from './Paginas/login/login';
import { Carrito } from './Paginas/carrito/carrito';
import { PasarelaPagos } from './Paginas/pasarela/pasarela';
import { ActivacionComponent } from './componentes/activacion/activacion';
import { Categoria } from './Paginas/categoria/categoria';
import { Catalogo } from './componentes/catalogo/catalogo';
import { EditarPerfil } from './componentes/editar-perfil/editar-perfil';

export const routes: Routes = [
  {
    path: '', component: Inicio,
  },
  {
    path: 'detalle/:id', component: DetalleProducto,
  },
  {
    path: 'login', component: Login,
  },
  {
    path: 'carrito', component: Carrito,
  },
  {
    path: 'pagar', component: PasarelaPagos,
  },
  {
    path: 'pasarela-pagos', component: PasarelaPagos,
  },
  {
    path: 'activacion', component: ActivacionComponent,
  },
  {
    path: 'categoria/:nombre',
    loadComponent: () => import('./Paginas/categoria/categoria').then((m) => m.Categoria),
  },
  {
    path: 'editar-perfil', component: EditarPerfil,
  },
  {
    path: 'catalogo', component: Catalogo
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },

  
];
