import {
  BaseComponent
} from "./chunk-P357ZQHD.js";
import "./chunk-2DVJJR2X.js";
import {
  BaseStyle
} from "./chunk-5WRWA7VD.js";
import {
  PrimeTemplate,
  SharedModule
} from "./chunk-OQMFEBDS.js";
import {
  getOuterHeight
} from "./chunk-YRV3S4GF.js";
import "./chunk-3PDMTU54.js";
import "./chunk-IJTOCJYA.js";
import {
  CommonModule,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-7INRATQE.js";
import "./chunk-BV6YITCM.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  inject,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵpureFunction5,
  ɵɵqueryRefresh,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-GB642C24.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-MARUHEWW.js";
import "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-metergroup.mjs
var _c0 = (a0, a1) => ({
  $implicit: a0,
  icon: a1
});
var _c1 = () => ({
  "p-metergroup-label-icon": true
});
var _c2 = (a0) => ({
  color: a0
});
var _c3 = (a0) => ({
  backgroundColor: a0
});
function MeterGroupLabel_li_1_ng_container_1_i_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "i", 8);
  }
  if (rf & 2) {
    const labelItem_r1 = ɵɵnextContext(2).$implicit;
    ɵɵclassMap(labelItem_r1.icon);
    ɵɵproperty("ngClass", ɵɵpureFunction0(4, _c1))("ngStyle", ɵɵpureFunction1(5, _c2, labelItem_r1.color));
  }
}
function MeterGroupLabel_li_1_ng_container_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 9);
  }
  if (rf & 2) {
    const labelItem_r1 = ɵɵnextContext(2).$implicit;
    ɵɵproperty("ngStyle", ɵɵpureFunction1(1, _c3, labelItem_r1.color));
  }
}
function MeterGroupLabel_li_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, MeterGroupLabel_li_1_ng_container_1_i_1_Template, 1, 7, "i", 6)(2, MeterGroupLabel_li_1_ng_container_1_span_2_Template, 1, 3, "span", 7);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const labelItem_r1 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵproperty("ngIf", labelItem_r1.icon);
    ɵɵadvance();
    ɵɵproperty("ngIf", !labelItem_r1.icon);
  }
}
function MeterGroupLabel_li_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MeterGroupLabel_li_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "li", 2);
    ɵɵtemplate(1, MeterGroupLabel_li_1_ng_container_1_Template, 3, 2, "ng-container", 3)(2, MeterGroupLabel_li_1_ng_container_2_Template, 1, 0, "ng-container", 4);
    ɵɵelementStart(3, "span", 5);
    ɵɵtext(4);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const labelItem_r1 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.iconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.iconTemplate)("ngTemplateOutletContext", ɵɵpureFunction2(5, _c0, labelItem_r1, labelItem_r1.icon));
    ɵɵadvance(2);
    ɵɵtextInterpolate2("", labelItem_r1.label, " (", ctx_r1.parentInstance.percentValue(labelItem_r1.value), ")");
  }
}
var _c4 = ["label"];
var _c5 = ["meter"];
var _c6 = ["end"];
var _c7 = ["start"];
var _c8 = ["icon"];
var _c9 = ["container"];
var _c10 = (a0, a1, a2) => ({
  $implicit: a0,
  totalPercent: a1,
  percentages: a2
});
var _c11 = (a0, a1, a2, a3, a4) => ({
  $implicit: a0,
  index: a1,
  orientation: a2,
  class: "p-metergroup-meter",
  size: a3,
  totalPercent: a4
});
function MeterGroup_Conditional_2_p_meterGroupLabel_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "p-meterGroupLabel", 6);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("value", ctx_r0.value)("labelPosition", ctx_r0.labelPosition)("labelOrientation", ctx_r0.labelOrientation)("min", ctx_r0.min)("max", ctx_r0.max)("iconTemplate", ctx_r0.iconTemplate || ctx_r0._iconTemplate);
  }
}
function MeterGroup_Conditional_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MeterGroup_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, MeterGroup_Conditional_2_p_meterGroupLabel_0_Template, 1, 6, "p-meterGroupLabel", 5)(1, MeterGroup_Conditional_2_ng_container_1_Template, 1, 0, "ng-container", 2);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngIf", !ctx_r0.labelTemplate && !ctx_r0._labelTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.labelTemplate || ctx_r0.labelTemplate)("ngTemplateOutletContext", ɵɵpureFunction3(3, _c10, ctx_r0.value, ctx_r0.totalPercent(), ctx_r0.percentages()));
  }
}
function MeterGroup_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MeterGroup_ng_container_5_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MeterGroup_ng_container_5_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵelement(1, "span", 8);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const meterItem_r2 = ɵɵnextContext().$implicit;
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngStyle", ctx_r0.meterStyle(meterItem_r2));
  }
}
function MeterGroup_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, MeterGroup_ng_container_5_ng_container_1_Template, 1, 0, "ng-container", 2)(2, MeterGroup_ng_container_5_ng_container_2_Template, 2, 1, "ng-container", 7);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const meterItem_r2 = ctx.$implicit;
    const index_r3 = ctx.index;
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.meterTemplate || ctx_r0._meterTemplate)("ngTemplateOutletContext", ɵɵpureFunction5(3, _c11, meterItem_r2, index_r3, ctx_r0.orientation, ctx_r0.percentValue(meterItem_r2.value), ctx_r0.totalPercent()));
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r0.meterTemplate && !ctx_r0._meterTemplate && meterItem_r2.value > 0);
  }
}
function MeterGroup_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MeterGroup_Conditional_7_p_meterGroupLabel_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "p-meterGroupLabel", 6);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("value", ctx_r0.value)("labelPosition", ctx_r0.labelPosition)("labelOrientation", ctx_r0.labelOrientation)("min", ctx_r0.min)("max", ctx_r0.max)("iconTemplate", ctx_r0.iconTemplate || ctx_r0._iconTemplate);
  }
}
function MeterGroup_Conditional_7_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MeterGroup_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, MeterGroup_Conditional_7_p_meterGroupLabel_0_Template, 1, 6, "p-meterGroupLabel", 5)(1, MeterGroup_Conditional_7_ng_container_1_Template, 1, 0, "ng-container", 2);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngIf", !ctx_r0.labelTemplate && !ctx_r0._labelTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.labelTemplate || ctx_r0._labelTemplate)("ngTemplateOutletContext", ɵɵpureFunction3(3, _c10, ctx_r0.value, ctx_r0.totalPercent(), ctx_r0.percentages()));
  }
}
var theme = ({
  dt
}) => `
.p-metergroup {
    display: flex;
    gap: ${dt("metergroup.gap")};
}

.p-metergroup-meters {
    display: flex;
    background: ${dt("metergroup.meters.background")};
    border-radius: ${dt("metergroup.border.radius")};
}

.p-metergroup-label-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.p-metergroup-label {
    display: inline-flex;
    align-items: center;
    gap: ${dt("metergroup.label.gap")};
}

.p-metergroup-label-marker {
    display: inline-flex;
    width: ${dt("metergroup.label.marker.size")};
    height: ${dt("metergroup.label.marker.size")};
    border-radius: 100%;
}

.p-metergroup-label-icon {
    font-size: ${dt("metergroup.label.icon.size")};
    width: ${dt("metergroup.label.icon.size")};
    height: ${dt("metergroup.label.icon.size")};
}

.p-metergroup-horizontal {
    flex-direction: column;
}

.p-metergroup-label-list-horizontal {
    gap: ${dt("metergroup.label.list.horizontal.gap")};
}

.p-metergroup-horizontal .p-metergroup-meters {
    height: ${dt("metergroup.meters.size")};
}

.p-metergroup-horizontal .p-metergroup-meter:first-of-type {
    border-start-start-radius: ${dt("metergroup.border.radius")};
    border-end-start-radius: ${dt("metergroup.border.radius")};
}

.p-metergroup-horizontal .p-metergroup-meter:last-of-type {
    border-start-end-radius: ${dt("metergroup.border.radius")};
    border-end-end-radius: ${dt("metergroup.border.radius")};
}

.p-metergroup-vertical {
    flex-direction: row;
}

.p-metergroup-label-list-vertical {
    flex-direction: column;
    gap: ${dt("metergroup.label.list.vertical.gap")};
}

.p-metergroup-vertical .p-metergroup-meters {
    flex-direction: column;
    width: ${dt("metergroup.meters.size")};
    height: 100%;
}

.p-metergroup-vertical .p-metergroup-label-list {
    align-items: start;
}

.p-metergroup-vertical .p-metergroup-meter:first-of-type {
    border-start-start-radius: ${dt("metergroup.border.radius")};
    border-start-end-radius: ${dt("metergroup.border.radius")};
}
.p-metergroup-vertical .p-metergroup-meter:last-of-type {
    border-end-start-radius: ${dt("metergroup.border.radius")};
    border-end-end-radius: ${dt("metergroup.border.radius")};
}
`;
var classes = {
  root: ({
    props
  }) => ["p-metergroup p-component", {
    "p-metergroup-horizontal": props.orientation === "horizontal",
    "p-metergroup-vertical": props.orientation === "vertical"
  }],
  meters: "p-metergroup-meters",
  meter: "p-metergroup-meter",
  labelList: ({
    props
  }) => ["p-metergroup-label-list", {
    "p-metergroup-label-list-vertical": props.labelOrientation === "vertical",
    "p-metergroup-label-list-horizontal": props.labelOrientation === "horizontal"
  }],
  label: "p-metergroup-label",
  labelIcon: "p-metergroup-label-icon",
  labelMarker: "p-metergroup-label-marker",
  labelText: "p-metergroup-label-text"
};
var MeterGroupStyle = class _MeterGroupStyle extends BaseStyle {
  name = "metergroup";
  theme = theme;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMeterGroupStyle_BaseFactory;
    return function MeterGroupStyle_Factory(__ngFactoryType__) {
      return (ɵMeterGroupStyle_BaseFactory || (ɵMeterGroupStyle_BaseFactory = ɵɵgetInheritedFactory(_MeterGroupStyle)))(__ngFactoryType__ || _MeterGroupStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _MeterGroupStyle,
    factory: _MeterGroupStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroupStyle, [{
    type: Injectable
  }], null, null);
})();
var MeterGroupClasses;
(function(MeterGroupClasses2) {
  MeterGroupClasses2["root"] = "p-metergroup";
  MeterGroupClasses2["meters"] = "p-metergroup-meters";
  MeterGroupClasses2["meter"] = "p-metergroup-meter";
  MeterGroupClasses2["labelList"] = "p-metergroup-label-list";
  MeterGroupClasses2["label"] = "p-metergroup-label";
  MeterGroupClasses2["labelIcon"] = "p-metergroup-label-icon";
  MeterGroupClasses2["labelMarker"] = "p-metergroup-label-marker";
  MeterGroupClasses2["labelText"] = "p-metergroup-label-text";
})(MeterGroupClasses || (MeterGroupClasses = {}));
var MeterGroupLabel = class _MeterGroupLabel {
  value = null;
  labelPosition = "end";
  labelOrientation = "horizontal";
  min;
  max;
  iconTemplate;
  get labelClass() {
    return {
      "p-metergroup-label-list p-component": true,
      "p-metergroup-label-list-vertical": this.labelOrientation === "vertical",
      "p-metergroup-label-list-horizontal": this.labelOrientation === "horizontal"
    };
  }
  parentInstance = inject(forwardRef(() => MeterGroup));
  static ɵfac = function MeterGroupLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MeterGroupLabel)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MeterGroupLabel,
    selectors: [["p-meterGroupLabel"], ["p-metergrouplabel"]],
    inputs: {
      value: "value",
      labelPosition: "labelPosition",
      labelOrientation: "labelOrientation",
      min: "min",
      max: "max",
      iconTemplate: "iconTemplate"
    },
    decls: 2,
    vars: 3,
    consts: [[3, "ngClass"], ["class", "p-metergroup-label", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "p-metergroup-label"], [4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "p-metergroup-label-text"], [3, "class", "ngClass", "ngStyle", 4, "ngIf"], ["class", "p-metergroup-label-marker", 3, "ngStyle", 4, "ngIf"], [3, "ngClass", "ngStyle"], [1, "p-metergroup-label-marker", 3, "ngStyle"]],
    template: function MeterGroupLabel_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "ol", 0);
        ɵɵtemplate(1, MeterGroupLabel_li_1_Template, 5, 8, "li", 1);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵproperty("ngClass", ctx.labelClass);
        ɵɵadvance();
        ɵɵproperty("ngForOf", ctx.value)("ngForTrackBy", ctx.parentInstance.trackByFn);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, SharedModule],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroupLabel, [{
    type: Component,
    args: [{
      selector: "p-meterGroupLabel, p-metergrouplabel",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <ol [ngClass]="labelClass">
            <li *ngFor="let labelItem of value; let index = index; trackBy: parentInstance.trackByFn" class="p-metergroup-label">
                <ng-container *ngIf="!iconTemplate">
                    <i *ngIf="labelItem.icon" [class]="labelItem.icon" [ngClass]="{ 'p-metergroup-label-icon': true }" [ngStyle]="{ color: labelItem.color }"></i>
                    <span *ngIf="!labelItem.icon" class="p-metergroup-label-marker" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                </ng-container>
                <ng-container *ngTemplateOutlet="iconTemplate; context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                <span class="p-metergroup-label-text">{{ labelItem.label }} ({{ parentInstance.percentValue(labelItem.value) }})</span>
            </li>
        </ol>
    `
    }]
  }], null, {
    value: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    labelOrientation: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    iconTemplate: [{
      type: Input
    }]
  });
})();
var MeterGroup = class _MeterGroup extends BaseComponent {
  /**
   * Current value of the metergroup.
   * @group Props
   */
  value;
  /**
   * Mininum boundary value.
   * @group Props
   */
  min = 0;
  /**
   * Maximum boundary value.
   * @group Props
   */
  max = 100;
  /**
   * Specifies the layout of the component, valid values are 'horizontal' and 'vertical'.
   * @group Props
   */
  orientation = "horizontal";
  /**
   * Specifies the label position of the component, valid values are 'start' and 'end'.
   * @group Props
   */
  labelPosition = "end";
  /**
   * Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'.
   * @group Props
   */
  labelOrientation = "horizontal";
  /**
   * Inline style of the element.
   * @group Props
   */
  style;
  /**
   * Style class of the element.
   * @group Props
   */
  styleClass;
  get vertical() {
    return this.orientation === "vertical";
  }
  get containerClass() {
    return {
      "p-metergroup p-component": true,
      "p-metergroup-horizontal": this.orientation === "horizontal",
      "p-metergroup-vertical": this.orientation === "vertical"
    };
  }
  labelTemplate;
  meterTemplate;
  endTemplate;
  startTemplate;
  iconTemplate;
  templates;
  _labelTemplate;
  _meterTemplate;
  _endTemplate;
  _startTemplate;
  _iconTemplate;
  _componentStyle = inject(MeterGroupStyle);
  container;
  ngAfterViewInit() {
    super.ngAfterViewInit();
    const _container = this.container.nativeElement;
    const height = getOuterHeight(_container);
    this.vertical && (_container.style.height = height + "px");
  }
  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "label":
          this._labelTemplate = item.template;
          break;
        case "meter":
          this._meterTemplate = item.template;
          break;
        case "icon":
          this._iconTemplate = item.template;
          break;
        case "start":
          this._startTemplate = item.template;
          break;
        case "end":
          this._endTemplate = item.template;
          break;
      }
    });
  }
  percent(meter = 0) {
    const percentOfItem = (meter - this.min) / (this.max - this.min) * 100;
    return Math.round(Math.max(0, Math.min(100, percentOfItem)));
  }
  percentValue(meter) {
    return this.percent(meter) + "%";
  }
  meterStyle(val) {
    return {
      backgroundColor: val.color,
      width: this.orientation === "horizontal" && this.percentValue(val.value),
      height: this.orientation === "vertical" && this.percentValue(val.value)
    };
  }
  totalPercent() {
    return this.percent(this.value.reduce((total, val) => total + val.value, 0));
  }
  percentages() {
    let sum = 0;
    const sumsArray = [];
    this.value.forEach((item) => {
      sum += item.value;
      sumsArray.push(sum);
    });
    return sumsArray;
  }
  trackByFn(index) {
    return index;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMeterGroup_BaseFactory;
    return function MeterGroup_Factory(__ngFactoryType__) {
      return (ɵMeterGroup_BaseFactory || (ɵMeterGroup_BaseFactory = ɵɵgetInheritedFactory(_MeterGroup)))(__ngFactoryType__ || _MeterGroup);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _MeterGroup,
    selectors: [["p-meterGroup"], ["p-metergroup"], ["p-meter-group"]],
    contentQueries: function MeterGroup_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c4, 4);
        ɵɵcontentQuery(dirIndex, _c5, 4);
        ɵɵcontentQuery(dirIndex, _c6, 4);
        ɵɵcontentQuery(dirIndex, _c7, 4);
        ɵɵcontentQuery(dirIndex, _c8, 4);
        ɵɵcontentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.labelTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.meterTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.endTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.startTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.iconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function MeterGroup_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c9, 5, ElementRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.container = _t.first);
      }
    },
    inputs: {
      value: "value",
      min: "min",
      max: "max",
      orientation: "orientation",
      labelPosition: "labelPosition",
      labelOrientation: "labelOrientation",
      style: "style",
      styleClass: "styleClass"
    },
    features: [ɵɵProvidersFeature([MeterGroupStyle]), ɵɵInheritDefinitionFeature],
    decls: 8,
    vars: 24,
    consts: [["container", ""], [3, "ngClass", "ngStyle"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "p-metergroup-meters"], [4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "value", "labelPosition", "labelOrientation", "min", "max", "iconTemplate", 4, "ngIf"], [3, "value", "labelPosition", "labelOrientation", "min", "max", "iconTemplate"], [4, "ngIf"], [1, "p-metergroup-meter", 3, "ngStyle"]],
    template: function MeterGroup_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 1, 0);
        ɵɵconditionalCreate(2, MeterGroup_Conditional_2_Template, 2, 7);
        ɵɵtemplate(3, MeterGroup_ng_container_3_Template, 1, 0, "ng-container", 2);
        ɵɵelementStart(4, "div", 3);
        ɵɵtemplate(5, MeterGroup_ng_container_5_Template, 3, 9, "ng-container", 4);
        ɵɵelementEnd();
        ɵɵtemplate(6, MeterGroup_ng_container_6_Template, 1, 0, "ng-container", 2);
        ɵɵconditionalCreate(7, MeterGroup_Conditional_7_Template, 2, 7);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.styleClass);
        ɵɵproperty("ngClass", ctx.containerClass)("ngStyle", ctx.style);
        ɵɵattribute("role", "meter")("aria-valuemin", ctx.min)("aria-valuemax", ctx.max)("aria-valuenow", ctx.totalPercent());
        ɵɵadvance(2);
        ɵɵconditional(ctx.labelPosition === "start" ? 2 : -1);
        ɵɵadvance();
        ɵɵproperty("ngTemplateOutlet", ctx.startTemplate || ctx._startTemplate)("ngTemplateOutletContext", ɵɵpureFunction3(16, _c10, ctx.value, ctx.totalPercent(), ctx.percentages()));
        ɵɵadvance(2);
        ɵɵproperty("ngForOf", ctx.value)("ngForTrackBy", ctx.trackByFn);
        ɵɵadvance();
        ɵɵproperty("ngTemplateOutlet", ctx.endTemplate || ctx._endTemplate)("ngTemplateOutletContext", ɵɵpureFunction3(20, _c10, ctx.value, ctx.totalPercent(), ctx.percentages()));
        ɵɵadvance();
        ɵɵconditional(ctx.labelPosition === "end" ? 7 : -1);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, MeterGroupLabel, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroup, [{
    type: Component,
    args: [{
      selector: "p-meterGroup, p-metergroup, p-meter-group",
      standalone: true,
      imports: [CommonModule, MeterGroupLabel, SharedModule],
      template: `
        <div #container [ngClass]="containerClass" [attr.role]="'meter'" [attr.aria-valuemin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="totalPercent()" [ngStyle]="style" [class]="styleClass">
            @if (labelPosition === 'start') {
                <p-meterGroupLabel *ngIf="!labelTemplate && !_labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate || _iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate || labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
            <ng-container *ngTemplateOutlet="startTemplate || _startTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            <div class="p-metergroup-meters">
                <ng-container *ngFor="let meterItem of value; let index = index; trackBy: trackByFn">
                    <ng-container
                        *ngTemplateOutlet="
                            meterTemplate || _meterTemplate;
                            context: {
                                $implicit: meterItem,
                                index: index,
                                orientation: this.orientation,
                                class: 'p-metergroup-meter',
                                size: percentValue(meterItem.value),
                                totalPercent: totalPercent()
                            }
                        "
                    >
                    </ng-container>
                    <ng-container *ngIf="!meterTemplate && !_meterTemplate && meterItem.value > 0">
                        <span class="p-metergroup-meter" [ngStyle]="meterStyle(meterItem)"></span>
                    </ng-container>
                </ng-container>
            </div>
            <ng-container *ngTemplateOutlet="endTemplate || _endTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            @if (labelPosition === 'end') {
                <p-meterGroupLabel *ngIf="!labelTemplate && !_labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate || _iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate || _labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [MeterGroupStyle]
    }]
  }], null, {
    value: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    orientation: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    labelOrientation: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    labelTemplate: [{
      type: ContentChild,
      args: ["label", {
        descendants: false
      }]
    }],
    meterTemplate: [{
      type: ContentChild,
      args: ["meter", {
        descendants: false
      }]
    }],
    endTemplate: [{
      type: ContentChild,
      args: ["end", {
        descendants: false
      }]
    }],
    startTemplate: [{
      type: ContentChild,
      args: ["start", {
        descendants: false
      }]
    }],
    iconTemplate: [{
      type: ContentChild,
      args: ["icon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }],
    container: [{
      type: ViewChild,
      args: ["container", {
        read: ElementRef
      }]
    }]
  });
})();
var MeterGroupModule = class _MeterGroupModule {
  static ɵfac = function MeterGroupModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MeterGroupModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MeterGroupModule,
    imports: [MeterGroup, SharedModule],
    exports: [MeterGroup, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [MeterGroup, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MeterGroupModule, [{
    type: NgModule,
    args: [{
      imports: [MeterGroup, SharedModule],
      exports: [MeterGroup, SharedModule]
    }]
  }], null, null);
})();
export {
  MeterGroup,
  MeterGroupClasses,
  MeterGroupLabel,
  MeterGroupModule,
  MeterGroupStyle
};
//# sourceMappingURL=primeng_metergroup.js.map
