import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMuseoComponent } from './detalle-museo.component';

describe('DetalleMuseoComponent', () => {
  let component: DetalleMuseoComponent;
  let fixture: ComponentFixture<DetalleMuseoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMuseoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleMuseoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
