import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResetPasswordComponent } from './new-reset-password.component';

describe('NewResetPasswordComponent', () => {
  let component: NewResetPasswordComponent;
  let fixture: ComponentFixture<NewResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
