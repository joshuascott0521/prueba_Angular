import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';

// Importamos los componentes visuales personalizados
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleInfo,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList implements OnInit {
  posts: Post[] = [];
  loading = false;
  error = '';

  faPlus = faPlus;
  faCircleInfo = faCircleInfo;
  faEye = faEye;
  faPen = faPen;
  faTrash = faTrash;
  // Estado del modal
  showModal = false;
  postToDelete?: number;

  // Estado del toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private postsService: PostsService, private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.postsService.getPosts().subscribe({
      next: (data) => {
        // Limitamos a 10 publicaciones
        this.posts = data.slice(0, 10);
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar publicaciones';
        this.loading = false;
      },
    });
  }

  view(post: Post): void {
    this.router.navigate(['/posts', post.id]);
  }

  edit(post: Post): void {
    this.router.navigate(['/posts/edit', post.id]);
  }

  // ✅ Mostrar el modal
  delete(postId?: number): void {
    if (!postId) return;
    this.postToDelete = postId;
    this.showModal = true;
  }

  // ✅ Confirmar eliminación (sin alert ni confirm)
  confirmDelete(): void {
    if (!this.postToDelete) return;

    // JSONPlaceholder no elimina realmente, simulamos
    this.postsService.deletePost(this.postToDelete).subscribe({
      next: () => {
        this.posts = this.posts.filter((p) => p.id !== this.postToDelete);
        this.showModal = false;
        this.showToastMessage(
          'Publicación eliminada correctamente.',
          'success'
        );
      },
      error: () => {
        this.showModal = false;
        this.showToastMessage('Error al eliminar la publicación.', 'error');
      },
    });
  }

  // ✅ Cancelar el modal
  cancelDelete(): void {
    this.showModal = false;
  }

  // ✅ Mostrar toast visual
  showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  create(): void {
    this.router.navigate(['/posts/new']);
  }
}
