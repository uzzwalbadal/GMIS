import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartTestComponentComponent } from './bar-chart-test-component.component';

describe('BarChartTestComponentComponent', () => {
  let component: BarChartTestComponentComponent;
  let fixture: ComponentFixture<BarChartTestComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartTestComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartTestComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
