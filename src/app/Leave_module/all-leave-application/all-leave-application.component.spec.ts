import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLeaveApplicationComponent } from './all-leave-application.component';

describe('AllLeaveApplicationComponent', () => {
  let component: AllLeaveApplicationComponent;
  let fixture: ComponentFixture<AllLeaveApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllLeaveApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLeaveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
