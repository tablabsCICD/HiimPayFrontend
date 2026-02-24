import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignComponentComponent } from './assign-component.component';

describe('AssignComponentComponent', () => {
  let component: AssignComponentComponent;
  let fixture: ComponentFixture<AssignComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
