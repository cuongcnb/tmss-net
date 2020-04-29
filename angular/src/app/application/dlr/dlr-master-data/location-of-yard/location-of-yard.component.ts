import {Component, OnInit, ViewChild} from '@angular/core';
import {LocationOfYardService} from '../../../../api/dlr-master-data/location-of-yard.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {GlobalValidator} from '../../../../shared/form-validation/validators';
import {ToastService} from '../../../../shared/common-service/toast.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'location-of-yard',
  templateUrl: './location-of-yard.component.html',
  styleUrls: ['./location-of-yard.component.scss']
})
export class LocationOfYardComponent implements OnInit {
  @ViewChild('locationOfYardModal', {static: false}) locationOfYardModal;
  fieldGridLocationYard;
  yardDealerHeaderForm: FormGroup;
  yardOfDealerParams;
  selectedYard;

  constructor(
    private locationOfYardService: LocationOfYardService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.fieldGridLocationYard = [
      {field: 'code'},
      {field: 'ordering'},
      {
        field: 'status',
        cellRenderer: params => {
          return `${params.value === 'Y' ? 'Enable' : 'Disable'}`;
        }
      },
      {field: 'description'},
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  callbackLocation(params) {
    this.yardOfDealerParams = params;
  }

  getParamsLocation() {
    const selectedYard = this.yardOfDealerParams.api.getSelectedRows();
    if (selectedYard) {
      this.selectedYard = selectedYard[0];
    }
  }

  search() {
    if (this.yardDealerHeaderForm.invalid) {
      return;
    }

    this.selectedYard = undefined;
    this.loadingService.setDisplay(true);
    this.locationOfYardService.findYardOfDealer(this.yardDealerHeaderForm.value).subscribe(yardOfDealer => {
      this.yardOfDealerParams.api.setRowData(yardOfDealer);
      this.loadingService.setDisplay(false);
    });
  }

  updateYard() {
    if (this.selectedYard) {
      this.locationOfYardModal.open(this.selectedYard);
    } else {
      this.toastService.openWarningForceSelectData();
    }
  }

  private buildForm() {
    this.yardDealerHeaderForm = this.formBuilder.group({
      code: [undefined, GlobalValidator.required],
      ordering: [undefined],
      status: [undefined],
      description: [undefined],
    });
  }

}
