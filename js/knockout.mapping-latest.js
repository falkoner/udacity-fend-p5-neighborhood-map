!function(e){"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?e(require("knockout"),exports):"function"==typeof define&&define.amd?define(["knockout","exports"],e):e(ko,ko.mapping={})}(function(e,r){function t(e,n){var a,i;for(i in n)if(n.hasOwnProperty(i)&&n[i])if(a=r.getType(e[i]),i&&e[i]&&"array"!==a&&"string"!==a)t(e[i],n[i]);else if("array"===r.getType(e[i])&&"array"===r.getType(n[i])){a=e;for(var o=i,u=e[i],s=n[i],p={},l=u.length-1;l>=0;--l)p[u[l]]=u[l];for(l=s.length-1;l>=0;--l)p[s[l]]=s[l];u=[],s=void 0;for(s in p)u.push(p[s]);a[o]=u}else e[i]=n[i]}function n(e,r){var n={};return t(n,e),t(n,r),n}function a(e,r){for(var t=n({},e),a=h.length-1;a>=0;a--){var o=h[a];t[o]&&(t[""]instanceof Object||(t[""]={}),t[""][o]=t[o],delete t[o])}return r&&(t.ignore=i(r.ignore,t.ignore),t.include=i(r.include,t.include),t.copy=i(r.copy,t.copy),t.observe=i(r.observe,t.observe)),t.ignore=i(t.ignore,T.ignore),t.include=i(t.include,T.include),t.copy=i(t.copy,T.copy),t.observe=i(t.observe,T.observe),t.mappedProperties=t.mappedProperties||{},t.copiedProperties=t.copiedProperties||{},t}function i(t,n){return"array"!==r.getType(t)&&(t="undefined"===r.getType(t)?[]:[t]),"array"!==r.getType(n)&&(n="undefined"===r.getType(n)?[]:[n]),e.utils.arrayGetDistinctValues(t.concat(n))}function o(t,a,i,s,d,v,m){var h="array"===r.getType(e.utils.unwrapObservable(a));if(v=v||"",r.isMapped(t)){var k=e.utils.unwrapObservable(t)[g];i=n(k,i)}var T=m||d,x=function(){return i[s]&&i[s].create instanceof Function},j=function(r){var t=b,n=e.dependentObservable;return e.dependentObservable=function(r,n,a){a=a||{},r&&"object"==typeof r&&(a=r);var i=a.deferEvaluation,o=!1;if(a.deferEvaluation=!0,r=new O(r,n,a),!i){var u=r,i=e.dependentObservable;e.dependentObservable=O,r=e.isWriteableObservable(u),e.dependentObservable=i,i=O({read:function(){return o||(e.utils.arrayRemoveItem(t,u),o=!0),u.apply(u,arguments)},write:r&&function(e){return u(e)},deferEvaluation:!0}),i.__DO=u,r=i,t.push(r)}return r},e.dependentObservable.fn=O.fn,e.computed=e.dependentObservable,r=e.utils.unwrapObservable(d)instanceof Array?i[s].create({data:r||a,parent:T,skip:w}):i[s].create({data:r||a,parent:T}),e.dependentObservable=n,e.computed=e.dependentObservable,r},I=function(){return i[s]&&i[s].update instanceof Function},J=function(r,t){var n={data:t||a,parent:T,target:e.utils.unwrapObservable(r)};return e.isWriteableObservable(r)&&(n.observable=r),i[s].update(n)};if(m=y.get(a))return m;if(s=s||"",h){var h=[],E=!1,P=function(e){return e};i[s]&&i[s].key&&(P=i[s].key,E=!0),e.isObservable(t)||(t=e.observableArray([]),t.mappedRemove=function(e){var r="function"==typeof e?e:function(r){return r===P(e)};return t.remove(function(e){return r(P(e))})},t.mappedRemoveAll=function(r){var n=l(r,P);return t.remove(function(r){return-1!=e.utils.arrayIndexOf(n,P(r))})},t.mappedDestroy=function(e){var r="function"==typeof e?e:function(r){return r===P(e)};return t.destroy(function(e){return r(P(e))})},t.mappedDestroyAll=function(r){var n=l(r,P);return t.destroy(function(r){return-1!=e.utils.arrayIndexOf(n,P(r))})},t.mappedIndexOf=function(r){var n=l(t(),P);return r=P(r),e.utils.arrayIndexOf(n,r)},t.mappedGet=function(e){return t()[t.mappedIndexOf(e)]},t.mappedCreate=function(r){if(-1!==t.mappedIndexOf(r))throw Error("There already is an object with the key that you specified.");var n=x()?j(r):r;return I()&&(r=J(n,r),e.isWriteableObservable(n)?n(r):n=r),t.push(n),n}),m=l(e.utils.unwrapObservable(t),P).sort(),k=l(a,P),E&&k.sort(),E=e.utils.compareArrays(m,k),m={};var S,N=e.utils.unwrapObservable(a),_={},W=!0,k=0;for(S=N.length;S>k;k++){var D=P(N[k]);if(void 0===D||D instanceof Object){W=!1;break}_[D]=N[k]}var N=[],F=0,k=0;for(S=E.length;S>k;k++){var A,D=E[k],M=v+"["+k+"]";switch(D.status){case"added":var C=W?_[D.value]:p(e.utils.unwrapObservable(a),D.value,P);A=o(void 0,C,i,s,t,M,d),x()||(A=e.utils.unwrapObservable(A)),M=u(e.utils.unwrapObservable(a),C,m),A===w?F++:N[M-F]=A,m[M]=!0;break;case"retained":C=W?_[D.value]:p(e.utils.unwrapObservable(a),D.value,P),A=p(t,D.value,P),o(A,C,i,s,t,M,d),M=u(e.utils.unwrapObservable(a),C,m),N[M]=A,m[M]=!0;break;case"deleted":A=p(t,D.value,P)}h.push({event:D.status,item:A})}t(N),i[s]&&i[s].arrayChanged&&e.utils.arrayForEach(h,function(e){i[s].arrayChanged(e.event,e.item)})}else if(c(a)){if(t=e.utils.unwrapObservable(t),!t){if(x())return E=j(),I()&&(E=J(E)),E;if(I())return J(E);t={}}if(I()&&(t=J(t)),y.save(a,t),I())return t;f(a,function(r){var n=v.length?v+"."+r:r;if(-1==e.utils.arrayIndexOf(i.ignore,n))if(-1!=e.utils.arrayIndexOf(i.copy,n))t[r]=a[r];else if("object"!=typeof a[r]&&"array"!=typeof a[r]&&0<i.observe.length&&-1==e.utils.arrayIndexOf(i.observe,n))t[r]=a[r],i.copiedProperties[n]=!0;else{var u=y.get(a[r]),s=o(t[r],a[r],i,r,t,n,t),u=u||s;0<i.observe.length&&-1==e.utils.arrayIndexOf(i.observe,n)?(t[r]=u(),i.copiedProperties[n]=!0):(e.isWriteableObservable(t[r])?(u=e.utils.unwrapObservable(u),t[r]()!==u&&t[r](u)):(u=void 0===t[r]?u:e.utils.unwrapObservable(u),t[r]=u),i.mappedProperties[n]=!0)}})}else switch(r.getType(a)){case"function":I()?e.isWriteableObservable(a)?(a(J(a)),t=a):t=J(a):t=a;break;default:if(e.isWriteableObservable(t))return A=I()?J(t):e.utils.unwrapObservable(a),t(A),A;x()||I(),t=x()?j():e.observable(e.utils.unwrapObservable(a)),I()&&t(J(t))}return t}function u(e,r,t){for(var n=0,a=e.length;a>n;n++)if(!0!==t[n]&&e[n]===r)return n;return null}function s(t,n){var a;return n&&(a=n(t)),"undefined"===r.getType(a)&&(a=t),e.utils.unwrapObservable(a)}function p(r,t,n){r=e.utils.unwrapObservable(r);for(var a=0,i=r.length;i>a;a++){var o=r[a];if(s(o,n)===t)return o}throw Error("When calling ko.update*, the key '"+t+"' was not found!")}function l(r,t){return e.utils.arrayMap(e.utils.unwrapObservable(r),function(e){return t?s(e,t):e})}function f(e,t){if("array"===r.getType(e))for(var n=0;n<e.length;n++)t(n);else for(n in e)t(n)}function c(e){var t=r.getType(e);return("object"===t||"array"===t)&&null!==e}function d(){var r=[],t=[];this.save=function(n,a){var i=e.utils.arrayIndexOf(r,n);i>=0?t[i]=a:(r.push(n),t.push(a))},this.get=function(n){return n=e.utils.arrayIndexOf(r,n),n>=0?t[n]:void 0}}function v(){var e={},r=function(r){var t;try{t=r}catch(n){t="$$$"}return r=e[t],void 0===r&&(r=new d,e[t]=r),r};this.save=function(e,t){r(e).save(e,t)},this.get=function(e){return r(e).get(e)}}var b,y,g="__ko_mapping__",O=e.dependentObservable,m=0,h=["create","update","key","arrayChanged"],w={},k={include:["_destroy"],ignore:[],copy:[],observe:[]},T=k;r.isMapped=function(r){return(r=e.utils.unwrapObservable(r))&&r[g]},r.fromJS=function(e){if(0==arguments.length)throw Error("When calling ko.fromJS, pass the object you want to convert.");try{m++||(b=[],y=new v);var r,t;2==arguments.length&&(arguments[1][g]?t=arguments[1]:r=arguments[1]),3==arguments.length&&(r=arguments[1],t=arguments[2]),t&&(r=n(r,t[g])),r=a(r);var i=o(t,e,r);if(t&&(i=t),!--m)for(;b.length;){var u=b.pop();u&&(u(),u.__DO.throttleEvaluation=u.throttleEvaluation)}return i[g]=n(i[g],r),i}catch(s){throw m=0,s}},r.fromJSON=function(t){var n=e.utils.parseJson(t);return arguments[0]=n,r.fromJS.apply(this,arguments)},r.updateFromJS=function(){throw Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!")},r.updateFromJSON=function(){throw Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!")},r.toJS=function(t,n){if(T||r.resetDefaultOptions(),0==arguments.length)throw Error("When calling ko.mapping.toJS, pass the object you want to convert.");if("array"!==r.getType(T.ignore))throw Error("ko.mapping.defaultOptions().ignore should be an array.");if("array"!==r.getType(T.include))throw Error("ko.mapping.defaultOptions().include should be an array.");if("array"!==r.getType(T.copy))throw Error("ko.mapping.defaultOptions().copy should be an array.");return n=a(n,t[g]),r.visitModel(t,function(r){return e.utils.unwrapObservable(r)},n)},r.toJSON=function(t,n){var a=r.toJS(t,n);return e.utils.stringifyJson(a)},r.defaultOptions=function(){return 0<arguments.length?void(T=arguments[0]):T},r.resetDefaultOptions=function(){T={include:k.include.slice(0),ignore:k.ignore.slice(0),copy:k.copy.slice(0)}},r.getType=function(e){if(e&&"object"==typeof e){if(e.constructor===Date)return"date";if(e.constructor===Array)return"array"}return typeof e},r.visitModel=function(t,n,i){i=i||{},i.visitedObjects=i.visitedObjects||new v;var o,u=e.utils.unwrapObservable(t);if(!c(u))return n(t,i.parentName);i=a(i,u[g]),n(t,i.parentName),o="array"===r.getType(u)?[]:{},i.visitedObjects.save(t,o);var s=i.parentName;return f(u,function(t){if(!i.ignore||-1==e.utils.arrayIndexOf(i.ignore,t)){var a=u[t],p=i,l=s||"";if("array"===r.getType(u)?s&&(l+="["+t+"]"):(s&&(l+="."),l+=t),p.parentName=l,-1!==e.utils.arrayIndexOf(i.copy,t)||-1!==e.utils.arrayIndexOf(i.include,t)||!u[g]||!u[g].mappedProperties||u[g].mappedProperties[t]||!u[g].copiedProperties||u[g].copiedProperties[t]||"array"===r.getType(u))switch(r.getType(e.utils.unwrapObservable(a))){case"object":case"array":case"undefined":p=i.visitedObjects.get(a),o[t]="undefined"!==r.getType(p)?p:r.visitModel(a,n,i);break;default:o[t]=n(a,i.parentName)}}}),o}});