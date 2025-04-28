/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "(pages-dir-browser)/./components/Home/CategoryShowCase.jsx":
/*!**********************************************!*\
  !*** ./components/Home/CategoryShowCase.jsx ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(pages-dir-browser)/./components/Home/Home.jsx":
/*!**********************************!*\
  !*** ./components/Home/Home.jsx ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(pages-dir-browser)/./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(pages-dir-browser)/./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _Banner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Banner */ \"(pages-dir-browser)/./components/Home/Banner.jsx\");\n/* harmony import */ var _HomeCategory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HomeCategory */ \"(pages-dir-browser)/./components/Home/HomeCategory.jsx\");\n/* harmony import */ var _Register__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Register */ \"(pages-dir-browser)/./components/Home/Register.jsx\");\n/* harmony import */ var _LocationSprade__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LocationSprade */ \"(pages-dir-browser)/./components/Home/LocationSprade.jsx\");\n/* harmony import */ var _AboutUs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AboutUs */ \"(pages-dir-browser)/./components/Home/AboutUs.jsx\");\n/* harmony import */ var _AppSection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AppSection */ \"(pages-dir-browser)/./components/Home/AppSection.jsx\");\n/* harmony import */ var _Sponsor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Sponsor */ \"(pages-dir-browser)/./components/Home/Sponsor.jsx\");\n/* harmony import */ var _CategoryShowCase__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./CategoryShowCase */ \"(pages-dir-browser)/./components/Home/CategoryShowCase.jsx\");\n/* harmony import */ var _CategoryShowCase__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_CategoryShowCase__WEBPACK_IMPORTED_MODULE_9__);\n\n\n\nconsole.log(\"🧪 Banner:\", _Banner__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n\nconsole.log(\"🧪 HomeCategory:\", _HomeCategory__WEBPACK_IMPORTED_MODULE_3__[\"default\"]);\n\nconsole.log(\"🧪 Register:\", _Register__WEBPACK_IMPORTED_MODULE_4__[\"default\"]);\n\nconsole.log(\"🧪 LocationSprade:\", _LocationSprade__WEBPACK_IMPORTED_MODULE_5__[\"default\"]);\n\nconsole.log(\"🧪 AboutUs:\", _AboutUs__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\n\nconsole.log(\"🧪 AppSection:\", _AppSection__WEBPACK_IMPORTED_MODULE_7__[\"default\"]);\n\nconsole.log(\"🧪 Sponsor:\", _Sponsor__WEBPACK_IMPORTED_MODULE_8__[\"default\"]);\n\nconsole.log(\"🧪 CategoryShowCase:\", (_CategoryShowCase__WEBPACK_IMPORTED_MODULE_9___default()));\nconst Home = ()=>{\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Banner__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 30,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_HomeCategory__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 31,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_CategoryShowCase__WEBPACK_IMPORTED_MODULE_9___default()), {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 32,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Register__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 33,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_LocationSprade__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 34,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_AboutUs__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 35,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_AppSection__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 36,\n                columnNumber: 9\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Sponsor__WEBPACK_IMPORTED_MODULE_8__[\"default\"], {}, void 0, false, {\n                fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n                lineNumber: 37,\n                columnNumber: 9\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\Louis Olivier\\\\Downloads\\\\ewebsite2-francise\\\\components\\\\Home\\\\Home.jsx\",\n        lineNumber: 29,\n        columnNumber: 5\n    }, undefined);\n};\n_c = Home;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);\nvar _c;\n$RefreshReg$(_c, \"Home\");\n\n\n;\r\n    // Wrapped in an IIFE to avoid polluting the global scope\r\n    ;\r\n    (function () {\r\n        var _a, _b;\r\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\r\n        // to extract CSS. For backwards compatibility, we need to check we're in a\r\n        // browser context before continuing.\r\n        if (typeof self !== 'undefined' &&\r\n            // AMP / No-JS mode does not inject these helpers:\r\n            '$RefreshHelpers$' in self) {\r\n            // @ts-ignore __webpack_module__ is global\r\n            var currentExports = module.exports;\r\n            // @ts-ignore __webpack_module__ is global\r\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\r\n            // This cannot happen in MainTemplate because the exports mismatch between\r\n            // templating and execution.\r\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\r\n            // A module can be accepted automatically based on its exports, e.g. when\r\n            // it is a Refresh Boundary.\r\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\r\n                // Save the previous exports signature on update so we can compare the boundary\r\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\r\n                module.hot.dispose(function (data) {\r\n                    data.prevSignature =\r\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\r\n                });\r\n                // Unconditionally accept an update to this module, we'll check if it's\r\n                // still a Refresh Boundary later.\r\n                // @ts-ignore importMeta is replaced in the loader\r\n                module.hot.accept();\r\n                // This field is set when the previous version of this module was a\r\n                // Refresh Boundary, letting us know we need to check for invalidation or\r\n                // enqueue an update.\r\n                if (prevSignature !== null) {\r\n                    // A boundary can become ineligible if its exports are incompatible\r\n                    // with the previous exports.\r\n                    //\r\n                    // For example, if you add/remove/change exports, we'll want to\r\n                    // re-execute the importing modules, and force those components to\r\n                    // re-render. Similarly, if you convert a class component to a\r\n                    // function, we want to invalidate the boundary.\r\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\r\n                        module.hot.invalidate();\r\n                    }\r\n                    else {\r\n                        self.$RefreshHelpers$.scheduleUpdate();\r\n                    }\r\n                }\r\n            }\r\n            else {\r\n                // Since we just executed the code for the module, it's possible that the\r\n                // new exports made it ineligible for being a boundary.\r\n                // We only care about the case when we were _previously_ a boundary,\r\n                // because we already accepted this update (accidental side effect).\r\n                var isNoLongerABoundary = prevSignature !== null;\r\n                if (isNoLongerABoundary) {\r\n                    module.hot.invalidate();\r\n                }\r\n            }\r\n        }\r\n    })();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1icm93c2VyKS8uL2NvbXBvbmVudHMvSG9tZS9Ib21lLmpzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBeUI7QUFDSztBQUM5QkUsUUFBUUMsR0FBRyxDQUFDLGNBQWNGLCtDQUFNQTtBQUVVO0FBQzFDQyxRQUFRQyxHQUFHLENBQUMsb0JBQW9CQyxxREFBWUE7QUFFVjtBQUNsQ0YsUUFBUUMsR0FBRyxDQUFDLGdCQUFnQkUsaURBQVFBO0FBRVU7QUFDOUNILFFBQVFDLEdBQUcsQ0FBQyxzQkFBc0JHLHVEQUFjQTtBQUVoQjtBQUNoQ0osUUFBUUMsR0FBRyxDQUFDLGVBQWVJLGdEQUFPQTtBQUVJO0FBQ3RDTCxRQUFRQyxHQUFHLENBQUMsa0JBQWtCSyxtREFBVUE7QUFFUjtBQUNoQ04sUUFBUUMsR0FBRyxDQUFDLGVBQWVNLGdEQUFPQTtBQUVnQjtBQUNsRFAsUUFBUUMsR0FBRyxDQUFDLHdCQUF3Qk8sMERBQWdCQTtBQUdwRCxNQUFNQyxPQUFPO0lBQ1gscUJBQ0UsOERBQUNDOzswQkFDRyw4REFBQ1gsK0NBQU1BOzs7OzswQkFDUCw4REFBQ0cscURBQVlBOzs7OzswQkFDYiw4REFBQ00sMERBQWdCQTs7Ozs7MEJBQ2pCLDhEQUFDTCxpREFBUUE7Ozs7OzBCQUNULDhEQUFDQyx1REFBY0E7Ozs7OzBCQUNmLDhEQUFDQyxnREFBT0E7Ozs7OzBCQUNSLDhEQUFDQyxtREFBVUE7Ozs7OzBCQUNYLDhEQUFDQyxnREFBT0E7Ozs7Ozs7Ozs7O0FBR2hCO0tBYk1FO0FBZU4saUVBQWVBLElBQUlBLEVBQUEiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcTG91aXMgT2xpdmllclxcRG93bmxvYWRzXFxld2Vic2l0ZTItZnJhbmNpc2VcXGNvbXBvbmVudHNcXEhvbWVcXEhvbWUuanN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcclxuaW1wb3J0IEJhbm5lciBmcm9tICcuL0Jhbm5lcic7XHJcbmNvbnNvbGUubG9nKFwi8J+nqiBCYW5uZXI6XCIsIEJhbm5lcik7XHJcblxyXG5pbXBvcnQgSG9tZUNhdGVnb3J5IGZyb20gJy4vSG9tZUNhdGVnb3J5JztcclxuY29uc29sZS5sb2coXCLwn6eqIEhvbWVDYXRlZ29yeTpcIiwgSG9tZUNhdGVnb3J5KTtcclxuXHJcbmltcG9ydCBSZWdpc3RlciBmcm9tICcuL1JlZ2lzdGVyJztcclxuY29uc29sZS5sb2coXCLwn6eqIFJlZ2lzdGVyOlwiLCBSZWdpc3Rlcik7XHJcblxyXG5pbXBvcnQgTG9jYXRpb25TcHJhZGUgZnJvbSAnLi9Mb2NhdGlvblNwcmFkZSc7XHJcbmNvbnNvbGUubG9nKFwi8J+nqiBMb2NhdGlvblNwcmFkZTpcIiwgTG9jYXRpb25TcHJhZGUpO1xyXG5cclxuaW1wb3J0IEFib3V0VXMgZnJvbSAnLi9BYm91dFVzJztcclxuY29uc29sZS5sb2coXCLwn6eqIEFib3V0VXM6XCIsIEFib3V0VXMpO1xyXG5cclxuaW1wb3J0IEFwcFNlY3Rpb24gZnJvbSAnLi9BcHBTZWN0aW9uJztcclxuY29uc29sZS5sb2coXCLwn6eqIEFwcFNlY3Rpb246XCIsIEFwcFNlY3Rpb24pO1xyXG5cclxuaW1wb3J0IFNwb25zb3IgZnJvbSAnLi9TcG9uc29yJztcclxuY29uc29sZS5sb2coXCLwn6eqIFNwb25zb3I6XCIsIFNwb25zb3IpO1xyXG5cclxuaW1wb3J0IENhdGVnb3J5U2hvd0Nhc2UgZnJvbSAnLi9DYXRlZ29yeVNob3dDYXNlJztcclxuY29uc29sZS5sb2coXCLwn6eqIENhdGVnb3J5U2hvd0Nhc2U6XCIsIENhdGVnb3J5U2hvd0Nhc2UpO1xyXG5cclxuXHJcbmNvbnN0IEhvbWUgPSAoKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgICAgPEJhbm5lci8+XHJcbiAgICAgICAgPEhvbWVDYXRlZ29yeS8+XHJcbiAgICAgICAgPENhdGVnb3J5U2hvd0Nhc2UvPlxyXG4gICAgICAgIDxSZWdpc3Rlci8+XHJcbiAgICAgICAgPExvY2F0aW9uU3ByYWRlLz5cclxuICAgICAgICA8QWJvdXRVcy8+XHJcbiAgICAgICAgPEFwcFNlY3Rpb24vPlxyXG4gICAgICAgIDxTcG9uc29yLz5cclxuICAgIDwvZGl2PlxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSG9tZVxyXG4iXSwibmFtZXMiOlsiUmVhY3QiLCJCYW5uZXIiLCJjb25zb2xlIiwibG9nIiwiSG9tZUNhdGVnb3J5IiwiUmVnaXN0ZXIiLCJMb2NhdGlvblNwcmFkZSIsIkFib3V0VXMiLCJBcHBTZWN0aW9uIiwiU3BvbnNvciIsIkNhdGVnb3J5U2hvd0Nhc2UiLCJIb21lIiwiZGl2Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-browser)/./components/Home/Home.jsx\n"));

/***/ })

});