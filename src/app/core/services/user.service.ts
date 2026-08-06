import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  PaginatedResponse,
  PaginationParams,
  User,
  UserCreate,
  UserUpdate,
} from '../models/user';
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

  private pageSignal = signal(1);
  private limitSignal = signal(9);
  private totalSignal = signal(0);
  private pagesSignal = signal(1);
  private orderBySignal = signal('id');
  private orderDirSignal = signal<'ASC' | 'DESC'>('DESC');
  private statusSignal = signal<string | null>(null);

  public users = this.usersSignal.asReadonly();
  public isLoading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();

  public page = this.pageSignal.asReadonly();
  public limit = this.limitSignal.asReadonly();
  public total = this.totalSignal.asReadonly();
  public pages = this.pagesSignal.asReadonly();
  public orderBy = this.orderBySignal.asReadonly();
  public orderDir = this.orderDirSignal.asReadonly();
  public status = this.statusSignal.asReadonly();

  public totalUsers = this.total;
  public hasUsers = computed(() => this.usersSignal().length > 0);

  constructor() {
    this.loadUsers();
  }

  private buildQueryParams(): HttpParams {
    let params = new HttpParams()
      .set('limit', String(this.limitSignal()))
      .set('page', String(this.pageSignal()))
      .set('orderBy', this.orderBySignal())
      .set('orderDir', this.orderDirSignal());

    const status = this.statusSignal();
    if (status) {
      params = params.set('status', status);
    }

    return params;
  }

  private loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http
      .get<PaginatedResponse<User>>(`${this.apiUrl}/list/pagination`, {
        params: this.buildQueryParams(),
      })
      .pipe(
        tap((response) => {
          this.usersSignal.set(response.data || []);
          this.totalSignal.set(response.total || 0);
          this.pagesSignal.set(response.pages || 1);
          this.pageSignal.set(response.page || this.pageSignal());
        }),
        catchError((error) => {
          this.errorSignal.set('Error al cargar usuarios');
          return of({ total: 0, page: 1, pages: 1, data: [] });
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  setPage(page: number): void {
    const nextPage = Math.max(1, Math.min(page, this.pagesSignal()));
    if (nextPage === this.pageSignal()) return;
    this.pageSignal.set(nextPage);
    this.loadUsers();
  }

  setLimit(limit: number): void {
    if (limit === this.limitSignal()) return;
    this.limitSignal.set(limit);
    this.pageSignal.set(1);
    this.loadUsers();
  }

  setOrdering(orderBy: string, orderDir: 'ASC' | 'DESC'): void {
    this.orderBySignal.set(orderBy);
    this.orderDirSignal.set(orderDir);
    this.pageSignal.set(1);
    this.loadUsers();
  }

  setStatus(status: string | null): void {
    this.statusSignal.set(status);
    this.pageSignal.set(1);
    this.loadUsers();
  }

  applyPagination(params: PaginationParams): void {
    if (params.page !== undefined) this.pageSignal.set(params.page);
    if (params.limit !== undefined) this.limitSignal.set(params.limit);
    if (params.orderBy !== undefined) this.orderBySignal.set(params.orderBy);
    if (params.orderDir !== undefined) this.orderDirSignal.set(params.orderDir);
    if (params.status !== undefined) this.statusSignal.set(params.status);
    this.loadUsers();
  }

  refresh(): void {
    this.loadUsers();
  }

  createUser(user: UserCreate): void {
    this.loadingSignal.set(true);

    this.http
      .post<User>(this.apiUrl, user)
      .pipe(
        tap(() => {
          this.pageSignal.set(1);
          this.loadUsers();
        }),
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
        tap(() => this.loadUsers()),
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
        tap(() => {
          if (this.usersSignal().length === 1 && this.pageSignal() > 1) {
            this.pageSignal.set(this.pageSignal() - 1);
          }
          this.loadUsers();
        }),
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
