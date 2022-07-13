import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelogModelComponent } from './add-timelog-model.component';

describe('AddTimelogModelComponent', () => {
  let component: AddTimelogModelComponent;
  let fixture: ComponentFixture<AddTimelogModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelogModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelogModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
