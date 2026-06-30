import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCard } from './user-card';
import { User } from '../../../../core/models/user';

describe('UserCard', () => {
  let component: UserCard;
  let fixture: ComponentFixture<UserCard>;

  const mockUser: User = {
    id: 1,
    username: 'jdoe',
    name: 'John Doe',
    email: 'jdoe@example.com',
    role: 'admin',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
