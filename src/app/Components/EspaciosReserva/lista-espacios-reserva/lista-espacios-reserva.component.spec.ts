import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEspaciosReservaComponent } from './lista-espacios-reserva.component';

describe('ListaEspaciosReservaComponent', () => {
  let component: ListaEspaciosReservaComponent;
  let fixture: ComponentFixture<ListaEspaciosReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEspaciosReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEspaciosReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
