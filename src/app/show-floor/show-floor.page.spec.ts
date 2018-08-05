import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFloorPage } from './show-floor.page';

describe('ShowFloorPage', () => {
  let component: ShowFloorPage;
  let fixture: ComponentFixture<ShowFloorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFloorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFloorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
