import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignQuestionToSurveyComponent } from './assign-question-to-survey.component';

describe('AssignQuestionToSurveyComponent', () => {
  let component: AssignQuestionToSurveyComponent;
  let fixture: ComponentFixture<AssignQuestionToSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignQuestionToSurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignQuestionToSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
