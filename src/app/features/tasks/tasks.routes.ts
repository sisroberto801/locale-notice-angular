import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/task-list-page/task-list-page').then((m) => m.TaskListPage),
  },
] as Routes;
