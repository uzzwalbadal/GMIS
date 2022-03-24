import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgricultureInfoComponent } from './agriculture-info.component';

describe('AgricultureInfoComponent', () => {
  let component: AgricultureInfoComponent;
  let fixture: ComponentFixture<AgricultureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgricultureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgricultureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
