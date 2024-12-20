import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilderService } from './service/form-builder.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule,CommonModule],
    templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @Input() formDefinition: any[] = []; // Accepting form definition as input
  allFormDefinitions: any[] = [];
  fileNames: string[] = ['form-definition1']; // Files to load form definitions

  form!: FormGroup;
  displayedFields: any[] = []; // Tracks fields to display

  constructor(private fb: FormBuilder, private formService: FormBuilderService) {}

  ngOnInit(): void {
    // Load all forms on initialization
    this.form = this.fb.group({});

    this.formService.loadAllForms(this.fileNames).subscribe({
      next: (forms) => {
        // Flattening the nested response and assigning to formDefinition
        this.formDefinition = forms.flat(); // Flatten the array if necessary
        this.allFormDefinitions = this.formDefinition; // Storing the combined forms
        console.log(this.formDefinition);

        this.buildForm(); // Build form after loading definitions
      },
      error: (err) => {
        console.error('Failed to load forms:', err);
      },
    });
  }

  // Build the form dynamically based on the definition
  buildForm() {
    console.log(this.formDefinition);

    // Iterate over the form definition to create form controls
    this.formDefinition.forEach((field) => {
      const validators = [];
      if (field.validator?.includes('required')) {
        validators.push(Validators.required);
      }

      // Dynamically add form controls based on the field names
      this.form.addControl(field.name, this.fb.control('', validators));
      this.displayedFields.push(field);
      console.log(this.displayedFields);
    });
  }

  isFieldVisible(field: any): boolean {
    if (!field.rules) return true; // No condition means always visible

    // Check conditions based on rules
    let isVisible = false;
    field.rules.forEach((rule: any) => {
      const formValue = this.form.get(rule.field)?.value;
      if (rule.operator === '!=' && formValue !== rule.value) {
        isVisible = true;
      }
      if (rule.operator === '>=' && formValue >= rule.value) {
        isVisible = true;
      }
      if (rule.operator === '<=' && formValue <= rule.value) {
        isVisible = true;
      }
      if (rule.operator === 'or' && (formValue === rule.value || formValue !== rule.value)) {
        isVisible = true;
      }
    });

    return isVisible;
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
