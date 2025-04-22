import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCocktailComponent } from './daily-cocktail.component';

describe('DailyCocktailComponent', () => {
  let component: DailyCocktailComponent;
  let fixture: ComponentFixture<DailyCocktailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyCocktailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyCocktailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
