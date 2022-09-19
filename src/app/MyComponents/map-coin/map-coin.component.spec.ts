import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCoinComponent } from './map-coin.component';

describe('MapCoinComponent', () => {
  let component: MapCoinComponent;
  let fixture: ComponentFixture<MapCoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapCoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
