import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasEspaciosInternoComponent } from './reservas-espacios-interno.component';

describe('ReservasEspaciosInternoComponent', () => {
  let component: ReservasEspaciosInternoComponent;
  let fixture: ComponentFixture<ReservasEspaciosInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasEspaciosInternoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasEspaciosInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
