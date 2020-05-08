import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { SetModalHeightService } from '../../../../shared/common-service/set-modal-height.service';
import { ClaimDetailApi } from '../../../../api/warranty/claim-detail.api';
import { FormBuilder } from '@angular/forms';
import { LoadingService } from '../../../../shared/loading/loading.service';
import { DataFormatService } from '../../../../shared/common-service/data-format.service';
import { ClaimModel } from '../../../../core/models/warranty/claim.model';
import { ToastService } from '../../../../shared/swal-alert/toast.service';
import {User} from '../../../../core/constains/user';
import {SubletApi} from '../../../../api/common-api/sublet.api';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'claim-detail-view',
  templateUrl: './claim-detail-view.component.html',
  styleUrls: ['./claim-detail-view.component.scss', '../claim-detail/claim-detail.component.scss'],
})
export class ClaimDetailViewComponent extends AppComponentBase implements OnInit {
  @ViewChild('repairJobHistoryModal', {static: false}) repairJobHistoryModal;
  @ViewChild('modal', {static: false}) modal;
  modalHeight;
  action;
  sourceTable;
  claim: ClaimModel;
  claimForm;
  dataIdList;
  tcList;
  fieldErrorCode;
  isTMV = false;
  // currentUser = CurrentUser;
  subletTypeList: Array<any>;

  constructor(
    injector: Injector,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private claimDetailApi: ClaimDetailApi,
    private dataFormatService: DataFormatService,
    private toastService: ToastService,
  ) {
    super(injector);
    this.dataIdList = [
      {
        key: 'W',
        value: 'Warranty',
      },
      {
        key: 'S',
        value: 'SETR',
      },
      {
        key: 'F',
        value: 'FreePM',
      },
    ];
    this.tcList = [
      {
        key: 31,
        value: 'Recall/SSC',
      },
      {
        key: 33,
        value: 'Field Fix',
      },
      {
        key: 36,
        value: 'SETR',
      },
      {
        key: 37,
        value: 'Monitor',
      },
      {
        key: 39,
        value: 'Appeal claim',
      },
    ];
    this.fieldErrorCode = [
      {
        headerName: 'Error Code',
        headerTooltip: 'Error Code',
        field: 'errcode',
        width: 50,
      },
      {
        headerName: 'Desc English',
        headerTooltip: 'Desc English',
        field: 'errdesceng',
      },
    ];
  }

  ngOnInit() {
    this.isTMV = this.currentUser.dealerId === User.tmvDealerId;
    this.onResize();
  }

  onResize() {
    this.modalHeight = this.setModalHeightService.onResize();
  }

  reset() {
    // this.claimForm = undefined
    // this.claim = undefined
    this.sourceTable = null;
  }

  open(subletTypes: Array<any>, selectedClaim: ClaimModel, sourceTable?) {
    this.sourceTable = sourceTable;
    this.subletTypeList = subletTypes;
    // this.buildForm()
    this.loadingService.setDisplay(true);
    if (this.sourceTable === 'TWC') {
      this.claimDetailApi.dlrEditClaim(selectedClaim.dealerClaimNo, selectedClaim.dealerCode).subscribe(val => {
        if (val) {
          this.claim = val;
          this.buildClaim(val);
        }
      });
    } else {
      this.claimDetailApi.tmvEditCalim(selectedClaim.twcNo, sourceTable).subscribe(val => {
        if (val) {
          this.claim = val;
          this.buildClaim(val);
        }
      });
    }
  }

  openRepairJobHistory() {
    this.repairJobHistoryModal.open({orderNo: this.claim.orderno, dealerCode: this.claim.dealerCode});
  }

  // VIEW CLAIM
  viewPreviousClaim() {
    this.toastService.openSuccessToast('Chưa có API');
  }

  viewNextClaim() {
    this.toastService.openSuccessToast('Chưa có API');
  }

  buildClaim(claim: ClaimModel) {
    this.claim = claim;
    if (!claim.warrantyType) {
      claim.warrantyType = 'VE';
    }
    if (!claim.state) {
      claim.state = {
        stateValue: null,
        stateTitle: null,
      };
    }
    if (!claim.tmvState) {
      claim.tmvState = {
        stateValue: null,
        stateTitle: null,
      };
    }

    // this.claimForm.patchValue(claim)
    // if (this.claim.warrantyClaimLaborDTOs.length) {
    //   this.claim.warrantyClaimLaborDTOs.forEach(labor => {
    //     this.addLabor(labor)
    //   })
    // }
    // if (this.claim.warrantyClaimPartsDTOs.length) {
    //   this.claim.warrantyClaimPartsDTOs.forEach(parts => {
    //     this.addParts(parts)
    //   })
    // }
    // this.claim.t3Codes.forEach(t3Code => {
    //   this.addT3Code(t3Code)
    // })
    this.loadingService.setDisplay(false);
    this.modal.show();
  }

  formatDate(val) {
    return this.dataFormatService.parseTimestampToDate(val);
  }

  // Only display value by thousands
  formatDisplayValue(val, displayByThousands?: boolean) {
    // val = Math.round((displayByThousands ? val / 1000 : val) * 100) / 100;
    if (val) {
      if (typeof val === 'string') {
        let num = val.trim().replace(/,([0-9]{3})/g, '$1');
        if (parseFloat(num).toString() === num) {
          return parseFloat(num).toLocaleString();
        }

        num = val.trim().replace(/,/g, '');
        const NUMBER_REGEX = /^([0-9]*)$/g;
        if (NUMBER_REGEX.test(num)) {
          return parseFloat(num).toLocaleString();
        }
        return val;
      } else {
        const num = val.toString().replace(/,/g, '');
        return parseFloat(num) ? parseFloat(num).toLocaleString() : val;
      }
    }
    return '';
  }
}
