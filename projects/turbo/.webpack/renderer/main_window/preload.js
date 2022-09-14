/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HEARTBEAT_EVENT = exports.REC_ID_EVENT = exports.SET_ID_EVENT = exports.REQ_ID_EVENT = exports.SERVER_URL = exports.REMOTE_URL = void 0;\nexports.REMOTE_URL = \"https://mutex-remote.web.app\";\nexports.SERVER_URL = \"https://us-central1-mutex-remote.cloudfunctions.net/api\";\nexports.REQ_ID_EVENT = \"getId\";\nexports.SET_ID_EVENT = \"setId\";\nexports.REC_ID_EVENT = \"idChange\";\nexports.HEARTBEAT_EVENT = \"heartbeat\";\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29uc3RhbnRzLnRzLmpzIiwibWFwcGluZ3MiOiI7OztBQUFhLGtCQUFVLEdBQVcsOEJBQThCLENBQUM7QUFDcEQsa0JBQVUsR0FBRyx5REFBeUQsQ0FBQztBQUN2RSxvQkFBWSxHQUFHLE9BQU8sQ0FBQztBQUN2QixvQkFBWSxHQUFHLE9BQU8sQ0FBQztBQUN2QixvQkFBWSxHQUFHLFVBQVUsQ0FBQztBQUMxQix1QkFBZSxHQUFHLFdBQVcsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL211dGV4LXR1cmJvLy4vc3JjL2NvbnN0YW50cy50cz84NWVlIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBSRU1PVEVfVVJMOiBzdHJpbmcgPSBcImh0dHBzOi8vbXV0ZXgtcmVtb3RlLndlYi5hcHBcIjtcbmV4cG9ydCBjb25zdCBTRVJWRVJfVVJMID0gXCJodHRwczovL3VzLWNlbnRyYWwxLW11dGV4LXJlbW90ZS5jbG91ZGZ1bmN0aW9ucy5uZXQvYXBpXCI7XG5leHBvcnQgY29uc3QgUkVRX0lEX0VWRU5UID0gXCJnZXRJZFwiO1xuZXhwb3J0IGNvbnN0IFNFVF9JRF9FVkVOVCA9IFwic2V0SWRcIjtcbmV4cG9ydCBjb25zdCBSRUNfSURfRVZFTlQgPSBcImlkQ2hhbmdlXCI7XG5leHBvcnQgY29uc3QgSEVBUlRCRUFUX0VWRU5UID0gXCJoZWFydGJlYXRcIjsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/constants.ts\n");

/***/ }),

