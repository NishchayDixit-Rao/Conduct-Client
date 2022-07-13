import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveLogsModelComponent } from './approve-logs-model.component';

describe('ApproveLogsModelComponent', () => {
  let component: ApproveLogsModelComponent;
  let fixture: ComponentFixture<ApproveLogsModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveLogsModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveLogsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
