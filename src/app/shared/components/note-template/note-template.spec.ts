import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NoteTemplate } from "./note-template";

describe("NoteTemplate", () => {
  let component: NoteTemplate;
  let fixture: ComponentFixture<NoteTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteTemplate],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteTemplate);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("note", {
      id: 1,
      notebook: "Notebook",
      notebookColor: "#111111",
      bgColor: "#ffffff",
      tags: [],
      tagBg: "#f3f4f6",
      tagColor: "#111111",
      title: "Sample note",
    });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
