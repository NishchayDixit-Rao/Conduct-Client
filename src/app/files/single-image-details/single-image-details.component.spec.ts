import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleImageDetailsComponent } from './single-image-details.component';

describe('SingleImageDetailsComponent', () => {
  let component: SingleImageDetailsComponent;
  let fixture: ComponentFixture<SingleImageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleImageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleImageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
