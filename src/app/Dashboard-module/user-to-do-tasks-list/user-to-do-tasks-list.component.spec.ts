import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserToDoTasksListComponent } from './user-to-do-tasks-list.component';

describe('UserToDoTasksListComponent', () => {
  let component: UserToDoTasksListComponent;
  let fixture: ComponentFixture<UserToDoTasksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserToDoTasksListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserToDoTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
