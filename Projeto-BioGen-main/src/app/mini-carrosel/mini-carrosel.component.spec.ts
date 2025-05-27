import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCarroselComponent } from './mini-carrosel.component';

describe('MiniCarroselComponent', () => {
  let component: MiniCarroselComponent;
  let fixture: ComponentFixture<MiniCarroselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCarroselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniCarroselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
