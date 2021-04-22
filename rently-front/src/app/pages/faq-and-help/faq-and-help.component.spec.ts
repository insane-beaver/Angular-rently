import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqAndHelpComponent } from './faq-and-help.component';

describe('FaqAndHelpComponent', () => {
  let component: FaqAndHelpComponent;
  let fixture: ComponentFixture<FaqAndHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqAndHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqAndHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
