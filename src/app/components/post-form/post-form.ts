import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  postId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  ngOnInit(): void {
    this.form = this.fb.group({
      userId: [null, [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', Validators.required],
    });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.postId = Number(idParam);
      this.loadPost(this.postId);
    }
  }

  loadPost(id: number): void {
    this.loading = true;
    this.postsService.getPost(id).subscribe({
      next: (post) => {
        this.form.patchValue({
          userId: post.userId,
          title: post.title,
          body: post.body,
        });
        this.loading = false;
      },
      error: () => {
        alert('Error al cargar la publicación');
        this.loading = false;
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: Post = this.form.value;

    if (this.isEdit && this.postId) {
      this.postsService.updatePost(this.postId, data).subscribe({
        next: () => {
          alert('Publicación actualizada (simulado).');
          this.router.navigate(['/posts']);
        },
        error: () => alert('Error al actualizar publicación'),
      });
    } else {
      this.postsService.createPost(data).subscribe({
        next: () => {
          alert('Publicación creada (simulado).');
          this.router.navigate(['/posts']);
        },
        error: () => alert('Error al crear publicación'),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/posts']);
  }
}
