import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserCreate, UserUpdate } from '../models/user';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  public users = this.usersSignal.asReadonly();
  public isLoading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();
  public totalUsers = computed(() => this.usersSignal().length);
  public hasUsers = computed(() => this.usersSignal().length > 0);

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http
      .get<{ total: number; data: User[] }>(this.apiUrl)
      .pipe(
        tap((response) => this.usersSignal.set(response.data || [])),
        catchError((error) => {
          this.errorSignal.set('Error al cargar usuarios');
          return of({ total: 0, data: [] });
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  createUser(user: UserCreate): void {
    this.loadingSignal.set(true);

    this.http
      .post<User>(this.apiUrl, user)
      .pipe(
        tap((newUser) => this.usersSignal.update((users) => [...users, newUser])),
        catchError((error) => {
          this.errorSignal.set('Error al crear usuario');
          return of(null);
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  updateUser(id: number, updates: UserUpdate): void {
    this.loadingSignal.set(true);

    this.http
      .put<User>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap((updatedUser) => {
          this.usersSignal.update((users) =>
            users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
          );
        }),
        catchError((error) => {
          this.errorSignal.set('Error al actualizar usuario');
          return of(null);
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  deleteUser(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.loadingSignal.set(true);

    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.usersSignal.update((users) => users.filter((u) => u.id !== id))),
        catchError((error) => {
          this.errorSignal.set('Error al eliminar usuario');
          return of(null);
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
