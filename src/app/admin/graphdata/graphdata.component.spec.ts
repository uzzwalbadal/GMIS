import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphdataComponent } from './graphdata.component';

describe('GraphdataComponent', () => {
  let component: GraphdataComponent;
  let fixture: ComponentFixture<GraphdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
