import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaTreeComponent } from './schema-tree.component';

describe('SchemaTreeComponent', () => {
  let component: SchemaTreeComponent;
  let fixture: ComponentFixture<SchemaTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
