import { TestBed } from '@angular/core/testing';

import { DetailResolverService } from './detail-resolver.service';

describe('DetailResolverService', () => {
  let service: DetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
