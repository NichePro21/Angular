import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantTableUpdateComponent } from './variant-table-update.component';

describe('VariantTableUpdateComponent', () => {
  let component: VariantTableUpdateComponent;
  let fixture: ComponentFixture<VariantTableUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariantTableUpdateComponent]
    });
    fixture = TestBed.createComponent(VariantTableUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
