import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseoneComponent } from './phaseone.component';

describe('PhaseoneComponent', () => {
  let component: PhaseoneComponent;
  let fixture: ComponentFixture<PhaseoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhaseoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhaseoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
