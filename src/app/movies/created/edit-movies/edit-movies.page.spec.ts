import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMoviesPage } from './edit-movies.page';

describe('EditMoviesPage', () => {
  let component: EditMoviesPage;
  let fixture: ComponentFixture<EditMoviesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMoviesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
