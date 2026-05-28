import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarranaNavegacion } from './barrana-navegacion';

describe('BarranaNavegacion', () => {
  let component: BarranaNavegacion;
  let fixture: ComponentFixture<BarranaNavegacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarranaNavegacion],
    }).compileComponents();

    fixture = TestBed.createComponent(BarranaNavegacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
