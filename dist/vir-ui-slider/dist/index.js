
/*!
 * vir-ui-slider v1.3.0
 * (c) 2017 cjg
 * Released under the MIT License.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vir'), require('jquery')) :
	typeof define === 'function' && define.amd ? define(['vir', 'jquery'], factory) :
	(global.VirUiSlider = factory(global.Vir,global.jQuery));
}(this, (function (Vir,$) { 'use strict';

Vir = 'default' in Vir ? Vir['default'] : Vir;
$ = 'default' in $ ? $['default'] : $;

var initPagination = function (options) {
  var _events;

  var App = Vir();
  var ctx = this;

  var selector = options.selector,
      _options$navSelector = options.navSelector,
      navSelector = _options$navSelector === undefined ? 'li' : _options$navSelector,
      _options$currentClass = options.currentClass,
      currentClass = _options$currentClass === undefined ? 'cur' : _options$currentClass;


  var app = new App({
    data: {
      lock: false,
      index: 0
    },
    el: selector,
    events: (_events = {}, _events['mouseenter->' + navSelector] = 'enter', _events['mouseleave->' + navSelector] = 'leave', _events),
    watch: {
      index: function index(result) {
        var old = result.old;
        var index = result.value;
        this.$$(navSelector).eq(old).removeClass(currentClass);
        this.$$(navSelector).eq(index).addClass(currentClass);
      }
    },
    methods: {
      enter: function enter(event) {
        var _this = this;

        var $el = $(event.currentTarget);
        var index = $el.attr('data-index') || $el.index();
        this.set('t', setTimeout(function () {
          ctx.set('index', index);
          _this.set('index', index);
        }, 200));
      },
      leave: function leave() {
        clearTimeout(this.get('t'));
      }
    }
  });

  // 双向
  ctx.$watch('index', function (result) {
    app.set('index', result.value);
  });
};

var index = function () {
  var _events;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$lazyload = options.lazyload,
      lazyload = _options$lazyload === undefined ? false : _options$lazyload,
      _options$wrapperSelec = options.wrapperSelector,
      wrapperSelector = _options$wrapperSelec === undefined ? 'ul' : _options$wrapperSelec,
      _options$slideSelecto = options.slideSelector,
      slideSelector = _options$slideSelecto === undefined ? 'ul > li' : _options$slideSelecto,
      _options$nextSelector = options.nextSelector,
      nextSelector = _options$nextSelector === undefined ? '.next' : _options$nextSelector,
      _options$prevSelector = options.prevSelector,
      prevSelector = _options$prevSelector === undefined ? '.prev' : _options$prevSelector,
      _options$pagination = options.pagination,
      pagination = _options$pagination === undefined ? {} : _options$pagination;


  return Vir({
    data: {
      index: 0,
      lock: false,
      state: {}
    },
    events: (_events = {}, _events['click->' + nextSelector] = 'next', _events['click->' + prevSelector] = 'prev', _events),
    validate: {
      index: function index() {
        if (this.get('lock')) {
          return false;
        }
      }
    },
    watch: {
      index: function index(result) {
        var _this = this;

        var index = result.value;
        this.set('lock', true);
        if (lazyload) {
          this.lazyload(index);
        }
        this.$$(wrapperSelector).animate({
          left: index * -100 + '%'
        }, 500, function () {
          _this.set('lock', false);
        });
      }
    },
    methods: {
      index: function index(_index) {
        var len = this.get('len');
        return _index < 0 ? len - 1 : _index % len;
      },
      run: function run(index) {
        this.set('index', this.index(index));
      },
      prev: function prev() {
        this.run(this.get('index') - 1);
      },
      next: function next() {
        this.run(this.get('index') + 1);
      },
      getState: function getState(index) {
        var state = this.get('state');
        if (state[index]) {
          return true;
        }
        state[index] = true;
        this.set('state', state);
      },
      lazyload: function lazyload(index) {
        if (this.getState(index)) {
          return;
        }
        var $el = this.$$(slideSelector).eq(index).find('img[data-src]');
        $el.attr('src', $el.attr('data-src'));
      }
    },
    init: function init() {
      var len = this.$$(slideSelector).length;
      this.set('len', len / 1);
      this.$$(wrapperSelector).css('width', 100 * len / 1 + '%');
      this.$$(slideSelector).css('width', 100 / len + '%');

      if (pagination.selector) {
        initPagination.call(this, pagination);
      }
    }
  });
};

return index;

})));
//# sourceMappingURL=index.js.map
