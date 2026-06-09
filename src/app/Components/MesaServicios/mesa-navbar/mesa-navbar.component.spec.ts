import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaNavbarComponent } from './mesa-navbar.component';

describe('MesaNavbarComponent', () => {
  let component: MesaNavbarComponent;
  let fixture: ComponentFixture<MesaNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesaNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesaNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
