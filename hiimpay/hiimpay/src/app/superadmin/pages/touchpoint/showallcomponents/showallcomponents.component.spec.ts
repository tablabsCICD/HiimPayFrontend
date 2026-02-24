import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowallcomponentsComponent } from './showallcomponents.component';

describe('ShowallcomponentsComponent', () => {
  let component: ShowallcomponentsComponent;
  let fixture: ComponentFixture<ShowallcomponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowallcomponentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowallcomponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
