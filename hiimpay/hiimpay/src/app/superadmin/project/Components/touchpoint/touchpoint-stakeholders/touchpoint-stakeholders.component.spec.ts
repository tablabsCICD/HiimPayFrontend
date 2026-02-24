import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchpointStakeholdersComponent } from './touchpoint-stakeholders.component';

describe('TouchpointStakeholdersComponent', () => {
  let component: TouchpointStakeholdersComponent;
  let fixture: ComponentFixture<TouchpointStakeholdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouchpointStakeholdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TouchpointStakeholdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
