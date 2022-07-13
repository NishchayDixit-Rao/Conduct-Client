import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFolderListComponent } from './single-folder-list.component';

describe('SingleFolderListComponent', () => {
  let component: SingleFolderListComponent;
  let fixture: ComponentFixture<SingleFolderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleFolderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleFolderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
