import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMoviesPage } from './new-movies.page';

describe('NewMoviesPage', () => {
  let component: NewMoviesPage;
  let fixture: ComponentFixture<NewMoviesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMoviesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
