import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },

  {
    path: 'posts',
    loadComponent: () =>
      import('./components/posts-list/posts-list').then((m) => m.PostsList),
  },
  {
    path: 'posts/new',
    loadComponent: () =>
      import('./components/post-form/post-form').then((m) => m.PostForm),
  },
  {
    path: 'posts/edit/:id',
    loadComponent: () =>
      import('./components/post-form/post-form').then((m) => m.PostForm),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./components/post-detail/post-detail').then((m) => m.PostDetail),
  },

  { path: '**', redirectTo: 'posts' },
];
