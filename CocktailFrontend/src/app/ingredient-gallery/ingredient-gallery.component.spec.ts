import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientGalleryComponent } from './ingredient-gallery.component';

describe('IngredientGalleryComponent', () => {
  let component: IngredientGalleryComponent;
  let fixture: ComponentFixture<IngredientGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
