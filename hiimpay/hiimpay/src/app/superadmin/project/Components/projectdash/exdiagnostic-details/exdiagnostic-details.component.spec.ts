import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EXDiagnosticDetailsComponent } from './exdiagnostic-details.component';

describe('EXDiagnosticDetailsComponent', () => {
  let component: EXDiagnosticDetailsComponent;
  let fixture: ComponentFixture<EXDiagnosticDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EXDiagnosticDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EXDiagnosticDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
