import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGestionReservasComponent } from './admin-gestion-reservas.component';

describe('AdminGestionReservasComponent', () => {
  let component: AdminGestionReservasComponent;
  let fixture: ComponentFixture<AdminGestionReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGestionReservasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGestionReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
