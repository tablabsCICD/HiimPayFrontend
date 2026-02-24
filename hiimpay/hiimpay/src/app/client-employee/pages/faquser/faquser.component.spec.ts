import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaquserComponent } from './faquser.component';

describe('FaquserComponent', () => {
  let component: FaquserComponent;
  let fixture: ComponentFixture<FaquserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaquserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaquserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
