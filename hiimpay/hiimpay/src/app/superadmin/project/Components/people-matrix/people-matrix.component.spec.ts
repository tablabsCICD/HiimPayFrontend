import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleMatrixComponent } from './people-matrix.component';

describe('PeopleMatrixComponent', () => {
  let component: PeopleMatrixComponent;
  let fixture: ComponentFixture<PeopleMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleMatrixComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeopleMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
