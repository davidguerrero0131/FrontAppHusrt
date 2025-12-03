import {
  Tree
} from "./chunk-3BGSWKHW.js";
import "./chunk-NNYTFYFY.js";
import "./chunk-LF22RSKT.js";
import "./chunk-MZV5GJV5.js";
import "./chunk-LCEOM66K.js";
import "./chunk-33NFVBDZ.js";
import {
  Chip
} from "./chunk-VTWPCMGN.js";
import {
  Overlay
} from "./chunk-RM6F4FZH.js";
import "./chunk-BB55NINM.js";
import "./chunk-2RUZBQGH.js";
import {
  ChevronDownIcon,
  TimesIcon
} from "./chunk-OY3KVTOZ.js";
import {
  AutoFocus
} from "./chunk-HB6G4A2R.js";
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
  focus,
  getFirstFocusableElement,
  getFocusableElements,
  getLastFocusableElement,
  hasClass,
  uuid
} from "./chunk-YRV3S4GF.js";
import "./chunk-RGQTO6DJ.js";
import "./chunk-3PDMTU54.js";
import {
  isNotEmpty
} from "./chunk-IJTOCJYA.js";
import "./chunk-2QNDQZDD.js";
import {
  NG_VALUE_ACCESSOR
} from "./chunk-7S4MDC7Q.js";
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
  EventEmitter,
  Injectable,
  Input,
  NgModule,
  Output,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
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
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-GB642C24.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-MARUHEWW.js";
import {
  __spreadValues
} from "./chunk-4MWRP73S.js";

