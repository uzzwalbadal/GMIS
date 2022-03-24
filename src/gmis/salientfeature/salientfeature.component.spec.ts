import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalientfeatureComponent } from './salientfeature.component';

describe('SalientfeatureComponent', () => {
  let component: SalientfeatureComponent;
  let fixture: ComponentFixture<SalientfeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalientfeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalientfeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
