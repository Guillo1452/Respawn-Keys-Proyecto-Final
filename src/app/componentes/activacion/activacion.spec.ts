import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activacion } from './activacion';

describe('Activacion', () => {
  let component: Activacion;
  let fixture: ComponentFixture<Activacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Activacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
