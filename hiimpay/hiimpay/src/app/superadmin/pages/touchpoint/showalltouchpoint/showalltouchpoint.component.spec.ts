import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowalltouchpointComponent } from './showalltouchpoint.component';

describe('ShowalltouchpointComponent', () => {
  let component: ShowalltouchpointComponent;
  let fixture: ComponentFixture<ShowalltouchpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowalltouchpointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowalltouchpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
