import { Component, inject, signal, ChangeDetectionStrategy, viewChild, ElementRef, effect } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User, UserCreate } from '../../../../core/models/user';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { Paginator } from '../../../../shared/components/paginator/paginator';
import { UserCard } from '../../components/user-card/user-card';
import { UserForm } from '../../components/user-form/user-form';

@Component({
  selector: 'app-user-list-page',
  imports: [LoadingSpinner, ErrorMessage, Paginator, UserCard, UserForm],
  templateUrl: './user-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-list-page.scss',
})
export class UserListPage {
  userService = inject(UserService);

  showForm = signal(false);
  editingUser = signal<User | null>(null);
  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');

  constructor() {
    effect(() => {
      if (this.showForm()) {
        const dialog = this.dialogRef()?.nativeElement;
        if (dialog && !dialog.open) {
          dialog.showModal();
        }
      }
    });
  }

  openCreateForm() {
    this.editingUser.set(null);
    this.showForm.set(true);
  }

  openEditForm(user: User) {
    this.editingUser.set(user);
    this.showForm.set(true);
  }

  closeForm() {
    const dialog = this.dialogRef()?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
    this.showForm.set(false);
    this.editingUser.set(null);
  }

  onDialogClick(event: MouseEvent) {
    const dialog = this.dialogRef()?.nativeElement;
    if (event.target === dialog) {
      this.closeForm();
    }
  }

  saveUser(userData: UserCreate) {
    if (this.editingUser()) {
      this.userService.updateUser(this.editingUser()!.id, userData);
    } else {
      this.userService.createUser(userData);
    }
    this.closeForm();
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
  }
}