/***/ "./src/renderer/preload.ts":
/*!*********************************!*\
  !*** ./src/renderer/preload.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n// See the Electron documentation for details on how to use preload scripts:\n// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts\nvar electron_1 = __webpack_require__(/*! electron */ \"electron\");\nvar constants_1 = __webpack_require__(/*! ../constants */ \"./src/constants.ts\");\nconsole.log('preload.ts');\nvar setHeartbeatHandler = function (heartbeatHandler) {\n    electron_1.ipcRenderer.on(constants_1.HEARTBEAT_EVENT, heartbeatHandler);\n};\nvar setIdHandler = function (idHandler) {\n    electron_1.ipcRenderer.on(constants_1.REC_ID_EVENT, idHandler);\n};\nvar api = {\n    setHeartbeatHandler: setHeartbeatHandler,\n    setIdHandler: setIdHandler,\n    requestId: function () {\n        electron_1.ipcRenderer.send(constants_1.REQ_ID_EVENT);\n        console.log(\"requestId from frontend\");\n    },\n    setId: function (id) { return electron_1.ipcRenderer.emit(constants_1.SET_ID_EVENT, { id: id }); },\n};\nelectron_1.contextBridge.exposeInMainWorld('electronAPI', api);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcmVuZGVyZXIvcHJlbG9hZC50cy5qcyIsIm1hcHBpbmdzIjoiOztBQUFBLDRFQUE0RTtBQUM1RSxnRkFBZ0Y7QUFDaEYsaUVBQXNEO0FBRXRELGdGQUF5RjtBQUV6RixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRTFCLElBQU0sbUJBQW1CLEdBQUcsVUFBQyxnQkFBc0Q7SUFDL0Usc0JBQVcsQ0FBQyxFQUFFLENBQUMsMkJBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQztBQUVGLElBQU0sWUFBWSxHQUFHLFVBQUMsU0FBK0M7SUFDakUsc0JBQVcsQ0FBQyxFQUFFLENBQUMsd0JBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsSUFBTSxHQUFHLEdBQWlCO0lBQ3RCLG1CQUFtQixFQUFFLG1CQUFtQjtJQUN4QyxZQUFZLEVBQUUsWUFBWTtJQUMxQixTQUFTLEVBQUU7UUFDUCxzQkFBVyxDQUFDLElBQUksQ0FBQyx3QkFBWSxDQUFDLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxLQUFLLEVBQUUsVUFBQyxFQUFVLElBQUssNkJBQVcsQ0FBQyxJQUFJLENBQUMsd0JBQVksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUExQyxDQUEwQztDQUNwRSxDQUFDO0FBRUYsd0JBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tdXRleC10dXJiby8uL3NyYy9yZW5kZXJlci9wcmVsb2FkLnRzP2E2YjkiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gU2VlIHRoZSBFbGVjdHJvbiBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzIG9uIGhvdyB0byB1c2UgcHJlbG9hZCBzY3JpcHRzOlxuLy8gaHR0cHM6Ly93d3cuZWxlY3Ryb25qcy5vcmcvZG9jcy9sYXRlc3QvdHV0b3JpYWwvcHJvY2Vzcy1tb2RlbCNwcmVsb2FkLXNjcmlwdHNcbmltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgSUVsZWN0cm9uQVBJIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBIRUFSVEJFQVRfRVZFTlQsIFJFQ19JRF9FVkVOVCwgUkVRX0lEX0VWRU5ULCBTRVRfSURfRVZFTlQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5jb25zb2xlLmxvZygncHJlbG9hZC50cycpO1xuXG5jb25zdCBzZXRIZWFydGJlYXRIYW5kbGVyID0gKGhlYXJ0YmVhdEhhbmRsZXI6IChldmVudDogRXZlbnQsIG1lc3NhZ2U6IGFueSkgPT4gdm9pZCk6IHZvaWQgPT4ge1xuICAgIGlwY1JlbmRlcmVyLm9uKEhFQVJUQkVBVF9FVkVOVCwgaGVhcnRiZWF0SGFuZGxlcik7XG59O1xuXG5jb25zdCBzZXRJZEhhbmRsZXIgPSAoaWRIYW5kbGVyOiAoZXZlbnQ6IEV2ZW50LCBtZXNzYWdlOiBhbnkpID0+IHZvaWQpOiB2b2lkID0+IHtcbiAgICBpcGNSZW5kZXJlci5vbihSRUNfSURfRVZFTlQsIGlkSGFuZGxlcik7XG59XG5cbmNvbnN0IGFwaTogSUVsZWN0cm9uQVBJID0ge1xuICAgIHNldEhlYXJ0YmVhdEhhbmRsZXI6IHNldEhlYXJ0YmVhdEhhbmRsZXIsXG4gICAgc2V0SWRIYW5kbGVyOiBzZXRJZEhhbmRsZXIsXG4gICAgcmVxdWVzdElkOiAoKSA9PiAgeyBcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChSRVFfSURfRVZFTlQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RJZCBmcm9tIGZyb250ZW5kXCIpO1xuICAgIH0sXG4gICAgc2V0SWQ6IChpZDogc3RyaW5nKSA9PiBpcGNSZW5kZXJlci5lbWl0KFNFVF9JRF9FVkVOVCwgeyBpZDogaWQgfSksXG59O1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbkFQSScsIGFwaSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/renderer/preload.ts\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/renderer/preload.ts");
/******/ 	
/******/ })()
;