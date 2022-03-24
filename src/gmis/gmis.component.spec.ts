import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmisComponent } from './gmis.component';

describe('GmisComponent', () => {
  let component: GmisComponent;
  let fixture: ComponentFixture<GmisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
