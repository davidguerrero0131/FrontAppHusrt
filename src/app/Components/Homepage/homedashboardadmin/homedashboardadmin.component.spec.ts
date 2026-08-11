import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomedashboardadminComponent } from './homedashboardadmin.component';

describe('HomedashboardadminComponent', () => {
  let component: HomedashboardadminComponent;
  let fixture: ComponentFixture<HomedashboardadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomedashboardadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomedashboardadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
