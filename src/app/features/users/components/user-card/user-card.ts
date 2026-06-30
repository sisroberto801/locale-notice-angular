import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-card.scss',
})
export class UserCard {
  user = input.required<User>();
  edit = output<User>();
  delete = output<number>();
}
