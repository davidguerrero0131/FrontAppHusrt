import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesEquipoComponent } from './reportes-equipo.component';

describe('ReportesEquipoComponent', () => {
  let component: ReportesEquipoComponent;
  let fixture: ComponentFixture<ReportesEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
