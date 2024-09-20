import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedPageComponent } from './rejected-page.component';

describe('RejectedPageComponent', () => {
  let component: RejectedPageComponent;
  let fixture: ComponentFixture<RejectedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
