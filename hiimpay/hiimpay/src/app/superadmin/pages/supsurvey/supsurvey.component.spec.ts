import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupsurveyComponent } from './supsurvey.component';

describe('SupsurveyComponent', () => {
  let component: SupsurveyComponent;
  let fixture: ComponentFixture<SupsurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupsurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupsurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
