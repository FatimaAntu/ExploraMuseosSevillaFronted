import { TestBed } from '@angular/core/testing';

import { ExposicionesService } from './exposiciones.service';

describe('ExposicionesService', () => {
  let service: ExposicionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExposicionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
