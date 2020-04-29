import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {CategoryRequestFieldComponent} from './category-request-field/category-request-field.component';
import {CategoryRequestFieldModalComponent} from './category-request-field/category-request-field-modal/category-request-field-modal.component';
import {CategoryRequestProblemComponent} from './category-request-problem/category-request-problem.component';
import {CategoryRequestProblemModalComponent} from './category-request-problem/category-request-problem-modal/category-request-problem-modal.component';
import {CategoryComplainFieldModalComponent} from './category-request-field/category-complain-field-modal/category-complain-field-modal.component';
import {CategoryComplainProblemModalComponent} from './category-request-problem/category-complain-problem-modal/category-complain-problem-modal.component';
import {CategoryPartsDamagedComponent} from './category-parts-damaged/category-parts-damaged.component';
import {CategoryPartsDamagedModalComponent} from './category-parts-damaged/category-parts-damaged-modal/category-parts-damaged-modal.component';
import {CategoryPhenomenaDamagedModalComponent} from './category-parts-damaged/category-phenomena-damaged-modal/category-phenomena-damaged-modal.component';
import {CategoryErrorDso1Component} from './category-error-dso1/category-error-dso1.component';
import {ErrorDso1ModalComponent} from './category-error-dso1/error-dso1-modal/error-dso1-modal.component';
import {ErrorDso2ModalComponent} from './category-error-dso1/error-dso2-modal/error-dso2-modal.component';
import {ReasonDso1ModalComponent} from './category-error-dso1/reason-dso1-modal/reason-dso1-modal.component';
import {ReasonDso2ModalComponent} from './category-error-dso1/reason-dso2-modal/reason-dso2-modal.component';
import {CategoryCarTypeComponent} from './category-car-type/category-car-type.component';
import {CarTypeModalComponent} from './category-car-type/car-type-modal/car-type-modal.component';
import {CarModelModalComponent} from './category-car-type/car-model-modal/car-model-modal.component';
import {SpecificationsModalComponent} from './category-car-type/specifications-modal/specifications-modal.component';
import {TMSSTabs} from '../../core/constains/tabs';

const Components = [
  CategoryRequestFieldComponent,
  CategoryRequestFieldModalComponent,
  CategoryRequestProblemComponent,
  CategoryRequestProblemModalComponent,
  CategoryComplainFieldModalComponent,
  CategoryComplainProblemModalComponent,
  CategoryPartsDamagedComponent,
  CategoryPartsDamagedModalComponent,
  CategoryPhenomenaDamagedModalComponent,
  CategoryErrorDso1Component,
  ErrorDso1ModalComponent,
  ErrorDso2ModalComponent,
  ReasonDso1ModalComponent,
  ReasonDso2ModalComponent,
  CategoryCarTypeComponent,
  CarTypeModalComponent,
  CarModelModalComponent
];

const EntryComponents = [
  CategoryRequestFieldComponent,
  CategoryRequestProblemComponent,
  CategoryPartsDamagedComponent,
  CategoryErrorDso1Component,
  CategoryCarTypeComponent
];

const map = {
  [TMSSTabs.categoryRequestField]: CategoryRequestFieldComponent,
  [TMSSTabs.categoryRequestProblem]: CategoryRequestProblemComponent,
  [TMSSTabs.categoryComplainField]: CategoryRequestFieldComponent,
  [TMSSTabs.categoryComplainProblem]: CategoryRequestProblemComponent,
  [TMSSTabs.categoryPartsDamaged]: CategoryPartsDamagedComponent,
  [TMSSTabs.categoryPhenomenaDamaged]: CategoryPartsDamagedComponent,
  [TMSSTabs.categoryErrorDSO1]: CategoryErrorDso1Component,
  [TMSSTabs.categoryErrorDSO2]: CategoryErrorDso1Component,
  [TMSSTabs.categoryReasonDSO1]: CategoryErrorDso1Component,
  [TMSSTabs.categoryReasonDSO2]: CategoryErrorDso1Component,
  [TMSSTabs.categoryCarType]: CategoryCarTypeComponent,
  [TMSSTabs.categoryCarModel]: CategoryCarTypeComponent,
  [TMSSTabs.categorySpecifications]: CategoryCarTypeComponent
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule
  ],
  declarations: [
    Components,
    SpecificationsModalComponent
  ],
  exports: [
    Components
  ],
  entryComponents: [
    EntryComponents
  ]
})
export class CategoryVocModule {
  static getComponent(key) {
    return map[key];
  }
}
