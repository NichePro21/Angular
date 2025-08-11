import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItemModalComponent } from './update-item-modal.component';

describe('UpdateItemModalComponent', () => {
  let component: UpdateItemModalComponent;
  let fixture: ComponentFixture<UpdateItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateItemModalComponent]
    });
    fixture = TestBed.createComponent(UpdateItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
