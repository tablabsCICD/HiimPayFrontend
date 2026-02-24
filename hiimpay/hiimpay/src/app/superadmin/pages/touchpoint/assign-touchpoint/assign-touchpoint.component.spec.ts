import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTouchpointComponent } from './assign-touchpoint.component';

describe('AssignTouchpointComponent', () => {
  let component: AssignTouchpointComponent;
  let fixture: ComponentFixture<AssignTouchpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignTouchpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignTouchpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
