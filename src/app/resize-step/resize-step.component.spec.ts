import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeStepComponent } from './resize-step.component';

describe('ResizeStepComponent', () => {
  let component: ResizeStepComponent;
  let fixture: ComponentFixture<ResizeStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizeStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
