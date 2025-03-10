import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/lists',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'lists',
    loadComponent: () => import('./pages/task-view/task-view.component').then(m => m.TaskViewComponent),
    canActivate: [authGuard]
  },
  {
    path: 'lists/:listId',
    loadComponent: () => import('./pages/task-view/task-view.component').then(m => m.TaskViewComponent),
    canActivate: [authGuard]
  },
  {
    path: 'new-list',
    loadComponent: () => import('./pages/new-list/new-list.component').then(m => m.NewListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'lists/:listId/new-task',
    loadComponent: () => import('./pages/new-task/new-task.component').then(m => m.NewTaskComponent),
    canActivate: [authGuard]
  }
];