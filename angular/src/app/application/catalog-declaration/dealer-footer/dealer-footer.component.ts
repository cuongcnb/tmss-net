import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ToastService } from '../../../shared/swal-alert/toast.service';
import { FooterDetailModel, FooterModel } from '../../../core/models/catalog-declaration/dealer-footer.model';
import { LoadingService } from '../../../shared/loading/loading.service';
import { DlrFooterApi } from '../../../api/master-data/catalog-declaration/dlr-footer.api';
import { DealerApi } from '../../../api/sales-api/dealer/dealer.api';
import { DealerModel } from '../../../core/models/sales/dealer.model';
import { ConfirmService } from '../../../shared/confirmation/confirm.service';
import { GlobalValidator } from '../../../shared/form-validation/validators';
import { GridTableService } from '../../../shared/common-service/grid-table.service';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dealer-footer',
  templateUrl: './dealer-footer.component.html',
  styleUrls: ['./dealer-footer.component.scss']
})
export class DealerFooterComponent extends AppComponentBase implements OnInit {
  // currentUser = CurrentUser;
  dealers: Array<DealerModel>;
  form: FormGroup;
  gridField;
  gridParams;
  isChangeForm: boolean;

  dlrFooter: Array<FooterModel>;
  footerDetail: FooterDetailModel;
  selectedType: FooterModel;
  oldType: FooterModel;

  constructor(
    injector: Injector,
    private swalAlertService: ToastService,
    private confirmService: ConfirmService,
    private loadingService: LoadingService,
    private dlrFooterApi: DlrFooterApi,
    private dealerApi: DealerApi,
    private gridTableService: GridTableService,
    private formBuilder: FormBuilder,
  ) {
    super(injector);
    this.gridField = [
      {field: 'code'},
      {field: 'name'},
      {field: 'description'},
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  callbackDlrFooter(params) {
    params.api.setRowData();
    this.gridParams = params;
    this.getDlrFooters();
  }

  getParamsDlrFooter() {
    const selected = this.gridParams.api.getSelectedRows();
    if (selected) {
      this.selectedType = selected[0];
      this.changeSelectedFooter();
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const value = Object.assign({}, this.form.getRawValue(),
      {typeId: this.oldType.id});

    if ((value.footerTmv && (value.footerTmv.includes("<") || value.footerTmv.includes("&"))) || 
        (value.footer && (value.footer.includes("<") || value.footer.includes("&")))
    ) {
      this.swalAlertService.openWarningToast("Sự thay đổi của bạn không được lưu vì giá trị nhập vào có chứa ký tự không hợp lệ ( '<' hoặc '&' )");
      return;
    }

    const apiCall = this.currentUser.isAdmin
      ? this.dlrFooterApi.saveFooterTmv(this.oldType.id, value)
      : this.dlrFooterApi.saveFooterDealer(this.oldType.id, value);

    apiCall.subscribe(() => {
      this.swalAlertService.openSuccessToast();
      this.getFooterDetail();
    });
  }

  private getDlrFooters() {
    this.loadingService.setDisplay(true);
    this.dlrFooterApi.getAllReportType().subscribe(res => {
      this.dlrFooter = res || [];
      this.gridParams.api.setRowData(this.dlrFooter);
      this.gridTableService.selectFirstRow(this.gridParams);
      this.loadingService.setDisplay(false);
    });
  }

  private getDealers() {
    this.loadingService.setDisplay(true);
    this.dealerApi.getAllAvailableDealers()
      .subscribe(dealers => {
        this.dealers = dealers.filter(dealer => dealer.code !== 'TOTAL') || [];
        this.loadingService.setDisplay(false);
      });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [undefined],
      dlrId: [{value: this.currentUser.dealerId, disabled: !this.currentUser.isAdmin}],
      footerTmv: [{value: undefined, disabled: !this.currentUser.isAdmin}, GlobalValidator.maxLength(2000)],
      footer: [{value: undefined, disabled: this.currentUser.isAdmin}, GlobalValidator.maxLength(2000)],
      status: ['Y'],
    });
    if (this.currentUser.isAdmin) {
      this.getDealers();
    }
    this.form.get('dlrId').valueChanges.subscribe(val => {
      this.form.patchValue({
        footer: undefined,
      });
      if (val) {
        this.changeSelectedFooter();
      }
    });

    // Check form is changed?
    this.form.get('footerTmv').valueChanges.subscribe(() => {
      this.isChangeForm = true;
    });
    if (!this.currentUser.isAdmin) {
      this.form.get('footer').valueChanges.subscribe(() => {
        this.isChangeForm = true;
      });
    }
  }

  private changeSelectedFooter() {
    if (this.isChangeForm) {
      this.confirmService.openConfirmModal('Lưu thay đổi?', 'Bạn muốn thao tác với bản ghi khác nhưng chưa lưu lại sự thay đổi. Bạn có muốn lưu lại sự thay đổi?')
        .subscribe(() => {
          if (this.form.invalid) {
            this.swalAlertService.openWarningToast('Sự thay đổi của bạn không lưu được vì giá trị nhập vào không hợp lệ');
            this.getFooterDetail();
          } else {
            this.save();
          }
        }, () => {
          this.getFooterDetail();
        });
    } else {
      this.getFooterDetail();
    }
  }

  private getFooterDetail() {
    this.isChangeForm = false;
    this.loadingService.setDisplay(true);
    this.dlrFooterApi.getFooterDetail(this.form.getRawValue().dlrId, this.selectedType.id).subscribe(res => {
      this.footerDetail = res || {footer: null, footerTMV: null};
      this.form.patchValue({
        id: this.currentUser.isAdmin
          ? (this.footerDetail.footerTMV ? this.footerDetail.footerTMV.id : null)
          : (this.footerDetail.footer ? this.footerDetail.footer.id : null),
        footerTmv: this.footerDetail.footerTMV ? this.footerDetail.footerTMV.footerTmv : null,
        footer: this.footerDetail.footer ? this.footerDetail.footer.footer : null,
      });
      setTimeout(() => {
        this.isChangeForm = false;
        this.oldType = this.selectedType;
        this.loadingService.setDisplay(false);
      });
    });
  }
}

