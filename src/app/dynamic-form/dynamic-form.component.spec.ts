// src/app/dynamic-form/dynamic-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form.component';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicFormComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
  });

  it('should render mandatory fields with an asterisk', () => {
    component.formDefinition = [
      { fieldtype: 'text', name: 'Order No', validator: ['required'] },
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('label span')?.textContent).toBe('*');
  });

  it('should display fields conditionally', () => {
    component.formDefinition = [
      {
        fieldtype: 'text',
        name: 'Field3',
        rules: [{ field: 'Field1', operator: '>=', value: 20 }],
      },
    ];
    component.form.patchValue({ Field1: 25 });
    fixture.detectChanges();

    expect(component.isFieldVisible(component.formDefinition[0])).toBe(true);
  });
});
