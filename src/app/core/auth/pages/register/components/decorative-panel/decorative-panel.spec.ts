import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DecorativePanel } from "./decorative-panel";

describe("DecorativePanel", () => {
  let component: DecorativePanel;
  let fixture: ComponentFixture<DecorativePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecorativePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(DecorativePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
