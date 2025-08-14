import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EditUser } from '../../components/edit-user-modal/edit-user-modal';
import { FormsModule } from '@angular/forms';
import { UserDetail } from '../../interfaces/user-detail';

@Component({
  selector: 'app-users',
  imports: [AsyncPipe,MatIconModule, EditUser, CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  authService = inject(Auth);
  users$ = this.authService.getAll(); // Observable<UserDetail[]>

  selectedUser: UserDetail | null = null;

  // Abre el modal con el usuario seleccionado
  openEdit(user: UserDetail) {
    this.selectedUser = user;
  }

  // Cierra el modal
  closeEdit() {
    this.selectedUser = null;
  }

  // Recargar usuarios
  refreshUsers() {
    this.users$ = this.authService.getAll();
  }

  // Eliminar usuario
  deleteUser(id: string) {
    this.authService.deleteUser(id).subscribe({
      next: () => {
        console.log('Usuario eliminado:', id);
        this.refreshUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
      }
    });
  }

  trackById(index: number, item: { id: string }): string {
  return item.id;
  }

  // Guardar cambios del usuario editado
  saveEdit(data: { id: string; fullName: string; email: string }) {
    const { id, ...updateData } = data;
    this.authService.editUser(id, updateData).subscribe({
      next: () => {
        this.refreshUsers();
        this.closeEdit(); // ✅ Ya está definido
      },
      error: err => console.error('Error al editar usuario:', err),
    });
  }
}