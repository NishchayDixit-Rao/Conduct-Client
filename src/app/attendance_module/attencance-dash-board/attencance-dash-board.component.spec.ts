import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttencanceDashBoardComponent } from './attencance-dash-board.component';

describe('AttencanceDashBoardComponent', () => {
  let component: AttencanceDashBoardComponent;
  let fixture: ComponentFixture<AttencanceDashBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttencanceDashBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttencanceDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
