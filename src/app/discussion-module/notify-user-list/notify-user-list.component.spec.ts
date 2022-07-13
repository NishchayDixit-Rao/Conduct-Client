import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyUserListComponent } from './notify-user-list.component';

describe('NotifyUserListComponent', () => {
  let component: NotifyUserListComponent;
  let fixture: ComponentFixture<NotifyUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
