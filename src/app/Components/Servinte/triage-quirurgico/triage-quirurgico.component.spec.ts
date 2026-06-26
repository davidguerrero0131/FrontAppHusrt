import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageQuirurgicoComponent } from './triage-quirurgico.component';

describe('TriageQuirurgicoComponent', () => {
  let component: TriageQuirurgicoComponent;
  let fixture: ComponentFixture<TriageQuirurgicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriageQuirurgicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriageQuirurgicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
