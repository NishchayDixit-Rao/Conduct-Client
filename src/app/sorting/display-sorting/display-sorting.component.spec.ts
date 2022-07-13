import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySortingComponent } from './display-sorting.component';

describe('DisplaySortingComponent', () => {
  let component: DisplaySortingComponent;
  let fixture: ComponentFixture<DisplaySortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
