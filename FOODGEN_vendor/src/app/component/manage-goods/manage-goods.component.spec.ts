import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGoodsComponent } from './manage-goods.component';

describe('ManageGoodsComponent', () => {
  let component: ManageGoodsComponent;
  let fixture: ComponentFixture<ManageGoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
