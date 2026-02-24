import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyInfoquestionComponent } from './survey-infoquestion.component';

describe('SurveyInfoquestionComponent', () => {
  let component: SurveyInfoquestionComponent;
  let fixture: ComponentFixture<SurveyInfoquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyInfoquestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyInfoquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
