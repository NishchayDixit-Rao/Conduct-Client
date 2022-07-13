import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscssionDetailsComponent } from './discssion-details.component';

describe('DiscssionDetailsComponent', () => {
  let component: DiscssionDetailsComponent;
  let fixture: ComponentFixture<DiscssionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscssionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscssionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
