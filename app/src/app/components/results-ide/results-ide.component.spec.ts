import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsIdeComponent } from './results-ide.component';

describe('ResultsIdeComponent', () => {
  let component: ResultsIdeComponent;
  let fixture: ComponentFixture<ResultsIdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsIdeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsIdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
