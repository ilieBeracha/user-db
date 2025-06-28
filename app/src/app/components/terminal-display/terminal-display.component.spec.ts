import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDisplayComponent } from './terminal-display.component';

describe('TerminalDisplayComponent', () => {
  let component: TerminalDisplayComponent;
  let fixture: ComponentFixture<TerminalDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
