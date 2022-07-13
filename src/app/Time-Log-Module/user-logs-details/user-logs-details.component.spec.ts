import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogsDetailsComponent } from './user-logs-details.component';

describe('UserLogsDetailsComponent', () => {
  let component: UserLogsDetailsComponent;
  let fixture: ComponentFixture<UserLogsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLogsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLogsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
