import { FormGroup } from '@angular/forms';

export const fieldMatch = (field1, field2) =>
  (form: FormGroup) => {
    const v1 = form.value[field1];
    const v2 = form.value[field2];
    const result = v1 !== v2 ? { fieldMatch: [field1, field2] } : undefined;
    if (result) {
      form.get(field2).setErrors({ fieldMatch: true });
    }
    return result;
  };
