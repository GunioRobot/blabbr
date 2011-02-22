(function(b){b.Autocompleter=function(d,e){this.cacheData_={};this.cacheLength_=0;this.selectClass_="jquery-autocomplete-selected-item";this.lastSelectedValue_=this.lastProcessedValue_=this.lastKeyPressed_=this.keyTimeout_=null;this.active_=false;this.finishOnBlur_=true;if(!d||!(d instanceof jQuery)||d.length!==1||d.get(0).tagName.toUpperCase()!=="INPUT")alert("Invalid parameter for jquery.Autocompleter, jQuery object with one element with INPUT tag expected");else{this.options=typeof e==="string"?
{url:e}:e;this.options.maxCacheLength=parseInt(this.options.maxCacheLength);if(isNaN(this.options.maxCacheLength)||this.options.maxCacheLength<1)this.options.maxCacheLength=1;this.options.minChars=parseInt(this.options.minChars);if(isNaN(this.options.minChars)||this.options.minChars<1)this.options.minChars=1;this.dom={};this.dom.$elem=d;this.options.inputClass&&this.dom.$elem.addClass(this.options.inputClass);this.dom.$results=b("<div></div>").hide();this.options.resultsClass&&this.dom.$results.addClass(this.options.resultsClass);
this.dom.$results.css({position:"absolute"});b("body").append(this.dom.$results);var g=this;this.position();b(window).resize(function(){g.position()});d.keydown(function(k){g.lastKeyPressed_=k.keyCode;switch(g.lastKeyPressed_){case 38:k.preventDefault();g.active_?g.focusPrev():g.activate();return false;case 40:k.preventDefault();g.active_?g.focusNext():g.activate();return false;case 9:case 13:if(g.active_){k.preventDefault();g.selectCurrent();return false}break;case 27:if(g.active_){k.preventDefault();
g.finish();return false}break;default:g.activate()}});d.blur(function(){g.finishOnBlur_&&setTimeout(function(){g.finish()},200)})}};b.Autocompleter.prototype.position=function(){var d=this.dom.$elem.offset();this.dom.$results.css({top:d.top+this.dom.$elem.outerHeight(),left:d.left})};b.Autocompleter.prototype.cacheRead=function(d){var e,g,k,l,j;if(this.options.useCache){d=String(d);e=d.length;for(g=this.options.matchSubset?1:e;g<=e;){l=this.options.matchInside?e-g:0;for(j=0;j<=l;){k=d.substr(0,g);
if(this.cacheData_[k]!==undefined)return this.cacheData_[k];j++}g++}}return false};b.Autocompleter.prototype.cacheWrite=function(d,e){if(this.options.useCache){this.cacheLength_>=this.options.maxCacheLength&&this.cacheFlush();d=String(d);this.cacheData_[d]!==undefined&&this.cacheLength_++;return this.cacheData_[d]=e}return false};b.Autocompleter.prototype.cacheFlush=function(){this.cacheData_={};this.cacheLength_=0};b.Autocompleter.prototype.callHook=function(d,e){var g=this.options[d];if(g&&b.isFunction(g))return g(e,
this);return false};b.Autocompleter.prototype.activate=function(){var d=this,e=parseInt(this.options.delay);if(isNaN(e)||e<=0)e=250;this.keyTimeout_&&clearTimeout(this.keyTimeout_);this.keyTimeout_=setTimeout(function(){d.activateNow()},e)};b.Autocompleter.prototype.activateNow=function(){var d=this.dom.$elem.val();if(d!==this.lastProcessedValue_&&d!==this.lastSelectedValue_)if(d.length>=this.options.minChars){this.active_=true;this.lastProcessedValue_=d;this.fetchData(d)}};b.Autocompleter.prototype.fetchData=
function(d){if(this.options.data)this.filterAndShowResults(this.options.data,d);else{var e=this;this.fetchRemoteData(d,function(g){e.filterAndShowResults(g,d)})}};b.Autocompleter.prototype.fetchRemoteData=function(d,e){var g=this.cacheRead(d);if(g)e(g);else try{var k=this;this.dom.$elem.addClass(this.options.loadingClass);b.get(this.makeUrl(d),function(j){j=k.parseRemoteData(j);k.cacheWrite(d,j);k.dom.$elem.removeClass(k.options.loadingClass);e(j)})}catch(l){this.dom.$elem.removeClass(this.options.loadingClass);
e(false)}};b.Autocompleter.prototype.setExtraParam=function(d,e){var g=b.trim(String(d));if(g){if(!this.options.extraParams)this.options.extraParams={};if(this.options.extraParams[g]!==e){this.options.extraParams[g]=e;this.cacheFlush()}}};b.Autocompleter.prototype.makeUrl=function(d){var e=this,g=this.options.paramName||"q",k=this.options.url,l=b.extend({},this.options.extraParams),j=[];l[g]=d;b.each(l,function(m,r){j.push(e.makeUrlParam(m,r))});k+=k.indexOf("?")==-1?"?":"&";k+=j.join("&");return k};
b.Autocompleter.prototype.makeUrlParam=function(d,e){return String(d)+"="+encodeURIComponent(e)};b.Autocompleter.prototype.parseRemoteData=function(d){var e=[],g,k,l,j=String(d).replace("\r\n","\n").split("\n");for(d=0;d<j.length;d++){l=j[d].split("|");k=[];for(g=0;g<l.length;g++)k.push(unescape(l[g]));g=k.shift();e.push({value:unescape(g),data:k})}return e};b.Autocompleter.prototype.filterAndShowResults=function(d,e){this.showResults(this.filterResults(d,e),e)};b.Autocompleter.prototype.filterResults=
function(d,e){var g=[],k,l,j,m,r,v="";for(j=0;j<d.length;j++){m=d[j];r=typeof m;if(r==="string"){k=m;l={}}else if(b.isArray(m)){k=m.shift();l=m}else if(r==="object"){k=m.value;l=m.data}if(k=String(k)){if(typeof l!=="object")l={};m=String(e);this.options.matchInside||(m="^"+m);this.options.matchCase||(v="i");m=RegExp(m,v);m.test(k)&&g.push({value:k,data:l})}}if(this.options.sortResults)return this.sortResults(g);return g};b.Autocompleter.prototype.sortResults=function(d){var e=this;b.isFunction(this.options.sortFunction)?
d.sort(this.options.sortFunction):d.sort(function(g,k){return e.sortValueAlpha(g,k)});return d};b.Autocompleter.prototype.sortValueAlpha=function(d,e){d=String(d.value);e=String(e.value);if(!this.options.matchCase){d=d.toLowerCase();e=e.toLowerCase()}if(d>e)return 1;if(d<e)return-1;return 0};b.Autocompleter.prototype.showResults=function(d,e){var g=this,k=b("<ul></ul>"),l,j,m,r=false,v=false,w=d.length;for(l=0;l<w;l++){j=d[l];m=b("<li>"+this.showResult(j.value,j.data)+"</li>");m.data("value",j.value);
m.data("data",j.data);m.click(function(){var u=b(this);g.selectItem(u)}).mousedown(function(){g.finishOnBlur_=false}).mouseup(function(){g.finishOnBlur_=true});k.append(m);if(r===false){r=String(j.value);v=m;m.addClass(this.options.firstItemClass)}l==w-1&&m.addClass(this.options.lastItemClass)}this.dom.$results.html(k).show();k=this.dom.$results.outerWidth()-this.dom.$results.width();this.dom.$results.width(this.dom.$elem.outerWidth()-k);b("li",this.dom.$results).hover(function(){g.focusItem(this)},
function(){});this.autoFill(r,e)&&this.focusItem(v)};b.Autocompleter.prototype.showResult=function(d,e){return b.isFunction(this.options.showResult)?this.options.showResult(d,e):d};b.Autocompleter.prototype.autoFill=function(d,e){var g,k,l,j;if(this.options.autoFill&&this.lastKeyPressed_!=8){g=String(d).toLowerCase();k=String(e).toLowerCase();l=d.length;j=e.length;if(g.substr(0,j)===k){this.dom.$elem.val(d);this.selectRange(j,l);return true}}return false};b.Autocompleter.prototype.focusNext=function(){this.focusMove(+1)};
b.Autocompleter.prototype.focusPrev=function(){this.focusMove(-1)};b.Autocompleter.prototype.focusMove=function(d){var e,g=b("li",this.dom.$results);d=parseInt(d);for(e=0;e<g.length;e++)if(b(g[e]).hasClass(this.selectClass_)){this.focusItem(e+d);return}this.focusItem(0)};b.Autocompleter.prototype.focusItem=function(d){var e=b("li",this.dom.$results);if(e.length){e.removeClass(this.selectClass_).removeClass(this.options.selectClass);if(typeof d==="number"){d=parseInt(d);if(d<0)d=0;else if(d>=e.length)d=
e.length-1;d=b(e[d])}else d=b(d);d&&d.addClass(this.selectClass_).addClass(this.options.selectClass)}};b.Autocompleter.prototype.selectCurrent=function(){var d=b("li."+this.selectClass_,this.dom.$results);d.length==1?this.selectItem(d):this.finish()};b.Autocompleter.prototype.selectItem=function(d){var e=d.data("value");d=d.data("data");var g=this.displayValue(e,d);this.lastSelectedValue_=this.lastProcessedValue_=g;this.dom.$elem.val(g).focus();this.setCaret(g.length);this.callHook("onItemSelect",
{value:e,data:d});this.finish()};b.Autocompleter.prototype.displayValue=function(d,e){return b.isFunction(this.options.displayValue)?this.options.displayValue(d,e):d};b.Autocompleter.prototype.finish=function(){this.keyTimeout_&&clearTimeout(this.keyTimeout_);if(this.dom.$elem.val()!==this.lastSelectedValue_){this.options.mustMatch&&this.dom.$elem.val("");this.callHook("onNoMatch")}this.dom.$results.hide();this.lastProcessedValue_=this.lastKeyPressed_=null;this.active_&&this.callHook("onFinish");
this.active_=false};b.Autocompleter.prototype.selectRange=function(d,e){var g=this.dom.$elem.get(0);if(g.setSelectionRange){g.focus();g.setSelectionRange(d,e)}else if(this.createTextRange){g=this.createTextRange();g.collapse(true);g.moveEnd("character",e);g.moveStart("character",d);g.select()}};b.Autocompleter.prototype.setCaret=function(d){this.selectRange(d,d)};b.fn.autocomplete=function(d){if(typeof d==="string")d={url:d};var e=b.extend({},b.fn.autocomplete.defaults,d);return this.each(function(){var g=
b(this),k=new b.Autocompleter(g,e);g.data("autocompleter",k)})};b.fn.autocomplete.defaults={minChars:1,loadingClass:"acLoading",resultsClass:"acResults",inputClass:"acInput",selectClass:"acSelect",mustMatch:false,matchCase:false,matchInside:true,matchSubset:true,useCache:true,maxCacheLength:10,autoFill:false,sortResults:true,sortFunction:false,onItemSelect:false,onNoMatch:false}})(jQuery);
(function(b){b.extend(b.fn,{livequery:function(d,e,g){var k=this,l;if(b.isFunction(d)){g=e;e=d;d=undefined}b.each(b.livequery.queries,function(j,m){if(k.selector==m.selector&&k.context==m.context&&d==m.type&&(!e||e.$lqguid==m.fn.$lqguid)&&(!g||g.$lqguid==m.fn2.$lqguid))return(l=m)&&false});l=l||new b.livequery(this.selector,this.context,d,e,g);l.stopped=false;l.run();return this},expire:function(d,e,g){var k=this;if(b.isFunction(d)){g=e;e=d;d=undefined}b.each(b.livequery.queries,function(l,j){if(k.selector==
j.selector&&k.context==j.context&&(!d||d==j.type)&&(!e||e.$lqguid==j.fn.$lqguid)&&(!g||g.$lqguid==j.fn2.$lqguid)&&!this.stopped)b.livequery.stop(j.id)});return this}});b.livequery=function(d,e,g,k,l){this.selector=d;this.context=e;this.type=g;this.fn=k;this.fn2=l;this.elements=[];this.stopped=false;this.id=b.livequery.queries.push(this)-1;k.$lqguid=k.$lqguid||b.livequery.guid++;if(l)l.$lqguid=l.$lqguid||b.livequery.guid++;return this};b.livequery.prototype={stop:function(){var d=this;if(this.type)this.elements.unbind(this.type,
this.fn);else this.fn2&&this.elements.each(function(e,g){d.fn2.apply(g)});this.elements=[];this.stopped=true},run:function(){if(!this.stopped){var d=this,e=this.elements,g=b(this.selector,this.context),k=g.not(e);this.elements=g;if(this.type){k.bind(this.type,this.fn);e.length>0&&b.each(e,function(l,j){b.inArray(j,g)<0&&b.event.remove(j,d.type,d.fn)})}else{k.each(function(){d.fn.apply(this)});this.fn2&&e.length>0&&b.each(e,function(l,j){b.inArray(j,g)<0&&d.fn2.apply(j)})}}}};b.extend(b.livequery,
{guid:0,queries:[],queue:[],running:false,timeout:null,checkQueue:function(){if(b.livequery.running&&b.livequery.queue.length)for(var d=b.livequery.queue.length;d--;)b.livequery.queries[b.livequery.queue.shift()].run()},pause:function(){b.livequery.running=false},play:function(){b.livequery.running=true;b.livequery.run()},registerPlugin:function(){b.each(arguments,function(d,e){if(b.fn[e]){var g=b.fn[e];b.fn[e]=function(){var k=g.apply(this,arguments);b.livequery.run();return k}}})},run:function(d){if(d!=
undefined)b.inArray(d,b.livequery.queue)<0&&b.livequery.queue.push(d);else b.each(b.livequery.queries,function(e){b.inArray(e,b.livequery.queue)<0&&b.livequery.queue.push(e)});b.livequery.timeout&&clearTimeout(b.livequery.timeout);b.livequery.timeout=setTimeout(b.livequery.checkQueue,20)},stop:function(d){d!=undefined?b.livequery.queries[d].stop():b.each(b.livequery.queries,function(e){b.livequery.queries[e].stop()})}});b.livequery.registerPlugin("append","prepend","after","before","wrap","attr",
"removeAttr","addClass","removeClass","toggleClass","empty","remove","html");b(function(){b.livequery.play()})})(jQuery);
jQuery.cookie=function(b,d,e){if(arguments.length>1&&String(d)!=="[object Object]"){e=jQuery.extend({},e);if(d===null||d===undefined)e.expires=-1;if(typeof e.expires==="number"){var g=e.expires,k=e.expires=new Date;k.setDate(k.getDate()+g)}d=String(d);return document.cookie=[encodeURIComponent(b),"=",e.raw?d:encodeURIComponent(d),e.expires?"; expires="+e.expires.toUTCString():"",e.path?"; path="+e.path:"",e.domain?"; domain="+e.domain:"",e.secure?"; secure":""].join("")}e=d||{};k=e.raw?function(l){return l}:
decodeURIComponent;return(g=RegExp("(?:^|; )"+encodeURIComponent(b)+"=([^;]*)").exec(document.cookie))?k(g[1]):null};
(function(b){b.fn.sexyPost=function(d){var e=["onstart","onprogress","oncomplete","onerror","onabort","onfilestart","onfilecomplete"],g={async:true,autoclear:false,onstart:function(){},onprogress:function(){},oncomplete:function(){},onerror:function(){},onabort:function(){}};d&&b.extend(g,d);this.each(function(){function k(m,r,v,w){var u=new FormData;b("input:text, input:hidden, input:password, textarea",m).each(function(){u.append(b(this).attr("name"),b(this).val())});b("input:file",m).each(function(){var y=
this.files;for(i=0;i<y.length;i++)u.append(b(this).attr("name"),y[i])});b("select option:selected",m).each(function(){u.append(b(this).parent().attr("name"),b(this).val())});b("input:checked",m).each(function(){u.append(b(this).attr("name"),b(this).val())});j.open(v,r,w);j.setRequestHeader("Cache-Control","no-cache");j.setRequestHeader("X-Requested-With","XMLHttpRequest");j.send(u)}for(event in e)g[e[event]]&&b(this).bind("sexyPost."+e[event],g[e[event]]);var l=b(this);l.submit(function(){var m=b(this).attr("action"),
r=b(this).attr("method");k(this,m,r,g.async);return false});b(".submit-trigger",l).not(":button").bind("change",function(){l.trigger("submit")});b(".submit-trigger",l).not(":input").bind("click",function(){l.trigger("submit")});var j=new XMLHttpRequest;j.onloadstart=function(){l.trigger("sexyPost.onstart")};j.onload=function(){g.autoclear&&j.status>=200&&j.status<=204&&b(":input",l).not(":button, :submit, :reset, :hidden").removeAttr("checked").removeAttr("selected").val("");l.trigger("sexyPost.oncomplete",
[j.responseText])};j.onerror=function(){l.trigger("sexyPost.onerror")};j.onabort=function(){l.trigger("sexyPost.onabort")};j.upload.onprogress=function(m){l.trigger("sexyPost.onprogress",[m.loaded/m.total,m.loaded,m.total])}});return this}})(jQuery);
(function(b,d){var e,g=/:([\w\d]+)/g,k=/\?([^#]*)$/,l=function(a){return Array.prototype.slice.call(a)},j=function(a){return Object.prototype.toString.call(a)==="[object Function]"},m=function(a){return Object.prototype.toString.call(a)==="[object Array]"},r=decodeURIComponent,v=function(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},w=function(a){return function(c,f){return this.route.apply(this,[a,c,f])}},u={},y=[];e=function(){var a=l(arguments),c,f;e.apps=e.apps||
{};if(a.length===0||a[0]&&j(a[0]))return e.apply(e,["body"].concat(a));else if(typeof(f=a.shift())=="string"){c=e.apps[f]||new e.Application;c.element_selector=f;a.length>0&&b.each(a,function(h,o){c.use(o)});c.element_selector!=f&&delete e.apps[f];return e.apps[c.element_selector]=c}};e.VERSION="0.6.2";e.addLogger=function(a){y.push(a)};e.log=function(){var a=l(arguments);a.unshift("["+Date()+"]");b.each(y,function(c,f){f.apply(e,a)})};if(typeof d.console!="undefined")j(console.log.apply)?e.addLogger(function(){d.console.log.apply(console,
arguments)}):e.addLogger(function(){d.console.log(arguments)});else typeof console!="undefined"&&e.addLogger(function(){console.log.apply(console,arguments)});b.extend(e,{makeArray:l,isFunction:j,isArray:m});e.Object=function(a){return b.extend(this,a||{})};b.extend(e.Object.prototype,{escapeHTML:v,h:v,toHash:function(){var a={};b.each(this,function(c,f){j(f)||(a[c]=f)});return a},toHTML:function(){var a="";b.each(this,function(c,f){j(f)||(a+="<strong>"+c+"</strong> "+f+"<br />")});return a},keys:function(a){var c=
[],f;for(f in this)if(!j(this[f])||!a)c.push(f);return c},has:function(a){return this[a]&&b.trim(this[a].toString())!=""},join:function(){var a=l(arguments),c=a.shift();return a.join(c)},log:function(){e.log.apply(e,arguments)},toString:function(a){var c=[];b.each(this,function(f,h){if(!j(h)||a)c.push('"'+f+'": '+h.toString())});return"Sammy.Object: {"+c.join(",")+"}"}});e.HashLocationProxy=function(a,c){this.app=a;this.is_native=false;this._startPolling(c)};e.HashLocationProxy.prototype={bind:function(){var a=
this,c=this.app;b(d).bind("hashchange."+this.app.eventNamespace(),function(f,h){if(a.is_native===false&&!h){e.log("native hash change exists, using");a.is_native=true;d.clearInterval(e.HashLocationProxy._interval)}c.trigger("location-changed")});if(!e.HashLocationProxy._bindings)e.HashLocationProxy._bindings=0;e.HashLocationProxy._bindings++},unbind:function(){b(d).unbind("hashchange."+this.app.eventNamespace());e.HashLocationProxy._bindings--;e.HashLocationProxy._bindings<=0&&d.clearInterval(e.HashLocationProxy._interval)},
getLocation:function(){var a=d.location.toString().match(/^[^#]*(#.+)$/);return a?a[1]:""},setLocation:function(a){return d.location=a},_startPolling:function(a){var c=this;if(!e.HashLocationProxy._interval){a||(a=10);var f=function(){var h=c.getLocation();if(!e.HashLocationProxy._last_location||h!=e.HashLocationProxy._last_location)d.setTimeout(function(){b(d).trigger("hashchange",[true])},13);e.HashLocationProxy._last_location=h};f();e.HashLocationProxy._interval=d.setInterval(f,a)}}};e.Application=
function(a){var c=this;this.routes={};this.listeners=new e.Object({});this.arounds=[];this.befores=[];this.namespace=(new Date).getTime()+"-"+parseInt(Math.random()*1E3,10);this.context_prototype=function(){e.EventContext.apply(this,arguments)};this.context_prototype.prototype=new e.EventContext;j(a)&&a.apply(this,[this]);this._location_proxy||this.setLocationProxy(new e.HashLocationProxy(this,this.run_interval_every));this.debug&&this.bindToAllEvents(function(f,h){c.log(c.toString(),f.cleaned_type,
h||{})})};e.Application.prototype=b.extend({},e.Object.prototype,{ROUTE_VERBS:["get","post","put","delete"],APP_EVENTS:["run","unload","lookup-route","run-route","route-found","event-context-before","event-context-after","changed","error","check-form-submission","redirect","location-changed"],_last_route:null,_location_proxy:null,_running:false,element_selector:"body",debug:false,raise_errors:false,run_interval_every:50,template_engine:null,toString:function(){return"Sammy.Application:"+this.element_selector},
$element:function(){return b(this.element_selector)},use:function(){var a=l(arguments),c=a.shift(),f=c||"";try{a.unshift(this);if(typeof c=="string"){f="Sammy."+c;c=e[c]}c.apply(this,a)}catch(h){if(typeof c==="undefined")this.error("Plugin Error: called use() but plugin ("+f.toString()+") is not defined",h);else j(c)?this.error("Plugin Error",h):this.error("Plugin Error: called use() but '"+f.toString()+"' is not a function",h)}return this},setLocationProxy:function(a){var c=this._location_proxy;
this._location_proxy=a;if(this.isRunning()){c&&c.unbind();this._location_proxy.bind()}},route:function(a,c,f){var h=this,o=[],n,p;if(!f&&j(c)){f=c=a;a="any"}a=a.toLowerCase();if(c.constructor==String){for(g.lastIndex=0;(p=g.exec(c))!==null;)o.push(p[1]);c=RegExp("^"+c.replace(g,"([^/]+)")+"$")}if(typeof f=="string")f=h[f];n=function(q){var s={verb:q,path:c,callback:f,param_names:o};h.routes[q]=h.routes[q]||[];h.routes[q].push(s)};a==="any"?b.each(this.ROUTE_VERBS,function(q,s){n(s)}):n(a);return this},
get:w("get"),post:w("post"),put:w("put"),del:w("delete"),any:w("any"),mapRoutes:function(a){var c=this;b.each(a,function(f,h){c.route.apply(c,h)});return this},eventNamespace:function(){return["sammy-app",this.namespace].join("-")},bind:function(a,c,f){var h=this;if(typeof f=="undefined")f=c;c=function(o,n){var p;if(n&&n.context){p=n.context;delete n.context}else p=new h.context_prototype(h,"bind",o.type,n,o.target);o.cleaned_type=o.type.replace(h.eventNamespace(),"");f.apply(p,[o,n])};this.listeners[a]||
(this.listeners[a]=[]);this.listeners[a].push(c);this.isRunning()&&this._listen(a,c);return this},trigger:function(a,c){this.$element().trigger([a,this.eventNamespace()].join("."),[c]);return this},refresh:function(){this.last_location=null;this.trigger("location-changed");return this},before:function(a,c){if(j(a)){c=a;a={}}this.befores.push([a,c]);return this},after:function(a){return this.bind("event-context-after",a)},around:function(a){this.arounds.push(a);return this},isRunning:function(){return this._running},
helpers:function(a){b.extend(this.context_prototype.prototype,a);return this},helper:function(a,c){this.context_prototype.prototype[a]=c;return this},run:function(a){if(this.isRunning())return false;var c=this;b.each(this.listeners.toHash(),function(f,h){b.each(h,function(o,n){c._listen(f,n)})});this.trigger("run",{start_url:a});this._running=true;this.last_location=null;this.getLocation()==""&&typeof a!="undefined"&&this.setLocation(a);this._checkLocation();this._location_proxy.bind();this.bind("location-changed",
function(){c._checkLocation()});this.bind("submit",function(f){return c._checkFormSubmission(b(f.target).closest("form"))===false?f.preventDefault():false});b(d).bind("beforeunload",function(){c.unload()});return this.trigger("changed")},unload:function(){if(!this.isRunning())return false;var a=this;this.trigger("unload");this._location_proxy.unbind();this.$element().unbind("submit").removeClass(a.eventNamespace());b.each(this.listeners.toHash(),function(c,f){b.each(f,function(h,o){a._unlisten(c,
o)})});this._running=false;return this},bindToAllEvents:function(a){var c=this;b.each(this.APP_EVENTS,function(f,h){c.bind(h,a)});b.each(this.listeners.keys(true),function(f,h){c.APP_EVENTS.indexOf(h)==-1&&c.bind(h,a)});return this},routablePath:function(a){return a.replace(k,"")},lookupRoute:function(a,c){var f=this,h=false;this.trigger("lookup-route",{verb:a,path:c});typeof this.routes[a]!="undefined"&&b.each(this.routes[a],function(o,n){if(f.routablePath(c).match(n.path)){h=n;return false}});return h},
runRoute:function(a,c,f,h){var o=this,n=this.lookupRoute(a,c),p,q,s,t,B,A,C;this.log("runRoute",[a,c].join(" "));this.trigger("run-route",{verb:a,path:c,params:f});if(typeof f=="undefined")f={};b.extend(f,this._parseQueryString(c));if(n){this.trigger("route-found",{route:n});if((A=n.path.exec(this.routablePath(c)))!==null){A.shift();b.each(A,function(x,z){if(n.param_names[x])f[n.param_names[x]]=r(z);else{if(!f.splat)f.splat=[];f.splat.push(r(z))}})}p=new this.context_prototype(this,a,c,f,h);h=this.arounds.slice(0);
s=this.befores.slice(0);B=[p].concat(f.splat);q=function(){for(var x;s.length>0;){t=s.shift();if(o.contextMatchesOptions(p,t[0])){x=t[1].apply(p,[p]);if(x===false)return false}}o.last_route=n;p.trigger("event-context-before",{context:p});x=n.callback.apply(p,B);p.trigger("event-context-after",{context:p});return x};b.each(h.reverse(),function(x,z){var D=q;q=function(){return z.apply(p,[D])}});try{C=q()}catch(E){this.error(["500 Error",a,c].join(" "),E)}return C}else return this.notFound(a,c)},contextMatchesOptions:function(a,
c,f){if(typeof c==="undefined"||c=={})return true;if(typeof f==="undefined")f=true;if(typeof c==="string"||j(c.test))c={path:c};if(c.only)return this.contextMatchesOptions(a,c.only,true);else if(c.except)return this.contextMatchesOptions(a,c.except,false);var h=true,o=true;if(c.path)h=j(c.path.test)?c.path.test(a.path):c.path.toString()===a.path;if(c.verb)o=c.verb===a.verb;return f?o&&h:!(o&&h)},getLocation:function(){return this._location_proxy.getLocation()},setLocation:function(a){return this._location_proxy.setLocation(a)},
swap:function(a){return this.$element().html(a)},templateCache:function(a,c){return typeof c!="undefined"?u[a]=c:u[a]},clearTemplateCache:function(){return u={}},notFound:function(a,c){var f=this.error(["404 Not Found",a,c].join(" "));return a==="get"?f:true},error:function(a,c){c||(c=Error());c.message=[a,c.message].join(" ");this.trigger("error",{message:c.message,error:c});if(this.raise_errors)throw c;else this.log(c.message,c)},_checkLocation:function(){var a,c;a=this.getLocation();if(!this.last_location||
this.last_location[0]!="get"||this.last_location[1]!=a){this.last_location=["get",a];c=this.runRoute("get",a)}return c},_getFormVerb:function(a){a=b(a);var c,f;f=a.find('input[name="_method"]');if(f.length>0)c=f.val();c||(c=a[0].getAttribute("method"));return b.trim(c.toString().toLowerCase())},_checkFormSubmission:function(a){var c,f,h;this.trigger("check-form-submission",{form:a});c=b(a);f=c.attr("action");h=this._getFormVerb(c);if(!h||h=="")h="get";this.log("_checkFormSubmission",c,f,h);if(h===
"get"){this.setLocation(f+"?"+c.serialize());a=false}else{c=b.extend({},this._parseFormParams(c));a=this.runRoute(h,f,c,a.get(0))}return typeof a=="undefined"?false:a},_parseFormParams:function(a){var c={};a=a.serializeArray();var f;for(f=0;f<a.length;f++)c=this._parseParamPair(c,a[f].name,a[f].value);return c},_parseQueryString:function(a){var c={},f,h;if(a=a.match(k)){a=a[1].split("&");for(h=0;h<a.length;h++){f=a[h].split("=");c=this._parseParamPair(c,r(f[0]),r(f[1]))}}return c},_parseParamPair:function(a,
c,f){if(a[c])if(m(a[c]))a[c].push(f);else a[c]=[a[c],f];else a[c]=f;return a},_listen:function(a,c){return this.$element().bind([a,this.eventNamespace()].join("."),c)},_unlisten:function(a,c){return this.$element().unbind([a,this.eventNamespace()].join("."),c)}});e.RenderContext=function(a){this.event_context=a;this.callbacks=[];this.content=this.previous_content=null;this.waiting=this.next_engine=false};b.extend(e.RenderContext.prototype,{then:function(a){if(!j(a))if(typeof a==="string"&&a in this.event_context){var c=
this.event_context[a];a=function(h){return c.apply(this.event_context,[h])}}else return this;var f=this;if(this.waiting)this.callbacks.push(a);else{this.wait();d.setTimeout(function(){var h=a.apply(f,[f.content,f.previous_content]);h!==false&&f.next(h)},13)}return this},wait:function(){this.waiting=true},next:function(a){this.waiting=false;if(typeof a!=="undefined"){this.previous_content=this.content;this.content=a}this.callbacks.length>0&&this.then(this.callbacks.shift())},load:function(a,c,f){var h=
this;return this.then(function(){var o,n,p;if(j(c)){f=c;c={}}else c=b.extend({},c);f&&this.then(f);if(typeof a==="string"){o=(p=a.match(/\.json$/)||c.json)&&c.cache===true||c.cache!==false;h.next_engine=h.event_context.engineFor(a);delete c.cache;delete c.json;if(c.engine){h.next_engine=c.engine;delete c.engine}if(o&&(n=this.event_context.app.templateCache(a)))return n;this.wait();b.ajax(b.extend({url:a,data:{},dataType:p?"json":null,type:"get",success:function(q){o&&h.event_context.app.templateCache(a,
q);h.next(q)}},c));return false}else{if(a.nodeType)return a.innerHTML;if(a.selector){h.next_engine=a.attr("data-engine");return c.clone===false?a.remove()[0].innerHTML.toString():a[0].innerHTML.toString()}}})},render:function(a,c,f){if(j(a)&&!c)return this.then(a);else{if(!c&&this.content)c=this.content;return this.load(a).interpolate(c,a).then(f)}},partial:function(a,c){return this.render(a,c).swap()},send:function(){var a=this,c=l(arguments),f=c.shift();if(m(c[0]))c=c[0];return this.then(function(){c.push(function(h){a.next(h)});
a.wait();f.apply(f,c);return false})},collect:function(a,c,f){var h=this,o=function(){if(j(a)){c=a;a=this.content}var n=[],p=false;b.each(a,function(q,s){var t=c.apply(h,[q,s]);if(t.jquery&&t.length==1){t=t[0];p=true}n.push(t);return t});return p?n:n.join("")};return f?o():this.then(o)},renderEach:function(a,c,f,h){if(m(c)){h=f;f=c;c=null}return this.load(a).then(function(o){var n=this;f||(f=m(this.previous_content)?this.previous_content:[]);if(h)b.each(f,function(p,q){var s={},t=this.next_engine||
a;c?s[c]=q:s=q;h(q,n.event_context.interpolate(o,s,t))});else return this.collect(f,function(p,q){var s={},t=this.next_engine||a;c?s[c]=q:s=q;return this.event_context.interpolate(o,s,t)},true)})},interpolate:function(a,c,f){var h=this;return this.then(function(o,n){if(!a&&n)a=n;if(this.next_engine){c=this.next_engine;this.next_engine=false}var p=h.event_context.interpolate(o,a,c);return f?n+p:p})},swap:function(){return this.then(function(a){this.event_context.swap(a)}).trigger("changed",{})},appendTo:function(a){return this.then(function(c){b(a).append(c)}).trigger("changed",
{})},prependTo:function(a){return this.then(function(c){b(a).prepend(c)}).trigger("changed",{})},replace:function(a){return this.then(function(c){b(a).html(c)}).trigger("changed",{})},trigger:function(a,c){return this.then(function(f){if(typeof c=="undefined")c={content:f};this.event_context.trigger(a,c)})}});e.EventContext=function(a,c,f,h,o){this.app=a;this.verb=c;this.path=f;this.params=new e.Object(h);this.target=o};e.EventContext.prototype=b.extend({},e.Object.prototype,{$element:function(){return this.app.$element()},
engineFor:function(a){var c;if(j(a))return a;a=a.toString();if(c=a.match(/\.([^\.]+)$/))a=c[1];if(a&&j(this[a]))return this[a];if(this.app.template_engine)return this.engineFor(this.app.template_engine);return function(f){return f}},interpolate:function(a,c,f){return this.engineFor(f).apply(this,[a,c])},render:function(a,c,f){return(new e.RenderContext(this)).render(a,c,f)},renderEach:function(a,c,f,h){return(new e.RenderContext(this)).renderEach(a,c,f,h)},load:function(a,c,f){return(new e.RenderContext(this)).load(a,
c,f)},partial:function(a,c){return(new e.RenderContext(this)).partial(a,c)},send:function(){var a=new e.RenderContext(this);return a.send.apply(a,arguments)},redirect:function(){var a;a=l(arguments);var c=this.app.getLocation();if(a.length>1){a.unshift("/");a=this.join.apply(this,a)}else a=a[0];this.trigger("redirect",{to:a});this.app.last_location=[this.verb,this.path];this.app.setLocation(a);c==a&&this.app.trigger("location-changed")},trigger:function(a,c){if(typeof c=="undefined")c={};if(!c.context)c.context=
this;return this.app.trigger(a,c)},eventNamespace:function(){return this.app.eventNamespace()},swap:function(a){return this.app.swap(a)},notFound:function(){return this.app.notFound(this.verb,this.path)},json:function(a){return b.parseJSON(a)},toString:function(){return"Sammy.EventContext: "+[this.verb,this.path,this.params].join(" ")}});b.sammy=d.Sammy=e})(jQuery,window);
(function(b){b.blabbrNotify=function(d,e){setTimeout(function(){b("#notify").children().hide("slow").remove()},5E3);b("#notify").append('<p class="'+d+'">'+e+"</p>")};b.redirectTo=function(d){if(history.pushState){getAndShow(ajaxPath(d),"#contents");history.pushState({path:d},"",d)}else window.location="/#"+d;b("aside").hide("slow")}})(jQuery);var root=history.pushState?"/":"#/";
(function(b){Sammy=Sammy||{};Sammy.PushLocationProxy=function(d){this.app=d};Sammy.PushLocationProxy.prototype={bind:function(){var d=this;b(window).bind("popstate",function(){d.app.trigger("location-changed")});b("a").live("click",function(e){if(location.hostname==this.hostname){e.preventDefault();d.setLocation(b(this).attr("href"));d.app.trigger("location-changed")}})},unbind:function(){b("a").unbind("click");b(window).unbind("popstate")},getLocation:function(){return window.location.pathname},
setLocation:function(d){history.pushState({path:this.path},"",d)}}})(jQuery);
(function(b){var d=b.sammy(function(){this.notFound=function(e,g){document.location.href=g};history.pushState&&this.setLocationProxy(new Sammy.PushLocationProxy(this));this.before(function(){path=ajaxPath(this.path);loadingNotification()});this.after(function(){if(typeof _gaq!=="undefined"){_gaq.push(["_trackPageview"]);_gaq.push(["_trackEvent",this.path,this.verb,"blabbr"])}});this.get(root,function(){getAndShow(path,"#contents")});this.get(root+"topics",function(){getAndShow(path,"aside")});this.get(root+
"topics/new",function(){getAndShow(path,"aside")});this.post("/topics",function(){postAndShow(path,this.params)});this.get(root+"topics/page/:page_id",function(){getAndShow(path,"#contents")});this.get(root+"topics/:id",function(){subscribeToPusher(this.params.id);getAndShow(path,"#contents")});this.get(root+"topics/:id/edit",function(){getAndShow(path,"aside")});this.put("/topics/:id",function(){postAndAdd(path,this.params);getAndShow(path,"#contents")});this.post("/topics/:id/posts",function(){postAndAdd(path,
this.params)});this.post("/topics/:id/members",function(){postAndAdd(path,this.params)});this.get(root+"topics/:id/page/:page_id",function(){subscribeToPusher(this.params.id);getAndShow(path,"#contents")});this.get(root+"topics/:id/page/:page_id/:anchor",function(){subscribeToPusher(this.params.id);params=this.params;getAndScroll("/topics/"+params.id+"/page/"+params.page_id+".js","#contents",params.anchor)});this.get(root+"topics/:id/posts/:post_id/edit",function(){var e=this.params.post_id;b.get(path,
function(g){g&&showEdit(g,e)})});this.put("/topics/:id/posts/:post_id",function(){postAndReplace(path,this.params)});this.del("/topics/:id/posts/:post_id",function(){deletePost(path,this.params)});this.get(root+"users/:id",function(){getAndShow(path,"aside")});this.put("/users/:id",function(){postAndShow(path,this.params)});this.get(root+"dashboard",function(){getAndShow(path,"aside")});this.get(root+"smilies",function(){getAndShow(path)});this.get(root+"smilies/new",function(){getAndShow(path,"aside")})});
b(function(){d.run(root)})})(jQuery);var titleHolder=document.title;blabbr=new blabbr;
jQuery(function(b){b("input.autocomplete").livequery(function(){b(this).each(function(){var d=b(this);d.autocomplete(d.attr("data-autocomplete-url"))})});b("#new_smiley").livequery(function(){b(this).sexyPost({onprogress:function(d,e){b("#status").text("Uploading: "+(e*100).toFixed(2)+"% complete...")},oncomplete:function(){b("#status").text("Upload complete.")}})});history.pushState||b("a[href^=/][class!='no-ajax']").livequery(function(){var d=b(this).attr("href");b(this).attr("href","#"+d.replace("#",
"/"))});b(".simple_form.user").livequery(function(){b(this).sexyPost({onprogress:function(d,e){b("#status").text("Uploading: "+(e*100).toFixed(2)+"% complete...")},oncomplete:function(){b("#status").text("Upload complete.")}})});b("html").mouseover(function(){gainedFocus()});b(".bubble p, .bubble ul").live("click",function(d){if(b(d.target).is("p, ul")){d=b(this).parent().get(0).getAttribute("data_user");insertQuote(b(this).text(),d)}});b("#flash_notice").livequery(function(){b.blabbrNotify("success",
b(this).text());b(this).remove()})});function blabbr(){return{user_id:$.cookie("user_id"),audio:$.cookie("audio")}}function insertQuote(b,d){$("#post_body").val($("#post_body").val()+"bq..:"+d+" "+b+" \n\np. ")}function ajaxPath(b){return history.pushState?"/"+b.substr(1)+".js":b.substr(1)+".js"}function showPost(b,d){$.get(b,function(e){if(e){$(e).hide().appendTo("#posts").show("slow");d!=blabbr.user_id&&notify();hideLoadingNotification()}},"js")}
function showEdit(b,d){$("#"+d).find("div").html(b);hideLoadingNotification()}function getAndShow(b,d){$.ajax({type:"GET",url:b,dataType:"html",success:function(e){if(e){showContent(e,d);setTitle($(".page-title").attr("title"));window.location.hash&&goToByScroll(window.location.hash)}}})}function deletePost(b,d){$.ajax({type:"DELETE",url:b,data:$.param(d.toHash()),dataType:"html",success:function(e){replaceContent(e,d.post_id);$("#edit_post_"+d.post_id).remove()}})}
function postAndShow(b,d){$.ajax({type:"POST",url:b,dataType:"html",data:$.param(d.toHash()),success:function(e){showContent(e,"#contents")}})}function postAndReplace(b,d){$.ajax({type:"POST",url:b,dataType:"html",data:$.param(d.toHash()),success:function(e){replaceContent(e,d.post_id)}})}function postAndAdd(b,d){$.ajax({type:"POST",url:b,dataType:"html",data:$.param(d.toHash()),success:function(e){addContent(e)}})}
function subscribeToPusher(b){pusher||(pusher=new Pusher($("body").attr("id")));pusher.channels.channels[b]||pusher.subscribe(b).bind("new-post",function(d){showPost("/topics/"+b+"/posts/"+d.id+".js",d.user_id)})}function showContent(b,d){$(d).show().html(b);hideLoadingNotification()}function setTitle(b){$("#page-title").html(b);document.title="Blabbr - "+b}function replaceContent(b,d){$("#"+d+" .bubble").html(b);hideLoadingNotification()}
function addContent(b){$("#contents").append(b);hideLoadingNotification()}function notify(){lostFocus();blinkTitle(1);blabbr.audio&&audioNotification()}function blinkTitle(b){if(windowIsActive!=true){if(b==1){document.title="[new!] - "+titleHolder;b=0}else{document.title=""+titleHolder;b=1}setTimeout("blinkTitle("+b+")",1600)}else document.title=titleHolder}
function audioNotification(){$("body").append('<audio id="player" src="/sound.mp3" autoplay />');var b=$("#player");$(b).bind("ended",function(){$(this)})}function lostFocus(){windowIsActive=false}function gainedFocus(){windowIsActive=true}function loadingNotification(){$("#contents").append('<p class="loading"></p>')}function hideLoadingNotification(){$(".loading").hide()}
function goToByScroll(b){$(b).livequery(function(){$(this).addClass("anchor");$("html,body").animate({scrollTop:$(this).offset().top},"slow");$(b).livequery().expire()})};
