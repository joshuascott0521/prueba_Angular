//
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast implements OnInit {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';
  @Input() duration = 3000;

  visible = false;

  ngOnInit() {
    this.show();
  }

  show() {
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }
}
