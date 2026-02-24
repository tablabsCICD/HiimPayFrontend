import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealityComponentComponent } from './reality-component.component';

describe('RealityComponentComponent', () => {
  let component: RealityComponentComponent;
  let fixture: ComponentFixture<RealityComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealityComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealityComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
