import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash';
import { FleetUnitService} from '../../../../api/fleet-sale/fleet-unit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modify-fleet-unit',
  templateUrl: './modify-fleet-unit.component.html',
  styleUrls: ['./modify-fleet-unit.component.scss']
})
export class ModifyFleetUnitComponent implements OnInit {
  @ViewChild('modifyFleetUnit', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  selectedData;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fleetUnitService: FleetUnitService
  ) {
  }

  ngOnInit() {
  }

  open(selectedData?) {
    this.selectedData = selectedData;
    this.buildForm();
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (this.form.invalid || isEqual(this.form.value, { min: '', max: '', available: '' })) {
      return;
    }
    const apiCall = !this.selectedData ?
      this.fleetUnitService.createNewFleetUnit(this.form.value) : this.fleetUnitService.updateFleetUnit(this.form.value);
    apiCall.subscribe(() => {
      this.close.emit();
      this.modal.hide();
    }, () => {
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [''],
      unitMin: ['', Validators.min(0)],
      unitMax: ['', Validators.min(0)],
      available: ['', Validators.min(0)],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
}
