import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectdashComponent } from './projectdash.component';

describe('ProjectdashComponent', () => {
  let component: ProjectdashComponent;
  let fixture: ComponentFixture<ProjectdashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectdashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
