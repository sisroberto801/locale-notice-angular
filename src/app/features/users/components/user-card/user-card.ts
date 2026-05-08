import { Component, input, output } from '@angular/core';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  user = input.required<User>();
  edit = output<User>();
  delete = output<number>();
}
