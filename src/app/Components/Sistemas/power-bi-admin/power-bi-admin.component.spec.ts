import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBiAdminComponent } from './power-bi-admin.component';

describe('PowerBiAdminComponent', () => {
  let component: PowerBiAdminComponent;
  let fixture: ComponentFixture<PowerBiAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerBiAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerBiAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
