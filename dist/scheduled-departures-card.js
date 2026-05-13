/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = globalThis, Dt = Ze.ShadowRoot && (Ze.ShadyCSS === void 0 || Ze.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Bt = Symbol(), is = /* @__PURE__ */ new WeakMap();
let Cs = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Bt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Dt && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = is.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && is.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const An = (n) => new Cs(typeof n == "string" ? n : n + "", void 0, Bt), En = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((s, i, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new Cs(t, n, Bt);
}, _n = (n, e) => {
  if (Dt) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = Ze.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, n.appendChild(s);
  }
}, rs = Dt ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return An(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Nn, defineProperty: vn, getOwnPropertyDescriptor: On, getOwnPropertyNames: Tn, getOwnPropertySymbols: Cn, getPrototypeOf: In } = Object, z = globalThis, os = z.trustedTypes, Ln = os ? os.emptyScript : "", bt = z.reactiveElementPolyfillSupport, Ce = (n, e) => n, st = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? Ln : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, jt = (n, e) => !Nn(n, e), as = { attribute: !0, type: String, converter: st, reflect: !1, useDefault: !1, hasChanged: jt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), z.litPropertyMetadata ?? (z.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let le = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = as) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && vn(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: r } = On(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const a = i == null ? void 0 : i.call(this);
      r == null || r.call(this, o), this.requestUpdate(e, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? as;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ce("elementProperties"))) return;
    const e = In(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ce("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ce("properties"))) {
      const t = this.properties, s = [...Tn(t), ...Cn(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(rs(i));
    } else e !== void 0 && t.push(rs(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _n(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) == null ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) == null ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    var r;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : st).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var r, o;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = s.getPropertyOptions(i), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : st;
      this._$Em = i;
      const c = l.fromAttribute(t, a.type);
      this[i] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, r) {
    var o;
    if (e !== void 0) {
      const a = this.constructor;
      if (i === !1 && (r = this[e]), s ?? (s = a.getPropertyOptions(e)), !((s.hasChanged ?? jt)(r, t) || s.useDefault && s.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: r }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), r !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: a } = o, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var r;
        return (r = i.hostUpdate) == null ? void 0 : r.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
le.elementStyles = [], le.shadowRootOptions = { mode: "open" }, le[Ce("elementProperties")] = /* @__PURE__ */ new Map(), le[Ce("finalized")] = /* @__PURE__ */ new Map(), bt == null || bt({ ReactiveElement: le }), (z.reactiveElementVersions ?? (z.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ie = globalThis, ls = (n) => n, nt = Ie.trustedTypes, cs = nt ? nt.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Is = "$lit$", G = `lit$${Math.random().toFixed(9).slice(2)}$`, Ls = "?" + G, Pn = `<${Ls}>`, ie = document, Me = () => ie.createComment(""), De = (n) => n === null || typeof n != "object" && typeof n != "function", Ut = Array.isArray, Mn = (n) => Ut(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", wt = `[ 	
\f\r]`, Ne = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fs = /-->/g, us = />/g, Z = RegExp(`>|${wt}(?:([^\\s"'>=/]+)(${wt}*=${wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), hs = /'/g, ds = /"/g, Ps = /^(?:script|style|textarea|title)$/i, Dn = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), V = Dn(1), me = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), ps = /* @__PURE__ */ new WeakMap(), ee = ie.createTreeWalker(ie, 129);
function Ms(n, e) {
  if (!Ut(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return cs !== void 0 ? cs.createHTML(e) : e;
}
const Bn = (n, e) => {
  const t = n.length - 1, s = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = Ne;
  for (let a = 0; a < t; a++) {
    const l = n[a];
    let c, d, f = -1, p = 0;
    for (; p < l.length && (o.lastIndex = p, d = o.exec(l), d !== null); ) p = o.lastIndex, o === Ne ? d[1] === "!--" ? o = fs : d[1] !== void 0 ? o = us : d[2] !== void 0 ? (Ps.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = Z) : d[3] !== void 0 && (o = Z) : o === Z ? d[0] === ">" ? (o = i ?? Ne, f = -1) : d[1] === void 0 ? f = -2 : (f = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? Z : d[3] === '"' ? ds : hs) : o === ds || o === hs ? o = Z : o === fs || o === us ? o = Ne : (o = Z, i = void 0);
    const u = o === Z && n[a + 1].startsWith("/>") ? " " : "";
    r += o === Ne ? l + Pn : f >= 0 ? (s.push(c), l.slice(0, f) + Is + l.slice(f) + G + u) : l + G + (f === -2 ? a : u);
  }
  return [Ms(n, r + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Be {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const a = e.length - 1, l = this.parts, [c, d] = Bn(e, t);
    if (this.el = Be.createElement(c, s), ee.currentNode = this.el.content, t === 2 || t === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (i = ee.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const f of i.getAttributeNames()) if (f.endsWith(Is)) {
          const p = d[o++], u = i.getAttribute(f).split(G), g = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: r, name: g[2], strings: u, ctor: g[1] === "." ? Un : g[1] === "?" ? Kn : g[1] === "@" ? Rn : lt }), i.removeAttribute(f);
        } else f.startsWith(G) && (l.push({ type: 6, index: r }), i.removeAttribute(f));
        if (Ps.test(i.tagName)) {
          const f = i.textContent.split(G), p = f.length - 1;
          if (p > 0) {
            i.textContent = nt ? nt.emptyScript : "";
            for (let u = 0; u < p; u++) i.append(f[u], Me()), ee.nextNode(), l.push({ type: 2, index: ++r });
            i.append(f[p], Me());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ls) l.push({ type: 2, index: r });
      else {
        let f = -1;
        for (; (f = i.data.indexOf(G, f + 1)) !== -1; ) l.push({ type: 7, index: r }), f += G.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = ie.createElement("template");
    return s.innerHTML = e, s;
  }
}
function ge(n, e, t = n, s) {
  var o, a;
  if (e === me) return e;
  let i = s !== void 0 ? (o = t._$Co) == null ? void 0 : o[s] : t._$Cl;
  const r = De(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== r && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = ge(n, i._$AS(n, e.values), i, s)), e;
}
class jn {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? ie).importNode(t, !0);
    ee.currentNode = i;
    let r = ee.nextNode(), o = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new Ke(r, r.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (c = new qn(r, this, e)), this._$AV.push(c), l = s[++a];
      }
      o !== (l == null ? void 0 : l.index) && (r = ee.nextNode(), o++);
    }
    return ee.currentNode = ie, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class Ke {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = ge(this, e, t), De(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== me && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Mn(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== O && De(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ie.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var r;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Be.createElement(Ms(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === i) this._$AH.p(t);
    else {
      const o = new jn(i, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ps.get(e.strings);
    return t === void 0 && ps.set(e.strings, t = new Be(e)), t;
  }
  k(e) {
    Ut(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const r of e) i === t.length ? t.push(s = new Ke(this.O(Me()), this.O(Me()), this, this.options)) : s = t[i], s._$AI(r), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = ls(e).nextSibling;
      ls(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class lt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, r) {
    this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = O;
  }
  _$AI(e, t = this, s, i) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) e = ge(this, e, t, 0), o = !De(e) || e !== this._$AH && e !== me, o && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = r[0], l = 0; l < r.length - 1; l++) c = ge(this, a[s + l], t, l), c === me && (c = this._$AH[l]), o || (o = !De(c) || c !== this._$AH[l]), c === O ? e = O : e !== O && (e += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Un extends lt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === O ? void 0 : e;
  }
}
class Kn extends lt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== O);
  }
}
class Rn extends lt {
  constructor(e, t, s, i, r) {
    super(e, t, s, i, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = ge(this, e, t, 0) ?? O) === me) return;
    const s = this._$AH, i = e === O && s !== O || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== O && (s === O || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class qn {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ge(this, e);
  }
}
const St = Ie.litHtmlPolyfillSupport;
St == null || St(Be, Ke), (Ie.litHtmlVersions ?? (Ie.litHtmlVersions = [])).push("3.3.2");
const Fn = (n, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new Ke(e.insertBefore(Me(), r), r, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = globalThis;
class he extends le {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Fn(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return me;
  }
}
var Ts;
he._$litElement$ = !0, he.finalized = !0, (Ts = ne.litElementHydrateSupport) == null || Ts.call(ne, { LitElement: he });
const $t = ne.litElementPolyfillSupport;
$t == null || $t({ LitElement: he });
(ne.litElementVersions ?? (ne.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ds = (n) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(n, e);
  }) : customElements.define(n, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Hn = { attribute: !0, type: String, converter: st, reflect: !1, hasChanged: jt }, Vn = (n = Hn, e, t) => {
  const { kind: s, metadata: i } = t;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(t.name, n), s === "accessor") {
    const { name: o } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, l, n, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, n, a), a;
    } };
  }
  if (s === "setter") {
    const { name: o } = t;
    return function(a) {
      const l = this[o];
      e.call(this, a), this.requestUpdate(o, l, n, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Kt(n) {
  return (e, t) => typeof t == "object" ? Vn(n, e, t) : ((s, i, r) => {
    const o = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(n, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Re(n) {
  return Kt({ ...n, state: !0, attribute: !1 });
}
const Rt = Symbol.for("yaml.alias"), Ot = Symbol.for("yaml.document"), X = Symbol.for("yaml.map"), Bs = Symbol.for("yaml.pair"), F = Symbol.for("yaml.scalar"), $e = Symbol.for("yaml.seq"), j = Symbol.for("yaml.node.type"), ke = (n) => !!n && typeof n == "object" && n[j] === Rt, qe = (n) => !!n && typeof n == "object" && n[j] === Ot, Fe = (n) => !!n && typeof n == "object" && n[j] === X, I = (n) => !!n && typeof n == "object" && n[j] === Bs, v = (n) => !!n && typeof n == "object" && n[j] === F, He = (n) => !!n && typeof n == "object" && n[j] === $e;
function T(n) {
  if (n && typeof n == "object")
    switch (n[j]) {
      case X:
      case $e:
        return !0;
    }
  return !1;
}
function C(n) {
  if (n && typeof n == "object")
    switch (n[j]) {
      case Rt:
      case X:
      case F:
      case $e:
        return !0;
    }
  return !1;
}
const js = (n) => (v(n) || T(n)) && !!n.anchor, x = Symbol("break visit"), Wn = Symbol("skip children"), Le = Symbol("remove node");
function Ae(n, e) {
  const t = Yn(e);
  qe(n) ? ce(null, n.contents, t, Object.freeze([n])) === Le && (n.contents = null) : ce(null, n, t, Object.freeze([]));
}
Ae.BREAK = x;
Ae.SKIP = Wn;
Ae.REMOVE = Le;
function ce(n, e, t, s) {
  const i = Jn(n, e, t, s);
  if (C(i) || I(i))
    return Gn(n, s, i), ce(n, i, t, s);
  if (typeof i != "symbol") {
    if (T(e)) {
      s = Object.freeze(s.concat(e));
      for (let r = 0; r < e.items.length; ++r) {
        const o = ce(r, e.items[r], t, s);
        if (typeof o == "number")
          r = o - 1;
        else {
          if (o === x)
            return x;
          o === Le && (e.items.splice(r, 1), r -= 1);
        }
      }
    } else if (I(e)) {
      s = Object.freeze(s.concat(e));
      const r = ce("key", e.key, t, s);
      if (r === x)
        return x;
      r === Le && (e.key = null);
      const o = ce("value", e.value, t, s);
      if (o === x)
        return x;
      o === Le && (e.value = null);
    }
  }
  return i;
}
function Yn(n) {
  return typeof n == "object" && (n.Collection || n.Node || n.Value) ? Object.assign({
    Alias: n.Node,
    Map: n.Node,
    Scalar: n.Node,
    Seq: n.Node
  }, n.Value && {
    Map: n.Value,
    Scalar: n.Value,
    Seq: n.Value
  }, n.Collection && {
    Map: n.Collection,
    Seq: n.Collection
  }, n) : n;
}
function Jn(n, e, t, s) {
  var i, r, o, a, l;
  if (typeof t == "function")
    return t(n, e, s);
  if (Fe(e))
    return (i = t.Map) == null ? void 0 : i.call(t, n, e, s);
  if (He(e))
    return (r = t.Seq) == null ? void 0 : r.call(t, n, e, s);
  if (I(e))
    return (o = t.Pair) == null ? void 0 : o.call(t, n, e, s);
  if (v(e))
    return (a = t.Scalar) == null ? void 0 : a.call(t, n, e, s);
  if (ke(e))
    return (l = t.Alias) == null ? void 0 : l.call(t, n, e, s);
}
function Gn(n, e, t) {
  const s = e[e.length - 1];
  if (T(s))
    s.items[n] = t;
  else if (I(s))
    n === "key" ? s.key = t : s.value = t;
  else if (qe(s))
    s.contents = t;
  else {
    const i = ke(s) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${i} parent`);
  }
}
const Qn = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
}, zn = (n) => n.replace(/[!,[\]{}]/g, (e) => Qn[e]);
class P {
  constructor(e, t) {
    this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, P.defaultYaml, e), this.tags = Object.assign({}, P.defaultTags, t);
  }
  clone() {
    const e = new P(this.yaml, this.tags);
    return e.docStart = this.docStart, e;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const e = new P(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = !0;
        break;
      case "1.2":
        this.atNextDocument = !1, this.yaml = {
          explicit: P.defaultYaml.explicit,
          version: "1.2"
        }, this.tags = Object.assign({}, P.defaultTags);
        break;
    }
    return e;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(e, t) {
    this.atNextDocument && (this.yaml = { explicit: P.defaultYaml.explicit, version: "1.1" }, this.tags = Object.assign({}, P.defaultTags), this.atNextDocument = !1);
    const s = e.trim().split(/[ \t]+/), i = s.shift();
    switch (i) {
      case "%TAG": {
        if (s.length !== 2 && (t(0, "%TAG directive should contain exactly two parts"), s.length < 2))
          return !1;
        const [r, o] = s;
        return this.tags[r] = o, !0;
      }
      case "%YAML": {
        if (this.yaml.explicit = !0, s.length !== 1)
          return t(0, "%YAML directive should contain exactly one part"), !1;
        const [r] = s;
        if (r === "1.1" || r === "1.2")
          return this.yaml.version = r, !0;
        {
          const o = /^\d+\.\d+$/.test(r);
          return t(6, `Unsupported YAML version ${r}`, o), !1;
        }
      }
      default:
        return t(0, `Unknown directive ${i}`, !0), !1;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(e, t) {
    if (e === "!")
      return "!";
    if (e[0] !== "!")
      return t(`Not a valid tag: ${e}`), null;
    if (e[1] === "<") {
      const o = e.slice(2, -1);
      return o === "!" || o === "!!" ? (t(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && t("Verbatim tags must end with a >"), o);
    }
    const [, s, i] = e.match(/^(.*!)([^!]*)$/s);
    i || t(`The ${e} tag has no suffix`);
    const r = this.tags[s];
    if (r)
      try {
        return r + decodeURIComponent(i);
      } catch (o) {
        return t(String(o)), null;
      }
    return s === "!" ? e : (t(`Could not resolve tag: ${e}`), null);
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(e) {
    for (const [t, s] of Object.entries(this.tags))
      if (e.startsWith(s))
        return t + zn(e.substring(s.length));
    return e[0] === "!" ? e : `!<${e}>`;
  }
  toString(e) {
    const t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], s = Object.entries(this.tags);
    let i;
    if (e && s.length > 0 && C(e.contents)) {
      const r = {};
      Ae(e.contents, (o, a) => {
        C(a) && a.tag && (r[a.tag] = !0);
      }), i = Object.keys(r);
    } else
      i = [];
    for (const [r, o] of s)
      r === "!!" && o === "tag:yaml.org,2002:" || (!e || i.some((a) => a.startsWith(o))) && t.push(`%TAG ${r} ${o}`);
    return t.join(`
`);
  }
}
P.defaultYaml = { explicit: !1, version: "1.2" };
P.defaultTags = { "!!": "tag:yaml.org,2002:" };
function Us(n) {
  if (/[\x00-\x19\s,[\]{}]/.test(n)) {
    const t = `Anchor must not contain whitespace or control characters: ${JSON.stringify(n)}`;
    throw new Error(t);
  }
  return !0;
}
function Ks(n) {
  const e = /* @__PURE__ */ new Set();
  return Ae(n, {
    Value(t, s) {
      s.anchor && e.add(s.anchor);
    }
  }), e;
}
function Rs(n, e) {
  for (let t = 1; ; ++t) {
    const s = `${n}${t}`;
    if (!e.has(s))
      return s;
  }
}
function Xn(n, e) {
  const t = [], s = /* @__PURE__ */ new Map();
  let i = null;
  return {
    onAnchor: (r) => {
      t.push(r), i ?? (i = Ks(n));
      const o = Rs(e, i);
      return i.add(o), o;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const r of t) {
        const o = s.get(r);
        if (typeof o == "object" && o.anchor && (v(o.node) || T(o.node)))
          o.node.anchor = o.anchor;
        else {
          const a = new Error("Failed to resolve repeated object (this should not happen)");
          throw a.source = r, a;
        }
      }
    },
    sourceObjects: s
  };
}
function fe(n, e, t, s) {
  if (s && typeof s == "object")
    if (Array.isArray(s))
      for (let i = 0, r = s.length; i < r; ++i) {
        const o = s[i], a = fe(n, s, String(i), o);
        a === void 0 ? delete s[i] : a !== o && (s[i] = a);
      }
    else if (s instanceof Map)
      for (const i of Array.from(s.keys())) {
        const r = s.get(i), o = fe(n, s, i, r);
        o === void 0 ? s.delete(i) : o !== r && s.set(i, o);
      }
    else if (s instanceof Set)
      for (const i of Array.from(s)) {
        const r = fe(n, s, i, i);
        r === void 0 ? s.delete(i) : r !== i && (s.delete(i), s.add(r));
      }
    else
      for (const [i, r] of Object.entries(s)) {
        const o = fe(n, s, i, r);
        o === void 0 ? delete s[i] : o !== r && (s[i] = o);
      }
  return n.call(e, t, s);
}
function B(n, e, t) {
  if (Array.isArray(n))
    return n.map((s, i) => B(s, String(i), t));
  if (n && typeof n.toJSON == "function") {
    if (!t || !js(n))
      return n.toJSON(e, t);
    const s = { aliasCount: 0, count: 1, res: void 0 };
    t.anchors.set(n, s), t.onCreate = (r) => {
      s.res = r, delete t.onCreate;
    };
    const i = n.toJSON(e, t);
    return t.onCreate && t.onCreate(i), i;
  }
  return typeof n == "bigint" && !(t != null && t.keep) ? Number(n) : n;
}
class qt {
  constructor(e) {
    Object.defineProperty(this, j, { value: e });
  }
  /** Create a copy of this node.  */
  clone() {
    const e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return this.range && (e.range = this.range.slice()), e;
  }
  /** A plain JavaScript representation of this node. */
  toJS(e, { mapAsMap: t, maxAliasCount: s, onAnchor: i, reviver: r } = {}) {
    if (!qe(e))
      throw new TypeError("A document argument is required");
    const o = {
      anchors: /* @__PURE__ */ new Map(),
      doc: e,
      keep: !0,
      mapAsMap: t === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof s == "number" ? s : 100
    }, a = B(this, "", o);
    if (typeof i == "function")
      for (const { count: l, res: c } of o.anchors.values())
        i(c, l);
    return typeof r == "function" ? fe(r, { "": a }, "", a) : a;
  }
}
class Ft extends qt {
  constructor(e) {
    super(Rt), this.source = e, Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(e, t) {
    if ((t == null ? void 0 : t.maxAliasCount) === 0)
      throw new ReferenceError("Alias resolution is disabled");
    let s;
    t != null && t.aliasResolveCache ? s = t.aliasResolveCache : (s = [], Ae(e, {
      Node: (r, o) => {
        (ke(o) || js(o)) && s.push(o);
      }
    }), t && (t.aliasResolveCache = s));
    let i;
    for (const r of s) {
      if (r === this)
        break;
      r.anchor === this.source && (i = r);
    }
    return i;
  }
  toJSON(e, t) {
    if (!t)
      return { source: this.source };
    const { anchors: s, doc: i, maxAliasCount: r } = t, o = this.resolve(i, t);
    if (!o) {
      const l = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(l);
    }
    let a = s.get(o);
    if (a || (B(o, null, t), a = s.get(o)), (a == null ? void 0 : a.res) === void 0) {
      const l = "This should not happen: Alias anchor was not resolved?";
      throw new ReferenceError(l);
    }
    if (r >= 0 && (a.count += 1, a.aliasCount === 0 && (a.aliasCount = xe(i, o, s)), a.count * a.aliasCount > r)) {
      const l = "Excessive alias count indicates a resource exhaustion attack";
      throw new ReferenceError(l);
    }
    return a.res;
  }
  toString(e, t, s) {
    const i = `*${this.source}`;
    if (e) {
      if (Us(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
        const r = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(r);
      }
      if (e.implicitKey)
        return `${i} `;
    }
    return i;
  }
}
function xe(n, e, t) {
  if (ke(e)) {
    const s = e.resolve(n), i = t && s && t.get(s);
    return i ? i.count * i.aliasCount : 0;
  } else if (T(e)) {
    let s = 0;
    for (const i of e.items) {
      const r = xe(n, i, t);
      r > s && (s = r);
    }
    return s;
  } else if (I(e)) {
    const s = xe(n, e.key, t), i = xe(n, e.value, t);
    return Math.max(s, i);
  }
  return 1;
}
const qs = (n) => !n || typeof n != "function" && typeof n != "object";
class A extends qt {
  constructor(e) {
    super(F), this.value = e;
  }
  toJSON(e, t) {
    return t != null && t.keep ? this.value : B(this.value, e, t);
  }
  toString() {
    return String(this.value);
  }
}
A.BLOCK_FOLDED = "BLOCK_FOLDED";
A.BLOCK_LITERAL = "BLOCK_LITERAL";
A.PLAIN = "PLAIN";
A.QUOTE_DOUBLE = "QUOTE_DOUBLE";
A.QUOTE_SINGLE = "QUOTE_SINGLE";
const Zn = "tag:yaml.org,2002:";
function xn(n, e, t) {
  if (e) {
    const s = t.filter((r) => r.tag === e), i = s.find((r) => !r.format) ?? s[0];
    if (!i)
      throw new Error(`Tag ${e} not found`);
    return i;
  }
  return t.find((s) => {
    var i;
    return ((i = s.identify) == null ? void 0 : i.call(s, n)) && !s.format;
  });
}
function je(n, e, t) {
  var f, p, u;
  if (qe(n) && (n = n.contents), C(n))
    return n;
  if (I(n)) {
    const g = (p = (f = t.schema[X]).createNode) == null ? void 0 : p.call(f, t.schema, null, t);
    return g.items.push(n), g;
  }
  (n instanceof String || n instanceof Number || n instanceof Boolean || typeof BigInt < "u" && n instanceof BigInt) && (n = n.valueOf());
  const { aliasDuplicateObjects: s, onAnchor: i, onTagObj: r, schema: o, sourceObjects: a } = t;
  let l;
  if (s && n && typeof n == "object") {
    if (l = a.get(n), l)
      return l.anchor ?? (l.anchor = i(n)), new Ft(l.anchor);
    l = { anchor: null, node: null }, a.set(n, l);
  }
  e != null && e.startsWith("!!") && (e = Zn + e.slice(2));
  let c = xn(n, e, o.tags);
  if (!c) {
    if (n && typeof n.toJSON == "function" && (n = n.toJSON()), !n || typeof n != "object") {
      const g = new A(n);
      return l && (l.node = g), g;
    }
    c = n instanceof Map ? o[X] : Symbol.iterator in Object(n) ? o[$e] : o[X];
  }
  r && (r(c), delete t.onTagObj);
  const d = c != null && c.createNode ? c.createNode(t.schema, n, t) : typeof ((u = c == null ? void 0 : c.nodeClass) == null ? void 0 : u.from) == "function" ? c.nodeClass.from(t.schema, n, t) : new A(n);
  return e ? d.tag = e : c.default || (d.tag = c.tag), l && (l.node = d), d;
}
function it(n, e, t) {
  let s = t;
  for (let i = e.length - 1; i >= 0; --i) {
    const r = e[i];
    if (typeof r == "number" && Number.isInteger(r) && r >= 0) {
      const o = [];
      o[r] = s, s = o;
    } else
      s = /* @__PURE__ */ new Map([[r, s]]);
  }
  return je(s, void 0, {
    aliasDuplicateObjects: !1,
    keepUndefined: !1,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: n,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
const Oe = (n) => n == null || typeof n == "object" && !!n[Symbol.iterator]().next().done;
class Fs extends qt {
  constructor(e, t) {
    super(e), Object.defineProperty(this, "schema", {
      value: t,
      configurable: !0,
      enumerable: !1,
      writable: !0
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(e) {
    const t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return e && (t.schema = e), t.items = t.items.map((s) => C(s) || I(s) ? s.clone(e) : s), this.range && (t.range = this.range.slice()), t;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(e, t) {
    if (Oe(e))
      this.add(t);
    else {
      const [s, ...i] = e, r = this.get(s, !0);
      if (T(r))
        r.addIn(i, t);
      else if (r === void 0 && this.schema)
        this.set(s, it(this.schema, i, t));
      else
        throw new Error(`Expected YAML collection at ${s}. Remaining path: ${i}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    const [t, ...s] = e;
    if (s.length === 0)
      return this.delete(t);
    const i = this.get(t, !0);
    if (T(i))
      return i.deleteIn(s);
    throw new Error(`Expected YAML collection at ${t}. Remaining path: ${s}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, t) {
    const [s, ...i] = e, r = this.get(s, !0);
    return i.length === 0 ? !t && v(r) ? r.value : r : T(r) ? r.getIn(i, t) : void 0;
  }
  hasAllNullValues(e) {
    return this.items.every((t) => {
      if (!I(t))
        return !1;
      const s = t.value;
      return s == null || e && v(s) && s.value == null && !s.commentBefore && !s.comment && !s.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(e) {
    const [t, ...s] = e;
    if (s.length === 0)
      return this.has(t);
    const i = this.get(t, !0);
    return T(i) ? i.hasIn(s) : !1;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, t) {
    const [s, ...i] = e;
    if (i.length === 0)
      this.set(s, t);
    else {
      const r = this.get(s, !0);
      if (T(r))
        r.setIn(i, t);
      else if (r === void 0 && this.schema)
        this.set(s, it(this.schema, i, t));
      else
        throw new Error(`Expected YAML collection at ${s}. Remaining path: ${i}`);
    }
  }
}
const ei = (n) => n.replace(/^(?!$)(?: $)?/gm, "#");
function W(n, e) {
  return /^\n+$/.test(n) ? n.substring(1) : e ? n.replace(/^(?! *$)/gm, e) : n;
}
const te = (n, e, t) => n.endsWith(`
`) ? W(t, e) : t.includes(`
`) ? `
` + W(t, e) : (n.endsWith(" ") ? "" : " ") + t, Hs = "flow", Tt = "block", et = "quoted";
function ct(n, e, t = "flow", { indentAtStart: s, lineWidth: i = 80, minContentWidth: r = 20, onFold: o, onOverflow: a } = {}) {
  if (!i || i < 0)
    return n;
  i < r && (r = 0);
  const l = Math.max(1 + r, 1 + i - e.length);
  if (n.length <= l)
    return n;
  const c = [], d = {};
  let f = i - e.length;
  typeof s == "number" && (s > i - Math.max(2, r) ? c.push(0) : f = i - s);
  let p, u, g = !1, h = -1, m = -1, y = -1;
  t === Tt && (h = ms(n, h, e.length), h !== -1 && (f = h + l));
  for (let $; $ = n[h += 1]; ) {
    if (t === et && $ === "\\") {
      switch (m = h, n[h + 1]) {
        case "x":
          h += 3;
          break;
        case "u":
          h += 5;
          break;
        case "U":
          h += 9;
          break;
        default:
          h += 1;
      }
      y = h;
    }
    if ($ === `
`)
      t === Tt && (h = ms(n, h, e.length)), f = h + e.length + l, p = void 0;
    else {
      if ($ === " " && u && u !== " " && u !== `
` && u !== "	") {
        const S = n[h + 1];
        S && S !== " " && S !== `
` && S !== "	" && (p = h);
      }
      if (h >= f)
        if (p)
          c.push(p), f = p + l, p = void 0;
        else if (t === et) {
          for (; u === " " || u === "	"; )
            u = $, $ = n[h += 1], g = !0;
          const S = h > y + 1 ? h - 2 : m - 1;
          if (d[S])
            return n;
          c.push(S), d[S] = !0, f = S + l, p = void 0;
        } else
          g = !0;
    }
    u = $;
  }
  if (g && a && a(), c.length === 0)
    return n;
  o && o();
  let b = n.slice(0, c[0]);
  for (let $ = 0; $ < c.length; ++$) {
    const S = c[$], k = c[$ + 1] || n.length;
    S === 0 ? b = `
${e}${n.slice(0, k)}` : (t === et && d[S] && (b += `${n[S]}\\`), b += `
${e}${n.slice(S + 1, k)}`);
  }
  return b;
}
function ms(n, e, t) {
  let s = e, i = e + 1, r = n[i];
  for (; r === " " || r === "	"; )
    if (e < i + t)
      r = n[++e];
    else {
      do
        r = n[++e];
      while (r && r !== `
`);
      s = e, i = e + 1, r = n[i];
    }
  return s;
}
const ft = (n, e) => ({
  indentAtStart: e ? n.indent.length : n.indentAtStart,
  lineWidth: n.options.lineWidth,
  minContentWidth: n.options.minContentWidth
}), ut = (n) => /^(%|---|\.\.\.)/m.test(n);
function ti(n, e, t) {
  if (!e || e < 0)
    return !1;
  const s = e - t, i = n.length;
  if (i <= s)
    return !1;
  for (let r = 0, o = 0; r < i; ++r)
    if (n[r] === `
`) {
      if (r - o > s)
        return !0;
      if (o = r + 1, i - o <= s)
        return !1;
    }
  return !0;
}
function Pe(n, e) {
  const t = JSON.stringify(n);
  if (e.options.doubleQuotedAsJSON)
    return t;
  const { implicitKey: s } = e, i = e.options.doubleQuotedMinMultiLineLength, r = e.indent || (ut(n) ? "  " : "");
  let o = "", a = 0;
  for (let l = 0, c = t[l]; c; c = t[++l])
    if (c === " " && t[l + 1] === "\\" && t[l + 2] === "n" && (o += t.slice(a, l) + "\\ ", l += 1, a = l, c = "\\"), c === "\\")
      switch (t[l + 1]) {
        case "u":
          {
            o += t.slice(a, l);
            const d = t.substr(l + 2, 4);
            switch (d) {
              case "0000":
                o += "\\0";
                break;
              case "0007":
                o += "\\a";
                break;
              case "000b":
                o += "\\v";
                break;
              case "001b":
                o += "\\e";
                break;
              case "0085":
                o += "\\N";
                break;
              case "00a0":
                o += "\\_";
                break;
              case "2028":
                o += "\\L";
                break;
              case "2029":
                o += "\\P";
                break;
              default:
                d.substr(0, 2) === "00" ? o += "\\x" + d.substr(2) : o += t.substr(l, 6);
            }
            l += 5, a = l + 1;
          }
          break;
        case "n":
          if (s || t[l + 2] === '"' || t.length < i)
            l += 1;
          else {
            for (o += t.slice(a, l) + `

`; t[l + 2] === "\\" && t[l + 3] === "n" && t[l + 4] !== '"'; )
              o += `
`, l += 2;
            o += r, t[l + 2] === " " && (o += "\\"), l += 1, a = l + 1;
          }
          break;
        default:
          l += 1;
      }
  return o = a ? o + t.slice(a) : t, s ? o : ct(o, r, et, ft(e, !1));
}
function Ct(n, e) {
  if (e.options.singleQuote === !1 || e.implicitKey && n.includes(`
`) || /[ \t]\n|\n[ \t]/.test(n))
    return Pe(n, e);
  const t = e.indent || (ut(n) ? "  " : ""), s = "'" + n.replace(/'/g, "''").replace(/\n+/g, `$&
${t}`) + "'";
  return e.implicitKey ? s : ct(s, t, Hs, ft(e, !1));
}
function ue(n, e) {
  const { singleQuote: t } = e.options;
  let s;
  if (t === !1)
    s = Pe;
  else {
    const i = n.includes('"'), r = n.includes("'");
    i && !r ? s = Ct : r && !i ? s = Pe : s = t ? Ct : Pe;
  }
  return s(n, e);
}
let It;
try {
  It = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
} catch {
  It = /\n+(?!\n|$)/g;
}
function tt({ comment: n, type: e, value: t }, s, i, r) {
  const { blockQuote: o, commentString: a, lineWidth: l } = s.options;
  if (!o || /\n[\t ]+$/.test(t))
    return ue(t, s);
  const c = s.indent || (s.forceBlockIndent || ut(t) ? "  " : ""), d = o === "literal" ? !0 : o === "folded" || e === A.BLOCK_FOLDED ? !1 : e === A.BLOCK_LITERAL ? !0 : !ti(t, l, c.length);
  if (!t)
    return d ? `|
` : `>
`;
  let f, p;
  for (p = t.length; p > 0; --p) {
    const k = t[p - 1];
    if (k !== `
` && k !== "	" && k !== " ")
      break;
  }
  let u = t.substring(p);
  const g = u.indexOf(`
`);
  g === -1 ? f = "-" : t === u || g !== u.length - 1 ? (f = "+", r && r()) : f = "", u && (t = t.slice(0, -u.length), u[u.length - 1] === `
` && (u = u.slice(0, -1)), u = u.replace(It, `$&${c}`));
  let h = !1, m, y = -1;
  for (m = 0; m < t.length; ++m) {
    const k = t[m];
    if (k === " ")
      h = !0;
    else if (k === `
`)
      y = m;
    else
      break;
  }
  let b = t.substring(0, y < m ? y + 1 : m);
  b && (t = t.substring(b.length), b = b.replace(/\n+/g, `$&${c}`));
  let S = (h ? c ? "2" : "1" : "") + f;
  if (n && (S += " " + a(n.replace(/ ?[\r\n]+/g, " ")), i && i()), !d) {
    const k = t.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${c}`);
    let _ = !1;
    const E = ft(s, !0);
    o !== "folded" && e !== A.BLOCK_FOLDED && (E.onOverflow = () => {
      _ = !0;
    });
    const w = ct(`${b}${k}${u}`, c, Tt, E);
    if (!_)
      return `>${S}
${c}${w}`;
  }
  return t = t.replace(/\n+/g, `$&${c}`), `|${S}
${c}${b}${t}${u}`;
}
function si(n, e, t, s) {
  const { type: i, value: r } = n, { actualString: o, implicitKey: a, indent: l, indentStep: c, inFlow: d } = e;
  if (a && r.includes(`
`) || d && /[[\]{},]/.test(r))
    return ue(r, e);
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(r))
    return a || d || !r.includes(`
`) ? ue(r, e) : tt(n, e, t, s);
  if (!a && !d && i !== A.PLAIN && r.includes(`
`))
    return tt(n, e, t, s);
  if (ut(r)) {
    if (l === "")
      return e.forceBlockIndent = !0, tt(n, e, t, s);
    if (a && l === c)
      return ue(r, e);
  }
  const f = r.replace(/\n+/g, `$&
${l}`);
  if (o) {
    const p = (h) => {
      var m;
      return h.default && h.tag !== "tag:yaml.org,2002:str" && ((m = h.test) == null ? void 0 : m.test(f));
    }, { compat: u, tags: g } = e.doc.schema;
    if (g.some(p) || u != null && u.some(p))
      return ue(r, e);
  }
  return a ? f : ct(f, l, Hs, ft(e, !1));
}
function Ht(n, e, t, s) {
  const { implicitKey: i, inFlow: r } = e, o = typeof n.value == "string" ? n : Object.assign({}, n, { value: String(n.value) });
  let { type: a } = n;
  a !== A.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) && (a = A.QUOTE_DOUBLE);
  const l = (d) => {
    switch (d) {
      case A.BLOCK_FOLDED:
      case A.BLOCK_LITERAL:
        return i || r ? ue(o.value, e) : tt(o, e, t, s);
      case A.QUOTE_DOUBLE:
        return Pe(o.value, e);
      case A.QUOTE_SINGLE:
        return Ct(o.value, e);
      case A.PLAIN:
        return si(o, e, t, s);
      default:
        return null;
    }
  };
  let c = l(a);
  if (c === null) {
    const { defaultKeyType: d, defaultStringType: f } = e.options, p = i && d || f;
    if (c = l(p), c === null)
      throw new Error(`Unsupported default string type ${p}`);
  }
  return c;
}
function Vs(n, e) {
  const t = Object.assign({
    blockQuote: !0,
    commentString: ei,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: !1,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: !0,
    indentSeq: !0,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: !1,
    singleQuote: null,
    trailingComma: !1,
    trueStr: "true",
    verifyAliasOrder: !0
  }, n.schema.toStringOptions, e);
  let s;
  switch (t.collectionStyle) {
    case "block":
      s = !1;
      break;
    case "flow":
      s = !0;
      break;
    default:
      s = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc: n,
    flowCollectionPadding: t.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof t.indent == "number" ? " ".repeat(t.indent) : "  ",
    inFlow: s,
    options: t
  };
}
function ni(n, e) {
  var i;
  if (e.tag) {
    const r = n.filter((o) => o.tag === e.tag);
    if (r.length > 0)
      return r.find((o) => o.format === e.format) ?? r[0];
  }
  let t, s;
  if (v(e)) {
    s = e.value;
    let r = n.filter((o) => {
      var a;
      return (a = o.identify) == null ? void 0 : a.call(o, s);
    });
    if (r.length > 1) {
      const o = r.filter((a) => a.test);
      o.length > 0 && (r = o);
    }
    t = r.find((o) => o.format === e.format) ?? r.find((o) => !o.format);
  } else
    s = e, t = n.find((r) => r.nodeClass && s instanceof r.nodeClass);
  if (!t) {
    const r = ((i = s == null ? void 0 : s.constructor) == null ? void 0 : i.name) ?? (s === null ? "null" : typeof s);
    throw new Error(`Tag not resolved for ${r} value`);
  }
  return t;
}
function ii(n, e, { anchors: t, doc: s }) {
  if (!s.directives)
    return "";
  const i = [], r = (v(n) || T(n)) && n.anchor;
  r && Us(r) && (t.add(r), i.push(`&${r}`));
  const o = n.tag ?? (e.default ? null : e.tag);
  return o && i.push(s.directives.tagString(o)), i.join(" ");
}
function ye(n, e, t, s) {
  var l;
  if (I(n))
    return n.toString(e, t, s);
  if (ke(n)) {
    if (e.doc.directives)
      return n.toString(e);
    if ((l = e.resolvedAliases) != null && l.has(n))
      throw new TypeError("Cannot stringify circular structure without alias nodes");
    e.resolvedAliases ? e.resolvedAliases.add(n) : e.resolvedAliases = /* @__PURE__ */ new Set([n]), n = n.resolve(e.doc);
  }
  let i;
  const r = C(n) ? n : e.doc.createNode(n, { onTagObj: (c) => i = c });
  i ?? (i = ni(e.doc.schema.tags, r));
  const o = ii(r, i, e);
  o.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + o.length + 1);
  const a = typeof i.stringify == "function" ? i.stringify(r, e, t, s) : v(r) ? Ht(r, e, t, s) : r.toString(e, t, s);
  return o ? v(r) || a[0] === "{" || a[0] === "[" ? `${o} ${a}` : `${o}
${e.indent}${a}` : a;
}
function ri({ key: n, value: e }, t, s, i) {
  const { allNullValues: r, doc: o, indent: a, indentStep: l, options: { commentString: c, indentSeq: d, simpleKeys: f } } = t;
  let p = C(n) && n.comment || null;
  if (f) {
    if (p)
      throw new Error("With simple keys, key nodes cannot have comments");
    if (T(n) || !C(n) && typeof n == "object") {
      const E = "With simple keys, collection cannot be used as a key value";
      throw new Error(E);
    }
  }
  let u = !f && (!n || p && e == null && !t.inFlow || T(n) || (v(n) ? n.type === A.BLOCK_FOLDED || n.type === A.BLOCK_LITERAL : typeof n == "object"));
  t = Object.assign({}, t, {
    allNullValues: !1,
    implicitKey: !u && (f || !r),
    indent: a + l
  });
  let g = !1, h = !1, m = ye(n, t, () => g = !0, () => h = !0);
  if (!u && !t.inFlow && m.length > 1024) {
    if (f)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    u = !0;
  }
  if (t.inFlow) {
    if (r || e == null)
      return g && s && s(), m === "" ? "?" : u ? `? ${m}` : m;
  } else if (r && !f || e == null && u)
    return m = `? ${m}`, p && !g ? m += te(m, t.indent, c(p)) : h && i && i(), m;
  g && (p = null), u ? (p && (m += te(m, t.indent, c(p))), m = `? ${m}
${a}:`) : (m = `${m}:`, p && (m += te(m, t.indent, c(p))));
  let y, b, $;
  C(e) ? (y = !!e.spaceBefore, b = e.commentBefore, $ = e.comment) : (y = !1, b = null, $ = null, e && typeof e == "object" && (e = o.createNode(e))), t.implicitKey = !1, !u && !p && v(e) && (t.indentAtStart = m.length + 1), h = !1, !d && l.length >= 2 && !t.inFlow && !u && He(e) && !e.flow && !e.tag && !e.anchor && (t.indent = t.indent.substring(2));
  let S = !1;
  const k = ye(e, t, () => S = !0, () => h = !0);
  let _ = " ";
  if (p || y || b) {
    if (_ = y ? `
` : "", b) {
      const E = c(b);
      _ += `
${W(E, t.indent)}`;
    }
    k === "" && !t.inFlow ? _ === `
` && $ && (_ = `

`) : _ += `
${t.indent}`;
  } else if (!u && T(e)) {
    const E = k[0], w = k.indexOf(`
`), N = w !== -1, L = t.inFlow ?? e.flow ?? e.items.length === 0;
    if (N || !L) {
      let H = !1;
      if (N && (E === "&" || E === "!")) {
        let U = k.indexOf(" ");
        E === "&" && U !== -1 && U < w && k[U + 1] === "!" && (U = k.indexOf(" ", U + 1)), (U === -1 || w < U) && (H = !0);
      }
      H || (_ = `
${t.indent}`);
    }
  } else (k === "" || k[0] === `
`) && (_ = "");
  return m += _ + k, t.inFlow ? S && s && s() : $ && !S ? m += te(m, t.indent, c($)) : h && i && i(), m;
}
function Ws(n, e) {
  (n === "debug" || n === "warn") && console.warn(e);
}
const Je = "<<", Y = {
  identify: (n) => n === Je || typeof n == "symbol" && n.description === Je,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new A(Symbol(Je)), {
    addToJSMap: Ys
  }),
  stringify: () => Je
}, oi = (n, e) => (Y.identify(e) || v(e) && (!e.type || e.type === A.PLAIN) && Y.identify(e.value)) && (n == null ? void 0 : n.doc.schema.tags.some((t) => t.tag === Y.tag && t.default));
function Ys(n, e, t) {
  const s = Js(n, t);
  if (He(s))
    for (const i of s.items)
      kt(n, e, i);
  else if (Array.isArray(s))
    for (const i of s)
      kt(n, e, i);
  else
    kt(n, e, s);
}
function kt(n, e, t) {
  const s = Js(n, t);
  if (!Fe(s))
    throw new Error("Merge sources must be maps or map aliases");
  const i = s.toJSON(null, n, Map);
  for (const [r, o] of i)
    e instanceof Map ? e.has(r) || e.set(r, o) : e instanceof Set ? e.add(r) : Object.prototype.hasOwnProperty.call(e, r) || Object.defineProperty(e, r, {
      value: o,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  return e;
}
function Js(n, e) {
  return n && ke(e) ? e.resolve(n.doc, n) : e;
}
function Gs(n, e, { key: t, value: s }) {
  if (C(t) && t.addToJSMap)
    t.addToJSMap(n, e, s);
  else if (oi(n, t))
    Ys(n, e, s);
  else {
    const i = B(t, "", n);
    if (e instanceof Map)
      e.set(i, B(s, i, n));
    else if (e instanceof Set)
      e.add(i);
    else {
      const r = ai(t, i, n), o = B(s, r, n);
      r in e ? Object.defineProperty(e, r, {
        value: o,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }) : e[r] = o;
    }
  }
  return e;
}
function ai(n, e, t) {
  if (e === null)
    return "";
  if (typeof e != "object")
    return String(e);
  if (C(n) && (t != null && t.doc)) {
    const s = Vs(t.doc, {});
    s.anchors = /* @__PURE__ */ new Set();
    for (const r of t.anchors.keys())
      s.anchors.add(r.anchor);
    s.inFlow = !0, s.inStringifyKey = !0;
    const i = n.toString(s);
    if (!t.mapKeyWarned) {
      let r = JSON.stringify(i);
      r.length > 40 && (r = r.substring(0, 36) + '..."'), Ws(t.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${r}. Set mapAsMap: true to use object keys.`), t.mapKeyWarned = !0;
    }
    return i;
  }
  return JSON.stringify(e);
}
function Vt(n, e, t) {
  const s = je(n, void 0, t), i = je(e, void 0, t);
  return new M(s, i);
}
class M {
  constructor(e, t = null) {
    Object.defineProperty(this, j, { value: Bs }), this.key = e, this.value = t;
  }
  clone(e) {
    let { key: t, value: s } = this;
    return C(t) && (t = t.clone(e)), C(s) && (s = s.clone(e)), new M(t, s);
  }
  toJSON(e, t) {
    const s = t != null && t.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return Gs(t, s, this);
  }
  toString(e, t, s) {
    return e != null && e.doc ? ri(this, e, t, s) : JSON.stringify(this);
  }
}
function Qs(n, e, t) {
  return (e.inFlow ?? n.flow ? ci : li)(n, e, t);
}
function li({ comment: n, items: e }, t, { blockItemPrefix: s, flowChars: i, itemIndent: r, onChompKeep: o, onComment: a }) {
  const { indent: l, options: { commentString: c } } = t, d = Object.assign({}, t, { indent: r, type: null });
  let f = !1;
  const p = [];
  for (let g = 0; g < e.length; ++g) {
    const h = e[g];
    let m = null;
    if (C(h))
      !f && h.spaceBefore && p.push(""), rt(t, p, h.commentBefore, f), h.comment && (m = h.comment);
    else if (I(h)) {
      const b = C(h.key) ? h.key : null;
      b && (!f && b.spaceBefore && p.push(""), rt(t, p, b.commentBefore, f));
    }
    f = !1;
    let y = ye(h, d, () => m = null, () => f = !0);
    m && (y += te(y, r, c(m))), f && m && (f = !1), p.push(s + y);
  }
  let u;
  if (p.length === 0)
    u = i.start + i.end;
  else {
    u = p[0];
    for (let g = 1; g < p.length; ++g) {
      const h = p[g];
      u += h ? `
${l}${h}` : `
`;
    }
  }
  return n ? (u += `
` + W(c(n), l), a && a()) : f && o && o(), u;
}
function ci({ items: n }, e, { flowChars: t, itemIndent: s }) {
  const { indent: i, indentStep: r, flowCollectionPadding: o, options: { commentString: a } } = e;
  s += r;
  const l = Object.assign({}, e, {
    indent: s,
    inFlow: !0,
    type: null
  });
  let c = !1, d = 0;
  const f = [];
  for (let g = 0; g < n.length; ++g) {
    const h = n[g];
    let m = null;
    if (C(h))
      h.spaceBefore && f.push(""), rt(e, f, h.commentBefore, !1), h.comment && (m = h.comment);
    else if (I(h)) {
      const b = C(h.key) ? h.key : null;
      b && (b.spaceBefore && f.push(""), rt(e, f, b.commentBefore, !1), b.comment && (c = !0));
      const $ = C(h.value) ? h.value : null;
      $ ? ($.comment && (m = $.comment), $.commentBefore && (c = !0)) : h.value == null && (b != null && b.comment) && (m = b.comment);
    }
    m && (c = !0);
    let y = ye(h, l, () => m = null);
    c || (c = f.length > d || y.includes(`
`)), g < n.length - 1 ? y += "," : e.options.trailingComma && (e.options.lineWidth > 0 && (c || (c = f.reduce((b, $) => b + $.length + 2, 2) + (y.length + 2) > e.options.lineWidth)), c && (y += ",")), m && (y += te(y, s, a(m))), f.push(y), d = f.length;
  }
  const { start: p, end: u } = t;
  if (f.length === 0)
    return p + u;
  if (!c) {
    const g = f.reduce((h, m) => h + m.length + 2, 2);
    c = e.options.lineWidth > 0 && g > e.options.lineWidth;
  }
  if (c) {
    let g = p;
    for (const h of f)
      g += h ? `
${r}${i}${h}` : `
`;
    return `${g}
${i}${u}`;
  } else
    return `${p}${o}${f.join(" ")}${o}${u}`;
}
function rt({ indent: n, options: { commentString: e } }, t, s, i) {
  if (s && i && (s = s.replace(/^\n+/, "")), s) {
    const r = W(e(s), n);
    t.push(r.trimStart());
  }
}
function se(n, e) {
  const t = v(e) ? e.value : e;
  for (const s of n)
    if (I(s) && (s.key === e || s.key === t || v(s.key) && s.key.value === t))
      return s;
}
class D extends Fs {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(e) {
    super(X, e), this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(e, t, s) {
    const { keepUndefined: i, replacer: r } = s, o = new this(e), a = (l, c) => {
      if (typeof r == "function")
        c = r.call(t, l, c);
      else if (Array.isArray(r) && !r.includes(l))
        return;
      (c !== void 0 || i) && o.items.push(Vt(l, c, s));
    };
    if (t instanceof Map)
      for (const [l, c] of t)
        a(l, c);
    else if (t && typeof t == "object")
      for (const l of Object.keys(t))
        a(l, t[l]);
    return typeof e.sortMapEntries == "function" && o.items.sort(e.sortMapEntries), o;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(e, t) {
    var o;
    let s;
    I(e) ? s = e : !e || typeof e != "object" || !("key" in e) ? s = new M(e, e == null ? void 0 : e.value) : s = new M(e.key, e.value);
    const i = se(this.items, s.key), r = (o = this.schema) == null ? void 0 : o.sortMapEntries;
    if (i) {
      if (!t)
        throw new Error(`Key ${s.key} already set`);
      v(i.value) && qs(s.value) ? i.value.value = s.value : i.value = s.value;
    } else if (r) {
      const a = this.items.findIndex((l) => r(s, l) < 0);
      a === -1 ? this.items.push(s) : this.items.splice(a, 0, s);
    } else
      this.items.push(s);
  }
  delete(e) {
    const t = se(this.items, e);
    return t ? this.items.splice(this.items.indexOf(t), 1).length > 0 : !1;
  }
  get(e, t) {
    const s = se(this.items, e), i = s == null ? void 0 : s.value;
    return (!t && v(i) ? i.value : i) ?? void 0;
  }
  has(e) {
    return !!se(this.items, e);
  }
  set(e, t) {
    this.add(new M(e, t), !0);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(e, t, s) {
    const i = s ? new s() : t != null && t.mapAsMap ? /* @__PURE__ */ new Map() : {};
    t != null && t.onCreate && t.onCreate(i);
    for (const r of this.items)
      Gs(t, i, r);
    return i;
  }
  toString(e, t, s) {
    if (!e)
      return JSON.stringify(this);
    for (const i of this.items)
      if (!I(i))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(i)} instead`);
    return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), Qs(this, e, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: e.indent || "",
      onChompKeep: s,
      onComment: t
    });
  }
}
const Ee = {
  collection: "map",
  default: !0,
  nodeClass: D,
  tag: "tag:yaml.org,2002:map",
  resolve(n, e) {
    return Fe(n) || e("Expected a mapping for this tag"), n;
  },
  createNode: (n, e, t) => D.from(n, e, t)
};
class re extends Fs {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(e) {
    super($e, e), this.items = [];
  }
  add(e) {
    this.items.push(e);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    const t = Ge(e);
    return typeof t != "number" ? !1 : this.items.splice(t, 1).length > 0;
  }
  get(e, t) {
    const s = Ge(e);
    if (typeof s != "number")
      return;
    const i = this.items[s];
    return !t && v(i) ? i.value : i;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(e) {
    const t = Ge(e);
    return typeof t == "number" && t < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(e, t) {
    const s = Ge(e);
    if (typeof s != "number")
      throw new Error(`Expected a valid index, not ${e}.`);
    const i = this.items[s];
    v(i) && qs(t) ? i.value = t : this.items[s] = t;
  }
  toJSON(e, t) {
    const s = [];
    t != null && t.onCreate && t.onCreate(s);
    let i = 0;
    for (const r of this.items)
      s.push(B(r, String(i++), t));
    return s;
  }
  toString(e, t, s) {
    return e ? Qs(this, e, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (e.indent || "") + "  ",
      onChompKeep: s,
      onComment: t
    }) : JSON.stringify(this);
  }
  static from(e, t, s) {
    const { replacer: i } = s, r = new this(e);
    if (t && Symbol.iterator in Object(t)) {
      let o = 0;
      for (let a of t) {
        if (typeof i == "function") {
          const l = t instanceof Set ? a : String(o++);
          a = i.call(t, l, a);
        }
        r.items.push(je(a, void 0, s));
      }
    }
    return r;
  }
}
function Ge(n) {
  let e = v(n) ? n.value : n;
  return e && typeof e == "string" && (e = Number(e)), typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null;
}
const _e = {
  collection: "seq",
  default: !0,
  nodeClass: re,
  tag: "tag:yaml.org,2002:seq",
  resolve(n, e) {
    return He(n) || e("Expected a sequence for this tag"), n;
  },
  createNode: (n, e, t) => re.from(n, e, t)
}, ht = {
  identify: (n) => typeof n == "string",
  default: !0,
  tag: "tag:yaml.org,2002:str",
  resolve: (n) => n,
  stringify(n, e, t, s) {
    return e = Object.assign({ actualString: !0 }, e), Ht(n, e, t, s);
  }
}, dt = {
  identify: (n) => n == null,
  createNode: () => new A(null),
  default: !0,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new A(null),
  stringify: ({ source: n }, e) => typeof n == "string" && dt.test.test(n) ? n : e.options.nullStr
}, Wt = {
  identify: (n) => typeof n == "boolean",
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (n) => new A(n[0] === "t" || n[0] === "T"),
  stringify({ source: n, value: e }, t) {
    if (n && Wt.test.test(n)) {
      const s = n[0] === "t" || n[0] === "T";
      if (e === s)
        return n;
    }
    return e ? t.options.trueStr : t.options.falseStr;
  }
};
function q({ format: n, minFractionDigits: e, tag: t, value: s }) {
  if (typeof s == "bigint")
    return String(s);
  const i = typeof s == "number" ? s : Number(s);
  if (!isFinite(i))
    return isNaN(i) ? ".nan" : i < 0 ? "-.inf" : ".inf";
  let r = Object.is(s, -0) ? "-0" : JSON.stringify(s);
  if (!n && e && (!t || t === "tag:yaml.org,2002:float") && /^-?\d/.test(r) && !r.includes("e")) {
    let o = r.indexOf(".");
    o < 0 && (o = r.length, r += ".");
    let a = e - (r.length - o - 1);
    for (; a-- > 0; )
      r += "0";
  }
  return r;
}
const zs = {
  identify: (n) => typeof n == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (n) => n.slice(-3).toLowerCase() === "nan" ? NaN : n[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: q
}, Xs = {
  identify: (n) => typeof n == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (n) => parseFloat(n),
  stringify(n) {
    const e = Number(n.value);
    return isFinite(e) ? e.toExponential() : q(n);
  }
}, Zs = {
  identify: (n) => typeof n == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(n) {
    const e = new A(parseFloat(n)), t = n.indexOf(".");
    return t !== -1 && n[n.length - 1] === "0" && (e.minFractionDigits = n.length - t - 1), e;
  },
  stringify: q
}, pt = (n) => typeof n == "bigint" || Number.isInteger(n), Yt = (n, e, t, { intAsBigInt: s }) => s ? BigInt(n) : parseInt(n.substring(e), t);
function xs(n, e, t) {
  const { value: s } = n;
  return pt(s) && s >= 0 ? t + s.toString(e) : q(n);
}
const en = {
  identify: (n) => pt(n) && n >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (n, e, t) => Yt(n, 2, 8, t),
  stringify: (n) => xs(n, 8, "0o")
}, tn = {
  identify: pt,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (n, e, t) => Yt(n, 0, 10, t),
  stringify: q
}, sn = {
  identify: (n) => pt(n) && n >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (n, e, t) => Yt(n, 2, 16, t),
  stringify: (n) => xs(n, 16, "0x")
}, fi = [
  Ee,
  _e,
  ht,
  dt,
  Wt,
  en,
  tn,
  sn,
  zs,
  Xs,
  Zs
];
function gs(n) {
  return typeof n == "bigint" || Number.isInteger(n);
}
const Qe = ({ value: n }) => JSON.stringify(n), ui = [
  {
    identify: (n) => typeof n == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: (n) => n,
    stringify: Qe
  },
  {
    identify: (n) => n == null,
    createNode: () => new A(null),
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: Qe
  },
  {
    identify: (n) => typeof n == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (n) => n === "true",
    stringify: Qe
  },
  {
    identify: gs,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (n, e, { intAsBigInt: t }) => t ? BigInt(n) : parseInt(n, 10),
    stringify: ({ value: n }) => gs(n) ? n.toString() : JSON.stringify(n)
  },
  {
    identify: (n) => typeof n == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (n) => parseFloat(n),
    stringify: Qe
  }
], hi = {
  default: !0,
  tag: "",
  test: /^/,
  resolve(n, e) {
    return e(`Unresolved plain scalar ${JSON.stringify(n)}`), n;
  }
}, di = [Ee, _e].concat(ui, hi), Jt = {
  identify: (n) => n instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: !1,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(n, e) {
    if (typeof atob == "function") {
      const t = atob(n.replace(/[\n\r]/g, "")), s = new Uint8Array(t.length);
      for (let i = 0; i < t.length; ++i)
        s[i] = t.charCodeAt(i);
      return s;
    } else
      return e("This environment does not support reading binary tags; either Buffer or atob is required"), n;
  },
  stringify({ comment: n, type: e, value: t }, s, i, r) {
    if (!t)
      return "";
    const o = t;
    let a;
    if (typeof btoa == "function") {
      let l = "";
      for (let c = 0; c < o.length; ++c)
        l += String.fromCharCode(o[c]);
      a = btoa(l);
    } else
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    if (e ?? (e = A.BLOCK_LITERAL), e !== A.QUOTE_DOUBLE) {
      const l = Math.max(s.options.lineWidth - s.indent.length, s.options.minContentWidth), c = Math.ceil(a.length / l), d = new Array(c);
      for (let f = 0, p = 0; f < c; ++f, p += l)
        d[f] = a.substr(p, l);
      a = d.join(e === A.BLOCK_LITERAL ? `
` : " ");
    }
    return Ht({ comment: n, type: e, value: a }, s, i, r);
  }
};
function nn(n, e) {
  if (He(n))
    for (let t = 0; t < n.items.length; ++t) {
      let s = n.items[t];
      if (!I(s)) {
        if (Fe(s)) {
          s.items.length > 1 && e("Each pair must have its own sequence indicator");
          const i = s.items[0] || new M(new A(null));
          if (s.commentBefore && (i.key.commentBefore = i.key.commentBefore ? `${s.commentBefore}
${i.key.commentBefore}` : s.commentBefore), s.comment) {
            const r = i.value ?? i.key;
            r.comment = r.comment ? `${s.comment}
${r.comment}` : s.comment;
          }
          s = i;
        }
        n.items[t] = I(s) ? s : new M(s);
      }
    }
  else
    e("Expected a sequence for this tag");
  return n;
}
function rn(n, e, t) {
  const { replacer: s } = t, i = new re(n);
  i.tag = "tag:yaml.org,2002:pairs";
  let r = 0;
  if (e && Symbol.iterator in Object(e))
    for (let o of e) {
      typeof s == "function" && (o = s.call(e, String(r++), o));
      let a, l;
      if (Array.isArray(o))
        if (o.length === 2)
          a = o[0], l = o[1];
        else
          throw new TypeError(`Expected [key, value] tuple: ${o}`);
      else if (o && o instanceof Object) {
        const c = Object.keys(o);
        if (c.length === 1)
          a = c[0], l = o[a];
        else
          throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
      } else
        a = o;
      i.items.push(Vt(a, l, t));
    }
  return i;
}
const Gt = {
  collection: "seq",
  default: !1,
  tag: "tag:yaml.org,2002:pairs",
  resolve: nn,
  createNode: rn
};
class de extends re {
  constructor() {
    super(), this.add = D.prototype.add.bind(this), this.delete = D.prototype.delete.bind(this), this.get = D.prototype.get.bind(this), this.has = D.prototype.has.bind(this), this.set = D.prototype.set.bind(this), this.tag = de.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(e, t) {
    if (!t)
      return super.toJSON(e);
    const s = /* @__PURE__ */ new Map();
    t != null && t.onCreate && t.onCreate(s);
    for (const i of this.items) {
      let r, o;
      if (I(i) ? (r = B(i.key, "", t), o = B(i.value, r, t)) : r = B(i, "", t), s.has(r))
        throw new Error("Ordered maps must not include duplicate keys");
      s.set(r, o);
    }
    return s;
  }
  static from(e, t, s) {
    const i = rn(e, t, s), r = new this();
    return r.items = i.items, r;
  }
}
de.tag = "tag:yaml.org,2002:omap";
const Qt = {
  collection: "seq",
  identify: (n) => n instanceof Map,
  nodeClass: de,
  default: !1,
  tag: "tag:yaml.org,2002:omap",
  resolve(n, e) {
    const t = nn(n, e), s = [];
    for (const { key: i } of t.items)
      v(i) && (s.includes(i.value) ? e(`Ordered maps must not include duplicate keys: ${i.value}`) : s.push(i.value));
    return Object.assign(new de(), t);
  },
  createNode: (n, e, t) => de.from(n, e, t)
};
function on({ value: n, source: e }, t) {
  return e && (n ? an : ln).test.test(e) ? e : n ? t.options.trueStr : t.options.falseStr;
}
const an = {
  identify: (n) => n === !0,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new A(!0),
  stringify: on
}, ln = {
  identify: (n) => n === !1,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new A(!1),
  stringify: on
}, pi = {
  identify: (n) => typeof n == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (n) => n.slice(-3).toLowerCase() === "nan" ? NaN : n[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: q
}, mi = {
  identify: (n) => typeof n == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (n) => parseFloat(n.replace(/_/g, "")),
  stringify(n) {
    const e = Number(n.value);
    return isFinite(e) ? e.toExponential() : q(n);
  }
}, gi = {
  identify: (n) => typeof n == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(n) {
    const e = new A(parseFloat(n.replace(/_/g, ""))), t = n.indexOf(".");
    if (t !== -1) {
      const s = n.substring(t + 1).replace(/_/g, "");
      s[s.length - 1] === "0" && (e.minFractionDigits = s.length);
    }
    return e;
  },
  stringify: q
}, Ve = (n) => typeof n == "bigint" || Number.isInteger(n);
function mt(n, e, t, { intAsBigInt: s }) {
  const i = n[0];
  if ((i === "-" || i === "+") && (e += 1), n = n.substring(e).replace(/_/g, ""), s) {
    switch (t) {
      case 2:
        n = `0b${n}`;
        break;
      case 8:
        n = `0o${n}`;
        break;
      case 16:
        n = `0x${n}`;
        break;
    }
    const o = BigInt(n);
    return i === "-" ? BigInt(-1) * o : o;
  }
  const r = parseInt(n, t);
  return i === "-" ? -1 * r : r;
}
function zt(n, e, t) {
  const { value: s } = n;
  if (Ve(s)) {
    const i = s.toString(e);
    return s < 0 ? "-" + t + i.substr(1) : t + i;
  }
  return q(n);
}
const yi = {
  identify: Ve,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (n, e, t) => mt(n, 2, 2, t),
  stringify: (n) => zt(n, 2, "0b")
}, bi = {
  identify: Ve,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (n, e, t) => mt(n, 1, 8, t),
  stringify: (n) => zt(n, 8, "0")
}, wi = {
  identify: Ve,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (n, e, t) => mt(n, 0, 10, t),
  stringify: q
}, Si = {
  identify: Ve,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (n, e, t) => mt(n, 2, 16, t),
  stringify: (n) => zt(n, 16, "0x")
};
class pe extends D {
  constructor(e) {
    super(e), this.tag = pe.tag;
  }
  add(e) {
    let t;
    I(e) ? t = e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? t = new M(e.key, null) : t = new M(e, null), se(this.items, t.key) || this.items.push(t);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(e, t) {
    const s = se(this.items, e);
    return !t && I(s) ? v(s.key) ? s.key.value : s.key : s;
  }
  set(e, t) {
    if (typeof t != "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);
    const s = se(this.items, e);
    s && !t ? this.items.splice(this.items.indexOf(s), 1) : !s && t && this.items.push(new M(e));
  }
  toJSON(e, t) {
    return super.toJSON(e, t, Set);
  }
  toString(e, t, s) {
    if (!e)
      return JSON.stringify(this);
    if (this.hasAllNullValues(!0))
      return super.toString(Object.assign({}, e, { allNullValues: !0 }), t, s);
    throw new Error("Set items must all have null values");
  }
  static from(e, t, s) {
    const { replacer: i } = s, r = new this(e);
    if (t && Symbol.iterator in Object(t))
      for (let o of t)
        typeof i == "function" && (o = i.call(t, o, o)), r.items.push(Vt(o, null, s));
    return r;
  }
}
pe.tag = "tag:yaml.org,2002:set";
const Xt = {
  collection: "map",
  identify: (n) => n instanceof Set,
  nodeClass: pe,
  default: !1,
  tag: "tag:yaml.org,2002:set",
  createNode: (n, e, t) => pe.from(n, e, t),
  resolve(n, e) {
    if (Fe(n)) {
      if (n.hasAllNullValues(!0))
        return Object.assign(new pe(), n);
      e("Set items must all have null values");
    } else
      e("Expected a mapping for this tag");
    return n;
  }
};
function Zt(n, e) {
  const t = n[0], s = t === "-" || t === "+" ? n.substring(1) : n, i = (o) => e ? BigInt(o) : Number(o), r = s.replace(/_/g, "").split(":").reduce((o, a) => o * i(60) + i(a), i(0));
  return t === "-" ? i(-1) * r : r;
}
function cn(n) {
  let { value: e } = n, t = (o) => o;
  if (typeof e == "bigint")
    t = (o) => BigInt(o);
  else if (isNaN(e) || !isFinite(e))
    return q(n);
  let s = "";
  e < 0 && (s = "-", e *= t(-1));
  const i = t(60), r = [e % i];
  return e < 60 ? r.unshift(0) : (e = (e - r[0]) / i, r.unshift(e % i), e >= 60 && (e = (e - r[0]) / i, r.unshift(e))), s + r.map((o) => String(o).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
const fn = {
  identify: (n) => typeof n == "bigint" || Number.isInteger(n),
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (n, e, { intAsBigInt: t }) => Zt(n, t),
  stringify: cn
}, un = {
  identify: (n) => typeof n == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (n) => Zt(n, !1),
  stringify: cn
}, gt = {
  identify: (n) => n instanceof Date,
  default: !0,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(n) {
    const e = n.match(gt.test);
    if (!e)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, t, s, i, r, o, a] = e.map(Number), l = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0;
    let c = Date.UTC(t, s - 1, i, r || 0, o || 0, a || 0, l);
    const d = e[8];
    if (d && d !== "Z") {
      let f = Zt(d, !1);
      Math.abs(f) < 30 && (f *= 60), c -= 6e4 * f;
    }
    return new Date(c);
  },
  stringify: ({ value: n }) => (n == null ? void 0 : n.toISOString().replace(/(T00:00:00)?\.000Z$/, "")) ?? ""
}, ys = [
  Ee,
  _e,
  ht,
  dt,
  an,
  ln,
  yi,
  bi,
  wi,
  Si,
  pi,
  mi,
  gi,
  Jt,
  Y,
  Qt,
  Gt,
  Xt,
  fn,
  un,
  gt
], bs = /* @__PURE__ */ new Map([
  ["core", fi],
  ["failsafe", [Ee, _e, ht]],
  ["json", di],
  ["yaml11", ys],
  ["yaml-1.1", ys]
]), ws = {
  binary: Jt,
  bool: Wt,
  float: Zs,
  floatExp: Xs,
  floatNaN: zs,
  floatTime: un,
  int: tn,
  intHex: sn,
  intOct: en,
  intTime: fn,
  map: Ee,
  merge: Y,
  null: dt,
  omap: Qt,
  pairs: Gt,
  seq: _e,
  set: Xt,
  timestamp: gt
}, $i = {
  "tag:yaml.org,2002:binary": Jt,
  "tag:yaml.org,2002:merge": Y,
  "tag:yaml.org,2002:omap": Qt,
  "tag:yaml.org,2002:pairs": Gt,
  "tag:yaml.org,2002:set": Xt,
  "tag:yaml.org,2002:timestamp": gt
};
function At(n, e, t) {
  const s = bs.get(e);
  if (s && !n)
    return t && !s.includes(Y) ? s.concat(Y) : s.slice();
  let i = s;
  if (!i)
    if (Array.isArray(n))
      i = [];
    else {
      const r = Array.from(bs.keys()).filter((o) => o !== "yaml11").map((o) => JSON.stringify(o)).join(", ");
      throw new Error(`Unknown schema "${e}"; use one of ${r} or define customTags array`);
    }
  if (Array.isArray(n))
    for (const r of n)
      i = i.concat(r);
  else typeof n == "function" && (i = n(i.slice()));
  return t && (i = i.concat(Y)), i.reduce((r, o) => {
    const a = typeof o == "string" ? ws[o] : o;
    if (!a) {
      const l = JSON.stringify(o), c = Object.keys(ws).map((d) => JSON.stringify(d)).join(", ");
      throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
    }
    return r.includes(a) || r.push(a), r;
  }, []);
}
const ki = (n, e) => n.key < e.key ? -1 : n.key > e.key ? 1 : 0;
class xt {
  constructor({ compat: e, customTags: t, merge: s, resolveKnownTags: i, schema: r, sortMapEntries: o, toStringDefaults: a }) {
    this.compat = Array.isArray(e) ? At(e, "compat") : e ? At(null, e) : null, this.name = typeof r == "string" && r || "core", this.knownTags = i ? $i : {}, this.tags = At(t, this.name, s), this.toStringOptions = a ?? null, Object.defineProperty(this, X, { value: Ee }), Object.defineProperty(this, F, { value: ht }), Object.defineProperty(this, $e, { value: _e }), this.sortMapEntries = typeof o == "function" ? o : o === !0 ? ki : null;
  }
  clone() {
    const e = Object.create(xt.prototype, Object.getOwnPropertyDescriptors(this));
    return e.tags = this.tags.slice(), e;
  }
}
function Ai(n, e) {
  var l;
  const t = [];
  let s = e.directives === !0;
  if (e.directives !== !1 && n.directives) {
    const c = n.directives.toString(n);
    c ? (t.push(c), s = !0) : n.directives.docStart && (s = !0);
  }
  s && t.push("---");
  const i = Vs(n, e), { commentString: r } = i.options;
  if (n.commentBefore) {
    t.length !== 1 && t.unshift("");
    const c = r(n.commentBefore);
    t.unshift(W(c, ""));
  }
  let o = !1, a = null;
  if (n.contents) {
    if (C(n.contents)) {
      if (n.contents.spaceBefore && s && t.push(""), n.contents.commentBefore) {
        const f = r(n.contents.commentBefore);
        t.push(W(f, ""));
      }
      i.forceBlockIndent = !!n.comment, a = n.contents.comment;
    }
    const c = a ? void 0 : () => o = !0;
    let d = ye(n.contents, i, () => a = null, c);
    a && (d += te(d, "", r(a))), (d[0] === "|" || d[0] === ">") && t[t.length - 1] === "---" ? t[t.length - 1] = `--- ${d}` : t.push(d);
  } else
    t.push(ye(n.contents, i));
  if ((l = n.directives) != null && l.docEnd)
    if (n.comment) {
      const c = r(n.comment);
      c.includes(`
`) ? (t.push("..."), t.push(W(c, ""))) : t.push(`... ${c}`);
    } else
      t.push("...");
  else {
    let c = n.comment;
    c && o && (c = c.replace(/^\n+/, "")), c && ((!o || a) && t[t.length - 1] !== "" && t.push(""), t.push(W(r(c), "")));
  }
  return t.join(`
`) + `
`;
}
let es = class hn {
  constructor(e, t, s) {
    this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, j, { value: Ot });
    let i = null;
    typeof t == "function" || Array.isArray(t) ? i = t : s === void 0 && t && (s = t, t = void 0);
    const r = Object.assign({
      intAsBigInt: !1,
      keepSourceTokens: !1,
      logLevel: "warn",
      prettyErrors: !0,
      strict: !0,
      stringKeys: !1,
      uniqueKeys: !0,
      version: "1.2"
    }, s);
    this.options = r;
    let { version: o } = r;
    s != null && s._directives ? (this.directives = s._directives.atDocument(), this.directives.yaml.explicit && (o = this.directives.yaml.version)) : this.directives = new P({ version: o }), this.setSchema(o, s), this.contents = e === void 0 ? null : this.createNode(e, i, s);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const e = Object.create(hn.prototype, {
      [j]: { value: Ot }
    });
    return e.commentBefore = this.commentBefore, e.comment = this.comment, e.errors = this.errors.slice(), e.warnings = this.warnings.slice(), e.options = Object.assign({}, this.options), this.directives && (e.directives = this.directives.clone()), e.schema = this.schema.clone(), e.contents = C(this.contents) ? this.contents.clone(e.schema) : this.contents, this.range && (e.range = this.range.slice()), e;
  }
  /** Adds a value to the document. */
  add(e) {
    oe(this.contents) && this.contents.add(e);
  }
  /** Adds a value to the document. */
  addIn(e, t) {
    oe(this.contents) && this.contents.addIn(e, t);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(e, t) {
    if (!e.anchor) {
      const s = Ks(this);
      e.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !t || s.has(t) ? Rs(t || "a", s) : t;
    }
    return new Ft(e.anchor);
  }
  createNode(e, t, s) {
    let i;
    if (typeof t == "function")
      e = t.call({ "": e }, "", e), i = t;
    else if (Array.isArray(t)) {
      const m = (b) => typeof b == "number" || b instanceof String || b instanceof Number, y = t.filter(m).map(String);
      y.length > 0 && (t = t.concat(y)), i = t;
    } else s === void 0 && t && (s = t, t = void 0);
    const { aliasDuplicateObjects: r, anchorPrefix: o, flow: a, keepUndefined: l, onTagObj: c, tag: d } = s ?? {}, { onAnchor: f, setAnchors: p, sourceObjects: u } = Xn(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      o || "a"
    ), g = {
      aliasDuplicateObjects: r ?? !0,
      keepUndefined: l ?? !1,
      onAnchor: f,
      onTagObj: c,
      replacer: i,
      schema: this.schema,
      sourceObjects: u
    }, h = je(e, d, g);
    return a && T(h) && (h.flow = !0), p(), h;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(e, t, s = {}) {
    const i = this.createNode(e, null, s), r = this.createNode(t, null, s);
    return new M(i, r);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    return oe(this.contents) ? this.contents.delete(e) : !1;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    return Oe(e) ? this.contents == null ? !1 : (this.contents = null, !0) : oe(this.contents) ? this.contents.deleteIn(e) : !1;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(e, t) {
    return T(this.contents) ? this.contents.get(e, t) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, t) {
    return Oe(e) ? !t && v(this.contents) ? this.contents.value : this.contents : T(this.contents) ? this.contents.getIn(e, t) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(e) {
    return T(this.contents) ? this.contents.has(e) : !1;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(e) {
    return Oe(e) ? this.contents !== void 0 : T(this.contents) ? this.contents.hasIn(e) : !1;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(e, t) {
    this.contents == null ? this.contents = it(this.schema, [e], t) : oe(this.contents) && this.contents.set(e, t);
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, t) {
    Oe(e) ? this.contents = t : this.contents == null ? this.contents = it(this.schema, Array.from(e), t) : oe(this.contents) && this.contents.setIn(e, t);
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(e, t = {}) {
    typeof e == "number" && (e = String(e));
    let s;
    switch (e) {
      case "1.1":
        this.directives ? this.directives.yaml.version = "1.1" : this.directives = new P({ version: "1.1" }), s = { resolveKnownTags: !1, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        this.directives ? this.directives.yaml.version = e : this.directives = new P({ version: e }), s = { resolveKnownTags: !0, schema: "core" };
        break;
      case null:
        this.directives && delete this.directives, s = null;
        break;
      default: {
        const i = JSON.stringify(e);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${i}`);
      }
    }
    if (t.schema instanceof Object)
      this.schema = t.schema;
    else if (s)
      this.schema = new xt(Object.assign(s, t));
    else
      throw new Error("With a null YAML version, the { schema: Schema } option is required");
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json: e, jsonArg: t, mapAsMap: s, maxAliasCount: i, onAnchor: r, reviver: o } = {}) {
    const a = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !e,
      mapAsMap: s === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof i == "number" ? i : 100
    }, l = B(this.contents, t ?? "", a);
    if (typeof r == "function")
      for (const { count: c, res: d } of a.anchors.values())
        r(d, c);
    return typeof o == "function" ? fe(o, { "": l }, "", l) : l;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(e, t) {
    return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: t });
  }
  /** A YAML representation of the document. */
  toString(e = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
      const t = JSON.stringify(e.indent);
      throw new Error(`"indent" option must be a positive integer, not ${t}`);
    }
    return Ai(this, e);
  }
};
function oe(n) {
  if (T(n))
    return !0;
  throw new Error("Expected a YAML collection as document contents");
}
class dn extends Error {
  constructor(e, t, s, i) {
    super(), this.name = e, this.code = s, this.message = i, this.pos = t;
  }
}
class Te extends dn {
  constructor(e, t, s) {
    super("YAMLParseError", e, t, s);
  }
}
class Ei extends dn {
  constructor(e, t, s) {
    super("YAMLWarning", e, t, s);
  }
}
const Ss = (n, e) => (t) => {
  if (t.pos[0] === -1)
    return;
  t.linePos = t.pos.map((a) => e.linePos(a));
  const { line: s, col: i } = t.linePos[0];
  t.message += ` at line ${s}, column ${i}`;
  let r = i - 1, o = n.substring(e.lineStarts[s - 1], e.lineStarts[s]).replace(/[\n\r]+$/, "");
  if (r >= 60 && o.length > 80) {
    const a = Math.min(r - 39, o.length - 79);
    o = "…" + o.substring(a), r -= a - 1;
  }
  if (o.length > 80 && (o = o.substring(0, 79) + "…"), s > 1 && /^ *$/.test(o.substring(0, r))) {
    let a = n.substring(e.lineStarts[s - 2], e.lineStarts[s - 1]);
    a.length > 80 && (a = a.substring(0, 79) + `…
`), o = a + o;
  }
  if (/[^ ]/.test(o)) {
    let a = 1;
    const l = t.linePos[1];
    (l == null ? void 0 : l.line) === s && l.col > i && (a = Math.max(1, Math.min(l.col - i, 80 - r)));
    const c = " ".repeat(r) + "^".repeat(a);
    t.message += `:

${o}
${c}
`;
  }
};
function be(n, { flow: e, indicator: t, next: s, offset: i, onError: r, parentIndent: o, startOnNewline: a }) {
  let l = !1, c = a, d = a, f = "", p = "", u = !1, g = !1, h = null, m = null, y = null, b = null, $ = null, S = null, k = null;
  for (const w of n)
    switch (g && (w.type !== "space" && w.type !== "newline" && w.type !== "comma" && r(w.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), g = !1), h && (c && w.type !== "comment" && w.type !== "newline" && r(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), h = null), w.type) {
      case "space":
        !e && (t !== "doc-start" || (s == null ? void 0 : s.type) !== "flow-collection") && w.source.includes("	") && (h = w), d = !0;
        break;
      case "comment": {
        d || r(w, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const N = w.source.substring(1) || " ";
        f ? f += p + N : f = N, p = "", c = !1;
        break;
      }
      case "newline":
        c ? f ? f += w.source : (!S || t !== "seq-item-ind") && (l = !0) : p += w.source, c = !0, u = !0, (m || y) && (b = w), d = !0;
        break;
      case "anchor":
        m && r(w, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), w.source.endsWith(":") && r(w.offset + w.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), m = w, k ?? (k = w.offset), c = !1, d = !1, g = !0;
        break;
      case "tag": {
        y && r(w, "MULTIPLE_TAGS", "A node can have at most one tag"), y = w, k ?? (k = w.offset), c = !1, d = !1, g = !0;
        break;
      }
      case t:
        (m || y) && r(w, "BAD_PROP_ORDER", `Anchors and tags must be after the ${w.source} indicator`), S && r(w, "UNEXPECTED_TOKEN", `Unexpected ${w.source} in ${e ?? "collection"}`), S = w, c = t === "seq-item-ind" || t === "explicit-key-ind", d = !1;
        break;
      case "comma":
        if (e) {
          $ && r(w, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), $ = w, c = !1, d = !1;
          break;
        }
      // else fallthrough
      default:
        r(w, "UNEXPECTED_TOKEN", `Unexpected ${w.type} token`), c = !1, d = !1;
    }
  const _ = n[n.length - 1], E = _ ? _.offset + _.source.length : i;
  return g && s && s.type !== "space" && s.type !== "newline" && s.type !== "comma" && (s.type !== "scalar" || s.source !== "") && r(s.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), h && (c && h.indent <= o || (s == null ? void 0 : s.type) === "block-map" || (s == null ? void 0 : s.type) === "block-seq") && r(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
    comma: $,
    found: S,
    spaceBefore: l,
    comment: f,
    hasNewline: u,
    anchor: m,
    tag: y,
    newlineAfterProp: b,
    end: E,
    start: k ?? E
  };
}
function Ue(n) {
  if (!n)
    return null;
  switch (n.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (n.source.includes(`
`))
        return !0;
      if (n.end) {
        for (const e of n.end)
          if (e.type === "newline")
            return !0;
      }
      return !1;
    case "flow-collection":
      for (const e of n.items) {
        for (const t of e.start)
          if (t.type === "newline")
            return !0;
        if (e.sep) {
          for (const t of e.sep)
            if (t.type === "newline")
              return !0;
        }
        if (Ue(e.key) || Ue(e.value))
          return !0;
      }
      return !1;
    default:
      return !0;
  }
}
function Lt(n, e, t) {
  if ((e == null ? void 0 : e.type) === "flow-collection") {
    const s = e.end[0];
    s.indent === n && (s.source === "]" || s.source === "}") && Ue(e) && t(s, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
  }
}
function pn(n, e, t) {
  const { uniqueKeys: s } = n.options;
  if (s === !1)
    return !1;
  const i = typeof s == "function" ? s : (r, o) => r === o || v(r) && v(o) && r.value === o.value;
  return e.some((r) => i(r.key, t));
}
const $s = "All mapping items must start at the same column";
function _i({ composeNode: n, composeEmptyNode: e }, t, s, i, r) {
  var d;
  const o = (r == null ? void 0 : r.nodeClass) ?? D, a = new o(t.schema);
  t.atRoot && (t.atRoot = !1);
  let l = s.offset, c = null;
  for (const f of s.items) {
    const { start: p, key: u, sep: g, value: h } = f, m = be(p, {
      indicator: "explicit-key-ind",
      next: u ?? (g == null ? void 0 : g[0]),
      offset: l,
      onError: i,
      parentIndent: s.indent,
      startOnNewline: !0
    }), y = !m.found;
    if (y) {
      if (u && (u.type === "block-seq" ? i(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in u && u.indent !== s.indent && i(l, "BAD_INDENT", $s)), !m.anchor && !m.tag && !g) {
        c = m.end, m.comment && (a.comment ? a.comment += `
` + m.comment : a.comment = m.comment);
        continue;
      }
      (m.newlineAfterProp || Ue(u)) && i(u ?? p[p.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
    } else ((d = m.found) == null ? void 0 : d.indent) !== s.indent && i(l, "BAD_INDENT", $s);
    t.atKey = !0;
    const b = m.end, $ = u ? n(t, u, m, i) : e(t, b, p, null, m, i);
    t.schema.compat && Lt(s.indent, u, i), t.atKey = !1, pn(t, a.items, $) && i(b, "DUPLICATE_KEY", "Map keys must be unique");
    const S = be(g ?? [], {
      indicator: "map-value-ind",
      next: h,
      offset: $.range[2],
      onError: i,
      parentIndent: s.indent,
      startOnNewline: !u || u.type === "block-scalar"
    });
    if (l = S.end, S.found) {
      y && ((h == null ? void 0 : h.type) === "block-map" && !S.hasNewline && i(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), t.options.strict && m.start < S.found.offset - 1024 && i($.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
      const k = h ? n(t, h, S, i) : e(t, l, g, null, S, i);
      t.schema.compat && Lt(s.indent, h, i), l = k.range[2];
      const _ = new M($, k);
      t.options.keepSourceTokens && (_.srcToken = f), a.items.push(_);
    } else {
      y && i($.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), S.comment && ($.comment ? $.comment += `
` + S.comment : $.comment = S.comment);
      const k = new M($);
      t.options.keepSourceTokens && (k.srcToken = f), a.items.push(k);
    }
  }
  return c && c < l && i(c, "IMPOSSIBLE", "Map comment with trailing content"), a.range = [s.offset, l, c ?? l], a;
}
function Ni({ composeNode: n, composeEmptyNode: e }, t, s, i, r) {
  const o = (r == null ? void 0 : r.nodeClass) ?? re, a = new o(t.schema);
  t.atRoot && (t.atRoot = !1), t.atKey && (t.atKey = !1);
  let l = s.offset, c = null;
  for (const { start: d, value: f } of s.items) {
    const p = be(d, {
      indicator: "seq-item-ind",
      next: f,
      offset: l,
      onError: i,
      parentIndent: s.indent,
      startOnNewline: !0
    });
    if (!p.found)
      if (p.anchor || p.tag || f)
        (f == null ? void 0 : f.type) === "block-seq" ? i(p.end, "BAD_INDENT", "All sequence items must start at the same column") : i(l, "MISSING_CHAR", "Sequence item without - indicator");
      else {
        c = p.end, p.comment && (a.comment = p.comment);
        continue;
      }
    const u = f ? n(t, f, p, i) : e(t, p.end, d, null, p, i);
    t.schema.compat && Lt(s.indent, f, i), l = u.range[2], a.items.push(u);
  }
  return a.range = [s.offset, l, c ?? l], a;
}
function We(n, e, t, s) {
  let i = "";
  if (n) {
    let r = !1, o = "";
    for (const a of n) {
      const { source: l, type: c } = a;
      switch (c) {
        case "space":
          r = !0;
          break;
        case "comment": {
          t && !r && s(a, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const d = l.substring(1) || " ";
          i ? i += o + d : i = d, o = "";
          break;
        }
        case "newline":
          i && (o += l), r = !0;
          break;
        default:
          s(a, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
      }
      e += l.length;
    }
  }
  return { comment: i, offset: e };
}
const Et = "Block collections are not allowed within flow collections", _t = (n) => n && (n.type === "block-map" || n.type === "block-seq");
function vi({ composeNode: n, composeEmptyNode: e }, t, s, i, r) {
  var m;
  const o = s.start.source === "{", a = o ? "flow map" : "flow sequence", l = (r == null ? void 0 : r.nodeClass) ?? (o ? D : re), c = new l(t.schema);
  c.flow = !0;
  const d = t.atRoot;
  d && (t.atRoot = !1), t.atKey && (t.atKey = !1);
  let f = s.offset + s.start.source.length;
  for (let y = 0; y < s.items.length; ++y) {
    const b = s.items[y], { start: $, key: S, sep: k, value: _ } = b, E = be($, {
      flow: a,
      indicator: "explicit-key-ind",
      next: S ?? (k == null ? void 0 : k[0]),
      offset: f,
      onError: i,
      parentIndent: s.indent,
      startOnNewline: !1
    });
    if (!E.found) {
      if (!E.anchor && !E.tag && !k && !_) {
        y === 0 && E.comma ? i(E.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`) : y < s.items.length - 1 && i(E.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`), E.comment && (c.comment ? c.comment += `
` + E.comment : c.comment = E.comment), f = E.end;
        continue;
      }
      !o && t.options.strict && Ue(S) && i(
        S,
        // checked by containsNewline()
        "MULTILINE_IMPLICIT_KEY",
        "Implicit keys of flow sequence pairs need to be on a single line"
      );
    }
    if (y === 0)
      E.comma && i(E.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
    else if (E.comma || i(E.start, "MISSING_CHAR", `Missing , between ${a} items`), E.comment) {
      let w = "";
      e: for (const N of $)
        switch (N.type) {
          case "comma":
          case "space":
            break;
          case "comment":
            w = N.source.substring(1);
            break e;
          default:
            break e;
        }
      if (w) {
        let N = c.items[c.items.length - 1];
        I(N) && (N = N.value ?? N.key), N.comment ? N.comment += `
` + w : N.comment = w, E.comment = E.comment.substring(w.length + 1);
      }
    }
    if (!o && !k && !E.found) {
      const w = _ ? n(t, _, E, i) : e(t, E.end, k, null, E, i);
      c.items.push(w), f = w.range[2], _t(_) && i(w.range, "BLOCK_IN_FLOW", Et);
    } else {
      t.atKey = !0;
      const w = E.end, N = S ? n(t, S, E, i) : e(t, w, $, null, E, i);
      _t(S) && i(N.range, "BLOCK_IN_FLOW", Et), t.atKey = !1;
      const L = be(k ?? [], {
        flow: a,
        indicator: "map-value-ind",
        next: _,
        offset: N.range[2],
        onError: i,
        parentIndent: s.indent,
        startOnNewline: !1
      });
      if (L.found) {
        if (!o && !E.found && t.options.strict) {
          if (k)
            for (const K of k) {
              if (K === L.found)
                break;
              if (K.type === "newline") {
                i(K, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          E.start < L.found.offset - 1024 && i(L.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else _ && ("source" in _ && ((m = _.source) == null ? void 0 : m[0]) === ":" ? i(_, "MISSING_CHAR", `Missing space after : in ${a}`) : i(L.start, "MISSING_CHAR", `Missing , or : between ${a} items`));
      const H = _ ? n(t, _, L, i) : L.found ? e(t, L.end, k, null, L, i) : null;
      H ? _t(_) && i(H.range, "BLOCK_IN_FLOW", Et) : L.comment && (N.comment ? N.comment += `
` + L.comment : N.comment = L.comment);
      const U = new M(N, H);
      if (t.options.keepSourceTokens && (U.srcToken = b), o) {
        const K = c;
        pn(t, K.items, N) && i(w, "DUPLICATE_KEY", "Map keys must be unique"), K.items.push(U);
      } else {
        const K = new D(t.schema);
        K.flow = !0, K.items.push(U);
        const ns = (H ?? N).range;
        K.range = [N.range[0], ns[1], ns[2]], c.items.push(K);
      }
      f = H ? H.range[2] : L.end;
    }
  }
  const p = o ? "}" : "]", [u, ...g] = s.end;
  let h = f;
  if ((u == null ? void 0 : u.source) === p)
    h = u.offset + u.source.length;
  else {
    const y = a[0].toUpperCase() + a.substring(1), b = d ? `${y} must end with a ${p}` : `${y} in block collection must be sufficiently indented and end with a ${p}`;
    i(f, d ? "MISSING_CHAR" : "BAD_INDENT", b), u && u.source.length !== 1 && g.unshift(u);
  }
  if (g.length > 0) {
    const y = We(g, h, t.options.strict, i);
    y.comment && (c.comment ? c.comment += `
` + y.comment : c.comment = y.comment), c.range = [s.offset, h, y.offset];
  } else
    c.range = [s.offset, h, h];
  return c;
}
function Nt(n, e, t, s, i, r) {
  const o = t.type === "block-map" ? _i(n, e, t, s, r) : t.type === "block-seq" ? Ni(n, e, t, s, r) : vi(n, e, t, s, r), a = o.constructor;
  return i === "!" || i === a.tagName ? (o.tag = a.tagName, o) : (i && (o.tag = i), o);
}
function Oi(n, e, t, s, i) {
  var p;
  const r = s.tag, o = r ? e.directives.tagName(r.source, (u) => i(r, "TAG_RESOLVE_FAILED", u)) : null;
  if (t.type === "block-seq") {
    const { anchor: u, newlineAfterProp: g } = s, h = u && r ? u.offset > r.offset ? u : r : u ?? r;
    h && (!g || g.offset < h.offset) && i(h, "MISSING_CHAR", "Missing newline after block sequence props");
  }
  const a = t.type === "block-map" ? "map" : t.type === "block-seq" ? "seq" : t.start.source === "{" ? "map" : "seq";
  if (!r || !o || o === "!" || o === D.tagName && a === "map" || o === re.tagName && a === "seq")
    return Nt(n, e, t, i, o);
  let l = e.schema.tags.find((u) => u.tag === o && u.collection === a);
  if (!l) {
    const u = e.schema.knownTags[o];
    if ((u == null ? void 0 : u.collection) === a)
      e.schema.tags.push(Object.assign({}, u, { default: !1 })), l = u;
    else
      return u ? i(r, "BAD_COLLECTION_TYPE", `${u.tag} used for ${a} collection, but expects ${u.collection ?? "scalar"}`, !0) : i(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0), Nt(n, e, t, i, o);
  }
  const c = Nt(n, e, t, i, o, l), d = ((p = l.resolve) == null ? void 0 : p.call(l, c, (u) => i(r, "TAG_RESOLVE_FAILED", u), e.options)) ?? c, f = C(d) ? d : new A(d);
  return f.range = c.range, f.tag = o, l != null && l.format && (f.format = l.format), f;
}
function Ti(n, e, t) {
  const s = e.offset, i = Ci(e, n.options.strict, t);
  if (!i)
    return { value: "", type: null, comment: "", range: [s, s, s] };
  const r = i.mode === ">" ? A.BLOCK_FOLDED : A.BLOCK_LITERAL, o = e.source ? Ii(e.source) : [];
  let a = o.length;
  for (let h = o.length - 1; h >= 0; --h) {
    const m = o[h][1];
    if (m === "" || m === "\r")
      a = h;
    else
      break;
  }
  if (a === 0) {
    const h = i.chomp === "+" && o.length > 0 ? `
`.repeat(Math.max(1, o.length - 1)) : "";
    let m = s + i.length;
    return e.source && (m += e.source.length), { value: h, type: r, comment: i.comment, range: [s, m, m] };
  }
  let l = e.indent + i.indent, c = e.offset + i.length, d = 0;
  for (let h = 0; h < a; ++h) {
    const [m, y] = o[h];
    if (y === "" || y === "\r")
      i.indent === 0 && m.length > l && (l = m.length);
    else {
      m.length < l && t(c + m.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), i.indent === 0 && (l = m.length), d = h, l === 0 && !n.atRoot && t(c, "BAD_INDENT", "Block scalar values in collections must be indented");
      break;
    }
    c += m.length + y.length + 1;
  }
  for (let h = o.length - 1; h >= a; --h)
    o[h][0].length > l && (a = h + 1);
  let f = "", p = "", u = !1;
  for (let h = 0; h < d; ++h)
    f += o[h][0].slice(l) + `
`;
  for (let h = d; h < a; ++h) {
    let [m, y] = o[h];
    c += m.length + y.length + 1;
    const b = y[y.length - 1] === "\r";
    if (b && (y = y.slice(0, -1)), y && m.length < l) {
      const S = `Block scalar lines must not be less indented than their ${i.indent ? "explicit indentation indicator" : "first line"}`;
      t(c - y.length - (b ? 2 : 1), "BAD_INDENT", S), m = "";
    }
    r === A.BLOCK_LITERAL ? (f += p + m.slice(l) + y, p = `
`) : m.length > l || y[0] === "	" ? (p === " " ? p = `
` : !u && p === `
` && (p = `

`), f += p + m.slice(l) + y, p = `
`, u = !0) : y === "" ? p === `
` ? f += `
` : p = `
` : (f += p + y, p = " ", u = !1);
  }
  switch (i.chomp) {
    case "-":
      break;
    case "+":
      for (let h = a; h < o.length; ++h)
        f += `
` + o[h][0].slice(l);
      f[f.length - 1] !== `
` && (f += `
`);
      break;
    default:
      f += `
`;
  }
  const g = s + i.length + e.source.length;
  return { value: f, type: r, comment: i.comment, range: [s, g, g] };
}
function Ci({ offset: n, props: e }, t, s) {
  if (e[0].type !== "block-scalar-header")
    return s(e[0], "IMPOSSIBLE", "Block scalar header not found"), null;
  const { source: i } = e[0], r = i[0];
  let o = 0, a = "", l = -1;
  for (let p = 1; p < i.length; ++p) {
    const u = i[p];
    if (!a && (u === "-" || u === "+"))
      a = u;
    else {
      const g = Number(u);
      !o && g ? o = g : l === -1 && (l = n + p);
    }
  }
  l !== -1 && s(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${i}`);
  let c = !1, d = "", f = i.length;
  for (let p = 1; p < e.length; ++p) {
    const u = e[p];
    switch (u.type) {
      case "space":
        c = !0;
      // fallthrough
      case "newline":
        f += u.source.length;
        break;
      case "comment":
        t && !c && s(u, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), f += u.source.length, d = u.source.substring(1);
        break;
      case "error":
        s(u, "UNEXPECTED_TOKEN", u.message), f += u.source.length;
        break;
      /* istanbul ignore next should not happen */
      default: {
        const g = `Unexpected token in block scalar header: ${u.type}`;
        s(u, "UNEXPECTED_TOKEN", g);
        const h = u.source;
        h && typeof h == "string" && (f += h.length);
      }
    }
  }
  return { mode: r, indent: o, chomp: a, comment: d, length: f };
}
function Ii(n) {
  const e = n.split(/\n( *)/), t = e[0], s = t.match(/^( *)/), r = [s != null && s[1] ? [s[1], t.slice(s[1].length)] : ["", t]];
  for (let o = 1; o < e.length; o += 2)
    r.push([e[o], e[o + 1]]);
  return r;
}
function Li(n, e, t) {
  const { offset: s, type: i, source: r, end: o } = n;
  let a, l;
  const c = (p, u, g) => t(s + p, u, g);
  switch (i) {
    case "scalar":
      a = A.PLAIN, l = Pi(r, c);
      break;
    case "single-quoted-scalar":
      a = A.QUOTE_SINGLE, l = Mi(r, c);
      break;
    case "double-quoted-scalar":
      a = A.QUOTE_DOUBLE, l = Di(r, c);
      break;
    /* istanbul ignore next should not happen */
    default:
      return t(n, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${i}`), {
        value: "",
        type: null,
        comment: "",
        range: [s, s + r.length, s + r.length]
      };
  }
  const d = s + r.length, f = We(o, d, e, t);
  return {
    value: l,
    type: a,
    comment: f.comment,
    range: [s, d, f.offset]
  };
}
function Pi(n, e) {
  let t = "";
  switch (n[0]) {
    /* istanbul ignore next should not happen */
    case "	":
      t = "a tab character";
      break;
    case ",":
      t = "flow indicator character ,";
      break;
    case "%":
      t = "directive indicator character %";
      break;
    case "|":
    case ">": {
      t = `block scalar indicator ${n[0]}`;
      break;
    }
    case "@":
    case "`": {
      t = `reserved character ${n[0]}`;
      break;
    }
  }
  return t && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${t}`), mn(n);
}
function Mi(n, e) {
  return (n[n.length - 1] !== "'" || n.length === 1) && e(n.length, "MISSING_CHAR", "Missing closing 'quote"), mn(n.slice(1, -1)).replace(/''/g, "'");
}
function mn(n) {
  let e, t;
  try {
    e = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), t = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy");
  } catch {
    e = /(.*?)[ \t]*\r?\n/sy, t = /[ \t]*(.*?)[ \t]*\r?\n/sy;
  }
  let s = e.exec(n);
  if (!s)
    return n;
  let i = s[1], r = " ", o = e.lastIndex;
  for (t.lastIndex = o; s = t.exec(n); )
    s[1] === "" ? r === `
` ? i += r : r = `
` : (i += r + s[1], r = " "), o = t.lastIndex;
  const a = /[ \t]*(.*)/sy;
  return a.lastIndex = o, s = a.exec(n), i + r + ((s == null ? void 0 : s[1]) ?? "");
}
function Di(n, e) {
  let t = "";
  for (let s = 1; s < n.length - 1; ++s) {
    const i = n[s];
    if (!(i === "\r" && n[s + 1] === `
`))
      if (i === `
`) {
        const { fold: r, offset: o } = Bi(n, s);
        t += r, s = o;
      } else if (i === "\\") {
        let r = n[++s];
        const o = ji[r];
        if (o)
          t += o;
        else if (r === `
`)
          for (r = n[s + 1]; r === " " || r === "	"; )
            r = n[++s + 1];
        else if (r === "\r" && n[s + 1] === `
`)
          for (r = n[++s + 1]; r === " " || r === "	"; )
            r = n[++s + 1];
        else if (r === "x" || r === "u" || r === "U") {
          const a = r === "x" ? 2 : r === "u" ? 4 : 8;
          t += Ui(n, s + 1, a, e), s += a;
        } else {
          const a = n.substr(s - 1, 2);
          e(s - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), t += a;
        }
      } else if (i === " " || i === "	") {
        const r = s;
        let o = n[s + 1];
        for (; o === " " || o === "	"; )
          o = n[++s + 1];
        o !== `
` && !(o === "\r" && n[s + 2] === `
`) && (t += s > r ? n.slice(r, s + 1) : i);
      } else
        t += i;
  }
  return (n[n.length - 1] !== '"' || n.length === 1) && e(n.length, "MISSING_CHAR", 'Missing closing "quote'), t;
}
function Bi(n, e) {
  let t = "", s = n[e + 1];
  for (; (s === " " || s === "	" || s === `
` || s === "\r") && !(s === "\r" && n[e + 2] !== `
`); )
    s === `
` && (t += `
`), e += 1, s = n[e + 1];
  return t || (t = " "), { fold: t, offset: e };
}
const ji = {
  0: "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: `
`,
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "",
  // Unicode next line
  _: " ",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function Ui(n, e, t, s) {
  const i = n.substr(e, t), o = i.length === t && /^[0-9a-fA-F]+$/.test(i) ? parseInt(i, 16) : NaN;
  try {
    return String.fromCodePoint(o);
  } catch {
    const a = n.substr(e - 2, t + 2);
    return s(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), a;
  }
}
function gn(n, e, t, s) {
  const { value: i, type: r, comment: o, range: a } = e.type === "block-scalar" ? Ti(n, e, s) : Li(e, n.options.strict, s), l = t ? n.directives.tagName(t.source, (f) => s(t, "TAG_RESOLVE_FAILED", f)) : null;
  let c;
  n.options.stringKeys && n.atKey ? c = n.schema[F] : l ? c = Ki(n.schema, i, l, t, s) : e.type === "scalar" ? c = Ri(n, i, e, s) : c = n.schema[F];
  let d;
  try {
    const f = c.resolve(i, (p) => s(t ?? e, "TAG_RESOLVE_FAILED", p), n.options);
    d = v(f) ? f : new A(f);
  } catch (f) {
    const p = f instanceof Error ? f.message : String(f);
    s(t ?? e, "TAG_RESOLVE_FAILED", p), d = new A(i);
  }
  return d.range = a, d.source = i, r && (d.type = r), l && (d.tag = l), c.format && (d.format = c.format), o && (d.comment = o), d;
}
function Ki(n, e, t, s, i) {
  var a;
  if (t === "!")
    return n[F];
  const r = [];
  for (const l of n.tags)
    if (!l.collection && l.tag === t)
      if (l.default && l.test)
        r.push(l);
      else
        return l;
  for (const l of r)
    if ((a = l.test) != null && a.test(e))
      return l;
  const o = n.knownTags[t];
  return o && !o.collection ? (n.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o) : (i(s, "TAG_RESOLVE_FAILED", `Unresolved tag: ${t}`, t !== "tag:yaml.org,2002:str"), n[F]);
}
function Ri({ atKey: n, directives: e, schema: t }, s, i, r) {
  const o = t.tags.find((a) => {
    var l;
    return (a.default === !0 || n && a.default === "key") && ((l = a.test) == null ? void 0 : l.test(s));
  }) || t[F];
  if (t.compat) {
    const a = t.compat.find((l) => {
      var c;
      return l.default && ((c = l.test) == null ? void 0 : c.test(s));
    }) ?? t[F];
    if (o.tag !== a.tag) {
      const l = e.tagString(o.tag), c = e.tagString(a.tag), d = `Value may be parsed as either ${l} or ${c}`;
      r(i, "TAG_RESOLVE_FAILED", d, !0);
    }
  }
  return o;
}
function qi(n, e, t) {
  if (e) {
    t ?? (t = e.length);
    for (let s = t - 1; s >= 0; --s) {
      let i = e[s];
      switch (i.type) {
        case "space":
        case "comment":
        case "newline":
          n -= i.source.length;
          continue;
      }
      for (i = e[++s]; (i == null ? void 0 : i.type) === "space"; )
        n += i.source.length, i = e[++s];
      break;
    }
  }
  return n;
}
const Fi = { composeNode: yn, composeEmptyNode: ts };
function yn(n, e, t, s) {
  const i = n.atKey, { spaceBefore: r, comment: o, anchor: a, tag: l } = t;
  let c, d = !0;
  switch (e.type) {
    case "alias":
      c = Hi(n, e, s), (a || l) && s(e, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      c = gn(n, e, l, s), a && (c.anchor = a.source.substring(1));
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      try {
        c = Oi(Fi, n, e, t, s), a && (c.anchor = a.source.substring(1));
      } catch (f) {
        const p = f instanceof Error ? f.message : String(f);
        s(e, "RESOURCE_EXHAUSTION", p);
      }
      break;
    default: {
      const f = e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`;
      s(e, "UNEXPECTED_TOKEN", f), d = !1;
    }
  }
  return c ?? (c = ts(n, e.offset, void 0, null, t, s)), a && c.anchor === "" && s(a, "BAD_ALIAS", "Anchor cannot be an empty string"), i && n.options.stringKeys && (!v(c) || typeof c.value != "string" || c.tag && c.tag !== "tag:yaml.org,2002:str") && s(l ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), r && (c.spaceBefore = !0), o && (e.type === "scalar" && e.source === "" ? c.comment = o : c.commentBefore = o), n.options.keepSourceTokens && d && (c.srcToken = e), c;
}
function ts(n, e, t, s, { spaceBefore: i, comment: r, anchor: o, tag: a, end: l }, c) {
  const d = {
    type: "scalar",
    offset: qi(e, t, s),
    indent: -1,
    source: ""
  }, f = gn(n, d, a, c);
  return o && (f.anchor = o.source.substring(1), f.anchor === "" && c(o, "BAD_ALIAS", "Anchor cannot be an empty string")), i && (f.spaceBefore = !0), r && (f.comment = r, f.range[2] = l), f;
}
function Hi({ options: n }, { offset: e, source: t, end: s }, i) {
  const r = new Ft(t.substring(1));
  r.source === "" && i(e, "BAD_ALIAS", "Alias cannot be an empty string"), r.source.endsWith(":") && i(e + t.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
  const o = e + t.length, a = We(s, o, n.strict, i);
  return r.range = [e, o, a.offset], a.comment && (r.comment = a.comment), r;
}
function Vi(n, e, { offset: t, start: s, value: i, end: r }, o) {
  const a = Object.assign({ _directives: e }, n), l = new es(void 0, a), c = {
    atKey: !1,
    atRoot: !0,
    directives: l.directives,
    options: l.options,
    schema: l.schema
  }, d = be(s, {
    indicator: "doc-start",
    next: i ?? (r == null ? void 0 : r[0]),
    offset: t,
    onError: o,
    parentIndent: 0,
    startOnNewline: !0
  });
  d.found && (l.directives.docStart = !0, i && (i.type === "block-map" || i.type === "block-seq") && !d.hasNewline && o(d.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), l.contents = i ? yn(c, i, d, o) : ts(c, d.end, s, null, d, o);
  const f = l.contents.range[2], p = We(r, f, !1, o);
  return p.comment && (l.comment = p.comment), l.range = [t, f, p.offset], l;
}
function ve(n) {
  if (typeof n == "number")
    return [n, n + 1];
  if (Array.isArray(n))
    return n.length === 2 ? n : [n[0], n[1]];
  const { offset: e, source: t } = n;
  return [e, e + (typeof t == "string" ? t.length : 1)];
}
function ks(n) {
  var i;
  let e = "", t = !1, s = !1;
  for (let r = 0; r < n.length; ++r) {
    const o = n[r];
    switch (o[0]) {
      case "#":
        e += (e === "" ? "" : s ? `

` : `
`) + (o.substring(1) || " "), t = !0, s = !1;
        break;
      case "%":
        ((i = n[r + 1]) == null ? void 0 : i[0]) !== "#" && (r += 1), t = !1;
        break;
      default:
        t || (s = !0), t = !1;
    }
  }
  return { comment: e, afterEmptyLine: s };
}
class Wi {
  constructor(e = {}) {
    this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (t, s, i, r) => {
      const o = ve(t);
      r ? this.warnings.push(new Ei(o, s, i)) : this.errors.push(new Te(o, s, i));
    }, this.directives = new P({ version: e.version || "1.2" }), this.options = e;
  }
  decorate(e, t) {
    const { comment: s, afterEmptyLine: i } = ks(this.prelude);
    if (s) {
      const r = e.contents;
      if (t)
        e.comment = e.comment ? `${e.comment}
${s}` : s;
      else if (i || e.directives.docStart || !r)
        e.commentBefore = s;
      else if (T(r) && !r.flow && r.items.length > 0) {
        let o = r.items[0];
        I(o) && (o = o.key);
        const a = o.commentBefore;
        o.commentBefore = a ? `${s}
${a}` : s;
      } else {
        const o = r.commentBefore;
        r.commentBefore = o ? `${s}
${o}` : s;
      }
    }
    if (t) {
      for (let r = 0; r < this.errors.length; ++r)
        e.errors.push(this.errors[r]);
      for (let r = 0; r < this.warnings.length; ++r)
        e.warnings.push(this.warnings[r]);
    } else
      e.errors = this.errors, e.warnings = this.warnings;
    this.prelude = [], this.errors = [], this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: ks(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(e, t = !1, s = -1) {
    for (const i of e)
      yield* this.next(i);
    yield* this.end(t, s);
  }
  /** Advance the composer by one CST token. */
  *next(e) {
    switch (e.type) {
      case "directive":
        this.directives.add(e.source, (t, s, i) => {
          const r = ve(e);
          r[0] += t, this.onError(r, "BAD_DIRECTIVE", s, i);
        }), this.prelude.push(e.source), this.atDirectives = !0;
        break;
      case "document": {
        const t = Vi(this.options, this.directives, e, this.onError);
        this.atDirectives && !t.directives.docStart && this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(t, !1), this.doc && (yield this.doc), this.doc = t, this.atDirectives = !1;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(e.source);
        break;
      case "error": {
        const t = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, s = new Te(ve(e), "UNEXPECTED_TOKEN", t);
        this.atDirectives || !this.doc ? this.errors.push(s) : this.doc.errors.push(s);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const s = "Unexpected doc-end without preceding document";
          this.errors.push(new Te(ve(e), "UNEXPECTED_TOKEN", s));
          break;
        }
        this.doc.directives.docEnd = !0;
        const t = We(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
        if (this.decorate(this.doc, !0), t.comment) {
          const s = this.doc.comment;
          this.doc.comment = s ? `${s}
${t.comment}` : t.comment;
        }
        this.doc.range[2] = t.offset;
        break;
      }
      default:
        this.errors.push(new Te(ve(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(e = !1, t = -1) {
    if (this.doc)
      this.decorate(this.doc, !0), yield this.doc, this.doc = null;
    else if (e) {
      const s = Object.assign({ _directives: this.directives }, this.options), i = new es(void 0, s);
      this.atDirectives && this.onError(t, "MISSING_CHAR", "Missing directives-end indicator line"), i.range = [0, t, t], this.decorate(i, !1), yield i;
    }
  }
}
const bn = "\uFEFF", wn = "", Sn = "", Pt = "";
function Yi(n) {
  switch (n) {
    case bn:
      return "byte-order-mark";
    case wn:
      return "doc-mode";
    case Sn:
      return "flow-error-end";
    case Pt:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case `
`:
    case `\r
`:
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (n[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}
function R(n) {
  switch (n) {
    case void 0:
    case " ":
    case `
`:
    case "\r":
    case "	":
      return !0;
    default:
      return !1;
  }
}
const As = new Set("0123456789ABCDEFabcdef"), Ji = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), ze = new Set(",[]{}"), Gi = new Set(` ,[]{}
\r	`), vt = (n) => !n || Gi.has(n);
class Qi {
  constructor() {
    this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(e, t = !1) {
    if (e) {
      if (typeof e != "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + e : e, this.lineEndPos = null;
    }
    this.atEnd = !t;
    let s = this.next ?? "stream";
    for (; s && (t || this.hasChars(1)); )
      s = yield* this.parseNext(s);
  }
  atLineEnd() {
    let e = this.pos, t = this.buffer[e];
    for (; t === " " || t === "	"; )
      t = this.buffer[++e];
    return !t || t === "#" || t === `
` ? !0 : t === "\r" ? this.buffer[e + 1] === `
` : !1;
  }
  charAt(e) {
    return this.buffer[this.pos + e];
  }
  continueScalar(e) {
    let t = this.buffer[e];
    if (this.indentNext > 0) {
      let s = 0;
      for (; t === " "; )
        t = this.buffer[++s + e];
      if (t === "\r") {
        const i = this.buffer[s + e + 1];
        if (i === `
` || !i && !this.atEnd)
          return e + s + 1;
      }
      return t === `
` || s >= this.indentNext || !t && !this.atEnd ? e + s : -1;
    }
    if (t === "-" || t === ".") {
      const s = this.buffer.substr(e, 3);
      if ((s === "---" || s === "...") && R(this.buffer[e + 3]))
        return -1;
    }
    return e;
  }
  getLine() {
    let e = this.lineEndPos;
    return (typeof e != "number" || e !== -1 && e < this.pos) && (e = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = e), e === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[e - 1] === "\r" && (e -= 1), this.buffer.substring(this.pos, e));
  }
  hasChars(e) {
    return this.pos + e <= this.buffer.length;
  }
  setNext(e) {
    return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = e, null;
  }
  peek(e) {
    return this.buffer.substr(this.pos, e);
  }
  *parseNext(e) {
    switch (e) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let e = this.getLine();
    if (e === null)
      return this.setNext("stream");
    if (e[0] === bn && (yield* this.pushCount(1), e = e.substring(1)), e[0] === "%") {
      let t = e.length, s = e.indexOf("#");
      for (; s !== -1; ) {
        const r = e[s - 1];
        if (r === " " || r === "	") {
          t = s - 1;
          break;
        } else
          s = e.indexOf("#", s + 1);
      }
      for (; ; ) {
        const r = e[t - 1];
        if (r === " " || r === "	")
          t -= 1;
        else
          break;
      }
      const i = (yield* this.pushCount(t)) + (yield* this.pushSpaces(!0));
      return yield* this.pushCount(e.length - i), this.pushNewline(), "stream";
    }
    if (this.atLineEnd()) {
      const t = yield* this.pushSpaces(!0);
      return yield* this.pushCount(e.length - t), yield* this.pushNewline(), "stream";
    }
    return yield wn, yield* this.parseLineStart();
  }
  *parseLineStart() {
    const e = this.charAt(0);
    if (!e && !this.atEnd)
      return this.setNext("line-start");
    if (e === "-" || e === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const t = this.peek(3);
      if ((t === "---" || t === "...") && R(this.charAt(3)))
        return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, t === "---" ? "doc" : "stream";
    }
    return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !R(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [e, t] = this.peek(2);
    if (!t && !this.atEnd)
      return this.setNext("block-start");
    if ((e === "-" || e === "?" || e === ":") && R(t)) {
      const s = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
      return this.indentNext = this.indentValue + 1, this.indentValue += s, "block-start";
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(!0);
    const e = this.getLine();
    if (e === null)
      return this.setNext("doc");
    let t = yield* this.pushIndicators();
    switch (e[t]) {
      case "#":
        yield* this.pushCount(e.length - t);
      // fallthrough
      case void 0:
        return yield* this.pushNewline(), yield* this.parseLineStart();
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), "doc";
      case "*":
        return yield* this.pushUntil(vt), "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        return t += yield* this.parseBlockScalarHeader(), t += yield* this.pushSpaces(!0), yield* this.pushCount(e.length - t), yield* this.pushNewline(), yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let e, t, s = -1;
    do
      e = yield* this.pushNewline(), e > 0 ? (t = yield* this.pushSpaces(!1), this.indentValue = s = t) : t = 0, t += yield* this.pushSpaces(!0);
    while (e + t > 0);
    const i = this.getLine();
    if (i === null)
      return this.setNext("flow");
    if ((s !== -1 && s < this.indentNext && i[0] !== "#" || s === 0 && (i.startsWith("---") || i.startsWith("...")) && R(i[3])) && !(s === this.indentNext - 1 && this.flowLevel === 1 && (i[0] === "]" || i[0] === "}")))
      return this.flowLevel = 0, yield Sn, yield* this.parseLineStart();
    let r = 0;
    for (; i[r] === ","; )
      r += yield* this.pushCount(1), r += yield* this.pushSpaces(!0), this.flowKey = !1;
    switch (r += yield* this.pushIndicators(), i[r]) {
      case void 0:
        return "flow";
      case "#":
        return yield* this.pushCount(i.length - r), "flow";
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
      case "*":
        return yield* this.pushUntil(vt), "flow";
      case '"':
      case "'":
        return this.flowKey = !0, yield* this.parseQuotedScalar();
      case ":": {
        const o = this.charAt(1);
        if (this.flowKey || R(o) || o === ",")
          return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
      }
      // fallthrough
      default:
        return this.flowKey = !1, yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const e = this.charAt(0);
    let t = this.buffer.indexOf(e, this.pos + 1);
    if (e === "'")
      for (; t !== -1 && this.buffer[t + 1] === "'"; )
        t = this.buffer.indexOf("'", t + 2);
    else
      for (; t !== -1; ) {
        let r = 0;
        for (; this.buffer[t - 1 - r] === "\\"; )
          r += 1;
        if (r % 2 === 0)
          break;
        t = this.buffer.indexOf('"', t + 1);
      }
    const s = this.buffer.substring(0, t);
    let i = s.indexOf(`
`, this.pos);
    if (i !== -1) {
      for (; i !== -1; ) {
        const r = this.continueScalar(i + 1);
        if (r === -1)
          break;
        i = s.indexOf(`
`, r);
      }
      i !== -1 && (t = i - (s[i - 1] === "\r" ? 2 : 1));
    }
    if (t === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      t = this.buffer.length;
    }
    return yield* this.pushToIndex(t + 1, !1), this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1, this.blockScalarKeep = !1;
    let e = this.pos;
    for (; ; ) {
      const t = this.buffer[++e];
      if (t === "+")
        this.blockScalarKeep = !0;
      else if (t > "0" && t <= "9")
        this.blockScalarIndent = Number(t) - 1;
      else if (t !== "-")
        break;
    }
    return yield* this.pushUntil((t) => R(t) || t === "#");
  }
  *parseBlockScalar() {
    let e = this.pos - 1, t = 0, s;
    e: for (let r = this.pos; s = this.buffer[r]; ++r)
      switch (s) {
        case " ":
          t += 1;
          break;
        case `
`:
          e = r, t = 0;
          break;
        case "\r": {
          const o = this.buffer[r + 1];
          if (!o && !this.atEnd)
            return this.setNext("block-scalar");
          if (o === `
`)
            break;
        }
        // fallthrough
        default:
          break e;
      }
    if (!s && !this.atEnd)
      return this.setNext("block-scalar");
    if (t >= this.indentNext) {
      this.blockScalarIndent === -1 ? this.indentNext = t : this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      do {
        const r = this.continueScalar(e + 1);
        if (r === -1)
          break;
        e = this.buffer.indexOf(`
`, r);
      } while (e !== -1);
      if (e === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        e = this.buffer.length;
      }
    }
    let i = e + 1;
    for (s = this.buffer[i]; s === " "; )
      s = this.buffer[++i];
    if (s === "	") {
      for (; s === "	" || s === " " || s === "\r" || s === `
`; )
        s = this.buffer[++i];
      e = i - 1;
    } else if (!this.blockScalarKeep)
      do {
        let r = e - 1, o = this.buffer[r];
        o === "\r" && (o = this.buffer[--r]);
        const a = r;
        for (; o === " "; )
          o = this.buffer[--r];
        if (o === `
` && r >= this.pos && r + 1 + t > a)
          e = r;
        else
          break;
      } while (!0);
    return yield Pt, yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const e = this.flowLevel > 0;
    let t = this.pos - 1, s = this.pos - 1, i;
    for (; i = this.buffer[++s]; )
      if (i === ":") {
        const r = this.buffer[s + 1];
        if (R(r) || e && ze.has(r))
          break;
        t = s;
      } else if (R(i)) {
        let r = this.buffer[s + 1];
        if (i === "\r" && (r === `
` ? (s += 1, i = `
`, r = this.buffer[s + 1]) : t = s), r === "#" || e && ze.has(r))
          break;
        if (i === `
`) {
          const o = this.continueScalar(s + 1);
          if (o === -1)
            break;
          s = Math.max(s, o - 2);
        }
      } else {
        if (e && ze.has(i))
          break;
        t = s;
      }
    return !i && !this.atEnd ? this.setNext("plain-scalar") : (yield Pt, yield* this.pushToIndex(t + 1, !0), e ? "flow" : "doc");
  }
  *pushCount(e) {
    return e > 0 ? (yield this.buffer.substr(this.pos, e), this.pos += e, e) : 0;
  }
  *pushToIndex(e, t) {
    const s = this.buffer.slice(this.pos, e);
    return s ? (yield s, this.pos += s.length, s.length) : (t && (yield ""), 0);
  }
  *pushIndicators() {
    let e = 0;
    e: for (; ; ) {
      switch (this.charAt(0)) {
        case "!":
          e += yield* this.pushTag(), e += yield* this.pushSpaces(!0);
          continue e;
        case "&":
          e += yield* this.pushUntil(vt), e += yield* this.pushSpaces(!0);
          continue e;
        case "-":
        // this is an error
        case "?":
        // this is an error outside flow collections
        case ":": {
          const t = this.flowLevel > 0, s = this.charAt(1);
          if (R(s) || t && ze.has(s)) {
            t ? this.flowKey && (this.flowKey = !1) : this.indentNext = this.indentValue + 1, e += yield* this.pushCount(1), e += yield* this.pushSpaces(!0);
            continue e;
          }
        }
      }
      break e;
    }
    return e;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let e = this.pos + 2, t = this.buffer[e];
      for (; !R(t) && t !== ">"; )
        t = this.buffer[++e];
      return yield* this.pushToIndex(t === ">" ? e + 1 : e, !1);
    } else {
      let e = this.pos + 1, t = this.buffer[e];
      for (; t; )
        if (Ji.has(t))
          t = this.buffer[++e];
        else if (t === "%" && As.has(this.buffer[e + 1]) && As.has(this.buffer[e + 2]))
          t = this.buffer[e += 3];
        else
          break;
      return yield* this.pushToIndex(e, !1);
    }
  }
  *pushNewline() {
    const e = this.buffer[this.pos];
    return e === `
` ? yield* this.pushCount(1) : e === "\r" && this.charAt(1) === `
` ? yield* this.pushCount(2) : 0;
  }
  *pushSpaces(e) {
    let t = this.pos - 1, s;
    do
      s = this.buffer[++t];
    while (s === " " || e && s === "	");
    const i = t - this.pos;
    return i > 0 && (yield this.buffer.substr(this.pos, i), this.pos = t), i;
  }
  *pushUntil(e) {
    let t = this.pos, s = this.buffer[t];
    for (; !e(s); )
      s = this.buffer[++t];
    return yield* this.pushToIndex(t, !1);
  }
}
class zi {
  constructor() {
    this.lineStarts = [], this.addNewLine = (e) => this.lineStarts.push(e), this.linePos = (e) => {
      let t = 0, s = this.lineStarts.length;
      for (; t < s; ) {
        const r = t + s >> 1;
        this.lineStarts[r] < e ? t = r + 1 : s = r;
      }
      if (this.lineStarts[t] === e)
        return { line: t + 1, col: 1 };
      if (t === 0)
        return { line: 0, col: e };
      const i = this.lineStarts[t - 1];
      return { line: t, col: e - i + 1 };
    };
  }
}
function J(n, e) {
  for (let t = 0; t < n.length; ++t)
    if (n[t].type === e)
      return !0;
  return !1;
}
function Es(n) {
  for (let e = 0; e < n.length; ++e)
    switch (n[e].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return e;
    }
  return -1;
}
function $n(n) {
  switch (n == null ? void 0 : n.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return !0;
    default:
      return !1;
  }
}
function Xe(n) {
  switch (n.type) {
    case "document":
      return n.start;
    case "block-map": {
      const e = n.items[n.items.length - 1];
      return e.sep ?? e.start;
    }
    case "block-seq":
      return n.items[n.items.length - 1].start;
    /* istanbul ignore next should not happen */
    default:
      return [];
  }
}
function ae(n) {
  var t;
  if (n.length === 0)
    return [];
  let e = n.length;
  e: for (; --e >= 0; )
    switch (n[e].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break e;
    }
  for (; ((t = n[++e]) == null ? void 0 : t.type) === "space"; )
    ;
  return n.splice(e, n.length);
}
function ot(n, e) {
  if (e.length < 1e5)
    Array.prototype.push.apply(n, e);
  else
    for (let t = 0; t < e.length; ++t)
      n.push(e[t]);
}
function _s(n) {
  if (n.start.type === "flow-seq-start")
    for (const e of n.items)
      e.sep && !e.value && !J(e.start, "explicit-key-ind") && !J(e.sep, "map-value-ind") && (e.key && (e.value = e.key), delete e.key, $n(e.value) ? e.value.end ? ot(e.value.end, e.sep) : e.value.end = e.sep : ot(e.start, e.sep), delete e.sep);
}
class Xi {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(e) {
    this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new Qi(), this.onNewLine = e;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(e, t = !1) {
    this.onNewLine && this.offset === 0 && this.onNewLine(0);
    for (const s of this.lexer.lex(e, t))
      yield* this.next(s);
    t || (yield* this.end());
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(e) {
    if (this.source = e, this.atScalar) {
      this.atScalar = !1, yield* this.step(), this.offset += e.length;
      return;
    }
    const t = Yi(e);
    if (t)
      if (t === "scalar")
        this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
      else {
        switch (this.type = t, yield* this.step(), t) {
          case "newline":
            this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + e.length);
            break;
          case "space":
            this.atNewLine && e[0] === " " && (this.indent += e.length);
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            this.atNewLine && (this.indent += e.length);
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += e.length;
      }
    else {
      const s = `Not a YAML token: ${e}`;
      yield* this.pop({ type: "error", offset: this.offset, message: s, source: e }), this.offset += e.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    for (; this.stack.length > 0; )
      yield* this.pop();
  }
  get sourceToken() {
    return {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  *step() {
    const e = this.peek(1);
    if (this.type === "doc-end" && (e == null ? void 0 : e.type) !== "doc-end") {
      for (; this.stack.length > 0; )
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!e)
      return yield* this.stream();
    switch (e.type) {
      case "document":
        return yield* this.document(e);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(e);
      case "block-scalar":
        return yield* this.blockScalar(e);
      case "block-map":
        return yield* this.blockMap(e);
      case "block-seq":
        return yield* this.blockSequence(e);
      case "flow-collection":
        return yield* this.flowCollection(e);
      case "doc-end":
        return yield* this.documentEnd(e);
    }
    yield* this.pop();
  }
  peek(e) {
    return this.stack[this.stack.length - e];
  }
  *pop(e) {
    const t = e ?? this.stack.pop();
    if (!t)
      yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
    else if (this.stack.length === 0)
      yield t;
    else {
      const s = this.peek(1);
      switch (t.type === "block-scalar" ? t.indent = "indent" in s ? s.indent : 0 : t.type === "flow-collection" && s.type === "document" && (t.indent = 0), t.type === "flow-collection" && _s(t), s.type) {
        case "document":
          s.value = t;
          break;
        case "block-scalar":
          s.props.push(t);
          break;
        case "block-map": {
          const i = s.items[s.items.length - 1];
          if (i.value) {
            s.items.push({ start: [], key: t, sep: [] }), this.onKeyLine = !0;
            return;
          } else if (i.sep)
            i.value = t;
          else {
            Object.assign(i, { key: t, sep: [] }), this.onKeyLine = !i.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const i = s.items[s.items.length - 1];
          i.value ? s.items.push({ start: [], value: t }) : i.value = t;
          break;
        }
        case "flow-collection": {
          const i = s.items[s.items.length - 1];
          !i || i.value ? s.items.push({ start: [], key: t, sep: [] }) : i.sep ? i.value = t : Object.assign(i, { key: t, sep: [] });
          return;
        }
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop(), yield* this.pop(t);
      }
      if ((s.type === "document" || s.type === "block-map" || s.type === "block-seq") && (t.type === "block-map" || t.type === "block-seq")) {
        const i = t.items[t.items.length - 1];
        i && !i.sep && !i.value && i.start.length > 0 && Es(i.start) === -1 && (t.indent === 0 || i.start.every((r) => r.type !== "comment" || r.indent < t.indent)) && (s.type === "document" ? s.end = i.start : s.items.push({ start: i.start }), t.items.splice(-1, 1));
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const e = {
          type: "document",
          offset: this.offset,
          start: []
        };
        this.type === "doc-start" && e.start.push(this.sourceToken), this.stack.push(e);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(e) {
    if (e.value)
      return yield* this.lineEnd(e);
    switch (this.type) {
      case "doc-start": {
        Es(e.start) !== -1 ? (yield* this.pop(), yield* this.step()) : e.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        e.start.push(this.sourceToken);
        return;
    }
    const t = this.startBlockValue(e);
    t ? this.stack.push(t) : yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML document`,
      source: this.source
    };
  }
  *scalar(e) {
    if (this.type === "map-value-ind") {
      const t = Xe(this.peek(2)), s = ae(t);
      let i;
      e.end ? (i = e.end, i.push(this.sourceToken), delete e.end) : i = [this.sourceToken];
      const r = {
        type: "block-map",
        offset: e.offset,
        indent: e.indent,
        items: [{ start: s, key: e, sep: i }]
      };
      this.onKeyLine = !0, this.stack[this.stack.length - 1] = r;
    } else
      yield* this.lineEnd(e);
  }
  *blockScalar(e) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        e.props.push(this.sourceToken);
        return;
      case "scalar":
        if (e.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
          let t = this.source.indexOf(`
`) + 1;
          for (; t !== 0; )
            this.onNewLine(this.offset + t), t = this.source.indexOf(`
`, t) + 1;
        }
        yield* this.pop();
        break;
      /* istanbul ignore next should not happen */
      default:
        yield* this.pop(), yield* this.step();
    }
  }
  *blockMap(e) {
    var s;
    const t = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (this.onKeyLine = !1, t.value) {
          const i = "end" in t.value ? t.value.end : void 0, r = Array.isArray(i) ? i[i.length - 1] : void 0;
          (r == null ? void 0 : r.type) === "comment" ? i == null || i.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (t.value)
          e.items.push({ start: [this.sourceToken] });
        else if (t.sep)
          t.sep.push(this.sourceToken);
        else {
          if (this.atIndentedComment(t.start, e.indent)) {
            const i = e.items[e.items.length - 2], r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.end;
            if (Array.isArray(r)) {
              ot(r, t.start), r.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          t.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= e.indent) {
      const i = !this.onKeyLine && this.indent === e.indent, r = i && (t.sep || t.explicitKey) && this.type !== "seq-item-ind";
      let o = [];
      if (r && t.sep && !t.value) {
        const a = [];
        for (let l = 0; l < t.sep.length; ++l) {
          const c = t.sep[l];
          switch (c.type) {
            case "newline":
              a.push(l);
              break;
            case "space":
              break;
            case "comment":
              c.indent > e.indent && (a.length = 0);
              break;
            default:
              a.length = 0;
          }
        }
        a.length >= 2 && (o = t.sep.splice(a[1]));
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          r || t.value ? (o.push(this.sourceToken), e.items.push({ start: o }), this.onKeyLine = !0) : t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
          return;
        case "explicit-key-ind":
          !t.sep && !t.explicitKey ? (t.start.push(this.sourceToken), t.explicitKey = !0) : r || t.value ? (o.push(this.sourceToken), e.items.push({ start: o, explicitKey: !0 })) : this.stack.push({
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken], explicitKey: !0 }]
          }), this.onKeyLine = !0;
          return;
        case "map-value-ind":
          if (t.explicitKey)
            if (t.sep)
              if (t.value)
                e.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (J(t.sep, "map-value-ind"))
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: o, key: null, sep: [this.sourceToken] }]
                });
              else if ($n(t.key) && !J(t.sep, "newline")) {
                const a = ae(t.start), l = t.key, c = t.sep;
                c.push(this.sourceToken), delete t.key, delete t.sep, this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: a, key: l, sep: c }]
                });
              } else o.length > 0 ? t.sep = t.sep.concat(o, this.sourceToken) : t.sep.push(this.sourceToken);
            else if (J(t.start, "newline"))
              Object.assign(t, { key: null, sep: [this.sourceToken] });
            else {
              const a = ae(t.start);
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: a, key: null, sep: [this.sourceToken] }]
              });
            }
          else
            t.sep ? t.value || r ? e.items.push({ start: o, key: null, sep: [this.sourceToken] }) : J(t.sep, "map-value-ind") ? this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [], key: null, sep: [this.sourceToken] }]
            }) : t.sep.push(this.sourceToken) : Object.assign(t, { key: null, sep: [this.sourceToken] });
          this.onKeyLine = !0;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const a = this.flowScalar(this.type);
          r || t.value ? (e.items.push({ start: o, key: a, sep: [] }), this.onKeyLine = !0) : t.sep ? this.stack.push(a) : (Object.assign(t, { key: a, sep: [] }), this.onKeyLine = !0);
          return;
        }
        default: {
          const a = this.startBlockValue(e);
          if (a) {
            if (a.type === "block-seq") {
              if (!t.explicitKey && t.sep && !J(t.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else i && e.items.push({ start: o });
            this.stack.push(a);
            return;
          }
        }
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *blockSequence(e) {
    var s;
    const t = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (t.value) {
          const i = "end" in t.value ? t.value.end : void 0, r = Array.isArray(i) ? i[i.length - 1] : void 0;
          (r == null ? void 0 : r.type) === "comment" ? i == null || i.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else
          t.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (t.value)
          e.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(t.start, e.indent)) {
            const i = e.items[e.items.length - 2], r = (s = i == null ? void 0 : i.value) == null ? void 0 : s.end;
            if (Array.isArray(r)) {
              ot(r, t.start), r.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          t.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (t.value || this.indent <= e.indent)
          break;
        t.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== e.indent)
          break;
        t.value || J(t.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
        return;
    }
    if (this.indent > e.indent) {
      const i = this.startBlockValue(e);
      if (i) {
        this.stack.push(i);
        return;
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *flowCollection(e) {
    const t = e.items[e.items.length - 1];
    if (this.type === "flow-error-end") {
      let s;
      do
        yield* this.pop(), s = this.peek(1);
      while ((s == null ? void 0 : s.type) === "flow-collection");
    } else if (e.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          !t || t.sep ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          !t || t.value ? e.items.push({ start: [], key: null, sep: [this.sourceToken] }) : t.sep ? t.sep.push(this.sourceToken) : Object.assign(t, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          !t || t.value ? e.items.push({ start: [this.sourceToken] }) : t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const i = this.flowScalar(this.type);
          !t || t.value ? e.items.push({ start: [], key: i, sep: [] }) : t.sep ? this.stack.push(i) : Object.assign(t, { key: i, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          e.end.push(this.sourceToken);
          return;
      }
      const s = this.startBlockValue(e);
      s ? this.stack.push(s) : (yield* this.pop(), yield* this.step());
    } else {
      const s = this.peek(2);
      if (s.type === "block-map" && (this.type === "map-value-ind" && s.indent === e.indent || this.type === "newline" && !s.items[s.items.length - 1].sep))
        yield* this.pop(), yield* this.step();
      else if (this.type === "map-value-ind" && s.type !== "flow-collection") {
        const i = Xe(s), r = ae(i);
        _s(e);
        const o = e.end.splice(1, e.end.length);
        o.push(this.sourceToken);
        const a = {
          type: "block-map",
          offset: e.offset,
          indent: e.indent,
          items: [{ start: r, key: e, sep: o }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = a;
      } else
        yield* this.lineEnd(e);
    }
  }
  flowScalar(e) {
    if (this.onNewLine) {
      let t = this.source.indexOf(`
`) + 1;
      for (; t !== 0; )
        this.onNewLine(this.offset + t), t = this.source.indexOf(`
`, t) + 1;
    }
    return {
      type: e,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(e) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = !0;
        const t = Xe(e), s = ae(t);
        return s.push(this.sourceToken), {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: s, explicitKey: !0 }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = !0;
        const t = Xe(e), s = ae(t);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: s, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(e, t) {
    return this.type !== "comment" || this.indent <= t ? !1 : e.every((s) => s.type === "newline" || s.type === "space");
  }
  *documentEnd(e) {
    this.type !== "doc-mode" && (e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
  }
  *lineEnd(e) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop(), yield* this.step();
        break;
      case "newline":
        this.onKeyLine = !1;
      // fallthrough
      case "space":
      case "comment":
      default:
        e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
    }
  }
}
function Zi(n) {
  const e = n.prettyErrors !== !1;
  return { lineCounter: n.lineCounter || e && new zi() || null, prettyErrors: e };
}
function xi(n, e = {}) {
  const { lineCounter: t, prettyErrors: s } = Zi(e), i = new Xi(t == null ? void 0 : t.addNewLine), r = new Wi(e);
  let o = null;
  for (const a of r.compose(i.parse(n), !0, n.length))
    if (!o)
      o = a;
    else if (o.options.logLevel !== "silent") {
      o.errors.push(new Te(a.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  return s && t && (o.errors.forEach(Ss(n, t)), o.warnings.forEach(Ss(n, t))), o;
}
function er(n, e, t) {
  let s;
  const i = xi(n, t);
  if (!i)
    return null;
  if (i.warnings.forEach((r) => Ws(i.options.logLevel, r)), i.errors.length > 0) {
    if (i.options.logLevel !== "silent")
      throw i.errors[0];
    i.errors = [];
  }
  return i.toJS(Object.assign({ reviver: s }, t));
}
function tr(n, e, t) {
  let s = null;
  if (Array.isArray(e) && (s = e), n === void 0) {
    const { keepUndefined: i } = {};
    if (!i)
      return;
  }
  return qe(n) && !s ? n.toString(t) : new es(n, s, t).toString(t);
}
const ss = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], sr = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat"
}, kn = /^([01]\d|2[0-3]):([0-5]\d)$/;
function nr(n) {
  if (!at(n))
    throw new Error("Scheduled departures card config must be an object.");
  if (!at(n.departuresCard))
    throw new Error("departuresCard is required and must be an object.");
  if (!Array.isArray(n.windows) || n.windows.length === 0)
    throw new Error("windows must include at least one schedule window.");
  n.windows.forEach((e, t) => {
    or(e, t);
  }), ar(n.windows);
}
function ir(n, e = /* @__PURE__ */ new Date()) {
  const t = sr[e.getDay()], s = e.getHours() * 60 + e.getMinutes();
  return n.find((i) => {
    if (!Mt(i).includes(t))
      return !1;
    const o = Q(i.from), a = i.to ? Q(i.to) : 1440;
    return s >= o && s < a;
  });
}
function rr(n, e) {
  const { title: t, entities: s } = e;
  return {
    type: "custom:departures-card",
    ...n.departuresCard,
    title: t,
    entities: s
  };
}
function or(n, e) {
  const t = `windows[${e}]`;
  if (!at(n))
    throw new Error(`${t} must be an object.`);
  if (!Ns(n.from))
    throw new Error(`${t}.from is required and must use HH:mm format.`);
  if (n.to !== void 0 && !Ns(n.to))
    throw new Error(`${t}.to must use HH:mm format.`);
  if (typeof n.to == "string" && Q(n.to) <= Q(n.from))
    throw new Error(`${t}.to must be later than from.`);
  if (n.days !== void 0) {
    if (!Array.isArray(n.days))
      throw new Error(`${t}.days must be a list of weekday names.`);
    for (const s of n.days)
      if (!ss.includes(s))
        throw new Error(`${t} contains invalid day "${String(s)}".`);
  }
  if (typeof n.title != "string")
    throw new Error(`${t}.title is required and must be a string.`);
  if (!Array.isArray(n.entities) || n.entities.length === 0)
    throw new Error(`${t}.entities must include at least one entity.`);
  n.entities.forEach((s, i) => {
    if (!at(s) || typeof s.entity != "string")
      throw new Error(`${t}.entities[${i}].entity is required.`);
  });
}
function ar(n) {
  for (let e = 0; e < n.length; e += 1)
    for (let t = e + 1; t < n.length; t += 1) {
      const s = n[e], i = n[t], r = Mt(s).filter((o) => Mt(i).includes(o));
      if (r.length > 0 && lr(s, i))
        throw new Error(
          `Schedule windows ${e + 1} and ${t + 1} overlap on ${r.join(
            ", "
          )}.`
        );
    }
}
function lr(n, e) {
  const t = Q(n.from), s = n.to ? Q(n.to) : 1440, i = Q(e.from), r = e.to ? Q(e.to) : 1440;
  return t < r && i < s;
}
function Mt(n) {
  return n.days && n.days.length > 0 ? n.days : ss;
}
function Q(n) {
  const e = kn.exec(n);
  if (!e)
    throw new Error(`Invalid time "${n}". Times must use HH:mm format.`);
  return Number(e[1]) * 60 + Number(e[2]);
}
function Ns(n) {
  return typeof n == "string" && kn.test(n);
}
function at(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
var cr = Object.defineProperty, fr = Object.getOwnPropertyDescriptor, yt = (n, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? fr(e, t) : e, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = (s ? o(e, t, i) : o(i)) || i);
  return s && i && cr(e, t, i), i;
};
const vs = {
  entity: "",
  lineColor: "",
  lineName: null,
  destinationName: null,
  destinationSource: "direction"
};
let we = class extends he {
  setConfig(n) {
    this.config = Os(n), this.yamlError = void 0;
  }
  addWindow() {
    this.config && this.emitConfig({
      ...this.config,
      windows: [
        ...this.config.windows,
        {
          from: "08:00",
          title: "New schedule",
          entities: [{ ...vs }]
        }
      ]
    });
  }
  deleteWindow(n) {
    this.config && this.emitConfig({
      ...this.config,
      windows: this.config.windows.filter((e, t) => t !== n)
    });
  }
  moveWindow(n, e) {
    if (!this.config)
      return;
    const t = n + e;
    if (t < 0 || t >= this.config.windows.length)
      return;
    const s = [...this.config.windows], [i] = s.splice(n, 1);
    s.splice(t, 0, i), this.emitConfig({ ...this.config, windows: s });
  }
  updateWindow(n, e) {
    if (!this.config)
      return;
    const t = this.config.windows.map((s, i) => {
      if (i !== n)
        return s;
      const r = { ...s, ...e };
      return e.to === "" && delete r.to, r;
    });
    this.emitConfig({ ...this.config, windows: t });
  }
  toggleDay(n, e) {
    if (!this.config)
      return;
    const t = this.config.windows[n], s = t.days ? [...t.days] : [], i = s.includes(e) ? s.filter((r) => r !== e) : [...s, e];
    this.updateWindow(n, {
      days: i.length > 0 ? i : void 0
    });
  }
  addEntity(n) {
    var t;
    const e = (t = this.config) == null ? void 0 : t.windows[n];
    e && this.updateWindow(n, {
      entities: [...e.entities, { ...vs }]
    });
  }
  deleteEntity(n, e) {
    var s;
    const t = (s = this.config) == null ? void 0 : s.windows[n];
    t && this.updateWindow(n, {
      entities: t.entities.filter((i, r) => r !== e)
    });
  }
  updateEntity(n, e, t) {
    var i;
    const s = (i = this.config) == null ? void 0 : i.windows[n];
    s && this.updateWindow(n, {
      entities: s.entities.map(
        (r, o) => o === e ? { ...r, ...t } : r
      )
    });
  }
  updateDeparturesCardYaml(n) {
    if (this.config)
      try {
        const e = er(n);
        if (!hr(e))
          throw new Error("departuresCard YAML must define an object.");
        this.yamlError = void 0, this.emitConfig({
          ...this.config,
          departuresCard: e
        });
      } catch (e) {
        this.yamlError = e instanceof Error ? e.message : String(e), this.requestUpdate();
      }
  }
  render() {
    return this.config ? V`
      <div class="editor">
        <label>
          Shared departures-card YAML
          <textarea
            aria-label="departuresCard YAML"
            rows="12"
            .value=${tr(this.config.departuresCard).trimEnd()}
            @change=${(n) => this.updateDeparturesCardYaml(n.target.value)}
          ></textarea>
        </label>
        ${this.yamlError ? V`<div class="error">${this.yamlError}</div>` : O}

        <div class="header">
          <h3>Schedule windows</h3>
          <button type="button" @click=${() => this.addWindow()}>Add window</button>
        </div>

        ${this.config.windows.map(
      (n, e) => V`
            <section class="window">
              <div class="window-toolbar">
                <strong>${n.title || `Window ${e + 1}`}</strong>
                <span>
                  <button
                    type="button"
                    ?disabled=${e === 0}
                    @click=${() => this.moveWindow(e, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    ?disabled=${e === this.config.windows.length - 1}
                    @click=${() => this.moveWindow(e, 1)}
                  >
                    Down
                  </button>
                  <button type="button" @click=${() => this.deleteWindow(e)}>
                    Delete
                  </button>
                </span>
              </div>

              <div class="grid">
                <label>
                  From
                  <input
                    type="time"
                    .value=${n.from}
                    @change=${(t) => this.updateWindow(e, {
        from: t.target.value
      })}
                  />
                </label>
                <label>
                  To
                  <input
                    type="time"
                    .value=${n.to ?? ""}
                    @change=${(t) => this.updateWindow(e, {
        to: t.target.value
      })}
                  />
                </label>
                <label>
                  Title
                  <input
                    .value=${n.title}
                    @change=${(t) => this.updateWindow(e, {
        title: t.target.value
      })}
                  />
                </label>
              </div>

              <fieldset>
                <legend>Days</legend>
                ${ss.map(
        (t) => {
          var s;
          return V`
                    <label class="day">
                      <input
                        type="checkbox"
                        .checked=${((s = n.days) == null ? void 0 : s.includes(t)) ?? !1}
                        @change=${() => this.toggleDay(e, t)}
                      />
                      ${t}
                    </label>
                  `;
        }
      )}
              </fieldset>

              <div class="header">
                <h4>Entities</h4>
                <button type="button" @click=${() => this.addEntity(e)}>
                  Add entity
                </button>
              </div>

              ${n.entities.map(
        (t, s) => V`
                  <div class="entity">
                    ${this.renderEntityField(e, s, t, "entity")}
                    ${this.renderEntityField(e, s, t, "lineColor")}
                    ${this.renderEntityField(e, s, t, "lineName")}
                    ${this.renderEntityField(
          e,
          s,
          t,
          "destinationName"
        )}
                    ${this.renderEntityField(
          e,
          s,
          t,
          "destinationSource"
        )}
                    <button
                      type="button"
                      @click=${() => this.deleteEntity(e, s)}
                    >
                      Delete entity
                    </button>
                  </div>
                `
      )}
            </section>
          `
    )}
      </div>
    ` : O;
  }
  renderEntityField(n, e, t, s) {
    return V`
      <label>
        ${s}
        <input
          .value=${String(t[s] ?? "")}
          @change=${(i) => this.updateEntity(n, e, {
      [s]: ur(i.target.value)
    })}
          data-field=${String(s)}
        />
      </label>
    `;
  }
  emitConfig(n) {
    this.config = Os(n), this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: n },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
we.styles = En`
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 16px;
    }

    label {
      display: grid;
      gap: 6px;
      font-weight: 500;
    }

    input,
    textarea {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font: inherit;
      padding: 8px;
    }

    textarea {
      font-family: var(--code-font-family, monospace);
      min-height: 180px;
    }

    button {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 4px;
      background: var(--secondary-background-color, #f4f4f4);
      color: var(--primary-text-color, #111);
      cursor: pointer;
      font: inherit;
      padding: 6px 10px;
    }

    button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .header,
    .window-toolbar {
      align-items: center;
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }

    h3,
    h4 {
      margin: 0;
    }

    .window {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 8px;
      display: grid;
      gap: 12px;
      padding: 12px;
    }

    .grid,
    .entity {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }

    fieldset {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 6px;
      margin: 0;
      padding: 10px;
    }

    .day {
      display: inline-flex;
      gap: 4px;
      margin: 4px 10px 4px 0;
    }

    .day input {
      width: auto;
    }

    .error {
      color: var(--error-color, #db4437);
    }
  `;
yt([
  Kt({ attribute: !1 })
], we.prototype, "hass", 2);
yt([
  Re()
], we.prototype, "config", 2);
yt([
  Re()
], we.prototype, "yamlError", 2);
we = yt([
  Ds("scheduled-departures-card-editor")
], we);
function Os(n) {
  return structuredClone(n);
}
function ur(n) {
  return n === "" ? null : n;
}
function hr(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
var dr = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, Ye = (n, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? pr(e, t) : e, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = (s ? o(e, t, i) : o(i)) || i);
  return s && i && dr(e, t, i), i;
};
let Se = class extends he {
  static getConfigElement() {
    return document.createElement("scheduled-departures-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:scheduled-departures-card",
      departuresCard: {},
      windows: [
        {
          from: "08:00",
          title: "New schedule",
          entities: [
            {
              entity: "",
              destinationSource: "direction"
            }
          ]
        }
      ]
    };
  }
  setConfig(n) {
    try {
      nr(n), this.config = n, this.error = void 0, this.refreshActiveWindow(), this.ensureTimer();
    } catch (e) {
      this.config = void 0, this.activeWindow = void 0, this.error = e instanceof Error ? e.message : String(e), this.clearTimer();
    }
  }
  connectedCallback() {
    super.connectedCallback(), this.ensureTimer();
  }
  disconnectedCallback() {
    this.clearTimer(), super.disconnectedCallback();
  }
  getCardSize() {
    return this.error || this.activeWindow ? 1 : 0;
  }
  updated(n) {
    n.has("hass") && this.child && this.hass && (this.child.hass = this.hass), this.syncChild();
  }
  render() {
    return this.error ? V`
        <ha-card>
          <div class="error">
            <strong>Scheduled Departures Card configuration error</strong>
            <div>${this.error}</div>
          </div>
        </ha-card>
      ` : !this.config || !this.activeWindow ? O : customElements.get("departures-card") ? V`<div id="card-host"></div>` : V`
        <ha-card>
          <div class="error">
            <strong>Missing required card</strong>
            <div>Install custom:departures-card before using scheduled-departures-card.</div>
          </div>
        </ha-card>
      `;
  }
  refreshActiveWindow() {
    this.activeWindow = this.config ? ir(this.config.windows) : void 0;
  }
  ensureTimer() {
    !this.isConnected || !this.config || this.timerId || (this.timerId = window.setInterval(() => {
      this.refreshActiveWindow();
    }, 6e4));
  }
  clearTimer() {
    this.timerId && (window.clearInterval(this.timerId), this.timerId = void 0);
  }
  syncChild() {
    var t, s;
    const n = this.renderRoot.querySelector("#card-host");
    if (!n || !this.config || !this.activeWindow || !customElements.get("departures-card")) {
      this.child = void 0;
      return;
    }
    const e = rr(this.config, this.activeWindow);
    (!this.child || this.child.parentElement !== n) && (n.replaceChildren(), this.child = document.createElement("departures-card"), n.append(this.child)), (s = (t = this.child).setConfig) == null || s.call(t, e), this.hass && (this.child.hass = this.hass);
  }
};
Ye([
  Kt({ attribute: !1 })
], Se.prototype, "hass", 2);
Ye([
  Re()
], Se.prototype, "config", 2);
Ye([
  Re()
], Se.prototype, "activeWindow", 2);
Ye([
  Re()
], Se.prototype, "error", 2);
Se = Ye([
  Ds("scheduled-departures-card")
], Se);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "scheduled-departures-card",
  name: "Scheduled Departures Card",
  description: "Schedule which ha-departures-card departures are shown by local time.",
  preview: !1
});
