import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailResearchComponent } from './cocktail-research.component';

describe('CocktailResearchComponent', () => {
  let component: CocktailResearchComponent;
  let fixture: ComponentFixture<CocktailResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailResearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
