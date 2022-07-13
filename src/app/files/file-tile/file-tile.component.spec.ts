import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTileComponent } from './file-tile.component';

describe('FileTileComponent', () => {
  let component: FileTileComponent;
  let fixture: ComponentFixture<FileTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
