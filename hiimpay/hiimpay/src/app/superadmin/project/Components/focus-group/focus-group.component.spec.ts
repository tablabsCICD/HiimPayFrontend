import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusGroupComponent } from './focus-group.component';

describe('FocusGroupComponent', () => {
  let component: FocusGroupComponent;
  let fixture: ComponentFixture<FocusGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FocusGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FocusGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
