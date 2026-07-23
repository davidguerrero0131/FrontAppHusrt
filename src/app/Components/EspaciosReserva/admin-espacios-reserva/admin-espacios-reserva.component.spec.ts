import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEspaciosReservaComponent } from './admin-espacios-reserva.component';

describe('AdminEspaciosReservaComponent', () => {
  let component: AdminEspaciosReservaComponent;
  let fixture: ComponentFixture<AdminEspaciosReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEspaciosReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEspaciosReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
