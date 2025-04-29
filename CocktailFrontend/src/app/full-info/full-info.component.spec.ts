import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullInfoComponent } from './full-info.component';

describe('FullInfoComponent', () => {
  let component: FullInfoComponent;
  let fixture: ComponentFixture<FullInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
