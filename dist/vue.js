(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  var callbacks = [];
  var pending = false;
  var p = Promise.resolve();
  /**
   * 清空callbacks
   */

  function flushCallbacks() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    copies.forEach(function (copies) {
      copies();
    });
  }

  function timerFunc() {
    p.then(flushCallbacks);
  }

  function nextTick(cb, ctx) {
    var _resolve;

    callbacks.push(function () {
      if (cb) {
        cb.call(ctx);
      } else if (_resolve) {
        _resolve(ctx);
      }
    });

    if (!pending) {
      pending = true;
      timerFunc();
    }

    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      });
    }
  }

  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured', 'serverPrefetch'];
  var ASSET_TYPES = ['component', 'directive', 'filter'];

  function initAssetRegisters(Vue) {
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (id, definition) {
        if (type === 'component') {
          definition = this.options._base.extend(definition);
        }

        this.options[type + 's'][id] = definition;
      };
    });
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function isObject(data) {
    return _typeof(data) === "object" && data !== null;
  }
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  var strategy = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strategy[hook] = mergeHook;
  });

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  strategy['components'] = function (parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  };

  function mergeOptions(parent, child) {
    var options = {};

    function mergeField(key) {
      if (strategy[key]) {
        // debugger
        return options[key] = strategy[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }

      return options;
    }

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    return options;
  }
  function isReservedTag(tag) {
    var str = 'input,div,ul,li,span,p';
    var obj = {};
    str.split(',').forEach(function (key) {
      obj[key] = true;
    });
    return !!obj[tag];
  }

  var cid = 0;
  function initExtend(Vue) {
    Vue.extend = function (extendOptions) {
      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.prototype = Object.create(this.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(this.options, extendOptions);
      return Sub;
    };
  }

  function initMixin(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};
    initMixin(Vue);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = {};
    });
    Vue.options._base = Vue;
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  var oldArrayMethods = Array.prototype;
  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  var arrayMethods = Object.create(oldArrayMethods);
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var ret = oldArrayMethods[method].apply(this, args);
      var ob = this.__ob__;
      var inserted;

      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;

        case 'splice':
          // splice方法的第三个参数才是插入的值
          inserted = args.slice(2);
          break;
      }

      inserted && ob.observeArray(inserted);
      return ret;
    };
  });

  var uid = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = uid++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(sub) {
        this.subs.push(sub);
      }
    }, {
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }
    }, {
      key: "notify",
      value: function notify() {
        var subs = this.subs.slice();
        subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }(); //这个target是为了获取依赖的Watcher
  Dep.target = null;
  var targetStack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    targetStack.push(watcher);
  }
  function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false,
        configurable: false
      }); // 不需要对数组索引进行拦截

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
      } else {
        this.walk(data); //对数据分步处理
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]); // 定义响应式变化
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        for (var i in data) {
          observe(data[i]); // 解决数组内对象的响应式
        }
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    var dep = new Dep();
    observe(value); // debugger
    // if (data.__ob__ instanceof Observer) {
    //   return;
    // }

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        if (Dep.target) {
          dep.depend();
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(value);
        value = newValue;
        dep.notify();
      }
    });
  }
  function observe(data) {
    // TODO对数据监控
    if (!isObject(data)) {
      return;
    } // 对data数据做definePropert


    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) {
      initProps(vm, opts.props);
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.methods) {
      initMethods(vm, opts.methods);
    } // compouted
    // watch

  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对数据进行观测

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  function initProps(vm, propsOptions) {
    var propsData = vm.$options.propsData;
    var props = vm._props = {};
    var keys = vm.$props._propKeys = [];

    for (var key in propsOptions) {
      keys.push(key);
      var value = props.value;
      defineReactive(props, key, value);

      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    }
  }

  function initMethods(vm, methods) {
    var porps = vm.$options.props;

    for (var key in methods) {
      vm[key] = typeof methods[key] !== 'function' ? function () {} : methods[key].bind(vm);
    }
  }

  function stateMixin(Vue) {
    var dataDef = {};

    dataDef.get = function () {
      return this._data;
    };

    var propsDef = {};

    propsDef.get = function () {
      return this._props;
    };

    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);
  }

  //
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //<a:a>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配结尾的</div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/; // ast语法树树根

  var currentParent; // 标识当前父亲

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  } // <div><p></p></div>


  function parseHTML(html) {
    var root = null;

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 把当前元素标记为父AST

      stack.push(element);
    }

    function end(tagName) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    } // 使用正则解析
    // 不断截取html字符串，对截取内容解析


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd); // 文本内容截取
      }

      if (text) {
        chars(text);
        advance(text.length);
      }

      if (textEnd < 0) {
        break;
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            "name": attr[1],
            "value": attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配动态变量的+？

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return str;
  }

  function genChildren(el) {
    var children = el;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type === 1) {
      // 元素
      return generate(node);
    } else {
      // 文本
      // 正则 lastIndex问题
      var text = node.text;
      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    var children = genChildren(el.children); // 子节点

    var code = "_c(\"".concat(el.tag, "\",{").concat(el.attrs.length ? genProps(el.attrs) : 'undefined', "}\n  ").concat(children ? ",".concat(children) : '', ")\n  ");
    return code;
  }

  function compileToFunction(template) {
    // 编译模板为render函数
    // 1. 将代码-》ast语法树 paser解析
    var root = parseHTML(template);
    console.log(root); // console.log(root);
    // 将AST语法树生成Render函数

    var code = generate(root);
    code = "with(this){ return ".concat(code, "}");
    var renderFn = new Function(code);
    return renderFn; // 2. 标记静态书 markup解析
    // 3. 通过ast产生的语法树，生成render函数 render（codegen）
  }

  var has = {};
  var queue = [];

  function flushSchedulerQueue() {
    queue.forEach(function (watcher) {
      watcher.run();
    });
    has = {};
    queue = [];
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      has[id] = true;

      {
        queue.push(watcher);
      }

      nextTick(flushSchedulerQueue, 0);
    }
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.getter = exprOrFn;
      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        var vm = this.vm;
        pushTarget(this);
        this.getter.call(vm);
        popTarget();
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        dep.addSub(this);
      }
    }, {
      key: "update",
      value: function update() {
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  function sameVnode(a, b) {
    return a.key === b.key && a.tag === b.tag;
  }

  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, key;
    var map = {};

    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      map[key] = i;
    }

    return map;
  }

  function patch(oldVnode, vnode) {
    if (!oldVnode) {
      return createElm(vnode);
    } else {
      var isRealElement = oldVnode.nodeType;

      if (isRealElement) {
        // 若oldVnode是一个真实节点，首渲染
        var oldElm = oldVnode;
        var parentElm = oldElm.parentNode;
        var el = createElm(vnode);
        parentElm.insertBefore(el, oldElm);
        parentElm.removeChild(oldElm);
        return el;
      } else {
        var _oldVnode$children, _vnode$children;

        if (oldVnode.tag !== vnode.tag) {
          var _el2 = oldVnode.el; // 获取真实节点

          oldVnode.el = _el2.parentNode.replaceChild(createElm(vnode), _el2);
        }

        if (!oldVnode.tag) {
          if (oldVnode.text !== vnode.text) {
            oldVnode.el.textContent = vnode.text;
          }
        }

        var _el = vnode.el = oldVnode.el;

        updatePrototies(vnode, oldVnode);
        var oldChildren = (_oldVnode$children = oldVnode === null || oldVnode === void 0 ? void 0 : oldVnode.children) !== null && _oldVnode$children !== void 0 ? _oldVnode$children : [];
        var newChildren = (_vnode$children = vnode === null || vnode === void 0 ? void 0 : vnode.children) !== null && _vnode$children !== void 0 ? _vnode$children : [];

        if (oldChildren.length && newChildren.length) {
          updateChildren(_el, oldChildren, newChildren);
        } else if (newChildren.length > 0) {
          var _iterator = _createForOfIteratorHelper(newChildren),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var child = _step.value;

              _el.appendChild(createElm(child));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else if (oldChildren.length > 0) {
          _el.innerHTML = '';
        }
      }
    }
  }

  function updateChildren(parentElm, oldChildren, newChildren) {
    var oldKeyToIdx;
    var oldStartIndex = 0,
        oldStartVnode = oldChildren[oldStartIndex],
        oldEndIndex = oldChildren.length - 1,
        oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0,
        newStartVnode = newChildren[newStartIndex],
        newEndIndex = newChildren.length - 1,
        newEndVnode = newChildren[newEndIndex]; // debugger

    while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      }

      if (sameVnode(oldStartVnode, newStartVnode)) {
        console.log(oldStartVnode, newStartVnode);
        patch(oldStartVnode, newStartVnode); // 复用

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        patch(oldStartVnode, newEndVnode);
        parentElm.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // debugger
        patch(oldEndVnode, newStartVnode);
        parentElm.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 乱序
        // 通过老key做映射表
        // 在映射表如果有当前newVnode则将那个node移动到oldEndVnode前面
        // 如果没有则新建一个newVnode的节点然后吧这个节点插入到startVnode前
        if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldIdx(oldChildren, oldStartIndex, oldEndIndex);
        var idxInOld = oldKeyToIdx[newStartVnode.key];

        if (!idxInOld) {
          parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var vnodeToMove = oldChildren[idxInOld];
          oldChildren[idxInOld] = undefined;
          parentElm.insertBefore(vnodeToMove.el, oldStartVnode.el);
          patch(vnodeToMove, newStartVnode);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    }

    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; ++i) {
        var _newChildren$el, _newChildren;

        // parentElm.appendChild(createElm(newChildren[ i ]));
        var el = (_newChildren$el = (_newChildren = newChildren[newEndIndex + 1]) === null || _newChildren === void 0 ? void 0 : _newChildren.el) !== null && _newChildren$el !== void 0 ? _newChildren$el : null; // console.log('----', el, newChildren[ i ]);

        parentElm.insertBefore(createElm(newChildren[i]), el);
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; ++_i) {
        var child = oldChildren[_i];

        if (child != undefined) {
          parentElm.removeChild(child.el);
        }
      }
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag === 'string') {
      // TODO 组件判断
      if (createComponent(vnode)) {
        return vnode.el = vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag);
      updatePrototies(vnode);
      children.forEach(function (child) {
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function createComponent(vnode) {
    var d = vnode.data;
    d.hooks && d.hooks.init && d.hooks.init(vnode); // if ((d = d.hooks) && (d = d.init)) {
    //   d(vnode);
    // }

    if (vnode.componentInstance) {
      return true;
    }
  }

  function updatePrototies(vnode, oldVnode) {
    var newProps = vnode.data || {};
    var el = vnode.el;

    if (oldVnode) {
      var _oldProps$style, _newProps$style;

      var oldProps = oldVnode.data || {}; // 处理style

      var oldStyle = (_oldProps$style = oldProps.style) !== null && _oldProps$style !== void 0 ? _oldProps$style : {};
      var newStyle = (_newProps$style = newProps.style) !== null && _newProps$style !== void 0 ? _newProps$style : {};

      for (var key in oldStyle) {
        if (!newStyle[key]) el.style[key] = '';
      }

      for (var _key in oldProps) {
        if (!newProps[_key]) {
          el.removeAttribute(_key);
        }
      }
    }

    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName.trim()] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else if (_key2 !== 'undefined') {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function mountComponent(vm, el) {
    var opts = vm.$options;
    vm.$el = el;
    callHook(vm, 'beforeMount');

    var updateComponent = function updateComponent() {
      callHook(vm, 'beforeUpdate'); // 1. 通过_render方法生成虚拟dom
      // 2. _update方法通过vnode生成真实dom

      vm._update(vm._render());

      callHook(vm, 'updated');
    }; // 通过生成Watcher达成首次渲染


    new Watcher(vm, updateComponent, function () {}, true);
    callHook(vm, 'mounted');
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this; // vm.$el = patch(vm.$el, vnode);

      var prevVnode = vm._vnode;
      vm._vnode = vnode;

      if (!prevVnode) {
        vm.$el = patch(vm.$el, vnode);
      } else {
        vm.$el = patch(prevVnode, vnode);
      }
    };
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (i) {
        return i.call(vm);
      });
    }
  }

  function initMixin$1(Vue) {
    Vue.prototype._init = function (options) {
      //Vue的内部属性#options 用户传递所以参数
      var vm = this; // console.log(vm.constructor.options, options)

      vm.$options = mergeOptions(vm.constructor.options, options); // console.log('opt', vm.$options)

      callHook(vm, 'beforeCreate');
      initState(vm); // 初始化状态

      callHook(vm, 'created'); // 通过模板渲染

      if (vm.$options.el) {
        // 用户提供挂载节点
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el);
      var vm = this; // 同时存在template与render使用render，如果没有则使用id=“app”的模板
      // 将template转换为render函数挂载到opts上

      var opts = this.$options;

      if (!opts.render) {
        // 如果没有render，则编译模板
        var template = opts.template; // console.log('opts---', opts);

        if (!template && el) {
          template = el.outerHTML;
        } // console.log(template)


        var render = compileToFunction(template);
        opts.render = render;
      } //  opts.render;


      mountComponent(vm, el);
    };

    Vue.prototype.$nextTick = nextTick;
  }

  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }

  function createComponent$1(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
      Ctor = vm.$options._base.extend(Ctor);
    }

    data.hooks = {
      init: function init(vnode) {
        var child = vnode.componentInstance = new Ctor({
          _isComponent: true
        });
        child.$mount();
      }
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  function createElement(vm, tag, data) {
    var key = data.key;

    if (key) {
      delete data[key];
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (isReservedTag(tag)) {
      return vnode(tag, data, key, children, undefined);
    } else {
      var Ctor = vm.$options.components[tag];
      return createComponent$1(vm, tag, data, key, children, Ctor);
    }
  }
  function createTextNode(vm, text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function renderMixin(Vue) {
    // 获取VNode
    // _c创建元素虚拟节点
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // _a 创建文本虚拟节点


    Vue.prototype._v = function (text) {
      return createTextNode(this, text);
    }; // _s JSOM.stringify();


    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      return vnode;
    };
  }

  function Vue(options) {
    // 初始化操作
    this._init(options);
  }

  initMixin$1(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  initGlobalAPI(Vue);
  stateMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
