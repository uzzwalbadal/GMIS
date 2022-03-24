import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmapComponent } from './pmap.component';

describe('PmapComponent', () => {
  let component: PmapComponent;
  let fixture: ComponentFixture<PmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
