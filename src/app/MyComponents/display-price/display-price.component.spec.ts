import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPriceComponent } from './display-price.component';

describe('DisplayPriceComponent', () => {
  let component: DisplayPriceComponent;
  let fixture: ComponentFixture<DisplayPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
