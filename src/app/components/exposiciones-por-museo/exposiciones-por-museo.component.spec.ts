import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposicionesPorMuseoComponent } from './exposiciones-por-museo.component';

describe('ExposicionesPorMuseoComponent', () => {
  let component: ExposicionesPorMuseoComponent;
  let fixture: ComponentFixture<ExposicionesPorMuseoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExposicionesPorMuseoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExposicionesPorMuseoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
