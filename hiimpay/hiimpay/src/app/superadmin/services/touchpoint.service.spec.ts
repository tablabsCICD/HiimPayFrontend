import { TestBed } from '@angular/core/testing';

import { TouchpointService } from './touchpoint.service';

describe('TouchpointService', () => {
  let service: TouchpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouchpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
