import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExConsultantComponent } from './ex-consultant.component';

describe('ExConsultantComponent', () => {
  let component: ExConsultantComponent;
  let fixture: ComponentFixture<ExConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExConsultantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
