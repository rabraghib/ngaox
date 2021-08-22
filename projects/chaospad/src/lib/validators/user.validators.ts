import {
  AbstractControl,
  AsyncValidatorFn,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { of } from 'rxjs';
import { catchError, debounceTime, mergeMap, take } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

export class UserValidators {
  constructor() {}

  static Unique(api: ApiService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        mergeMap(username => {
          return api.get(`/users/u/${username}`).pipe(
            mergeMap(res => of({ available: false })),
            catchError(err => of(null))
          );
        })
      );
    };
  }

  static Username(): ValidatorFn | null {
    return Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(25),
      Validators.pattern(/^[a-z0-9]+[.]?[a-z0-9]+$/)
    ]);
  }

  static FullName(): ValidatorFn | null {
    return Validators.compose([Validators.maxLength(30)]);
  }

  static Email(): ValidatorFn | null {
    return Validators.compose([Validators.email, Validators.maxLength(255)]);
  }

  static Password(): ValidatorFn | null {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]$/;
    return Validators.compose([
      Validators.minLength(6),
      Validators.maxLength(50),
      Validators.pattern(regex)
    ]);
  }

  static Birthday(): ValidatorFn | null {
    return (control: AbstractControl) => {
      const date = new Date(control.value);
      const maxDate = new Date();
      maxDate.setUTCFullYear(maxDate.getUTCFullYear() - 13);
      const minDate = new Date();
      minDate.setUTCFullYear(maxDate.getUTCFullYear() - 85);

      if (control.value && (date > maxDate || date < minDate)) {
        return {
          valid: false,
          tooOld: date < minDate,
          tooYoung: date > maxDate
        };
      }
      return null;
    };
  }

  static Bio(): ValidatorFn | null {
    return Validators.compose([Validators.maxLength(150)]);
  }
}
