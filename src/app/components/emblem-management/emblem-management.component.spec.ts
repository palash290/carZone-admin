import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmblemManagementComponent } from './emblem-management.component';

describe('EmblemManagementComponent', () => {
  let component: EmblemManagementComponent;
  let fixture: ComponentFixture<EmblemManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmblemManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmblemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
