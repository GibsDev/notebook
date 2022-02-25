"use strict";(self.webpackChunknotebook=self.webpackChunknotebook||[]).push([[826],{5619:(e,t,n)=>{var r=n(7294),a=n(3935),s=n(5367),o=n(8330),i=n(9896),c=n(7243),l=n(3768),u=n(3200),d=n(9249),p=n(9711),f=n(6974),m=(n(5169),n(7369),n(5861)),h=n(8152),x=n(7757),g=n.n(x),v=n(5697),y=n.n(v),b=n(4586),w=n(9098),k=n(6252),j=n(5893),N=(0,w.Ps)("\nquery {\n    getUser {\n        id\n        nickname\n        collapseNotes\n        username\n        address\n    }\n}"),C=(0,w.Ps)("\nmutation ($nickname: String = null) {\n    setNickname(nickname: $nickname)\n}"),Z=(0,w.Ps)("\nmutation ($collapse: Boolean) {\n    setCollapseNotes(collapse: $collapse)\n}"),S=(0,r.createContext)();function A(e){var t=e.children,a=(0,k.x)(),s=(new AbortController).signal,o=(0,r.useState)({id:void 0,nickname:void 0,collapseNotes:null,username:null,address:null}),i=(0,h.Z)(o,2),c=i[0],l=c.id,u=c.nickname,p=c.collapseNotes,f=c.username,x=c.address,v=i[1];function y(){return w.apply(this,arguments)}function w(){return(w=(0,m.Z)(g().mark((function e(){var t,n;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,a.query({query:N});case 3:t=e.sent,n=t.data.getUser,v(n),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),v({id:null,nickname:null,collapseNotes:null,username:null,address:null});case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function A(){return E.apply(this,arguments)}function E(){return(E=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/auth/logout",{method:"post"});case 2:y();case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function O(e){return $.apply(this,arguments)}function $(){return($=(0,m.Z)(g().mark((function e(t){var r,a,s,o,i;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.e(99).then(n.t.bind(n,2099,23)),d.Am.promise(r,{pending:"Loading web3-token bundle...",error:"Failed to load web3-token bundle"}),e.next=4,r;case 4:if(a=e.sent,s=a.default,ethereum){e.next=8;break}throw new Error("MetaMask not found");case 8:return e.next=10,ethereum.request({method:"eth_requestAccounts"});case 10:return o=function(e){return ethereum.request({method:"personal_sign",params:[ethereum.selectedAddress,e]})},i=s.sign(o,{expires_in:t,request_id:(0,b.Z)()}),e.abrupt("return",i);case 13:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(){return(P=(0,m.Z)(g().mark((function e(){var t,n;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O("2m");case 2:return t=e.sent,n=fetch("/auth/login",{method:"post",headers:{"content-type":"application/json"},body:JSON.stringify({web3_token:t}),signal:s}),d.Am.promise(n,{pending:"Logging in...",error:"Error logging in"}),e.next=7,n;case 7:if(!e.sent.ok){e.next=9;break}y();case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function D(){return D=(0,m.Z)(g().mark((function e(t,n){var r;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/auth/register",{method:"post",headers:{"content-type":"application/json"},body:JSON.stringify({username:t,password:n}),signal:s});case 2:if(!(r=e.sent).ok){e.next=7;break}return e.abrupt("return","Login '".concat(t,"' created"));case 7:if(429!==r.status){e.next=11;break}throw new Error("Too many requests, try again in 5 minutes");case 11:throw new Error(JSON.stringify(r));case 12:case"end":return e.stop()}}),e)}))),D.apply(this,arguments)}function I(){return I=(0,m.Z)(g().mark((function e(t,n){var r;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!l){e.next=3;break}return e.next=3,A();case 3:return e.next=5,fetch("/auth/login",{method:"post",headers:{"content-type":"application/json"},body:JSON.stringify({username:t,password:n}),signal:s});case 5:if(!(r=e.sent).ok){e.next=10;break}y(),e.next=13;break;case 10:if(429!==r.status){e.next=12;break}throw new Error("Too many attempts, try again later");case 12:throw new Error("Invalid login");case 13:case"end":return e.stop()}}),e)}))),I.apply(this,arguments)}function L(){return(L=(0,m.Z)(g().mark((function e(t){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t!==u){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,a.mutate({mutation:C,variables:{nickname:t}});case 4:y();case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function U(){return(U=(0,m.Z)(g().mark((function e(t){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.mutate({mutation:Z,variables:{collapse:t}});case 2:y();case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,r.useEffect)((function(){return y(),function(){}}),[]),(0,j.jsx)(S.Provider,{value:{user:l,nickname:u,username:f,address:x,collapseNotes:p,setCollapsedByDefault:function(e){return U.apply(this,arguments)},changeNickname:function(e){return L.apply(this,arguments)},login:function(e,t){return I.apply(this,arguments)},register:function(e,t){return D.apply(this,arguments)},walletLogin:function(){return P.apply(this,arguments)},web3Token:O,logout:A},children:t})}function E(e){var t=e.children,n=(0,r.useContext)(S).user,a=(0,f.s0)();function s(){null===n&&a("/login")}return(0,r.useEffect)((function(){s()}),[]),(0,r.useEffect)((function(){s()}),[n]),t}A.propTypes={children:y().element};var O=(0,d.vU)({collapse:!1,enter:"animate__fadein",exit:"animate__fadeout"});function $(){return(0,j.jsx)(d.Ix,{transition:O,closeOnClick:!0,position:"bottom-center",autoClose:3e3,pauseOnHover:!0})}function P(){var e=(0,r.useContext)(S).logout;return(0,j.jsx)("button",{className:"btn btn-outline-danger w-100",onClick:e,children:"Logout"})}function D(){var e=(0,r.useContext)(S),t=e.user,n=e.nickname,a=e.username,s=e.address,o=s?s.substring(0,6):null,i=n||a||o||"User";return t?(0,j.jsxs)("div",{className:"dropdown",children:[(0,j.jsx)("button",{className:"btn btn-dark dropdown-toggle px-0",type:"button",id:"userDropdown","data-bs-toggle":"dropdown","aria-expanded":"false",children:i}),(0,j.jsxs)("ul",{className:"dropdown-menu dropdown-menu-dark dropdown-menu-end","aria-labelledby":"userDropdown",children:[(0,j.jsx)("li",{children:(0,j.jsx)(p.rU,{className:"dropdown-item",to:"/settings",children:"Settings"})}),(0,j.jsx)("li",{children:(0,j.jsx)("hr",{className:"dropdown-divider"})}),(0,j.jsx)("li",{className:"px-3",children:(0,j.jsx)(P,{})})]})]}):null}function I(){var e=(0,r.useContext)(S),t=e.user,n=e.login,a=e.register,s=e.walletLogin,o=(0,r.useState)(""),i=(0,h.Z)(o,2),c=i[0],l=i[1],u=(0,r.useState)(""),p=(0,h.Z)(u,2),x=p[0],v=p[1],y=(0,r.useState)(!1),b=(0,h.Z)(y,2),w=b[0],k=b[1],N=(0,f.s0)(),C=new AbortController,Z=C.signal;function A(){return(A=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/auth/username/"+c,{signal:Z});case 2:e.sent.ok?k(!0):k(!1);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function E(){return(E=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,s();case 3:N("/"),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),d.Am.error(e.t0.message);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})))).apply(this,arguments)}function O(){return(O=(0,m.Z)(g().mark((function e(){var t;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=n(c,x),d.Am.promise(t,{pending:"Logging in...",success:"Successfully logged in",error:"Unable to login"}),e.next=5,t;case 5:N("/"),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),d.Am.error(e.t0.message);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function $(){return($=(0,m.Z)(g().mark((function e(){var t;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,a(c,x);case 3:t=e.sent,(0,d.Am)(t),k(!0),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),d.Am.error(e.t0.message);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}return(0,r.useEffect)((function(){return function(){C.abort()}}),[]),(0,r.useEffect)((function(){return t&&N("/"),function(){l(""),v("")}}),[t]),(0,j.jsx)(j.Fragment,{children:(0,j.jsxs)("div",{className:"d-flex flex-column gap-2 my-3",children:[(0,j.jsxs)("div",{className:"d-flex flex-column gap-2",children:[(0,j.jsx)("h2",{children:"Login or Register"}),(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("span",{className:"input-group-text",id:"username",children:"Username"}),(0,j.jsx)("input",{className:"form-control",type:"text",value:c,placeholder:"Username","aria-label":"Username","aria-describedby":"username",onChange:function(e){l(e.target.value),k(!1)},onBlur:function(){return A.apply(this,arguments)}})]}),(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("span",{className:"input-group-text",id:"password",children:"Password"}),(0,j.jsx)("input",{className:"form-control",type:"password",value:x,placeholder:"Password","aria-label":"Password","aria-describedby":"password",onChange:function(e){v(e.target.value)}})]})]}),(0,j.jsxs)("div",{className:"d-flex gap-2",children:[(0,j.jsx)("button",{className:"btn btn-secondary flex-grow-1",disabled:!c||!x,onClick:w?function(){return O.apply(this,arguments)}:function(){return $.apply(this,arguments)},children:w?"Login":"Register"}),(0,j.jsx)("button",{className:"btn btn-secondary flex-grow-1",onClick:function(){return E.apply(this,arguments)},children:"Connect wallet"})]})]})})}var L=n(1954);function U(e){var t=e.onApply,n=e.onCancel;return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)("button",{className:"btn btn-outline-success",onClick:t,title:"Apply",children:(0,j.jsx)(L.JO,{icon:"bi:check"})}),(0,j.jsx)("button",{className:"btn btn-outline-warning",onClick:n,children:(0,j.jsx)(L.JO,{icon:"ci:undo"})})]})}U.propTypes={onApply:y().func,onCancel:y().func};const q=U;function F(){var e=(0,r.useContext)(S),t=e.user,n=e.nickname,a=e.collapseNotes,s=e.changeNickname,o=e.setCollapsedByDefault,i=e.username,c=e.address,l=e.web3Token,u=(0,r.useState)(!1),p=(0,h.Z)(u,2),f=p[0],x=p[1];function v(){return n||""}var y=(0,r.useState)(v()),b=(0,h.Z)(y,2),w=b[0],k=b[1];function N(){k(v()),s(w||null)}function C(){return(C=(0,m.Z)(g().mark((function e(){var t,n,r;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l("1m");case 2:return t=e.sent,e.next=5,fetch("/auth/link",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:t})});case 5:if((n=e.sent).ok){e.next=14;break}return e.next=9,n.text();case 9:r=e.sent,d.Am.error(r),console.error(r),e.next=19;break;case 14:return e.t0=d.Am,e.next=17,n.text();case 17:e.t1=e.sent,(0,e.t0)(e.t1);case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,r.useEffect)((function(){k(n||"")}),[n]),(0,r.useEffect)((function(){(i||c)&&x(null!==i)}),[i,c]),(0,j.jsxs)("div",{className:"d-flex flex-column gap-2 my-3",children:[(0,j.jsx)("h2",{children:"Settings"}),(0,j.jsxs)("p",{className:"mb-0",children:["You are logged in as ",(0,j.jsx)("code",{children:t})]}),(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("span",{className:"input-group-text",if:"nickname",children:"Nickname"}),(0,j.jsx)("input",{className:"form-control",type:"text","aria-label":"Nickname","area-described-by":"nickname",value:w,onChange:function(e){k(e.target.value)},onKeyPress:function(e){"Enter"===e.key&&(N(),e.target.blur())}}),w!==v()&&(0,j.jsx)(q,{onCancel:function(){k(v())},onApply:N})]}),(0,j.jsxs)("div",{className:"input-group d-flex",children:[(0,j.jsx)("span",{className:"input-group-text flex-grow-1",id:"collapseLabel",children:"Collapse notes by default"}),(0,j.jsx)("div",{className:"input-group-text",children:(0,j.jsx)("input",{type:"checkbox",className:"for-check-input","aria-labelledby":"collapseLabel",onChange:function(e){o(e.currentTarget.checked)},checked:a})})]}),f&&(0,j.jsx)("button",{className:"btn btn-secondary",onClick:function(){return C.apply(this,arguments)},children:"Link wallet"})]})}var T=n(2153),K=n.n(T),z=n(4431),J=n(5059),R=n(319),B=n(4942),M=n(4925),_=["icon","variant","label","className","href","size"];function H(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function G(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?H(Object(n),!0).forEach((function(t){(0,B.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):H(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function W(e){var t=e.icon,n=e.variant,r=e.label,a=e.className,s=e.href,o=e.size,i=(0,M.Z)(e,_),c="";"sm"===o?c="btn-sm":"lg"===o&&(c="btn-lg");var l=G({className:"btn btn-".concat(n||"outline-secondary"," ").concat(c," ").concat(a||"").trim()},i);return s?(0,j.jsxs)("a",G(G({href:s,target:"_blank",rel:"noreferrer"},l),{},{children:[r,(0,j.jsx)(L.JO,{icon:t})]})):(0,j.jsxs)("button",G(G({},l),{},{children:[r,(0,j.jsx)(L.JO,{icon:t})]}))}W.propTypes={icon:y().string.isRequired,variant:y().oneOf([void 0,"primary","outline-primary","secondary","outline-secondary","success","outline-success","danger","outline-danger","warning","outline-warning","info","outline-info","light","outline-light","dark","outline-dark","link","outline-link"]),label:y().string,className:y().string,href:y().string,size:y().oneOf(["sm","lg",void 0])};const Q=W;var V=n(858),Y="lucide:clipboard";function X(e){try{new URL(e)}catch(e){return!1}return!0}var ee=(0,w.Ps)("\nquery ($id: String){\n    getField(id: $id) {\n        name\n        data\n        secret\n    }\n}"),te=(0,w.Ps)("\nmutation ($id: String!, $name: String, $data: String, $secret: Boolean) {\n    updateField(id: $id, name: $name, data: $data, secret: $secret) {\n        name\n        data\n        secret\n    }\n}"),ne=(0,w.Ps)("\nmutation ($id: String!, $relativeIndex: Int!) {\n    moveField(id: $id, relativeIndex: $relativeIndex)\n}"),re=(0,w.Ps)("\nmutation ($id: String!) {\n    deleteField(id: $id) {\n        id\n    }\n}");function ae(e){var t=e.className,n=e.id,a=e.encryptionKey,s=e.onDeleted,o=e.onMoved,i=e.editable,c=void 0!==i&&i,l=(0,k.x)(),u=(0,r.useState)(""),d=(0,h.Z)(u,2),p=d[0],f=d[1],x=(0,r.useState)(""),v=(0,h.Z)(x,2),y=v[0],b=v[1],w=(0,r.useState)(y),N=(0,h.Z)(w,2),C=N[0],Z=N[1],S=(0,r.useState)(p),A=(0,h.Z)(S,2),E=A[0],O=A[1],$=(0,r.useState)(Y),P=(0,h.Z)($,2),D=P[0],I=P[1],L=(0,r.useState)(!1),U=(0,h.Z)(L,2),F=U[0],T=U[1],K=(0,r.useState)(!0),B=(0,h.Z)(K,2),M=B[0],_=B[1],H=(0,z.t)(ee,{variables:{id:n},onCompleted:function(){var e=ae.data.getField,t=le(e.name),n=le(e.data);c||t||n?(O(t),Z(n),f(t),b(n),_(e.secret)):oe()}}),G=(0,h.Z)(H,2),W=G[0],ae=G[1],se=(0,R.D)(re,{variables:{id:n},onCompleted:function(){s()}}),oe=(0,h.Z)(se,1)[0],ie=(0,V.Z)(a),ce=ie.encrypt,le=ie.decrypt;function ue(){b(C),f(E)}function de(){return pe.apply(this,arguments)}function pe(){return(pe=(0,m.Z)(g().mark((function e(){var t,r,a,s;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,l.mutate({mutation:te,variables:{id:n,name:ce(p),data:ce(y)}});case 3:t=e.sent,r=t.data.updateField,a=le(r.name),s=le(r.data),O(a),Z(s),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(0),console.log(e.t0.message);case 14:case"end":return e.stop()}}),e,null,[[0,11]])})))).apply(this,arguments)}function fe(e){"Enter"===e.key?(de(),e.target.blur()):"Escape"===e.key&&(f(E),b(C),e.target.blur())}function me(){return(me=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.mutate({mutation:ne,variables:{id:n,relativeIndex:-1}});case 2:o();case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function he(){return(he=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.mutate({mutation:ne,variables:{id:n,relativeIndex:1}});case 2:o();case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function xe(){return(xe=(0,m.Z)(g().mark((function e(){var t,r,a;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return _(!(t=M)),e.prev=2,e.next=5,l.mutate({mutation:te,variables:{id:n,secret:!t}});case 5:r=e.sent,a=r.data.updateField.secret,_(a),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),console.log(e.t0.message);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})))).apply(this,arguments)}return(0,r.useEffect)((function(){return W(),function(){}}),[]),(0,r.useEffect)((function(){c||(!ae.called||ae.loading||!ae.data||E||C?ue():oe())}),[c]),(0,r.useEffect)((function(){D!=Y&&setTimeout((function(){I(Y)}),1500)}),[D]),(0,j.jsxs)("div",{className:("input-group "+t).trim(),children:[c&&F&&(0,j.jsx)("button",{className:"btn btn-danger delete-button",title:"Confirm Delete",onClick:oe,children:"Delete"}),c&&(0,j.jsx)(Q,{title:"Move Up",size:"sm",icon:"bi:arrow-up-short",onClick:function(){return me.apply(this,arguments)}}),c&&(0,j.jsx)(Q,{title:"Move Down",size:"sm",icon:"bi:arrow-down-short",onClick:function(){return he.apply(this,arguments)}}),c?(0,j.jsx)("input",{className:"form-control",autoComplete:"off",value:p,onChange:function(e){c&&f(e.target.value)},onKeyDown:fe}):(0,j.jsx)("span",{className:"input-group-text",children:p}),!c&&(0,j.jsx)(Q,{tabIndex:-1,title:"Copy",icon:D,onClick:function(){J.Z.write(C).then((function(){I("lucide:clipboard-check")}))}}),(M||c)&&(0,j.jsx)(Q,{className:M&&!c?"flex-grow-1":"",tabIndex:-1,size:"sm",icon:M&&c?"ic:outline-visibility":"ic:outline-visibility-off",onClick:function(){return xe.apply(this,arguments)},title:M?"Show Data":"Hide Data",disabled:M&&!c}),(c||!M)&&(0,j.jsx)("input",{type:M?"password":"text",className:"form-control bg-white",autoComplete:"off",value:y,onChange:function(e){c&&b(e.target.value)},onKeyDown:fe,"aria-label":p,"aria-describedby":n,readOnly:!c}),c&&(y!==C||p!==E)&&(0,j.jsx)(q,{onApply:de,onCancel:ue}),c&&(0,j.jsx)(Q,{icon:"carbon:delete",size:"sm",onClick:function(){F||document.addEventListener("click",(function(e){e.target&&e.target.className&&e.target.className.includes&&e.target.className.includes("delete-button")||(T(!1),e.stopPropagation())}),{capture:!0,once:!0}),T(!F)},title:"Delete"}),!c&&X(C)&&(0,j.jsx)(Q,{icon:"ci:external-link",href:C})]})}ae.propTypes={className:y().string,id:y().string,encryptionKey:y().string,onDeleted:y().func,onMoved:y().func,editable:y().bool};const se=ae;var oe=(0,w.Ps)("\nquery ($id: String) {\n    getNote(id: $id) {\n        title\n        body\n        createdAt\n        updatedAt\n        fields {\n            id\n            index\n        }\n    }\n}"),ie=(0,w.Ps)("\nmutation ($id: String!, $title: String, $body: String) {\n    updateNote(id: $id, title: $title, body: $body) {\n        title\n        body\n    }\n}"),ce=(0,w.Ps)("\nmutation ($noteId: String!) {\n    createField(noteId: $noteId) {\n        id\n    }\n}"),le=(0,w.Ps)("\nmutation ($id: String!) {\n    deleteNote(id: $id)\n}");function ue(e){var t=e.className,n=e.id,a=e.encryptionKey,s=e.query,o=e.onDeleted,i=(0,k.x)(),c=(0,r.useContext)(S).collapseNotes,l=(0,r.useRef)(null),u=(0,r.useState)(void 0),p=(0,h.Z)(u,2),f=p[0],x=p[1],v=(0,r.useState)(f),y=(0,h.Z)(v,2),b=y[0],w=y[1],N=(0,r.useState)(void 0),C=(0,h.Z)(N,2),Z=C[0],A=C[1],E=(0,r.useState)(Z),O=(0,h.Z)(E,2),$=O[0],P=O[1],D=(0,r.useState)([]),I=(0,h.Z)(D,2),L=I[0],U=I[1],F=(0,r.useState)(!1),T=(0,h.Z)(F,2),K=T[0],J=T[1],R=(0,r.useState)(c),B=(0,h.Z)(R,2),M=B[0],_=B[1],H=(0,r.useState)(!1),G=(0,h.Z)(H,2),W=G[0],Y=G[1],X=(0,r.useState)(!0),ee=(0,h.Z)(X,2),te=ee[0],ne=ee[1],re=(0,r.useState)(null),ae=(0,h.Z)(re,2),ue=ae[0],de=ae[1],pe=(0,r.useState)(null),fe=(0,h.Z)(pe,2),me=fe[0],he=fe[1],xe=(0,V.Z)(a),ge=xe.encrypt,ve=xe.decrypt,ye=(0,z.t)(oe,{variables:{id:n},onCompleted:function(e){we(e.getNote)}}),be=(0,h.Z)(ye,1)[0];function we(e){var t=e.title,n=e.body,r=e.createdAt,a=e.updatedAt,s=e.fields;if(t||""===t){var o=ve(t);void 0===f&&x(o),w(o)}if(n||""===n){var i=ve(n);void 0===Z&&A(i),P(i)}if(s){var c=(s=s.sort((function(e,t){return e.index-t.index}))).map((function(e){return e.id}));U(c)}r&&de(new Date(r)),a&&he(new Date(a))}if((0,r.useEffect)((function(){return be(),function(){}}),[]),(0,r.useEffect)((function(){ne(!s||b&&b.toLowerCase().includes(s.toLowerCase())||$&&$.toLowerCase().includes(s.toLowerCase()))}),[s,b,$]),(0,r.useEffect)((function(){Ce(),setTimeout(Ze,0)}),[K]),!te)return null;function ke(){return je.apply(this,arguments)}function je(){return(je=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.mutate({mutation:ie,variables:{id:n,title:ge(f)}});case 3:we(e.sent.data.updateNote),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.log(e.t0.message);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function Ne(){return(Ne=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.mutate({mutation:ie,variables:{id:n,body:ge(Z)}});case 3:we(e.sent.data.updateNote),Ze(!0),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0.message);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})))).apply(this,arguments)}function Ce(){A($),x(b),Y(!1)}function Ze(e){var t=l.current;if(t){e&&(t.style.height="initial");var n=t.offsetHeight-t.clientHeight;t.style.height=t.scrollHeight+n+"px"}}function Se(){return(Se=(0,m.Z)(g().mark((function e(){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.mutate({mutation:ce,variables:{noteId:n}});case 3:be(),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.log(e.t0.message);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})))).apply(this,arguments)}function Ae(){return(Ae=(0,m.Z)(g().mark((function e(){var t;return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.mutate({mutation:le,variables:{id:n}});case 3:t=e.sent,o(t.data.deleteNote),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),d.Am.error(e.t0.message);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}return(0,j.jsxs)("div",{className:("card "+t).trim(),children:[(0,j.jsxs)("div",{className:"card-header d-flex gap-2 align-items-center",children:[K&&W&&(0,j.jsx)("button",{className:"btn btn-danger delete-button",title:"Confirm Delete",onClick:function(){return Ae.apply(this,arguments)},children:"Delete"}),K?(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("input",{className:"form-control",type:"text",value:f,placeholder:"Title",onChange:function(e){x(e.target.value)},onKeyDown:function(e){"Enter"===e.key?(ke(),e.target.blur()):"Escape"===e.key&&(x(b),e.target.blur())}}),f!==b&&(0,j.jsx)(q,{onCancel:Ce,onApply:ke})]}):(0,j.jsx)("span",{className:"card-text flex-grow-1",title:ue&&me&&"Updated: ".concat(me.toLocaleString(),"\nCreated: ").concat(ue.toLocaleString()),children:f}),K&&(0,j.jsx)(Q,{icon:"carbon:delete",size:"sm",title:"Delete Note",onClick:function(){W||document.addEventListener("click",(function(e){e.target&&e.target.className&&e.target.className.includes&&e.target.className.includes("delete-button")||(Y(!1),e.stopPropagation())}),{capture:!0,once:!0}),Y(!W)}}),(0,j.jsx)(Q,{icon:"ep:edit-pen",size:"sm",variant:K?"secondary":"outline-secondary",title:(K?"Exit":"Enter")+" Edit mode",onClick:function(){K||_(!1),J(!K)}}),(0,j.jsx)(Q,{size:"sm",icon:M?"bx:bx-expand-vertical":"bx:bx-collapse-vertical",title:M?"Expand":"Collapse",onClick:function(){M||J(!1),_(!M)}})]}),(0,j.jsxs)("div",{className:M?"d-none":"d-flex flex-column gap-3 card-body",children:[K?(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("textarea",{className:"form-control",ref:l,placeholder:"Body",value:Z,onChange:function(e){A(e.target.value),Ze()},onFocus:Ze,onKeyDown:function(e){"Escape"===e.key&&(A($),e.target.blur())}}),Z!==$&&(0,j.jsx)(q,{onCancel:Ce,onApply:function(){return Ne.apply(this,arguments)}})]}):Z&&(0,j.jsx)("pre",{className:"card-text mb-0",style:{fontFamily:"inherit",fontSize:"inherit",whiteSpace:"pre-wrap"},children:Z}),(K||L.length>0)&&(0,j.jsxs)("div",{className:"d-flex flex-column gap-2",children:[L.map((function(e){return(0,j.jsx)(se,{id:e,encryptionKey:a,editable:K,onDeleted:be,onMoved:be},e)})),K&&(0,j.jsx)(Q,{icon:"akar-icons:plus",title:"Add Field",onClick:function(){return Se.apply(this,arguments)}})]})]})]})}ue.propTypes={className:y().string,id:y().string,encryptionKey:y().string,query:y().string,onDeleted:y().func};const de=ue;var pe=n(3144),fe=n(5671),me=n(136),he=n(4575),xe=n(1120),ge=n(2407),ve={backgroundColor:"var(--bs-secondary)",color:"var(--bs-light)",border:"1px solid var(--bs-secondary)"},ye={backgroundColor:"rgba(0,0,0,0)",color:"var(--bs-secondary)",border:"1px solid var(--bs-secondary)"};function be(e,t,n,a){"string"==typeof n&&(n=(0,j.jsx)("span",{children:n}));var s=(0,r.useState)(e),o=(0,h.Z)(s,2),i=o[0],c=o[1];return[i,(0,j.jsxs)("div",{title:a,children:[(0,j.jsx)("input",{type:"checkbox",className:"btn-check",id:t,checked:i,autoComplete:"off",onChange:function(e){c(e.target.checked),e.target.blur()}}),(0,j.jsx)("label",{className:"btn",style:i?ve:ye,htmlFor:t,children:n})]})]}function we(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var ke="abcdefghijklmnopqrstuvwxyz",je="0123456789",Ne="!@#$%^&*",Ce="_.,+-=:;?",Ze="<>[](){}",Se="/`\"|~'\\",Ae="lucide:clipboard";function Ee(e,t){if(e<0||t<0)throw new Error("min and max must be positive");if(t<e)throw new Error("max is not > min");return crypto.getRandomValues(new Uint32Array(1))[0]%(t-e+1)+e}function Oe(e,t,n){if(void 0===e)throw new Error("s is undefined");if(void 0===t)throw new Error("index is undefined");if(void 0===n)throw new Error("replacement is undefined");if("string"!=typeof n||1!==n.length)throw new Error("Invalid replacement character");return e.substr(0,t)+n+e.substr(t+n.length)}var $e=function(e){(0,me.Z)(a,e);var t,n,r=(t=a,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,r=(0,xe.Z)(t);if(n){var a=(0,xe.Z)(this).constructor;e=Reflect.construct(r,arguments,a)}else e=r.apply(this,arguments);return(0,he.Z)(this,e)});function a(){var e;return(0,fe.Z)(this,a),(e=r.call(this,"Length is too short for constraints")).name="ConstraintSpaceError",e}return(0,pe.Z)(a)}((0,ge.Z)(Error));function Pe(){var e=be(!0,"alpha","Alphabet"),t=(0,h.Z)(e,2),n=t[0],a=t[1],s=be(!0,"num","Numbers"),o=(0,h.Z)(s,2),i=o[0],c=o[1],l=be(!0,"specBase",Ne,"Special base"),u=(0,h.Z)(l,2),p=u[0],f=u[1],m=be(!0,"specExt",Ce,"Special extended"),x=(0,h.Z)(m,2),g=x[0],v=x[1],y=be(!0,"specWrap",Ze,"Special wrap"),b=(0,h.Z)(y,2),w=b[0],k=b[1],N=be(!1,"specObs",Se,"Special obscure"),C=(0,h.Z)(N,2),Z=C[0],S=C[1],A=(0,r.useState)(""),E=(0,h.Z)(A,2),O=E[0],$=E[1],P=be(!0,"upper","Uppercase","At least one upper case character"),D=(0,h.Z)(P,2),I=D[0],U=D[1],q=be(!0,"lower","Lowercase","At least one lower case character"),F=(0,h.Z)(q,2),T=F[0],K=F[1],z=be(!0,"number","Number","At least one number character"),R=(0,h.Z)(z,2),B=R[0],M=R[1],_=be(!0,"custom","Custom","At least one custom character"),H=(0,h.Z)(_,2),G=H[0],W=H[1],Q=(0,r.useState)(16),V=(0,h.Z)(Q,2),Y=V[0],X=V[1],ee=(0,r.useState)(Ae),te=(0,h.Z)(ee,2),ne=te[0],re=te[1];return(0,r.useEffect)((function(){ne!=Ae&&setTimeout((function(){re(Ae)}),1500)}),[ne]),(0,j.jsx)("div",{className:"card bg-dark",children:(0,j.jsxs)("div",{className:"card-body text-white d-flex flex-column gap-3",children:[(0,j.jsx)("span",{children:"Character Pool"}),(0,j.jsxs)("div",{className:"d-flex flex-wrap gap-2 align-content-between",children:[a,c,f,v,k,S,(0,j.jsxs)("div",{className:"input-group",title:"Custom characters",children:[(0,j.jsx)("span",{className:"input-group-text",children:"Custom"}),(0,j.jsx)("input",{type:"text",className:"form-control","aria-label":"Custom characters",value:O,onChange:function(e){return $(e.target.value)}})]})]}),(0,j.jsx)("span",{children:"Constraints"}),(0,j.jsxs)("div",{className:"d-flex flex-wrap gap-2 align-content-between",children:[U,K,M,W,(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("span",{className:"input-group-text",children:"Length"}),(0,j.jsx)("input",{type:"number",className:"form-control","aria-label":"Length",value:Y,onChange:function(e){return X(e.target.value)}})]})]}),(0,j.jsxs)("button",{className:"btn btn-secondary",onClick:function(){var e="";n&&(e+=ke),i&&(e+=je),p&&(e+=Ne),g&&(e+=Ce),w&&(e+=Ze),Z&&(e+=Se),O&&(e=(e=(e+=O).split("")).filter((function(e,t,n){return n.indexOf(e)===t})),e=e.join(""));for(var t=function(e,t){if(e.length>256)throw Error("charPool size too large for 8 bit integers");var n=new Uint8Array(t);crypto.getRandomValues(n);var r,a="",s=function(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return we(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?we(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,o=!0,i=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){i=!0,s=e},f:function(){try{o||null==n.return||n.return()}finally{if(i)throw s}}}}(n);try{for(s.s();!(r=s.n()).done;){var o=r.value;a+=e.charAt(o%e.length)}}catch(e){s.e(e)}finally{s.f()}return a}(e,Y),r=new Array(Y),a=0;a<Y;a++)r[a]=a;r=function(e){for(var t,n,r=e.length;r;)n=Ee(0,--r),t=e[r],e[r]=e[n],e[n]=t;return e}(r);try{if(I){var s=r.pop();if(void 0===s)throw new $e;t=Oe(t,s,ke.toUpperCase()[Ee(0,ke.length-1)])}if(T){var o=r.pop();if(void 0===o)throw new $e;t=Oe(t,o,ke[Ee(0,ke.length-1)])}if(B){var c=r.pop();if(void 0===c)throw new $e;t=Oe(t,c,je[Ee(0,je.length-1)])}if(G&&O){var l=r.pop();if(void 0===l)throw new $e;t=Oe(t,l,O[Ee(0,O.length-1)])}J.Z.write(t).then((function(){re("lucide:clipboard-check")})).catch((function(){d.Am.error("Could not copy to clipboard")}))}catch(e){e instanceof $e?d.Am.error(e.message):console.error(e)}},children:["Generate ",(0,j.jsx)(L.JO,{icon:ne})]})]})})}function De(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var Ie=(0,w.Ps)("\nquery ($keyId: String) {\n    getNotes(keyId: $keyId) {\n        id\n        updatedAt\n    }\n}"),Le=(0,w.Ps)("\nmutation ($title: String, $keyId: String){\n    createNote(title: $title, keyId: $keyId) {\n        id\n    }\n}");function Ue(){var e=(0,k.x)(),t=(0,r.useContext)(S).user,n=(0,r.useState)(""),a=(0,h.Z)(n,2),s=a[0],o=a[1],i=(0,r.useState)([]),c=(0,h.Z)(i,2),l=c[0],u=c[1],d=(0,r.useState)(""),p=(0,h.Z)(d,2),f=p[0],x=p[1],v=(0,r.useState)(""),y=(0,h.Z)(v,2),b=y[0],w=y[1],N=(0,r.useState)(null),C=(0,h.Z)(N,2),Z=C[0],A=C[1],E=(0,r.useState)(null),O=(0,h.Z)(E,2),$=O[0],P=O[1],D=(0,r.useState)(!1),I=(0,h.Z)(D,2),U=I[0],q=I[1],F=(0,V.Z)(Z).encrypt,T=(0,z.t)(Ie,{variables:{keyId:$},onCompleted:function(e){var t=e.getNotes.sort((function(e,t){var n=new Date(e.updatedAt).valueOf();return new Date(t.updatedAt).valueOf()-n})).map((function(e){return e.id}));u(t)}}),J=(0,h.Z)(T,1)[0];function R(){var e=t+b,n=K()(e).toString();A(n);var r=K()(n).toString();P(r)}function B(){return(B=(0,m.Z)(g().mark((function t(){var n;return g().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.mutate({mutation:Le,variables:{title:F("Untitled note"),keyId:$}});case 3:n=t.sent,u([n.data.createNote.id].concat(l)),t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.log(t.t0.message);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))).apply(this,arguments)}function M(e){return _.apply(this,arguments)}function _(){return _=(0,m.Z)(g().mark((function e(t){return g().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:u(l.filter((function(e){return e!==t})));case 1:case"end":return e.stop()}}),e)}))),_.apply(this,arguments)}function H(){w(f)}function G(){o("")}function W(){x(""),w("")}if((0,r.useEffect)((function(){R()}),[t]),(0,r.useEffect)((function(){t?R():(A(null),P(null))}),[b]),(0,r.useEffect)((function(){J()}),[$]),!t)return(0,j.jsx)("p",{className:"my-3",children:"You need to login to access this page"});if(!Z)return(0,j.jsx)("p",{className:"my-3",children:"Generating client encryption key..."});var Y,X=[],ee=function(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return De(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?De(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,o=!0,i=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){i=!0,s=e},f:function(){try{o||null==n.return||n.return()}finally{if(i)throw s}}}}(l);try{for(ee.s();!(Y=ee.n()).done;){var te=Y.value;X.push((0,j.jsx)(de,{encryptionKey:Z,query:s,id:te,onDeleted:M},te))}}catch(e){ee.e(e)}finally{ee.f()}return 0==X.length&&t&&(X=(0,j.jsx)("p",{children:"There are no notes available."})),(0,j.jsxs)("div",{className:"d-flex flex-column gap-3 my-3",children:[(0,j.jsxs)("div",{className:"d-flex gap-2 align-items-stretch",children:[(0,j.jsxs)("div",{className:"d-flex gap-2 flex-wrap flex-md-nowrap flex-grow-1",children:[(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("span",{className:"input-group-text",id:"key",title:"Key",children:(0,j.jsx)(L.JO,{icon:"codicon:key"})}),(0,j.jsx)("input",{className:"form-control",type:"password",placeholder:"Key",autoComplete:"new-password","aria-describedby":"key",value:f,onChange:function(e){return x(e.target.value)},onBlur:H,onKeyDown:function(e){"Enter"===e.key?(e.target.blur(),H()):"Escape"===e.key&&(e.target.blur(),W())}}),b!==f&&(0,j.jsx)(Q,{icon:"bi:check",variant:"outline-primary",title:"Apply",onClick:H}),b&&(0,j.jsx)(Q,{icon:"carbon:delete",variant:"outline-warning",onClick:W})]}),(0,j.jsxs)("div",{className:"input-group",children:[(0,j.jsx)("span",{className:"input-group-text",id:"filter",title:"Filter",children:(0,j.jsx)(L.JO,{icon:"codicon:search"})}),(0,j.jsx)("input",{type:"text",className:"form-control",value:s,placeholder:"Filter","aria-describedby":"filter",onChange:function(e){o(e.target.value)},onKeyDown:function(e){"Enter"===e.key?e.target.blur():"Escape"===e.key&&(e.target.blur(),G())}}),s&&(0,j.jsx)(Q,{icon:"carbon:delete",variant:"outline-warning",onClick:G})]})]}),(0,j.jsxs)("div",{className:"d-flex flex-column flex-md-row gap-2",children:[(0,j.jsx)(Q,{className:"",icon:"ph:password",variant:"secondary",title:"Password Generator",onClick:function(){q(!U)}}),(0,j.jsx)(Q,{className:"",icon:"codicon:new-file",variant:"secondary",title:"New Note",onClick:function(){return B.apply(this,arguments)}})]})]}),U&&(0,j.jsx)(Pe,{}),(0,j.jsx)("div",{className:"d-flex flex-column gap-3",children:X})]})}function qe(){return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)($,{}),(0,j.jsx)(A,{children:(0,j.jsxs)(p.VK,{children:[(0,j.jsx)("nav",{className:"navbar navbar-dark bg-dark",children:(0,j.jsxs)("div",{className:"container",children:[(0,j.jsx)(p.rU,{className:"navbar-brand",to:"/",children:"Notebook"}),(0,j.jsx)(D,{})]})}),(0,j.jsx)("div",{className:"container",children:(0,j.jsxs)(f.Z5,{children:[(0,j.jsx)(f.AW,{path:"/login",element:(0,j.jsx)(I,{})}),(0,j.jsx)(f.AW,{path:"/settings",element:(0,j.jsx)(E,{children:(0,j.jsx)(F,{})})}),(0,j.jsx)(f.AW,{path:"*",element:(0,j.jsx)(E,{children:(0,j.jsx)(Ue,{})})})]})})]})})]})}n.p,n.p,n.p,n.p,n.p,n.p,n.p,n.p,n.p,n.p,n.p,n.p,n.p,n.p;var Fe=new s.u({uri:"/gql"}),Te=(0,u.q)((function(e){var t=e.graphQLErrors,n=e.networkError;if(t&&t.forEach((function(e){var t=e.message,n=e.locations,r=e.path,a="[GraphQL error]: Message: ".concat(t,", Location: ").concat(JSON.stringify(n),", Path: ").concat(r);d.Am.error(a),console.error(a)})),n&&401!==n.statusCode){var r="[Network error]: ".concat(n);d.Am.error(r),console.error(r)}})),Ke=new o.f({cache:new i.h,link:(0,c.D)([Te,Fe]),defaultOptions:{watchQuery:{fetchPolicy:"no-cache",errorPolicy:"all"},query:{fetchPolicy:"no-cache",errorPolicy:"all"},mutate:{errorPolicy:"all"}}});(0,a.render)((0,j.jsx)(r.StrictMode,{children:(0,j.jsx)(l.e,{client:Ke,children:(0,j.jsx)(qe,{})})}),document.getElementById("root"))}},e=>{e.O(0,[39,354],(()=>(5619,e(e.s=5619)))),e.O()}]);