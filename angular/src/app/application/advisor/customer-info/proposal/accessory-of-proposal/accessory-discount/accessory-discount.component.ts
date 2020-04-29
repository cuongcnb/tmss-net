import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';

import {SetModalHeightService} from '../../../../../../shared/common-service/set-modal-height.service';
import {GlobalValidator} from '../../../../../../shared/form-validation/validators';
import {Subject} from 'rxjs';
import {clickedRow} from './../../proposal.component';

/**
 * Emit discount data for components
 */
export const discountUpdate$ = new Subject();

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'accessory-discount',
  templateUrl: './accessory-discount.component.html',
  styleUrls: ['./accessory-discount.component.scss']
})
export class AccessoryDiscountComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();

  @Input() registerno;
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  modalHeight: number;
  form: FormGroup;
  discountPercent;

  constructor(
    private formBuilder: FormBuilder,
    private modalHeightService: SetModalHeightService
  ) {
  }

  ngOnInit() {
  }

  open(discountPercent?) {
    this.discountPercent = discountPercent;
    this.buildForm();
    this.onResize();
    this.modal.show();
  }

  onResize() {
    this.modalHeight = this.modalHeightService.onResize();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    discountUpdate$.next(Object.assign(this.form.value, {registerno: this.registerno}));
    this.close.emit(this.form.value);
    this.modal.hide();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      discountPercent: [undefined, Validators.compose([GlobalValidator.numberPercent, GlobalValidator.floatNumberFormat0])],
      forAll: [false],
      forJob: [undefined],
      forAccessary: [undefined],
      forDiscounted: [undefined]
    });
    if (this.discountPercent) {
      this.form.get('discountPercent').patchValue(this.discountPercent);
    }
  }
}

const getDiscountType = (discountInfo): string => {
  try {
    if (discountInfo.forDiscounted) {
      if (discountInfo.forAll || (discountInfo.forAccessary && discountInfo.forJob)) {
        return 'all_discounted';
      } else {
        return discountInfo.forJob ? 'job_discounted' : (discountInfo.forAccessary ? 'accessary_discounted' : 'discounted');
      }
    } else {
      if (discountInfo.forAll || (discountInfo.forAccessary && discountInfo.forJob)) {
        return 'all';
      } else {
        return discountInfo.forJob ? 'job' : (discountInfo.forAccessary ? 'accessary' : 'no');
      }
    }
  } catch (error) {
    return 'no';
  }
};

const CVDiscount = (selectNode, data): void => {
  selectNode.setDataValue('discountPercent', Number(data.discountPercent));
  selectNode.setDataValue('discount', Math.round(Number(data.discountPercent * selectNode.data.costs / 100)));
};

const PTDiscount = (selectNode, data): void => {
  selectNode.setDataValue('discountPercent', Number(data.discountPercent));
  selectNode.setDataValue('discount', Number(selectNode.data.qty) > 0
    ? Math.ceil(Number(data.discountPercent * selectNode.data.qty * selectNode.data.sellPrice / 100))
    : Math.floor(Number(data.discountPercent * selectNode.data.qty * selectNode.data.sellPrice / 100)));
};

const discountDirectional = (selectNode, data, type): void => {
  switch (type) {
    case 'CV':
      CVDiscount(selectNode, data);
      break;
    case 'PT':
      PTDiscount(selectNode, data);
      break;
    default:
      console.warn(`Expect type: CV or PT got ${type}`);
      break;
  }
};

/**
 * @param selectedNode Ag grid selected node
 * @param params Ag grid params
 * @param data Discount data
 * @param type Discount object (CV/PT)
 */
export const setDiscount = (selectedNode, params, data, type: string): void => {
  if (!params || !data || !type) {
    return;
  }
  const discountCase = getDiscountType(data);
  if (!selectedNode && (discountCase === 'no' || discountCase === 'discounted')) {
    return;
  }

  switch (discountCase) {
    case 'no':
      if (clickedRow && clickedRow.selectedNode && clickedRow.type) {
        discountDirectional(clickedRow.selectedNode, data, clickedRow.type);
      }
      break;

    case 'discounted':
      if (
        clickedRow
        && clickedRow.selectedNode
        && clickedRow.type
        && (
          !clickedRow.selectedNode.data.discount
          || parseFloat(clickedRow.selectedNode.data.discount) === 0
        )
      ) {
        discountDirectional(clickedRow.selectedNode, data, clickedRow.type);
      }
      break;

    case 'all':
      params.api.forEachNode(rowNode => {
        discountDirectional(rowNode, data, type);
      });
      break;

    case 'all_discounted':
      params.api.forEachNode(rowNode => {
        if (!rowNode.data.discount || parseFloat(rowNode.data.discount) === 0) {
          discountDirectional(rowNode, data, type);
        }
      });
      break;

    case 'job':
      params.api.forEachNode(rowNode => {
        if (rowNode.data.hasOwnProperty('rccode')) {
          discountDirectional(rowNode, data, type);
        }
      });
      break;

    case 'job_discounted':
      params.api.forEachNode(rowNode => {
        if (rowNode.data.hasOwnProperty('rccode') && (!rowNode.data.discount || parseFloat(rowNode.data.discount) === 0)) {
          discountDirectional(rowNode, data, type);
        }
      });
      break;

    case 'accessary':
      params.api.forEachNode(rowNode => {
        if (rowNode.data.hasOwnProperty('partsCode')) {
          discountDirectional(rowNode, data, type);
        }
      });
      break;

    case 'accessary_discounted':
      params.api.forEachNode(rowNode => {
        if (rowNode.data.hasOwnProperty('partsCode') && (!rowNode.data.discount || parseFloat(rowNode.data.discount) === 0)) {
          discountDirectional(rowNode, data, type);
        }
      });
      break;
  }
};

