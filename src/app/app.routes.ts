import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then((m) => m.default),
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.routes').then((m) => m.default),
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
];
