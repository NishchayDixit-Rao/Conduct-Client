import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmployeeAddComponent } from './new-employee-add.component';

describe('NewEmployeeAddComponent', () => {
  let component: NewEmployeeAddComponent;
  let fixture: ComponentFixture<NewEmployeeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEmployeeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEmployeeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
