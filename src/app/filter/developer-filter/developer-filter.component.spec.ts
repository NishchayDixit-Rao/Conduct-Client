import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperFilterComponent } from './developer-filter.component';

describe('DeveloperFilterComponent', () => {
  let component: DeveloperFilterComponent;
  let fixture: ComponentFixture<DeveloperFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
