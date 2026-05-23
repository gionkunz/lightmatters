import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Engine } from './engine';

describe('Engine', () => {
  let component: Engine;
  let fixture: ComponentFixture<Engine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Engine],
    }).compileComponents();

    fixture = TestBed.createComponent(Engine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
