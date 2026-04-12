import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NoteCreationForm } from "./note-creation-form";

describe("NoteCreationForm", () => {
  let component: NoteCreationForm;
  let fixture: ComponentFixture<NoteCreationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteCreationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteCreationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
