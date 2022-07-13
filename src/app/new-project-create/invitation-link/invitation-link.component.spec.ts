import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationLinkComponent } from './invitation-link.component';

describe('InvitationLinkComponent', () => {
  let component: InvitationLinkComponent;
  let fixture: ComponentFixture<InvitationLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
