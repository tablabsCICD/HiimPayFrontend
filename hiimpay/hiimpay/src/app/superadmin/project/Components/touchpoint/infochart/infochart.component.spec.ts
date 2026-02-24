import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfochartComponent } from './infochart.component';

describe('InfochartComponent', () => {
  let component: InfochartComponent;
  let fixture: ComponentFixture<InfochartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfochartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfochartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
