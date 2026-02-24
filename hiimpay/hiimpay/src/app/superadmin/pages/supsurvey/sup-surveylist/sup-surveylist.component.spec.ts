import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupSurveylistComponent } from './sup-surveylist.component';

describe('SupSurveylistComponent', () => {
  let component: SupSurveylistComponent;
  let fixture: ComponentFixture<SupSurveylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupSurveylistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupSurveylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
