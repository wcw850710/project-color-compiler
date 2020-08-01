/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/ts-loader/index.ts):\\nError: Cannot find module 'typescript'\\nRequire stack:\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\dist\\\\compilerSetup.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\dist\\\\instances.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\dist\\\\index.ts\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\index.ts\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\loader-runner\\\\lib\\\\loadLoader.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\loader-runner\\\\lib\\\\LoaderRunner.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack\\\\lib\\\\NormalModule.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack\\\\lib\\\\NormalModuleFactory.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack\\\\lib\\\\Compiler.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack\\\\lib\\\\webpack.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack-cli\\\\bin\\\\utils\\\\validate-options.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack-cli\\\\bin\\\\utils\\\\convert-argv.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack-cli\\\\bin\\\\cli.js\\n- C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\webpack\\\\bin\\\\webpack.js\\n    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:966:15)\\n    at Function.Module._load (internal/modules/cjs/loader.js:842:27)\\n    at Module.require (internal/modules/cjs/loader.js:1026:19)\\n    at require (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:161:20)\\n    at Object.<anonymous> (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\dist\\\\compilerSetup.js:5:20)\\n    at Module._compile (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:194:30)\\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1158:10)\\n    at Module.load (internal/modules/cjs/loader.js:986:32)\\n    at Function.Module._load (internal/modules/cjs/loader.js:879:14)\\n    at Module.require (internal/modules/cjs/loader.js:1026:19)\\n    at require (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:161:20)\\n    at Object.<anonymous> (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\dist\\\\instances.js:8:25)\\n    at Module._compile (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:194:30)\\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1158:10)\\n    at Module.load (internal/modules/cjs/loader.js:986:32)\\n    at Function.Module._load (internal/modules/cjs/loader.js:879:14)\\n    at Module.require (internal/modules/cjs/loader.js:1026:19)\\n    at require (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:161:20)\\n    at Object.<anonymous> (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\dist\\\\index.ts:6:21)\\n    at Module._compile (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:194:30)\\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1158:10)\\n    at Module.load (internal/modules/cjs/loader.js:986:32)\\n    at Function.Module._load (internal/modules/cjs/loader.js:879:14)\\n    at Module.require (internal/modules/cjs/loader.js:1026:19)\\n    at require (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:161:20)\\n    at Object.<anonymous> (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\ts-loader\\\\index.ts:1:76)\\n    at Module._compile (C:\\\\Users\\\\wcw85\\\\desk\\\\code\\\\ws-projects\\\\project-color-compiler\\\\src\\\\service\\\\node_modules\\\\v8-compile-cache\\\\v8-compile-cache.js:194:30)\\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1158:10)\\n    at Module.load (internal/modules/cjs/loader.js:986:32)\\n    at Function.Module._load (internal/modules/cjs/loader.js:879:14)\");\n\n//# sourceURL=webpack:///./index.ts?");

/***/ })

/******/ });