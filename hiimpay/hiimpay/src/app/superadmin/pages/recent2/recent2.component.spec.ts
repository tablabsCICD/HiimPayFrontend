import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recent2Component } from './recent2.component';

describe('Recent2Component', () => {
  let component: Recent2Component;
  let fixture: ComponentFixture<Recent2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Recent2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Recent2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
