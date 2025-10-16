import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

@Component({
  selector: 'app-post-form-mejorado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;
  postId: number | null = null;

  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalAction: (() => void) | null = null;

  showToast = false;
  toastMessage = '';
  toastType: 'toast-success' | 'toast-error' = 'toast-success';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEdit = true;
        this.postId = +params['id'];
        this.loadPost(this.postId);
      }
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      userId: [1, [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required]],
    });
  }

  async loadPost(id: number): Promise<void> {
    try {
      this.loading = true;
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );

      if (!response.ok) {
        throw new Error('No se pudo cargar la publicación');
      }

      const post: Post = await response.json();
      this.form.patchValue({
        userId: post.userId,
        title: post.title,
        body: post.body,
      });
    } catch (error) {
      console.error('Error loading post:', error);
      this.displayToast('Error al cargar la publicación', 'toast-error');
      this.cancel();
    } finally {
      this.loading = false;
    }
  }

  displayToast(message: string, type: 'toast-success' | 'toast-error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  openModal(title: string, message: string, action: () => void): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalAction = action;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalAction = null;
  }

  confirmModal(): void {
    if (this.modalAction) {
      this.modalAction();
    }
    this.closeModal();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    try {
      const postData: Post = this.form.value;
      const url = this.isEdit
        ? `https://jsonplaceholder.typicode.com/posts/${this.postId}`
        : 'https://jsonplaceholder.typicode.com/posts';

      const method = this.isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la publicación');
      }

      const result = await response.json();
      console.log('Success:', result);

      this.displayToast(
        this.isEdit
          ? 'Publicación actualizada exitosamente'
          : 'Publicación creada exitosamente',
        'toast-success'
      );

      setTimeout(() => {
        this.router.navigate(['/posts']);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      this.displayToast(
        'Error al guardar la publicación. Por favor, intenta de nuevo.',
        'toast-error'
      );
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    if (this.form.dirty) {
      this.openModal(
        '¿Cancelar cambios?',
        'Los cambios no guardados se perderán. ¿Estás seguro de que deseas continuar?',
        () => this.router.navigate(['/posts'])
      );
    } else {
      this.router.navigate(['/posts']);
    }
  }
}
