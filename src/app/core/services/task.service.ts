import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task, TaskCreate, TaskStatus, TaskUpdate } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = '/api/tasks';

  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  public tasks = this.tasksSignal.asReadonly();
  public isLoading = this.loadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();
  public totalTasks = computed(() => this.tasksSignal().length);
  public completedTasks = computed(
    () => this.tasksSignal().filter((t) => t.status === 'completed').length,
  );

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.loadingSignal.set(true);

    this.http
      .get<{ total: number; data: Task[] }>(this.apiUrl)
      .pipe(
        tap((response) => this.tasksSignal.set(response.data || [])),
        catchError((error) => {
          this.errorSignal.set('Error al cargar tareas');
          return of({ total: 0, data: [] });
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  createTask(task: TaskCreate): void {
    this.loadingSignal.set(true);

    this.http
      .post<Task>(this.apiUrl, task)
      .pipe(
        tap((newTask) => this.tasksSignal.update((tasks) => [...tasks, newTask])),
        catchError((error) => {
          this.errorSignal.set('Error al crear tarea');
          return of(null);
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  updateTask(id: number, updates: TaskUpdate): void {
    this.loadingSignal.set(true);

    this.http
      .put<Task>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap((updatedTask) => {
          this.tasksSignal.update((tasks) =>
            tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)),
          );
        }),
        catchError((error) => {
          this.errorSignal.set('Error al actualizar tarea');
          return of(null);
        }),
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe();
  }

  updateTaskStatus(id: number, status: TaskStatus): void {
    this.updateTask(id, { status });
  }

  deleteTask(id: number): void {
    if (!confirm('¿Eliminar esta tarea?')) return;

    this.loadingSignal.set(true);

    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id))),
        catchError((error) => {
          this.errorSignal.set('Error al eliminar tarea');
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
