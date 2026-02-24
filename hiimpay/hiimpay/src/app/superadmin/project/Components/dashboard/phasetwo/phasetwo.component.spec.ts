import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhasetwoComponent } from './phasetwo.component';

describe('PhasetwoComponent', () => {
  let component: PhasetwoComponent;
  let fixture: ComponentFixture<PhasetwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhasetwoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhasetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
