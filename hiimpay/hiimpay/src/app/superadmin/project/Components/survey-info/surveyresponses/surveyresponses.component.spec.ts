import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyresponsesComponent } from './surveyresponses.component';

describe('SurveyresponsesComponent', () => {
  let component: SurveyresponsesComponent;
  let fixture: ComponentFixture<SurveyresponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyresponsesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyresponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
