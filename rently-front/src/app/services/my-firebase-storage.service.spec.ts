import { TestBed } from '@angular/core/testing';

import { MyFirebaseStorageService } from './my-firebase-storage.service';

describe('MyFirebaseStorageService', () => {
  let service: MyFirebaseStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyFirebaseStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
