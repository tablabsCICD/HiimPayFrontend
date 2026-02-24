import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCpocComponent } from './profile-cpoc.component';

describe('ProfileCpocComponent', () => {
  let component: ProfileCpocComponent;
  let fixture: ComponentFixture<ProfileCpocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileCpocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileCpocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
