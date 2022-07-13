import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderTileComponent } from './folder-tile.component';

describe('FolderTileComponent', () => {
  let component: FolderTileComponent;
  let fixture: ComponentFixture<FolderTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
