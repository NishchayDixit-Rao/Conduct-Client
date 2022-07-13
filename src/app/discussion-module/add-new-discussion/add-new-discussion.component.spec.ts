import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDiscussionComponent } from './add-new-discussion.component';

describe('AddNewDiscussionComponent', () => {
  let component: AddNewDiscussionComponent;
  let fixture: ComponentFixture<AddNewDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
