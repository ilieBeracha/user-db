import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiGenComponent } from './ai-gen.component';

describe('AiGenComponent', () => {
  let component: AiGenComponent;
  let fixture: ComponentFixture<AiGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiGenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
