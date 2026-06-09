import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrasConfiguracionesComponent } from './otras-configuraciones.component';

describe('OtrasConfiguracionesComponent', () => {
  let component: OtrasConfiguracionesComponent;
  let fixture: ComponentFixture<OtrasConfiguracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtrasConfiguracionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtrasConfiguracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
