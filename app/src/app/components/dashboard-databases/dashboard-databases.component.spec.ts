import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDatabasesComponent } from './dashboard-databases.component';

describe('DashboardDatabasesComponent', () => {
  let component: DashboardDatabasesComponent;
  let fixture: ComponentFixture<DashboardDatabasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDatabasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDatabasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
