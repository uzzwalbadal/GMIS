import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringInfoComponent } from './engineering-info.component';

describe('EngineeringInfoComponent', () => {
  let component: EngineeringInfoComponent;
  let fixture: ComponentFixture<EngineeringInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
