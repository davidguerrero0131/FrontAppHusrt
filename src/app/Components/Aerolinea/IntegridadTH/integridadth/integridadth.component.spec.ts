import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegridadthComponent } from './integridadth.component';

describe('IntegridadthComponent', () => {
  let component: IntegridadthComponent;
  let fixture: ComponentFixture<IntegridadthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegridadthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegridadthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
