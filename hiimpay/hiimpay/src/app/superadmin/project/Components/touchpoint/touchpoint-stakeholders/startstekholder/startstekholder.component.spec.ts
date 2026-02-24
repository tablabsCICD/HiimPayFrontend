import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartstekholderComponent } from './startstekholder.component';

describe('StartstekholderComponent', () => {
  let component: StartstekholderComponent;
  let fixture: ComponentFixture<StartstekholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartstekholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartstekholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
