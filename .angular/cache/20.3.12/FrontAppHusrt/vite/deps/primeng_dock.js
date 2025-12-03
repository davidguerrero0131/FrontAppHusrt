import {
  Tooltip,
  TooltipModule
} from "./chunk-NQOOVLOF.js";
import "./chunk-BB55NINM.js";
import {
  Ripple
} from "./chunk-2RUZBQGH.js";
import "./chunk-GSMZXMC2.js";
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
  find,
  findSingle,
  uuid
} from "./chunk-YRV3S4GF.js";
import "./chunk-3PDMTU54.js";
import {
  resolve
} from "./chunk-IJTOCJYA.js";
import {
  RouterLink,
  RouterModule
} from "./chunk-BWRSBYZN.js";
import "./chunk-35LNNNMD.js";
import "./chunk-IEX6SDMR.js";
import "./chunk-BGBU6GWY.js";
import {
  CommonModule,
  NgClass,
  NgIf,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-7INRATQE.js";
import "./chunk-BV6YITCM.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵviewQuery
} from "./chunk-GB642C24.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-MARUHEWW.js";
import "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-dock.mjs
var _c0 = ["item"];
var _c1 = ["list"];
var _c2 = (a0) => ({
  "p-disabled": a0
});
var _c3 = () => ({
  exact: false
});
var _c4 = (a0) => ({
  $implicit: a0
});
var _forTrack0 = ($index, $item) => $item.label;
function Dock_For_5_li_0_a_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 13);
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext(3).$implicit;
    ɵɵproperty("ngClass", item_r3.icon)("ngStyle", item_r3.iconStyle);
  }
}
function Dock_For_5_li_0_a_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Dock_For_5_li_0_a_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 10);
    ɵɵtemplate(1, Dock_For_5_li_0_a_2_span_1_Template, 1, 2, "span", 11)(2, Dock_For_5_li_0_a_2_ng_container_2_Template, 1, 0, "ng-container", 12);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext(2).$implicit;
    const ctx_r3 = ɵɵnextContext();
    ɵɵproperty("routerLink", item_r3.routerLink)("queryParams", item_r3.queryParams)("ngClass", ɵɵpureFunction1(17, _c2, item_r3.disabled))("routerLinkActiveOptions", item_r3.routerLinkActiveOptions || ɵɵpureFunction0(19, _c3))("target", item_r3.target)("tooltipOptions", item_r3.tooltipOptions)("fragment", item_r3.fragment)("queryParamsHandling", item_r3.queryParamsHandling)("preserveFragment", item_r3.preserveFragment)("skipLocationChange", item_r3.skipLocationChange)("replaceUrl", item_r3.replaceUrl)("state", item_r3.state);
    ɵɵattribute("tabindex", item_r3.disabled || ctx_r3.readonly ? null : item_r3.tabindex ? item_r3.tabindex : "-1")("aria-hidden", true);
    ɵɵadvance();
    ɵɵproperty("ngIf", item_r3.icon && !ctx_r3.itemTemplate && !ctx_r3._itemTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r3.itemTemplate || ctx_r3.itemTemplate)("ngTemplateOutletContext", ɵɵpureFunction1(20, _c4, item_r3));
  }
}
function Dock_For_5_li_0_ng_template_3_span_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 13);
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext(3).$implicit;
    ɵɵproperty("ngClass", item_r3.icon)("ngStyle", item_r3.iconStyle);
  }
}
function Dock_For_5_li_0_ng_template_3_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Dock_For_5_li_0_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 14);
    ɵɵtemplate(1, Dock_For_5_li_0_ng_template_3_span_1_Template, 1, 2, "span", 11)(2, Dock_For_5_li_0_ng_template_3_ng_container_2_Template, 1, 0, "ng-container", 12);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r5 = ɵɵnextContext(2);
    const item_r3 = ctx_r5.$implicit;
    const ɵ$index_7_r5 = ctx_r5.$index;
    const ctx_r3 = ɵɵnextContext();
    ɵɵproperty("tooltipPosition", item_r3.tooltipPosition)("tooltipOptions", item_r3.tooltipOptions)("ngClass", ɵɵpureFunction1(10, _c2, item_r3.disabled))("target", item_r3.target);
    ɵɵattribute("href", item_r3.url || null, ɵɵsanitizeUrl)("tabindex", item_r3.disabled || ɵ$index_7_r5 !== ctx_r3.activeIndex && ctx_r3.readonly ? null : item_r3.tabindex ? item_r3.tabindex : "-1")("aria-hidden", true);
    ɵɵadvance();
    ɵɵproperty("ngIf", item_r3.icon && !ctx_r3.itemTemplate && !ctx_r3._itemTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r3.itemTemplate || ctx_r3._itemTemplate)("ngTemplateOutletContext", ɵɵpureFunction1(12, _c4, item_r3));
  }
}
function Dock_For_5_li_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "li", 7);
    ɵɵlistener("click", function Dock_For_5_li_0_Template_li_click_0_listener($event) {
      ɵɵrestoreView(_r2);
      const item_r3 = ɵɵnextContext().$implicit;
      const ctx_r3 = ɵɵnextContext();
      return ɵɵresetView(ctx_r3.onItemClick($event, item_r3));
    })("mouseenter", function Dock_For_5_li_0_Template_li_mouseenter_0_listener() {
      ɵɵrestoreView(_r2);
      const ɵ$index_7_r5 = ɵɵnextContext().$index;
      const ctx_r3 = ɵɵnextContext();
      return ɵɵresetView(ctx_r3.onItemMouseEnter(ɵ$index_7_r5));
    });
    ɵɵelementStart(1, "div", 8);
    ɵɵtemplate(2, Dock_For_5_li_0_a_2_Template, 3, 22, "a", 9)(3, Dock_For_5_li_0_ng_template_3_Template, 3, 14, "ng-template", null, 1, ɵɵtemplateRefExtractor);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const elseBlock_r7 = ɵɵreference(4);
    const ctx_r5 = ɵɵnextContext();
    const item_r3 = ctx_r5.$implicit;
    const ɵ$index_7_r5 = ctx_r5.$index;
    const ctx_r3 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r3.itemClass(item_r3, ɵ$index_7_r5));
    ɵɵattribute("id", ctx_r3.getItemId(item_r3, ɵ$index_7_r5))("aria-label", item_r3.label)("aria-disabled", ctx_r3.disabled(item_r3))("data-pc-section", "menuitem")("data-p-focused", ctx_r3.isItemActive(ctx_r3.getItemId(item_r3, ɵ$index_7_r5)))("data-p-disabled", ctx_r3.disabled(item_r3) || false);
    ɵɵadvance();
    ɵɵattribute("data-pc-section", "content");
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r3.isClickableRouterLink(item_r3))("ngIfElse", elseBlock_r7);
  }
}
function Dock_For_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Dock_For_5_li_0_Template, 5, 10, "li", 6);
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    ɵɵproperty("ngIf", item_r3.visible !== false);
  }
}
var theme = ({
  dt
}) => `
.p-dock {
    position: absolute;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

.p-dock-list-container {
    display: flex;
    pointer-events: auto;
    background: ${dt("dock.background")};
    border: 1px solid ${dt("dock.border.color")};
    padding: ${dt("dock.padding")};
    border-radius: ${dt("dock.border.radius")};
}

.p-dock-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 0 none;
}

.p-dock-item {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    padding: ${dt("dock.item.padding")};
    border-radius: ${dt("dock.item.border.radius")};
}

.p-dock-item.p-focus {
    box-shadow: ${dt("dock.item.focus.ring.shadow")};
    outline: ${dt("dock.item.focus.ring.width")} ${dt("dock.item.focus.ring.style")} ${dt("dock.item.focus.ring.color")};
    outline-offset: ${dt("dock.item.focus.ring.offset")};
}

.p-dock-item-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: default;
    width: ${dt("dock.item.size")};
    height: ${dt("dock.item.size")};
}

.p-dock-top {
    left: 0;
    top: 0;
    width: 100%;
}

.p-dock-top .p-dock-item {
    transform-origin: center top;
}

.p-dock-bottom {
    left: 0;
    bottom: 0;
    width: 100%;
}

.p-dock-bottom .p-dock-item {
    transform-origin: center bottom;
}

.p-dock-right {
    right: 0;
    top: 0;
    height: 100%;
}

.p-dock-right:dir(rtl) {
    right: auto;
    left: 0;
}

.p-dock-right .p-dock-item {
    transform-origin: center right;
}

.p-dock-right .p-dock-list {
    flex-direction: column;
}

.p-dock-left {
    left: 0;
    top: 0;
    height: 100%;
}

.p-dock-left:dir(rtl) {
    left: auto;
    right: 0;
}

.p-dock-left .p-dock-item {
    transform-origin: center left;
}

.p-dock-left .p-dock-list {
    flex-direction: column;
}

.p-dock-mobile.p-dock-top .p-dock-list-container,
.p-dock-mobile.p-dock-bottom .p-dock-list-container {
    overflow-x: auto;
    width: 100%;
}
.p-dock-mobile.p-dock-top .p-dock-list-container .p-dock-list,
.p-dock-mobile.p-dock-bottom .p-dock-list-container .p-dock-list {
    margin: 0 auto;
}
.p-dock-mobile.p-dock-left .p-dock-list-container,
.p-dock-mobile.p-dock-right .p-dock-list-container {
    overflow-y: auto;
    height: 100%;
}
.p-dock-mobile.p-dock-left .p-dock-list-container .p-dock-list,
.p-dock-mobile.p-dock-right .p-dock-list-container .p-dock-list {
    margin: auto 0;
}
.p-dock-mobile .p-dock-list .p-dock-item {
    transform: none;
    margin: 0;
}
`;
var classes = {
  root: ({
    instance,
    props
  }) => ["p-dock p-component", `p-dock-${props.position}`, {
    "p-dock-mobile": instance.queryMatches
  }],
  listContainer: "p-dock-list-container",
  list: "p-dock-list",
  item: ({
    instance,
    processedItem,
    id
  }) => ["p-dock-item", {
    "p-focus": instance.isItemActive(id),
    "p-disabled": instance.disabled(processedItem)
  }],
  itemContent: "p-dock-item-content",
  itemLink: "p-dock-item-link",
  itemIcon: "p-dock-item-icon"
};
var DockStyle = class _DockStyle extends BaseStyle {
  name = "dock";
  theme = theme;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵDockStyle_BaseFactory;
    return function DockStyle_Factory(__ngFactoryType__) {
      return (ɵDockStyle_BaseFactory || (ɵDockStyle_BaseFactory = ɵɵgetInheritedFactory(_DockStyle)))(__ngFactoryType__ || _DockStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _DockStyle,
    factory: _DockStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DockStyle, [{
    type: Injectable
  }], null, null);
})();
var DockClasses;
(function(DockClasses2) {
  DockClasses2["root"] = "p-dock";
  DockClasses2["listContainer"] = "p-dock-list-container";
  DockClasses2["list"] = "p-dock-list";
  DockClasses2["item"] = "p-dock-item";
  DockClasses2["itemContent"] = "p-dock-item-content";
  DockClasses2["itemLink"] = "p-dock-item-link";
  DockClasses2["itemIcon"] = "p-dock-item-icon";
})(DockClasses || (DockClasses = {}));
var Dock = class _Dock extends BaseComponent {
  cd;
  /**
   * Current id state as a string.
   * @group Props
   */
  id;
  /**
   * Inline style of the element.
   * @group Props
   */
  style;
  /**
   * Class of the element.
   * @group Props
   */
  styleClass;
  /**
   * MenuModel instance to define the action items.
   * @group Props
   */
  model = null;
  /**
   * Position of element.
   * @group Props
   */
  position = "bottom";
  /**
   * Defines a string that labels the input for accessibility.
   * @group Props
   */
  ariaLabel;
  /**
   * Defines a string that labels the dropdown button for accessibility.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * Callback to execute when button is focused.
   * @param {FocusEvent} event - Focus event.
   * @group Emits
   */
  onFocus = new EventEmitter();
  /**
   * Callback to invoke when the component loses focus.
   * @param {FocusEvent} event - Focus event.
   * @group Emits
   */
  onBlur = new EventEmitter();
  listViewChild;
  currentIndex;
  tabindex = 0;
  focused = false;
  focusedOptionIndex = -1;
  _componentStyle = inject(DockStyle);
  get focusedOptionId() {
    return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
  }
  constructor(cd) {
    super();
    this.cd = cd;
    this.currentIndex = -3;
  }
  ngOnInit() {
    super.ngOnInit();
    this.id = this.id || uuid("pn_id_");
  }
  itemTemplate;
  _itemTemplate;
  getItemId(item, index) {
    return item && item?.id ? item.id : `${index}`;
  }
  getItemProp(processedItem, name) {
    return processedItem && processedItem.item ? resolve(processedItem.item[name]) : void 0;
  }
  disabled(item) {
    return typeof item.disabled === "function" ? item.disabled() : item.disabled;
  }
  isItemActive(id) {
    return id === this.focusedOptionIndex;
  }
  onListMouseLeave() {
    this.currentIndex = -3;
    this.cd.markForCheck();
  }
  onItemMouseEnter(index) {
    this.currentIndex = index;
    if (index === 1) {
    }
    this.cd.markForCheck();
  }
  onItemClick(e, item) {
    if (item.command) {
      item.command({
        originalEvent: e,
        item
      });
    }
  }
  onListFocus(event) {
    this.focused = true;
    this.changeFocusedOptionIndex(0);
    this.onFocus.emit(event);
  }
  onListBlur(event) {
    this.focused = false;
    this.focusedOptionIndex = -1;
    this.onBlur.emit(event);
  }
  onListKeyDown(event) {
    switch (event.code) {
      case "ArrowDown": {
        if (this.position === "left" || this.position === "right") this.onArrowDownKey();
        event.preventDefault();
        break;
      }
      case "ArrowUp": {
        if (this.position === "left" || this.position === "right") this.onArrowUpKey();
        event.preventDefault();
        break;
      }
      case "ArrowRight": {
        if (this.position === "top" || this.position === "bottom") this.onArrowDownKey();
        event.preventDefault();
        break;
      }
      case "ArrowLeft": {
        if (this.position === "top" || this.position === "bottom") this.onArrowUpKey();
        event.preventDefault();
        break;
      }
      case "Home": {
        this.onHomeKey();
        event.preventDefault();
        break;
      }
      case "End": {
        this.onEndKey();
        event.preventDefault();
        break;
      }
      case "Enter":
      case "Space": {
        this.onSpaceKey();
        event.preventDefault();
        break;
      }
      default:
        break;
    }
  }
  onArrowDownKey() {
    const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex);
    this.changeFocusedOptionIndex(optionIndex);
  }
  onArrowUpKey() {
    const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex);
    this.changeFocusedOptionIndex(optionIndex);
  }
  onHomeKey() {
    this.changeFocusedOptionIndex(0);
  }
  onEndKey() {
    this.changeFocusedOptionIndex(find(this.listViewChild.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]').length - 1);
  }
  onSpaceKey() {
    const element = findSingle(this.listViewChild.nativeElement, `li[id="${`${this.focusedOptionIndex}`}"]`);
    const anchorElement = element && findSingle(element, '[data-pc-section="action"]');
    anchorElement ? anchorElement.click() : element && element.click();
  }
  findNextOptionIndex(index) {
    const menuitems = find(this.listViewChild.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]');
    const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);
    return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
  }
  changeFocusedOptionIndex(index) {
    const menuitems = find(this.listViewChild.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]');
    let order = index >= menuitems.length ? menuitems.length - 1 : index < 0 ? 0 : index;
    this.focusedOptionIndex = menuitems[order].getAttribute("id");
  }
  findPrevOptionIndex(index) {
    const menuitems = find(this.listViewChild.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]');
    const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);
    return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
  }
  get containerClass() {
    return {
      [`p-dock p-component  p-dock-${this.position}`]: true
    };
  }
  isClickableRouterLink(item) {
    return item.routerLink && !item.disabled;
  }
  itemClass(item, index) {
    return {
      "p-dock-item": true,
      "p-focus": this.isItemActive(this.getItemId(item, index)),
      "p-disabled": this.disabled(item)
    };
  }
  templates;
  ngAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "item":
          this._itemTemplate = item.template;
          break;
        default:
          this._itemTemplate = item.template;
          break;
      }
    });
  }
  static ɵfac = function Dock_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Dock)(ɵɵdirectiveInject(ChangeDetectorRef));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Dock,
    selectors: [["p-dock"]],
    contentQueries: function Dock_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c0, 5);
        ɵɵcontentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.itemTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function Dock_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c1, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.listViewChild = _t.first);
      }
    },
    inputs: {
      id: "id",
      style: "style",
      styleClass: "styleClass",
      model: "model",
      position: "position",
      ariaLabel: "ariaLabel",
      ariaLabelledBy: "ariaLabelledBy"
    },
    outputs: {
      onFocus: "onFocus",
      onBlur: "onBlur"
    },
    features: [ɵɵProvidersFeature([DockStyle]), ɵɵInheritDefinitionFeature],
    decls: 6,
    vars: 12,
    consts: [["list", ""], ["elseBlock", ""], [3, "ngClass", "ngStyle"], [1, "p-dock-list-container"], ["role", "menu", 1, "p-dock-list", 3, "focus", "blur", "keydown", "mouseleave", "tabindex"], ["role", "menuitem", 3, "ngClass"], ["role", "menuitem", 3, "ngClass", "click", "mouseenter", 4, "ngIf"], ["role", "menuitem", 3, "click", "mouseenter", "ngClass"], [1, "p-dock-item-content"], ["pRipple", "", "class", "p-dock-item-link", "pTooltip", "", 3, "routerLink", "queryParams", "ngClass", "routerLinkActiveOptions", "target", "tooltipOptions", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", 4, "ngIf", "ngIfElse"], ["pRipple", "", "pTooltip", "", 1, "p-dock-item-link", 3, "routerLink", "queryParams", "ngClass", "routerLinkActiveOptions", "target", "tooltipOptions", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state"], ["class", "p-dock-item-icon", 3, "ngClass", "ngStyle", 4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "p-dock-item-icon", 3, "ngClass", "ngStyle"], ["pRipple", "", "pTooltip", "", 1, "p-dock-item-link", 3, "tooltipPosition", "tooltipOptions", "ngClass", "target"]],
    template: function Dock_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "ul", 4, 0);
        ɵɵlistener("focus", function Dock_Template_ul_focus_2_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onListFocus($event));
        })("blur", function Dock_Template_ul_blur_2_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onListBlur($event));
        })("keydown", function Dock_Template_ul_keydown_2_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onListKeyDown($event));
        })("mouseleave", function Dock_Template_ul_mouseleave_2_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onListMouseLeave());
        });
        ɵɵrepeaterCreate(4, Dock_For_5_Template, 1, 1, "li", 5, _forTrack0);
        ɵɵelementEnd()()();
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.styleClass);
        ɵɵproperty("ngClass", ctx.containerClass)("ngStyle", ctx.style);
        ɵɵattribute("data-pc-name", "dock");
        ɵɵadvance(2);
        ɵɵproperty("tabindex", ctx.tabindex);
        ɵɵattribute("id", ctx.id)("aria-orientation", ctx.position === "bottom" || ctx.position === "top" ? "horizontal" : "vertical")("aria-activedescendant", ctx.focused ? ctx.focusedOptionId : void 0)("aria-label", ctx.ariaLabel)("aria-labelledby", ctx.ariaLabelledBy)("data-pc-section", "menu");
        ɵɵadvance(2);
        ɵɵrepeater(ctx.model);
      }
    },
    dependencies: [CommonModule, NgClass, NgIf, NgTemplateOutlet, NgStyle, RouterModule, RouterLink, Ripple, TooltipModule, Tooltip, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Dock, [{
    type: Component,
    args: [{
      selector: "p-dock",
      standalone: true,
      imports: [CommonModule, RouterModule, Ripple, TooltipModule, SharedModule],
      template: `
        <div [ngClass]="containerClass" [ngStyle]="style" [class]="styleClass" [attr.data-pc-name]="'dock'">
            <div class="p-dock-list-container">
                <ul
                    #list
                    [attr.id]="id"
                    class="p-dock-list"
                    role="menu"
                    [attr.aria-orientation]="position === 'bottom' || position === 'top' ? 'horizontal' : 'vertical'"
                    [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                    [tabindex]="tabindex"
                    [attr.aria-label]="ariaLabel"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    [attr.data-pc-section]="'menu'"
                    (focus)="onListFocus($event)"
                    (blur)="onListBlur($event)"
                    (keydown)="onListKeyDown($event)"
                    (mouseleave)="onListMouseLeave()"
                >
                    @for (item of model; track item.label; let i = $index) {
                        <li
                            *ngIf="item.visible !== false"
                            [attr.id]="getItemId(item, i)"
                            [ngClass]="itemClass(item, i)"
                            role="menuitem"
                            [attr.aria-label]="item.label"
                            [attr.aria-disabled]="disabled(item)"
                            (click)="onItemClick($event, item)"
                            (mouseenter)="onItemMouseEnter(i)"
                            [attr.data-pc-section]="'menuitem'"
                            [attr.data-p-focused]="isItemActive(getItemId(item, i))"
                            [attr.data-p-disabled]="disabled(item) || false"
                        >
                            <div class="p-dock-item-content" [attr.data-pc-section]="'content'">
                                <a
                                    *ngIf="isClickableRouterLink(item); else elseBlock"
                                    pRipple
                                    [routerLink]="item.routerLink"
                                    [queryParams]="item.queryParams"
                                    [ngClass]="{ 'p-disabled': item.disabled }"
                                    class="p-dock-item-link"
                                    [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                    [target]="item.target"
                                    [attr.tabindex]="item.disabled || readonly ? null : item.tabindex ? item.tabindex : '-1'"
                                    pTooltip
                                    [tooltipOptions]="item.tooltipOptions"
                                    [fragment]="item.fragment"
                                    [queryParamsHandling]="item.queryParamsHandling"
                                    [preserveFragment]="item.preserveFragment"
                                    [skipLocationChange]="item.skipLocationChange"
                                    [replaceUrl]="item.replaceUrl"
                                    [state]="item.state"
                                    [attr.aria-hidden]="true"
                                >
                                    <span class="p-dock-item-icon" *ngIf="item.icon && !itemTemplate && !_itemTemplate" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                    <ng-container *ngTemplateOutlet="itemTemplate || itemTemplate; context: { $implicit: item }"></ng-container>
                                </a>
                                <ng-template #elseBlock>
                                    <a
                                        [tooltipPosition]="item.tooltipPosition"
                                        [attr.href]="item.url || null"
                                        class="p-dock-item-link"
                                        pRipple
                                        pTooltip
                                        [tooltipOptions]="item.tooltipOptions"
                                        [ngClass]="{ 'p-disabled': item.disabled }"
                                        [target]="item.target"
                                        [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) ? null : item.tabindex ? item.tabindex : '-1'"
                                        [attr.aria-hidden]="true"
                                    >
                                        <span class="p-dock-item-icon" *ngIf="item.icon && !itemTemplate && !_itemTemplate" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                        <ng-container *ngTemplateOutlet="itemTemplate || _itemTemplate; context: { $implicit: item }"></ng-container>
                                    </a>
                                </ng-template>
                            </div>
                        </li>
                    }
                </ul>
            </div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [DockStyle]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }], {
    id: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    model: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    onFocus: [{
      type: Output
    }],
    onBlur: [{
      type: Output
    }],
    listViewChild: [{
      type: ViewChild,
      args: ["list", {
        static: false
      }]
    }],
    itemTemplate: [{
      type: ContentChild,
      args: ["item"]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var DockModule = class _DockModule {
  static ɵfac = function DockModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DockModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _DockModule,
    imports: [Dock, SharedModule],
    exports: [Dock, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Dock, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DockModule, [{
    type: NgModule,
    args: [{
      imports: [Dock, SharedModule],
      exports: [Dock, SharedModule]
    }]
  }], null, null);
})();
export {
  Dock,
  DockClasses,
  DockModule,
  DockStyle
};
//# sourceMappingURL=primeng_dock.js.map
