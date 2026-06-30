import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './error-message.scss',
})
export class ErrorMessage {
  message = input<string>('Ha ocurrido un error');
  retry = output<void>();
}
