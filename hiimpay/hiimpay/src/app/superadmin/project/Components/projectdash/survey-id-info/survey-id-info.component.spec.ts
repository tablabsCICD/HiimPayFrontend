import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyIdInfoComponent } from './survey-id-info.component';

describe('SurveyIdInfoComponent', () => {
  let component: SurveyIdInfoComponent;
  let fixture: ComponentFixture<SurveyIdInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyIdInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurveyIdInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
