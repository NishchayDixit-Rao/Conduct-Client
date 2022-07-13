import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewFolderComponent } from './create-new-folder.component';

describe('CreateNewFolderComponent', () => {
  let component: CreateNewFolderComponent;
  let fixture: ComponentFixture<CreateNewFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
