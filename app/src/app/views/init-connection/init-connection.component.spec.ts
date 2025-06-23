import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitConnectionComponent } from './init-connection.component';

describe('InitConnectionComponent', () => {
  let component: InitConnectionComponent;
  let fixture: ComponentFixture<InitConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitConnectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
