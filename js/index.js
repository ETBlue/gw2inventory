/*
 RequireJS 2.1.20 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(ba){function G(b){return"[object Function]"===K.call(b)}function H(b){return"[object Array]"===K.call(b)}function v(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function T(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));d-=1);}}function t(b,c){return fa.call(b,c)}function n(b,c){return t(b,c)&&b[c]}function A(b,c){for(var d in b)if(t(b,d)&&c(b[d],d))break}function U(b,c,d,e){c&&A(c,function(c,i){if(d||!t(b,i))e&&"object"===typeof c&&c&&!H(c)&&!G(c)&&!(c instanceof
RegExp)?(b[i]||(b[i]={}),U(b[i],c,d,e)):b[i]=c});return b}function u(b,c){return function(){return c.apply(b,arguments)}}function ca(b){throw b;}function da(b){if(!b)return b;var c=ba;v(b.split("."),function(b){c=c[b]});return c}function B(b,c,d,e){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=e;d&&(c.originalError=d);return c}function ga(b){function c(a,j,b){var f,l,c,d,h,e,g,i,j=j&&j.split("/"),p=k.map,m=p&&p["*"];if(a){a=a.split("/");l=a.length-1;k.nodeIdCompat&&
Q.test(a[l])&&(a[l]=a[l].replace(Q,""));"."===a[0].charAt(0)&&j&&(l=j.slice(0,j.length-1),a=l.concat(a));l=a;for(c=0;c<l.length;c++)if(d=l[c],"."===d)l.splice(c,1),c-=1;else if(".."===d&&!(0===c||1===c&&".."===l[2]||".."===l[c-1])&&0<c)l.splice(c-1,2),c-=2;a=a.join("/")}if(b&&p&&(j||m)){l=a.split("/");c=l.length;a:for(;0<c;c-=1){h=l.slice(0,c).join("/");if(j)for(d=j.length;0<d;d-=1)if(b=n(p,j.slice(0,d).join("/")))if(b=n(b,h)){f=b;e=c;break a}!g&&(m&&n(m,h))&&(g=n(m,h),i=c)}!f&&g&&(f=g,e=i);f&&(l.splice(0,
e,f),a=l.join("/"))}return(f=n(k.pkgs,a))?f:a}function d(a){z&&v(document.getElementsByTagName("script"),function(j){if(j.getAttribute("data-requiremodule")===a&&j.getAttribute("data-requirecontext")===h.contextName)return j.parentNode.removeChild(j),!0})}function p(a){var j=n(k.paths,a);if(j&&H(j)&&1<j.length)return j.shift(),h.require.undef(a),h.makeRequire(null,{skipMap:!0})([a]),!0}function g(a){var j,c=a?a.indexOf("!"):-1;-1<c&&(j=a.substring(0,c),a=a.substring(c+1,a.length));return[j,a]}function i(a,
j,b,f){var l,d,e=null,i=j?j.name:null,k=a,p=!0,m="";a||(p=!1,a="_@r"+(K+=1));a=g(a);e=a[0];a=a[1];e&&(e=c(e,i,f),d=n(q,e));a&&(e?m=d&&d.normalize?d.normalize(a,function(a){return c(a,i,f)}):-1===a.indexOf("!")?c(a,i,f):a:(m=c(a,i,f),a=g(m),e=a[0],m=a[1],b=!0,l=h.nameToUrl(m)));b=e&&!d&&!b?"_unnormalized"+(O+=1):"";return{prefix:e,name:m,parentMap:j,unnormalized:!!b,url:l,originalName:k,isDefine:p,id:(e?e+"!"+m:m)+b}}function r(a){var j=a.id,b=n(m,j);b||(b=m[j]=new h.Module(a));return b}function s(a,
j,b){var f=a.id,c=n(m,f);if(t(q,f)&&(!c||c.defineEmitComplete))"defined"===j&&b(q[f]);else if(c=r(a),c.error&&"error"===j)b(c.error);else c.on(j,b)}function w(a,b){var c=a.requireModules,f=!1;if(b)b(a);else if(v(c,function(b){if(b=n(m,b))b.error=a,b.events.error&&(f=!0,b.emit("error",a))}),!f)e.onError(a)}function x(){R.length&&(v(R,function(a){var b=a[0];"string"===typeof b&&(h.defQueueMap[b]=!0);C.push(a)}),R=[])}function y(a){delete m[a];delete V[a]}function F(a,b,c){var f=a.map.id;a.error?a.emit("error",
a.error):(b[f]=!0,v(a.depMaps,function(f,d){var e=f.id,h=n(m,e);h&&(!a.depMatched[d]&&!c[e])&&(n(b,e)?(a.defineDep(d,q[e]),a.check()):F(h,b,c))}),c[f]=!0)}function D(){var a,b,c=(a=1E3*k.waitSeconds)&&h.startTime+a<(new Date).getTime(),f=[],l=[],e=!1,i=!0;if(!W){W=!0;A(V,function(a){var h=a.map,g=h.id;if(a.enabled&&(h.isDefine||l.push(a),!a.error))if(!a.inited&&c)p(g)?e=b=!0:(f.push(g),d(g));else if(!a.inited&&(a.fetched&&h.isDefine)&&(e=!0,!h.prefix))return i=!1});if(c&&f.length)return a=B("timeout",
"Load timeout for modules: "+f,null,f),a.contextName=h.contextName,w(a);i&&v(l,function(a){F(a,{},{})});if((!c||b)&&e)if((z||ea)&&!X)X=setTimeout(function(){X=0;D()},50);W=!1}}function E(a){t(q,a[0])||r(i(a[0],null,!0)).init(a[1],a[2])}function I(a){var a=a.currentTarget||a.srcElement,b=h.onScriptLoad;a.detachEvent&&!Y?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=h.onScriptError;(!a.detachEvent||Y)&&a.removeEventListener("error",b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}
function J(){var a;for(x();C.length;){a=C.shift();if(null===a[0])return w(B("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));E(a)}h.defQueueMap={}}var W,Z,h,L,X,k={waitSeconds:7,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},m={},V={},$={},C=[],q={},S={},aa={},K=1,O=1;L={require:function(a){return a.require?a.require:a.require=h.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?q[a.map.id]=a.exports:a.exports=q[a.map.id]={}},
module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return n(k.config,a.map.id)||{}},exports:a.exports||(a.exports={})}}};Z=function(a){this.events=n($,a.id)||{};this.map=a;this.shim=n(k.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};Z.prototype={init:function(a,b,c,f){f=f||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&(c=u(this,function(a){this.emit("error",a)}));
this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;this.ignore=f.ignore;f.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;h.startTime=(new Date).getTime();var a=this.map;if(this.shim)h.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],u(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?
this.callPlugin():this.load()}},load:function(){var a=this.map.url;S[a]||(S[a]=!0,h.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;var f=this.exports,l=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(G(l)){if(this.events.error&&this.map.isDefine||e.onError!==ca)try{f=h.execCb(c,l,b,f)}catch(d){a=d}else f=h.execCb(c,l,b,f);this.map.isDefine&&
void 0===f&&((b=this.module)?f=b.exports:this.usingExports&&(f=this.exports));if(a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",w(this.error=a)}else f=l;this.exports=f;if(this.map.isDefine&&!this.ignore&&(q[c]=f,e.onResourceLoad))e.onResourceLoad(h,this.map,this.depMaps);y(c);this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=
!0)}}else t(h.defQueueMap,c)||this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=i(a.prefix);this.depMaps.push(d);s(d,"defined",u(this,function(f){var l,d;d=n(aa,this.map.id);var g=this.map.name,P=this.map.parentMap?this.map.parentMap.name:null,p=h.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(f.normalize&&(g=f.normalize(g,function(a){return c(a,P,!0)})||""),f=i(a.prefix+"!"+g,this.map.parentMap),s(f,"defined",u(this,function(a){this.init([],function(){return a},
null,{enabled:!0,ignore:!0})})),d=n(m,f.id)){this.depMaps.push(f);if(this.events.error)d.on("error",u(this,function(a){this.emit("error",a)}));d.enable()}}else d?(this.map.url=h.nameToUrl(d),this.load()):(l=u(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),l.error=u(this,function(a){this.inited=!0;this.error=a;a.requireModules=[b];A(m,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&y(a.map.id)});w(a)}),l.fromText=u(this,function(f,c){var d=a.name,g=i(d),P=M;c&&(f=c);P&&
(M=!1);r(g);t(k.config,b)&&(k.config[d]=k.config[b]);try{e.exec(f)}catch(m){return w(B("fromtexteval","fromText eval for "+b+" failed: "+m,m,[b]))}P&&(M=!0);this.depMaps.push(g);h.completeLoad(d);p([d],l)}),f.load(a.name,p,l,k))}));h.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){V[this.map.id]=this;this.enabling=this.enabled=!0;v(this.depMaps,u(this,function(a,b){var c,f;if("string"===typeof a){a=i(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=
n(L,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;s(a,"defined",u(this,function(a){this.undefed||(this.defineDep(b,a),this.check())}));this.errback?s(a,"error",u(this,this.errback)):this.events.error&&s(a,"error",u(this,function(a){this.emit("error",a)}))}c=a.id;f=m[c];!t(L,c)&&(f&&!f.enabled)&&h.enable(a,this)}));A(this.pluginMaps,u(this,function(a){var b=n(m,a.id);b&&!b.enabled&&h.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=
[]);c.push(b)},emit:function(a,b){v(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};h={config:k,contextName:b,registry:m,defined:q,urlFetched:S,defQueue:C,defQueueMap:{},Module:Z,makeModuleMap:i,nextTick:e.nextTick,onError:w,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=k.shim,c={paths:!0,bundles:!0,config:!0,map:!0};A(a,function(a,b){c[b]?(k[b]||(k[b]={}),U(k[b],a,!0,!0)):k[b]=a});a.bundles&&A(a.bundles,function(a,b){v(a,
function(a){a!==b&&(aa[a]=b)})});a.shim&&(A(a.shim,function(a,c){H(a)&&(a={deps:a});if((a.exports||a.init)&&!a.exportsFn)a.exportsFn=h.makeShimExports(a);b[c]=a}),k.shim=b);a.packages&&v(a.packages,function(a){var b,a="string"===typeof a?{name:a}:a;b=a.name;a.location&&(k.paths[b]=a.location);k.pkgs[b]=a.name+"/"+(a.main||"main").replace(ha,"").replace(Q,"")});A(m,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=i(b,null,!0))});if(a.deps||a.callback)h.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;
a.init&&(b=a.init.apply(ba,arguments));return b||a.exports&&da(a.exports)}},makeRequire:function(a,j){function g(c,d,p){var k,n;j.enableBuildCallback&&(d&&G(d))&&(d.__requireJsBuild=!0);if("string"===typeof c){if(G(d))return w(B("requireargs","Invalid require call"),p);if(a&&t(L,c))return L[c](m[a.id]);if(e.get)return e.get(h,c,a,g);k=i(c,a,!1,!0);k=k.id;return!t(q,k)?w(B("notloaded",'Module name "'+k+'" has not been loaded yet for context: '+b+(a?"":". Use require([])"))):q[k]}J();h.nextTick(function(){J();
n=r(i(null,a));n.skipMap=j.skipMap;n.init(c,d,p,{enabled:!0});D()});return g}j=j||{};U(g,{isBrowser:z,toUrl:function(b){var d,e=b.lastIndexOf("."),j=b.split("/")[0];if(-1!==e&&(!("."===j||".."===j)||1<e))d=b.substring(e,b.length),b=b.substring(0,e);return h.nameToUrl(c(b,a&&a.id,!0),d,!0)},defined:function(b){return t(q,i(b,a,!1,!0).id)},specified:function(b){b=i(b,a,!1,!0).id;return t(q,b)||t(m,b)}});a||(g.undef=function(b){x();var c=i(b,a,!0),e=n(m,b);e.undefed=!0;d(b);delete q[b];delete S[c.url];
delete $[b];T(C,function(a,c){a[0]===b&&C.splice(c,1)});delete h.defQueueMap[b];e&&(e.events.defined&&($[b]=e.events),y(b))});return g},enable:function(a){n(m,a.id)&&r(a).enable()},completeLoad:function(a){var b,c,d=n(k.shim,a)||{},e=d.exports;for(x();C.length;){c=C.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);E(c)}h.defQueueMap={};c=n(m,a);if(!b&&!t(q,a)&&c&&!c.inited){if(k.enforceDefine&&(!e||!da(e)))return p(a)?void 0:w(B("nodefine","No define call for "+a,null,[a]));E([a,
d.deps||[],d.exportsFn])}D()},nameToUrl:function(a,b,c){var d,g,i;(d=n(k.pkgs,a))&&(a=d);if(d=n(aa,a))return h.nameToUrl(d,b,c);if(e.jsExtRegExp.test(a))d=a+(b||"");else{d=k.paths;a=a.split("/");for(g=a.length;0<g;g-=1)if(i=a.slice(0,g).join("/"),i=n(d,i)){H(i)&&(i=i[0]);a.splice(0,g,i);break}d=a.join("/");d+=b||(/^data\:|\?/.test(d)||c?"":".js");d=("/"===d.charAt(0)||d.match(/^[\w\+\.\-]+:/)?"":k.baseUrl)+d}return k.urlArgs?d+((-1===d.indexOf("?")?"?":"&")+k.urlArgs):d},load:function(a,b){e.load(h,
a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||ia.test((a.currentTarget||a.srcElement).readyState))N=null,a=I(a),h.completeLoad(a.id)},onScriptError:function(a){var b=I(a);if(!p(b.id))return w(B("scripterror","Script error for: "+b.id,a,[b.id]))}};h.require=h.makeRequire();return h}var e,x,y,D,I,E,N,J,r,O,ja=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ka=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,Q=/\.js$/,ha=/^\.\//;x=Object.prototype;var K=
x.toString,fa=x.hasOwnProperty,z=!!("undefined"!==typeof window&&"undefined"!==typeof navigator&&window.document),ea=!z&&"undefined"!==typeof importScripts,ia=z&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,Y="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),F={},s={},R=[],M=!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(G(requirejs))return;s=requirejs;requirejs=void 0}"undefined"!==typeof require&&!G(require)&&(s=require,require=
void 0);e=requirejs=function(b,c,d,p){var g,i="_";!H(b)&&"string"!==typeof b&&(g=b,H(c)?(b=c,c=d,d=p):b=[]);g&&g.context&&(i=g.context);(p=n(F,i))||(p=F[i]=e.s.newContext(i));g&&p.configure(g);return p.require(b,c,d)};e.config=function(b){return e(b)};e.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,4)}:function(b){b()};require||(require=e);e.version="2.1.20";e.jsExtRegExp=/^\/|:|\?|\.js$/;e.isBrowser=z;x=e.s={contexts:F,newContext:ga};e({});v(["toUrl","undef","defined","specified"],
function(b){e[b]=function(){var c=F._;return c.require[b].apply(c,arguments)}});if(z&&(y=x.head=document.getElementsByTagName("head")[0],D=document.getElementsByTagName("base")[0]))y=x.head=D.parentNode;e.onError=ca;e.createNode=function(b){var c=b.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");c.type=b.scriptType||"text/javascript";c.charset="utf-8";c.async=!0;return c};e.load=function(b,c,d){var p=b&&b.config||{},g;if(z){g=e.createNode(p,
c,d);if(p.onNodeCreated)p.onNodeCreated(g,p,c,d);g.setAttribute("data-requirecontext",b.contextName);g.setAttribute("data-requiremodule",c);g.attachEvent&&!(g.attachEvent.toString&&0>g.attachEvent.toString().indexOf("[native code"))&&!Y?(M=!0,g.attachEvent("onreadystatechange",b.onScriptLoad)):(g.addEventListener("load",b.onScriptLoad,!1),g.addEventListener("error",b.onScriptError,!1));g.src=d;J=g;D?y.insertBefore(g,D):y.appendChild(g);J=null;return g}if(ea)try{importScripts(d),b.completeLoad(c)}catch(i){b.onError(B("importscripts",
"importScripts failed for "+c+" at "+d,i,[c]))}};z&&!s.skipDataMain&&T(document.getElementsByTagName("script"),function(b){y||(y=b.parentNode);if(I=b.getAttribute("data-main"))return r=I,s.baseUrl||(E=r.split("/"),r=E.pop(),O=E.length?E.join("/")+"/":"./",s.baseUrl=O),r=r.replace(Q,""),e.jsExtRegExp.test(r)&&(r=I),s.deps=s.deps?s.deps.concat(r):[r],!0});define=function(b,c,d){var e,g;"string"!==typeof b&&(d=c,c=b,b=null);H(c)||(d=c,c=null);!c&&G(d)&&(c=[],d.length&&(d.toString().replace(ja,"").replace(ka,
function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c)));if(M){if(!(e=J))N&&"interactive"===N.readyState||T(document.getElementsByTagName("script"),function(b){if("interactive"===b.readyState)return N=b}),e=N;e&&(b||(b=e.getAttribute("data-requiremodule")),g=F[e.getAttribute("data-requirecontext")])}g?(g.defQueue.push([b,c,d]),g.defQueueMap[b]=!0):R.push([b,c,d])};define.amd={jQuery:!0};e.exec=function(b){return eval(b)};e(s)}})(this);




define('utils/events',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.eventful = eventful;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function eventful() {
    for (var _len = arguments.length, objList = Array(_len), _key = 0; _key < _len; _key++) {
      objList[_key] = arguments[_key];
    }

    objList.forEach(function (obj) {
      obj.on = Events.on;
      obj.off = Events.off;
      obj.trigger = Events.trigger;
      obj.bind = Events.bind;
      obj.unbind = Events.unbind;
      obj.once = Events.once;
      obj.listeningTo = Events.listeningTo;
      obj.listenToOnce = Events.listenToOnce;
      obj.stopListening = Events.stopListening;
    });
  }

  // Backbone.Events
  // ---------------
  // A module that can be mixed in to *any object* in order to provide it with
  // a custom event channel. You may bind a callback to an event with `on` or
  // remove with `off`; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = {};

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jQuery-style event
  // maps `{event: callback}`).
  var eventsApi = function eventsApi(iteratee, events, name, callback, opts) {
    var i = 0,
        names;
    if (name && (typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
      // Handle event maps.
      if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
      for (names = _.keys(name); i < names.length; i++) {
        events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space separated event names by delegating them individually.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        events = iteratee(events, names[i], callback, opts);
      }
    } else {
      // Finally, standard events.
      events = iteratee(events, name, callback, opts);
    }
    return events;
  };

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  Events.on = function (name, callback, context) {
    return internalOn(this, name, callback, context);
  };

  // Guard the `listening` argument from the public API.
  var internalOn = function internalOn(obj, name, callback, context, listening) {
    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
      context: context,
      ctx: obj,
      listening: listening
    });

    if (listening) {
      var listeners = obj._listeners || (obj._listeners = {});
      listeners[listening.id] = listening;
    }

    return obj;
  };

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to
  // for easier unbinding later.
  Events.listenTo = function (obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
      listening = listeningTo[id] = { obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0 };
    }

    // Bind callbacks on obj, and keep track of them on listening.
    internalOn(obj, name, callback, this, listening);
    return this;
  };

  // The reducing API that adds a callback to the `events` object.
  var onApi = function onApi(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context,
          ctx = options.ctx,
          listening = options.listening;
      if (listening) listening.count++;

      handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
    }
    return events;
  };

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  Events.off = function (name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
    });
    return this;
  };

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  Events.stopListening = function (obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
    }
    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

    return this;
  };

  // The reducing API that removes a callback from the `events` object.
  var offApi = function offApi(events, name, callback, options) {
    if (!events) return;

    var i = 0,
        listening;
    var context = options.context,
        listeners = options.listeners;

    // Delete all events listeners and "drop" events.
    if (!name && !callback && !context) {
      var ids = _.keys(listeners);
      for (; i < ids.length; i++) {
        listening = listeners[ids[i]];
        delete listeners[listening.id];
        delete listening.listeningTo[listening.objId];
      }
      return;
    }

    var names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // Bail out if there are no events stored.
      if (!handlers) break;

      // Replace events if there are any remaining.  Otherwise, clean up.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
          remaining.push(handler);
        } else {
          listening = handler.listening;
          if (listening && --listening.count === 0) {
            delete listeners[listening.id];
            delete listening.listeningTo[listening.objId];
          }
        }
      }

      // Update tail event if the list has any events.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }
    if (_.size(events)) return events;
  };

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, its listener will be removed. If multiple events
  // are passed in using the space-separated syntax, the handler will fire
  // once for each event, not once for a combination of all events.
  Events.once = function (name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
    return this.on(events, void 0, context);
  };

  // Inversion-of-control versions of `once`.
  Events.listenToOnce = function (obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
    return this.listenTo(obj, events);
  };

  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
  // `offer` unbinds the `onceWrapper` after it has been called.
  var onceMap = function onceMap(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function () {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.trigger = function (name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = arguments[i + 1];
    }eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // Handles triggering the appropriate event callbacks.
  var triggerApi = function triggerApi(objEvents, name, cb, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function triggerEvents(events, args) {
    var ev,
        i = -1,
        l = events.length,
        a1 = args[0],
        a2 = args[1],
        a3 = args[2];
    switch (args.length) {
      case 0:
        while (++i < l) {
          (ev = events[i]).callback.call(ev.ctx);
        }return;
      case 1:
        while (++i < l) {
          (ev = events[i]).callback.call(ev.ctx, a1);
        }return;
      case 2:
        while (++i < l) {
          (ev = events[i]).callback.call(ev.ctx, a1, a2);
        }return;
      case 3:
        while (++i < l) {
          (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
        }return;
      default:
        while (++i < l) {
          (ev = events[i]).callback.apply(ev.ctx, args);
        }return;
    }
  };

  // Aliases for backwards compatibility.
  Events.bind = Events.on;
  Events.unbind = Events.off;
});


define('model/apiKey',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var storage = localStorage.getItem('gw2apikey');
  var key = void 0;
  if (storage) {
    if (storage.indexOf('current') > -1) {
      key = JSON.parse(storage);
    } else {
      key = { current: storage, recent: {} };
    }
  }
  var apiKey = exports.apiKey = {
    getKey: function getKey() {
      if (key) {
        return key.current;
      } else {
        return null;
      }
    },
    setKey: function setKey(apiKey) {
      if (!key) {
        key = { current: '', recent: {} };
      } else if (!key.current) {
        key = { current: '', recent: {} };
      }
      key.current = apiKey;
      localStorage.setItem('gw2apikey', JSON.stringify(key));
      history.pushState({}, '', '?source=' + apiKey);
    },
    getHistory: function getHistory() {
      return key.recent;
    },
    setHistory: function setHistory(apiKey, accountId) {
      if (!key) {
        key = { current: '', recent: {} };
      } else if (!key.recent) {
        key = { current: '', recent: {} };
      }
      key.recent[apiKey] = accountId;
      localStorage.setItem('gw2apikey', JSON.stringify(key));
    },
    clearHistory: function clearHistory() {
      localStorage.removeItem('gw2apikey');
    }
  };

  exports.default = apiKey;
});


define('model/gw2Data/worlds',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = void 0;

  var worlds = exports.worlds = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/worlds?' + $.param(params)).done(function (worldsData) {
          worldsData.forEach(function (worldData) {
            dataRef[worldData.id] = worldData;
          });
        });
      }
      return loadingRef;
    }
  };
});


define('model/gw2Data/account',['exports', 'model/apiKey', 'model/gw2Data/worlds'], function (exports, _apiKey, _worlds) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.account = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var dataRef = void 0;

  var account = exports.account = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en'
      };
      var waiting = [];
      $.get('https://api.guildwars2.com/v2/account?' + $.param(params)).done(function (accountData) {
        //載入 worlds
        waiting.push(_worlds.worlds.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(function () {
          var account = new Account(accountData);
          dataRef = account.toJSON();
          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Account = function () {
    function Account(data) {
      _classCallCheck(this, Account);

      this._data = data;
      return this;
    }

    _createClass(Account, [{
      key: 'toJSON',
      value: function toJSON() {
        var _this = this;

        var result = {};
        Object.keys(this._data).forEach(function (key) {
          result[key] = _this[key];
        });
        return result;
      }
    }, {
      key: 'id',
      get: function get() {
        return this._data.id || '';
      }
    }, {
      key: 'name',
      get: function get() {
        return this._data.name || '';
      }
    }, {
      key: 'world',
      get: function get() {
        var worldData = _worlds.worlds.get(this._data.world);
        return '' + worldData.name;
      }
    }, {
      key: 'created',
      get: function get() {
        var created = this._data.created;
        return created.slice(0, created.indexOf('T')) || '';
      }
    }, {
      key: 'access',
      get: function get() {
        return this._data.access || '';
      }
    }, {
      key: 'fractal_level',
      get: function get() {
        return this._data.fractal_level || '';
      }
    }, {
      key: 'daily_ap',
      get: function get() {
        return this._data.daily_ap || '';
      }
    }, {
      key: 'monthly_ap',
      get: function get() {
        return this._data.monthly_ap || '';
      }
    }, {
      key: 'wvw_rank',
      get: function get() {
        return this._data.wvw_rank || '';
      }
    }]);

    return Account;
  }();
});


define('model/gw2Data/titles',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = void 0;

  var titles = exports.titles = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/titles?' + $.param(params)).done(function (titlesData) {
          titlesData.forEach(function (titleData) {
            dataRef[titleData.id] = titleData;
          });
        });
      }
      return loadingRef;
    }
  };
});


define('model/gw2Data/accountTitles',['exports', 'model/apiKey', 'model/gw2Data/titles'], function (exports, _apiKey, _titles) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.accountTitles = undefined;


  var dataRef = void 0;

  var accountTitles = exports.accountTitles = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en'
      };
      var waiting = [];
      $.get('https://api.guildwars2.com/v2/account/titles?' + $.param(params)).done(function (accountTitlesData) {
        //載入 titles
        waiting.push(_titles.titles.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(function () {
          var titleList = [];
          accountTitlesData.forEach(function (id) {
            var titleData = _titles.titles.get(id);
            if (titleData) {
              titleList.push('<span class="inline-block">' + titleData.name + '</span>');
            }
          });
          dataRef = titleList.join(', ');
          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };
});


define('model/gw2Data/guilds',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = {};

  var guilds = exports.guilds = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load(id) {
      if (!loadingRef[id]) {
        var params = {
          guild_id: id
        };
        loadingRef[id] = $.get('https://api.guildwars2.com/v1/guild_details.json?' + $.param(params)).done(function (guildData) {
          dataRef[guildData.guild_id] = guildData;
        });
      }
      return loadingRef[id];
    },
    loadByCharacterList: function loadByCharacterList(characterList) {
      var _this = this;

      var waiting = [];
      characterList.forEach(function (characterData) {
        if (characterData.guild) {
          waiting.push(_this.load(characterData.guild));
        }
      });
      return $.when.apply($.when, waiting);
    }
  };
});


define('model/gw2Data/specializations',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = void 0;

  var specializations = exports.specializations = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/specializations?' + $.param(params)).done(function (specializationData) {
          specializationData.forEach(function (specialization) {
            dataRef[specialization.id] = specialization;
          });
        });
      }
      return loadingRef;
    }
  };
});


define('model/gw2Data/traits',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var dataRef = {};

  var traits = exports.traits = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load(ids) {
      var result = new $.Deferred();
      ids = [].concat(_toConsumableArray(new Set(ids)));
      var params = {
        lang: 'en'
      };
      var waiting = [1];
      while (ids.length > 0) {
        params.ids = ids.splice(0, 200).join(',');
        waiting.push($.get('https://api.guildwars2.com/v2/traits?' + $.param(params)));
      }
      $.when.apply($.when, waiting).done(function (one) {
        for (var _len = arguments.length, deferrerResponse = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          deferrerResponse[_key - 1] = arguments[_key];
        }

        deferrerResponse.forEach(function (response) {
          var traitList = response[0];
          traitList.forEach(function (trait) {
            dataRef[trait.id] = trait;
          });
        });
        result.resolve(dataRef);
      });
      return result;
    },
    loadByCharacterList: function loadByCharacterList(characterList) {
      var needTraitsIdList = [];
      characterList.forEach(function (characterData) {
        if (characterData.specializations) {
          $.each(characterData.specializations, function (key, subSpecialization) {
            if (subSpecialization) {
              subSpecialization.forEach(function (specialization) {
                if (specialization && specialization.traits) {
                  specialization.traits.forEach(function (trait) {
                    needTraitsIdList.push(trait);
                  });
                }
              });
            }
          });
        }
      });
      return this.load(needTraitsIdList);
    }
  };
});


define('model/gw2Data/items',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var dataRef = {};

  var items = exports.items = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load(ids) {
      var result = new $.Deferred();
      ids = [].concat(_toConsumableArray(new Set(ids)));
      var params = {
        lang: 'en'
      };
      var waiting = [1];
      while (ids.length > 0) {
        params.ids = ids.splice(0, 200).join(',');
        waiting.push($.get('https://api.guildwars2.com/v2/items?' + $.param(params)));
      }
      $.when.apply($.when, waiting).done(function (one) {
        for (var _len = arguments.length, deferrerResponse = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          deferrerResponse[_key - 1] = arguments[_key];
        }

        deferrerResponse.forEach(function (response) {
          var itemList = response[0];
          itemList.forEach(function (item) {
            dataRef[item.id] = item;
          });
        });
        result.resolve(dataRef);
      });
      return result;
    },
    loadByCharacterList: function loadByCharacterList(characterList) {
      var needItemIdList = [];
      characterList.forEach(function (characterData) {
        if (characterData.bags) {
          characterData.bags.forEach(function (bag) {
            if (bag) {
              needItemIdList.push(bag.id);
              if (bag.inventory) {
                bag.inventory.forEach(function (item) {
                  if (item) {
                    needItemIdList.push(item.id);
                    if (item.upgrades) {
                      item.upgrades.forEach(function (upgradeId) {
                        needItemIdList.push(upgradeId);
                      });
                    }
                    if (item.infusions) {
                      item.infusions.forEach(function (infusionId) {
                        needItemIdList.push(infusionId);
                      });
                    }
                  }
                });
              }
            }
          });
        }
        if (characterData.equipment) {
          characterData.equipment.forEach(function (equipment) {
            if (equipment) {
              needItemIdList.push(equipment.id);
              if (equipment.upgrades) {
                equipment.upgrades.forEach(function (upgradeId) {
                  needItemIdList.push(upgradeId);
                });
              }
              if (equipment.infusions) {
                equipment.infusions.forEach(function (infusionId) {
                  needItemIdList.push(infusionId);
                });
              }
            }
          });
        }
      });
      return this.load(needItemIdList);
    },
    loadByCharacterInventory: function loadByCharacterInventory(characterList) {
      var needItemIdList = [];
      characterList.forEach(function (characterData) {
        if (characterData.bags) {
          characterData.bags.forEach(function (bag) {
            if (bag) {
              if (bag.inventory) {
                bag.inventory.forEach(function (item) {
                  if (item) {
                    needItemIdList.push(item.id);
                    if (item.upgrades) {
                      item.upgrades.forEach(function (upgradeId) {
                        needItemIdList.push(upgradeId);
                      });
                    }
                    if (item.infusions) {
                      item.infusions.forEach(function (infusionId) {
                        needItemIdList.push(infusionId);
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
      return this.load(needItemIdList);
    },
    loadByBankList: function loadByBankList(bankData) {
      var needItemIdList = [];
      bankData.forEach(function (itemData) {
        if (itemData) {
          needItemIdList.push(itemData.id);
        }
      });
      return this.load(needItemIdList);
    },
    loadByVaultList: function loadByVaultList(vaultData) {
      var needItemIdList = [];
      vaultData.forEach(function (itemData) {
        if (itemData) {
          needItemIdList.push(itemData.id);
        }
      });
      return this.load(needItemIdList);
    },
    loadByAccountInventoryList: function loadByAccountInventoryList(accountInventoryData) {
      var needItemIdList = [];
      accountInventoryData.forEach(function (itemData) {
        if (itemData) {
          needItemIdList.push(itemData.id);
        }
      });
      return this.load(needItemIdList);
    }
  };
});


define('model/gw2Data/characters',['exports', 'model/apiKey', 'model/gw2Data/guilds', 'model/gw2Data/specializations', 'model/gw2Data/traits', 'model/gw2Data/items'], function (exports, _apiKey, _guilds, _specializations, _traits, _items) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.characters = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var dataRef = void 0;

  var characters = exports.characters = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en',
        page: 0
      };
      var waiting = [];
      //載入specializations
      waiting.push(_specializations.specializations.load());
      $.get('https://api.guildwars2.com/v2/characters?' + $.param(params)).done(function (characterList) {
        //載入guild
        waiting.push(_guilds.guilds.loadByCharacterList(characterList));
        //載入traits
        waiting.push(_traits.traits.loadByCharacterList(characterList));
        //載入items
        waiting.push(_items.items.loadByCharacterList(characterList));

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(function () {
          dataRef = characterList.map(function (characterData) {
            var character = new Character(characterData);
            return character.toJSON();
          });
          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Character = function () {
    function Character(data) {
      _classCallCheck(this, Character);

      this._data = data;
      return this;
    }

    _createClass(Character, [{
      key: 'toJSON',
      value: function toJSON() {
        var _this = this;

        var result = {};
        Object.keys(this._data).forEach(function (key) {
          result[key] = _this[key];
        });
        result.inventory = this.inventory;
        result._data = this._data;
        return result;
      }
    }, {
      key: 'name',
      get: function get() {
        return this._data.name || '';
      }
    }, {
      key: 'race',
      get: function get() {
        return this._data.race + '<br /><span class=\'small light\'>' + this._data.gender + '</span>';
      }
    }, {
      key: 'gender',
      get: function get() {
        return this._data.gender || '';
      }
    }, {
      key: 'profession',
      get: function get() {
        var profession = this._data.profession || '';
        var characterSpecializations = this._data.specializations;
        characterSpecializations.pve.forEach(function (specialization) {
          if (specialization) {
            var specializationRef = _specializations.specializations.get(specialization.id);
            if (specializationRef.elite) {
              profession = specializationRef.profession + '<br /><span class=\'small light\'>' + specializationRef.name + '</span>';
            }
          }
        });
        return profession;
      }
    }, {
      key: 'level',
      get: function get() {
        return this._data.level || '';
      }
    }, {
      key: 'created',
      get: function get() {
        var created = this._data.created;
        return created.slice(0, created.indexOf('T')) || '';
      }
    }, {
      key: 'age',
      get: function get() {
        var age = this._data.age;
        var seconds = age % 60;
        var minutes = Math.floor(age / 60) % 60;
        var hours = Math.floor(age / 3600);
        return hours + ':' + minutes + ':' + seconds;
      }
    }, {
      key: 'deaths',
      get: function get() {
        var deathCount = this._data.deaths;
        if (deathCount > 0) {
          var age = this._data.age / this._data.deaths;
          var minutes = Math.floor(age / 60);
          var deathPeriod = minutes + ' mins';
          return this._data.deaths + '<br /><span class=\'small light\'>' + deathPeriod + '</span>';
        } else {
          return this._data.deaths || '';
        }
      }
    }, {
      key: 'guild',
      get: function get() {
        if (this._data.guild) {
          var guildData = _guilds.guilds.get(this._data.guild);
          return guildData.guild_name + '<br /><span class=\'small light\'>[' + guildData.tag + ']</span>';
        } else {
          return '';
        }
      }
    }, {
      key: 'crafting',
      get: function get() {
        var crafting = this._data.crafting;
        if (crafting && crafting.reduce) {
          return crafting.reduce(function (html, craftData) {
            return html + (craftData.rating + '|' + craftData.discipline + ' <br />');
          }, '');
        }
      }
    }, {
      key: 'specializations',
      get: function get() {
        var specializations = this._data.specializations;
        return {
          pve: getSpecializationHtml(specializations.pve),
          pvp: getSpecializationHtml(specializations.pvp),
          wvw: getSpecializationHtml(specializations.wvw)
        };
      }
    }, {
      key: 'equipment',
      get: function get() {
        var equipmentArray = this._data.equipment;

        // 先把 equipment array 轉成 hash
        var equipment = {};
        equipmentArray.forEach(function (element) {
          equipment[element.slot] = {};
          equipment[element.slot].id = element.id;
          equipment[element.slot].upgrades = element.upgrades;
          equipment[element.slot].infusions = element.infusions;
        });

        return {
          Helm: getEquipmentItemHtml(equipment.Helm),
          Shoulders: getEquipmentItemHtml(equipment.Shoulders),
          Gloves: getEquipmentItemHtml(equipment.Gloves),
          Coat: getEquipmentItemHtml(equipment.Coat),
          Leggings: getEquipmentItemHtml(equipment.Leggings),
          Boots: getEquipmentItemHtml(equipment.Boots),
          Backpack: getEquipmentItemHtml(equipment.Backpack),
          HelmAquatic: getEquipmentItemHtml(equipment.HelmAquatic),
          Amulet: getEquipmentItemHtml(equipment.Amulet),
          Accessory1: getEquipmentItemHtml(equipment.Accessory1),
          Accessory2: getEquipmentItemHtml(equipment.Accessory2),
          Ring1: getEquipmentItemHtml(equipment.Ring1),
          Ring2: getEquipmentItemHtml(equipment.Ring2),
          WeaponA1: getEquipmentItemHtml(equipment.WeaponA1),
          WeaponA2: getEquipmentItemHtml(equipment.WeaponA2),
          WeaponB1: getEquipmentItemHtml(equipment.WeaponB1),
          WeaponB2: getEquipmentItemHtml(equipment.WeaponB2),
          WeaponAquaticA: getEquipmentItemHtml(equipment.WeaponAquaticA),
          WeaponAquaticB: getEquipmentItemHtml(equipment.WeaponAquaticB),
          Sickle: getToolItemHtml(equipment.Sickle),
          Axe: getToolItemHtml(equipment.Axe),
          Pick: getToolItemHtml(equipment.Pick)
        };
      }
    }, {
      key: 'bags',
      get: function get() {
        var bags = this._data.bags || [];
        return getBagHtml(bags);
      }
    }, {
      key: 'inventory',
      get: function get() {
        var bags = this._data.bags || [];
        var inventory = {
          services: [],
          special: [],
          boosts: [],
          //style: [],
          misc: []
        };

        bags.forEach(function (bag) {
          if (bag) {
            bag.inventory.forEach(function (item) {
              if (item) {
                var itemData = _items.items.get(item.id);
                if (itemData) {
                  itemData.count = item.count || '';
                  itemData.binding = item.binding || '';
                  itemData.bound_to = item.bound_to || '';
                  if (itemData.type == 'Consumable') {
                    //if (itemData.details.type == 'AppearanceChange') {
                    //  inventory.services.push(itemData);
                    //}
                    if (itemData.details.type == 'Booze') {}
                    // alcohol

                    //if (itemData.details.type == 'ContractNpc') {
                    //  inventory.services.push(itemData);
                    //}
                    if (itemData.details.type == 'Food') {
                      inventory.boosts.push(itemData);
                    }
                    if (itemData.details.type == 'Generic') {
                      inventory.misc.push(itemData);
                    }
                    if (itemData.details.type == 'Halloween') {
                      inventory.boosts.push(itemData);
                    }
                    if (itemData.details.type == 'Immediate') {
                      inventory.misc.push(itemData);
                    }
                    //if (itemData.details.type == 'Transmutation') {
                    //  inventory.style.push(itemData);
                    //}
                    if (itemData.details.type == 'Unlock') {
                      inventory.misc.push(itemData);
                    }
                    //if (itemData.details.type == 'UpgradeRemoval') {
                    //  inventory.special.push(itemData);
                    //}
                    if (itemData.details.type == 'Utility') {
                      inventory.boosts.push(itemData);
                    }
                    //if (itemData.details.type == 'TeleportToFriend') {
                    //  inventory.special.push(itemData);
                    //}
                  }
                  if (itemData.type == 'Gizmo') {
                    if (itemData.details.type == 'Default') {
                      inventory.misc.push(itemData);
                    }
                    //if (itemData.details.type == 'ContainerKey') {
                    //  inventory.special.push(itemData);
                    //}
                    //if (itemData.details.type == 'RentableContractNpc') {
                    //  inventory.services.push(itemData);
                    //}
                    //if (itemData.details.type == 'UnlimitedConsumable') {
                    //  inventory.services.push(itemData);
                    //}
                  }
                }
              }
            });
          }
        });

        return {
          //services: getInventoryHtml(inventory.services),
          //special: getInventoryHtml(inventory.special),
          boosts: getInventoryHtml(inventory.boosts)
        };
      }
    }]);

    return Character;
  }();

  function getSpecializationHtml(dataList) {
    return dataList.reduce(function (html, specializationData) {
      if (specializationData) {
        var specialization = _specializations.specializations.get(specializationData.id);
        var traitHtml = '';
        if (specializationData.traits) {
          traitHtml = specializationData.traits.reduce(function (traitHtml, traitId) {
            var trait = _traits.traits.get(traitId);
            if (trait) {
              return traitHtml + ('\n              <div class=\'table-item\'>\n                <img class=\'small icon\' data-toggle=\'tooltip\' data-placement=\'top\' data-html=\'true\' title=\'' + trait.description + '\' src=\'' + trait.icon + '\'>\n                <span>' + trait.name + '</span>\n              </div>\n            ');
            } else {
              return traitHtml;
            }
          }, '');
        }
        return html + ('\n        <div class=\'table-item\'>\n          <img class=\'medium icon spec\' src=\'' + specialization.icon + '\' />\n          <span>' + specialization.name + '</span>\n        </div>\n        ' + traitHtml + '\n      ');
      } else {
        return html;
      }
    }, '');
  }

  function getToolItemHtml(data) {
    var html = '';
    if (data) {
      var tool = _items.items.get(data.id);
      var descriptionHtml = getToolTipHtml(tool);
      html += '\n      <div class=\'table-item\'>\n        <img class=\'medium icon item ' + tool.rarity + '\' data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + descriptionHtml + '\' src=\'' + tool.icon + '\'>\n        <div class=\'bold ' + tool.rarity + '\'>' + tool.name + '\n          <span class=\'small light\'>(' + tool.level + ')</span>\n        </div>\n      </div>\n    ';
    }
    return html;
  }

  function getEquipmentItemHtml(data) {
    var iconHtml = '';
    var nameHtml = '';
    if (data) {
      var equipment = _items.items.get(data.id);
      if (data.upgrades || data.infusions) {
        nameHtml += '<hr />';
      }
      if (data.upgrades) {
        data.upgrades.forEach(function (upgradeId) {
          var upgrade = _items.items.get(upgradeId);
          if (upgrade) {
            var descriptionHtml = getToolTipHtml(upgrade);
            iconHtml += '\n            <img class=\'medium icon item ' + upgrade.rarity + '\' data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + descriptionHtml + '\' src=\'' + upgrade.icon + '\'>\n          ';
            nameHtml += '\n            <div class=\'small bold ' + upgrade.rarity + '\'>' + upgrade.name + '\n              <span class=\'light\'>(' + upgrade.level + ')</span>\n            </div>\n            ';
          }
        });
      }
      if (data.infusions) {
        data.infusions.forEach(function (infusionId) {
          var infusion = _items.items.get(infusionId);
          if (infusion) {
            var descriptionHtml = getToolTipHtml(infusion);
            iconHtml += '\n            <img class=\'medium icon item ' + infusion.rarity + '\' data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + descriptionHtml + '\' src=\'' + infusion.icon + '\'>\n          ';
            nameHtml += '\n            <div class=\'small bold ' + infusion.rarity + '\'>' + infusion.name + '</div>\n          ';
          }
        });
      }
      if (equipment) {
        var descriptionHtml = getToolTipHtml(equipment);
        return '\n        <div class=\'equipment\'>\n          <img data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + descriptionHtml + '\' class=\'icon large item ' + equipment.rarity + '\' src=\'' + equipment.icon + '\' />\n          ' + iconHtml + '\n        </div>\n        <div class=\'equipment\'>\n          <div class=\'bold ' + equipment.rarity + '\'>' + equipment.name + '\n            <span class=\'small light\'>(' + equipment.level + ')</span>\n          </div>\n          ' + nameHtml + '\n        </div>\n        ';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  function getBagHtml(dataList) {
    var iconHtml = '';
    var nameHtml = '';
    var countHtml = '';
    var bagCount = 0;
    var slotCount = 0;
    dataList.forEach(function (bagData) {
      slotCount += 1;
      if (bagData) {
        bagCount += 1;
        var bag = _items.items.get(bagData.id);
        var descriptionHtml = getToolTipHtml(bag);
        iconHtml += '\n        <img data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + descriptionHtml + '\' class=\'icon large item ' + bag.rarity + '\' src=\'' + bag.icon + '\' />\n      ';
        nameHtml += '\n        <div class=\'bold ' + bag.rarity + '\'>' + bag.name + ' \n          <span class=\'small light\'>(' + bag.details.size + ' slots)</span>\n        </div>\n      ';
      }
    });
    if (slotCount - bagCount > 1) {
      countHtml += ' (' + (slotCount - bagCount) + ' unused slots)';
    } else if (slotCount - bagCount == 1) {
      countHtml += ' (1 unused slot)';
    }
    return '\n    <p>' + bagCount + ' bags: ' + countHtml + '</p>\n    <div class=\'equipment\'>\n      ' + iconHtml + '\n    </div>\n    <div class=\'equipment\'>\n      ' + nameHtml + '\n    </div>\n  ';
  }

  function getInventoryHtml(dataList) {
    var iconHtml = '';
    var nameHtml = '';
    var countHtml = '';
    var count = [];
    var foodCount = 0;
    var utilityCount = 0;
    var holloweenCount = 0;
    dataList.forEach(function (item) {
      if (item) {
        var descriptionHtml = getToolTipHtml(item);
        iconHtml += '\n        <img data-toggle=\'tooltip\' data-placement=\'top\' title=\'' + descriptionHtml + '\' class=\'icon medium item ' + item.rarity + '\' src=\'' + item.icon + '\' />\n      ';
        nameHtml += '\n        <div>' + item.count + ' \n          <span class=\'bold ' + item.rarity + '\'>' + item.name + ' \n            <span class=\'small light\'>(' + item.level + ')</span>\n          </span>\n        </div>\n      ';
        if (item.details.type == 'Food') {
          foodCount++;
        } else if (item.details.type == 'Utility') {
          utilityCount++;
        } else if (item.details.type == 'Halloween') {
          holloweenCount++;
        }
      }
    });
    if (foodCount > 0) {
      count.push(foodCount + ' food');
    }
    if (utilityCount > 1) {
      count.push(utilityCount + ' utilities');
    } else if (utilityCount == 1) {
      count.push(utilityCount + ' utility');
    }
    if (holloweenCount > 1) {
      count.push(holloweenCount + ' Boosters');
    } else if (holloweenCount == 1) {
      count.push('1 Booster');
    }
    if (count.length > 0) {
      countHtml = '<p>' + count.join(', ') + ':</p>';
    }
    return '\n    ' + countHtml + '\n    <div class=\'equipment\'>\n      ' + iconHtml + '\n    </div>\n    <div class=\'equipment\'>\n      ' + nameHtml + '\n    </div>\n  ';
  }

  function escapeHtml(data) {

    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };

    return String(data).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });

    var escape = document.createElement('textarea');
    escape.textContent = data;
    var html = escape.innerHTML;
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br />').replace();
  }

  function getToolTipHtml(item) {
    var html = '';
    if (item.details) {
      if (item.details.infix_upgrade) {
        if (item.details.infix_upgrade.attributes) {
          item.details.infix_upgrade.attributes.forEach(function (attribute) {
            html += attribute.attribute + ': ' + attribute.modifier + '<br />';
          });
        }
        if (item.details.infix_upgrade.buff) {
          //        item.details.infix_upgrade.buff.forEach((skill) => {
          //          const description = skill.description || '';
          //          html += escapeHtml(description);
          //        });
        }
      }
      if (item.details.stat_choices) {}
      if (item.details.description) {
        var description = item.details.description || '';
        html += escapeHtml(description);
      } else if (item.description) {
        var _description = item.description || '';
        html += escapeHtml(_description);
      }
    } else if (item.description) {
      var _description2 = item.description || '';
      html += escapeHtml(_description2);
    }
    return html;
  }
});


define('model/gw2Data/materials',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = void 0;

  var materials = exports.materials = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/materials?' + $.param(params)).done(function (categories) {
          categories.forEach(function (category) {
            dataRef[category.id] = category;
          });
        });
      }
      return loadingRef;
    }
  };
});


define('model/gw2Data/vault',['exports', 'model/apiKey'], function (exports, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.vault = undefined;


  var dataRef = void 0;

  var vault = exports.vault = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en'
      };
      //載入倉庫
      $.get('https://api.guildwars2.com/v2/account/materials?' + $.param(params)).done(function (materialList) {
        dataRef = materialList;
        loadDeferred.resolve(dataRef);
      });
      return loadDeferred;
    }
  };
});


define('model/gw2Data/bank',['exports', 'model/apiKey'], function (exports, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.bank = undefined;


  var dataRef = void 0;

  var bank = exports.bank = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en',
        page: 0
      };

      //載入銀行
      $.get('https://api.guildwars2.com/v2/account/bank?' + $.param(params)).done(function (bankData) {
        dataRef = bankData;
        loadDeferred.resolve(dataRef);
      });
      return loadDeferred;
    }
  };
});


define('model/gw2Data/accountInventory',['exports', 'model/apiKey'], function (exports, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.accountInventory = undefined;


  var dataRef = void 0;

  var accountInventory = exports.accountInventory = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en',
        page: 0
      };

      //載入銀行
      $.get('https://api.guildwars2.com/v2/account/inventory?' + $.param(params)).done(function (accountInventoryData) {
        dataRef = accountInventoryData;
        loadDeferred.resolve(dataRef);
      });
      return loadDeferred;
    }
  };
});


define('model/gw2Data/inventory',['exports', 'model/apiKey', 'model/gw2Data/items', 'model/gw2Data/characters', 'model/gw2Data/materials', 'model/gw2Data/vault', 'model/gw2Data/bank', 'model/gw2Data/accountInventory'], function (exports, _apiKey, _items, _characters, _materials, _vault, _bank, _accountInventory) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.inventory = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var dataRef = void 0;
  var materialRef = void 0;

  var inventory = exports.inventory = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en',
        page: 0
      };
      var waiting = [];

      // 載入材料分類表
      waiting.push(_materials.materials.load());

      // 載入角色包包與物品資料
      waiting.push(_characters.characters.load());

      // 載入倉庫與物品資料
      waiting.push(_vault.vault.load());

      //載入銀行
      waiting.push(_bank.bank.load());

      //載入 shared inventory slots
      waiting.push(_accountInventory.accountInventory.load());

      $.when.apply($.when, waiting).done(function () {
        var waitingLoadItems = [];
        //載入銀行物品資料
        waitingLoadItems.push(_items.items.loadByBankList(_bank.bank.get()));
        waitingLoadItems.push(_items.items.loadByVaultList(_vault.vault.get()));
        waitingLoadItems.push(_items.items.loadByAccountInventoryList(_accountInventory.accountInventory.get()));

        //全部載入完畢後才 merge
        $.when.apply($.when, waitingLoadItems).done(function () {

          dataRef = [];
          materialRef = {};

          var vaultDataRef = _vault.vault.get().map(function (material, index) {
            if (material) {
              materialRef[material.id] = _materials.materials.get(material.category).name;
              var itemInfo = _items.items.get(material.id);
              var position = 'Vault|' + (index + 1);
              var item = new Item(position, material, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, vaultDataRef);

          var characterDataRef = [];
          _characters.characters.get().forEach(function (character) {
            character._data.equipment = character._data.equipment || [];
            character._data.equipment.forEach(function (equipmentItem) {
              if (equipmentItem) {
                var itemInfo = _items.items.get(equipmentItem.id);
                var position = character.name + '<br /><span class=\'small light\'>(equipped)</span>';
                equipmentItem.count = 1;
                var item = new Item(position, equipmentItem, itemInfo);
                characterDataRef.push(item.toJSON());
              }
            });
            character._data.bags = character._data.bags || [];
            character._data.bags.forEach(function (bag) {
              if (bag) {
                var itemInfo = _items.items.get(bag.id);
                var position = character.name + '<br /><span class=\'small light\'>(equipped)</span>';
                bag.count = 1;
                var item = new Item(position, bag, itemInfo);
                characterDataRef.push(item.toJSON());

                bag.inventory.forEach(function (bagItem) {
                  if (bagItem) {
                    var _itemInfo = _items.items.get(bagItem.id);
                    var _position = character.name + '<br /><span class=\'small light\'>(bag)</span>';
                    var _item = new Item(_position, bagItem, _itemInfo);
                    characterDataRef.push(_item.toJSON());
                  }
                });
              }
            });
          });
          $.merge(dataRef, characterDataRef);

          var bankDataRef = _bank.bank.get().map(function (bankItem, index) {
            if (bankItem) {
              var itemInfo = _items.items.get(bankItem.id);
              var position = 'Bank|' + (index + 1);
              var item = new Item(position, bankItem, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, bankDataRef);

          var accountInventoryDataRef = _accountInventory.accountInventory.get().map(function (accountInventoryItem, index) {
            if (accountInventoryItem) {
              var itemInfo = _items.items.get(accountInventoryItem.id);
              var position = 'Shared|' + (index + 1);
              var item = new Item(position, accountInventoryItem, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, accountInventoryDataRef);

          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Item = function () {
    function Item(position, data, itemInfo) {
      _classCallCheck(this, Item);

      this._data = data || {};
      this._data.position = position || '';
      this._ref = itemInfo || {};
      return this;
    }

    _createClass(Item, [{
      key: 'toJSON',
      value: function toJSON() {
        var _this = this;

        var result = {};
        var keys = ['icon', 'name', 'count', 'type', 'level', 'rarity', 'position', 'binding', 'id', 'category'];
        keys.forEach(function (key) {
          result[key] = _this[key];
        });
        //Object.keys(this._data).forEach((key) => {
        //  result[key] = this[key];
        //});
        //Object.keys(this._ref).forEach((key) => {
        //  result[key] = this[key];
        //});
        return result;
      }
    }, {
      key: 'id',
      get: function get() {
        return this._data.id || '';
      }
    }, {
      key: 'icon',
      get: function get() {
        var icon = this._ref.icon || '';
        var rarity = this._ref.rarity || '';
        var description = getToolTipHtml(this._ref);
        return '<img class=\'large solo item icon ' + rarity + '\' data-toggle=\'tooltip\' data-html=\'true\' data-placement=\'right\' title=\'' + description + '\' src=\'' + icon + '\' />';
      }
    }, {
      key: 'name',
      get: function get() {
        var name = this._ref.name || '';
        var rarity = this._ref.rarity || '';
        return '<span class=\'bold ' + rarity + '\'>' + name + '</span>';
      }
    }, {
      key: 'count',
      get: function get() {
        return parseInt(this._data.count, 10);
      }
    }, {
      key: 'type',
      get: function get() {
        var type = this._ref.type || '';
        if (type == 'UpgradeComponent') {
          type = 'Upgrades';
        } else if (type == 'CraftingMaterial') {
          type = 'Material';
        }
        return type;
      }
    }, {
      key: 'level',
      get: function get() {
        return this._ref.level || '';
      }
    }, {
      key: 'rarity',
      get: function get() {
        return this._ref.rarity || '';
      }
    }, {
      key: 'position',
      get: function get() {
        var html = this._data.position || '';
        if (this._data.category) {
          var category = _materials.materials.get(this._data.category).name || '';
          return html += '<br /><span class=\'small light\'>' + category + '</span>';
        } else {
          return html;
        }
      }
    }, {
      key: 'binding',
      get: function get() {
        var binding = this._data.binding;
        var bound_to = this._data.bound_to;
        if (binding) {
          if (bound_to) {
            return bound_to;
          } else {
            return binding;
          }
        } else {
          return '';
        }
      }
    }, {
      key: 'description',
      get: function get() {
        return this._ref.description || '';
      }
    }, {
      key: 'category',
      get: function get() {
        if (materialRef[this._data.id]) {
          return materialRef[this._data.id] || '';
        } else {
          return '';
        }
      }
    }]);

    return Item;
  }();

  function escapeHtml(data) {

    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };

    return String(data).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });

    var escape = document.createElement('textarea');
    escape.textContent = data;
    var html = escape.innerHTML;
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br />').replace();
  }

  function getToolTipHtml(item) {
    var html = '';
    if (item.details) {
      if (item.details.infix_upgrade) {
        if (item.details.infix_upgrade.attributes) {
          item.details.infix_upgrade.attributes.forEach(function (attribute) {
            html += attribute.attribute + ': ' + attribute.modifier + '<br />';
          });
        }
        if (item.details.infix_upgrade.buff) {
          //        item.details.infix_upgrade.buff.forEach((skill) => {
          //          const description = skill.description || '';
          //          html += escapeHtml(description);
          //        });
        }
      }
      if (item.details.stat_choices) {}
      if (item.details.description) {
        var description = item.details.description || '';
        html += escapeHtml(description);
      } else if (item.description) {
        var _description = item.description || '';
        html += escapeHtml(_description);
      }
    } else if (item.description) {
      var _description2 = item.description || '';
      html += escapeHtml(_description2);
    }
    return html;
  }
});


define('model/gw2Data/currencies',['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = void 0;

  var currencies = exports.currencies = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/currencies?' + $.param(params)).done(function (currenciesData) {
          currenciesData.forEach(function (currency) {
            dataRef[currency.id] = currency;
          });
        });
      }
      return loadingRef;
    }
  };
});


define('model/gw2Data/wallet',['exports', 'model/apiKey', 'model/gw2Data/currencies'], function (exports, _apiKey, _currencies) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wallet = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var dataRef = void 0;

  var wallet = exports.wallet = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en'
      };
      var waiting = [];
      $.get('https://api.guildwars2.com/v2/account/wallet?' + $.param(params)).done(function (walletData) {
        //載入currencies
        waiting.push(_currencies.currencies.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(function () {
          dataRef = walletData.map(function (walletItem) {
            var item = new Wallet(walletItem);
            return item.toJSON();
          });
          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Wallet = function () {
    function Wallet(data) {
      _classCallCheck(this, Wallet);

      this._data = data;
      return this;
    }

    _createClass(Wallet, [{
      key: 'toJSON',
      value: function toJSON() {
        var _this = this;

        var result = {};
        Object.keys(this._data).forEach(function (key) {
          result[key] = _this[key];
        });
        ['name', 'description', 'icon', 'order'].forEach(function (key) {
          result[key] = _this[key] || '';
        });
        return result;
      }
    }, {
      key: 'icon',
      get: function get() {
        var iconUrl = _currencies.currencies.get(this._data.id).icon || '';
        return '<img class=\'large solo icon\' src=\'' + iconUrl + '\' />';
      }
    }, {
      key: 'name',
      get: function get() {
        var name = _currencies.currencies.get(this._data.id).name || '';
        return '<span class="bold">' + name + '</span>';
      }
    }, {
      key: 'value',
      get: function get() {
        var value = this._data.value || '';
        var name = _currencies.currencies.get(this._data.id).name;
        if (name == 'Coin') {
          return getCoinHtml(value);
        } else if (name == 'Gem') {
          return '<span class=\'currency gem\'>' + value + '</span>';
        } else if (name == 'Karma') {
          return '<span class=\'currency karma\'>' + value + '</span>';
        } else if (name == 'Laurel') {
          return '<span class=\'currency laurel\'>' + value + '</span>';
        } else {
          return value;
        }
      }
    }, {
      key: 'description',
      get: function get() {
        return _currencies.currencies.get(this._data.id).description || '';
      }
    }, {
      key: 'order',
      get: function get() {
        return '<span class="small light">' + _currencies.currencies.get(this._data.id).order + '</span>';
      }
    }]);

    return Wallet;
  }();

  function getCoinHtml(value) {
    var copper = value % 100;
    var silver = Math.floor(value / 100) % 100;
    var gold = Math.floor(value / 10000);
    return '\n    <div class="gold coin">\n      ' + gold + '\n      <img class="icon inline" title="gold" src="https://wiki.guildwars2.com/images/d/d1/Gold_coin.png" />\n    </div>\n    <div class="silver coin">\n      ' + silver + '\n      <img class="icon inline" title="silver" src="https://wiki.guildwars2.com/images/3/3c/Silver_coin.png" />\n    </div>\n    <div class="copper coin">\n      ' + copper + '\n      <img class="icon inline" title="copper" src="https://wiki.guildwars2.com/images/e/eb/Copper_coin.png" />\n    </div>\n  ';
  }
});


define('model/gw2Data/gw2Data',['exports', 'utils/events', 'model/apiKey', 'model/gw2Data/account', 'model/gw2Data/accountTitles', 'model/gw2Data/characters', 'model/gw2Data/inventory', 'model/gw2Data/wallet'], function (exports, _events, _apiKey, _account, _accountTitles, _characters, _inventory, _wallet) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gw2Data = undefined;
  var gw2Data = exports.gw2Data = {
    loadAccount: function loadAccount() {
      var _this = this;

      this.trigger('load:account');
      return _account.account.load().done(function (accountData) {
        _this.trigger('loaded:account', accountData);
      });
    },
    loadAccountTitles: function loadAccountTitles() {
      var _this2 = this;

      this.trigger('load:accountTitles');
      return _accountTitles.accountTitles.load().done(function (accountTitlesData) {
        _this2.trigger('loaded:accountTitles', accountTitlesData);
      });
    },
    loadCharacters: function loadCharacters() {
      var _this3 = this;

      this.trigger('load:characters');
      return _characters.characters.load().done(function (characterList) {
        _this3.trigger('loaded:characters', characterList);
      });
    },
    loadInventory: function loadInventory() {
      var _this4 = this;

      this.trigger('load:inventory');
      return _inventory.inventory.load().done(function (inventoryData) {
        _this4.trigger('loaded:inventory', inventoryData);
      });
    },
    loadWallet: function loadWallet() {
      var _this5 = this;

      this.trigger('load:wallet');
      return _wallet.wallet.load().done(function (walletData) {
        _this5.trigger('loaded:wallet', walletData);
      });
    }
  };
  exports.default = gw2Data;


  (0, _events.eventful)(gw2Data);
});


define('view/account',['exports', 'model/gw2Data/gw2Data', 'model/apiKey'], function (exports, _gw2Data, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.app = undefined;
  var app = exports.app = {
    initialize: function initialize() {
      // show saved apiKey
      var savedKey = _apiKey.apiKey.getKey();
      if (savedKey) {
        $('#api_key #current').val(savedKey);
        this.drawHistory();
      }
      this.bindEvents();
    },
    drawHistory: function drawHistory() {
      $('#api_key #recent').html(function () {
        var savedKeyHistory = _apiKey.apiKey.getHistory();
        if (savedKeyHistory) {
          var html = '';
          Object.keys(savedKeyHistory).forEach(function (key) {
            html += '\n            <li>\n              <a data-key=\'' + key + '\'>' + savedKeyHistory[key] + '</a>\n            </li>\n          ';
          });
          html += '\n            <li role="separator" class="divider"></li>\n            <li>\n              <a data-action="clear">Clear Hostory</a>\n            </li>\n        ';
          return html;
        }
      });
    },
    bindEvents: function bindEvents() {
      var _this = this;

      var newKey = void 0;
      function loadpage() {
        app.showLoading();
        _gw2Data.gw2Data.loadAccount();
        _gw2Data.gw2Data.loadAccountTitles();
        _gw2Data.gw2Data.loadCharacters();
        _gw2Data.gw2Data.loadInventory();
        _gw2Data.gw2Data.loadWallet();
      }

      var matchQuery = void 0;
      if (matchQuery = location.href.match(/(s|source)=(.*)/)) {
        newKey = decodeURIComponent(matchQuery[2]);
        _apiKey.apiKey.setKey(newKey);
        loadpage();
      }

      $('#api_key #current').keypress(function (e) {
        if (e.keyCode == 13) {
          newKey = $(this).val();
          _apiKey.apiKey.setKey(newKey);
          loadpage();
        }
      });

      $('#api_key #recent').on('click tap', '[data-key]', function (e) {
        newKey = $(this).attr('data-key');
        $('#api_key #current').val(newKey);
        _apiKey.apiKey.setKey(newKey);
        loadpage();
      });

      $('#api_key #recent').on('click tap', '[data-action="clear"]', function (e) {
        $('#api_key #current').val('');
        _apiKey.apiKey.clearHistory();
        $('#api_key #recent').html('<li><a>Hmmm. No history yet.</a></li>');
      });

      _gw2Data.gw2Data.on('loaded:characters', function () {
        $('#characters-status').html('Characters loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });

      _gw2Data.gw2Data.on('loaded:account', function (account) {
        _apiKey.apiKey.setHistory(newKey, account.name);
        _this.drawHistory();
        $('title').html(account.name + ' | Guild Wars 2 Inventory');
        $('.accountname').text(account.name);
        $('.accountid').text(account.id);
        $('.accountcreated').text(account.created);
        $('.worldname').html(account.world);
        $('.fractal_level').html(account.fractal_level);
        $('.daily_ap').html(account.daily_ap);
        $('.monthly_ap').html(account.monthly_ap);
        $('.wvw_rank').html(account.wvw_rank);
        $('.access').html(account.access);
        $('#account-status').html('Account loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });

      _gw2Data.gw2Data.on('loaded:accountTitles', function (accountTitles) {
        $('.titles').html(accountTitles);
      });

      _gw2Data.gw2Data.on('loaded:wallet', function () {
        $('#wallet-status').html('Wallet loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });

      _gw2Data.gw2Data.on('loaded:inventory', function () {
        $('#inventory-status').html('Inventory loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });
    },
    showLoading: function showLoading() {
      $('#account-status').parent().empty().html('\n      <p id="account-status" class="status" style="display: block;">\n        Loading account...\n      </p>\n      <p id="characters-status" class="status" style="display: block;">\n        Loading characters...\n      </p>\n      <p id="inventory-status" class="status" style="display: block;">\n        Loading inventory...\n      </p>\n      <p id="wallet-status" class="status" style="display: block;">\n        Loading wallet...\n      </p>\n    ');
    }
  };

  $(function () {
    app.initialize();
  });
});


define('view/characters',['exports', 'model/gw2Data/gw2Data'], function (exports, _gw2Data) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.characters = undefined;
  var characters = exports.characters = {
    initialize: function initialize() {
      $('#characters [data-click]').button('reset');
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      _gw2Data.gw2Data.on('loaded:characters', function (characterList) {
        var dataSet = characterList.map(function (character) {
          return [character.name, character.level, character.profession, character.race,
          //character.gender,
          character.age, character.deaths, character.created, character.guild, character.crafting, character.specializations.pve, character.specializations.pvp, character.specializations.wvw, character.equipment.Helm, character.equipment.Shoulders, character.equipment.Gloves, character.equipment.Coat, character.equipment.Leggings, character.equipment.Boots, character.equipment.Backpack, character.equipment.HelmAquatic, character.equipment.Amulet, character.equipment.Accessory1, character.equipment.Accessory2, character.equipment.Ring1, character.equipment.Ring2, character.equipment.WeaponA1, character.equipment.WeaponA2, character.equipment.WeaponB1, character.equipment.WeaponB2, character.equipment.WeaponAquaticA, character.equipment.WeaponAquaticB, character.bags,
          //character.inventory.services,
          //character.inventory.special,
          character.inventory.boosts,
          //character.inventory.style,
          'character.inventory.misc', character.equipment.Sickle, character.equipment.Axe, character.equipment.Pick];
        });
        $('#characters-table').DataTable({
          data: dataSet,
          destroy: true,
          pageLength: 50,
          columnDefs: [{
            targets: 0,
            render: function render(data, type, row) {
              if (data) {
                return '<span class="bold">' + data + '</span>';
              } else {
                return data;
              }
            }
          }, {
            targets: [1, 4, 5],
            type: 'natural'
          }, {
            targets: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
            visible: false
          }]
        });
        $('#characters .loading').hide();
        var table = $('#characters-table').DataTable();
        $('#characters [data-subset]').on('click tap', function () {
          $('#characters [data-subset]').parent('li').removeClass('active');
          $(this).parent('li').addClass('active');
          table.columns('[data-toggle]').visible(false);
          table.columns('[data-toggle="' + $(this).attr('data-subset') + '"]').visible(true);
        });
        $('#characters [data-click]').on('click tap', function () {
          $(this).button('loading');
          $(this).parents('.tab-pane').children('.loading').show();
          var action = $(this).attr('data-click');
          if (action == 'refreshcharacters') {
            get_render_characters();
          }
        });
        $('#characters [data-option]').on('click tap', function () {
          $('#characters [data-option]').parent('li').removeClass('active');
          $(this).parent('li').addClass('active');
          var searchValue = $(this).attr("data-option");
          table.column([2]).search(searchValue).draw();
        });
        $('#characters').on('click tap', '.equipment', function () {});
      });
    }
  };

  $(function () {
    characters.initialize();
  });

  exports.default = characters;
});


define('view/inventory',['exports', 'model/gw2Data/gw2Data'], function (exports, _gw2Data) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.inventory = undefined;
  var inventory = exports.inventory = {
    initialize: function initialize() {
      $('#inventory [data-click]').button('reset');
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      _gw2Data.gw2Data.on('loaded:inventory', function (itemList) {
        var fullList = itemList.filter(function (n) {
          return n != undefined;
        });
        var idList = {};
        fullList.forEach(function (item) {
          if (idList[item.id]) {
            idList[item.id] += 1;
          } else {
            idList[item.id] = 1;
          }
        });
        var dataSet = fullList.map(function (item) {
          var duplicated = '';
          if (idList[item.id] > 1) {
            duplicated = 'duplicated';
          }
          return [item.icon, item.name, item.count, item.type, item.level, item.rarity, item.position, item.binding, duplicated, item.category];
        });
        var table = $('#inventory-table').DataTable({
          data: dataSet,
          "destroy": true,
          "pageLength": 50,
          "order": [[6, 'asc']],
          "columnDefs": [{
            type: 'natural',
            targets: [2, 4, 6]
          }, {
            visible: false,
            targets: [8, 9]
          }, {}],
          drawCallback: function drawCallback() {
            var api = this.api();
            $('#inventory .dataTables_length #sum').remove();
            $('#inventory .dataTables_length').append("<span id='sum'>. Current amount: " + api.column(2, { page: 'current' }).data().sum() + '</span>');
          }
        });
        $('#inventory .loading').hide();

        var searchValue = "";
        var searchCollection = "";
        var searchDuplicated = false;
        // enable table search by nav bar click
        $('#inventory [data-subset]').on('click tap', function () {
          $('#inventory [data-subset]').parent('li').removeClass('active');
          $('#inventory [data-option]').parent('li').removeClass('active');
          $(this).parent('li').addClass('active');
          searchCollection = $(this).attr("data-subset");
          if (searchCollection == "equipment") {
            searchValue = "Armor|Weapon|Trinket|Upgrades|Back";
          } else if (searchCollection == "utilities") {
            searchValue = "Bag|Gathering|Tool";
          } else if (searchCollection == "toys") {
            searchValue = "";
          } else if (searchCollection == "materials") {
            searchValue = "Material";
          } else if (searchCollection == "misc") {
            searchValue = "Container|Trophy|Trait|Consumable|Gizmo|Minipet";
          } else if (searchCollection == "all") {
            searchValue = "";
          }
          table.column([9]).search('').column([3]).search(searchValue, true).draw();
        });
        $('#inventory [data-option]').on('click tap', function () {
          $('#inventory [data-option]').parent('li').removeClass('active');
          $(this).parent('li').addClass('active');
          searchValue = $(this).attr("data-option");
          var searchTarget = $(this).attr("data-target");
          if (searchTarget == 'category') {
            table.column([3]).search('').column([9]).search(searchValue).draw();
          } else {
            table.column([9]).search('').column([3]).search(searchValue).draw();
          }
        });
        $('#inventory [data-rarity').on('click tap', function () {
          $('#inventory [data-rarity]').parent('li').removeClass('active');
          $(this).parent('li').addClass('active');
          $('#inventory #rarity').text($(this).text());
          searchValue = $(this).attr("data-rarity");
          table.column([5]).search(searchValue).draw();
        });
        $('#inventory [data-filter="duplicated"]').on('click tap', function () {
          $(this).parent('li').toggleClass('active');
          if (searchDuplicated) {
            table.column([8]).search('').draw();
          } else {
            table.column([8]).search('duplicated').draw();
          }
          searchDuplicated = !searchDuplicated;
        });
        // TODO: enable table refresh by navbar click
        $('#inventory [data-click]').on('click tap', function () {
          $(this).button('loading');
          $(this).parents('.tab-pane').children('.subset').removeClass('active');
          $(this).parents('.tab-pane').children('.loading').show();
          var action = $(this).attr('data-click');
          if (action == 'refreshinventory') {
            //get_render_inventory();
          }
        });
      });
    }
  };

  $(function () {
    inventory.initialize();
  });

  exports.default = inventory;
});


define('view/wallet',['exports', 'model/gw2Data/gw2Data'], function (exports, _gw2Data) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wallet = undefined;
  var wallet = exports.wallet = {
    initialize: function initialize() {
      $('#wallet [data-click]').button('reset');
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      _gw2Data.gw2Data.on('loaded:wallet', function (walletData) {
        var dataSet = walletData.map(function (walletItem) {
          return [walletItem.icon, walletItem.name, walletItem.value, walletItem.description, walletItem.order];
        });
        $('#wallet-table').DataTable({
          data: dataSet,
          destroy: true,
          pageLength: 50,
          "order": [[4, 'asc']],
          "dom": '',
          "columnDefs": [{ type: 'natural', targets: 2 }]
        });
        $('#wallet .loading').hide();
        var table = $('#wallet-table').DataTable();
        $('#wallet [data-click]').on('click tap', function () {
          $(this).button('loading');
          $(this).parents('.tab-pane').children('.loading').show();
          var action = $(this).attr('data-click');
          if (action == 'refreshwallet') {
            get_render_wallet();
          }
        });
      });
    }
  };

  $(function () {
    wallet.initialize();
  });

  exports.default = wallet;
});


define('index.js',['view/account', 'view/characters', 'view/inventory', 'view/wallet'], function (_account, _characters, _inventory, _wallet) {
  $(function () {
    // enable bootstrap tabs ui
    $('#tabs').tab();
    $('body').on('mouseenter', '*[data-toggle="tooltip"]', function () {
      $(this).tooltip('show');
    });
    $('body').on('mouseleave', '*[data-toggle="tooltip"]', function () {
      $(this).tooltip('hide');
    });

    // toggle level 2 navbar
    $('.tab-pane [data-subset]').on('click tap', function () {
      $(this).parents('.tab-pane').children('.subset').removeClass('active').filter('#' + $(this).attr('data-subset')).addClass('active');
    });

    // toggle about section
    $('[data-click="toggleAbout"]').on('click tap', function (event) {
      $('#about').slideToggle();
      event.preventDefault();
    });
  });
});

require(['index.js']);