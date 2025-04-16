import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposicionAdminComponent } from './exposicion-admin.component';

describe('ExposicionAdminComponent', () => {
  let component: ExposicionAdminComponent;
  let fixture: ComponentFixture<ExposicionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExposicionAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExposicionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
