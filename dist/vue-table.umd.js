(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueTable = {}));
}(this, (function (exports) { 'use strict';

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
  		console.log("Pagination Mounted...");
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

  			this.$emit('navigate', query);
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
        _c("div", { staticClass: "pagination-wrapper" }, [
          _c(
            "ul",
            { staticClass: "pagination" },
            [
              _c(
                "li",
                {
                  staticClass: "paginate-link page-first",
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
                  staticClass: "paginate-link page-pre",
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
                    key: page,
                    staticClass: "paginate-link page-number",
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
                  staticClass: "paginate-link page-next",
                  class: { disabled: _vm.currentPage == _vm.lastPage },
                  on: { click: _vm.onNext }
                },
                [_c("a", [_vm._v("›")])]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  staticClass: "paginate-link page-last",
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
      inject("data-v-ca27a970_0", { source: ".fixed-table-pagination[data-v-ca27a970] {\n  margin: 0 10px;\n}\n.fixed-table-pagination[data-v-ca27a970]::after {\n  content: \"\";\n  clear: both;\n  display: table;\n}\n.fixed-table-pagination .pagination-wrapper[data-v-ca27a970] {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination[data-v-ca27a970] {\n  margin: 0;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link[data-v-ca27a970] {\n  cursor: pointer;\n  margin: 0 10px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.page-number[data-v-ca27a970] {\n  font-size: 16px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link a[data-v-ca27a970] {\n  color: #ddd;\n  cursor: pointer;\n  padding: 6px 12px;\n  line-height: 1.428571429;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.page-number.active a[data-v-ca27a970] {\n  color: white;\n  background-color: #ddd;\n  padding: 5px 11px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link:not(.disabled) a[data-v-ca27a970] {\n  cursor: pointer;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.disabled[data-v-ca27a970] {\n  pointer-events: none;\n  cursor: default;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.disabled a[data-v-ca27a970] {\n  cursor: not-allowed;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.active a[data-v-ca27a970] {\n  font-weight: bold;\n}\n\n/*# sourceMappingURL=vue-pagination.vue.map */", map: {"version":3,"sources":["/Users/aimen.s.a.sasi/Sites/Code/Vue/vue-pagination/src/vue-pagination.vue","vue-pagination.vue"],"names":[],"mappings":"AA+IA;EACA,cAAA;AC9IA;AD+IA;EACA,WAAA;EACA,WAAA;EACA,cAAA;AC7IA;ADgJA;EACA,gBAAA;EACA,mBAAA;AC9IA;AD+IA;EACA,SAAA;AC7IA;AD8IA;EACA,eAAA;EACA,cAAA;AC5IA;AD6IA;EACA,eAAA;AC3IA;AD6IA;EACA,WAAA;EACA,eAAA;EACA,iBAAA;EACA,wBAAA;AC3IA;AD6IA;EACA,YAAA;EACA,sBAAA;EACA,iBAAA;AC3IA;AD8IA;EACA,eAAA;AC5IA;AD+IA;EACA,oBAAA;EACA,eAAA;AC7IA;AD8IA;EACA,mBAAA;AC5IA;ADgJA;EACA,iBAAA;AC9IA;;AAEA,6CAA6C","file":"vue-pagination.vue","sourcesContent":["<template>\n\t<div class=\"row d-flex\">\n\t\t<div class=\"fixed-table-pagination ml-auto mr-3\">\n\t\t\t<div class=\"pagination-wrapper\">\n\t\t\t\t<ul class=\"pagination\">\n\n\t\t\t\t\t<li class=\"paginate-link page-first\" :class=\"{ disabled: currentPage == firstPage }\" @click=\"onNavigate(firstPage)\">\n\t\t\t\t\t\t<a>«</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"paginate-link page-pre\" :class=\"{ disabled: currentPage == firstPage }\" @click=\"onPrevious\">\n\t\t\t\t\t\t<a>‹</a>\n\t\t\t\t\t</li>\n\n\t\t\t\t\t<li class=\"paginate-link page-number\" \n\t\t\t\t\t\tv-for=\"page in pages\" \n\t\t\t\t\t\t:key=\"page\"\n\t\t\t\t\t\t@click=\"onNavigate(page)\" \n\t\t\t\t\t\t:class=\"{ active: page == currentPage}\">\n\t\t\t\t\t\t\t<a>{{ page }}</a>\n\t\t\t\t\t</li>\n\n\t\t\t\t\t<li class=\"paginate-link page-next\" :class=\"{ disabled: currentPage == lastPage }\" @click=\"onNext\">\n\t\t\t\t\t\t<a>›</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"paginate-link page-last\" :class=\"{ disabled: currentPage == lastPage }\" @click=\"onNavigate(lastPage)\">\n\t\t\t\t\t\t<a>»</a>\n\t\t\t\t\t</li>\n\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</template>\n\n<script>\n\texport default {\n\t\tprops: {\n\t\t\ttotal: {\n\t\t\t\trequired: true,\n\t\t\t\ttype: Number,\n\t\t\t},\n\t\t\toffset: {\n\t\t\t\ttype: Number,\n\t\t\t\tdefault: 10,\n\t\t\t},\n\t\t\tlimit: {\n\t\t\t\ttype: Number,\n\t\t\t\tdefault: 10,\n\t\t\t}\n\t\t},\n\t\tdata: function(){\n\t\t\treturn {\n\t\t\t\tlastPage: 0,\n\t\t\t\tfirstPage: 1,\n\t\t\t\tcurrentPage: 1,\n\t\t\t\tnext: 0,\n\t\t\t\tprevious: 0,\n\t\t\t\tfrom: 0,\n\t\t\t\tto: 0,\n\t\t\t\tpages: [],\n\t\t\t};\n\t\t},\n\t\tmounted(){\n\t\t\tconsole.log(\"Pagination Mounted...\");\n\t\t\tthis.setDefaults();\n\t\t},\n\t\twatch: {\n\t\t\ttotal: function(){\n\t\t\t\tthis.setDefaults();\n\t\t\t}\n\t\t},\n\t\tmethods: {\n\t\t\tonReset: function(){\n\t\t\t\tthis.currentPage = 1;\n\t\t\t\tthis.setDefaults();\n\t\t\t},\n\t\t\tsetDefaults(){\n\t\t\t\tthis.lastPage = Math.ceil(this.total / this.limit);\n\n\t\t\t\tif (this.lastPage < 5) {\n\t\t\t\t\tthis.from = 1;\n\t\t\t\t\tthis.to = this.lastPage;\n\t\t\t\t}else{\n\t\t\t\t\tthis.from = this.currentPage - 2;\n\t\t\t\t\tthis.to = this.currentPage + 2;\n\t\t\t\t\tif (this.from < 1) {\n\t\t\t\t\t\tthis.from = 1;\n\t\t\t\t\t\tthis.to = 5;\n\t\t\t\t\t}\n\t\t\t\t\tif (this.to >= this.lastPage) {\n\t\t\t\t\t\tthis.to = this.lastPage;\n\t\t\t\t\t\tthis.from = this.to - 5;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tthis.pages = [];\n\t\t\t\tfor(let i = this.from; i <= this.to; i++){\n\t\t\t\t\tthis.pages.push(i);\n\t\t\t\t}\n\t\t\t},\n\t\t\tonNavigate: function(page){\n\t\t\t\tif (this.currentPage === page) {\n\t\t\t\t\treturn ;\n\t\t\t\t}\n\t\t\t\tthis.currentPage = page;\n\n\n\t\t\t\tlet offset = this.currentPage - 1;\n\t\t\t\toffset = offset * this.limit;\n\n\t\t\t\tlet query = { limit: this.limit, offset: offset};\n\n\t\t\t\tthis.$emit('navigate', query);\n\t\t\t\tthis.setDefaults();\n\t\t\t},\n\t\t\tonPrevious: function(){\n\t\t\t\tlet prev = this.currentPage - 1;\n\t\t\t\tif (prev >= this.firstPage) {\n\t\t\t\t\tlet page = prev;\n\t\t\t\t\tif ((prev - 1) <= this.firstPage) {\n\t\t\t\t\t\tprev = this.firstPage;\n\t\t\t\t\t}\n\t\t\t\t\tthis.previous = prev;\n\t\t\t\t\tthis.onNavigate(page);\n\t\t\t\t}\n\t\t\t},\n\t\t\tonNext: function(){\n\t\t\t\tlet next = this.currentPage + 1;\n\t\t\t\tif (next <= this.lastPage) {\n\t\t\t\t\tlet page = next;\n\t\t\t\t\tif ((next + 1) >= this.lastPage) {\n\t\t\t\t\t\tnext = this.lastPage;\n\t\t\t\t\t}\n\t\t\t\t\tthis.next = next;\n\t\t\t\t\tthis.onNavigate(page);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n</script>\n\n<style lang=\"scss\" scoped>\n\n\t.fixed-table-pagination{\n\t\tmargin: 0 10px;\n\t\t&::after{\n\t\t\tcontent: \"\";\n\t\t\tclear: both;\n\t\t\tdisplay: table;\n\t\t}\n\n\t\t.pagination-wrapper {\n\t\t\tmargin-top: 10px;\n\t\t\tmargin-bottom: 10px;\n\t\t\t.pagination {\n\t\t\t\tmargin: 0;\n\t\t\t\t.paginate-link{\n\t\t\t\t\tcursor: pointer;\n\t\t\t\t\tmargin: 0 10px;\n\t\t\t\t\t&.page-number{\n\t\t\t\t\t\tfont-size: 16px;\n\t\t\t\t\t}\n\t\t\t\t\ta{\n\t\t\t\t\t\tcolor: #ddd;\n\t\t\t\t\t\tcursor: pointer;\n\t\t\t\t\t\tpadding: 6px 12px;\n\t\t\t\t\t\tline-height: 1.428571429;\n\t\t\t\t\t}\n\t\t\t\t\t&.page-number.active a{\n\t\t\t\t\t\tcolor: white;\n\t\t\t\t\t\tbackground-color: #ddd;\n\t\t\t\t\t\tpadding: 5px 11px;\n\t\t\t\t\t}\n\t\t\t\t\t&:not(.disabled) {\n\t\t\t\t\t\ta {\n\t\t\t\t\t\t\tcursor: pointer;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t&.disabled {\n\t\t\t\t\t\tpointer-events: none;\n    \t\t\t\tcursor: default;\n\t\t\t\t\t\ta {\n\t\t\t\t\t\t\tcursor: not-allowed;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t&.active {\n\t\t\t\t\t\ta {\n\t\t\t\t\t\t\tfont-weight: bold;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n</style>\n",".fixed-table-pagination {\n  margin: 0 10px;\n}\n.fixed-table-pagination::after {\n  content: \"\";\n  clear: both;\n  display: table;\n}\n.fixed-table-pagination .pagination-wrapper {\n  margin-top: 10px;\n  margin-bottom: 10px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination {\n  margin: 0;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link {\n  cursor: pointer;\n  margin: 0 10px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.page-number {\n  font-size: 16px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link a {\n  color: #ddd;\n  cursor: pointer;\n  padding: 6px 12px;\n  line-height: 1.428571429;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.page-number.active a {\n  color: white;\n  background-color: #ddd;\n  padding: 5px 11px;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link:not(.disabled) a {\n  cursor: pointer;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.disabled {\n  pointer-events: none;\n  cursor: default;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.disabled a {\n  cursor: not-allowed;\n}\n.fixed-table-pagination .pagination-wrapper .pagination .paginate-link.active a {\n  font-weight: bold;\n}\n\n/*# sourceMappingURL=vue-pagination.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-ca27a970";
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

  //

  	var script$1 = {
  		props: {
  			title: {
  				required: false,
  				type: String,
  				default: 'Items List'
  			},
  			parentId: {
  				required: false,
  				type: Number
  			},
  			index: {
  				required: true,
  				type: Function,
  			},
  			enableView: {
  				required: false,
  				type: Boolean,
  				default: false,
  			},
  			enableEdit: {
  				required: false,
  				type: Boolean,
  				default: false,
  			},
  			enableDelete: {
  				required: false,
  				type: Boolean,
  				default: false,
  			},
  			labels: {
  				required: true,
  				type: Array,
  			},
  		},
  		components: {
        'v-pagination': __vue_component__,
      },
  		data: function(){
  			return {
  				items: [],
  				sortOptions: [],
  				filter: {},
  				total: 0,
  			}
  		},
  		mounted: function mounted(){
  			this.setDefaults();
  		},
  		methods: {
  			setDefaults: function(){
  				var this$1 = this;

  				_.each(this.labels, function (label) {
  					if(label.sortable){
  						this$1.sortOptions.push({ label: label.title, code: label.field });
  					}
  				});

  				this.fetch();
  			},
  			fetch: function(){
  				var this$1 = this;

  				this.index(this, { parentId: this.parentId, query: this.filter, onSuccess: function (ref) {
  					var data = ref.data;

  					this$1.items = data.rows;
  					this$1.total = data.total;
  				}});
  			},
  			value: function(item, label){
  				var value = item[label.field];

  				if(!_.isEmpty(label.default) && _.isEmpty(value)){
  					value = label.default;
  				}

  				if(!_.isEmpty(label.filters)){
  					value = this.applyFilters(value, label.filters);
  				}

  				return value;
  			},
  			applyFilters: function(value, filters){
  				_.each(filters, function (filter) {
  					switch(filter){
  						case 'truncate':
  							value = Utility.truncate(value, 50);
  						break;
  					}
  				});

  				return value;
  			},
  			onPaginate: function(query){
  				_.merge(this.filter, query);
  				this.fetch();
  			},
  			onSearch: function(e){
  				var query = $(e.target).val();
  				_.merge(this.filter, {search: query});
  				this.fetch();
  			},
  			onSort: function(query){
  				if(_.isEmpty(query)){
  					this.$delete(this.filter, 'sort');
  				}else{
  					_.merge(this.filter, {sort: query.code});
  				}

  				this.fetch();
  			},
  			onOrder: function(e, order){
  				e.preventDefault();
  				_.merge(this.filter, {order: order});
  				this.fetch();
  			},
  			onRefresh: function(e){
  				e.preventDefault();
  				this.fetch();
  			},
  			onView: function(e, id){
  				e.preventDefault();
  				this.$emit("view", id);
  			},
  			onEdit: function(e, id){
  				e.preventDefault();
  				this.$emit("edit", id);
  			},
  			onDelete: function(e, id){
  				var this$1 = this;

  				e.preventDefault();
  				Modal.dialog(this, {
  					title: 'Are you sure!',
  					text: "This action cannot be recovered.",
  					onConfirm: function () {
  						var items = _.filter(this$1.items, function (item) { return item.id != id; });
  						this$1.items = items;
  						Modal.hide(this$1);
  						this$1.$emit("delete", id);
  					},
  					onCancel: function () {
  						Modal.hide(this$1);
  					}
  				});
  			}
  		}
  	};

  function normalizeComponent$1(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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

  var isOldIE$1 = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector$1(context) {
      return function (id, style) { return addStyle$1(id, style); };
  }
  var HEAD$1;
  var styles$1 = {};
  function addStyle$1(id, css) {
      var group = isOldIE$1 ? css.media || 'default' : id;
      var style = styles$1[group] || (styles$1[group] = { ids: new Set(), styles: [] });
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
              if (HEAD$1 === undefined) {
                  HEAD$1 = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD$1.appendChild(style.element);
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
  var __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "card mt-5 custom-table" }, [
      _c("div", { staticClass: "card-header d-flex align-items-center" }, [
        _c("h4", { staticClass: "card-title" }, [_vm._v(_vm._s(_vm.title))])
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "card-body" },
        [
          _c(
            "div",
            { staticClass: "table-header d-flex" },
            [_vm._t("table-header-actions")],
            2
          ),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "table-header d-flex" },
            [
              _c("input", {
                staticClass: "form-control",
                attrs: { type: "text", placeholder: "Search..." },
                on: { input: _vm.onSearch }
              }),
              _vm._v(" "),
              _c("v-select", {
                attrs: {
                  options: _vm.sortOptions,
                  clearable: true,
                  placeholder: "Sort by..."
                },
                on: { input: _vm.onSort }
              }),
              _vm._v(" "),
              _c(
                "a",
                {
                  staticClass: "btn-link ml-2 my-auto",
                  attrs: { href: "#" },
                  on: {
                    click: function($event) {
                      return _vm.onOrder($event, "desc")
                    }
                  }
                },
                [_c("i", { staticClass: "far fa-sort-amount-down fa-lg" })]
              ),
              _vm._v(" "),
              _c(
                "a",
                {
                  staticClass: "btn-link ml-1 mr-1 my-auto",
                  attrs: { href: "#" },
                  on: {
                    click: function($event) {
                      return _vm.onOrder($event, "asc")
                    }
                  }
                },
                [
                  _c("i", {
                    staticClass: "far fa-sort-amount-down fa-lg",
                    staticStyle: { transform: "rotate(180deg)" }
                  })
                ]
              ),
              _vm._v(" "),
              _c(
                "a",
                {
                  staticClass: "btn-link ml-2 my-auto",
                  attrs: { href: "#" },
                  on: { click: _vm.onRefresh }
                },
                [_c("i", { staticClass: "far fa-sync fa-lg" })]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "table-responsive-sm" }, [
            _c("table", { staticClass: "table" }, [
              _c("thead", [
                _c(
                  "tr",
                  [
                    _vm._l(_vm.labels, function(label) {
                      return _c(
                        "th",
                        { key: label.field, attrs: { scope: "col" } },
                        [_vm._v(_vm._s(label.title))]
                      )
                    }),
                    _vm._v(" "),
                    _vm.enableView || _vm.enableEdit || _vm.enableDelete
                      ? _c("th", { attrs: { scope: "col" } }, [_vm._v("Actions")])
                      : _vm._e()
                  ],
                  2
                )
              ]),
              _vm._v(" "),
              _c(
                "tbody",
                [
                  _vm._l(_vm.items, function(item) {
                    return _c(
                      "tr",
                      { key: item.id },
                      [
                        _vm._l(_vm.labels, function(label) {
                          return _c("td", { key: item.id + label.field }, [
                            _vm._v(_vm._s(_vm.value(item, label)))
                          ])
                        }),
                        _vm._v(" "),
                        _vm.enableView || _vm.enableEdit || _vm.enableDelete
                          ? _c("td", [
                              _vm.enableView
                                ? _c(
                                    "a",
                                    {
                                      staticClass: "btn-link btn-info",
                                      attrs: { rel: "tooltip", title: "View" },
                                      on: {
                                        click: function($event) {
                                          return _vm.onView($event, item.id)
                                        }
                                      }
                                    },
                                    [_c("i", { staticClass: "fal fa-eye" })]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _vm.enableEdit
                                ? _c(
                                    "a",
                                    {
                                      staticClass: "btn-link btn-warning",
                                      attrs: { rel: "tooltip", title: "Edit" },
                                      on: {
                                        click: function($event) {
                                          return _vm.onEdit($event, item.id)
                                        }
                                      }
                                    },
                                    [_c("i", { staticClass: "fal fa-edit" })]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _vm.enableDelete
                                ? _c(
                                    "a",
                                    {
                                      staticClass: "btn-link btn-danger",
                                      attrs: { rel: "tooltip", title: "Remove" },
                                      on: {
                                        click: function($event) {
                                          return _vm.onDelete($event, item.id)
                                        }
                                      }
                                    },
                                    [_c("i", { staticClass: "fal fa-trash" })]
                                  )
                                : _vm._e()
                            ])
                          : _vm._e()
                      ],
                      2
                    )
                  }),
                  _vm._v(" "),
                  _vm.items.length == 0
                    ? _c("tr", [
                        _c(
                          "td",
                          { staticClass: "empty-list", attrs: { colspan: "4" } },
                          [_vm._v("No Records Were Found")]
                        )
                      ])
                    : _vm._e()
                ],
                2
              )
            ])
          ]),
          _vm._v(" "),
          _vm.total > 0
            ? _c("v-pagination", {
                attrs: { total: _vm.total },
                on: { paginate: _vm.onPaginate }
              })
            : _vm._e()
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = function (inject) {
      if (!inject) { return }
      inject("data-v-293a6044_0", { source: ".custom-table .pull-left[data-v-293a6044] {\n  width: 100%;\n}\n@media (min-width: 576px) {\n.custom-table .pull-left[data-v-293a6044] {\n    width: auto;\n}\n}\n.custom-table .form-control[data-v-293a6044] {\n  border: 1px solid #ddd !important;\n  width: 100%;\n}\n.custom-table .form-control[data-v-293a6044]::-webkit-input-placeholder {\n  /* WebKit, Blink, Edge */\n  color: #ddd;\n}\n.custom-table .form-control[data-v-293a6044]:-moz-placeholder {\n  /* Mozilla Firefox 4 to 18 */\n  color: #ddd;\n  opacity: 1;\n}\n.custom-table .form-control[data-v-293a6044]::-moz-placeholder {\n  /* Mozilla Firefox 19+ */\n  color: #ddd;\n  opacity: 1;\n}\n.custom-table .form-control[data-v-293a6044]:-ms-input-placeholder {\n  /* Internet Explorer 10-11 */\n  color: #ddd;\n}\n.custom-table .form-control[data-v-293a6044]::-ms-input-placeholder {\n  /* Microsoft Edge */\n  color: #ddd;\n}\n.custom-table .form-control[data-v-293a6044]::placeholder {\n  /* Most modern browsers support this now. */\n  color: #ddd;\n}\n@media (min-width: 576px) {\n.custom-table .form-control[data-v-293a6044] {\n    width: 400px;\n}\n}\n.custom-table .form-control[data-v-293a6044]:hover {\n  border: 1px solid #ddd !important;\n}\n.custom-table .table-header[data-v-293a6044] {\n  padding-bottom: 1rem;\n}\n.custom-table .bootstrap-table table td[data-v-293a6044], .custom-table .bootstrap-table table th[data-v-293a6044], .custom-table .card-body table td[data-v-293a6044], .custom-table .card-body table th[data-v-293a6044] {\n  vertical-align: middle;\n  text-align: center;\n}\n.custom-table .bootstrap-table table thead th[data-v-293a6044], .custom-table .card-body table thead th[data-v-293a6044] {\n  font-weight: bold;\n  text-transform: uppercase;\n}\n.custom-table .bootstrap-table table thead th.td-actions[data-v-293a6044], .custom-table .card-body table thead th.td-actions[data-v-293a6044] {\n  display: table-cell !important;\n  width: 1%;\n  white-space: nowrap;\n}\n.custom-table .bootstrap-table table thead th .sortable[data-v-293a6044], .custom-table .card-body table thead th .sortable[data-v-293a6044] {\n  padding-right: 25px;\n}\n.custom-table .bootstrap-table table tbody tr td[data-v-293a6044]:last-child, .custom-table .card-body table tbody tr td[data-v-293a6044]:last-child {\n  display: table-cell !important;\n  padding-right: 8px !important;\n}\n.custom-table .bootstrap-table table tbody tr td:last-child a[data-v-293a6044]:focus, .custom-table .card-body table tbody tr td:last-child a[data-v-293a6044]:focus {\n  outline: 0;\n}\n.custom-table .bootstrap-table table tbody tr td:last-child a[data-v-293a6044]:last-child, .custom-table .card-body table tbody tr td:last-child a[data-v-293a6044]:last-child {\n  margin-left: 10px;\n}\n.custom-table .bootstrap-table table tbody tr td:last-child a i[data-v-293a6044], .custom-table .card-body table tbody tr td:last-child a i[data-v-293a6044] {\n  font-size: 20px;\n  width: auto;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip][data-v-293a6044], .custom-table .card-body table tbody tr td a[rel=tooltip][data-v-293a6044] {\n  cursor: pointer;\n  background-color: transparent !important;\n  transition: color 5s ease;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-info[data-v-293a6044], .custom-table .card-body table tbody tr td a[rel=tooltip].btn-info[data-v-293a6044] {\n  margin-right: 10px;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-info:hover i[data-v-293a6044], .custom-table .card-body table tbody tr td a[rel=tooltip].btn-info:hover i[data-v-293a6044] {\n  color: #044ff7 !important;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-warning:hover i[data-v-293a6044], .custom-table .card-body table tbody tr td a[rel=tooltip].btn-warning:hover i[data-v-293a6044] {\n  color: #FFA534 !important;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-danger:hover i[data-v-293a6044], .custom-table .card-body table tbody tr td a[rel=tooltip].btn-danger:hover i[data-v-293a6044] {\n  color: #FB404B !important;\n}\n.custom-table .card-body table thead th[data-v-293a6044]:last-child {\n  width: 1%;\n  white-space: nowrap;\n}\n.custom-table .card-body table tbody tr td[data-v-293a6044]:last-child {\n  width: 1%;\n  white-space: nowrap;\n}\n@media (max-width: 575px) {\n.custom-table .card-body table tbody tr td[data-v-293a6044]:nth-child(4) {\n    text-align: center;\n}\n}\n.custom-table .card-body table tbody tr td.td-actions a[data-v-293a6044]:hover {\n  color: #ddd;\n}\n\n/*# sourceMappingURL=vue-table.vue.map */", map: {"version":3,"sources":["/Users/aimen.s.a.sasi/Sites/Code/Vue/tth-vue-table/src/vue-table.vue","vue-table.vue"],"names":[],"mappings":"AAiNA;EACA,WAAA;AChNA;ADiNA;AAFA;IAGA,WAAA;AC9ME;AACF;ADgNA;EACA,iCAAA;EACA,WAAA;AC9MA;AD+MA;EAAA,wBAAA;EACA,WAAA;AC5MA;AD8MA;EAAA,4BAAA;EACA,WAAA;EACA,UAAA;AC3MA;AD6MA;EAAA,wBAAA;EACA,WAAA;EACA,UAAA;AC1MA;AD4MA;EAAA,4BAAA;EACA,WAAA;ACzMA;AD2MA;EAAA,mBAAA;EACA,WAAA;ACxMA;AD2MA;EAAA,2CAAA;EACA,WAAA;ACxMA;AD0MA;AAxBA;IAyBA,YAAA;ACvME;AACF;ADwMA;EACA,iCAAA;ACtMA;ADyMA;EACA,oBAAA;ACvMA;AD2MA;EACA,sBAAA;EACA,kBAAA;ACzMA;AD4MA;EACA,iBAAA;EACA,yBAAA;AC1MA;AD2MA;EACA,8BAAA;EACA,SAAA;EACA,mBAAA;ACzMA;AD2MA;EACA,mBAAA;ACzMA;ADgNA;EACA,8BAAA;EACA,6BAAA;AC9MA;ADgNA;EACA,UAAA;AC9MA;ADgNA;EACA,iBAAA;AC9MA;ADgNA;EACA,eAAA;EACA,WAAA;AC9MA;ADkNA;EACA,eAAA;EACA,wCAAA;EACA,yBAAA;AChNA;ADiNA;EACA,kBAAA;AC/MA;ADiNA;EACA,yBAAA;AC/MA;ADoNA;EACA,yBAAA;AClNA;ADsNA;EACA,yBAAA;ACpNA;ADiOA;EACA,SAAA;EACA,mBAAA;AC/NA;ADsOA;EACA,SAAA;EACA,mBAAA;ACpOA;ADuOA;AADA;IAEA,kBAAA;ACpOE;AACF;ADwOA;EACA,WAAA;ACtOA;;AAEA,wCAAwC","file":"vue-table.vue","sourcesContent":["<template>\n\t<div class=\"card mt-5 custom-table\">\n\t\t<div class=\"card-header d-flex align-items-center\">\n\t\t\t<h4 class=\"card-title\">{{ title }}</h4>\n\t\t</div>\n\t\t<div class=\"card-body\">\n\t\t\t<div class=\"table-header d-flex\">\n\t\t\t\t<slot name=\"table-header-actions\"></slot>\n\t\t\t</div>\n\t\t\t<div class=\"table-header d-flex\">\n\t\t\t\t<input type=\"text\" class=\"form-control\" placeholder=\"Search...\" @input=\"onSearch\">\n\t\t\t\t<v-select :options=\"sortOptions\" :clearable=\"true\" placeholder=\"Sort by...\" @input=\"onSort\"></v-select>\n\t\t\t\t<a href=\"#\" class=\"btn-link ml-2 my-auto\" @click=\"onOrder($event, 'desc')\">\n\t\t\t\t\t<i class=\"far fa-sort-amount-down fa-lg\"></i>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"#\" class=\"btn-link ml-1 mr-1 my-auto\" @click=\"onOrder($event, 'asc')\">\n\t\t\t\t\t<i class=\"far fa-sort-amount-down fa-lg\" style=\"transform: rotate(180deg);\"></i>\n\t\t\t\t</a>\n\t\t\t\t<a href=\"#\" class=\"btn-link ml-2 my-auto\" @click=\"onRefresh\">\n\t\t\t\t\t<i class=\"far fa-sync fa-lg\"></i>\n\t\t\t\t</a>\n\t\t\t</div>\n\t\t\t<div class=\"table-responsive-sm\">\n\t\t\t\t<table class=\"table\">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th scope=\"col\" v-for=\"label in labels\" :key=\"label.field\">{{ label.title }}</th>\n\t\t\t\t\t\t\t<th scope=\"col\" v-if=\"enableView || enableEdit || enableDelete\">Actions</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<tr v-for=\"item in items\" :key=\"item.id\">\n\t\t\t\t\t\t\t<td v-for=\"label in labels\" :key=\"item.id + label.field\">{{ value(item, label) }}</td>\n\t\t\t\t\t\t\t<td v-if=\"enableView || enableEdit || enableDelete\">\n\t\t\t\t\t\t\t\t<a rel=\"tooltip\" title=\"View\" class=\"btn-link btn-info\"\n\t\t\t\t\t\t\t\t\t@click=\"onView($event, item.id)\" v-if=\"enableView\">\n\t\t\t\t\t\t\t\t\t<i class=\"fal fa-eye\"></i>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t<a rel=\"tooltip\" title=\"Edit\" class=\"btn-link btn-warning\"\n\t\t\t\t\t\t\t\t\t@click=\"onEdit($event, item.id)\" v-if=\"enableEdit\">\n\t\t\t\t\t\t\t\t\t<i class=\"fal fa-edit\"></i>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t<a rel=\"tooltip\" title=\"Remove\" class=\"btn-link btn-danger\"\n\t\t\t\t\t\t\t\t\t@click=\"onDelete($event, item.id)\" v-if=\"enableDelete\">\n\t\t\t\t\t\t\t\t\t<i class=\"fal fa-trash\"></i>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr v-if=\"items.length == 0\">\n\t\t\t\t\t\t\t<td colspan=\"4\" class=\"empty-list\">No Records Were Found</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\n\t\t\t<v-pagination :total=\"total\" @paginate=\"onPaginate\" v-if=\"total > 0\"/>\n\t\t</div>\n\t</div>\n</template>\n\n<script>\n\timport VuePagination from 'tth-v-pagination';\n\n\texport default {\n\t\tprops: {\n\t\t\ttitle: {\n\t\t\t\trequired: false,\n\t\t\t\ttype: String,\n\t\t\t\tdefault: 'Items List'\n\t\t\t},\n\t\t\tparentId: {\n\t\t\t\trequired: false,\n\t\t\t\ttype: Number\n\t\t\t},\n\t\t\tindex: {\n\t\t\t\trequired: true,\n\t\t\t\ttype: Function,\n\t\t\t},\n\t\t\tenableView: {\n\t\t\t\trequired: false,\n\t\t\t\ttype: Boolean,\n\t\t\t\tdefault: false,\n\t\t\t},\n\t\t\tenableEdit: {\n\t\t\t\trequired: false,\n\t\t\t\ttype: Boolean,\n\t\t\t\tdefault: false,\n\t\t\t},\n\t\t\tenableDelete: {\n\t\t\t\trequired: false,\n\t\t\t\ttype: Boolean,\n\t\t\t\tdefault: false,\n\t\t\t},\n\t\t\tlabels: {\n\t\t\t\trequired: true,\n\t\t\t\ttype: Array,\n\t\t\t},\n\t\t},\n\t\tcomponents: {\n      'v-pagination': VuePagination,\n    },\n\t\tdata: function(){\n\t\t\treturn {\n\t\t\t\titems: [],\n\t\t\t\tsortOptions: [],\n\t\t\t\tfilter: {},\n\t\t\t\ttotal: 0,\n\t\t\t}\n\t\t},\n\t\tmounted(){\n\t\t\tthis.setDefaults();\n\t\t},\n\t\tmethods: {\n\t\t\tsetDefaults: function(){\n\t\t\t\t_.each(this.labels, (label) => {\n\t\t\t\t\tif(label.sortable){\n\t\t\t\t\t\tthis.sortOptions.push({ label: label.title, code: label.field });\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\tthis.fetch();\n\t\t\t},\n\t\t\tfetch: function(){\n\t\t\t\tthis.index(this, { parentId: this.parentId, query: this.filter, onSuccess: ({ data }) => {\n\t\t\t\t\tthis.items = data.rows;\n\t\t\t\t\tthis.total = data.total;\n\t\t\t\t}});\n\t\t\t},\n\t\t\tvalue: function(item, label){\n\t\t\t\tlet value = item[label.field];\n\n\t\t\t\tif(!_.isEmpty(label.default) && _.isEmpty(value)){\n\t\t\t\t\tvalue = label.default;\n\t\t\t\t}\n\n\t\t\t\tif(!_.isEmpty(label.filters)){\n\t\t\t\t\tvalue = this.applyFilters(value, label.filters);\n\t\t\t\t}\n\n\t\t\t\treturn value;\n\t\t\t},\n\t\t\tapplyFilters: function(value, filters){\n\t\t\t\t_.each(filters, (filter) => {\n\t\t\t\t\tswitch(filter){\n\t\t\t\t\t\tcase 'truncate':\n\t\t\t\t\t\t\tvalue = Utility.truncate(value, 50);\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\treturn value;\n\t\t\t},\n\t\t\tonPaginate: function(query){\n\t\t\t\t_.merge(this.filter, query);\n\t\t\t\tthis.fetch();\n\t\t\t},\n\t\t\tonSearch: function(e){\n\t\t\t\tlet query = $(e.target).val();\n\t\t\t\t_.merge(this.filter, {search: query});\n\t\t\t\tthis.fetch();\n\t\t\t},\n\t\t\tonSort: function(query){\n\t\t\t\tif(_.isEmpty(query)){\n\t\t\t\t\tthis.$delete(this.filter, 'sort');\n\t\t\t\t}else{\n\t\t\t\t\t_.merge(this.filter, {sort: query.code});\n\t\t\t\t}\n\n\t\t\t\tthis.fetch();\n\t\t\t},\n\t\t\tonOrder: function(e, order){\n\t\t\t\te.preventDefault();\n\t\t\t\t_.merge(this.filter, {order: order});\n\t\t\t\tthis.fetch();\n\t\t\t},\n\t\t\tonRefresh: function(e){\n\t\t\t\te.preventDefault();\n\t\t\t\tthis.fetch();\n\t\t\t},\n\t\t\tonView: function(e, id){\n\t\t\t\te.preventDefault();\n\t\t\t\tthis.$emit(\"view\", id);\n\t\t\t},\n\t\t\tonEdit: function(e, id){\n\t\t\t\te.preventDefault();\n\t\t\t\tthis.$emit(\"edit\", id);\n\t\t\t},\n\t\t\tonDelete: function(e, id){\n\t\t\t\te.preventDefault();\n\t\t\t\tModal.dialog(this, {\n\t\t\t\t\ttitle: 'Are you sure!',\n\t\t\t\t\ttext: \"This action cannot be recovered.\",\n\t\t\t\t\tonConfirm: () => {\n\t\t\t\t\t\tlet items = _.filter(this.items, (item) => { return item.id != id; });\n\t\t\t\t\t\tthis.items = items;\n\t\t\t\t\t\tModal.hide(this);\n\t\t\t\t\t\tthis.$emit(\"delete\", id);\n\t\t\t\t\t},\n\t\t\t\t\tonCancel: () => {\n\t\t\t\t\t\tModal.hide(this);\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t}\n\t\t}\n\t}\n</script>\n\n<style lang=\"scss\" scoped>\n\t.custom-table {\n\t\t.pull-left {\n\t\t\twidth: 100%;\n\t\t\t@media (min-width: 576px) {\n\t\t\t\twidth: auto;\n\t\t\t}\n\t\t}\n\t\t.form-control {\n\t\t\tborder: 1px solid #ddd !important;\n\t\t\twidth: 100%;\n\t\t\t&::-webkit-input-placeholder { /* WebKit, Blink, Edge */\n\t\t\t\tcolor: #ddd;\n\t\t\t}\n\t\t\t&:-moz-placeholder { /* Mozilla Firefox 4 to 18 */\n\t\t\t\tcolor: #ddd;\n\t\t\t\topacity: 1;\n\t\t\t}\n\t\t\t&::-moz-placeholder { /* Mozilla Firefox 19+ */\n\t\t\t\tcolor: #ddd;\n\t\t\t\topacity: 1;\n\t\t\t}\n\t\t\t&:-ms-input-placeholder { /* Internet Explorer 10-11 */\n\t\t\t\tcolor: #ddd;\n\t\t\t}\n\t\t\t&::-ms-input-placeholder { /* Microsoft Edge */\n\t\t\t\tcolor: #ddd;\n\t\t\t}\n\n\t\t\t&::placeholder { /* Most modern browsers support this now. */\n\t\t\t\tcolor: #ddd;\n\t\t\t}\n\t\t\t@media (min-width: 576px) {\n\t\t\t\twidth: 400px;\n\t\t\t}\n\t\t\t&:hover {\n\t\t\t\tborder: 1px solid #ddd !important;\n\t\t\t}\n\t\t}\n\t\t.table-header{\n\t\t\tpadding-bottom: 1rem;\n\t\t}\n\t\t.bootstrap-table, .card-body {\n\t\t\ttable {\n\t\t\t\ttd, th {\n\t\t\t\t\tvertical-align: middle;\n\t\t\t\t\ttext-align: center;\n\t\t\t\t}\n\t\t\t\tthead {\n\t\t\t\t\tth {\n\t\t\t\t\t\tfont-weight: bold;\n\t\t\t\t\t\ttext-transform: uppercase;\n\t\t\t\t\t\t&.td-actions {\n\t\t\t\t\t\t\tdisplay: table-cell !important;\n\t\t\t\t\t\t\twidth: 1%;\n  \t\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t.sortable {\n\t\t\t\t\t\t\tpadding-right: 25px;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\ttbody {\n\t\t\t\t\ttr {\n\t\t\t\t\t\ttd {\n\t\t\t\t\t\t\t&:last-child {\n\t\t\t\t\t\t\t\tdisplay: table-cell !important;\n\t\t\t\t\t\t\t\tpadding-right: 8px !important;\n\t\t\t\t\t\t\t\ta {\n\t\t\t\t\t\t\t\t\t&:focus {\n\t\t\t\t\t\t\t\t\t\toutline: 0;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t&:last-child {\n\t\t\t\t\t\t\t\t\t\tmargin-left: 10px;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\ti {\n\t\t\t\t\t\t\t\t\t\tfont-size: 20px;\n\t\t\t\t\t\t\t\t\t\twidth: auto;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\ta[rel=tooltip] {\n\t\t\t\t\t\t\t\tcursor: pointer;\n\t\t\t\t\t\t\t\tbackground-color: transparent !important;\n\t\t\t\t\t\t\t\ttransition: color 5s ease;\n\t\t\t\t\t\t\t\t&.btn-info{\n\t\t\t\t\t\t\t\t\tmargin-right: 10px;\n\t\t\t\t\t\t\t\t\t&:hover {\n\t\t\t\t\t\t\t\t\t\ti {\n\t\t\t\t\t\t\t\t\t\t\tcolor: #044ff7 !important;\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t&.btn-warning:hover {\n\t\t\t\t\t\t\t\t\ti {\n\t\t\t\t\t\t\t\t\t\tcolor: #FFA534 !important;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t&.btn-danger:hover {\n\t\t\t\t\t\t\t\t\ti {\n\t\t\t\t\t\t\t\t\t\tcolor: #FB404B !important;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t.card-body {\n\t\t\ttable {\n\t\t\t\tthead {\n\t\t\t\t\tth {\n\t\t\t\t\t\t&:last-child {\n\t\t\t\t\t\t\twidth: 1%;\n  \t\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\ttbody {\n\t\t\t\t\ttr {\n\t\t\t\t\t\ttd {\n\t\t\t\t\t\t\t&:last-child {\n\t\t\t\t\t\t\t\twidth: 1%;\n  \t\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t&:nth-child(4) {\n\t\t\t\t\t\t\t\t@media (max-width: 575px) {\n\t\t\t\t\t\t\t\t\ttext-align: center;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t&.td-actions {\n\t\t\t\t\t\t\t\ta {\n\t\t\t\t\t\t\t\t\t&:hover {\n\t\t\t\t\t\t\t\t\t\tcolor: #ddd;\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n</style>\n",".custom-table .pull-left {\n  width: 100%;\n}\n@media (min-width: 576px) {\n  .custom-table .pull-left {\n    width: auto;\n  }\n}\n.custom-table .form-control {\n  border: 1px solid #ddd !important;\n  width: 100%;\n}\n.custom-table .form-control::-webkit-input-placeholder {\n  /* WebKit, Blink, Edge */\n  color: #ddd;\n}\n.custom-table .form-control:-moz-placeholder {\n  /* Mozilla Firefox 4 to 18 */\n  color: #ddd;\n  opacity: 1;\n}\n.custom-table .form-control::-moz-placeholder {\n  /* Mozilla Firefox 19+ */\n  color: #ddd;\n  opacity: 1;\n}\n.custom-table .form-control:-ms-input-placeholder {\n  /* Internet Explorer 10-11 */\n  color: #ddd;\n}\n.custom-table .form-control::-ms-input-placeholder {\n  /* Microsoft Edge */\n  color: #ddd;\n}\n.custom-table .form-control::placeholder {\n  /* Most modern browsers support this now. */\n  color: #ddd;\n}\n@media (min-width: 576px) {\n  .custom-table .form-control {\n    width: 400px;\n  }\n}\n.custom-table .form-control:hover {\n  border: 1px solid #ddd !important;\n}\n.custom-table .table-header {\n  padding-bottom: 1rem;\n}\n.custom-table .bootstrap-table table td, .custom-table .bootstrap-table table th, .custom-table .card-body table td, .custom-table .card-body table th {\n  vertical-align: middle;\n  text-align: center;\n}\n.custom-table .bootstrap-table table thead th, .custom-table .card-body table thead th {\n  font-weight: bold;\n  text-transform: uppercase;\n}\n.custom-table .bootstrap-table table thead th.td-actions, .custom-table .card-body table thead th.td-actions {\n  display: table-cell !important;\n  width: 1%;\n  white-space: nowrap;\n}\n.custom-table .bootstrap-table table thead th .sortable, .custom-table .card-body table thead th .sortable {\n  padding-right: 25px;\n}\n.custom-table .bootstrap-table table tbody tr td:last-child, .custom-table .card-body table tbody tr td:last-child {\n  display: table-cell !important;\n  padding-right: 8px !important;\n}\n.custom-table .bootstrap-table table tbody tr td:last-child a:focus, .custom-table .card-body table tbody tr td:last-child a:focus {\n  outline: 0;\n}\n.custom-table .bootstrap-table table tbody tr td:last-child a:last-child, .custom-table .card-body table tbody tr td:last-child a:last-child {\n  margin-left: 10px;\n}\n.custom-table .bootstrap-table table tbody tr td:last-child a i, .custom-table .card-body table tbody tr td:last-child a i {\n  font-size: 20px;\n  width: auto;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip], .custom-table .card-body table tbody tr td a[rel=tooltip] {\n  cursor: pointer;\n  background-color: transparent !important;\n  transition: color 5s ease;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-info, .custom-table .card-body table tbody tr td a[rel=tooltip].btn-info {\n  margin-right: 10px;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-info:hover i, .custom-table .card-body table tbody tr td a[rel=tooltip].btn-info:hover i {\n  color: #044ff7 !important;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-warning:hover i, .custom-table .card-body table tbody tr td a[rel=tooltip].btn-warning:hover i {\n  color: #FFA534 !important;\n}\n.custom-table .bootstrap-table table tbody tr td a[rel=tooltip].btn-danger:hover i, .custom-table .card-body table tbody tr td a[rel=tooltip].btn-danger:hover i {\n  color: #FB404B !important;\n}\n.custom-table .card-body table thead th:last-child {\n  width: 1%;\n  white-space: nowrap;\n}\n.custom-table .card-body table tbody tr td:last-child {\n  width: 1%;\n  white-space: nowrap;\n}\n@media (max-width: 575px) {\n  .custom-table .card-body table tbody tr td:nth-child(4) {\n    text-align: center;\n  }\n}\n.custom-table .card-body table tbody tr td.td-actions a:hover {\n  color: #ddd;\n}\n\n/*# sourceMappingURL=vue-table.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$1 = "data-v-293a6044";
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$1 = normalizeComponent$1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector$1,
      undefined,
      undefined
    );

  // Declare install function executed by Vue.use()
  function install$1(Vue) {
  	if (install$1.installed) { return; }
  	install$1.installed = true;
  	Vue.component('v-table', __vue_component__$1);
  }

  // Create module definition for Vue.use()
  var plugin$1 = {
  	install: install$1,
  };

  // Auto-install when vue is found (eg. in browser via <script> tag)
  var GlobalVue$1 = null;
  if (typeof window !== 'undefined') {
  	GlobalVue$1 = window.Vue;
  } else if (typeof global !== 'undefined') {
  	GlobalVue$1 = global.Vue;
  }
  if (GlobalVue$1) {
  	GlobalVue$1.use(plugin$1);
  }

  exports.default = __vue_component__$1;
  exports.install = install$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
