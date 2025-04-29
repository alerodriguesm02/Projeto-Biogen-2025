import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolucaoComponent } from './solucao.component';

describe('SolucaoComponent', () => {
  let component: SolucaoComponent;
  let fixture: ComponentFixture<SolucaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolucaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
