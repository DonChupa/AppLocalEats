import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdsPage } from './prods.page';

describe('ProdsPage', () => {
  let component: ProdsPage;
  let fixture: ComponentFixture<ProdsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
