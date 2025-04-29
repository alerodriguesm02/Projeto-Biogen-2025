import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroBenComponent } from './cadastro-ben.component';

describe('CadastroBenComponent', () => {
  let component: CadastroBenComponent;
  let fixture: ComponentFixture<CadastroBenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroBenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroBenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
