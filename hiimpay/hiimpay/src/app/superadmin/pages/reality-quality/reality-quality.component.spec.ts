import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealityQualityComponent } from './reality-quality.component';

describe('RealityQualityComponent', () => {
  let component: RealityQualityComponent;
  let fixture: ComponentFixture<RealityQualityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealityQualityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealityQualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
