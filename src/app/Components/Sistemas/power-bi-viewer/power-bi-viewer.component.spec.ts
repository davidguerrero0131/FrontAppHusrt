import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBiViewerComponent } from './power-bi-viewer.component';

describe('PowerBiViewerComponent', () => {
  let component: PowerBiViewerComponent;
  let fixture: ComponentFixture<PowerBiViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerBiViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerBiViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
