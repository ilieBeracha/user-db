import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeIdeComponent } from './code-ide.component';

describe('CodeIdeComponent', () => {
  let component: CodeIdeComponent;
  let fixture: ComponentFixture<CodeIdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeIdeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeIdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
