import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilderService } from '../service/form-builder.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',

})
export class DynamicFormComponent {
  @Input() formDefinition: any[] = []; // Accepting form definition as input
  allFormDefinitions: any[] = [];
  fileNames: string[] = ['form-definition1', 'form-definition2']; // Files to load form definitions

  form!: FormGroup;
  displayedFields: any[] = []; // Tracks fields to display

  constructor(private fb: FormBuilder, private formService: FormBuilderService) {}

  ngOnInit(): void {
    // Load all forms on initialization
    this.form = this.fb.group({});

    this.formService.loadAllForms(this.fileNames).subscribe({
      next: (forms) => {
        this.allFormDefinitions = forms;
        this.buildForm(); // Build form after loading definitions
      },
      error: (err) => {
        console.error('Failed to load forms:', err);
      },
    });
  }

  // Build the form dynamically based on the definition
  buildForm() {
    this.formDefinition.forEach((field) => {
      const validators = [];
      if (field.validator?.includes('required')) {
        validators.push(Validators.required);
      }

      // Dynamically add form controls
      this.form.addControl(field.name, this.fb.control('', validators));
      this.displayedFields.push(field);
    });
  }

  // Evaluate if a field should be visible based on its conditions
  isFieldVisible(field: any): boolean {
    if (!field.rules) return true; // No condition means always visible
    return this.formService.evaluateCondition(this.form.value, field.rules);
  }

  // Save the form data
  saveForm() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value); // Log the valid form data
    } else {
      alert('Please fill in all required fields.'); // Alert for missing required fields
    }
  }
}
