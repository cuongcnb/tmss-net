import {
  Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef, Injector, NgModuleFactoryLoader,
  NgModuleFactory, NgModuleRef, ComponentRef, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, SimpleChange,
  OnChanges, OnDestroy
} from '@angular/core';
import {TMSSTabs, MODULE_MAP} from '../../core/constains/tabs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dynamic-tab',
  templateUrl: './dynamic-tab.component.html',
  styleUrls: ['./dynamic-tab.component.scss']
})
export class DynamicTabComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('componentPlaceholder', {read: ViewContainerRef, static: false}) componentPlaceholder: ViewContainerRef;
  @Input() tab;
  @Input() inputs;
  @Input() index;
  @Input() isAdmin;
  @Output() output = new EventEmitter();

  private moduleRef: NgModuleRef<any>;
  public componentRef: ComponentRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private loader: NgModuleFactoryLoader
  ) {
  }

  ngOnInit() {
    const module = this.findModule(this.tab);
    if (module) {
      this.loader
        .load(module).then((moduleFactory: NgModuleFactory<any>) => {
        this.moduleRef = moduleFactory.create(this.injector);
        let entryComponent = (moduleFactory.moduleType as any).getComponent(this.tab);
        if (Array.isArray(entryComponent)) {
          if (this.isAdmin) {
            entryComponent = entryComponent[0];
          } else {
            entryComponent = entryComponent[1];
          }
        }
        const compFactory = this.moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);
        this.componentRef = this.componentPlaceholder.createComponent(compFactory);
        if (this.inputs) {
          for (const key in this.inputs) {
            if (this.inputs.hasOwnProperty(key)) {
              this.componentRef.instance[key] = this.inputs[key];
            }
          }
        }
        this.cdr.detectChanges();
        switch (this.tab) {
          case TMSSTabs.booking:
            this.componentRef.instance.clear.subscribe(() => {
              this.output.emit([{name: 'clearCustomer', param: []}]);
            });
            break;
          case TMSSTabs.proposal:
            this.componentRef.instance.shortcuts.subscribe((e) => {
              this.output.emit([{name: 'setShortcuts', param: e}]);
            });
            this.componentRef.instance.clear.subscribe(() => {
              this.output.emit([{name: 'clearCustomer', param: {}}, {name: 'clearCarInfo', param: {}}]);
            });
            break;
          default:
            break;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputs && this.moduleRef && this.componentRef) {
      if (this.inputs) {
        // tslint:disable-next-line:no-shadowed-variable
        const changes = {};
        // tslint:disable-next-line:forin
        for (const key in this.inputs) {
          const oldValue = this.componentRef.instance[key];
          if (this.inputs.hasOwnProperty(key)) {
            this.componentRef.instance[key] = this.inputs[key];
          }
          if (oldValue !== this.inputs[key]) {
            changes[key] = new SimpleChange(oldValue, this.inputs[key], false);
          }
        }
        if (Object.keys(changes).length && this.componentRef.instance.ngOnChanges) {
          this.componentRef.instance.ngOnChanges(changes);
        }
      }
    }
  }

  runCustomFunction() {
    if (this.componentRef) {
      if (this.tab.startsWith(`${TMSSTabs.proposal}-`)) {
        this.componentRef.instance.reloadQuotation();
        return;
      }
      switch (this.tab) {
        case TMSSTabs.booking:
          this.componentRef.instance.checkAppStatus();
          break;
        case TMSSTabs.generalRepairProgress:
          this.componentPlaceholder.remove();
          this.ngOnInit();
          break;
        case TMSSTabs.dongsonProgress:
          this.componentPlaceholder.remove();
          this.ngOnInit();
          break;
        case TMSSTabs.dongsonProgressByCar:
          this.componentPlaceholder.remove();
          this.ngOnInit();
          break;
        case TMSSTabs.dongsonProgressByWshop:
          this.componentPlaceholder.remove();
          this.ngOnInit();
          break;

        case TMSSTabs.carWash:
          this.componentPlaceholder.remove();
          this.ngOnInit();
          break;
        case TMSSTabs.carWash:
          this.componentRef.instance.refreshSearch();
          break;
        case TMSSTabs.customerInfo:
          this.componentRef.instance.selectedTabCustomerInfo();
          break;
        default:
          break;
      }
    }
  }

  ngOnDestroy() {
    if (this.moduleRef) {
      this.moduleRef.destroy();
    }
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  findModule(tab) {
    if (tab.startsWith(TMSSTabs.proposal)) {
      return 'src/app/application/advisor/dlr-advisor.module#DlrAdvisorModule';
    }
    for (const key in MODULE_MAP) {
      if (MODULE_MAP[key].includes(tab)) {
        return key;
      }
    }
    return '';
  }
}
