import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignrealitytouchpointComponent } from './assignrealitytouchpoint.component';

describe('AssignrealitytouchpointComponent', () => {
  let component: AssignrealitytouchpointComponent;
  let fixture: ComponentFixture<AssignrealitytouchpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignrealitytouchpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignrealitytouchpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
