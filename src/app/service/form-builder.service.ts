import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor(private http: HttpClient) {}

  loadAllForms(fileNames: string[]): Observable<any[]> {
    const requests = fileNames.map((fileName) =>
      this.http.get(`/assets/forms/${fileName}.json`)
    );
    return forkJoin(requests).pipe(
      map((responses: any[]) => {
        // Flatten the array by merging all responses into one array
        return responses.flat(); // This will flatten the nested arrays
      })
    );
  }

  // Evaluate conditions for visibility
  evaluateCondition(formValue: any, rules: any[]): boolean {
    // Implement logic to evaluate visibility based on conditions
    // Example: Check if a field satisfies the rules
    return true; // Replace with actual evaluation logic
  }
}
