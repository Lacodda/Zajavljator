!function t(d, n, r) {
	/**
	 * @param {string} name
	 * @param {?} obj
	 * @return {?}
	 */
	function i(name, obj) {
		if (!n[name]) {
			if (!d[name]) {
				var ondata = "function" == typeof require && require;
				if (!obj && ondata) {
					return ondata(name, true);
				}
				if (o) {
					return o(name, true);
				}
				throw new Error("Cannot find module '" + name + "'");
			}
			var module_ = n[name] = {
				exports : {}
			};
			d[name][0].call(module_.exports, function(t) {
				var r = d[name][1][t];
				return i(r ? r : t);
			}, module_, module_.exports, t, d, n, r);
		}
		return n[name].exports;
	}
	var o = "function" == typeof require && require;
	/** @type {number} */
	var s = 0;
	for (;s < r.length;s++) {
		i(r[s]);
	}
	return i;
}({
	1 : [function(require, dataAndEvents, deepDataAndEvents) {
		/**
		 * @param {Element} d
		 * @return {undefined}
		 */
		function handler(d) {
			/** @type {string} */
			d.style.height = "1px";
			/** @type {string} */
			d.style.height = 25 + d.scrollHeight + "px";
		}
		DocUtils = require("../js/docUtils.js");
		DocxGen = require("../js/docxgen.js");
		/**
		 * @param {?} href
		 * @param {Function} cb
		 * @return {undefined}
		 */
		loadFile = function(href, cb) {
			/** @type {XMLHttpRequest} */
			xhrDoc = new XMLHttpRequest;
			xhrDoc.open("GET", href, true);
			if (xhrDoc.overrideMimeType) {
				xhrDoc.overrideMimeType("text/plain; charset=x-user-defined");
			}
			/**
			 * @param {?} evt
			 * @return {undefined}
			 */
			xhrDoc.onreadystatechange = function(evt) {
				if (4 == this.readyState) {
					if (200 == this.status) {
						cb(null, this.response);
					} else {
						cb(evt);
					}
				}
			};
			xhrDoc.send();
		};
		/**
		 * @return {undefined}
		 */
		window.onload = function() {
			/** @type {NodeList} */
			var arr = document.getElementsByTagName("textarea");
			/** @type {number} */
			var i = arr.length - 1;
			for (;i >= 0;i--) {
				handler(arr[i]);
				/** @type {Element} */
				var li = document.createElement("button");
				/** @type {string} */
				li.className = "execute";
				/** @type {string} */
				li.innerHTML = "Execute";
				arr[i].parentNode.insertBefore(li, arr[i].nextSibling);
				/** @type {Element} */
				var elem = document.createElement("button");
				/** @type {string} */
				elem.className = "raw";
				/** @type {string} */
				elem.innerHTML = "View Initial Document";
				arr[i].parentNode.insertBefore(elem, arr[i].nextSibling);
			}
			/** @type {NodeList} */
			var codeSegments = document.getElementsByClassName("execute");
			/** @type {number} */
			i = 0;
			for (;i < codeSegments.length;i++) {
				/**
				 * @return {undefined}
				 */
				codeSegments[i].onclick = function() {
					childs = this.parentNode.childNodes;
					/** @type {number} */
					var i = 0;
					for (;i < childs.length;i++) {
						if ("TEXTAREA" == childs[i].tagName) {
							eval(childs[i].value);
						}
					}
				};
			}
			/** @type {NodeList} */
			var resultItems = document.getElementsByClassName("raw");
			/** @type {number} */
			i = 0;
			for (;i < resultItems.length;i++) {
				/**
				 * @return {undefined}
				 */
				resultItems[i].onclick = function() {
					var nodes = this.parentNode.childNodes;
					/** @type {number} */
					var i = 0;
					for (;i < nodes.length;i++) {
						if ("TEXTAREA" == nodes[i].tagName) {
							var expectedOutputHref = nodes[i].getAttribute("raw");
							loadFile(expectedOutputHref, function(deepDataAndEvents, dataAndEvents) {
								output = (new DocxGen(dataAndEvents)).getZip().generate({
									type : "blob"
								});
								saveAs(output, "raw.docx");
							});
						}
					}
				};
			}
		};
	}, {
		"../js/docUtils.js" : 2,
		"../js/docxgen.js" : 4
	}],
	2 : [function(dataAndEvents, module) {
		var node;
		/** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
		var __slice = [].slice;
		node = {};
		/**
		 * @return {?}
		 */
		node.getPathConfig = function() {
			return null == node.pathConfig ? "" : "node" === node.env ? node.pathConfig.node : node.pathConfig.browser;
		};
		/**
		 * @param {string} str
		 * @return {?}
		 */
		node.escapeRegExp = function(str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		};
		node.charMap = {
			"&" : "&amp;",
			"'" : "&apos;",
			"<" : "&lt;",
			">" : "&gt;"
		};
		/**
		 * @param {string} source
		 * @return {?}
		 */
		node.wordToUtf8 = function(source) {
			var n;
			var key;
			var keys;
			keys = node.charMap;
			for (n in keys) {
				key = keys[n];
				source = source.replace(new RegExp(node.escapeRegExp(key), "g"), n);
			}
			return source;
		};
		/**
		 * @param {string} source
		 * @return {?}
		 */
		node.utf8ToWord = function(source) {
			var n;
			var name;
			var _ref2;
			_ref2 = node.charMap;
			for (name in _ref2) {
				n = _ref2[name];
				source = source.replace(new RegExp(node.escapeRegExp(name), "g"), n);
			}
			return source;
		};
		/**
		 * @param {string} implementation
		 * @return {?}
		 */
		node.defaultParser = function(implementation) {
			return{
				/**
				 * @param {(Object|string)} obj
				 * @return {?}
				 */
				get : function(obj) {
					return "." === implementation ? obj : obj[implementation];
				}
			};
		};
		node.tags = {
			start : "{",
			end : "}"
		};
		/**
		 * @param {Object} obj
		 * @return {?}
		 */
		node.clone = function(obj) {
			var flags;
			var key;
			var clone;
			if (null == obj || "object" != typeof obj) {
				return obj;
			}
			if (obj instanceof Date) {
				return new Date(obj.getTime());
			}
			if (obj instanceof RegExp) {
				return flags = "", null != obj.global && (flags += "g"), null != obj.ignoreCase && (flags += "i"), null != obj.multiline && (flags += "m"), null != obj.sticky && (flags += "y"), new RegExp(obj.source, flags);
			}
			clone = new obj.constructor;
			for (key in obj) {
				clone[key] = node.clone(obj[key]);
			}
			return clone;
		};
		/**
		 * @param {string} str
		 * @param {?} walkers
		 * @param {?} number
		 * @param {?} p
		 * @return {?}
		 */
		node.replaceFirstFrom = function(str, walkers, number, p) {
			return str.substr(0, p) + str.substr(p).replace(walkers, number);
		};
		/**
		 * @param {?} s
		 * @return {?}
		 */
		node.encode_utf8 = function(s) {
			return unescape(encodeURIComponent(s));
		};
		/**
		 * @param {string} str
		 * @return {?}
		 */
		node.convert_spaces = function(str) {
			return str.replace(new RegExp(String.fromCharCode(160), "g"), " ");
		};
		/**
		 * @param {number} message
		 * @return {?}
		 */
		node.decode_utf8 = function(message) {
			var bulk;
			try {
				return void 0 === message ? void 0 : decodeURIComponent(escape(node.convert_spaces(message)));
			} catch (fn) {
				throw bulk = fn, console.error(message), console.error("could not decode"), new Error("end");
			}
		};
		/**
		 * @param {?} data
		 * @return {?}
		 */
		node.base64encode = function(data) {
			return btoa(unescape(encodeURIComponent(data)));
		};
		/**
		 * @param {string} s
		 * @param {string} parent
		 * @return {?}
		 */
		node.preg_match_all = function(s, parent) {
			var tags_here;
			var next;
			return "object" != typeof s && (s = new RegExp(s, "g")), tags_here = [], next = function() {
				var r;
				var width;
				var t;
				var actionArgs;
				var _i;
				return r = arguments[0], t = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), width = arguments[_i++], actionArgs = arguments[_i++], t.unshift(r), t.offset = width, tags_here.push(t);
			}, parent.replace(s, next), tags_here;
		};
		/**
		 * @param {?} obj
		 * @return {?}
		 */
		node.sizeOfObject = function(obj) {
			var prop;
			var n;
			var sizeOfObject;
			/** @type {number} */
			sizeOfObject = 0;
			/** @type {number} */
			n = 0;
			for (prop in obj) {
				sizeOfObject++;
			}
			return sizeOfObject;
		};
		/**
		 * @param {string} str
		 * @param {?} index
		 * @param {?} t
		 * @param {string} putativeSpy
		 * @return {?}
		 */
		node.getOuterXml = function(str, index, t, putativeSpy) {
			var n;
			var lastHotspot;
			if (n = str.indexOf("</" + putativeSpy + ">", t), -1 === n) {
				throw new Error("can't find endTag " + n);
			}
			if (n += ("</" + putativeSpy + ">").length, lastHotspot = Math.max(str.lastIndexOf("<" + putativeSpy + ">", index), str.lastIndexOf("<" + putativeSpy + " ", index)), -1 === lastHotspot) {
				throw new Error("can't find startTag");
			}
			return{
				text : str.substr(lastHotspot, n - lastHotspot),
				startTag : lastHotspot,
				endTag : n
			};
		};
		module.exports = node;
	}, {}],
	3 : [function($sanitize, module) {
		var isFunction;
		var value;
		var $;
		/** @type {function (this:Object, *): boolean} */
		var __hasProp = {}.hasOwnProperty;
		/**
		 * @param {Function} child
		 * @param {Object} parent
		 * @return {?}
		 */
		var __extends = function(child, parent) {
			/**
			 * @return {undefined}
			 */
			function ctor() {
				/** @type {Function} */
				this.constructor = child;
			}
			var key;
			for (key in parent) {
				if (__hasProp.call(parent, key)) {
					child[key] = parent[key];
				}
			}
			return ctor.prototype = parent.prototype, child.prototype = new ctor, child.__super__ = parent.prototype, child;
		};
		value = $sanitize("./xmlTemplater");
		$ = $sanitize("./xmlUtil");
		isFunction = isFunction = function(_super) {
			/**
			 * @param {string} data
			 * @param {Object} details
			 * @return {undefined}
			 */
			function Model(data, details) {
				if (null == data && (data = ""), null == details && (details = {}), Model.__super__.constructor.call(this, "", details), this.currentClass = Model, this.tagXml = "w:t", "string" != typeof data) {
					throw new Error("content must be string!");
				}
				this.load(data);
			}
			return __extends(Model, _super), Model.prototype.calcIntellegentlyDashElement = function() {
				var name;
				var lastIndex;
				var poly;
				var point;
				var p;
				var j;
				var jlen;
				var match;
				match = this.templaterState.findOuterTagsContent(this.content);
				name = match.content;
				point = match.start;
				lastIndex = match.end;
				poly = $.getListXmlElements(this.content, point, lastIndex - point);
				/** @type {number} */
				j = 0;
				jlen = poly.length;
				for (;jlen > j;j++) {
					if (p = poly[j], "<w:tc>" === p.tag) {
						return "w:tr";
					}
				}
				return Model.__super__.calcIntellegentlyDashElement.call(this);
			}, Model;
		}(value);
		module.exports = isFunction;
	}, {
		"./xmlTemplater" : 10,
		"./xmlUtil" : 11
	}],
	4 : [function($sanitize, module) {
		var value;
		var safe;
		var element;
		var Stack;
		var jCanvasObject;
		value = $sanitize("./docUtils");
		safe = $sanitize("./docxTemplater");
		Stack = $sanitize("jszip");
		jCanvasObject = $sanitize("./moduleManager");
		element = element = function() {
			/**
			 * @param {string} data
			 * @param {?} index
			 * @return {undefined}
			 */
			function self(data, index) {
				this.templateClass = safe;
				this.moduleManager = new jCanvasObject;
				this.moduleManager.gen = this;
				/** @type {Array} */
				this.templatedFiles = ["word/document.xml", "word/footer1.xml", "word/footer2.xml", "word/footer3.xml", "word/header1.xml", "word/header2.xml", "word/header3.xml"];
				this.setOptions({});
				if (null != data) {
					this.load(data, index);
				}
			}
			return self.prototype.attachModule = function(until) {
				return this.moduleManager.attachModule(until), this;
			}, self.prototype.setOptions = function(options) {
				return this.options = null != options ? options : {}, this.intelligentTagging = null != this.options.intelligentTagging ? this.options.intelligentTagging : true, null != this.options.parser && (this.parser = options.parser), this;
			}, self.prototype.load = function(head, req) {
				return this.moduleManager.sendEvent("loading"), this.zip = null != head.file ? head : new Stack(head, req), this.moduleManager.sendEvent("loaded"), this;
			}, self.prototype.render = function() {
				var res;
				var name;
				var i;
				var ln;
				var configList;
				this.moduleManager.sendEvent("rendering");
				configList = this.templatedFiles;
				/** @type {number} */
				i = 0;
				ln = configList.length;
				for (;ln > i;i++) {
					name = configList[i];
					if (null != this.zip.files[name]) {
						this.moduleManager.sendEvent("rendering-file", name);
						res = this.createTemplateClass(name);
						this.zip.file(name, res.render().content);
						this.moduleManager.sendEvent("rendered-file", name);
					}
				}
				return this.moduleManager.sendEvent("rendered"), this;
			}, self.prototype.getTags = function() {
				var res;
				var name;
				var currentTags;
				var suiteView;
				var i;
				var ln;
				var configList;
				/** @type {Array} */
				currentTags = [];
				configList = this.templatedFiles;
				/** @type {number} */
				i = 0;
				ln = configList.length;
				for (;ln > i;i++) {
					name = configList[i];
					if (null != this.zip.files[name]) {
						res = this.createTemplateClass(name);
						suiteView = res.render().usedTags;
						if (value.sizeOfObject(suiteView)) {
							currentTags.push({
								fileName : name,
								vars : suiteView
							});
						}
					}
				}
				return currentTags;
			}, self.prototype.setData = function(redraw) {
				return this.Tags = redraw, this;
			}, self.prototype.getZip = function() {
				return this.zip;
			}, self.prototype.createTemplateClass = function(index) {
				var templateClass;
				return templateClass = this.zip.files[index].asText(), new this.templateClass(templateClass, {
					Tags : this.Tags,
					intelligentTagging : this.intelligentTagging,
					parser : this.parser,
					moduleManager : this.moduleManager
				});
			}, self.prototype.getFullText = function(opt_i) {
				return null == opt_i && (opt_i = "word/document.xml"), this.createTemplateClass(opt_i).getFullText();
			}, self;
		}();
		element.DocUtils = value;
		module.exports = element;
	}, {
		"./docUtils" : 2,
		"./docxTemplater" : 3,
		"./moduleManager" : 5,
		jszip : 23
	}],
	5 : [function(dataAndEvents, module) {
		var Actor;
		module.exports = Actor = function() {
			/**
			 * @return {undefined}
			 */
			function $() {
				/** @type {Array} */
				this.modules = [];
			}
			return $.prototype.attachModule = function(until) {
				return this.modules.push(until), until.manager = this, this;
			}, $.prototype.sendEvent = function(event, listener) {
				var node;
				var path;
				var _len;
				var scripts;
				var _results1;
				scripts = this.modules;
				/** @type {Array} */
				_results1 = [];
				/** @type {number} */
				path = 0;
				_len = scripts.length;
				for (;_len > path;path++) {
					node = scripts[path];
					_results1.push(node.handleEvent(event, listener));
				}
				return _results1;
			}, $.prototype.get = function(key) {
				var camel;
				var option;
				var time;
				var i;
				var len;
				var rawParams;
				/** @type {null} */
				time = null;
				rawParams = this.modules;
				/** @type {number} */
				i = 0;
				len = rawParams.length;
				for (;len > i;i++) {
					option = rawParams[i];
					camel = option.get(key);
					time = null !== camel ? camel : time;
				}
				return time;
			}, $.prototype.handle = function(req, res) {
				var extraLocals;
				var server;
				var ret;
				var i;
				var len;
				var rawParams;
				/** @type {null} */
				ret = null;
				rawParams = this.modules;
				/** @type {number} */
				i = 0;
				len = rawParams.length;
				for (;len > i;i++) {
					if (server = rawParams[i], null !== ret) {
						return;
					}
					extraLocals = server.handle(req, res);
					ret = null !== extraLocals ? extraLocals : ret;
				}
				return ret;
			}, $.prototype.getInstance = function(klass) {
				return this[klass];
			}, $;
		}();
	}, {}],
	6 : [function(merge, module) {
		var o;
		var Actor;
		o = merge("./docUtils");
		module.exports = Actor = function() {
			/**
			 * @param {Object} var_args
			 * @param {Object} minutes
			 * @param {Array} moduleNames
			 * @param {?} title
			 * @param {string} fn
			 * @param {?} now
			 * @return {undefined}
			 */
			function create(var_args, minutes, moduleNames, title, fn, now) {
				/** @type {Object} */
				this.tags = var_args;
				/** @type {Object} */
				this.scopePath = minutes;
				/** @type {Array} */
				this.usedTags = moduleNames;
				this.scopeList = title;
				/** @type {string} */
				this.parser = fn;
				this.moduleManager = now;
				this.moduleManager.scopeManager = this;
			}
			return create.prototype.loopOver = function(element, $sanitize, dataAndEvents) {
				var idx;
				var value;
				var type;
				var val;
				var _i;
				var ln;
				if (null == dataAndEvents && (dataAndEvents = false), val = this.getValue(element), type = typeof val, dataAndEvents) {
					if (!val) {
						return $sanitize(this.scopeList[this.num]);
					}
					if ("string" === type) {
						return;
					}
					return "object" === type && (val.length < 1 && $sanitize(this.scopeList[this.num])), void 0;
				}
				if (null != val) {
					if ("object" === type) {
						/** @type {number} */
						idx = _i = 0;
						ln = val.length;
						for (;ln > _i;idx = ++_i) {
							value = val[idx];
							$sanitize(value);
						}
					}
					return val === true ? $sanitize(this.scopeList[this.num]) : void 0;
				}
			}, create.prototype.getValue = function(element, defaultValue) {
				var li;
				var c;
				var b;
				return this.num = null != defaultValue ? defaultValue : this.scopeList.length - 1, b = this.scopeList[this.num], li = this.parser(o.wordToUtf8(element)), c = li.get(b), void 0 === c && this.num > 0 ? this.getValue(element, this.num - 1) : c;
			}, create.prototype.getValueFromScope = function(token) {
				var val;
				var file;
				if (val = this.getValue(token), null != val) {
					if ("string" == typeof val) {
						if (this.useTag(token), file = val, -1 !== file.indexOf(o.tags.start) || -1 !== file.indexOf(o.tags.end)) {
							throw new Error("You can't enter " + o.tags.start + " or\t" + o.tags.end + " inside the content of the variable. Tag: " + token + ", Value: " + val);
						}
					} else {
						file = "number" == typeof val ? String(val) : val;
					}
				} else {
					this.useTag(token);
					/** @type {string} */
					file = "undefined";
				}
				return file;
			}, create.prototype.useTag = function(v) {
				var i;
				var name;
				var state;
				var _i;
				var ln;
				var configList;
				state = this.usedTags;
				configList = this.scopePath;
				/** @type {number} */
				i = _i = 0;
				ln = configList.length;
				for (;ln > _i;i = ++_i) {
					name = configList[i];
					if (null == state[name]) {
						state[name] = {};
					}
					state = state[name];
				}
				return "" !== v ? state[v] = true : void 0;
			}, create;
		}();
	}, {
		"./docUtils" : 2
	}],
	7 : [function(dataAndEvents, module) {
		var Actor;
		module.exports = Actor = function() {
			/**
			 * @param {string} inParent
			 * @return {undefined}
			 */
			function constructor(inParent) {
				this.fullText = null != inParent ? inParent : "";
				/** @type {string} */
				this.text = "";
				/** @type {number} */
				this.start = 0;
				/** @type {number} */
				this.end = 0;
			}
			return constructor.prototype.getInnerTag = function(state) {
				return this.start = state.calcPosition(state.tagStart), this.end = state.calcPosition(state.tagEnd) + 1, this.refreshText();
			}, constructor.prototype.refreshText = function() {
				return this.text = this.fullText.substr(this.start, this.end - this.start), this;
			}, constructor.prototype.getOuterXml = function(dataAndEvents) {
				if (this.end = this.fullText.indexOf("</" + dataAndEvents + ">", this.end), -1 === this.end) {
					throw new Error("can't find endTag " + this.end);
				}
				if (this.end += ("</" + dataAndEvents + ">").length, this.start = Math.max(this.fullText.lastIndexOf("<" + dataAndEvents + ">", this.start), this.fullText.lastIndexOf("<" + dataAndEvents + " ", this.start)), -1 === this.start) {
					throw new Error("can't find startTag");
				}
				return this.refreshText();
			}, constructor.prototype.replace = function(obj) {
				return this.fullText = this.fullText.substr(0, this.start) + obj + this.fullText.substr(this.end), this.end = this.start + obj.length, this.refreshText();
			}, constructor;
		}();
	}, {}],
	8 : [function(resultSelector, module) {
		var result;
		var Actor;
		result = resultSelector("./docUtils");
		module.exports = Actor = function() {
			/**
			 * @param {?} dataAndEvents
			 * @return {undefined}
			 */
			function Metamorph(dataAndEvents) {
				this.moduleManager = dataAndEvents;
				this.moduleManager.templaterState = this;
			}
			return Metamorph.prototype.moveCharacters = function(from, a, b) {
				var unlock;
				var i;
				var pos;
				var eventPath;
				/** @type {Array} */
				eventPath = [];
				unlock = i = from;
				pos = this.matches.length;
				for (;pos >= from ? pos >= i : i >= pos;unlock = pos >= from ? ++i : --i) {
					eventPath.push(this.charactersAdded[unlock] += a - b);
				}
				return eventPath;
			}, Metamorph.prototype.calcStartTag = function(sub) {
				return this.calcPosition(sub.start);
			}, Metamorph.prototype.calcXmlTagPosition = function(tag) {
				return this.matches[tag].offset + this.charactersAdded[tag];
			}, Metamorph.prototype.calcEndTag = function(t) {
				return this.calcPosition(t.end) + 1;
			}, Metamorph.prototype.calcPosition = function(calc) {
				return this.matches[calc.numXmlTag].offset + this.matches[calc.numXmlTag][1].length + this.charactersAdded[calc.numXmlTag] + calc.numCharacter;
			}, Metamorph.prototype.findOuterTagsContent = function(t) {
				var end;
				var start;
				return start = this.calcStartTag(this.loopOpen), end = this.calcEndTag(this.loopClose), {
					content : t.substr(start, end - start),
					start : start,
					end : end
				};
			}, Metamorph.prototype.innerContent = function(timeoutKey) {
				return this.matches[this[timeoutKey].numXmlTag][2];
			}, Metamorph.prototype.findInnerTagsContent = function(t) {
				var end;
				var start;
				return start = this.calcEndTag(this.loopOpen), end = this.calcStartTag(this.loopClose), {
					content : t.substr(start, end - start),
					start : start,
					end : end
				};
			}, Metamorph.prototype.initialize = function() {
				return this.context = "", this.inForLoop = false, this.loopIsInverted = false, this.inTag = false, this.inDashLoop = false, this.rawXmlTag = false, this.textInsideTag = "";
			}, Metamorph.prototype.startTag = function() {
				if (this.inTag === true) {
					throw new Error("Unclosed tag : '" + this.textInsideTag + "'");
				}
				return this.inTag = true, this.rawXmlTag = false, this.textInsideTag = "", this.tagStart = this.currentStep;
			}, Metamorph.prototype.loopType = function() {
				var simple;
				return this.inDashLoop ? "dash" : this.inForLoop ? "for" : (simple = this.moduleManager.get("loopType"), null !== simple ? simple : this.rawXmlTag ? "xml" : "simple");
			}, Metamorph.prototype.isLoopClosingTag = function() {
				return "/" === this.textInsideTag[0] && "/" + this.loopOpen.tag === this.textInsideTag;
			}, Metamorph.prototype.getLeftValue = function() {
				return this.innerContent("tagStart").substr(0, this.tagStart.numCharacter + this.offset[this.tagStart.numXmlTag]);
			}, Metamorph.prototype.getRightValue = function() {
				return this.innerContent("tagEnd").substr(this.tagEnd.numCharacter + 1 + this.offset[this.tagEnd.numXmlTag]);
			}, Metamorph.prototype.endTag = function() {
				var tags;
				if (this.inTag === false) {
					throw new Error("Unopened tag near : '" + this.context.substr(this.context.length - 10, 10) + "'");
				}
				return this.inTag = false, this.tagEnd = this.currentStep, this.textInsideTag = this.textInsideTag.substr(0, this.textInsideTag.length + 1 - result.tags.end.length), "simple" === this.loopType() && ("@" === this.textInsideTag[0] && (this.rawXmlTag = true, this.tag = this.textInsideTag.substr(1)), "#" === this.textInsideTag[0] && (this.inForLoop = true, this.loopOpen = {
					start : this.tagStart,
					end : this.tagEnd,
					tag : this.textInsideTag.substr(1),
					raw : this.textInsideTag
				}), "^" === this.textInsideTag[0] && (this.inForLoop = true, this.loopIsInverted = true, this.loopOpen = {
					start : this.tagStart,
					end : this.tagEnd,
					tag : this.textInsideTag.substr(1),
					raw : this.textInsideTag
				}), "-" === this.textInsideTag[0] && ("simple" === this.loopType() && (this.inDashLoop = true, tags = /^-([^\s]+)\s(.+)$/, this.loopOpen = {
					start : this.tagStart,
					end : this.tagEnd,
					tag : this.textInsideTag.replace(tags, "$2"),
					element : this.textInsideTag.replace(tags, "$1"),
					raw : this.textInsideTag
				}))), "/" === this.textInsideTag[0] ? this.loopClose = {
					start : this.tagStart,
					end : this.tagEnd,
					raw : this.textInsideTag
				} : void 0;
			}, Metamorph;
		}();
	}, {
		"./docUtils" : 2
	}],
	9 : [function(makeIterator, module) {
		var callback;
		var Actor;
		/** @type {function (this:(Array.<T>|string|{length: number}), *=, *=): Array.<T>} */
		var __slice = [].slice;
		callback = makeIterator("./docUtils");
		module.exports = Actor = function() {
			/**
			 * @param {?} content
			 * @return {undefined}
			 */
			function Document(content) {
				this.content = content;
			}
			return Document.prototype.parse = function(execResult) {
				var min;
				return this.tagXml = execResult, this.matches = callback.preg_match_all("(<" + this.tagXml + "[^>]*>)([^<>]*)</" + this.tagXml + ">", this.content), this.charactersAdded = function() {
					var max;
					var len;
					var ret;
					/** @type {Array} */
					ret = [];
					/** @type {number} */
					min = max = 0;
					len = this.matches.length;
					for (;len >= 0 ? len > max : max > len;min = len >= 0 ? ++max : --max) {
						ret.push(0);
					}
					return ret;
				}.call(this), this.handleRecursiveCase(), this;
			}, Document.prototype.handleRecursiveCase = function() {
				var r;
				var amt;
				var content;
				return content = function(b) {
					return function() {
						var r;
						var width;
						var t;
						var actionArgs;
						var _i;
						return r = arguments[0], t = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), width = arguments[_i++], actionArgs = arguments[_i++], t.unshift(r), t.offset = width, t.first = true, b.matches.unshift(t), b.charactersAdded.unshift(0);
					};
				}(this), this.content.replace(/^()([^<]+)/, content), amt = function(global) {
					return function() {
						var stat;
						var e;
						var a;
						var actionArgs;
						var _i;
						return stat = arguments[0], a = 4 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 2) : (_i = 1, []), e = arguments[_i++], actionArgs = arguments[_i++], a.unshift(stat), a.offset = e, a.last = true, global.matches.push(a), global.charactersAdded.push(0);
					};
				}(this), r = "(<" + this.tagXml + "[^>]*>)([^>]+)$", this.content.replace(new RegExp(r), amt), this;
			}, Document;
		}();
	}, {
		"./docUtils" : 2
	}],
	10 : [function($sanitize, module) {
		var $;
		var safe;
		var Tags;
		var value;
		var jCanvasObject;
		var Yaml;
		var Actor;
		$ = $sanitize("./docUtils");
		Tags = $sanitize("./scopeManager");
		value = $sanitize("./subContent");
		jCanvasObject = $sanitize("./templaterState");
		Yaml = $sanitize("./xmlMatcher");
		safe = $sanitize("./moduleManager");
		module.exports = Actor = function() {
			/**
			 * @param {string} val
			 * @param {Object} walkers
			 * @return {undefined}
			 */
			function self(val, walkers) {
				if (null == val) {
					/** @type {string} */
					val = "";
				}
				if (null == walkers) {
					walkers = {};
				}
				/** @type {string} */
				this.tagXml = "";
				/** @type {function (string, Object): undefined} */
				this.currentClass = self;
				this.fromJson(walkers);
				this.templaterState = new jCanvasObject(this.moduleManager);
				this.moduleManager.xmlTemplater = this;
			}
			return self.prototype.load = function(_xhr) {
				var methods;
				return this.content = _xhr, methods = (new Yaml(this.content)).parse(this.tagXml), this.templaterState.matches = methods.matches, this.templaterState.charactersAdded = methods.charactersAdded;
			}, self.prototype.fromJson = function(obj) {
				return null == obj && (obj = {}), this.Tags = null != obj.Tags ? obj.Tags : {}, this.intelligentTagging = null != obj.intelligentTagging ? obj.intelligentTagging : false, this.scopePath = null != obj.scopePath ? obj.scopePath : [], this.scopeList = null != obj.scopeList ? obj.scopeList : [this.Tags], this.usedTags = null != obj.usedTags ? obj.usedTags : {}, this.parser = null != obj.parser ? obj.parser : $.defaultParser, this.moduleManager = null != obj.moduleManager ? obj.moduleManager :
					new safe, this.scopeManager = new Tags(this.Tags, this.scopePath, this.usedTags, this.scopeList, this.parser, this.moduleManager);
			}, self.prototype.toJson = function() {
				return{
					Tags : $.clone(this.scopeManager.tags),
					intelligentTagging : $.clone(this.intelligentTagging),
					scopePath : $.clone(this.scopeManager.scopePath),
					scopeList : $.clone(this.scopeManager.scopeList),
					usedTags : this.scopeManager.usedTags,
					parser : this.parser,
					moduleManager : this.moduleManager
				};
			}, self.prototype.calcIntellegentlyDashElement = function() {
				return false;
			}, self.prototype.getFullText = function(dataAndEvents) {
				var args;
				var matcher;
				var UNICODE_SPACES;
				return this.tagXml = null != dataAndEvents ? dataAndEvents : this.tagXml, matcher = (new Yaml(this.content)).parse(this.tagXml), UNICODE_SPACES = function() {
					var i;
					var len;
					var rawParams;
					var arrayOfArgs;
					rawParams = matcher.matches;
					/** @type {Array} */
					arrayOfArgs = [];
					/** @type {number} */
					i = 0;
					len = rawParams.length;
					for (;len > i;i++) {
						args = rawParams[i];
						arrayOfArgs.push(args[2]);
					}
					return arrayOfArgs;
				}(), $.wordToUtf8($.convert_spaces(UNICODE_SPACES.join("")));
			}, self.prototype.handleModuleManager = function(req, res) {
				return this.moduleManager.xmlTemplater = this, this.moduleManager.templaterState = this.templaterState, this.moduleManager.scopeManager = this.scopeManager, this.moduleManager.handle(req, res);
			}, self.prototype.render = function() {
				var s;
				var series;
				var n;
				var id;
				var data;
				var val;
				var j;
				var i;
				var index;
				var source;
				var words;
				var _j;
				var _k;
				var _i;
				var _len;
				var ln;
				var _len1;
				var _ref;
				var _ref1;
				this.templaterState.initialize();
				/** @type {string} */
				source = "";
				/** @type {Array} */
				words = [];
				/** @type {Array} */
				this.templaterState.offset = [];
				_ref = this.templaterState.matches;
				/** @type {number} */
				i = _j = 0;
				_len = _ref.length;
				for (;_len > _j;i = ++_j) {
					val = _ref[i];
					series = val[2];
					/** @type {number} */
					this.templaterState.offset[i] = 0;
					/** @type {number} */
					j = _k = 0;
					ln = series.length;
					for (;ln > _k;j = ++_k) {
						if (s = series[j], source += s, n = this.templaterState.inTag ? $.tags.end.length : $.tags.start.length, source = source.substr(-n, n), this.templaterState.currentStep = {
								numXmlTag : i,
								numCharacter : j
							}, words.push({
								numXmlTag : i,
								numCharacter : j
							}), words = words.splice(-$.tags.start.length, $.tags.start.length), j + this.templaterState.offset[i] < 0) {
							throw new Error("Shouldn't be less than 0");
						}
						this.templaterState.context += s;
						_ref1 = this.templaterState.matches;
						/** @type {number} */
						index = _i = 0;
						_len1 = _ref1.length;
						for (;_len1 > _i;index = ++_i) {
							if (data = _ref1[index], index === i && this.content[data.offset + this.templaterState.charactersAdded[index]] !== data[0][0]) {
								throw console.error(this.content[data.offset + this.templaterState.charactersAdded[index]]), console.error(this.content), console.error(data[0]), new Error("no < at the beginning of " + data[0][0] + " (2)");
							}
						}
						if (source === $.tags.start) {
							this.templaterState.currentStep = words[0];
							this.templaterState.startTag();
						} else {
							if (source === $.tags.end) {
								if (this.templaterState.endTag(), id = this.templaterState.loopType(), "simple" === id && this.replaceSimpleTag(), "xml" === id && this.replaceSimpleTagRawXml(), ("dash" === id || "for" === id) && this.templaterState.isLoopClosingTag()) {
									return this.replaceLoopTag();
								}
								if (-1 === ["simple", "dash", "for", "xml"].indexOf(id)) {
									this.handleModuleManager("replaceTag", id);
								}
							} else {
								if (this.templaterState.inTag === true) {
									this.templaterState.textInsideTag += s;
								}
							}
						}
					}
				}
				return this;
			}, self.prototype.replaceSimpleTag = function() {
				var member;
				return member = this.scopeManager.getValueFromScope(this.templaterState.textInsideTag), this.content = this.replaceTagByValue($.utf8ToWord(member), this.content);
			}, self.prototype.replaceSimpleTagRawXml = function() {
				var failuresLink;
				var expectationResult;
				return failuresLink = this.scopeManager.getValueFromScope(this.templaterState.tag), expectationResult = (new value(this.content)).getInnerTag(this.templaterState).getOuterXml("w:p"), this.replaceXml(expectationResult, failuresLink);
			}, self.prototype.replaceXml = function(result, el) {
				return this.templaterState.moveCharacters(this.templaterState.tagStart.numXmlTag, el.length, result.text.length), this.content = result.replace(el).fullText;
			}, self.prototype.deleteTag = function(value, req) {
				var ret;
				return this.templaterState.tagStart = req.start, this.templaterState.tagEnd = req.end, this.templaterState.textInsideTag = req.raw, ret = this.replaceTagByValue("", value);
			}, self.prototype.deleteOuterTags = function(isXML) {
				return this.deleteTag(this.deleteTag(isXML, this.templaterState.loopOpen), this.templaterState.loopClose);
			}, self.prototype.dashLoop = function(value, deepDataAndEvents) {
				var i;
				var expectationResult;
				var data;
				var results;
				var time;
				var _ref;
				var arg;
				return null == deepDataAndEvents && (deepDataAndEvents = false), arg = this.templaterState.findOuterTagsContent(this.content), _ref = arg._, time = arg.start, i = arg.end, data = $.getOuterXml(this.content, time, i, value), this.templaterState.moveCharacters(0, 0, data.startTag), results = data.text, expectationResult = this.deleteOuterTags(results, deepDataAndEvents), this.forLoop(expectationResult, results);
			}, self.prototype.xmlToBeReplaced = function(delimiter, dataAndEvents, regex, match, context) {
				var word;
				return delimiter === true ? regex : (word = dataAndEvents === true ? "<" + this.tagXml + ' xml:space="preserve">' + regex : this.templaterState.matches[match][1] + regex, context === true ? word : word + ("</" + this.tagXml + ">"));
			}, self.prototype.replaceXmlTag = function(cssText, matches) {
				var r20;
				var origContext;
				var delimiter;
				var result;
				var node;
				var set;
				var match;
				if (match = matches.xmlTagNumber, r20 = matches.insideValue, this.templaterState.offset[match] += matches.insideValue.length - this.templaterState.matches[match][2].length, node = null != matches.spacePreserve ? matches.spacePreserve : true, delimiter = null != matches.noStartTag ? matches.noStartTag : false, origContext = null != matches.noEndTag ? matches.noEndTag : false, result = this.xmlToBeReplaced(delimiter, node, r20, match, origContext), this.templaterState.matches[match][2] = r20,
						set = this.templaterState.calcXmlTagPosition(match), this.templaterState.moveCharacters(match + 1, result.length, this.templaterState.matches[match][0].length), -1 === cssText.indexOf(this.templaterState.matches[match][0])) {
					throw new Error("content " + this.templaterState.matches[match][0] + " not found in content");
				}
				return cssText = $.replaceFirstFrom(cssText, this.templaterState.matches[match][0], result, set), this.templaterState.matches[match][0] = result, cssText;
			}, self.prototype.replaceTagByValue = function(childrenVarArgs, cssText) {
				var TYPE_PRIVATE_STRICT;
				var matches;
				var i;
				var r;
				var l;
				if (this.templaterState.tagEnd.numXmlTag === this.templaterState.tagStart.numXmlTag) {
					return matches = {
						xmlTagNumber : this.templaterState.tagStart.numXmlTag,
						insideValue : this.templaterState.getLeftValue() + childrenVarArgs + this.templaterState.getRightValue(),
						noStartTag : null != this.templaterState.matches[this.templaterState.tagStart.numXmlTag].first,
						noEndTag : null != this.templaterState.matches[this.templaterState.tagStart.numXmlTag].last
					}, this.replaceXmlTag(cssText, matches);
				}
				if (this.templaterState.tagEnd.numXmlTag > this.templaterState.tagStart.numXmlTag) {
					matches = {
						xmlTagNumber : this.templaterState.tagStart.numXmlTag,
						noStartTag : null != this.templaterState.matches[this.templaterState.tagStart.numXmlTag].first
					};
					matches.insideValue = childrenVarArgs;
					if (null == this.templaterState.matches[this.templaterState.tagStart.numXmlTag].first) {
						if (null == this.templaterState.matches[this.templaterState.tagStart.numXmlTag].last) {
							matches.insideValue = this.templaterState.getLeftValue() + childrenVarArgs;
						}
					}
					cssText = this.replaceXmlTag(cssText, matches);
					matches = {
						insideValue : "",
						spacePreserve : false
					};
					TYPE_PRIVATE_STRICT = i = r = this.templaterState.tagStart.numXmlTag + 1;
					l = this.templaterState.tagEnd.numXmlTag;
					for (;l >= r ? l > i : i > l;TYPE_PRIVATE_STRICT = l >= r ? ++i : --i) {
						matches.xmlTagNumber = TYPE_PRIVATE_STRICT;
						cssText = this.replaceXmlTag(cssText, matches);
					}
					return matches = {
						insideValue : this.templaterState.getRightValue(),
						spacePreserve : true,
						xmlTagNumber : TYPE_PRIVATE_STRICT,
						noEndTag : null != this.templaterState.matches[this.templaterState.tagStart.numXmlTag].last || null != this.templaterState.matches[this.templaterState.tagStart.numXmlTag].first
					}, this.replaceXmlTag(cssText, matches);
				}
			}, self.prototype.replaceLoopTag = function() {
				var udataCur;
				return "dash" === this.templaterState.loopType() ? this.dashLoop(this.templaterState.loopOpen.element) : this.intelligentTagging === true && (udataCur = this.calcIntellegentlyDashElement(), udataCur !== false) ? this.dashLoop(udataCur, true) : this.forLoop();
			}, self.prototype.calcSubXmlTemplater = function(str, opt_attributes) {
				var data;
				return data = this.toJson(), null != opt_attributes && (null != opt_attributes.Tags && (data.Tags = opt_attributes.Tags, data.scopeList = data.scopeList.concat(opt_attributes.Tags), data.scopePath = data.scopePath.concat(this.templaterState.loopOpen.tag))), (new this.currentClass(str, data)).render();
			}, self.prototype.forLoop = function(result, content) {
				var pos;
				var activeClassName;
				return null == result && (result = this.templaterState.findInnerTagsContent(this.content).content), null == content && (content = this.templaterState.findOuterTagsContent(this.content).content), activeClassName = this.templaterState.loopOpen.tag, pos = "", this.scopeManager.loopOver(activeClassName, function(results) {
					return function(dataAndEvents) {
						var text;
						return text = results.calcSubXmlTemplater(result, {
							Tags : dataAndEvents
						}), pos += text.content;
					};
				}(this), this.templaterState.loopIsInverted), null == this.scopeManager.getValue(activeClassName) && this.calcSubXmlTemplater(result, {
					Tags : {}
				}), this.content = this.content.replace(content, pos), this.calcSubXmlTemplater(this.content);
			}, self;
		}();
	}, {
		"./docUtils" : 2,
		"./moduleManager" : 5,
		"./scopeManager" : 6,
		"./subContent" : 7,
		"./templaterState" : 8,
		"./xmlMatcher" : 9
	}],
	11 : [function(makeIterator, module) {
		var callback;
		var JsDiff;
		callback = makeIterator("./docUtils");
		JsDiff = {};
		/**
		 * @param {string} arg
		 * @param {number} p
		 * @param {number} deepDataAndEvents
		 * @return {?}
		 */
		JsDiff.getListXmlElements = function(arg, p, deepDataAndEvents) {
			var i;
			var radio;
			var value;
			var o;
			var line;
			var matches;
			var node;
			var scripts;
			var _i;
			var _len;
			if (null == p) {
				/** @type {number} */
				p = 0;
			}
			if (null == deepDataAndEvents) {
				/** @type {number} */
				deepDataAndEvents = arg.length - 1;
			}
			scripts = callback.preg_match_all("<(/?[^/> ]+)([^>]*)>", arg.substr(p, deepDataAndEvents));
			/** @type {Array} */
			matches = [];
			/** @type {number} */
			i = _i = 0;
			_len = scripts.length;
			for (;_len > _i;i = ++_i) {
				node = scripts[i];
				if ("/" === node[1][0]) {
					/** @type {boolean} */
					o = false;
					if (matches.length > 0) {
						line = matches[matches.length - 1];
						value = line.tag.substr(1, line.tag.length - 2);
						radio = node[1].substr(1);
						if (value === radio) {
							/** @type {boolean} */
							o = true;
						}
					}
					if (o) {
						matches.pop();
					} else {
						matches.push({
							tag : "<" + node[1] + ">",
							offset : node.offset
						});
					}
				} else {
					if (!("/" === node[2][node[2].length - 1])) {
						matches.push({
							tag : "<" + node[1] + ">",
							offset : node.offset
						});
					}
				}
			}
			return matches;
		};
		/**
		 * @param {string} until
		 * @param {number} position
		 * @param {number} deepDataAndEvents
		 * @return {?}
		 */
		JsDiff.getListDifferenceXmlElements = function(until, position, deepDataAndEvents) {
			var stack;
			if (null == position) {
				/** @type {number} */
				position = 0;
			}
			if (null == deepDataAndEvents) {
				/** @type {number} */
				deepDataAndEvents = until.length - 1;
			}
			stack = this.getListXmlElements(until, position, deepDataAndEvents);
			for (;;) {
				if (stack.length <= 1) {
					break;
				}
				if (stack[0].tag.substr(2) !== stack[stack.length - 1].tag.substr(1)) {
					break;
				}
				stack.pop();
				stack.shift();
			}
			return stack;
		};
		module.exports = JsDiff;
	}, {
		"./docUtils" : 2
	}],
	12 : [function(require, dataAndEvents, children) {
		/**
		 * @param {string} data
		 * @param {string} encoding
		 * @param {string} dataAndEvents
		 * @return {?}
		 */
		function tj(data, encoding, dataAndEvents) {
			if (!(this instanceof tj)) {
				return new tj(data, encoding, dataAndEvents);
			}
			/** @type {string} */
			var kind = typeof data;
			if ("base64" === encoding && "string" === kind) {
				data = strip(data);
				for (;data.length % 4 !== 0;) {
					data += "=";
				}
			}
			var len;
			if ("number" === kind) {
				len = ok(data);
			} else {
				if ("string" === kind) {
					len = tj.byteLength(data, encoding);
				} else {
					if ("object" !== kind) {
						throw new Error("First argument needs to be a number, array or string.");
					}
					len = ok(data.length);
				}
			}
			var self;
			if (tj._useTypedArrays) {
				self = tj._augment(new Uint8Array(len));
			} else {
				self = this;
				self.length = len;
				/** @type {boolean} */
				self._isBuffer = true;
			}
			var i;
			if (tj._useTypedArrays && "number" == typeof data.byteLength) {
				self._set(data);
			} else {
				if (validate(data)) {
					/** @type {number} */
					i = 0;
					for (;len > i;i++) {
						self[i] = tj.isBuffer(data) ? data.readUInt8(i) : data[i];
					}
				} else {
					if ("string" === kind) {
						self.write(data, 0, encoding);
					} else {
						if ("number" === kind && (!tj._useTypedArrays && !dataAndEvents)) {
							/** @type {number} */
							i = 0;
							for (;len > i;i++) {
								/** @type {number} */
								self[i] = 0;
							}
						}
					}
				}
			}
			return self;
		}
		/**
		 * @param {(Array|number)} buffer
		 * @param {string} context
		 * @param {(number|string)} size
		 * @param {number} len
		 * @return {?}
		 */
		function parse(buffer, context, size, len) {
			/** @type {number} */
			size = Number(size) || 0;
			/** @type {number} */
			var bytes = buffer.length - size;
			if (len) {
				/** @type {number} */
				len = Number(len);
				if (len > bytes) {
					/** @type {number} */
					len = bytes;
				}
			} else {
				/** @type {number} */
				len = bytes;
			}
			var v = context.length;
			clone(v % 2 === 0, "Invalid hex string");
			if (len > v / 2) {
				/** @type {number} */
				len = v / 2;
			}
			/** @type {number} */
			var x = 0;
			for (;len > x;x++) {
				/** @type {number} */
				var num2 = parseInt(context.substr(2 * x, 2), 16);
				clone(!isNaN(num2), "Invalid hex string");
				/** @type {number} */
				buffer[size + x] = num2;
			}
			return tj._charsWritten = 2 * x, x;
		}
		/**
		 * @param {Array} key
		 * @param {string} message
		 * @param {string} object
		 * @param {string} obj
		 * @return {?}
		 */
		function debug(key, message, object, obj) {
			var isDebugging = tj._charsWritten = callback(error(message), key, object, obj);
			return isDebugging;
		}
		/**
		 * @param {Array} key
		 * @param {string} value
		 * @param {string} raw
		 * @param {string} elems
		 * @return {?}
		 */
		function access(key, value, raw, elems) {
			var y = tj._charsWritten = callback(encode(value), key, raw, elems);
			return y;
		}
		/**
		 * @param {Array} root
		 * @param {string} name
		 * @param {string} value
		 * @param {string} val
		 * @return {?}
		 */
		function attr(root, name, value, val) {
			return access(root, name, value, val);
		}
		/**
		 * @param {Array} key
		 * @param {string} value
		 * @param {string} arg
		 * @param {string} body
		 * @return {?}
		 */
		function done(key, value, arg, body) {
			var _done = tj._charsWritten = callback(unescape(value), key, arg, body);
			return _done;
		}
		/**
		 * @param {Array} root
		 * @param {string} name
		 * @param {string} methodName
		 * @param {string} error
		 * @return {?}
		 */
		function create(root, name, methodName, error) {
			var els = tj._charsWritten = callback(toArray(name), root, methodName, error);
			return els;
		}
		/**
		 * @param {Array} list
		 * @param {number} pos
		 * @param {?} i
		 * @return {?}
		 */
		function match(list, pos, i) {
			return 0 === pos && i === list.length ? assert.fromByteArray(list) : assert.fromByteArray(list.slice(pos, i));
		}
		/**
		 * @param {Arguments} buffer
		 * @param {number} a
		 * @param {number} hash
		 * @return {?}
		 */
		function stringify(buffer, a, hash) {
			/** @type {string} */
			var optsData = "";
			/** @type {string} */
			var expires = "";
			/** @type {number} */
			hash = Math.min(buffer.length, hash);
			/** @type {number} */
			var i = a;
			for (;hash > i;i++) {
				if (buffer[i] <= 127) {
					optsData += replacer(expires) + String.fromCharCode(buffer[i]);
					/** @type {string} */
					expires = "";
				} else {
					expires += "%" + buffer[i].toString(16);
				}
			}
			return optsData + replacer(expires);
		}
		/**
		 * @param {(Arguments|Array)} s
		 * @param {number} size
		 * @param {number} value
		 * @return {?}
		 */
		function set(s, size, value) {
			/** @type {string} */
			var values = "";
			/** @type {number} */
			value = Math.min(s.length, value);
			/** @type {number} */
			var i = size;
			for (;value > i;i++) {
				values += String.fromCharCode(s[i]);
			}
			return values;
		}
		/**
		 * @param {Array} key
		 * @param {number} b
		 * @param {number} val
		 * @return {?}
		 */
		function merge(key, b, val) {
			return set(key, b, val);
		}
		/**
		 * @param {Arguments} array
		 * @param {number} count
		 * @param {number} value
		 * @return {?}
		 */
		function trim(array, count, value) {
			var high = array.length;
			if (!count || 0 > count) {
				/** @type {number} */
				count = 0;
			}
			if (!value || (0 > value || value > high)) {
				value = high;
			}
			/** @type {string} */
			var str = "";
			/** @type {number} */
			var i = count;
			for (;value > i;i++) {
				str += func(array[i]);
			}
			return str;
		}
		/**
		 * @param {Object} chunk
		 * @param {number} start
		 * @param {number} i
		 * @return {?}
		 */
		function data(chunk, start, i) {
			var buffer = chunk.slice(start, i);
			/** @type {string} */
			var evt = "";
			/** @type {number} */
			var offset = 0;
			for (;offset < buffer.length;offset += 2) {
				evt += String.fromCharCode(buffer[offset] + 256 * buffer[offset + 1]);
			}
			return evt;
		}
		/**
		 * @param {Array} input
		 * @param {number} n
		 * @param {boolean} recurring
		 * @param {boolean} deepDataAndEvents
		 * @return {?}
		 */
		function flatten(input, n, recurring, deepDataAndEvents) {
			if (!deepDataAndEvents) {
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== n && null !== n, "missing offset");
				clone(n + 1 < input.length, "Trying to read beyond buffer length");
			}
			var il = input.length;
			if (!(n >= il)) {
				var v;
				return recurring ? (v = input[n], il > n + 1 && (v |= input[n + 1] << 8)) : (v = input[n] << 8, il > n + 1 && (v |= input[n + 1])), v;
			}
		}
		/**
		 * @param {Array} array
		 * @param {number} i
		 * @param {boolean} recurring
		 * @param {boolean} dataAndEvents
		 * @return {?}
		 */
		function get(array, i, recurring, dataAndEvents) {
			if (!dataAndEvents) {
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== i && null !== i, "missing offset");
				clone(i + 3 < array.length, "Trying to read beyond buffer length");
			}
			var length = array.length;
			if (!(i >= length)) {
				var hash;
				return recurring ? (length > i + 2 && (hash = array[i + 2] << 16), length > i + 1 && (hash |= array[i + 1] << 8), hash |= array[i], length > i + 3 && (hash += array[i + 3] << 24 >>> 0)) : (length > i + 1 && (hash = array[i + 1] << 16), length > i + 2 && (hash |= array[i + 2] << 8), length > i + 3 && (hash |= array[i + 3]), hash += array[i] << 24 >>> 0), hash;
			}
		}
		/**
		 * @param {Array} values
		 * @param {number} c
		 * @param {boolean} recurring
		 * @param {?} o
		 * @return {?}
		 */
		function append(values, c, recurring, o) {
			if (!o) {
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== c && null !== c, "missing offset");
				clone(c + 1 < values.length, "Trying to read beyond buffer length");
			}
			var valuesLen = values.length;
			if (!(c >= valuesLen)) {
				var v = flatten(values, c, recurring, true);
				/** @type {number} */
				var r = 32768 & v;
				return r ? -1 * (65535 - v + 1) : v;
			}
		}
		/**
		 * @param {Array} values
		 * @param {number} index
		 * @param {boolean} recurring
		 * @param {?} value
		 * @return {?}
		 */
		function filter(values, index, recurring, value) {
			if (!value) {
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== index && null !== index, "missing offset");
				clone(index + 3 < values.length, "Trying to read beyond buffer length");
			}
			var valuesLen = values.length;
			if (!(index >= valuesLen)) {
				var current = get(values, index, recurring, true);
				/** @type {number} */
				var length = 2147483648 & current;
				return length ? -1 * (4294967295 - current + 1) : current;
			}
		}
		/**
		 * @param {Array} b
		 * @param {number} obj
		 * @param {boolean} recurring
		 * @param {(Object|boolean|number|string)} deepDataAndEvents
		 * @return {?}
		 */
		function extend(b, obj, recurring, deepDataAndEvents) {
			return deepDataAndEvents || (clone("boolean" == typeof recurring, "missing or invalid endian"), clone(obj + 3 < b.length, "Trying to read beyond buffer length")), parser.read(b, obj, recurring, 23, 4);
		}
		/**
		 * @param {Array} b
		 * @param {number} cb
		 * @param {boolean} recurring
		 * @param {(Object|boolean|number|string)} pluginName
		 * @return {?}
		 */
		function write(b, cb, recurring, pluginName) {
			return pluginName || (clone("boolean" == typeof recurring, "missing or invalid endian"), clone(cb + 7 < b.length, "Trying to read beyond buffer length")), parser.read(b, cb, recurring, 52, 8);
		}
		/**
		 * @param {Array} input
		 * @param {number} obj
		 * @param {number} pos
		 * @param {boolean} recurring
		 * @param {?} persistent
		 * @return {undefined}
		 */
		function reset(input, obj, pos, recurring, persistent) {
			if (!persistent) {
				clone(void 0 !== obj && null !== obj, "missing value");
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== pos && null !== pos, "missing offset");
				clone(pos + 1 < input.length, "trying to write beyond buffer length");
				handler(obj, 65535);
			}
			var length = input.length;
			if (!(pos >= length)) {
				/** @type {number} */
				var c = 0;
				/** @type {number} */
				var level = Math.min(length - pos, 2);
				for (;level > c;c++) {
					/** @type {number} */
					input[pos + c] = (obj & 255 << 8 * (recurring ? c : 1 - c)) >>> 8 * (recurring ? c : 1 - c);
				}
			}
		}
		/**
		 * @param {Array} events
		 * @param {number} type
		 * @param {number} c
		 * @param {boolean} recurring
		 * @param {?} str
		 * @return {undefined}
		 */
		function render(events, type, c, recurring, str) {
			if (!str) {
				clone(void 0 !== type && null !== type, "missing value");
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== c && null !== c, "missing offset");
				clone(c + 3 < events.length, "trying to write beyond buffer length");
				handler(type, 4294967295);
			}
			var l = events.length;
			if (!(c >= l)) {
				/** @type {number} */
				var d = 0;
				/** @type {number} */
				var ms = Math.min(l - c, 4);
				for (;ms > d;d++) {
					/** @type {number} */
					events[c + d] = type >>> 8 * (recurring ? d : 3 - d) & 255;
				}
			}
		}
		/**
		 * @param {Array} element
		 * @param {number} e
		 * @param {number} pos
		 * @param {boolean} recurring
		 * @param {?} persistent
		 * @return {undefined}
		 */
		function start(element, e, pos, recurring, persistent) {
			if (!persistent) {
				clone(void 0 !== e && null !== e, "missing value");
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== pos && null !== pos, "missing offset");
				clone(pos + 1 < element.length, "Trying to write beyond buffer length");
				next(e, 32767, -32768);
			}
			var length = element.length;
			if (!(pos >= length)) {
				if (e >= 0) {
					reset(element, e, pos, recurring, persistent);
				} else {
					reset(element, 65535 + e + 1, pos, recurring, persistent);
				}
			}
		}
		/**
		 * @param {Array} name
		 * @param {number} data
		 * @param {number} n
		 * @param {boolean} recurring
		 * @param {?} ms
		 * @return {undefined}
		 */
		function loop(name, data, n, recurring, ms) {
			if (!ms) {
				clone(void 0 !== data && null !== data, "missing value");
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== n && null !== n, "missing offset");
				clone(n + 3 < name.length, "Trying to write beyond buffer length");
				next(data, 2147483647, -2147483648);
			}
			var length = name.length;
			if (!(n >= length)) {
				if (data >= 0) {
					render(name, data, n, recurring, ms);
				} else {
					render(name, 4294967295 + data + 1, n, recurring, ms);
				}
			}
		}
		/**
		 * @param {string} body
		 * @param {Object} value
		 * @param {number} i
		 * @param {boolean} recurring
		 * @param {?} deepDataAndEvents
		 * @return {undefined}
		 */
		function action(body, value, i, recurring, deepDataAndEvents) {
			if (!deepDataAndEvents) {
				clone(void 0 !== value && null !== value, "missing value");
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== i && null !== i, "missing offset");
				clone(i + 3 < body.length, "Trying to write beyond buffer length");
				fn(value, 3.4028234663852886E38, -3.4028234663852886E38);
			}
			var n = body.length;
			if (!(i >= n)) {
				parser.write(body, value, i, recurring, 23, 4);
			}
		}
		/**
		 * @param {string} body
		 * @param {Object} value
		 * @param {number} i
		 * @param {boolean} recurring
		 * @param {?} var_args
		 * @return {undefined}
		 */
		function request(body, value, i, recurring, var_args) {
			if (!var_args) {
				clone(void 0 !== value && null !== value, "missing value");
				clone("boolean" == typeof recurring, "missing or invalid endian");
				clone(void 0 !== i && null !== i, "missing offset");
				clone(i + 7 < body.length, "Trying to write beyond buffer length");
				fn(value, 1.7976931348623157E308, -1.7976931348623157E308);
			}
			var n = body.length;
			if (!(i >= n)) {
				parser.write(body, value, i, recurring, 52, 8);
			}
		}
		/**
		 * @param {string} str
		 * @return {?}
		 */
		function strip(str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
		}
		/**
		 * @param {number} pos
		 * @param {number} length
		 * @param {number} test
		 * @return {?}
		 */
		function clipPos(pos, length, test) {
			return "number" != typeof pos ? test : (pos = ~~pos, pos >= length ? length : pos >= 0 ? pos : (pos += length, pos >= 0 ? pos : 0));
		}
		/**
		 * @param {number} value
		 * @return {?}
		 */
		function ok(value) {
			return value = ~~Math.ceil(+value), 0 > value ? 0 : value;
		}
		/**
		 * @param {?} name
		 * @return {?}
		 */
		function e(name) {
			return(Array.isArray || function(ary) {
				return "[object Array]" === Object.prototype.toString.call(ary);
			})(name);
		}
		/**
		 * @param {string} data
		 * @return {?}
		 */
		function validate(data) {
			return e(data) || (tj.isBuffer(data) || data && ("object" == typeof data && "number" == typeof data.length));
		}
		/**
		 * @param {(number|string)} rules
		 * @return {?}
		 */
		function func(rules) {
			return 16 > rules ? "0" + rules.toString(16) : rules.toString(16);
		}
		/**
		 * @param {string} str
		 * @return {?}
		 */
		function error(str) {
			/** @type {Array} */
			var ret = [];
			/** @type {number} */
			var k = 0;
			for (;k < str.length;k++) {
				var c = str.charCodeAt(k);
				if (127 >= c) {
					ret.push(str.charCodeAt(k));
				} else {
					/** @type {number} */
					var i = k;
					if (c >= 55296) {
						if (57343 >= c) {
							k++;
						}
					}
					/** @type {Array.<string>} */
					var reqVerArray = encodeURIComponent(str.slice(i, k + 1)).substr(1).split("%");
					/** @type {number} */
					var index = 0;
					for (;index < reqVerArray.length;index++) {
						ret.push(parseInt(reqVerArray[index], 16));
					}
				}
			}
			return ret;
		}
		/**
		 * @param {string} b
		 * @return {?}
		 */
		function encode(b) {
			/** @type {Array} */
			var out = [];
			/** @type {number} */
			var bi = 0;
			for (;bi < b.length;bi++) {
				out.push(255 & b.charCodeAt(bi));
			}
			return out;
		}
		/**
		 * @param {string} source
		 * @return {?}
		 */
		function toArray(source) {
			var value;
			var chunk;
			var m;
			/** @type {Array} */
			var arr = [];
			/** @type {number} */
			var pos = 0;
			for (;pos < source.length;pos++) {
				value = source.charCodeAt(pos);
				/** @type {number} */
				chunk = value >> 8;
				/** @type {number} */
				m = value % 256;
				arr.push(m);
				arr.push(chunk);
			}
			return arr;
		}
		/**
		 * @param {string} input
		 * @return {?}
		 */
		function unescape(input) {
			return assert.toByteArray(input);
		}
		/**
		 * @param {Array} array
		 * @param {Array} o
		 * @param {string} value
		 * @param {string} var_args
		 * @return {?}
		 */
		function callback(array, o, value, var_args) {
			/** @type {number} */
			var i = 0;
			for (;var_args > i && !(i + value >= o.length || i >= array.length);i++) {
				o[i + value] = array[i];
			}
			return i;
		}
		/**
		 * @param {string} k
		 * @return {?}
		 */
		function replacer(k) {
			try {
				return decodeURIComponent(k);
			} catch (e) {
				return String.fromCharCode(65533);
			}
		}
		/**
		 * @param {number} a
		 * @param {number} opt_attributes
		 * @return {undefined}
		 */
		function handler(a, opt_attributes) {
			clone("number" == typeof a, "cannot write a non-number as a number");
			clone(a >= 0, "specified a negative value for writing an unsigned value");
			clone(opt_attributes >= a, "value is larger than maximum value for type");
			clone(Math.floor(a) === a, "value has a fractional component");
		}
		/**
		 * @param {number} num
		 * @param {number} opt_attributes
		 * @param {number} opt_interval
		 * @return {undefined}
		 */
		function next(num, opt_attributes, opt_interval) {
			clone("number" == typeof num, "cannot write a non-number as a number");
			clone(opt_attributes >= num, "value larger than maximum allowed value");
			clone(num >= opt_interval, "value smaller than minimum allowed value");
			clone(Math.floor(num) === num, "value has a fractional component");
		}
		/**
		 * @param {string} value
		 * @param {number} opt_attributes
		 * @param {number} range
		 * @return {undefined}
		 */
		function fn(value, opt_attributes, range) {
			clone("number" == typeof value, "cannot write a non-number as a number");
			clone(opt_attributes >= value, "value larger than maximum allowed value");
			clone(value >= range, "value smaller than minimum allowed value");
		}
		/**
		 * @param {boolean} dataAndEvents
		 * @param {string} deepDataAndEvents
		 * @return {undefined}
		 */
		function clone(dataAndEvents, deepDataAndEvents) {
			if (!dataAndEvents) {
				throw new Error(deepDataAndEvents || "Failed assertion");
			}
		}
		var assert = require("base64-js");
		var parser = require("ieee754");
		/** @type {function (string, string, string): ?} */
		children.Buffer = tj;
		/** @type {function (string, string, string): ?} */
		children.SlowBuffer = tj;
		/** @type {number} */
		children.INSPECT_MAX_BYTES = 50;
		/** @type {number} */
		tj.poolSize = 8192;
		tj._useTypedArrays = function() {
			try {
				/** @type {ArrayBuffer} */
				var arrayBuf = new ArrayBuffer(0);
				/** @type {Uint8Array} */
				var source = new Uint8Array(arrayBuf);
				return source.foo = function() {
					return 42;
				}, 42 === source.foo() && "function" == typeof source.subarray;
			} catch (n) {
				return false;
			}
		}();
		/**
		 * @param {?} row
		 * @return {?}
		 */
		tj.isEncoding = function(row) {
			switch(String(row).toLowerCase()) {
				case "hex":
					;
				case "utf8":
					;
				case "utf-8":
					;
				case "ascii":
					;
				case "binary":
					;
				case "base64":
					;
				case "raw":
					;
				case "ucs2":
					;
				case "ucs-2":
					;
				case "utf16le":
					;
				case "utf-16le":
					return true;
				default:
					return false;
			}
		};
		/**
		 * @param {?} actual
		 * @return {?}
		 */
		tj.isBuffer = function(actual) {
			return!(null === actual || (void 0 === actual || !actual._isBuffer));
		};
		/**
		 * @param {string} data
		 * @param {string} enc
		 * @return {?}
		 */
		tj.byteLength = function(data, enc) {
			var _len;
			switch(data += "", enc || "utf8") {
				case "hex":
					/** @type {number} */
					_len = data.length / 2;
					break;
				case "utf8":
					;
				case "utf-8":
					_len = error(data).length;
					break;
				case "ascii":
					;
				case "binary":
					;
				case "raw":
					/** @type {number} */
					_len = data.length;
					break;
				case "base64":
					_len = unescape(data).length;
					break;
				case "ucs2":
					;
				case "ucs-2":
					;
				case "utf16le":
					;
				case "utf-16le":
					/** @type {number} */
					_len = 2 * data.length;
					break;
				default:
					throw new Error("Unknown encoding");;
			}
			return _len;
		};
		/**
		 * @param {Array} b
		 * @param {number} totalLength
		 * @return {?}
		 */
		tj.concat = function(b, totalLength) {
			if (clone(e(b), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === b.length) {
				return new tj(0);
			}
			if (1 === b.length) {
				return b[0];
			}
			var j;
			if ("number" != typeof totalLength) {
				/** @type {number} */
				totalLength = 0;
				/** @type {number} */
				j = 0;
				for (;j < b.length;j++) {
					totalLength += b[j].length;
				}
			}
			var result = new tj(totalLength);
			/** @type {number} */
			var index = 0;
			/** @type {number} */
			j = 0;
			for (;j < b.length;j++) {
				var arr = b[j];
				arr.copy(result, index);
				index += arr.length;
			}
			return result;
		};
		/**
		 * @param {string} name
		 * @param {string} value
		 * @param {string} val
		 * @param {string} encoding
		 * @return {?}
		 */
		tj.prototype.write = function(name, value, val, encoding) {
			if (isFinite(value)) {
				if (!isFinite(val)) {
					/** @type {string} */
					encoding = val;
					val = void 0;
				}
			} else {
				/** @type {string} */
				var ret = encoding;
				/** @type {string} */
				encoding = value;
				/** @type {string} */
				value = val;
				val = ret;
			}
			/** @type {number} */
			value = Number(value) || 0;
			/** @type {number} */
			var high = this.length - value;
			if (val) {
				/** @type {number} */
				val = Number(val);
				if (val > high) {
					/** @type {number} */
					val = high;
				}
			} else {
				/** @type {number} */
				val = high;
			}
			/** @type {string} */
			encoding = String(encoding || "utf8").toLowerCase();
			var res;
			switch(encoding) {
				case "hex":
					res = parse(this, name, value, val);
					break;
				case "utf8":
					;
				case "utf-8":
					res = debug(this, name, value, val);
					break;
				case "ascii":
					res = access(this, name, value, val);
					break;
				case "binary":
					res = attr(this, name, value, val);
					break;
				case "base64":
					res = done(this, name, value, val);
					break;
				case "ucs2":
					;
				case "ucs-2":
					;
				case "utf16le":
					;
				case "utf-16le":
					res = create(this, name, value, val);
					break;
				default:
					throw new Error("Unknown encoding");;
			}
			return res;
		};
		/**
		 * @param {string} encoding
		 * @param {number} value
		 * @param {number} val
		 * @return {?}
		 */
		tj.prototype.toString = function(encoding, value, val) {
			var input = this;
			if (encoding = String(encoding || "utf8").toLowerCase(), value = Number(value) || 0, val = void 0 !== val ? Number(val) : val = input.length, val === value) {
				return "";
			}
			var ret;
			switch(encoding) {
				case "hex":
					ret = trim(input, value, val);
					break;
				case "utf8":
					;
				case "utf-8":
					ret = stringify(input, value, val);
					break;
				case "ascii":
					ret = set(input, value, val);
					break;
				case "binary":
					ret = merge(input, value, val);
					break;
				case "base64":
					ret = match(input, value, val);
					break;
				case "ucs2":
					;
				case "ucs-2":
					;
				case "utf16le":
					;
				case "utf-16le":
					ret = data(input, value, val);
					break;
				default:
					throw new Error("Unknown encoding");;
			}
			return ret;
		};
		/**
		 * @return {?}
		 */
		tj.prototype.toJSON = function() {
			return{
				type : "Buffer",
				data : Array.prototype.slice.call(this._arr || this, 0)
			};
		};
		/**
		 * @param {Array} data
		 * @param {number} offset
		 * @param {number} start
		 * @param {number} end
		 * @return {undefined}
		 */
		tj.prototype.copy = function(data, offset, start, end) {
			var arr = this;
			if (start || (start = 0), end || (0 === end || (end = this.length)), offset || (offset = 0), end !== start && (0 !== data.length && 0 !== arr.length)) {
				clone(end >= start, "sourceEnd < sourceStart");
				clone(offset >= 0 && offset < data.length, "targetStart out of bounds");
				clone(start >= 0 && start < arr.length, "sourceStart out of bounds");
				clone(end >= 0 && end <= arr.length, "sourceEnd out of bounds");
				if (end > this.length) {
					end = this.length;
				}
				if (data.length - offset < end - start) {
					end = data.length - offset + start;
				}
				/** @type {number} */
				var len = end - start;
				if (100 > len || !tj._useTypedArrays) {
					/** @type {number} */
					var i = 0;
					for (;len > i;i++) {
						data[i + offset] = this[i + start];
					}
				} else {
					data._set(this.subarray(start, start + len), offset);
				}
			}
		};
		/**
		 * @param {number} from
		 * @param {number} to
		 * @return {?}
		 */
		tj.prototype.slice = function(from, to) {
			var file = this.length;
			if (from = clipPos(from, file, 0), to = clipPos(to, file, file), tj._useTypedArrays) {
				return tj._augment(this.subarray(from, to));
			}
			/** @type {number} */
			var i = to - from;
			var results = new tj(i, void 0, true);
			/** @type {number} */
			var length = 0;
			for (;i > length;length++) {
				results[length] = this[length + from];
			}
			return results;
		};
		/**
		 * @param {(number|string)} buf
		 * @return {?}
		 */
		tj.prototype.get = function(buf) {
			return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(buf);
		};
		/**
		 * @param {(number|string)} aValue
		 * @param {number} offset
		 * @return {?}
		 */
		tj.prototype.set = function(aValue, offset) {
			return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(aValue, offset);
		};
		/**
		 * @param {number} offset
		 * @param {undefined} noAssert
		 * @return {?}
		 */
		tj.prototype.readUInt8 = function(offset, noAssert) {
			return noAssert || (clone(void 0 !== offset && null !== offset, "missing offset"), clone(offset < this.length, "Trying to read beyond buffer length")), offset >= this.length ? void 0 : this[offset];
		};
		/**
		 * @param {number} shallow
		 * @param {boolean} deepDataAndEvents
		 * @return {?}
		 */
		tj.prototype.readUInt16LE = function(shallow, deepDataAndEvents) {
			return flatten(this, shallow, true, deepDataAndEvents);
		};
		/**
		 * @param {number} shallow
		 * @param {boolean} deepDataAndEvents
		 * @return {?}
		 */
		tj.prototype.readUInt16BE = function(shallow, deepDataAndEvents) {
			return flatten(this, shallow, false, deepDataAndEvents);
		};
		/**
		 * @param {number} dataName
		 * @param {boolean} dataAndEvents
		 * @return {?}
		 */
		tj.prototype.readUInt32LE = function(dataName, dataAndEvents) {
			return get(this, dataName, true, dataAndEvents);
		};
		/**
		 * @param {number} dataName
		 * @param {boolean} dataAndEvents
		 * @return {?}
		 */
		tj.prototype.readUInt32BE = function(dataName, dataAndEvents) {
			return get(this, dataName, false, dataAndEvents);
		};
		/**
		 * @param {number} offset
		 * @param {undefined} signed
		 * @return {?}
		 */
		tj.prototype.readInt8 = function(offset, signed) {
			if (signed || (clone(void 0 !== offset && null !== offset, "missing offset"), clone(offset < this.length, "Trying to read beyond buffer length")), !(offset >= this.length)) {
				/** @type {number} */
				var closed = 128 & this[offset];
				return closed ? -1 * (255 - this[offset] + 1) : this[offset];
			}
		};
		/**
		 * @param {number} l
		 * @param {?} delimit2
		 * @return {?}
		 */
		tj.prototype.readInt16LE = function(l, delimit2) {
			return append(this, l, true, delimit2);
		};
		/**
		 * @param {number} l
		 * @param {?} delimit2
		 * @return {?}
		 */
		tj.prototype.readInt16BE = function(l, delimit2) {
			return append(this, l, false, delimit2);
		};
		/**
		 * @param {number} i
		 * @param {?} isXML
		 * @return {?}
		 */
		tj.prototype.readInt32LE = function(i, isXML) {
			return filter(this, i, true, isXML);
		};
		/**
		 * @param {number} i
		 * @param {?} isXML
		 * @return {?}
		 */
		tj.prototype.readInt32BE = function(i, isXML) {
			return filter(this, i, false, isXML);
		};
		/**
		 * @param {number} extra
		 * @param {string} deepDataAndEvents
		 * @return {?}
		 */
		tj.prototype.readFloatLE = function(extra, deepDataAndEvents) {
			return extend(this, extra, true, deepDataAndEvents);
		};
		/**
		 * @param {number} extra
		 * @param {string} deepDataAndEvents
		 * @return {?}
		 */
		tj.prototype.readFloatBE = function(extra, deepDataAndEvents) {
			return extend(this, extra, false, deepDataAndEvents);
		};
		/**
		 * @param {number} cb
		 * @param {string} pluginName
		 * @return {?}
		 */
		tj.prototype.readDoubleLE = function(cb, pluginName) {
			return write(this, cb, true, pluginName);
		};
		/**
		 * @param {number} cb
		 * @param {string} pluginName
		 * @return {?}
		 */
		tj.prototype.readDoubleBE = function(cb, pluginName) {
			return write(this, cb, false, pluginName);
		};
		/**
		 * @param {number} value
		 * @param {number} offset
		 * @param {?} deepDataAndEvents
		 * @return {undefined}
		 */
		tj.prototype.writeUInt8 = function(value, offset, deepDataAndEvents) {
			if (!deepDataAndEvents) {
				clone(void 0 !== value && null !== value, "missing value");
				clone(void 0 !== offset && null !== offset, "missing offset");
				clone(offset < this.length, "trying to write beyond buffer length");
				handler(value, 255);
			}
			if (!(offset >= this.length)) {
				/** @type {number} */
				this[offset] = value;
			}
		};
		/**
		 * @param {number} walkers
		 * @param {number} offset
		 * @param {?} persistent
		 * @return {undefined}
		 */
		tj.prototype.writeUInt16LE = function(walkers, offset, persistent) {
			reset(this, walkers, offset, true, persistent);
		};
		/**
		 * @param {number} walkers
		 * @param {number} value
		 * @param {?} persistent
		 * @return {undefined}
		 */
		tj.prototype.writeUInt16BE = function(walkers, value, persistent) {
			reset(this, walkers, value, false, persistent);
		};
		/**
		 * @param {number} cl
		 * @param {number} o
		 * @param {?} boundary
		 * @return {undefined}
		 */
		tj.prototype.writeUInt32LE = function(cl, o, boundary) {
			render(this, cl, o, true, boundary);
		};
		/**
		 * @param {number} cl
		 * @param {number} o
		 * @param {?} boundary
		 * @return {undefined}
		 */
		tj.prototype.writeUInt32BE = function(cl, o, boundary) {
			render(this, cl, o, false, boundary);
		};
		/**
		 * @param {number} val
		 * @param {number} offset
		 * @param {?} deepDataAndEvents
		 * @return {undefined}
		 */
		tj.prototype.writeInt8 = function(val, offset, deepDataAndEvents) {
			if (!deepDataAndEvents) {
				clone(void 0 !== val && null !== val, "missing value");
				clone(void 0 !== offset && null !== offset, "missing offset");
				clone(offset < this.length, "Trying to write beyond buffer length");
				next(val, 127, -128);
			}
			if (!(offset >= this.length)) {
				if (val >= 0) {
					this.writeUInt8(val, offset, deepDataAndEvents);
				} else {
					this.writeUInt8(255 + val + 1, offset, deepDataAndEvents);
				}
			}
		};
		/**
		 * @param {number} completeEvent
		 * @param {number} val
		 * @param {?} persistent
		 * @return {undefined}
		 */
		tj.prototype.writeInt16LE = function(completeEvent, val, persistent) {
			start(this, completeEvent, val, true, persistent);
		};
		/**
		 * @param {number} completeEvent
		 * @param {number} val
		 * @param {?} persistent
		 * @return {undefined}
		 */
		tj.prototype.writeInt16BE = function(completeEvent, val, persistent) {
			start(this, completeEvent, val, false, persistent);
		};
		/**
		 * @param {number} data
		 * @param {number} limit
		 * @param {?} slow
		 * @return {undefined}
		 */
		tj.prototype.writeInt32LE = function(data, limit, slow) {
			loop(this, data, limit, true, slow);
		};
		/**
		 * @param {number} data
		 * @param {number} limit
		 * @param {?} slow
		 * @return {undefined}
		 */
		tj.prototype.writeInt32BE = function(data, limit, slow) {
			loop(this, data, limit, false, slow);
		};
		/**
		 * @param {Object} isXML
		 * @param {number} dataName
		 * @param {?} deepDataAndEvents
		 * @return {undefined}
		 */
		tj.prototype.writeFloatLE = function(isXML, dataName, deepDataAndEvents) {
			action(this, isXML, dataName, true, deepDataAndEvents);
		};
		/**
		 * @param {Object} isXML
		 * @param {number} dataName
		 * @param {?} deepDataAndEvents
		 * @return {undefined}
		 */
		tj.prototype.writeFloatBE = function(isXML, dataName, deepDataAndEvents) {
			action(this, isXML, dataName, false, deepDataAndEvents);
		};
		/**
		 * @param {Object} isXML
		 * @param {number} dataName
		 * @param {?} opt_e
		 * @return {undefined}
		 */
		tj.prototype.writeDoubleLE = function(isXML, dataName, opt_e) {
			request(this, isXML, dataName, true, opt_e);
		};
		/**
		 * @param {Object} isXML
		 * @param {number} dataName
		 * @param {?} opt_e
		 * @return {undefined}
		 */
		tj.prototype.writeDoubleBE = function(isXML, dataName, opt_e) {
			request(this, isXML, dataName, false, opt_e);
		};
		/**
		 * @param {number} value
		 * @param {number} offset
		 * @param {?} length
		 * @return {undefined}
		 */
		tj.prototype.fill = function(value, offset, length) {
			if (value || (value = 0), offset || (offset = 0), length || (length = this.length), "string" == typeof value && (value = value.charCodeAt(0)), clone("number" == typeof value && !isNaN(value), "value is not a number"), clone(length >= offset, "end < start"), length !== offset && 0 !== this.length) {
				clone(offset >= 0 && offset < this.length, "start out of bounds");
				clone(length >= 0 && length <= this.length, "end out of bounds");
				/** @type {number} */
				var index = offset;
				for (;length > index;index++) {
					/** @type {number} */
					this[index] = value;
				}
			}
		};
		/**
		 * @return {?}
		 */
		tj.prototype.inspect = function() {
			/** @type {Array} */
			var spec = [];
			var l = this.length;
			/** @type {number} */
			var i = 0;
			for (;l > i;i++) {
				if (spec[i] = func(this[i]), i === children.INSPECT_MAX_BYTES) {
					/** @type {string} */
					spec[i + 1] = "...";
					break;
				}
			}
			return "<Buffer " + spec.join(" ") + ">";
		};
		/**
		 * @return {?}
		 */
		tj.prototype.toArrayBuffer = function() {
			if ("undefined" != typeof Uint8Array) {
				if (tj._useTypedArrays) {
					return(new tj(this)).buffer;
				}
				/** @type {Uint8Array} */
				var buf = new Uint8Array(this.length);
				/** @type {number} */
				var key = 0;
				/** @type {number} */
				var ll = buf.length;
				for (;ll > key;key += 1) {
					buf[key] = this[key];
				}
				return buf.buffer;
			}
			throw new Error("Buffer.toArrayBuffer not supported in this browser");
		};
		var buf = tj.prototype;
		/**
		 * @param {Object} buffer
		 * @return {?}
		 */
		tj._augment = function(buffer) {
			return buffer._isBuffer = true, buffer._get = buffer.get, buffer._set = buffer.set, buffer.get = buf.get, buffer.set = buf.set, buffer.write = buf.write, buffer.toString = buf.toString, buffer.toLocaleString = buf.toString, buffer.toJSON = buf.toJSON, buffer.copy = buf.copy, buffer.slice = buf.slice, buffer.readUInt8 = buf.readUInt8, buffer.readUInt16LE = buf.readUInt16LE, buffer.readUInt16BE = buf.readUInt16BE, buffer.readUInt32LE = buf.readUInt32LE, buffer.readUInt32BE = buf.readUInt32BE,
				buffer.readInt8 = buf.readInt8, buffer.readInt16LE = buf.readInt16LE, buffer.readInt16BE = buf.readInt16BE, buffer.readInt32LE = buf.readInt32LE, buffer.readInt32BE = buf.readInt32BE, buffer.readFloatLE = buf.readFloatLE, buffer.readFloatBE = buf.readFloatBE, buffer.readDoubleLE = buf.readDoubleLE, buffer.readDoubleBE = buf.readDoubleBE, buffer.writeUInt8 = buf.writeUInt8, buffer.writeUInt16LE = buf.writeUInt16LE, buffer.writeUInt16BE = buf.writeUInt16BE, buffer.writeUInt32LE = buf.writeUInt32LE,
				buffer.writeUInt32BE = buf.writeUInt32BE, buffer.writeInt8 = buf.writeInt8, buffer.writeInt16LE = buf.writeInt16LE, buffer.writeInt16BE = buf.writeInt16BE, buffer.writeInt32LE = buf.writeInt32LE, buffer.writeInt32BE = buf.writeInt32BE, buffer.writeFloatLE = buf.writeFloatLE, buffer.writeFloatBE = buf.writeFloatBE, buffer.writeDoubleLE = buf.writeDoubleLE, buffer.writeDoubleBE = buf.writeDoubleBE, buffer.fill = buf.fill, buffer.inspect = buf.inspect, buffer.toArrayBuffer = buf.toArrayBuffer,
				buffer;
		};
	}, {
		"base64-js" : 13,
		ieee754 : 14
	}],
	13 : [function(dataAndEvents, deepDataAndEvents, io) {
		/** @type {string} */
		var nv = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		!function(a) {
			/**
			 * @param {string} a
			 * @return {?}
			 */
			function slice(a) {
				var e = a.charCodeAt(0);
				return e === unload ? 62 : e === err ? 63 : s > e ? -1 : s + 10 > e ? e - s + 26 + 26 : e1 + 26 > e ? e - e1 : bias + 26 > e ? e - bias + 26 : void 0;
			}
			/**
			 * @param {string} s
			 * @return {?}
			 */
			function parse(s) {
				/**
				 * @param {number} dataAndEvents
				 * @return {undefined}
				 */
				function clone(dataAndEvents) {
					/** @type {number} */
					res[resLength++] = dataAndEvents;
				}
				var q;
				var i;
				var f;
				var o;
				var colonIndex;
				var res;
				if (s.length % 4 > 0) {
					throw new Error("Invalid string. Length must be a multiple of 4");
				}
				var imax = s.length;
				/** @type {number} */
				colonIndex = "=" === s.charAt(imax - 2) ? 2 : "=" === s.charAt(imax - 1) ? 1 : 0;
				res = new MarkerArray(3 * s.length / 4 - colonIndex);
				f = colonIndex > 0 ? s.length - 4 : s.length;
				/** @type {number} */
				var resLength = 0;
				/** @type {number} */
				q = 0;
				/** @type {number} */
				i = 0;
				for (;f > q;q += 4, i += 3) {
					/** @type {number} */
					o = slice(s.charAt(q)) << 18 | slice(s.charAt(q + 1)) << 12 | slice(s.charAt(q + 2)) << 6 | slice(s.charAt(q + 3));
					clone((16711680 & o) >> 16);
					clone((65280 & o) >> 8);
					clone(255 & o);
				}
				return 2 === colonIndex ? (o = slice(s.charAt(q)) << 2 | slice(s.charAt(q + 1)) >> 4, clone(255 & o)) : 1 === colonIndex && (o = slice(s.charAt(q)) << 10 | slice(s.charAt(q + 1)) << 4 | slice(s.charAt(q + 2)) >> 2, clone(o >> 8 & 255), clone(255 & o)), res;
			}
			/**
			 * @param {Array} xs
			 * @return {?}
			 */
			function e(xs) {
				/**
				 * @param {number} v
				 * @return {?}
				 */
				function s(v) {
					return nv.charAt(v);
				}
				/**
				 * @param {number} a
				 * @return {?}
				 */
				function f(a) {
					return s(a >> 18 & 63) + s(a >> 12 & 63) + s(a >> 6 & 63) + s(63 & a);
				}
				var _i;
				var x;
				var _j;
				/** @type {number} */
				var decimal = xs.length % 3;
				/** @type {string} */
				var output = "";
				/** @type {number} */
				_i = 0;
				/** @type {number} */
				_j = xs.length - decimal;
				for (;_j > _i;_i += 3) {
					x = (xs[_i] << 16) + (xs[_i + 1] << 8) + xs[_i + 2];
					output += f(x);
				}
				switch(decimal) {
					case 1:
						x = xs[xs.length - 1];
						output += s(x >> 2);
						output += s(x << 4 & 63);
						output += "==";
						break;
					case 2:
						x = (xs[xs.length - 2] << 8) + xs[xs.length - 1];
						output += s(x >> 10);
						output += s(x >> 4 & 63);
						output += s(x << 2 & 63);
						output += "=";
				}
				return output;
			}
			/** @type {Function} */
			var MarkerArray = "undefined" != typeof Uint8Array ? Uint8Array : Array;
			/** @type {number} */
			var unload = "+".charCodeAt(0);
			/** @type {number} */
			var err = "/".charCodeAt(0);
			/** @type {number} */
			var s = "0".charCodeAt(0);
			/** @type {number} */
			var bias = "a".charCodeAt(0);
			/** @type {number} */
			var e1 = "A".charCodeAt(0);
			/** @type {function (string): ?} */
			a.toByteArray = parse;
			/** @type {function (Array): ?} */
			a.fromByteArray = e;
		}("undefined" == typeof io ? this.base64js = {} : io);
	}, {}],
	14 : [function(dataAndEvents, deepDataAndEvents, gridStore) {
		/**
		 * @param {Array} obj
		 * @param {number} type
		 * @param {boolean} recurring
		 * @param {number} length
		 * @param {number} opt_attributes
		 * @return {?}
		 */
		gridStore.read = function(obj, type, recurring, length, opt_attributes) {
			var value;
			var o;
			/** @type {number} */
			var step = 8 * opt_attributes - length - 1;
			/** @type {number} */
			var radio = (1 << step) - 1;
			/** @type {number} */
			var increment = radio >> 1;
			/** @type {number} */
			var i = -7;
			/** @type {number} */
			var name = recurring ? opt_attributes - 1 : 0;
			/** @type {number} */
			var ext = recurring ? -1 : 1;
			var data = obj[type + name];
			name += ext;
			/** @type {number} */
			value = data & (1 << -i) - 1;
			data >>= -i;
			i += step;
			for (;i > 0;value = 256 * value + obj[type + name], name += ext, i -= 8) {
			}
			/** @type {number} */
			o = value & (1 << -i) - 1;
			value >>= -i;
			i += length;
			for (;i > 0;o = 256 * o + obj[type + name], name += ext, i -= 8) {
			}
			if (0 === value) {
				/** @type {number} */
				value = 1 - increment;
			} else {
				if (value === radio) {
					return o ? 0 / 0 : 1 / 0 * (data ? -1 : 1);
				}
				o += Math.pow(2, length);
				value -= increment;
			}
			return(data ? -1 : 1) * o * Math.pow(2, value - length);
		};
		/**
		 * @param {string} data
		 * @param {number} value
		 * @param {number} offset
		 * @param {boolean} recurring
		 * @param {number} mLen
		 * @param {number} opt_attributes
		 * @return {undefined}
		 */
		gridStore.write = function(data, value, offset, recurring, mLen, opt_attributes) {
			var e;
			var m;
			var c;
			/** @type {number} */
			var eLen = 8 * opt_attributes - mLen - 1;
			/** @type {number} */
			var eMax = (1 << eLen) - 1;
			/** @type {number} */
			var eBias = eMax >> 1;
			/** @type {number} */
			var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
			/** @type {number} */
			var len = recurring ? 0 : opt_attributes - 1;
			/** @type {number} */
			var i = recurring ? 1 : -1;
			/** @type {number} */
			var g = 0 > value || 0 === value && 0 > 1 / value ? 1 : 0;
			/** @type {number} */
			value = Math.abs(value);
			if (isNaN(value) || 1 / 0 === value) {
				/** @type {number} */
				m = isNaN(value) ? 1 : 0;
				/** @type {number} */
				e = eMax;
			} else {
				/** @type {number} */
				e = Math.floor(Math.log(value) / Math.LN2);
				if (value * (c = Math.pow(2, -e)) < 1) {
					e--;
					c *= 2;
				}
				value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias);
				if (value * c >= 2) {
					e++;
					c /= 2;
				}
				if (e + eBias >= eMax) {
					/** @type {number} */
					m = 0;
					/** @type {number} */
					e = eMax;
				} else {
					if (e + eBias >= 1) {
						/** @type {number} */
						m = (value * c - 1) * Math.pow(2, mLen);
						e += eBias;
					} else {
						/** @type {number} */
						m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
						/** @type {number} */
						e = 0;
					}
				}
			}
			for (;mLen >= 8;data[offset + len] = 255 & m, len += i, m /= 256, mLen -= 8) {
			}
			/** @type {number} */
			e = e << mLen | m;
			eLen += mLen;
			for (;eLen > 0;data[offset + len] = 255 & e, len += i, e /= 256, eLen -= 8) {
			}
			data[offset + len - i] |= 128 * g;
		};
	}, {}],
	15 : [function(dataAndEvents, deepDataAndEvents, exports) {
		/** @type {string} */
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		/**
		 * @param {string} input
		 * @return {?}
		 */
		exports.encode = function(input) {
			var chr1;
			var val2;
			var chr2;
			var enc1;
			var enc2;
			var enc3;
			var enc4;
			/** @type {string} */
			var output = "";
			/** @type {number} */
			var i = 0;
			for (;i < input.length;) {
				chr1 = input.charCodeAt(i++);
				val2 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				/** @type {number} */
				enc1 = chr1 >> 2;
				/** @type {number} */
				enc2 = (3 & chr1) << 4 | val2 >> 4;
				/** @type {number} */
				enc3 = (15 & val2) << 2 | chr2 >> 6;
				/** @type {number} */
				enc4 = 63 & chr2;
				if (isNaN(val2)) {
					/** @type {number} */
					enc3 = enc4 = 64;
				} else {
					if (isNaN(chr2)) {
						/** @type {number} */
						enc4 = 64;
					}
				}
				/** @type {string} */
				output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			}
			return output;
		};
		/**
		 * @param {string} input
		 * @return {?}
		 */
		exports.decode = function(input) {
			var c;
			var lo;
			var uffff;
			var enc1;
			var enc2;
			var o;
			var l;
			/** @type {string} */
			var string = "";
			/** @type {number} */
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			for (;i < input.length;) {
				/** @type {number} */
				enc1 = keyStr.indexOf(input.charAt(i++));
				/** @type {number} */
				enc2 = keyStr.indexOf(input.charAt(i++));
				/** @type {number} */
				o = keyStr.indexOf(input.charAt(i++));
				/** @type {number} */
				l = keyStr.indexOf(input.charAt(i++));
				/** @type {number} */
				c = enc1 << 2 | enc2 >> 4;
				/** @type {number} */
				lo = (15 & enc2) << 4 | o >> 2;
				/** @type {number} */
				uffff = (3 & o) << 6 | l;
				string += String.fromCharCode(c);
				if (64 != o) {
					string += String.fromCharCode(lo);
				}
				if (64 != l) {
					string += String.fromCharCode(uffff);
				}
			}
			return string;
		};
	}, {}],
	16 : [function(dataAndEvents, module) {
		/**
		 * @return {undefined}
		 */
		function ReadZipEntry() {
			/** @type {number} */
			this.compressedSize = 0;
			/** @type {number} */
			this.uncompressedSize = 0;
			/** @type {number} */
			this.crc32 = 0;
			/** @type {null} */
			this.compressionMethod = null;
			/** @type {null} */
			this.compressedContent = null;
		}
		ReadZipEntry.prototype = {
			/**
			 * @return {?}
			 */
			getContent : function() {
				return null;
			},
			/**
			 * @return {?}
			 */
			getCompressedContent : function() {
				return null;
			}
		};
		/** @type {function (): undefined} */
		module.exports = ReadZipEntry;
	}, {}],
	17 : [function(trim, dataAndEvents, el) {
		el.STORE = {
			magic : "\x00\x00",
			/**
			 * @param {?} content
			 * @return {?}
			 */
			compress : function(content) {
				return content;
			},
			/**
			 * @param {?} content
			 * @return {?}
			 */
			uncompress : function(content) {
				return content;
			},
			compressInputType : null,
			uncompressInputType : null
		};
		el.DEFLATE = trim("./flate");
	}, {
		"./flate" : 22
	}],
	18 : [function(topic, module) {
		var out = topic("./utils");
		/** @type {Array} */
		var members = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684,
			3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925,
			453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989,
			3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462,
			1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115,
			1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
		/**
		 * @param {string} data
		 * @param {number} args
		 * @return {?}
		 */
		module.exports = function(data, args) {
			if ("undefined" == typeof data || !data.length) {
				return 0;
			}
			/** @type {boolean} */
			var name = "string" !== out.getTypeOf(data);
			if ("undefined" == typeof args) {
				/** @type {number} */
				args = 0;
			}
			/** @type {number} */
			var member = 0;
			/** @type {number} */
			var prop = 0;
			/** @type {number} */
			var names = 0;
			/** @type {number} */
			args = -1 ^ args;
			/** @type {number} */
			var y = 0;
			var x = data.length;
			for (;x > y;y++) {
				names = name ? data[y] : data.charCodeAt(y);
				/** @type {number} */
				prop = 255 & (args ^ names);
				member = members[prop];
				/** @type {number} */
				args = args >>> 8 ^ member;
			}
			return-1 ^ args;
		};
	}, {
		"./utils" : 35
	}],
	19 : [function(require, module) {
		/**
		 * @return {undefined}
		 */
		function DataReader() {
			/** @type {null} */
			this.data = null;
			/** @type {number} */
			this.length = 0;
			/** @type {number} */
			this.index = 0;
		}
		var Handlebars = require("./utils");
		DataReader.prototype = {
			/**
			 * @param {number} offset
			 * @return {undefined}
			 */
			checkOffset : function(offset) {
				this.checkIndex(this.index + offset);
			},
			/**
			 * @param {number} newIndex
			 * @return {undefined}
			 */
			checkIndex : function(newIndex) {
				if (this.length < newIndex || 0 > newIndex) {
					throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
				}
			},
			/**
			 * @param {number} newIndex
			 * @return {undefined}
			 */
			setIndex : function(newIndex) {
				this.checkIndex(newIndex);
				/** @type {number} */
				this.index = newIndex;
			},
			/**
			 * @param {number} n
			 * @return {undefined}
			 */
			skip : function(n) {
				this.setIndex(this.index + n);
			},
			/**
			 * @return {undefined}
			 */
			byteAt : function() {
			},
			/**
			 * @param {number} opt_attributes
			 * @return {?}
			 */
			readInt : function(opt_attributes) {
				var i;
				/** @type {number} */
				var result = 0;
				this.checkOffset(opt_attributes);
				/** @type {number} */
				i = this.index + opt_attributes - 1;
				for (;i >= this.index;i--) {
					result = (result << 8) + this.byteAt(i);
				}
				return this.index += opt_attributes, result;
			},
			/**
			 * @param {number} size
			 * @return {?}
			 */
			readString : function(size) {
				return Handlebars.transformTo("string", this.readData(size));
			},
			/**
			 * @return {undefined}
			 */
			readData : function() {
			},
			/**
			 * @return {undefined}
			 */
			lastIndexOfSignature : function() {
			},
			/**
			 * @return {?}
			 */
			readDate : function() {
				var dostime = this.readInt(4);
				return new Date((dostime >> 25 & 127) + 1980, (dostime >> 21 & 15) - 1, dostime >> 16 & 31, dostime >> 11 & 31, dostime >> 5 & 63, (31 & dostime) << 1);
			}
		};
		/** @type {function (): undefined} */
		module.exports = DataReader;
	}, {
		"./utils" : 35
	}],
	20 : [function(dataAndEvents, deepDataAndEvents, o) {
		/** @type {boolean} */
		o.base64 = false;
		/** @type {boolean} */
		o.binary = false;
		/** @type {boolean} */
		o.dir = false;
		/** @type {boolean} */
		o.createFolders = false;
		/** @type {null} */
		o.date = null;
		/** @type {null} */
		o.compression = null;
		/** @type {null} */
		o.comment = null;
	}, {}],
	21 : [function(require, dataAndEvents, exports) {
		var util = require("./utils");
		/**
		 * @param {string} str
		 * @return {?}
		 */
		exports.string2binary = function(str) {
			return util.string2binary(str);
		};
		/**
		 * @param {string} array
		 * @return {?}
		 */
		exports.string2Uint8Array = function(array) {
			return util.transformTo("uint8array", array);
		};
		/**
		 * @param {string} array
		 * @return {?}
		 */
		exports.uint8Array2String = function(array) {
			return util.transformTo("string", array);
		};
		/**
		 * @param {string} elems
		 * @return {?}
		 */
		exports.string2Blob = function(elems) {
			var ret = util.transformTo("arraybuffer", elems);
			return util.arrayBuffer2Blob(ret);
		};
		/**
		 * @param {string} statements
		 * @return {?}
		 */
		exports.arrayBuffer2Blob = function(statements) {
			return util.arrayBuffer2Blob(statements);
		};
		/**
		 * @param {string} data
		 * @param {string} array
		 * @return {?}
		 */
		exports.transformTo = function(data, array) {
			return util.transformTo(data, array);
		};
		/**
		 * @param {string} data
		 * @return {?}
		 */
		exports.getTypeOf = function(data) {
			return util.getTypeOf(data);
		};
		/**
		 * @param {string} blob
		 * @return {?}
		 */
		exports.checkSupport = function(blob) {
			return util.checkSupport(blob);
		};
		exports.MAX_VALUE_16BITS = util.MAX_VALUE_16BITS;
		exports.MAX_VALUE_32BITS = util.MAX_VALUE_32BITS;
		/**
		 * @param {string} time
		 * @return {?}
		 */
		exports.pretty = function(time) {
			return util.pretty(time);
		};
		/**
		 * @param {?} deepDataAndEvents
		 * @return {?}
		 */
		exports.findCompression = function(deepDataAndEvents) {
			return util.findCompression(deepDataAndEvents);
		};
		/**
		 * @param {string} arg
		 * @return {?}
		 */
		exports.isRegExp = function(arg) {
			return util.isRegExp(arg);
		};
	}, {
		"./utils" : 35
	}],
	22 : [function(topic, dataAndEvents, compression) {
		/** @type {boolean} */
		var iterator = "undefined" != typeof Uint8Array && ("undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array);
		var out = topic("pako");
		/** @type {string} */
		compression.uncompressInputType = iterator ? "uint8array" : "array";
		/** @type {string} */
		compression.compressInputType = iterator ? "uint8array" : "array";
		/** @type {string} */
		compression.magic = "\b\x00";
		/**
		 * @param {?} output
		 * @return {?}
		 */
		compression.compress = function(output) {
			return out.deflateRaw(output);
		};
		/**
		 * @param {?} data
		 * @return {?}
		 */
		compression.uncompress = function(data) {
			return out.inflateRaw(data);
		};
	}, {
		pako : 38
	}],
	23 : [function(require, module) {
		/**
		 * @param {Object} data
		 * @param {string} options
		 * @return {?}
		 */
		function JSZip(data, options) {
			return this instanceof JSZip ? (this.files = {}, this.comment = null, this.root = "", data && this.load(data, options), this.clone = function() {
				var newObj = new JSZip;
				var i;
				for (i in this) {
					if ("function" != typeof this[i]) {
						newObj[i] = this[i];
					}
				}
				return newObj;
			}, void 0) : new JSZip(data, options);
		}
		var serializer = require("./base64");
		JSZip.prototype = require("./object");
		JSZip.prototype.load = require("./load");
		JSZip.support = require("./support");
		JSZip.defaults = require("./defaults");
		JSZip.utils = require("./deprecatedPublicUtils");
		JSZip.base64 = {
			/**
			 * @param {string} string
			 * @return {?}
			 */
			encode : function(string) {
				return serializer.encode(string);
			},
			/**
			 * @param {string} data
			 * @return {?}
			 */
			decode : function(data) {
				return serializer.decode(data);
			}
		};
		JSZip.compressions = require("./compressions");
		/** @type {function (Object, string): ?} */
		module.exports = JSZip;
	}, {
		"./base64" : 15,
		"./compressions" : 17,
		"./defaults" : 20,
		"./deprecatedPublicUtils" : 21,
		"./load" : 24,
		"./object" : 27,
		"./support" : 31
	}],
	24 : [function(require, module) {
		var base64VLQ = require("./base64");
		var Spinner = require("./zipEntries");
		/**
		 * @param {string} str
		 * @param {Object} options
		 * @return {?}
		 */
		module.exports = function(str, options) {
			var codeSegments;
			var data;
			var i;
			var input;
			options = options || {};
			if (options.base64) {
				str = base64VLQ.decode(str);
			}
			data = new Spinner(str, options);
			codeSegments = data.files;
			/** @type {number} */
			i = 0;
			for (;i < codeSegments.length;i++) {
				input = codeSegments[i];
				this.file(input.fileName, input.decompressed, {
					binary : true,
					optimizedBinaryString : true,
					date : input.date,
					dir : input.dir,
					comment : input.fileComment.length ? input.fileComment : null,
					createFolders : options.createFolders
				});
			}
			return data.zipComment.length && (this.comment = data.zipComment), this;
		};
	}, {
		"./base64" : 15,
		"./zipEntries" : 36
	}],
	25 : [function(require, module) {
		(function(Buffer) {
			/**
			 * @param {Array} str
			 * @param {Array} encoding
			 * @return {?}
			 */
			module.exports = function(str, encoding) {
				return new Buffer(str, encoding);
			};
			/**
			 * @param {?} actual
			 * @return {?}
			 */
			module.exports.test = function(actual) {
				return Buffer.isBuffer(actual);
			};
		}).call(this, require("buffer").Buffer);
	}, {
		buffer : 12
	}],
	26 : [function(require, module) {
		/**
		 * @param {string} args
		 * @return {undefined}
		 */
		function Test(args) {
			/** @type {string} */
			this.data = args;
			this.length = this.data.length;
			/** @type {number} */
			this.index = 0;
		}
		var Runnable = require("./uint8ArrayReader");
		Test.prototype = new Runnable;
		/**
		 * @param {number} size
		 * @return {?}
		 */
		Test.prototype.readData = function(size) {
			this.checkOffset(size);
			var index = this.data.slice(this.index, this.index + size);
			return this.index += size, index;
		};
		/** @type {function (string): undefined} */
		module.exports = Test;
	}, {
		"./uint8ArrayReader" : 32
	}],
	27 : [function(require, module) {
		var Block = require("./support");
		var self = require("./utils");
		var crc32 = require("./crc32");
		var nodes = require("./signature");
		var settings = require("./defaults");
		var _ = require("./base64");
		var registry = require("./compressions");
		var Model = require("./compressedObject");
		var info = require("./nodeBuffer");
		var assert = require("./utf8");
		var helper = require("./stringWriter");
		var Session = require("./uint8ArrayWriter");
		/**
		 * @param {Element} data
		 * @return {?}
		 */
		var onSuccess = function(data) {
			if (data._data instanceof Model && (data._data = data._data.getContent(), data.options.binary = true, data.options.base64 = false, "uint8array" === self.getTypeOf(data._data))) {
				var result = data._data;
				/** @type {Uint8Array} */
				data._data = new Uint8Array(result.length);
				if (0 !== result.length) {
					data._data.set(result, 0);
				}
			}
			return data._data;
		};
		/**
		 * @param {Element} file
		 * @return {?}
		 */
		var get = function(file) {
			var text = onSuccess(file);
			var type = self.getTypeOf(text);
			return "string" === type ? !file.options.binary && Block.nodebuffer ? info(text, "utf-8") : file.asBinary() : text;
		};
		/**
		 * @param {boolean} execResult
		 * @return {?}
		 */
		var parse = function(execResult) {
			var result = onSuccess(this);
			return null === result || "undefined" == typeof result ? "" : (this.options.base64 && (result = _.decode(result)), result = execResult && this.options.binary ? _self.utf8decode(result) : self.transformTo("string", result), execResult || (this.options.binary || (result = self.transformTo("string", _self.utf8encode(result)))), result);
		};
		/**
		 * @param {string} name
		 * @param {Array} data
		 * @param {Object} options
		 * @return {undefined}
		 */
		var ZipObject = function(name, data, options) {
			/** @type {string} */
			this.name = name;
			this.dir = options.dir;
			this.date = options.date;
			this.comment = options.comment;
			/** @type {Array} */
			this._data = data;
			/** @type {Object} */
			this.options = options;
			this._initialMetadata = {
				dir : options.dir,
				date : options.date
			};
		};
		ZipObject.prototype = {
			/**
			 * @return {?}
			 */
			asText : function() {
				return parse.call(this, true);
			},
			/**
			 * @return {?}
			 */
			asBinary : function() {
				return parse.call(this, false);
			},
			/**
			 * @return {?}
			 */
			asNodeBuffer : function() {
				var data = get(this);
				return self.transformTo("nodebuffer", data);
			},
			/**
			 * @return {?}
			 */
			asUint8Array : function() {
				var data = get(this);
				return self.transformTo("uint8array", data);
			},
			/**
			 * @return {?}
			 */
			asArrayBuffer : function() {
				return this.asUint8Array().buffer;
			}
		};
		/**
		 * @param {number} dataAndEvents
		 * @param {number} expectedNumberOfNonCommentArgs
		 * @return {?}
		 */
		var decToHex = function(dataAndEvents, expectedNumberOfNonCommentArgs) {
			var n;
			/** @type {string} */
			var optsData = "";
			/** @type {number} */
			n = 0;
			for (;expectedNumberOfNonCommentArgs > n;n++) {
				optsData += String.fromCharCode(255 & dataAndEvents);
				dataAndEvents >>>= 8;
			}
			return optsData;
		};
		/**
		 * @return {?}
		 */
		var extend = function() {
			var i;
			var prop;
			var obj = {};
			/** @type {number} */
			i = 0;
			for (;i < arguments.length;i++) {
				for (prop in arguments[i]) {
					if (arguments[i].hasOwnProperty(prop)) {
						if ("undefined" == typeof obj[prop]) {
							obj[prop] = arguments[i][prop];
						}
					}
				}
			}
			return obj;
		};
		/**
		 * @param {Object} o
		 * @return {?}
		 */
		var prepareFileAttrs = function(o) {
			return o = o || {}, o.base64 !== true || (null !== o.binary && void 0 !== o.binary || (o.binary = true)), o = extend(o, settings), o.date = o.date || new Date, null !== o.compression && (o.compression = o.compression.toUpperCase()), o;
		};
		/**
		 * @param {string} name
		 * @param {string} data
		 * @param {Object} o
		 * @return {?}
		 */
		var fileAdd = function(name, data, o) {
			var filename;
			var res = self.getTypeOf(data);
			if (o = prepareFileAttrs(o), o.createFolders && ((filename = parentFolder(name)) && process.call(this, filename, true)), o.dir || (null === data || "undefined" == typeof data)) {
				/** @type {boolean} */
				o.base64 = false;
				/** @type {boolean} */
				o.binary = false;
				/** @type {null} */
				data = null;
			} else {
				if ("string" === res) {
					if (o.binary) {
						if (!o.base64) {
							if (o.optimizedBinaryString !== true) {
								data = self.string2binary(data);
							}
						}
					}
				} else {
					if (o.base64 = false, o.binary = true, !(res || data instanceof Model)) {
						throw new Error("The data of '" + name + "' is in an unsupported format !");
					}
					if ("arraybuffer" === res) {
						data = self.transformTo("uint8array", data);
					}
				}
			}
			var node = new ZipObject(name, data, o);
			return this.files[name] = node, node;
		};
		/**
		 * @param {string} path
		 * @return {?}
		 */
		var parentFolder = function(path) {
			if ("/" == path.slice(-1)) {
				path = path.substring(0, path.length - 1);
			}
			var lastSlash = path.lastIndexOf("/");
			return lastSlash > 0 ? path.substring(0, lastSlash) : "";
		};
		/**
		 * @param {string} name
		 * @param {boolean} y
		 * @return {?}
		 */
		var process = function(name, y) {
			return "/" != name.slice(-1) && (name += "/"), y = "undefined" != typeof y ? y : false, this.files[name] || fileAdd.call(this, name, null, {
				dir : true,
				createFolders : y
			}), this.files[name];
		};
		/**
		 * @param {Element} el
		 * @param {?} options
		 * @return {?}
		 */
		var onEnd = function(el, options) {
			var data;
			var that = new Model;
			return el._data instanceof Model ? (that.uncompressedSize = el._data.uncompressedSize, that.crc32 = el._data.crc32, 0 === that.uncompressedSize || el.dir ? (options = registry.STORE, that.compressedContent = "", that.crc32 = 0) : el._data.compressionMethod === options.magic ? that.compressedContent = el._data.getCompressedContent() : (data = el._data.getContent(), that.compressedContent = options.compress(self.transformTo(options.compressInputType, data)))) : (data = get(el), (!data || (0 ===
			data.length || el.dir)) && (options = registry.STORE, data = ""), that.uncompressedSize = data.length, that.crc32 = crc32(data), that.compressedContent = options.compress(self.transformTo(options.compressInputType, data))), that.compressedSize = that.compressedContent.length, that.compressionMethod = options.magic, that;
		};
		/**
		 * @param {?} utfEncodedFileName
		 * @param {Object} file
		 * @param {?} directoryEntry
		 * @param {number} dataAndEvents
		 * @return {?}
		 */
		var prepareLocalHeaderData = function(utfEncodedFileName, file, directoryEntry, dataAndEvents) {
			var dosTime;
			var dosDate;
			var h;
			var newYearInBratislava;
			var compressedData = (directoryEntry.compressedContent, self.transformTo("string", assert.utf8encode(file.name)));
			var result = file.comment || "";
			var data = self.transformTo("string", assert.utf8encode(result));
			/** @type {boolean} */
			var program = compressedData.length !== file.name.length;
			/** @type {boolean} */
			var inverse = data.length !== result.length;
			var o = file.options;
			/** @type {string} */
			var millis = "";
			/** @type {string} */
			var files = "";
			/** @type {string} */
			var postData = "";
			h = file._initialMetadata.dir !== file.dir ? file.dir : o.dir;
			newYearInBratislava = file._initialMetadata.date !== file.date ? file.date : o.date;
			dosTime = newYearInBratislava.getHours();
			dosTime <<= 6;
			dosTime |= newYearInBratislava.getMinutes();
			dosTime <<= 5;
			dosTime |= newYearInBratislava.getSeconds() / 2;
			/** @type {number} */
			dosDate = newYearInBratislava.getFullYear() - 1980;
			dosDate <<= 4;
			dosDate |= newYearInBratislava.getMonth() + 1;
			dosDate <<= 5;
			dosDate |= newYearInBratislava.getDate();
			if (program) {
				files = decToHex(1, 1) + decToHex(crc32(compressedData), 4) + compressedData;
				millis += "up" + decToHex(files.length, 2) + files;
			}
			if (inverse) {
				postData = decToHex(1, 1) + decToHex(this.crc32(data), 4) + data;
				millis += "uc" + decToHex(postData.length, 2) + postData;
			}
			/** @type {string} */
			var header = "";
			header += "\n\x00";
			header += program || inverse ? "\x00\b" : "\x00\x00";
			header += directoryEntry.compressionMethod;
			header += decToHex(dosTime, 2);
			header += decToHex(dosDate, 2);
			header += decToHex(directoryEntry.crc32, 4);
			header += decToHex(directoryEntry.compressedSize, 4);
			header += decToHex(directoryEntry.uncompressedSize, 4);
			header += decToHex(compressedData.length, 2);
			header += decToHex(millis.length, 2);
			/** @type {string} */
			var newMillis = nodes.LOCAL_FILE_HEADER + header + compressedData + millis;
			/** @type {string} */
			var svg = nodes.CENTRAL_FILE_HEADER + "\u0014\x00" + header + decToHex(data.length, 2) + "\x00\x00\x00\x00" + (h === true ? "\u0010\x00\x00\x00" : "\x00\x00\x00\x00") + decToHex(dataAndEvents, 4) + compressedData + millis + data;
			return{
				fileRecord : newMillis,
				dirRecord : svg,
				compressedObject : directoryEntry
			};
		};
		var _self = {
			/**
			 * @return {?}
			 */
			load : function() {
				throw new Error("Load method is not defined. Is the file jszip-load.js included ?");
			},
			/**
			 * @param {Function} pred
			 * @return {?}
			 */
			filter : function(pred) {
				var filename;
				var node;
				var file;
				var key;
				/** @type {Array} */
				var res = [];
				for (filename in this.files) {
					if (this.files.hasOwnProperty(filename)) {
						file = this.files[filename];
						key = new ZipObject(file.name, file._data, extend(file.options));
						/** @type {string} */
						node = filename.slice(this.root.length, filename.length);
						if (filename.slice(0, this.root.length) === this.root) {
							if (pred(node, key)) {
								res.push(key);
							}
						}
					}
				}
				return res;
			},
			/**
			 * @param {string} name
			 * @param {?} data
			 * @param {?} o
			 * @return {?}
			 */
			file : function(name, data, o) {
				if (1 === arguments.length) {
					if (self.isRegExp(name)) {
						/** @type {string} */
						var rchecked = name;
						return this.filter(function(value, html) {
							return!html.dir && rchecked.test(value);
						});
					}
					return this.filter(function(relativePath, html) {
							return!html.dir && relativePath === name;
						})[0] || null;
				}
				return name = this.root + name, fileAdd.call(this, name, data, o), this;
			},
			/**
			 * @param {Object} arg
			 * @return {?}
			 */
			folder : function(arg) {
				if (!arg) {
					return this;
				}
				if (self.isRegExp(arg)) {
					return this.filter(function(b, a) {
						return a.dir && arg.test(b);
					});
				}
				var item = this.root + arg;
				var group = process.call(this, item);
				var entity = this.clone();
				return entity.root = group.name, entity;
			},
			/**
			 * @param {string} name
			 * @return {?}
			 */
			remove : function(name) {
				name = this.root + name;
				var file = this.files[name];
				if (file || ("/" != name.slice(-1) && (name += "/"), file = this.files[name]), file && !file.dir) {
					delete this.files[name];
				} else {
					var codeSegments = this.filter(function(dataAndEvents, file) {
						return file.name.slice(0, name.length) === name;
					});
					/** @type {number} */
					var i = 0;
					for (;i < codeSegments.length;i++) {
						delete this.files[codeSegments[i].name];
					}
				}
				return this;
			},
			/**
			 * @param {Object} options
			 * @return {?}
			 */
			generate : function(options) {
				options = extend(options || {}, {
					base64 : true,
					compression : "STORE",
					type : "base64",
					comment : null
				});
				self.checkSupport(options.type);
				var client;
				var i;
				/** @type {Array} */
				var codeSegments = [];
				/** @type {number} */
				var a = 0;
				/** @type {number} */
				var b = 0;
				var data = self.transformTo("string", this.utf8encode(options.comment || (this.comment || "")));
				var filename;
				for (filename in this.files) {
					if (this.files.hasOwnProperty(filename)) {
						var file = this.files[filename];
						var id = file.options.compression || options.compression.toUpperCase();
						var wrapper = registry[id];
						if (!wrapper) {
							throw new Error(id + " is not a valid compression method !");
						}
						var text = onEnd.call(this, file, wrapper);
						var url = prepareLocalHeaderData.call(this, filename, file, text, a);
						a += url.fileRecord.length + text.compressedSize;
						b += url.dirRecord.length;
						codeSegments.push(url);
					}
				}
				/** @type {string} */
				var msgs = "";
				/** @type {string} */
				msgs = nodes.CENTRAL_DIRECTORY_END + "\x00\x00\x00\x00" + decToHex(codeSegments.length, 2) + decToHex(codeSegments.length, 2) + decToHex(b, 4) + decToHex(a, 4) + decToHex(data.length, 2) + data;
				var type = options.type.toLowerCase();
				client = "uint8array" === type || ("arraybuffer" === type || ("blob" === type || "nodebuffer" === type)) ? new Session(a + b + msgs.length) : new helper(a + b + msgs.length);
				/** @type {number} */
				i = 0;
				for (;i < codeSegments.length;i++) {
					client.append(codeSegments[i].fileRecord);
					client.append(codeSegments[i].compressedObject.compressedContent);
				}
				/** @type {number} */
				i = 0;
				for (;i < codeSegments.length;i++) {
					client.append(codeSegments[i].dirRecord);
				}
				client.append(msgs);
				var value = client.finalize();
				switch(options.type.toLowerCase()) {
					case "uint8array":
						;
					case "arraybuffer":
						;
					case "nodebuffer":
						return self.transformTo(options.type.toLowerCase(), value);
					case "blob":
						return self.arrayBuffer2Blob(self.transformTo("arraybuffer", value));
					case "base64":
						return options.base64 ? _.encode(value) : value;
					default:
						return value;
				}
			},
			/**
			 * @param {?} data
			 * @param {?} crc
			 * @return {?}
			 */
			crc32 : function(data, crc) {
				return crc32(data, crc);
			},
			/**
			 * @param {?} result
			 * @return {?}
			 */
			utf8encode : function(result) {
				return self.transformTo("string", assert.utf8encode(result));
			},
			/**
			 * @param {string} result
			 * @return {?}
			 */
			utf8decode : function(result) {
				return assert.utf8decode(result);
			}
		};
		module.exports = _self;
	}, {
		"./base64" : 15,
		"./compressedObject" : 16,
		"./compressions" : 17,
		"./crc32" : 18,
		"./defaults" : 20,
		"./nodeBuffer" : 25,
		"./signature" : 28,
		"./stringWriter" : 30,
		"./support" : 31,
		"./uint8ArrayWriter" : 33,
		"./utf8" : 34,
		"./utils" : 35
	}],
	28 : [function(deepDataAndEvents, ignoreMethodDoesntExist, dataAndEvents) {
		/** @type {string} */
		dataAndEvents.LOCAL_FILE_HEADER = "PK\u0003\u0004";
		/** @type {string} */
		dataAndEvents.CENTRAL_FILE_HEADER = "PK\u0001\u0002";
		/** @type {string} */
		dataAndEvents.CENTRAL_DIRECTORY_END = "PK\u0005\u0006";
		/** @type {string} */
		dataAndEvents.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\u0006\u0007";
		/** @type {string} */
		dataAndEvents.ZIP64_CENTRAL_DIRECTORY_END = "PK\u0006\u0006";
		/** @type {string} */
		dataAndEvents.DATA_DESCRIPTOR = "PK\u0007\b";
	}, {}],
	29 : [function(fragment, module) {
		/**
		 * @param {string} data
		 * @param {?} optimizedBinaryString
		 * @return {undefined}
		 */
		function StringReader(data, optimizedBinaryString) {
			/** @type {string} */
			this.data = data;
			if (!optimizedBinaryString) {
				this.data = el.string2binary(this.data);
			}
			this.length = this.data.length;
			/** @type {number} */
			this.index = 0;
		}
		var f = fragment("./dataReader");
		var el = fragment("./utils");
		StringReader.prototype = new f;
		/**
		 * @param {?} i
		 * @return {?}
		 */
		StringReader.prototype.byteAt = function(i) {
			return this.data.charCodeAt(i);
		};
		/**
		 * @param {?} sig
		 * @return {?}
		 */
		StringReader.prototype.lastIndexOfSignature = function(sig) {
			return this.data.lastIndexOf(sig);
		};
		/**
		 * @param {number} size
		 * @return {?}
		 */
		StringReader.prototype.readData = function(size) {
			this.checkOffset(size);
			var index = this.data.slice(this.index, this.index + size);
			return this.index += size, index;
		};
		/** @type {function (string, ?): undefined} */
		module.exports = StringReader;
	}, {
		"./dataReader" : 19,
		"./utils" : 35
	}],
	30 : [function(require, module) {
		var Handlebars = require("./utils");
		/**
		 * @return {undefined}
		 */
		var Type = function() {
			/** @type {Array} */
			this.data = [];
		};
		Type.prototype = {
			/**
			 * @param {string} data
			 * @return {undefined}
			 */
			append : function(data) {
				data = Handlebars.transformTo("string", data);
				this.data.push(data);
			},
			/**
			 * @return {?}
			 */
			finalize : function() {
				return this.data.join("");
			}
		};
		/** @type {function (): undefined} */
		module.exports = Type;
	}, {
		"./utils" : 35
	}],
	31 : [function(require, dataAndEvents, data) {
		(function(exports) {
			if (data.base64 = true, data.array = true, data.string = true, data.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, data.nodebuffer = "undefined" != typeof exports, data.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) {
				/** @type {boolean} */
				data.blob = false;
			} else {
				/** @type {ArrayBuffer} */
				var buffer = new ArrayBuffer(0);
				try {
					/** @type {boolean} */
					data.blob = 0 === (new Blob([buffer], {
						type : "application/zip"
					})).size;
				} catch (r) {
					try {
						var WebKitBlobBuilder = window.BlobBuilder || (window.WebKitBlobBuilder || (window.MozBlobBuilder || window.MSBlobBuilder));
						/** @type {BlobBuilder} */
						var builder = new WebKitBlobBuilder;
						builder.append(buffer);
						/** @type {boolean} */
						data.blob = 0 === builder.getBlob("application/zip").size;
					} catch (r) {
						/** @type {boolean} */
						data.blob = false;
					}
				}
			}
		}).call(this, require("buffer").Buffer);
	}, {
		buffer : 12
	}],
	32 : [function(require, module) {
		/**
		 * @param {string} data
		 * @return {undefined}
		 */
		function Uint8ArrayReader(data) {
			if (data) {
				/** @type {string} */
				this.data = data;
				this.length = this.data.length;
				/** @type {number} */
				this.index = 0;
			}
		}
		var Node = require("./dataReader");
		Uint8ArrayReader.prototype = new Node;
		/**
		 * @param {?} i
		 * @return {?}
		 */
		Uint8ArrayReader.prototype.byteAt = function(i) {
			return this.data[i];
		};
		/**
		 * @param {string} sig
		 * @return {?}
		 */
		Uint8ArrayReader.prototype.lastIndexOfSignature = function(sig) {
			var sig0 = sig.charCodeAt(0);
			var sig2 = sig.charCodeAt(1);
			var sig3 = sig.charCodeAt(2);
			var sig1 = sig.charCodeAt(3);
			/** @type {number} */
			var i = this.length - 4;
			for (;i >= 0;--i) {
				if (this.data[i] === sig0 && (this.data[i + 1] === sig2 && (this.data[i + 2] === sig3 && this.data[i + 3] === sig1))) {
					return i;
				}
			}
			return-1;
		};
		/**
		 * @param {number} size
		 * @return {?}
		 */
		Uint8ArrayReader.prototype.readData = function(size) {
			if (this.checkOffset(size), 0 === size) {
				return new Uint8Array(0);
			}
			var index = this.data.subarray(this.index, this.index + size);
			return this.index += size, index;
		};
		/** @type {function (string): undefined} */
		module.exports = Uint8ArrayReader;
	}, {
		"./dataReader" : 19
	}],
	33 : [function(require, module) {
		var helper = require("./utils");
		/**
		 * @param {?} data
		 * @return {undefined}
		 */
		var init = function(data) {
			/** @type {Uint8Array} */
			this.data = new Uint8Array(data);
			/** @type {number} */
			this.index = 0;
		};
		init.prototype = {
			/**
			 * @param {string} data
			 * @return {undefined}
			 */
			append : function(data) {
				if (0 !== data.length) {
					data = helper.transformTo("uint8array", data);
					this.data.set(data, this.index);
					this.index += data.length;
				}
			},
			/**
			 * @return {?}
			 */
			finalize : function() {
				return this.data;
			}
		};
		/** @type {function (?): undefined} */
		module.exports = init;
	}, {
		"./utils" : 35
	}],
	34 : [function(require, deepDataAndEvents, dataAndEvents) {
		var $ = require("./utils");
		var self = require("./support");
		var next = require("./nodeBuffer");
		/** @type {Array} */
		var elements = new Array(256);
		/** @type {number} */
		var liveCount = 0;
		for (;256 > liveCount;liveCount++) {
			/** @type {number} */
			elements[liveCount] = liveCount >= 252 ? 6 : liveCount >= 248 ? 5 : liveCount >= 240 ? 4 : liveCount >= 224 ? 3 : liveCount >= 192 ? 2 : 1;
		}
		/** @type {number} */
		elements[254] = elements[254] = 1;
		/**
		 * @param {string} a
		 * @return {?}
		 */
		var diff = function(a) {
			var result;
			var digit;
			var r;
			var i;
			var index;
			var l = a.length;
			/** @type {number} */
			var length = 0;
			/** @type {number} */
			i = 0;
			for (;l > i;i++) {
				digit = a.charCodeAt(i);
				if (55296 === (64512 & digit)) {
					if (l > i + 1) {
						r = a.charCodeAt(i + 1);
						if (56320 === (64512 & r)) {
							/** @type {number} */
							digit = 65536 + (digit - 55296 << 10) + (r - 56320);
							i++;
						}
					}
				}
				length += 128 > digit ? 1 : 2048 > digit ? 2 : 65536 > digit ? 3 : 4;
			}
			/** @type {(Array|Uint8Array)} */
			result = self.uint8array ? new Uint8Array(length) : new Array(length);
			/** @type {number} */
			index = 0;
			/** @type {number} */
			i = 0;
			for (;length > index;i++) {
				digit = a.charCodeAt(i);
				if (55296 === (64512 & digit)) {
					if (l > i + 1) {
						r = a.charCodeAt(i + 1);
						if (56320 === (64512 & r)) {
							/** @type {number} */
							digit = 65536 + (digit - 55296 << 10) + (r - 56320);
							i++;
						}
					}
				}
				if (128 > digit) {
					result[index++] = digit;
				} else {
					if (2048 > digit) {
						/** @type {number} */
						result[index++] = 192 | digit >>> 6;
						/** @type {number} */
						result[index++] = 128 | 63 & digit;
					} else {
						if (65536 > digit) {
							/** @type {number} */
							result[index++] = 224 | digit >>> 12;
							/** @type {number} */
							result[index++] = 128 | digit >>> 6 & 63;
							/** @type {number} */
							result[index++] = 128 | 63 & digit;
						} else {
							/** @type {number} */
							result[index++] = 240 | digit >>> 18;
							/** @type {number} */
							result[index++] = 128 | digit >>> 12 & 63;
							/** @type {number} */
							result[index++] = 128 | digit >>> 6 & 63;
							/** @type {number} */
							result[index++] = 128 | 63 & digit;
						}
					}
				}
			}
			return result;
		};
		/**
		 * @param {Arguments} array
		 * @param {number} max
		 * @return {?}
		 */
		var sortedIndex = function(array, max) {
			var min;
			max = max || array.length;
			if (max > array.length) {
				max = array.length;
			}
			/** @type {number} */
			min = max - 1;
			for (;min >= 0 && 128 === (192 & array[min]);) {
				min--;
			}
			return 0 > min ? max : 0 === min ? max : min + elements[array[min]] > max ? min : max;
		};
		/**
		 * @param {(Array|number)} target
		 * @return {?}
		 */
		var project = function(target) {
			var j;
			var i;
			var id;
			var element;
			var jlen = target.length;
			/** @type {Array} */
			var msgs = new Array(2 * jlen);
			/** @type {number} */
			i = 0;
			/** @type {number} */
			j = 0;
			for (;jlen > j;) {
				if (id = target[j++], 128 > id) {
					msgs[i++] = id;
				} else {
					if (element = elements[id], element > 4) {
						/** @type {number} */
						msgs[i++] = 65533;
						j += element - 1;
					} else {
						id &= 2 === element ? 31 : 3 === element ? 15 : 7;
						for (;element > 1 && jlen > j;) {
							/** @type {number} */
							id = id << 6 | 63 & target[j++];
							element--;
						}
						if (element > 1) {
							/** @type {number} */
							msgs[i++] = 65533;
						} else {
							if (65536 > id) {
								msgs[i++] = id;
							} else {
								id -= 65536;
								/** @type {number} */
								msgs[i++] = 55296 | id >> 10 & 1023;
								/** @type {number} */
								msgs[i++] = 56320 | 1023 & id;
							}
						}
					}
				}
			}
			return msgs.length !== i && (msgs.subarray ? msgs = msgs.subarray(0, i) : msgs.length = i), $.applyFromCharCode(msgs);
		};
		/**
		 * @param {?} e
		 * @return {?}
		 */
		dataAndEvents.utf8encode = function(e) {
			return self.nodebuffer ? next(e, "utf-8") : diff(e);
		};
		/**
		 * @param {string} array
		 * @return {?}
		 */
		dataAndEvents.utf8decode = function(array) {
			if (self.nodebuffer) {
				return $.transformTo("nodebuffer", array).toString("utf-8");
			}
			array = $.transformTo(self.uint8array ? "uint8array" : "array", array);
			/** @type {Array} */
			var tagNameArr = [];
			/** @type {number} */
			var start = 0;
			var high = array.length;
			/** @type {number} */
			var chunkSize = 65536;
			for (;high > start;) {
				var index = sortedIndex(array, Math.min(start + chunkSize, high));
				if (self.uint8array) {
					tagNameArr.push(project(array.subarray(start, index)));
				} else {
					tagNameArr.push(project(array.slice(start, index)));
				}
				start = index;
			}
			return tagNameArr.join("");
		};
	}, {
		"./nodeBuffer" : 25,
		"./support" : 31,
		"./utils" : 35
	}],
	35 : [function(require, dataAndEvents, util) {
		/**
		 * @param {(Object|number)} data
		 * @return {?}
		 */
		function dataAttr(data) {
			return data;
		}
		/**
		 * @param {(Object|number)} d
		 * @param {Array} results
		 * @return {?}
		 */
		function find(d, results) {
			/** @type {number} */
			var i = 0;
			for (;i < d.length;++i) {
				/** @type {number} */
				results[i] = 255 & d.charCodeAt(i);
			}
			return results;
		}
		/**
		 * @param {Object} data
		 * @return {?}
		 */
		function parse(data) {
			/** @type {number} */
			var end = 65536;
			/** @type {Array} */
			var tagNameArr = [];
			var i = data.length;
			var type = util.getTypeOf(data);
			/** @type {number} */
			var start = 0;
			/** @type {boolean} */
			var o = true;
			try {
				switch(type) {
					case "uint8array":
						String.fromCharCode.apply(null, new Uint8Array(0));
						break;
					case "nodebuffer":
						String.fromCharCode.apply(null, callback(0));
				}
			} catch (l) {
				/** @type {boolean} */
				o = false;
			}
			if (!o) {
				/** @type {string} */
				var resp = "";
				/** @type {number} */
				var dataIndex = 0;
				for (;dataIndex < data.length;dataIndex++) {
					resp += String.fromCharCode(data[dataIndex]);
				}
				return resp;
			}
			for (;i > start && end > 1;) {
				try {
					if ("array" === type || "nodebuffer" === type) {
						tagNameArr.push(String.fromCharCode.apply(null, data.slice(start, Math.min(start + end, i))));
					} else {
						tagNameArr.push(String.fromCharCode.apply(null, data.subarray(start, Math.min(start + end, i))));
					}
					start += end;
				} catch (l) {
					/** @type {number} */
					end = Math.floor(end / 2);
				}
			}
			return tagNameArr.join("");
		}
		/**
		 * @param {Uint8Array} data
		 * @param {Array} e
		 * @return {?}
		 */
		function validate(data, e) {
			/** @type {number} */
			var i = 0;
			for (;i < data.length;i++) {
				e[i] = data[i];
			}
			return e;
		}
		var global = require("./support");
		var types = require("./compressions");
		var callback = require("./nodeBuffer");
		/**
		 * @param {string} str
		 * @return {?}
		 */
		util.string2binary = function(str) {
			/** @type {string} */
			var optsData = "";
			/** @type {number} */
			var i = 0;
			for (;i < str.length;i++) {
				optsData += String.fromCharCode(255 & str.charCodeAt(i));
			}
			return optsData;
		};
		/**
		 * @param {string} a
		 * @return {?}
		 */
		util.arrayBuffer2Blob = function(a) {
			util.checkSupport("blob");
			try {
				return new Blob([a], {
					type : "application/zip"
				});
			} catch (e) {
				try {
					var WebKitBlobBuilder = window.BlobBuilder || (window.WebKitBlobBuilder || (window.MozBlobBuilder || window.MSBlobBuilder));
					/** @type {BlobBuilder} */
					var builder = new WebKitBlobBuilder;
					return builder.append(a), builder.getBlob("application/zip");
				} catch (e) {
					throw new Error("Bug : can't construct the Blob.");
				}
			}
		};
		/** @type {function (Object): ?} */
		util.applyFromCharCode = parse;
		var $scope = {};
		$scope.string = {
			/** @type {function ((Object|number)): ?} */
			string : dataAttr,
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			array : function(data) {
				return find(data, new Array(data.length));
			},
			/**
			 * @param {(Object|number)} msgs
			 * @return {?}
			 */
			arraybuffer : function(msgs) {
				return $scope.string.uint8array(msgs).buffer;
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			uint8array : function(data) {
				return find(data, new Uint8Array(data.length));
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			nodebuffer : function(data) {
				return find(data, callback(data.length));
			}
		};
		$scope.array = {
			/** @type {function (Object): ?} */
			string : parse,
			/** @type {function ((Object|number)): ?} */
			array : dataAttr,
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			arraybuffer : function(data) {
				return(new Uint8Array(data)).buffer;
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			uint8array : function(data) {
				return new Uint8Array(data);
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			nodebuffer : function(data) {
				return callback(data);
			}
		};
		$scope.arraybuffer = {
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			string : function(data) {
				return parse(new Uint8Array(data));
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			array : function(data) {
				return validate(new Uint8Array(data), new Array(data.byteLength));
			},
			/** @type {function ((Object|number)): ?} */
			arraybuffer : dataAttr,
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			uint8array : function(data) {
				return new Uint8Array(data);
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			nodebuffer : function(data) {
				return callback(new Uint8Array(data));
			}
		};
		$scope.uint8array = {
			/** @type {function (Object): ?} */
			string : parse,
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			array : function(data) {
				return validate(data, new Array(data.length));
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			arraybuffer : function(data) {
				return data.buffer;
			},
			/** @type {function ((Object|number)): ?} */
			uint8array : dataAttr,
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			nodebuffer : function(data) {
				return callback(data);
			}
		};
		$scope.nodebuffer = {
			/** @type {function (Object): ?} */
			string : parse,
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			array : function(data) {
				return validate(data, new Array(data.length));
			},
			/**
			 * @param {(Object|number)} msgs
			 * @return {?}
			 */
			arraybuffer : function(msgs) {
				return $scope.nodebuffer.uint8array(msgs).buffer;
			},
			/**
			 * @param {(Object|number)} data
			 * @return {?}
			 */
			uint8array : function(data) {
				return validate(data, new Uint8Array(data.length));
			},
			/** @type {function ((Object|number)): ?} */
			nodebuffer : dataAttr
		};
		/**
		 * @param {string} data
		 * @param {string} object
		 * @return {?}
		 */
		util.transformTo = function(data, object) {
			if (object || (object = ""), !data) {
				return object;
			}
			util.checkSupport(data);
			var k = util.getTypeOf(object);
			var value = $scope[k][data](object);
			return value;
		};
		/**
		 * @param {?} data
		 * @return {?}
		 */
		util.getTypeOf = function(data) {
			return "string" == typeof data ? "string" : "[object Array]" === Object.prototype.toString.call(data) ? "array" : global.nodebuffer && callback.test(data) ? "nodebuffer" : global.uint8array && data instanceof Uint8Array ? "uint8array" : global.arraybuffer && data instanceof ArrayBuffer ? "arraybuffer" : void 0;
		};
		/**
		 * @param {string} data
		 * @return {undefined}
		 */
		util.checkSupport = function(data) {
			var xobject = global[data.toLowerCase()];
			if (!xobject) {
				throw new Error(data + " is not supported by this browser");
			}
		};
		/** @type {number} */
		util.MAX_VALUE_16BITS = 65535;
		/** @type {number} */
		util.MAX_VALUE_32BITS = -1;
		/**
		 * @param {string} str
		 * @return {?}
		 */
		util.pretty = function(str) {
			var n;
			var i;
			/** @type {string} */
			var optsData = "";
			/** @type {number} */
			i = 0;
			for (;i < (str || "").length;i++) {
				n = str.charCodeAt(i);
				optsData += "\\x" + (16 > n ? "0" : "") + n.toString(16).toUpperCase();
			}
			return optsData;
		};
		/**
		 * @param {?} deepDataAndEvents
		 * @return {?}
		 */
		util.findCompression = function(deepDataAndEvents) {
			var type;
			for (type in types) {
				if (types.hasOwnProperty(type) && types[type].magic === deepDataAndEvents) {
					return types[type];
				}
			}
			return null;
		};
		/**
		 * @param {string} arg
		 * @return {?}
		 */
		util.isRegExp = function(arg) {
			return "[object RegExp]" === Object.prototype.toString.call(arg);
		};
	}, {
		"./compressions" : 17,
		"./nodeBuffer" : 25,
		"./support" : 31
	}],
	36 : [function(require, module) {
		/**
		 * @param {string} data
		 * @param {Object} loadOptions
		 * @return {undefined}
		 */
		function ZipEntries(data, loadOptions) {
			/** @type {Array} */
			this.files = [];
			/** @type {Object} */
			this.loadOptions = loadOptions;
			if (data) {
				this.load(data);
			}
		}
		var StringReader = require("./stringReader");
		var Node = require("./nodeBufferReader");
		var Uint8ArrayReader = require("./uint8ArrayReader");
		var config = require("./utils");
		var Block = require("./signature");
		var ZipEntry = require("./zipEntry");
		var nodes = require("./support");
		var helper = require("./object");
		ZipEntries.prototype = {
			/**
			 * @param {string} param
			 * @return {undefined}
			 */
			checkSignature : function(param) {
				var value = this.reader.readString(4);
				if (value !== param) {
					throw new Error("Corrupted zip or bug : unexpected signature (" + config.pretty(value) + ", expected " + config.pretty(param) + ")");
				}
			},
			/**
			 * @return {undefined}
			 */
			readBlockEndOfCentral : function() {
				this.diskNumber = this.reader.readInt(2);
				this.diskWithCentralDirStart = this.reader.readInt(2);
				this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
				this.centralDirRecords = this.reader.readInt(2);
				this.centralDirSize = this.reader.readInt(4);
				this.centralDirOffset = this.reader.readInt(4);
				this.zipCommentLength = this.reader.readInt(2);
				this.zipComment = this.reader.readString(this.zipCommentLength);
				this.zipComment = helper.utf8decode(this.zipComment);
			},
			/**
			 * @return {undefined}
			 */
			readBlockZip64EndOfCentral : function() {
				this.zip64EndOfCentralSize = this.reader.readInt(8);
				this.versionMadeBy = this.reader.readString(2);
				this.versionNeeded = this.reader.readInt(2);
				this.diskNumber = this.reader.readInt(4);
				this.diskWithCentralDirStart = this.reader.readInt(4);
				this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
				this.centralDirRecords = this.reader.readInt(8);
				this.centralDirSize = this.reader.readInt(8);
				this.centralDirOffset = this.reader.readInt(8);
				this.zip64ExtensibleData = {};
				var extraFieldId;
				var extraFieldLength;
				var extraFieldValue;
				/** @type {number} */
				var a = this.zip64EndOfCentralSize - 44;
				/** @type {number} */
				var b = 0;
				for (;a > b;) {
					extraFieldId = this.reader.readInt(2);
					extraFieldLength = this.reader.readInt(4);
					extraFieldValue = this.reader.readString(extraFieldLength);
					this.zip64ExtensibleData[extraFieldId] = {
						id : extraFieldId,
						length : extraFieldLength,
						value : extraFieldValue
					};
				}
			},
			/**
			 * @return {undefined}
			 */
			readBlockZip64EndOfCentralLocator : function() {
				if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1) {
					throw new Error("Multi-volumes zip are not supported");
				}
			},
			/**
			 * @return {undefined}
			 */
			readLocalFiles : function() {
				var i;
				var file;
				/** @type {number} */
				i = 0;
				for (;i < this.files.length;i++) {
					file = this.files[i];
					this.reader.setIndex(file.localHeaderOffset);
					this.checkSignature(Block.LOCAL_FILE_HEADER);
					file.readLocalPart(this.reader);
					file.handleUTF8();
				}
			},
			/**
			 * @return {undefined}
			 */
			readCentralDir : function() {
				var file;
				this.reader.setIndex(this.centralDirOffset);
				for (;this.reader.readString(4) === Block.CENTRAL_FILE_HEADER;) {
					file = new ZipEntry({
						zip64 : this.zip64
					}, this.loadOptions);
					file.readCentralPart(this.reader);
					this.files.push(file);
				}
			},
			/**
			 * @return {undefined}
			 */
			readEndOfCentral : function() {
				var offset = this.reader.lastIndexOfSignature(Block.CENTRAL_DIRECTORY_END);
				if (-1 === offset) {
					throw new Error("Corrupted zip : can't find end of central directory");
				}
				if (this.reader.setIndex(offset), this.checkSignature(Block.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === config.MAX_VALUE_16BITS || (this.diskWithCentralDirStart === config.MAX_VALUE_16BITS || (this.centralDirRecordsOnThisDisk === config.MAX_VALUE_16BITS || (this.centralDirRecords === config.MAX_VALUE_16BITS || (this.centralDirSize === config.MAX_VALUE_32BITS || this.centralDirOffset === config.MAX_VALUE_32BITS))))) {
					if (this.zip64 = true, offset = this.reader.lastIndexOfSignature(Block.ZIP64_CENTRAL_DIRECTORY_LOCATOR), -1 === offset) {
						throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
					}
					this.reader.setIndex(offset);
					this.checkSignature(Block.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
					this.readBlockZip64EndOfCentralLocator();
					this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
					this.checkSignature(Block.ZIP64_CENTRAL_DIRECTORY_END);
					this.readBlockZip64EndOfCentral();
				}
			},
			/**
			 * @param {string} data
			 * @return {undefined}
			 */
			prepareReader : function(data) {
				var newState = config.getTypeOf(data);
				this.reader = "string" !== newState || nodes.uint8array ? "nodebuffer" === newState ? new Node(data) : new Uint8ArrayReader(config.transformTo("uint8array", data)) : new StringReader(data, this.loadOptions.optimizedBinaryString);
			},
			/**
			 * @param {string} data
			 * @return {undefined}
			 */
			load : function(data) {
				this.prepareReader(data);
				this.readEndOfCentral();
				this.readCentralDir();
				this.readLocalFiles();
			}
		};
		/** @type {function (string, Object): undefined} */
		module.exports = ZipEntries;
	}, {
		"./nodeBufferReader" : 26,
		"./object" : 27,
		"./signature" : 28,
		"./stringReader" : 29,
		"./support" : 31,
		"./uint8ArrayReader" : 32,
		"./utils" : 35,
		"./zipEntry" : 37
	}],
	37 : [function(require, module) {
		/**
		 * @param {Object} options
		 * @param {Object} loadOptions
		 * @return {undefined}
		 */
		function ZipEntry(options, loadOptions) {
			/** @type {Object} */
			this.options = options;
			/** @type {Object} */
			this.loadOptions = loadOptions;
		}
		var Range = require("./stringReader");
		var Handlebars = require("./utils");
		var Block = require("./compressedObject");
		var utils = require("./object");
		ZipEntry.prototype = {
			/**
			 * @return {?}
			 */
			isEncrypted : function() {
				return 1 === (1 & this.bitFlag);
			},
			/**
			 * @return {?}
			 */
			useUTF8 : function() {
				return 2048 === (2048 & this.bitFlag);
			},
			/**
			 * @param {Object} reader
			 * @param {number} from
			 * @param {number} length
			 * @return {?}
			 */
			prepareCompressedContent : function(reader, from, length) {
				return function() {
					var previousIndex = reader.index;
					reader.setIndex(from);
					var len = reader.readData(length);
					return reader.setIndex(previousIndex), len;
				};
			},
			/**
			 * @param {Object} reader
			 * @param {?} from
			 * @param {?} dataAndEvents
			 * @param {?} compression
			 * @param {?} uncompressedSize
			 * @return {?}
			 */
			prepareContent : function(reader, from, dataAndEvents, compression, uncompressedSize) {
				return function() {
					var data = Handlebars.transformTo(compression.uncompressInputType, this.getCompressedContent());
					var uncompressedFileData = compression.uncompress(data);
					if (uncompressedFileData.length !== uncompressedSize) {
						throw new Error("Bug : uncompressed data size mismatch");
					}
					return uncompressedFileData;
				};
			},
			/**
			 * @param {Object} reader
			 * @return {undefined}
			 */
			readLocalPart : function(reader) {
				var compression;
				var localExtraFieldsLength;
				if (reader.skip(22), this.fileNameLength = reader.readInt(2), localExtraFieldsLength = reader.readInt(2), this.fileName = reader.readString(this.fileNameLength), reader.skip(localExtraFieldsLength), -1 == this.compressedSize || -1 == this.uncompressedSize) {
					throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");
				}
				if (compression = Handlebars.findCompression(this.compressionMethod), null === compression) {
					throw new Error("Corrupted zip : compression " + Handlebars.pretty(this.compressionMethod) + " unknown (inner file : " + this.fileName + ")");
				}
				if (this.decompressed = new Block, this.decompressed.compressedSize = this.compressedSize, this.decompressed.uncompressedSize = this.uncompressedSize, this.decompressed.crc32 = this.crc32, this.decompressed.compressionMethod = this.compressionMethod, this.decompressed.getCompressedContent = this.prepareCompressedContent(reader, reader.index, this.compressedSize, compression), this.decompressed.getContent = this.prepareContent(reader, reader.index, this.compressedSize, compression, this.uncompressedSize),
					this.loadOptions.checkCRC32 && (this.decompressed = Handlebars.transformTo("string", this.decompressed.getContent()), utils.crc32(this.decompressed) !== this.crc32)) {
					throw new Error("Corrupted zip : CRC32 mismatch");
				}
			},
			/**
			 * @param {Object} reader
			 * @return {undefined}
			 */
			readCentralPart : function(reader) {
				if (this.versionMadeBy = reader.readString(2), this.versionNeeded = reader.readInt(2), this.bitFlag = reader.readInt(2), this.compressionMethod = reader.readString(2), this.date = reader.readDate(), this.crc32 = reader.readInt(4), this.compressedSize = reader.readInt(4), this.uncompressedSize = reader.readInt(4), this.fileNameLength = reader.readInt(2), this.extraFieldsLength = reader.readInt(2), this.fileCommentLength = reader.readInt(2), this.diskNumberStart = reader.readInt(2), this.internalFileAttributes =
						reader.readInt(2), this.externalFileAttributes = reader.readInt(4), this.localHeaderOffset = reader.readInt(4), this.isEncrypted()) {
					throw new Error("Encrypted zip are not supported");
				}
				this.fileName = reader.readString(this.fileNameLength);
				this.readExtraFields(reader);
				this.parseZIP64ExtraField(reader);
				this.fileComment = reader.readString(this.fileCommentLength);
				/** @type {boolean} */
				this.dir = 16 & this.externalFileAttributes ? true : false;
			},
			/**
			 * @return {undefined}
			 */
			parseZIP64ExtraField : function() {
				if (this.extraFields[1]) {
					var deleteRange = new Range(this.extraFields[1].value);
					if (this.uncompressedSize === Handlebars.MAX_VALUE_32BITS) {
						this.uncompressedSize = deleteRange.readInt(8);
					}
					if (this.compressedSize === Handlebars.MAX_VALUE_32BITS) {
						this.compressedSize = deleteRange.readInt(8);
					}
					if (this.localHeaderOffset === Handlebars.MAX_VALUE_32BITS) {
						this.localHeaderOffset = deleteRange.readInt(8);
					}
					if (this.diskNumberStart === Handlebars.MAX_VALUE_32BITS) {
						this.diskNumberStart = deleteRange.readInt(4);
					}
				}
			},
			/**
			 * @param {Object} reader
			 * @return {undefined}
			 */
			readExtraFields : function(reader) {
				var extraFieldId;
				var extraFieldLength;
				var extraFieldValue;
				var start = reader.index;
				this.extraFields = this.extraFields || {};
				for (;reader.index < start + this.extraFieldsLength;) {
					extraFieldId = reader.readInt(2);
					extraFieldLength = reader.readInt(2);
					extraFieldValue = reader.readString(extraFieldLength);
					this.extraFields[extraFieldId] = {
						id : extraFieldId,
						length : extraFieldLength,
						value : extraFieldValue
					};
				}
			},
			/**
			 * @return {undefined}
			 */
			handleUTF8 : function() {
				if (this.useUTF8()) {
					this.fileName = utils.utf8decode(this.fileName);
					this.fileComment = utils.utf8decode(this.fileComment);
				} else {
					var file = this.findExtraFieldUnicodePath();
					if (null !== file) {
						this.fileName = file;
					}
					var fileComment = this.findExtraFieldUnicodeComment();
					if (null !== fileComment) {
						this.fileComment = fileComment;
					}
				}
			},
			/**
			 * @return {?}
			 */
			findExtraFieldUnicodePath : function() {
				var highlight = this.extraFields[28789];
				if (highlight) {
					var ber = new Range(highlight.value);
					return 1 !== ber.readInt(1) ? null : utils.crc32(this.fileName) !== ber.readInt(4) ? null : utils.utf8decode(ber.readString(highlight.length - 5));
				}
				return null;
			},
			/**
			 * @return {?}
			 */
			findExtraFieldUnicodeComment : function() {
				var highlight = this.extraFields[25461];
				if (highlight) {
					var ber = new Range(highlight.value);
					return 1 !== ber.readInt(1) ? null : utils.crc32(this.fileComment) !== ber.readInt(4) ? null : utils.utf8decode(ber.readString(highlight.length - 5));
				}
				return null;
			}
		};
		/** @type {function (Object, Object): undefined} */
		module.exports = ZipEntry;
	}, {
		"./compressedObject" : 16,
		"./object" : 27,
		"./stringReader" : 29,
		"./utils" : 35
	}],
	38 : [function(proceed, module) {
		var setter = proceed("./lib/utils/common").assign;
		var value = proceed("./lib/deflate");
		var executor = proceed("./lib/inflate");
		var r20 = proceed("./lib/zlib/constants");
		var prop = {};
		setter(prop, value, executor, r20);
		module.exports = prop;
	}, {
		"./lib/deflate" : 39,
		"./lib/inflate" : 40,
		"./lib/utils/common" : 41,
		"./lib/zlib/constants" : 44
	}],
	39 : [function(require, dataAndEvents, exports) {
		/**
		 * @param {Array} msg
		 * @param {string} data
		 * @return {?}
		 */
		function error(msg, data) {
			var r = new Request(data);
			if (r.push(msg, true), r.err) {
				throw r.msg;
			}
			return r.result;
		}
		/**
		 * @param {?} result
		 * @param {Object} data
		 * @return {?}
		 */
		function send(result, data) {
			return data = data || {}, data.raw = true, error(result, data);
		}
		/**
		 * @param {Object} e
		 * @param {Object} type
		 * @return {?}
		 */
		function reset(e, type) {
			return type = type || {}, type.gzip = true, error(e, type);
		}
		var event = require("./zlib/deflate.js");
		var self = require("./utils/common");
		var list = require("./utils/strings");
		var helper = require("./zlib/messages");
		var Block = require("./zlib/zstream");
		/** @type {number} */
		var middle = 0;
		/** @type {number} */
		var last = 4;
		/** @type {number} */
		var y = 0;
		/** @type {number} */
		var nil = 1;
		/** @type {number} */
		var level = -1;
		/** @type {number} */
		var strategy = 0;
		/** @type {number} */
		var method = 8;
		/**
		 * @param {Object} err
		 * @return {undefined}
		 */
		var Request = function(err) {
			this.options = self.assign({
				level : level,
				method : method,
				chunkSize : 16384,
				windowBits : 15,
				memLevel : 8,
				strategy : strategy,
				to : ""
			}, err || {});
			var opts = this.options;
			if (opts.raw && opts.windowBits > 0) {
				/** @type {number} */
				opts.windowBits = -opts.windowBits;
			} else {
				if (opts.gzip) {
					if (opts.windowBits > 0) {
						if (opts.windowBits < 16) {
							opts.windowBits += 16;
						}
					}
				}
			}
			/** @type {number} */
			this.err = 0;
			/** @type {string} */
			this.msg = "";
			/** @type {boolean} */
			this.ended = false;
			/** @type {Array} */
			this.chunks = [];
			this.strm = new Block;
			/** @type {number} */
			this.strm.avail_out = 0;
			var key = event.deflateInit2(this.strm, opts.level, opts.method, opts.windowBits, opts.memLevel, opts.strategy);
			if (key !== y) {
				throw new Error(helper[key]);
			}
			if (opts.header) {
				event.deflateSetHeader(this.strm, opts.header);
			}
		};
		/**
		 * @param {(Array|number)} arg
		 * @param {number} index
		 * @return {?}
		 */
		Request.prototype.push = function(arg, index) {
			var x;
			var type;
			var that = this.strm;
			var data = this.options.chunkSize;
			if (this.ended) {
				return false;
			}
			type = index === ~~index ? index : index === true ? last : middle;
			that.input = "string" == typeof arg ? list.string2buf(arg) : arg;
			/** @type {number} */
			that.next_in = 0;
			that.avail_in = that.input.length;
			do {
				if (0 === that.avail_out && (that.output = new self.Buf8(data), that.next_out = 0, that.avail_out = data), x = event.deflate(that, type), x !== nil && x !== y) {
					return this.onEnd(x), this.ended = true, false;
				}
				if (0 === that.avail_out || 0 === that.avail_in && type === last) {
					if ("string" === this.options.to) {
						this.onData(list.buf2binstring(self.shrinkBuf(that.output, that.next_out)));
					} else {
						this.onData(self.shrinkBuf(that.output, that.next_out));
					}
				}
			} while ((that.avail_in > 0 || 0 === that.avail_out) && x !== nil);
			return type === last ? (x = event.deflateEnd(this.strm), this.onEnd(x), this.ended = true, x === y) : true;
		};
		/**
		 * @param {(Array|number)} data
		 * @return {undefined}
		 */
		Request.prototype.onData = function(data) {
			this.chunks.push(data);
		};
		/**
		 * @param {number} x
		 * @return {undefined}
		 */
		Request.prototype.onEnd = function(x) {
			if (x === y) {
				this.result = "string" === this.options.to ? this.chunks.join("") : self.flattenChunks(this.chunks);
			}
			/** @type {Array} */
			this.chunks = [];
			/** @type {number} */
			this.err = x;
			this.msg = this.strm.msg;
		};
		/** @type {function (Object): undefined} */
		exports.Deflate = Request;
		/** @type {function (Array, string): ?} */
		exports.deflate = error;
		/** @type {function (?, Object): ?} */
		exports.deflateRaw = send;
		/** @type {function (Object, Object): ?} */
		exports.gzip = reset;
	}, {
		"./utils/common" : 41,
		"./utils/strings" : 42,
		"./zlib/deflate.js" : 46,
		"./zlib/messages" : 51,
		"./zlib/zstream" : 53
	}],
	40 : [function(require, dataAndEvents, state) {
		/**
		 * @param {Array} msg
		 * @param {string} options
		 * @return {?}
		 */
		function error(msg, options) {
			var r = new Request(options);
			if (r.push(msg, true), r.err) {
				throw r.msg;
			}
			return r.result;
		}
		/**
		 * @param {?} e
		 * @param {Object} type
		 * @return {?}
		 */
		function handler(e, type) {
			return type = type || {}, type.raw = true, error(e, type);
		}
		var target = require("./zlib/inflate.js");
		var fs = require("./utils/common");
		var self = require("./utils/strings");
		var types = require("./zlib/constants");
		var errorCodes = require("./zlib/messages");
		var Block = require("./zlib/zstream");
		var Header = require("./zlib/gzheader");
		/**
		 * @param {number} opts
		 * @return {undefined}
		 */
		var Request = function(opts) {
			this.options = fs.assign({
				chunkSize : 16384,
				windowBits : 0,
				to : ""
			}, opts || {});
			var options = this.options;
			if (options.raw) {
				if (options.windowBits >= 0) {
					if (options.windowBits < 16) {
						/** @type {number} */
						options.windowBits = -options.windowBits;
						if (0 === options.windowBits) {
							/** @type {number} */
							options.windowBits = -15;
						}
					}
				}
			}
			if (!!(options.windowBits >= 0 && options.windowBits < 16)) {
				if (!(opts && opts.windowBits)) {
					options.windowBits += 32;
				}
			}
			if (options.windowBits > 15) {
				if (options.windowBits < 48) {
					if (0 === (15 & options.windowBits)) {
						options.windowBits |= 15;
					}
				}
			}
			/** @type {number} */
			this.err = 0;
			/** @type {string} */
			this.msg = "";
			/** @type {boolean} */
			this.ended = false;
			/** @type {Array} */
			this.chunks = [];
			this.strm = new Block;
			/** @type {number} */
			this.strm.avail_out = 0;
			var ec = target.inflateInit2(this.strm, options.windowBits);
			if (ec !== types.Z_OK) {
				throw new Error(errorCodes[ec]);
			}
			this.header = new Header;
			target.inflateGetHeader(this.strm, this.header);
		};
		/**
		 * @param {(Array|number)} arg
		 * @param {boolean} dataAndEvents
		 * @return {?}
		 */
		Request.prototype.push = function(arg, dataAndEvents) {
			var c;
			var i;
			var position;
			var size;
			var pdataCur;
			var that = this.strm;
			var y = this.options.chunkSize;
			if (this.ended) {
				return false;
			}
			i = dataAndEvents === ~~dataAndEvents ? dataAndEvents : dataAndEvents === true ? types.Z_FINISH : types.Z_NO_FLUSH;
			that.input = "string" == typeof arg ? self.binstring2buf(arg) : arg;
			/** @type {number} */
			that.next_in = 0;
			that.avail_in = that.input.length;
			do {
				if (0 === that.avail_out && (that.output = new fs.Buf8(y), that.next_out = 0, that.avail_out = y), c = target.inflate(that, types.Z_NO_FLUSH), c !== types.Z_STREAM_END && c !== types.Z_OK) {
					return this.onEnd(c), this.ended = true, false;
				}
				if (that.next_out) {
					if (0 === that.avail_out || (c === types.Z_STREAM_END || 0 === that.avail_in && i === types.Z_FINISH)) {
						if ("string" === this.options.to) {
							position = self.utf8border(that.output, that.next_out);
							/** @type {number} */
							size = that.next_out - position;
							pdataCur = self.buf2string(that.output, position);
							/** @type {number} */
							that.next_out = size;
							/** @type {number} */
							that.avail_out = y - size;
							if (size) {
								fs.arraySet(that.output, that.output, position, size, 0);
							}
							this.onData(pdataCur);
						} else {
							this.onData(fs.shrinkBuf(that.output, that.next_out));
						}
					}
				}
			} while (that.avail_in > 0 && c !== types.Z_STREAM_END);
			return c === types.Z_STREAM_END && (i = types.Z_FINISH), i === types.Z_FINISH ? (c = target.inflateEnd(this.strm), this.onEnd(c), this.ended = true, c === types.Z_OK) : true;
		};
		/**
		 * @param {(Array|number)} data
		 * @return {undefined}
		 */
		Request.prototype.onData = function(data) {
			this.chunks.push(data);
		};
		/**
		 * @param {number} v00
		 * @return {undefined}
		 */
		Request.prototype.onEnd = function(v00) {
			if (v00 === types.Z_OK) {
				this.result = "string" === this.options.to ? this.chunks.join("") : fs.flattenChunks(this.chunks);
			}
			/** @type {Array} */
			this.chunks = [];
			/** @type {number} */
			this.err = v00;
			this.msg = this.strm.msg;
		};
		/** @type {function (number): undefined} */
		state.Inflate = Request;
		/** @type {function (Array, string): ?} */
		state.inflate = error;
		/** @type {function (?, Object): ?} */
		state.inflateRaw = handler;
		/** @type {function (Array, string): ?} */
		state.ungzip = error;
	}, {
		"./utils/common" : 41,
		"./utils/strings" : 42,
		"./zlib/constants" : 44,
		"./zlib/gzheader" : 47,
		"./zlib/inflate.js" : 49,
		"./zlib/messages" : 51,
		"./zlib/zstream" : 53
	}],
	41 : [function(dataAndEvents, deepDataAndEvents, global) {
		/** @type {boolean} */
		var node = "undefined" != typeof Uint8Array && ("undefined" != typeof Uint16Array && "undefined" != typeof Int32Array);
		/**
		 * @param {Object} object
		 * @return {?}
		 */
		global.assign = function(object) {
			/** @type {Array.<?>} */
			var resolveValues = Array.prototype.slice.call(arguments, 1);
			for (;resolveValues.length;) {
				var iterable = resolveValues.shift();
				if (iterable) {
					if ("object" != typeof iterable) {
						throw new TypeError(iterable + "must be non-object");
					}
					var key;
					for (key in iterable) {
						if (iterable.hasOwnProperty(key)) {
							object[key] = iterable[key];
						}
					}
				}
			}
			return object;
		};
		/**
		 * @param {?} options
		 * @param {number} i
		 * @return {?}
		 */
		global.shrinkBuf = function(options, i) {
			return options.length === i ? options : options.subarray ? options.subarray(0, i) : (options.length = i, options);
		};
		var options = {
			/**
			 * @param {?} array
			 * @param {?} buffer
			 * @param {number} index
			 * @param {number} length
			 * @param {number} start
			 * @return {?}
			 */
			arraySet : function(array, buffer, index, length, start) {
				if (buffer.subarray && array.subarray) {
					return array.set(buffer.subarray(index, index + length), start), void 0;
				}
				/** @type {number} */
				var k = 0;
				for (;length > k;k++) {
					array[start + k] = buffer[index + k];
				}
			},
			/**
			 * @param {Array} buffer
			 * @return {?}
			 */
			flattenChunks : function(buffer) {
				var ndx;
				var savedBytes;
				var bufferSize;
				var i;
				var data;
				var array;
				/** @type {number} */
				bufferSize = 0;
				/** @type {number} */
				ndx = 0;
				savedBytes = buffer.length;
				for (;savedBytes > ndx;ndx++) {
					bufferSize += buffer[ndx].length;
				}
				/** @type {Uint8Array} */
				array = new Uint8Array(bufferSize);
				/** @type {number} */
				i = 0;
				/** @type {number} */
				ndx = 0;
				savedBytes = buffer.length;
				for (;savedBytes > ndx;ndx++) {
					data = buffer[ndx];
					array.set(data, i);
					i += data.length;
				}
				return array;
			}
		};
		var timeToCall = {
			/**
			 * @param {?} d
			 * @param {?} obj
			 * @param {number} name
			 * @param {number} length
			 * @param {number} a
			 * @return {undefined}
			 */
			arraySet : function(d, obj, name, length, a) {
				/** @type {number} */
				var i = 0;
				for (;length > i;i++) {
					d[a + i] = obj[name + i];
				}
			},
			/**
			 * @param {?} checkSet
			 * @return {?}
			 */
			flattenChunks : function(checkSet) {
				return[].concat.apply([], checkSet);
			}
		};
		/**
		 * @param {boolean} dataAndEvents
		 * @return {undefined}
		 */
		global.setTyped = function(dataAndEvents) {
			if (dataAndEvents) {
				/** @type {function (new:Uint8Array, (Array.<number>|ArrayBuffer|ArrayBufferView|null|number), number=, number=): ?} */
				global.Buf8 = Uint8Array;
				/** @type {function (new:Uint16Array, (Array.<number>|ArrayBuffer|ArrayBufferView|null|number), number=, number=): ?} */
				global.Buf16 = Uint16Array;
				/** @type {function (new:Int32Array, (Array.<number>|ArrayBuffer|ArrayBufferView|null|number), number=, number=): ?} */
				global.Buf32 = Int32Array;
				global.assign(global, options);
			} else {
				/** @type {function (new:Array, ...[*]): Array} */
				global.Buf8 = Array;
				/** @type {function (new:Array, ...[*]): Array} */
				global.Buf16 = Array;
				/** @type {function (new:Array, ...[*]): Array} */
				global.Buf32 = Array;
				global.assign(global, timeToCall);
			}
		};
		global.setTyped(node);
	}, {}],
	42 : [function(require, deepDataAndEvents, dataAndEvents) {
		/**
		 * @param {Array} data
		 * @param {number} num
		 * @return {?}
		 */
		function fn(data, num) {
			if (65537 > num && (data.subarray && easing || !data.subarray && speed)) {
				return String.fromCharCode.apply(null, $.shrinkBuf(data, num));
			}
			/** @type {string} */
			var out = "";
			/** @type {number} */
			var dataIndex = 0;
			for (;num > dataIndex;dataIndex++) {
				out += String.fromCharCode(data[dataIndex]);
			}
			return out;
		}
		var $ = require("./common");
		/** @type {boolean} */
		var speed = true;
		/** @type {boolean} */
		var easing = true;
		try {
			String.fromCharCode.apply(null, [0]);
		} catch (o) {
			/** @type {boolean} */
			speed = false;
		}
		try {
			String.fromCharCode.apply(null, new Uint8Array(1));
		} catch (o) {
			/** @type {boolean} */
			easing = false;
		}
		var lines = new $.Buf8(256);
		/** @type {number} */
		var lcv = 0;
		for (;256 > lcv;lcv++) {
			/** @type {number} */
			lines[lcv] = lcv >= 252 ? 6 : lcv >= 248 ? 5 : lcv >= 240 ? 4 : lcv >= 224 ? 3 : lcv >= 192 ? 2 : 1;
		}
		/** @type {number} */
		lines[254] = lines[254] = 1;
		/**
		 * @param {string} template
		 * @return {?}
		 */
		dataAndEvents.string2buf = function(template) {
			var exports;
			var val;
			var r;
			var i;
			var b;
			var len = template.length;
			/** @type {number} */
			var a = 0;
			/** @type {number} */
			i = 0;
			for (;len > i;i++) {
				val = template.charCodeAt(i);
				if (55296 === (64512 & val)) {
					if (len > i + 1) {
						r = template.charCodeAt(i + 1);
						if (56320 === (64512 & r)) {
							/** @type {number} */
							val = 65536 + (val - 55296 << 10) + (r - 56320);
							i++;
						}
					}
				}
				a += 128 > val ? 1 : 2048 > val ? 2 : 65536 > val ? 3 : 4;
			}
			exports = new $.Buf8(a);
			/** @type {number} */
			b = 0;
			/** @type {number} */
			i = 0;
			for (;a > b;i++) {
				val = template.charCodeAt(i);
				if (55296 === (64512 & val)) {
					if (len > i + 1) {
						r = template.charCodeAt(i + 1);
						if (56320 === (64512 & r)) {
							/** @type {number} */
							val = 65536 + (val - 55296 << 10) + (r - 56320);
							i++;
						}
					}
				}
				if (128 > val) {
					exports[b++] = val;
				} else {
					if (2048 > val) {
						/** @type {number} */
						exports[b++] = 192 | val >>> 6;
						/** @type {number} */
						exports[b++] = 128 | 63 & val;
					} else {
						if (65536 > val) {
							/** @type {number} */
							exports[b++] = 224 | val >>> 12;
							/** @type {number} */
							exports[b++] = 128 | val >>> 6 & 63;
							/** @type {number} */
							exports[b++] = 128 | 63 & val;
						} else {
							/** @type {number} */
							exports[b++] = 240 | val >>> 18;
							/** @type {number} */
							exports[b++] = 128 | val >>> 12 & 63;
							/** @type {number} */
							exports[b++] = 128 | val >>> 6 & 63;
							/** @type {number} */
							exports[b++] = 128 | 63 & val;
						}
					}
				}
			}
			return exports;
		};
		/**
		 * @param {Array} seed
		 * @return {?}
		 */
		dataAndEvents.buf2binstring = function(seed) {
			return fn(seed, seed.length);
		};
		/**
		 * @param {string} str
		 * @return {?}
		 */
		dataAndEvents.binstring2buf = function(str) {
			var employees = new $.Buf8(str.length);
			/** @type {number} */
			var i = 0;
			var l = employees.length;
			for (;l > i;i++) {
				employees[i] = str.charCodeAt(i);
			}
			return employees;
		};
		/**
		 * @param {(Array|number)} imageData
		 * @param {(number|string)} startIndex
		 * @return {?}
		 */
		dataAndEvents.buf2string = function(imageData, startIndex) {
			var p;
			var n;
			var r;
			var line;
			var i = startIndex || imageData.length;
			/** @type {Array} */
			var res = new Array(2 * i);
			/** @type {number} */
			n = 0;
			/** @type {number} */
			p = 0;
			for (;i > p;) {
				if (r = imageData[p++], 128 > r) {
					res[n++] = r;
				} else {
					if (line = lines[r], line > 4) {
						/** @type {number} */
						res[n++] = 65533;
						p += line - 1;
					} else {
						r &= 2 === line ? 31 : 3 === line ? 15 : 7;
						for (;line > 1 && i > p;) {
							/** @type {number} */
							r = r << 6 | 63 & imageData[p++];
							line--;
						}
						if (line > 1) {
							/** @type {number} */
							res[n++] = 65533;
						} else {
							if (65536 > r) {
								res[n++] = r;
							} else {
								r -= 65536;
								/** @type {number} */
								res[n++] = 55296 | r >> 10 & 1023;
								/** @type {number} */
								res[n++] = 56320 | 1023 & r;
							}
						}
					}
				}
			}
			return fn(res, n);
		};
		/**
		 * @param {Arguments} worlds
		 * @param {number} max
		 * @return {?}
		 */
		dataAndEvents.utf8border = function(worlds, max) {
			var min;
			max = max || worlds.length;
			if (max > worlds.length) {
				max = worlds.length;
			}
			/** @type {number} */
			min = max - 1;
			for (;min >= 0 && 128 === (192 & worlds[min]);) {
				min--;
			}
			return 0 > min ? max : 0 === min ? max : min + lines[worlds[min]] > max ? min : max;
		};
	}, {
		"./common" : 41
	}],
	43 : [function(dataAndEvents, config) {
		/**
		 * @param {number} dataAndEvents
		 * @param {(Array|Int8Array|Uint8Array)} deepDataAndEvents
		 * @param {number} b
		 * @param {?} events
		 * @return {?}
		 */
		function clone(dataAndEvents, deepDataAndEvents, b, events) {
			/** @type {number} */
			var left = 65535 & dataAndEvents | 0;
			/** @type {number} */
			var right = dataAndEvents >>> 16 & 65535 | 0;
			/** @type {number} */
			var a = 0;
			for (;0 !== b;) {
				a = b > 2E3 ? 2E3 : b;
				b -= a;
				do {
					/** @type {number} */
					left = left + deepDataAndEvents[events++] | 0;
					/** @type {number} */
					right = right + left | 0;
				} while (--a);
				left %= 65521;
				right %= 65521;
			}
			return left | right << 16 | 0;
		}
		/** @type {function (number, (Array|Int8Array|Uint8Array), number, ?): ?} */
		config.exports = clone;
	}, {}],
	44 : [function(dataAndEvents, module) {
		module.exports = {
			Z_NO_FLUSH : 0,
			Z_PARTIAL_FLUSH : 1,
			Z_SYNC_FLUSH : 2,
			Z_FULL_FLUSH : 3,
			Z_FINISH : 4,
			Z_BLOCK : 5,
			Z_TREES : 6,
			Z_OK : 0,
			Z_STREAM_END : 1,
			Z_NEED_DICT : 2,
			Z_ERRNO : -1,
			Z_STREAM_ERROR : -2,
			Z_DATA_ERROR : -3,
			Z_BUF_ERROR : -5,
			Z_NO_COMPRESSION : 0,
			Z_BEST_SPEED : 1,
			Z_BEST_COMPRESSION : 9,
			Z_DEFAULT_COMPRESSION : -1,
			Z_FILTERED : 1,
			Z_HUFFMAN_ONLY : 2,
			Z_RLE : 3,
			Z_FIXED : 4,
			Z_DEFAULT_STRATEGY : 0,
			Z_BINARY : 0,
			Z_TEXT : 1,
			Z_UNKNOWN : 2,
			Z_DEFLATED : 8
		};
	}, {}],
	45 : [function(dataAndEvents, config) {
		/**
		 * @return {?}
		 */
		function interpolate() {
			var data;
			/** @type {Array} */
			var results = [];
			/** @type {number} */
			var root = 0;
			for (;256 > root;root++) {
				/** @type {number} */
				data = root;
				/** @type {number} */
				var r = 0;
				for (;8 > r;r++) {
					/** @type {number} */
					data = 1 & data ? 3988292384 ^ data >>> 1 : data >>> 1;
				}
				/** @type {number} */
				results[root] = data;
			}
			return results;
		}
		/**
		 * @param {number} dataAndEvents
		 * @param {Object} deepDataAndEvents
		 * @param {string} p
		 * @param {string} arg
		 * @return {?}
		 */
		function clone(dataAndEvents, deepDataAndEvents, p, arg) {
			var exception = e;
			var s = arg + p;
			/** @type {number} */
			dataAndEvents = -1 ^ dataAndEvents;
			/** @type {string} */
			var radius = arg;
			for (;s > radius;radius++) {
				/** @type {number} */
				dataAndEvents = dataAndEvents >>> 8 ^ exception[255 & (dataAndEvents ^ deepDataAndEvents[radius])];
			}
			return-1 ^ dataAndEvents;
		}
		var e = interpolate();
		/** @type {function (number, Object, string, string): ?} */
		config.exports = clone;
	}, {}],
	46 : [function(require, dataAndEvents, that) {
		/**
		 * @param {Object} msg
		 * @param {number} key
		 * @return {?}
		 */
		function fail(msg, key) {
			return msg.msg = helper[key], key;
		}
		/**
		 * @param {number} type
		 * @return {?}
		 */
		function getPrecedence(type) {
			return(type << 1) - (type > 4 ? 9 : 0);
		}
		/**
		 * @param {Arguments} tokenized
		 * @return {undefined}
		 */
		function $(tokenized) {
			var index = tokenized.length;
			for (;--index >= 0;) {
				/** @type {number} */
				tokenized[index] = 0;
			}
		}
		/**
		 * @param {Object} that
		 * @return {undefined}
		 */
		function fn(that) {
			var state = that.state;
			var len = state.pending;
			if (len > that.avail_out) {
				len = that.avail_out;
			}
			if (0 !== len) {
				path.arraySet(that.output, state.pending_buf, state.pending_out, len, that.next_out);
				that.next_out += len;
				state.pending_out += len;
				that.total_out += len;
				that.avail_out -= len;
				state.pending -= len;
				if (0 === state.pending) {
					/** @type {number} */
					state.pending_out = 0;
				}
			}
		}
		/**
		 * @param {Object} self
		 * @param {boolean} recurring
		 * @return {undefined}
		 */
		function each(self, recurring) {
			target._tr_flush_block(self, self.block_start >= 0 ? self.block_start : -1, self.strstart - self.block_start, recurring);
			self.block_start = self.strstart;
			fn(self.strm);
		}
		/**
		 * @param {?} event
		 * @param {number} lab
		 * @return {undefined}
		 */
		function dispatch(event, lab) {
			/** @type {number} */
			event.pending_buf[event.pending++] = lab;
		}
		/**
		 * @param {?} that
		 * @param {number} keepData
		 * @return {undefined}
		 */
		function remove(that, keepData) {
			/** @type {number} */
			that.pending_buf[that.pending++] = keepData >>> 8 & 255;
			/** @type {number} */
			that.pending_buf[that.pending++] = 255 & keepData;
		}
		/**
		 * @param {Object} that
		 * @param {?} data
		 * @param {number} x
		 * @param {number} bytes
		 * @return {?}
		 */
		function update(that, data, x, bytes) {
			var len = that.avail_in;
			return len > bytes && (len = bytes), 0 === len ? 0 : (that.avail_in -= len, path.arraySet(data, that.input, that.next_in, len, x), 1 === that.state.wrap ? that.adler = cb(that.adler, data, len, x) : 2 === that.state.wrap && (that.adler = bind(that.adler, data, len, x)), that.next_in += len, that.total_in += len, len);
		}
		/**
		 * @param {Object} obj
		 * @param {number} key
		 * @return {?}
		 */
		function get(obj, key) {
			var i;
			var x;
			var ol = obj.max_chain_length;
			var j = obj.strstart;
			var offset = obj.prev_length;
			var y = obj.nice_match;
			/** @type {number} */
			var l = obj.strstart > obj.w_size - maxOffset ? obj.strstart - (obj.w_size - maxOffset) : 0;
			var nodes = obj.window;
			var terse = obj.w_mask;
			var path = obj.prev;
			var length = obj.strstart + _;
			var node = nodes[j + offset - 1];
			var el = nodes[j + offset];
			if (obj.prev_length >= obj.good_match) {
				ol >>= 2;
			}
			if (y > obj.lookahead) {
				y = obj.lookahead;
			}
			do {
				if (i = key, nodes[i + offset] === el && (nodes[i + offset - 1] === node && (nodes[i] === nodes[j] && nodes[++i] === nodes[j + 1]))) {
					j += 2;
					i++;
					do {
					} while (nodes[++j] === nodes[++i] && (nodes[++j] === nodes[++i] && (nodes[++j] === nodes[++i] && (nodes[++j] === nodes[++i] && (nodes[++j] === nodes[++i] && (nodes[++j] === nodes[++i] && (nodes[++j] === nodes[++i] && (nodes[++j] === nodes[++i] && length > j))))))));
					if (x = _ - (length - j), j = length - _, x > offset) {
						if (obj.match_start = key, offset = x, x >= y) {
							break;
						}
						node = nodes[j + offset - 1];
						el = nodes[j + offset];
					}
				}
			} while ((key = path[key & terse]) > l && 0 !== --ol);
			return offset <= obj.lookahead ? offset : obj.lookahead;
		}
		/**
		 * @param {Object} self
		 * @return {undefined}
		 */
		function func(self) {
			var fn;
			var data;
			var b;
			var totalSize;
			var i;
			var r = self.w_size;
			do {
				if (totalSize = self.window_size - self.lookahead - self.strstart, self.strstart >= r + (r - maxOffset)) {
					path.arraySet(self.window, self.window, r, r, 0);
					self.match_start -= r;
					self.strstart -= r;
					self.block_start -= r;
					data = self.hash_size;
					fn = data;
					do {
						b = self.head[--fn];
						/** @type {number} */
						self.head[fn] = b >= r ? b - r : 0;
					} while (--data);
					data = r;
					fn = data;
					do {
						b = self.prev[--fn];
						/** @type {number} */
						self.prev[fn] = b >= r ? b - r : 0;
					} while (--data);
					totalSize += r;
				}
				if (0 === self.strm.avail_in) {
					break;
				}
				if (data = update(self.strm, self.window, self.strstart + self.lookahead, totalSize), self.lookahead += data, self.lookahead + self.insert >= x) {
					/** @type {number} */
					i = self.strstart - self.insert;
					self.ins_h = self.window[i];
					/** @type {number} */
					self.ins_h = (self.ins_h << self.hash_shift ^ self.window[i + 1]) & self.hash_mask;
					for (;self.insert && (self.ins_h = (self.ins_h << self.hash_shift ^ self.window[i + x - 1]) & self.hash_mask, self.prev[i & self.w_mask] = self.head[self.ins_h], self.head[self.ins_h] = i, i++, self.insert--, !(self.lookahead + self.insert < x));) {
					}
				}
			} while (self.lookahead < maxOffset && 0 !== self.strm.avail_in);
		}
		/**
		 * @param {Object} self
		 * @param {number} type
		 * @return {?}
		 */
		function execute(self, type) {
			/** @type {number} */
			var file = 65535;
			if (file > self.pending_buf_size - 5) {
				/** @type {number} */
				file = self.pending_buf_size - 5;
			}
			for (;;) {
				if (self.lookahead <= 1) {
					if (func(self), 0 === self.lookahead && type === init) {
						return result;
					}
					if (0 === self.lookahead) {
						break;
					}
				}
				self.strstart += self.lookahead;
				/** @type {number} */
				self.lookahead = 0;
				var path = self.block_start + file;
				if ((0 === self.strstart || self.strstart >= path) && (self.lookahead = self.strstart - path, self.strstart = path, each(self, false), 0 === self.strm.avail_out)) {
					return result;
				}
				if (self.strstart - self.block_start >= self.w_size - maxOffset && (each(self, false), 0 === self.strm.avail_out)) {
					return result;
				}
			}
			return self.insert = 0, type === functionType ? (each(self, true), 0 === self.strm.avail_out ? udp : throws) : self.strstart > self.block_start && (each(self, false), 0 === self.strm.avail_out) ? result : result;
		}
		/**
		 * @param {Object} self
		 * @param {number} type
		 * @return {?}
		 */
		function render(self, type) {
			var key;
			var acc;
			for (;;) {
				if (self.lookahead < maxOffset) {
					if (func(self), self.lookahead < maxOffset && type === init) {
						return result;
					}
					if (0 === self.lookahead) {
						break;
					}
				}
				if (key = 0, self.lookahead >= x && (self.ins_h = (self.ins_h << self.hash_shift ^ self.window[self.strstart + x - 1]) & self.hash_mask, key = self.prev[self.strstart & self.w_mask] = self.head[self.ins_h], self.head[self.ins_h] = self.strstart), 0 !== key && (self.strstart - key <= self.w_size - maxOffset && (self.match_length = get(self, key))), self.match_length >= x) {
					if (acc = target._tr_tally(self, self.strstart - self.match_start, self.match_length - x), self.lookahead -= self.match_length, self.match_length <= self.max_lazy_match && self.lookahead >= x) {
						self.match_length--;
						do {
							self.strstart++;
							/** @type {number} */
							self.ins_h = (self.ins_h << self.hash_shift ^ self.window[self.strstart + x - 1]) & self.hash_mask;
							key = self.prev[self.strstart & self.w_mask] = self.head[self.ins_h];
							self.head[self.ins_h] = self.strstart;
						} while (0 !== --self.match_length);
						self.strstart++;
					} else {
						self.strstart += self.match_length;
						/** @type {number} */
						self.match_length = 0;
						self.ins_h = self.window[self.strstart];
						/** @type {number} */
						self.ins_h = (self.ins_h << self.hash_shift ^ self.window[self.strstart + 1]) & self.hash_mask;
					}
				} else {
					acc = target._tr_tally(self, 0, self.window[self.strstart]);
					self.lookahead--;
					self.strstart++;
				}
				if (acc && (each(self, false), 0 === self.strm.avail_out)) {
					return result;
				}
			}
			return self.insert = self.strstart < x - 1 ? self.strstart : x - 1, type === functionType ? (each(self, true), 0 === self.strm.avail_out ? udp : throws) : self.last_lit && (each(self, false), 0 === self.strm.avail_out) ? result : value;
		}
		/**
		 * @param {Object} self
		 * @param {number} type
		 * @return {?}
		 */
		function run(self, type) {
			var key;
			var found;
			var wx;
			for (;;) {
				if (self.lookahead < maxOffset) {
					if (func(self), self.lookahead < maxOffset && type === init) {
						return result;
					}
					if (0 === self.lookahead) {
						break;
					}
				}
				if (key = 0, self.lookahead >= x && (self.ins_h = (self.ins_h << self.hash_shift ^ self.window[self.strstart + x - 1]) & self.hash_mask, key = self.prev[self.strstart & self.w_mask] = self.head[self.ins_h], self.head[self.ins_h] = self.strstart), self.prev_length = self.match_length, self.prev_match = self.match_start, self.match_length = x - 1, 0 !== key && (self.prev_length < self.max_lazy_match && (self.strstart - key <= self.w_size - maxOffset && (self.match_length = get(self, key), self.match_length <=
					5 && ((self.strategy === property || self.match_length === x && self.strstart - self.match_start > 4096) && (self.match_length = x - 1))))), self.prev_length >= x && self.match_length <= self.prev_length) {
					/** @type {number} */
					wx = self.strstart + self.lookahead - x;
					found = target._tr_tally(self, self.strstart - 1 - self.prev_match, self.prev_length - x);
					self.lookahead -= self.prev_length - 1;
					self.prev_length -= 2;
					do {
						if (++self.strstart <= wx) {
							/** @type {number} */
							self.ins_h = (self.ins_h << self.hash_shift ^ self.window[self.strstart + x - 1]) & self.hash_mask;
							key = self.prev[self.strstart & self.w_mask] = self.head[self.ins_h];
							self.head[self.ins_h] = self.strstart;
						}
					} while (0 !== --self.prev_length);
					if (self.match_available = 0, self.match_length = x - 1, self.strstart++, found && (each(self, false), 0 === self.strm.avail_out)) {
						return result;
					}
				} else {
					if (self.match_available) {
						if (found = target._tr_tally(self, 0, self.window[self.strstart - 1]), found && each(self, false), self.strstart++, self.lookahead--, 0 === self.strm.avail_out) {
							return result;
						}
					} else {
						/** @type {number} */
						self.match_available = 1;
						self.strstart++;
						self.lookahead--;
					}
				}
			}
			return self.match_available && (found = target._tr_tally(self, 0, self.window[self.strstart - 1]), self.match_available = 0), self.insert = self.strstart < x - 1 ? self.strstart : x - 1, type === functionType ? (each(self, true), 0 === self.strm.avail_out ? udp : throws) : self.last_lit && (each(self, false), 0 === self.strm.avail_out) ? result : value;
		}
		/**
		 * @param {Object} self
		 * @param {number} type
		 * @return {?}
		 */
		function on(self, type) {
			var acc;
			var t;
			var j;
			var length;
			var a = self.window;
			for (;;) {
				if (self.lookahead <= _) {
					if (func(self), self.lookahead <= _ && type === init) {
						return result;
					}
					if (0 === self.lookahead) {
						break;
					}
				}
				if (self.match_length = 0, self.lookahead >= x && (self.strstart > 0 && (j = self.strstart - 1, t = a[j], t === a[++j] && (t === a[++j] && t === a[++j])))) {
					length = self.strstart + _;
					do {
					} while (t === a[++j] && (t === a[++j] && (t === a[++j] && (t === a[++j] && (t === a[++j] && (t === a[++j] && (t === a[++j] && (t === a[++j] && length > j))))))));
					/** @type {number} */
					self.match_length = _ - (length - j);
					if (self.match_length > self.lookahead) {
						self.match_length = self.lookahead;
					}
				}
				if (self.match_length >= x ? (acc = target._tr_tally(self, 1, self.match_length - x), self.lookahead -= self.match_length, self.strstart += self.match_length, self.match_length = 0) : (acc = target._tr_tally(self, 0, self.window[self.strstart]), self.lookahead--, self.strstart++), acc && (each(self, false), 0 === self.strm.avail_out)) {
					return result;
				}
			}
			return self.insert = 0, type === functionType ? (each(self, true), 0 === self.strm.avail_out ? udp : throws) : self.last_lit && (each(self, false), 0 === self.strm.avail_out) ? result : value;
		}
		/**
		 * @param {Object} self
		 * @param {number} type
		 * @return {?}
		 */
		function trigger(self, type) {
			var acc;
			for (;;) {
				if (0 === self.lookahead && (func(self), 0 === self.lookahead)) {
					if (type === init) {
						return result;
					}
					break;
				}
				if (self.match_length = 0, acc = target._tr_tally(self, 0, self.window[self.strstart]), self.lookahead--, self.strstart++, acc && (each(self, false), 0 === self.strm.avail_out)) {
					return result;
				}
			}
			return self.insert = 0, type === functionType ? (each(self, true), 0 === self.strm.avail_out ? udp : throws) : self.last_lit && (each(self, false), 0 === self.strm.avail_out) ? result : value;
		}
		/**
		 * @param {Object} item
		 * @return {undefined}
		 */
		function log(item) {
			/** @type {number} */
			item.window_size = 2 * item.w_size;
			$(item.head);
			item.max_lazy_match = config_table[item.level].max_lazy;
			item.good_match = config_table[item.level].good_length;
			item.nice_match = config_table[item.level].nice_length;
			item.max_chain_length = config_table[item.level].max_chain;
			/** @type {number} */
			item.strstart = 0;
			/** @type {number} */
			item.block_start = 0;
			/** @type {number} */
			item.lookahead = 0;
			/** @type {number} */
			item.insert = 0;
			/** @type {number} */
			item.match_length = item.prev_length = x - 1;
			/** @type {number} */
			item.match_available = 0;
			/** @type {number} */
			item.ins_h = 0;
		}
		/**
		 * @return {undefined}
		 */
		function next() {
			/** @type {null} */
			this.strm = null;
			/** @type {number} */
			this.status = 0;
			/** @type {null} */
			this.pending_buf = null;
			/** @type {number} */
			this.pending_buf_size = 0;
			/** @type {number} */
			this.pending_out = 0;
			/** @type {number} */
			this.pending = 0;
			/** @type {number} */
			this.wrap = 0;
			/** @type {null} */
			this.gzhead = null;
			/** @type {number} */
			this.gzindex = 0;
			/** @type {number} */
			this.method = nextSibling;
			/** @type {number} */
			this.last_flush = -1;
			/** @type {number} */
			this.w_size = 0;
			/** @type {number} */
			this.w_bits = 0;
			/** @type {number} */
			this.w_mask = 0;
			/** @type {null} */
			this.window = null;
			/** @type {number} */
			this.window_size = 0;
			/** @type {null} */
			this.prev = null;
			/** @type {null} */
			this.head = null;
			/** @type {number} */
			this.ins_h = 0;
			/** @type {number} */
			this.hash_size = 0;
			/** @type {number} */
			this.hash_bits = 0;
			/** @type {number} */
			this.hash_mask = 0;
			/** @type {number} */
			this.hash_shift = 0;
			/** @type {number} */
			this.block_start = 0;
			/** @type {number} */
			this.match_length = 0;
			/** @type {number} */
			this.prev_match = 0;
			/** @type {number} */
			this.match_available = 0;
			/** @type {number} */
			this.strstart = 0;
			/** @type {number} */
			this.match_start = 0;
			/** @type {number} */
			this.lookahead = 0;
			/** @type {number} */
			this.prev_length = 0;
			/** @type {number} */
			this.max_chain_length = 0;
			/** @type {number} */
			this.max_lazy_match = 0;
			/** @type {number} */
			this.level = 0;
			/** @type {number} */
			this.strategy = 0;
			/** @type {number} */
			this.good_match = 0;
			/** @type {number} */
			this.nice_match = 0;
			this.dyn_ltree = new path.Buf16(2 * ae);
			this.dyn_dtree = new path.Buf16(2 * (2 * re + 1));
			this.bl_tree = new path.Buf16(2 * (2 * ie + 1));
			$(this.dyn_ltree);
			$(this.dyn_dtree);
			$(this.bl_tree);
			/** @type {null} */
			this.l_desc = null;
			/** @type {null} */
			this.d_desc = null;
			/** @type {null} */
			this.bl_desc = null;
			this.bl_count = new path.Buf16(se + 1);
			this.heap = new path.Buf16(2 * funcId + 1);
			$(this.heap);
			/** @type {number} */
			this.heap_len = 0;
			/** @type {number} */
			this.heap_max = 0;
			this.depth = new path.Buf16(2 * funcId + 1);
			$(this.depth);
			/** @type {number} */
			this.l_buf = 0;
			/** @type {number} */
			this.lit_bufsize = 0;
			/** @type {number} */
			this.last_lit = 0;
			/** @type {number} */
			this.d_buf = 0;
			/** @type {number} */
			this.opt_len = 0;
			/** @type {number} */
			this.static_len = 0;
			/** @type {number} */
			this.matches = 0;
			/** @type {number} */
			this.insert = 0;
			/** @type {number} */
			this.bi_buf = 0;
			/** @type {number} */
			this.bi_valid = 0;
		}
		/**
		 * @param {Object} that
		 * @return {?}
		 */
		function test(that) {
			var self;
			return that && that.state ? (that.total_in = that.total_out = 0, that.data_type = root, self = that.state, self.pending = 0, self.pending_out = 0, self.wrap < 0 && (self.wrap = -self.wrap), self.status = self.wrap ? https : status, that.adler = 2 === self.wrap ? 0 : 1, self.last_flush = init, target._tr_init(self), b) : fail(that, later);
		}
		/**
		 * @param {Object} msg
		 * @return {?}
		 */
		function done(msg) {
			var a = test(msg);
			return a === b && log(msg.state), a;
		}
		/**
		 * @param {Object} d
		 * @param {string} ui
		 * @return {?}
		 */
		function start(d, ui) {
			return d && d.state ? 2 !== d.state.wrap ? later : (d.state.gzhead = ui, b) : later;
		}
		/**
		 * @param {Object} error
		 * @param {number} target
		 * @param {number} method
		 * @param {number} args
		 * @param {number} height
		 * @param {number} id
		 * @return {?}
		 */
		function initialize(error, target, method, args, height, id) {
			if (!error) {
				return later;
			}
			/** @type {number} */
			var value = 1;
			if (target === copy && (target = 6), 0 > args ? (value = 0, args = -args) : args > 15 && (value = 2, args -= 16), 1 > height || (height > maxHeight || (method !== nextSibling || (8 > args || (args > 15 || (0 > target || (target > 9 || (0 > id || id > key)))))))) {
				return fail(error, later);
			}
			if (8 === args) {
				/** @type {number} */
				args = 9;
			}
			var obj = new next;
			return error.state = obj, obj.strm = error, obj.wrap = value, obj.gzhead = null, obj.w_bits = args, obj.w_size = 1 << obj.w_bits, obj.w_mask = obj.w_size - 1, obj.hash_bits = height + 7, obj.hash_size = 1 << obj.hash_bits, obj.hash_mask = obj.hash_size - 1, obj.hash_shift = ~~((obj.hash_bits + x - 1) / x), obj.window = new path.Buf8(2 * obj.w_size), obj.head = new path.Buf16(obj.hash_size), obj.prev = new path.Buf16(obj.w_size), obj.lit_bufsize = 1 << height + 6, obj.pending_buf_size = 4 *
			obj.lit_bufsize, obj.pending_buf = new path.Buf8(obj.pending_buf_size), obj.d_buf = obj.lit_bufsize >> 1, obj.l_buf = 3 * obj.lit_bufsize, obj.level = target, obj.strategy = id, obj.method = method, done(error);
		}
		/**
		 * @param {Object} e
		 * @param {number} obj
		 * @return {?}
		 */
		function type(e, obj) {
			return initialize(e, obj, nextSibling, typePattern, guess, modId);
		}
		/**
		 * @param {Object} that
		 * @param {number} type
		 * @return {?}
		 */
		function callback(that, type) {
			var right;
			var self;
			var data;
			var lab;
			if (!that || (!that.state || (type > scope || 0 > type))) {
				return that ? fail(that, later) : later;
			}
			if (self = that.state, !that.output || (!that.input && 0 !== that.avail_in || self.status === onoff && type !== functionType)) {
				return fail(that, 0 === that.avail_out ? e : later);
			}
			if (self.strm = that, right = self.last_flush, self.last_flush = type, self.status === https) {
				if (2 === self.wrap) {
					/** @type {number} */
					that.adler = 0;
					dispatch(self, 31);
					dispatch(self, 139);
					dispatch(self, 8);
					if (self.gzhead) {
						dispatch(self, (self.gzhead.text ? 1 : 0) + (self.gzhead.hcrc ? 2 : 0) + (self.gzhead.extra ? 4 : 0) + (self.gzhead.name ? 8 : 0) + (self.gzhead.comment ? 16 : 0));
						dispatch(self, 255 & self.gzhead.time);
						dispatch(self, self.gzhead.time >> 8 & 255);
						dispatch(self, self.gzhead.time >> 16 & 255);
						dispatch(self, self.gzhead.time >> 24 & 255);
						dispatch(self, 9 === self.level ? 2 : self.strategy >= slide || self.level < 2 ? 4 : 0);
						dispatch(self, 255 & self.gzhead.os);
						if (self.gzhead.extra) {
							if (self.gzhead.extra.length) {
								dispatch(self, 255 & self.gzhead.extra.length);
								dispatch(self, self.gzhead.extra.length >> 8 & 255);
							}
						}
						if (self.gzhead.hcrc) {
							that.adler = bind(that.adler, self.pending_buf, self.pending, 0);
						}
						/** @type {number} */
						self.gzindex = 0;
						/** @type {number} */
						self.status = string;
					} else {
						dispatch(self, 0);
						dispatch(self, 0);
						dispatch(self, 0);
						dispatch(self, 0);
						dispatch(self, 0);
						dispatch(self, 9 === self.level ? 2 : self.strategy >= slide || self.level < 2 ? 4 : 0);
						dispatch(self, op);
						/** @type {number} */
						self.status = status;
					}
				} else {
					/** @type {number} */
					var events = nextSibling + (self.w_bits - 8 << 4) << 8;
					/** @type {number} */
					var c = -1;
					/** @type {number} */
					c = self.strategy >= slide || self.level < 2 ? 0 : self.level < 6 ? 1 : 6 === self.level ? 2 : 3;
					events |= c << 6;
					if (0 !== self.strstart) {
						events |= ue;
					}
					events += 31 - events % 31;
					/** @type {number} */
					self.status = status;
					remove(self, events);
					if (0 !== self.strstart) {
						remove(self, that.adler >>> 16);
						remove(self, 65535 & that.adler);
					}
					/** @type {number} */
					that.adler = 1;
				}
			}
			if (self.status === string) {
				if (self.gzhead.extra) {
					data = self.pending;
					for (;self.gzindex < (65535 & self.gzhead.extra.length) && (self.pending !== self.pending_buf_size || (self.gzhead.hcrc && (self.pending > data && (that.adler = bind(that.adler, self.pending_buf, self.pending - data, data))), fn(that), data = self.pending, self.pending !== self.pending_buf_size));) {
						dispatch(self, 255 & self.gzhead.extra[self.gzindex]);
						self.gzindex++;
					}
					if (self.gzhead.hcrc) {
						if (self.pending > data) {
							that.adler = bind(that.adler, self.pending_buf, self.pending - data, data);
						}
					}
					if (self.gzindex === self.gzhead.extra.length) {
						/** @type {number} */
						self.gzindex = 0;
						/** @type {number} */
						self.status = message;
					}
				} else {
					/** @type {number} */
					self.status = message;
				}
			}
			if (self.status === message) {
				if (self.gzhead.name) {
					data = self.pending;
					do {
						if (self.pending === self.pending_buf_size && (self.gzhead.hcrc && (self.pending > data && (that.adler = bind(that.adler, self.pending_buf, self.pending - data, data))), fn(that), data = self.pending, self.pending === self.pending_buf_size)) {
							/** @type {number} */
							lab = 1;
							break;
						}
						/** @type {number} */
						lab = self.gzindex < self.gzhead.name.length ? 255 & self.gzhead.name.charCodeAt(self.gzindex++) : 0;
						dispatch(self, lab);
					} while (0 !== lab);
					if (self.gzhead.hcrc) {
						if (self.pending > data) {
							that.adler = bind(that.adler, self.pending_buf, self.pending - data, data);
						}
					}
					if (0 === lab) {
						/** @type {number} */
						self.gzindex = 0;
						/** @type {number} */
						self.status = i;
					}
				} else {
					/** @type {number} */
					self.status = i;
				}
			}
			if (self.status === i) {
				if (self.gzhead.comment) {
					data = self.pending;
					do {
						if (self.pending === self.pending_buf_size && (self.gzhead.hcrc && (self.pending > data && (that.adler = bind(that.adler, self.pending_buf, self.pending - data, data))), fn(that), data = self.pending, self.pending === self.pending_buf_size)) {
							/** @type {number} */
							lab = 1;
							break;
						}
						/** @type {number} */
						lab = self.gzindex < self.gzhead.comment.length ? 255 & self.gzhead.comment.charCodeAt(self.gzindex++) : 0;
						dispatch(self, lab);
					} while (0 !== lab);
					if (self.gzhead.hcrc) {
						if (self.pending > data) {
							that.adler = bind(that.adler, self.pending_buf, self.pending - data, data);
						}
					}
					if (0 === lab) {
						/** @type {number} */
						self.status = html;
					}
				} else {
					/** @type {number} */
					self.status = html;
				}
			}
			if (self.status === html && (self.gzhead.hcrc ? (self.pending + 2 > self.pending_buf_size && fn(that), self.pending + 2 <= self.pending_buf_size && (dispatch(self, 255 & that.adler), dispatch(self, that.adler >> 8 & 255), that.adler = 0, self.status = status)) : self.status = status), 0 !== self.pending) {
				if (fn(that), 0 === that.avail_out) {
					return self.last_flush = -1, b;
				}
			} else {
				if (0 === that.avail_in && (getPrecedence(type) <= getPrecedence(right) && type !== functionType)) {
					return fail(that, e);
				}
			}
			if (self.status === onoff && 0 !== that.avail_in) {
				return fail(that, e);
			}
			if (0 !== that.avail_in || (0 !== self.lookahead || type !== init && self.status !== onoff)) {
				var str = self.strategy === slide ? trigger(self, type) : self.strategy === dir ? on(self, type) : config_table[self.level].func(self, type);
				if ((str === udp || str === throws) && (self.status = onoff), str === result || str === udp) {
					return 0 === that.avail_out && (self.last_flush = -1), b;
				}
				if (str === value && (type === fx ? target._tr_align(self) : type !== scope && (target._tr_stored_block(self, 0, 0, false), type === click && ($(self.head), 0 === self.lookahead && (self.strstart = 0, self.block_start = 0, self.insert = 0))), fn(that), 0 === that.avail_out)) {
					return self.last_flush = -1, b;
				}
			}
			return type !== functionType ? b : self.wrap <= 0 ? F : (2 === self.wrap ? (dispatch(self, 255 & that.adler), dispatch(self, that.adler >> 8 & 255), dispatch(self, that.adler >> 16 & 255), dispatch(self, that.adler >> 24 & 255), dispatch(self, 255 & that.total_in), dispatch(self, that.total_in >> 8 & 255), dispatch(self, that.total_in >> 16 & 255), dispatch(self, that.total_in >> 24 & 255)) : (remove(self, that.adler >>> 16), remove(self, 65535 & that.adler)), fn(that), self.wrap > 0 && (self.wrap =
				-self.wrap), 0 !== self.pending ? b : F);
		}
		/**
		 * @param {Object} e
		 * @return {?}
		 */
		function error(e) {
			var type;
			return e && e.state ? (type = e.state.status, type !== https && (type !== string && (type !== message && (type !== i && (type !== html && (type !== status && type !== onoff))))) ? fail(e, later) : (e.state = null, type === status ? fail(e, camelKey) : b)) : later;
		}
		var config_table;
		var path = require("../utils/common");
		var target = require("./trees");
		var cb = require("./adler32");
		var bind = require("./crc32");
		var helper = require("./messages");
		/** @type {number} */
		var init = 0;
		/** @type {number} */
		var fx = 1;
		/** @type {number} */
		var click = 3;
		/** @type {number} */
		var functionType = 4;
		/** @type {number} */
		var scope = 5;
		/** @type {number} */
		var b = 0;
		/** @type {number} */
		var F = 1;
		/** @type {number} */
		var later = -2;
		/** @type {number} */
		var camelKey = -3;
		/** @type {number} */
		var e = -5;
		/** @type {number} */
		var copy = -1;
		/** @type {number} */
		var property = 1;
		/** @type {number} */
		var slide = 2;
		/** @type {number} */
		var dir = 3;
		/** @type {number} */
		var key = 4;
		/** @type {number} */
		var modId = 0;
		/** @type {number} */
		var root = 2;
		/** @type {number} */
		var nextSibling = 8;
		/** @type {number} */
		var maxHeight = 9;
		/** @type {number} */
		var typePattern = 15;
		/** @type {number} */
		var guess = 8;
		/** @type {number} */
		var line = 29;
		/** @type {number} */
		var name = 256;
		/** @type {number} */
		var funcId = name + 1 + line;
		/** @type {number} */
		var re = 30;
		/** @type {number} */
		var ie = 19;
		/** @type {number} */
		var ae = 2 * funcId + 1;
		/** @type {number} */
		var se = 15;
		/** @type {number} */
		var x = 3;
		/** @type {number} */
		var _ = 258;
		/** @type {number} */
		var maxOffset = _ + x + 1;
		/** @type {number} */
		var ue = 32;
		/** @type {number} */
		var https = 42;
		/** @type {number} */
		var string = 69;
		/** @type {number} */
		var message = 73;
		/** @type {number} */
		var i = 91;
		/** @type {number} */
		var html = 103;
		/** @type {number} */
		var status = 113;
		/** @type {number} */
		var onoff = 666;
		/** @type {number} */
		var result = 1;
		/** @type {number} */
		var value = 2;
		/** @type {number} */
		var udp = 3;
		/** @type {number} */
		var throws = 4;
		/** @type {number} */
		var op = 3;
		/**
		 * @param {Array} good_length
		 * @param {Array} max_lazy
		 * @param {number} nice_length
		 * @param {Array} max_chain
		 * @param {Function} func
		 * @return {undefined}
		 */
		var Config = function(good_length, max_lazy, nice_length, max_chain, func) {
			/** @type {Array} */
			this.good_length = good_length;
			/** @type {Array} */
			this.max_lazy = max_lazy;
			/** @type {number} */
			this.nice_length = nice_length;
			/** @type {Array} */
			this.max_chain = max_chain;
			/** @type {Function} */
			this.func = func;
		};
		/** @type {Array} */
		config_table = [new Config(0, 0, 0, 0, execute), new Config(4, 4, 8, 4, render), new Config(4, 5, 16, 8, render), new Config(4, 6, 32, 32, render), new Config(4, 4, 16, 16, run), new Config(8, 16, 32, 32, run), new Config(8, 16, 128, 128, run), new Config(8, 32, 128, 256, run), new Config(32, 128, 258, 1024, run), new Config(32, 258, 258, 4096, run)];
		/** @type {function (Object, number): ?} */
		that.deflateInit = type;
		/** @type {function (Object, number, number, number, number, number): ?} */
		that.deflateInit2 = initialize;
		/** @type {function (Object): ?} */
		that.deflateReset = done;
		/** @type {function (Object): ?} */
		that.deflateResetKeep = test;
		/** @type {function (Object, string): ?} */
		that.deflateSetHeader = start;
		/** @type {function (Object, number): ?} */
		that.deflate = callback;
		/** @type {function (Object): ?} */
		that.deflateEnd = error;
		/** @type {string} */
		that.deflateInfo = "pako deflate (from Nodeca project)";
	}, {
		"../utils/common" : 41,
		"./adler32" : 43,
		"./crc32" : 45,
		"./messages" : 51,
		"./trees" : 52
	}],
	47 : [function(dataAndEvents, module) {
		/**
		 * @return {undefined}
		 */
		function parse() {
			/** @type {number} */
			this.text = 0;
			/** @type {number} */
			this.time = 0;
			/** @type {number} */
			this.xflags = 0;
			/** @type {number} */
			this.os = 0;
			/** @type {null} */
			this.extra = null;
			/** @type {number} */
			this.extra_len = 0;
			/** @type {string} */
			this.name = "";
			/** @type {string} */
			this.comment = "";
			/** @type {number} */
			this.hcrc = 0;
			/** @type {boolean} */
			this.done = false;
		}
		/** @type {function (): undefined} */
		module.exports = parse;
	}, {}],
	48 : [function(dataAndEvents, module) {
		/** @type {number} */
		var name = 30;
		/** @type {number} */
		var value = 12;
		/**
		 * @param {Object} that
		 * @param {number} length
		 * @return {undefined}
		 */
		module.exports = function(that, length) {
			var config;
			var start;
			var end;
			var i;
			var halfWidth;
			var l;
			var maxLength;
			var val;
			var _ref2;
			var width;
			var data;
			var left;
			var y;
			var items;
			var children;
			var right;
			var v;
			var item;
			var x;
			var imageWidth;
			var len;
			var offset;
			var b;
			var id;
			var r;
			config = that.state;
			start = that.next_in;
			id = that.input;
			end = start + (that.avail_in - 5);
			i = that.next_out;
			r = that.output;
			/** @type {number} */
			halfWidth = i - (length - that.avail_out);
			l = i + (that.avail_out - 257);
			maxLength = config.dmax;
			val = config.wsize;
			_ref2 = config.whave;
			width = config.wnext;
			data = config.window;
			left = config.hold;
			y = config.bits;
			items = config.lencode;
			children = config.distcode;
			/** @type {number} */
			right = (1 << config.lenbits) - 1;
			/** @type {number} */
			v = (1 << config.distbits) - 1;
			t: do {
				if (15 > y) {
					left += id[start++] << y;
					y += 8;
					left += id[start++] << y;
					y += 8;
				}
				item = items[left & right];
				e: for (;;) {
					if (x = item >>> 24, left >>>= x, y -= x, x = item >>> 16 & 255, 0 === x) {
						/** @type {number} */
						r[i++] = 65535 & item;
					} else {
						if (!(16 & x)) {
							if (0 === (64 & x)) {
								item = items[(65535 & item) + (left & (1 << x) - 1)];
								continue e;
							}
							if (32 & x) {
								/** @type {number} */
								config.mode = value;
								break t;
							}
							/** @type {string} */
							that.msg = "invalid literal/length code";
							/** @type {number} */
							config.mode = name;
							break t;
						}
						/** @type {number} */
						imageWidth = 65535 & item;
						x &= 15;
						if (x) {
							if (x > y) {
								left += id[start++] << y;
								y += 8;
							}
							imageWidth += left & (1 << x) - 1;
							left >>>= x;
							y -= x;
						}
						if (15 > y) {
							left += id[start++] << y;
							y += 8;
							left += id[start++] << y;
							y += 8;
						}
						item = children[left & v];
						n: for (;;) {
							if (x = item >>> 24, left >>>= x, y -= x, x = item >>> 16 & 255, !(16 & x)) {
								if (0 === (64 & x)) {
									item = children[(65535 & item) + (left & (1 << x) - 1)];
									continue n;
								}
								/** @type {string} */
								that.msg = "invalid distance code";
								/** @type {number} */
								config.mode = name;
								break t;
							}
							if (len = 65535 & item, x &= 15, x > y && (left += id[start++] << y, y += 8, x > y && (left += id[start++] << y, y += 8)), len += left & (1 << x) - 1, len > maxLength) {
								/** @type {string} */
								that.msg = "invalid distance too far back";
								/** @type {number} */
								config.mode = name;
								break t;
							}
							if (left >>>= x, y -= x, x = i - halfWidth, len > x) {
								if (x = len - x, x > _ref2 && config.sane) {
									/** @type {string} */
									that.msg = "invalid distance too far back";
									/** @type {number} */
									config.mode = name;
									break t;
								}
								if (offset = 0, b = data, 0 === width) {
									if (offset += val - x, imageWidth > x) {
										imageWidth -= x;
										do {
											r[i++] = data[offset++];
										} while (--x);
										/** @type {number} */
										offset = i - len;
										b = r;
									}
								} else {
									if (x > width) {
										if (offset += val + width - x, x -= width, imageWidth > x) {
											imageWidth -= x;
											do {
												r[i++] = data[offset++];
											} while (--x);
											if (offset = 0, imageWidth > width) {
												x = width;
												imageWidth -= x;
												do {
													r[i++] = data[offset++];
												} while (--x);
												/** @type {number} */
												offset = i - len;
												b = r;
											}
										}
									} else {
										if (offset += width - x, imageWidth > x) {
											imageWidth -= x;
											do {
												r[i++] = data[offset++];
											} while (--x);
											/** @type {number} */
											offset = i - len;
											b = r;
										}
									}
								}
								for (;imageWidth > 2;) {
									r[i++] = b[offset++];
									r[i++] = b[offset++];
									r[i++] = b[offset++];
									imageWidth -= 3;
								}
								if (imageWidth) {
									r[i++] = b[offset++];
									if (imageWidth > 1) {
										r[i++] = b[offset++];
									}
								}
							} else {
								/** @type {number} */
								offset = i - len;
								do {
									r[i++] = r[offset++];
									r[i++] = r[offset++];
									r[i++] = r[offset++];
									imageWidth -= 3;
								} while (imageWidth > 2);
								if (imageWidth) {
									r[i++] = r[offset++];
									if (imageWidth > 1) {
										r[i++] = r[offset++];
									}
								}
							}
							break;
						}
					}
					break;
				}
			} while (end > start && l > i);
			/** @type {number} */
			imageWidth = y >> 3;
			start -= imageWidth;
			y -= imageWidth << 3;
			left &= (1 << y) - 1;
			that.next_in = start;
			that.next_out = i;
			/** @type {number} */
			that.avail_in = end > start ? 5 + (end - start) : 5 - (start - end);
			/** @type {number} */
			that.avail_out = l > i ? 257 + (l - i) : 257 - (i - l);
			config.hold = left;
			config.bits = y;
		};
	}, {}],
	49 : [function($, dataAndEvents, exports) {
		/**
		 * @param {number} obj
		 * @return {?}
		 */
		function _(obj) {
			return(obj >>> 24 & 255) + (obj >>> 8 & 65280) + ((65280 & obj) << 8) + ((255 & obj) << 24);
		}
		/**
		 * @return {undefined}
		 */
		function check() {
			/** @type {number} */
			this.mode = 0;
			/** @type {boolean} */
			this.last = false;
			/** @type {number} */
			this.wrap = 0;
			/** @type {boolean} */
			this.havedict = false;
			/** @type {number} */
			this.flags = 0;
			/** @type {number} */
			this.dmax = 0;
			/** @type {number} */
			this.check = 0;
			/** @type {number} */
			this.total = 0;
			/** @type {null} */
			this.head = null;
			/** @type {number} */
			this.wbits = 0;
			/** @type {number} */
			this.wsize = 0;
			/** @type {number} */
			this.whave = 0;
			/** @type {number} */
			this.wnext = 0;
			/** @type {null} */
			this.window = null;
			/** @type {number} */
			this.hold = 0;
			/** @type {number} */
			this.bits = 0;
			/** @type {number} */
			this.length = 0;
			/** @type {number} */
			this.offset = 0;
			/** @type {number} */
			this.extra = 0;
			/** @type {null} */
			this.lencode = null;
			/** @type {null} */
			this.distcode = null;
			/** @type {number} */
			this.lenbits = 0;
			/** @type {number} */
			this.distbits = 0;
			/** @type {number} */
			this.ncode = 0;
			/** @type {number} */
			this.nlen = 0;
			/** @type {number} */
			this.ndist = 0;
			/** @type {number} */
			this.have = 0;
			/** @type {null} */
			this.next = null;
			this.lens = new ctx.Buf16(320);
			this.work = new ctx.Buf16(288);
			/** @type {null} */
			this.lendyn = null;
			/** @type {null} */
			this.distdyn = null;
			/** @type {number} */
			this.sane = 0;
			/** @type {number} */
			this.back = 0;
			/** @type {number} */
			this.was = 0;
		}
		/**
		 * @param {Object} that
		 * @return {?}
		 */
		function remove(that) {
			var data;
			return that && that.state ? (data = that.state, that.total_in = that.total_out = data.total = 0, that.msg = "", data.wrap && (that.adler = 1 & data.wrap), data.mode = type, data.last = 0, data.havedict = 0, data.dmax = 32768, data.head = null, data.hold = 0, data.bits = 0, data.lencode = data.lendyn = new ctx.Buf32(value), data.distcode = data.distdyn = new ctx.Buf32(distdyn), data.sane = 1, data.back = -1, FLUSH) : all;
		}
		/**
		 * @param {Object} obj
		 * @return {?}
		 */
		function reset(obj) {
			var base;
			return obj && obj.state ? (base = obj.state, base.wsize = 0, base.whave = 0, base.wnext = 0, remove(obj)) : all;
		}
		/**
		 * @param {Object} info
		 * @param {number} y
		 * @return {?}
		 */
		function process(info, y) {
			var value;
			var target;
			return info && info.state ? (target = info.state, 0 > y ? (value = 0, y = -y) : (value = (y >> 4) + 1, 48 > y && (y &= 15)), y && (8 > y || y > 15) ? all : (null !== target.window && (target.wbits !== y && (target.window = null)), target.wrap = value, target.wbits = y, reset(info))) : all;
		}
		/**
		 * @param {Object} params
		 * @param {number} key
		 * @return {?}
		 */
		function clear(params, key) {
			var settings;
			var obj;
			return params ? (obj = new check, params.state = obj, obj.window = null, settings = process(params, key), settings !== FLUSH && (params.state = null), settings) : all;
		}
		/**
		 * @param {Object} ctx
		 * @return {?}
		 */
		function update(ctx) {
			return clear(ctx, j);
		}
		/**
		 * @param {?} req
		 * @return {undefined}
		 */
		function sendMessage(req) {
			if (be) {
				var e;
				buf = new ctx.Buf32(512);
				hdl = new ctx.Buf32(32);
				/** @type {number} */
				e = 0;
				for (;144 > e;) {
					/** @type {number} */
					req.lens[e++] = 8;
				}
				for (;256 > e;) {
					/** @type {number} */
					req.lens[e++] = 9;
				}
				for (;280 > e;) {
					/** @type {number} */
					req.lens[e++] = 7;
				}
				for (;288 > e;) {
					/** @type {number} */
					req.lens[e++] = 8;
				}
				debug(isArray, req.lens, 0, 288, buf, 0, req.work, {
					bits : 9
				});
				/** @type {number} */
				e = 0;
				for (;32 > e;) {
					/** @type {number} */
					req.lens[e++] = 5;
				}
				debug(RDS1, req.lens, 0, 32, hdl, 0, req.work, {
					bits : 5
				});
				/** @type {boolean} */
				be = false;
			}
			req.lencode = buf;
			/** @type {number} */
			req.lenbits = 9;
			req.distcode = hdl;
			/** @type {number} */
			req.distbits = 5;
		}
		/**
		 * @param {Object} msg
		 * @param {?} data
		 * @param {number} y
		 * @param {number} offset
		 * @return {?}
		 */
		function callback(msg, data, y, offset) {
			var length;
			var self = msg.state;
			return null === self.window && (self.wsize = 1 << self.wbits, self.wnext = 0, self.whave = 0, self.window = new ctx.Buf8(self.wsize)), offset >= self.wsize ? (ctx.arraySet(self.window, data, y - self.wsize, self.wsize, 0), self.wnext = 0, self.whave = self.wsize) : (length = self.wsize - self.wnext, length > offset && (length = offset), ctx.arraySet(self.window, data, y - offset, length, self.wnext), offset -= length, offset ? (ctx.arraySet(self.window, data, y - offset, offset, 0), self.wnext =
				offset, self.whave = self.wsize) : (self.wnext += length, self.wnext === self.wsize && (self.wnext = 0), self.whave < self.wsize && (self.whave += length))), 0;
		}
		/**
		 * @param {Object} that
		 * @param {number} c
		 * @return {?}
		 */
		function init(that, c) {
			var self;
			var text;
			var index;
			var x;
			var y;
			var value;
			var n;
			var flags;
			var l;
			var direction;
			var len;
			var offset;
			var difference;
			var pos;
			var data;
			var mediaBlockCount;
			var position;
			var d;
			var i;
			var currentPosition;
			var start;
			var input;
			var message;
			var e;
			/** @type {number} */
			var Ee = 0;
			var duration = new ctx.Buf8(4);
			/** @type {Array} */
			var match = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
			if (!that || (!that.state || (!that.output || !that.input && 0 !== that.avail_in))) {
				return all;
			}
			self = that.state;
			if (self.mode === mode) {
				/** @type {number} */
				self.mode = _mode;
			}
			y = that.next_out;
			index = that.output;
			n = that.avail_out;
			x = that.next_in;
			text = that.input;
			value = that.avail_in;
			flags = self.hold;
			l = self.bits;
			direction = value;
			len = n;
			/** @type {number} */
			input = FLUSH;
			t: for (;;) {
				switch(self.mode) {
					case type:
						if (0 === self.wrap) {
							self.mode = _mode;
							break;
						}
						for (;16 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if (2 & self.wrap && 35615 === flags) {
							/** @type {number} */
							self.check = 0;
							/** @type {number} */
							duration[0] = 255 & flags;
							/** @type {number} */
							duration[1] = flags >>> 8 & 255;
							self.check = fn(self.check, duration, 2, 0);
							/** @type {number} */
							flags = 0;
							/** @type {number} */
							l = 0;
							self.mode = m;
							break;
						}
						if (self.flags = 0, self.head && (self.head.done = false), !(1 & self.wrap) || (((255 & flags) << 8) + (flags >> 8)) % 31) {
							/** @type {string} */
							that.msg = "incorrect header check";
							self.mode = scrollTop;
							break;
						}
						if ((15 & flags) !== U) {
							/** @type {string} */
							that.msg = "unknown compression method";
							self.mode = scrollTop;
							break;
						}
						if (flags >>>= 4, l -= 4, start = (15 & flags) + 8, 0 === self.wbits) {
							/** @type {number} */
							self.wbits = start;
						} else {
							if (start > self.wbits) {
								/** @type {string} */
								that.msg = "invalid window size";
								self.mode = scrollTop;
								break;
							}
						}
						/** @type {number} */
						self.dmax = 1 << start;
						/** @type {number} */
						that.adler = self.check = 1;
						self.mode = 512 & flags ? key : mode;
						/** @type {number} */
						flags = 0;
						/** @type {number} */
						l = 0;
						break;
					case m:
						for (;16 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if (self.flags = flags, (255 & self.flags) !== U) {
							/** @type {string} */
							that.msg = "unknown compression method";
							self.mode = scrollTop;
							break;
						}
						if (57344 & self.flags) {
							/** @type {string} */
							that.msg = "unknown header flags set";
							self.mode = scrollTop;
							break;
						}
						if (self.head) {
							/** @type {number} */
							self.head.text = flags >> 8 & 1;
						}
						if (512 & self.flags) {
							/** @type {number} */
							duration[0] = 255 & flags;
							/** @type {number} */
							duration[1] = flags >>> 8 & 255;
							self.check = fn(self.check, duration, 2, 0);
						}
						/** @type {number} */
						flags = 0;
						/** @type {number} */
						l = 0;
						self.mode = name;
					case name:
						for (;32 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if (self.head) {
							self.head.time = flags;
						}
						if (512 & self.flags) {
							/** @type {number} */
							duration[0] = 255 & flags;
							/** @type {number} */
							duration[1] = flags >>> 8 & 255;
							/** @type {number} */
							duration[2] = flags >>> 16 & 255;
							/** @type {number} */
							duration[3] = flags >>> 24 & 255;
							self.check = fn(self.check, duration, 4, 0);
						}
						/** @type {number} */
						flags = 0;
						/** @type {number} */
						l = 0;
						self.mode = compassResult;
					case compassResult:
						for (;16 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if (self.head) {
							/** @type {number} */
							self.head.xflags = 255 & flags;
							/** @type {number} */
							self.head.os = flags >> 8;
						}
						if (512 & self.flags) {
							/** @type {number} */
							duration[0] = 255 & flags;
							/** @type {number} */
							duration[1] = flags >>> 8 & 255;
							self.check = fn(self.check, duration, 2, 0);
						}
						/** @type {number} */
						flags = 0;
						/** @type {number} */
						l = 0;
						self.mode = val;
					case val:
						if (1024 & self.flags) {
							for (;16 > l;) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							self.length = flags;
							if (self.head) {
								self.head.extra_len = flags;
							}
							if (512 & self.flags) {
								/** @type {number} */
								duration[0] = 255 & flags;
								/** @type {number} */
								duration[1] = flags >>> 8 & 255;
								self.check = fn(self.check, duration, 2, 0);
							}
							/** @type {number} */
							flags = 0;
							/** @type {number} */
							l = 0;
						} else {
							if (self.head) {
								/** @type {null} */
								self.head.extra = null;
							}
						}
						self.mode = description;
					case description:
						if (1024 & self.flags && (offset = self.length, offset > value && (offset = value), offset && (self.head && (start = self.head.extra_len - self.length, self.head.extra || (self.head.extra = new Array(self.head.extra_len)), ctx.arraySet(self.head.extra, text, x, offset, start)), 512 & self.flags && (self.check = fn(self.check, text, offset, x)), value -= offset, x += offset, self.length -= offset), self.length)) {
							break t;
						}
						/** @type {number} */
						self.length = 0;
						self.mode = user;
					case user:
						if (2048 & self.flags) {
							if (0 === value) {
								break t;
							}
							/** @type {number} */
							offset = 0;
							do {
								start = text[x + offset++];
								if (self.head) {
									if (start) {
										if (self.length < 65536) {
											self.head.name += String.fromCharCode(start);
										}
									}
								}
							} while (start && value > offset);
							if (512 & self.flags && (self.check = fn(self.check, text, offset, x)), value -= offset, x += offset, start) {
								break t;
							}
						} else {
							if (self.head) {
								/** @type {null} */
								self.head.name = null;
							}
						}
						/** @type {number} */
						self.length = 0;
						self.mode = nextSlide;
					case nextSlide:
						if (4096 & self.flags) {
							if (0 === value) {
								break t;
							}
							/** @type {number} */
							offset = 0;
							do {
								start = text[x + offset++];
								if (self.head) {
									if (start) {
										if (self.length < 65536) {
											self.head.comment += String.fromCharCode(start);
										}
									}
								}
							} while (start && value > offset);
							if (512 & self.flags && (self.check = fn(self.check, text, offset, x)), value -= offset, x += offset, start) {
								break t;
							}
						} else {
							if (self.head) {
								/** @type {null} */
								self.head.comment = null;
							}
						}
						self.mode = orig;
					case orig:
						if (512 & self.flags) {
							for (;16 > l;) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							if (flags !== (65535 & self.check)) {
								/** @type {string} */
								that.msg = "header crc mismatch";
								self.mode = scrollTop;
								break;
							}
							/** @type {number} */
							flags = 0;
							/** @type {number} */
							l = 0;
						}
						if (self.head) {
							/** @type {number} */
							self.head.hcrc = self.flags >> 9 & 1;
							/** @type {boolean} */
							self.head.done = true;
						}
						/** @type {number} */
						that.adler = self.check = 0;
						self.mode = mode;
						break;
					case key:
						for (;32 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						that.adler = self.check = _(flags);
						/** @type {number} */
						flags = 0;
						/** @type {number} */
						l = 0;
						self.mode = theTitle;
					case theTitle:
						if (0 === self.havedict) {
							return that.next_out = y, that.avail_out = n, that.next_in = x, that.avail_in = value, self.hold = flags, self.bits = l, z;
						}
						/** @type {number} */
						that.adler = self.check = 1;
						self.mode = mode;
					case mode:
						if (c === seperator || c === close) {
							break t;
						}
						;
					case _mode:
						if (self.last) {
							flags >>>= 7 & l;
							l -= 7 & l;
							self.mode = setmode;
							break;
						}
						for (;3 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						switch(self.last = 1 & flags, flags >>>= 1, l -= 1, 3 & flags) {
							case 0:
								self.mode = out;
								break;
							case 1:
								if (sendMessage(self), self.mode = slide, c === close) {
									flags >>>= 2;
									l -= 2;
									break t;
								}
								break;
							case 2:
								self.mode = theText;
								break;
							case 3:
								/** @type {string} */
								that.msg = "invalid block type";
								self.mode = scrollTop;
						}
						flags >>>= 2;
						l -= 2;
						break;
					case out:
						flags >>>= 7 & l;
						l -= 7 & l;
						for (;32 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if ((65535 & flags) !== (flags >>> 16 ^ 65535)) {
							/** @type {string} */
							that.msg = "invalid stored block lengths";
							self.mode = scrollTop;
							break;
						}
						if (self.length = 65535 & flags, flags = 0, l = 0, self.mode = MOUSE_MODE_WRAP, c === close) {
							break t;
						}
						;
					case MOUSE_MODE_WRAP:
						self.mode = ex;
					case ex:
						if (offset = self.length) {
							if (offset > value && (offset = value), offset > n && (offset = n), 0 === offset) {
								break t;
							}
							ctx.arraySet(index, text, x, offset, y);
							value -= offset;
							x += offset;
							n -= offset;
							y += offset;
							self.length -= offset;
							break;
						}
						self.mode = mode;
						break;
					case theText:
						for (;14 > l;) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if (self.nlen = (31 & flags) + 257, flags >>>= 5, l -= 5, self.ndist = (31 & flags) + 1, flags >>>= 5, l -= 5, self.ncode = (15 & flags) + 4, flags >>>= 4, l -= 4, self.nlen > 286 || self.ndist > 30) {
							/** @type {string} */
							that.msg = "too many length or distance symbols";
							self.mode = scrollTop;
							break;
						}
						/** @type {number} */
						self.have = 0;
						self.mode = tmp;
					case tmp:
						for (;self.have < self.ncode;) {
							for (;3 > l;) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							/** @type {number} */
							self.lens[match[self.have++]] = 7 & flags;
							flags >>>= 3;
							l -= 3;
						}
						for (;self.have < 19;) {
							/** @type {number} */
							self.lens[match[self.have++]] = 0;
						}
						if (self.lencode = self.lendyn, self.lenbits = 7, message = {
								bits : self.lenbits
							}, input = debug(E, self.lens, 0, 19, self.lencode, 0, self.work, message), self.lenbits = message.bits, input) {
							/** @type {string} */
							that.msg = "invalid code lengths set";
							self.mode = scrollTop;
							break;
						}
						/** @type {number} */
						self.have = 0;
						self.mode = contact;
					case contact:
						for (;self.have < self.nlen + self.ndist;) {
							for (;Ee = self.lencode[flags & (1 << self.lenbits) - 1], data = Ee >>> 24, mediaBlockCount = Ee >>> 16 & 255, position = 65535 & Ee, !(l >= data);) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							if (16 > position) {
								flags >>>= data;
								l -= data;
								/** @type {number} */
								self.lens[self.have++] = position;
							} else {
								if (16 === position) {
									/** @type {number} */
									e = data + 2;
									for (;e > l;) {
										if (0 === value) {
											break t;
										}
										value--;
										flags += text[x++] << l;
										l += 8;
									}
									if (flags >>>= data, l -= data, 0 === self.have) {
										/** @type {string} */
										that.msg = "invalid bit length repeat";
										self.mode = scrollTop;
										break;
									}
									start = self.lens[self.have - 1];
									/** @type {number} */
									offset = 3 + (3 & flags);
									flags >>>= 2;
									l -= 2;
								} else {
									if (17 === position) {
										/** @type {number} */
										e = data + 3;
										for (;e > l;) {
											if (0 === value) {
												break t;
											}
											value--;
											flags += text[x++] << l;
											l += 8;
										}
										flags >>>= data;
										l -= data;
										/** @type {number} */
										start = 0;
										/** @type {number} */
										offset = 3 + (7 & flags);
										flags >>>= 3;
										l -= 3;
									} else {
										/** @type {number} */
										e = data + 7;
										for (;e > l;) {
											if (0 === value) {
												break t;
											}
											value--;
											flags += text[x++] << l;
											l += 8;
										}
										flags >>>= data;
										l -= data;
										/** @type {number} */
										start = 0;
										/** @type {number} */
										offset = 11 + (127 & flags);
										flags >>>= 7;
										l -= 7;
									}
								}
								if (self.have + offset > self.nlen + self.ndist) {
									/** @type {string} */
									that.msg = "invalid bit length repeat";
									self.mode = scrollTop;
									break;
								}
								for (;offset--;) {
									self.lens[self.have++] = start;
								}
							}
						}
						if (self.mode === scrollTop) {
							break;
						}
						if (0 === self.lens[256]) {
							/** @type {string} */
							that.msg = "invalid code -- missing end-of-block";
							self.mode = scrollTop;
							break;
						}
						if (self.lenbits = 9, message = {
								bits : self.lenbits
							}, input = debug(isArray, self.lens, 0, self.nlen, self.lencode, 0, self.work, message), self.lenbits = message.bits, input) {
							/** @type {string} */
							that.msg = "invalid literal/lengths set";
							self.mode = scrollTop;
							break;
						}
						if (self.distbits = 6, self.distcode = self.distdyn, message = {
								bits : self.distbits
							}, input = debug(RDS1, self.lens, self.nlen, self.ndist, self.distcode, 0, self.work, message), self.distbits = message.bits, input) {
							/** @type {string} */
							that.msg = "invalid distances set";
							self.mode = scrollTop;
							break;
						}
						if (self.mode = slide, c === close) {
							break t;
						}
						;
					case slide:
						self.mode = uid;
					case uid:
						if (value >= 6 && n >= 258) {
							that.next_out = y;
							that.avail_out = n;
							that.next_in = x;
							that.avail_in = value;
							self.hold = flags;
							self.bits = l;
							log(that, len);
							y = that.next_out;
							index = that.output;
							n = that.avail_out;
							x = that.next_in;
							text = that.input;
							value = that.avail_in;
							flags = self.hold;
							l = self.bits;
							if (self.mode === mode) {
								/** @type {number} */
								self.back = -1;
							}
							break;
						}
						/** @type {number} */
						self.back = 0;
						for (;Ee = self.lencode[flags & (1 << self.lenbits) - 1], data = Ee >>> 24, mediaBlockCount = Ee >>> 16 & 255, position = 65535 & Ee, !(l >= data);) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if (mediaBlockCount && 0 === (240 & mediaBlockCount)) {
							/** @type {number} */
							d = data;
							/** @type {number} */
							i = mediaBlockCount;
							/** @type {number} */
							currentPosition = position;
							for (;Ee = self.lencode[currentPosition + ((flags & (1 << d + i) - 1) >> d)], data = Ee >>> 24, mediaBlockCount = Ee >>> 16 & 255, position = 65535 & Ee, !(l >= d + data);) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							flags >>>= d;
							l -= d;
							self.back += d;
						}
						if (flags >>>= data, l -= data, self.back += data, self.length = position, 0 === mediaBlockCount) {
							self.mode = originalId;
							break;
						}
						if (32 & mediaBlockCount) {
							/** @type {number} */
							self.back = -1;
							self.mode = mode;
							break;
						}
						if (64 & mediaBlockCount) {
							/** @type {string} */
							that.msg = "invalid literal/length code";
							self.mode = scrollTop;
							break;
						}
						/** @type {number} */
						self.extra = 15 & mediaBlockCount;
						self.mode = _server;
					case _server:
						if (self.extra) {
							e = self.extra;
							for (;e > l;) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							self.length += flags & (1 << self.extra) - 1;
							flags >>>= self.extra;
							l -= self.extra;
							self.back += self.extra;
						}
						self.was = self.length;
						self.mode = Y;
					case Y:
						for (;Ee = self.distcode[flags & (1 << self.distbits) - 1], data = Ee >>> 24, mediaBlockCount = Ee >>> 16 & 255, position = 65535 & Ee, !(l >= data);) {
							if (0 === value) {
								break t;
							}
							value--;
							flags += text[x++] << l;
							l += 8;
						}
						if (0 === (240 & mediaBlockCount)) {
							/** @type {number} */
							d = data;
							/** @type {number} */
							i = mediaBlockCount;
							/** @type {number} */
							currentPosition = position;
							for (;Ee = self.distcode[currentPosition + ((flags & (1 << d + i) - 1) >> d)], data = Ee >>> 24, mediaBlockCount = Ee >>> 16 & 255, position = 65535 & Ee, !(l >= d + data);) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							flags >>>= d;
							l -= d;
							self.back += d;
						}
						if (flags >>>= data, l -= data, self.back += data, 64 & mediaBlockCount) {
							/** @type {string} */
							that.msg = "invalid distance code";
							self.mode = scrollTop;
							break;
						}
						/** @type {number} */
						self.offset = position;
						/** @type {number} */
						self.extra = 15 & mediaBlockCount;
						self.mode = fd;
					case fd:
						if (self.extra) {
							e = self.extra;
							for (;e > l;) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							self.offset += flags & (1 << self.extra) - 1;
							flags >>>= self.extra;
							l -= self.extra;
							self.back += self.extra;
						}
						if (self.offset > self.dmax) {
							/** @type {string} */
							that.msg = "invalid distance too far back";
							self.mode = scrollTop;
							break;
						}
						self.mode = cfg;
					case cfg:
						if (0 === n) {
							break t;
						}
						if (offset = len - n, self.offset > offset) {
							if (offset = self.offset - offset, offset > self.whave && self.sane) {
								/** @type {string} */
								that.msg = "invalid distance too far back";
								self.mode = scrollTop;
								break;
							}
							if (offset > self.wnext) {
								offset -= self.wnext;
								/** @type {number} */
								difference = self.wsize - offset;
							} else {
								/** @type {number} */
								difference = self.wnext - offset;
							}
							if (offset > self.length) {
								offset = self.length;
							}
							pos = self.window;
						} else {
							pos = index;
							/** @type {number} */
							difference = y - self.offset;
							offset = self.length;
						}
						if (offset > n) {
							offset = n;
						}
						n -= offset;
						self.length -= offset;
						do {
							index[y++] = pos[difference++];
						} while (--offset);
						if (0 === self.length) {
							self.mode = uid;
						}
						break;
					case originalId:
						if (0 === n) {
							break t;
						}
						index[y++] = self.length;
						n--;
						self.mode = uid;
						break;
					case setmode:
						if (self.wrap) {
							for (;32 > l;) {
								if (0 === value) {
									break t;
								}
								value--;
								flags |= text[x++] << l;
								l += 8;
							}
							if (len -= n, that.total_out += len, self.total += len, len && (that.adler = self.check = self.flags ? fn(self.check, index, len, y - len) : cb(self.check, index, len, y - len)), len = n, (self.flags ? flags : _(flags)) !== self.check) {
								/** @type {string} */
								that.msg = "incorrect data check";
								self.mode = scrollTop;
								break;
							}
							/** @type {number} */
							flags = 0;
							/** @type {number} */
							l = 0;
						}
						self.mode = header;
					case header:
						if (self.wrap && self.flags) {
							for (;32 > l;) {
								if (0 === value) {
									break t;
								}
								value--;
								flags += text[x++] << l;
								l += 8;
							}
							if (flags !== (4294967295 & self.total)) {
								/** @type {string} */
								that.msg = "incorrect length check";
								self.mode = scrollTop;
								break;
							}
							/** @type {number} */
							flags = 0;
							/** @type {number} */
							l = 0;
						}
						/** @type {number} */
						self.mode = src;
					case src:
						/** @type {number} */
						input = split;
						break t;
					case scrollTop:
						/** @type {number} */
						input = ban_circle;
						break t;
					case a:
						return o;
					case ce:
						;
					default:
						return all;
				}
			}
			return that.next_out = y, that.avail_out = n, that.next_in = x, that.avail_in = value, self.hold = flags, self.bits = l, (self.wsize || len !== that.avail_out && (self.mode < scrollTop && (self.mode < setmode || c !== q))) && callback(that, that.output, that.next_out, len - that.avail_out) ? (self.mode = a, o) : (direction -= that.avail_in, len -= that.avail_out, that.total_in += direction, that.total_out += len, self.total += len, self.wrap && (len && (that.adler = self.check = self.flags ?
				fn(self.check, index, len, that.next_out - len) : cb(self.check, index, len, that.next_out - len))), that.data_type = self.bits + (self.last ? 64 : 0) + (self.mode === mode ? 128 : 0) + (self.mode === slide || self.mode === MOUSE_MODE_WRAP ? 256 : 0), (0 === direction && 0 === len || c === q) && (input === FLUSH && (input = s)), input);
		}
		/**
		 * @param {Object} context
		 * @return {?}
		 */
		function getAll(context) {
			if (!context || !context.state) {
				return all;
			}
			var data = context.state;
			return data.window && (data.window = null), context.state = null, FLUSH;
		}
		/**
		 * @param {Object} config
		 * @param {Object} test
		 * @return {?}
		 */
		function load(config, test) {
			var node;
			return config && config.state ? (node = config.state, 0 === (2 & node.wrap) ? all : (node.head = test, test.done = false, FLUSH)) : all;
		}
		var buf;
		var hdl;
		var ctx = $("../utils/common");
		var cb = $("./adler32");
		var fn = $("./crc32");
		var log = $("./inffast");
		var debug = $("./inftrees");
		/** @type {number} */
		var E = 0;
		/** @type {number} */
		var isArray = 1;
		/** @type {number} */
		var RDS1 = 2;
		/** @type {number} */
		var q = 4;
		/** @type {number} */
		var seperator = 5;
		/** @type {number} */
		var close = 6;
		/** @type {number} */
		var FLUSH = 0;
		/** @type {number} */
		var split = 1;
		/** @type {number} */
		var z = 2;
		/** @type {number} */
		var all = -2;
		/** @type {number} */
		var ban_circle = -3;
		/** @type {number} */
		var o = -4;
		/** @type {number} */
		var s = -5;
		/** @type {number} */
		var U = 8;
		/** @type {number} */
		var type = 1;
		/** @type {number} */
		var m = 2;
		/** @type {number} */
		var name = 3;
		/** @type {number} */
		var compassResult = 4;
		/** @type {number} */
		var val = 5;
		/** @type {number} */
		var description = 6;
		/** @type {number} */
		var user = 7;
		/** @type {number} */
		var nextSlide = 8;
		/** @type {number} */
		var orig = 9;
		/** @type {number} */
		var key = 10;
		/** @type {number} */
		var theTitle = 11;
		/** @type {number} */
		var mode = 12;
		/** @type {number} */
		var _mode = 13;
		/** @type {number} */
		var out = 14;
		/** @type {number} */
		var MOUSE_MODE_WRAP = 15;
		/** @type {number} */
		var ex = 16;
		/** @type {number} */
		var theText = 17;
		/** @type {number} */
		var tmp = 18;
		/** @type {number} */
		var contact = 19;
		/** @type {number} */
		var slide = 20;
		/** @type {number} */
		var uid = 21;
		/** @type {number} */
		var _server = 22;
		/** @type {number} */
		var Y = 23;
		/** @type {number} */
		var fd = 24;
		/** @type {number} */
		var cfg = 25;
		/** @type {number} */
		var originalId = 26;
		/** @type {number} */
		var setmode = 27;
		/** @type {number} */
		var header = 28;
		/** @type {number} */
		var src = 29;
		/** @type {number} */
		var scrollTop = 30;
		/** @type {number} */
		var a = 31;
		/** @type {number} */
		var ce = 32;
		/** @type {number} */
		var value = 852;
		/** @type {number} */
		var distdyn = 592;
		/** @type {number} */
		var lineStart = 15;
		/** @type {number} */
		var j = lineStart;
		/** @type {boolean} */
		var be = true;
		/** @type {function (Object): ?} */
		exports.inflateReset = reset;
		/** @type {function (Object, number): ?} */
		exports.inflateReset2 = process;
		/** @type {function (Object): ?} */
		exports.inflateResetKeep = remove;
		/** @type {function (Object): ?} */
		exports.inflateInit = update;
		/** @type {function (Object, number): ?} */
		exports.inflateInit2 = clear;
		/** @type {function (Object, number): ?} */
		exports.inflate = init;
		/** @type {function (Object): ?} */
		exports.inflateEnd = getAll;
		/** @type {function (Object, Object): ?} */
		exports.inflateGetHeader = load;
		/** @type {string} */
		exports.inflateInfo = "pako inflate (from Nodeca project)";
	}, {
		"../utils/common" : 41,
		"./adler32" : 43,
		"./crc32" : 45,
		"./inffast" : 48,
		"./inftrees" : 50
	}],
	50 : [function(require, module) {
		var Block = require("../utils/common");
		/** @type {number} */
		var a = 15;
		/** @type {number} */
		var maxAllowed = 852;
		/** @type {number} */
		var max = 592;
		/** @type {number} */
		var UNDEF = 0;
		/** @type {number} */
		var needle = 1;
		/** @type {number} */
		var _win = 2;
		/** @type {Array} */
		var _callbacks = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
		/** @type {Array} */
		var returnFalse = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78];
		/** @type {Array} */
		var listener = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0];
		/** @type {Array} */
		var tmp = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
		/**
		 * @param {number} val
		 * @param {?} arr
		 * @param {number} start
		 * @param {number} size
		 * @param {(Array|Element)} ctx
		 * @param {number} step
		 * @param {Object} options
		 * @param {?} message
		 * @return {?}
		 */
		module.exports = function(val, arr, start, size, ctx, step, options, message) {
			var chunk;
			var name;
			var comp;
			var k;
			var n;
			var out;
			var s;
			var func;
			var option;
			var error = message.bits;
			/** @type {number} */
			var b = 0;
			/** @type {number} */
			var i = 0;
			/** @type {number} */
			var r = 0;
			/** @type {number} */
			var type = 0;
			/** @type {number} */
			var msg = 0;
			/** @type {number} */
			var dropTop = 0;
			/** @type {number} */
			var dropHeight = 0;
			/** @type {number} */
			var x = 0;
			/** @type {number} */
			var len = 0;
			/** @type {number} */
			var d = 0;
			/** @type {null} */
			var callbacks = null;
			/** @type {number} */
			var _ = 0;
			var result = new Block.Buf16(a + 1);
			var c = new Block.Buf16(a + 1);
			/** @type {null} */
			var fn = null;
			/** @type {number} */
			var j = 0;
			/** @type {number} */
			b = 0;
			for (;a >= b;b++) {
				/** @type {number} */
				result[b] = 0;
			}
			/** @type {number} */
			i = 0;
			for (;size > i;i++) {
				result[arr[start + i]]++;
			}
			msg = error;
			/** @type {number} */
			type = a;
			for (;type >= 1 && 0 === result[type];type--) {
			}
			if (msg > type && (msg = type), 0 === type) {
				return ctx[step++] = 20971520, ctx[step++] = 20971520, message.bits = 1, 0;
			}
			/** @type {number} */
			r = 1;
			for (;type > r && 0 === result[r];r++) {
			}
			if (r > msg) {
				/** @type {number} */
				msg = r;
			}
			/** @type {number} */
			x = 1;
			/** @type {number} */
			b = 1;
			for (;a >= b;b++) {
				if (x <<= 1, x -= result[b], 0 > x) {
					return-1;
				}
			}
			if (x > 0 && (val === UNDEF || 1 !== type)) {
				return-1;
			}
			/** @type {number} */
			c[1] = 0;
			/** @type {number} */
			b = 1;
			for (;a > b;b++) {
				c[b + 1] = c[b] + result[b];
			}
			/** @type {number} */
			i = 0;
			for (;size > i;i++) {
				if (0 !== arr[start + i]) {
					/** @type {number} */
					options[c[arr[start + i]]++] = i;
				}
			}
			if (val === UNDEF ? (callbacks = fn = options, out = 19) : val === needle ? (callbacks = _callbacks, _ -= 257, fn = returnFalse, j -= 257, out = 256) : (callbacks = listener, fn = tmp, out = -1), d = 0, i = 0, b = r, n = step, dropTop = msg, dropHeight = 0, comp = -1, len = 1 << msg, k = len - 1, val === needle && len > maxAllowed || val === _win && len > max) {
				return 1;
			}
			/** @type {number} */
			var H = 0;
			for (;;) {
				H++;
				/** @type {number} */
				s = b - dropHeight;
				if (options[i] < out) {
					/** @type {number} */
					func = 0;
					option = options[i];
				} else {
					if (options[i] > out) {
						func = fn[j + options[i]];
						option = callbacks[_ + options[i]];
					} else {
						/** @type {number} */
						func = 96;
						/** @type {number} */
						option = 0;
					}
				}
				/** @type {number} */
				chunk = 1 << b - dropHeight;
				/** @type {number} */
				name = 1 << dropTop;
				/** @type {number} */
				r = name;
				do {
					name -= chunk;
					/** @type {number} */
					ctx[n + (d >> dropHeight) + name] = s << 24 | func << 16 | option | 0;
				} while (0 !== name);
				/** @type {number} */
				chunk = 1 << b - 1;
				for (;d & chunk;) {
					chunk >>= 1;
				}
				if (0 !== chunk ? (d &= chunk - 1, d += chunk) : d = 0, i++, 0 === --result[b]) {
					if (b === type) {
						break;
					}
					b = arr[start + options[i]];
				}
				if (b > msg && (d & k) !== comp) {
					if (0 === dropHeight) {
						dropHeight = msg;
					}
					n += r;
					/** @type {number} */
					dropTop = b - dropHeight;
					/** @type {number} */
					x = 1 << dropTop;
					for (;type > dropTop + dropHeight && (x -= result[dropTop + dropHeight], !(0 >= x));) {
						dropTop++;
						x <<= 1;
					}
					if (len += 1 << dropTop, val === needle && len > maxAllowed || val === _win && len > max) {
						return 1;
					}
					/** @type {number} */
					comp = d & k;
					/** @type {number} */
					ctx[comp] = msg << 24 | dropTop << 16 | n - step | 0;
				}
			}
			return 0 !== d && (ctx[n + d] = b - dropHeight << 24 | 64 << 16 | 0), message.bits = msg, 0;
		};
	}, {
		"../utils/common" : 41
	}],
	51 : [function(dataAndEvents, module) {
		module.exports = {
			2 : "need dictionary",
			1 : "stream end",
			0 : "",
			"-1" : "file error",
			"-2" : "stream error",
			"-3" : "data error",
			"-4" : "insufficient memory",
			"-5" : "buffer error",
			"-6" : "incompatible version"
		};
	}, {}],
	52 : [function(require, dataAndEvents, exports) {
		/**
		 * @param {Array} a
		 * @return {undefined}
		 */
		function expect(a) {
			var al = a.length;
			for (;--al >= 0;) {
				/** @type {number} */
				a[al] = 0;
			}
		}
		/**
		 * @param {number} key
		 * @return {?}
		 */
		function fn(key) {
			return 256 > key ? coords[key] : coords[256 + (key >>> 7)];
		}
		/**
		 * @param {Object} fn
		 * @param {number} x
		 * @return {undefined}
		 */
		function $(fn, x) {
			/** @type {number} */
			fn.pending_buf[fn.pending++] = 255 & x;
			/** @type {number} */
			fn.pending_buf[fn.pending++] = x >>> 8 & 255;
		}
		/**
		 * @param {Object} fn
		 * @param {number} endpoint
		 * @param {number} opt_attributes
		 * @return {undefined}
		 */
		function bind(fn, endpoint, opt_attributes) {
			if (fn.bi_valid > bi_valid - opt_attributes) {
				fn.bi_buf |= endpoint << fn.bi_valid & 65535;
				$(fn, fn.bi_buf);
				/** @type {number} */
				fn.bi_buf = endpoint >> bi_valid - fn.bi_valid;
				fn.bi_valid += opt_attributes - bi_valid;
			} else {
				fn.bi_buf |= endpoint << fn.bi_valid & 65535;
				fn.bi_valid += opt_attributes;
			}
		}
		/**
		 * @param {Object} fn
		 * @param {number} o
		 * @param {Array} args
		 * @return {undefined}
		 */
		function callback(fn, o, args) {
			bind(fn, args[2 * o], args[2 * o + 1]);
		}
		/**
		 * @param {number} keepData
		 * @param {number} string
		 * @return {?}
		 */
		function enc(keepData, string) {
			/** @type {number} */
			var n = 0;
			do {
				n |= 1 & keepData;
				keepData >>>= 1;
				n <<= 1;
			} while (--string > 0);
			return n >>> 1;
		}
		/**
		 * @param {Object} that
		 * @return {undefined}
		 */
		function eq(that) {
			if (16 === that.bi_valid) {
				$(that, that.bi_buf);
				/** @type {number} */
				that.bi_buf = 0;
				/** @type {number} */
				that.bi_valid = 0;
			} else {
				if (that.bi_valid >= 8) {
					/** @type {number} */
					that.pending_buf[that.pending++] = 255 & that.bi_buf;
					that.bi_buf >>= 8;
					that.bi_valid -= 8;
				}
			}
		}
		/**
		 * @param {Object} s
		 * @param {?} that
		 * @return {undefined}
		 */
		function zip_gen_bitlen(s, that) {
			var h;
			var n;
			var value;
			var bits;
			var xbits;
			var f;
			var tree = that.dyn_tree;
			var max = that.max_code;
			var stree = that.stat_desc.static_tree;
			var has_stree = that.stat_desc.has_stree;
			var extra = that.stat_desc.extra_bits;
			var base = that.stat_desc.extra_base;
			var max_length = that.stat_desc.max_length;
			/** @type {number} */
			var g = 0;
			/** @type {number} */
			bits = 0;
			for (;l >= bits;bits++) {
				/** @type {number} */
				s.bl_count[bits] = 0;
			}
			/** @type {number} */
			tree[2 * s.heap[s.heap_max] + 1] = 0;
			h = s.heap_max + 1;
			for (;HEAP_SIZE > h;h++) {
				n = s.heap[h];
				bits = tree[2 * tree[2 * n + 1] + 1] + 1;
				if (bits > max_length) {
					bits = max_length;
					g++;
				}
				tree[2 * n + 1] = bits;
				if (!(n > max)) {
					s.bl_count[bits]++;
					/** @type {number} */
					xbits = 0;
					if (n >= base) {
						xbits = extra[n - base];
					}
					f = tree[2 * n];
					s.opt_len += f * (bits + xbits);
					if (has_stree) {
						s.static_len += f * (stree[2 * n + 1] + xbits);
					}
				}
			}
			if (0 !== g) {
				do {
					/** @type {number} */
					bits = max_length - 1;
					for (;0 === s.bl_count[bits];) {
						bits--;
					}
					s.bl_count[bits]--;
					s.bl_count[bits + 1] += 2;
					s.bl_count[max_length]--;
					g -= 2;
				} while (g > 0);
				bits = max_length;
				for (;0 !== bits;bits--) {
					n = s.bl_count[bits];
					for (;0 !== n;) {
						value = s.heap[--h];
						if (!(value > max)) {
							if (tree[2 * value + 1] !== bits) {
								s.opt_len += (bits - tree[2 * value + 1]) * tree[2 * value];
								tree[2 * value + 1] = bits;
							}
							n--;
						}
					}
				}
			}
		}
		/**
		 * @param {Array} obj
		 * @param {number} index
		 * @param {Array} n
		 * @return {undefined}
		 */
		function serialize(obj, index, n) {
			var i;
			var inputLength;
			/** @type {Array} */
			var options = new Array(l + 1);
			/** @type {number} */
			var v = 0;
			/** @type {number} */
			i = 1;
			for (;l >= i;i++) {
				/** @type {number} */
				options[i] = v = v + n[i - 1] << 1;
			}
			/** @type {number} */
			inputLength = 0;
			for (;index >= inputLength;inputLength++) {
				var className = obj[2 * inputLength + 1];
				if (0 !== className) {
					obj[2 * inputLength] = enc(options[className]++, className);
				}
			}
		}
		/**
		 * @return {undefined}
		 */
		function submit() {
			var name;
			var r;
			var args;
			var k;
			var v;
			/** @type {Array} */
			var i = new Array(l + 1);
			/** @type {number} */
			args = 0;
			/** @type {number} */
			k = 0;
			for (;length - 1 > k;k++) {
				/** @type {number} */
				results[k] = args;
				/** @type {number} */
				name = 0;
				for (;name < 1 << tags[k];name++) {
					/** @type {number} */
					map[args++] = k;
				}
			}
			/** @type {number} */
			map[args - 1] = k;
			/** @type {number} */
			v = 0;
			/** @type {number} */
			k = 0;
			for (;16 > k;k++) {
				/** @type {number} */
				cache[k] = v;
				/** @type {number} */
				name = 0;
				for (;name < 1 << _ref1[k];name++) {
					/** @type {number} */
					coords[v++] = k;
				}
			}
			v >>= 7;
			for (;cols > k;k++) {
				/** @type {number} */
				cache[k] = v << 7;
				/** @type {number} */
				name = 0;
				for (;name < 1 << _ref1[k] - 7;name++) {
					/** @type {number} */
					coords[256 + v++] = k;
				}
			}
			/** @type {number} */
			r = 0;
			for (;l >= r;r++) {
				/** @type {number} */
				i[r] = 0;
			}
			/** @type {number} */
			name = 0;
			for (;143 >= name;) {
				/** @type {number} */
				params[2 * name + 1] = 8;
				name++;
				i[8]++;
			}
			for (;255 >= name;) {
				/** @type {number} */
				params[2 * name + 1] = 9;
				name++;
				i[9]++;
			}
			for (;279 >= name;) {
				/** @type {number} */
				params[2 * name + 1] = 7;
				name++;
				i[7]++;
			}
			for (;287 >= name;) {
				/** @type {number} */
				params[2 * name + 1] = 8;
				name++;
				i[8]++;
			}
			serialize(params, end + 1, i);
			/** @type {number} */
			name = 0;
			for (;cols > name;name++) {
				/** @type {number} */
				obj[2 * name + 1] = 5;
				obj[2 * name] = enc(name, 5);
			}
			l_desc = new DeflateTreeDesc(params, tags, len + 1, end, l);
			d_desc = new DeflateTreeDesc(obj, _ref1, 0, cols, l);
			size = new DeflateTreeDesc(new Array(0), height, 0, count, Y);
		}
		/**
		 * @param {Object} s
		 * @return {undefined}
		 */
		function resolve(s) {
			var max;
			/** @type {number} */
			max = 0;
			for (;end > max;max++) {
				/** @type {number} */
				s.dyn_ltree[2 * max] = 0;
			}
			/** @type {number} */
			max = 0;
			for (;cols > max;max++) {
				/** @type {number} */
				s.dyn_dtree[2 * max] = 0;
			}
			/** @type {number} */
			max = 0;
			for (;count > max;max++) {
				/** @type {number} */
				s.bl_tree[2 * max] = 0;
			}
			/** @type {number} */
			s.dyn_ltree[2 * ex] = 1;
			/** @type {number} */
			s.opt_len = s.static_len = 0;
			/** @type {number} */
			s.last_lit = s.matches = 0;
		}
		/**
		 * @param {Object} that
		 * @return {undefined}
		 */
		function isReady(that) {
			if (that.bi_valid > 8) {
				$(that, that.bi_buf);
			} else {
				if (that.bi_valid > 0) {
					that.pending_buf[that.pending++] = that.bi_buf;
				}
			}
			/** @type {number} */
			that.bi_buf = 0;
			/** @type {number} */
			that.bi_valid = 0;
		}
		/**
		 * @param {Object} that
		 * @param {number} name
		 * @param {number} len
		 * @param {boolean} dataAndEvents
		 * @return {undefined}
		 */
		function test(that, name, len, dataAndEvents) {
			isReady(that);
			if (dataAndEvents) {
				$(that, len);
				$(that, ~len);
			}
			fs.arraySet(that.pending_buf, that.window, name, len, that.pending);
			that.pending += len;
		}
		/**
		 * @param {Array} array
		 * @param {number} n
		 * @param {number} m
		 * @param {Array} depth
		 * @return {?}
		 */
		function smaller(array, n, m, depth) {
			/** @type {number} */
			var i = 2 * n;
			/** @type {number} */
			var j = 2 * m;
			return array[i] < array[j] || array[i] === array[j] && depth[n] <= depth[m];
		}
		/**
		 * @param {Object} s
		 * @param {Array} selector
		 * @param {number} k
		 * @return {undefined}
		 */
		function next(s, selector, k) {
			var v = s.heap[k];
			/** @type {number} */
			var j = k << 1;
			for (;j <= s.heap_len && (j < s.heap_len && (smaller(selector, s.heap[j + 1], s.heap[j], s.depth) && j++), !smaller(selector, v, s.heap[j], s.depth));) {
				s.heap[k] = s.heap[j];
				/** @type {number} */
				k = j;
				j <<= 1;
			}
			s.heap[k] = v;
		}
		/**
		 * @param {Object} that
		 * @param {Array} arg
		 * @param {Array} prop
		 * @return {undefined}
		 */
		function extend(that, arg, prop) {
			var context;
			var name;
			var index;
			var tag;
			/** @type {number} */
			var i = 0;
			if (0 !== that.last_lit) {
				do {
					/** @type {number} */
					context = that.pending_buf[that.d_buf + 2 * i] << 8 | that.pending_buf[that.d_buf + 2 * i + 1];
					name = that.pending_buf[that.l_buf + i];
					i++;
					if (0 === context) {
						callback(that, name, arg);
					} else {
						index = map[name];
						callback(that, index + len + 1, arg);
						tag = tags[index];
						if (0 !== tag) {
							name -= results[index];
							bind(that, name, tag);
						}
						context--;
						index = fn(context);
						callback(that, index, prop);
						tag = _ref1[index];
						if (0 !== tag) {
							context -= cache[index];
							bind(that, context, tag);
						}
					}
				} while (i < that.last_lit);
			}
			callback(that, ex, arg);
		}
		/**
		 * @param {Object} s
		 * @param {?} that
		 * @return {undefined}
		 */
		function gen_bitlen(s, that) {
			var n;
			var m;
			var node;
			var tree = that.dyn_tree;
			var stree = that.stat_desc.static_tree;
			var has_stree = that.stat_desc.has_stree;
			var elems = that.stat_desc.elems;
			/** @type {number} */
			var value = -1;
			/** @type {number} */
			s.heap_len = 0;
			/** @type {number} */
			s.heap_max = HEAP_SIZE;
			/** @type {number} */
			n = 0;
			for (;elems > n;n++) {
				if (0 !== tree[2 * n]) {
					/** @type {number} */
					s.heap[++s.heap_len] = value = n;
					/** @type {number} */
					s.depth[n] = 0;
				} else {
					/** @type {number} */
					tree[2 * n + 1] = 0;
				}
			}
			for (;s.heap_len < 2;) {
				/** @type {number} */
				node = s.heap[++s.heap_len] = 2 > value ? ++value : 0;
				/** @type {number} */
				tree[2 * node] = 1;
				/** @type {number} */
				s.depth[node] = 0;
				s.opt_len--;
				if (has_stree) {
					s.static_len -= stree[2 * node + 1];
				}
			}
			/** @type {number} */
			that.max_code = value;
			/** @type {number} */
			n = s.heap_len >> 1;
			for (;n >= 1;n--) {
				next(s, tree, n);
			}
			node = elems;
			do {
				n = s.heap[1];
				s.heap[1] = s.heap[s.heap_len--];
				next(s, tree, 1);
				m = s.heap[1];
				s.heap[--s.heap_max] = n;
				s.heap[--s.heap_max] = m;
				tree[2 * node] = tree[2 * n] + tree[2 * m];
				s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
				tree[2 * n + 1] = tree[2 * m + 1] = node;
				/** @type {number} */
				s.heap[1] = node++;
				next(s, tree, 1);
			} while (s.heap_len >= 2);
			s.heap[--s.heap_max] = s.heap[1];
			zip_gen_bitlen(s, that);
			serialize(tree, value, s.bl_count);
		}
		/**
		 * @param {Object} fn
		 * @param {Array} elems
		 * @param {number} days
		 * @return {undefined}
		 */
		function addEvents(fn, elems, days) {
			var daysInMonth;
			var node;
			/** @type {number} */
			var context = -1;
			var elem = elems[1];
			/** @type {number} */
			var b = 0;
			/** @type {number} */
			var nodeListLen = 7;
			/** @type {number} */
			var a = 4;
			if (0 === elem) {
				/** @type {number} */
				nodeListLen = 138;
				/** @type {number} */
				a = 3;
			}
			/** @type {number} */
			elems[2 * (days + 1) + 1] = 65535;
			/** @type {number} */
			daysInMonth = 0;
			for (;days >= daysInMonth;daysInMonth++) {
				node = elem;
				elem = elems[2 * (daysInMonth + 1) + 1];
				if (!(++b < nodeListLen && node === elem)) {
					if (a > b) {
						fn.bl_tree[2 * node] += b;
					} else {
						if (0 !== node) {
							if (node !== context) {
								fn.bl_tree[2 * node]++;
							}
							fn.bl_tree[2 * res]++;
						} else {
							if (10 >= b) {
								fn.bl_tree[2 * result]++;
							} else {
								fn.bl_tree[2 * index]++;
							}
						}
					}
					/** @type {number} */
					b = 0;
					context = node;
					if (0 === elem) {
						/** @type {number} */
						nodeListLen = 138;
						/** @type {number} */
						a = 3;
					} else {
						if (node === elem) {
							/** @type {number} */
							nodeListLen = 6;
							/** @type {number} */
							a = 3;
						} else {
							/** @type {number} */
							nodeListLen = 7;
							/** @type {number} */
							a = 4;
						}
					}
				}
			}
		}
		/**
		 * @param {Object} data
		 * @param {Array} elems
		 * @param {number} a
		 * @return {undefined}
		 */
		function register(data, elems, a) {
			var b;
			var node;
			/** @type {number} */
			var context = -1;
			var elem = elems[1];
			/** @type {number} */
			var s = 0;
			/** @type {number} */
			var al = 7;
			/** @type {number} */
			var ms = 4;
			if (0 === elem) {
				/** @type {number} */
				al = 138;
				/** @type {number} */
				ms = 3;
			}
			/** @type {number} */
			b = 0;
			for (;a >= b;b++) {
				if (node = elem, elem = elems[2 * (b + 1) + 1], !(++s < al && node === elem)) {
					if (ms > s) {
						do {
							callback(data, node, data.bl_tree);
						} while (0 !== --s);
					} else {
						if (0 !== node) {
							if (node !== context) {
								callback(data, node, data.bl_tree);
								s--;
							}
							callback(data, res, data.bl_tree);
							bind(data, s - 3, 2);
						} else {
							if (10 >= s) {
								callback(data, result, data.bl_tree);
								bind(data, s - 3, 3);
							} else {
								callback(data, index, data.bl_tree);
								bind(data, s - 11, 7);
							}
						}
					}
					/** @type {number} */
					s = 0;
					context = node;
					if (0 === elem) {
						/** @type {number} */
						al = 138;
						/** @type {number} */
						ms = 3;
					} else {
						if (node === elem) {
							/** @type {number} */
							al = 6;
							/** @type {number} */
							ms = 3;
						} else {
							/** @type {number} */
							al = 7;
							/** @type {number} */
							ms = 4;
						}
					}
				}
			}
		}
		/**
		 * @param {Object} s
		 * @return {?}
		 */
		function escapeInnerText(s) {
			var i;
			addEvents(s, s.dyn_ltree, s.l_desc.max_code);
			addEvents(s, s.dyn_dtree, s.d_desc.max_code);
			gen_bitlen(s, s.bl_desc);
			/** @type {number} */
			i = count - 1;
			for (;i >= 3 && 0 === s.bl_tree[2 * prevSources[i] + 1];i--) {
			}
			return s.opt_len += 3 * (i + 1) + 5 + 5 + 4, i;
		}
		/**
		 * @param {Object} fn
		 * @param {number} files
		 * @param {number} immediately
		 * @param {number} filename
		 * @return {undefined}
		 */
		function watch(fn, files, immediately, filename) {
			var i;
			bind(fn, files - 257, 5);
			bind(fn, immediately - 1, 5);
			bind(fn, filename - 4, 4);
			/** @type {number} */
			i = 0;
			for (;filename > i;i++) {
				bind(fn, fn.bl_tree[2 * prevSources[i] + 1], 3);
			}
			register(fn, fn.dyn_ltree, files - 1);
			register(fn, fn.dyn_dtree, immediately - 1);
		}
		/**
		 * @param {Object} failing_message
		 * @return {?}
		 */
		function report(failing_message) {
			var maxAllowed;
			/** @type {number} */
			var n = 4093624447;
			/** @type {number} */
			maxAllowed = 0;
			for (;31 >= maxAllowed;maxAllowed++, n >>>= 1) {
				if (1 & n && 0 !== failing_message.dyn_ltree[2 * maxAllowed]) {
					return covered;
				}
			}
			if (0 !== failing_message.dyn_ltree[18] || (0 !== failing_message.dyn_ltree[20] || 0 !== failing_message.dyn_ltree[26])) {
				return reportSchema;
			}
			/** @type {number} */
			maxAllowed = 32;
			for (;len > maxAllowed;maxAllowed++) {
				if (0 !== failing_message.dyn_ltree[2 * maxAllowed]) {
					return reportSchema;
				}
			}
			return covered;
		}
		/**
		 * @param {Error} object
		 * @return {undefined}
		 */
		function promise(object) {
			if (!ge) {
				submit();
				/** @type {boolean} */
				ge = true;
			}
			object.l_desc = new zip_build_tree(object.dyn_ltree, l_desc);
			object.d_desc = new zip_build_tree(object.dyn_dtree, d_desc);
			object.bl_desc = new zip_build_tree(object.bl_tree, size);
			/** @type {number} */
			object.bi_buf = 0;
			/** @type {number} */
			object.bi_valid = 0;
			resolve(object);
		}
		/**
		 * @param {Object} a
		 * @param {number} name
		 * @param {number} count
		 * @param {boolean} recurring
		 * @return {undefined}
		 */
		function cb(a, name, count, recurring) {
			bind(a, (U << 1) + (recurring ? 1 : 0), 3);
			test(a, name, count, true);
		}
		/**
		 * @param {Object} a
		 * @return {undefined}
		 */
		function remove(a) {
			bind(a, M << 1, 3);
			callback(a, ex, params);
			eq(a);
		}
		/**
		 * @param {Object} that
		 * @param {number} names
		 * @param {number} total
		 * @param {boolean} recurring
		 * @return {undefined}
		 */
		function init(that, names, total, recurring) {
			var i;
			var length;
			/** @type {number} */
			var msg = 0;
			if (that.level > 0) {
				if (that.strm.data_type === data_type) {
					that.strm.data_type = report(that);
				}
				gen_bitlen(that, that.l_desc);
				gen_bitlen(that, that.d_desc);
				msg = escapeInnerText(that);
				/** @type {number} */
				i = that.opt_len + 3 + 7 >>> 3;
				/** @type {number} */
				length = that.static_len + 3 + 7 >>> 3;
				if (i >= length) {
					/** @type {number} */
					i = length;
				}
			} else {
				i = length = total + 5;
			}
			if (i >= total + 4 && -1 !== names) {
				cb(that, names, total, recurring);
			} else {
				if (that.strategy === horizontal || length === i) {
					bind(that, (M << 1) + (recurring ? 1 : 0), 3);
					extend(that, params, obj);
				} else {
					bind(that, (D << 1) + (recurring ? 1 : 0), 3);
					watch(that, that.l_desc.max_code + 1, that.d_desc.max_code + 1, msg + 1);
					extend(that, that.dyn_ltree, that.dyn_dtree);
				}
			}
			resolve(that);
			if (recurring) {
				isReady(that);
			}
		}
		/**
		 * @param {Object} self
		 * @param {number} recurring
		 * @param {number} selector
		 * @return {?}
		 */
		function find(self, recurring, selector) {
			return self.pending_buf[self.d_buf + 2 * self.last_lit] = recurring >>> 8 & 255, self.pending_buf[self.d_buf + 2 * self.last_lit + 1] = 255 & recurring, self.pending_buf[self.l_buf + self.last_lit] = 255 & selector, self.last_lit++, 0 === recurring ? self.dyn_ltree[2 * selector]++ : (self.matches++, recurring--, self.dyn_ltree[2 * (map[selector] + len + 1)]++, self.dyn_dtree[2 * fn(recurring)]++), self.last_lit === self.lit_bufsize - 1;
		}
		var fs = require("../utils/common");
		/** @type {number} */
		var horizontal = 4;
		/** @type {number} */
		var covered = 0;
		/** @type {number} */
		var reportSchema = 1;
		/** @type {number} */
		var data_type = 2;
		/** @type {number} */
		var U = 0;
		/** @type {number} */
		var M = 1;
		/** @type {number} */
		var D = 2;
		/** @type {number} */
		var b = 3;
		/** @type {number} */
		var a = 258;
		/** @type {number} */
		var length = 29;
		/** @type {number} */
		var len = 256;
		/** @type {number} */
		var end = len + 1 + length;
		/** @type {number} */
		var cols = 30;
		/** @type {number} */
		var count = 19;
		/** @type {number} */
		var HEAP_SIZE = 2 * end + 1;
		/** @type {number} */
		var l = 15;
		/** @type {number} */
		var bi_valid = 16;
		/** @type {number} */
		var Y = 7;
		/** @type {number} */
		var ex = 256;
		/** @type {number} */
		var res = 16;
		/** @type {number} */
		var result = 17;
		/** @type {number} */
		var index = 18;
		/** @type {Array} */
		var tags = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
		/** @type {Array} */
		var _ref1 = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
		/** @type {Array} */
		var height = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
		/** @type {Array} */
		var prevSources = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
		/** @type {number} */
		var lat = 512;
		/** @type {Array} */
		var params = new Array(2 * (end + 2));
		expect(params);
		/** @type {Array} */
		var obj = new Array(2 * cols);
		expect(obj);
		/** @type {Array} */
		var coords = new Array(lat);
		expect(coords);
		/** @type {Array} */
		var map = new Array(a - b + 1);
		expect(map);
		/** @type {Array} */
		var results = new Array(length);
		expect(results);
		/** @type {Array} */
		var cache = new Array(cols);
		expect(cache);
		var l_desc;
		var d_desc;
		var size;
		/**
		 * @param {Object} msgs
		 * @param {?} dataAndEvents
		 * @param {Array} deepDataAndEvents
		 * @param {number} ignoreMethodDoesntExist
		 * @param {number} textAlt
		 * @return {undefined}
		 */
		var DeflateTreeDesc = function(msgs, dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist, textAlt) {
			/** @type {Object} */
			this.static_tree = msgs;
			this.extra_bits = dataAndEvents;
			/** @type {Array} */
			this.extra_base = deepDataAndEvents;
			/** @type {number} */
			this.elems = ignoreMethodDoesntExist;
			/** @type {number} */
			this.max_length = textAlt;
			this.has_stree = msgs && msgs.length;
		};
		/**
		 * @param {(Array|number)} desc
		 * @param {?} dataAndEvents
		 * @return {undefined}
		 */
		var zip_build_tree = function(desc, dataAndEvents) {
			/** @type {(Array|number)} */
			this.dyn_tree = desc;
			/** @type {number} */
			this.max_code = 0;
			this.stat_desc = dataAndEvents;
		};
		/** @type {boolean} */
		var ge = false;
		/** @type {function (Error): undefined} */
		exports._tr_init = promise;
		/** @type {function (Object, number, number, boolean): undefined} */
		exports._tr_stored_block = cb;
		/** @type {function (Object, number, number, boolean): undefined} */
		exports._tr_flush_block = init;
		/** @type {function (Object, number, number): ?} */
		exports._tr_tally = find;
		/** @type {function (Object): undefined} */
		exports._tr_align = remove;
	}, {
		"../utils/common" : 41
	}],
	53 : [function(dataAndEvents, module) {
		/**
		 * @return {undefined}
		 */
		function create() {
			/** @type {null} */
			this.input = null;
			/** @type {number} */
			this.next_in = 0;
			/** @type {number} */
			this.avail_in = 0;
			/** @type {number} */
			this.total_in = 0;
			/** @type {null} */
			this.output = null;
			/** @type {number} */
			this.next_out = 0;
			/** @type {number} */
			this.avail_out = 0;
			/** @type {number} */
			this.total_out = 0;
			/** @type {string} */
			this.msg = "";
			/** @type {null} */
			this.state = null;
			/** @type {number} */
			this.data_type = 2;
			/** @type {number} */
			this.adler = 0;
		}
		/** @type {function (): undefined} */
		module.exports = create;
	}, {}]
}, {}, [1]);
