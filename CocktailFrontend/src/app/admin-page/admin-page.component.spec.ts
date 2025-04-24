import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADMINPAGEComponent } from './admin-page.component';

describe('ADMINPAGEComponent', () => {
  let component: ADMINPAGEComponent;
  let fixture: ComponentFixture<ADMINPAGEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADMINPAGEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ADMINPAGEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
