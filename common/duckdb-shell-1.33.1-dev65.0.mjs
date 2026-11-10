// package.json
var package_default = {
  name: "@duckdb/duckdb-wasm-shell",
  version: "1.33.1-dev65.0",
  description: "",
  author: "Andre Kohn <kohn.a@outlook.com>",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/duckdb/duckdb-wasm.git"
  },
  keywords: [
    "sql",
    "duckdb",
    "relational",
    "database",
    "data",
    "query",
    "wasm",
    "analytics",
    "olap",
    "arrow",
    "parquet",
    "json",
    "csv"
  ],
  dependencies: {
    "@duckdb/duckdb-wasm": "^1.33.1-dev65.0",
    qs: "^6.14.1",
    xterm: "^5.3.0",
    "xterm-addon-fit": "^0.8.0",
    "xterm-addon-web-links": "^0.9.0",
    "xterm-addon-webgl": "^0.16.0"
  },
  devDependencies: {
    esbuild: "^0.20.2",
    eslint: "^8.57.0",
    "eslint-plugin-jasmine": "^4.1.3",
    "eslint-plugin-react": "^7.37.5",
    jasmine: "^5.13.0",
    "jasmine-core": "^5.1.2",
    "jasmine-spec-reporter": "^7.0.0",
    "make-dir": "^4.0.0",
    prettier: "^3.2.5",
    rimraf: "^5.0.5",
    "wasm-pack": "^0.13.1"
  },
  scripts: {
    "install:wasmpack": "node ../../node_modules/wasm-pack/install.js",
    "build:debug": "node bundle.mjs debug && tsc --emitDeclarationOnly",
    "build:release": "node bundle.mjs release && tsc --emitDeclarationOnly",
    lint: "eslint src"
  },
  files: [
    "dist",
    "!dist/types/test"
  ],
  main: "dist/shell.cjs",
  module: "dist/shell.mjs",
  types: "dist/shell.d.ts",
  jsdelivr: "dist/shell.cjs",
  unpkg: "dist/shell.mjs",
  sideEffects: false,
  exports: {
    "./dist/shell_bg.wasm": "./dist/shell_bg.wasm",
    "./dist/shell.js": "./dist/shell.js",
    "./dist/shell.cjs": "./dist/shell.cjs",
    "./dist/shell.mjs": "./dist/shell.mjs",
    "./dist/shell": "./dist/shell.mjs",
    ".": {
      types: "./dist/shell.d.ts",
      import: "./dist/shell.mjs",
      require: "./dist/shell.cjs"
    }
  }
};

// src/version.ts
var PACKAGE_NAME = package_default.name;
var PACKAGE_VERSION = package_default.version;
var VERSION_PARTS = package_default.version.split(".");
var PACKAGE_VERSION_MAJOR = VERSION_PARTS[0];
var PACKAGE_VERSION_MINOR = VERSION_PARTS[1];
var PACKAGE_VERSION_PATCH = VERSION_PARTS[2];

// src/shell.ts
import * as duckdb2 from "@duckdb/duckdb-wasm";

// crate/pkg/shell.js
import { getPlatformFeatures, PACKAGE_NAME as PACKAGE_NAME2, PACKAGE_VERSION as PACKAGE_VERSION2 } from "@duckdb/duckdb-wasm";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { WebglAddon } from "xterm-addon-webgl";
var wasm;
var WASM_VECTOR_LEN = 0;
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
var cachedTextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : { encode: () => {
  throw Error("TextEncoder not available");
} };
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_4.set(idx, obj);
  return idx;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
var cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
  throw Error("TextDecoder not available");
} };
if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
  if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
    cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32ArrayMemory0;
}
function passArray32ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 4, 4) >>> 0;
  getUint32ArrayMemory0().set(arg, ptr / 4);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
var CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((state) => {
  wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b);
});
function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor };
  const real = (...args) => {
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      if (--state.cnt === 0) {
        wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
        CLOSURE_DTORS.unregister(state);
      } else {
        state.a = a;
      }
    }
  };
  real.original = state;
  CLOSURE_DTORS.register(real, state, state);
  return real;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return "".concat(val);
  }
  if (type == "string") {
    return '"'.concat(val, '"');
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return "Symbol(".concat(description, ")");
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return "Function(".concat(name, ")");
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return "".concat(val.name, ": ").concat(val.message, "\n").concat(val.stack);
  }
  return className;
}
function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_4.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}
function embed(elem, runtime, options) {
  const ret = wasm.embed(elem, runtime, options);
  if (ret[1]) {
    throw takeFromExternrefTable0(ret[0]);
  }
}
function write(text) {
  const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len0 = WASM_VECTOR_LEN;
  wasm.write(ptr0, len0);
}
function writeln(text) {
  const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len0 = WASM_VECTOR_LEN;
  wasm.writeln(ptr0, len0);
}
function resize(_width, _height) {
  wasm.resize(_width, _height);
}
function loadHistory(history, cursor) {
  wasm.loadHistory(history, cursor);
}
function passInitQueries(queries) {
  const ret = wasm.passInitQueries(queries);
  return ret;
}
function configureDatabase(db) {
  const ret = wasm.configureDatabase(db);
  return ret;
}
function __wbg_adapter_26(arg0, arg1, arg2) {
  const ret = wasm.closure152_externref_shim(arg0, arg1, arg2);
  return ret !== 0;
}
function __wbg_adapter_29(arg0, arg1, arg2) {
  wasm.closure185_externref_shim(arg0, arg1, arg2);
}
function __wbg_adapter_217(arg0, arg1, arg2, arg3) {
  wasm.closure1268_externref_shim(arg0, arg1, arg2, arg3);
}
var ShellInputContext = Object.freeze({
  FileInput: 0,
  "0": "FileInput"
});
var WcWidth = Object.freeze({
  Width0: 0,
  "0": "Width0",
  Width1: 1,
  "1": "Width1",
  Width2: 2,
  "2": "Width2"
});
var DuckDBConfigFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_duckdbconfig_free(ptr >>> 0, 1));
var DuckDBConfig = class _DuckDBConfig {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_DuckDBConfig.prototype);
    obj.__wbg_ptr = ptr;
    DuckDBConfigFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DuckDBConfigFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_duckdbconfig_free(ptr, 0);
  }
  /**
   * @returns {string | undefined}
   */
  get path() {
    const ret = wasm.duckdbconfig_path(this.__wbg_ptr);
    let v1;
    if (ret[0] !== 0) {
      v1 = getStringFromWasm0(ret[0], ret[1]).slice();
      wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    }
    return v1;
  }
  /**
   * @param {string | null} [path]
   */
  set path(path) {
    var ptr0 = isLikeNone(path) ? 0 : passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.duckdbconfig_set_path(this.__wbg_ptr, ptr0, len0);
  }
};
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_attachCustomKeyEventHandler_5c309ad8c2d6ff9c = function(arg0, arg1) {
    arg0.attachCustomKeyEventHandler(arg1);
  };
  imports.wbg.__wbg_backgroundColor_51cf19ee7d4b277a = function(arg0, arg1) {
    const ret = arg1.backgroundColor;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_bigInt64Array_c64b3751e74d5277 = function(arg0) {
    const ret = arg0.bigInt64Array;
    return ret;
  };
  imports.wbg.__wbg_blockSize_cd30a6366d631ae8 = function(arg0) {
    const ret = arg0.blockSize;
    return ret;
  };
  imports.wbg.__wbg_blockStats_7e6019968a50af3b = function(arg0) {
    const ret = arg0.blockStats;
    return ret;
  };
  imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
    const ret = arg0.buffer;
    return ret;
  };
  imports.wbg.__wbg_call_672a4d21634d4a24 = function() {
    return handleError(function(arg0, arg1) {
      const ret = arg0.call(arg1);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.call(arg1, arg2);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_collectFileStatistics_d40af29ff6fc8c95 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      const ret = arg0.collectFileStatistics(getStringFromWasm0(arg1, arg2), arg3 !== 0);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_cols_77a8050235d63c90 = function(arg0) {
    const ret = arg0.cols;
    return ret;
  };
  imports.wbg.__wbg_connectInternal_818454f7281c00df = function() {
    return handleError(function(arg0) {
      const ret = arg0.connectInternal();
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_construct_036a353ca42f67b4 = function(arg0) {
    const ret = new Terminal(arg0);
    return ret;
  };
  imports.wbg.__wbg_copyFileToBuffer_83cb2af8941ca82a = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.copyFileToBuffer(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_crossOriginIsolated_0118e2417ec095ee = function(arg0) {
    const ret = arg0.crossOriginIsolated;
    return ret;
  };
  imports.wbg.__wbg_ctrlKey_1e826e468105ac11 = function(arg0) {
    const ret = arg0.ctrlKey;
    return ret;
  };
  imports.wbg.__wbg_disconnect_92d81f4ec3f107ec = function() {
    return handleError(function(arg0, arg1) {
      const ret = arg0.disconnect(arg1 >>> 0);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_downloadFile_d0dec3d05b3a9f19 = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      const ret = arg0.downloadFile(getStringFromWasm0(arg1, arg2), arg3);
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_dropFile_6eb68222192e72fc = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.dropFile(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_dropFiles_8bf37b450b4de5ee = function() {
    return handleError(function(arg0) {
      const ret = arg0.dropFiles();
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
      deferred0_0 = arg0;
      deferred0_1 = arg1;
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
  };
  imports.wbg.__wbg_error_ebb9ec1bc5af2f31 = function(arg0, arg1) {
    console.error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbg_exportFileStatistics_d52b61d6c201da1c = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.exportFileStatistics(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_fit_0db5c78a2a85f563 = function(arg0) {
    arg0.fit();
  };
  imports.wbg.__wbg_focus_dd92db4314c4db81 = function(arg0) {
    arg0.focus();
  };
  imports.wbg.__wbg_fontFamily_cac93414dbe897cf = function(arg0, arg1) {
    const ret = arg1.fontFamily;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_getFeatureFlags_14afaddbcef26858 = function() {
    return handleError(function(arg0) {
      const ret = arg0.getFeatureFlags();
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_getPlatformFeatures_40454c7f78791eb6 = function() {
    return handleError(function() {
      const ret = getPlatformFeatures();
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_getVersion_32486a199e795762 = function() {
    return handleError(function(arg0) {
      const ret = arg0.getVersion();
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
  };
  imports.wbg.__wbg_globFiles_542704d623854358 = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.globFiles(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_instanceof_WebLinksAddon_3750ea42996e2252 = function(arg0) {
    let result;
    try {
      result = arg0 instanceof WebLinksAddon;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_instanceof_WebglAddon_d96a60a43cae1674 = function(arg0) {
    let result;
    try {
      result = arg0 instanceof WebglAddon;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
    let result;
    try {
      result = arg0 instanceof Window;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_key_7b5c6cb539be8e13 = function(arg0, arg1) {
    const ret = arg1.key;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
    const ret = arg0.length;
    return ret;
  };
  imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
    const ret = arg0.length;
    return ret;
  };
  imports.wbg.__wbg_loadAddon_143d540bb5725490 = function(arg0, arg1) {
    arg0.loadAddon(arg1);
  };
  imports.wbg.__wbg_log_33ef14fd0c9ec1a3 = function(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbg_message_97a2af9b89d693a3 = function(arg0) {
    const ret = arg0.message;
    return ret;
  };
  imports.wbg.__wbg_metaKey_e1dd47d709a80ce5 = function(arg0) {
    const ret = arg0.metaKey;
    return ret;
  };
  imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
    try {
      var state0 = { a: arg0, b: arg1 };
      var cb0 = (arg02, arg12) => {
        const a = state0.a;
        state0.a = 0;
        try {
          return __wbg_adapter_217(a, state0.b, arg02, arg12);
        } finally {
          state0.a = a;
        }
      };
      const ret = new Promise(cb0);
      return ret;
    } finally {
      state0.a = state0.b = 0;
    }
  };
  imports.wbg.__wbg_new_405e22f390576ce2 = function() {
    const ret = new Object();
    return ret;
  };
  imports.wbg.__wbg_new_7890702e2f921af0 = function(arg0) {
    const ret = new WebglAddon(arg0 === 16777215 ? void 0 : arg0 !== 0);
    return ret;
  };
  imports.wbg.__wbg_new_7c075f00f439f1e0 = function() {
    const ret = new FitAddon();
    return ret;
  };
  imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
    const ret = new Error();
    return ret;
  };
  imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
  };
  imports.wbg.__wbg_new_c2ccb7a35264c397 = function(arg0, arg1, arg2) {
    const ret = new WebLinksAddon(arg0, arg1, arg2 === 16777215 ? void 0 : arg2 !== 0);
    return ret;
  };
  imports.wbg.__wbg_new_c68d7209be747379 = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
  };
  imports.wbg.__wbg_now_d18023d54d4e5500 = function(arg0) {
    const ret = arg0.now();
    return ret;
  };
  imports.wbg.__wbg_offsets_9a0c43647dfe8174 = function(arg0, arg1) {
    const ret = arg1.offsets;
    const ptr1 = passArray32ToWasm0(ret, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_open_89ca330653f2b749 = function() {
    return handleError(function(arg0, arg1) {
      const ret = arg0.open(DuckDBConfig.__wrap(arg1));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_open_ea472ea5209b0983 = function(arg0, arg1) {
    arg0.open(arg1);
  };
  imports.wbg.__wbg_performance_c185c0cdc2766575 = function(arg0) {
    const ret = arg0.performance;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_pickFiles_c443e685aed27e4f = function() {
    return handleError(function(arg0) {
      const ret = arg0.pickFiles();
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_pushInputToHistory_1549e9c17621ffd1 = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.pushInputToHistory(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
    queueMicrotask(arg0);
  };
  imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
  };
  imports.wbg.__wbg_readClipboardText_731ab326db907631 = function() {
    return handleError(function(arg0) {
      const ret = arg0.readClipboardText();
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_registerOPFSFileName_1ac109036d40476f = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.registerOPFSFileName(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
  };
  imports.wbg.__wbg_runQuery_dd923bfcee4eae4d = function() {
    return handleError(function(arg0, arg1, arg2, arg3) {
      const ret = arg0.runQuery(arg1 >>> 0, getStringFromWasm0(arg2, arg3));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
  };
  imports.wbg.__wbg_setallowProposedApi_1e56ae3768e93420 = function(arg0, arg1) {
    arg0.allowProposedApi = arg1 !== 0;
  };
  imports.wbg.__wbg_setbackground_94f13d2866b2e31b = function(arg0, arg1, arg2) {
    arg0.background = getStringFromWasm0(arg1, arg2);
  };
  imports.wbg.__wbg_setbrightYellow_5858b72099992f03 = function(arg0, arg1, arg2) {
    arg0.brightYellow = getStringFromWasm0(arg1, arg2);
  };
  imports.wbg.__wbg_setcursorBlink_850e871d6bcda748 = function(arg0, arg1) {
    arg0.cursorBlink = arg1 !== 0;
  };
  imports.wbg.__wbg_setcursorWidth_7899d7d19308befe = function(arg0, arg1) {
    arg0.cursorWidth = arg1 >>> 0;
  };
  imports.wbg.__wbg_setdrawBoldTextInBrightColors_c3276731d7662d87 = function(arg0, arg1) {
    arg0.drawBoldTextInBrightColors = arg1 !== 0;
  };
  imports.wbg.__wbg_setfontFamily_f2837e56dcf1e5a4 = function(arg0, arg1, arg2) {
    arg0.fontFamily = getStringFromWasm0(arg1, arg2);
  };
  imports.wbg.__wbg_setfontSize_7d8e3357cbc2a6ac = function(arg0, arg1) {
    arg0.fontSize = arg1 >>> 0;
  };
  imports.wbg.__wbg_setforeground_bbda7a714f8f4254 = function(arg0, arg1, arg2) {
    arg0.foreground = getStringFromWasm0(arg1, arg2);
  };
  imports.wbg.__wbg_setrightClickSelectsWord_e15e0a6c7e12c2f4 = function(arg0, arg1) {
    arg0.rightClickSelectsWord = arg1 !== 0;
  };
  imports.wbg.__wbg_setrows_395bb2f6a40be664 = function(arg0, arg1) {
    arg0.rows = arg1 >>> 0;
  };
  imports.wbg.__wbg_settheme_1b783323a8d2b858 = function(arg0, arg1) {
    arg0.theme = arg1;
  };
  imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
    const ret = typeof global === "undefined" ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
    const ret = typeof globalThis === "undefined" ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_PACKAGE_NAME_0af717684e189e55 = function(arg0) {
    const ret = PACKAGE_NAME2;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_static_accessor_PACKAGE_VERSION_549ba11794cf5003 = function(arg0) {
    const ret = PACKAGE_VERSION2;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
    const ret = typeof self === "undefined" ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
    const ret = typeof window === "undefined" ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
  };
  imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
  };
  imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
  };
  imports.wbg.__wbg_toString_c813bbd34d063839 = function(arg0) {
    const ret = arg0.toString();
    return ret;
  };
  imports.wbg.__wbg_tokenize_8a1699f08f37e193 = function() {
    return handleError(function(arg0, arg1, arg2) {
      const ret = arg0.tokenize(getStringFromWasm0(arg1, arg2));
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_totalFileReadsAhead_a8f3246739715872 = function(arg0) {
    const ret = arg0.totalFileReadsAhead;
    return ret;
  };
  imports.wbg.__wbg_totalFileReadsCached_a9d725246d8113de = function(arg0) {
    const ret = arg0.totalFileReadsCached;
    return ret;
  };
  imports.wbg.__wbg_totalFileReadsCold_969fc4fdc92ba928 = function(arg0) {
    const ret = arg0.totalFileReadsCold;
    return ret;
  };
  imports.wbg.__wbg_totalFileWrites_a1979d03072ca561 = function(arg0) {
    const ret = arg0.totalFileWrites;
    return ret;
  };
  imports.wbg.__wbg_totalPageAccesses_d1e0755e7c873650 = function(arg0) {
    const ret = arg0.totalPageAccesses;
    return ret;
  };
  imports.wbg.__wbg_totalPageLoads_055280bed199c515 = function(arg0) {
    const ret = arg0.totalPageLoads;
    return ret;
  };
  imports.wbg.__wbg_type_16f2b8031796512f = function(arg0, arg1) {
    const ret = arg1.type;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_types_10068f549973c623 = function(arg0, arg1) {
    const ret = arg1.types;
    const ptr1 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbg_warn_45a3a6612d9f19fe = function(arg0, arg1) {
    console.warn(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbg_wasmBulkMemory_551502ede47fbf09 = function(arg0) {
    const ret = arg0.wasmBulkMemory;
    return ret;
  };
  imports.wbg.__wbg_wasmExceptions_4f3d6bc9c38eccd4 = function(arg0) {
    const ret = arg0.wasmExceptions;
    return ret;
  };
  imports.wbg.__wbg_wasmSIMD_6e524010ac1b3712 = function(arg0) {
    const ret = arg0.wasmSIMD;
    return ret;
  };
  imports.wbg.__wbg_wasmThreads_bb92f1f17739f197 = function(arg0) {
    const ret = arg0.wasmThreads;
    return ret;
  };
  imports.wbg.__wbg_withWebGL_e7b2f98241b8125a = function(arg0) {
    const ret = arg0.withWebGL;
    return ret;
  };
  imports.wbg.__wbg_write_c3295e1c4c88047e = function(arg0, arg1, arg2) {
    arg0.write(getStringFromWasm0(arg1, arg2));
  };
  imports.wbg.__wbindgen_cb_drop = function(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
      obj.a = 0;
      return true;
    }
    const ret = false;
    return ret;
  };
  imports.wbg.__wbindgen_closure_wrapper580 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 153, __wbg_adapter_26);
    return ret;
  };
  imports.wbg.__wbindgen_closure_wrapper938 = function(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 186, __wbg_adapter_29);
    return ret;
  };
  imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_export_4;
    const offset = table.grow(4);
    table.set(0, void 0);
    table.set(offset + 0, void 0);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
  };
  imports.wbg.__wbindgen_is_function = function(arg0) {
    const ret = typeof arg0 === "function";
    return ret;
  };
  imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = arg0 === void 0;
    return ret;
  };
  imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
    const obj = arg1;
    const ret = JSON.stringify(obj === void 0 ? null : obj);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return ret;
  };
  imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof obj === "number" ? obj : void 0;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
  };
  imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof obj === "string" ? obj : void 0;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  return imports;
}
function __wbg_init_memory(imports, memory) {
}
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedDataViewMemory0 = null;
  cachedUint32ArrayMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
async function __wbg_init(module_or_path) {
  if (wasm !== void 0)
    return wasm;
  if (typeof module_or_path !== "undefined") {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  if (typeof module_or_path === "undefined") {
    module_or_path = new URL("shell_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  __wbg_init_memory(imports);
  const { instance, module } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance, module);
}
var shell_default = __wbg_init;

// src/utils/history_store.ts
var DB_VERSION = 4;
var DB_NAME = "DUCKDB_WASM_SHELL_HISTORY";
var TABLE_LOG_INFO = "LOG_INFO";
var TABLE_LOG_ENTRIES = "LOG_ENTRIES";
var HISTORY_SIZE_SHIFT = 10;
var HistoryStore = class {
  constructor() {
    this._idbFactory = window.indexedDB;
    this._idb = null;
    this._nextEntryKey = 0;
    this._entryCount = 0;
  }
  /// Load entire history
  async load() {
    if (this._entryCount == 0)
      return [[], 0];
    const tx = this._idb.transaction([TABLE_LOG_ENTRIES, TABLE_LOG_INFO], "readwrite");
    const logs = tx.objectStore(TABLE_LOG_ENTRIES);
    const cursor = logs.openCursor();
    return await new Promise((resolve, reject) => {
      const results = [];
      cursor.onsuccess = (event) => {
        const req = event.target;
        if (req.result != null) {
          results.push(req.result.value.input);
          req.result.continue();
        } else {
          resolve([results, Math.min(this._nextEntryKey, 1 << HISTORY_SIZE_SHIFT)]);
        }
      };
      cursor.onerror = reject;
    });
  }
  /// Open the indexeddb database
  async open() {
    await new Promise((resolve, reject) => {
      const req = this._idbFactory.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (ev) => {
        const openReq = ev.target;
        const idb = openReq.result;
        const tx = openReq.transaction;
        this.createSchema(idb);
        tx.oncomplete = () => resolve(idb);
        tx.onerror = (err) => reject(err);
      };
      req.onsuccess = (_) => {
        this._idb = req.result;
        resolve(null);
      };
      req.onerror = (err) => reject(err);
    }).catch((e) => console.warn("Unable to initialize indexedDB, no history persistence"));
    await this.loadMetadata();
  }
  /// Load the log metadata (if persisted)
  async loadMetadata() {
    if (!this._idb)
      return;
    const entry = await new Promise((resolve, _reject) => {
      const tx = this._idb.transaction([TABLE_LOG_INFO]);
      const logInfo = tx.objectStore(TABLE_LOG_INFO);
      const req = logInfo.get(0);
      req.onsuccess = (e) => resolve(e.target.result || null);
      req.onerror = (e) => {
        console.warn(e);
        resolve(null);
      };
    });
    this._nextEntryKey = (entry == null ? void 0 : entry.nextEntryKey) || 0;
    this._entryCount = (entry == null ? void 0 : entry.entryCount) || 0;
  }
  /// Create the store schema
  createSchema(idb) {
    if (idb.objectStoreNames.contains(TABLE_LOG_INFO)) {
      idb.deleteObjectStore(TABLE_LOG_INFO);
    }
    if (idb.objectStoreNames.contains(TABLE_LOG_ENTRIES)) {
      idb.deleteObjectStore(TABLE_LOG_ENTRIES);
    }
    idb.createObjectStore(TABLE_LOG_INFO, {
      keyPath: "key"
    });
    idb.createObjectStore(TABLE_LOG_ENTRIES, {
      keyPath: "key"
    });
  }
  /// Reset the indexeddb
  async reset() {
    var _a;
    (_a = this._idb) == null ? void 0 : _a.close();
    this._idb = null;
    this._idbFactory.deleteDatabase(DB_NAME);
    await this.open();
  }
  /// Push a new entry
  async push(input) {
    if (!this._idb)
      return;
    const entryKey = this._nextEntryKey++ & (1 << HISTORY_SIZE_SHIFT) - 1;
    this._entryCount = Math.min(this._entryCount + 1, 1 << HISTORY_SIZE_SHIFT);
    const tx = this._idb.transaction([TABLE_LOG_ENTRIES, TABLE_LOG_INFO], "readwrite");
    const logInfo = tx.objectStore(TABLE_LOG_INFO);
    const logEntries = tx.objectStore(TABLE_LOG_ENTRIES);
    await Promise.all([
      new Promise((resolve, reject) => {
        const r = logEntries.put({
          key: entryKey,
          when: /* @__PURE__ */ new Date(),
          input
        });
        r.onsuccess = resolve;
        r.onerror = reject;
      }),
      new Promise((resolve, reject) => {
        const r = logInfo.put({
          key: 0,
          nextEntryKey: this._nextEntryKey,
          entryCount: this._entryCount
        });
        r.onsuccess = resolve;
        r.onerror = reject;
      })
    ]);
  }
};

// src/utils/files.ts
import * as duckdb from "@duckdb/duckdb-wasm";
function pickFilesForFileReader(db) {
  return new Promise((resolve, _reject) => {
    const input = document.createElement("input");
    input.type = "file";
    let closed = false;
    const finish = async () => {
      console.log(input.files);
      closed = true;
      const files = input.files;
      for (let i = 0; i < files.length; ++i) {
        const file = files.item(i);
        await db.dropFile(file.name);
        await db.registerFileHandle(file.name, file, duckdb.DuckDBDataProtocol.BROWSER_FILEREADER, true);
      }
      resolve(files.length);
    };
    const deferredFinish = async () => {
      window.removeEventListener("focus", deferredFinish);
      if (closed) {
        return;
      }
      await new Promise((r) => setTimeout(r, 1e3));
      if (!closed) {
        await finish();
      }
    };
    input.onchange = async function() {
      window.removeEventListener("focus", deferredFinish);
      await finish();
    };
    input.onclick = async function() {
      window.addEventListener("focus", deferredFinish);
    };
    input.click();
  });
}
async function pickFiles(db) {
  return await pickFilesForFileReader(db);
}

// src/shell.ts
var hasWebGL = () => {
  if (duckdb2.isSafari()) {
    return false;
  }
  const canvas = document.createElement("canvas");
  const supports = "probablySupportsContext" in canvas ? "probablySupportsContext" : "supportsContext";
  if (supports in canvas) {
    return canvas[supports]("webgl2");
  }
  return "WebGL2RenderingContext" in window;
};
var ShellRuntime = class {
  constructor(container) {
    this.container = container;
    this.database = null;
    this.history = new HistoryStore();
    this.resizeHandler = (_event) => {
      const rect = container.getBoundingClientRect();
      resize(rect.width, rect.height);
    };
    this.hash = "";
  }
  async pickFiles() {
    if (this.database == null) {
      console.warn("database is not initialized");
      return 0;
    }
    return await pickFiles(this.database);
  }
  async downloadFile(name, buffer) {
    const blob = new Blob([buffer]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }
  async readClipboardText() {
    return await navigator.clipboard.readText();
  }
  async writeClipboardText(value) {
    return await navigator.clipboard.writeText(value);
  }
  async pushInputToHistory(value) {
    const encode = encodeURIComponent(extraswaps(value));
    if (this.hash === "")
      this.hash = "queries=v0";
    this.hash += ",";
    this.hash += encode;
    if (window.location.hash.startsWith("#savequeries"))
      window.location.hash = "savequeries&" + this.hash;
    const a = document.getElementById("hashencoded");
    if (a && a instanceof HTMLAnchorElement)
      a.href = "/#" + this.hash;
    this.history.push(value);
  }
};
function formatBytes(value) {
  const [multiple, k, suffix] = [1e3, "k", "B"];
  const exp = Math.log(value) / Math.log(multiple) | 0;
  const size = Number((value / Math.pow(multiple, exp)).toFixed(2));
  return "".concat(size, " ").concat(exp ? "".concat(k, "MGTPEZY")[exp - 1] + suffix : "byte".concat(size !== 1 ? "s" : ""));
}
function extraswaps(input) {
  let res = "";
  for (let i = 0; i < input.length; i++) {
    if (input[i] == " ")
      res += "-";
    else if (input[i] == "-")
      res += " ";
    else if (input[i] == ";")
      res += "~";
    else if (input[i] == "~")
      res += ";";
    else
      res += input[i];
  }
  return res;
}
async function embed2(props) {
  var _a, _b;
  await shell_default(props.shellModule);
  const runtime = new ShellRuntime(props.container);
  embed(props.container, runtime, {
    fontFamily: (_a = props.fontFamily) != null ? _a : "monospace",
    backgroundColor: (_b = props.backgroundColor) != null ? _b : "#333",
    withWebGL: hasWebGL()
  });
  props.container.onresize = runtime.resizeHandler;
  const TERM_BOLD = "\x1B[1m";
  const TERM_NORMAL = "\x1B[m";
  const TERM_CLEAR = "\x1B[2K\r";
  const progressHandler = (progress) => {
    if (progress.bytesTotal > 0) {
      const blocks = Math.max(Math.min(Math.floor(progress.bytesLoaded / progress.bytesTotal * 10), 10), 0);
      const bar = "".concat("#".repeat(blocks)).concat("-".repeat(10 - blocks));
      write("".concat(TERM_CLEAR).concat(TERM_BOLD, "[ RUN ]").concat(TERM_NORMAL, " Loading ").concat(bar));
    } else {
      write("".concat(TERM_CLEAR).concat(TERM_BOLD, "[ RUN ]").concat(TERM_NORMAL, " Loading ").concat(formatBytes(progress.bytesLoaded)));
    }
  };
  writeln("".concat(TERM_BOLD, "[ RUN ]").concat(TERM_NORMAL, " Instantiating DuckDB"));
  runtime.database = await props.resolveDatabase(progressHandler);
  writeln("".concat(TERM_CLEAR).concat(TERM_BOLD, "[ OK  ]").concat(TERM_NORMAL, " Instantiating DuckDB"));
  const step = async (label, work) => {
    writeln("".concat(TERM_BOLD, "[ RUN ]").concat(TERM_NORMAL, " ").concat(label));
    await work();
    writeln("".concat(TERM_BOLD, "[ OK  ]").concat(TERM_NORMAL, " ").concat(label));
  };
  await step("Loading Shell History", async () => {
    await runtime.history.open();
    const [hist, histCursor] = await runtime.history.load();
    loadHistory(hist, histCursor);
  });
  await step("Attaching Shell", async () => {
    configureDatabase(runtime.database);
  });
  const hash = window.location.hash;
  const splits = hash.split(",");
  const sqls = [];
  for (let i = 1; i < splits.length; i++) {
    sqls.push(extraswaps(decodeURIComponent(splits[i])));
  }
  await step("Rewinding history!", async () => {
    passInitQueries(sqls);
  });
}

// src/platform.ts
function getJsDelivrModule() {
  const jsdelivr_dist_url = "https://cdn.jsdelivr.net/npm/".concat(PACKAGE_NAME, "@").concat(PACKAGE_VERSION, "/dist/");
  return new URL("".concat(jsdelivr_dist_url, "dist/shell_bg.wasm"));
}
export {
  PACKAGE_NAME,
  PACKAGE_VERSION,
  PACKAGE_VERSION_MAJOR,
  PACKAGE_VERSION_MINOR,
  PACKAGE_VERSION_PATCH,
  embed2 as embed,
  getJsDelivrModule
};
//# sourceMappingURL=shell.mjs.map
