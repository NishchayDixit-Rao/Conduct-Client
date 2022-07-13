import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MateDatePickerComponent } from './mate-date-picker.component';

describe('MateDatePickerComponent', () => {
  let component: MateDatePickerComponent;
  let fixture: ComponentFixture<MateDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MateDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
