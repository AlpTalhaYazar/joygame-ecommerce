import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListingPageComponent } from './category-listing-page.component';

describe('CategoryListingPageComponent', () => {
  let component: CategoryListingPageComponent;
  let fixture: ComponentFixture<CategoryListingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
