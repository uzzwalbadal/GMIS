import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WuaInformationComponent } from './wua-information.component';

describe('WuaInformationComponent', () => {
  let component: WuaInformationComponent;
  let fixture: ComponentFixture<WuaInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WuaInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WuaInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
