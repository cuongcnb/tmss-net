import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoadingService} from '../../../../shared/loading/loading.service';
import {ToastService} from '../../../../shared/swal-alert/toast.service';
import {SystemFunctionListApi} from '../../../../api/system-admin/system-function-list.api';
import {AuthorizeApi} from '../../../../api/system-admin/authorize.api';
import {StorageKeys} from '../../../../core/constains/storageKeys';
import {FormStoringService} from '../../../../shared/common-service/form-storing.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'menu-function-assign',
  templateUrl: './menu-function-assign.component.html',
  styleUrls: ['./menu-function-assign.component.scss'],
})
export class MenuFunctionAssignComponent implements OnInit {
  @ViewChild('modal', {static: false}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  form: FormGroup;
  menus: Array<any> = [];
  fieldGrid;
  currentUser;
  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private authorizeApi: AuthorizeApi,
    private systemFunctionListApi: SystemFunctionListApi,
    private formStoringService: FormStoringService
  ) {
    this.fieldGrid = [
      {headerName: 'Tên', headerTooltip: 'Tên', field: 'menuName'},
      {headerName: 'Mô Tả', headerTooltip: 'Mô Tả', field: 'menuDescription'},
    ];
    this.currentUser = this.formStoringService.get(StorageKeys.currentUser);  }

  ngOnInit() {
    this.systemFunctionListApi.getAll().subscribe(menus => {
      this.menus = this.currentUser.dealerId > 0 ? menus.filter(it => [null, -1 , -2, this.currentUser.dealerId].includes(it.dealerId)) :  menus;
    });
  }

  open() {
    this.buildForm();
    this.modal.show();
  }

  reset() {
    this.form = undefined;
  }

  save() {
    if (!this.form.value.menuControl) {
      this.swalAlertService.openFailToast('Bạn phải chọn menu');
      return;
    }

    const menuId = this.form.value.menuControl.menuId;
    this.loadingService.setDisplay(true);
    this.authorizeApi.getFuncByMenuId(menuId).subscribe((functionList) => {
      this.loadingService.setDisplay(false);
      this.swalAlertService.openSuccessToast();

      const result = (functionList && functionList.length)
        ? functionList.map(item => Object.assign({}, item, { menuId, })) : [];
      this.close.emit(result);
      this.modal.hide();
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      menuControl: [undefined],
    });
  }

}
