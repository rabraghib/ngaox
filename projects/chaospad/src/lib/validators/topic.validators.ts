import {
  AbstractControl,
  AsyncValidatorFn,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { of } from 'rxjs';
import { catchError, debounceTime, mergeMap, take } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { TopicTypes } from '../models/topic';

export class TopicValidators {
  /* to validate if an alias already used */
  static UniqueAlias(api: ApiService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        mergeMap(username => {
          return api.get(`/topics/${username}`).pipe(
            mergeMap(res => of({ available: false })),
            catchError(err => of(null))
          );
        })
      );
    };
  }

  static Topicname(): ValidatorFn | null {
    return Validators.compose([
      Validators.maxLength(50),
      Validators.pattern(/^[A-Za-z1-9_]+$/)
    ]);
  }

  static Title(): ValidatorFn | null {
    return Validators.compose([Validators.maxLength(50)]);
  }

  static Description(): ValidatorFn | null {
    return Validators.compose([Validators.maxLength(255)]);
  }

  static Type(): ValidatorFn | null {
    return (control: AbstractControl) => {
      if (control.value && !TopicTypes.includes(control.value)) {
        return {
          isValid: false,
          allowedValues: TopicTypes,
          currentValue: control.value
        };
      }
      return null;
    };
  }
}
