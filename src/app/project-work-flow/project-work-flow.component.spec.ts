import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkFlowComponent } from './project-work-flow.component';

describe('ProjectWorkFlowComponent', () => {
  let component: ProjectWorkFlowComponent;
  let fixture: ComponentFixture<ProjectWorkFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectWorkFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectWorkFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
