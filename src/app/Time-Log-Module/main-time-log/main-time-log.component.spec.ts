import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTimeLogComponent } from './main-time-log.component';

describe('MainTimeLogComponent', () => {
  let component: MainTimeLogComponent;
  let fixture: ComponentFixture<MainTimeLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTimeLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTimeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
