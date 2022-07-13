import { TestBed } from '@angular/core/testing';

import { NewFileUploadService } from './new-file-upload.service';

describe('NewFileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewFileUploadService = TestBed.get(NewFileUploadService);
    expect(service).toBeTruthy();
  });
});
