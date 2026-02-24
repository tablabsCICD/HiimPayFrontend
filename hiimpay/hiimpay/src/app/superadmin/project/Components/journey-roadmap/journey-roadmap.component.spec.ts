import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyRoadmapComponent } from './journey-roadmap.component';

describe('JourneyRoadmapComponent', () => {
  let component: JourneyRoadmapComponent;
  let fixture: ComponentFixture<JourneyRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JourneyRoadmapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JourneyRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
