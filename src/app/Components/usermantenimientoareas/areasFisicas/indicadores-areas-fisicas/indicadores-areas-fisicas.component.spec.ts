import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresAreasFisicasComponent } from './indicadores-areas-fisicas.component';

describe('IndicadoresAreasFisicasComponent', () => {
  let component: IndicadoresAreasFisicasComponent;
  let fixture: ComponentFixture<IndicadoresAreasFisicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadoresAreasFisicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresAreasFisicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
