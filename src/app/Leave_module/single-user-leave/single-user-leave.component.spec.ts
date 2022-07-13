import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUserLeaveComponent } from './single-user-leave.component';

describe('SingleUserLeaveComponent', () => {
  let component: SingleUserLeaveComponent;
  let fixture: ComponentFixture<SingleUserLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleUserLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleUserLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
