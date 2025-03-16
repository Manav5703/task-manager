import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'lists',
    component: TaskViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'lists/:listId',
    component: TaskViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'new-list',
    component: NewListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'edit-list/:listId',
    component: EditListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'lists/:listId/edit-task/:taskId',
    component: EditTaskComponent,
    canActivate: [authGuard]
  },
  {
    path: 'lists/:listId/new-task',
    component: NewTaskComponent,
    canActivate: [authGuard]
  },
  // Catch-all route to redirect to landing page
  {
    path: '**',
    redirectTo: '/'
  }
];