import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveCopyTaskComponent } from './move-copy-task.component';

describe('MoveCopyTaskComponent', () => {
  let component: MoveCopyTaskComponent;
  let fixture: ComponentFixture<MoveCopyTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoveCopyTaskComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveCopyTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
