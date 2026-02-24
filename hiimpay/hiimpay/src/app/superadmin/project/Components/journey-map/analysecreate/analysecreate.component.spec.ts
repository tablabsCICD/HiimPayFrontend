import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysecreateComponent } from './analysecreate.component';

describe('AnalysecreateComponent', () => {
  let component: AnalysecreateComponent;
  let fixture: ComponentFixture<AnalysecreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysecreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalysecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
