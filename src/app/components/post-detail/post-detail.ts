import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit {
  post?: Post;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? Number(idStr) : null;
    if (!id) {
      this.error = 'ID inválido';
      return;
    }

    this.loading = true;
    this.postsService.getPost(id).subscribe({
      next: (data) => {
        this.post = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar la publicación.';
        this.loading = false;
      },
    });
  }
  editPost(): void {
    if (this.post?.id) {
      this.router.navigate(['/posts/edit', this.post.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
