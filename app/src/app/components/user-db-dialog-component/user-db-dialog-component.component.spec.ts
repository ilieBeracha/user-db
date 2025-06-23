import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDbDialogComponentComponent } from './user-db-dialog-component.component';

describe('UserDbDialogComponentComponent', () => {
  let component: UserDbDialogComponentComponent;
  let fixture: ComponentFixture<UserDbDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDbDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDbDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
