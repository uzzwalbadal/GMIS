import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicInfoComponent } from './economic-info.component';

describe('EconomicInfoComponent', () => {
  let component: EconomicInfoComponent;
  let fixture: ComponentFixture<EconomicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EconomicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EconomicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
