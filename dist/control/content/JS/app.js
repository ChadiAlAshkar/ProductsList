!function(e){function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n){function t(){buildfire.messaging.sendMessageToWidget({id:Enum.messageType.closeItem,openSubItemPage:!1}),i=new SearchTableHelper("searchResults","records",searchTableConfig,"emptyState","noDataSearch","loading"),this.setupHandlers(),this.initTinymce(),i.search()}var i;new buildfire.components.images.thumbnail(".thumbnail-picker",{title:" ",dimensionsLabel:"Recommended: 600 x 600px",multiSelection:!1}),new buildfire.components.images.thumbnail(".thumbnail-picker2",{title:" ",dimensionsLabel:"Recommended: 1200 x 675px",multiSelection:!1});t()}]);