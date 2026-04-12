import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Notebooks } from "./notebooks";

describe("Notebooks", () => {
  let component: Notebooks;
  let fixture: ComponentFixture<Notebooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notebooks],
    }).compileComponents();

    fixture = TestBed.createComponent(Notebooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
