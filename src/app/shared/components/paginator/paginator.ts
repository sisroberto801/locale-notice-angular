import {
  Component,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginator',
  imports: [FormsModule],
  templateUrl: './paginator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './paginator.scss',
})
export class Paginator {
  page = input.required<number>();
  pages = input.required<number>();
  total = input.required<number>();
  limit = input.required<number>();

  pageChange = output<number>();
  limitChange = output<number>();

  readonly limitOptions = [5, 9, 20, 50];

  startItem = computed(() => {
    if (this.total() === 0) return 0;
    return (this.page() - 1) * this.limit() + 1;
  });

  endItem = computed(() => {
    return Math.min(this.page() * this.limit(), this.total());
  });

  visiblePages = computed(() => {
    const current = this.page();
    const last = this.pages();
    const delta = 1;
    const range: (number | null)[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(null);
    }

    if (current + delta < last - 1) {
      range.push(null);
    }

    const pages: (number | null)[] = [];
    if (last > 1) {
      pages.push(1);
    }
    pages.push(...range);
    if (last > 1) {
      pages.push(last);
    }

    return pages;
  });

  goToPage(page: number | null): void {
    if (page === null || page === this.page()) return;
    this.pageChange.emit(page);
  }

  previous(): void {
    if (this.page() <= 1) return;
    this.pageChange.emit(this.page() - 1);
  }

  next(): void {
    if (this.page() >= this.pages()) return;
    this.pageChange.emit(this.page() + 1);
  }

  changeLimit(value: number): void {
    if (value === this.limit()) return;
    this.limitChange.emit(value);
  }
}
