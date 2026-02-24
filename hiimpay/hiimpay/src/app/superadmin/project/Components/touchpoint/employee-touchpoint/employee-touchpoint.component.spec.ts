import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTouchpointComponent } from './employee-touchpoint.component';

describe('EmployeeTouchpointComponent', () => {
  let component: EmployeeTouchpointComponent;
  let fixture: ComponentFixture<EmployeeTouchpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeTouchpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeTouchpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
