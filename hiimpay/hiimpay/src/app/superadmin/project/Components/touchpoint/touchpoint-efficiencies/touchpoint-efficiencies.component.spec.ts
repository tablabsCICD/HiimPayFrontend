import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouchpointEfficienciesComponent } from './touchpoint-efficiencies.component';

describe('TouchpointEfficienciesComponent', () => {
  let component: TouchpointEfficienciesComponent;
  let fixture: ComponentFixture<TouchpointEfficienciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TouchpointEfficienciesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TouchpointEfficienciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
