import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilesProjectComponent } from './upload-files-project.component';

describe('UploadFilesProjectComponent', () => {
  let component: UploadFilesProjectComponent;
  let fixture: ComponentFixture<UploadFilesProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFilesProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilesProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
