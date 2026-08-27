import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomereservaComponent } from './homereserva.component';

describe('HomereservaComponent', () => {
  let component: HomereservaComponent;
  let fixture: ComponentFixture<HomereservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomereservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomereservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
