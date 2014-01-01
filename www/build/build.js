
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("jb55-domready/index.js", Function("exports, require, module",
"/*!\n\
  * domready (c) Dustin Diaz 2012 - License MIT\n\
  */\n\
!function (name, definition) {\n\
  if (typeof module != 'undefined') module.exports = definition()\n\
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)\n\
  else this[name] = definition()\n\
}('domready', function (ready) {\n\
\n\
  var fns = [], fn, f = false\n\
    , doc = document\n\
    , testEl = doc.documentElement\n\
    , hack = testEl.doScroll\n\
    , domContentLoaded = 'DOMContentLoaded'\n\
    , addEventListener = 'addEventListener'\n\
    , onreadystatechange = 'onreadystatechange'\n\
    , readyState = 'readyState'\n\
    , loaded = /^loade|c/.test(doc[readyState])\n\
\n\
  function flush(f) {\n\
    loaded = 1\n\
    while (f = fns.shift()) f()\n\
  }\n\
\n\
  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {\n\
    doc.removeEventListener(domContentLoaded, fn, f)\n\
    flush()\n\
  }, f)\n\
\n\
\n\
  hack && doc.attachEvent(onreadystatechange, fn = function () {\n\
    if (/^c/.test(doc[readyState])) {\n\
      doc.detachEvent(onreadystatechange, fn)\n\
      flush()\n\
    }\n\
  })\n\
\n\
  return (ready = hack ?\n\
    function (fn) {\n\
      self != top ?\n\
        loaded ? fn() : fns.push(fn) :\n\
        function () {\n\
          try {\n\
            testEl.doScroll('left')\n\
          } catch (e) {\n\
            return setTimeout(function() { ready(fn) }, 50)\n\
          }\n\
          fn()\n\
        }()\n\
    } :\n\
    function (fn) {\n\
      loaded ? fn() : fns.push(fn)\n\
    })\n\
})//@ sourceURL=jb55-domready/index.js"
));
require.register("boot/index.js", Function("exports, require, module",
"/* jshint indent:2, devel:true */\n\
\n\
(function () {\n\
\n\
  \"use strict\";\n\
\n\
  /*\n\
   * Licensed to the Apache Software Foundation (ASF) under one\n\
   * or more contributor license agreements.  See the NOTICE file\n\
   * distributed with this work for additional information\n\
   * regarding copyright ownership.  The ASF licenses this file\n\
   * to you under the Apache License, Version 2.0 (the\n\
   * \"License\"); you may not use this file except in compliance\n\
   * with the License.  You may obtain a copy of the License at\n\
   *\n\
   * http://www.apache.org/licenses/LICENSE-2.0\n\
   *\n\
   * Unless required by applicable law or agreed to in writing,\n\
   * software distributed under the License is distributed on an\n\
   * \"AS IS\" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\n\
   * KIND, either express or implied.  See the License for the\n\
   * specific language governing permissions and limitations\n\
   * under the License.\n\
   */\n\
\n\
  window.APP = {\n\
    // Application Constructor\n\
    initialize: function() {\n\
      this.bindEvents();\n\
    },\n\
\n\
    // Bind Event Listeners\n\
    //\n\
    // Bind any events that are required on startup. Common events are:\n\
    // 'load', 'deviceready', 'offline', and 'online'.\n\
    bindEvents: function() {\n\
      // on local development, we use dom event\n\
      if(document.location.port === '7000') {\n\
        require('domready')(this.onDeviceReady);\n\
      }\n\
      else {\n\
        document.addEventListener('deviceready', this.onDeviceReady, false);\n\
      }\n\
    },\n\
\n\
\n\
    // deviceready Event Handler\n\
    //\n\
    // The scope of 'this' is the event. In order to call the 'receivedEvent'\n\
    // function, we must explicity call 'app.receivedEvent(...);'\n\
    onDeviceReady: function() {\n\
      window.APP.receivedEvent('deviceready');\n\
    },\n\
\n\
\n\
    // Update DOM on a Received Event\n\
    receivedEvent: function(id) {\n\
      var parentElement = document.getElementById(id);\n\
      var listeningElement = parentElement.querySelector('.listening');\n\
      var receivedElement = parentElement.querySelector('.received');\n\
\n\
      listeningElement.setAttribute('style', 'display:none;');\n\
      receivedElement.setAttribute('style', 'display:block;');\n\
\n\
      console.log('Received Event: ' + id);\n\
    }\n\
  };\n\
\n\
  // make it rain!\n\
  window.APP.initialize();\n\
\n\
}());\n\
//@ sourceURL=boot/index.js"
));
require.alias("boot/index.js", "clockz/deps/boot/index.js");
require.alias("boot/index.js", "clockz/deps/boot/index.js");
require.alias("boot/index.js", "boot/index.js");
require.alias("jb55-domready/index.js", "boot/deps/domready/index.js");

require.alias("boot/index.js", "boot/index.js");