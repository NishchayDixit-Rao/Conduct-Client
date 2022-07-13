import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesReportComponent } from './leaves-report.component';

describe('LeavesReportComponent', () => {
  let component: LeavesReportComponent;
  let fixture: ComponentFixture<LeavesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeavesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
