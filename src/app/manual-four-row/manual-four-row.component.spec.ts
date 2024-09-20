import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualFourRowComponent } from './manual-four-row.component';

describe('ManualFourRowComponent', () => {
  let component: ManualFourRowComponent;
  let fixture: ComponentFixture<ManualFourRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualFourRowComponent] // Import the standalone component here
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualFourRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
