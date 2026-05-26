import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionesComponent } from './operaciones';

describe('OperacionesComponent', () => {
  let component: OperacionesComponent;
  let fixture: ComponentFixture<OperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
