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

  function initExtend(Vue) {
    Vue.extend = function (extendOptions) {
      var cid = 0;

      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.prototype = Object.create(this.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = ++cid;
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
    console.log(opts);

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


    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
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

  function initWatch(vm, watch) {
    for (var key in watch) {
      var handler = watch[key];

      if (Array.isArray[handler]) {
        var _iterator = _createForOfIteratorHelper(handler),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var h = _step.value;
            createWatcher(vm, key, h);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher(vm, expOrFn, handler, options) {
    if (_typeof(handler) === 'object') {
      options = handler;
      handler = options.handler;
    }

    if (typeof handler === 'string') {
      handler = vm[handler];
    }

    return vm.$watch(expOrFn, handler, options);
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

      nextTick(flushSchedulerQueue, this);
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
      this.user = options.user; // 判断是否是$watch创造的 watcher

      console.log(this.user);

      if (typeof exprOrFn === "string") {
        this.getter = function () {
          var path = exprOrFn.split('.');
          var obj = vm;

          var _iterator = _createForOfIteratorHelper(path),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var p = _step.value;
              obj = obj[p];
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return obj;
        };
      } else {
        this.getter = exprOrFn;
      }

      this.value = this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        var vm = this.vm;
        pushTarget(this);
        var value = this.getter.call(vm);
        popTarget();
        return value;
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
        var newVal = this.get();
        var oldVal = this.value;
        this.value = newVal;
        console.log(this.user);

        if (this.user) {
          this.cb.call(this.vm, newVal, oldVal);
        }
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
          console.log("-------", oldStartVnode);
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
        // console.log('el -----------------', vnode.el);
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
    console.log('component-vnode------------', vnode);
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
    var el = vnode.el; // console.log('____', newProps.onClick())

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
      } else if (_key2.startsWith('on')) {
        var event = _key2.toLowerCase();

        console.log();
        el[event] = newProps[_key2];
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

    console.log('create-------', children);

    if (isReservedTag(tag)) {
      return vnode(tag, data, key, children, undefined);
    } else {
      var Ctor = vm.$options.components[tag];
      console.log('createComponent');
      return createComponent$1(vm, tag, data, key, children, Ctor);
    }
  } // $createElement("div", {}, $createElement("div", { "onClick": this.handleClick.bind(this) }, $createTextNode(this.name)), $createElement("div", {}, $createTextNode(this.age)))
  // export function createElement (vm, tag, data, ...children) {
  //   let { key } = data ? data : { key: undefined };
  //   if (key) {
  //     delete data[ key ];
  //   }
  //   // children = children || []
  //   const ch = [];
  //   children.forEach(child => {
  //     ch.append(createElement(vm, child));
  //   })
  //   console.log('ch: ', ch, tag, vm)
  //   if (isReservedTag(tag)) {
  //     return vnode(tag, data, key, ch, undefined);
  //   } else if (tag == null) {
  //     return createTextNode(vm, tag);
  //   } else {
  //     let Ctor = vm.$options.components[ tag ];
  //     return createComponent(vm, tag, data, key, children, Ctor);
  //   }
  // }

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
      console.log(render);
      var vnode = render.call(vm, vm.$createElement); // console.log('vnode', vnode)

      return vnode;
    };
  }
  function initRender(vm) {
    vm.$createElement = function (tag, data) {
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }

      return createElement.apply(void 0, [vm, tag, data].concat(children));
    };

    vm.$createTextNode = function (text) {
      return createTextNode(vm, text);
    };
  }

  function oneObject(str) {
    var obj = {};
    str.split(",").forEach(function (_) {
      return obj[_] = true;
    });
    return obj;
  }

  var voidTag = oneObject("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");
  var specalTag = oneObject('xmp,style,script,noscript,textarea,template,#comment');
  var hiddenTag = oneObject('style,script,noscript,template');

  var JSXParser = function JSXParser(a, f) {
    if (!(this instanceof JSXParser)) {
      return _parse(a, f);
    }

    this.input = a;
    this.getOne = f;
  };

  JSXParser.prototype = {
    parse: function parse() {
      return _parse(this.input, this.getOne);
    }
  };
  var rsp = /\s/;
  /**
   * 
   * 
   * @param {any} string 
   * @param {any} getOne 只返回一个节点
   * @returns 
   */

  function _parse(string, getOne) {
    getOne = getOne === void 666 || getOne === true;
    var ret = lexer(string, getOne);

    if (getOne) {
      return typeof ret[0] === 'string' ? ret[1] : ret[0];
    }

    return ret;
  }

  function lexer(string, getOne) {
    var breakIndex = 120;
    var stack = [];
    var origString = string;
    var origLength = string.length;

    stack.last = function () {
      return stack[stack.length - 1];
    };

    var ret = [];

    function addNode(node) {
      var p = stack.last();

      if (p && p.children) {
        p.children.push(node);
      } else {
        ret.push(node);
      }
    }

    var lastNode;

    do {
      if (--breakIndex === 0) {
        break;
      }

      var arr = getCloseTag(string);

      if (arr) {
        //处理关闭标签
        string = string.replace(arr[0], '');

        var _node = stack.pop(); //处理下面两种特殊情况：
        //1. option会自动移除元素节点，将它们的nodeValue组成新的文本节点
        //2. table会将没有被thead, tbody, tfoot包起来的tr或文本节点，收集到一个新的tbody元素中


        if (_node.type === 'option') {
          _node.children = [{
            type: '#text',
            nodeValue: getText(_node)
          }];
        } else if (_node.type === 'table') {
          insertTbody(_node.children);
        }

        lastNode = null;

        if (getOne && ret.length === 1 && !stack.length) {
          return [origString.slice(0, origLength - string.length), ret[0]];
        }

        continue;
      }

      var arr = getOpenTag(string);

      if (arr) {
        string = string.replace(arr[0], '');
        var node = arr[1];
        addNode(node);
        var selfClose = !!(node.isVoidTag || specalTag[node.type]);

        if (!selfClose) {
          //放到这里可以添加孩子
          stack.push(node);
        }

        if (getOne && selfClose && !stack.length) {
          return [origString.slice(0, origLength - string.length), node];
        }

        lastNode = node;
        continue;
      }

      var text = '';

      do {
        //处理<div><<<<<<div>的情况
        var _index = string.indexOf('<');

        if (_index === 0) {
          text += string.slice(0, 1);
          string = string.slice(1);
        } else {
          break;
        }
      } while (string.length); //处理<div>{aaa}</div>,<div>xxx{aaa}xxx</div>,<div>xxx</div>{aaa}sss的情况


      var index = string.indexOf('<'); //判定它后面是否存在标签

      var bindex = string.indexOf('{'); //判定它后面是否存在jsx

      var aindex = string.indexOf('}');
      var hasJSX = bindex < aindex && (index === -1 || bindex < index);

      if (hasJSX) {
        if (bindex !== 0) {
          // 收集jsx之前的文本节点
          text += string.slice(0, bindex);
          string = string.slice(bindex);
        }

        addText(lastNode, text, addNode);
        string = string.slice(1); //去掉前面{

        var arr = parseCode(string);
        addNode(makeJSX(arr[1]));
        lastNode = false;
        string = string.slice(arr[0].length + 1); //去掉后面的}
      } else {
        if (index === -1) {
          text = string;
          string = '';
        } else {
          text += string.slice(0, index);
          string = string.slice(index);
        }

        addText(lastNode, text, addNode);
      }
    } while (string.length);

    return ret;
  }

  function addText(lastNode, text, addNode) {
    if (/\S/.test(text)) {
      if (lastNode && lastNode.type === '#text') {
        lastNode.text += text;
      } else {
        lastNode = {
          type: '#text',
          nodeValue: text
        };
        addNode(lastNode);
      }
    }
  } //它用于解析{}中的内容，如果遇到不匹配的}则返回, 根据标签切割里面的内容 


  function parseCode(string) {
    // <div id={ function(){<div/>} }>
    var word = '',
        //用于匹配前面的单词
    braceIndex = 1,
        codeIndex = 0,
        nodes = [],
        quote,
        escape = false,
        state = 'code';

    for (var i = 0, n = string.length; i < n; i++) {
      var c = string.charAt(i),
          next = string.charAt(i + 1);

      switch (state) {
        case 'code':
          if (c === '"' || c === "'") {
            state = 'string';
            quote = c;
          } else if (c === '{') {
            braceIndex++;
          } else if (c === '}') {
            braceIndex--;

            if (braceIndex === 0) {
              collectJSX(string, codeIndex, i, nodes);
              return [string.slice(0, i), nodes];
            }
          } else if (c === '<') {
            var word = '',
                empty = true,
                index = i - 1;

            do {
              c = string.charAt(index);

              if (empty && rsp.test(c)) {
                continue;
              }

              if (rsp.test(c)) {
                break;
              }

              empty = false;
              word = c + word;

              if (word.length > 7) {
                //性能优化
                break;
              }
            } while (--index >= 0);

            var chunkString = string.slice(i);

            if (word === '' || /(=>|return|\{|\(|\[|\,)$/.test(word) && /\<\w/.test(chunkString)) {
              collectJSX(string, codeIndex, i, nodes);
              var chunk = lexer(chunkString, true);
              nodes.push(chunk[1]);
              i += chunk[0].length - 1; //因为已经包含了<, 需要减1

              codeIndex = i + 1;
            }
          }

          break;

        case 'string':
          if (c == '\\' && (next === '"' || next === "'")) {
            escape = !escape;
          } else if (c === quote && !escape) {
            state = 'code';
          }

          break;
      }
    }
  }

  function collectJSX(string, codeIndex, i, nodes) {
    var nodeValue = string.slice(codeIndex, i);

    if (/\S/.test(nodeValue)) {
      //将{前面的东西放进去
      nodes.push({
        type: '#jsx',
        nodeValue: nodeValue
      });
    }
  }

  var rtbody = /^(tbody|thead|tfoot)$/;

  function insertTbody(nodes) {
    var tbody = false;

    for (var i = 0, n = nodes.length; i < n; i++) {
      var node = nodes[i];

      if (rtbody.test(node.nodeName)) {
        tbody = false;
        continue;
      }

      if (node.nodeName === 'tr') {
        if (tbody) {
          nodes.splice(i, 1);
          tbody.children.push(node);
          n--;
          i--;
        } else {
          tbody = {
            nodeName: 'tbody',
            props: {},
            children: [node]
          };
          nodes.splice(i, 1, tbody);
        }
      } else {
        if (tbody) {
          nodes.splice(i, 1);
          tbody.children.push(node);
          n--;
          i--;
        }
      }
    }
  }

  function getCloseTag(string) {
    if (string.indexOf("</") === 0) {
      var match = string.match(/\<\/(\w+)>/);

      if (match) {
        var tag = match[1];
        string = string.slice(3 + tag.length);
        return [match[0], {
          type: tag
        }];
      }
    }

    return null;
  }

  function getOpenTag(string) {
    if (string.indexOf("<") === 0) {
      var i = string.indexOf('<!--'); //处理注释节点

      if (i === 0) {
        var l = string.indexOf('-->');

        if (l === -1) {
          thow('注释节点没有闭合 ' + string.slice(0, 100));
        }

        var node = {
          type: '#comment',
          nodeValue: string.slice(4, l)
        };
        return [string.slice(0, l + 3), node];
      }

      var match = string.match(/\<(\w[^\s\/\>]*)/); //处理元素节点

      if (match) {
        var leftContent = match[0],
            tag = match[1];
        var node = {
          type: tag,
          props: {},
          children: []
        };
        string = string.replace(leftContent, ''); //去掉标签名(rightContent)

        var arr = getAttrs(string); //处理属性

        if (arr) {
          node.props = arr[1];
          string = string.replace(arr[0], '');
          leftContent += arr[0];
        }

        if (string[0] === '>') {
          //处理开标签的边界符
          leftContent += '>';
          string = string.slice(1);

          if (voidTag[node.type]) {
            node.isVoidTag = true;
          }
        } else if (string.slice(0, 2) === '/>') {
          //处理开标签的边界符
          leftContent += '/>';
          string = string.slice(2);
          node.isVoidTag = true;
        }

        if (!node.isVoidTag && specalTag[tag]) {
          //如果是script, style, xmp等元素
          var closeTag = '</' + tag + '>';
          var j = string.indexOf(closeTag);
          var nodeValue = string.slice(0, j);
          leftContent += nodeValue + closeTag;
          node.children.push({
            type: '#text',
            nodeValue: nodeValue
          });
        }

        return [leftContent, node];
      }
    }
  }

  function getText(node) {
    var ret = '';
    node.children.forEach(function (el) {
      if (el.type === '#text') {
        ret += el.nodeValue;
      } else if (el.children && !hiddenTag[el.type]) {
        ret += getText(el);
      }
    });
    return ret;
  }

  function getAttrs(string) {
    var state = 'AttrNameOrJSX',
        attrName = '',
        attrValue = '',
        quote,
        escape,
        props = {};

    for (var i = 0, n = string.length; i < n; i++) {
      var c = string[i];

      switch (state) {
        case 'AttrNameOrJSX':
          if (c === '/' || c === '>') {
            return [string.slice(0, i), props];
          }

          if (rsp.test(c)) {
            if (attrName) {
              state = 'AttrEqual';
            }
          } else if (c === '=') {
            if (!attrName) {
              throw '必须指定属性名';
            }

            state = 'AttrQuoteOrJSX';
          } else if (c === '{') {
            state = 'SpreadJSX';
          } else {
            attrName += c;
          }

          break;

        case 'AttrEqual':
          if (c === '=') {
            state = 'AttrQuoteOrJSX';
          }

          break;

        case 'AttrQuoteOrJSX':
          if (c === '"' || c === "'") {
            quote = c;
            state = 'AttrValue';
            escape = false;
          } else if (c === '{') {
            state = 'JSX';
          }

          break;

        case 'AttrValue':
          if (c === '\\') {
            escape = !escape;
          }

          if (c !== quote) {
            attrValue += c;
          } else if (c === quote && !escape) {
            props[attrName] = attrValue;
            attrName = attrValue = '';
            state = 'AttrNameOrJSX';
          }

          break;

        case 'SpreadJSX':
          i += 3;

        case 'JSX':
          var arr = parseCode(string.slice(i));
          i += arr[0].length;
          props[state === 'SpreadJSX' ? 'spreadAttribute' : attrName] = makeJSX(arr[1]);
          attrName = attrValue = '';
          state = 'AttrNameOrJSX';
          break;
      }
    }

    throw '必须关闭标签';
  }

  function makeJSX(JSXNode) {
    return JSXNode.length === 1 && JSXNode[0].type === '#jsx' ? JSXNode[0] : {
      type: '#jsx',
      nodeValue: JSXNode
    };
  }

  // //单例HTML标签,多例自定义标签
  var rComponent = /^(this|[A-Z])/;
  var cacheStr = {};
  function evalJSX(str, obj, config) {
    var jsx = new innerClass(str, config);
    var output = jsx.init();
    return output; // console.log(output);
    // if (!obj)
    //     obj = {}
    // if (typeof anu === 'function')
    //     obj.anu = anu
    // var args = 'var args0 = arguments[0];'
    // for (var i in obj) {
    //     if (i !== 'this')
    //         args += 'var ' + i + ' = args0["' + i + '"];'
    // }
    // args += 'return ' + output
    // try {
    //     var fn
    //     if (cacheFns[ args ]) {
    //         fn = cacheFns[ args ]
    //     } else {
    //         fn = cacheFns[ args ] = Function(args)
    //     }
    //     console.log(fn)
    //     var a = fn.call(obj.this, obj)
    //     return a
    // } catch (e) {
    //     console.log(e, args)
    // }
  }

  function innerClass(str, config) {
    config = config || {};
    config.ns = evalJSX.globalNs || config.ns || '';
    this.input = str;
    this.ns = config.ns;
    this.type = config.type;
  }

  innerClass.prototype = {
    init: function init() {
      if (typeof JSXParser === 'function') {
        var useCache = this.input.length < 720;

        if (useCache && cacheStr[this.input]) {
          return cacheStr[this.input];
        }

        var array = new JSXParser(this.input).parse();
        var evalString = this.genChildren([array]);

        if (useCache) {
          return cacheStr[this.input] = evalString;
        }

        return evalString;
      } else {
        throw 'need JSXParser https://github.com/RubyLouvre/jsx-parser';
      }
    },
    genTag: function genTag(el) {
      var children = this.genChildren(el.children, el);
      var ns = this.ns;
      var type = rComponent.test(el.type) ? el.type : JSON.stringify(el.type);
      return ns + '$createElement(' + type + ',' + this.genProps(el.props, el) + ',' + children + ')';
    },
    genProps: function genProps(props, el) {
      if (!props && !el.spreadAttribute) {
        return 'null';
      }

      var ret = '{';

      for (var i in props) {
        ret += JSON.stringify(i) + ':' + this.genPropValue(props[i]) + ',\n';
      }

      ret = ret.replace(/\,\n$/, '') + '}';

      if (el.spreadAttribute) {
        return 'Object.assign({},' + el.spreadAttribute + ',' + ret + ')';
      }

      return ret;
    },
    genPropValue: function genPropValue(val) {
      if (typeof val === 'string') {
        return JSON.stringify(val);
      }

      if (val) {
        if (Array.isArray(val.nodeValue)) {
          return this.genChildren(val.nodeValue);
        }

        if (val) {
          return val.nodeValue;
        }
      }
    },
    genChildren: function genChildren(children, obj, join) {
      // debugger
      if (obj) {
        if (obj.isVoidTag || !obj.children.length) {
          return 'null';
        }
      }

      var ret = [];

      for (var i = 0, el; el = children[i++];) {
        if (el.type === '#jsx') {
          if (Array.isArray(el.nodeValue)) {
            ret[ret.length] = this.genChildren(el.nodeValue, null, ' ');
          } else {
            ret[ret.length] = "$createTextNode(".concat(el.nodeValue, ")");
          }
        } else if (el.type === '#text') {
          ret[ret.length] = JSON.stringify(el.nodeValue);
        } else if (el) {
          ret[ret.length] = this.genTag(el);
        }
      }

      console.log('ret', ret);
      return ret.join(join || ',');
    }
  }; // return evalJSX;
  // }
  // });

  function initMixin$1(Vue) {
    Vue.prototype._init = function (options) {
      //Vue的内部属性#options 用户传递所以参数
      var vm = this; // console.log(vm.constructor.options, options)

      vm.$options = mergeOptions(vm.constructor.options, options); // console.log('opt', vm.$options)

      callHook(vm, 'beforeCreate');
      initRender(vm);
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
        } // const render = compileToFunction(template);


        console.log(this.createElement);
        var render = new Function("with(this){return ".concat(evalJSX(template), "}"));
        opts.render = render;
      } //  opts.render;


      mountComponent(vm, el);
    };

    Vue.prototype.$nextTick = nextTick;

    Vue.prototype.$watch = function (expOrFn, cb) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var vm = this;
      options.immediate = options.immediate ? options.immediate : true;
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);

      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, "callback for immediate watcher \"".concat(watcher.expression, "\""));
        }
      }
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
