import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEmployeeCardComponent } from './single-employee-card.component';

describe('SingleEmployeeCardComponent', () => {
  let component: SingleEmployeeCardComponent;
  let fixture: ComponentFixture<SingleEmployeeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleEmployeeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleEmployeeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
