import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { UserDetail } from '../../interfaces/user-detail';
import { MatIconModule } from '@angular/material/icon';
import { EditUser } from '../../components/edit-user-modal/edit-user-modal';

@Component({
  selector: 'app-account',
  imports: [CommonModule, MatIconModule, EditUser],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account  {
  authService = inject(Auth);

  // Solo trae el detalle del usuario autenticado
  accountDetail$ = this.authService.getDetail();

  selectedUser: UserDetail | null = null;

  // Abre modal de edición con los datos del usuario autenticado
  openEdit(user: UserDetail) {
    this.selectedUser = { ...user }; // Se copia para no modificar directamente el observable
  }

  // Cierra modal
  closeEdit() {
    this.selectedUser = null;
  }

  // Actualiza los datos en la vista después de guardar
  refreshAccountDetail() {
    this.accountDetail$ = this.authService.getDetail();
  }

  // Guardar cambios del propio usuario
  saveEdit(data: { fullName: string; email: string }) {
    if (!this.selectedUser) return;

    const userId = this.selectedUser.id; // ID del usuario autenticado
    this.authService.editUser(userId, data).subscribe({
      next: () => {
        console.log('Perfil actualizado');
        this.refreshAccountDetail();
        this.closeEdit();
      },
      error: err => console.error('Error al actualizar perfil:', err),
    });
  }
}