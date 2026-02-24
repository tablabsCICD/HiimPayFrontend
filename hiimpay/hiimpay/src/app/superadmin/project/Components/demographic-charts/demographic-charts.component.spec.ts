import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicChartsComponent } from './demographic-charts.component';

describe('DemographicChartsComponent', () => {
  let component: DemographicChartsComponent;
  let fixture: ComponentFixture<DemographicChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemographicChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemographicChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
