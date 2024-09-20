import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualThreeRowComponent } from './manual-three-row.component';

describe('ManualThreeRowComponent', () => {
  let component: ManualThreeRowComponent;
  let fixture: ComponentFixture<ManualThreeRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualThreeRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualThreeRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
