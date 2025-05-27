import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecaoComponent } from './secao.component';

describe('SecaoComponent', () => {
  let component: SecaoComponent;
  let fixture: ComponentFixture<SecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
