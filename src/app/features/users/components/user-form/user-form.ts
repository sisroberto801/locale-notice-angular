import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserCreate } from '../../../../core/models/user';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  title = input('Nuevo Usuario');
  userData = input<User | null>(null);
  submitForm = output<UserCreate>();
  cancel = output<void>();

  formData = signal<UserCreate>({
    username: '',
    name: '',
    email: '',
    role: 'viewer',
  });

  ngOnInit() {
    const user = this.userData();
    if (user) {
      this.formData.set({
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }

  onSubmit() {
    const data = this.formData();
    if (data.name && data.email) {
      this.submitForm.emit(data);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  updateName(value: string) {
    this.formData.update((data) => ({ ...data, name: value }));
  }

  updateEmail(value: string) {
    this.formData.update((data) => ({ ...data, email: value }));
  }

  updateRole(value: 'admin' | 'editor' | 'viewer') {
    this.formData.update((data) => ({ ...data, role: value }));
  }
}
