import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDetail } from '../../interfaces/user-detail';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user-modal',
  imports: [FormsModule],
  templateUrl: './edit-user-modal.html',
  styleUrl: './edit-user-modal.css'
})
export class EditUser {
  @Input() user: UserDetail | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<{ id: string; fullName: string; email: string }>();

  nombre: string = '';
  correo: string = '';

  ngOnChanges() {
    if (this.user) {
      this.nombre = this.user.fullName;
      this.correo = this.user.email;
    }
  }

  guardar() {
    if (this.user) {
      this.onSave.emit({
        id: this.user.id,
        fullName: this.nombre.trim(),
        email: this.correo.trim(),
      });
    }
  }
}