import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomedashboarduserComponent } from './homedashboarduser.component';

describe('HomedashboarduserComponent', () => {
  let component: HomedashboarduserComponent;
  let fixture: ComponentFixture<HomedashboarduserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomedashboarduserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomedashboarduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
