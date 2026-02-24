import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpocSurveyRespComponent } from './cpoc-survey-resp.component';

describe('CpocSurveyRespComponent', () => {
  let component: CpocSurveyRespComponent;
  let fixture: ComponentFixture<CpocSurveyRespComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpocSurveyRespComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CpocSurveyRespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
