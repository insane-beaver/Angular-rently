import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousesForRentComponent } from './houses-for-rent.component';

describe('HousesForRentComponent', () => {
  let component: HousesForRentComponent;
  let fixture: ComponentFixture<HousesForRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousesForRentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HousesForRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
