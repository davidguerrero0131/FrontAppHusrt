import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiomedicaadminnavbarComponent } from './biomedicaadminnavbar.component';

describe('BiomedicaadminnavbarComponent', () => {
  let component: BiomedicaadminnavbarComponent;
  let fixture: ComponentFixture<BiomedicaadminnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiomedicaadminnavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiomedicaadminnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
