import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTaskDetailsComponent } from './single-task-details.component';

describe('SingleTaskDetailsComponent', () => {
  let component: SingleTaskDetailsComponent;
  let fixture: ComponentFixture<SingleTaskDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleTaskDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