// node_modules/primeng/fesm2022/primeng-treeselect.mjs
var _c0 = ["value"];
var _c1 = ["header"];
var _c2 = ["empty"];
var _c3 = ["footer"];
var _c4 = ["clearicon"];
var _c5 = ["triggericon"];
var _c6 = ["dropdownicon"];
var _c7 = ["filtericon"];
var _c8 = ["closeicon"];
var _c9 = ["itemtogglericon"];
var _c10 = ["itemcheckboxicon"];
var _c11 = ["itemloadingicon"];
var _c12 = ["container"];
var _c13 = ["focusInput"];
var _c14 = ["filter"];
var _c15 = ["tree"];
var _c16 = ["panel"];
var _c17 = ["overlay"];
var _c18 = ["firstHiddenFocusableEl"];
var _c19 = ["lastHiddenFocusableEl"];
var _c20 = (a0, a1) => ({
  $implicit: a0,
  placeholder: a1
});
var _c21 = (a0, a1) => ({
  $implicit: a0,
  options: a1
});
var _c22 = (a0) => ({
  "max-height": a0
});
var _c23 = (a0) => ({
  $implicit: a0
});
var _c24 = (a0, a1) => ({
  $implicit: a0,
  partialSelected: a1
});
function TreeSelect_ng_container_7_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TreeSelect_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TreeSelect_ng_container_7_ng_container_1_Template, 1, 0, "ng-container", 25);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.valueTemplate || ctx_r1._valueTemplate)("ngTemplateOutletContext", ɵɵpureFunction2(2, _c20, ctx_r1.value, ctx_r1.placeholder));
  }
}
function TreeSelect_ng_template_8_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r1.label || "empty", " ");
  }
}
function TreeSelect_ng_template_8_ng_template_1_div_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 27);
    ɵɵelement(1, "p-chip", 28);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const node_r3 = ctx.$implicit;
    ɵɵadvance();
    ɵɵproperty("label", node_r3.label);
  }
}
function TreeSelect_ng_template_8_ng_template_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.placeholder || "empty");
  }
}
function TreeSelect_ng_template_8_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_8_ng_template_1_div_0_Template, 2, 1, "div", 26)(1, TreeSelect_ng_template_8_ng_template_1_ng_container_1_Template, 2, 1, "ng-container", 20);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngForOf", ctx_r1.value);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.emptyValue);
  }
}
function TreeSelect_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_8_ng_container_0_Template, 2, 1, "ng-container", 19)(1, TreeSelect_ng_template_8_ng_template_1_Template, 2, 2, "ng-template", null, 5, ɵɵtemplateRefExtractor);
  }
  if (rf & 2) {
    const chipsValueTemplate_r4 = ɵɵreference(2);
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngIf", ctx_r1.display === "comma")("ngIfElse", chipsValueTemplate_r4);
  }
}
function TreeSelect_ng_container_10_TimesIcon_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "TimesIcon", 31);
    ɵɵlistener("click", function TreeSelect_ng_container_10_TimesIcon_1_Template_TimesIcon_click_0_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.clear($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    ɵɵclassMap("p-treeselect-clear-icon");
  }
}
function TreeSelect_ng_container_10_span_2_1_ng_template_0_Template(rf, ctx) {
}
function TreeSelect_ng_container_10_span_2_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_container_10_span_2_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function TreeSelect_ng_container_10_span_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "span", 32);
    ɵɵlistener("click", function TreeSelect_ng_container_10_span_2_Template_span_click_0_listener($event) {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.clear($event));
    });
    ɵɵtemplate(1, TreeSelect_ng_container_10_span_2_1_Template, 1, 0, null, 33);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.clearIconTemplate || ctx_r1._clearIconTemplate);
  }
}
function TreeSelect_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TreeSelect_ng_container_10_TimesIcon_1_Template, 1, 2, "TimesIcon", 29)(2, TreeSelect_ng_container_10_span_2_Template, 2, 1, "span", 30);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.clearIconTemplate && !ctx_r1._clearIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.clearIconTemplate || ctx_r1.clearIconTemplate);
  }
}
function TreeSelect_ChevronDownIcon_12_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "ChevronDownIcon", 34);
  }
  if (rf & 2) {
    ɵɵproperty("styleClass", "p-treeselect-dropdown-icon");
  }
}
function TreeSelect_span_13_1_ng_template_0_Template(rf, ctx) {
}
function TreeSelect_span_13_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_span_13_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function TreeSelect_span_13_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 35);
    ɵɵtemplate(1, TreeSelect_span_13_1_Template, 1, 0, null, 33);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.triggerIconTemplate || ctx_r1._triggerIconTemplate || ctx_r1.dropdownIconTemplate || ctx_r1._dropdownIconTemplate);
  }
}
function TreeSelect_ng_template_16_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TreeSelect_ng_template_16_ng_container_8_ng_template_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TreeSelect_ng_template_16_ng_container_8_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_16_ng_container_8_ng_template_1_ng_container_0_Template, 1, 0, "ng-container", 33);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵproperty("ngTemplateOutlet", ctx_r1.emptyTemplate || ctx_r1._emptyTemplate);
  }
}
function TreeSelect_ng_template_16_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TreeSelect_ng_template_16_ng_container_8_ng_template_1_Template, 1, 1, "ng-template", null, 10, ɵɵtemplateRefExtractor);
    ɵɵelementContainerEnd();
  }
}
function TreeSelect_ng_template_16_9_ng_template_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TreeSelect_ng_template_16_9_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_16_9_ng_template_0_ng_container_0_Template, 1, 0, "ng-container", 25);
  }
  if (rf & 2) {
    const expanded_r8 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵproperty("ngTemplateOutlet", ctx_r1.itemTogglerIconTemplate || ctx_r1._itemTogglerIconTemplate)("ngTemplateOutletContext", ɵɵpureFunction1(2, _c23, expanded_r8));
  }
}
function TreeSelect_ng_template_16_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_16_9_ng_template_0_Template, 1, 4, "ng-template", null, 11, ɵɵtemplateRefExtractor);
  }
}
function TreeSelect_ng_template_16_10_ng_template_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TreeSelect_ng_template_16_10_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_16_10_ng_template_0_ng_container_0_Template, 1, 0, "ng-container", 25);
  }
  if (rf & 2) {
    const selected_r9 = ctx.$implicit;
    const partialSelected_r10 = ctx.partialSelected;
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵproperty("ngTemplateOutlet", ctx_r1.itemCheckboxIconTemplate || ctx_r1._itemCheckboxIconTemplate)("ngTemplateOutletContext", ɵɵpureFunction2(2, _c24, selected_r9, partialSelected_r10));
  }
}
function TreeSelect_ng_template_16_10_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_16_10_ng_template_0_Template, 1, 5, "ng-template", null, 12, ɵɵtemplateRefExtractor);
  }
}
function TreeSelect_ng_template_16_11_ng_template_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TreeSelect_ng_template_16_11_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_16_11_ng_template_0_ng_container_0_Template, 1, 0, "ng-container", 33);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵproperty("ngTemplateOutlet", ctx_r1.itemLoadingIconTemplate || ctx_r1._itemLoadingIconTemplate);
  }
}
function TreeSelect_ng_template_16_11_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TreeSelect_ng_template_16_11_ng_template_0_Template, 1, 1, "ng-template", null, 13, ɵɵtemplateRefExtractor);
  }
}
function TreeSelect_ng_template_16_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TreeSelect_ng_template_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 36, 6)(2, "span", 37, 7);
    ɵɵlistener("focus", function TreeSelect_ng_template_16_Template_span_focus_2_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onFirstHiddenFocus($event));
    });
    ɵɵelementEnd();
    ɵɵtemplate(4, TreeSelect_ng_template_16_ng_container_4_Template, 1, 0, "ng-container", 25);
    ɵɵelementStart(5, "div", 38)(6, "p-tree", 39, 8);
    ɵɵlistener("selectionChange", function TreeSelect_ng_template_16_Template_p_tree_selectionChange_6_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onSelectionChange($event));
    })("onNodeExpand", function TreeSelect_ng_template_16_Template_p_tree_onNodeExpand_6_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.nodeExpand($event));
    })("onNodeCollapse", function TreeSelect_ng_template_16_Template_p_tree_onNodeCollapse_6_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.nodeCollapse($event));
    })("onNodeSelect", function TreeSelect_ng_template_16_Template_p_tree_onNodeSelect_6_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onSelect($event));
    })("onNodeUnselect", function TreeSelect_ng_template_16_Template_p_tree_onNodeUnselect_6_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onUnselect($event));
    });
    ɵɵtemplate(8, TreeSelect_ng_template_16_ng_container_8_Template, 3, 0, "ng-container", 20)(9, TreeSelect_ng_template_16_9_Template, 2, 0, null, 20)(10, TreeSelect_ng_template_16_10_Template, 2, 0, null, 20)(11, TreeSelect_ng_template_16_11_Template, 2, 0, null, 20);
    ɵɵelementEnd()();
    ɵɵtemplate(12, TreeSelect_ng_template_16_ng_container_12_Template, 1, 0, "ng-container", 25);
    ɵɵelementStart(13, "span", 37, 9);
    ɵɵlistener("focus", function TreeSelect_ng_template_16_Template_span_focus_13_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onLastHiddenFocus($event));
    });
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassMap(ctx_r1.panelStyleClass);
    ɵɵproperty("ngStyle", ctx_r1.panelStyle)("ngClass", ctx_r1.panelClass);
    ɵɵattribute("id", ctx_r1.listId);
    ɵɵadvance(2);
    ɵɵattribute("tabindex", 0)("data-p-hidden-accessible", true)("data-p-hidden-focusable", true);
    ɵɵadvance(2);
    ɵɵproperty("ngTemplateOutlet", ctx_r1.headerTemplate || ctx_r1._headerTemplate)("ngTemplateOutletContext", ɵɵpureFunction2(39, _c21, ctx_r1.value, ctx_r1.options));
    ɵɵadvance();
    ɵɵproperty("ngStyle", ɵɵpureFunction1(42, _c22, ctx_r1.scrollHeight));
    ɵɵadvance();
    ɵɵproperty("value", ctx_r1.options)("propagateSelectionDown", ctx_r1.propagateSelectionDown)("propagateSelectionUp", ctx_r1.propagateSelectionUp)("selectionMode", ctx_r1.selectionMode)("selection", ctx_r1.value)("metaKeySelection", ctx_r1.metaKeySelection)("emptyMessage", ctx_r1.emptyMessage)("filter", ctx_r1.filter)("filterBy", ctx_r1.filterBy)("filterMode", ctx_r1.filterMode)("filterPlaceholder", ctx_r1.filterPlaceholder)("filterLocale", ctx_r1.filterLocale)("filteredNodes", ctx_r1.filteredNodes)("virtualScroll", ctx_r1.virtualScroll)("virtualScrollItemSize", ctx_r1.virtualScrollItemSize)("virtualScrollOptions", ctx_r1.virtualScrollOptions)("_templateMap", ctx_r1.templateMap)("loading", ctx_r1.loading)("filterInputAutoFocus", ctx_r1.filterInputAutoFocus);
    ɵɵadvance(2);
    ɵɵproperty("ngIf", ctx_r1.emptyTemplate || ctx_r1._emptyTemplate);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.itemTogglerIconTemplate || ctx_r1._itemTogglerIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.itemCheckboxIconTemplate || ctx_r1._itemCheckboxIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.itemLoadingIconTemplate || ctx_r1._itemLoadingIconTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.footerTemplate)("ngTemplateOutletContext", ɵɵpureFunction2(44, _c21, ctx_r1.value, ctx_r1.options));
    ɵɵadvance();
    ɵɵattribute("tabindex", 0)("data-p-hidden-accessible", true)("data-p-hidden-focusable", true);
  }
}
var theme = ({
  dt
}) => `
.p-treeselect {
    display: inline-flex;
    cursor: pointer;
    position: relative;
    user-select: none;
    background: ${dt("treeselect.background")};
    border: 1px solid ${dt("treeselect.border.color")};
    transition: background ${dt("treeselect.transition.duration")}, color ${dt("treeselect.transition.duration")}, border-color ${dt("treeselect.transition.duration")}, outline-color ${dt("treeselect.transition.duration")}, box-shadow ${dt("treeselect.transition.duration")};
    border-radius: ${dt("treeselect.border.radius")};
    outline-color: transparent;
    box-shadow: ${dt("treeselect.shadow")};
}

p-treeSelect.ng-invalid.ng-dirty .p-treeselect,
p-tree-select.ng-invalid.ng-dirty .p-treeselect,
p-treeselect.ng-invalid.ng-dirty .p-treeselect {
    border-color: ${dt("treeselect.invalid.border.color")};
}

p-treeSelect.ng-invalid.ng-dirty .p-treeselect.p-focus,
p-tree-select.ng-invalid.ng-dirty .p-treeselect.p-focus,
p-treeselect.ng-invalid.ng-dirty .p-treeselect.p-focus {
    border-color: ${dt("treeselect.focus.border.color")};
}

.p-treeselect:not(.p-disabled):hover {
    border-color: ${dt("treeselect.hover.border.color")};
}

.p-treeselect:not(.p-disabled).p-focus {
    border-color: ${dt("treeselect.focus.border.color")};
    box-shadow: ${dt("treeselect.focus.ring.shadow")};
    outline: ${dt("treeselect.focus.ring.width")} ${dt("treeselect.focus.ring.style")} ${dt("treeselect.focus.ring.color")};
    outline-offset: ${dt("treeselect.focus.ring.offset")};
}

.p-treeselect.p-variant-filled {
    background: ${dt("treeselect.filled.background")};
}

.p-treeselect.p-variant-filled:not(.p-disabled):hover {
    background: ${dt("treeselect.filled.hover.background")};
}

.p-treeselect.p-variant-filled.p-focus {
    background: ${dt("treeselect.filled.focus.background")};
}

.p-treeselect.p-disabled {
    opacity: 1;
    background: ${dt("treeselect.disabled.background")};
}

.p-treeselect-dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: transparent;
    color: ${dt("treeselect.dropdown.color")};
    width: ${dt("treeselect.dropdown.width")};
    border-start-end-radius: ${dt("border.radius.md")};
    border-end-end-radius: ${dt("border.radius.md")};
}

.p-treeselect-label-container {
    overflow: hidden;
    flex: 1 1 auto;
    cursor: pointer;
}

.p-treeselect-label {
    display: flex;
    align-items-center;
    gap: calc(${dt("treeselect.padding.y")} / 2);
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: ${dt("treeselect.padding.y")} ${dt("treeselect.padding.x")};
    color: ${dt("treeselect.color")};
}

.p-treeselect-label.p-placeholder {
    color: ${dt("treeselect.placeholder.color")};
}

p-treeselect.ng-invalid.ng-dirty .p-treeselect-label.p-placeholder {
    color: ${dt("treeselect.invalid.placeholder.color")};
}

.p-treeselect.p-disabled .p-treeselect-label {
    color: ${dt("treeselect.disabled.color")};
}

.p-treeselect-label-empty {
    overflow: hidden;
    visibility: hidden;
}

.p-treeselect .p-treeselect-overlay {
    min-width: 100%;
}

.p-treeselect-overlay {
    background: ${dt("treeselect.overlay.background")};
    color: ${dt("treeselect.overlay.color")};
    border: 1px solid ${dt("treeselect.overlay.border.color")};
    border-radius: ${dt("treeselect.overlay.border.radius")};
    box-shadow: ${dt("treeselect.overlay.shadow")};
    overflow: hidden;
}


.p-treeselect-tree-container {
    overflow: auto;
}

.p-treeselect-empty-message {
    padding: ${dt("treeselect.empty.message.padding")};
    background: transparent;
}

.p-treeselect-fluid {
    display: flex;
}

.p-treeselect-overlay .p-tree {
    padding: ${dt("treeselect.tree.padding")};
}

.p-treeselect-label .p-chip {
    padding-top: calc(${dt("treeselect.padding.y")} / 2);
    padding-bottom: calc(${dt("treeselect.padding.y")} / 2);
    border-radius: ${dt("treeselect.chip.border.radius")};
}

.p-treeselect-label:has(.p-chip) {
    padding: calc(${dt("treeselect.padding.y")} / 2) calc(${dt("treeselect.padding.x")} / 2);
}

.p-treeselect-sm .p-treeselect-label {
    font-size: ${dt("treeselect.sm.font.size")};
    padding-block: ${dt("treeselect.sm.padding.y")};
    padding-inline: ${dt("treeselect.sm.padding.x")};
}

.p-treeselect-sm .p-treeselect-dropdown .p-icon {
    font-size: ${dt("treeselect.sm.font.size")};
    width: ${dt("treeselect.sm.font.size")};
    height: ${dt("treeselect.sm.font.size")};
}

.p-treeselect-lg .p-treeselect-label {
    font-size: ${dt("treeselect.lg.font.size")};
    padding-block: ${dt("treeselect.lg.padding.y")};
    padding-inline: ${dt("treeselect.lg.padding.x")};
}

.p-treeselect-lg .p-treeselect-dropdown .p-icon {
    font-size: ${dt("treeselect.lg.font.size")};
    width: ${dt("treeselect.lg.font.size")};
    height: ${dt("treeselect.lg.font.size")};
}

.p-treeselect-clear-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: transparent;
    color: ${dt("treeselect.clear.icon.color")};
}`;
var inlineStyles = {
  root: ({
    instance
  }) => ({
    position: instance.appendTo === "self" ? "relative" : void 0
  })
};
var classes = {
  root: ({
    instance
  }) => ({
    "p-treeselect p-component p-inputwrapper": true,
    "p-treeselect-display-chip": instance.display === "chip",
    "p-disabled": instance.disabled,
    "p-invalid": instance.invalid,
    "p-focus": instance.focused,
    "p-variant-filled": instance.variant === "filled" || instance.config.inputVariant() === "filled" || instance.config.inputStyle() === "filled",
    "p-inputwrapper-filled": !instance.emptyValue,
    "p-inputwrapper-focus": instance.focused || instance.overlayVisible,
    "p-treeselect-open": instance.overlayVisible,
    "p-treeselect-clearable": instance.showClear,
    "p-treeselect-fluid": instance.hasFluid,
    "p-treeselect-sm p-inputfield-sm": instance.size === "small",
    "p-treeselect-lg p-inputfield-lg": instance.size === "large"
  }),
  labelContainer: "p-treeselect-label-container",
  label: ({
    instance
  }) => ({
    "p-treeselect-label": true,
    "p-placeholder": instance.label === instance.placeholder,
    "p-treeselect-label-empty": !instance.placeholder && instance.emptyValue
  }),
  chip: "p-treeselect-chip-item",
  pcChip: "p-treeselect-chip",
  dropdown: "p-treeselect-dropdown",
  dropdownIcon: "p-treeselect-dropdown-icon",
  panel: "p-treeselect-overlay p-component",
  treeContainer: "p-treeselect-tree-container",
  emptyMessage: "p-treeselect-empty-message"
};
var TreeSelectStyle = class _TreeSelectStyle extends BaseStyle {
  name = "treeselect";
  theme = theme;
  classes = classes;
  inlineStyles = inlineStyles;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵTreeSelectStyle_BaseFactory;
    return function TreeSelectStyle_Factory(__ngFactoryType__) {
      return (ɵTreeSelectStyle_BaseFactory || (ɵTreeSelectStyle_BaseFactory = ɵɵgetInheritedFactory(_TreeSelectStyle)))(__ngFactoryType__ || _TreeSelectStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _TreeSelectStyle,
    factory: _TreeSelectStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TreeSelectStyle, [{
    type: Injectable
  }], null, null);
})();
var TreeSelectClasses;
(function(TreeSelectClasses2) {
  TreeSelectClasses2["root"] = "p-treeselect";
  TreeSelectClasses2["labelContainer"] = "p-treeselect-label-container";
  TreeSelectClasses2["label"] = "p-treeselect-label";
  TreeSelectClasses2["chipItem"] = "p-treeselect-chip-item";
  TreeSelectClasses2["pcChip"] = "p-treeselect-chip";
  TreeSelectClasses2["dropdown"] = "p-treeselect-dropdown";
  TreeSelectClasses2["dropdownIcon"] = "p-treeselect-dropdown-icon";
  TreeSelectClasses2["panel"] = "p-treeselect-overlay";
  TreeSelectClasses2["treeContainer"] = "p-treeselect-tree-container";
  TreeSelectClasses2["emptyMessage"] = "p-treeselect-empty-message";
})(TreeSelectClasses || (TreeSelectClasses = {}));
var TREESELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TreeSelect),
  multi: true
};
var TreeSelect = class _TreeSelect extends BaseComponent {
  /**
   * Identifier of the underlying input element.
   * @group Props
   */
  inputId;
  /**
   * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
   * @group Props
   */
  scrollHeight = "400px";
  /**
   * When present, it specifies that the component should be disabled.
   * @group Props
   */
  disabled;
  /**
   * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
   * @group Props
   */
  metaKeySelection = false;
  /**
   * Specifies the input variant of the component.
   * @group Props
   */
  variant;
  /**
   * Defines how the selected items are displayed.
   * @group Props
   */
  display = "comma";
  /**
   * Defines the selection mode.
   * @group Props
   */
  selectionMode = "single";
  /**
   * Index of the element in tabbing order.
   * @group Props
   */
  tabindex = "0";
  /**
   * Defines a string that labels the input for accessibility.
   * @group Props
   */
  ariaLabel;
  /**
   * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * Label to display when there are no selections.
   * @group Props
   */
  placeholder;
  /**
   * Style class of the overlay panel.
   * @group Props
   */
  panelClass;
  /**
   * Inline style of the panel element.
   * @group Props
   */
  panelStyle;
  /**
   * Spans 100% width of the container when enabled.
   * @group Props
   */
  fluid = false;
  /**
   * Style class of the panel element.
   * @group Props
   */
  panelStyleClass;
  /**
   * Inline style of the container element.
   * @group Props
   */
  set containerStyle(val) {
    const _rootStyle = this._componentStyle.inlineStyles.root({
      instance: this
    });
    this._containerStyle = __spreadValues(__spreadValues({}, _rootStyle), val);
  }
  get containerStyle() {
    return this._containerStyle;
  }
  _containerStyle;
  /**
   * Style class of the container element.
   * @group Props
   */
  containerStyleClass;
  /**
   * Inline style of the label element.
   * @group Props
   */
  labelStyle;
  /**
   * Style class of the label element.
   * @group Props
   */
  labelStyleClass;
  /**
   * Specifies the options for the overlay.
   * @group Props
   */
  overlayOptions;
  /**
   * Text to display when there are no options available. Defaults to value from PrimeNG locale configuration.
   * @group Props
   */
  emptyMessage = "";
  /**
   * A valid query selector or an HTMLElement to specify where the overlay gets attached. Special keywords are "body" for document body and "self" for the element itself.
   * @group Props
   */
  appendTo;
  /**
   * When specified, displays an input field to filter the items.
   * @group Props
   */
  filter = false;
  /**
   * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
   * @group Props
   */
  filterBy = "label";
  /**
   * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
   * @group Props
   */
  filterMode = "lenient";
  /**
   * Placeholder text to show when filter input is empty.
   * @group Props
   */
  filterPlaceholder;
  /**
   * Locale to use in filtering. The default locale is the host environment's current locale.
   * @group Props
   */
  filterLocale;
  /**
   * Determines whether the filter input should be automatically focused when the component is rendered.
   * @group Props
   */
  filterInputAutoFocus = true;
  /**
   * Whether checkbox selections propagate to descendant nodes.
   * @group Props
   */
  propagateSelectionDown = true;
  /**
   * Whether checkbox selections propagate to ancestor nodes.
   * @group Props
   */
  propagateSelectionUp = true;
  /**
   * When enabled, a clear icon is displayed to clear the value.
   * @group Props
   */
  showClear = false;
  /**
   * Clears the filter value when hiding the dropdown.
   * @group Props
   */
  resetFilterOnHide = true;
  /**
   * Whether the data should be loaded on demand during scroll.
   * @group Props
   */
  virtualScroll;
  /**
   * Height of an item in the list for VirtualScrolling.
   * @group Props
   */
  virtualScrollItemSize;
  /**
   * Defines the size of the component.
   * @group Props
   */
  size;
  /**
   * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
   * @group Props
   */
  virtualScrollOptions;
  /**
   * When present, it specifies that the component should automatically get focus on load.
   * @group Props
   */
  autofocus;
  /**
   * An array of treenodes.
   * @defaultValue undefined
   * @group Props
   */
  get options() {
    return this._options;
  }
  set options(options) {
    this._options = options;
    this.updateTreeState();
  }
  /**
   * Transition options of the show animation.
   * @group Props
   * @deprecated since v14.2.0 use overlayOptions property instead.
   */
  get showTransitionOptions() {
    return this._showTransitionOptions;
  }
  set showTransitionOptions(val) {
    this._showTransitionOptions = val;
    console.log("The showTransitionOptions property is deprecated since v14.2.0, use overlayOptions property instead.");
  }
  /**
   * Transition options of the hide animation.
   * @group Props
   * @deprecated since v14.2.0 use overlayOptions property instead.
   */
  get hideTransitionOptions() {
    return this._hideTransitionOptions;
  }
  set hideTransitionOptions(val) {
    this._hideTransitionOptions = val;
    console.log("The hideTransitionOptions property is deprecated since v14.2.0, use overlayOptions property instead.");
  }
  /**
   * Displays a loader to indicate data load is in progress.
   * @group Props
   */
  loading;
  /**
   * Callback to invoke when a node is expanded.
   * @param {TreeSelectNodeExpandEvent} event - Custom node expand event.
   * @group Emits
   */
  onNodeExpand = new EventEmitter();
  /**
   * Callback to invoke when a node is collapsed.
   * @param {TreeSelectNodeCollapseEvent} event - Custom node collapse event.
   * @group Emits
   */
  onNodeCollapse = new EventEmitter();
  /**
   * Callback to invoke when the overlay is shown.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onShow = new EventEmitter();
  /**
   * Callback to invoke when the overlay is hidden.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onHide = new EventEmitter();
  /**
   * Callback to invoke when input field is cleared.
   * @group Emits
   */
  onClear = new EventEmitter();
  /**
   * Callback to invoke when data is filtered.
   * @group Emits
   */
  onFilter = new EventEmitter();
  /**
   * Callback to invoke when treeselect gets focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onFocus = new EventEmitter();
  /**
   * Callback to invoke when treeselect loses focus.
   * @param {Event} event - Browser event.
   * @group Emits
   */
  onBlur = new EventEmitter();
  /**
   * Callback to invoke when a node is unselected.
   * @param {TreeNodeUnSelectEvent} event - node unselect event.
   * @group Emits
   */
  onNodeUnselect = new EventEmitter();
  /**
   * Callback to invoke when a node is selected.
   * @param {TreeNodeSelectEvent} event - node select event.
   * @group Emits
   */
  onNodeSelect = new EventEmitter();
  _showTransitionOptions;
  _hideTransitionOptions;
  containerEl;
  focusInput;
  filterViewChild;
  treeViewChild;
  panelEl;
  overlayViewChild;
  firstHiddenFocusableElementOnOverlay;
  lastHiddenFocusableElementOnOverlay;
  filteredNodes;
  filterValue = null;
  serializedValue;
  /**
   * Custom value template.
   * @group Templates
   */
  valueTemplate;
  /**
   * Custom header template.
   * @group Templates
   */
  headerTemplate;
  /**
   * Custom empty message template.
   * @group Templates
   */
  emptyTemplate;
  /**
   * Custom footer template.
   * @group Templates
   */
  footerTemplate;
  /**
   * Custom clear icon template.
   * @group Templates
   */
  clearIconTemplate;
  /**
   * Custom trigger icon template.
   * @group Templates
   */
  triggerIconTemplate;
  /**
   * Custom dropdown icon template.
   * @group Templates
   */
  dropdownIconTemplate;
  /**
   * Custom filter icon template.
   * @group Templates
   */
  filterIconTemplate;
  /**
   * Custom close icon template.
   * @group Templates
   */
  closeIconTemplate;
  /**
   * Custom item toggler icon template.
   * @group Templates
   */
  itemTogglerIconTemplate;
  /**
   * Custom item checkbox icon template.
   * @group Templates
   */
  itemCheckboxIconTemplate;
  /**
   * Custom item loading icon template.
   * @group Templates
   */
  itemLoadingIconTemplate;
  templates;
  _valueTemplate;
  _headerTemplate;
  _emptyTemplate;
  _footerTemplate;
  _clearIconTemplate;
  _triggerIconTemplate;
  _filterIconTemplate;
  _closeIconTemplate;
  _itemTogglerIconTemplate;
  _itemCheckboxIconTemplate;
  _itemLoadingIconTemplate;
  _dropdownIconTemplate;
  focused;
  overlayVisible;
  selfChange;
  value;
  expandedNodes = [];
  _options;
  templateMap;
  onModelChange = () => {
  };
  onModelTouched = () => {
  };
  listId = "";
  _componentStyle = inject(TreeSelectStyle);
  ngOnInit() {
    super.ngOnInit();
    this.listId = uuid("pn_id_") + "_list";
    this.updateTreeState();
  }
  ngAfterContentInit() {
    if (this.templates.length) {
      this.templateMap = {};
    }
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "value":
          this._valueTemplate = item.template;
          break;
        case "header":
          this._headerTemplate = item.template;
          break;
        case "empty":
          this._emptyTemplate = item.template;
          break;
        case "footer":
          this._footerTemplate = item.template;
          break;
        case "clearicon":
          this._clearIconTemplate = item.template;
          break;
        case "triggericon":
          this._triggerIconTemplate = item.template;
          break;
        case "filtericon":
          this._filterIconTemplate = item.template;
          break;
        case "closeicon":
          this._closeIconTemplate = item.template;
          break;
        case "itemtogglericon":
          this._itemTogglerIconTemplate = item.template;
          break;
        case "itemcheckboxicon":
          this._itemCheckboxIconTemplate = item.template;
          break;
        case "dropdownicon":
          this._dropdownIconTemplate = item.template;
          break;
        case "itemloadingicon":
          this._itemLoadingIconTemplate = item.template;
          break;
        default:
          if (item.name) this.templateMap[item.name] = item.template;
          else this.valueTemplate = item.template;
          break;
      }
    });
  }
  onOverlayAnimationStart(event) {
    switch (event.toState) {
      case "visible":
        if (this.filter) {
          isNotEmpty(this.filterValue) && this.treeViewChild?._filter(this.filterValue);
          this.filterInputAutoFocus && this.filterViewChild?.nativeElement.focus();
        } else {
          let focusableElements = getFocusableElements(this.panelEl.nativeElement);
          if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
        break;
    }
  }
  onOverlayBeforeHide(event) {
    let focusableElements = getFocusableElements(this.containerEl.nativeElement);
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
  onSelectionChange(event) {
    this.value = event;
    this.onModelChange(this.value);
    this.cd.markForCheck();
  }
  onClick(event) {
    if (this.disabled) {
      return;
    }
    if (!this.overlayViewChild?.el?.nativeElement?.contains(event.target) && !hasClass(event.target, "p-treeselect-close") && !hasClass(event.target, "p-checkbox-box") && !hasClass(event.target, "p-checkbox-icon")) {
      if (this.overlayVisible) {
        this.hide();
      } else {
        this.show();
      }
      this.focusInput?.nativeElement.focus();
    }
  }
  onKeyDown(event) {
    switch (event.code) {
      //down
      case "ArrowDown":
        if (!this.overlayVisible) {
          this.show();
          event.preventDefault();
        }
        this.onArrowDown(event);
        event.preventDefault();
        break;
      //space
      case "Space":
      case "Enter":
        if (!this.overlayVisible) {
          this.show();
          event.preventDefault();
        }
        break;
      //escape
      case "Escape":
        if (this.overlayVisible) {
          this.hide();
          this.focusInput?.nativeElement.focus();
          event.preventDefault();
        }
        break;
      //tab
      case "Tab":
        this.onTabKey(event);
        break;
      default:
        break;
    }
  }
  onFilterInput(event) {
    this.filterValue = event.target.value;
    this.treeViewChild?._filter(this.filterValue);
    this.onFilter.emit({
      filter: this.filterValue,
      filteredValue: this.treeViewChild?.filteredNodes
    });
    setTimeout(() => {
      this.overlayViewChild.alignOverlay();
    });
  }
  onArrowDown(event) {
    if (this.overlayVisible && this.panelEl?.nativeElement) {
      let focusableElements = getFocusableElements(this.panelEl.nativeElement, ".p-tree-node");
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      event.preventDefault();
    }
  }
  onFirstHiddenFocus(event) {
    const focusableEl = event.relatedTarget === this.focusInput?.nativeElement ? getFirstFocusableElement(this.overlayViewChild?.overlayViewChild?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInput?.nativeElement;
    focus(focusableEl);
  }
  onLastHiddenFocus(event) {
    const focusableEl = event.relatedTarget === this.focusInput?.nativeElement ? getLastFocusableElement(this.overlayViewChild?.overlayViewChild?.nativeElement, ':not([data-p-hidden-focusable="true"])') : this.focusInput?.nativeElement;
    focus(focusableEl);
  }
  show() {
    this.overlayVisible = true;
  }
  hide(event) {
    this.overlayVisible = false;
    this.resetFilter();
    this.onHide.emit(event);
    this.cd.markForCheck();
  }
  clear(event) {
    this.value = null;
    this.resetExpandedNodes();
    this.resetPartialSelected();
    this.onModelChange(this.value);
    this.onClear.emit();
    event.stopPropagation();
  }
  checkValue() {
    return this.value !== null && isNotEmpty(this.value);
  }
  onTabKey(event, pressedInInputText = false) {
    if (!pressedInInputText) {
      if (this.overlayVisible && this.hasFocusableElements()) {
        focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay.nativeElement : this.firstHiddenFocusableElementOnOverlay.nativeElement);
        event.preventDefault();
      } else {
        this.overlayVisible && this.hide(this.filter);
      }
    }
  }
  hasFocusableElements() {
    return getFocusableElements(this.overlayViewChild.overlayViewChild.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
  }
  resetFilter() {
    if (this.filter && !this.resetFilterOnHide) {
      this.filteredNodes = this.treeViewChild?.filteredNodes;
      this.treeViewChild?.resetFilter();
    } else {
      this.filterValue = null;
    }
  }
  updateTreeState() {
    if (this.value) {
      let selectedNodes = this.selectionMode === "single" ? [this.value] : [...this.value];
      this.resetExpandedNodes();
      this.resetPartialSelected();
      if (selectedNodes && this.options) {
        this.updateTreeBranchState(null, null, selectedNodes);
      }
    }
  }
  updateTreeBranchState(node, path, selectedNodes) {
    if (node) {
      if (this.isSelected(node)) {
        this.expandPath(path);
        selectedNodes.splice(selectedNodes.indexOf(node), 1);
      }
      if (selectedNodes.length > 0 && node.children) {
        for (let childNode of node.children) {
          this.updateTreeBranchState(childNode, [...path, node], selectedNodes);
        }
      }
    } else {
      for (let childNode of this.options) {
        this.updateTreeBranchState(childNode, [], selectedNodes);
      }
    }
  }
  expandPath(expandedNodes) {
    for (let node of expandedNodes) {
      node.expanded = true;
    }
    this.expandedNodes = [...expandedNodes];
  }
  nodeExpand(event) {
    this.onNodeExpand.emit(event);
    this.expandedNodes.push(event.node);
  }
  nodeCollapse(event) {
    this.onNodeCollapse.emit(event);
    this.expandedNodes.splice(this.expandedNodes.indexOf(event.node), 1);
  }
  resetExpandedNodes() {
    for (let node of this.expandedNodes) {
      node.expanded = false;
    }
    this.expandedNodes = [];
  }
  resetPartialSelected(nodes = this.options) {
    if (!nodes) {
      return;
    }
    for (let node of nodes) {
      node.partialSelected = false;
      if (node.children && node.children?.length > 0) {
        this.resetPartialSelected(node.children);
      }
    }
  }
  findSelectedNodes(node, keys, selectedNodes) {
    if (node) {
      if (this.isSelected(node)) {
        selectedNodes.push(node);
        delete keys[node.key];
      }
      if (Object.keys(keys).length && node.children) {
        for (let childNode of node.children) {
          this.findSelectedNodes(childNode, keys, selectedNodes);
        }
      }
    } else {
      for (let childNode of this.options) {
        this.findSelectedNodes(childNode, keys, selectedNodes);
      }
    }
  }
  isSelected(node) {
    return this.findIndexInSelection(node) != -1;
  }
  findIndexInSelection(node) {
    let index = -1;
    if (this.value) {
      if (this.selectionMode === "single") {
        let areNodesEqual = this.value.key && this.value.key === node.key || this.value == node;
        index = areNodesEqual ? 0 : -1;
      } else {
        for (let i = 0; i < this.value.length; i++) {
          let selectedNode = this.value[i];
          let areNodesEqual = selectedNode.key && selectedNode.key === node.key || selectedNode == node;
          if (areNodesEqual) {
            index = i;
            break;
          }
        }
      }
    }
    return index;
  }
  onSelect(event) {
    this.onNodeSelect.emit(event);
    if (this.selectionMode === "single") {
      this.hide();
      this.focusInput?.nativeElement.focus();
    }
  }
  onUnselect(event) {
    this.onNodeUnselect.emit(event);
  }
  onInputFocus(event) {
    if (this.disabled) {
      return;
    }
    this.focused = true;
    this.onFocus.emit(event);
  }
  onInputBlur(event) {
    this.focused = false;
    this.onBlur.emit(event);
    this.onModelTouched();
  }
  writeValue(value) {
    this.value = value;
    this.updateTreeState();
    this.cd.markForCheck();
  }
  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }
  setDisabledState(val) {
    setTimeout(() => {
      this.disabled = val;
      this.cd.markForCheck();
    });
  }
  get containerClass() {
    return this._componentStyle.classes.root({
      instance: this
    });
  }
  get hasFluid() {
    const nativeElement = this.el.nativeElement;
    const fluidComponent = nativeElement.closest("p-fluid");
    return this.fluid || !!fluidComponent;
  }
  get labelClass() {
    return this._componentStyle.classes.label({
      instance: this
    });
  }
  get emptyValue() {
    return !this.value || Object.keys(this.value).length === 0;
  }
  get emptyOptions() {
    return !this.options || this.options.length === 0;
  }
  get label() {
    let value = this.value || [];
    return value.length ? value.map((node) => node.label).join(", ") : this.selectionMode === "single" && this.value ? value.label : this.placeholder;
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵTreeSelect_BaseFactory;
    return function TreeSelect_Factory(__ngFactoryType__) {
      return (ɵTreeSelect_BaseFactory || (ɵTreeSelect_BaseFactory = ɵɵgetInheritedFactory(_TreeSelect)))(__ngFactoryType__ || _TreeSelect);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _TreeSelect,
    selectors: [["p-treeSelect"], ["p-treeselect"], ["p-tree-select"]],
    contentQueries: function TreeSelect_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c0, 4);
        ɵɵcontentQuery(dirIndex, _c1, 4);
        ɵɵcontentQuery(dirIndex, _c2, 4);
        ɵɵcontentQuery(dirIndex, _c3, 4);
        ɵɵcontentQuery(dirIndex, _c4, 4);
        ɵɵcontentQuery(dirIndex, _c5, 4);
        ɵɵcontentQuery(dirIndex, _c6, 4);
        ɵɵcontentQuery(dirIndex, _c7, 4);
        ɵɵcontentQuery(dirIndex, _c8, 4);
        ɵɵcontentQuery(dirIndex, _c9, 4);
        ɵɵcontentQuery(dirIndex, _c10, 4);
        ɵɵcontentQuery(dirIndex, _c11, 4);
        ɵɵcontentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.valueTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.headerTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.emptyTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.footerTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.clearIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.triggerIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.dropdownIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.filterIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.closeIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.itemTogglerIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.itemCheckboxIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.itemLoadingIconTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function TreeSelect_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c12, 5);
        ɵɵviewQuery(_c13, 5);
        ɵɵviewQuery(_c14, 5);
        ɵɵviewQuery(_c15, 5);
        ɵɵviewQuery(_c16, 5);
        ɵɵviewQuery(_c17, 5);
        ɵɵviewQuery(_c18, 5);
        ɵɵviewQuery(_c19, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerEl = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.focusInput = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.filterViewChild = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.treeViewChild = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.panelEl = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overlayViewChild = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.firstHiddenFocusableElementOnOverlay = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.lastHiddenFocusableElementOnOverlay = _t.first);
      }
    },
    inputs: {
      inputId: "inputId",
      scrollHeight: "scrollHeight",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      metaKeySelection: [2, "metaKeySelection", "metaKeySelection", booleanAttribute],
      variant: "variant",
      display: "display",
      selectionMode: "selectionMode",
      tabindex: "tabindex",
      ariaLabel: "ariaLabel",
      ariaLabelledBy: "ariaLabelledBy",
      placeholder: "placeholder",
      panelClass: "panelClass",
      panelStyle: "panelStyle",
      fluid: [2, "fluid", "fluid", booleanAttribute],
      panelStyleClass: "panelStyleClass",
      containerStyle: "containerStyle",
      containerStyleClass: "containerStyleClass",
      labelStyle: "labelStyle",
      labelStyleClass: "labelStyleClass",
      overlayOptions: "overlayOptions",
      emptyMessage: "emptyMessage",
      appendTo: "appendTo",
      filter: [2, "filter", "filter", booleanAttribute],
      filterBy: "filterBy",
      filterMode: "filterMode",
      filterPlaceholder: "filterPlaceholder",
      filterLocale: "filterLocale",
      filterInputAutoFocus: [2, "filterInputAutoFocus", "filterInputAutoFocus", booleanAttribute],
      propagateSelectionDown: [2, "propagateSelectionDown", "propagateSelectionDown", booleanAttribute],
      propagateSelectionUp: [2, "propagateSelectionUp", "propagateSelectionUp", booleanAttribute],
      showClear: [2, "showClear", "showClear", booleanAttribute],
      resetFilterOnHide: [2, "resetFilterOnHide", "resetFilterOnHide", booleanAttribute],
      virtualScroll: "virtualScroll",
      virtualScrollItemSize: "virtualScrollItemSize",
      size: "size",
      virtualScrollOptions: "virtualScrollOptions",
      autofocus: [2, "autofocus", "autofocus", booleanAttribute],
      options: "options",
      showTransitionOptions: "showTransitionOptions",
      hideTransitionOptions: "hideTransitionOptions",
      loading: [2, "loading", "loading", booleanAttribute]
    },
    outputs: {
      onNodeExpand: "onNodeExpand",
      onNodeCollapse: "onNodeCollapse",
      onShow: "onShow",
      onHide: "onHide",
      onClear: "onClear",
      onFilter: "onFilter",
      onFocus: "onFocus",
      onBlur: "onBlur",
      onNodeUnselect: "onNodeUnselect",
      onNodeSelect: "onNodeSelect"
    },
    features: [ɵɵProvidersFeature([TREESELECT_VALUE_ACCESSOR, TreeSelectStyle]), ɵɵInheritDefinitionFeature],
    decls: 18,
    vars: 30,
    consts: [["container", ""], ["focusInput", ""], ["defaultValueTemplate", ""], ["overlay", ""], ["content", ""], ["chipsValueTemplate", ""], ["panel", ""], ["firstHiddenFocusableEl", ""], ["tree", ""], ["lastHiddenFocusableEl", ""], ["empty", ""], ["togglericon", ""], ["checkboxicon", ""], ["loadingicon", ""], [3, "click", "ngClass", "ngStyle"], [1, "p-hidden-accessible"], ["type", "text", "role", "combobox", "readonly", "", 3, "focus", "blur", "keydown", "disabled", "pAutoFocus"], [1, "p-treeselect-label-container"], [3, "ngClass", "ngStyle"], [4, "ngIf", "ngIfElse"], [4, "ngIf"], ["role", "button", "aria-haspopup", "tree", 1, "p-treeselect-dropdown"], [3, "styleClass", 4, "ngIf"], ["class", "p-treeselect-dropdown-icon", 4, "ngIf"], [3, "visibleChange", "onAnimationStart", "onBeforeHide", "onShow", "onHide", "visible", "options", "target", "appendTo", "showTransitionOptions", "hideTransitionOptions"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "p-treeselect-chip-item", 4, "ngFor", "ngForOf"], [1, "p-treeselect-chip-item"], ["styleClass", "p-treeselect-chip", 3, "label"], [3, "class", "click", 4, "ngIf"], ["class", "p-treeselect-clear-icon", 3, "click", 4, "ngIf"], [3, "click"], [1, "p-treeselect-clear-icon", 3, "click"], [4, "ngTemplateOutlet"], [3, "styleClass"], [1, "p-treeselect-dropdown-icon"], [1, "p-treeselect-overlay", "p-component", 3, "ngStyle", "ngClass"], ["role", "presentation", 1, "p-hidden-accessible", "p-hidden-focusable", 3, "focus"], [1, "p-treeselect-tree-container", 3, "ngStyle"], [3, "selectionChange", "onNodeExpand", "onNodeCollapse", "onNodeSelect", "onNodeUnselect", "value", "propagateSelectionDown", "propagateSelectionUp", "selectionMode", "selection", "metaKeySelection", "emptyMessage", "filter", "filterBy", "filterMode", "filterPlaceholder", "filterLocale", "filteredNodes", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "_templateMap", "loading", "filterInputAutoFocus"]],
    template: function TreeSelect_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "div", 14, 0);
        ɵɵlistener("click", function TreeSelect_Template_div_click_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onClick($event));
        });
        ɵɵelementStart(2, "div", 15)(3, "input", 16, 1);
        ɵɵlistener("focus", function TreeSelect_Template_input_focus_3_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onInputFocus($event));
        })("blur", function TreeSelect_Template_input_blur_3_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onInputBlur($event));
        })("keydown", function TreeSelect_Template_input_keydown_3_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onKeyDown($event));
        });
        ɵɵelementEnd()();
        ɵɵelementStart(5, "div", 17)(6, "div", 18);
        ɵɵtemplate(7, TreeSelect_ng_container_7_Template, 2, 5, "ng-container", 19)(8, TreeSelect_ng_template_8_Template, 3, 2, "ng-template", null, 2, ɵɵtemplateRefExtractor);
        ɵɵelementEnd()();
        ɵɵtemplate(10, TreeSelect_ng_container_10_Template, 3, 2, "ng-container", 20);
        ɵɵelementStart(11, "div", 21);
        ɵɵtemplate(12, TreeSelect_ChevronDownIcon_12_Template, 1, 1, "ChevronDownIcon", 22)(13, TreeSelect_span_13_Template, 2, 1, "span", 23);
        ɵɵelementEnd();
        ɵɵelementStart(14, "p-overlay", 24, 3);
        ɵɵtwoWayListener("visibleChange", function TreeSelect_Template_p_overlay_visibleChange_14_listener($event) {
          ɵɵrestoreView(_r1);
          ɵɵtwoWayBindingSet(ctx.overlayVisible, $event) || (ctx.overlayVisible = $event);
          return ɵɵresetView($event);
        });
        ɵɵlistener("onAnimationStart", function TreeSelect_Template_p_overlay_onAnimationStart_14_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onOverlayAnimationStart($event));
        })("onBeforeHide", function TreeSelect_Template_p_overlay_onBeforeHide_14_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onOverlayBeforeHide($event));
        })("onShow", function TreeSelect_Template_p_overlay_onShow_14_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onShow.emit($event));
        })("onHide", function TreeSelect_Template_p_overlay_onHide_14_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.hide($event));
        });
        ɵɵtemplate(16, TreeSelect_ng_template_16_Template, 15, 47, "ng-template", null, 4, ɵɵtemplateRefExtractor);
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        const defaultValueTemplate_r11 = ɵɵreference(9);
        ɵɵclassMap(ctx.containerStyleClass);
        ɵɵproperty("ngClass", ctx.containerClass)("ngStyle", ctx.containerStyle);
        ɵɵadvance(3);
        ɵɵproperty("disabled", ctx.disabled)("pAutoFocus", ctx.autofocus);
        ɵɵattribute("id", ctx.inputId)("tabindex", !ctx.disabled ? ctx.tabindex : -1)("aria-controls", ctx.overlayVisible ? ctx.listId : null)("aria-haspopup", "tree")("aria-expanded", ctx.overlayVisible ?? false)("aria-labelledby", ctx.ariaLabelledBy)("aria-label", ctx.ariaLabel || (ctx.label === "p-emptylabel" ? void 0 : ctx.label));
        ɵɵadvance(3);
        ɵɵclassMap(ctx.labelStyleClass);
        ɵɵproperty("ngClass", ctx.labelClass)("ngStyle", ctx.labelStyle);
        ɵɵadvance();
        ɵɵproperty("ngIf", ctx.valueTemplate || ctx._valueTemplate)("ngIfElse", defaultValueTemplate_r11);
        ɵɵadvance(3);
        ɵɵproperty("ngIf", ctx.checkValue() && !ctx.disabled && ctx.showClear);
        ɵɵadvance();
        ɵɵattribute("aria-expanded", ctx.overlayVisible ?? false)("aria-label", "treeselect trigger");
        ɵɵadvance();
        ɵɵproperty("ngIf", !ctx.triggerIconTemplate && !ctx._triggerIconTemplate && !ctx.dropdownIconTemplate && !ctx._dropdownIconTemplate);
        ɵɵadvance();
        ɵɵproperty("ngIf", ctx.triggerIconTemplate || ctx._triggerIconTemplate || ctx.dropdownIconTemplate || ctx._dropdownIconTemplate);
        ɵɵadvance();
        ɵɵtwoWayProperty("visible", ctx.overlayVisible);
        ɵɵproperty("options", ctx.overlayOptions)("target", "@parent")("appendTo", ctx.appendTo)("showTransitionOptions", ctx.showTransitionOptions)("hideTransitionOptions", ctx.hideTransitionOptions);
      }
    },
    dependencies: [CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet, NgStyle, Overlay, SharedModule, Tree, AutoFocus, TimesIcon, ChevronDownIcon, Chip],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TreeSelect, [{
    type: Component,
    args: [{
      selector: "p-treeSelect, p-treeselect, p-tree-select",
      standalone: true,
      imports: [CommonModule, Overlay, SharedModule, Tree, AutoFocus, TimesIcon, ChevronDownIcon, Chip],
      template: `
        <div #container [ngClass]="containerClass" [class]="containerStyleClass" [ngStyle]="containerStyle" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input
                    #focusInput
                    type="text"
                    role="combobox"
                    [attr.id]="inputId"
                    readonly
                    [disabled]="disabled"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    (keydown)="onKeyDown($event)"
                    [attr.tabindex]="!disabled ? tabindex : -1"
                    [attr.aria-controls]="overlayVisible ? listId : null"
                    [attr.aria-haspopup]="'tree'"
                    [attr.aria-expanded]="overlayVisible ?? false"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    [attr.aria-label]="ariaLabel || (label === 'p-emptylabel' ? undefined : label)"
                    [pAutoFocus]="autofocus"
                />
            </div>
            <div class="p-treeselect-label-container">
                <div [ngClass]="labelClass" [class]="labelStyleClass" [ngStyle]="labelStyle">
                    <ng-container *ngIf="valueTemplate || _valueTemplate; else defaultValueTemplate">
                        <ng-container *ngTemplateOutlet="valueTemplate || _valueTemplate; context: { $implicit: value, placeholder: placeholder }"></ng-container>
                    </ng-container>
                    <ng-template #defaultValueTemplate>
                        <ng-container *ngIf="display === 'comma'; else chipsValueTemplate">
                            {{ label || 'empty' }}
                        </ng-container>
                        <ng-template #chipsValueTemplate>
                            <div *ngFor="let node of value" class="p-treeselect-chip-item">
                                <p-chip [label]="node.label" styleClass="p-treeselect-chip" />
                            </div>
                            <ng-container *ngIf="emptyValue">{{ placeholder || 'empty' }}</ng-container>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
            <ng-container *ngIf="checkValue() && !disabled && showClear">
                <TimesIcon *ngIf="!clearIconTemplate && !_clearIconTemplate" [class]="'p-treeselect-clear-icon'" (click)="clear($event)" />
                <span *ngIf="clearIconTemplate || clearIconTemplate" class="p-treeselect-clear-icon" (click)="clear($event)">
                    <ng-template *ngTemplateOutlet="clearIconTemplate || _clearIconTemplate"></ng-template>
                </span>
            </ng-container>
            <div class="p-treeselect-dropdown" role="button" aria-haspopup="tree" [attr.aria-expanded]="overlayVisible ?? false" [attr.aria-label]="'treeselect trigger'">
                <ChevronDownIcon *ngIf="!triggerIconTemplate && !_triggerIconTemplate && !dropdownIconTemplate && !_dropdownIconTemplate" [styleClass]="'p-treeselect-dropdown-icon'" />
                <span *ngIf="triggerIconTemplate || _triggerIconTemplate || dropdownIconTemplate || _dropdownIconTemplate" class="p-treeselect-dropdown-icon">
                    <ng-template *ngTemplateOutlet="triggerIconTemplate || _triggerIconTemplate || dropdownIconTemplate || _dropdownIconTemplate"></ng-template>
                </span>
            </div>
            <p-overlay
                #overlay
                [(visible)]="overlayVisible"
                [options]="overlayOptions"
                [target]="'@parent'"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
                (onAnimationStart)="onOverlayAnimationStart($event)"
                (onBeforeHide)="onOverlayBeforeHide($event)"
                (onShow)="onShow.emit($event)"
                (onHide)="hide($event)"
            >
                <ng-template #content>
                    <div #panel [attr.id]="listId" class="p-treeselect-overlay p-component" [ngStyle]="panelStyle" [class]="panelStyleClass" [ngClass]="panelClass">
                        <span
                            #firstHiddenFocusableEl
                            role="presentation"
                            class="p-hidden-accessible p-hidden-focusable"
                            [attr.tabindex]="0"
                            (focus)="onFirstHiddenFocus($event)"
                            [attr.data-p-hidden-accessible]="true"
                            [attr.data-p-hidden-focusable]="true"
                        >
                        </span>
                        <ng-container *ngTemplateOutlet="headerTemplate || _headerTemplate; context: { $implicit: value, options: options }"></ng-container>
                        <div class="p-treeselect-tree-container" [ngStyle]="{ 'max-height': scrollHeight }">
                            <p-tree
                                #tree
                                [value]="options"
                                [propagateSelectionDown]="propagateSelectionDown"
                                [propagateSelectionUp]="propagateSelectionUp"
                                [selectionMode]="selectionMode"
                                (selectionChange)="onSelectionChange($event)"
                                [selection]="value"
                                [metaKeySelection]="metaKeySelection"
                                (onNodeExpand)="nodeExpand($event)"
                                (onNodeCollapse)="nodeCollapse($event)"
                                (onNodeSelect)="onSelect($event)"
                                [emptyMessage]="emptyMessage"
                                (onNodeUnselect)="onUnselect($event)"
                                [filter]="filter"
                                [filterBy]="filterBy"
                                [filterMode]="filterMode"
                                [filterPlaceholder]="filterPlaceholder"
                                [filterLocale]="filterLocale"
                                [filteredNodes]="filteredNodes"
                                [virtualScroll]="virtualScroll"
                                [virtualScrollItemSize]="virtualScrollItemSize"
                                [virtualScrollOptions]="virtualScrollOptions"
                                [_templateMap]="templateMap"
                                [loading]="loading"
                                [filterInputAutoFocus]="filterInputAutoFocus"
                            >
                                <ng-container *ngIf="emptyTemplate || _emptyTemplate">
                                    <ng-template #empty>
                                        <ng-container *ngTemplateOutlet="emptyTemplate || _emptyTemplate"></ng-container>
                                    </ng-template>
                                </ng-container>
                                <ng-template #togglericon let-expanded *ngIf="itemTogglerIconTemplate || _itemTogglerIconTemplate">
                                    <ng-container *ngTemplateOutlet="itemTogglerIconTemplate || _itemTogglerIconTemplate; context: { $implicit: expanded }"></ng-container>
                                </ng-template>
                                <ng-template #checkboxicon let-selected let-partialSelected="partialSelected" *ngIf="itemCheckboxIconTemplate || _itemCheckboxIconTemplate">
                                    <ng-container *ngTemplateOutlet="itemCheckboxIconTemplate || _itemCheckboxIconTemplate; context: { $implicit: selected, partialSelected: partialSelected }"></ng-container>
                                </ng-template>
                                <ng-template #loadingicon *ngIf="itemLoadingIconTemplate || _itemLoadingIconTemplate">
                                    <ng-container *ngTemplateOutlet="itemLoadingIconTemplate || _itemLoadingIconTemplate"></ng-container>
                                </ng-template>
                            </p-tree>
                        </div>
                        <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: value, options: options }"></ng-container>
                        <span
                            #lastHiddenFocusableEl
                            role="presentation"
                            class="p-hidden-accessible p-hidden-focusable"
                            [attr.tabindex]="0"
                            (focus)="onLastHiddenFocus($event)"
                            [attr.data-p-hidden-accessible]="true"
                            [attr.data-p-hidden-focusable]="true"
                        ></span>
                    </div>
                </ng-template>
            </p-overlay>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [TREESELECT_VALUE_ACCESSOR, TreeSelectStyle],
      encapsulation: ViewEncapsulation.None
    }]
  }], null, {
    inputId: [{
      type: Input
    }],
    scrollHeight: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    metaKeySelection: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    variant: [{
      type: Input
    }],
    display: [{
      type: Input
    }],
    selectionMode: [{
      type: Input
    }],
    tabindex: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    placeholder: [{
      type: Input
    }],
    panelClass: [{
      type: Input
    }],
    panelStyle: [{
      type: Input
    }],
    fluid: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    panelStyleClass: [{
      type: Input
    }],
    containerStyle: [{
      type: Input
    }],
    containerStyleClass: [{
      type: Input
    }],
    labelStyle: [{
      type: Input
    }],
    labelStyleClass: [{
      type: Input
    }],
    overlayOptions: [{
      type: Input
    }],
    emptyMessage: [{
      type: Input
    }],
    appendTo: [{
      type: Input
    }],
    filter: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    filterBy: [{
      type: Input
    }],
    filterMode: [{
      type: Input
    }],
    filterPlaceholder: [{
      type: Input
    }],
    filterLocale: [{
      type: Input
    }],
    filterInputAutoFocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    propagateSelectionDown: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    propagateSelectionUp: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showClear: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    resetFilterOnHide: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    virtualScroll: [{
      type: Input
    }],
    virtualScrollItemSize: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    virtualScrollOptions: [{
      type: Input
    }],
    autofocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    options: [{
      type: Input
    }],
    showTransitionOptions: [{
      type: Input
    }],
    hideTransitionOptions: [{
      type: Input
    }],
    loading: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    onNodeExpand: [{
      type: Output
    }],
    onNodeCollapse: [{
      type: Output
    }],
    onShow: [{
      type: Output
    }],
    onHide: [{
      type: Output
    }],
    onClear: [{
      type: Output
    }],
    onFilter: [{
      type: Output
    }],
    onFocus: [{
      type: Output
    }],
    onBlur: [{
      type: Output
    }],
    onNodeUnselect: [{
      type: Output
    }],
    onNodeSelect: [{
      type: Output
    }],
    containerEl: [{
      type: ViewChild,
      args: ["container"]
    }],
    focusInput: [{
      type: ViewChild,
      args: ["focusInput"]
    }],
    filterViewChild: [{
      type: ViewChild,
      args: ["filter"]
    }],
    treeViewChild: [{
      type: ViewChild,
      args: ["tree"]
    }],
    panelEl: [{
      type: ViewChild,
      args: ["panel"]
    }],
    overlayViewChild: [{
      type: ViewChild,
      args: ["overlay"]
    }],
    firstHiddenFocusableElementOnOverlay: [{
      type: ViewChild,
      args: ["firstHiddenFocusableEl"]
    }],
    lastHiddenFocusableElementOnOverlay: [{
      type: ViewChild,
      args: ["lastHiddenFocusableEl"]
    }],
    valueTemplate: [{
      type: ContentChild,
      args: ["value", {
        descendants: false
      }]
    }],
    headerTemplate: [{
      type: ContentChild,
      args: ["header", {
        descendants: false
      }]
    }],
    emptyTemplate: [{
      type: ContentChild,
      args: ["empty", {
        descendants: false
      }]
    }],
    footerTemplate: [{
      type: ContentChild,
      args: ["footer", {
        descendants: false
      }]
    }],
    clearIconTemplate: [{
      type: ContentChild,
      args: ["clearicon", {
        descendants: false
      }]
    }],
    triggerIconTemplate: [{
      type: ContentChild,
      args: ["triggericon", {
        descendants: false
      }]
    }],
    dropdownIconTemplate: [{
      type: ContentChild,
      args: ["dropdownicon", {
        descendants: false
      }]
    }],
    filterIconTemplate: [{
      type: ContentChild,
      args: ["filtericon", {
        descendants: false
      }]
    }],
    closeIconTemplate: [{
      type: ContentChild,
      args: ["closeicon", {
        descendants: false
      }]
    }],
    itemTogglerIconTemplate: [{
      type: ContentChild,
      args: ["itemtogglericon", {
        descendants: false
      }]
    }],
    itemCheckboxIconTemplate: [{
      type: ContentChild,
      args: ["itemcheckboxicon", {
        descendants: false
      }]
    }],
    itemLoadingIconTemplate: [{
      type: ContentChild,
      args: ["itemloadingicon", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var TreeSelectModule = class _TreeSelectModule {
  static ɵfac = function TreeSelectModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TreeSelectModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _TreeSelectModule,
    imports: [TreeSelect, SharedModule],
    exports: [TreeSelect, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [TreeSelect, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TreeSelectModule, [{
    type: NgModule,
    args: [{
      imports: [TreeSelect, SharedModule],
      exports: [TreeSelect, SharedModule]
    }]
  }], null, null);
})();
export {
  TREESELECT_VALUE_ACCESSOR,
  TreeSelect,
  TreeSelectClasses,
  TreeSelectModule,
  TreeSelectStyle
};
//# sourceMappingURL=primeng_treeselect.js.map
