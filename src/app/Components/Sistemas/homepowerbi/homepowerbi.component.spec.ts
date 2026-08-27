import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepowerbiComponent } from './homepowerbi.component';

describe('HomepowerbiComponent', () => {
  let component: HomepowerbiComponent;
  let fixture: ComponentFixture<HomepowerbiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepowerbiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepowerbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
