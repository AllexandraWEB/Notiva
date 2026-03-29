import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedNotesHeader } from "./shared-notes-header";

describe("SharedNotesHeader", () => {
  let component: SharedNotesHeader;
  let fixture: ComponentFixture<SharedNotesHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedNotesHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedNotesHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
