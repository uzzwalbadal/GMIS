import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundwaterInfoComponent } from './groundwater-info.component';

describe('GroundwaterInfoComponent', () => {
  let component: GroundwaterInfoComponent;
  let fixture: ComponentFixture<GroundwaterInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroundwaterInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroundwaterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
