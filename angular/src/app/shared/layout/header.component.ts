import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CurrentUser} from '../../home/home.component';
import {EventBusService} from '../common-service/event-bus.service';
import {StorageKeys} from '../../core/constains/storageKeys';
import {SideBars} from '../../core/constains/sidebars';
import {FormStoringService} from '../common-service/form-storing.service';
import {TMSSTabs} from '../../core/constains/tabs';
import {SetModalHeightService} from '../common-service/set-modal-height.service';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalValidator} from '../form-validation/validators';
import {LoadingService} from '../loading/loading.service';
import {ToastService} from '../swal-alert/toast.service';
import {SysUserApi} from '../../api/system-admin/sys-user.api';
import {omit} from 'lodash';
import {SectionApi} from '../../api/system-admin/section.api';
import {fieldMatch} from '../form-validation/fieldMatch';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isAlwaysShowSubmenu: boolean;
  @Output() openFilterModal = new EventEmitter();
  @ViewChild('modal', {static: true}) modal: ModalDirective;
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter();
  modalHeight: number;
  form: FormGroup;
  currentUser = CurrentUser;
  currentSidebar: SideBars;
  allTabs: Array<string>;
  isShowMenu = false;
  rightMenuHeight: number;
  numberOpen = 1;
  constructor(
    private router: Router,
    private eventBusService: EventBusService,
    private elem: ElementRef,
    private formStoringService: FormStoringService,
    private setModalHeightService: SetModalHeightService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private swalAlertService: ToastService,
    private sysUserApi: SysUserApi,
    private sectionApi: SectionApi
  ) {
  }

  // @HostListener('document:click', ['$event'])
  onMouseClick(event) {
    if (!this.elem.nativeElement.contains(event.target)) {
      this.isShowMenu = false;
    }
  }

  setHeightRightMenu() {
    this.rightMenuHeight = this.setModalHeightService.setMenuHeight();
  }

  clickLogo() {
    this.eventBusService.emit({
      type: 'clickLogo'
    });
  }

  logout() {
    const cbuDisplayGroup = this.formStoringService.get(StorageKeys.cbuDisplayGroup);
    const ckdDisplayGroup = this.formStoringService.get(StorageKeys.ckdDisplayGroup);
    const activeTabsList = this.formStoringService.get(StorageKeys.activeTabs);
    const lastDealerTabs = this.formStoringService.get(StorageKeys.lastDealerTabs);
    const dealerId = this.formStoringService.get(StorageKeys.dlrId);
    this.sectionApi.refreshToken().subscribe(() => {
    });
    localStorage.clear();
    this.formStoringService.set(StorageKeys.ckdDisplayGroup, ckdDisplayGroup);
    this.formStoringService.set(StorageKeys.cbuDisplayGroup, cbuDisplayGroup);
    // this.formStoringService.set(StorageKeys.activeTabs, [...lastDealerTabs || [], ...activeTabsList || []]);
    this.formStoringService.set(StorageKeys.dlrId, dealerId);
    const data = document.querySelector('home');
    if (data) {
      data.parentNode.removeChild(data);
    }
    setTimeout(() => {
      document.body.classList.add('login');
      this.router.navigate(['/auth/login']);
    }, 100);
  }

  openComponent(event, item) {
    event.stopPropagation();
    if (this.allTabs.indexOf(item.functionCode) < 0) {
      return;
    }
    this.eventBusService.emit({
      type: 'openComponent',
      functionCode: item.functionCode
    });
  }

  checkShowSubmenu(menu) {
    return menu && this.currentSidebar === menu.code;
  }

  changeSidebarMenu(menu) {
    this.currentSidebar = (this.currentSidebar === menu.code) ? null : menu.code;
    this.formStoringService.set(StorageKeys.activeSidebar, (this.currentSidebar !== menu.code) ? null : menu.code);
  }

  onResize(event) {
    this.isAlwaysShowSubmenu = (event.target.innerWidth < 992);
  }

  get menuList() {
    // if (this.currentUser.userName === 'SYMANAGEMENT') {
    //   return;
    // } else {
    //   return (this.currentUser.menuList).filter(it => it.code.toLowerCase().indexOf('danh m') > -1)
    // }
    return [];
  }

  showModalChangePassword() {
    this.buildForm();
    if (this.numberOpen === 1) {
      this.modal.show();
      this.numberOpen ++;
      this.modal.hide();
    }
    this.modal.show();
  }

  ngOnInit() {
    const currentActiveSidebar = this.formStoringService.get(StorageKeys.activeSidebar);
    if (currentActiveSidebar) {
      this.currentSidebar = currentActiveSidebar;
    }
    this.allTabs = Object.values(TMSSTabs);
    this.elem.nativeElement.addEventListener('click', (event) => {
      this.onMouseClick(event);
    });
  }

  ngOnDestroy() {
    this.elem.nativeElement.removeEventListener('click', (event) => {
      this.onMouseClick(event);
    });
  }

  changePassword() {
    console.log(this.form.getRawValue());
    if (this.form.invalid) {
      return;
    }

    let obj = this.form.value;
    if (obj.oldPassword === obj.newPassword) {
      this.swalAlertService.openWarningToast('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }
    obj = omit(obj, 'confirmPassword');
    this.loadingService.setDisplay(true);
    this.sysUserApi.changePassword(obj).subscribe(() => {
      this.sectionApi.refreshToken().subscribe(
        () => {
          this.loadingService.setDisplay(false);
          this.swalAlertService.openSuccessToast();
          this.close.emit();
          this.modal.hide();
        });
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      oldPassword: [undefined, GlobalValidator.required],
      newPassword: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.requiredPassword])],
      confirmPassword: [undefined, Validators.compose([GlobalValidator.required, GlobalValidator.requiredPassword])]
    },
      {validator: fieldMatch('newPassword', 'confirmPassword')});
  }
}
