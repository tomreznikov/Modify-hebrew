import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingStepComponent } from './grouping-step.component';

describe('GroupingStepComponent', () => {
  let component: GroupingStepComponent;
  let fixture: ComponentFixture<GroupingStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupingStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupingStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
