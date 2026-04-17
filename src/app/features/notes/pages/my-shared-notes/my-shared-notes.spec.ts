import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MySharedNotes } from "./my-shared-notes";

describe("MySharedNotes", () => {
  let component: MySharedNotes;
  let fixture: ComponentFixture<MySharedNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySharedNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(MySharedNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
