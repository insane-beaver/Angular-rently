import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentsListComponent } from './rents-list.component';

describe('RentsListComponent', () => {
  let component: RentsListComponent;
  let fixture: ComponentFixture<RentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
