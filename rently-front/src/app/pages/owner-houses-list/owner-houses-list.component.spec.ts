import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerHousesListComponent } from './owner-houses-list.component';

describe('OwnerHousesListComponent', () => {
  let component: OwnerHousesListComponent;
  let fixture: ComponentFixture<OwnerHousesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerHousesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerHousesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
