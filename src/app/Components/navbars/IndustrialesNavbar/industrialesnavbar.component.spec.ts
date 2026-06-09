import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustrialesNavbarComponent   } from './industrialesnavbar.component';
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

describe('industrialesnavbar', () => {
  let component: IndustrialesNavbarComponent ;
  let fixture: ComponentFixture<IndustrialesNavbarComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustrialesNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustrialesNavbarComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    assert.ok(component);
  });
});
