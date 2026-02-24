import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmorequestionComponent } from './addmorequestion.component';

describe('AddmorequestionComponent', () => {
  let component: AddmorequestionComponent;
  let fixture: ComponentFixture<AddmorequestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddmorequestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddmorequestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
