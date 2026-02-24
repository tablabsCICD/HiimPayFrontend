import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpocSurveyComponent } from './cpoc-survey.component';

describe('CpocSurveyComponent', () => {
  let component: CpocSurveyComponent;
  let fixture: ComponentFixture<CpocSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CpocSurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CpocSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
