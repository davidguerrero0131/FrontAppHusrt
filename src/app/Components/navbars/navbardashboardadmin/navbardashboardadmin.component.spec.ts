import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbardashboardadminComponent } from './navbardashboardadmin.component';

describe('NavbardashboardadminComponent', () => {
  let component: NavbardashboardadminComponent;
  let fixture: ComponentFixture<NavbardashboardadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbardashboardadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbardashboardadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
