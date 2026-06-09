import { ComponentFixture, TestBed } from '@angular/core/testing';

import { homeadminindustrialescomponent } from './homesadminindustriales.component';

describe('HomesuperadminComponent', () => {
  let component: homeadminindustrialescomponent;
  let fixture: ComponentFixture<homeadminindustrialescomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [homeadminindustrialescomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(homeadminindustrialescomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
