import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatricsComponent } from './create-matrics.component';

describe('CreateMatricsComponent', () => {
  let component: CreateMatricsComponent;
  let fixture: ComponentFixture<CreateMatricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMatricsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMatricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
