import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User, UserCreate } from '../../../../core/models/user';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessage } from '../../../../shared/components/error-message/error-message';
import { UserCard } from '../../components/user-card/user-card';
import { UserForm } from '../../components/user-form/user-form';

@Component({
  selector: 'app-user-list-page',
  imports: [LoadingSpinner, ErrorMessage, UserCard, UserForm],
  templateUrl: './user-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-list-page.scss',
})
export class UserListPage {
  userService = inject(UserService);

  showForm = signal(false);
  editingUser = signal<User | null>(null);

  openCreateForm() {
    this.editingUser.set(null);
    this.showForm.set(true);
  }

  openEditForm(user: User) {
    this.editingUser.set(user);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingUser.set(null);
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
