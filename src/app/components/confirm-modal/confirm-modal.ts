// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-confirm-modal',
//   imports: [],
//   templateUrl: './confirm-modal.html',
//   styleUrl: './confirm-modal.scss'
// })
// export class ConfirmModal {

// }
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro de realizar esta acción?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
