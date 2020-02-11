//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
	props: {
		total: {
			required: true,
			type: Number,
		},
		offset: {
			type: Number,
			default: 10,
		},
		limit: {
			type: Number,
			default: 10,
		}
	},
	data: function(){
		return {
			lastPage: 0,
			firstPage: 1,
			currentPage: 1,
			next: 0,
			previous: 0,
			from: 0,
			to: 0,
			pages: [],
		};
	},
	mounted: function mounted(){
		this.setDefaults();
	},
	watch: {
		total: function(){
			this.setDefaults();
		}
	},
	methods: {
		onReset: function(){
			this.currentPage = 1;
			this.setDefaults();
		},
		setDefaults: function setDefaults(){
			this.lastPage = Math.ceil(this.total / this.limit);

			if (this.lastPage < 5) {
				this.from = 1;
				this.to = this.lastPage;
			}else{
				this.from = this.currentPage - 2;
				this.to = this.currentPage + 2;
				if (this.from < 1) {
					this.from = 1;
					this.to = 5;
				}
				if (this.to >= this.lastPage) {
					this.to = this.lastPage;
					this.from = this.to - 5;
				}
			}

			this.pages = [];
			for(var i = this.from; i <= this.to; i++){
				this.pages.push(i);
			}
		},
		onNavigate: function(page){
			if (this.currentPage === page) {
				return ;
			}
			this.currentPage = page;


			var offset = this.currentPage - 1;
			offset = offset * this.limit;

			var query = { limit: this.limit, offset: offset};

			this.$emit('paginate', query);
			this.setDefaults();
		},
		onPrevious: function(){
			var prev = this.currentPage - 1;
			if (prev >= this.firstPage) {
				var page = prev;
				if ((prev - 1) <= this.firstPage) {
					prev = this.firstPage;
				}
				this.previous = prev;
				this.onNavigate(page);
			}
		},
		onNext: function(){
			var next = this.currentPage + 1;
			if (next <= this.lastPage) {
				var page = next;
				if ((next + 1) >= this.lastPage) {
					next = this.lastPage;
				}
				this.next = next;
				this.onNavigate(page);
			}
		}
	}
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "row d-flex" }, [
    _c("div", { staticClass: "fixed-table-pagination ml-auto mr-3" }, [
      _c("div", { staticClass: "pagination" }, [
        _c(
          "ul",
          { staticClass: "pagination" },
          [
            _c(
              "li",
              {
                staticClass: "page-first",
                class: { disabled: _vm.currentPage == _vm.firstPage },
                on: {
                  click: function($event) {
                    return _vm.onNavigate(_vm.firstPage)
                  }
                }
              },
              [_c("a", [_vm._v("«")])]
            ),
            _vm._v(" "),
            _c(
              "li",
              {
                staticClass: "page-pre",
                class: { disabled: _vm.currentPage == _vm.firstPage },
                on: { click: _vm.onPrevious }
              },
              [_c("a", [_vm._v("‹")])]
            ),
            _vm._v(" "),
            _vm._l(_vm.pages, function(page) {
              return _c(
                "li",
                {
                  staticClass: "page-number",
                  class: { active: page == _vm.currentPage },
                  on: {
                    click: function($event) {
                      return _vm.onNavigate(page)
                    }
                  }
                },
                [_c("a", [_vm._v(_vm._s(page))])]
              )
            }),
            _vm._v(" "),
            _c(
              "li",
              {
                staticClass: "page-next",
                class: { disabled: _vm.currentPage == _vm.lastPage },
                on: { click: _vm.onNext }
              },
              [_c("a", [_vm._v("›")])]
            ),
            _vm._v(" "),
            _c(
              "li",
              {
                staticClass: "page-last",
                class: { disabled: _vm.currentPage == _vm.lastPage },
                on: {
                  click: function($event) {
                    return _vm.onNavigate(_vm.lastPage)
                  }
                }
              },
              [_c("a", [_vm._v("»")])]
            )
          ],
          2
        )
      ])
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-49b07800_0", { source: "\n\n/*# sourceMappingURL=vue-pagination.vue.map */", map: {"version":3,"sources":["vue-pagination.vue"],"names":[],"mappings":";;AAEA,6CAA6C","file":"vue-pagination.vue"}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-49b07800";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

// Declare install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.component('v-pagination', __vue_component__);
}

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

export default __vue_component__;
export { install };
