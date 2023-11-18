import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveEditComponent } from './reserve-edit.component';

describe('ReserveEditComponent', () => {
  let component: ReserveEditComponent;
  let fixture: ComponentFixture<ReserveEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReserveEditComponent]
    });
    fixture = TestBed.createComponent(ReserveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
