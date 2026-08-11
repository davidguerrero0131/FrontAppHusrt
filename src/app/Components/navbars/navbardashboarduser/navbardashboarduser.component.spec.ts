import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbardashboarduserComponent } from './navbardashboarduser.component';

describe('NavbardashboarduserComponent', () => {
  let component: NavbardashboarduserComponent;
  let fixture: ComponentFixture<NavbardashboarduserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbardashboarduserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbardashboarduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
