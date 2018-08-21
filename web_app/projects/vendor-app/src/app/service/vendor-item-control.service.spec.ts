import { TestBed, inject } from '@angular/core/testing';

import { VendorItemControlService } from './vendor-item-control.service';

describe('VendorItemControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorItemControlService]
    });
  });

  it('should be created', inject([VendorItemControlService], (service: VendorItemControlService) => {
    expect(service).toBeTruthy();
  }));
});
