import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTimeLogsComponent } from './total-time-logs.component';

describe('TotalTimeLogsComponent', () => {
  let component: TotalTimeLogsComponent;
  let fixture: ComponentFixture<TotalTimeLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalTimeLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalTimeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
