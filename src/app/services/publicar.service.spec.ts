import { TestBed } from '@angular/core/testing';

import { PublicarService } from './publicar.service';

describe('PublicarService', () => {
  let service: PublicarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
