import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './loading-spinner.scss',
})
export class LoadingSpinner {
  message = input<string>('Cargando...');
}
