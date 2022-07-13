import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersLogsComponent } from './all-users-logs.component';

describe('AllUsersLogsComponent', () => {
  let component: AllUsersLogsComponent;
  let fixture: ComponentFixture<AllUsersLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllUsersLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUsersLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
