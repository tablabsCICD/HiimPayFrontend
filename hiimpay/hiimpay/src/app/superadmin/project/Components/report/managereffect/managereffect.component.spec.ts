import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagereffectComponent } from './managereffect.component';

describe('ManagereffectComponent', () => {
  let component: ManagereffectComponent;
  let fixture: ComponentFixture<ManagereffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagereffectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagereffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
