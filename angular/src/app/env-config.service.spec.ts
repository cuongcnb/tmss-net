import { TestBed, inject } from '@angular/core/testing';

import { EnvConfigService } from './env-config.service';

describe('EnvConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvConfigService]
    });
  });

  it('should be created', inject([EnvConfigService], (service: EnvConfigService) => {
    expect(service).toBeTruthy();
  }));
});
