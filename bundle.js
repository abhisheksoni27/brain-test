(function () {
  var socket = document.createElement('script')
  var script = document.createElement('script')
  socket.setAttribute('src', 'http://localhost:3001/socket.io/socket.io.js')
  script.type = 'text/javascript'

  socket.onload = function () {
    document.head.appendChild(script)
  }
  script.text = ['window.socket = io("http://localhost:3001");',
  'socket.on("bundle", function() {',
  'console.log("livereaload triggered")',
  'window.location.reload();});'].join('\n')
  document.head.appendChild(socket)
}());
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const data = [{
  input: [
    0, 0
  ],
  output: [0]
}, {
  input: [
    0, 1
  ],
  output: [1]
}, {
  input: [
    1, 0
  ],
  output: [1]
}, {
  input: [
    1, 1
  ],
  output: [0]
}];
require('brain.js');
require('gpu.js');

// // // var canvas = document.createElement('canvas');

// // function specialLogger() {
// //   out.innerHTML = arguments[0];
// // }

// // // function add(m, n) {
// // //   return m + n;
// // // }

// function matMult(m, n) {

//   var result = [];
//   for (var i = 0; i < m.length; i++) {
//     result[i] = [];
//     for (var j = 0; j < n[0].length; j++) {
//       var sum = 0;
//       for (var k = 0; k < m[0].length; k++) {
//         sum += m[i][k] * n[k][j];
//       }
//       result[i][j] = sum;
//     }
//   }
//   return result;
// }


// function multiply(m, n, x, y) {
//   var sum = 0;
//   for (var i = 0; i < 4; i++) {
//     sum += m[x][i] * n[i][y];
//   }
//   return sum;
// }


// // function square(a) {
// //   return a * a;
// // }

// // var A = [
// //   [1, 1, 1]
// // ];

// // var B = [
// //   [
// //     1, 1, 1
// //   ],
// //   [
// //     1, 1, 1
// //   ],
// //   [1, 1, 1]
// // ];

// const dimension = 1024  * 8;

// const A = [
//   [...Array(dimension).fill(Math.random())]
// ];

// const B = new Array(dimension);

// for(i=0; i<dimension;i++){
//   B[i]=[...Array(dimension).fill(Math.random())];
// }


gpu = new GPU({
  mode: 'gpu'
});


// const kernel = gpu.createKernelMap([
//   multiply
// ], function (a, b) {
//   return multiply(a, b, this.thread.x, this.thread.y);
// }).setDimensions([A.length, B.length]);

// const start = new Date().getTime();
// const result = kernel(A, B);
// const end = new Date().getTime();
// console.log(end - start + 'ms');

// // const start = new Date().getTime();
// // const result = matMult(A, B);
// // const end = new Date().getTime();
// // console.log(end - start + 'ms')

net = new brain.NeuralNetworkGPU();
net.train(data, {log:true});
console.log(net.error);
// for(let i = 0; i<data.length; i++){
  // console.log(Math.round(net.run(data[i].input)));
// }

// // // const A = [1, 2, 3, 4, 5];
// // // const B = [1, 2, 3, 4, 5];
// // // function add(m, n) {
// // //   return m + n;
// // // }

// // // function multiply(m, n) {
// // //   return m * n;
// // // }

// // // const kernels = gpu.createKernelMap(
// // // [add,multiply]
// // // , function (a, b) {
// // //   return multiply(add(a[this.thread.x], b[this.thread.x]), a[this.thread.x]);
// // // }, {outputToTexture: true}).setDimensions([A.length]);

// // // const result = kernels(A, B);
// // // console.log(result);
// // // const textureResult = result.addResult;
// // // const readTexture = gpu.createKernel(function (texture) {
// // //   return texture[this.thread.z][this.thread.y][this.thread.x];
// // // }).setDimensions(textureResult.dimensions);

// // // console.log(result.result);
// // // console.log(readTexture(result.result));
// // // console.log(textureResult.toArray(gpu));

// const render = gpu.createKernel(function() {
//     this.color(0.4, 0.5, 0.7, 1);
// })
//   .setDimensions([200, 200])
//   .setGraphical(true);
    
// render();

// const canvas = render.getCanvas();
// document.getElementsByTagName('body')[0].appendChild(canvas);
},{"brain.js":45,"gpu.js":71}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testPartition = testPartition;
exports.shuffleArray = shuffleArray;
exports.default = crossValidate;
/**
 *
 * @param {NeuralNetwork|constructor} Classifier
 * @param {object} opts
 * @param {object} trainOpts
 * @param {object} trainSet
 * @param {object} testSet
 * @returns {void|*}
 */
function testPartition(Classifier, opts, trainOpts, trainSet, testSet) {
  var classifier = new Classifier(opts);
  var beginTrain = Date.now();
  var trainingStats = classifier.train(trainSet, trainOpts);
  var beginTest = Date.now();
  var testStats = classifier.test(testSet);
  var endTest = Date.now();
  var stats = Object.assign({}, testStats, {
    trainTime: beginTest - beginTrain,
    testTime: endTest - beginTest,
    iterations: trainingStats.iterations,
    trainError: trainingStats.error,
    learningRate: trainOpts.learningRate,
    hidden: classifier.hiddenSizes,
    network: classifier.toJSON()
  });

  return stats;
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * source: http://stackoverflow.com/a/12646864/1324039
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 *
 * @param {NeuralNetwork|constructor} Classifier
 * @param {object} data
 * @param {object} opts
 * @param {object} trainOpts
 * @param {number} k
 * @returns {
 *  {
 *    avgs: {
 *      error: number,
 *      trainTime: number,
 *      testTime: number,
 *      iterations: number,
 *      trainError: number
 *    },
 *    stats: {
 *      truePos: number,
 *      trueNeg: number,
 *      falsePos: number,
 *      falseNeg: number,
 *      total: number
 *    },
 *    sets: Array,
 *    misclasses: Array
 *  }
 * }
 */
function crossValidate(Classifier, data, opts, trainOpts, k) {
  k = k || 4;
  var size = data.length / k;

  if (data.constructor === Array) {
    shuffleArray(data);
  } else {
    var newData = {};
    shuffleArray(Object.keys(data)).forEach(function (key) {
      newData[key] = data[key];
    });
    data = newData;
  }

  var avgs = {
    error: 0,
    trainTime: 0,
    testTime: 0,
    iterations: 0,
    trainError: 0
  };

  var stats = {
    truePos: 0,
    trueNeg: 0,
    falsePos: 0,
    falseNeg: 0,
    total: 0
  };

  var misclasses = [];
  var results = [];
  var stat = void 0;
  var sum = void 0;

  for (var i = 0; i < k; i++) {
    var dclone = data.slice(0);
    var testSet = dclone.splice(i * size, size);
    var trainSet = dclone;
    var result = testPartition(Classifier, opts, trainOpts, trainSet, testSet);
    for (stat in avgs) {
      if (stat in avgs) {
        sum = avgs[stat];
        avgs[stat] = sum + result[stat];
      }
    }

    for (stat in stats) {
      if (stat in stats) {
        sum = stats[stat];
        stats[stat] = sum + result[stat];
      }
    }

    misclasses.concat(results.misclasses);

    results.push(result);
  }

  for (stat in avgs) {
    if (stat in avgs) {
      sum = avgs[stat];
      avgs[stat] = sum / k;
    }
  }

  stats.precision = stats.truePos / (stats.truePos + stats.falsePos);
  stats.recall = stats.truePos / (stats.truePos + stats.falseNeg);
  stats.accuracy = (stats.trueNeg + stats.truePos) / stats.total;

  stats.testSize = size;
  stats.trainSize = data.length - size;

  return {
    avgs: avgs,
    stats: stats,
    sets: results,
    misclasses: misclasses
  };
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = likely;
/**
 *
 * @param {*} input
 * @param {NeuralNetwork} net
 * @returns {*}
 */
function likely(input, net) {
  var output = net.run(input);
  var maxProp = null;
  var maxValue = -1;
  for (var prop in output) {
    var value = output[prop];
    if (value > maxValue) {
      maxProp = prop;
      maxValue = value;
    }
  }
  return maxProp;
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Functions for turning sparse hashes into arrays and vice versa */
var lookup = function () {
  function lookup() {
    _classCallCheck(this, lookup);
  }

  _createClass(lookup, null, [{
    key: "buildLookup",

    /**
     * Performs `[{a: 1}, {b: 6, c: 7}] -> {a: 0, b: 1, c: 2}`
     * @param {Object} hashes
     * @returns {Object}
     */
    value: function buildLookup(hashes) {
      var hash = hashes.reduce(function (memo, hash) {
        return Object.assign(memo, hash);
      }, {});

      return lookup.lookupFromHash(hash);
    }

    /**
     * performs `{a: 6, b: 7} -> {a: 0, b: 1}`
     * @param {Object} hash
     * @returns {Object}
     */

  }, {
    key: "lookupFromHash",
    value: function lookupFromHash(hash) {
      var lookup = {};
      var index = 0;
      for (var i in hash) {
        lookup[i] = index++;
      }
      return lookup;
    }

    /**
     * performs `{a: 0, b: 1}, {a: 6} -> [6, 0]`
     * @param {*} lookup
     * @param {*} hash
     * @returns {Array}
     */

  }, {
    key: "toArray",
    value: function toArray(lookup, hash) {
      var array = [];
      for (var i in lookup) {
        array[lookup[i]] = hash[i] || 0;
      }
      return array;
    }

    /**
     * performs `{a: 0, b: 1}, [6, 7] -> {a: 6, b: 7}`
     * @param {Object} lookup
     * @param {Array} array
     * @returns {Object}
     */

  }, {
    key: "toHash",
    value: function toHash(lookup, array) {
      var hash = {};
      for (var i in lookup) {
        hash[i] = array[lookup[i]];
      }
      return hash;
    }

    /**
     *
     * @param {Array} array
     * @returns {*}
     */

  }, {
    key: "lookupFromArray",
    value: function lookupFromArray(array) {
      var lookup = {};
      var z = 0;
      var i = array.length;
      while (i-- > 0) {
        lookup[array[i]] = z++;
      }
      return lookup;
    }
  }]);

  return lookup;
}();

exports.default = lookup;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lookup = require('./lookup');

var _lookup2 = _interopRequireDefault(_lookup);

var _trainStream = require('./train-stream');

var _trainStream2 = _interopRequireDefault(_trainStream);

var _max = require('./utilities/max');

var _max2 = _interopRequireDefault(_max);

var _mse = require('./utilities/mse');

var _mse2 = _interopRequireDefault(_mse);

var _randos = require('./utilities/randos');

var _randos2 = _interopRequireDefault(_randos);

var _range = require('./utilities/range');

var _range2 = _interopRequireDefault(_range);

var _toArray = require('./utilities/to-array');

var _toArray2 = _interopRequireDefault(_toArray);

var _zeros = require('./utilities/zeros');

var _zeros2 = _interopRequireDefault(_zeros);

var _gpu = require('gpu.js');

var _gpu2 = _interopRequireDefault(_gpu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @param {object} options
 * @constructor
 */
var NeuralNetworkGPU = function () {
  function NeuralNetworkGPU() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, NeuralNetworkGPU);

    Object.assign(this, NeuralNetworkGPU.defaults, options);
    this.hiddenSizes = options.hiddenLayers;
    this.layers = null;
    this.sizes = null;
    this.outputLayer = null;
    this.biases = null; // weights for bias nodes
    this.weights = null;
    this.outputs = null;

    this.forwardPropagate = [];
    this.backwardPropagate = [];
    this.changesPropagate = [];
    this.weightsPropagate = [];
    this.biasesPropagate = [];
    this.weightsToFloat = [];
    this.megaKernel = [];
    // state for training
    this.deltas = null;
    this.changes = null; // for momentum
    this.errors = null;
    this.count = 0;
    this.error = 1;
    this.logCount = 200;
    this.gpu = new _gpu2.default({ mode: 'gpu' });
  }

  /**
   *
   * @param {} sizes
   * @param {Boolean} keepNetworkIntact
   */


  _createClass(NeuralNetworkGPU, [{
    key: 'initialize',
    value: function initialize(sizes, keepNetworkIntact) {
      this.sizes = sizes;
      this.outputLayer = this.sizes.length - 1;

      if (!keepNetworkIntact) {
        this.biases = []; // weights for bias nodes
        this.weights = [];
        this.outputs = [];
      }

      // state for training
      this.changes = []; // for momentum
      this.deltas = [];
      this.errors = [];

      for (var layer = 0; layer <= this.outputLayer; layer++) {
        var _size = this.sizes[layer];
        this.deltas[layer] = (0, _zeros2.default)(_size);
        this.errors[layer] = (0, _zeros2.default)(_size);
        if (!keepNetworkIntact) {
          this.outputs[layer] = (0, _zeros2.default)(_size);
        }

        if (layer > 0) {
          this.biases[layer] = (0, _randos2.default)(_size);

          if (!keepNetworkIntact) {
            this.weights[layer] = new Array(_size);
          }
          this.changes[layer] = new Array(_size);

          for (var node = 0; node < _size; node++) {
            var prevSize = this.sizes[layer - 1];
            if (!keepNetworkIntact) {
              this.weights[layer][node] = (0, _randos2.default)(prevSize);
            }
            this.changes[layer][node] = (0, _zeros2.default)(prevSize);
          }
        }
      }
      this.buildRunInput();
      this.buildCalculateDeltas();
      this.buildGetChanges();
      this.buildChangeBiases();
    }

    /**
     *
     * @param data
     * @param options
     * @returns {{error: number, iterations: number}}
     */

  }, {
    key: 'train',
    value: function train(data) {
      var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var options = Object.assign({}, NeuralNetworkGPU.trainDefaults, _options);
      data = this.formatData(data);
      var iterations = options.iterations;
      var errorThresh = options.errorThresh;
      var log = options.log === true ? console.log : options.log;
      var logPeriod = options.logPeriod;
      var learningRate = _options.learningRate || this.learningRate || options.learningRate;
      var callback = options.callback;
      var callbackPeriod = options.callbackPeriod;
      var sizes = [];
      var inputSize = data[0].input.length;
      var outputSize = data[0].output.length;
      var hiddenSizes = this.hiddenSizes;
      if (!hiddenSizes) {
        sizes.push(Math.max(3, Math.floor(inputSize / 2)));
      } else {
        hiddenSizes.forEach(function (size) {
          sizes.push(size);
        });
      }

      sizes.unshift(inputSize);

      sizes.push(outputSize);

      this.initialize(sizes, options.keepNetworkIntact);

      var error = 1;
      var i = void 0;
      for (i = 1; i < iterations && error > errorThresh; i++) {
        this.count++;
        var sum = 0;
        for (var j = 0; j < data.length; j++) {
          var err = this.trainPattern(data[j].input, data[j].output, learningRate);
          sum += err;
        }

        error = sum / data.length;

        if (log && i % this.logCount == 0 || log && i == 1) {
          log('iterations:', i, 'training error:', error);
        }
        if (callback && i % callbackPeriod == 0) {
          callback({ error: error, iterations: i });
        }

        this.error = error;
      }
      return {
        error: error,
        iterations: i
      };
    }

    /**
     *
     * @param input
     * @param target
     * @param learningRate
     */

  }, {
    key: 'trainPattern',
    value: function trainPattern(input, target, learningRate) {
      learningRate = learningRate || this.learningRate;
      // forward propagate
      this.runInput(input);

      // backward propagate
      this.calculateDeltas(target);
      this.getChanges(learningRate);
      this.changeBiases(learningRate);

      if (this.count % this.logCount == 0 || this.count == 1 || this.iterations == this.count) {
        for (var i = 0; i < this.errors.length; i++) {
          this.errors[i] = this.errors[i].toArray ? this.errors[i].toArray(this.gpu) : this.errors[i];
        }
        var error = this.error = (0, _mse2.default)(this.errors[this.outputLayer]);
        return error;
      } else {
        return this.error;
      }
    }
  }, {
    key: 'buildRunInput',
    value: function buildRunInput() {
      function weightedSum(weights, biases, x, inputs) {
        var sum = biases[x];
        for (var k = 0; k < size; k++) {
          sum += weights[x][k] * inputs[k];
        }
        return 1 / (1 + Math.exp(-sum));
      }

      for (var layer = 1; layer <= this.outputLayer; layer++) {
        var kernel = this.gpu.createKernelMap({ weightedSum: weightedSum }, function (weights, biases, inputs) {
          return weightedSum(weights, biases, this.thread.x, inputs);
        }, {
          constants: {
            size: this.sizes[layer - 1]
          }
        }).setDimensions([this.sizes[layer]]).setOutputToTexture(true);
        this.forwardPropagate[layer] = kernel;
      }
    }

    /**
     *
     * @param input
     * @returns {*}
     */

  }, {
    key: 'runInput',
    value: function runInput(input) {
      var output = void 0;
      this.outputs[0] = input;
      for (var layer = 1; layer <= this.outputLayer; layer++) {
        this.outputs[layer] = this.forwardPropagate[layer](this.weights[layer], this.biases[layer], input).result;

        output = input = this.outputs[layer];
      }
      // console.log(this.outputs[2], 'Outputs')
      return output;
    }
  }, {
    key: 'buildCalculateDeltas',
    value: function buildCalculateDeltas(target) {

      function calcError(outputs, target) {
        return target[this.thread.x] - outputs;
      }

      function calcDeltas(error, output) {
        return error * output * (1 - output);
      }

      function calcErrorOutput(nextWeights, nextDeltas) {
        var error = 0;
        for (var k = 0; k < size; k++) {
          error += nextDeltas[k] * nextWeights[k][this.thread.x];
        }
        return error;
      }

      for (var layer = this.outputLayer; layer > 0; layer--) {
        if (layer == this.outputLayer) {
          var kernel = this.gpu.createKernelMap({
            error: calcError,
            deltas: calcDeltas
          }, function (outputs, target) {
            var output = outputs[this.thread.x];
            return calcDeltas(calcError(output, target), output);
          }).setDimensions([this.sizes[layer]]).setOutputToTexture(true);

          this.backwardPropagate[layer] = kernel;
        } else {
          var _kernel = this.gpu.createKernelMap({
            error: calcErrorOutput,
            deltas: calcDeltas
          }, function (nextWeights, outputs, nextDeltas) {
            var output = outputs[this.thread.x];
            return calcDeltas(calcErrorOutput(nextWeights, nextDeltas), output);
          }, {
            constants: {
              size: this.deltas[layer + 1].length
            }
          }).setDimensions([this.sizes[layer]]).setOutputToTexture(true);

          this.backwardPropagate[layer] = _kernel;
        }
      }
    }
  }, {
    key: 'calculateDeltas',
    value: function calculateDeltas(target, learningRate) {
      for (var layer = this.outputLayer; layer > 0; layer--) {
        var output = void 0;
        if (layer == this.outputLayer) {
          output = this.backwardPropagate[layer](this.outputs[layer], target);
        } else {
          output = this.backwardPropagate[layer](this.weights[layer + 1], this.outputs[layer], this.deltas[layer + 1]);
        }

        this.deltas[layer] = output.result;
        this.errors[layer] = output.error;
      }
      // console.log(this.errors[2], 'errors');
      // console.log(this.deltas[2], 'deltas');
    }
  }, {
    key: 'buildGetChanges',
    value: function buildGetChanges() {
      function calcChanges(previousChange, deltas, previousOutputs, learningRate, momentum, x, y) {
        var sum = 0;
        for (var i = 0; i < size; i++) {
          sum += learningRate * deltas * previousOutputs[x] + momentum * previousChange[y][i];
        }
        return sum;
      }

      function addWeights(change, weights, x, y) {
        return change + weights[y][x];
      }

      for (var layer = 1; layer <= this.outputLayer; layer++) {
        var kernel = this.gpu.createKernelMap({ addWeights: addWeights, calcChanges: calcChanges }, function (previousOutputs, deltas, weights, changes, learningRate, momentum) {
          var delta = deltas[this.thread.y];
          var change = calcChanges(changes, delta, previousOutputs, learningRate, momentum, this.thread.x, this.thread.y);

          return addWeights(change, weights, this.thread.x, this.thread.y);
        }, {
          constants: {
            size: this.outputs[layer - 1].length
          }
        }).setDimensions([this.sizes[layer - 1], this.sizes[layer]]).setOutputToTexture(true);

        this.changesPropagate[layer] = kernel;
      }
    }
  }, {
    key: 'getChanges',
    value: function getChanges(learningRate) {
      for (var layer = 1; layer <= this.outputLayer; layer++) {
        var output = this.changesPropagate[layer](this.outputs[layer - 1], this.deltas[layer], this.weights[layer], this.changes[layer], learningRate, this.momentum);

        this.changes[layer] = output.calcChanges;
        this.weights[layer] = output.result;
      }
      // console.log(this.weights[1][0], 'weights');
      // console.log(this.changes[1][0], 'changes');
    }
  }, {
    key: 'buildChangeBiases',
    value: function buildChangeBiases() {
      function addBiases(biases, deltas, learningRate, x) {
        return biases[x] + deltas[x] * learningRate;
      }

      for (var layer = 1; layer <= this.outputLayer; layer++) {
        var kernel = this.gpu.createKernelMap({
          addBiases: addBiases
        }, function (biases, deltas, learningRate) {
          return addBiases(biases, deltas, learningRate, this.thread.x);
        }).setDimensions([this.sizes[layer]]).setOutputToTexture(true);

        this.biasesPropagate[layer] = kernel;
      }
    }
  }, {
    key: 'changeBiases',
    value: function changeBiases(learningRate) {
      for (var layer = 1; layer <= this.outputLayer; layer++) {
        var output = this.biasesPropagate[layer](this.biases[layer], this.deltas[layer], learningRate);
        this.biases[layer] = output.result;
      }
      // console.log(this.biases[2], 'biases')
    }

    /**
     *
     * @param input
     * @returns {*}
     */

  }, {
    key: 'run',
    value: function run(input) {
      if (this.inputLookup) {
        input = _lookup2.default.toArray(this.inputLookup, input);
      }
      var output = this.runInput(input);

      if (this.outputLookup) {
        output = _lookup2.default.toHash(this.outputLookup, output);
      }
      return output;
    }

    /**
     *
     * @param data
     * @returns {*}
     */

  }, {
    key: 'formatData',
    value: function formatData(data) {
      var _this = this;

      if (data.constructor !== Array) {
        // turn stream datum into array
        var tmp = [];
        tmp.push(data);
        data = tmp;
      }
      // turn sparse hash input into arrays with 0s as filler
      var datum = data[0].input;
      if (datum.constructor !== Array && !(datum instanceof Float64Array)) {
        if (!this.inputLookup) {
          this.inputLookup = _lookup2.default.buildLookup(data.map(function (value) {
            return value['input'];
          }));
        }
        data = data.map(function (datum) {
          var array = _lookup2.default.toArray(_this.inputLookup, datum.input);
          return Object.assign({}, datum, { input: array });
        }, this);
      }

      if (data[0].output.constructor !== Array) {
        if (!this.outputLookup) {
          this.outputLookup = _lookup2.default.buildLookup(data.map(function (value) {
            return value['output'];
          }));
        }
        data = data.map(function (datum) {
          var array = _lookup2.default.toArray(_this.outputLookup, datum.output);
          return Object.assign({}, datum, { output: array });
        }, this);
      }
      return data;
    }
  }]);

  return NeuralNetworkGPU;
}();

exports.default = NeuralNetworkGPU;


NeuralNetworkGPU.trainDefaults = {
  iterations: 20000,
  errorThresh: 0.005,
  log: false,
  logPeriod: 10,
  learningRate: 0.3,
  callback: null,
  callbackPeriod: 10,
  keepNetworkIntact: false
};

NeuralNetworkGPU.defaults = {
  learningRate: 0.3,
  momentum: 0.1,
  binaryThresh: 0.5,
  hiddenLayers: null
};

},{"./lookup":4,"./train-stream":34,"./utilities/max":36,"./utilities/mse":37,"./utilities/randos":41,"./utilities/range":42,"./utilities/to-array":43,"./utilities/zeros":44,"gpu.js":71}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lookup = require('./lookup');

var _lookup2 = _interopRequireDefault(_lookup);

var _trainStream = require('./train-stream');

var _trainStream2 = _interopRequireDefault(_trainStream);

var _max = require('./utilities/max');

var _max2 = _interopRequireDefault(_max);

var _mse = require('./utilities/mse');

var _mse2 = _interopRequireDefault(_mse);

var _randos = require('./utilities/randos');

var _randos2 = _interopRequireDefault(_randos);

var _range = require('./utilities/range');

var _range2 = _interopRequireDefault(_range);

var _toArray = require('./utilities/to-array');

var _toArray2 = _interopRequireDefault(_toArray);

var _zeros = require('./utilities/zeros');

var _zeros2 = _interopRequireDefault(_zeros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @param {object} options
 * @constructor
 */
var NeuralNetwork = function () {
  function NeuralNetwork() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, NeuralNetwork);

    Object.assign(this, NeuralNetwork.defaults, options);
    this.hiddenSizes = options.hiddenLayers;

    this.sizes = null;
    this.outputLayer = null;
    this.biases = null; // weights for bias nodes
    this.weights = null;
    this.outputs = null;

    // state for training
    this.deltas = null;
    this.changes = null; // for momentum
    this.errors = null;
  }

  /**
   *
   * @param {} sizes
   * @param {Boolean} keepNetworkIntact
   */


  _createClass(NeuralNetwork, [{
    key: 'initialize',
    value: function initialize(sizes, keepNetworkIntact) {
      this.sizes = sizes;
      this.outputLayer = this.sizes.length - 1;

      if (!keepNetworkIntact) {
        this.biases = []; // weights for bias nodes
        this.weights = [];
        this.outputs = [];
      }

      // state for training
      this.deltas = [];
      this.changes = []; // for momentum
      this.errors = [];

      for (var layer = 0; layer <= this.outputLayer; layer++) {
        var size = this.sizes[layer];
        this.deltas[layer] = (0, _zeros2.default)(size);
        this.errors[layer] = (0, _zeros2.default)(size);
        if (!keepNetworkIntact) {
          this.outputs[layer] = (0, _zeros2.default)(size);
        }

        if (layer > 0) {
          this.biases[layer] = (0, _randos2.default)(size);
          if (!keepNetworkIntact) {
            this.weights[layer] = new Array(size);
          }
          this.changes[layer] = new Array(size);

          for (var node = 0; node < size; node++) {
            var prevSize = this.sizes[layer - 1];
            if (!keepNetworkIntact) {
              this.weights[layer][node] = (0, _randos2.default)(prevSize);
            }
            this.changes[layer][node] = (0, _zeros2.default)(prevSize);
          }
        }
      }
    }

    /**
     *
     * @param input
     * @returns {*}
     */

  }, {
    key: 'run',
    value: function run(input) {
      if (this.inputLookup) {
        input = _lookup2.default.toArray(this.inputLookup, input);
      }

      var output = this.runInput(input);

      if (this.outputLookup) {
        output = _lookup2.default.toHash(this.outputLookup, output);
      }
      return output;
    }

    /**
     *
     * @param input
     * @returns {*}
     */

  }, {
    key: 'runInput',
    value: function runInput(input) {
      this.outputs[0] = input; // set output state of input layer

      var output = null;
      for (var layer = 1; layer <= this.outputLayer; layer++) {
        for (var node = 0; node < this.sizes[layer]; node++) {
          var weights = this.weights[layer][node];

          var sum = this.biases[layer][node];
          for (var k = 0; k < weights.length; k++) {
            sum += weights[k] * input[k];
          }
          this.outputs[layer][node] = 1 / (1 + Math.exp(-sum));
        }
        output = input = this.outputs[layer];
      }
      return output;
    }

    /**
     *
     * @param data
     * @param options
     * @returns {{error: number, iterations: number}}
     */

  }, {
    key: 'train',
    value: function train(data) {
      var _options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var options = Object.assign({}, NeuralNetwork.trainDefaults, _options);
      data = this.formatData(data);
      var iterations = options.iterations;
      var errorThresh = options.errorThresh;
      var log = options.log === true ? console.log : options.log;
      var logPeriod = options.logPeriod;
      var learningRate = _options.learningRate || this.learningRate || options.learningRate;
      var callback = options.callback;
      var callbackPeriod = options.callbackPeriod;
      var sizes = [];
      var inputSize = data[0].input.length;
      var outputSize = data[0].output.length;
      var hiddenSizes = this.hiddenSizes;
      if (!hiddenSizes) {
        sizes.push(Math.max(3, Math.floor(inputSize / 2)));
      } else {
        hiddenSizes.forEach(function (size) {
          sizes.push(size);
        });
      }

      sizes.unshift(inputSize);
      sizes.push(outputSize);

      this.initialize(sizes, options.keepNetworkIntact);

      var error = 1;
      var i = void 0;
      for (i = 0; i < iterations && error > errorThresh; i++) {
        var sum = 0;
        for (var j = 0; j < data.length; j++) {
          var err = this.trainPattern(data[j].input, data[j].output, learningRate);
          sum += err;
        }
        error = sum / data.length;

        if (log && i % logPeriod == 0) {
          log('iterations:', i, 'training error:', error);
        }
        if (callback && i % callbackPeriod == 0) {
          callback({ error: error, iterations: i });
        }
      }

      return {
        error: error,
        iterations: i
      };
    }

    /**
     *
     * @param input
     * @param target
     * @param learningRate
     */

  }, {
    key: 'trainPattern',
    value: function trainPattern(input, target, learningRate) {
      learningRate = learningRate || this.learningRate;

      // forward propagate
      this.runInput(input);

      // back propagate
      this.calculateDeltas(target);
      this.adjustWeights(learningRate);

      var error = (0, _mse2.default)(this.errors[this.outputLayer]);
      return error;
    }

    /**
     *
     * @param target
     */

  }, {
    key: 'calculateDeltas',
    value: function calculateDeltas(target) {
      for (var layer = this.outputLayer; layer >= 0; layer--) {
        for (var node = 0; node < this.sizes[layer]; node++) {
          var output = this.outputs[layer][node];

          var error = 0;
          if (layer == this.outputLayer) {
            error = target[node] - output;
          } else {
            var deltas = this.deltas[layer + 1];
            for (var k = 0; k < deltas.length; k++) {
              error += deltas[k] * this.weights[layer + 1][k][node];
            }
          }
          this.errors[layer][node] = error;
          this.deltas[layer][node] = error * output * (1 - output);
        }
      }
    }

    /**
     *
     * @param learningRate
     */

  }, {
    key: 'adjustWeights',
    value: function adjustWeights(learningRate) {
      for (var layer = 1; layer <= this.outputLayer; layer++) {
        var incoming = this.outputs[layer - 1];

        for (var node = 0; node < this.sizes[layer]; node++) {
          var delta = this.deltas[layer][node];

          for (var k = 0; k < incoming.length; k++) {
            var change = this.changes[layer][node][k];

            change = learningRate * delta * incoming[k] + this.momentum * change;

            this.changes[layer][node][k] = change;
            this.weights[layer][node][k] += change;
          }
          this.biases[layer][node] += learningRate * delta;
        }
      }
    }

    /**
     *
     * @param data
     * @returns {*}
     */

  }, {
    key: 'formatData',
    value: function formatData(data) {
      var _this = this;

      if (data.constructor !== Array) {
        // turn stream datum into array
        var tmp = [];
        tmp.push(data);
        data = tmp;
      }
      // turn sparse hash input into arrays with 0s as filler
      var datum = data[0].input;
      if (datum.constructor !== Array && !(datum instanceof Float64Array)) {
        if (!this.inputLookup) {
          this.inputLookup = _lookup2.default.buildLookup(data.map(function (value) {
            return value['input'];
          }));
        }
        data = data.map(function (datum) {
          var array = _lookup2.default.toArray(_this.inputLookup, datum.input);
          return Object.assign({}, datum, { input: array });
        }, this);
      }

      if (data[0].output.constructor !== Array) {
        if (!this.outputLookup) {
          this.outputLookup = _lookup2.default.buildLookup(data.map(function (value) {
            return value['output'];
          }));
        }
        data = data.map(function (datum) {
          var array = _lookup2.default.toArray(_this.outputLookup, datum.output);
          return Object.assign({}, datum, { output: array });
        }, this);
      }
      return data;
    }

    /**
     *
     * @param data
     * @returns {
     *  {
     *    error: number,
     *    misclasses: Array
     *  }
     * }
     */

  }, {
    key: 'test',
    value: function test(data) {
      var _this2 = this;

      data = this.formatData(data);

      // for binary classification problems with one output node
      var isBinary = data[0].output.length == 1;
      var falsePos = 0;
      var falseNeg = 0;
      var truePos = 0;
      var trueNeg = 0;

      // for classification problems
      var misclasses = [];

      // run each pattern through the trained network and collect
      // error and misclassification statistics
      var sum = 0;

      var _loop = function _loop(i) {
        var output = _this2.runInput(data[i].input);
        var target = data[i].output;

        var actual = void 0,
            expected = void 0;
        if (isBinary) {
          actual = output[0] > _this2.binaryThresh ? 1 : 0;
          expected = target[0];
        } else {
          actual = output.indexOf((0, _max2.default)(output));
          expected = target.indexOf((0, _max2.default)(target));
        }

        if (actual != expected) {
          var misclass = data[i];
          Object.assign(misclass, {
            actual: actual,
            expected: expected
          });
          misclasses.push(misclass);
        }

        if (isBinary) {
          if (actual == 0 && expected == 0) {
            trueNeg++;
          } else if (actual == 1 && expected == 1) {
            truePos++;
          } else if (actual == 0 && expected == 1) {
            falseNeg++;
          } else if (actual == 1 && expected == 0) {
            falsePos++;
          }
        }

        var errors = output.map(function (value, i) {
          return target[i] - value;
        });
        sum += (0, _mse2.default)(errors);
      };

      for (var i = 0; i < data.length; i++) {
        _loop(i);
      }
      var error = sum / data.length;

      var stats = {
        error: error,
        misclasses: misclasses
      };

      if (isBinary) {
        Object.assign(stats, {
          trueNeg: trueNeg,
          truePos: truePos,
          falseNeg: falseNeg,
          falsePos: falsePos,
          total: data.length,
          precision: truePos / (truePos + falsePos),
          recall: truePos / (truePos + falseNeg),
          accuracy: (trueNeg + truePos) / data.length
        });
      }
      return stats;
    }

    /**
     *
     * @returns
     *  {
     *    layers: [
     *      {
     *        x: {},
     *        y: {}
     *      },
     *      {
     *        '0': {
     *          bias: -0.98771313,
     *          weights: {
     *            x: 0.8374838,
     *            y: 1.245858
     *          },
     *        '1': {
     *          bias: 3.48192004,
     *          weights: {
     *            x: 1.7825821,
     *            y: -2.67899
     *          }
     *        }
     *      },
     *      {
     *        f: {
     *          bias: 0.27205739,
     *          weights: {
     *            '0': 1.3161821,
     *            '1': 2.00436
     *          }
     *        }
     *      }
     *    ]
     *  }
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var layers = [];
      for (var layer = 0; layer <= this.outputLayer; layer++) {
        layers[layer] = {};

        var nodes = void 0;
        // turn any internal arrays back into hashes for readable json
        if (layer == 0 && this.inputLookup) {
          nodes = Object.keys(this.inputLookup);
        } else if (layer == this.outputLayer && this.outputLookup) {
          nodes = Object.keys(this.outputLookup);
        } else {
          nodes = (0, _range2.default)(0, this.sizes[layer]);
        }

        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          layers[layer][node] = {};

          if (layer > 0) {
            layers[layer][node].bias = this.biases[layer][j];
            layers[layer][node].weights = {};
            for (var k in layers[layer - 1]) {
              var index = k;
              if (layer == 1 && this.inputLookup) {
                index = this.inputLookup[k];
              }
              layers[layer][node].weights[k] = this.weights[layer][j][index];
            }
          }
        }
      }
      return { layers: layers, outputLookup: !!this.outputLookup, inputLookup: !!this.inputLookup };
    }

    /**
     *
     * @param json
     * @returns {NeuralNetwork}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(json) {
      var size = json.layers.length;
      this.outputLayer = size - 1;

      this.sizes = new Array(size);
      this.weights = new Array(size);
      this.biases = new Array(size);
      this.outputs = new Array(size);

      for (var i = 0; i <= this.outputLayer; i++) {
        var layer = json.layers[i];
        if (i == 0 && (!layer[0] || json.inputLookup)) {
          this.inputLookup = _lookup2.default.lookupFromHash(layer);
        } else if (i == this.outputLayer && (!layer[0] || json.outputLookup)) {
          this.outputLookup = _lookup2.default.lookupFromHash(layer);
        }

        var nodes = Object.keys(layer);
        this.sizes[i] = nodes.length;
        this.weights[i] = [];
        this.biases[i] = [];
        this.outputs[i] = [];

        for (var j in nodes) {
          var node = nodes[j];
          this.biases[i][j] = layer[node].bias;
          this.weights[i][j] = (0, _toArray2.default)(layer[node].weights);
        }
      }
      return this;
    }

    /**
     *
     * @returns {Function}
     */

  }, {
    key: 'toFunction',
    value: function toFunction() {
      function nodeHandle(layers, layerNumber, nodeKey) {
        if (layerNumber === 0) {
          return typeof nodeKey === 'string' ? 'input[\'' + nodeKey + '\']' : 'input[' + nodeKey + ']';
        }

        var layer = layers[layerNumber];
        var node = layer[nodeKey];
        var result = [node.bias];
        for (var w in node.weights) {
          if (node.weights[w] < 0) {
            result.push(node.weights[w] + '*(' + nodeHandle(layers, layerNumber - 1, w) + ')');
          } else {
            result.push('+' + node.weights[w] + '*(' + nodeHandle(layers, layerNumber - 1, w) + ')');
          }
        }
        return '1/(1+1/Math.exp(' + result.join('') + '))';
      }

      var layers = this.toJSON().layers;
      var layersAsMath = [];
      var result = void 0;
      for (var i in layers[layers.length - 1]) {
        layersAsMath.push(nodeHandle(layers, layers.length - 1, i));
      }
      if (this.outputLookup) {
        result = '{' + Object.keys(this.outputLookup).map(function (key, i) {
          return '\'' + key + '\':' + layersAsMath[i];
        }) + '}';
      } else {
        result = '[' + layersAsMath.join(',') + ']';
      }
      return new Function('input', 'return ' + result);
    }

    /**
     * This will create a TrainStream (WriteStream) for us to send the training data to.
     * @param opts training options
     * @returns {TrainStream|*}
     */

  }, {
    key: 'createTrainStream',
    value: function createTrainStream(opts) {
      opts = opts || {};
      opts.neuralNetwork = this;
      this.trainStream = new _trainStream2.default(opts);
      return this.trainStream;
    }
  }]);

  return NeuralNetwork;
}();

exports.default = NeuralNetwork;


NeuralNetwork.trainDefaults = {
  iterations: 20000,
  errorThresh: 0.005,
  log: false,
  logPeriod: 10,
  learningRate: 0.3,
  callback: null,
  callbackPeriod: 10,
  keepNetworkIntact: false
};

NeuralNetwork.defaults = {
  learningRate: 0.3,
  momentum: 0.1,
  binaryThresh: 0.5,
  hiddenLayers: null
};

},{"./lookup":4,"./train-stream":34,"./utilities/max":36,"./utilities/mse":37,"./utilities/randos":41,"./utilities/range":42,"./utilities/to-array":43,"./utilities/zeros":44}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matrix = require('./matrix');

var _matrix2 = _interopRequireDefault(_matrix);

var _randomMatrix = require('./matrix/random-matrix');

var _randomMatrix2 = _interopRequireDefault(_randomMatrix);

var _rnn = require('./rnn');

var _rnn2 = _interopRequireDefault(_rnn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GRU = function (_RNN) {
  _inherits(GRU, _RNN);

  function GRU() {
    _classCallCheck(this, GRU);

    return _possibleConstructorReturn(this, (GRU.__proto__ || Object.getPrototypeOf(GRU)).apply(this, arguments));
  }

  _createClass(GRU, [{
    key: 'getModel',
    value: function getModel(hiddenSize, prevSize) {
      return {
        // update Gate
        //wzxh
        updateGateInputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //wzhh
        updateGateHiddenMatrix: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //bz
        updateGateBias: new _matrix2.default(hiddenSize, 1),

        // reset Gate
        //wrxh
        resetGateInputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //wrhh
        resetGateHiddenMatrix: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //br
        resetGateBias: new _matrix2.default(hiddenSize, 1),

        // cell write parameters
        //wcxh
        cellWriteInputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //wchh
        cellWriteHiddenMatrix: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //bc
        cellWriteBias: new _matrix2.default(hiddenSize, 1)
      };
    }

    /**
     *
     * @param {Equation} equation
     * @param {Matrix} inputMatrix
     * @param {Matrix} previousResult
     * @param {Object} hiddenLayer
     * @returns {Matrix}
     */

  }, {
    key: 'getEquation',
    value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
      var sigmoid = equation.sigmoid.bind(equation);
      var add = equation.add.bind(equation);
      var multiply = equation.multiply.bind(equation);
      var multiplyElement = equation.multiplyElement.bind(equation);
      var tanh = equation.tanh.bind(equation);
      var allOnes = equation.allOnes.bind(equation);
      var cloneNegative = equation.cloneNegative.bind(equation);

      // update gate
      var updateGate = sigmoid(add(add(multiply(hiddenLayer.updateGateInputMatrix, inputMatrix), multiply(hiddenLayer.updateGateHiddenMatrix, previousResult)), hiddenLayer.updateGateBias));

      // reset gate
      var resetGate = sigmoid(add(add(multiply(hiddenLayer.resetGateInputMatrix, inputMatrix), multiply(hiddenLayer.resetGateHiddenMatrix, previousResult)), hiddenLayer.resetGateBias));

      // cell
      var cell = tanh(add(add(multiply(hiddenLayer.cellWriteInputMatrix, inputMatrix), multiply(hiddenLayer.cellWriteHiddenMatrix, multiplyElement(resetGate, previousResult))), hiddenLayer.cellWriteBias));

      // compute hidden state as gated, saturated cell activations
      // negate updateGate
      return add(multiplyElement(add(allOnes(updateGate.rows, updateGate.columns), cloneNegative(updateGate)), cell), multiplyElement(previousResult, updateGate));
    }
  }]);

  return GRU;
}(_rnn2.default);

exports.default = GRU;

},{"./matrix":15,"./matrix/random-matrix":22,"./rnn":33}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matrix = require('./matrix');

var _matrix2 = _interopRequireDefault(_matrix);

var _randomMatrix = require('./matrix/random-matrix');

var _randomMatrix2 = _interopRequireDefault(_randomMatrix);

var _rnn = require('./rnn');

var _rnn2 = _interopRequireDefault(_rnn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LSTM = function (_RNN) {
  _inherits(LSTM, _RNN);

  function LSTM() {
    _classCallCheck(this, LSTM);

    return _possibleConstructorReturn(this, (LSTM.__proto__ || Object.getPrototypeOf(LSTM)).apply(this, arguments));
  }

  _createClass(LSTM, [{
    key: 'getModel',
    value: function getModel(hiddenSize, prevSize) {
      return {
        // gates parameters
        //wix
        inputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //wih
        inputHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //bi
        inputBias: new _matrix2.default(hiddenSize, 1),

        //wfx
        forgetMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //wfh
        forgetHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //bf
        forgetBias: new _matrix2.default(hiddenSize, 1),

        //wox
        outputMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //woh
        outputHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //bo
        outputBias: new _matrix2.default(hiddenSize, 1),

        // cell write params
        //wcx
        cellActivationMatrix: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //wch
        cellActivationHidden: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //bc
        cellActivationBias: new _matrix2.default(hiddenSize, 1)
      };
    }

    /**
     *
     * @param {Equation} equation
     * @param {Matrix} inputMatrix
     * @param {Matrix} previousResult
     * @param {Object} hiddenLayer
     * @returns {Matrix}
     */

  }, {
    key: 'getEquation',
    value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
      var sigmoid = equation.sigmoid.bind(equation);
      var add = equation.add.bind(equation);
      var multiply = equation.multiply.bind(equation);
      var multiplyElement = equation.multiplyElement.bind(equation);
      var tanh = equation.tanh.bind(equation);

      var inputGate = sigmoid(add(add(multiply(hiddenLayer.inputMatrix, inputMatrix), multiply(hiddenLayer.inputHidden, previousResult)), hiddenLayer.inputBias));

      var forgetGate = sigmoid(add(add(multiply(hiddenLayer.forgetMatrix, inputMatrix), multiply(hiddenLayer.forgetHidden, previousResult)), hiddenLayer.forgetBias));

      // output gate
      var outputGate = sigmoid(add(add(multiply(hiddenLayer.outputMatrix, inputMatrix), multiply(hiddenLayer.outputHidden, previousResult)), hiddenLayer.outputBias));

      // write operation on cells
      var cellWrite = tanh(add(add(multiply(hiddenLayer.cellActivationMatrix, inputMatrix), multiply(hiddenLayer.cellActivationHidden, previousResult)), hiddenLayer.cellActivationBias));

      // compute new cell activation
      var retainCell = multiplyElement(forgetGate, previousResult); // what do we keep from cell
      var writeCell = multiplyElement(inputGate, cellWrite); // what do we write to cell
      var cell = add(retainCell, writeCell); // new cell contents

      // compute hidden state as gated, saturated cell activations
      return multiplyElement(outputGate, tanh(cell));
    }
  }]);

  return LSTM;
}(_rnn2.default);

exports.default = LSTM;

},{"./matrix":15,"./matrix/random-matrix":22,"./rnn":33}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addB;
/**
 * adds {from} deltas to {left} and {right} deltas
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Matrix} right
 */
function addB(product, left, right) {
  for (var i = 0; i < product.deltas.length; i++) {
    left.deltas[i] = product.deltas[i];
    right.deltas[i] = product.deltas[i];
  }
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = add;
/**
 * add {left} and {right} matrix weights into {into}
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Matrix} right
 */
function add(product, left, right) {
  for (var i = 0; i < left.weights.length; i++) {
    product.weights[i] = left.weights[i] + right.weights[i];
    product.deltas[i] = 0;
  }
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = allOnes;
/**
 * makes matrix weights and deltas all ones
 * @param {Matrix} product
 */
function allOnes(product) {
  for (var i = 0; i < product.weights.length; i++) {
    product.weights[i] = 1;
    product.deltas[i] = 0;
  }
}

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cloneNegative;
/**
 *
 * @param {Matrix} product
 * @param {Matrix} left
 */
function cloneNegative(product, left) {
  product.rows = parseInt(left.rows);
  product.columns = parseInt(left.columns);
  product.weights = left.weights.slice(0);
  product.deltas = left.deltas.slice(0);
  for (var i = 0; i < left.weights.length; i++) {
    product.weights[i] = -left.weights[i];
    product.deltas[i] = 0;
  }
}

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = copy;
/*
 *
 * @param {Matrix} product
 * @param {Matrix} left
 */
function copy(product, left) {
  product.rows = parseInt(left.rows);
  product.columns = parseInt(left.columns);
  product.weights = left.weights.slice(0);
  product.deltas = left.deltas.slice(0);
}

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _onesMatrix = require('./ones-matrix');

var _onesMatrix2 = _interopRequireDefault(_onesMatrix);

var _copy = require('./copy');

var _copy2 = _interopRequireDefault(_copy);

var _cloneNegative2 = require('./clone-negative');

var _cloneNegative3 = _interopRequireDefault(_cloneNegative2);

var _add2 = require('./add');

var _add3 = _interopRequireDefault(_add2);

var _addB = require('./add-b');

var _addB2 = _interopRequireDefault(_addB);

var _allOnes2 = require('./all-ones');

var _allOnes3 = _interopRequireDefault(_allOnes2);

var _multiply2 = require('./multiply');

var _multiply3 = _interopRequireDefault(_multiply2);

var _multiplyB = require('./multiply-b');

var _multiplyB2 = _interopRequireDefault(_multiplyB);

var _multiplyElement2 = require('./multiply-element');

var _multiplyElement3 = _interopRequireDefault(_multiplyElement2);

var _multiplyElementB = require('./multiply-element-b');

var _multiplyElementB2 = _interopRequireDefault(_multiplyElementB);

var _relu2 = require('./relu');

var _relu3 = _interopRequireDefault(_relu2);

var _reluB = require('./relu-b');

var _reluB2 = _interopRequireDefault(_reluB);

var _rowPluck = require('./row-pluck');

var _rowPluck2 = _interopRequireDefault(_rowPluck);

var _rowPluckB = require('./row-pluck-b');

var _rowPluckB2 = _interopRequireDefault(_rowPluckB);

var _sigmoid2 = require('./sigmoid');

var _sigmoid3 = _interopRequireDefault(_sigmoid2);

var _sigmoidB = require('./sigmoid-b');

var _sigmoidB2 = _interopRequireDefault(_sigmoidB);

var _tanh2 = require('./tanh');

var _tanh3 = _interopRequireDefault(_tanh2);

var _tanhB = require('./tanh-b');

var _tanhB2 = _interopRequireDefault(_tanhB);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Equation = function () {
  function Equation() {
    _classCallCheck(this, Equation);

    this.inputRow = 0;
    this.states = [];
  }

  /**
   * connects two matrices together by add
   * @param {Matrix} left
   * @param {Matrix} right
   * @returns {Matrix}
   */


  _createClass(Equation, [{
    key: 'add',
    value: function add(left, right) {
      if (left.weights.length !== right.weights.length) {
        throw new Error('misaligned matrices');
      }
      var product = new _2.default(left.rows, left.columns);
      this.states.push({
        left: left,
        right: right,
        product: product,
        forwardFn: _add3.default,
        backpropagationFn: _addB2.default
      });
      return product;
    }

    /**
     *
     * @param {Number} rows
     * @param {Number} columns
     * @returns {Matrix}
     */

  }, {
    key: 'allOnes',
    value: function allOnes(rows, columns) {
      var product = new _2.default(rows, columns);
      this.states.push({
        left: product,
        product: product,
        forwardFn: _allOnes3.default
      });
      return product;
    }

    /**
     *
     * @param {Matrix} m
     * @returns {Matrix}
     */

  }, {
    key: 'cloneNegative',
    value: function cloneNegative(m) {
      var product = new _2.default(m.rows, m.columns);
      this.states.push({
        left: m,
        product: product,
        forwardFn: _cloneNegative3.default
      });
      return product;
    }

    /**
     * connects two matrices together by subtract
     * @param {Matrix} left
     * @param {Matrix} right
     * @returns {Matrix}
     */

  }, {
    key: 'subtract',
    value: function subtract(left, right) {
      if (left.weights.length !== right.weights.length) {
        throw new Error('misaligned matrices');
      }
      return this.add(this.add(this.allOnes(left.rows, left.columns), this.cloneNegative(left)), right);
    }

    /**
     * connects two matrices together by multiply
     * @param {Matrix} left
     * @param {Matrix} right
     * @returns {Matrix}
     */

  }, {
    key: 'multiply',
    value: function multiply(left, right) {
      if (left.columns !== right.rows) {
        throw new Error('misaligned matrices');
      }
      var product = new _2.default(left.rows, right.columns);
      this.states.push({
        left: left,
        right: right,
        product: product,
        forwardFn: _multiply3.default,
        backpropagationFn: _multiplyB2.default
      });
      return product;
    }

    /**
     * connects two matrices together by multiplyElement
     * @param {Matrix} left
     * @param {Matrix} right
     * @returns {Matrix}
     */

  }, {
    key: 'multiplyElement',
    value: function multiplyElement(left, right) {
      if (left.weights.length !== right.weights.length) {
        throw new Error('misaligned matrices');
      }
      var product = new _2.default(left.rows, left.columns);
      this.states.push({
        left: left,
        right: right,
        product: product,
        forwardFn: _multiplyElement3.default,
        backpropagationFn: _multiplyElementB2.default
      });
      return product;
    }

    /**
     * connects a matrix to relu
     * @param {Matrix} m
     * @returns {Matrix}
     */

  }, {
    key: 'relu',
    value: function relu(m) {
      var product = new _2.default(m.rows, m.columns);
      this.states.push({
        left: m,
        product: product,
        forwardFn: _relu3.default,
        backpropagationFn: _reluB2.default
      });
      return product;
    }

    /**
     * connects a matrix via a row
     * @param {Matrix} m
     * @returns {Matrix}
     */

  }, {
    key: 'inputMatrixToRow',
    value: function inputMatrixToRow(m) {
      var self = this;
      var product = new _2.default(m.columns, 1);
      this.states.push({
        left: m,
        get right() {
          return self.inputRow;
        },
        product: product,
        forwardFn: _rowPluck2.default,
        backpropagationFn: _rowPluckB2.default
      });
      return product;
    }

    /**
     * connects a matrix to sigmoid
     * @param {Matrix} m
     * @returns {Matrix}
     */

  }, {
    key: 'sigmoid',
    value: function sigmoid(m) {
      var product = new _2.default(m.rows, m.columns);
      this.states.push({
        left: m,
        product: product,
        forwardFn: _sigmoid3.default,
        backpropagationFn: _sigmoidB2.default
      });
      return product;
    }

    /**
     * connects a matrix to tanh
     * @param {Matrix} m
     * @returns {Matrix}
     */

  }, {
    key: 'tanh',
    value: function tanh(m) {
      var product = new _2.default(m.rows, m.columns);
      this.states.push({
        left: m,
        product: product,
        forwardFn: _tanh3.default,
        backpropagationFn: _tanhB2.default
      });
      return product;
    }

    /**
     *
     * @param m
     * @returns {Matrix}
     */

  }, {
    key: 'observe',
    value: function observe(m) {
      var iForward = 0;
      var iBackpropagate = 0;
      this.states.push({
        forwardFn: function forwardFn() {
          iForward++;
        },
        backpropagationFn: function backpropagationFn() {
          iBackpropagate++;
        }
      });
      return m;
    }

    /**
     * @patam {Number} [rowIndex]
     * @output {Matrix}
     */

  }, {
    key: 'run',
    value: function run() {
      var rowIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.inputRow = rowIndex;
      var state = void 0;
      for (var i = 0, max = this.states.length; i < max; i++) {
        state = this.states[i];
        if (!state.hasOwnProperty('forwardFn')) {
          continue;
        }
        state.forwardFn(state.product, state.left, state.right);
      }

      return state.product;
    }

    /**
     * @patam {Number} [rowIndex]
     * @output {Matrix}
     */

  }, {
    key: 'runBackpropagate',
    value: function runBackpropagate() {
      var rowIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.inputRow = rowIndex;

      var i = this.states.length;
      var state = void 0;
      while (i-- > 0) {
        state = this.states[i];
        if (!state.hasOwnProperty('backpropagationFn')) {
          continue;
        }
        state.backpropagationFn(state.product, state.left, state.right);
      }

      return state.product;
    }
  }]);

  return Equation;
}();

exports.default = Equation;

},{"./":15,"./add":10,"./add-b":9,"./all-ones":11,"./clone-negative":12,"./copy":13,"./multiply":20,"./multiply-b":17,"./multiply-element":19,"./multiply-element-b":18,"./ones-matrix":21,"./relu":24,"./relu-b":23,"./row-pluck":26,"./row-pluck-b":25,"./sigmoid":29,"./sigmoid-b":28,"./tanh":32,"./tanh-b":31}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _zeros = require('../../utilities/zeros');

var _zeros2 = _interopRequireDefault(_zeros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A matrix
 * @param {Number} [rows]
 * @param {Number} [columns]
 * @constructor
 */
var Matrix = function () {
  function Matrix(rows, columns) {
    _classCallCheck(this, Matrix);

    if (rows === undefined) return;
    if (columns === undefined) return;

    this.rows = rows;
    this.columns = columns;
    this.weights = (0, _zeros2.default)(rows * columns);
    this.deltas = (0, _zeros2.default)(rows * columns);
  }

  /**
   *
   * @param {Number} row
   * @param {Number} col
   * @returns {Float64Array|Array}
   */


  _createClass(Matrix, [{
    key: 'getWeights',
    value: function getWeights(row, col) {
      // slow but careful accessor function
      // we want row-major order
      var ix = this.columns * row + col;
      if (ix < 0 && ix >= this.weights.length) throw new Error('get accessor is skewed');
      return this.weights[ix];
    }

    /**
     *
     * @param {Number} row
     * @param {Number} col
     * @param v
     * @returns {Matrix}
     */

  }, {
    key: 'setWeight',
    value: function setWeight(row, col, v) {
      // slow but careful accessor function
      var ix = this.columns * row + col;
      if (ix < 0 && ix >= this.weights.length) throw new Error('set accessor is skewed');
      this.weights[ix] = v;
    }

    /**
     *
     * @param {Number} row
     * @param {Number} col
     * @param v
     * @returns {Matrix}
     */

  }, {
    key: 'setDeltas',
    value: function setDeltas(row, col, v) {
      // slow but careful accessor function
      var ix = this.columns * row + col;
      if (ix < 0 && ix >= this.weights.length) throw new Error('set accessor is skewed');
      this.deltas[ix] = v;
    }

    /**
     *
     * @returns {{rows: *, columns: *, weights: Array}}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        rows: this.rows,
        columns: this.columns,
        weights: this.weights.slice(0)
      };
    }
  }], [{
    key: 'fromJSON',
    value: function fromJSON(json) {
      var matrix = new Matrix(json.rows, json.columns);
      for (var i = 0, max = json.rows * json.columns; i < max; i++) {
        matrix.weights[i] = json.weights[i]; // copy over weights
      }
      return matrix;
    }

    /**
     *
     * @param weightRows
     * @param [deltasRows]
     * @returns {Matrix}
     */

  }, {
    key: 'fromArray',
    value: function fromArray(weightRows, deltasRows) {
      var rows = weightRows.length;
      var columns = weightRows[0].length;
      var m = new Matrix(rows, columns);

      deltasRows = deltasRows || weightRows;

      for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
        var weightValues = weightRows[rowIndex];
        var deltasValues = deltasRows[rowIndex];
        for (var columnIndex = 0; columnIndex < columns; columnIndex++) {
          m.setWeight(rowIndex, columnIndex, weightValues[columnIndex]);
          m.setDeltas(rowIndex, columnIndex, deltasValues[columnIndex]);
        }
      }

      return m;
    }
  }]);

  return Matrix;
}();

exports.default = Matrix;

},{"../../utilities/zeros":44}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = maxI;
/**
 *
 * @param {Matrix} m
 * @returns {number}
 */
function maxI(m) {
  // argmax of array w
  var weights = m.weights;

  var maxv = weights[0];
  var maxix = 0;
  for (var i = 1; i < weights.length; i++) {
    var v = weights[i];
    if (v < maxv) continue;

    maxix = i;
    maxv = v;
  }
  return maxix;
};

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multiplyB;
/**
 * multiplies {from} deltas to {left} and {right}
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Matrix} right
 */
function multiplyB(product, left, right) {
  var leftRows = left.rows;
  var leftColumns = left.columns;
  var rightColumns = right.columns;

  // loop over rows of left
  for (var leftRow = 0; leftRow < leftRows; leftRow++) {
    var leftRowBase = leftColumns * leftRow;
    var rightRowBase = rightColumns * leftRow;
    // loop over cols of right
    for (var rightColumn = 0; rightColumn < rightColumns; rightColumn++) {

      //loop over columns of left
      for (var leftColumn = 0; leftColumn < leftColumns; leftColumn++) {
        var rightColumnBase = rightColumns * leftColumn;
        var _leftRow = leftRowBase + leftColumn;
        var rightRow = rightColumnBase + rightColumn;
        var backPropagateValue = product.deltas[rightRowBase + rightColumn];
        left.deltas[_leftRow] += right.weights[rightRow] * backPropagateValue;
        right.deltas[rightRow] += left.weights[_leftRow] * backPropagateValue;
      }
    }
  }
}

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multiplyElementB;
/**
 * multiplies {left} and {right} weight by {from} deltas into {left} and {right} deltas
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Matrix} right
 */
function multiplyElementB(product, left, right) {
  for (var i = 0; i < left.weights.length; i++) {
    left.deltas[i] = right.weights[i] * product.deltas[i];
    right.deltas[i] = left.weights[i] * product.deltas[i];
  }
}

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multiplyElement;
/**
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Matrix} right
 */
function multiplyElement(product, left, right) {
  var weights = left.weights;

  for (var i = 0; i < weights.length; i++) {
    product.weights[i] = left.weights[i] * right.weights[i];
    product.deltas[i] = 0;
  }
}

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multiply;
/**
 * multiply {left} and {right} matrix weights to {into}
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Matrix} right
 */
function multiply(product, left, right) {
  var leftRows = left.rows;
  var leftColumns = left.columns;
  var rightColumns = right.columns;

  // loop over rows of left
  for (var leftRow = 0; leftRow < leftRows; leftRow++) {
    var leftRowBase = leftColumns * leftRow;
    var rightRowBase = rightColumns * leftRow;
    // loop over cols of right
    for (var rightColumn = 0; rightColumn < rightColumns; rightColumn++) {

      // dot product loop
      var dot = 0;
      //loop over columns of left
      for (var leftColumn = 0; leftColumn < leftColumns; leftColumn++) {
        var rightColumnBase = rightColumns * leftColumn;
        var leftIndex = leftRowBase + leftColumn;
        var rightIndex = rightColumnBase + rightColumn;
        dot += left.weights[leftIndex] * right.weights[rightIndex];
        left.deltas[leftIndex] = 0;
        right.deltas[rightIndex] = 0;
      }
      product.weights[rightRowBase + rightColumn] = dot;
    }
  }
}

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _ones = require('../../utilities/ones');

var _ones2 = _interopRequireDefault(_ones);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** return Matrix but filled with random numbers from gaussian
 * @param {Number} [rows]
 * @param {Number} [columns]
 * @constructor
 */
var OnesMatrix = function (_Matrix) {
  _inherits(OnesMatrix, _Matrix);

  function OnesMatrix(rows, columns) {
    _classCallCheck(this, OnesMatrix);

    var _this = _possibleConstructorReturn(this, (OnesMatrix.__proto__ || Object.getPrototypeOf(OnesMatrix)).call(this, rows, columns));

    _this.rows = rows;
    _this.columns = columns;
    _this.weights = (0, _ones2.default)(rows * columns);
    _this.deltas = (0, _ones2.default)(rows * columns);
    return _this;
  }

  return OnesMatrix;
}(_2.default);

exports.default = OnesMatrix;

},{"../../utilities/ones":38,"./":15}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _random = require('../../utilities/random');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** return Matrix but filled with random numbers from gaussian
 * @param {Number} [rows]
 * @param {Number} [columns]
 * @param std
 * @constructor
 */
var RandomMatrix = function (_Matrix) {
  _inherits(RandomMatrix, _Matrix);

  function RandomMatrix(rows, columns, std) {
    _classCallCheck(this, RandomMatrix);

    var _this = _possibleConstructorReturn(this, (RandomMatrix.__proto__ || Object.getPrototypeOf(RandomMatrix)).call(this, rows, columns));

    _this.rows = rows;
    _this.columns = columns;
    _this.std = std;
    for (var i = 0, max = _this.weights.length; i < max; i++) {
      _this.weights[i] = (0, _random.randomF)(-std, std);
    }
    return _this;
  }

  return RandomMatrix;
}(_2.default);

exports.default = RandomMatrix;

},{"../../utilities/random":40,"./":15}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reluB;
/**
 * adds {from} deltas to {m} deltas when {m} weights are above other a threshold of 0
 * @param {Matrix} product
 * @param {Matrix} m
 */
function reluB(product, left) {
  for (var i = 0; i < product.deltas.length; i++) {
    left.deltas[i] = left.weights[i] > 0 ? product.deltas[i] : 0;
  }
}

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = relu;
/**
 *
 * relu {m} weights to {into} weights
 * @param {Matrix} product
 * @param {Matrix} left
 */
function relu(product, left) {
  for (var i = 0; i < left.weights.length; i++) {
    product.weights[i] = Math.max(0, left.weights[i]); // relu
    product.deltas[i] = 0;
  }
}

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rowPluckB;
/**
 * adds {from} deltas into {m} deltas
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Number} rowIndex
 */
function rowPluckB(product, left, rowIndex) {
  var columns = left.columns;
  var rowBase = columns * rowIndex;
  for (var column = 0; column < columns; column++) {
    left.deltas[rowBase + column] = product.deltas[column];
  }
}

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rowPluck;
/**
 * @param {Matrix} product
 * @param {Matrix} left
 * @param {Number} rowPluckIndex
 */
function rowPluck(product, left, rowPluckIndex) {
  var columns = left.columns;
  var rowBase = columns * rowPluckIndex;
  for (var column = 0; column < columns; column++) {
    product.weights[column] = left.weights[rowBase + column];
    product.deltas[column] = 0;
  }
}

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sampleI;

var _random = require('../../utilities/random');

//prevent parser from renaming when calling toString() method later
var randomF = _random.randomF;
/**
 *
 * @param {Matrix} m
 * @returns {number}
 */
function sampleI(m) {
  // sample argmax from w, assuming w are
  // probabilities that sum to one
  var r = randomF(0, 1);
  var x = 0;
  var i = 0;
  var w = m.weights;

  while (true) {
    x += w[i];
    if (x > r) {
      return i;
    }
    i++;
  }
}

},{"../../utilities/random":40}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sigmoidB;
/**
 *
 * @param {Matrix} product
 * @param {Matrix} left
 */
function sigmoidB(product, left) {
  for (var i = 0; i < product.deltas.length; i++) {
    var mwi = product.weights[i];
    left.deltas[i] = mwi * (1 - mwi) * product.deltas[i];
  }
}

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sigmoid;
/**
 * @param {Matrix} product
 * @param {Matrix} left
 */
function sigmoid(product, left) {
  // sigmoid nonlinearity
  for (var i = 0; i < left.weights.length; i++) {
    product.weights[i] = 1 / (1 + Math.exp(-left.weights[i]));
    product.deltas[i] = 0;
  }
}

function sig(x) {
  // helper function for computing sigmoid
  return 1 / (1 + Math.exp(-x));
}

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = softmax;

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {Matrix} m
 * @returns {Matrix}
 */
function softmax(m) {
  var result = new _2.default(m.rows, m.columns); // probability volume
  var maxVal = -999999;
  for (var i = 0; i < m.weights.length; i++) {
    if (m.weights[i] > maxVal) {
      maxVal = m.weights[i];
    }
  }

  var s = 0;
  for (var _i = 0; _i < m.weights.length; _i++) {
    result.weights[_i] = Math.exp(m.weights[_i] - maxVal);
    s += result.weights[_i];
  }

  for (var _i2 = 0; _i2 < m.weights.length; _i2++) {
    result.weights[_i2] /= s;
  }

  // no backward pass here needed
  // since we will use the computed probabilities outside
  // to set gradients directly on m
  return result;
}

},{"./":15}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tanhB;
/**
 *
 * @param {Matrix} product
 * @param {Matrix} left
 */
function tanhB(product, left) {
  for (var i = 0; i < product.deltas.length; i++) {
    // grad for z = tanh(x) is (1 - z^2)
    var mwi = product.weights[i];
    left.deltas[i] = (1 - mwi * mwi) * product.deltas[i];
  }
}

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tanh;
/**
 * @param {Matrix} product
 * @param {Matrix} left
 */
function tanh(product, left) {
  // tanh nonlinearity
  for (var i = 0; i < left.weights.length; i++) {
    product.weights[i] = Math.tanh(left.weights[i]);
    product.deltas[i] = 0;
  }
}

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _matrix = require('./matrix');

var _matrix2 = _interopRequireDefault(_matrix);

var _randomMatrix = require('./matrix/random-matrix');

var _randomMatrix2 = _interopRequireDefault(_randomMatrix);

var _equation = require('./matrix/equation');

var _equation2 = _interopRequireDefault(_equation);

var _sampleI = require('./matrix/sample-i');

var _sampleI2 = _interopRequireDefault(_sampleI);

var _maxI = require('./matrix/max-i');

var _maxI2 = _interopRequireDefault(_maxI);

var _softmax = require('./matrix/softmax');

var _softmax2 = _interopRequireDefault(_softmax);

var _copy = require('./matrix/copy');

var _copy2 = _interopRequireDefault(_copy);

var _random = require('../utilities/random');

var _zeros = require('../utilities/zeros');

var _zeros2 = _interopRequireDefault(_zeros);

var _dataFormatter = require('../utilities/data-formatter');

var _dataFormatter2 = _interopRequireDefault(_dataFormatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RNN = function () {
  function RNN() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, RNN);

    var defaults = RNN.defaults;

    for (var p in defaults) {
      if (!defaults.hasOwnProperty(p)) continue;
      this[p] = options.hasOwnProperty(p) ? options[p] : defaults[p];
    }

    this.stepCache = {};
    this.runs = 0;
    this.totalCost = null;
    this.ratioClipped = null;
    this.model = null;

    this.initialLayerInputs = this.hiddenSizes.map(function (size) {
      return new _matrix2.default(_this.hiddenSizes[0], 1);
    });
    this.inputLookup = null;
    this.outputLookup = null;
    this.initialize();
  }

  _createClass(RNN, [{
    key: 'initialize',
    value: function initialize() {
      this.model = {
        input: null,
        hiddenLayers: [],
        output: null,
        equations: [],
        allMatrices: [],
        equationConnections: []
      };

      if (this.dataFormatter !== null) {
        this.inputSize = this.inputRange = this.outputSize = this.dataFormatter.characters.length;
      }

      if (this.json) {
        this.fromJSON(this.json);
      } else {
        this.mapModel();
      }
    }
  }, {
    key: 'createHiddenLayers',
    value: function createHiddenLayers() {
      var hiddenSizes = this.hiddenSizes;
      var model = this.model;
      var hiddenLayers = model.hiddenLayers;
      //0 is end, so add 1 to offset
      hiddenLayers.push(this.getModel(hiddenSizes[0], this.inputSize));
      var prevSize = hiddenSizes[0];

      for (var d = 1; d < hiddenSizes.length; d++) {
        // loop over depths
        var hiddenSize = hiddenSizes[d];
        hiddenLayers.push(this.getModel(hiddenSize, prevSize));
        prevSize = hiddenSize;
      }
    }

    /**
     *
     * @param {Number} hiddenSize
     * @param {Number} prevSize
     * @returns {object}
     */

  }, {
    key: 'getModel',
    value: function getModel(hiddenSize, prevSize) {
      return {
        //wxh
        weight: new _randomMatrix2.default(hiddenSize, prevSize, 0.08),
        //whh
        transition: new _randomMatrix2.default(hiddenSize, hiddenSize, 0.08),
        //bhh
        bias: new _matrix2.default(hiddenSize, 1)
      };
    }

    /**
     *
     * @param {Equation} equation
     * @param {Matrix} inputMatrix
     * @param {Matrix} previousResult
     * @param {Object} hiddenLayer
     * @returns {Matrix}
     */

  }, {
    key: 'getEquation',
    value: function getEquation(equation, inputMatrix, previousResult, hiddenLayer) {
      var relu = equation.relu.bind(equation);
      var add = equation.add.bind(equation);
      var multiply = equation.multiply.bind(equation);

      return relu(add(add(multiply(hiddenLayer.weight, inputMatrix), multiply(hiddenLayer.transition, previousResult)), hiddenLayer.bias));
    }
  }, {
    key: 'createInputMatrix',
    value: function createInputMatrix() {
      //0 is end, so add 1 to offset
      this.model.input = new _randomMatrix2.default(this.inputRange + 1, this.inputSize, 0.08);
    }
  }, {
    key: 'createOutputMatrix',
    value: function createOutputMatrix() {
      var model = this.model;
      var outputSize = this.outputSize;
      var lastHiddenSize = this.hiddenSizes[this.hiddenSizes.length - 1];

      //0 is end, so add 1 to offset
      //whd
      model.outputConnector = new _randomMatrix2.default(outputSize + 1, lastHiddenSize, 0.08);
      //0 is end, so add 1 to offset
      //bd
      model.output = new _matrix2.default(outputSize + 1, 1);
    }
  }, {
    key: 'bindEquation',
    value: function bindEquation() {
      var model = this.model;
      var hiddenSizes = this.hiddenSizes;
      var hiddenLayers = model.hiddenLayers;
      var equation = new _equation2.default();
      var outputs = [];
      var equationConnection = model.equationConnections.length > 0 ? model.equationConnections[model.equationConnections.length - 1] : this.initialLayerInputs;

      // 0 index
      var output = this.getEquation(equation, equation.inputMatrixToRow(model.input), equationConnection[0], hiddenLayers[0]);
      outputs.push(output);
      // 1+ indices
      for (var i = 1, max = hiddenSizes.length; i < max; i++) {
        output = this.getEquation(equation, output, equationConnection[i], hiddenLayers[i]);
        outputs.push(output);
      }

      model.equationConnections.push(outputs);
      equation.add(equation.multiply(model.outputConnector, output), model.output);
      model.equations.push(equation);
    }
  }, {
    key: 'mapModel',
    value: function mapModel() {
      var model = this.model;
      var hiddenLayers = model.hiddenLayers;
      var allMatrices = model.allMatrices;

      this.createInputMatrix();
      if (!model.input) throw new Error('net.model.input not set');
      allMatrices.push(model.input);

      this.createHiddenLayers();
      if (!model.hiddenLayers.length) throw new Error('net.hiddenLayers not set');
      for (var i = 0, max = hiddenLayers.length; i < max; i++) {
        var hiddenMatrix = hiddenLayers[i];
        for (var property in hiddenMatrix) {
          if (!hiddenMatrix.hasOwnProperty(property)) continue;
          allMatrices.push(hiddenMatrix[property]);
        }
      }

      this.createOutputMatrix();
      if (!model.outputConnector) throw new Error('net.model.outputConnector not set');
      if (!model.output) throw new Error('net.model.output not set');

      allMatrices.push(model.outputConnector);
      allMatrices.push(model.output);
    }

    /**
     *
     * @param {Number[]} input
     * @param {Number} [learningRate]
     * @returns {number}
     */

  }, {
    key: 'trainPattern',
    value: function trainPattern(input) {
      var learningRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var error = this.runInput(input);
      this.runBackpropagate(input);
      this.step(learningRate);
      return error;
    }

    /**
     *
     * @param {Number[]} input
     * @returns {number}
     */

  }, {
    key: 'runInput',
    value: function runInput(input) {
      this.runs++;
      var model = this.model;
      var max = input.length;
      var log2ppl = 0;
      var cost = 0;
      var equation = void 0;
      while (model.equations.length <= input.length + 1) {
        //last is zero
        this.bindEquation();
      }
      for (var inputIndex = -1, inputMax = input.length; inputIndex < inputMax; inputIndex++) {
        // start and end tokens are zeros
        var equationIndex = inputIndex + 1;
        equation = model.equations[equationIndex];

        var source = inputIndex === -1 ? 0 : input[inputIndex] + 1; // first step: start with START token
        var target = inputIndex === max - 1 ? 0 : input[inputIndex + 1] + 1; // last step: end with END token
        var output = equation.run(source);
        // set gradients into log probabilities
        var logProbabilities = output; // interpret output as log probabilities
        var probabilities = (0, _softmax2.default)(output); // compute the softmax probabilities

        log2ppl += -Math.log2(probabilities.weights[target]); // accumulate base 2 log prob and do smoothing
        cost += -Math.log(probabilities.weights[target]);
        // write gradients into log probabilities
        logProbabilities.deltas = probabilities.weights.slice(0);
        logProbabilities.deltas[target] -= 1;
      }

      this.totalCost = cost;
      return Math.pow(2, log2ppl / (max - 1));
    }

    /**
     * @param {Number[]} input
     */

  }, {
    key: 'runBackpropagate',
    value: function runBackpropagate(input) {
      var i = input.length;
      var model = this.model;
      var equations = model.equations;
      while (i > 0) {
        equations[i].runBackpropagate(input[i - 1] + 1);
        i--;
      }
      equations[0].runBackpropagate(0);
    }

    /**
     *
     * @param {Number} [learningRate]
     */

  }, {
    key: 'step',
    value: function step() {
      var learningRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      // perform parameter update
      //TODO: still not sure if this is ready for learningRate
      var stepSize = this.learningRate;
      var regc = this.regc;
      var clipval = this.clipval;
      var model = this.model;
      var numClipped = 0;
      var numTot = 0;
      var allMatrices = model.allMatrices;
      for (var matrixIndex = 0; matrixIndex < allMatrices.length; matrixIndex++) {
        var matrix = allMatrices[matrixIndex];
        var weights = matrix.weights,
            deltas = matrix.deltas;

        if (!(matrixIndex in this.stepCache)) {
          this.stepCache[matrixIndex] = (0, _zeros2.default)(matrix.rows * matrix.columns);
        }
        var cache = this.stepCache[matrixIndex];
        for (var i = 0; i < weights.length; i++) {
          var r = deltas[i];
          var w = weights[i];
          // rmsprop adaptive learning rate
          cache[i] = cache[i] * this.decayRate + (1 - this.decayRate) * r * r;
          // gradient clip
          if (r > clipval) {
            r = clipval;
            numClipped++;
          }
          if (r < -clipval) {
            r = -clipval;
            numClipped++;
          }
          numTot++;
          // update (and regularize)
          weights[i] = w + -stepSize * r / Math.sqrt(cache[i] + this.smoothEps) - regc * w;
        }
      }
      this.ratioClipped = numClipped / numTot;
    }

    /**
     *
     * @param {Number[]|*} [rawInput]
     * @param {Number} [maxPredictionLength]
     * @param {Boolean} [isSampleI]
     * @param {Number} temperature
     * @returns {*}
     */

  }, {
    key: 'run',
    value: function run() {
      var rawInput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var maxPredictionLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
      var isSampleI = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var temperature = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      var input = this.formatDataIn(rawInput);
      var model = this.model;
      var output = [];
      var i = 0;
      while (model.equations.length < maxPredictionLength) {
        this.bindEquation();
      }
      while (true) {
        var previousIndex = i === 0 ? 0 : i < input.length ? input[i - 1] + 1 : output[i - 1];
        var equation = model.equations[i];
        // sample predicted letter
        var outputMatrix = equation.run(previousIndex);
        var logProbabilities = new _matrix2.default(model.output.rows, model.output.columns);
        (0, _copy2.default)(logProbabilities, outputMatrix);
        if (temperature !== 1 && isSampleI) {
          /**
           * scale log probabilities by temperature and re-normalize
           * if temperature is high, logProbabilities will go towards zero
           * and the softmax outputs will be more diffuse. if temperature is
           * very low, the softmax outputs will be more peaky
           */
          for (var j = 0, max = logProbabilities.weights.length; j < max; j++) {
            logProbabilities.weights[j] /= temperature;
          }
        }

        var probs = (0, _softmax2.default)(logProbabilities);
        var nextIndex = isSampleI ? (0, _sampleI2.default)(probs) : (0, _maxI2.default)(probs);

        i++;
        if (nextIndex === 0) {
          // END token predicted, break out
          break;
        }
        if (i >= maxPredictionLength) {
          // something is wrong
          break;
        }

        output.push(nextIndex);
      }

      /**
       * we slice the input length here, not because output contains it, but it will be erroneous as we are sending the
       * network what is contained in input, so the data is essentially guessed by the network what could be next, till it
       * locks in on a value.
       * Kind of like this, values are from input:
       * 0 -> 4 (or in English: "beginning on input" -> "I have no idea? I'll guess what they want next!")
       * 2 -> 2 (oh how interesting, I've narrowed down values...)
       * 1 -> 9 (oh how interesting, I've now know what the values are...)
       * then the output looks like: [4, 2, 9,...]
       * so we then remove the erroneous data to get our true output
       */
      return this.formatDataOut(input, output.slice(input.length).map(function (value) {
        return value - 1;
      }));
    }

    /**
     *
     * @param {Object[]|String[]} data an array of objects: `{input: 'string', output: 'string'}` or an array of strings
     * @param {Object} [options]
     * @returns {{error: number, iterations: number}}
     */

  }, {
    key: 'train',
    value: function train(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = Object.assign({}, RNN.trainDefaults, options);
      var iterations = options.iterations;
      var errorThresh = options.errorThresh;
      var log = options.log === true ? console.log : options.log;
      var logPeriod = options.logPeriod;
      var learningRate = options.learningRate || this.learningRate;
      var callback = options.callback;
      var callbackPeriod = options.callbackPeriod;
      var error = Infinity;
      var i = void 0;

      if (this.hasOwnProperty('setupData')) {
        data = this.setupData(data);
      }

      if (!options.keepNetworkIntact) {
        this.initialize();
      }

      for (i = 0; i < iterations && error > errorThresh; i++) {
        var sum = 0;
        for (var j = 0; j < data.length; j++) {
          var err = this.trainPattern(data[j], learningRate);
          sum += err;
        }
        error = sum / data.length;

        if (isNaN(error)) throw new Error('network error rate is unexpected NaN, check network configurations and try again');
        if (log && i % logPeriod == 0) {
          log('iterations:', i, 'training error:', error);
        }
        if (callback && i % callbackPeriod == 0) {
          callback({ error: error, iterations: i });
        }
      }

      return {
        error: error,
        iterations: i
      };
    }

    /**
     *
     * @param data
     * @returns {
     *  {
     *    error: number,
     *    misclasses: Array
     *  }
     * }
     */

  }, {
    key: 'test',
    value: function test(data) {
      throw new Error('not yet implemented');
    }

    /**
     *
     * @returns {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var defaults = RNN.defaults;
      var model = this.model;
      var options = {};
      for (var p in defaults) {
        options[p] = this[p];
      }

      return {
        type: this.constructor.name,
        options: options,
        input: model.input.toJSON(),
        hiddenLayers: model.hiddenLayers.map(function (hiddenLayer) {
          var layers = {};
          for (var _p in hiddenLayer) {
            layers[_p] = hiddenLayer[_p].toJSON();
          }
          return layers;
        }),
        outputConnector: this.model.outputConnector.toJSON(),
        output: this.model.output.toJSON()
      };
    }
  }, {
    key: 'toJSONString',
    value: function toJSONString() {
      return JSON.stringify(this.toJSON());
    }
  }, {
    key: 'fromJSON',
    value: function fromJSON(json) {
      this.json = json;
      var defaults = RNN.defaults;
      var model = this.model;
      var options = json.options;
      var allMatrices = model.allMatrices;
      model.input = _matrix2.default.fromJSON(json.input);
      allMatrices.push(model.input);
      model.hiddenLayers = json.hiddenLayers.map(function (hiddenLayer) {
        var layers = {};
        for (var p in hiddenLayer) {
          layers[p] = _matrix2.default.fromJSON(hiddenLayer[p]);
          allMatrices.push(layers[p]);
        }
        return layers;
      });
      model.outputConnector = _matrix2.default.fromJSON(json.outputConnector);
      model.output = _matrix2.default.fromJSON(json.output);
      allMatrices.push(model.outputConnector);
      allMatrices.push(model.output);

      for (var p in defaults) {
        if (!defaults.hasOwnProperty(p)) continue;
        this[p] = options.hasOwnProperty(p) ? options[p] : defaults[p];
      }

      if (options.hasOwnProperty('dataFormatter') && options.dataFormatter !== null) {
        this.dataFormatter = _dataFormatter2.default.fromJSON(options.dataFormatter);
        delete options.dataFormatter;
      }

      this.bindEquation();
    }
  }, {
    key: 'fromJSONString',
    value: function fromJSONString(json) {
      return this.fromJSON(JSON.parse(json));
    }

    /**
     *
     * @returns {Function}
     */

  }, {
    key: 'toFunction',
    value: function toFunction() {
      var model = this.model;
      var equations = this.model.equations;
      var equation = equations[1];
      var states = equation.states;
      var jsonString = JSON.stringify(this.toJSON());

      function matrixOrigin(m, stateIndex) {
        for (var i = 0, max = states.length; i < max; i++) {
          var state = states[i];

          if (i === stateIndex) {
            var j = previousConnectionIndex(m);
            switch (m) {
              case state.left:
                if (j > -1) {
                  return 'typeof prevStates[' + j + '] === \'object\' ? prevStates[' + j + '].product : new Matrix(' + m.rows + ', ' + m.columns + ')';
                }
              case state.right:
                if (j > -1) {
                  return 'typeof prevStates[' + j + '] === \'object\' ? prevStates[' + j + '].product : new Matrix(' + m.rows + ', ' + m.columns + ')';
                }
              case state.product:
                return 'new Matrix(' + m.rows + ', ' + m.columns + ')';
              default:
                throw Error('unknown state');
            }
          }

          if (m === state.product) return 'states[' + i + '].product';
          if (m === state.right) return 'states[' + i + '].right';
          if (m === state.left) return 'states[' + i + '].left';
        }
      }

      function previousConnectionIndex(m) {
        var connection = model.equationConnections[0];
        var states = equations[0].states;
        for (var i = 0, max = states.length; i < max; i++) {
          if (states[i].product === m) {
            return i;
          }
        }
        return connection.indexOf(m);
      }

      function matrixToString(m, stateIndex) {
        if (!m || !m.rows || !m.columns) return 'null';

        if (m === model.input) return 'json.input';
        if (m === model.outputConnector) return 'json.outputConnector';
        if (m === model.output) return 'json.output';

        for (var i = 0, max = model.hiddenLayers.length; i < max; i++) {
          var hiddenLayer = model.hiddenLayers[i];
          for (var p in hiddenLayer) {
            if (!hiddenLayer.hasOwnProperty(p)) continue;
            if (hiddenLayer[p] !== m) continue;
            return 'json.hiddenLayers[' + i + '].' + p;
          }
        }

        return matrixOrigin(m, stateIndex);
      }

      function toInner(fnString) {
        // crude, but should be sufficient for now
        // function() { body }
        fnString = fnString.toString().split('{');
        fnString.shift();
        // body }
        fnString = fnString.join('{');
        fnString = fnString.split('}');
        fnString.pop();
        // body
        return fnString.join('}').split('\n').join('\n        ').replace('product.deltas[i] = 0;', '').replace('product.deltas[column] = 0;', '').replace('left.deltas[leftIndex] = 0;', '').replace('right.deltas[rightIndex] = 0;', '').replace('product.deltas = left.deltas.slice(0);', '');
      }

      function fileName(fnName) {
        return 'src/recurrent/matrix/' + fnName.replace(/[A-Z]/g, function (value) {
          return '-' + value.toLowerCase();
        }) + '.js';
      }

      var statesRaw = [];
      var usedFunctionNames = {};
      var innerFunctionsSwitch = [];
      for (var i = 0, max = states.length; i < max; i++) {
        var state = states[i];
        statesRaw.push('states[' + i + '] = {\n      name: \'' + state.forwardFn.name + '\',\n      left: ' + matrixToString(state.left, i) + ',\n      right: ' + matrixToString(state.right, i) + ',\n      product: ' + matrixToString(state.product, i) + '\n    }');

        var fnName = state.forwardFn.name;
        if (!usedFunctionNames[fnName]) {
          usedFunctionNames[fnName] = true;
          innerFunctionsSwitch.push('        case \'' + fnName + '\': //compiled from ' + fileName(fnName) + '\n          ' + toInner(state.forwardFn.toString()) + '\n          break;');
        }
      }

      return new Function('input', 'maxPredictionLength', 'isSampleI', 'temperature', '\n  if (typeof input === \'undefined\') input = [];\n  if (typeof maxPredictionLength === \'undefined\') maxPredictionLength = 100;\n  if (typeof isSampleI === \'undefined\') isSampleI = false;\n  if (typeof temperature === \'undefined\') temperature = 1;\n  \n  ' + (this.dataFormatter !== null && typeof this.formatDataIn === 'function' ? 'input = formatDataIn(input);' : '') + '\n        \n  var json = ' + jsonString + ';\n  var _i = 0;\n  var output = [];\n  var states = [];\n  var prevStates;\n  while (true) {\n    var previousIndex = (_i === 0\n        ? 0\n        : _i < input.length\n          ? input[_i - 1] + 1\n          : output[_i - 1])\n          ;\n    var rowPluckIndex = previousIndex;\n    prevStates = states;\n    states = [];\n    ' + statesRaw.join(';\n    ') + ';\n    for (var stateIndex = 0, stateMax = ' + statesRaw.length + '; stateIndex < stateMax; stateIndex++) {\n      var state = states[stateIndex];\n      var product = state.product;\n      var left = state.left;\n      var right = state.right;\n      \n      switch (state.name) {\n' + innerFunctionsSwitch.join('\n') + '\n      }\n    }\n    \n    var logProbabilities = state.product;\n    if (temperature !== 1 && isSampleI) {\n      for (var q = 0, nq = logProbabilities.weights.length; q < nq; q++) {\n        logProbabilities.weights[q] /= temperature;\n      }\n    }\n\n    var probs = softmax(logProbabilities);\n    var nextIndex = isSampleI ? sampleI(probs) : maxI(probs);\n    \n    _i++;\n    if (nextIndex === 0) {\n      break;\n    }\n    if (_i >= maxPredictionLength) {\n      break;\n    }\n\n    output.push(nextIndex);\n  }\n  ' + (this.dataFormatter !== null && typeof this.formatDataOut === 'function' ? 'return formatDataOut(output.slice(input.length).map(function(value) { return value - 1; }))' : 'return output.slice(input.length).map(function(value) { return value - 1; })') + ';\n  \n  function Matrix(rows, columns) {\n    this.rows = rows;\n    this.columns = columns;\n    this.weights = zeros(rows * columns);\n  }\n  ' + (this.dataFormatter !== null && typeof this.formatDataIn === 'function' ? 'function formatDataIn(input, output) { ' + toInner(this.formatDataIn.toString()).replace('this.dataFormatter', 'json.options.dataFormatter') + ' }' : '') + '\n  ' + (this.dataFormatter !== null && typeof this.formatDataOut === 'function' ? 'function formatDataOut(output) { ' + toInner(this.formatDataIn.toString()).replace('this.dataFormatter', 'json.options.dataFormatter') + ' }' : '') + '\n  ' + (this.dataFormatter !== null ? this.dataFormatter.toFunctionString('json.options.dataFormatter') : '') + '\n  ' + _zeros2.default.toString() + '\n  ' + _softmax2.default.toString().replace('_2.default', 'Matrix') + '\n  ' + _random.randomF.toString() + '\n  ' + _sampleI2.default.toString() + '\n  ' + _maxI2.default.toString());
    }
  }]);

  return RNN;
}();

exports.default = RNN;


RNN.defaults = {
  inputSize: 20,
  inputRange: 20,
  hiddenSizes: [20, 20],
  outputSize: 20,
  learningRate: 0.01,
  decayRate: 0.999,
  smoothEps: 1e-8,
  regc: 0.000001,
  clipval: 5,
  json: null,
  /**
   *
   * @param {*[]} data
   * @returns {Number[]}
   */
  setupData: function setupData(data) {
    if (typeof data[0] !== 'string' && !Array.isArray(data[0]) && (!data[0].hasOwnProperty('input') || !data[0].hasOwnProperty('output'))) {
      return data;
    }
    var values = [];
    var result = [];
    if (typeof data[0] === 'string' || Array.isArray(data[0])) {
      if (this.dataFormatter === null) {
        for (var i = 0; i < data.length; i++) {
          values.push(data[i]);
        }
        this.dataFormatter = new _dataFormatter2.default(values);
      }
      for (var _i = 0, max = data.length; _i < max; _i++) {
        result.push(this.formatDataIn(data[_i]));
      }
    } else {
      if (this.dataFormatter === null) {
        for (var _i2 = 0; _i2 < data.length; _i2++) {
          values.push(data[_i2].input);
          values.push(data[_i2].output);
        }
        this.dataFormatter = _dataFormatter2.default.fromArrayInputOutput(values);
      }
      for (var _i3 = 0, _max = data.length; _i3 < _max; _i3++) {
        result.push(this.formatDataIn(data[_i3].input, data[_i3].output));
      }
    }
    return result;
  },
  /**
   *
   * @param {*[]} input
   * @param {*[]} output
   * @returns {Number[]}
   */
  formatDataIn: function formatDataIn(input) {
    var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (this.dataFormatter !== null) {
      if (this.dataFormatter.indexTable.hasOwnProperty('stop-input')) {
        return this.dataFormatter.toIndexesInputOutput(input, output);
      } else {
        return this.dataFormatter.toIndexes(input);
      }
    }
    return input;
  },
  /**
   *
   * @param {Number[]} input
   * @param {Number[]} output
   * @returns {*}
   */
  formatDataOut: function formatDataOut(input, output) {
    if (this.dataFormatter !== null) {
      return this.dataFormatter.toCharacters(output).join('');
    }
    return output;
  },
  dataFormatter: null
};

RNN.trainDefaults = {
  iterations: 20000,
  errorThresh: 0.005,
  log: false,
  logPeriod: 10,
  learningRate: 0.3,
  callback: null,
  callbackPeriod: 10,
  keepNetworkIntact: false
};

},{"../utilities/data-formatter":35,"../utilities/random":40,"../utilities/zeros":44,"./matrix":15,"./matrix/copy":13,"./matrix/equation":14,"./matrix/max-i":16,"./matrix/random-matrix":22,"./matrix/sample-i":27,"./matrix/softmax":30}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stream = require('stream');

var _lookup = require('./lookup');

var _lookup2 = _interopRequireDefault(_lookup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 *
 * @param opts
 * @returns {TrainStream}
 * @constructor
 */
var TrainStream = function (_Writable) {
  _inherits(TrainStream, _Writable);

  function TrainStream(opts) {
    var _ret;

    _classCallCheck(this, TrainStream);

    var _this = _possibleConstructorReturn(this, (TrainStream.__proto__ || Object.getPrototypeOf(TrainStream)).call(this, {
      objectMode: true
    }));

    opts = opts || {};

    // require the neuralNetwork
    if (!opts.neuralNetwork) {
      throw new Error('no neural network specified');
    }

    _this.neuralNetwork = opts.neuralNetwork;
    _this.dataFormatDetermined = false;

    _this.inputKeys = [];
    _this.outputKeys = []; // keeps track of keys seen
    _this.i = 0; // keep track of the for loop i variable that we got rid of
    _this.iterations = opts.iterations || 20000;
    _this.errorThresh = opts.errorThresh || 0.005;
    _this.log = opts.log ? typeof opts.log === 'function' ? opts.log : console.log : false;
    _this.logPeriod = opts.logPeriod || 10;
    _this.callback = opts.callback;
    _this.callbackPeriod = opts.callbackPeriod || 10;
    _this.floodCallback = opts.floodCallback;
    _this.doneTrainingCallback = opts.doneTrainingCallback;

    _this.size = 0;
    _this.count = 0;

    _this.sum = 0;

    _this.on('finish', _this.finishStreamIteration.bind(_this));

    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  /**
   * _write expects data to be in the form of a datum. ie. {input: {a: 1 b: 0}, output: {z: 0}}
   * @param chunk
   * @param enc
   * @param next
   * @returns {*}
   * @private
   */


  _createClass(TrainStream, [{
    key: '_write',
    value: function _write(chunk, enc, next) {
      if (!chunk) {
        // check for the end of one iteration of the stream
        this.emit('finish');
        return next();
      }

      if (!this.dataFormatDetermined) {
        this.size++;
        this.inputKeys = uniques(this.inputKeys.slice(0).concat(Object.keys(chunk.input)));
        this.outputKeys = uniques(this.outputKeys.slice(0).concat(Object.keys(chunk.output)));
        this.firstDatum = this.firstDatum || chunk;
        return next();
      }

      this.count++;

      var data = this.neuralNetwork.formatData(chunk);
      this.trainDatum(data[0]);

      // tell the Readable Stream that we are ready for more data
      next();
    }

    /**
     *
     * @param datum
     */

  }, {
    key: 'trainDatum',
    value: function trainDatum(datum) {
      var err = this.neuralNetwork.trainPattern(datum.input, datum.output);
      this.sum += err;
    }

    /**
     *
     * @returns {*}
     */

  }, {
    key: 'finishStreamIteration',
    value: function finishStreamIteration() {
      if (this.dataFormatDetermined && this.size !== this.count) {
        this.log('This iteration\'s data length was different from the first.');
      }

      if (!this.dataFormatDetermined) {
        // create the lookup
        this.neuralNetwork.inputLookup = _lookup2.default.lookupFromArray(this.inputKeys);
        if (this.firstDatum.output.constructor !== Array) {
          this.neuralNetwork.outputLookup = _lookup2.default.lookupFromArray(this.outputKeys);
        }

        var data = this.neuralNetwork.formatData(this.firstDatum);
        var sizes = [];
        var inputSize = data[0].input.length;
        var outputSize = data[0].output.length;
        var hiddenSizes = this.hiddenSizes;
        if (!hiddenSizes) {
          sizes.push(Math.max(3, Math.floor(inputSize / 2)));
        } else {
          hiddenSizes.forEach(function (size) {
            sizes.push(size);
          });
        }

        sizes.unshift(inputSize);
        sizes.push(outputSize);

        this.dataFormatDetermined = true;
        this.neuralNetwork.initialize(sizes);

        if (typeof this.floodCallback === 'function') {
          this.floodCallback();
        }
        return;
      }

      var error = this.sum / this.size;

      if (this.log && this.i % this.logPeriod == 0) {
        this.log('iterations:', this.i, 'training error:', error);
      }
      if (this.callback && this.i % this.callbackPeriod == 0) {
        this.callback({
          error: error,
          iterations: this.i
        });
      }

      this.sum = 0;
      this.count = 0;
      // update the iterations
      this.i++;

      // do a check here to see if we need the stream again
      if (this.i < this.iterations && error > this.errorThresh) {
        if (typeof this.floodCallback === 'function') {
          return this.floodCallback();
        }
      } else {
        // done training
        if (typeof this.doneTrainingCallback === 'function') {
          return this.doneTrainingCallback({
            error: error,
            iterations: this.i
          });
        }
      }
    }
  }]);

  return TrainStream;
}(_stream.Writable);

/**
 *
 * https://gist.github.com/telekosmos/3b62a31a5c43f40849bb
 * @param arr
 * @returns {Array}
 */


exports.default = TrainStream;
function uniques(arr) {
  // Sets cannot contain duplicate elements, which is what we want
  return [].concat(_toConsumableArray(new Set(arr)));
}

},{"./lookup":4,"stream":86}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * @param {String[]|Number[]} values
 * @param maxThreshold
 * @constructor
 */
var DataFormatter = function () {
  function DataFormatter(values) {
    var maxThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, DataFormatter);

    if (values === undefined) return;

    this.values = values;
    // go over all characters and keep track of all unique ones seen
    // count up all characters
    this.indexTable = {};
    this.characterTable = {};
    this.characters = [];
    this.buildCharactersFromIterable(values);
    this.buildTables(maxThreshold);
  }

  _createClass(DataFormatter, [{
    key: 'buildCharactersFromIterable',
    value: function buildCharactersFromIterable(values) {
      var tempCharactersTable = {};
      for (var dataFormatterIndex = 0, dataFormatterLength = values.length; dataFormatterIndex < dataFormatterLength; dataFormatterIndex++) {
        var characters = values[dataFormatterIndex];

        if (characters.hasOwnProperty('length')) {
          for (var characterIndex = 0, charactersLength = characters.length; characterIndex < charactersLength; characterIndex++) {
            var character = characters[characterIndex];
            if (tempCharactersTable.hasOwnProperty(character)) continue;
            tempCharactersTable[character] = true;
            this.characters.push(character);
          }
        } else {
          var _character = values[dataFormatterIndex];
          if (tempCharactersTable.hasOwnProperty(_character)) continue;
          tempCharactersTable[dataFormatterIndex] = true;
          this.characters.push(_character);
        }
      }
    }
  }, {
    key: 'buildTables',
    value: function buildTables(maxThreshold) {
      // filter by count threshold and create pointers
      var charactersLength = this.characters.length;
      for (var characterIndex = 0; characterIndex < charactersLength; characterIndex++) {
        var character = this.characters[characterIndex];
        if (characterIndex >= maxThreshold) {
          // add character to dataFormatter
          this.indexTable[character] = characterIndex;
          this.characterTable[characterIndex] = character;
        }
      }
    }
  }, {
    key: 'toIndexes',
    value: function toIndexes(value) {
      var maxThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var result = [];
      var indexTable = this.indexTable;

      for (var i = 0, max = value.length; i < max; i++) {
        var character = value[i];
        var index = indexTable[character];
        if (index === undefined) {
          throw new Error('unrecognized character "' + character + '"');
        }
        if (index < maxThreshold) continue;
        result.push(index);
      }

      return result;
    }
  }, {
    key: 'toIndexesInputOutput',
    value: function toIndexesInputOutput(value1) {
      var value2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var maxThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var result = void 0;
      if (typeof value1 === 'string') {
        result = this.toIndexes(value1.split('').concat(['stop-input', 'start-output']), maxThreshold);
      } else {
        result = this.toIndexes(value1.concat(['stop-input', 'start-output']), maxThreshold);
      }

      if (value2 === null) return result;

      if (typeof value2 === 'string') {
        return result.concat(this.toIndexes(value2.split(''), maxThreshold));
      } else {
        return result.concat(this.toIndexes(value2, maxThreshold));
      }
    }
  }, {
    key: 'toCharacters',
    value: function toCharacters(indices) {
      var maxThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var result = [];
      var characterTable = this.characterTable;

      for (var i = 0, max = indices.length; i < max; i++) {
        var index = indices[i];
        if (index < maxThreshold) continue;
        var character = characterTable[index];
        if (character === undefined) {
          throw new Error('unrecognized index "' + index + '"');
        }
        result.push(character);
      }

      return result;
    }
  }, {
    key: 'toString',
    value: function toString(indices, maxThreshold) {
      return this.toCharacters(indices, maxThreshold).join('');
    }
  }, {
    key: 'addInputOutput',
    value: function addInputOutput() {
      this.addSpecial('stop-input');
      this.addSpecial('start-output');
    }
  }, {
    key: 'addSpecial',
    value: function addSpecial() {
      for (var i = 0; i < arguments.length; i++) {
        var special = arguments[i];
        var specialIndex = this.indexTable[special] = this.characters.length;
        this.characterTable[specialIndex] = special;
        this.characters.push(special);
      }
    }
  }, {
    key: 'toFunctionString',
    value: function toFunctionString(dataFormatterVariableName) {
      return '\n' + this.toIndexes.toString().replace('this', dataFormatterVariableName) + '\n' + this.toIndexesInputOutput.toString().replace('this', dataFormatterVariableName) + '\n' + this.toCharacters.toString().replace('this', dataFormatterVariableName) + '\n';
    }
  }], [{
    key: 'fromAllPrintable',
    value: function fromAllPrintable(maxThreshold) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['\n'];

      for (var i = 32; i <= 126; i++) {
        values.push(String.fromCharCode(i));
      }
      return new DataFormatter(values, maxThreshold);
    }
  }, {
    key: 'fromAllPrintableInputOutput',
    value: function fromAllPrintableInputOutput(maxThreshold) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['\n'];

      var dataFormatter = DataFormatter.fromAllPrintable(maxThreshold, values);
      dataFormatter.addInputOutput();
      return dataFormatter;
    }
  }, {
    key: 'fromStringInputOutput',
    value: function fromStringInputOutput(string, maxThreshold) {
      var _String$prototype;

      var values = (_String$prototype = String.prototype).concat.apply(_String$prototype, _toConsumableArray(new Set(string)));
      var dataFormatter = new DataFormatter(values, maxThreshold);
      dataFormatter.addInputOutput();
      return dataFormatter;
    }
  }, {
    key: 'fromArrayInputOutput',
    value: function fromArrayInputOutput(array, maxThreshold) {
      var dataFormatter = new DataFormatter(array.filter(function (v, i, a) {
        return a.indexOf(v) === i;
      }).sort(), maxThreshold);
      dataFormatter.addInputOutput();
      return dataFormatter;
    }
  }, {
    key: 'fromString',
    value: function fromString(string, maxThreshold) {
      var _String$prototype2;

      var values = (_String$prototype2 = String.prototype).concat.apply(_String$prototype2, _toConsumableArray(new Set(string)));
      return new DataFormatter(values, maxThreshold);
    }
  }, {
    key: 'fromJSON',
    value: function fromJSON(json) {
      var dataFormatter = new DataFormatter();
      dataFormatter.indexTable = json.indexTable;
      dataFormatter.characterTable = json.characterTable;
      dataFormatter.values = json.values;
      dataFormatter.characters = json.characters;
      return dataFormatter;
    }
  }]);

  return DataFormatter;
}();

exports.default = DataFormatter;

},{}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = max;

var _toArray = require('./to-array');

var _toArray2 = _interopRequireDefault(_toArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param values
 * @returns {number}
 */
function max(values) {
  return Math.max.apply(Math, (0, _toArray2.default)(values));
}

},{"./to-array":43}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mse;
function mse(errors) {
  // mean squared error
  var sum = 0;
  for (var i = 0; i < errors.length; i++) {
    sum += Math.pow(errors[i], 2);
  }
  return sum / errors.length;
}

},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ones;
function ones(size) {
  // if (typeof Float64Array !== 'undefined') return new Float64Array(size).fill(1);
  var array = new Array(size);
  for (var i = 0; i < size; i++) {
    array[i] = i;
  }
  return array;
}

},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = randomWeight;
function randomWeight() {
  return Math.random() * 0.4 - 0.2;
}

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomF = randomF;
exports.randomI = randomI;
exports.randomN = randomN;
function randomF(a, b) {
  return Math.random() * (b - a) + a;
}

function randomI(a, b) {
  return Math.floor(Math.random() * (b - a) + a);
}

function randomN(mu, std) {
  return mu + gaussRandom() * std;
}

// Random numbers utils
function gaussRandom() {
  if (gaussRandom.returnV) {
    gaussRandom.returnV = false;
    return gaussRandom.vVal;
  }
  var u = 2 * Math.random() - 1;
  var v = 2 * Math.random() - 1;
  var r = u * u + v * v;
  if (r == 0 || r > 1) {
    return gaussRandom();
  }
  var c = Math.sqrt(-2 * Math.log(r) / r);
  gaussRandom.vVal = v * c; // cache this
  gaussRandom.returnV = true;
  return u * c;
}
gaussRandom.returnV = false;
gaussRandom.vVal = 0;

},{}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = randos;

var _randomWeight = require('./random-weight');

var _randomWeight2 = _interopRequireDefault(_randomWeight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function randos(size) {
  var array = new Array(size);
  for (var i = 0; i < size; i++) {
    array[i] = (0, _randomWeight2.default)();
  }
  return array;
}

},{"./random-weight":39}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = range;
/**
 *
 * @param start
 * @param end
 * @returns {Array}
 */
function range(start, end) {
  var result = [];
  for (; start < end; start++) {
    result.push(start);
  }
  return result;
}

},{}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toArray;
/**
 *
 * @param values
 * @returns {*}
 */
function toArray(values) {
  values = values || [];
  if (Array.isArray(values)) {
    return values;
  } else {
    return Object.keys(values).map(function (key) {
      return values[key];
    });
  }
}

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zeros;
function zeros(size) {
  // if (typeof Float64Array !== 'undefined') return new Float64Array(size);
  var array = new Array(size);
  for (var i = 0; i < size; i++) {
    array[i] = 0;
  }
  return array;
}

},{}],45:[function(require,module,exports){
var crossValidate = require('./dist/cross-validate').default;
var likely = require('./dist/likely').default;
var lookup = require('./dist/lookup').default;
var NeuralNetwork = require('./dist/neural-network').default;
var NeuralNetworkGPU = require('./dist/neural-network-gpu').default;
var TrainStream = require('./dist/train-stream').default;
var RNN = require('./dist/recurrent/rnn').default;
var LSTM = require('./dist/recurrent/lstm').default;
var GRU = require('./dist/recurrent/gru').default;
var utilities = {
  max: require('./dist/utilities/max').default,
  mse: require('./dist/utilities/mse').default,
  ones: require('./dist/utilities/ones').default,
  random: require('./dist/utilities/random').default,
  randomWeight: require('./dist/utilities/random-weight').default,
  randos: require('./dist/utilities/randos').default,
  range: require('./dist/utilities/range').default,
  toArray: require('./dist/utilities/to-array').default,
  DataFormatter: require('./dist/utilities/data-formatter').default,
  zeros: require('./dist/utilities/zeros').default
};

var brain = {
  crossValidate: crossValidate,
  likely: likely,
  lookup: lookup,
  NeuralNetwork: NeuralNetwork,
  NeuralNetworkGPU: NeuralNetworkGPU,
  TrainStream: TrainStream,
  recurrent: {
    RNN: RNN,
    LSTM: LSTM,
    GRU: GRU,
  },
  utilities: utilities
};

if (typeof window !== 'undefined') {
  window.brain = brain;
} else {
  module.exports = brain;
}
},{"./dist/cross-validate":2,"./dist/likely":3,"./dist/lookup":4,"./dist/neural-network":6,"./dist/neural-network-gpu":5,"./dist/recurrent/gru":7,"./dist/recurrent/lstm":8,"./dist/recurrent/rnn":33,"./dist/train-stream":34,"./dist/utilities/data-formatter":35,"./dist/utilities/max":36,"./dist/utilities/mse":37,"./dist/utilities/ones":38,"./dist/utilities/random":40,"./dist/utilities/random-weight":39,"./dist/utilities/randos":41,"./dist/utilities/range":42,"./dist/utilities/to-array":43,"./dist/utilities/zeros":44}],46:[function(require,module,exports){
'use strict';

const FunctionBuilderBase = require('../function-builder-base');
const CPUFunctionNode = require('./function-node');

/**
 * @class CPUFunctionBuilder
 *
 * @extends FunctionBuilderBase
 *
 * @desc Builds functions to execute on CPU from JavaScript function Strings
 *
 */
module.exports = class CPUFunctionBuilder extends FunctionBuilderBase {
	addFunction(functionName, jsFunction, paramTypes, returnType) {
		this.addFunctionNode(
			new CPUFunctionNode(functionName, jsFunction, paramTypes, returnType)
			.setAddFunction(this.addFunction.bind(this))
		);
	}

	/**
	 * @memberOf CPUFunctionBuilder#
	 * @function
	 * @name getPrototypeString
	 *
	 * @desc Return the JS Function String optimized for cpu.
	 *
	 * @param {String} functionName - Function name to trace from. If null, it returns the WHOLE builder stack
	 *
	 * @returns {String} Function String
	 *
	 */
	getPrototypeString() {
		let ret = '';
		for (let p in this.nodeMap) {
			if (!this.nodeMap.hasOwnProperty(p)) continue;
			const node = this.nodeMap[p];
			if (node.isSubKernel) {
				ret += `var ${ node.functionName } = ` + node.jsFunctionString.replace('return', `return ${ node.functionName }Result[this.thread.z][this.thread.y][this.thread.x] =`) + '.bind(this);\n';
			} else {
				ret += `var ${ node.functionName } = ${ node.jsFunctionString };\n`;
			}
		}
		return ret;
	}

	/**
	 * @memberOf CPUFunctionBuilder#
	 * @function
	 * @name addSubKernel
	 *
	 * @desc Add a new sub-kernel to the current kernel instance
	 *
	 * @param {Function} jsFunction - Sub-kernel function (JavaScript)
	 * @param {Array} paramNames - Parameters of the sub-kernel
	 * @param {Array} returnType - Return type of the subKernel
	 *
	 */
	addSubKernel(jsFunction, paramTypes, returnType) {
		const node = new CPUFunctionNode(null, jsFunction, paramTypes, returnType)
			.setAddFunction(this.addFunction.bind(this));
		node.isSubKernel = true;
		this.addFunctionNode(node);
	}
};
},{"../function-builder-base":51,"./function-node":47}],47:[function(require,module,exports){
'use strict';

const BaseFunctionNode = require('../function-node-base');

/**
 * @class CPUFunctionNode
 * 
 * @extends BaseFunctionNode
 *
 * @desc [INTERNAL] Represents a single function, inside JS, webGL, or openGL.
 *
 * <p>This handles all the raw state, converted state, etc. Of a single function.</p>
 *
 * @prop functionName         - {String}        Name of the function
 * @prop jsFunction           - {Function}   The JS Function the node represents
 * @prop jsFunctionString     - {String}        jsFunction.toString()
 * @prop paramNames           - {String[]}  Parameter names of the function
 * @prop paramTypes           - {String[]}  Shader land parameters type assumption
 * @prop isRootKernel         - {Boolean}       Special indicator, for kernel function
 * @prop webglFunctionString  - {String}        webgl converted function string
 * @prop openglFunctionString - {String}        opengl converted function string
 * @prop calledFunctions      - {String[]}  List of all the functions called
 * @prop initVariables        - {String[]}  List of variables initialized in the function
 * @prop readVariables        - {String[]}  List of variables read operations occur
 * @prop writeVariables       - {String[]}  List of variables write operations occur
 *
 */
module.exports = class CPUFunctionNode extends BaseFunctionNode {
	generate(options) {
		this.functionString = this.jsFunctionString;
	}

	/**
	 * @memberOf CPUFunctionNode#
	 * @function
	 * @name getFunctionPrototypeString
	 *
	 * @desc Returns the converted webgl shader function equivalent of the JS function
	 *
	 * @returns {String} webgl function string, result is cached under this.getFunctionPrototypeString
	 *
	 */
	getFunctionPrototypeString(options) {
		return this.functionString;
	}
};
},{"../function-node-base":52}],48:[function(require,module,exports){
'use strict';

const utils = require('../../core/utils');
const kernelRunShortcut = require('../kernel-run-shortcut');

module.exports = function(cpuKernel, name) {
	return `() => {
    ${ kernelRunShortcut.toString() };
    const utils = {
      allPropertiesOf: function ${ utils.allPropertiesOf.toString() },
      clone: function ${ utils.clone.toString() },
      /*splitArray: function ${ utils.splitArray.toString() },
      getArgumentType: function ${ utils.getArgumentType.toString() },
      getDimensions: function ${ utils.getDimensions.toString() },
      dimToTexSize: function ${ utils.dimToTexSize.toString() },
      copyFlatten: function ${ utils.copyFlatten.toString() },
      flatten: function ${ utils.flatten.toString() },
      systemEndianness: '${ utils.systemEndianness() }',
      initWebGl: function ${ utils.initWebGl.toString() },
      isArray: function ${ utils.isArray.toString() }*/
    };
    class ${ name || 'Kernel' } {
      constructor() {        
        this.argumentsLength = 0;
        this._canvas = null;
        this._webGl = null;
        this.built = false;
        this.program = null;
        this.paramNames = ${ JSON.stringify(cpuKernel.paramNames) };
        this.paramTypes = ${ JSON.stringify(cpuKernel.paramTypes) };
        this.texSize = ${ JSON.stringify(cpuKernel.texSize) };
        this.dimensions = ${ JSON.stringify(cpuKernel.dimensions) };
        this._kernelString = \`${ cpuKernel._kernelString }\`;
		    this.run = function() {
          this.run = null;
          this.build();
          return this.run.apply(this, arguments);
        }.bind(this);
        this.thread = {
          x: 0,
          y: 0,
          z: 0
        };
        this.runDimensions = {
          x: null,
          y: null,
          z: null
        };
      }
      setCanvas(canvas) { this._canvas = canvas; return this; }
      setWebGl(webGl) { this._webGl = webGl; return this; }
      ${ cpuKernel.build.toString() }
      run () { ${ cpuKernel.kernelString } }
      getKernelString() { return this._kernelString; }
    };
    return kernelRunShortcut(new Kernel());
  };`;
};
},{"../../core/utils":70,"../kernel-run-shortcut":54}],49:[function(require,module,exports){
'use strict';

const KernelBase = require('../kernel-base');
const utils = require('../../core/utils');
const kernelString = require('./kernel-string');

module.exports = class CPUKernel extends KernelBase {

	/**
	 * @constructor CPUKernel
	 *
	 * @desc Kernel Implementation for CPU.
	 * 
	 * <p>Instantiates properties to the CPU Kernel.</p>
	 *
	 * @extends KernelBase
	 *
	 * @prop {Object} thread - The thread dimensions, x, y and z
	 * @prop {Object} runDimensions - The canvas dimensions
	 * @prop {Object} functionBuilder - Function Builder instance bound to this Kernel
	 * @prop {Function} run - Method to run the kernel
	 *
	 */
	constructor(fnString, settings) {
		super(fnString, settings);
		this._fnBody = utils.getFunctionBodyFromString(fnString);
		this.functionBuilder = settings.functionBuilder;
		this._fn = null;
		this.run = null;
		this._canvasCtx = null;
		this._imageData = null;
		this._colorData = null;
		this._kernelString = null;
		this.thread = {
			x: 0,
			y: 0,
			z: 0
		};
		this.runDimensions = {
			x: null,
			y: null,
			z: null
		};

		this.run = function() {
			this.run = null;
			this.build();
			return this.run.apply(this, arguments);
		}.bind(this);
	}

	/**
	 * @memberOf CPUKernel#
	 * @function
	 * @name validateOptions
	 *
	 * @desc Validate options related to CPU Kernel, such as 
	 * dimensions size, and auto dimension support.
	 *
	 */
	validateOptions() {
		if (!this.dimensions || this.dimensions.length === 0) {
			if (arguments.length !== 1) {
				throw 'Auto dimensions only supported for kernels with only one input';
			}

			const argType = utils.getArgumentType(arguments[0]);
			if (argType === 'Array') {
				this.dimensions = utils.getDimensions(argType);
			} else if (argType === 'Texture') {
				this.dimensions = arguments[0].dimensions;
			} else {
				throw 'Auto dimensions not supported for input type: ' + argType;
			}
		}
	}

	/**
	 * @memberOf CPUKernel#
	 * @function
	 * @name build
	 *
	 * @desc Builds the Kernel, by generating the kernel 
	 * string using thread dimensions, and arguments 
	 * supplied to the kernel.
	 *
	 * <p>If the graphical flag is enabled, canvas is used.</p>
	 *
	 */
	build() {

		//
		// NOTE: these are optional safety checks
		//       does not actually do anything
		//
		const kernelArgs = [];
		for (let i = 0; i < arguments.length; i++) {
			const argType = utils.getArgumentType(arguments[i]);
			if (argType === 'Array' || argType === 'Number') {
				kernelArgs[i] = arguments[i];
			} else if (argType === 'Texture') {
				kernelArgs[i] = arguments[i].toArray();
			} else {
				throw 'Input type not supported (CPU): ' + arguments[i];
			}
		}

		const threadDim = this.threadDim || (this.threadDim = utils.clone(this.dimensions));

		while (threadDim.length < 3) {
			threadDim.push(1);
		}

		if (this.graphical) {
			const canvas = this.getCanvas();
			this.runDimensions.x = canvas.width = threadDim[0];
			this.runDimensions.y = canvas.height = threadDim[1];
			this._canvasCtx = canvas.getContext('2d');
			this._imageData = this._canvasCtx.createImageData(threadDim[0], threadDim[1]);
			this._colorData = new Uint8ClampedArray(threadDim[0] * threadDim[1] * 4);
		}

		const kernelString = this.getKernelString();

		if (this.debug) {
			console.log('Options:');
			console.dir(this);
			console.log('Function output:');
			console.log(kernelString);
		}

		this.kernelString = kernelString;
		this.run = new Function([], kernelString).bind(this)();
	}

	color(r, g, b, a) {
		if (typeof a === 'undefined') {
			a = 1;
		}

		r = Math.floor(r * 255);
		g = Math.floor(g * 255);
		b = Math.floor(b * 255);
		a = Math.floor(a * 255);

		const width = this.runDimensions.x;
		const height = this.runDimensions.y;

		const x = this.thread.x;
		const y = height - this.thread.y - 1;

		const index = x + y * width;

		this._colorData[index * 4 + 0] = r;
		this._colorData[index * 4 + 1] = g;
		this._colorData[index * 4 + 2] = b;
		this._colorData[index * 4 + 3] = a;
	}

	/**
	 * @memberOf CPUKernel#
	 * @function
	 * @name getKernelString
	 *
	 * @desc Generates kernel string for this kernel program.
	 * 
	 * <p>If sub-kernels are supplied, they are also factored in.
	 * This string can be saved by calling the `toString` method
	 * and then can be reused later.</p>
	 *
	 * @returns {String} result
	 *
	 */
	getKernelString() {
		if (this._kernelString !== null) return this._kernelString;

		const paramNames = this.paramNames;
		const builder = this.functionBuilder;

		// Thread dim fix (to make compilable)
		const threadDim = this.threadDim || (this.threadDim = utils.clone(this.dimensions));
		while (threadDim.length < 3) {
			threadDim.push(1);
		}

		if (this.subKernels !== null) {
			this.subKernelOutputTextures = [];
			this.subKernelOutputVariableNames = [];
			for (let i = 0; i < this.subKernels.length; i++) {
				const subKernel = this.subKernels[i];
				builder.addSubKernel(subKernel);
				this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
			}

		} else if (this.subKernelProperties !== null) {
			this.subKernelOutputVariableNames = [];
			let i = 0;
			for (let p in this.subKernelProperties) {
				if (!this.subKernelProperties.hasOwnProperty(p)) continue;
				const subKernel = this.subKernelProperties[p];
				builder.addSubKernel(subKernel);
				this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
				i++;
			}
		}

		return this._kernelString = `
  ${ this.constants ? Object.keys(this.constants).map((key) => { return `var ${ key } = ${ this.constants[key] }`; }).join(';\n') + ';\n' : '' }
  ${ this.subKernelOutputVariableNames === null
        ? ''
        : this.subKernelOutputVariableNames.map((name) => `  var ${ name } = null;\n`).join('')
        }
      ${ builder.getPrototypeString() }
      var fn = function fn(${ this.paramNames.join(', ') }) { ${ this._fnBody } }.bind(this);
    return function (${ this.paramNames.join(', ') }) {
    var ret = new Array(${ threadDim[2] });
  ${ this.subKernelOutputVariableNames === null
        ? ''
        : this.subKernelOutputVariableNames.map((name) => `  ${ name } = new Array(${ threadDim[2] });\n`).join('')
        }
    for (this.thread.z = 0; this.thread.z < ${ threadDim[2] }; this.thread.z++) {
      ret[this.thread.z] = new Array(${ threadDim[1] });
  ${ this.subKernelOutputVariableNames === null
        ? ''
        : this.subKernelOutputVariableNames.map((name) => `    ${ name }[this.thread.z] = new Array(${ threadDim[1] });\n`).join('')
        }
      for (this.thread.y = 0; this.thread.y < ${ threadDim[1] }; this.thread.y++) {
        ret[this.thread.z][this.thread.y] = new Array(${ threadDim[0] });
  ${ this.subKernelOutputVariableNames === null
        ? ''
        : this.subKernelOutputVariableNames.map((name) => `      ${ name }[this.thread.z][this.thread.y] = new Array(${ threadDim[0] });\n`).join('')
        }
        for (this.thread.x = 0; this.thread.x < ${ threadDim[0] }; this.thread.x++) {
          ret[this.thread.z][this.thread.y][this.thread.x] = fn(${ this.paramNames.join(', ') });
        }
      }
    }
    
    if (this.graphical) {
      this._imageData.data.set(this._colorData);
      this._canvasCtx.putImageData(this._imageData, 0, 0);
      return;
    }
    
    if (this.dimensions.length === 1) {
      ret = ret[0][0];
      ${ this.subKernelOutputVariableNames === null
        ? ''
        : this.subKernelOutputVariableNames.map((name) => `    ${ name } = ${ name }[0][0];\n`).join('')
        }
      
    } else if (this.dimensions.length === 2) {
      ret = ret[0];
      ${ this.subKernelOutputVariableNames === null
        ? ''
        : this.subKernelOutputVariableNames.map((name) => `    ${ name } = ${ name }[0];\n`).join('')
        }
    }
    
    ${ this.subKernelOutputVariableNames === null
        ? 'return ret;\n'
        : this.subKernels !== null
          ? `var result = [
        ${ this.subKernelOutputVariableNames.map((name) => `${ name }`).join(',\n') }
      ];
      result.result = ret;
      return result;\n`
          : `return {
        result: ret,
        ${ Object.keys(this.subKernelProperties).map((name, i) => `${ name }: ${ this.subKernelOutputVariableNames[i] }`).join(',\n') }
      };`
        }
    }.bind(this);`;
	}

	/**
	 * @memberOf CPUKernel#
	 * @function
	 * @name toString
	 *
	 * @desc Returns the *pre-compiled* Kernel as a JS Object String, that can be reused.
	 *
	 */
	toString() {
		return kernelString(this);
	}

	/**
	 * @memberOf CPUKernel#
	 * @function
	 * @name precompileKernelObj
	 *
	 * @desc Precompile the kernel into a single object, 
	 * that can be used for building the execution kernel subsequently.
	 *
	 * @param {Array} argTypes - Array of argument types
	 *     
	 * Return:
	 *     Compiled kernel {Object}
	 *
	 */
	precompileKernelObj(argTypes) {

		const threadDim = this.threadDim || (this.threadDim = utils.clone(this.dimensions));


		return {
			threadDim: threadDim
		};
	}

	/**
	 * @memberOf CPUKernel
	 * @function
	 * @name compileKernel
	 * @static
	 *
	 * @desc Takes a previously precompiled kernel object,
	 * and complete compilation into a full kernel
	 * 
	 * @returns {Function} Compiled kernel
	 *
	 */
	static compileKernel(precompileObj) {

		// Extract values from precompiled obj
		const threadDim = precompileObj.threadDim;

		// Normalize certain values : For actual build
		while (threadDim.length < 3) {
			threadDim.push(1);
		}

	}


};
},{"../../core/utils":70,"../kernel-base":53,"./kernel-string":48}],50:[function(require,module,exports){
'use strict';

const utils = require('../../core/utils');
const RunnerBase = require('../runner-base');
const CPUKernel = require('./kernel');
const CPUFunctionBuilder = require('./function-builder');

module.exports = class CPURunner extends RunnerBase {

	/**
	 * @constructor CPURunner
	 *
	 * @desc Instantiates a Runner instance for the kernel.
	 * 
	 * @extends RunnerBase
	 *
	 * @param {Object} settings - Settings to instantiate properties in RunnerBase, with given values
	 *
	 */

	constructor(settings) {
		super(new CPUFunctionBuilder(), settings);
		this.Kernel = CPUKernel;
		this.kernel = null;
	}

	/**
	 * @memberOf CPURunner#
	 * @function
	 * @name getMode()
	 *
	 * Return the current mode in which gpu.js is executing.
	 * 
	 * @returns {String} The current mode; "cpu".
	 *
	 */
	getMode() {
		return 'cpu';
	}
};
},{"../../core/utils":70,"../runner-base":55,"./function-builder":46,"./kernel":49}],51:[function(require,module,exports){
'use strict';

module.exports = class FunctionBuilderBase {

	/**
	 * @constructor FunctionBuilderBase
	 *
	 * @desc This handles all the raw state, converted state, etc. of a single function.
	 * [INTERNAL] A collection of functionNodes.
	 * 
	 * @prop {Object} nodeMap - Object map, where nodeMap[function] = new FunctionNode;
	 * @prop {Object} gpu - The current gpu instance bound to this builder
	 * @prop {Object} rootKernel - The root kernel object, contains the paramNames, dimensions etc.
	 * 
	 */
	constructor(gpu) {
		this.nodeMap = {};
		this.gpu = gpu;
		this.rootKernel = null;
	}

	/**
	 * @memberOf FunctionBuilderBase#
	 * @function
	 * @name addFunction
	 *
	 * @desc Instantiates a FunctionNode, and add it to the nodeMap
	 *
	 * @param {GPU} gpu - The GPU instance
	 * @param {String} functionName - Function name to assume, if its null, it attempts to extract from the function
	 * @param {Function} jsFunction - JS Function to do conversion
	 * @param {String[]|Object} paramTypes - Parameter type array, assumes all parameters are 'float' if null
	 * @param {String} returnType - The return type, assumes 'float' if null
	 *
	 */
	addFunction(functionName, jsFunction, paramTypes, returnType) {
		throw new Error('addFunction not supported on base');
	}

	/**
	 * @memberOf FunctionBuilderBase#
	 * @function
	 * @name addFunctionNode
	 *
	 * @desc Add the funciton node directly
	 *
	 * @param {functionNode} inNode - functionNode to add
	 *
	 */
	addFunctionNode(inNode) {
		this.nodeMap[inNode.functionName] = inNode;
		if (inNode.isRootKernel) {
			this.rootKernel = inNode;
		}
	}

	/**
	 * @memberOf FunctionBuilderBase#
	 * @function
	 * @name traceFunctionCalls
	 *
	 * @desc Trace all the depending functions being called, from a single function
	 *
	 * This allow for 'unneeded' functions to be automatically optimized out.
	 * Note that the 0-index, is the starting function trace.
	 *
	 * @param {String} functionName - Function name to trace from, default to 'kernel'
	 * @param {String[]} retList - Returning list of function names that is traced. Including itself.
	 *
	 * @returns {String[]}  Returning list of function names that is traced. Including itself.
	 */
	traceFunctionCalls(functionName, retList, parent) {
		functionName = functionName || 'kernel';
		retList = retList || [];

		const fNode = this.nodeMap[functionName];
		if (fNode) {
			// Check if function already exists
			if (retList.indexOf(functionName) >= 0) {
				// Does nothing if already traced
			} else {
				retList.push(functionName);
				fNode.parent = parent;
				fNode.getFunctionString(); //ensure JS trace is done
				for (let i = 0; i < fNode.calledFunctions.length; ++i) {
					this.traceFunctionCalls(fNode.calledFunctions[i], retList, fNode);
				}
			}
		}

		return retList;
	}




	//---------------------------------------------------------
	//
	//  Polyfill stuff
	//
	//---------------------------------------------------------

	// Round function used in polyfill
	static round(a) {
		return round(a);
	}

	/**
	 * @memberOf FunctionBuilderBase#
	 * @function
	 * @name polyfillStandardFunctions
	 *
	 * @desc Polyfill in the missing Math functions (round)
	 *
	 */
	polyfillStandardFunctions() {
		this.addFunction('round', round);
	}
};

function round(a) {
	return Math.floor(a + 0.5);
}
},{}],52:[function(require,module,exports){
'use strict';

const utils = require('../core/utils');
const parser = require('../core/parser').parser;

module.exports = class BaseFunctionNode {

	/**
	 * @constructor FunctionNodeBase
	 * 
	 * @desc Represents a single function, inside JS, webGL, or openGL.
	 * 
	 * <p>This handles all the raw state, converted state, etc. Of a single function.</p>
	 * 
	 * @prop {String} functionName - Name of the function
	 * @prop {Function} jsFunction - The JS Function the node represents
	 * @prop {String} jsFunctionString - jsFunction.toString()
	 * @prop {String[]} paramNames - Parameter names of the function
	 * @prop {String[]} paramTypes - Shader land parameters type assumption
	 * @prop {Boolean} isRootKernel - Special indicator, for kernel function
	 * @prop {String} webglFunctionString - webgl converted function string
	 * @prop {String} openglFunctionString - opengl converted function string
	 * @prop {String[]} calledFunctions - List of all the functions called
	 * @prop {String[]} initVariables - List of variables initialized in the function
	 * @prop {String[]} readVariables - List of variables read operations occur
	 * @prop {String[]} writeVariables - List of variables write operations occur
	 * 
	 * @param {GPU} gpu - The GPU instance
	 * @param {String} functionName - Function name to assume, if its null, it attempts to extract from the function
	 * @param {Function|String} jsFunction - JS Function to do conversion
	 * @param {String[]|Object} paramTypes - Parameter type array, assumes all parameters are 'float' if null
	 * @param {String} returnType - The return type, assumes 'float' if null
	 *
	 */
	constructor(functionName, jsFunction, options, paramTypes, returnType) {
		//
		// Internal vars setup
		//
		this.calledFunctions = [];
		this.calledFunctionsArguments = {};
		this.initVariables = [];
		this.readVariables = [];
		this.writeVariables = [];
		this.addFunction = null;
		this.isRootKernel = false;
		this.isSubKernel = false;
		this.parent = null;
		this.debug = null;
		this.prototypeOnly = null;
		this.constants = null;

		if (options) {
			if (options.hasOwnProperty('debug')) {
				this.debug = options.debug;
			}
			if (options.hasOwnProperty('prototypeOnly')) {
				this.prototypeOnly = options.prototypeOnly;
			}
			if (options.hasOwnProperty('constants')) {
				this.constants = options.constants;
			}
			if (options.hasOwnProperty('loopMaxIterations')) {
				this.loopMaxIterations = options.loopMaxIterations;
			}
		}

		//
		// Missing jsFunction object exception
		//
		if (!jsFunction) {
			throw 'jsFunction, parameter is missing';
		}

		//
		// Setup jsFunction and its string property + validate them
		//
		this.jsFunctionString = jsFunction.toString();
		if (!utils.isFunctionString(this.jsFunctionString)) {
			console.error('jsFunction, to string conversion check failed: not a function?', this.jsFunctionString);
			throw 'jsFunction, to string conversion check failed: not a function?';
		}

		if (!utils.isFunction(jsFunction)) {
			//throw 'jsFunction, is not a valid JS Function';
			this.jsFunction = null;
		} else {
			this.jsFunction = jsFunction;
		}

		//
		// Setup the function name property
		//
		this.functionName = functionName ||
			(jsFunction && jsFunction.name) ||
			utils.getFunctionNameFromString(this.jsFunctionString);

		if (!(this.functionName)) {
			throw 'jsFunction, missing name argument or value';
		}

		//
		// Extract parameter name, and its argument types
		//
		this.paramNames = utils.getParamNamesFromString(this.jsFunctionString);
		if (paramTypes) {
			if (Array.isArray(paramTypes)) {
				if (paramTypes.length !== this.paramNames.length) {
					throw 'Invalid argument type array length, against function length -> (' +
						paramTypes.length + ',' +
						this.paramNames.length +
						')';
				}
				this.paramTypes = paramTypes;
			} else if (typeof paramTypes === 'object') {
				const paramVariableNames = Object.keys(paramTypes);
				if (paramTypes.hasOwnProperty('returns')) {
					this.returnType = paramTypes.returns;
					paramVariableNames.splice(paramVariableNames.indexOf('returns'), 1);
				}
				if (paramVariableNames.length > 0 && paramVariableNames.length !== this.paramNames.length) {
					throw 'Invalid argument type array length, against function length -> (' +
						paramVariableNames.length + ',' +
						this.paramNames.length +
						')';
				} else {
					this.paramTypes = this.paramNames.map((key) => {
						if (paramTypes.hasOwnProperty(key)) {
							return paramTypes[key];
						} else {
							return 'float';
						}
					});
				}
			}
		} else {
			this.paramTypes = [];
			//TODO: Remove when we have proper type detection
			// for (let a = 0; a < this.paramNames.length; ++a) {
			// 	this.paramTypes.push();
			// }
		}

		//
		// Return type handling
		//
		if (!this.returnType) {
			this.returnType = returnType || 'float';
		}
	}

	setAddFunction(fn) {
		this.addFunction = fn;
		return this;
	}
	/**
	 * 
	 * Core Functions
	 * 
	 */

	/**
	 * @memberOf FunctionNodeBase#
	 * @function
	 * @name getJSFunction
	 *
	 * @desc Gets and return the stored JS Function.
	 * Note: that this internally eval the function, if only the string was provided on construction
	 *
	 * @returns {Function} The function object
	 *
	 */
	getJsFunction() {
		if (this.jsFunction) {
			return this.jsFunction;
		}

		if (this.jsFunctionString) {
			this.jsFunction = eval(this.jsFunctionString);
			return this.jsFunction;
		}

		throw 'Missing jsFunction, and jsFunctionString parameter';
	}

	/**
	 * @typedef {Object} ASTObject
	 */

	/**
	 * @typedef {Object} JISONParser
	 */

	/**
	 * @memberOf FunctionNodeBase#
	 * @function
	 * @name getJsAST
	 *
	 * @desc Parses the class function JS, and returns its Abstract Syntax Tree object.
	 *
	 * This is used internally to convert to shader code
	 *
	 * @param {JISONParser} inParser - Parser to use, assumes in scope 'parser' if null
	 *
	 * @returns {ASTObject} The function AST Object, note that result is cached under this.jsFunctionAST;
	 *
	 */
	getJsAST(inParser) {
		if (this.jsFunctionAST) {
			return this.jsFunctionAST;
		}

		inParser = inParser || parser;
		if (inParser === null) {
			throw 'Missing JS to AST parser';
		}

		const prasedObj = parser.parse('var ' + this.functionName + ' = ' + this.jsFunctionString + ';');
		if (prasedObj === null) {
			throw 'Failed to parse JS code via JISON';
		}

		// take out the function object, outside the var declarations
		const funcAST = prasedObj.body[0].declarations[0].init;
		this.jsFunctionAST = funcAST;

		return funcAST;
	}


	/**
	 * @memberOf FunctionNodeBase#
	 * @function
	 * @name getFunctionString
	 *
	 * @desc Returns the converted webgl shader function equivalent of the JS function
	 *
	 * @returns {String} webgl function string, result is cached under this.webGlFunctionString
	 *
	 */
	getFunctionString() {
		this.generate();
		return this.functionString;
	}

	/**
	 * @memberOf FunctionNodeBase#
	 * @function
	 * @name setFunctionString
	 *
	 * @desc Set the functionString value, overwriting it
	 *
	 * @param {String} functionString - Shader code string, representing the function
	 *
	 */
	setFunctionString(functionString) {
		this.functionString = functionString;
	}

	/**
	 * @memberOf FunctionNodeBase#
	 * @function
	 * @name getParamType
	 *
	 * @desc Return the type of parameter sent to subKernel/Kernel.
	 *
	 * @param {String} paramName - Name of the parameter
	 *
	 * @returns {String} Type of the parameter
	 *
	 */
	getParamType(paramName) {
		const paramIndex = this.paramNames.indexOf(paramName);
		if (paramIndex === -1) return null;
		if (!this.parent) return null;
		if (this.paramTypes[paramIndex]) return this.paramTypes[paramIndex];
		const calledFunctionArguments = this.parent.calledFunctionsArguments[this.functionName];
		for (let i = 0; i < calledFunctionArguments.length; i++) {
			const calledFunctionArgument = calledFunctionArguments[i];
			if (calledFunctionArgument[paramIndex] !== null) {
				return this.paramTypes[paramIndex] = calledFunctionArgument[paramIndex].type;
			}
		}
		return null;
	}

	/**
	 * @memberOf FunctionNodeBase#
	 * @function
	 * @name getUserParamName
	 *
	 * @desc Return the name of the *user parameter*(subKernel parameter) corresponding 
	 * to the parameter supplied to the kernel
	 *
	 * @param {String} paramName - Name of the parameter
	 *
	 * @returns {String} Name of the parameter
	 *
	 */
	getUserParamName(paramName) {
		const paramIndex = this.paramNames.indexOf(paramName);
		if (paramIndex === -1) return null;
		if (!this.parent) return null;
		const calledFunctionArguments = this.parent.calledFunctionsArguments[this.functionName];
		for (let i = 0; i < calledFunctionArguments.length; i++) {
			const calledFunctionArgument = calledFunctionArguments[i];
			if (calledFunctionArgument[paramIndex] !== null) {
				return calledFunctionArgument[paramIndex].name;
			}
		}
		return null;
	}

	generate(options) {
		throw new Error('generate not defined on BaseFunctionNode');
	}
};
},{"../core/parser":67,"../core/utils":70}],53:[function(require,module,exports){
'use strict';

const utils = require('../core/utils');

module.exports = class BaseKernel {

	/**
	 * @constructor BaseKernel
	 * 
	 * @desc Implements the base class for Kernels, and is used as a 
	 * parent class for all Kernel implementations.
	 *
	 * This contains the basic methods needed by all Kernel implementations, 
	 * like setDimensions, addSubKernel, etc.
	 * 
	 * @prop {Array} paramNames - Name of the parameters of the kernel function
	 * @prop {String} fnString - Kernel function as a String
	 * @prop {Array} dimensions - Dimensions of the kernel function, this.thread.x, etc.
	 * @prop {Boolean} debug - Toggle debug mode
	 * @prop {String} graphical - Toggle graphical mode
	 * @prop {number} loopMaxIterations - Maximum number of loop iterations
	 * @prop {Object} constants - Global constants
	 * @prop {Array} subKernels - Sub kernels bound to this kernel instance
	 * @prop {Object} subKernelProperties - Sub kernels bound to this kernel instance as key/value pairs
	 * @prop {Array} subKernelOutputVariableNames - Names of the variables outputted by the subkerls
	 *
	 */
	constructor(fnString, settings) {
		this.paramNames = utils.getParamNamesFromString(fnString);
		this.fnString = fnString;
		this.dimensions = [];
		this.debug = false;
		this.graphical = false;
		this.loopMaxIterations = 0;
		this.constants = null;
		this.wraparound = null;
		this.hardcodeConstants = null;
		this.outputToTexture = null;
		this.texSize = null;
		this._canvas = null;
		this._webGl = null;
		this.threadDim = null;
		this.floatTextures = null;
		this.floatOutput = null;
		this.floatOutputForce = null;
		this.addFunction = null;
		this.copyData = true;
		this.subKernels = null;
		this.subKernelProperties = null;
		this.subKernelNames = null;
		this.subKernelOutputVariableNames = null;

		for (let p in settings) {
			if (!settings.hasOwnProperty(p) || !this.hasOwnProperty(p)) continue;
			this[p] = settings[p];
		}
		if (settings.hasOwnProperty('canvas')) {
			this._canvas = settings.canvas;
		}

		if (!this._canvas) this._canvas = utils.initCanvas();
	}

	build() {
		throw new Error('"build" not defined on Base');
	}

	setAddFunction(cb) {
		this.addFunction = cb;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setDimensions
	 *
	 * @desc Set dimensions of the kernel function
	 *
	 * @param {Array} dimensions - The dimensions array set the dimensions to
	 *
	 */
	setDimensions(dimensions) {
		this.dimensions = dimensions;
		return this;
	}

	/**
	 * @memberOf BaseKernel# 
	 * @function
	 * @name setDebug
	 *
	 * @desc Toggle debug mode
	 *
	 * @param {Boolean} flag - true to enable debug
	 *
	 */
	setDebug(flag) {
		this.debug = flag;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setGraphical
	 *
	 * @desc Toggle graphical output mode
	 *
	 * @param {Boolean} flag - true to enable graphical output
	 *
	 */
	setGraphical(flag) {
		this.graphical = flag;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setLoopMaxIterations
	 *
	 * @desc Set the maximum number of loop iterations
	 *
	 * @param {number} max - iterations count
	 *
	 */
	setLoopMaxIterations(max) {
		this.loopMaxIterations = max;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setConstants
	 * @desc Set Constants
	 */
	setConstants(constants) {
		this.constants = constants;
		return this;
	}

	setWraparound(flag) {
		console.warn('Wraparound mode is not supported and undocumented.');
		this.wraparound = flag;
		return this;
	}

	setHardcodeConstants(flag) {
		this.hardcodeConstants = flag;
		return this;
	}

	setOutputToTexture(flag) {
		this.outputToTexture = flag;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setFloatTextures
	 *
	 * @desc Toggle texture output mode
	 *
	 * @param {Boolean} flag - true to enable floatTextures
	 *
	 */
	setFloatTextures(flag) {
		this.floatTextures = flag;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setFloatOutput
	 *
	 * @desc Toggle output mode
	 *
	 * @param {Boolean} flag - true to enable float
	 *
	 */
	setFloatOutput(flag) {
		this.floatOutput = flag;
		return this;
	}

	setFloatOutputForce(flag) {
		this.floatOutputForce = flag;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setCanvas
	 *
	 * @desc Bind the canvas to kernel
	 * 
	 * @param {Canvas} canvas - Canvas to bind
	 *
	 */
	setCanvas(canvas) {
		this._canvas = canvas;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name setCanvas
	 *
	 * @desc Bind the webGL instance to kernel
	 * 
	 * @param {Canvas} webGL - webGL instance to bind
	 *
	 */
	setWebGl(webGl) {
		this._webGl = webGl;
		return this;
	}

	setCopyData(copyData) {
		this.copyData = copyData;
		return this;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name getCanvas()
	 *
	 * @desc Returns the current canvas instance bound to the kernel
	 *
	 */
	getCanvas() {
		return this._canvas;
	}

	/**
	 * @memberOf BaseKernel#
	 * @function
	 * @name getWebGl()
	 *
	 * @desc Returns the current webGl instance bound to the kernel
	 *
	 */
	getWebGl() {
		return this._webGl;
	}

	validateOptions() {
		throw new Error('validateOptions not defined');
	}

	exec() {
		return this.execute.apply(this, arguments);
	}

	execute() {
		//
		// Prepare the required objects
		//
		const args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

		//
		// Setup and return the promise, and execute the function, in synchronous mode
		//
		return utils.newPromise((accept, reject) => {
			try {
				accept(this.run.apply(this, args));
			} catch (e) {
				//
				// Error : throw rejection
				//
				reject(e);
			}
		});
	}

	/** 
	 * @memberOf BaseKernel#
	 * @function
	 * @name addSubKernel
	 *
	 * @desc Add a sub kernel to the root kernel instance.
	 * This is what `createKernelMap` uses.
	 *
	 * @param {String} fnString - function (as a String) of the subKernel to add
	 *
	 */
	addSubKernel(fnString) {
		if (this.subKernels === null) {
			this.subKernels = [];
			this.subKernelNames = [];
		}
		this.subKernels.push(fnString);
		this.subKernelNames.push(utils.getFunctionNameFromString(fnString));
		return this;
	}

	/** 
	 * @memberOf BaseKernel#
	 * @function
	 * @name addSubKernelProperty
	 *
	 * @desc Add a sub kernel to the root kernel instance, indexed by a property name
	 * This is what `createKernelMap` uses.
	 *
	 * @param {String} property - property key for the subKernel
	 * @param {String} fnString - function (as a String) of the subKernel to add
	 *
	 */
	addSubKernelProperty(property, fnString) {
		if (this.subKernelProperties === null) {
			this.subKernelProperties = {};
			this.subKernelNames = [];
		}
		if (this.subKernelProperties.hasOwnProperty(property)) {
			throw new Error(`cannot add sub kernel ${ property }, already defined`);
		}
		this.subKernelProperties[property] = fnString;
		this.subKernelNames.push(utils.getFunctionNameFromString(fnString));
		return this;
	}
};
},{"../core/utils":70}],54:[function(require,module,exports){
'use strict';

const utils = require('../core/utils');

module.exports = function kernelRunShortcut(kernel) {
	const shortcut = function() {
		return kernel.run.apply(kernel, arguments);
	};

	utils.allPropertiesOf(kernel).forEach((key) => {
		if (key[0] === '_' && key[1] === '_') return;
		if (typeof kernel[key] === 'function') {
			if (key.substring(0, 3) === 'set') {
				shortcut[key] = function() {
					kernel[key].apply(kernel, arguments);
					return shortcut;
				};
			} else {
				shortcut[key] = kernel[key].bind(kernel);
			}
		} else {
			shortcut.__defineGetter__(key, () => {
				return kernel[key];
			});
			shortcut.__defineSetter__(key, (value) => {
				kernel[key] = value;
			});
		}
	});

	shortcut.kernel = kernel;

	return shortcut;
};
},{"../core/utils":70}],55:[function(require,module,exports){
'use strict';

const utils = require('../core/utils');
const kernelRunShortcut = require('./kernel-run-shortcut');

module.exports = class BaseRunner {

	/**
	 * @constructor BaseRunner
	 *
	 * @desc Represents the 'private/protected' namespace of the GPU class
	 *
	 * <p>I know @private makes more sense, but since the documentation engine state is undetirmined.
	 * (See https://github.com/gpujs/gpu.js/issues/19 regarding documentation engine issue)
	 * File isolation is currently the best way to go. </p>
	 * 
	 * *base.js* internal functions namespace <br>
	 * *gpu.js* PUBLIC function namespace <br>
	 *
	 * @prop {Object} settings - Settings object used to set Dimensions, etc.
	 * @prop {String} kernel - Current kernel instance
	 * @prop {Object} canvas - Canvas instance attached to the kernel
	 * @prop {Object} webGl - WebGl instance attached to the kernel
	 * @prop {Function} fn - Kernel function to run
	 * @prop {Object} functionBuilder - FunctionBuilder instance
	 * @prop {String} fnString - Kernel function (as a String)
	 * @prop {String} endianness - endian information like Little-endian, Big-endian.
	 *
	 */

	constructor(functionBuilder, settings) {
		settings = settings || {};
		this.kernel = settings.kernel;
		this.canvas = settings.canvas;
		this.webGl = settings.webGl;
		this.fn = null;
		this.functionBuilder = functionBuilder;
		this.fnString = null;
		this.endianness = utils.systemEndianness();
		this.functionBuilder.polyfillStandardFunctions();
	}

	/**
	 * @memberOf BaseRunner#
	 * @function
	 * @name textureToArray
	 *
	 * @desc Converts the provided Texture instance to a JavaScript Array 
	 *	
	 * @param {Object} texture - Texture Object
	 *
	 */
	textureToArray(texture) {
		const copy = this.createKernel(function(x) {
			return x[this.thread.z][this.thread.y][this.thread.x];
		});

		return copy(texture);
	}

	/**
	 * @memberOf BaseRunner#
	 * @function
	 * 
	 * @name deleteTexture
	 *
	 * @desc Deletes the provided Texture instance 
	 *
	 * @param {Object} texture - Texture Object
	 */
	deleteTexture(texture) {
		this.webGl.deleteTexture(texture.texture);
	}

	/**
	 * @memberOf BaseRunner#
	 * @function
	 * @name buildPromiseKernel
	 * 
	 * @desc Get and returns the ASYNCHRONOUS executor, of a class and kernel
	 * This returns a Promise object from an argument set.
	 *
	 * Note that there is no current implementation.
	 *
	 */
	buildPromiseKernel() {
		throw new Error('not yet implemented');
	}

	getMode() {
		throw new Error('"mode" not implemented on BaseRunner');
	}

	/**
	 * @memberOf BaseRunner#
	 * @function
	 * 
	 * @name buildKernel
	 * 
	 * @desc Get and returns the Synchronous executor, of a class and kernel
	 * Which returns the result directly after passing the arguments.
	 * 
	 */
	buildKernel(fn, settings) {
		settings = Object.assign({}, settings || {});
		const fnString = fn.toString();
		if (!settings.functionBuilder) {
			settings.functionBuilder = this.functionBuilder;
		}

		if (!settings.canvas) {
			settings.canvas = this.canvas;
		}

		if (!settings.webGl) {
			settings.webGl = this.webgl;
		}

		return kernelRunShortcut(new this.Kernel(fnString, settings));
	}
};
},{"../core/utils":70,"./kernel-run-shortcut":54}],56:[function(require,module,exports){
'use strict';

const FunctionBuilderBase = require('../function-builder-base');
const WebGLFunctionNode = require('./function-node');
const utils = require('../../core/utils');

/**
 * @class WebGLFunctionBuilder
 *
 * @extends FunctionBuilderBase
 *
 * @desc Builds webGl functions (shaders) from JavaScript function Strings
 *
 */
module.exports = class WebGLFunctionBuilder extends FunctionBuilderBase {
	addFunction(functionName, jsFunction, paramTypes, returnType) {
		this.addFunctionNode(
			new WebGLFunctionNode(functionName, jsFunction, paramTypes, returnType)
			.setAddFunction(this.addFunction.bind(this))
		);
	}

	/**
	 * @memberOf WebGLFunctionBuilder#
	 * @function
	 * @name getStringFromFunctionNames
	 * 
	 * @desc Get the webGl string from function names
	 *
	 * @param {String[]} functionList - List of function to build the webgl string.
	 *
	 * @returns {String} The full webgl string, of all the various functions. Trace optimized if functionName given
	 *
	 */
	getStringFromFunctionNames(functionList) {
		const ret = [];
		for (let i = 0; i < functionList.length; ++i) {
			const node = this.nodeMap[functionList[i]];
			if (node) {
				ret.push(this.nodeMap[functionList[i]].getFunctionString());
			}
		}
		return ret.join('\n');
	}

	/**
	 * @memberOf WebGLFunctionBuilder#
	 * @function
	 * @name getPrototypeStringFromFunctionNames
	 *
	 * @desc Return webgl String of all functions converted to webgl shader form
	 *
	 * @param {String[]} functionList - List of function names to build the webgl string.
	 * @param {Object} opt - Settings object passed to functionNode. See functionNode for more details.
	 *
	 * @returns {String} Prototype String of all functions converted to webgl shader form
	 *
	 */
	getPrototypeStringFromFunctionNames(functionList, opt) {
		const ret = [];
		for (let i = 0; i < functionList.length; ++i) {
			const node = this.nodeMap[functionList[i]];
			if (node) {
				ret.push(node.getFunctionPrototypeString(opt));
			}
		}
		return ret.join('\n');
	}

	/**
	 * @memberOf WebGLFunctionBuilder#
	 * @function
	 * @name getString
	 *
	 * Get webGl string for a particular function name
	 * 
	 * @param {String} functionName - Function name to trace from. If null, it returns the WHOLE builder stack
	 *
	 * @returns {String} The full webgl string, of all the various functions. Trace optimized if functionName given
	 *
	 */
	getString(functionName, opt) {
		if (opt === undefined) {
			opt = {};
		}

		if (functionName) {
			return this.getStringFromFunctionNames(this.traceFunctionCalls(functionName, [], opt).reverse(), opt);
		}
		return this.getStringFromFunctionNames(Object.keys(this.nodeMap), opt);
	}

	/**
	 * @memberOf WebGLFunctionBuilder#
	 * @name getPrototypeString
	 * @function
	 *
	 * @desc Return the webgl string for a function converted to glsl (webgl shaders)
	 *
	 * @param {String} functionName - Function name to trace from. If null, it returns the WHOLE builder stack
	 *
	 * @returns {String} The full webgl string, of all the various functions. Trace optimized if functionName given
	 *
	 */
	getPrototypeString(functionName) {
		this.rootKernel.generate();
		if (functionName) {
			return this.getPrototypeStringFromFunctionNames(this.traceFunctionCalls(functionName, []).reverse());
		}
		return this.getPrototypeStringFromFunctionNames(Object.keys(this.nodeMap));
	}

	/**
	 * @memberOf WebGLFunctionBuilder#
	 * @function
	 * @name addKernel 
	 *
	 * @desc Add a new kernel to this instance
	 *
	 * @param {String} fnString - Kernel function as a String
	 * @param {Object} options - Settings object to set constants, debug mode, etc.
	 * @param {Array} paramNames - Parameters of the kernel
	 * @param {Array} paramTypes - Types of the parameters
	 *		
	 *
	 * @returns {Object} The inserted kernel as a Kernel Node
	 *
	 */
	addKernel(fnString, options, paramNames, paramTypes) {
		const kernelNode = new WebGLFunctionNode('kernel', fnString, options, paramTypes);
		kernelNode.setAddFunction(this.addFunction.bind(this));
		kernelNode.paramNames = paramNames;
		kernelNode.paramTypes = paramTypes;
		kernelNode.isRootKernel = true;
		this.addFunctionNode(kernelNode);
		return kernelNode;
	}

	/**
	 * @memberOf WebGLFunctionBuilder#
	 * @function
	 * @name addSubKernel
	 *
	 * @desc Add a new sub-kernel to the current kernel instance
	 *
	 * @param {Function} jsFunction - Sub-kernel function (JavaScript)
	 * @param {Object} options - Settings object to set constants, debug mode, etc.
	 * @param {Array} paramNames - Parameters of the sub-kernel
	 * @param {Array} returnType - Return type of the subKernel
	 *
	 * @returns {Object} The inserted sub-kernel as a Kernel Node
	 *
	 */
	addSubKernel(jsFunction, options, paramTypes, returnType) {
		const kernelNode = new WebGLFunctionNode(null, jsFunction, options, paramTypes, returnType);
		kernelNode.setAddFunction(this.addFunction.bind(this));
		kernelNode.isSubKernel = true;
		this.addFunctionNode(kernelNode);
		return kernelNode;
	}
};
},{"../../core/utils":70,"../function-builder-base":51,"./function-node":57}],57:[function(require,module,exports){
'use strict';

const FunctionNodeBase = require('../function-node-base');
const utils = require('../../core/utils');
// Closure capture for the ast function, prevent collision with existing AST functions
// The prefixes to use
const jsMathPrefix = 'Math.';
const localPrefix = 'this.';
const constantsPrefix = 'this.constants.';

const DECODE32_ENCODE32 = /decode32\(\s+encode32\(/g;
const ENCODE32_DECODE32 = /encode32\(\s+decode32\(/g;

/** 
 * @class WebGLFunctionNode
 *
 * @desc [INTERNAL] Takes in a function node, and does all the AST voodoo required to generate its respective webGL code.
 *
 * @extends FunctionNodeBase
 *
 * @param {functionNode} inNode - The function node object
 *
 * @returns the converted webGL function string
 *
 */
module.exports = class WebGLFunctionNode extends FunctionNodeBase {
	generate() {
		if (this.debug) {
			console.log(this);
		}
		if (this.prototypeOnly) {
			return WebGLFunctionNode.astFunctionPrototype(this.getJsAST(), [], this).join('').trim();
		} else {
			this.functionStringArray = this.astGeneric(this.getJsAST(), [], this);
		}
		this.functionString = webGlRegexOptimize(
			this.functionStringArray.join('').trim()
		);
		return this.functionString;
	}

	isIdentifierConstant(paramName) {
		if (!this.constants) return false;
		return this.constants.hasOwnProperty(paramName);
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astGeneric
	 *
	 * @desc Parses the abstract syntax tree for generically to its respective function
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {String} the prased openclgl string array
	 */
	astGeneric(ast, retArr, funcParam) {
		if (ast === null) {
			throw astErrorOutput('NULL ast', ast, funcParam);
		} else {
			if (Array.isArray(ast)) {
				for (let i = 0; i < ast.length; i++) {
					this.astGeneric(ast[i], retArr, funcParam);
				}
				return retArr;
			}

			switch (ast.type) {
				case 'FunctionDeclaration':
					return this.astFunctionDeclaration(ast, retArr, funcParam);
				case 'FunctionExpression':
					return this.astFunctionExpression(ast, retArr, funcParam);
				case 'ReturnStatement':
					return this.astReturnStatement(ast, retArr, funcParam);
				case 'Literal':
					return this.astLiteral(ast, retArr, funcParam);
				case 'BinaryExpression':
					return this.astBinaryExpression(ast, retArr, funcParam);
				case 'Identifier':
					return this.astIdentifierExpression(ast, retArr, funcParam);
				case 'AssignmentExpression':
					return this.astAssignmentExpression(ast, retArr, funcParam);
				case 'ExpressionStatement':
					return this.astExpressionStatement(ast, retArr, funcParam);
				case 'EmptyStatement':
					return this.astEmptyStatement(ast, retArr, funcParam);
				case 'BlockStatement':
					return this.astBlockStatement(ast, retArr, funcParam);
				case 'IfStatement':
					return this.astIfStatement(ast, retArr, funcParam);
				case 'BreakStatement':
					return this.astBreakStatement(ast, retArr, funcParam);
				case 'ContinueStatement':
					return this.astContinueStatement(ast, retArr, funcParam);
				case 'ForStatement':
					return this.astForStatement(ast, retArr, funcParam);
				case 'WhileStatement':
					return this.astWhileStatement(ast, retArr, funcParam);
				case 'VariableDeclaration':
					return this.astVariableDeclaration(ast, retArr, funcParam);
				case 'VariableDeclarator':
					return this.astVariableDeclarator(ast, retArr, funcParam);
				case 'ThisExpression':
					return this.astThisExpression(ast, retArr, funcParam);
				case 'SequenceExpression':
					return this.astSequenceExpression(ast, retArr, funcParam);
				case 'UnaryExpression':
					return this.astUnaryExpression(ast, retArr, funcParam);
				case 'UpdateExpression':
					return this.astUpdateExpression(ast, retArr, funcParam);
				case 'LogicalExpression':
					return this.astLogicalExpression(ast, retArr, funcParam);
				case 'MemberExpression':
					return this.astMemberExpression(ast, retArr, funcParam);
				case 'CallExpression':
					return this.astCallExpression(ast, retArr, funcParam);
				case 'ArrayExpression':
					return this.astArrayExpression(ast, retArr, funcParam);
			}

			throw astErrorOutput('Unknown ast type : ' + ast.type, ast, funcParam);
		}
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astFunctionDeclaration
	 *
	 * @desc Parses the abstract syntax tree for to its *named function declaration*
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astFunctionDeclaration(ast, retArr, funcParam) {
		if (this.addFunction) {
			this.addFunction(null, utils.getAstString(this.jsFunctionString, ast));
		}
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astFunctionPrototype
	 * @static
	 *
	 * @desc Parses the abstract syntax tree for to its *named function prototype*
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	static astFunctionPrototype(ast, retArr, funcParam) {
		// Setup function return type and name
		if (funcParam.isRootKernel || funcParam.isSubKernel) {
			return retArr;
		}

		retArr.push(funcParam.returnType);
		retArr.push(' ');
		retArr.push(funcParam.functionName);
		retArr.push('(');

		// Arguments handling
		for (let i = 0; i < funcParam.paramNames.length; ++i) {
			if (i > 0) {
				retArr.push(', ');
			}

			retArr.push(funcParam.paramTypes[i]);
			retArr.push(' ');
			retArr.push('user_');
			retArr.push(funcParam.paramNames[i]);
		}

		retArr.push(');\n');

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astFunctionExpression
	 *
	 * @desc Parses the abstract syntax tree for to its *named function*
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astFunctionExpression(ast, retArr, funcParam) {

		// Setup function return type and name
		if (funcParam.isRootKernel) {
			retArr.push('void');
			funcParam.kernalAst = ast;
		} else {
			retArr.push(funcParam.returnType);
		}
		retArr.push(' ');
		retArr.push(funcParam.functionName);
		retArr.push('(');

		if (!funcParam.isRootKernel) {
			// Arguments handling
			for (let i = 0; i < funcParam.paramNames.length; ++i) {
				const paramName = funcParam.paramNames[i];

				if (i > 0) {
					retArr.push(', ');
				}
				const type = funcParam.getParamType(paramName);
				switch (type) {
					case 'Texture':
					case 'Array':
						retArr.push('sampler2D');
						break;
					default:
						retArr.push('float');
				}

				retArr.push(' ');
				retArr.push('user_');
				retArr.push(paramName);
			}
		}

		// Function opening
		retArr.push(') {\n');

		// Body statement iteration
		for (let i = 0; i < ast.body.length; ++i) {
			this.astGeneric(ast.body[i], retArr, funcParam);
			retArr.push('\n');
		}

		// Function closing
		retArr.push('}\n');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astReturnStatement
	 *
	 * @desc Parses the abstract syntax tree for to *return* statement
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Object} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astReturnStatement(ast, retArr, funcParam) {
		if (funcParam.isRootKernel) {
			retArr.push('kernelResult = ');
			this.astGeneric(ast.argument, retArr, funcParam);
			retArr.push(';');
			retArr.push('return;');
		} else if (funcParam.isSubKernel) {
			retArr.push(`${ funcParam.functionName }Result = `);
			this.astGeneric(ast.argument, retArr, funcParam);
			retArr.push(';');
			retArr.push(`return ${ funcParam.functionName }Result;`);
		} else {
			retArr.push('return ');
			this.astGeneric(ast.argument, retArr, funcParam);
			retArr.push(';');
		}

		//throw astErrorOutput(
		//	'Non main function return, is not supported : '+funcParam.currentFunctionNamespace,
		//	ast, funcParam
		//);

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astLiteral
	 *
	 * @desc Parses the abstract syntax tree for *literal value*
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astLiteral(ast, retArr, funcParam) {

		// Reject non numeric literals
		if (isNaN(ast.value)) {
			throw astErrorOutput(
				'Non-numeric literal not supported : ' + ast.value,
				ast, funcParam
			);
		}

		// Push the literal value as a float/int
		retArr.push(ast.value);

		// If it was an int, node made a float
		if (Number.isInteger(ast.value)) {
			retArr.push('.0');
		}

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astBinaryExpression
	 *
	 * @desc Parses the abstract syntax tree for *binary* expression
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astBinaryExpression(ast, retArr, funcParam) {
		retArr.push('(');

		if (ast.operator === '%') {
			retArr.push('mod(');
			this.astGeneric(ast.left, retArr, funcParam);
			retArr.push(',');
			this.astGeneric(ast.right, retArr, funcParam);
			retArr.push(')');
		} else if (ast.operator === '===') {
			this.astGeneric(ast.left, retArr, funcParam);
			retArr.push('==');
			this.astGeneric(ast.right, retArr, funcParam);
		} else if (ast.operator === '!==') {
			this.astGeneric(ast.left, retArr, funcParam);
			retArr.push('!=');
			this.astGeneric(ast.right, retArr, funcParam);
		} else {
			this.astGeneric(ast.left, retArr, funcParam);
			retArr.push(ast.operator);
			this.astGeneric(ast.right, retArr, funcParam);
		}

		retArr.push(')');

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astIdentifierExpression
	 *
	 * @desc Parses the abstract syntax tree for *identifier* expression
	 *
	 * @param {Object} idtNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astIdentifierExpression(idtNode, retArr, funcParam) {
		if (idtNode.type !== 'Identifier') {
			throw astErrorOutput(
				'IdentifierExpression - not an Identifier',
				ast, funcParam
			);
		}

		switch (idtNode.name) {
			case 'gpu_threadX':
				retArr.push('threadId.x');
				break;
			case 'gpu_threadY':
				retArr.push('threadId.y');
				break;
			case 'gpu_threadZ':
				retArr.push('threadId.z');
				break;
			case 'gpu_dimensionsX':
				retArr.push('uOutputDim.x');
				break;
			case 'gpu_dimensionsY':
				retArr.push('uOutputDim.y');
				break;
			case 'gpu_dimensionsZ':
				retArr.push('uOutputDim.z');
				break;
			default:
				if (this.constants && this.constants.hasOwnProperty(idtNode.name)) {
					retArr.push('constants_' + idtNode.name);
				} else {
					const userParamName = funcParam.getUserParamName(idtNode.name);
					if (userParamName !== null) {
						retArr.push('user_' + userParamName);
					} else {
						retArr.push('user_' + idtNode.name);
					}
				}
		}

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astForStatement
	 *
	 * @desc Parses the abstract syntax tree forfor *for-loop* expression
	 *
	 * @param {Object} forNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {String} the prased openclgl string
	 */
	astForStatement(forNode, retArr, funcParam) {
		if (forNode.type !== 'ForStatement') {
			throw astErrorOutput(
				'Invalid for statment',
				ast, funcParam
			);
		}

		if (forNode.test && forNode.test.type === 'BinaryExpression') {
			if (forNode.test.right.type === 'Identifier' &&
				forNode.test.operator === '<' &&
				this.isIdentifierConstant(forNode.test.right.name) === false) {

				if (this.opt.loopMaxIterations === undefined) {
					console.warn('Warning: loopMaxIterations is not set! Using default of 100 which may result in unintended behavior.');
					console.warn('Set loopMaxIterations or use a for loop of fixed length to silence this message.');
				}

				retArr.push('for (float ');
				this.astGeneric(forNode.init, retArr, funcParam);
				retArr.push(';');
				this.astGeneric(forNode.test.left, retArr, funcParam);
				retArr.push(forNode.test.operator);
				retArr.push('LOOP_MAX');
				retArr.push(';');
				this.astGeneric(forNode.update, retArr, funcParam);
				retArr.push(')');

				retArr.push('{\n');
				retArr.push('if (');
				this.astGeneric(forNode.test.left, retArr, funcParam);
				retArr.push(forNode.test.operator);
				this.astGeneric(forNode.test.right, retArr, funcParam);
				retArr.push(') {\n');
				if (forNode.body.type === 'BlockStatement') {
					for (let i = 0; i < forNode.body.body.length; i++) {
						this.astGeneric(forNode.body.body[i], retArr, funcParam);
					}
				} else {
					this.astGeneric(forNode.body, retArr, funcParam);
				}
				retArr.push('} else {\n');
				retArr.push('break;\n');
				retArr.push('}\n');
				retArr.push('}\n');

				return retArr;
			} else {
				retArr.push('for (float ');

				if (!Array.isArray(forNode.init) || forNode.init.length < 1) {
					console.log(this.jsFunctionString);
					throw new Error('Error: Incompatible for loop declaration');
				}

				this.astGeneric(forNode.init, retArr, funcParam);
				retArr.push(';');
				this.astGeneric(forNode.test, retArr, funcParam);
				retArr.push(';');
				this.astGeneric(forNode.update, retArr, funcParam);
				retArr.push(')');
				this.astGeneric(forNode.body, retArr, funcParam);
				return retArr;
			}
		}

		throw astErrorOutput(
			'Invalid for statement',
			ast, funcParam
		);
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astWhileStatement
	 *
	 * @desc Parses the abstract syntax tree for *while* loop
	 *
	 *
	 * @param {Object} whileNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {String} the parsed openclgl string
	 */
	astWhileStatement(whileNode, retArr, funcParam) {
		if (whileNode.type !== 'WhileStatement') {
			throw astErrorOutput(
				'Invalid while statment',
				ast, funcParam
			);
		}

		retArr.push('for (float i = 0.0; i < LOOP_MAX; i++) {');
		retArr.push('if (');
		this.astGeneric(whileNode.test, retArr, funcParam);
		retArr.push(') {\n');
		this.astGeneric(whileNode.body, retArr, funcParam);
		retArr.push('} else {\n');
		retArr.push('break;\n');
		retArr.push('}\n');
		retArr.push('}\n');

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astAssignmentExpression
	 *
	 * @desc Parses the abstract syntax tree for *Assignment* Expression
	 *
	 * @param {Object} assNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astAssignmentExpression(assNode, retArr, funcParam) {
		if (assNode.operator === '%=') {
			this.astGeneric(assNode.left, retArr, funcParam);
			retArr.push('=');
			retArr.push('mod(');
			this.astGeneric(assNode.left, retArr, funcParam);
			retArr.push(',');
			this.astGeneric(assNode.right, retArr, funcParam);
			retArr.push(')');
		} else {
			this.astGeneric(assNode.left, retArr, funcParam);
			retArr.push(assNode.operator);
			this.astGeneric(assNode.right, retArr, funcParam);
			return retArr;
		}
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astEmptyStatement
	 *
	 * @desc Parses the abstract syntax tree for an *Empty* Statement
	 *
	 * @param {Object} eNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astEmptyStatement(eNode, retArr, funcParam) {
		//retArr.push(';\n');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astBlockStatement
	 *
	 * @desc Parses the abstract syntax tree for *Block* statement
	 *
	 * @param {Object} bnode - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astBlockStatement(bNode, retArr, funcParam) {
		retArr.push('{\n');
		for (let i = 0; i < bNode.body.length; i++) {
			this.astGeneric(bNode.body[i], retArr, funcParam);
		}
		retArr.push('}\n');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astExpressionStatement
	 *
	 * @desc Parses the abstract syntax tree for *generic expression* statement
	 *
	 * @param {Object} esNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astExpressionStatement(esNode, retArr, funcParam) {
		this.astGeneric(esNode.expression, retArr, funcParam);
		retArr.push(';\n');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astVariableDeclaration
	 *
	 * @desc Parses the abstract syntax tree for *Variable Declaration*
	 *
	 * @param {Object} vardecNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astVariableDeclaration(vardecNode, retArr, funcParam) {
		retArr.push('float ');
		for (let i = 0; i < vardecNode.declarations.length; i++) {
			if (i > 0) {
				retArr.push(',');
			}
			this.astGeneric(vardecNode.declarations[i], retArr, funcParam);
		}
		retArr.push(';');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astVariableDeclarator
	 *
	 * @desc Parses the abstract syntax tree for *Variable Declarator*
	 *
	 * @param {Object} ivardecNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astVariableDeclarator(ivardecNode, retArr, funcParam) {
		this.astGeneric(ivardecNode.id, retArr, funcParam);
		if (ivardecNode.init !== null) {
			retArr.push('=');
			this.astGeneric(ivardecNode.init, retArr, funcParam);
		}
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astIfStatement
	 *
	 * @desc Parses the abstract syntax tree for *If* Statement
	 *
	 * @param {Object} ifNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astIfStatement(ifNode, retArr, funcParam) {
		retArr.push('if (');
		this.astGeneric(ifNode.test, retArr, funcParam);
		retArr.push(')');
		if (ifNode.consequent.type === 'BlockStatement') {
			this.astGeneric(ifNode.consequent, retArr, funcParam);
		} else {
			retArr.push(' {\n');
			this.astGeneric(ifNode.consequent, retArr, funcParam);
			retArr.push('\n}\n');
		}

		if (ifNode.alternate) {
			retArr.push('else ');
			if (ifNode.alternate.type === 'BlockStatement') {
				this.astGeneric(ifNode.alternate, retArr, funcParam);
			} else {
				retArr.push(' {\n');
				this.astGeneric(ifNode.alternate, retArr, funcParam);
				retArr.push('\n}\n');
			}
		}
		return retArr;

	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astBreakStatement
	 *
	 * @desc Parses the abstract syntax tree for *Break* Statement
	 *
	 * @param {Object} brNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astBreakStatement(brNode, retArr, funcParam) {
		retArr.push('break;\n');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astContinueStatement
	 *
	 * @desc Parses the abstract syntax tree for *Continue* Statement
	 *
	 * @param {Object} crNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astContinueStatement(crNode, retArr, funcParam) {
		retArr.push('continue;\n');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astLogicalExpression
	 *
	 * @desc Parses the abstract syntax tree for *Logical* Expression
	 *
	 * @param {Object} logNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astLogicalExpression(logNode, retArr, funcParam) {
		retArr.push('(');
		this.astGeneric(logNode.left, retArr, funcParam);
		retArr.push(logNode.operator);
		this.astGeneric(logNode.right, retArr, funcParam);
		retArr.push(')');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astUpdateExpression
	 *
	 * @desc Parses the abstract syntax tree for *Update* Expression
	 *
	 * @param {Object} uNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astUpdateExpression(uNode, retArr, funcParam) {
		if (uNode.prefix) {
			retArr.push(uNode.operator);
			this.astGeneric(uNode.argument, retArr, funcParam);
		} else {
			this.astGeneric(uNode.argument, retArr, funcParam);
			retArr.push(uNode.operator);
		}

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astUnaryExpression
	 *
	 * @desc Parses the abstract syntax tree for *Unary* Expression
	 *
	 * @param {Object} uNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astUnaryExpression(uNode, retArr, funcParam) {
		if (uNode.prefix) {
			retArr.push(uNode.operator);
			this.astGeneric(uNode.argument, retArr, funcParam);
		} else {
			this.astGeneric(uNode.argument, retArr, funcParam);
			retArr.push(uNode.operator);
		}

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astThisExpression
	 *
	 * @desc Parses the abstract syntax tree for *This* expression
	 *
	 * @param {Object} tNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astThisExpression(tNode, retArr, funcParam) {
		retArr.push('this');
		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astMemberExpression
	 *
	 * @desc Parses the abstract syntax tree for *Member* Expression
	 *
	 * @param {Object} mNode - An ast Node
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astMemberExpression(mNode, retArr, funcParam) {
		if (mNode.computed) {
			if (mNode.object.type === 'Identifier') {
				// Working logger
				const reqName = mNode.object.name;
				const funcName = funcParam.functionName || 'kernel';
				let assumeNotTexture = false;

				// Possibly an array request - handle it as such
				if (funcParam.paramNames) {
					const idx = funcParam.paramNames.indexOf(reqName);
					if (idx >= 0 && funcParam.paramTypes[idx] === 'float') {
						assumeNotTexture = true;
					}
				}

				if (assumeNotTexture) {
					// Get from array
					this.astGeneric(mNode.object, retArr, funcParam);
					retArr.push('[int(');
					this.astGeneric(mNode.property, retArr, funcParam);
					retArr.push(')]');
				} else {
					// Get from texture
					// This normally refers to the global read only input vars
					retArr.push('get(');
					this.astGeneric(mNode.object, retArr, funcParam);
					retArr.push(', vec2(');
					this.astGeneric(mNode.object, retArr, funcParam);
					retArr.push('Size[0],');
					this.astGeneric(mNode.object, retArr, funcParam);
					retArr.push('Size[1]), vec3(');
					this.astGeneric(mNode.object, retArr, funcParam);
					retArr.push('Dim[0],');
					this.astGeneric(mNode.object, retArr, funcParam);
					retArr.push('Dim[1],');
					this.astGeneric(mNode.object, retArr, funcParam);
					retArr.push('Dim[2]');
					retArr.push('), ');
					this.astGeneric(mNode.property, retArr, funcParam);
					retArr.push(')');
				}
			} else {
				this.astGeneric(mNode.object, retArr, funcParam);
				const last = retArr.pop();
				retArr.push(',');
				this.astGeneric(mNode.property, retArr, funcParam);
				retArr.push(last);
			}
		} else {

			// Unroll the member expression
			let unrolled = this.astMemberExpressionUnroll(mNode);
			let unrolled_lc = unrolled.toLowerCase();

			// Its a constant, remove this.constants.
			if (unrolled.indexOf(constantsPrefix) === 0) {
				unrolled = 'constants_' + unrolled.slice(constantsPrefix.length);
			}

			if (unrolled_lc === 'this.thread.x') {
				retArr.push('threadId.x');
			} else if (unrolled_lc === 'this.thread.y') {
				retArr.push('threadId.y');
			} else if (unrolled_lc === 'this.thread.z') {
				retArr.push('threadId.z');
			} else if (unrolled_lc === 'this.dimensions.x') {
				retArr.push('uOutputDim.x');
			} else if (unrolled_lc === 'this.dimensions.y') {
				retArr.push('uOutputDim.y');
			} else if (unrolled_lc === 'this.dimensions.z') {
				retArr.push('uOutputDim.z');
			} else {
				retArr.push(unrolled);
			}
		}
		return retArr;
	}

	astSequenceExpression(sNode, retArr, funcParam) {
		for (let i = 0; i < sNode.expressions.length; i++) {
			if (i > 0) {
				retArr.push(',');
			}
			this.astGeneric(sNode.expressions, retArr, funcParam);
		}
		return retArr;
	}

	/** 
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astMemberExpressionUnroll
	 * @desc Parses the abstract syntax tree for binary expression.
	 *
	 * <p>Utility function for astCallExpression.</p>
	 * 
	 * @param {Object} ast - the AST object to parse
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {String} the function namespace call, unrolled
	 */
	astMemberExpressionUnroll(ast, funcParam) {
		if (ast.type === 'Identifier') {
			return ast.name;
		} else if (ast.type === 'ThisExpression') {
			return 'this';
		}

		if (ast.type === 'MemberExpression') {
			if (ast.object && ast.property) {
				return (
					this.astMemberExpressionUnroll(ast.object, funcParam) +
					'.' +
					this.astMemberExpressionUnroll(ast.property, funcParam)
				);
			}
		}

		// Failure, unknown expression
		throw astErrorOutput(
			'Unknown CallExpression_unroll',
			ast, funcParam
		);
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astCallExpression
	 *
	 * @desc Parses the abstract syntax tree for *call* expression
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns  {Array} the append retArr
	 */
	astCallExpression(ast, retArr, funcParam) {
		if (ast.callee) {
			// Get the full function call, unrolled
			let funcName = this.astMemberExpressionUnroll(ast.callee);

			// Its a math operator, remove the prefix
			if (funcName.indexOf(jsMathPrefix) === 0) {
				funcName = funcName.slice(jsMathPrefix.length);
			}

			// Its a local function, remove this
			if (funcName.indexOf(localPrefix) === 0) {
				funcName = funcName.slice(localPrefix.length);
			}

			// Register the function into the called registry
			if (funcParam.calledFunctions.indexOf(funcName) < 0) {
				funcParam.calledFunctions.push(funcName);
			}
			if (!funcParam.hasOwnProperty('funcName')) {
				funcParam.calledFunctionsArguments[funcName] = [];
			}

			const functionArguments = [];
			funcParam.calledFunctionsArguments[funcName].push(functionArguments);

			// Call the function
			retArr.push(funcName);

			// Open arguments space
			retArr.push('(');

			// Add the vars
			for (let i = 0; i < ast.arguments.length; ++i) {
				const argument = ast.arguments[i];
				if (i > 0) {
					retArr.push(', ');
				}
				this.astGeneric(argument, retArr, funcParam);
				if (argument.type === 'Identifier') {
					const paramIndex = funcParam.paramNames.indexOf(argument.name);
					if (paramIndex === -1) {
						functionArguments.push(null);
					} else {
						functionArguments.push({
							name: argument.name,
							type: funcParam.paramTypes[paramIndex]
						});
					}
				} else {
					functionArguments.push(null);
				}
			}

			// Close arguments space
			retArr.push(')');

			return retArr;
		}

		// Failure, unknown expression
		throw astErrorOutput(
			'Unknown CallExpression',
			ast, funcParam
		);

		return retArr;
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name astArrayExpression
	 *
	 * @desc Parses the abstract syntax tree for *Array* Expression
	 *
	 * @param {Object} ast - the AST object to parse
	 * @param {Array} retArr - return array string
	 * @param {Function} funcParam - FunctionNode, that tracks compilation state
	 *
	 * @returns {Array} the append retArr
	 */
	astArrayExpression(arrNode, retArr, funcParam) {
		const arrLen = arrNode.elements.length;

		retArr.push('float[' + arrLen + '](');
		for (let i = 0; i < arrLen; ++i) {
			if (i > 0) {
				retArr.push(', ');
			}
			const subNode = arrNode.elements[i];
			this.astGeneric(subNode, retArr, funcParam)
		}
		retArr.push(')');

		return retArr;

		// // Failure, unknown expression
		// throw astErrorOutput(
		// 	'Unknown  ArrayExpression',
		// 	arrNode, funcParam
		//);
	}

	/**
	 * @memberOf WebGLFunctionNode#
	 * @function
	 * @name getFunctionPrototypeString
	 *
	 * @desc Returns the converted webgl shader function equivalent of the JS function
	 *
	 * @returns {String} webgl function string, result is cached under this.getFunctionPrototypeString
	 *
	 */
	getFunctionPrototypeString() {
		if (this.webGlFunctionPrototypeString) {
			return this.webGlFunctionPrototypeString;
		}
		return this.webGlFunctionPrototypeString = this.generate();
	}

	build() {
		return this.getFunctionPrototypeString().length > 0;
	}
};

function isIdentifierKernelParam(paramName, ast, funcParam) {
	return funcParam.paramNames.indexOf(paramName) !== -1;
}

function ensureIndentifierType(paramName, expectedType, ast, funcParam) {
	const start = ast.loc.start;

	if (!isIdentifierKernelParam(paramName, funcParam) && expectedType !== 'float') {
		throw 'Error unexpected identifier ' + paramName + ' on line ' + start.line;
	} else {
		const actualType = funcParam.paramTypes[funcParam.paramNames.indexOf(paramName)];
		if (actualType !== expectedType) {
			throw 'Error unexpected identifier ' + paramName + ' on line ' + start.line;
		}
	}
}

/**
 * @ignore
 * @function
 * @name webgl_regex_optimize
 *
 * @desc [INTERNAL] Takes the near final webgl function string, and do regex search and replacments.
 * For voodoo optimize out the following: 
 *
 * - decode32(encode32( <br>
 * - encode32(decode32( <br>
 *
 * @param {String} inStr - The webGl function String
 *
 */
function webGlRegexOptimize(inStr) {
	return inStr
		.replace(DECODE32_ENCODE32, '((')
		.replace(ENCODE32_DECODE32, '((');
}

/**
 * @function
 * @name astErrorOutput
 * @ignore
 * @desc To throw the AST error, with its location.
 *
 * @todo add location support fpr the AST error
 *
 * @param {Object} error - the error message output
 * @param {Object} ast - the AST object where the error is
 * @param {Object} funcParam - FunctionNode, that tracks compilation state
 */
function astErrorOutput(error, ast, funcParam) {
	console.error(error, ast, funcParam);
	return error;
}
},{"../../core/utils":70,"../function-node-base":52}],58:[function(require,module,exports){
'use strict';

const utils = require('../../core/utils');
const kernelRunShortcut = require('../kernel-run-shortcut');

module.exports = function(gpuKernel, name) {
	return `() => {
    ${ kernelRunShortcut.toString() };
    const utils = {
      allPropertiesOf: function ${ utils.allPropertiesOf.toString() },
      clone: function ${ utils.clone.toString() },
      splitArray: function ${ utils.splitArray.toString() },
      getArgumentType: function ${ utils.getArgumentType.toString() },
      getDimensions: function ${ utils.getDimensions.toString() },
      dimToTexSize: function ${ utils.dimToTexSize.toString() },
      copyFlatten: function ${ utils.copyFlatten.toString() },
      flatten: function ${ utils.flatten.toString() },
      systemEndianness: '${ utils.systemEndianness() }',
      initWebGl: function ${ utils.initWebGl.toString() },
      isArray: function ${ utils.isArray.toString() }
    };
    class ${ name || 'Kernel' } {
      constructor() {
        this.argumentsLength = 0;
        this._canvas = null;
        this._webGl = null;
        this.built = false;
        this.program = null;
        this.paramNames = ${ JSON.stringify(gpuKernel.paramNames) };
        this.paramTypes = ${ JSON.stringify(gpuKernel.paramTypes) };
        this.texSize = ${ JSON.stringify(gpuKernel.texSize) };
        this.dimensions = ${ JSON.stringify(gpuKernel.dimensions) };
        this.compiledFragShaderString = \`${ gpuKernel.compiledFragShaderString }\`;
		    this.compiledVertShaderString = \`${ gpuKernel.compiledVertShaderString }\`;
		    this.programUniformLocationCache = {};
		    this.textureCache = {};
		    this.subKernelOutputTextures = null;
      }
      ${ gpuKernel._getFragShaderString.toString() }
      ${ gpuKernel._getVertShaderString.toString() }
      validateOptions() {}
      setupParams() {}
      setCanvas(canvas) { this._canvas = canvas; return this; }
      setWebGl(webGl) { this._webGl = webGl; return this; }
      ${ gpuKernel.getUniformLocation.toString() }
      ${ gpuKernel.setupParams.toString() }
      ${ gpuKernel.build.toString() }
		  ${ gpuKernel.run.toString() }
		  ${ gpuKernel._addArgument.toString() }
		  ${ gpuKernel.getArgumentTexture.toString() }
		  ${ gpuKernel.getTextureCache.toString() }
		  ${ gpuKernel.getOutputTexture.toString() }
		  ${ gpuKernel.renderOutput.toString() }
    };
    return kernelRunShortcut(new Kernel());
  };`;
};
},{"../../core/utils":70,"../kernel-run-shortcut":54}],59:[function(require,module,exports){
'use strict';

const fs = require('fs');
const KernelBase = require('../kernel-base');
const utils = require('../../core/utils');
const Texture = require('../../core/texture');
const fragShaderString = require('./shader-frag');
const vertShaderString = require('./shader-vert');
const kernelString = require('./kernel-string');

module.exports = class WebGLKernel extends KernelBase {

	/**
	 * @constructor WebGLKernel
	 *
	 * @desc Kernel Implementation for WebGL. 
	 * <p>This builds the shaders and runs them on the GPU, 
	 * the outputs the result back as float(enabled by default) and Texture.</p>
	 *
	 * @extends KernelBase
	 *
	 * @prop {Object} textureCache - webGl Texture cache
	 * @prop {Object} threadDim - The thread dimensions, x, y and z
	 * @prop {Object} programUniformLocationCache - Location of program variables in memory
	 * @prop {Object} framebuffer - Webgl frameBuffer
	 * @prop {Object} buffer - WebGL buffer
	 * @prop {Object} program - The webGl Program
	 * @prop {Object} functionBuilder - Function Builder instance bound to this Kernel
	 * @prop {Boolean} outputToTexture - Set output type to Texture, instead of float
	 * @prop {String} endianness - Endian information like Little-endian, Big-endian.
	 * @prop {Array} paramTypes - Types of parameters sent to the Kernel
	 * @prop {number} argumentsLength - Number of parameters sent to the Kernel
	 * @prop {String} compiledFragShaderString - Compiled fragment shader string
	 * @prop {String} compiledVertShaderString - Compiled Vertical shader string
	 */
	constructor(fnString, settings) {
		super(fnString, settings);
		this.textureCache = {};
		this.threadDim = {};
		this.programUniformLocationCache = {};
		this.framebuffer = null;

		this.buffer = null;
		this.program = null;
		this.functionBuilder = settings.functionBuilder;
		this.outputToTexture = settings.outputToTexture;
		this.endianness = utils.systemEndianness();
		this.subKernelOutputTextures = null;
		this.subKernelOutputVariableNames = null;
		this.paramTypes = null;
		this.argumentsLength = 0;
		this.ext = null;
		this.compiledFragShaderString = null;
		this.compiledVertShaderString = null;
		if (!this._webGl) this._webGl = utils.initWebGl(this.getCanvas());
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name validateOptions
	 *
	 * @desc Validate options related to Kernel, such as 
	 * floatOutputs and Textures, texSize, dimensions, 
	 * graphical output.
	 *
	 */
	validateOptions() {
		const isReadPixel = utils.isFloatReadPixelsSupported();
		if (this.floatTextures === true && !utils.OES_texture_float) {
			throw 'Float textures are not supported on this browser';
		} else if (this.floatOutput === true && this.floatOutputForce !== true && !isReadPixel) {
			throw 'Float texture outputs are not supported on this browser';
		} else if (this.floatTextures === undefined && utils.OES_texture_float) {
			//NOTE: handle
			this.floatTextures = true;
			this.floatOutput = isReadPixel && !this.graphical;
		}

		if (!this.dimensions || this.dimensions.length === 0) {
			if (arguments.length !== 1) {
				throw 'Auto dimensions only supported for kernels with only one input';
			}

			const argType = utils.getArgumentType(arguments[0]);
			if (argType === 'Array') {
				this.dimensions = utils.getDimensions(argType);
			} else if (argType === 'Texture') {
				this.dimensions = arguments[0].dimensions;
			} else {
				throw 'Auto dimensions not supported for input type: ' + argType;
			}
		}

		this.texSize = utils.dimToTexSize({
			floatTextures: this.floatTextures,
			floatOutput: this.floatOutput
		}, this.dimensions, true);

		if (this.graphical) {
			if (this.dimensions.length !== 2) {
				throw 'Output must have 2 dimensions on graphical mode';
			}

			if (this.floatOutput) {
				throw 'Cannot use graphical mode and float output at the same time';
			}

			this.texSize = utils.clone(this.dimensions);
		} else if (this.floatOutput === undefined && utils.OES_texture_float) {
			this.floatOutput = true;
		}
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name build
	 *
	 * @desc Builds the Kernel, by compiling Fragment and Vertical Shaders,
	 * and instantiates the program.
	 *
	 */

	build() {
		this.validateOptions();
		this.setupParams(arguments);
		const texSize = this.texSize;
		const gl = this._webGl;
		this._canvas.width = texSize[0];
		this._canvas.height = texSize[1];
		gl.viewport(0, 0, texSize[0], texSize[1]);

		const threadDim = this.threadDim = utils.clone(this.dimensions);
		while (threadDim.length < 3) {
			threadDim.push(1);
		}

		if (this.functionBuilder) this._addKernels();

		const compiledVertShaderString = this._getVertShaderString(arguments);
		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, compiledVertShaderString);
		gl.compileShader(vertShader);

		const compiledFragShaderString = this._getFragShaderString(arguments);
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, compiledFragShaderString);
		gl.compileShader(fragShader);

		if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
			console.log(compiledVertShaderString);
			console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertShader));
			throw 'Error compiling vertex shader';
		}
		if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
			console.log(compiledFragShaderString);
			console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragShader));
			throw 'Error compiling fragment shader';
		}

		if (this.debug) {
			console.log('Options:');
			console.dir(this);
			console.log('GLSL Shader Output:');
			console.log(compiledFragShaderString);
		}

		const program = this.program = gl.createProgram();
		gl.attachShader(program, vertShader);
		gl.attachShader(program, fragShader);
		gl.linkProgram(program);
		this.framebuffer = gl.createFramebuffer();
		this.framebuffer.width = this.texSize[0];
		this.framebuffer.height = this.texSize[1];
		return this;
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name run
	 *
	 * @desc Run the kernel program, and send the output to renderOutput
	 *
	 * <p> This method calls a helper method *renderOutput* to return the result. </p>
	 * 
	 * @returns {Object} Result The final output of the program, as float, and as Textures for reuse.
	 *
	 *
	 */
	run() {
		if (this.program === null) {
			this.build.apply(this, arguments);
		}
		const paramNames = this.paramNames;
		const paramTypes = this.paramTypes;
		const texSize = this.texSize;
		const threadDim = this.threadDim;
		const framebuffer = this.framebuffer;
		const vertices = new Float32Array([-1, -1,
			1, -1, -1, 1,
			1, 1
		]);
		const texCoords = new Float32Array([
			0, 0,
			1, 0,
			0, 1,
			1, 1
		]);
		const gl = this._webGl;
		this._canvas.width = texSize[0];
		this._canvas.height = texSize[1];
		gl.viewport(0, 0, texSize[0], texSize[1]);
		gl.useProgram(this.program);

		const texCoordOffset = vertices.byteLength;
		let buffer = this.buffer;
		if (!buffer) {
			buffer = this.buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + texCoords.byteLength, gl.STATIC_DRAW);
		} else {
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		}
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
		gl.bufferSubData(gl.ARRAY_BUFFER, texCoordOffset, texCoords);

		const aPosLoc = gl.getAttribLocation(this.program, 'aPos');
		gl.enableVertexAttribArray(aPosLoc);
		gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, gl.FALSE, 0, 0);
		const aTexCoordLoc = gl.getAttribLocation(this.program, 'aTexCoord');
		gl.enableVertexAttribArray(aTexCoordLoc);
		gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, gl.FALSE, 0, texCoordOffset);

		if (!this.hardcodeConstants) {
			const uOutputDimLoc = this.getUniformLocation('uOutputDim');
			gl.uniform3fv(uOutputDimLoc, threadDim);
			const uTexSizeLoc = this.getUniformLocation('uTexSize');
			gl.uniform2fv(uTexSizeLoc, texSize);
		}

		this.argumentsLength = 0;
		for (let texIndex = 0; texIndex < paramNames.length; texIndex++) {
			this._addArgument(arguments[texIndex], paramTypes[texIndex], paramNames[texIndex]);
		}

		let outputTexture = this.getOutputTexture();
		gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
		gl.bindTexture(gl.TEXTURE_2D, outputTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		if (this.floatOutput) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
		} else {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		}

		if (this.graphical) {
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			return;
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);

		if (this.subKernelOutputTextures !== null) {
			const extDrawBuffers = [gl.COLOR_ATTACHMENT0];
			for (let i = 0; i < this.subKernelOutputTextures.length; i++) {
				const subKernelOutputTexture = this.subKernelOutputTextures[i];
				extDrawBuffers.push(gl.COLOR_ATTACHMENT0 + i + 1);
				gl.activeTexture(gl.TEXTURE0 + paramNames.length + i);
				gl.bindTexture(gl.TEXTURE_2D, subKernelOutputTexture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				if (this.floatOutput) {
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.FLOAT, null);
				} else {
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize[0], texSize[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
				}
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i + 1, gl.TEXTURE_2D, subKernelOutputTexture, 0);
			}
			this.ext.drawBuffersWEBGL(extDrawBuffers);
		}

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		if (this.subKernelOutputTextures !== null) {
			if (this.subKernels !== null) {
				const output = [];
				output.result = this.renderOutput(outputTexture);
				for (let i = 0; i < this.subKernels.length; i++) {
					output.push(new Texture(this.subKernelOutputTextures[i], texSize, this.dimensions, this._webGl));
				}
				return output;
			} else if (this.subKernelProperties !== null) {
				const output = {
					result: this.renderOutput(outputTexture)
				};
				let i = 0;
				for (let p in this.subKernelProperties) {
					if (!this.subKernelProperties.hasOwnProperty(p)) continue;
					output[p] = new Texture(this.subKernelOutputTextures[i], texSize, this.dimensions, this._webGl);
					i++;
				}
				return output;
			}
		}

		return this.renderOutput(outputTexture);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name renderOutput
	 *
	 * 
	 * @desc Helper function to return webGl function's output.
	 * Since the program runs on GPU, we need to get the 
	 * output of the program back to CPU and then return them.
	 *
	 * *Note*: This should not be called directly.
	 * 
	 * @param {Object} outputTexture - Output Texture returned by webGl program
	 *
	 * @returns {Object|Array} result
	 *
	 *
	 */
	renderOutput(outputTexture) {
		const texSize = this.texSize;
		const gl = this._webGl;
		const threadDim = this.threadDim;

		if (this.outputToTexture) {
			return new Texture(outputTexture, texSize, this.dimensions, this._webGl);
		} else {
			let result;
			if (this.floatOutput) {
				result = new Float32Array(texSize[0] * texSize[1] * 4);
				gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.FLOAT, result);
			} else {
				const bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
				gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
				result = Float32Array.prototype.slice.call(new Float32Array(bytes.buffer));
			}

			result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);

			if (this.dimensions.length === 1) {
				return result;
			} else if (this.dimensions.length === 2) {
				return utils.splitArray(result, this.dimensions[0]);
			} else if (this.dimensions.length === 3) {
				const cube = utils.splitArray(result, this.dimensions[0] * this.dimensions[1]);
				return cube.map(function(x) {
					return utils.splitArray(x, this.dimensions[0]);
				});
			}
		}
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name getOutputTexture
	 *
	 * @desc This uses *getTextureCache* to get the Texture Cache of the Output
	 *
	 * @returns {Object} Ouptut Texture Cache
	 *
	 */
	getOutputTexture() {
		return this.getTextureCache('OUTPUT');
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name getArgumentTexture
	 *
	 * @desc This uses *getTextureCache** to get the Texture Cache of the argument supplied
	 *	
	 * @param {String} name - Name of the argument
	 *
	 * 	Texture cache for the supplied argument
	 *
	 */
	getArgumentTexture(name) {
		return this.getTextureCache(`ARGUMENT_${ name }`);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @name getSubKernelTexture
	 * @function
	 *
	 * @desc This uses *getTextureCache* to get the Texture Cache of the sub-kernel
	 *
	 * @param {String} name - Name of the subKernel
	 *
	 * @returns {Object} Texture cache for the subKernel
	 *
	 */
	getSubKernelTexture(name) {
		return this.getTextureCache(`SUB_KERNEL_${ name }`);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @name getTextureCache
	 * @function
	 *
	 * @desc Returns the Texture Cache of the supplied parameter (can be kernel, sub-kernel or argument)
	 *
	 * @param {String} name - Name of the subkernel, argument, or kernel.
	 *
	 * @returns {Object} Texture cache
	 *
	 */
	getTextureCache(name) {
		if (this.outputToTexture) {
			// Don't retain a handle on the output texture, we might need to render on the same texture later
			return this._webGl.createTexture();
		}
		if (this.textureCache.hasOwnProperty(name)) {
			return this.textureCache[name];
		}
		return this.textureCache[name] = this._webGl.createTexture();
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name setupParams
	 *
	 * @desc Setup the parameter types for the parameters 
	 * supplied to the Kernel function
	 *
	 * @param {Array} args - The actual parameters sent to the Kernel
	 *
	 */
	setupParams(args) {
		const paramTypes = this.paramTypes = [];
		for (let i = 0; i < args.length; i++) {
			const param = args[i];
			const paramType = utils.getArgumentType(param);
			paramTypes.push(paramType);
		}
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name getUniformLocation
	 *
	 * @desc Return WebGlUniformLocation for various variables 
	 * related to webGl program, such as user-defiend variables,
	 * as well as, dimension sizes, etc.
	 *	
	 */
	getUniformLocation(name) {
		let location = this.programUniformLocationCache[name];
		if (!location) {
			location = this._webGl.getUniformLocation(this.program, name);
			this.programUniformLocationCache[name] = location;
		}
		return location;
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getFragShaderArtifactMap
	 *
	 * @desc Generate Shader artifacts for the kernel program.
	 * The final object contains HEADER, KERNEL, MAIN_RESULT, and others.
	 *
	 * @param {Array} args - The actual parameters sent to the Kernel
	 *
	 * @returns {Object} An object containing the Shader Artifacts(CONSTANTS, HEADER, KERNEL, etc.)
	 *
	 */
	_getFragShaderArtifactMap(args) {
		return {
			HEADER: this._getHeaderString(),
			LOOP_MAX: this._getLoopMaxString(),
			CONSTANTS: this._getConstantsString(),
			DECODE32_ENDIANNESS: this._getDecode32EndiannessString(),
			ENCODE32_ENDIANNESS: this._getEncode32EndiannessString(),
			GET_WRAPAROUND: this._getGetWraparoundString(),
			GET_TEXTURE_CHANNEL: this._getGetTextureChannelString(),
			GET_TEXTURE_INDEX: this._getGetTextureIndexString(),
			GET_RESULT: this._getGetResultString(),
			MAIN_PARAMS: this._getMainParamsString(args),
			MAIN_CONSTANTS: this._getMainConstantsString(),
			KERNEL: this._getKernelString(),
			MAIN_RESULT: this._getMainResultString()
		};
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _addArgument 
	 *
	 * @desc Adds kernel parameters to the Argument Texture, 
	 * binding it to the webGl instance, etc.
	 *
	 * @param {Array|Texture|Number} value - The actual argument supplied to the kernel
	 * @param {String} type - Type of the argument
	 * @param {String} name - Name of the argument
	 *
	 */
	_addArgument(value, type, name) {
		const gl = this._webGl;
		const argumentTexture = this.getArgumentTexture(name);
		switch (type) {
			case 'Array':
				{
					const dim = utils.getDimensions(value, true);
					const size = utils.dimToTexSize({
						floatTextures: this.floatTextures,
						floatOutput: this.floatOutput
					}, dim);

					gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
					gl.bindTexture(gl.TEXTURE_2D, argumentTexture);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

					let length = size[0] * size[1];
					if (this.floatTextures) {
						length *= 4;
					}

					const valuesFlat = new Float32Array(length);
					utils.flattenTo(value, valuesFlat);

					let buffer;
					if (this.floatTextures) {
						buffer = new Float32Array(valuesFlat);
						gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.FLOAT, buffer);
					} else {
						buffer = new Uint8Array((new Float32Array(valuesFlat)).buffer);
						gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size[0], size[1], 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
					}

					const loc = this.getUniformLocation('user_' + name);
					const locSize = this.getUniformLocation('user_' + name + 'Size');
					const dimLoc = this.getUniformLocation('user_' + name + 'Dim');

					if (!this.hardcodeConstants) {
						gl.uniform3fv(dimLoc, dim);
						gl.uniform2fv(locSize, size);
					}
					gl.uniform1i(loc, this.argumentsLength);
					break;
				}
			case 'Number':
				{
					const loc = this.getUniformLocation('user_' + name);
					gl.uniform1f(loc, value);
					break;
				}
			case 'Texture':
				{
					const inputTexture = value;
					const dim = utils.getDimensions(inputTexture.dimensions, true);
					const size = inputTexture.size;

					gl.activeTexture(gl.TEXTURE0 + this.argumentsLength);
					gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);

					const loc = this.getUniformLocation('user_' + name);
					const locSize = this.getUniformLocation('user_' + name + 'Size');
					const dimLoc = this.getUniformLocation('user_' + name + 'Dim');

					gl.uniform3fv(dimLoc, dim);
					gl.uniform2fv(locSize, size);
					gl.uniform1i(loc, this.argumentsLength);
					break;
				}
			default:
				throw 'Input type not supported (WebGL): ' + value;
		}
		this.argumentsLength++;
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getHeaderString
	 *
	 * @desc Get the header string for the program.
	 * This returns an empty string if no sub-kernels are defined.
	 *
	 * @returns {String} result
	 *
	 */
	_getHeaderString() {
		return (
			this.subKernels !== null || this.subKernelProperties !== null ?
			//webgl2 '#version 300 es\n' :
			'#extension GL_EXT_draw_buffers : require\n' :
			''
		);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getLoopMaxString
	 *
	 * @desc Get the maximum loop size String.
	 *
	 * @returns {String} result
	 *
	 */
	_getLoopMaxString() {
		return (
			this.loopMaxIterations ?
			` ${ parseInt(this.loopMaxIterations) }.0;\n` :
			' 100.0;\n'
		);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getConstantsString
	 *
	 * @desc Generate transpiled glsl Strings for constant parameters sent to a kernel
	 *
	 * They can be defined by *hardcodeConstants*
	 *
	 * @returns {String} result
	 *
	 */
	_getConstantsString() {
		const result = [];
		const threadDim = this.threadDim;
		const texSize = this.texSize;
		if (this.hardcodeConstants) {
			result.push(
				`highp vec3 uOutputDim = vec3(${ threadDim[0] },${ threadDim[1] }, ${ threadDim[2] })`,
				`highp vec2 uTexSize = vec2(${ texSize[0] }, ${ texSize[1] })`
			);
		} else {
			result.push(
				'uniform highp vec3 uOutputDim',
				'uniform highp vec2 uTexSize'
			);
		}

		return this._linesToString(result);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getTextureCoordinate
	 *
	 * @desc Get texture coordinate string for the program
	 *
	 * @returns {String} result
	 *
	 */
	_getTextureCoordinate() {
		const names = this.subKernelOutputVariableNames;
		if (names === null || names.length < 1) {
			return 'varying highp vec2 vTexCoord;\n';
		} else {
			return 'out highp vec2 vTexCoord;\n';
		}
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getDecode32EndiannessString
	 *
	 * @desc Get Decode32 endianness string for little-endian and big-endian
	 *
	 * @returns {String} result
	 *
	 */
	_getDecode32EndiannessString() {
		return (
			this.endianness === 'LE' ?
			'' :
			'  rgba.rgba = rgba.abgr;\n'
		);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getEncode32EndiannessString
	 *
	 * @desc Get Encode32 endianness string for little-endian and big-endian
	 *
	 * @returns {String} result
	 *
	 */
	_getEncode32EndiannessString() {
		return (
			this.endianness === 'LE' ?
			'' :
			'  rgba.rgba = rgba.abgr;\n'
		);
	}

	/**
	 * @function
	 * @memberOf WebGLKernel#
	 * @name _getGetWraparoundString
	 *
	 * @returns {String} wraparound string
	 */
	_getGetWraparoundString() {
		return (
			this.wraparound ?
			'  xyz = mod(xyz, texDim);\n' :
			''
		);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getGetTextureChannelString
	 *
	 */
	_getGetTextureChannelString() {
		if (!this.floatTextures) return '';

		return this._linesToString([
			'  int channel = int(integerMod(index, 4.0))',
			'  index = float(int(index) / 4)'
		]);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getGetTextureIndexString
	 *
	 * @desc Get generic texture index string, if floatTextures flag is true.
	 *
	 * @example
	 * '  index = float(int(index)/4);\n'
	 *
	 */
	_getGetTextureIndexString() {
		return (
			this.floatTextures ?
			'  index = float(int(index)/4);\n' :
			''
		);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getGetResultString
	 *
	 */
	_getGetResultString() {
		if (!this.floatTextures) return '  return decode32(texel);\n';
		return this._linesToString([
			'  if (channel == 0) return texel.r',
			'  if (channel == 1) return texel.g',
			'  if (channel == 2) return texel.b',
			'  if (channel == 3) return texel.a'
		]);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getMainParamsString
	 *
	 * @desc Generate transpiled glsl Strings for user-defined parameters sent to a kernel
	 *
	 * @param {Array} args - The actual parameters sent to the Kernel
	 *
	 * @returns {String} result
	 *
	 */
	_getMainParamsString(args) {
		const result = [];
		const paramTypes = this.paramTypes;
		const paramNames = this.paramNames;
		for (let i = 0; i < paramNames.length; i++) {
			const param = args[i];
			const paramName = paramNames[i];
			const paramType = paramTypes[i];
			if (this.hardcodeConstants) {
				if (paramType === 'Array' || paramType === 'Texture') {
					const paramDim = utils.getDimensions(param, true);
					const paramSize = utils.dimToTexSize({
						floatTextures: this.floatTextures,
						floatOutput: this.floatOutput
					}, paramDim);

					result.push(
						`uniform highp sampler2D user_${ paramName }`,
						`highp vec2 user_${ paramName }Size = vec2(${ paramSize[0] }.0, ${ paramSize[1] }.0)`,
						`highp vec3 user_${ paramName }Dim = vec3(${ paramDim[0] }.0, ${ paramDim[1]}.0, ${ paramDim[2] }.0)`
					);
				} else if (paramType === 'Number' && Number.isInteger(param)) {
					result.push(`highp float user_${ paramName } = ${ param }.0`);
				} else if (paramType === 'Number') {
					result.push(`highp float user_${ paramName } = ${ param }`);
				}
			} else {
				if (paramType === 'Array' || paramType === 'Texture') {
					result.push(
						`uniform highp sampler2D user_${ paramName }`,
						`uniform highp vec2 user_${ paramName }Size`,
						`uniform highp vec3 user_${ paramName }Dim`
					);
				} else if (paramType === 'Number') {
					result.push(`uniform highp float user_${ paramName }`);
				}
			}
		}
		return this._linesToString(result);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getMainConstantsString
	 *
	 */
	_getMainConstantsString() {
		const result = [];
		if (this.constants) {
			for (let name in this.constants) {
				if (!this.constants.hasOwnProperty(name)) continue;
				let value = parseFloat(this.constants[name]);

				if (Number.isInteger(value)) {
					result.push('const float constants_' + name + ' = ' + parseInt(value) + '.0');
				} else {
					result.push('const float constants_' + name + ' = ' + parseFloat(value));
				}
			}
		}
		return this._linesToString(result);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getKernelString
	 *
	 * @desc Get Kernel program string (in *glsl*) for a kernel. 
	 *
	 * @returns {String} result
	 *
	 */
	_getKernelString() {
		const result = [];
		const names = this.subKernelOutputVariableNames;
		if (names !== null) {
			result.push('highp float kernelResult = 0.0');
			for (let i = 0; i < names.length; i++) {
				result.push(
					`highp float ${ names[i] } = 0.0`
				);
			}

			/* this is v2 prep
      result.push('highp float kernelResult = 0.0');
			result.push('layout(location = 0) out highp float fradData0 = 0.0');
			for (let i = 0; i < names.length; i++) {
				result.push(
          `highp float ${ names[i] } = 0.0`,
				  `layout(location = ${ i + 1 }) out highp float fragData${ i + 1 } = 0.0`
        );
			}*/
		} else {
			result.push('highp float kernelResult = 0.0');
		}

		return this._linesToString(result) + this.functionBuilder.getPrototypeString('kernel');
	}

	/**
	 * 
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getMainResultString
	 *
	 * @desc Get main result string with checks for floatOutput, graphical, subKernelsOutputs, etc.
	 *
	 * @returns {String} result
	 *
	 */
	_getMainResultString() {
		const names = this.subKernelOutputVariableNames;
		const result = [];
		if (this.floatOutput) {
			result.push('  index *= 4.0');
		}

		if (this.graphical) {
			result.push(
				'  threadId = indexTo3D(index, uOutputDim)',
				'  kernel()',
				'  gl_FragColor = actualColor'
			);
		} else if (this.floatOutput) {
			result.push(
				'  threadId = indexTo3D(index, uOutputDim)',
				'  kernel()',
				'  gl_FragColor.r = kernelResult',
				'  index += 1.0',
				'  threadId = indexTo3D(index, uOutputDim)',
				'  kernel()',
				'  gl_FragColor.g = kernelResult',
				'  index += 1.0',
				'  threadId = indexTo3D(index, uOutputDim)',
				'  kernel()',
				'  gl_FragColor.b = kernelResult',
				'  index += 1.0',
				'  threadId = indexTo3D(index, uOutputDim)',
				'  kernel()',
				'  gl_FragColor.a = kernelResult'
			);
		} else if (names !== null) {
			result.push('  threadId = indexTo3D(index, uOutputDim)');
			result.push('  kernel()');
			result.push('  gl_FragData[0] = encode32(kernelResult)');
			for (let i = 0; i < names.length; i++) {
				result.push(`  gl_FragData[${ i + 1 }] = encode32(${ names[i] })`);
			}
			/* this is v2 prep
       * result.push('  kernel()');
			result.push('  fragData0 = encode32(kernelResult)');
			for (let i = 0; i < names.length; i++) {
				result.push(`  fragData${ i + 1 } = encode32(${ names[i] })`);
			}*/
		} else {
			result.push(
				'  threadId = indexTo3D(index, uOutputDim)',
				'  kernel()',
				'  gl_FragColor = encode32(kernelResult)'
			);
		}

		return this._linesToString(result);
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _linesToString
	 *
	 * @param {Array} lines - An Array of strings
	 *
	 * @returns {String} Single combined String, seperated by *\n*
	 *
	 */
	_linesToString(lines) {
		if (lines.length > 0) {
			return lines.join(';\n') + ';\n';
		} else {
			return '\n';
		}
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _replaceArtifacts
	 *
	 * @param {String} src - Shader string
	 * @param {Array} map - Variables/Constants associated with shader
	 *
	 */
	_replaceArtifacts(src, map) {
		return src.replace(/[ ]*__([A-Z]+[0-9]*([_]?[A-Z])*)__;\n/g, (match, artifact) => {
			if (map.hasOwnProperty(artifact)) {
				return map[artifact];
			}
			throw `unhandled artifact ${ artifact }`;
		});
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _addKernels
	 *
	 * @desc Adds all the sub-kernels supplied with this Kernel instance.
	 *
	 */
	_addKernels() {
		const builder = this.functionBuilder;
		const gl = this._webGl;
		builder.addKernel(this.fnString, {
			prototypeOnly: false,
			constants: this.constants,
			debug: this.debug,
			loopMaxIterations: this.loopMaxIterations
		}, this.paramNames, this.paramTypes);

		if (this.subKernels !== null) {
			const ext = this.ext = gl.getExtension('WEBGL_draw_buffers');
			if (!ext) throw new Error('could not instantiate draw buffers extension');
			this.subKernelOutputTextures = [];
			this.subKernelOutputVariableNames = [];
			for (let i = 0; i < this.subKernels.length; i++) {
				const subKernel = this.subKernels[i];
				builder.addSubKernel(subKernel, {
					prototypeOnly: false,
					constants: this.constants,
					debug: this.debug,
					loopMaxIterations: this.loopMaxIterations
				});
				this.subKernelOutputTextures.push(this.getSubKernelTexture(i));
				this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
			}

		} else if (this.subKernelProperties !== null) {
			const ext = this.ext = gl.getExtension('WEBGL_draw_buffers');
			if (!ext) throw new Error('could not instantiate draw buffers extension');
			this.subKernelOutputTextures = [];
			this.subKernelOutputVariableNames = [];
			let i = 0;
			for (let p in this.subKernelProperties) {
				if (!this.subKernelProperties.hasOwnProperty(p)) continue;
				const subKernel = this.subKernelProperties[p];
				builder.addSubKernel(subKernel, {
					prototypeOnly: false,
					constants: this.constants,
					debug: this.debug,
					loopMaxIterations: this.loopMaxIterations
				});
				this.subKernelOutputTextures.push(this.getSubKernelTexture(p));
				this.subKernelOutputVariableNames.push(subKernel.name + 'Result');
				i++;
			}
		}
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getFragShaderString
	 *
	 * @desc Get the fragment shader String.
	 * If the String hasn't been compiled yet, 
	 * then this method compiles it as well
	 *
	 * @param {Array} args - The actual parameters sent to the Kernel
	 *
	 * @returns {String} Fragment Shader string
	 *
	 */
	_getFragShaderString(args) {
		if (this.compiledFragShaderString !== null) {
			return this.compiledFragShaderString;
		}
		return this.compiledFragShaderString = this._replaceArtifacts(fragShaderString, this._getFragShaderArtifactMap(args));
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name _getVertShaderString
	 *
	 * @desc Get the vertical shader String
	 *
	 * @param {Array} args - The actual parameters sent to the Kernel
	 *
	 * @returns {String} Vertical Shader string
	 *
	 */
	_getVertShaderString(args) {
		if (this.compiledVertShaderString !== null) {
			return this.compiledVertShaderString;
		}
		//TODO: webgl2 compile like frag shader
		return this.compiledVertShaderString = vertShaderString;
	}

	/**
	 * @memberOf WebGLKernel#
	 * @function
	 * @name toString
	 *
	 * @desc Returns the *pre-compiled* Kernel as a JS Object String, that can be reused.
	 *
	 */
	toString() {
		return kernelString(this);
	}
};
},{"../../core/texture":68,"../../core/utils":70,"../kernel-base":53,"./kernel-string":58,"./shader-frag":61,"./shader-vert":62,"fs":74}],60:[function(require,module,exports){
'use strict';

const RunnerBase = require('../runner-base');
const WebGLKernel = require('./kernel');
const utils = require('../../core/utils');
const WebGLFunctionBuilder = require('./function-builder');


module.exports = class WebGLRunner extends RunnerBase {

	/**
	 * @constructor WebGLRunner
	 *
 	 * @extends RunnerBase

 	 * @desc Instantiates a Runner instance for the kernel.
	 * 
	 * @param {Object} settings - Settings to instantiate properties in RunnerBase, with given values
	 *
	 */
	constructor(settings) {
		super(new WebGLFunctionBuilder(), settings);
		this.Kernel = WebGLKernel;
		this.kernel = null;
	}

	/**
	 * @memberOf WebGLRunner#
	 * @function
	 * @name getMode
	 *
	 * @desc Return the current mode in which gpu.js is executing.
	 * 
	 * @returns {String} The current mode; "cpu".
	 *
	 */
	getMode() {
		return 'gpu';
	}
};
},{"../../core/utils":70,"../runner-base":55,"./function-builder":56,"./kernel":59}],61:[function(require,module,exports){
module.exports = `__HEADER__;
precision highp float;
precision highp int;
precision highp sampler2D;

const float LOOP_MAX = __LOOP_MAX__;
#define EPSILON 0.0000001;

__CONSTANTS__;

varying highp vec2 vTexCoord;

vec4 round(vec4 x) {
  return floor(x + 0.5);
}

highp float round(highp float x) {
  return floor(x + 0.5);
}

vec2 integerMod(vec2 x, float y) {
  vec2 res = floor(mod(x, y));
  return res * step(1.0 - floor(y), -res);
}

vec3 integerMod(vec3 x, float y) {
  vec3 res = floor(mod(x, y));
  return res * step(1.0 - floor(y), -res);
}

vec4 integerMod(vec4 x, vec4 y) {
  vec4 res = floor(mod(x, y));
  return res * step(1.0 - floor(y), -res);
}

highp float integerMod(highp float x, highp float y) {
  highp float res = floor(mod(x, y));
  return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
}

highp int integerMod(highp int x, highp int y) {
  return int(integerMod(float(x), float(y)));
}

// Here be dragons!
// DO NOT OPTIMIZE THIS CODE
// YOU WILL BREAK SOMETHING ON SOMEBODY\'S MACHINE
// LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
const vec2 MAGIC_VEC = vec2(1.0, -256.0);
const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
highp float decode32(highp vec4 rgba) {
  __DECODE32_ENDIANNESS__;
  rgba *= 255.0;
  vec2 gte128;
  gte128.x = rgba.b >= 128.0 ? 1.0 : 0.0;
  gte128.y = rgba.a >= 128.0 ? 1.0 : 0.0;
  float exponent = 2.0 * rgba.a - 127.0 + dot(gte128, MAGIC_VEC);
  float res = exp2(round(exponent));
  rgba.b = rgba.b - 128.0 * gte128.x;
  res = dot(rgba, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;
  res *= gte128.y * -2.0 + 1.0;
  return res;
}

highp vec4 encode32(highp float f) {
  highp float F = abs(f);
  highp float sign = f < 0.0 ? 1.0 : 0.0;
  highp float exponent = floor(log2(F));
  highp float mantissa = (exp2(-exponent) * F);
  // exponent += floor(log2(mantissa));
  vec4 rgba = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
  rgba.rg = integerMod(rgba.rg, 256.0);
  rgba.b = integerMod(rgba.b, 128.0);
  rgba.a = exponent*0.5 + 63.5;
  rgba.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
  rgba = floor(rgba);
  rgba *= 0.003921569; // 1/255
  __ENCODE32_ENDIANNESS__;
  return rgba;
}
// Dragons end here

highp float index;
highp vec3 threadId;

highp vec3 indexTo3D(highp float idx, highp vec3 texDim) {
  highp float z = floor(idx / (texDim.x * texDim.y));
  idx -= z * texDim.x * texDim.y;
  highp float y = floor(idx / texDim.x);
  highp float x = integerMod(idx, texDim.x);
  return vec3(x, y, z);
}

highp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float z, highp float y, highp float x) {
  highp vec3 xyz = vec3(x, y, z);
  xyz = floor(xyz + 0.5);
  __GET_WRAPAROUND__;
  highp float index = round(xyz.x + texDim.x * (xyz.y + texDim.y * xyz.z));
  __GET_TEXTURE_CHANNEL__;
  highp float w = round(texSize.x);
  vec2 st = vec2(integerMod(index, w), float(int(index) / int(w))) + 0.5;
  __GET_TEXTURE_INDEX__;
  highp vec4 texel = texture2D(tex, st / texSize);
  __GET_RESULT__;
}

highp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float y, highp float x) {
  return get(tex, texSize, texDim, 0.0, y, x);
}

highp float get(highp sampler2D tex, highp vec2 texSize, highp vec3 texDim, highp float x) {
  return get(tex, texSize, texDim, 0.0, 0.0, x);
}

highp vec4 actualColor;
void color(float r, float g, float b, float a) {
  actualColor = vec4(r,g,b,a);
}

void color(float r, float g, float b) {
  color(r,g,b,1.0);
}

__MAIN_PARAMS__;
__MAIN_CONSTANTS__;
__KERNEL__;

void main(void) {
  index = floor(vTexCoord.s * float(uTexSize.x)) + floor(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
  __MAIN_RESULT__;
}`;
},{}],62:[function(require,module,exports){
module.exports = `precision highp float;
precision highp int;
precision highp sampler2D;

attribute highp vec2 aPos;
attribute highp vec2 aTexCoord;

varying highp vec2 vTexCoord;

void main(void) {
  gl_Position = vec4(aPos, 0, 1);
  vTexCoord = aTexCoord;
}`;
},{}],63:[function(require,module,exports){
'use strict';

const WebGLKernel = require('./kernel');
const utils = require('../../core/utils');

/**
 * @class WebGLValidatorKernel
 *
 * @desc Helper class for WebGLKernel to validate texture size and dimensions.
 *
 */
module.exports = class WebGLValidatorKernel extends WebGLKernel {

	/** 
	 * @memberOf WebGLValidatorKernel#
	 * @function
	 * @name validateOptions
	 *
	 */
	validateOptions() {
		this.texSize = utils.dimToTexSize({
			floatTextures: this.floatTextures,
			floatOutput: this.floatOutput
		}, this.dimensions, true);
	}
};
},{"../../core/utils":70,"./kernel":59}],64:[function(require,module,exports){
'use strict';

const utils = require('./utils');
module.exports = function alias(name, fn) {
	const fnString = fn.toString();
	return new Function(`return function ${ name } (${ utils.getParamNamesFromString(fnString).join(', ') }) {${ utils.getFunctionBodyFromString(fnString) }}`)();
};
},{"./utils":70}],65:[function(require,module,exports){
'use strict';

const UtilsCore = require("./utils-core");

/**
 * This is a minimalistic version of GPU.js used 
 * to run precompiled GPU.JS code.
 *
 * This intentionally excludes the JS AST compiller : which is 400kb alone/
 *
 * @class GPUCore
 */
module.exports = class GPUCore {

	/**
	 * @name validateKernelObj
	 * @function
	 * @static
	 * @memberOf GPUCore
	 *
	 * @description Validates the KernelObj to comply with the defined format
	 * Note that this does only a limited sanity check, and does not  
	 * gurantee a full working validation.
	 *
	 * For the kernel object format see : <kernelObj-format>
	 *
	 * @param {Object|String} kernelObj - KernelObj used to validate
	 *
	 * @returns {Object} The validated kernel object, converted from JSON if needed
	 *
	 */
	static validateKernelObj(kernelObj) {

		// NULL validation
		if (kernelObj == null) {
			throw "KernelObj being validated is NULL";
		}

		// String JSON conversion
		if (typeof kernelObj === "string") {
			try {
				kernelObj = JSON.parse(kernelObj);
			} catch (e) {
				console.error(e);
				throw "Failed to convert KernelObj from JSON string";
			}

			// NULL validation
			if (kernelObj == null) {
				throw "Invalid (NULL) KernelObj JSON string representation";
			}
		}

		// Check for kernel obj flag
		if (kernelObj.isKernelObj != true) {
			throw "Failed missing isKernelObj flag check";
		}

		// Return the validated kernelObj
		return kernelObj;
	}

	/**
	 * @name loadKernelObj
	 * @function
	 * @static
	 * @memberOf GPUCore
	 *
	 * @description Loads the precompilled kernel object. For GPUCore this is the ONLY way to create the kernel.
	 * To generate the kernelObj use <Kernel.exportKernelObj>
	 *
	 * Note that this function calls <validateKernelObj> internally, and throws an exception if it fails.
	 *
	 * @see GPUCore.validateKernelObj
	 * @see	Kernel.exportKernelObj
	 *
	 * @param {Object} kernelObj - The precompilled kernel object
	 * @param {Object} inOpt - [Optional] the option overrides to use
	 *
	 * @returns {Function} The kernel function
	 * 
	 */
	static loadKernelObj(kernelObj, inOpt) {

		// Validates the kernelObj, throws an exception if it fails
		kernelObj = validateKernelObj(kernelObj);


	}
}
},{"./utils-core":69}],66:[function(require,module,exports){
'use strict';

const utils = require('./utils');
const WebGLRunner = require('../backend/web-gl/runner');
const CPURunner = require('../backend/cpu/runner');
const WebGLValidatorKernel = require('../backend/web-gl/validator-kernel');
const GPUCore = require("./gpu-core");

/**
 * Initialises the GPU.js library class which manages the webGlContext for the created functions.
 * @class
 * @extends GPUCore
 */
class GPU extends GPUCore {
	/**
	 * Creates an instance of GPU.
	 * @param {any} settings - Settings to set mode, andother properties. See #GPUCore
	 * @memberOf GPU#
	 */
	constructor(settings) {
		super(settings);

		settings = settings || {};
		this._canvas = settings.canvas || null;
		this._webGl = settings.webGl || null;
		let mode = settings.mode || 'webgl';
		if (!utils.isWebGlSupported()) {
			console.warn('Warning: gpu not supported, falling back to cpu support');
			mode = 'cpu';
		}

		this.kernels = [];

		const runnerSettings = {
			canvas: this._canvas,
			webGl: this._webGl
		};

		if (mode) {
			switch (mode.toLowerCase()) {
				case 'cpu':
					this._runner = new CPURunner(runnerSettings);
					break;
				case 'gpu':
				case 'webgl':
					this._runner = new WebGLRunner(runnerSettings);
					break;
				case 'webgl-validator':
					this._runner = new WebGLRunner(runnerSettings);
					this._runner.Kernel = WebGLValidatorKernel;
					break;
				default:
					throw new Error(`"${mode}" mode is not defined`);
			}
		}
	}
	/**
	 *
	 * This creates a callable function object to call the kernel function with the argument parameter set
	 *
	 * @name createKernel
	 * @function
	 * @memberOf GPU##
	 * 
	 * @param {Function} inputFunction - The calling to perform the conversion
	 * @param {Object} settings - The parameter configuration object
	 * @property {String} settings.dimensions - Thread dimension array (Defeaults to [1024])                                                    
	 * @property {String} settings.mode - CPU / GPU configuration mode (Defaults to null)
	 * 
	 * The following modes are supported
	 * *null* / *'auto'* : Attempts to build GPU mode, else fallbacks
	 * *'gpu'* : Attempts to build GPU mode, else fallbacks
	 * *'cpu'* : Forces JS fallback mode only
	 *
	 *
	 * @returns {Function} callable function to run
	 *
	 */
	createKernel(fn, settings) {
		//
		// basic parameters safety checks
		//
		if (typeof fn === 'undefined') {
			throw 'Missing fn parameter';
		}
		if (!utils.isFunction(fn)) {
			throw 'fn parameter not a function';
		}

		const kernel = this._runner.buildKernel(fn, settings || {});

		//if canvas didn't come from this, propagate from kernel
		if (!this._canvas) {
			this._canvas = kernel.getCanvas();
		}
		if (!this._runner.canvas) {
			this._runner.canvas = kernel.getCanvas();
		}

		this.kernels.push(kernel);

		return kernel;
	}

	/**
	 *
	 * Create a super kernel which executes sub kernels 
	 * and saves their output to be used with the next sub kernel.
	 * This can be useful if we want to save the output on one kernel,
	 * and then use it as an input to another kernel. *Machine Learning*
	 * 
	 * @name createKernelMap
	 * @function
	 * @memberOf GPU#
	 * 
	 * @param {Object|Array} subKernels - Sub kernels for this kernel
	 * @param {Function} rootKernel - Root kernel
	 * 
	 * @returns {Function} callable kernel function
	 * 
	 * @example
	 * const megaKernel = gpu.createKernelMap({
	 *   addResult: function add(a, b) {
	 *     return a[this.thread.x] + b[this.thread.x];
	 *   },
	 *   multiplyResult: function multiply(a, b) {
	 *     return a[this.thread.x] * b[this.thread.x];
	 *   },
	 *  }, function(a, b, c) {
	 *       return multiply(add(a, b), c);
	 * });
	 *		
	 * megaKernel(a, b, c);
	 * 
	 * Note: You can also define subKernels as an array of functions. 
	 * > [add, multiply]
	 *
	 */
	createKernelMap() {
		let fn;
		let settings;
		if (typeof arguments[arguments.length - 2] === 'function') {
			fn = arguments[arguments.length - 2];
			settings = arguments[arguments.length - 1];
		} else {
			fn = arguments[arguments.length - 1];
		}

		if (!utils.isWebGlDrawBuffersSupported()) {
			this._runner = new CPURunner(settings);
		}

		const kernel = this.createKernel(fn, settings);
		if (Array.isArray(arguments[0])) {
			const functions = arguments[0];
			for (let i = 0; i < functions.length; i++) {
				kernel.addSubKernel(functions[i]);
			}
		} else {
			const functions = arguments[0];
			for (let p in functions) {
				if (!functions.hasOwnProperty(p)) continue;
				kernel.addSubKernelProperty(p, functions[p]);
			}
		}

		return kernel;
	}

	/**
	 * 
	 * Combine different kernels into one super Kernel, 
	 * useful to perform multiple operations inside one 
	 * kernel without the penalty of data transfer between 
	 * cpu and gpu.
	 * 
	 * The number of kernel functions sent to this method can be variable.
	 * You can send in one, two, etc.
	 * 
	 * @name combineKernels
	 * @function
	 * @memberOf GPU#
	 * 
	 * @param {Function} subKernels - Kernel function(s) to combine.
	 * @param {Function} rootKernel - Root kernel to combine kernels into
	 * 
	 * @example 
	 * 	combineKernels(add, multiply, function(a,b,c){
	 *	 	return add(multiply(a,b), c)
	 *	})
	 * 
	 * @returns {Function} Callable kernel function
	 *
	 */
	combineKernels() {
		const lastKernel = arguments[arguments.length - 2];
		const combinedKernel = arguments[arguments.length - 1];
		if (this.getMode() === 'cpu') return combinedKernel;

		const canvas = arguments[0].getCanvas();
		let webGl = arguments[0].getWebGl();

		for (let i = 0; i < arguments.length - 1; i++) {
			arguments[i]
				.setCanvas(canvas)
				.setWebGl(webGl)
				.setOutputToTexture(true);
		}

		return function() {
			combinedKernel.apply(null, arguments);
			const texSize = lastKernel.texSize;
			const gl = lastKernel.getWebGl();
			const threadDim = lastKernel.threadDim;
			let result;
			if (lastKernel.floatOutput) {
				result = new Float32Array(texSize[0] * texSize[1] * 4);
				gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.FLOAT, result);
			} else {
				const bytes = new Uint8Array(texSize[0] * texSize[1] * 4);
				gl.readPixels(0, 0, texSize[0], texSize[1], gl.RGBA, gl.UNSIGNED_BYTE, bytes);
				result = Float32Array.prototype.slice.call(new Float32Array(bytes.buffer));
			}

			result = result.subarray(0, threadDim[0] * threadDim[1] * threadDim[2]);

			if (lastKernel.dimensions.length === 1) {
				return result;
			} else if (lastKernel.dimensions.length === 2) {
				return utils.splitArray(result, lastKernel.dimensions[0]);
			} else if (lastKernel.dimensions.length === 3) {
				const cube = utils.splitArray(result, lastKernel.dimensions[0] * lastKernel.dimensions[1]);
				return cube.map(function(x) {
					return utils.splitArray(x, lastKernel.dimensions[0]);
				});
			}
		};
	}


	/**
	 *
	 * Adds additional functions, that the kernel may call.
	 *
	 * @name addFunction
	 * @function
	 * @memberOf GPU#
	 *
	 * @param {Function|String} fn - JS Function to do conversion
	 * @param {String[]|Object} paramTypes - Parameter type array, assumes all parameters are 'float' if null
	 * @param {String} returnType - The return type, assumes 'float' if null
	 *
	 * @returns {GPU} returns itself
	 *
	 */
	addFunction(fn, paramTypes, returnType) {
		this._runner.functionBuilder.addFunction(null, fn, paramTypes, returnType);
		return this;
	}

	/**
	 *
	 * Return the current mode in which gpu.js is executing.
	 * @name getMode
	 * @function
	 * @memberOf GPU#
	 * 
	 * @returns {String} The current mode, "cpu", "webgl", etc.
	 *
	 */
	getMode() {
		return this._runner.getMode();
	}

	/**
	 *
	 * Return TRUE, if browser supports WebGl AND Canvas
	 *
	 * @name get isWebGlSupported
	 * @function
	 * @memberOf GPU#
	 * 
	 * Note: This function can also be called directly `GPU.isWebGlSupported()`
	 *
	 * @returns {Boolean} TRUE if browser supports webGl
	 *
	 */
	isWebGlSupported() {
		return utils.isWebGlSupported();
	}

	/**
	 *
	 * Return the canvas object bound to this gpu instance.
	 *
	 * @name getCanvas
	 * @function
	 * @memberOf GPU#
	 * 
	 * @returns {Object} Canvas object if present
	 *
	 */
	getCanvas() {
		return this._canvas;
	}

	/**
	 *
	 * Return the webGl object bound to this gpu instance.
	 *
	 * @name getWebGl
	 * @function
	 * @memberOf GPU#
	 * 
	 * @returns {Object} WebGl object if present
	 *
	 */
	getWebGl() {
		return this._webGl;
	}
};

// This ensure static methods are "inherited"
// See: https://stackoverflow.com/questions/5441508/how-to-inherit-static-methods-from-base-class-in-javascript
Object.assign(GPU, GPUCore);

module.exports = GPU;
},{"../backend/cpu/runner":50,"../backend/web-gl/runner":60,"../backend/web-gl/validator-kernel":63,"./gpu-core":65,"./utils":70}],67:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function() {
	var parser = {
		trace: function trace() {},
		yy: {},
		symbols_: {
			"error": 2,
			"Statement": 3,
			"Block": 4,
			"VariableStatement": 5,
			"EmptyStatement": 6,
			"ExpressionStatement": 7,
			"IfStatement": 8,
			"IterationStatement": 9,
			"ContinueStatement": 10,
			"BreakStatement": 11,
			"ReturnStatement": 12,
			"WithStatement": 13,
			"LabelledStatement": 14,
			"SwitchStatement": 15,
			"ThrowStatement": 16,
			"TryStatement": 17,
			"DebuggerStatement": 18,
			"{": 19,
			"StatementList": 20,
			"}": 21,
			"VAR": 22,
			"VariableDeclarationList": 23,
			"VariableDeclaration": 24,
			",": 25,
			"VariableDeclarationListNoIn": 26,
			"VariableDeclarationNoIn": 27,
			"IDENTIFIER": 28,
			"Initialiser": 29,
			"InitialiserNoIn": 30,
			"=": 31,
			"AssignmentExpression": 32,
			"AssignmentExpressionNoIn": 33,
			";": 34,
			"ExpressionNoBF": 35,
			"IF": 36,
			"(": 37,
			"Expression": 38,
			")": 39,
			"ELSE": 40,
			"DO": 41,
			"WHILE": 42,
			"FOR": 43,
			"ExpressionNoIn": 44,
			"LeftHandSideExpression": 45,
			"IN": 46,
			"CONTINUE": 47,
			"BREAK": 48,
			"RETURN": 49,
			"WITH": 50,
			"SWITCH": 51,
			"CaseBlock": 52,
			"CaseClauses": 53,
			"DefaultClause": 54,
			"CaseClause": 55,
			"CASE": 56,
			":": 57,
			"DEFAULT": 58,
			"THROW": 59,
			"TRY": 60,
			"Catch": 61,
			"Finally": 62,
			"CATCH": 63,
			"FINALLY": 64,
			"DEBUGGER": 65,
			"FunctionDeclaration": 66,
			"FUNCTION": 67,
			"FunctionBody": 68,
			"FormalParameterList": 69,
			"FunctionExpression": 70,
			"SourceElements": 71,
			"Program": 72,
			"EOF": 73,
			"SourceElement": 74,
			"PrimaryExpression": 75,
			"PrimaryExpressionNoBrace": 76,
			"ObjectLiteral": 77,
			"THIS": 78,
			"Literal": 79,
			"ArrayLiteral": 80,
			"[": 81,
			"]": 82,
			"Elision": 83,
			"ElementList": 84,
			"PropertyNameAndValueList": 85,
			"PropertyAssignment": 86,
			"PropertyName": 87,
			"PropertySetParameterList": 88,
			"IdentifierName": 89,
			"StringLiteral": 90,
			"NumericLiteral": 91,
			"MemberExpression": 92,
			".": 93,
			"NEW": 94,
			"Arguments": 95,
			"MemberExpressionNoBF": 96,
			"NewExpression": 97,
			"NewExpressionNoBF": 98,
			"CallExpression": 99,
			"CallExpressionNoBF": 100,
			"ReservedWord": 101,
			"ArgumentList": 102,
			"LeftHandSideExpressionNoBF": 103,
			"PostfixExpression": 104,
			"++": 105,
			"--": 106,
			"PostfixExpressionNoBF": 107,
			"UnaryExpression": 108,
			"UnaryExpr": 109,
			"UnaryExpressionNoBF": 110,
			"DELETE": 111,
			"VOID": 112,
			"TYPEOF": 113,
			"BR++": 114,
			"BR--": 115,
			"+": 116,
			"-": 117,
			"~": 118,
			"!": 119,
			"MultiplicativeExpression": 120,
			"*": 121,
			"/": 122,
			"%": 123,
			"MultiplicativeExpressionNoBF": 124,
			"AdditiveExpression": 125,
			"AdditiveExpressionNoBF": 126,
			"ShiftExpression": 127,
			"<<": 128,
			">>": 129,
			">>>": 130,
			"ShiftExpressionNoBF": 131,
			"RelationalExpression": 132,
			"<": 133,
			">": 134,
			"<=": 135,
			">=": 136,
			"INSTANCEOF": 137,
			"RelationalExpressionNoIn": 138,
			"RelationalExpressionNoBF": 139,
			"EqualityExpression": 140,
			"==": 141,
			"!=": 142,
			"===": 143,
			"!==": 144,
			"EqualityExpressionNoIn": 145,
			"EqualityExpressionNoBF": 146,
			"BitwiseANDExpression": 147,
			"&": 148,
			"BitwiseANDExpressionNoIn": 149,
			"BitwiseANDExpressionNoBF": 150,
			"BitwiseXORExpression": 151,
			"^": 152,
			"BitwiseXORExpressionNoIn": 153,
			"BitwiseXORExpressionNoBF": 154,
			"BitwiseORExpression": 155,
			"|": 156,
			"BitwiseORExpressionNoIn": 157,
			"BitwiseORExpressionNoBF": 158,
			"LogicalANDExpression": 159,
			"&&": 160,
			"LogicalANDExpressionNoIn": 161,
			"LogicalANDExpressionNoBF": 162,
			"LogicalORExpression": 163,
			"||": 164,
			"LogicalORExpressionNoIn": 165,
			"LogicalORExpressionNoBF": 166,
			"ConditionalExpression": 167,
			"?": 168,
			"ConditionalExpressionNoIn": 169,
			"ConditionalExpressionNoBF": 170,
			"AssignmentOperator": 171,
			"AssignmentExpressionNoBF": 172,
			"*=": 173,
			"/=": 174,
			"%=": 175,
			"+=": 176,
			"-=": 177,
			"<<=": 178,
			">>=": 179,
			">>>=": 180,
			"&=": 181,
			"^=": 182,
			"|=": 183,
			"NullLiteral": 184,
			"BooleanLiteral": 185,
			"RegularExpressionLiteral": 186,
			"NULL": 187,
			"TRUE": 188,
			"FALSE": 189,
			"NUMERIC_LITERAL": 190,
			"STRING_LITERAL": 191,
			"RegularExpressionLiteralBegin": 192,
			"REGEXP_LITERAL": 193,
			"CLASS": 194,
			"CONST": 195,
			"ENUM": 196,
			"EXPORT": 197,
			"EXTENDS": 198,
			"IMPORT": 199,
			"SUPER": 200,
			"$accept": 0,
			"$end": 1
		},
		terminals_: {
			2: "error",
			19: "{",
			21: "}",
			22: "VAR",
			25: ",",
			28: "IDENTIFIER",
			31: "=",
			34: ";",
			36: "IF",
			37: "(",
			39: ")",
			40: "ELSE",
			41: "DO",
			42: "WHILE",
			43: "FOR",
			46: "IN",
			47: "CONTINUE",
			48: "BREAK",
			49: "RETURN",
			50: "WITH",
			51: "SWITCH",
			56: "CASE",
			57: ":",
			58: "DEFAULT",
			59: "THROW",
			60: "TRY",
			63: "CATCH",
			64: "FINALLY",
			65: "DEBUGGER",
			67: "FUNCTION",
			73: "EOF",
			78: "THIS",
			81: "[",
			82: "]",
			93: ".",
			94: "NEW",
			105: "++",
			106: "--",
			111: "DELETE",
			112: "VOID",
			113: "TYPEOF",
			114: "BR++",
			115: "BR--",
			116: "+",
			117: "-",
			118: "~",
			119: "!",
			121: "*",
			122: "/",
			123: "%",
			128: "<<",
			129: ">>",
			130: ">>>",
			133: "<",
			134: ">",
			135: "<=",
			136: ">=",
			137: "INSTANCEOF",
			141: "==",
			142: "!=",
			143: "===",
			144: "!==",
			148: "&",
			152: "^",
			156: "|",
			160: "&&",
			164: "||",
			168: "?",
			173: "*=",
			174: "/=",
			175: "%=",
			176: "+=",
			177: "-=",
			178: "<<=",
			179: ">>=",
			180: ">>>=",
			181: "&=",
			182: "^=",
			183: "|=",
			187: "NULL",
			188: "TRUE",
			189: "FALSE",
			190: "NUMERIC_LITERAL",
			191: "STRING_LITERAL",
			193: "REGEXP_LITERAL",
			194: "CLASS",
			195: "CONST",
			196: "ENUM",
			197: "EXPORT",
			198: "EXTENDS",
			199: "IMPORT",
			200: "SUPER"
		},
		productions_: [0, [3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[3, 1],
			[4, 3],
			[20, 2],
			[20, 0],
			[5, 2],
			[23, 1],
			[23, 3],
			[26, 1],
			[26, 3],
			[24, 1],
			[24, 2],
			[27, 1],
			[27, 2],
			[29, 2],
			[30, 2],
			[6, 1],
			[7, 2],
			[7, 2],
			[8, 5],
			[8, 7],
			[9, 7],
			[9, 7],
			[9, 5],
			[9, 9],
			[9, 8],
			[9, 8],
			[9, 7],
			[9, 8],
			[9, 7],
			[9, 7],
			[9, 6],
			[9, 10],
			[9, 9],
			[9, 9],
			[9, 8],
			[9, 7],
			[9, 8],
			[10, 2],
			[10, 2],
			[10, 3],
			[10, 3],
			[11, 2],
			[11, 2],
			[11, 3],
			[11, 3],
			[12, 2],
			[12, 2],
			[12, 3],
			[12, 3],
			[13, 5],
			[15, 5],
			[52, 3],
			[52, 5],
			[53, 2],
			[53, 0],
			[55, 4],
			[54, 3],
			[14, 3],
			[16, 3],
			[16, 3],
			[17, 3],
			[17, 3],
			[17, 4],
			[61, 5],
			[62, 2],
			[18, 2],
			[18, 2],
			[66, 7],
			[66, 8],
			[70, 7],
			[70, 8],
			[70, 6],
			[70, 7],
			[69, 1],
			[69, 3],
			[68, 1],
			[72, 2],
			[71, 2],
			[71, 0],
			[74, 1],
			[74, 1],
			[75, 1],
			[75, 1],
			[76, 1],
			[76, 1],
			[76, 1],
			[76, 1],
			[76, 3],
			[80, 2],
			[80, 3],
			[80, 3],
			[80, 4],
			[80, 5],
			[84, 1],
			[84, 2],
			[84, 3],
			[84, 4],
			[83, 1],
			[83, 2],
			[77, 2],
			[77, 3],
			[77, 4],
			[85, 1],
			[85, 3],
			[86, 3],
			[86, 7],
			[86, 8],
			[87, 1],
			[87, 1],
			[87, 1],
			[88, 1],
			[92, 1],
			[92, 1],
			[92, 4],
			[92, 3],
			[92, 3],
			[96, 1],
			[96, 4],
			[96, 3],
			[96, 3],
			[97, 1],
			[97, 2],
			[98, 1],
			[98, 2],
			[99, 2],
			[99, 2],
			[99, 4],
			[99, 3],
			[100, 2],
			[100, 2],
			[100, 4],
			[100, 3],
			[89, 1],
			[89, 1],
			[95, 2],
			[95, 3],
			[102, 1],
			[102, 3],
			[45, 1],
			[45, 1],
			[103, 1],
			[103, 1],
			[104, 1],
			[104, 2],
			[104, 2],
			[107, 1],
			[107, 2],
			[107, 2],
			[108, 1],
			[108, 1],
			[110, 1],
			[110, 1],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[109, 2],
			[120, 1],
			[120, 3],
			[120, 3],
			[120, 3],
			[124, 1],
			[124, 3],
			[124, 3],
			[124, 3],
			[125, 1],
			[125, 3],
			[125, 3],
			[126, 1],
			[126, 3],
			[126, 3],
			[127, 1],
			[127, 3],
			[127, 3],
			[127, 3],
			[131, 1],
			[131, 3],
			[131, 3],
			[131, 3],
			[132, 1],
			[132, 3],
			[132, 3],
			[132, 3],
			[132, 3],
			[132, 3],
			[132, 3],
			[138, 1],
			[138, 3],
			[138, 3],
			[138, 3],
			[138, 3],
			[138, 3],
			[139, 1],
			[139, 3],
			[139, 3],
			[139, 3],
			[139, 3],
			[139, 3],
			[139, 3],
			[140, 1],
			[140, 3],
			[140, 3],
			[140, 3],
			[140, 3],
			[145, 1],
			[145, 3],
			[145, 3],
			[145, 3],
			[145, 3],
			[146, 1],
			[146, 3],
			[146, 3],
			[146, 3],
			[146, 3],
			[147, 1],
			[147, 3],
			[149, 1],
			[149, 3],
			[150, 1],
			[150, 3],
			[151, 1],
			[151, 3],
			[153, 1],
			[153, 3],
			[154, 1],
			[154, 3],
			[155, 1],
			[155, 3],
			[157, 1],
			[157, 3],
			[158, 1],
			[158, 3],
			[159, 1],
			[159, 3],
			[161, 1],
			[161, 3],
			[162, 1],
			[162, 3],
			[163, 1],
			[163, 3],
			[165, 1],
			[165, 3],
			[166, 1],
			[166, 3],
			[167, 1],
			[167, 5],
			[169, 1],
			[169, 5],
			[170, 1],
			[170, 5],
			[32, 1],
			[32, 3],
			[32, 3],
			[33, 1],
			[33, 3],
			[33, 3],
			[172, 1],
			[172, 3],
			[172, 3],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[171, 1],
			[38, 1],
			[38, 3],
			[44, 1],
			[44, 3],
			[35, 1],
			[35, 3],
			[79, 1],
			[79, 1],
			[79, 1],
			[79, 1],
			[79, 1],
			[184, 1],
			[185, 1],
			[185, 1],
			[91, 1],
			[90, 1],
			[186, 2],
			[192, 1],
			[192, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1],
			[101, 1]
		],
		performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */ , $$ /* vstack */ , _$ /* lstack */
			/**/
		) {
			/* this == yyval */

			var $0 = $$.length - 1;
			switch (yystate) {
				case 16:
					this.$ = new BlockStatementNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 17:
					this.$ = $$[$0 - 1].concat($$[$0]);

					break;
				case 18:
					this.$ = [];

					break;
				case 19:
					this.$ = new VariableDeclarationNode($$[$0], "var", createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 20:
					this.$ = [$$[$0]];

					break;
				case 21:
					this.$ = $$[$0 - 2].concat($$[$0]);

					break;
				case 22:
					this.$ = [$$[$0]];

					break;
				case 23:
					this.$ = $$[$0 - 2].concat($$[$0]);

					break;
				case 24:
					this.$ = new VariableDeclaratorNode(new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0])), null, createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 25:
					this.$ = new VariableDeclaratorNode(new IdentifierNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0 - 1])), $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 26:
					this.$ = new VariableDeclaratorNode(new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0])), null, createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 27:
					this.$ = new VariableDeclaratorNode(new IdentifierNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0 - 1])), $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 28:
					this.$ = $$[$0];

					break;
				case 29:
					this.$ = $$[$0];

					break;
				case 30:
					this.$ = new EmptyStatementNode(createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 31:
					this.$ = new ExpressionStatementNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 32:
					this.$ = new ExpressionStatementNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0 - 1]));

					break;
				case 33:
					this.$ = new IfStatementNode($$[$0 - 2], $$[$0], null, createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 34:
					this.$ = new IfStatementNode($$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 35:
					this.$ = new DoWhileStatementNode($$[$0 - 5], $$[$0 - 2], createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 36:
					this.$ = new DoWhileStatementNode($$[$0 - 5], $$[$0 - 2], createSourceLocation(null, _$[$0 - 6], _$[$0 - 1]));

					break;
				case 37:
					this.$ = new WhileStatementNode($$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 38:
					this.$ = new ForStatementNode($$[$0 - 6], $$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 8], _$[$0]));

					break;
				case 39:
					this.$ = new ForStatementNode($$[$0 - 5], $$[$0 - 3], null, $$[$0], createSourceLocation(null, _$[$0 - 7], _$[$0]));

					break;
				case 40:
					this.$ = new ForStatementNode($$[$0 - 5], null, $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 7], _$[$0]));

					break;
				case 41:
					this.$ = new ForStatementNode($$[$0 - 4], null, null, $$[$0], createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 42:
					this.$ = new ForStatementNode(null, $$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 7], _$[$0]));

					break;
				case 43:
					this.$ = new ForStatementNode(null, $$[$0 - 3], null, $$[$0], createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 44:
					this.$ = new ForStatementNode(null, null, $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 45:
					this.$ = new ForStatementNode(null, null, null, $$[$0], createSourceLocation(null, _$[$0 - 5], _$[$0]));

					break;
				case 46:
					this.$ = new ForStatementNode($$[$0 - 6], $$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 9], _$[$0]));

					break;
				case 47:
					this.$ = new ForStatementNode($$[$0 - 5], $$[$0 - 3], null, $$[$0], createSourceLocation(null, _$[$0 - 8], _$[$0]));

					break;
				case 48:
					this.$ = new ForStatementNode($$[$0 - 5], null, $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 8], _$[$0]));

					break;
				case 49:
					this.$ = new ForStatementNode($$[$0 - 4], null, null, $$[$0], createSourceLocation(null, _$[$0 - 7], _$[$0]));

					break;
				case 50:
					this.$ = new ForInStatementNode($$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 51:
					this.$ = new ForInStatementNode($$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 7], _$[$0]));

					break;
				case 52:
					this.$ = new ContinueStatementNode(null, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 53:
					this.$ = new ContinueStatementNode(null, createSourceLocation(null, _$[$0 - 1], _$[$0 - 1]));

					break;
				case 54:
					this.$ = new ContinueStatementNode(new IdentifierNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0 - 1])), createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 55:
					this.$ = new ContinueStatementNode(new IdentifierNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0 - 1])), createSourceLocation(null, _$[$0 - 2], _$[$0 - 1]));

					break;
				case 56:
					this.$ = new BreakStatementNode(null, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 57:
					this.$ = new BreakStatementNode(null, createSourceLocation(null, _$[$0 - 1], _$[$0 - 1]));

					break;
				case 58:
					this.$ = new BreakStatementNode(new IdentifierNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0 - 1])), createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 59:
					this.$ = new BreakStatementNode(new IdentifierNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0 - 1])), createSourceLocation(null, _$[$0 - 2], _$[$0 - 1]));

					break;
				case 60:
					this.$ = new ReturnStatementNode(null, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 61:
					this.$ = new ReturnStatementNode(null, createSourceLocation(null, _$[$0 - 1], _$[$0 - 1]));

					break;
				case 62:
					this.$ = new ReturnStatementNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 63:
					this.$ = new ReturnStatementNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0 - 1]));

					break;
				case 64:
					this.$ = new WithStatementNode($$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 65:
					this.$ = new SwitchStatementNode($$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 66:
					this.$ = $$[$0 - 1];

					break;
				case 67:
					this.$ = $$[$0 - 3].concat($$[$0 - 2]).concat($$[$0 - 1]);

					break;
				case 68:
					this.$ = $$[$0 - 1].concat($$[$0]);

					break;
				case 69:
					this.$ = [];

					break;
				case 70:
					this.$ = new SwitchCaseNode($$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 71:
					this.$ = new SwitchCaseNode(null, $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 72:
					this.$ = new LabeledStatementNode(new IdentifierNode($$[$0 - 2], createSourceLocation(null, _$[$0 - 2], _$[$0 - 2])), $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 73:
					this.$ = new ThrowStatementNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 74:
					this.$ = new ThrowStatementNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0 - 1]));

					break;
				case 75:
					this.$ = new TryStatementNode($$[$0 - 1], $$[$0], null, createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 76:
					this.$ = new TryStatementNode($$[$0 - 1], null, $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 77:
					this.$ = new TryStatementNode($$[$0 - 2], $$[$0 - 1], $$[$0], createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 78:
					this.$ = new CatchClauseNode(new IdentifierNode($$[$0 - 2], createSourceLocation(null, _$[$0 - 2], _$[$0 - 2])), $$[$0], createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 79:
					this.$ = $$[$0];

					break;
				case 80:
					this.$ = new DebugggerStatementNode(createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 81:
					this.$ = new DebugggerStatementNode(createSourceLocation(null, _$[$0 - 1], _$[$0 - 1]));

					break;
				case 82:
					this.$ = new FunctionDeclarationNode(new IdentifierNode($$[$0 - 5], createSourceLocation(null, _$[$0 - 5], _$[$0 - 5])), [], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 83:
					this.$ = new FunctionDeclarationNode(new IdentifierNode($$[$0 - 6], createSourceLocation(null, _$[$0 - 6], _$[$0 - 6])), $$[$0 - 4], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 7], _$[$0]));

					break;
				case 84:
					this.$ = new FunctionExpressionNode(new IdentifierNode($$[$0 - 5], createSourceLocation(null, _$[$0 - 5], _$[$0 - 5])), [], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 85:
					this.$ = new FunctionExpressionNode(new IdentifierNode($$[$0 - 6], createSourceLocation(null, _$[$0 - 6], _$[$0 - 6])), $$[$0 - 4], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 7], _$[$0]));

					break;
				case 86:
					this.$ = new FunctionExpressionNode(null, [], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 5], _$[$0]));

					break;
				case 87:
					this.$ = new FunctionExpressionNode(null, $$[$0 - 4], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 6], _$[$0]));

					break;
				case 88:
					this.$ = [new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]))];

					break;
				case 89:
					this.$ = $$[$0 - 2].concat(new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0])));

					break;
				case 91:
					this.$ = new ProgramNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 1], _$[$0]));
					return this.$;

					break;
				case 92:
					this.$ = $$[$0 - 1].concat($$[$0]);

					break;
				case 93:
					this.$ = [];

					break;
				case 98:
					this.$ = new ThisExpressionNode(createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 99:
					this.$ = new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 102:
					this.$ = $$[$0 - 1];

					break;
				case 103:
					this.$ = new ArrayExpressionNode([], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 104:
					this.$ = new ArrayExpressionNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 105:
					this.$ = new ArrayExpressionNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 106:
					this.$ = new ArrayExpressionNode($$[$0 - 2].concat(null), createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 107:
					this.$ = new ArrayExpressionNode($$[$0 - 3].concat($$[$0 - 1]), createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 108:
					this.$ = [$$[$0]];

					break;
				case 109:
					this.$ = $$[$0 - 1].concat($$[$0]);

					break;
				case 110:
					this.$ = $$[$0 - 2].concat($$[$0]);

					break;
				case 111:
					this.$ = $$[$0 - 3].concat($$[$0 - 1]).concat($$[$0]);

					break;
				case 112:
					this.$ = [null, null];

					break;
				case 113:
					this.$ = $$[$0 - 1].concat(null);

					break;
				case 114:
					this.$ = new ObjectExpressionNode([], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 115:
					this.$ = new ObjectExpressionNode($$[$0 - 1], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 116:
					this.$ = new ObjectExpressionNode($$[$0 - 2], createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 117:
					this.$ = [$$[$0]];

					break;
				case 118:
					this.$ = $$[$0 - 2].concat($$[$0]);

					break;
				case 119:
					this.$ = {
						key: $$[$0 - 2],
						value: $$[$0],
						kind: "init"
					};

					break;
				case 120:
					if ($$[$0 - 6] === "get") {
						this.$ = {
							key: $$[$0 - 5],
							value: (new FunctionExpressionNode(null, [], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 5], _$[$0]))),
							kind: "get"
						};
					} else {
						this.parseError("Invalid getter", {});
					}

					break;
				case 121:
					if ($$[$0 - 7] === "set") {
						this.$ = {
							key: $$[$0 - 6],
							value: (new FunctionExpressionNode(null, $$[$0 - 4], $$[$0 - 1], false, false, createSourceLocation(null, _$[$0 - 6], _$[$0]))),
							kind: "set"
						};
					} else {
						this.parseError("Invalid setter", {});
					}

					break;
				case 125:
					this.$ = [new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]))];

					break;
				case 128:
					this.$ = new MemberExpressionNode($$[$0 - 3], $$[$0 - 1], true, createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 129:
					this.$ = new MemberExpressionNode($$[$0 - 2], $$[$0], false, createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 130:
					this.$ = new NewExpressionNode($$[$0 - 1], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 132:
					this.$ = new MemberExpressionNode($$[$0 - 3], $$[$0 - 1], true, createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 133:
					this.$ = new MemberExpressionNode($$[$0 - 2], $$[$0], false, createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 134:
					this.$ = new NewExpressionNode($$[$0 - 1], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 136:
					this.$ = new NewExpressionNode($$[$0], null, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 138:
					this.$ = new NewExpressionNode($$[$0], null, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 139:
					this.$ = new CallExpressionNode($$[$0 - 1], $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 140:
					this.$ = new CallExpressionNode($$[$0 - 1], $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 141:
					this.$ = new MemberExpressionNode($$[$0 - 3], $$[$0 - 1], true, createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 142:
					this.$ = new MemberExpressionNode($$[$0 - 2], $$[$0], false, createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 143:
					this.$ = new CallExpressionNode($$[$0 - 1], $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 144:
					this.$ = new CallExpressionNode($$[$0 - 1], $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 145:
					this.$ = new MemberExpressionNode($$[$0 - 3], $$[$0 - 1], true, createSourceLocation(null, _$[$0 - 3], _$[$0]));

					break;
				case 146:
					this.$ = new MemberExpressionNode($$[$0 - 2], $$[$0], false, createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 147:
					this.$ = new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 148:
					this.$ = new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 149:
					this.$ = [];

					break;
				case 150:
					this.$ = $$[$0 - 1];

					break;
				case 151:
					this.$ = [$$[$0]];

					break;
				case 152:
					this.$ = $$[$0 - 2].concat($$[$0]);

					break;
				case 158:
					this.$ = new UpdateExpressionNode("++", $$[$0 - 1], false, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 159:
					this.$ = new UpdateExpressionNode("--", $$[$0 - 1], false, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 161:
					this.$ = new UpdateExpressionNode("++", $$[$0 - 1], false, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 162:
					this.$ = new UpdateExpressionNode("--", $$[$0 - 1], false, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 167:
					this.$ = new UnaryExpressionNode("delete", true, $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 168:
					this.$ = new UnaryExpressionNode("void", true, $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 169:
					this.$ = new UnaryExpressionNode("typeof", true, $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 170:
					_$[$0 - 1].first_line = _$[$0 - 1].last_line;
					_$[$0 - 1].first_column = _$[$0 - 1].last_column - 2;
					this.$ = new UpdateExpressionNode("++", $$[$0], true, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 171:
					_$[$0 - 1].first_line = _$[$0 - 1].last_line;
					_$[$0 - 1].first_column = _$[$0 - 1].last_column - 2;
					this.$ = new UpdateExpressionNode("--", $$[$0], true, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 172:
					this.$ = new UpdateExpressionNode("++", $$[$0], true, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 173:
					this.$ = new UpdateExpressionNode("--", $$[$0], true, createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 174:
					this.$ = new UnaryExpressionNode("+", true, $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 175:
					this.$ = new UnaryExpressionNode("-", true, $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 176:
					this.$ = new UnaryExpressionNode("~", true, $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 177:
					this.$ = new UnaryExpressionNode("!", true, $$[$0], createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 179:
					this.$ = new BinaryExpressionNode("*", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 180:
					this.$ = new BinaryExpressionNode("/", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 181:
					this.$ = new BinaryExpressionNode("%", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 183:
					this.$ = new BinaryExpressionNode("*", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 184:
					this.$ = new BinaryExpressionNode("/", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 185:
					this.$ = new BinaryExpressionNode("%", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 187:
					this.$ = new BinaryExpressionNode("+", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 188:
					this.$ = new BinaryExpressionNode("-", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 190:
					this.$ = new BinaryExpressionNode("+", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 191:
					this.$ = new BinaryExpressionNode("-", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 193:
					this.$ = new BinaryExpressionNode("<<", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 194:
					this.$ = new BinaryExpressionNode(">>", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 195:
					this.$ = new BinaryExpressionNode(">>>", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 197:
					this.$ = new BinaryExpressionNode("<<", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 198:
					this.$ = new BinaryExpressionNode(">>", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 199:
					this.$ = new BinaryExpressionNode(">>>", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 201:
					this.$ = new BinaryExpressionNode("<", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 202:
					this.$ = new BinaryExpressionNode(">", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 203:
					this.$ = new BinaryExpressionNode("<=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 204:
					this.$ = new BinaryExpressionNode(">=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 205:
					this.$ = new BinaryExpressionNode("instanceof", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 206:
					this.$ = new BinaryExpressionNode("in", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 208:
					this.$ = new BinaryExpressionNode("<", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 209:
					this.$ = new BinaryExpressionNode(">", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 210:
					this.$ = new BinaryExpressionNode("<=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 211:
					this.$ = new BinaryExpressionNode(">=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 212:
					this.$ = new BinaryExpressionNode("instanceof", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 214:
					this.$ = new BinaryExpressionNode("<", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 215:
					this.$ = new BinaryExpressionNode(">", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 216:
					this.$ = new BinaryExpressionNode("<=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 217:
					this.$ = new BinaryExpressionNode(">=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 218:
					this.$ = new BinaryExpressionNode("instanceof", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 219:
					this.$ = new BinaryExpressionNode("in", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 221:
					this.$ = new BinaryExpressionNode("==", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 222:
					this.$ = new BinaryExpressionNode("!=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 223:
					this.$ = new BinaryExpressionNode("===", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 224:
					this.$ = new BinaryExpressionNode("!==", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 226:
					this.$ = new BinaryExpressionNode("==", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 227:
					this.$ = new BinaryExpressionNode("!=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 228:
					this.$ = new BinaryExpressionNode("===", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 229:
					this.$ = new BinaryExpressionNode("!==", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 231:
					this.$ = new BinaryExpressionNode("==", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 232:
					this.$ = new BinaryExpressionNode("!=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 233:
					this.$ = new BinaryExpressionNode("===", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 234:
					this.$ = new BinaryExpressionNode("!==", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 236:
					this.$ = new BinaryExpressionNode("&", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 238:
					this.$ = new BinaryExpressionNode("&", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 240:
					this.$ = new BinaryExpressionNode("&", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 242:
					this.$ = new BinaryExpressionNode("^", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 244:
					this.$ = new BinaryExpressionNode("^", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 246:
					this.$ = new BinaryExpressionNode("^", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 248:
					this.$ = new BinaryExpressionNode("|", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 250:
					this.$ = new BinaryExpressionNode("|", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 252:
					this.$ = new BinaryExpressionNode("|", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 254:
					this.$ = new LogicalExpressionNode("&&", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 256:
					this.$ = new LogicalExpressionNode("&&", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 258:
					this.$ = new LogicalExpressionNode("&&", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 260:
					this.$ = new LogicalExpressionNode("||", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 262:
					this.$ = new LogicalExpressionNode("||", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 264:
					this.$ = new LogicalExpressionNode("||", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 266:
					this.$ = new ConditionalExpressionNode($$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 268:
					this.$ = new ConditionalExpressionNode($$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 270:
					this.$ = new ConditionalExpressionNode($$[$0 - 4], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 4], _$[$0]));

					break;
				case 272:
					this.$ = new AssignmentExpressionNode("=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 273:
					this.$ = new AssignmentExpressionNode($$[$0 - 1], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 275:
					this.$ = new AssignmentExpressionNode("=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 276:
					this.$ = new AssignmentExpressionNode($$[$0 - 1], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 278:
					this.$ = new AssignmentExpressionNode("=", $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 279:
					this.$ = new AssignmentExpressionNode($$[$0 - 1], $$[$0 - 2], $$[$0], createSourceLocation(null, _$[$0 - 2], _$[$0]));

					break;
				case 292:
					if ($$[$0 - 2].type === "SequenceExpression") {
						$$[$0 - 2].expressions.concat($$[$0]);
						$$[$0 - 2].loc = createSourceLocation(null, _$[$0 - 2], _$[$0]);
						this.$ = $$[$0 - 2];
					} else {
						this.$ = new SequenceExpressionNode([$$[$0 - 2], $$[$0]], createSourceLocation(null, _$[$0 - 2], _$[$0]));
					}

					break;
				case 294:
					if ($$[$0 - 2].type === "SequenceExpression") {
						$$[$0 - 2].expressions.concat($$[$0]);
						$$[$0 - 2].loc = createSourceLocation(null, _$[$0 - 2], _$[$0]);
						this.$ = $$[$0 - 2];
					} else {
						this.$ = new SequenceExpressionNode([$$[$0 - 2], $$[$0]], createSourceLocation(null, _$[$0 - 2], _$[$0]));
					}

					break;
				case 296:
					if ($$[$0 - 2].type === "SequenceExpression") {
						$$[$0 - 2].expressions.concat($$[$0]);
						$$[$0 - 2].loc = createSourceLocation(null, _$[$0 - 2], _$[$0]);
						this.$ = $$[$0 - 2];
					} else {
						this.$ = new SequenceExpressionNode([$$[$0 - 2], $$[$0]], createSourceLocation(null, _$[$0 - 2], _$[$0]));
					}

					break;
				case 302:
					this.$ = new LiteralNode(null, createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 303:
					this.$ = new LiteralNode(true, createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 304:
					this.$ = new LiteralNode(false, createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 305:
					this.$ = new LiteralNode(parseNumericLiteral($$[$0]), createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 306:
					this.$ = new LiteralNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));

					break;
				case 307:
					this.$ = new LiteralNode(parseRegularExpressionLiteral($$[$0 - 1] + $$[$0]), createSourceLocation(null, _$[$0 - 1], _$[$0]));

					break;
				case 308:
					yy.lexer.begin("REGEXP");

					break;
				case 309:
					yy.lexer.begin("REGEXP");

					break;
			}
		},
		table: [{
			19: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			71: 2,
			72: 1,
			73: [2, 93],
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			1: [3]
		}, {
			3: 5,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			66: 6,
			67: [1, 22],
			73: [1, 3],
			74: 4,
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			1: [2, 91]
		}, {
			19: [2, 92],
			21: [2, 92],
			22: [2, 92],
			28: [2, 92],
			34: [2, 92],
			36: [2, 92],
			37: [2, 92],
			41: [2, 92],
			42: [2, 92],
			43: [2, 92],
			47: [2, 92],
			48: [2, 92],
			49: [2, 92],
			50: [2, 92],
			51: [2, 92],
			59: [2, 92],
			60: [2, 92],
			65: [2, 92],
			67: [2, 92],
			73: [2, 92],
			78: [2, 92],
			81: [2, 92],
			94: [2, 92],
			105: [2, 92],
			106: [2, 92],
			111: [2, 92],
			112: [2, 92],
			113: [2, 92],
			114: [2, 92],
			115: [2, 92],
			116: [2, 92],
			117: [2, 92],
			118: [2, 92],
			119: [2, 92],
			122: [2, 92],
			174: [2, 92],
			187: [2, 92],
			188: [2, 92],
			189: [2, 92],
			190: [2, 92],
			191: [2, 92]
		}, {
			19: [2, 94],
			21: [2, 94],
			22: [2, 94],
			28: [2, 94],
			34: [2, 94],
			36: [2, 94],
			37: [2, 94],
			41: [2, 94],
			42: [2, 94],
			43: [2, 94],
			47: [2, 94],
			48: [2, 94],
			49: [2, 94],
			50: [2, 94],
			51: [2, 94],
			59: [2, 94],
			60: [2, 94],
			65: [2, 94],
			67: [2, 94],
			73: [2, 94],
			78: [2, 94],
			81: [2, 94],
			94: [2, 94],
			105: [2, 94],
			106: [2, 94],
			111: [2, 94],
			112: [2, 94],
			113: [2, 94],
			114: [2, 94],
			115: [2, 94],
			116: [2, 94],
			117: [2, 94],
			118: [2, 94],
			119: [2, 94],
			122: [2, 94],
			174: [2, 94],
			187: [2, 94],
			188: [2, 94],
			189: [2, 94],
			190: [2, 94],
			191: [2, 94]
		}, {
			19: [2, 95],
			21: [2, 95],
			22: [2, 95],
			28: [2, 95],
			34: [2, 95],
			36: [2, 95],
			37: [2, 95],
			41: [2, 95],
			42: [2, 95],
			43: [2, 95],
			47: [2, 95],
			48: [2, 95],
			49: [2, 95],
			50: [2, 95],
			51: [2, 95],
			59: [2, 95],
			60: [2, 95],
			65: [2, 95],
			67: [2, 95],
			73: [2, 95],
			78: [2, 95],
			81: [2, 95],
			94: [2, 95],
			105: [2, 95],
			106: [2, 95],
			111: [2, 95],
			112: [2, 95],
			113: [2, 95],
			114: [2, 95],
			115: [2, 95],
			116: [2, 95],
			117: [2, 95],
			118: [2, 95],
			119: [2, 95],
			122: [2, 95],
			174: [2, 95],
			187: [2, 95],
			188: [2, 95],
			189: [2, 95],
			190: [2, 95],
			191: [2, 95]
		}, {
			19: [2, 1],
			21: [2, 1],
			22: [2, 1],
			28: [2, 1],
			34: [2, 1],
			36: [2, 1],
			37: [2, 1],
			40: [2, 1],
			41: [2, 1],
			42: [2, 1],
			43: [2, 1],
			47: [2, 1],
			48: [2, 1],
			49: [2, 1],
			50: [2, 1],
			51: [2, 1],
			56: [2, 1],
			58: [2, 1],
			59: [2, 1],
			60: [2, 1],
			65: [2, 1],
			67: [2, 1],
			73: [2, 1],
			78: [2, 1],
			81: [2, 1],
			94: [2, 1],
			105: [2, 1],
			106: [2, 1],
			111: [2, 1],
			112: [2, 1],
			113: [2, 1],
			114: [2, 1],
			115: [2, 1],
			116: [2, 1],
			117: [2, 1],
			118: [2, 1],
			119: [2, 1],
			122: [2, 1],
			174: [2, 1],
			187: [2, 1],
			188: [2, 1],
			189: [2, 1],
			190: [2, 1],
			191: [2, 1]
		}, {
			19: [2, 2],
			21: [2, 2],
			22: [2, 2],
			28: [2, 2],
			34: [2, 2],
			36: [2, 2],
			37: [2, 2],
			40: [2, 2],
			41: [2, 2],
			42: [2, 2],
			43: [2, 2],
			47: [2, 2],
			48: [2, 2],
			49: [2, 2],
			50: [2, 2],
			51: [2, 2],
			56: [2, 2],
			58: [2, 2],
			59: [2, 2],
			60: [2, 2],
			65: [2, 2],
			67: [2, 2],
			73: [2, 2],
			78: [2, 2],
			81: [2, 2],
			94: [2, 2],
			105: [2, 2],
			106: [2, 2],
			111: [2, 2],
			112: [2, 2],
			113: [2, 2],
			114: [2, 2],
			115: [2, 2],
			116: [2, 2],
			117: [2, 2],
			118: [2, 2],
			119: [2, 2],
			122: [2, 2],
			174: [2, 2],
			187: [2, 2],
			188: [2, 2],
			189: [2, 2],
			190: [2, 2],
			191: [2, 2]
		}, {
			19: [2, 3],
			21: [2, 3],
			22: [2, 3],
			28: [2, 3],
			34: [2, 3],
			36: [2, 3],
			37: [2, 3],
			40: [2, 3],
			41: [2, 3],
			42: [2, 3],
			43: [2, 3],
			47: [2, 3],
			48: [2, 3],
			49: [2, 3],
			50: [2, 3],
			51: [2, 3],
			56: [2, 3],
			58: [2, 3],
			59: [2, 3],
			60: [2, 3],
			65: [2, 3],
			67: [2, 3],
			73: [2, 3],
			78: [2, 3],
			81: [2, 3],
			94: [2, 3],
			105: [2, 3],
			106: [2, 3],
			111: [2, 3],
			112: [2, 3],
			113: [2, 3],
			114: [2, 3],
			115: [2, 3],
			116: [2, 3],
			117: [2, 3],
			118: [2, 3],
			119: [2, 3],
			122: [2, 3],
			174: [2, 3],
			187: [2, 3],
			188: [2, 3],
			189: [2, 3],
			190: [2, 3],
			191: [2, 3]
		}, {
			19: [2, 4],
			21: [2, 4],
			22: [2, 4],
			28: [2, 4],
			34: [2, 4],
			36: [2, 4],
			37: [2, 4],
			40: [2, 4],
			41: [2, 4],
			42: [2, 4],
			43: [2, 4],
			47: [2, 4],
			48: [2, 4],
			49: [2, 4],
			50: [2, 4],
			51: [2, 4],
			56: [2, 4],
			58: [2, 4],
			59: [2, 4],
			60: [2, 4],
			65: [2, 4],
			67: [2, 4],
			73: [2, 4],
			78: [2, 4],
			81: [2, 4],
			94: [2, 4],
			105: [2, 4],
			106: [2, 4],
			111: [2, 4],
			112: [2, 4],
			113: [2, 4],
			114: [2, 4],
			115: [2, 4],
			116: [2, 4],
			117: [2, 4],
			118: [2, 4],
			119: [2, 4],
			122: [2, 4],
			174: [2, 4],
			187: [2, 4],
			188: [2, 4],
			189: [2, 4],
			190: [2, 4],
			191: [2, 4]
		}, {
			19: [2, 5],
			21: [2, 5],
			22: [2, 5],
			28: [2, 5],
			34: [2, 5],
			36: [2, 5],
			37: [2, 5],
			40: [2, 5],
			41: [2, 5],
			42: [2, 5],
			43: [2, 5],
			47: [2, 5],
			48: [2, 5],
			49: [2, 5],
			50: [2, 5],
			51: [2, 5],
			56: [2, 5],
			58: [2, 5],
			59: [2, 5],
			60: [2, 5],
			65: [2, 5],
			67: [2, 5],
			73: [2, 5],
			78: [2, 5],
			81: [2, 5],
			94: [2, 5],
			105: [2, 5],
			106: [2, 5],
			111: [2, 5],
			112: [2, 5],
			113: [2, 5],
			114: [2, 5],
			115: [2, 5],
			116: [2, 5],
			117: [2, 5],
			118: [2, 5],
			119: [2, 5],
			122: [2, 5],
			174: [2, 5],
			187: [2, 5],
			188: [2, 5],
			189: [2, 5],
			190: [2, 5],
			191: [2, 5]
		}, {
			19: [2, 6],
			21: [2, 6],
			22: [2, 6],
			28: [2, 6],
			34: [2, 6],
			36: [2, 6],
			37: [2, 6],
			40: [2, 6],
			41: [2, 6],
			42: [2, 6],
			43: [2, 6],
			47: [2, 6],
			48: [2, 6],
			49: [2, 6],
			50: [2, 6],
			51: [2, 6],
			56: [2, 6],
			58: [2, 6],
			59: [2, 6],
			60: [2, 6],
			65: [2, 6],
			67: [2, 6],
			73: [2, 6],
			78: [2, 6],
			81: [2, 6],
			94: [2, 6],
			105: [2, 6],
			106: [2, 6],
			111: [2, 6],
			112: [2, 6],
			113: [2, 6],
			114: [2, 6],
			115: [2, 6],
			116: [2, 6],
			117: [2, 6],
			118: [2, 6],
			119: [2, 6],
			122: [2, 6],
			174: [2, 6],
			187: [2, 6],
			188: [2, 6],
			189: [2, 6],
			190: [2, 6],
			191: [2, 6]
		}, {
			19: [2, 7],
			21: [2, 7],
			22: [2, 7],
			28: [2, 7],
			34: [2, 7],
			36: [2, 7],
			37: [2, 7],
			40: [2, 7],
			41: [2, 7],
			42: [2, 7],
			43: [2, 7],
			47: [2, 7],
			48: [2, 7],
			49: [2, 7],
			50: [2, 7],
			51: [2, 7],
			56: [2, 7],
			58: [2, 7],
			59: [2, 7],
			60: [2, 7],
			65: [2, 7],
			67: [2, 7],
			73: [2, 7],
			78: [2, 7],
			81: [2, 7],
			94: [2, 7],
			105: [2, 7],
			106: [2, 7],
			111: [2, 7],
			112: [2, 7],
			113: [2, 7],
			114: [2, 7],
			115: [2, 7],
			116: [2, 7],
			117: [2, 7],
			118: [2, 7],
			119: [2, 7],
			122: [2, 7],
			174: [2, 7],
			187: [2, 7],
			188: [2, 7],
			189: [2, 7],
			190: [2, 7],
			191: [2, 7]
		}, {
			19: [2, 8],
			21: [2, 8],
			22: [2, 8],
			28: [2, 8],
			34: [2, 8],
			36: [2, 8],
			37: [2, 8],
			40: [2, 8],
			41: [2, 8],
			42: [2, 8],
			43: [2, 8],
			47: [2, 8],
			48: [2, 8],
			49: [2, 8],
			50: [2, 8],
			51: [2, 8],
			56: [2, 8],
			58: [2, 8],
			59: [2, 8],
			60: [2, 8],
			65: [2, 8],
			67: [2, 8],
			73: [2, 8],
			78: [2, 8],
			81: [2, 8],
			94: [2, 8],
			105: [2, 8],
			106: [2, 8],
			111: [2, 8],
			112: [2, 8],
			113: [2, 8],
			114: [2, 8],
			115: [2, 8],
			116: [2, 8],
			117: [2, 8],
			118: [2, 8],
			119: [2, 8],
			122: [2, 8],
			174: [2, 8],
			187: [2, 8],
			188: [2, 8],
			189: [2, 8],
			190: [2, 8],
			191: [2, 8]
		}, {
			19: [2, 9],
			21: [2, 9],
			22: [2, 9],
			28: [2, 9],
			34: [2, 9],
			36: [2, 9],
			37: [2, 9],
			40: [2, 9],
			41: [2, 9],
			42: [2, 9],
			43: [2, 9],
			47: [2, 9],
			48: [2, 9],
			49: [2, 9],
			50: [2, 9],
			51: [2, 9],
			56: [2, 9],
			58: [2, 9],
			59: [2, 9],
			60: [2, 9],
			65: [2, 9],
			67: [2, 9],
			73: [2, 9],
			78: [2, 9],
			81: [2, 9],
			94: [2, 9],
			105: [2, 9],
			106: [2, 9],
			111: [2, 9],
			112: [2, 9],
			113: [2, 9],
			114: [2, 9],
			115: [2, 9],
			116: [2, 9],
			117: [2, 9],
			118: [2, 9],
			119: [2, 9],
			122: [2, 9],
			174: [2, 9],
			187: [2, 9],
			188: [2, 9],
			189: [2, 9],
			190: [2, 9],
			191: [2, 9]
		}, {
			19: [2, 10],
			21: [2, 10],
			22: [2, 10],
			28: [2, 10],
			34: [2, 10],
			36: [2, 10],
			37: [2, 10],
			40: [2, 10],
			41: [2, 10],
			42: [2, 10],
			43: [2, 10],
			47: [2, 10],
			48: [2, 10],
			49: [2, 10],
			50: [2, 10],
			51: [2, 10],
			56: [2, 10],
			58: [2, 10],
			59: [2, 10],
			60: [2, 10],
			65: [2, 10],
			67: [2, 10],
			73: [2, 10],
			78: [2, 10],
			81: [2, 10],
			94: [2, 10],
			105: [2, 10],
			106: [2, 10],
			111: [2, 10],
			112: [2, 10],
			113: [2, 10],
			114: [2, 10],
			115: [2, 10],
			116: [2, 10],
			117: [2, 10],
			118: [2, 10],
			119: [2, 10],
			122: [2, 10],
			174: [2, 10],
			187: [2, 10],
			188: [2, 10],
			189: [2, 10],
			190: [2, 10],
			191: [2, 10]
		}, {
			19: [2, 11],
			21: [2, 11],
			22: [2, 11],
			28: [2, 11],
			34: [2, 11],
			36: [2, 11],
			37: [2, 11],
			40: [2, 11],
			41: [2, 11],
			42: [2, 11],
			43: [2, 11],
			47: [2, 11],
			48: [2, 11],
			49: [2, 11],
			50: [2, 11],
			51: [2, 11],
			56: [2, 11],
			58: [2, 11],
			59: [2, 11],
			60: [2, 11],
			65: [2, 11],
			67: [2, 11],
			73: [2, 11],
			78: [2, 11],
			81: [2, 11],
			94: [2, 11],
			105: [2, 11],
			106: [2, 11],
			111: [2, 11],
			112: [2, 11],
			113: [2, 11],
			114: [2, 11],
			115: [2, 11],
			116: [2, 11],
			117: [2, 11],
			118: [2, 11],
			119: [2, 11],
			122: [2, 11],
			174: [2, 11],
			187: [2, 11],
			188: [2, 11],
			189: [2, 11],
			190: [2, 11],
			191: [2, 11]
		}, {
			19: [2, 12],
			21: [2, 12],
			22: [2, 12],
			28: [2, 12],
			34: [2, 12],
			36: [2, 12],
			37: [2, 12],
			40: [2, 12],
			41: [2, 12],
			42: [2, 12],
			43: [2, 12],
			47: [2, 12],
			48: [2, 12],
			49: [2, 12],
			50: [2, 12],
			51: [2, 12],
			56: [2, 12],
			58: [2, 12],
			59: [2, 12],
			60: [2, 12],
			65: [2, 12],
			67: [2, 12],
			73: [2, 12],
			78: [2, 12],
			81: [2, 12],
			94: [2, 12],
			105: [2, 12],
			106: [2, 12],
			111: [2, 12],
			112: [2, 12],
			113: [2, 12],
			114: [2, 12],
			115: [2, 12],
			116: [2, 12],
			117: [2, 12],
			118: [2, 12],
			119: [2, 12],
			122: [2, 12],
			174: [2, 12],
			187: [2, 12],
			188: [2, 12],
			189: [2, 12],
			190: [2, 12],
			191: [2, 12]
		}, {
			19: [2, 13],
			21: [2, 13],
			22: [2, 13],
			28: [2, 13],
			34: [2, 13],
			36: [2, 13],
			37: [2, 13],
			40: [2, 13],
			41: [2, 13],
			42: [2, 13],
			43: [2, 13],
			47: [2, 13],
			48: [2, 13],
			49: [2, 13],
			50: [2, 13],
			51: [2, 13],
			56: [2, 13],
			58: [2, 13],
			59: [2, 13],
			60: [2, 13],
			65: [2, 13],
			67: [2, 13],
			73: [2, 13],
			78: [2, 13],
			81: [2, 13],
			94: [2, 13],
			105: [2, 13],
			106: [2, 13],
			111: [2, 13],
			112: [2, 13],
			113: [2, 13],
			114: [2, 13],
			115: [2, 13],
			116: [2, 13],
			117: [2, 13],
			118: [2, 13],
			119: [2, 13],
			122: [2, 13],
			174: [2, 13],
			187: [2, 13],
			188: [2, 13],
			189: [2, 13],
			190: [2, 13],
			191: [2, 13]
		}, {
			19: [2, 14],
			21: [2, 14],
			22: [2, 14],
			28: [2, 14],
			34: [2, 14],
			36: [2, 14],
			37: [2, 14],
			40: [2, 14],
			41: [2, 14],
			42: [2, 14],
			43: [2, 14],
			47: [2, 14],
			48: [2, 14],
			49: [2, 14],
			50: [2, 14],
			51: [2, 14],
			56: [2, 14],
			58: [2, 14],
			59: [2, 14],
			60: [2, 14],
			65: [2, 14],
			67: [2, 14],
			73: [2, 14],
			78: [2, 14],
			81: [2, 14],
			94: [2, 14],
			105: [2, 14],
			106: [2, 14],
			111: [2, 14],
			112: [2, 14],
			113: [2, 14],
			114: [2, 14],
			115: [2, 14],
			116: [2, 14],
			117: [2, 14],
			118: [2, 14],
			119: [2, 14],
			122: [2, 14],
			174: [2, 14],
			187: [2, 14],
			188: [2, 14],
			189: [2, 14],
			190: [2, 14],
			191: [2, 14]
		}, {
			19: [2, 15],
			21: [2, 15],
			22: [2, 15],
			28: [2, 15],
			34: [2, 15],
			36: [2, 15],
			37: [2, 15],
			40: [2, 15],
			41: [2, 15],
			42: [2, 15],
			43: [2, 15],
			47: [2, 15],
			48: [2, 15],
			49: [2, 15],
			50: [2, 15],
			51: [2, 15],
			56: [2, 15],
			58: [2, 15],
			59: [2, 15],
			60: [2, 15],
			65: [2, 15],
			67: [2, 15],
			73: [2, 15],
			78: [2, 15],
			81: [2, 15],
			94: [2, 15],
			105: [2, 15],
			106: [2, 15],
			111: [2, 15],
			112: [2, 15],
			113: [2, 15],
			114: [2, 15],
			115: [2, 15],
			116: [2, 15],
			117: [2, 15],
			118: [2, 15],
			119: [2, 15],
			122: [2, 15],
			174: [2, 15],
			187: [2, 15],
			188: [2, 15],
			189: [2, 15],
			190: [2, 15],
			191: [2, 15]
		}, {
			28: [1, 90]
		}, {
			19: [2, 18],
			20: 91,
			21: [2, 18],
			22: [2, 18],
			28: [2, 18],
			34: [2, 18],
			36: [2, 18],
			37: [2, 18],
			41: [2, 18],
			42: [2, 18],
			43: [2, 18],
			47: [2, 18],
			48: [2, 18],
			49: [2, 18],
			50: [2, 18],
			51: [2, 18],
			59: [2, 18],
			60: [2, 18],
			65: [2, 18],
			78: [2, 18],
			81: [2, 18],
			94: [2, 18],
			105: [2, 18],
			106: [2, 18],
			111: [2, 18],
			112: [2, 18],
			113: [2, 18],
			114: [2, 18],
			115: [2, 18],
			116: [2, 18],
			117: [2, 18],
			118: [2, 18],
			119: [2, 18],
			122: [2, 18],
			174: [2, 18],
			187: [2, 18],
			188: [2, 18],
			189: [2, 18],
			190: [2, 18],
			191: [2, 18]
		}, {
			23: 92,
			24: 93,
			28: [1, 94]
		}, {
			19: [2, 30],
			21: [2, 30],
			22: [2, 30],
			28: [2, 30],
			34: [2, 30],
			36: [2, 30],
			37: [2, 30],
			40: [2, 30],
			41: [2, 30],
			42: [2, 30],
			43: [2, 30],
			47: [2, 30],
			48: [2, 30],
			49: [2, 30],
			50: [2, 30],
			51: [2, 30],
			56: [2, 30],
			58: [2, 30],
			59: [2, 30],
			60: [2, 30],
			65: [2, 30],
			67: [2, 30],
			73: [2, 30],
			78: [2, 30],
			81: [2, 30],
			94: [2, 30],
			105: [2, 30],
			106: [2, 30],
			111: [2, 30],
			112: [2, 30],
			113: [2, 30],
			114: [2, 30],
			115: [2, 30],
			116: [2, 30],
			117: [2, 30],
			118: [2, 30],
			119: [2, 30],
			122: [2, 30],
			174: [2, 30],
			187: [2, 30],
			188: [2, 30],
			189: [2, 30],
			190: [2, 30],
			191: [2, 30]
		}, {
			2: [1, 96],
			25: [1, 97],
			34: [1, 95]
		}, {
			37: [1, 98]
		}, {
			3: 99,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			37: [1, 100]
		}, {
			37: [1, 101]
		}, {
			2: [1, 103],
			28: [1, 104],
			34: [1, 102]
		}, {
			2: [1, 106],
			28: [1, 107],
			34: [1, 105]
		}, {
			2: [1, 109],
			19: [1, 129],
			28: [1, 128],
			32: 111,
			34: [1, 108],
			37: [1, 55],
			38: 110,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			37: [1, 138]
		}, {
			2: [2, 99],
			25: [2, 99],
			31: [2, 99],
			34: [2, 99],
			37: [2, 99],
			46: [2, 99],
			57: [1, 139],
			81: [2, 99],
			93: [2, 99],
			105: [2, 99],
			106: [2, 99],
			116: [2, 99],
			117: [2, 99],
			121: [2, 99],
			122: [2, 99],
			123: [2, 99],
			128: [2, 99],
			129: [2, 99],
			130: [2, 99],
			133: [2, 99],
			134: [2, 99],
			135: [2, 99],
			136: [2, 99],
			137: [2, 99],
			141: [2, 99],
			142: [2, 99],
			143: [2, 99],
			144: [2, 99],
			148: [2, 99],
			152: [2, 99],
			156: [2, 99],
			160: [2, 99],
			164: [2, 99],
			168: [2, 99],
			173: [2, 99],
			174: [2, 99],
			175: [2, 99],
			176: [2, 99],
			177: [2, 99],
			178: [2, 99],
			179: [2, 99],
			180: [2, 99],
			181: [2, 99],
			182: [2, 99],
			183: [2, 99]
		}, {
			37: [1, 140]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 141,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			4: 142,
			19: [1, 23]
		}, {
			2: [1, 144],
			34: [1, 143]
		}, {
			2: [2, 295],
			25: [2, 295],
			34: [2, 295]
		}, {
			2: [2, 277],
			25: [2, 277],
			34: [2, 277]
		}, {
			2: [2, 160],
			25: [2, 160],
			31: [1, 145],
			34: [2, 160],
			46: [2, 160],
			105: [1, 147],
			106: [1, 148],
			116: [2, 160],
			117: [2, 160],
			121: [2, 160],
			122: [2, 160],
			123: [2, 160],
			128: [2, 160],
			129: [2, 160],
			130: [2, 160],
			133: [2, 160],
			134: [2, 160],
			135: [2, 160],
			136: [2, 160],
			137: [2, 160],
			141: [2, 160],
			142: [2, 160],
			143: [2, 160],
			144: [2, 160],
			148: [2, 160],
			152: [2, 160],
			156: [2, 160],
			160: [2, 160],
			164: [2, 160],
			168: [2, 160],
			171: 146,
			173: [1, 149],
			174: [1, 150],
			175: [1, 151],
			176: [1, 152],
			177: [1, 153],
			178: [1, 154],
			179: [1, 155],
			180: [1, 156],
			181: [1, 157],
			182: [1, 158],
			183: [1, 159]
		}, {
			2: [2, 269],
			25: [2, 269],
			34: [2, 269],
			164: [1, 161],
			168: [1, 160]
		}, {
			2: [2, 155],
			25: [2, 155],
			31: [2, 155],
			34: [2, 155],
			46: [2, 155],
			105: [2, 155],
			106: [2, 155],
			116: [2, 155],
			117: [2, 155],
			121: [2, 155],
			122: [2, 155],
			123: [2, 155],
			128: [2, 155],
			129: [2, 155],
			130: [2, 155],
			133: [2, 155],
			134: [2, 155],
			135: [2, 155],
			136: [2, 155],
			137: [2, 155],
			141: [2, 155],
			142: [2, 155],
			143: [2, 155],
			144: [2, 155],
			148: [2, 155],
			152: [2, 155],
			156: [2, 155],
			160: [2, 155],
			164: [2, 155],
			168: [2, 155],
			173: [2, 155],
			174: [2, 155],
			175: [2, 155],
			176: [2, 155],
			177: [2, 155],
			178: [2, 155],
			179: [2, 155],
			180: [2, 155],
			181: [2, 155],
			182: [2, 155],
			183: [2, 155]
		}, {
			2: [2, 156],
			25: [2, 156],
			31: [2, 156],
			34: [2, 156],
			37: [1, 165],
			46: [2, 156],
			81: [1, 163],
			93: [1, 164],
			95: 162,
			105: [2, 156],
			106: [2, 156],
			116: [2, 156],
			117: [2, 156],
			121: [2, 156],
			122: [2, 156],
			123: [2, 156],
			128: [2, 156],
			129: [2, 156],
			130: [2, 156],
			133: [2, 156],
			134: [2, 156],
			135: [2, 156],
			136: [2, 156],
			137: [2, 156],
			141: [2, 156],
			142: [2, 156],
			143: [2, 156],
			144: [2, 156],
			148: [2, 156],
			152: [2, 156],
			156: [2, 156],
			160: [2, 156],
			164: [2, 156],
			168: [2, 156],
			173: [2, 156],
			174: [2, 156],
			175: [2, 156],
			176: [2, 156],
			177: [2, 156],
			178: [2, 156],
			179: [2, 156],
			180: [2, 156],
			181: [2, 156],
			182: [2, 156],
			183: [2, 156]
		}, {
			2: [2, 263],
			25: [2, 263],
			34: [2, 263],
			160: [1, 166],
			164: [2, 263],
			168: [2, 263]
		}, {
			2: [2, 137],
			25: [2, 137],
			31: [2, 137],
			34: [2, 137],
			37: [1, 165],
			46: [2, 137],
			81: [1, 168],
			93: [1, 169],
			95: 167,
			105: [2, 137],
			106: [2, 137],
			116: [2, 137],
			117: [2, 137],
			121: [2, 137],
			122: [2, 137],
			123: [2, 137],
			128: [2, 137],
			129: [2, 137],
			130: [2, 137],
			133: [2, 137],
			134: [2, 137],
			135: [2, 137],
			136: [2, 137],
			137: [2, 137],
			141: [2, 137],
			142: [2, 137],
			143: [2, 137],
			144: [2, 137],
			148: [2, 137],
			152: [2, 137],
			156: [2, 137],
			160: [2, 137],
			164: [2, 137],
			168: [2, 137],
			173: [2, 137],
			174: [2, 137],
			175: [2, 137],
			176: [2, 137],
			177: [2, 137],
			178: [2, 137],
			179: [2, 137],
			180: [2, 137],
			181: [2, 137],
			182: [2, 137],
			183: [2, 137]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 171,
			94: [1, 119],
			97: 170,
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 257],
			25: [2, 257],
			34: [2, 257],
			156: [1, 172],
			160: [2, 257],
			164: [2, 257],
			168: [2, 257]
		}, {
			2: [2, 131],
			25: [2, 131],
			31: [2, 131],
			34: [2, 131],
			37: [2, 131],
			46: [2, 131],
			81: [2, 131],
			93: [2, 131],
			105: [2, 131],
			106: [2, 131],
			116: [2, 131],
			117: [2, 131],
			121: [2, 131],
			122: [2, 131],
			123: [2, 131],
			128: [2, 131],
			129: [2, 131],
			130: [2, 131],
			133: [2, 131],
			134: [2, 131],
			135: [2, 131],
			136: [2, 131],
			137: [2, 131],
			141: [2, 131],
			142: [2, 131],
			143: [2, 131],
			144: [2, 131],
			148: [2, 131],
			152: [2, 131],
			156: [2, 131],
			160: [2, 131],
			164: [2, 131],
			168: [2, 131],
			173: [2, 131],
			174: [2, 131],
			175: [2, 131],
			176: [2, 131],
			177: [2, 131],
			178: [2, 131],
			179: [2, 131],
			180: [2, 131],
			181: [2, 131],
			182: [2, 131],
			183: [2, 131]
		}, {
			2: [2, 251],
			25: [2, 251],
			34: [2, 251],
			152: [1, 173],
			156: [2, 251],
			160: [2, 251],
			164: [2, 251],
			168: [2, 251]
		}, {
			2: [2, 98],
			19: [2, 98],
			21: [2, 98],
			22: [2, 98],
			25: [2, 98],
			28: [2, 98],
			31: [2, 98],
			34: [2, 98],
			36: [2, 98],
			37: [2, 98],
			39: [2, 98],
			40: [2, 98],
			41: [2, 98],
			42: [2, 98],
			43: [2, 98],
			46: [2, 98],
			47: [2, 98],
			48: [2, 98],
			49: [2, 98],
			50: [2, 98],
			51: [2, 98],
			56: [2, 98],
			57: [2, 98],
			58: [2, 98],
			59: [2, 98],
			60: [2, 98],
			65: [2, 98],
			67: [2, 98],
			73: [2, 98],
			78: [2, 98],
			81: [2, 98],
			82: [2, 98],
			93: [2, 98],
			94: [2, 98],
			105: [2, 98],
			106: [2, 98],
			111: [2, 98],
			112: [2, 98],
			113: [2, 98],
			114: [2, 98],
			115: [2, 98],
			116: [2, 98],
			117: [2, 98],
			118: [2, 98],
			119: [2, 98],
			121: [2, 98],
			122: [2, 98],
			123: [2, 98],
			128: [2, 98],
			129: [2, 98],
			130: [2, 98],
			133: [2, 98],
			134: [2, 98],
			135: [2, 98],
			136: [2, 98],
			137: [2, 98],
			141: [2, 98],
			142: [2, 98],
			143: [2, 98],
			144: [2, 98],
			148: [2, 98],
			152: [2, 98],
			156: [2, 98],
			160: [2, 98],
			164: [2, 98],
			168: [2, 98],
			173: [2, 98],
			174: [2, 98],
			175: [2, 98],
			176: [2, 98],
			177: [2, 98],
			178: [2, 98],
			179: [2, 98],
			180: [2, 98],
			181: [2, 98],
			182: [2, 98],
			183: [2, 98],
			187: [2, 98],
			188: [2, 98],
			189: [2, 98],
			190: [2, 98],
			191: [2, 98]
		}, {
			2: [2, 100],
			19: [2, 100],
			21: [2, 100],
			22: [2, 100],
			25: [2, 100],
			28: [2, 100],
			31: [2, 100],
			34: [2, 100],
			36: [2, 100],
			37: [2, 100],
			39: [2, 100],
			40: [2, 100],
			41: [2, 100],
			42: [2, 100],
			43: [2, 100],
			46: [2, 100],
			47: [2, 100],
			48: [2, 100],
			49: [2, 100],
			50: [2, 100],
			51: [2, 100],
			56: [2, 100],
			57: [2, 100],
			58: [2, 100],
			59: [2, 100],
			60: [2, 100],
			65: [2, 100],
			67: [2, 100],
			73: [2, 100],
			78: [2, 100],
			81: [2, 100],
			82: [2, 100],
			93: [2, 100],
			94: [2, 100],
			105: [2, 100],
			106: [2, 100],
			111: [2, 100],
			112: [2, 100],
			113: [2, 100],
			114: [2, 100],
			115: [2, 100],
			116: [2, 100],
			117: [2, 100],
			118: [2, 100],
			119: [2, 100],
			121: [2, 100],
			122: [2, 100],
			123: [2, 100],
			128: [2, 100],
			129: [2, 100],
			130: [2, 100],
			133: [2, 100],
			134: [2, 100],
			135: [2, 100],
			136: [2, 100],
			137: [2, 100],
			141: [2, 100],
			142: [2, 100],
			143: [2, 100],
			144: [2, 100],
			148: [2, 100],
			152: [2, 100],
			156: [2, 100],
			160: [2, 100],
			164: [2, 100],
			168: [2, 100],
			173: [2, 100],
			174: [2, 100],
			175: [2, 100],
			176: [2, 100],
			177: [2, 100],
			178: [2, 100],
			179: [2, 100],
			180: [2, 100],
			181: [2, 100],
			182: [2, 100],
			183: [2, 100],
			187: [2, 100],
			188: [2, 100],
			189: [2, 100],
			190: [2, 100],
			191: [2, 100]
		}, {
			2: [2, 101],
			19: [2, 101],
			21: [2, 101],
			22: [2, 101],
			25: [2, 101],
			28: [2, 101],
			31: [2, 101],
			34: [2, 101],
			36: [2, 101],
			37: [2, 101],
			39: [2, 101],
			40: [2, 101],
			41: [2, 101],
			42: [2, 101],
			43: [2, 101],
			46: [2, 101],
			47: [2, 101],
			48: [2, 101],
			49: [2, 101],
			50: [2, 101],
			51: [2, 101],
			56: [2, 101],
			57: [2, 101],
			58: [2, 101],
			59: [2, 101],
			60: [2, 101],
			65: [2, 101],
			67: [2, 101],
			73: [2, 101],
			78: [2, 101],
			81: [2, 101],
			82: [2, 101],
			93: [2, 101],
			94: [2, 101],
			105: [2, 101],
			106: [2, 101],
			111: [2, 101],
			112: [2, 101],
			113: [2, 101],
			114: [2, 101],
			115: [2, 101],
			116: [2, 101],
			117: [2, 101],
			118: [2, 101],
			119: [2, 101],
			121: [2, 101],
			122: [2, 101],
			123: [2, 101],
			128: [2, 101],
			129: [2, 101],
			130: [2, 101],
			133: [2, 101],
			134: [2, 101],
			135: [2, 101],
			136: [2, 101],
			137: [2, 101],
			141: [2, 101],
			142: [2, 101],
			143: [2, 101],
			144: [2, 101],
			148: [2, 101],
			152: [2, 101],
			156: [2, 101],
			160: [2, 101],
			164: [2, 101],
			168: [2, 101],
			173: [2, 101],
			174: [2, 101],
			175: [2, 101],
			176: [2, 101],
			177: [2, 101],
			178: [2, 101],
			179: [2, 101],
			180: [2, 101],
			181: [2, 101],
			182: [2, 101],
			183: [2, 101],
			187: [2, 101],
			188: [2, 101],
			189: [2, 101],
			190: [2, 101],
			191: [2, 101]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 174,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 245],
			25: [2, 245],
			34: [2, 245],
			148: [1, 175],
			152: [2, 245],
			156: [2, 245],
			160: [2, 245],
			164: [2, 245],
			168: [2, 245]
		}, {
			2: [2, 297],
			19: [2, 297],
			21: [2, 297],
			22: [2, 297],
			25: [2, 297],
			28: [2, 297],
			31: [2, 297],
			34: [2, 297],
			36: [2, 297],
			37: [2, 297],
			39: [2, 297],
			40: [2, 297],
			41: [2, 297],
			42: [2, 297],
			43: [2, 297],
			46: [2, 297],
			47: [2, 297],
			48: [2, 297],
			49: [2, 297],
			50: [2, 297],
			51: [2, 297],
			56: [2, 297],
			57: [2, 297],
			58: [2, 297],
			59: [2, 297],
			60: [2, 297],
			65: [2, 297],
			67: [2, 297],
			73: [2, 297],
			78: [2, 297],
			81: [2, 297],
			82: [2, 297],
			93: [2, 297],
			94: [2, 297],
			105: [2, 297],
			106: [2, 297],
			111: [2, 297],
			112: [2, 297],
			113: [2, 297],
			114: [2, 297],
			115: [2, 297],
			116: [2, 297],
			117: [2, 297],
			118: [2, 297],
			119: [2, 297],
			121: [2, 297],
			122: [2, 297],
			123: [2, 297],
			128: [2, 297],
			129: [2, 297],
			130: [2, 297],
			133: [2, 297],
			134: [2, 297],
			135: [2, 297],
			136: [2, 297],
			137: [2, 297],
			141: [2, 297],
			142: [2, 297],
			143: [2, 297],
			144: [2, 297],
			148: [2, 297],
			152: [2, 297],
			156: [2, 297],
			160: [2, 297],
			164: [2, 297],
			168: [2, 297],
			173: [2, 297],
			174: [2, 297],
			175: [2, 297],
			176: [2, 297],
			177: [2, 297],
			178: [2, 297],
			179: [2, 297],
			180: [2, 297],
			181: [2, 297],
			182: [2, 297],
			183: [2, 297],
			187: [2, 297],
			188: [2, 297],
			189: [2, 297],
			190: [2, 297],
			191: [2, 297]
		}, {
			2: [2, 298],
			19: [2, 298],
			21: [2, 298],
			22: [2, 298],
			25: [2, 298],
			28: [2, 298],
			31: [2, 298],
			34: [2, 298],
			36: [2, 298],
			37: [2, 298],
			39: [2, 298],
			40: [2, 298],
			41: [2, 298],
			42: [2, 298],
			43: [2, 298],
			46: [2, 298],
			47: [2, 298],
			48: [2, 298],
			49: [2, 298],
			50: [2, 298],
			51: [2, 298],
			56: [2, 298],
			57: [2, 298],
			58: [2, 298],
			59: [2, 298],
			60: [2, 298],
			65: [2, 298],
			67: [2, 298],
			73: [2, 298],
			78: [2, 298],
			81: [2, 298],
			82: [2, 298],
			93: [2, 298],
			94: [2, 298],
			105: [2, 298],
			106: [2, 298],
			111: [2, 298],
			112: [2, 298],
			113: [2, 298],
			114: [2, 298],
			115: [2, 298],
			116: [2, 298],
			117: [2, 298],
			118: [2, 298],
			119: [2, 298],
			121: [2, 298],
			122: [2, 298],
			123: [2, 298],
			128: [2, 298],
			129: [2, 298],
			130: [2, 298],
			133: [2, 298],
			134: [2, 298],
			135: [2, 298],
			136: [2, 298],
			137: [2, 298],
			141: [2, 298],
			142: [2, 298],
			143: [2, 298],
			144: [2, 298],
			148: [2, 298],
			152: [2, 298],
			156: [2, 298],
			160: [2, 298],
			164: [2, 298],
			168: [2, 298],
			173: [2, 298],
			174: [2, 298],
			175: [2, 298],
			176: [2, 298],
			177: [2, 298],
			178: [2, 298],
			179: [2, 298],
			180: [2, 298],
			181: [2, 298],
			182: [2, 298],
			183: [2, 298],
			187: [2, 298],
			188: [2, 298],
			189: [2, 298],
			190: [2, 298],
			191: [2, 298]
		}, {
			2: [2, 299],
			19: [2, 299],
			21: [2, 299],
			22: [2, 299],
			25: [2, 299],
			28: [2, 299],
			31: [2, 299],
			34: [2, 299],
			36: [2, 299],
			37: [2, 299],
			39: [2, 299],
			40: [2, 299],
			41: [2, 299],
			42: [2, 299],
			43: [2, 299],
			46: [2, 299],
			47: [2, 299],
			48: [2, 299],
			49: [2, 299],
			50: [2, 299],
			51: [2, 299],
			56: [2, 299],
			57: [2, 299],
			58: [2, 299],
			59: [2, 299],
			60: [2, 299],
			65: [2, 299],
			67: [2, 299],
			73: [2, 299],
			78: [2, 299],
			81: [2, 299],
			82: [2, 299],
			93: [2, 299],
			94: [2, 299],
			105: [2, 299],
			106: [2, 299],
			111: [2, 299],
			112: [2, 299],
			113: [2, 299],
			114: [2, 299],
			115: [2, 299],
			116: [2, 299],
			117: [2, 299],
			118: [2, 299],
			119: [2, 299],
			121: [2, 299],
			122: [2, 299],
			123: [2, 299],
			128: [2, 299],
			129: [2, 299],
			130: [2, 299],
			133: [2, 299],
			134: [2, 299],
			135: [2, 299],
			136: [2, 299],
			137: [2, 299],
			141: [2, 299],
			142: [2, 299],
			143: [2, 299],
			144: [2, 299],
			148: [2, 299],
			152: [2, 299],
			156: [2, 299],
			160: [2, 299],
			164: [2, 299],
			168: [2, 299],
			173: [2, 299],
			174: [2, 299],
			175: [2, 299],
			176: [2, 299],
			177: [2, 299],
			178: [2, 299],
			179: [2, 299],
			180: [2, 299],
			181: [2, 299],
			182: [2, 299],
			183: [2, 299],
			187: [2, 299],
			188: [2, 299],
			189: [2, 299],
			190: [2, 299],
			191: [2, 299]
		}, {
			2: [2, 300],
			19: [2, 300],
			21: [2, 300],
			22: [2, 300],
			25: [2, 300],
			28: [2, 300],
			31: [2, 300],
			34: [2, 300],
			36: [2, 300],
			37: [2, 300],
			39: [2, 300],
			40: [2, 300],
			41: [2, 300],
			42: [2, 300],
			43: [2, 300],
			46: [2, 300],
			47: [2, 300],
			48: [2, 300],
			49: [2, 300],
			50: [2, 300],
			51: [2, 300],
			56: [2, 300],
			57: [2, 300],
			58: [2, 300],
			59: [2, 300],
			60: [2, 300],
			65: [2, 300],
			67: [2, 300],
			73: [2, 300],
			78: [2, 300],
			81: [2, 300],
			82: [2, 300],
			93: [2, 300],
			94: [2, 300],
			105: [2, 300],
			106: [2, 300],
			111: [2, 300],
			112: [2, 300],
			113: [2, 300],
			114: [2, 300],
			115: [2, 300],
			116: [2, 300],
			117: [2, 300],
			118: [2, 300],
			119: [2, 300],
			121: [2, 300],
			122: [2, 300],
			123: [2, 300],
			128: [2, 300],
			129: [2, 300],
			130: [2, 300],
			133: [2, 300],
			134: [2, 300],
			135: [2, 300],
			136: [2, 300],
			137: [2, 300],
			141: [2, 300],
			142: [2, 300],
			143: [2, 300],
			144: [2, 300],
			148: [2, 300],
			152: [2, 300],
			156: [2, 300],
			160: [2, 300],
			164: [2, 300],
			168: [2, 300],
			173: [2, 300],
			174: [2, 300],
			175: [2, 300],
			176: [2, 300],
			177: [2, 300],
			178: [2, 300],
			179: [2, 300],
			180: [2, 300],
			181: [2, 300],
			182: [2, 300],
			183: [2, 300],
			187: [2, 300],
			188: [2, 300],
			189: [2, 300],
			190: [2, 300],
			191: [2, 300]
		}, {
			2: [2, 301],
			19: [2, 301],
			21: [2, 301],
			22: [2, 301],
			25: [2, 301],
			28: [2, 301],
			31: [2, 301],
			34: [2, 301],
			36: [2, 301],
			37: [2, 301],
			39: [2, 301],
			40: [2, 301],
			41: [2, 301],
			42: [2, 301],
			43: [2, 301],
			46: [2, 301],
			47: [2, 301],
			48: [2, 301],
			49: [2, 301],
			50: [2, 301],
			51: [2, 301],
			56: [2, 301],
			57: [2, 301],
			58: [2, 301],
			59: [2, 301],
			60: [2, 301],
			65: [2, 301],
			67: [2, 301],
			73: [2, 301],
			78: [2, 301],
			81: [2, 301],
			82: [2, 301],
			93: [2, 301],
			94: [2, 301],
			105: [2, 301],
			106: [2, 301],
			111: [2, 301],
			112: [2, 301],
			113: [2, 301],
			114: [2, 301],
			115: [2, 301],
			116: [2, 301],
			117: [2, 301],
			118: [2, 301],
			119: [2, 301],
			121: [2, 301],
			122: [2, 301],
			123: [2, 301],
			128: [2, 301],
			129: [2, 301],
			130: [2, 301],
			133: [2, 301],
			134: [2, 301],
			135: [2, 301],
			136: [2, 301],
			137: [2, 301],
			141: [2, 301],
			142: [2, 301],
			143: [2, 301],
			144: [2, 301],
			148: [2, 301],
			152: [2, 301],
			156: [2, 301],
			160: [2, 301],
			164: [2, 301],
			168: [2, 301],
			173: [2, 301],
			174: [2, 301],
			175: [2, 301],
			176: [2, 301],
			177: [2, 301],
			178: [2, 301],
			179: [2, 301],
			180: [2, 301],
			181: [2, 301],
			182: [2, 301],
			183: [2, 301],
			187: [2, 301],
			188: [2, 301],
			189: [2, 301],
			190: [2, 301],
			191: [2, 301]
		}, {
			19: [1, 129],
			25: [1, 179],
			28: [1, 128],
			32: 180,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			82: [1, 176],
			83: 177,
			84: 178,
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 239],
			25: [2, 239],
			34: [2, 239],
			141: [1, 181],
			142: [1, 182],
			143: [1, 183],
			144: [1, 184],
			148: [2, 239],
			152: [2, 239],
			156: [2, 239],
			160: [2, 239],
			164: [2, 239],
			168: [2, 239]
		}, {
			2: [2, 302],
			19: [2, 302],
			21: [2, 302],
			22: [2, 302],
			25: [2, 302],
			28: [2, 302],
			31: [2, 302],
			34: [2, 302],
			36: [2, 302],
			37: [2, 302],
			39: [2, 302],
			40: [2, 302],
			41: [2, 302],
			42: [2, 302],
			43: [2, 302],
			46: [2, 302],
			47: [2, 302],
			48: [2, 302],
			49: [2, 302],
			50: [2, 302],
			51: [2, 302],
			56: [2, 302],
			57: [2, 302],
			58: [2, 302],
			59: [2, 302],
			60: [2, 302],
			65: [2, 302],
			67: [2, 302],
			73: [2, 302],
			78: [2, 302],
			81: [2, 302],
			82: [2, 302],
			93: [2, 302],
			94: [2, 302],
			105: [2, 302],
			106: [2, 302],
			111: [2, 302],
			112: [2, 302],
			113: [2, 302],
			114: [2, 302],
			115: [2, 302],
			116: [2, 302],
			117: [2, 302],
			118: [2, 302],
			119: [2, 302],
			121: [2, 302],
			122: [2, 302],
			123: [2, 302],
			128: [2, 302],
			129: [2, 302],
			130: [2, 302],
			133: [2, 302],
			134: [2, 302],
			135: [2, 302],
			136: [2, 302],
			137: [2, 302],
			141: [2, 302],
			142: [2, 302],
			143: [2, 302],
			144: [2, 302],
			148: [2, 302],
			152: [2, 302],
			156: [2, 302],
			160: [2, 302],
			164: [2, 302],
			168: [2, 302],
			173: [2, 302],
			174: [2, 302],
			175: [2, 302],
			176: [2, 302],
			177: [2, 302],
			178: [2, 302],
			179: [2, 302],
			180: [2, 302],
			181: [2, 302],
			182: [2, 302],
			183: [2, 302],
			187: [2, 302],
			188: [2, 302],
			189: [2, 302],
			190: [2, 302],
			191: [2, 302]
		}, {
			2: [2, 303],
			19: [2, 303],
			21: [2, 303],
			22: [2, 303],
			25: [2, 303],
			28: [2, 303],
			31: [2, 303],
			34: [2, 303],
			36: [2, 303],
			37: [2, 303],
			39: [2, 303],
			40: [2, 303],
			41: [2, 303],
			42: [2, 303],
			43: [2, 303],
			46: [2, 303],
			47: [2, 303],
			48: [2, 303],
			49: [2, 303],
			50: [2, 303],
			51: [2, 303],
			56: [2, 303],
			57: [2, 303],
			58: [2, 303],
			59: [2, 303],
			60: [2, 303],
			65: [2, 303],
			67: [2, 303],
			73: [2, 303],
			78: [2, 303],
			81: [2, 303],
			82: [2, 303],
			93: [2, 303],
			94: [2, 303],
			105: [2, 303],
			106: [2, 303],
			111: [2, 303],
			112: [2, 303],
			113: [2, 303],
			114: [2, 303],
			115: [2, 303],
			116: [2, 303],
			117: [2, 303],
			118: [2, 303],
			119: [2, 303],
			121: [2, 303],
			122: [2, 303],
			123: [2, 303],
			128: [2, 303],
			129: [2, 303],
			130: [2, 303],
			133: [2, 303],
			134: [2, 303],
			135: [2, 303],
			136: [2, 303],
			137: [2, 303],
			141: [2, 303],
			142: [2, 303],
			143: [2, 303],
			144: [2, 303],
			148: [2, 303],
			152: [2, 303],
			156: [2, 303],
			160: [2, 303],
			164: [2, 303],
			168: [2, 303],
			173: [2, 303],
			174: [2, 303],
			175: [2, 303],
			176: [2, 303],
			177: [2, 303],
			178: [2, 303],
			179: [2, 303],
			180: [2, 303],
			181: [2, 303],
			182: [2, 303],
			183: [2, 303],
			187: [2, 303],
			188: [2, 303],
			189: [2, 303],
			190: [2, 303],
			191: [2, 303]
		}, {
			2: [2, 304],
			19: [2, 304],
			21: [2, 304],
			22: [2, 304],
			25: [2, 304],
			28: [2, 304],
			31: [2, 304],
			34: [2, 304],
			36: [2, 304],
			37: [2, 304],
			39: [2, 304],
			40: [2, 304],
			41: [2, 304],
			42: [2, 304],
			43: [2, 304],
			46: [2, 304],
			47: [2, 304],
			48: [2, 304],
			49: [2, 304],
			50: [2, 304],
			51: [2, 304],
			56: [2, 304],
			57: [2, 304],
			58: [2, 304],
			59: [2, 304],
			60: [2, 304],
			65: [2, 304],
			67: [2, 304],
			73: [2, 304],
			78: [2, 304],
			81: [2, 304],
			82: [2, 304],
			93: [2, 304],
			94: [2, 304],
			105: [2, 304],
			106: [2, 304],
			111: [2, 304],
			112: [2, 304],
			113: [2, 304],
			114: [2, 304],
			115: [2, 304],
			116: [2, 304],
			117: [2, 304],
			118: [2, 304],
			119: [2, 304],
			121: [2, 304],
			122: [2, 304],
			123: [2, 304],
			128: [2, 304],
			129: [2, 304],
			130: [2, 304],
			133: [2, 304],
			134: [2, 304],
			135: [2, 304],
			136: [2, 304],
			137: [2, 304],
			141: [2, 304],
			142: [2, 304],
			143: [2, 304],
			144: [2, 304],
			148: [2, 304],
			152: [2, 304],
			156: [2, 304],
			160: [2, 304],
			164: [2, 304],
			168: [2, 304],
			173: [2, 304],
			174: [2, 304],
			175: [2, 304],
			176: [2, 304],
			177: [2, 304],
			178: [2, 304],
			179: [2, 304],
			180: [2, 304],
			181: [2, 304],
			182: [2, 304],
			183: [2, 304],
			187: [2, 304],
			188: [2, 304],
			189: [2, 304],
			190: [2, 304],
			191: [2, 304]
		}, {
			2: [2, 305],
			19: [2, 305],
			21: [2, 305],
			22: [2, 305],
			25: [2, 305],
			28: [2, 305],
			31: [2, 305],
			34: [2, 305],
			36: [2, 305],
			37: [2, 305],
			39: [2, 305],
			40: [2, 305],
			41: [2, 305],
			42: [2, 305],
			43: [2, 305],
			46: [2, 305],
			47: [2, 305],
			48: [2, 305],
			49: [2, 305],
			50: [2, 305],
			51: [2, 305],
			56: [2, 305],
			57: [2, 305],
			58: [2, 305],
			59: [2, 305],
			60: [2, 305],
			65: [2, 305],
			67: [2, 305],
			73: [2, 305],
			78: [2, 305],
			81: [2, 305],
			82: [2, 305],
			93: [2, 305],
			94: [2, 305],
			105: [2, 305],
			106: [2, 305],
			111: [2, 305],
			112: [2, 305],
			113: [2, 305],
			114: [2, 305],
			115: [2, 305],
			116: [2, 305],
			117: [2, 305],
			118: [2, 305],
			119: [2, 305],
			121: [2, 305],
			122: [2, 305],
			123: [2, 305],
			128: [2, 305],
			129: [2, 305],
			130: [2, 305],
			133: [2, 305],
			134: [2, 305],
			135: [2, 305],
			136: [2, 305],
			137: [2, 305],
			141: [2, 305],
			142: [2, 305],
			143: [2, 305],
			144: [2, 305],
			148: [2, 305],
			152: [2, 305],
			156: [2, 305],
			160: [2, 305],
			164: [2, 305],
			168: [2, 305],
			173: [2, 305],
			174: [2, 305],
			175: [2, 305],
			176: [2, 305],
			177: [2, 305],
			178: [2, 305],
			179: [2, 305],
			180: [2, 305],
			181: [2, 305],
			182: [2, 305],
			183: [2, 305],
			187: [2, 305],
			188: [2, 305],
			189: [2, 305],
			190: [2, 305],
			191: [2, 305]
		}, {
			2: [2, 306],
			19: [2, 306],
			21: [2, 306],
			22: [2, 306],
			25: [2, 306],
			28: [2, 306],
			31: [2, 306],
			34: [2, 306],
			36: [2, 306],
			37: [2, 306],
			39: [2, 306],
			40: [2, 306],
			41: [2, 306],
			42: [2, 306],
			43: [2, 306],
			46: [2, 306],
			47: [2, 306],
			48: [2, 306],
			49: [2, 306],
			50: [2, 306],
			51: [2, 306],
			56: [2, 306],
			57: [2, 306],
			58: [2, 306],
			59: [2, 306],
			60: [2, 306],
			65: [2, 306],
			67: [2, 306],
			73: [2, 306],
			78: [2, 306],
			81: [2, 306],
			82: [2, 306],
			93: [2, 306],
			94: [2, 306],
			105: [2, 306],
			106: [2, 306],
			111: [2, 306],
			112: [2, 306],
			113: [2, 306],
			114: [2, 306],
			115: [2, 306],
			116: [2, 306],
			117: [2, 306],
			118: [2, 306],
			119: [2, 306],
			121: [2, 306],
			122: [2, 306],
			123: [2, 306],
			128: [2, 306],
			129: [2, 306],
			130: [2, 306],
			133: [2, 306],
			134: [2, 306],
			135: [2, 306],
			136: [2, 306],
			137: [2, 306],
			141: [2, 306],
			142: [2, 306],
			143: [2, 306],
			144: [2, 306],
			148: [2, 306],
			152: [2, 306],
			156: [2, 306],
			160: [2, 306],
			164: [2, 306],
			168: [2, 306],
			173: [2, 306],
			174: [2, 306],
			175: [2, 306],
			176: [2, 306],
			177: [2, 306],
			178: [2, 306],
			179: [2, 306],
			180: [2, 306],
			181: [2, 306],
			182: [2, 306],
			183: [2, 306],
			187: [2, 306],
			188: [2, 306],
			189: [2, 306],
			190: [2, 306],
			191: [2, 306]
		}, {
			193: [1, 185]
		}, {
			2: [2, 230],
			25: [2, 230],
			34: [2, 230],
			46: [1, 191],
			133: [1, 186],
			134: [1, 187],
			135: [1, 188],
			136: [1, 189],
			137: [1, 190],
			141: [2, 230],
			142: [2, 230],
			143: [2, 230],
			144: [2, 230],
			148: [2, 230],
			152: [2, 230],
			156: [2, 230],
			160: [2, 230],
			164: [2, 230],
			168: [2, 230]
		}, {
			193: [2, 308]
		}, {
			193: [2, 309]
		}, {
			2: [2, 213],
			25: [2, 213],
			34: [2, 213],
			46: [2, 213],
			128: [1, 192],
			129: [1, 193],
			130: [1, 194],
			133: [2, 213],
			134: [2, 213],
			135: [2, 213],
			136: [2, 213],
			137: [2, 213],
			141: [2, 213],
			142: [2, 213],
			143: [2, 213],
			144: [2, 213],
			148: [2, 213],
			152: [2, 213],
			156: [2, 213],
			160: [2, 213],
			164: [2, 213],
			168: [2, 213]
		}, {
			2: [2, 196],
			25: [2, 196],
			34: [2, 196],
			46: [2, 196],
			116: [1, 195],
			117: [1, 196],
			128: [2, 196],
			129: [2, 196],
			130: [2, 196],
			133: [2, 196],
			134: [2, 196],
			135: [2, 196],
			136: [2, 196],
			137: [2, 196],
			141: [2, 196],
			142: [2, 196],
			143: [2, 196],
			144: [2, 196],
			148: [2, 196],
			152: [2, 196],
			156: [2, 196],
			160: [2, 196],
			164: [2, 196],
			168: [2, 196]
		}, {
			2: [2, 189],
			25: [2, 189],
			34: [2, 189],
			46: [2, 189],
			116: [2, 189],
			117: [2, 189],
			121: [1, 197],
			122: [1, 198],
			123: [1, 199],
			128: [2, 189],
			129: [2, 189],
			130: [2, 189],
			133: [2, 189],
			134: [2, 189],
			135: [2, 189],
			136: [2, 189],
			137: [2, 189],
			141: [2, 189],
			142: [2, 189],
			143: [2, 189],
			144: [2, 189],
			148: [2, 189],
			152: [2, 189],
			156: [2, 189],
			160: [2, 189],
			164: [2, 189],
			168: [2, 189]
		}, {
			2: [2, 182],
			25: [2, 182],
			34: [2, 182],
			46: [2, 182],
			116: [2, 182],
			117: [2, 182],
			121: [2, 182],
			122: [2, 182],
			123: [2, 182],
			128: [2, 182],
			129: [2, 182],
			130: [2, 182],
			133: [2, 182],
			134: [2, 182],
			135: [2, 182],
			136: [2, 182],
			137: [2, 182],
			141: [2, 182],
			142: [2, 182],
			143: [2, 182],
			144: [2, 182],
			148: [2, 182],
			152: [2, 182],
			156: [2, 182],
			160: [2, 182],
			164: [2, 182],
			168: [2, 182]
		}, {
			2: [2, 165],
			25: [2, 165],
			34: [2, 165],
			46: [2, 165],
			116: [2, 165],
			117: [2, 165],
			121: [2, 165],
			122: [2, 165],
			123: [2, 165],
			128: [2, 165],
			129: [2, 165],
			130: [2, 165],
			133: [2, 165],
			134: [2, 165],
			135: [2, 165],
			136: [2, 165],
			137: [2, 165],
			141: [2, 165],
			142: [2, 165],
			143: [2, 165],
			144: [2, 165],
			148: [2, 165],
			152: [2, 165],
			156: [2, 165],
			160: [2, 165],
			164: [2, 165],
			168: [2, 165]
		}, {
			2: [2, 166],
			25: [2, 166],
			34: [2, 166],
			46: [2, 166],
			116: [2, 166],
			117: [2, 166],
			121: [2, 166],
			122: [2, 166],
			123: [2, 166],
			128: [2, 166],
			129: [2, 166],
			130: [2, 166],
			133: [2, 166],
			134: [2, 166],
			135: [2, 166],
			136: [2, 166],
			137: [2, 166],
			141: [2, 166],
			142: [2, 166],
			143: [2, 166],
			144: [2, 166],
			148: [2, 166],
			152: [2, 166],
			156: [2, 166],
			160: [2, 166],
			164: [2, 166],
			168: [2, 166]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 200,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 202,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 203,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 204,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 205,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 206,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 207,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 208,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 209,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 210,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 211,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			37: [1, 212]
		}, {
			3: 214,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			21: [1, 213],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 19],
			21: [2, 19],
			22: [2, 19],
			25: [1, 215],
			28: [2, 19],
			34: [2, 19],
			36: [2, 19],
			37: [2, 19],
			40: [2, 19],
			41: [2, 19],
			42: [2, 19],
			43: [2, 19],
			47: [2, 19],
			48: [2, 19],
			49: [2, 19],
			50: [2, 19],
			51: [2, 19],
			56: [2, 19],
			58: [2, 19],
			59: [2, 19],
			60: [2, 19],
			65: [2, 19],
			67: [2, 19],
			73: [2, 19],
			78: [2, 19],
			81: [2, 19],
			94: [2, 19],
			105: [2, 19],
			106: [2, 19],
			111: [2, 19],
			112: [2, 19],
			113: [2, 19],
			114: [2, 19],
			115: [2, 19],
			116: [2, 19],
			117: [2, 19],
			118: [2, 19],
			119: [2, 19],
			122: [2, 19],
			174: [2, 19],
			187: [2, 19],
			188: [2, 19],
			189: [2, 19],
			190: [2, 19],
			191: [2, 19]
		}, {
			19: [2, 20],
			21: [2, 20],
			22: [2, 20],
			25: [2, 20],
			28: [2, 20],
			34: [2, 20],
			36: [2, 20],
			37: [2, 20],
			40: [2, 20],
			41: [2, 20],
			42: [2, 20],
			43: [2, 20],
			47: [2, 20],
			48: [2, 20],
			49: [2, 20],
			50: [2, 20],
			51: [2, 20],
			56: [2, 20],
			58: [2, 20],
			59: [2, 20],
			60: [2, 20],
			65: [2, 20],
			67: [2, 20],
			73: [2, 20],
			78: [2, 20],
			81: [2, 20],
			94: [2, 20],
			105: [2, 20],
			106: [2, 20],
			111: [2, 20],
			112: [2, 20],
			113: [2, 20],
			114: [2, 20],
			115: [2, 20],
			116: [2, 20],
			117: [2, 20],
			118: [2, 20],
			119: [2, 20],
			122: [2, 20],
			174: [2, 20],
			187: [2, 20],
			188: [2, 20],
			189: [2, 20],
			190: [2, 20],
			191: [2, 20]
		}, {
			19: [2, 24],
			21: [2, 24],
			22: [2, 24],
			25: [2, 24],
			28: [2, 24],
			29: 216,
			31: [1, 217],
			34: [2, 24],
			36: [2, 24],
			37: [2, 24],
			40: [2, 24],
			41: [2, 24],
			42: [2, 24],
			43: [2, 24],
			47: [2, 24],
			48: [2, 24],
			49: [2, 24],
			50: [2, 24],
			51: [2, 24],
			56: [2, 24],
			58: [2, 24],
			59: [2, 24],
			60: [2, 24],
			65: [2, 24],
			67: [2, 24],
			73: [2, 24],
			78: [2, 24],
			81: [2, 24],
			94: [2, 24],
			105: [2, 24],
			106: [2, 24],
			111: [2, 24],
			112: [2, 24],
			113: [2, 24],
			114: [2, 24],
			115: [2, 24],
			116: [2, 24],
			117: [2, 24],
			118: [2, 24],
			119: [2, 24],
			122: [2, 24],
			174: [2, 24],
			187: [2, 24],
			188: [2, 24],
			189: [2, 24],
			190: [2, 24],
			191: [2, 24]
		}, {
			19: [2, 31],
			21: [2, 31],
			22: [2, 31],
			28: [2, 31],
			34: [2, 31],
			36: [2, 31],
			37: [2, 31],
			40: [2, 31],
			41: [2, 31],
			42: [2, 31],
			43: [2, 31],
			47: [2, 31],
			48: [2, 31],
			49: [2, 31],
			50: [2, 31],
			51: [2, 31],
			56: [2, 31],
			58: [2, 31],
			59: [2, 31],
			60: [2, 31],
			65: [2, 31],
			67: [2, 31],
			73: [2, 31],
			78: [2, 31],
			81: [2, 31],
			94: [2, 31],
			105: [2, 31],
			106: [2, 31],
			111: [2, 31],
			112: [2, 31],
			113: [2, 31],
			114: [2, 31],
			115: [2, 31],
			116: [2, 31],
			117: [2, 31],
			118: [2, 31],
			119: [2, 31],
			122: [2, 31],
			174: [2, 31],
			187: [2, 31],
			188: [2, 31],
			189: [2, 31],
			190: [2, 31],
			191: [2, 31]
		}, {
			19: [2, 32],
			21: [2, 32],
			22: [2, 32],
			28: [2, 32],
			34: [2, 32],
			36: [2, 32],
			37: [2, 32],
			40: [2, 32],
			41: [2, 32],
			42: [2, 32],
			43: [2, 32],
			47: [2, 32],
			48: [2, 32],
			49: [2, 32],
			50: [2, 32],
			51: [2, 32],
			56: [2, 32],
			58: [2, 32],
			59: [2, 32],
			60: [2, 32],
			65: [2, 32],
			67: [2, 32],
			73: [2, 32],
			78: [2, 32],
			81: [2, 32],
			94: [2, 32],
			105: [2, 32],
			106: [2, 32],
			111: [2, 32],
			112: [2, 32],
			113: [2, 32],
			114: [2, 32],
			115: [2, 32],
			116: [2, 32],
			117: [2, 32],
			118: [2, 32],
			119: [2, 32],
			122: [2, 32],
			174: [2, 32],
			187: [2, 32],
			188: [2, 32],
			189: [2, 32],
			190: [2, 32],
			191: [2, 32]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 218,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 219,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			42: [1, 220]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 221,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			22: [1, 224],
			28: [1, 128],
			33: 226,
			34: [1, 223],
			37: [1, 55],
			44: 222,
			45: 225,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 230,
			161: 229,
			165: 228,
			169: 227,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 52],
			21: [2, 52],
			22: [2, 52],
			28: [2, 52],
			34: [2, 52],
			36: [2, 52],
			37: [2, 52],
			40: [2, 52],
			41: [2, 52],
			42: [2, 52],
			43: [2, 52],
			47: [2, 52],
			48: [2, 52],
			49: [2, 52],
			50: [2, 52],
			51: [2, 52],
			56: [2, 52],
			58: [2, 52],
			59: [2, 52],
			60: [2, 52],
			65: [2, 52],
			67: [2, 52],
			73: [2, 52],
			78: [2, 52],
			81: [2, 52],
			94: [2, 52],
			105: [2, 52],
			106: [2, 52],
			111: [2, 52],
			112: [2, 52],
			113: [2, 52],
			114: [2, 52],
			115: [2, 52],
			116: [2, 52],
			117: [2, 52],
			118: [2, 52],
			119: [2, 52],
			122: [2, 52],
			174: [2, 52],
			187: [2, 52],
			188: [2, 52],
			189: [2, 52],
			190: [2, 52],
			191: [2, 52]
		}, {
			19: [2, 53],
			21: [2, 53],
			22: [2, 53],
			28: [2, 53],
			34: [2, 53],
			36: [2, 53],
			37: [2, 53],
			40: [2, 53],
			41: [2, 53],
			42: [2, 53],
			43: [2, 53],
			47: [2, 53],
			48: [2, 53],
			49: [2, 53],
			50: [2, 53],
			51: [2, 53],
			56: [2, 53],
			58: [2, 53],
			59: [2, 53],
			60: [2, 53],
			65: [2, 53],
			67: [2, 53],
			73: [2, 53],
			78: [2, 53],
			81: [2, 53],
			94: [2, 53],
			105: [2, 53],
			106: [2, 53],
			111: [2, 53],
			112: [2, 53],
			113: [2, 53],
			114: [2, 53],
			115: [2, 53],
			116: [2, 53],
			117: [2, 53],
			118: [2, 53],
			119: [2, 53],
			122: [2, 53],
			174: [2, 53],
			187: [2, 53],
			188: [2, 53],
			189: [2, 53],
			190: [2, 53],
			191: [2, 53]
		}, {
			2: [1, 237],
			34: [1, 236]
		}, {
			19: [2, 56],
			21: [2, 56],
			22: [2, 56],
			28: [2, 56],
			34: [2, 56],
			36: [2, 56],
			37: [2, 56],
			40: [2, 56],
			41: [2, 56],
			42: [2, 56],
			43: [2, 56],
			47: [2, 56],
			48: [2, 56],
			49: [2, 56],
			50: [2, 56],
			51: [2, 56],
			56: [2, 56],
			58: [2, 56],
			59: [2, 56],
			60: [2, 56],
			65: [2, 56],
			67: [2, 56],
			73: [2, 56],
			78: [2, 56],
			81: [2, 56],
			94: [2, 56],
			105: [2, 56],
			106: [2, 56],
			111: [2, 56],
			112: [2, 56],
			113: [2, 56],
			114: [2, 56],
			115: [2, 56],
			116: [2, 56],
			117: [2, 56],
			118: [2, 56],
			119: [2, 56],
			122: [2, 56],
			174: [2, 56],
			187: [2, 56],
			188: [2, 56],
			189: [2, 56],
			190: [2, 56],
			191: [2, 56]
		}, {
			19: [2, 57],
			21: [2, 57],
			22: [2, 57],
			28: [2, 57],
			34: [2, 57],
			36: [2, 57],
			37: [2, 57],
			40: [2, 57],
			41: [2, 57],
			42: [2, 57],
			43: [2, 57],
			47: [2, 57],
			48: [2, 57],
			49: [2, 57],
			50: [2, 57],
			51: [2, 57],
			56: [2, 57],
			58: [2, 57],
			59: [2, 57],
			60: [2, 57],
			65: [2, 57],
			67: [2, 57],
			73: [2, 57],
			78: [2, 57],
			81: [2, 57],
			94: [2, 57],
			105: [2, 57],
			106: [2, 57],
			111: [2, 57],
			112: [2, 57],
			113: [2, 57],
			114: [2, 57],
			115: [2, 57],
			116: [2, 57],
			117: [2, 57],
			118: [2, 57],
			119: [2, 57],
			122: [2, 57],
			174: [2, 57],
			187: [2, 57],
			188: [2, 57],
			189: [2, 57],
			190: [2, 57],
			191: [2, 57]
		}, {
			2: [1, 239],
			34: [1, 238]
		}, {
			19: [2, 60],
			21: [2, 60],
			22: [2, 60],
			28: [2, 60],
			34: [2, 60],
			36: [2, 60],
			37: [2, 60],
			40: [2, 60],
			41: [2, 60],
			42: [2, 60],
			43: [2, 60],
			47: [2, 60],
			48: [2, 60],
			49: [2, 60],
			50: [2, 60],
			51: [2, 60],
			56: [2, 60],
			58: [2, 60],
			59: [2, 60],
			60: [2, 60],
			65: [2, 60],
			67: [2, 60],
			73: [2, 60],
			78: [2, 60],
			81: [2, 60],
			94: [2, 60],
			105: [2, 60],
			106: [2, 60],
			111: [2, 60],
			112: [2, 60],
			113: [2, 60],
			114: [2, 60],
			115: [2, 60],
			116: [2, 60],
			117: [2, 60],
			118: [2, 60],
			119: [2, 60],
			122: [2, 60],
			174: [2, 60],
			187: [2, 60],
			188: [2, 60],
			189: [2, 60],
			190: [2, 60],
			191: [2, 60]
		}, {
			19: [2, 61],
			21: [2, 61],
			22: [2, 61],
			28: [2, 61],
			34: [2, 61],
			36: [2, 61],
			37: [2, 61],
			40: [2, 61],
			41: [2, 61],
			42: [2, 61],
			43: [2, 61],
			47: [2, 61],
			48: [2, 61],
			49: [2, 61],
			50: [2, 61],
			51: [2, 61],
			56: [2, 61],
			58: [2, 61],
			59: [2, 61],
			60: [2, 61],
			65: [2, 61],
			67: [2, 61],
			73: [2, 61],
			78: [2, 61],
			81: [2, 61],
			94: [2, 61],
			105: [2, 61],
			106: [2, 61],
			111: [2, 61],
			112: [2, 61],
			113: [2, 61],
			114: [2, 61],
			115: [2, 61],
			116: [2, 61],
			117: [2, 61],
			118: [2, 61],
			119: [2, 61],
			122: [2, 61],
			174: [2, 61],
			187: [2, 61],
			188: [2, 61],
			189: [2, 61],
			190: [2, 61],
			191: [2, 61]
		}, {
			2: [1, 241],
			25: [1, 242],
			34: [1, 240]
		}, {
			2: [2, 291],
			25: [2, 291],
			34: [2, 291],
			39: [2, 291],
			57: [2, 291],
			82: [2, 291]
		}, {
			2: [2, 271],
			19: [2, 271],
			21: [2, 271],
			22: [2, 271],
			25: [2, 271],
			28: [2, 271],
			34: [2, 271],
			36: [2, 271],
			37: [2, 271],
			39: [2, 271],
			40: [2, 271],
			41: [2, 271],
			42: [2, 271],
			43: [2, 271],
			47: [2, 271],
			48: [2, 271],
			49: [2, 271],
			50: [2, 271],
			51: [2, 271],
			56: [2, 271],
			57: [2, 271],
			58: [2, 271],
			59: [2, 271],
			60: [2, 271],
			65: [2, 271],
			67: [2, 271],
			73: [2, 271],
			78: [2, 271],
			81: [2, 271],
			82: [2, 271],
			94: [2, 271],
			105: [2, 271],
			106: [2, 271],
			111: [2, 271],
			112: [2, 271],
			113: [2, 271],
			114: [2, 271],
			115: [2, 271],
			116: [2, 271],
			117: [2, 271],
			118: [2, 271],
			119: [2, 271],
			122: [2, 271],
			174: [2, 271],
			187: [2, 271],
			188: [2, 271],
			189: [2, 271],
			190: [2, 271],
			191: [2, 271]
		}, {
			2: [2, 157],
			19: [2, 157],
			21: [2, 157],
			22: [2, 157],
			25: [2, 157],
			28: [2, 157],
			31: [1, 243],
			34: [2, 157],
			36: [2, 157],
			37: [2, 157],
			39: [2, 157],
			40: [2, 157],
			41: [2, 157],
			42: [2, 157],
			43: [2, 157],
			46: [2, 157],
			47: [2, 157],
			48: [2, 157],
			49: [2, 157],
			50: [2, 157],
			51: [2, 157],
			56: [2, 157],
			57: [2, 157],
			58: [2, 157],
			59: [2, 157],
			60: [2, 157],
			65: [2, 157],
			67: [2, 157],
			73: [2, 157],
			78: [2, 157],
			81: [2, 157],
			82: [2, 157],
			94: [2, 157],
			105: [1, 245],
			106: [1, 246],
			111: [2, 157],
			112: [2, 157],
			113: [2, 157],
			114: [2, 157],
			115: [2, 157],
			116: [2, 157],
			117: [2, 157],
			118: [2, 157],
			119: [2, 157],
			121: [2, 157],
			122: [2, 157],
			123: [2, 157],
			128: [2, 157],
			129: [2, 157],
			130: [2, 157],
			133: [2, 157],
			134: [2, 157],
			135: [2, 157],
			136: [2, 157],
			137: [2, 157],
			141: [2, 157],
			142: [2, 157],
			143: [2, 157],
			144: [2, 157],
			148: [2, 157],
			152: [2, 157],
			156: [2, 157],
			160: [2, 157],
			164: [2, 157],
			168: [2, 157],
			171: 244,
			173: [1, 149],
			174: [1, 150],
			175: [1, 151],
			176: [1, 152],
			177: [1, 153],
			178: [1, 154],
			179: [1, 155],
			180: [1, 156],
			181: [1, 157],
			182: [1, 158],
			183: [1, 159],
			187: [2, 157],
			188: [2, 157],
			189: [2, 157],
			190: [2, 157],
			191: [2, 157]
		}, {
			2: [2, 265],
			19: [2, 265],
			21: [2, 265],
			22: [2, 265],
			25: [2, 265],
			28: [2, 265],
			34: [2, 265],
			36: [2, 265],
			37: [2, 265],
			39: [2, 265],
			40: [2, 265],
			41: [2, 265],
			42: [2, 265],
			43: [2, 265],
			47: [2, 265],
			48: [2, 265],
			49: [2, 265],
			50: [2, 265],
			51: [2, 265],
			56: [2, 265],
			57: [2, 265],
			58: [2, 265],
			59: [2, 265],
			60: [2, 265],
			65: [2, 265],
			67: [2, 265],
			73: [2, 265],
			78: [2, 265],
			81: [2, 265],
			82: [2, 265],
			94: [2, 265],
			105: [2, 265],
			106: [2, 265],
			111: [2, 265],
			112: [2, 265],
			113: [2, 265],
			114: [2, 265],
			115: [2, 265],
			116: [2, 265],
			117: [2, 265],
			118: [2, 265],
			119: [2, 265],
			122: [2, 265],
			164: [1, 248],
			168: [1, 247],
			174: [2, 265],
			187: [2, 265],
			188: [2, 265],
			189: [2, 265],
			190: [2, 265],
			191: [2, 265]
		}, {
			2: [2, 153],
			19: [2, 153],
			21: [2, 153],
			22: [2, 153],
			25: [2, 153],
			28: [2, 153],
			31: [2, 153],
			34: [2, 153],
			36: [2, 153],
			37: [2, 153],
			39: [2, 153],
			40: [2, 153],
			41: [2, 153],
			42: [2, 153],
			43: [2, 153],
			46: [2, 153],
			47: [2, 153],
			48: [2, 153],
			49: [2, 153],
			50: [2, 153],
			51: [2, 153],
			56: [2, 153],
			57: [2, 153],
			58: [2, 153],
			59: [2, 153],
			60: [2, 153],
			65: [2, 153],
			67: [2, 153],
			73: [2, 153],
			78: [2, 153],
			81: [2, 153],
			82: [2, 153],
			94: [2, 153],
			105: [2, 153],
			106: [2, 153],
			111: [2, 153],
			112: [2, 153],
			113: [2, 153],
			114: [2, 153],
			115: [2, 153],
			116: [2, 153],
			117: [2, 153],
			118: [2, 153],
			119: [2, 153],
			121: [2, 153],
			122: [2, 153],
			123: [2, 153],
			128: [2, 153],
			129: [2, 153],
			130: [2, 153],
			133: [2, 153],
			134: [2, 153],
			135: [2, 153],
			136: [2, 153],
			137: [2, 153],
			141: [2, 153],
			142: [2, 153],
			143: [2, 153],
			144: [2, 153],
			148: [2, 153],
			152: [2, 153],
			156: [2, 153],
			160: [2, 153],
			164: [2, 153],
			168: [2, 153],
			173: [2, 153],
			174: [2, 153],
			175: [2, 153],
			176: [2, 153],
			177: [2, 153],
			178: [2, 153],
			179: [2, 153],
			180: [2, 153],
			181: [2, 153],
			182: [2, 153],
			183: [2, 153],
			187: [2, 153],
			188: [2, 153],
			189: [2, 153],
			190: [2, 153],
			191: [2, 153]
		}, {
			2: [2, 154],
			19: [2, 154],
			21: [2, 154],
			22: [2, 154],
			25: [2, 154],
			28: [2, 154],
			31: [2, 154],
			34: [2, 154],
			36: [2, 154],
			37: [1, 165],
			39: [2, 154],
			40: [2, 154],
			41: [2, 154],
			42: [2, 154],
			43: [2, 154],
			46: [2, 154],
			47: [2, 154],
			48: [2, 154],
			49: [2, 154],
			50: [2, 154],
			51: [2, 154],
			56: [2, 154],
			57: [2, 154],
			58: [2, 154],
			59: [2, 154],
			60: [2, 154],
			65: [2, 154],
			67: [2, 154],
			73: [2, 154],
			78: [2, 154],
			81: [1, 250],
			82: [2, 154],
			93: [1, 251],
			94: [2, 154],
			95: 249,
			105: [2, 154],
			106: [2, 154],
			111: [2, 154],
			112: [2, 154],
			113: [2, 154],
			114: [2, 154],
			115: [2, 154],
			116: [2, 154],
			117: [2, 154],
			118: [2, 154],
			119: [2, 154],
			121: [2, 154],
			122: [2, 154],
			123: [2, 154],
			128: [2, 154],
			129: [2, 154],
			130: [2, 154],
			133: [2, 154],
			134: [2, 154],
			135: [2, 154],
			136: [2, 154],
			137: [2, 154],
			141: [2, 154],
			142: [2, 154],
			143: [2, 154],
			144: [2, 154],
			148: [2, 154],
			152: [2, 154],
			156: [2, 154],
			160: [2, 154],
			164: [2, 154],
			168: [2, 154],
			173: [2, 154],
			174: [2, 154],
			175: [2, 154],
			176: [2, 154],
			177: [2, 154],
			178: [2, 154],
			179: [2, 154],
			180: [2, 154],
			181: [2, 154],
			182: [2, 154],
			183: [2, 154],
			187: [2, 154],
			188: [2, 154],
			189: [2, 154],
			190: [2, 154],
			191: [2, 154]
		}, {
			2: [2, 259],
			19: [2, 259],
			21: [2, 259],
			22: [2, 259],
			25: [2, 259],
			28: [2, 259],
			34: [2, 259],
			36: [2, 259],
			37: [2, 259],
			39: [2, 259],
			40: [2, 259],
			41: [2, 259],
			42: [2, 259],
			43: [2, 259],
			47: [2, 259],
			48: [2, 259],
			49: [2, 259],
			50: [2, 259],
			51: [2, 259],
			56: [2, 259],
			57: [2, 259],
			58: [2, 259],
			59: [2, 259],
			60: [2, 259],
			65: [2, 259],
			67: [2, 259],
			73: [2, 259],
			78: [2, 259],
			81: [2, 259],
			82: [2, 259],
			94: [2, 259],
			105: [2, 259],
			106: [2, 259],
			111: [2, 259],
			112: [2, 259],
			113: [2, 259],
			114: [2, 259],
			115: [2, 259],
			116: [2, 259],
			117: [2, 259],
			118: [2, 259],
			119: [2, 259],
			122: [2, 259],
			160: [1, 252],
			164: [2, 259],
			168: [2, 259],
			174: [2, 259],
			187: [2, 259],
			188: [2, 259],
			189: [2, 259],
			190: [2, 259],
			191: [2, 259]
		}, {
			2: [2, 135],
			19: [2, 135],
			21: [2, 135],
			22: [2, 135],
			25: [2, 135],
			28: [2, 135],
			31: [2, 135],
			34: [2, 135],
			36: [2, 135],
			37: [1, 165],
			39: [2, 135],
			40: [2, 135],
			41: [2, 135],
			42: [2, 135],
			43: [2, 135],
			46: [2, 135],
			47: [2, 135],
			48: [2, 135],
			49: [2, 135],
			50: [2, 135],
			51: [2, 135],
			56: [2, 135],
			57: [2, 135],
			58: [2, 135],
			59: [2, 135],
			60: [2, 135],
			65: [2, 135],
			67: [2, 135],
			73: [2, 135],
			78: [2, 135],
			81: [1, 254],
			82: [2, 135],
			93: [1, 255],
			94: [2, 135],
			95: 253,
			105: [2, 135],
			106: [2, 135],
			111: [2, 135],
			112: [2, 135],
			113: [2, 135],
			114: [2, 135],
			115: [2, 135],
			116: [2, 135],
			117: [2, 135],
			118: [2, 135],
			119: [2, 135],
			121: [2, 135],
			122: [2, 135],
			123: [2, 135],
			128: [2, 135],
			129: [2, 135],
			130: [2, 135],
			133: [2, 135],
			134: [2, 135],
			135: [2, 135],
			136: [2, 135],
			137: [2, 135],
			141: [2, 135],
			142: [2, 135],
			143: [2, 135],
			144: [2, 135],
			148: [2, 135],
			152: [2, 135],
			156: [2, 135],
			160: [2, 135],
			164: [2, 135],
			168: [2, 135],
			173: [2, 135],
			174: [2, 135],
			175: [2, 135],
			176: [2, 135],
			177: [2, 135],
			178: [2, 135],
			179: [2, 135],
			180: [2, 135],
			181: [2, 135],
			182: [2, 135],
			183: [2, 135],
			187: [2, 135],
			188: [2, 135],
			189: [2, 135],
			190: [2, 135],
			191: [2, 135]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 257,
			94: [1, 119],
			97: 256,
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 253],
			19: [2, 253],
			21: [2, 253],
			22: [2, 253],
			25: [2, 253],
			28: [2, 253],
			34: [2, 253],
			36: [2, 253],
			37: [2, 253],
			39: [2, 253],
			40: [2, 253],
			41: [2, 253],
			42: [2, 253],
			43: [2, 253],
			47: [2, 253],
			48: [2, 253],
			49: [2, 253],
			50: [2, 253],
			51: [2, 253],
			56: [2, 253],
			57: [2, 253],
			58: [2, 253],
			59: [2, 253],
			60: [2, 253],
			65: [2, 253],
			67: [2, 253],
			73: [2, 253],
			78: [2, 253],
			81: [2, 253],
			82: [2, 253],
			94: [2, 253],
			105: [2, 253],
			106: [2, 253],
			111: [2, 253],
			112: [2, 253],
			113: [2, 253],
			114: [2, 253],
			115: [2, 253],
			116: [2, 253],
			117: [2, 253],
			118: [2, 253],
			119: [2, 253],
			122: [2, 253],
			156: [1, 258],
			160: [2, 253],
			164: [2, 253],
			168: [2, 253],
			174: [2, 253],
			187: [2, 253],
			188: [2, 253],
			189: [2, 253],
			190: [2, 253],
			191: [2, 253]
		}, {
			2: [2, 126],
			19: [2, 126],
			21: [2, 126],
			22: [2, 126],
			25: [2, 126],
			28: [2, 126],
			31: [2, 126],
			34: [2, 126],
			36: [2, 126],
			37: [2, 126],
			39: [2, 126],
			40: [2, 126],
			41: [2, 126],
			42: [2, 126],
			43: [2, 126],
			46: [2, 126],
			47: [2, 126],
			48: [2, 126],
			49: [2, 126],
			50: [2, 126],
			51: [2, 126],
			56: [2, 126],
			57: [2, 126],
			58: [2, 126],
			59: [2, 126],
			60: [2, 126],
			65: [2, 126],
			67: [2, 126],
			73: [2, 126],
			78: [2, 126],
			81: [2, 126],
			82: [2, 126],
			93: [2, 126],
			94: [2, 126],
			105: [2, 126],
			106: [2, 126],
			111: [2, 126],
			112: [2, 126],
			113: [2, 126],
			114: [2, 126],
			115: [2, 126],
			116: [2, 126],
			117: [2, 126],
			118: [2, 126],
			119: [2, 126],
			121: [2, 126],
			122: [2, 126],
			123: [2, 126],
			128: [2, 126],
			129: [2, 126],
			130: [2, 126],
			133: [2, 126],
			134: [2, 126],
			135: [2, 126],
			136: [2, 126],
			137: [2, 126],
			141: [2, 126],
			142: [2, 126],
			143: [2, 126],
			144: [2, 126],
			148: [2, 126],
			152: [2, 126],
			156: [2, 126],
			160: [2, 126],
			164: [2, 126],
			168: [2, 126],
			173: [2, 126],
			174: [2, 126],
			175: [2, 126],
			176: [2, 126],
			177: [2, 126],
			178: [2, 126],
			179: [2, 126],
			180: [2, 126],
			181: [2, 126],
			182: [2, 126],
			183: [2, 126],
			187: [2, 126],
			188: [2, 126],
			189: [2, 126],
			190: [2, 126],
			191: [2, 126]
		}, {
			2: [2, 127],
			19: [2, 127],
			21: [2, 127],
			22: [2, 127],
			25: [2, 127],
			28: [2, 127],
			31: [2, 127],
			34: [2, 127],
			36: [2, 127],
			37: [2, 127],
			39: [2, 127],
			40: [2, 127],
			41: [2, 127],
			42: [2, 127],
			43: [2, 127],
			46: [2, 127],
			47: [2, 127],
			48: [2, 127],
			49: [2, 127],
			50: [2, 127],
			51: [2, 127],
			56: [2, 127],
			57: [2, 127],
			58: [2, 127],
			59: [2, 127],
			60: [2, 127],
			65: [2, 127],
			67: [2, 127],
			73: [2, 127],
			78: [2, 127],
			81: [2, 127],
			82: [2, 127],
			93: [2, 127],
			94: [2, 127],
			105: [2, 127],
			106: [2, 127],
			111: [2, 127],
			112: [2, 127],
			113: [2, 127],
			114: [2, 127],
			115: [2, 127],
			116: [2, 127],
			117: [2, 127],
			118: [2, 127],
			119: [2, 127],
			121: [2, 127],
			122: [2, 127],
			123: [2, 127],
			128: [2, 127],
			129: [2, 127],
			130: [2, 127],
			133: [2, 127],
			134: [2, 127],
			135: [2, 127],
			136: [2, 127],
			137: [2, 127],
			141: [2, 127],
			142: [2, 127],
			143: [2, 127],
			144: [2, 127],
			148: [2, 127],
			152: [2, 127],
			156: [2, 127],
			160: [2, 127],
			164: [2, 127],
			168: [2, 127],
			173: [2, 127],
			174: [2, 127],
			175: [2, 127],
			176: [2, 127],
			177: [2, 127],
			178: [2, 127],
			179: [2, 127],
			180: [2, 127],
			181: [2, 127],
			182: [2, 127],
			183: [2, 127],
			187: [2, 127],
			188: [2, 127],
			189: [2, 127],
			190: [2, 127],
			191: [2, 127]
		}, {
			2: [2, 247],
			19: [2, 247],
			21: [2, 247],
			22: [2, 247],
			25: [2, 247],
			28: [2, 247],
			34: [2, 247],
			36: [2, 247],
			37: [2, 247],
			39: [2, 247],
			40: [2, 247],
			41: [2, 247],
			42: [2, 247],
			43: [2, 247],
			47: [2, 247],
			48: [2, 247],
			49: [2, 247],
			50: [2, 247],
			51: [2, 247],
			56: [2, 247],
			57: [2, 247],
			58: [2, 247],
			59: [2, 247],
			60: [2, 247],
			65: [2, 247],
			67: [2, 247],
			73: [2, 247],
			78: [2, 247],
			81: [2, 247],
			82: [2, 247],
			94: [2, 247],
			105: [2, 247],
			106: [2, 247],
			111: [2, 247],
			112: [2, 247],
			113: [2, 247],
			114: [2, 247],
			115: [2, 247],
			116: [2, 247],
			117: [2, 247],
			118: [2, 247],
			119: [2, 247],
			122: [2, 247],
			152: [1, 259],
			156: [2, 247],
			160: [2, 247],
			164: [2, 247],
			168: [2, 247],
			174: [2, 247],
			187: [2, 247],
			188: [2, 247],
			189: [2, 247],
			190: [2, 247],
			191: [2, 247]
		}, {
			2: [2, 96],
			19: [2, 96],
			21: [2, 96],
			22: [2, 96],
			25: [2, 96],
			28: [2, 96],
			31: [2, 96],
			34: [2, 96],
			36: [2, 96],
			37: [2, 96],
			39: [2, 96],
			40: [2, 96],
			41: [2, 96],
			42: [2, 96],
			43: [2, 96],
			46: [2, 96],
			47: [2, 96],
			48: [2, 96],
			49: [2, 96],
			50: [2, 96],
			51: [2, 96],
			56: [2, 96],
			57: [2, 96],
			58: [2, 96],
			59: [2, 96],
			60: [2, 96],
			65: [2, 96],
			67: [2, 96],
			73: [2, 96],
			78: [2, 96],
			81: [2, 96],
			82: [2, 96],
			93: [2, 96],
			94: [2, 96],
			105: [2, 96],
			106: [2, 96],
			111: [2, 96],
			112: [2, 96],
			113: [2, 96],
			114: [2, 96],
			115: [2, 96],
			116: [2, 96],
			117: [2, 96],
			118: [2, 96],
			119: [2, 96],
			121: [2, 96],
			122: [2, 96],
			123: [2, 96],
			128: [2, 96],
			129: [2, 96],
			130: [2, 96],
			133: [2, 96],
			134: [2, 96],
			135: [2, 96],
			136: [2, 96],
			137: [2, 96],
			141: [2, 96],
			142: [2, 96],
			143: [2, 96],
			144: [2, 96],
			148: [2, 96],
			152: [2, 96],
			156: [2, 96],
			160: [2, 96],
			164: [2, 96],
			168: [2, 96],
			173: [2, 96],
			174: [2, 96],
			175: [2, 96],
			176: [2, 96],
			177: [2, 96],
			178: [2, 96],
			179: [2, 96],
			180: [2, 96],
			181: [2, 96],
			182: [2, 96],
			183: [2, 96],
			187: [2, 96],
			188: [2, 96],
			189: [2, 96],
			190: [2, 96],
			191: [2, 96]
		}, {
			2: [2, 97],
			19: [2, 97],
			21: [2, 97],
			22: [2, 97],
			25: [2, 97],
			28: [2, 97],
			31: [2, 97],
			34: [2, 97],
			36: [2, 97],
			37: [2, 97],
			39: [2, 97],
			40: [2, 97],
			41: [2, 97],
			42: [2, 97],
			43: [2, 97],
			46: [2, 97],
			47: [2, 97],
			48: [2, 97],
			49: [2, 97],
			50: [2, 97],
			51: [2, 97],
			56: [2, 97],
			57: [2, 97],
			58: [2, 97],
			59: [2, 97],
			60: [2, 97],
			65: [2, 97],
			67: [2, 97],
			73: [2, 97],
			78: [2, 97],
			81: [2, 97],
			82: [2, 97],
			93: [2, 97],
			94: [2, 97],
			105: [2, 97],
			106: [2, 97],
			111: [2, 97],
			112: [2, 97],
			113: [2, 97],
			114: [2, 97],
			115: [2, 97],
			116: [2, 97],
			117: [2, 97],
			118: [2, 97],
			119: [2, 97],
			121: [2, 97],
			122: [2, 97],
			123: [2, 97],
			128: [2, 97],
			129: [2, 97],
			130: [2, 97],
			133: [2, 97],
			134: [2, 97],
			135: [2, 97],
			136: [2, 97],
			137: [2, 97],
			141: [2, 97],
			142: [2, 97],
			143: [2, 97],
			144: [2, 97],
			148: [2, 97],
			152: [2, 97],
			156: [2, 97],
			160: [2, 97],
			164: [2, 97],
			168: [2, 97],
			173: [2, 97],
			174: [2, 97],
			175: [2, 97],
			176: [2, 97],
			177: [2, 97],
			178: [2, 97],
			179: [2, 97],
			180: [2, 97],
			181: [2, 97],
			182: [2, 97],
			183: [2, 97],
			187: [2, 97],
			188: [2, 97],
			189: [2, 97],
			190: [2, 97],
			191: [2, 97]
		}, {
			28: [1, 260],
			37: [1, 261]
		}, {
			2: [2, 241],
			19: [2, 241],
			21: [2, 241],
			22: [2, 241],
			25: [2, 241],
			28: [2, 241],
			34: [2, 241],
			36: [2, 241],
			37: [2, 241],
			39: [2, 241],
			40: [2, 241],
			41: [2, 241],
			42: [2, 241],
			43: [2, 241],
			47: [2, 241],
			48: [2, 241],
			49: [2, 241],
			50: [2, 241],
			51: [2, 241],
			56: [2, 241],
			57: [2, 241],
			58: [2, 241],
			59: [2, 241],
			60: [2, 241],
			65: [2, 241],
			67: [2, 241],
			73: [2, 241],
			78: [2, 241],
			81: [2, 241],
			82: [2, 241],
			94: [2, 241],
			105: [2, 241],
			106: [2, 241],
			111: [2, 241],
			112: [2, 241],
			113: [2, 241],
			114: [2, 241],
			115: [2, 241],
			116: [2, 241],
			117: [2, 241],
			118: [2, 241],
			119: [2, 241],
			122: [2, 241],
			148: [1, 262],
			152: [2, 241],
			156: [2, 241],
			160: [2, 241],
			164: [2, 241],
			168: [2, 241],
			174: [2, 241],
			187: [2, 241],
			188: [2, 241],
			189: [2, 241],
			190: [2, 241],
			191: [2, 241]
		}, {
			2: [2, 99],
			19: [2, 99],
			21: [2, 99],
			22: [2, 99],
			25: [2, 99],
			28: [2, 99],
			31: [2, 99],
			34: [2, 99],
			36: [2, 99],
			37: [2, 99],
			39: [2, 99],
			40: [2, 99],
			41: [2, 99],
			42: [2, 99],
			43: [2, 99],
			46: [2, 99],
			47: [2, 99],
			48: [2, 99],
			49: [2, 99],
			50: [2, 99],
			51: [2, 99],
			56: [2, 99],
			57: [2, 99],
			58: [2, 99],
			59: [2, 99],
			60: [2, 99],
			65: [2, 99],
			67: [2, 99],
			73: [2, 99],
			78: [2, 99],
			81: [2, 99],
			82: [2, 99],
			93: [2, 99],
			94: [2, 99],
			105: [2, 99],
			106: [2, 99],
			111: [2, 99],
			112: [2, 99],
			113: [2, 99],
			114: [2, 99],
			115: [2, 99],
			116: [2, 99],
			117: [2, 99],
			118: [2, 99],
			119: [2, 99],
			121: [2, 99],
			122: [2, 99],
			123: [2, 99],
			128: [2, 99],
			129: [2, 99],
			130: [2, 99],
			133: [2, 99],
			134: [2, 99],
			135: [2, 99],
			136: [2, 99],
			137: [2, 99],
			141: [2, 99],
			142: [2, 99],
			143: [2, 99],
			144: [2, 99],
			148: [2, 99],
			152: [2, 99],
			156: [2, 99],
			160: [2, 99],
			164: [2, 99],
			168: [2, 99],
			173: [2, 99],
			174: [2, 99],
			175: [2, 99],
			176: [2, 99],
			177: [2, 99],
			178: [2, 99],
			179: [2, 99],
			180: [2, 99],
			181: [2, 99],
			182: [2, 99],
			183: [2, 99],
			187: [2, 99],
			188: [2, 99],
			189: [2, 99],
			190: [2, 99],
			191: [2, 99]
		}, {
			21: [1, 263],
			22: [1, 294],
			28: [1, 267],
			36: [1, 284],
			40: [1, 280],
			41: [1, 279],
			42: [1, 296],
			43: [1, 282],
			46: [1, 285],
			47: [1, 275],
			48: [1, 272],
			49: [1, 288],
			50: [1, 297],
			51: [1, 289],
			56: [1, 273],
			58: [1, 277],
			59: [1, 291],
			60: [1, 292],
			63: [1, 274],
			64: [1, 281],
			65: [1, 276],
			67: [1, 283],
			78: [1, 290],
			85: 264,
			86: 265,
			87: 266,
			89: 268,
			90: 269,
			91: 270,
			94: [1, 287],
			101: 271,
			111: [1, 278],
			112: [1, 295],
			113: [1, 293],
			137: [1, 286],
			187: [1, 300],
			188: [1, 298],
			189: [1, 299],
			190: [1, 67],
			191: [1, 68],
			194: [1, 301],
			195: [1, 302],
			196: [1, 303],
			197: [1, 304],
			198: [1, 305],
			199: [1, 306],
			200: [1, 307]
		}, {
			2: [2, 235],
			19: [2, 235],
			21: [2, 235],
			22: [2, 235],
			25: [2, 235],
			28: [2, 235],
			34: [2, 235],
			36: [2, 235],
			37: [2, 235],
			39: [2, 235],
			40: [2, 235],
			41: [2, 235],
			42: [2, 235],
			43: [2, 235],
			47: [2, 235],
			48: [2, 235],
			49: [2, 235],
			50: [2, 235],
			51: [2, 235],
			56: [2, 235],
			57: [2, 235],
			58: [2, 235],
			59: [2, 235],
			60: [2, 235],
			65: [2, 235],
			67: [2, 235],
			73: [2, 235],
			78: [2, 235],
			81: [2, 235],
			82: [2, 235],
			94: [2, 235],
			105: [2, 235],
			106: [2, 235],
			111: [2, 235],
			112: [2, 235],
			113: [2, 235],
			114: [2, 235],
			115: [2, 235],
			116: [2, 235],
			117: [2, 235],
			118: [2, 235],
			119: [2, 235],
			122: [2, 235],
			141: [1, 308],
			142: [1, 309],
			143: [1, 310],
			144: [1, 311],
			148: [2, 235],
			152: [2, 235],
			156: [2, 235],
			160: [2, 235],
			164: [2, 235],
			168: [2, 235],
			174: [2, 235],
			187: [2, 235],
			188: [2, 235],
			189: [2, 235],
			190: [2, 235],
			191: [2, 235]
		}, {
			2: [2, 220],
			19: [2, 220],
			21: [2, 220],
			22: [2, 220],
			25: [2, 220],
			28: [2, 220],
			34: [2, 220],
			36: [2, 220],
			37: [2, 220],
			39: [2, 220],
			40: [2, 220],
			41: [2, 220],
			42: [2, 220],
			43: [2, 220],
			46: [1, 317],
			47: [2, 220],
			48: [2, 220],
			49: [2, 220],
			50: [2, 220],
			51: [2, 220],
			56: [2, 220],
			57: [2, 220],
			58: [2, 220],
			59: [2, 220],
			60: [2, 220],
			65: [2, 220],
			67: [2, 220],
			73: [2, 220],
			78: [2, 220],
			81: [2, 220],
			82: [2, 220],
			94: [2, 220],
			105: [2, 220],
			106: [2, 220],
			111: [2, 220],
			112: [2, 220],
			113: [2, 220],
			114: [2, 220],
			115: [2, 220],
			116: [2, 220],
			117: [2, 220],
			118: [2, 220],
			119: [2, 220],
			122: [2, 220],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 220],
			142: [2, 220],
			143: [2, 220],
			144: [2, 220],
			148: [2, 220],
			152: [2, 220],
			156: [2, 220],
			160: [2, 220],
			164: [2, 220],
			168: [2, 220],
			174: [2, 220],
			187: [2, 220],
			188: [2, 220],
			189: [2, 220],
			190: [2, 220],
			191: [2, 220]
		}, {
			2: [2, 200],
			19: [2, 200],
			21: [2, 200],
			22: [2, 200],
			25: [2, 200],
			28: [2, 200],
			34: [2, 200],
			36: [2, 200],
			37: [2, 200],
			39: [2, 200],
			40: [2, 200],
			41: [2, 200],
			42: [2, 200],
			43: [2, 200],
			46: [2, 200],
			47: [2, 200],
			48: [2, 200],
			49: [2, 200],
			50: [2, 200],
			51: [2, 200],
			56: [2, 200],
			57: [2, 200],
			58: [2, 200],
			59: [2, 200],
			60: [2, 200],
			65: [2, 200],
			67: [2, 200],
			73: [2, 200],
			78: [2, 200],
			81: [2, 200],
			82: [2, 200],
			94: [2, 200],
			105: [2, 200],
			106: [2, 200],
			111: [2, 200],
			112: [2, 200],
			113: [2, 200],
			114: [2, 200],
			115: [2, 200],
			116: [2, 200],
			117: [2, 200],
			118: [2, 200],
			119: [2, 200],
			122: [2, 200],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 200],
			134: [2, 200],
			135: [2, 200],
			136: [2, 200],
			137: [2, 200],
			141: [2, 200],
			142: [2, 200],
			143: [2, 200],
			144: [2, 200],
			148: [2, 200],
			152: [2, 200],
			156: [2, 200],
			160: [2, 200],
			164: [2, 200],
			168: [2, 200],
			174: [2, 200],
			187: [2, 200],
			188: [2, 200],
			189: [2, 200],
			190: [2, 200],
			191: [2, 200]
		}, {
			2: [2, 192],
			19: [2, 192],
			21: [2, 192],
			22: [2, 192],
			25: [2, 192],
			28: [2, 192],
			34: [2, 192],
			36: [2, 192],
			37: [2, 192],
			39: [2, 192],
			40: [2, 192],
			41: [2, 192],
			42: [2, 192],
			43: [2, 192],
			46: [2, 192],
			47: [2, 192],
			48: [2, 192],
			49: [2, 192],
			50: [2, 192],
			51: [2, 192],
			56: [2, 192],
			57: [2, 192],
			58: [2, 192],
			59: [2, 192],
			60: [2, 192],
			65: [2, 192],
			67: [2, 192],
			73: [2, 192],
			78: [2, 192],
			81: [2, 192],
			82: [2, 192],
			94: [2, 192],
			105: [2, 192],
			106: [2, 192],
			111: [2, 192],
			112: [2, 192],
			113: [2, 192],
			114: [2, 192],
			115: [2, 192],
			116: [1, 321],
			117: [1, 322],
			118: [2, 192],
			119: [2, 192],
			122: [2, 192],
			128: [2, 192],
			129: [2, 192],
			130: [2, 192],
			133: [2, 192],
			134: [2, 192],
			135: [2, 192],
			136: [2, 192],
			137: [2, 192],
			141: [2, 192],
			142: [2, 192],
			143: [2, 192],
			144: [2, 192],
			148: [2, 192],
			152: [2, 192],
			156: [2, 192],
			160: [2, 192],
			164: [2, 192],
			168: [2, 192],
			174: [2, 192],
			187: [2, 192],
			188: [2, 192],
			189: [2, 192],
			190: [2, 192],
			191: [2, 192]
		}, {
			2: [2, 186],
			19: [2, 186],
			21: [2, 186],
			22: [2, 186],
			25: [2, 186],
			28: [2, 186],
			34: [2, 186],
			36: [2, 186],
			37: [2, 186],
			39: [2, 186],
			40: [2, 186],
			41: [2, 186],
			42: [2, 186],
			43: [2, 186],
			46: [2, 186],
			47: [2, 186],
			48: [2, 186],
			49: [2, 186],
			50: [2, 186],
			51: [2, 186],
			56: [2, 186],
			57: [2, 186],
			58: [2, 186],
			59: [2, 186],
			60: [2, 186],
			65: [2, 186],
			67: [2, 186],
			73: [2, 186],
			78: [2, 186],
			81: [2, 186],
			82: [2, 186],
			94: [2, 186],
			105: [2, 186],
			106: [2, 186],
			111: [2, 186],
			112: [2, 186],
			113: [2, 186],
			114: [2, 186],
			115: [2, 186],
			116: [2, 186],
			117: [2, 186],
			118: [2, 186],
			119: [2, 186],
			121: [1, 323],
			122: [1, 324],
			123: [1, 325],
			128: [2, 186],
			129: [2, 186],
			130: [2, 186],
			133: [2, 186],
			134: [2, 186],
			135: [2, 186],
			136: [2, 186],
			137: [2, 186],
			141: [2, 186],
			142: [2, 186],
			143: [2, 186],
			144: [2, 186],
			148: [2, 186],
			152: [2, 186],
			156: [2, 186],
			160: [2, 186],
			164: [2, 186],
			168: [2, 186],
			174: [2, 186],
			187: [2, 186],
			188: [2, 186],
			189: [2, 186],
			190: [2, 186],
			191: [2, 186]
		}, {
			2: [2, 178],
			19: [2, 178],
			21: [2, 178],
			22: [2, 178],
			25: [2, 178],
			28: [2, 178],
			34: [2, 178],
			36: [2, 178],
			37: [2, 178],
			39: [2, 178],
			40: [2, 178],
			41: [2, 178],
			42: [2, 178],
			43: [2, 178],
			46: [2, 178],
			47: [2, 178],
			48: [2, 178],
			49: [2, 178],
			50: [2, 178],
			51: [2, 178],
			56: [2, 178],
			57: [2, 178],
			58: [2, 178],
			59: [2, 178],
			60: [2, 178],
			65: [2, 178],
			67: [2, 178],
			73: [2, 178],
			78: [2, 178],
			81: [2, 178],
			82: [2, 178],
			94: [2, 178],
			105: [2, 178],
			106: [2, 178],
			111: [2, 178],
			112: [2, 178],
			113: [2, 178],
			114: [2, 178],
			115: [2, 178],
			116: [2, 178],
			117: [2, 178],
			118: [2, 178],
			119: [2, 178],
			121: [2, 178],
			122: [2, 178],
			123: [2, 178],
			128: [2, 178],
			129: [2, 178],
			130: [2, 178],
			133: [2, 178],
			134: [2, 178],
			135: [2, 178],
			136: [2, 178],
			137: [2, 178],
			141: [2, 178],
			142: [2, 178],
			143: [2, 178],
			144: [2, 178],
			148: [2, 178],
			152: [2, 178],
			156: [2, 178],
			160: [2, 178],
			164: [2, 178],
			168: [2, 178],
			174: [2, 178],
			187: [2, 178],
			188: [2, 178],
			189: [2, 178],
			190: [2, 178],
			191: [2, 178]
		}, {
			2: [2, 163],
			19: [2, 163],
			21: [2, 163],
			22: [2, 163],
			25: [2, 163],
			28: [2, 163],
			34: [2, 163],
			36: [2, 163],
			37: [2, 163],
			39: [2, 163],
			40: [2, 163],
			41: [2, 163],
			42: [2, 163],
			43: [2, 163],
			46: [2, 163],
			47: [2, 163],
			48: [2, 163],
			49: [2, 163],
			50: [2, 163],
			51: [2, 163],
			56: [2, 163],
			57: [2, 163],
			58: [2, 163],
			59: [2, 163],
			60: [2, 163],
			65: [2, 163],
			67: [2, 163],
			73: [2, 163],
			78: [2, 163],
			81: [2, 163],
			82: [2, 163],
			94: [2, 163],
			105: [2, 163],
			106: [2, 163],
			111: [2, 163],
			112: [2, 163],
			113: [2, 163],
			114: [2, 163],
			115: [2, 163],
			116: [2, 163],
			117: [2, 163],
			118: [2, 163],
			119: [2, 163],
			121: [2, 163],
			122: [2, 163],
			123: [2, 163],
			128: [2, 163],
			129: [2, 163],
			130: [2, 163],
			133: [2, 163],
			134: [2, 163],
			135: [2, 163],
			136: [2, 163],
			137: [2, 163],
			141: [2, 163],
			142: [2, 163],
			143: [2, 163],
			144: [2, 163],
			148: [2, 163],
			152: [2, 163],
			156: [2, 163],
			160: [2, 163],
			164: [2, 163],
			168: [2, 163],
			174: [2, 163],
			187: [2, 163],
			188: [2, 163],
			189: [2, 163],
			190: [2, 163],
			191: [2, 163]
		}, {
			2: [2, 164],
			19: [2, 164],
			21: [2, 164],
			22: [2, 164],
			25: [2, 164],
			28: [2, 164],
			34: [2, 164],
			36: [2, 164],
			37: [2, 164],
			39: [2, 164],
			40: [2, 164],
			41: [2, 164],
			42: [2, 164],
			43: [2, 164],
			46: [2, 164],
			47: [2, 164],
			48: [2, 164],
			49: [2, 164],
			50: [2, 164],
			51: [2, 164],
			56: [2, 164],
			57: [2, 164],
			58: [2, 164],
			59: [2, 164],
			60: [2, 164],
			65: [2, 164],
			67: [2, 164],
			73: [2, 164],
			78: [2, 164],
			81: [2, 164],
			82: [2, 164],
			94: [2, 164],
			105: [2, 164],
			106: [2, 164],
			111: [2, 164],
			112: [2, 164],
			113: [2, 164],
			114: [2, 164],
			115: [2, 164],
			116: [2, 164],
			117: [2, 164],
			118: [2, 164],
			119: [2, 164],
			121: [2, 164],
			122: [2, 164],
			123: [2, 164],
			128: [2, 164],
			129: [2, 164],
			130: [2, 164],
			133: [2, 164],
			134: [2, 164],
			135: [2, 164],
			136: [2, 164],
			137: [2, 164],
			141: [2, 164],
			142: [2, 164],
			143: [2, 164],
			144: [2, 164],
			148: [2, 164],
			152: [2, 164],
			156: [2, 164],
			160: [2, 164],
			164: [2, 164],
			168: [2, 164],
			174: [2, 164],
			187: [2, 164],
			188: [2, 164],
			189: [2, 164],
			190: [2, 164],
			191: [2, 164]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 326,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			3: 327,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 328,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [1, 330],
			25: [1, 242],
			34: [1, 329]
		}, {
			61: 331,
			62: 332,
			63: [1, 333],
			64: [1, 334]
		}, {
			19: [2, 80],
			21: [2, 80],
			22: [2, 80],
			28: [2, 80],
			34: [2, 80],
			36: [2, 80],
			37: [2, 80],
			40: [2, 80],
			41: [2, 80],
			42: [2, 80],
			43: [2, 80],
			47: [2, 80],
			48: [2, 80],
			49: [2, 80],
			50: [2, 80],
			51: [2, 80],
			56: [2, 80],
			58: [2, 80],
			59: [2, 80],
			60: [2, 80],
			65: [2, 80],
			67: [2, 80],
			73: [2, 80],
			78: [2, 80],
			81: [2, 80],
			94: [2, 80],
			105: [2, 80],
			106: [2, 80],
			111: [2, 80],
			112: [2, 80],
			113: [2, 80],
			114: [2, 80],
			115: [2, 80],
			116: [2, 80],
			117: [2, 80],
			118: [2, 80],
			119: [2, 80],
			122: [2, 80],
			174: [2, 80],
			187: [2, 80],
			188: [2, 80],
			189: [2, 80],
			190: [2, 80],
			191: [2, 80]
		}, {
			19: [2, 81],
			21: [2, 81],
			22: [2, 81],
			28: [2, 81],
			34: [2, 81],
			36: [2, 81],
			37: [2, 81],
			40: [2, 81],
			41: [2, 81],
			42: [2, 81],
			43: [2, 81],
			47: [2, 81],
			48: [2, 81],
			49: [2, 81],
			50: [2, 81],
			51: [2, 81],
			56: [2, 81],
			58: [2, 81],
			59: [2, 81],
			60: [2, 81],
			65: [2, 81],
			67: [2, 81],
			73: [2, 81],
			78: [2, 81],
			81: [2, 81],
			94: [2, 81],
			105: [2, 81],
			106: [2, 81],
			111: [2, 81],
			112: [2, 81],
			113: [2, 81],
			114: [2, 81],
			115: [2, 81],
			116: [2, 81],
			117: [2, 81],
			118: [2, 81],
			119: [2, 81],
			122: [2, 81],
			174: [2, 81],
			187: [2, 81],
			188: [2, 81],
			189: [2, 81],
			190: [2, 81],
			191: [2, 81]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 335,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 336,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 161],
			25: [2, 161],
			34: [2, 161],
			46: [2, 161],
			116: [2, 161],
			117: [2, 161],
			121: [2, 161],
			122: [2, 161],
			123: [2, 161],
			128: [2, 161],
			129: [2, 161],
			130: [2, 161],
			133: [2, 161],
			134: [2, 161],
			135: [2, 161],
			136: [2, 161],
			137: [2, 161],
			141: [2, 161],
			142: [2, 161],
			143: [2, 161],
			144: [2, 161],
			148: [2, 161],
			152: [2, 161],
			156: [2, 161],
			160: [2, 161],
			164: [2, 161],
			168: [2, 161]
		}, {
			2: [2, 162],
			25: [2, 162],
			34: [2, 162],
			46: [2, 162],
			116: [2, 162],
			117: [2, 162],
			121: [2, 162],
			122: [2, 162],
			123: [2, 162],
			128: [2, 162],
			129: [2, 162],
			130: [2, 162],
			133: [2, 162],
			134: [2, 162],
			135: [2, 162],
			136: [2, 162],
			137: [2, 162],
			141: [2, 162],
			142: [2, 162],
			143: [2, 162],
			144: [2, 162],
			148: [2, 162],
			152: [2, 162],
			156: [2, 162],
			160: [2, 162],
			164: [2, 162],
			168: [2, 162]
		}, {
			19: [2, 280],
			28: [2, 280],
			37: [2, 280],
			67: [2, 280],
			78: [2, 280],
			81: [2, 280],
			94: [2, 280],
			105: [2, 280],
			106: [2, 280],
			111: [2, 280],
			112: [2, 280],
			113: [2, 280],
			114: [2, 280],
			115: [2, 280],
			116: [2, 280],
			117: [2, 280],
			118: [2, 280],
			119: [2, 280],
			122: [2, 280],
			174: [2, 280],
			187: [2, 280],
			188: [2, 280],
			189: [2, 280],
			190: [2, 280],
			191: [2, 280]
		}, {
			19: [2, 281],
			28: [2, 281],
			37: [2, 281],
			67: [2, 281],
			78: [2, 281],
			81: [2, 281],
			94: [2, 281],
			105: [2, 281],
			106: [2, 281],
			111: [2, 281],
			112: [2, 281],
			113: [2, 281],
			114: [2, 281],
			115: [2, 281],
			116: [2, 281],
			117: [2, 281],
			118: [2, 281],
			119: [2, 281],
			122: [2, 281],
			174: [2, 281],
			187: [2, 281],
			188: [2, 281],
			189: [2, 281],
			190: [2, 281],
			191: [2, 281]
		}, {
			19: [2, 282],
			28: [2, 282],
			37: [2, 282],
			67: [2, 282],
			78: [2, 282],
			81: [2, 282],
			94: [2, 282],
			105: [2, 282],
			106: [2, 282],
			111: [2, 282],
			112: [2, 282],
			113: [2, 282],
			114: [2, 282],
			115: [2, 282],
			116: [2, 282],
			117: [2, 282],
			118: [2, 282],
			119: [2, 282],
			122: [2, 282],
			174: [2, 282],
			187: [2, 282],
			188: [2, 282],
			189: [2, 282],
			190: [2, 282],
			191: [2, 282]
		}, {
			19: [2, 283],
			28: [2, 283],
			37: [2, 283],
			67: [2, 283],
			78: [2, 283],
			81: [2, 283],
			94: [2, 283],
			105: [2, 283],
			106: [2, 283],
			111: [2, 283],
			112: [2, 283],
			113: [2, 283],
			114: [2, 283],
			115: [2, 283],
			116: [2, 283],
			117: [2, 283],
			118: [2, 283],
			119: [2, 283],
			122: [2, 283],
			174: [2, 283],
			187: [2, 283],
			188: [2, 283],
			189: [2, 283],
			190: [2, 283],
			191: [2, 283]
		}, {
			19: [2, 284],
			28: [2, 284],
			37: [2, 284],
			67: [2, 284],
			78: [2, 284],
			81: [2, 284],
			94: [2, 284],
			105: [2, 284],
			106: [2, 284],
			111: [2, 284],
			112: [2, 284],
			113: [2, 284],
			114: [2, 284],
			115: [2, 284],
			116: [2, 284],
			117: [2, 284],
			118: [2, 284],
			119: [2, 284],
			122: [2, 284],
			174: [2, 284],
			187: [2, 284],
			188: [2, 284],
			189: [2, 284],
			190: [2, 284],
			191: [2, 284]
		}, {
			19: [2, 285],
			28: [2, 285],
			37: [2, 285],
			67: [2, 285],
			78: [2, 285],
			81: [2, 285],
			94: [2, 285],
			105: [2, 285],
			106: [2, 285],
			111: [2, 285],
			112: [2, 285],
			113: [2, 285],
			114: [2, 285],
			115: [2, 285],
			116: [2, 285],
			117: [2, 285],
			118: [2, 285],
			119: [2, 285],
			122: [2, 285],
			174: [2, 285],
			187: [2, 285],
			188: [2, 285],
			189: [2, 285],
			190: [2, 285],
			191: [2, 285]
		}, {
			19: [2, 286],
			28: [2, 286],
			37: [2, 286],
			67: [2, 286],
			78: [2, 286],
			81: [2, 286],
			94: [2, 286],
			105: [2, 286],
			106: [2, 286],
			111: [2, 286],
			112: [2, 286],
			113: [2, 286],
			114: [2, 286],
			115: [2, 286],
			116: [2, 286],
			117: [2, 286],
			118: [2, 286],
			119: [2, 286],
			122: [2, 286],
			174: [2, 286],
			187: [2, 286],
			188: [2, 286],
			189: [2, 286],
			190: [2, 286],
			191: [2, 286]
		}, {
			19: [2, 287],
			28: [2, 287],
			37: [2, 287],
			67: [2, 287],
			78: [2, 287],
			81: [2, 287],
			94: [2, 287],
			105: [2, 287],
			106: [2, 287],
			111: [2, 287],
			112: [2, 287],
			113: [2, 287],
			114: [2, 287],
			115: [2, 287],
			116: [2, 287],
			117: [2, 287],
			118: [2, 287],
			119: [2, 287],
			122: [2, 287],
			174: [2, 287],
			187: [2, 287],
			188: [2, 287],
			189: [2, 287],
			190: [2, 287],
			191: [2, 287]
		}, {
			19: [2, 288],
			28: [2, 288],
			37: [2, 288],
			67: [2, 288],
			78: [2, 288],
			81: [2, 288],
			94: [2, 288],
			105: [2, 288],
			106: [2, 288],
			111: [2, 288],
			112: [2, 288],
			113: [2, 288],
			114: [2, 288],
			115: [2, 288],
			116: [2, 288],
			117: [2, 288],
			118: [2, 288],
			119: [2, 288],
			122: [2, 288],
			174: [2, 288],
			187: [2, 288],
			188: [2, 288],
			189: [2, 288],
			190: [2, 288],
			191: [2, 288]
		}, {
			19: [2, 289],
			28: [2, 289],
			37: [2, 289],
			67: [2, 289],
			78: [2, 289],
			81: [2, 289],
			94: [2, 289],
			105: [2, 289],
			106: [2, 289],
			111: [2, 289],
			112: [2, 289],
			113: [2, 289],
			114: [2, 289],
			115: [2, 289],
			116: [2, 289],
			117: [2, 289],
			118: [2, 289],
			119: [2, 289],
			122: [2, 289],
			174: [2, 289],
			187: [2, 289],
			188: [2, 289],
			189: [2, 289],
			190: [2, 289],
			191: [2, 289]
		}, {
			19: [2, 290],
			28: [2, 290],
			37: [2, 290],
			67: [2, 290],
			78: [2, 290],
			81: [2, 290],
			94: [2, 290],
			105: [2, 290],
			106: [2, 290],
			111: [2, 290],
			112: [2, 290],
			113: [2, 290],
			114: [2, 290],
			115: [2, 290],
			116: [2, 290],
			117: [2, 290],
			118: [2, 290],
			119: [2, 290],
			122: [2, 290],
			174: [2, 290],
			187: [2, 290],
			188: [2, 290],
			189: [2, 290],
			190: [2, 290],
			191: [2, 290]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 337,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 338,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 144],
			25: [2, 144],
			31: [2, 144],
			34: [2, 144],
			37: [2, 144],
			46: [2, 144],
			81: [2, 144],
			93: [2, 144],
			105: [2, 144],
			106: [2, 144],
			116: [2, 144],
			117: [2, 144],
			121: [2, 144],
			122: [2, 144],
			123: [2, 144],
			128: [2, 144],
			129: [2, 144],
			130: [2, 144],
			133: [2, 144],
			134: [2, 144],
			135: [2, 144],
			136: [2, 144],
			137: [2, 144],
			141: [2, 144],
			142: [2, 144],
			143: [2, 144],
			144: [2, 144],
			148: [2, 144],
			152: [2, 144],
			156: [2, 144],
			160: [2, 144],
			164: [2, 144],
			168: [2, 144],
			173: [2, 144],
			174: [2, 144],
			175: [2, 144],
			176: [2, 144],
			177: [2, 144],
			178: [2, 144],
			179: [2, 144],
			180: [2, 144],
			181: [2, 144],
			182: [2, 144],
			183: [2, 144]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 339,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			22: [1, 294],
			28: [1, 341],
			36: [1, 284],
			40: [1, 280],
			41: [1, 279],
			42: [1, 296],
			43: [1, 282],
			46: [1, 285],
			47: [1, 275],
			48: [1, 272],
			49: [1, 288],
			50: [1, 297],
			51: [1, 289],
			56: [1, 273],
			58: [1, 277],
			59: [1, 291],
			60: [1, 292],
			63: [1, 274],
			64: [1, 281],
			65: [1, 276],
			67: [1, 283],
			78: [1, 290],
			89: 340,
			94: [1, 287],
			101: 271,
			111: [1, 278],
			112: [1, 295],
			113: [1, 293],
			137: [1, 286],
			187: [1, 300],
			188: [1, 298],
			189: [1, 299],
			194: [1, 301],
			195: [1, 302],
			196: [1, 303],
			197: [1, 304],
			198: [1, 305],
			199: [1, 306],
			200: [1, 307]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 344,
			37: [1, 55],
			39: [1, 342],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			102: 343,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 345,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 143],
			25: [2, 143],
			31: [2, 143],
			34: [2, 143],
			37: [2, 143],
			46: [2, 143],
			81: [2, 143],
			93: [2, 143],
			105: [2, 143],
			106: [2, 143],
			116: [2, 143],
			117: [2, 143],
			121: [2, 143],
			122: [2, 143],
			123: [2, 143],
			128: [2, 143],
			129: [2, 143],
			130: [2, 143],
			133: [2, 143],
			134: [2, 143],
			135: [2, 143],
			136: [2, 143],
			137: [2, 143],
			141: [2, 143],
			142: [2, 143],
			143: [2, 143],
			144: [2, 143],
			148: [2, 143],
			152: [2, 143],
			156: [2, 143],
			160: [2, 143],
			164: [2, 143],
			168: [2, 143],
			173: [2, 143],
			174: [2, 143],
			175: [2, 143],
			176: [2, 143],
			177: [2, 143],
			178: [2, 143],
			179: [2, 143],
			180: [2, 143],
			181: [2, 143],
			182: [2, 143],
			183: [2, 143]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 346,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			22: [1, 294],
			28: [1, 341],
			36: [1, 284],
			40: [1, 280],
			41: [1, 279],
			42: [1, 296],
			43: [1, 282],
			46: [1, 285],
			47: [1, 275],
			48: [1, 272],
			49: [1, 288],
			50: [1, 297],
			51: [1, 289],
			56: [1, 273],
			58: [1, 277],
			59: [1, 291],
			60: [1, 292],
			63: [1, 274],
			64: [1, 281],
			65: [1, 276],
			67: [1, 283],
			78: [1, 290],
			89: 347,
			94: [1, 287],
			101: 271,
			111: [1, 278],
			112: [1, 295],
			113: [1, 293],
			137: [1, 286],
			187: [1, 300],
			188: [1, 298],
			189: [1, 299],
			194: [1, 301],
			195: [1, 302],
			196: [1, 303],
			197: [1, 304],
			198: [1, 305],
			199: [1, 306],
			200: [1, 307]
		}, {
			2: [2, 138],
			25: [2, 138],
			31: [2, 138],
			34: [2, 138],
			46: [2, 138],
			105: [2, 138],
			106: [2, 138],
			116: [2, 138],
			117: [2, 138],
			121: [2, 138],
			122: [2, 138],
			123: [2, 138],
			128: [2, 138],
			129: [2, 138],
			130: [2, 138],
			133: [2, 138],
			134: [2, 138],
			135: [2, 138],
			136: [2, 138],
			137: [2, 138],
			141: [2, 138],
			142: [2, 138],
			143: [2, 138],
			144: [2, 138],
			148: [2, 138],
			152: [2, 138],
			156: [2, 138],
			160: [2, 138],
			164: [2, 138],
			168: [2, 138],
			173: [2, 138],
			174: [2, 138],
			175: [2, 138],
			176: [2, 138],
			177: [2, 138],
			178: [2, 138],
			179: [2, 138],
			180: [2, 138],
			181: [2, 138],
			182: [2, 138],
			183: [2, 138]
		}, {
			2: [2, 135],
			25: [2, 135],
			31: [2, 135],
			34: [2, 135],
			37: [1, 165],
			46: [2, 135],
			81: [1, 254],
			93: [1, 255],
			95: 348,
			105: [2, 135],
			106: [2, 135],
			116: [2, 135],
			117: [2, 135],
			121: [2, 135],
			122: [2, 135],
			123: [2, 135],
			128: [2, 135],
			129: [2, 135],
			130: [2, 135],
			133: [2, 135],
			134: [2, 135],
			135: [2, 135],
			136: [2, 135],
			137: [2, 135],
			141: [2, 135],
			142: [2, 135],
			143: [2, 135],
			144: [2, 135],
			148: [2, 135],
			152: [2, 135],
			156: [2, 135],
			160: [2, 135],
			164: [2, 135],
			168: [2, 135],
			173: [2, 135],
			174: [2, 135],
			175: [2, 135],
			176: [2, 135],
			177: [2, 135],
			178: [2, 135],
			179: [2, 135],
			180: [2, 135],
			181: [2, 135],
			182: [2, 135],
			183: [2, 135]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 349,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 350,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			39: [1, 351]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 352,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 103],
			19: [2, 103],
			21: [2, 103],
			22: [2, 103],
			25: [2, 103],
			28: [2, 103],
			31: [2, 103],
			34: [2, 103],
			36: [2, 103],
			37: [2, 103],
			39: [2, 103],
			40: [2, 103],
			41: [2, 103],
			42: [2, 103],
			43: [2, 103],
			46: [2, 103],
			47: [2, 103],
			48: [2, 103],
			49: [2, 103],
			50: [2, 103],
			51: [2, 103],
			56: [2, 103],
			57: [2, 103],
			58: [2, 103],
			59: [2, 103],
			60: [2, 103],
			65: [2, 103],
			67: [2, 103],
			73: [2, 103],
			78: [2, 103],
			81: [2, 103],
			82: [2, 103],
			93: [2, 103],
			94: [2, 103],
			105: [2, 103],
			106: [2, 103],
			111: [2, 103],
			112: [2, 103],
			113: [2, 103],
			114: [2, 103],
			115: [2, 103],
			116: [2, 103],
			117: [2, 103],
			118: [2, 103],
			119: [2, 103],
			121: [2, 103],
			122: [2, 103],
			123: [2, 103],
			128: [2, 103],
			129: [2, 103],
			130: [2, 103],
			133: [2, 103],
			134: [2, 103],
			135: [2, 103],
			136: [2, 103],
			137: [2, 103],
			141: [2, 103],
			142: [2, 103],
			143: [2, 103],
			144: [2, 103],
			148: [2, 103],
			152: [2, 103],
			156: [2, 103],
			160: [2, 103],
			164: [2, 103],
			168: [2, 103],
			173: [2, 103],
			174: [2, 103],
			175: [2, 103],
			176: [2, 103],
			177: [2, 103],
			178: [2, 103],
			179: [2, 103],
			180: [2, 103],
			181: [2, 103],
			182: [2, 103],
			183: [2, 103],
			187: [2, 103],
			188: [2, 103],
			189: [2, 103],
			190: [2, 103],
			191: [2, 103]
		}, {
			19: [1, 129],
			25: [1, 354],
			28: [1, 128],
			32: 355,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			82: [1, 353],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 357],
			82: [1, 356]
		}, {
			19: [2, 112],
			25: [2, 112],
			28: [2, 112],
			37: [2, 112],
			67: [2, 112],
			78: [2, 112],
			81: [2, 112],
			82: [2, 112],
			94: [2, 112],
			105: [2, 112],
			106: [2, 112],
			111: [2, 112],
			112: [2, 112],
			113: [2, 112],
			114: [2, 112],
			115: [2, 112],
			116: [2, 112],
			117: [2, 112],
			118: [2, 112],
			119: [2, 112],
			122: [2, 112],
			174: [2, 112],
			187: [2, 112],
			188: [2, 112],
			189: [2, 112],
			190: [2, 112],
			191: [2, 112]
		}, {
			25: [2, 108],
			82: [2, 108]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 358,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 359,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 360,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 361,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 307],
			19: [2, 307],
			21: [2, 307],
			22: [2, 307],
			25: [2, 307],
			28: [2, 307],
			31: [2, 307],
			34: [2, 307],
			36: [2, 307],
			37: [2, 307],
			39: [2, 307],
			40: [2, 307],
			41: [2, 307],
			42: [2, 307],
			43: [2, 307],
			46: [2, 307],
			47: [2, 307],
			48: [2, 307],
			49: [2, 307],
			50: [2, 307],
			51: [2, 307],
			56: [2, 307],
			57: [2, 307],
			58: [2, 307],
			59: [2, 307],
			60: [2, 307],
			65: [2, 307],
			67: [2, 307],
			73: [2, 307],
			78: [2, 307],
			81: [2, 307],
			82: [2, 307],
			93: [2, 307],
			94: [2, 307],
			105: [2, 307],
			106: [2, 307],
			111: [2, 307],
			112: [2, 307],
			113: [2, 307],
			114: [2, 307],
			115: [2, 307],
			116: [2, 307],
			117: [2, 307],
			118: [2, 307],
			119: [2, 307],
			121: [2, 307],
			122: [2, 307],
			123: [2, 307],
			128: [2, 307],
			129: [2, 307],
			130: [2, 307],
			133: [2, 307],
			134: [2, 307],
			135: [2, 307],
			136: [2, 307],
			137: [2, 307],
			141: [2, 307],
			142: [2, 307],
			143: [2, 307],
			144: [2, 307],
			148: [2, 307],
			152: [2, 307],
			156: [2, 307],
			160: [2, 307],
			164: [2, 307],
			168: [2, 307],
			173: [2, 307],
			174: [2, 307],
			175: [2, 307],
			176: [2, 307],
			177: [2, 307],
			178: [2, 307],
			179: [2, 307],
			180: [2, 307],
			181: [2, 307],
			182: [2, 307],
			183: [2, 307],
			187: [2, 307],
			188: [2, 307],
			189: [2, 307],
			190: [2, 307],
			191: [2, 307]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 362,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 363,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 364,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 365,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 366,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 367,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 368,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 369,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 370,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 371,
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 372,
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 373,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 374,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 375,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 167],
			19: [2, 167],
			21: [2, 167],
			22: [2, 167],
			25: [2, 167],
			28: [2, 167],
			34: [2, 167],
			36: [2, 167],
			37: [2, 167],
			39: [2, 167],
			40: [2, 167],
			41: [2, 167],
			42: [2, 167],
			43: [2, 167],
			46: [2, 167],
			47: [2, 167],
			48: [2, 167],
			49: [2, 167],
			50: [2, 167],
			51: [2, 167],
			56: [2, 167],
			57: [2, 167],
			58: [2, 167],
			59: [2, 167],
			60: [2, 167],
			65: [2, 167],
			67: [2, 167],
			73: [2, 167],
			78: [2, 167],
			81: [2, 167],
			82: [2, 167],
			94: [2, 167],
			105: [2, 167],
			106: [2, 167],
			111: [2, 167],
			112: [2, 167],
			113: [2, 167],
			114: [2, 167],
			115: [2, 167],
			116: [2, 167],
			117: [2, 167],
			118: [2, 167],
			119: [2, 167],
			121: [2, 167],
			122: [2, 167],
			123: [2, 167],
			128: [2, 167],
			129: [2, 167],
			130: [2, 167],
			133: [2, 167],
			134: [2, 167],
			135: [2, 167],
			136: [2, 167],
			137: [2, 167],
			141: [2, 167],
			142: [2, 167],
			143: [2, 167],
			144: [2, 167],
			148: [2, 167],
			152: [2, 167],
			156: [2, 167],
			160: [2, 167],
			164: [2, 167],
			168: [2, 167],
			174: [2, 167],
			187: [2, 167],
			188: [2, 167],
			189: [2, 167],
			190: [2, 167],
			191: [2, 167]
		}, {
			2: [2, 157],
			19: [2, 157],
			21: [2, 157],
			22: [2, 157],
			25: [2, 157],
			28: [2, 157],
			34: [2, 157],
			36: [2, 157],
			37: [2, 157],
			39: [2, 157],
			40: [2, 157],
			41: [2, 157],
			42: [2, 157],
			43: [2, 157],
			46: [2, 157],
			47: [2, 157],
			48: [2, 157],
			49: [2, 157],
			50: [2, 157],
			51: [2, 157],
			56: [2, 157],
			57: [2, 157],
			58: [2, 157],
			59: [2, 157],
			60: [2, 157],
			65: [2, 157],
			67: [2, 157],
			73: [2, 157],
			78: [2, 157],
			81: [2, 157],
			82: [2, 157],
			94: [2, 157],
			105: [1, 245],
			106: [1, 246],
			111: [2, 157],
			112: [2, 157],
			113: [2, 157],
			114: [2, 157],
			115: [2, 157],
			116: [2, 157],
			117: [2, 157],
			118: [2, 157],
			119: [2, 157],
			121: [2, 157],
			122: [2, 157],
			123: [2, 157],
			128: [2, 157],
			129: [2, 157],
			130: [2, 157],
			133: [2, 157],
			134: [2, 157],
			135: [2, 157],
			136: [2, 157],
			137: [2, 157],
			141: [2, 157],
			142: [2, 157],
			143: [2, 157],
			144: [2, 157],
			148: [2, 157],
			152: [2, 157],
			156: [2, 157],
			160: [2, 157],
			164: [2, 157],
			168: [2, 157],
			174: [2, 157],
			187: [2, 157],
			188: [2, 157],
			189: [2, 157],
			190: [2, 157],
			191: [2, 157]
		}, {
			2: [2, 168],
			19: [2, 168],
			21: [2, 168],
			22: [2, 168],
			25: [2, 168],
			28: [2, 168],
			34: [2, 168],
			36: [2, 168],
			37: [2, 168],
			39: [2, 168],
			40: [2, 168],
			41: [2, 168],
			42: [2, 168],
			43: [2, 168],
			46: [2, 168],
			47: [2, 168],
			48: [2, 168],
			49: [2, 168],
			50: [2, 168],
			51: [2, 168],
			56: [2, 168],
			57: [2, 168],
			58: [2, 168],
			59: [2, 168],
			60: [2, 168],
			65: [2, 168],
			67: [2, 168],
			73: [2, 168],
			78: [2, 168],
			81: [2, 168],
			82: [2, 168],
			94: [2, 168],
			105: [2, 168],
			106: [2, 168],
			111: [2, 168],
			112: [2, 168],
			113: [2, 168],
			114: [2, 168],
			115: [2, 168],
			116: [2, 168],
			117: [2, 168],
			118: [2, 168],
			119: [2, 168],
			121: [2, 168],
			122: [2, 168],
			123: [2, 168],
			128: [2, 168],
			129: [2, 168],
			130: [2, 168],
			133: [2, 168],
			134: [2, 168],
			135: [2, 168],
			136: [2, 168],
			137: [2, 168],
			141: [2, 168],
			142: [2, 168],
			143: [2, 168],
			144: [2, 168],
			148: [2, 168],
			152: [2, 168],
			156: [2, 168],
			160: [2, 168],
			164: [2, 168],
			168: [2, 168],
			174: [2, 168],
			187: [2, 168],
			188: [2, 168],
			189: [2, 168],
			190: [2, 168],
			191: [2, 168]
		}, {
			2: [2, 169],
			19: [2, 169],
			21: [2, 169],
			22: [2, 169],
			25: [2, 169],
			28: [2, 169],
			34: [2, 169],
			36: [2, 169],
			37: [2, 169],
			39: [2, 169],
			40: [2, 169],
			41: [2, 169],
			42: [2, 169],
			43: [2, 169],
			46: [2, 169],
			47: [2, 169],
			48: [2, 169],
			49: [2, 169],
			50: [2, 169],
			51: [2, 169],
			56: [2, 169],
			57: [2, 169],
			58: [2, 169],
			59: [2, 169],
			60: [2, 169],
			65: [2, 169],
			67: [2, 169],
			73: [2, 169],
			78: [2, 169],
			81: [2, 169],
			82: [2, 169],
			94: [2, 169],
			105: [2, 169],
			106: [2, 169],
			111: [2, 169],
			112: [2, 169],
			113: [2, 169],
			114: [2, 169],
			115: [2, 169],
			116: [2, 169],
			117: [2, 169],
			118: [2, 169],
			119: [2, 169],
			121: [2, 169],
			122: [2, 169],
			123: [2, 169],
			128: [2, 169],
			129: [2, 169],
			130: [2, 169],
			133: [2, 169],
			134: [2, 169],
			135: [2, 169],
			136: [2, 169],
			137: [2, 169],
			141: [2, 169],
			142: [2, 169],
			143: [2, 169],
			144: [2, 169],
			148: [2, 169],
			152: [2, 169],
			156: [2, 169],
			160: [2, 169],
			164: [2, 169],
			168: [2, 169],
			174: [2, 169],
			187: [2, 169],
			188: [2, 169],
			189: [2, 169],
			190: [2, 169],
			191: [2, 169]
		}, {
			2: [2, 170],
			19: [2, 170],
			21: [2, 170],
			22: [2, 170],
			25: [2, 170],
			28: [2, 170],
			34: [2, 170],
			36: [2, 170],
			37: [2, 170],
			39: [2, 170],
			40: [2, 170],
			41: [2, 170],
			42: [2, 170],
			43: [2, 170],
			46: [2, 170],
			47: [2, 170],
			48: [2, 170],
			49: [2, 170],
			50: [2, 170],
			51: [2, 170],
			56: [2, 170],
			57: [2, 170],
			58: [2, 170],
			59: [2, 170],
			60: [2, 170],
			65: [2, 170],
			67: [2, 170],
			73: [2, 170],
			78: [2, 170],
			81: [2, 170],
			82: [2, 170],
			94: [2, 170],
			105: [2, 170],
			106: [2, 170],
			111: [2, 170],
			112: [2, 170],
			113: [2, 170],
			114: [2, 170],
			115: [2, 170],
			116: [2, 170],
			117: [2, 170],
			118: [2, 170],
			119: [2, 170],
			121: [2, 170],
			122: [2, 170],
			123: [2, 170],
			128: [2, 170],
			129: [2, 170],
			130: [2, 170],
			133: [2, 170],
			134: [2, 170],
			135: [2, 170],
			136: [2, 170],
			137: [2, 170],
			141: [2, 170],
			142: [2, 170],
			143: [2, 170],
			144: [2, 170],
			148: [2, 170],
			152: [2, 170],
			156: [2, 170],
			160: [2, 170],
			164: [2, 170],
			168: [2, 170],
			174: [2, 170],
			187: [2, 170],
			188: [2, 170],
			189: [2, 170],
			190: [2, 170],
			191: [2, 170]
		}, {
			2: [2, 171],
			19: [2, 171],
			21: [2, 171],
			22: [2, 171],
			25: [2, 171],
			28: [2, 171],
			34: [2, 171],
			36: [2, 171],
			37: [2, 171],
			39: [2, 171],
			40: [2, 171],
			41: [2, 171],
			42: [2, 171],
			43: [2, 171],
			46: [2, 171],
			47: [2, 171],
			48: [2, 171],
			49: [2, 171],
			50: [2, 171],
			51: [2, 171],
			56: [2, 171],
			57: [2, 171],
			58: [2, 171],
			59: [2, 171],
			60: [2, 171],
			65: [2, 171],
			67: [2, 171],
			73: [2, 171],
			78: [2, 171],
			81: [2, 171],
			82: [2, 171],
			94: [2, 171],
			105: [2, 171],
			106: [2, 171],
			111: [2, 171],
			112: [2, 171],
			113: [2, 171],
			114: [2, 171],
			115: [2, 171],
			116: [2, 171],
			117: [2, 171],
			118: [2, 171],
			119: [2, 171],
			121: [2, 171],
			122: [2, 171],
			123: [2, 171],
			128: [2, 171],
			129: [2, 171],
			130: [2, 171],
			133: [2, 171],
			134: [2, 171],
			135: [2, 171],
			136: [2, 171],
			137: [2, 171],
			141: [2, 171],
			142: [2, 171],
			143: [2, 171],
			144: [2, 171],
			148: [2, 171],
			152: [2, 171],
			156: [2, 171],
			160: [2, 171],
			164: [2, 171],
			168: [2, 171],
			174: [2, 171],
			187: [2, 171],
			188: [2, 171],
			189: [2, 171],
			190: [2, 171],
			191: [2, 171]
		}, {
			2: [2, 172],
			19: [2, 172],
			21: [2, 172],
			22: [2, 172],
			25: [2, 172],
			28: [2, 172],
			34: [2, 172],
			36: [2, 172],
			37: [2, 172],
			39: [2, 172],
			40: [2, 172],
			41: [2, 172],
			42: [2, 172],
			43: [2, 172],
			46: [2, 172],
			47: [2, 172],
			48: [2, 172],
			49: [2, 172],
			50: [2, 172],
			51: [2, 172],
			56: [2, 172],
			57: [2, 172],
			58: [2, 172],
			59: [2, 172],
			60: [2, 172],
			65: [2, 172],
			67: [2, 172],
			73: [2, 172],
			78: [2, 172],
			81: [2, 172],
			82: [2, 172],
			94: [2, 172],
			105: [2, 172],
			106: [2, 172],
			111: [2, 172],
			112: [2, 172],
			113: [2, 172],
			114: [2, 172],
			115: [2, 172],
			116: [2, 172],
			117: [2, 172],
			118: [2, 172],
			119: [2, 172],
			121: [2, 172],
			122: [2, 172],
			123: [2, 172],
			128: [2, 172],
			129: [2, 172],
			130: [2, 172],
			133: [2, 172],
			134: [2, 172],
			135: [2, 172],
			136: [2, 172],
			137: [2, 172],
			141: [2, 172],
			142: [2, 172],
			143: [2, 172],
			144: [2, 172],
			148: [2, 172],
			152: [2, 172],
			156: [2, 172],
			160: [2, 172],
			164: [2, 172],
			168: [2, 172],
			174: [2, 172],
			187: [2, 172],
			188: [2, 172],
			189: [2, 172],
			190: [2, 172],
			191: [2, 172]
		}, {
			2: [2, 173],
			19: [2, 173],
			21: [2, 173],
			22: [2, 173],
			25: [2, 173],
			28: [2, 173],
			34: [2, 173],
			36: [2, 173],
			37: [2, 173],
			39: [2, 173],
			40: [2, 173],
			41: [2, 173],
			42: [2, 173],
			43: [2, 173],
			46: [2, 173],
			47: [2, 173],
			48: [2, 173],
			49: [2, 173],
			50: [2, 173],
			51: [2, 173],
			56: [2, 173],
			57: [2, 173],
			58: [2, 173],
			59: [2, 173],
			60: [2, 173],
			65: [2, 173],
			67: [2, 173],
			73: [2, 173],
			78: [2, 173],
			81: [2, 173],
			82: [2, 173],
			94: [2, 173],
			105: [2, 173],
			106: [2, 173],
			111: [2, 173],
			112: [2, 173],
			113: [2, 173],
			114: [2, 173],
			115: [2, 173],
			116: [2, 173],
			117: [2, 173],
			118: [2, 173],
			119: [2, 173],
			121: [2, 173],
			122: [2, 173],
			123: [2, 173],
			128: [2, 173],
			129: [2, 173],
			130: [2, 173],
			133: [2, 173],
			134: [2, 173],
			135: [2, 173],
			136: [2, 173],
			137: [2, 173],
			141: [2, 173],
			142: [2, 173],
			143: [2, 173],
			144: [2, 173],
			148: [2, 173],
			152: [2, 173],
			156: [2, 173],
			160: [2, 173],
			164: [2, 173],
			168: [2, 173],
			174: [2, 173],
			187: [2, 173],
			188: [2, 173],
			189: [2, 173],
			190: [2, 173],
			191: [2, 173]
		}, {
			2: [2, 174],
			19: [2, 174],
			21: [2, 174],
			22: [2, 174],
			25: [2, 174],
			28: [2, 174],
			34: [2, 174],
			36: [2, 174],
			37: [2, 174],
			39: [2, 174],
			40: [2, 174],
			41: [2, 174],
			42: [2, 174],
			43: [2, 174],
			46: [2, 174],
			47: [2, 174],
			48: [2, 174],
			49: [2, 174],
			50: [2, 174],
			51: [2, 174],
			56: [2, 174],
			57: [2, 174],
			58: [2, 174],
			59: [2, 174],
			60: [2, 174],
			65: [2, 174],
			67: [2, 174],
			73: [2, 174],
			78: [2, 174],
			81: [2, 174],
			82: [2, 174],
			94: [2, 174],
			105: [2, 174],
			106: [2, 174],
			111: [2, 174],
			112: [2, 174],
			113: [2, 174],
			114: [2, 174],
			115: [2, 174],
			116: [2, 174],
			117: [2, 174],
			118: [2, 174],
			119: [2, 174],
			121: [2, 174],
			122: [2, 174],
			123: [2, 174],
			128: [2, 174],
			129: [2, 174],
			130: [2, 174],
			133: [2, 174],
			134: [2, 174],
			135: [2, 174],
			136: [2, 174],
			137: [2, 174],
			141: [2, 174],
			142: [2, 174],
			143: [2, 174],
			144: [2, 174],
			148: [2, 174],
			152: [2, 174],
			156: [2, 174],
			160: [2, 174],
			164: [2, 174],
			168: [2, 174],
			174: [2, 174],
			187: [2, 174],
			188: [2, 174],
			189: [2, 174],
			190: [2, 174],
			191: [2, 174]
		}, {
			2: [2, 175],
			19: [2, 175],
			21: [2, 175],
			22: [2, 175],
			25: [2, 175],
			28: [2, 175],
			34: [2, 175],
			36: [2, 175],
			37: [2, 175],
			39: [2, 175],
			40: [2, 175],
			41: [2, 175],
			42: [2, 175],
			43: [2, 175],
			46: [2, 175],
			47: [2, 175],
			48: [2, 175],
			49: [2, 175],
			50: [2, 175],
			51: [2, 175],
			56: [2, 175],
			57: [2, 175],
			58: [2, 175],
			59: [2, 175],
			60: [2, 175],
			65: [2, 175],
			67: [2, 175],
			73: [2, 175],
			78: [2, 175],
			81: [2, 175],
			82: [2, 175],
			94: [2, 175],
			105: [2, 175],
			106: [2, 175],
			111: [2, 175],
			112: [2, 175],
			113: [2, 175],
			114: [2, 175],
			115: [2, 175],
			116: [2, 175],
			117: [2, 175],
			118: [2, 175],
			119: [2, 175],
			121: [2, 175],
			122: [2, 175],
			123: [2, 175],
			128: [2, 175],
			129: [2, 175],
			130: [2, 175],
			133: [2, 175],
			134: [2, 175],
			135: [2, 175],
			136: [2, 175],
			137: [2, 175],
			141: [2, 175],
			142: [2, 175],
			143: [2, 175],
			144: [2, 175],
			148: [2, 175],
			152: [2, 175],
			156: [2, 175],
			160: [2, 175],
			164: [2, 175],
			168: [2, 175],
			174: [2, 175],
			187: [2, 175],
			188: [2, 175],
			189: [2, 175],
			190: [2, 175],
			191: [2, 175]
		}, {
			2: [2, 176],
			19: [2, 176],
			21: [2, 176],
			22: [2, 176],
			25: [2, 176],
			28: [2, 176],
			34: [2, 176],
			36: [2, 176],
			37: [2, 176],
			39: [2, 176],
			40: [2, 176],
			41: [2, 176],
			42: [2, 176],
			43: [2, 176],
			46: [2, 176],
			47: [2, 176],
			48: [2, 176],
			49: [2, 176],
			50: [2, 176],
			51: [2, 176],
			56: [2, 176],
			57: [2, 176],
			58: [2, 176],
			59: [2, 176],
			60: [2, 176],
			65: [2, 176],
			67: [2, 176],
			73: [2, 176],
			78: [2, 176],
			81: [2, 176],
			82: [2, 176],
			94: [2, 176],
			105: [2, 176],
			106: [2, 176],
			111: [2, 176],
			112: [2, 176],
			113: [2, 176],
			114: [2, 176],
			115: [2, 176],
			116: [2, 176],
			117: [2, 176],
			118: [2, 176],
			119: [2, 176],
			121: [2, 176],
			122: [2, 176],
			123: [2, 176],
			128: [2, 176],
			129: [2, 176],
			130: [2, 176],
			133: [2, 176],
			134: [2, 176],
			135: [2, 176],
			136: [2, 176],
			137: [2, 176],
			141: [2, 176],
			142: [2, 176],
			143: [2, 176],
			144: [2, 176],
			148: [2, 176],
			152: [2, 176],
			156: [2, 176],
			160: [2, 176],
			164: [2, 176],
			168: [2, 176],
			174: [2, 176],
			187: [2, 176],
			188: [2, 176],
			189: [2, 176],
			190: [2, 176],
			191: [2, 176]
		}, {
			2: [2, 177],
			19: [2, 177],
			21: [2, 177],
			22: [2, 177],
			25: [2, 177],
			28: [2, 177],
			34: [2, 177],
			36: [2, 177],
			37: [2, 177],
			39: [2, 177],
			40: [2, 177],
			41: [2, 177],
			42: [2, 177],
			43: [2, 177],
			46: [2, 177],
			47: [2, 177],
			48: [2, 177],
			49: [2, 177],
			50: [2, 177],
			51: [2, 177],
			56: [2, 177],
			57: [2, 177],
			58: [2, 177],
			59: [2, 177],
			60: [2, 177],
			65: [2, 177],
			67: [2, 177],
			73: [2, 177],
			78: [2, 177],
			81: [2, 177],
			82: [2, 177],
			94: [2, 177],
			105: [2, 177],
			106: [2, 177],
			111: [2, 177],
			112: [2, 177],
			113: [2, 177],
			114: [2, 177],
			115: [2, 177],
			116: [2, 177],
			117: [2, 177],
			118: [2, 177],
			119: [2, 177],
			121: [2, 177],
			122: [2, 177],
			123: [2, 177],
			128: [2, 177],
			129: [2, 177],
			130: [2, 177],
			133: [2, 177],
			134: [2, 177],
			135: [2, 177],
			136: [2, 177],
			137: [2, 177],
			141: [2, 177],
			142: [2, 177],
			143: [2, 177],
			144: [2, 177],
			148: [2, 177],
			152: [2, 177],
			156: [2, 177],
			160: [2, 177],
			164: [2, 177],
			168: [2, 177],
			174: [2, 177],
			187: [2, 177],
			188: [2, 177],
			189: [2, 177],
			190: [2, 177],
			191: [2, 177]
		}, {
			28: [1, 378],
			39: [1, 376],
			69: 377
		}, {
			19: [2, 16],
			21: [2, 16],
			22: [2, 16],
			28: [2, 16],
			34: [2, 16],
			36: [2, 16],
			37: [2, 16],
			40: [2, 16],
			41: [2, 16],
			42: [2, 16],
			43: [2, 16],
			47: [2, 16],
			48: [2, 16],
			49: [2, 16],
			50: [2, 16],
			51: [2, 16],
			56: [2, 16],
			58: [2, 16],
			59: [2, 16],
			60: [2, 16],
			63: [2, 16],
			64: [2, 16],
			65: [2, 16],
			67: [2, 16],
			73: [2, 16],
			78: [2, 16],
			81: [2, 16],
			94: [2, 16],
			105: [2, 16],
			106: [2, 16],
			111: [2, 16],
			112: [2, 16],
			113: [2, 16],
			114: [2, 16],
			115: [2, 16],
			116: [2, 16],
			117: [2, 16],
			118: [2, 16],
			119: [2, 16],
			122: [2, 16],
			174: [2, 16],
			187: [2, 16],
			188: [2, 16],
			189: [2, 16],
			190: [2, 16],
			191: [2, 16]
		}, {
			19: [2, 17],
			21: [2, 17],
			22: [2, 17],
			28: [2, 17],
			34: [2, 17],
			36: [2, 17],
			37: [2, 17],
			41: [2, 17],
			42: [2, 17],
			43: [2, 17],
			47: [2, 17],
			48: [2, 17],
			49: [2, 17],
			50: [2, 17],
			51: [2, 17],
			56: [2, 17],
			58: [2, 17],
			59: [2, 17],
			60: [2, 17],
			65: [2, 17],
			78: [2, 17],
			81: [2, 17],
			94: [2, 17],
			105: [2, 17],
			106: [2, 17],
			111: [2, 17],
			112: [2, 17],
			113: [2, 17],
			114: [2, 17],
			115: [2, 17],
			116: [2, 17],
			117: [2, 17],
			118: [2, 17],
			119: [2, 17],
			122: [2, 17],
			174: [2, 17],
			187: [2, 17],
			188: [2, 17],
			189: [2, 17],
			190: [2, 17],
			191: [2, 17]
		}, {
			24: 379,
			28: [1, 94]
		}, {
			19: [2, 25],
			21: [2, 25],
			22: [2, 25],
			25: [2, 25],
			28: [2, 25],
			34: [2, 25],
			36: [2, 25],
			37: [2, 25],
			40: [2, 25],
			41: [2, 25],
			42: [2, 25],
			43: [2, 25],
			47: [2, 25],
			48: [2, 25],
			49: [2, 25],
			50: [2, 25],
			51: [2, 25],
			56: [2, 25],
			58: [2, 25],
			59: [2, 25],
			60: [2, 25],
			65: [2, 25],
			67: [2, 25],
			73: [2, 25],
			78: [2, 25],
			81: [2, 25],
			94: [2, 25],
			105: [2, 25],
			106: [2, 25],
			111: [2, 25],
			112: [2, 25],
			113: [2, 25],
			114: [2, 25],
			115: [2, 25],
			116: [2, 25],
			117: [2, 25],
			118: [2, 25],
			119: [2, 25],
			122: [2, 25],
			174: [2, 25],
			187: [2, 25],
			188: [2, 25],
			189: [2, 25],
			190: [2, 25],
			191: [2, 25]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 380,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 296],
			25: [2, 296],
			34: [2, 296]
		}, {
			25: [1, 242],
			39: [1, 381]
		}, {
			37: [1, 382]
		}, {
			25: [1, 242],
			39: [1, 383]
		}, {
			25: [1, 385],
			34: [1, 384]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			34: [1, 387],
			37: [1, 55],
			38: 386,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			26: 388,
			27: 389,
			28: [1, 390]
		}, {
			25: [2, 157],
			31: [1, 392],
			34: [2, 157],
			46: [1, 391],
			105: [1, 245],
			106: [1, 246],
			116: [2, 157],
			117: [2, 157],
			121: [2, 157],
			122: [2, 157],
			123: [2, 157],
			128: [2, 157],
			129: [2, 157],
			130: [2, 157],
			133: [2, 157],
			134: [2, 157],
			135: [2, 157],
			136: [2, 157],
			137: [2, 157],
			141: [2, 157],
			142: [2, 157],
			143: [2, 157],
			144: [2, 157],
			148: [2, 157],
			152: [2, 157],
			156: [2, 157],
			160: [2, 157],
			164: [2, 157],
			168: [2, 157],
			171: 393,
			173: [1, 149],
			174: [1, 150],
			175: [1, 151],
			176: [1, 152],
			177: [1, 153],
			178: [1, 154],
			179: [1, 155],
			180: [1, 156],
			181: [1, 157],
			182: [1, 158],
			183: [1, 159]
		}, {
			25: [2, 293],
			34: [2, 293]
		}, {
			25: [2, 274],
			34: [2, 274],
			46: [2, 274]
		}, {
			25: [2, 267],
			34: [2, 267],
			46: [2, 267],
			164: [1, 395],
			168: [1, 394]
		}, {
			25: [2, 261],
			34: [2, 261],
			46: [2, 261],
			160: [1, 396],
			164: [2, 261],
			168: [2, 261]
		}, {
			25: [2, 255],
			34: [2, 255],
			46: [2, 255],
			156: [1, 397],
			160: [2, 255],
			164: [2, 255],
			168: [2, 255]
		}, {
			25: [2, 249],
			34: [2, 249],
			46: [2, 249],
			152: [1, 398],
			156: [2, 249],
			160: [2, 249],
			164: [2, 249],
			168: [2, 249]
		}, {
			25: [2, 243],
			34: [2, 243],
			46: [2, 243],
			148: [1, 399],
			152: [2, 243],
			156: [2, 243],
			160: [2, 243],
			164: [2, 243],
			168: [2, 243]
		}, {
			25: [2, 237],
			34: [2, 237],
			46: [2, 237],
			141: [1, 400],
			142: [1, 401],
			143: [1, 402],
			144: [1, 403],
			148: [2, 237],
			152: [2, 237],
			156: [2, 237],
			160: [2, 237],
			164: [2, 237],
			168: [2, 237]
		}, {
			25: [2, 225],
			34: [2, 225],
			46: [2, 225],
			133: [1, 404],
			134: [1, 405],
			135: [1, 406],
			136: [1, 407],
			137: [1, 408],
			141: [2, 225],
			142: [2, 225],
			143: [2, 225],
			144: [2, 225],
			148: [2, 225],
			152: [2, 225],
			156: [2, 225],
			160: [2, 225],
			164: [2, 225],
			168: [2, 225]
		}, {
			25: [2, 207],
			34: [2, 207],
			46: [2, 207],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 207],
			134: [2, 207],
			135: [2, 207],
			136: [2, 207],
			137: [2, 207],
			141: [2, 207],
			142: [2, 207],
			143: [2, 207],
			144: [2, 207],
			148: [2, 207],
			152: [2, 207],
			156: [2, 207],
			160: [2, 207],
			164: [2, 207],
			168: [2, 207]
		}, {
			19: [2, 54],
			21: [2, 54],
			22: [2, 54],
			28: [2, 54],
			34: [2, 54],
			36: [2, 54],
			37: [2, 54],
			40: [2, 54],
			41: [2, 54],
			42: [2, 54],
			43: [2, 54],
			47: [2, 54],
			48: [2, 54],
			49: [2, 54],
			50: [2, 54],
			51: [2, 54],
			56: [2, 54],
			58: [2, 54],
			59: [2, 54],
			60: [2, 54],
			65: [2, 54],
			67: [2, 54],
			73: [2, 54],
			78: [2, 54],
			81: [2, 54],
			94: [2, 54],
			105: [2, 54],
			106: [2, 54],
			111: [2, 54],
			112: [2, 54],
			113: [2, 54],
			114: [2, 54],
			115: [2, 54],
			116: [2, 54],
			117: [2, 54],
			118: [2, 54],
			119: [2, 54],
			122: [2, 54],
			174: [2, 54],
			187: [2, 54],
			188: [2, 54],
			189: [2, 54],
			190: [2, 54],
			191: [2, 54]
		}, {
			19: [2, 55],
			21: [2, 55],
			22: [2, 55],
			28: [2, 55],
			34: [2, 55],
			36: [2, 55],
			37: [2, 55],
			40: [2, 55],
			41: [2, 55],
			42: [2, 55],
			43: [2, 55],
			47: [2, 55],
			48: [2, 55],
			49: [2, 55],
			50: [2, 55],
			51: [2, 55],
			56: [2, 55],
			58: [2, 55],
			59: [2, 55],
			60: [2, 55],
			65: [2, 55],
			67: [2, 55],
			73: [2, 55],
			78: [2, 55],
			81: [2, 55],
			94: [2, 55],
			105: [2, 55],
			106: [2, 55],
			111: [2, 55],
			112: [2, 55],
			113: [2, 55],
			114: [2, 55],
			115: [2, 55],
			116: [2, 55],
			117: [2, 55],
			118: [2, 55],
			119: [2, 55],
			122: [2, 55],
			174: [2, 55],
			187: [2, 55],
			188: [2, 55],
			189: [2, 55],
			190: [2, 55],
			191: [2, 55]
		}, {
			19: [2, 58],
			21: [2, 58],
			22: [2, 58],
			28: [2, 58],
			34: [2, 58],
			36: [2, 58],
			37: [2, 58],
			40: [2, 58],
			41: [2, 58],
			42: [2, 58],
			43: [2, 58],
			47: [2, 58],
			48: [2, 58],
			49: [2, 58],
			50: [2, 58],
			51: [2, 58],
			56: [2, 58],
			58: [2, 58],
			59: [2, 58],
			60: [2, 58],
			65: [2, 58],
			67: [2, 58],
			73: [2, 58],
			78: [2, 58],
			81: [2, 58],
			94: [2, 58],
			105: [2, 58],
			106: [2, 58],
			111: [2, 58],
			112: [2, 58],
			113: [2, 58],
			114: [2, 58],
			115: [2, 58],
			116: [2, 58],
			117: [2, 58],
			118: [2, 58],
			119: [2, 58],
			122: [2, 58],
			174: [2, 58],
			187: [2, 58],
			188: [2, 58],
			189: [2, 58],
			190: [2, 58],
			191: [2, 58]
		}, {
			19: [2, 59],
			21: [2, 59],
			22: [2, 59],
			28: [2, 59],
			34: [2, 59],
			36: [2, 59],
			37: [2, 59],
			40: [2, 59],
			41: [2, 59],
			42: [2, 59],
			43: [2, 59],
			47: [2, 59],
			48: [2, 59],
			49: [2, 59],
			50: [2, 59],
			51: [2, 59],
			56: [2, 59],
			58: [2, 59],
			59: [2, 59],
			60: [2, 59],
			65: [2, 59],
			67: [2, 59],
			73: [2, 59],
			78: [2, 59],
			81: [2, 59],
			94: [2, 59],
			105: [2, 59],
			106: [2, 59],
			111: [2, 59],
			112: [2, 59],
			113: [2, 59],
			114: [2, 59],
			115: [2, 59],
			116: [2, 59],
			117: [2, 59],
			118: [2, 59],
			119: [2, 59],
			122: [2, 59],
			174: [2, 59],
			187: [2, 59],
			188: [2, 59],
			189: [2, 59],
			190: [2, 59],
			191: [2, 59]
		}, {
			19: [2, 62],
			21: [2, 62],
			22: [2, 62],
			28: [2, 62],
			34: [2, 62],
			36: [2, 62],
			37: [2, 62],
			40: [2, 62],
			41: [2, 62],
			42: [2, 62],
			43: [2, 62],
			47: [2, 62],
			48: [2, 62],
			49: [2, 62],
			50: [2, 62],
			51: [2, 62],
			56: [2, 62],
			58: [2, 62],
			59: [2, 62],
			60: [2, 62],
			65: [2, 62],
			67: [2, 62],
			73: [2, 62],
			78: [2, 62],
			81: [2, 62],
			94: [2, 62],
			105: [2, 62],
			106: [2, 62],
			111: [2, 62],
			112: [2, 62],
			113: [2, 62],
			114: [2, 62],
			115: [2, 62],
			116: [2, 62],
			117: [2, 62],
			118: [2, 62],
			119: [2, 62],
			122: [2, 62],
			174: [2, 62],
			187: [2, 62],
			188: [2, 62],
			189: [2, 62],
			190: [2, 62],
			191: [2, 62]
		}, {
			19: [2, 63],
			21: [2, 63],
			22: [2, 63],
			28: [2, 63],
			34: [2, 63],
			36: [2, 63],
			37: [2, 63],
			40: [2, 63],
			41: [2, 63],
			42: [2, 63],
			43: [2, 63],
			47: [2, 63],
			48: [2, 63],
			49: [2, 63],
			50: [2, 63],
			51: [2, 63],
			56: [2, 63],
			58: [2, 63],
			59: [2, 63],
			60: [2, 63],
			65: [2, 63],
			67: [2, 63],
			73: [2, 63],
			78: [2, 63],
			81: [2, 63],
			94: [2, 63],
			105: [2, 63],
			106: [2, 63],
			111: [2, 63],
			112: [2, 63],
			113: [2, 63],
			114: [2, 63],
			115: [2, 63],
			116: [2, 63],
			117: [2, 63],
			118: [2, 63],
			119: [2, 63],
			122: [2, 63],
			174: [2, 63],
			187: [2, 63],
			188: [2, 63],
			189: [2, 63],
			190: [2, 63],
			191: [2, 63]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 409,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 410,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 411,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 158],
			19: [2, 158],
			21: [2, 158],
			22: [2, 158],
			25: [2, 158],
			28: [2, 158],
			34: [2, 158],
			36: [2, 158],
			37: [2, 158],
			39: [2, 158],
			40: [2, 158],
			41: [2, 158],
			42: [2, 158],
			43: [2, 158],
			46: [2, 158],
			47: [2, 158],
			48: [2, 158],
			49: [2, 158],
			50: [2, 158],
			51: [2, 158],
			56: [2, 158],
			57: [2, 158],
			58: [2, 158],
			59: [2, 158],
			60: [2, 158],
			65: [2, 158],
			67: [2, 158],
			73: [2, 158],
			78: [2, 158],
			81: [2, 158],
			82: [2, 158],
			94: [2, 158],
			105: [2, 158],
			106: [2, 158],
			111: [2, 158],
			112: [2, 158],
			113: [2, 158],
			114: [2, 158],
			115: [2, 158],
			116: [2, 158],
			117: [2, 158],
			118: [2, 158],
			119: [2, 158],
			121: [2, 158],
			122: [2, 158],
			123: [2, 158],
			128: [2, 158],
			129: [2, 158],
			130: [2, 158],
			133: [2, 158],
			134: [2, 158],
			135: [2, 158],
			136: [2, 158],
			137: [2, 158],
			141: [2, 158],
			142: [2, 158],
			143: [2, 158],
			144: [2, 158],
			148: [2, 158],
			152: [2, 158],
			156: [2, 158],
			160: [2, 158],
			164: [2, 158],
			168: [2, 158],
			174: [2, 158],
			187: [2, 158],
			188: [2, 158],
			189: [2, 158],
			190: [2, 158],
			191: [2, 158]
		}, {
			2: [2, 159],
			19: [2, 159],
			21: [2, 159],
			22: [2, 159],
			25: [2, 159],
			28: [2, 159],
			34: [2, 159],
			36: [2, 159],
			37: [2, 159],
			39: [2, 159],
			40: [2, 159],
			41: [2, 159],
			42: [2, 159],
			43: [2, 159],
			46: [2, 159],
			47: [2, 159],
			48: [2, 159],
			49: [2, 159],
			50: [2, 159],
			51: [2, 159],
			56: [2, 159],
			57: [2, 159],
			58: [2, 159],
			59: [2, 159],
			60: [2, 159],
			65: [2, 159],
			67: [2, 159],
			73: [2, 159],
			78: [2, 159],
			81: [2, 159],
			82: [2, 159],
			94: [2, 159],
			105: [2, 159],
			106: [2, 159],
			111: [2, 159],
			112: [2, 159],
			113: [2, 159],
			114: [2, 159],
			115: [2, 159],
			116: [2, 159],
			117: [2, 159],
			118: [2, 159],
			119: [2, 159],
			121: [2, 159],
			122: [2, 159],
			123: [2, 159],
			128: [2, 159],
			129: [2, 159],
			130: [2, 159],
			133: [2, 159],
			134: [2, 159],
			135: [2, 159],
			136: [2, 159],
			137: [2, 159],
			141: [2, 159],
			142: [2, 159],
			143: [2, 159],
			144: [2, 159],
			148: [2, 159],
			152: [2, 159],
			156: [2, 159],
			160: [2, 159],
			164: [2, 159],
			168: [2, 159],
			174: [2, 159],
			187: [2, 159],
			188: [2, 159],
			189: [2, 159],
			190: [2, 159],
			191: [2, 159]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 412,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 413,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 140],
			19: [2, 140],
			21: [2, 140],
			22: [2, 140],
			25: [2, 140],
			28: [2, 140],
			31: [2, 140],
			34: [2, 140],
			36: [2, 140],
			37: [2, 140],
			39: [2, 140],
			40: [2, 140],
			41: [2, 140],
			42: [2, 140],
			43: [2, 140],
			46: [2, 140],
			47: [2, 140],
			48: [2, 140],
			49: [2, 140],
			50: [2, 140],
			51: [2, 140],
			56: [2, 140],
			57: [2, 140],
			58: [2, 140],
			59: [2, 140],
			60: [2, 140],
			65: [2, 140],
			67: [2, 140],
			73: [2, 140],
			78: [2, 140],
			81: [2, 140],
			82: [2, 140],
			93: [2, 140],
			94: [2, 140],
			105: [2, 140],
			106: [2, 140],
			111: [2, 140],
			112: [2, 140],
			113: [2, 140],
			114: [2, 140],
			115: [2, 140],
			116: [2, 140],
			117: [2, 140],
			118: [2, 140],
			119: [2, 140],
			121: [2, 140],
			122: [2, 140],
			123: [2, 140],
			128: [2, 140],
			129: [2, 140],
			130: [2, 140],
			133: [2, 140],
			134: [2, 140],
			135: [2, 140],
			136: [2, 140],
			137: [2, 140],
			141: [2, 140],
			142: [2, 140],
			143: [2, 140],
			144: [2, 140],
			148: [2, 140],
			152: [2, 140],
			156: [2, 140],
			160: [2, 140],
			164: [2, 140],
			168: [2, 140],
			173: [2, 140],
			174: [2, 140],
			175: [2, 140],
			176: [2, 140],
			177: [2, 140],
			178: [2, 140],
			179: [2, 140],
			180: [2, 140],
			181: [2, 140],
			182: [2, 140],
			183: [2, 140],
			187: [2, 140],
			188: [2, 140],
			189: [2, 140],
			190: [2, 140],
			191: [2, 140]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 414,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			22: [1, 294],
			28: [1, 341],
			36: [1, 284],
			40: [1, 280],
			41: [1, 279],
			42: [1, 296],
			43: [1, 282],
			46: [1, 285],
			47: [1, 275],
			48: [1, 272],
			49: [1, 288],
			50: [1, 297],
			51: [1, 289],
			56: [1, 273],
			58: [1, 277],
			59: [1, 291],
			60: [1, 292],
			63: [1, 274],
			64: [1, 281],
			65: [1, 276],
			67: [1, 283],
			78: [1, 290],
			89: 415,
			94: [1, 287],
			101: 271,
			111: [1, 278],
			112: [1, 295],
			113: [1, 293],
			137: [1, 286],
			187: [1, 300],
			188: [1, 298],
			189: [1, 299],
			194: [1, 301],
			195: [1, 302],
			196: [1, 303],
			197: [1, 304],
			198: [1, 305],
			199: [1, 306],
			200: [1, 307]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 416,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 139],
			19: [2, 139],
			21: [2, 139],
			22: [2, 139],
			25: [2, 139],
			28: [2, 139],
			31: [2, 139],
			34: [2, 139],
			36: [2, 139],
			37: [2, 139],
			39: [2, 139],
			40: [2, 139],
			41: [2, 139],
			42: [2, 139],
			43: [2, 139],
			46: [2, 139],
			47: [2, 139],
			48: [2, 139],
			49: [2, 139],
			50: [2, 139],
			51: [2, 139],
			56: [2, 139],
			57: [2, 139],
			58: [2, 139],
			59: [2, 139],
			60: [2, 139],
			65: [2, 139],
			67: [2, 139],
			73: [2, 139],
			78: [2, 139],
			81: [2, 139],
			82: [2, 139],
			93: [2, 139],
			94: [2, 139],
			105: [2, 139],
			106: [2, 139],
			111: [2, 139],
			112: [2, 139],
			113: [2, 139],
			114: [2, 139],
			115: [2, 139],
			116: [2, 139],
			117: [2, 139],
			118: [2, 139],
			119: [2, 139],
			121: [2, 139],
			122: [2, 139],
			123: [2, 139],
			128: [2, 139],
			129: [2, 139],
			130: [2, 139],
			133: [2, 139],
			134: [2, 139],
			135: [2, 139],
			136: [2, 139],
			137: [2, 139],
			141: [2, 139],
			142: [2, 139],
			143: [2, 139],
			144: [2, 139],
			148: [2, 139],
			152: [2, 139],
			156: [2, 139],
			160: [2, 139],
			164: [2, 139],
			168: [2, 139],
			173: [2, 139],
			174: [2, 139],
			175: [2, 139],
			176: [2, 139],
			177: [2, 139],
			178: [2, 139],
			179: [2, 139],
			180: [2, 139],
			181: [2, 139],
			182: [2, 139],
			183: [2, 139],
			187: [2, 139],
			188: [2, 139],
			189: [2, 139],
			190: [2, 139],
			191: [2, 139]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 417,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			22: [1, 294],
			28: [1, 341],
			36: [1, 284],
			40: [1, 280],
			41: [1, 279],
			42: [1, 296],
			43: [1, 282],
			46: [1, 285],
			47: [1, 275],
			48: [1, 272],
			49: [1, 288],
			50: [1, 297],
			51: [1, 289],
			56: [1, 273],
			58: [1, 277],
			59: [1, 291],
			60: [1, 292],
			63: [1, 274],
			64: [1, 281],
			65: [1, 276],
			67: [1, 283],
			78: [1, 290],
			89: 418,
			94: [1, 287],
			101: 271,
			111: [1, 278],
			112: [1, 295],
			113: [1, 293],
			137: [1, 286],
			187: [1, 300],
			188: [1, 298],
			189: [1, 299],
			194: [1, 301],
			195: [1, 302],
			196: [1, 303],
			197: [1, 304],
			198: [1, 305],
			199: [1, 306],
			200: [1, 307]
		}, {
			2: [2, 136],
			19: [2, 136],
			21: [2, 136],
			22: [2, 136],
			25: [2, 136],
			28: [2, 136],
			31: [2, 136],
			34: [2, 136],
			36: [2, 136],
			37: [2, 136],
			39: [2, 136],
			40: [2, 136],
			41: [2, 136],
			42: [2, 136],
			43: [2, 136],
			46: [2, 136],
			47: [2, 136],
			48: [2, 136],
			49: [2, 136],
			50: [2, 136],
			51: [2, 136],
			56: [2, 136],
			57: [2, 136],
			58: [2, 136],
			59: [2, 136],
			60: [2, 136],
			65: [2, 136],
			67: [2, 136],
			73: [2, 136],
			78: [2, 136],
			81: [2, 136],
			82: [2, 136],
			94: [2, 136],
			105: [2, 136],
			106: [2, 136],
			111: [2, 136],
			112: [2, 136],
			113: [2, 136],
			114: [2, 136],
			115: [2, 136],
			116: [2, 136],
			117: [2, 136],
			118: [2, 136],
			119: [2, 136],
			121: [2, 136],
			122: [2, 136],
			123: [2, 136],
			128: [2, 136],
			129: [2, 136],
			130: [2, 136],
			133: [2, 136],
			134: [2, 136],
			135: [2, 136],
			136: [2, 136],
			137: [2, 136],
			141: [2, 136],
			142: [2, 136],
			143: [2, 136],
			144: [2, 136],
			148: [2, 136],
			152: [2, 136],
			156: [2, 136],
			160: [2, 136],
			164: [2, 136],
			168: [2, 136],
			173: [2, 136],
			174: [2, 136],
			175: [2, 136],
			176: [2, 136],
			177: [2, 136],
			178: [2, 136],
			179: [2, 136],
			180: [2, 136],
			181: [2, 136],
			182: [2, 136],
			183: [2, 136],
			187: [2, 136],
			188: [2, 136],
			189: [2, 136],
			190: [2, 136],
			191: [2, 136]
		}, {
			2: [2, 135],
			19: [2, 135],
			21: [2, 135],
			22: [2, 135],
			25: [2, 135],
			28: [2, 135],
			31: [2, 135],
			34: [2, 135],
			36: [2, 135],
			37: [1, 165],
			39: [2, 135],
			40: [2, 135],
			41: [2, 135],
			42: [2, 135],
			43: [2, 135],
			46: [2, 135],
			47: [2, 135],
			48: [2, 135],
			49: [2, 135],
			50: [2, 135],
			51: [2, 135],
			56: [2, 135],
			57: [2, 135],
			58: [2, 135],
			59: [2, 135],
			60: [2, 135],
			65: [2, 135],
			67: [2, 135],
			73: [2, 135],
			78: [2, 135],
			81: [1, 254],
			82: [2, 135],
			93: [1, 255],
			94: [2, 135],
			95: 419,
			105: [2, 135],
			106: [2, 135],
			111: [2, 135],
			112: [2, 135],
			113: [2, 135],
			114: [2, 135],
			115: [2, 135],
			116: [2, 135],
			117: [2, 135],
			118: [2, 135],
			119: [2, 135],
			121: [2, 135],
			122: [2, 135],
			123: [2, 135],
			128: [2, 135],
			129: [2, 135],
			130: [2, 135],
			133: [2, 135],
			134: [2, 135],
			135: [2, 135],
			136: [2, 135],
			137: [2, 135],
			141: [2, 135],
			142: [2, 135],
			143: [2, 135],
			144: [2, 135],
			148: [2, 135],
			152: [2, 135],
			156: [2, 135],
			160: [2, 135],
			164: [2, 135],
			168: [2, 135],
			173: [2, 135],
			174: [2, 135],
			175: [2, 135],
			176: [2, 135],
			177: [2, 135],
			178: [2, 135],
			179: [2, 135],
			180: [2, 135],
			181: [2, 135],
			182: [2, 135],
			183: [2, 135],
			187: [2, 135],
			188: [2, 135],
			189: [2, 135],
			190: [2, 135],
			191: [2, 135]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 420,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 421,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			37: [1, 422]
		}, {
			28: [1, 378],
			39: [1, 423],
			69: 424
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 425,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 114],
			19: [2, 114],
			21: [2, 114],
			22: [2, 114],
			25: [2, 114],
			28: [2, 114],
			31: [2, 114],
			34: [2, 114],
			36: [2, 114],
			37: [2, 114],
			39: [2, 114],
			40: [2, 114],
			41: [2, 114],
			42: [2, 114],
			43: [2, 114],
			46: [2, 114],
			47: [2, 114],
			48: [2, 114],
			49: [2, 114],
			50: [2, 114],
			51: [2, 114],
			56: [2, 114],
			57: [2, 114],
			58: [2, 114],
			59: [2, 114],
			60: [2, 114],
			65: [2, 114],
			67: [2, 114],
			73: [2, 114],
			78: [2, 114],
			81: [2, 114],
			82: [2, 114],
			93: [2, 114],
			94: [2, 114],
			105: [2, 114],
			106: [2, 114],
			111: [2, 114],
			112: [2, 114],
			113: [2, 114],
			114: [2, 114],
			115: [2, 114],
			116: [2, 114],
			117: [2, 114],
			118: [2, 114],
			119: [2, 114],
			121: [2, 114],
			122: [2, 114],
			123: [2, 114],
			128: [2, 114],
			129: [2, 114],
			130: [2, 114],
			133: [2, 114],
			134: [2, 114],
			135: [2, 114],
			136: [2, 114],
			137: [2, 114],
			141: [2, 114],
			142: [2, 114],
			143: [2, 114],
			144: [2, 114],
			148: [2, 114],
			152: [2, 114],
			156: [2, 114],
			160: [2, 114],
			164: [2, 114],
			168: [2, 114],
			173: [2, 114],
			174: [2, 114],
			175: [2, 114],
			176: [2, 114],
			177: [2, 114],
			178: [2, 114],
			179: [2, 114],
			180: [2, 114],
			181: [2, 114],
			182: [2, 114],
			183: [2, 114],
			187: [2, 114],
			188: [2, 114],
			189: [2, 114],
			190: [2, 114],
			191: [2, 114]
		}, {
			21: [1, 426],
			25: [1, 427]
		}, {
			21: [2, 117],
			25: [2, 117]
		}, {
			57: [1, 428]
		}, {
			22: [1, 294],
			28: [1, 341],
			36: [1, 284],
			40: [1, 280],
			41: [1, 279],
			42: [1, 296],
			43: [1, 282],
			46: [1, 285],
			47: [1, 275],
			48: [1, 272],
			49: [1, 288],
			50: [1, 297],
			51: [1, 289],
			56: [1, 273],
			57: [2, 147],
			58: [1, 277],
			59: [1, 291],
			60: [1, 292],
			63: [1, 274],
			64: [1, 281],
			65: [1, 276],
			67: [1, 283],
			78: [1, 290],
			87: 429,
			89: 268,
			90: 269,
			91: 270,
			94: [1, 287],
			101: 271,
			111: [1, 278],
			112: [1, 295],
			113: [1, 293],
			137: [1, 286],
			187: [1, 300],
			188: [1, 298],
			189: [1, 299],
			190: [1, 67],
			191: [1, 68],
			194: [1, 301],
			195: [1, 302],
			196: [1, 303],
			197: [1, 304],
			198: [1, 305],
			199: [1, 306],
			200: [1, 307]
		}, {
			37: [2, 122],
			57: [2, 122]
		}, {
			37: [2, 123],
			57: [2, 123]
		}, {
			37: [2, 124],
			57: [2, 124]
		}, {
			2: [2, 148],
			19: [2, 148],
			21: [2, 148],
			22: [2, 148],
			25: [2, 148],
			28: [2, 148],
			31: [2, 148],
			34: [2, 148],
			36: [2, 148],
			37: [2, 148],
			39: [2, 148],
			40: [2, 148],
			41: [2, 148],
			42: [2, 148],
			43: [2, 148],
			46: [2, 148],
			47: [2, 148],
			48: [2, 148],
			49: [2, 148],
			50: [2, 148],
			51: [2, 148],
			56: [2, 148],
			57: [2, 148],
			58: [2, 148],
			59: [2, 148],
			60: [2, 148],
			65: [2, 148],
			67: [2, 148],
			73: [2, 148],
			78: [2, 148],
			81: [2, 148],
			82: [2, 148],
			93: [2, 148],
			94: [2, 148],
			105: [2, 148],
			106: [2, 148],
			111: [2, 148],
			112: [2, 148],
			113: [2, 148],
			114: [2, 148],
			115: [2, 148],
			116: [2, 148],
			117: [2, 148],
			118: [2, 148],
			119: [2, 148],
			121: [2, 148],
			122: [2, 148],
			123: [2, 148],
			128: [2, 148],
			129: [2, 148],
			130: [2, 148],
			133: [2, 148],
			134: [2, 148],
			135: [2, 148],
			136: [2, 148],
			137: [2, 148],
			141: [2, 148],
			142: [2, 148],
			143: [2, 148],
			144: [2, 148],
			148: [2, 148],
			152: [2, 148],
			156: [2, 148],
			160: [2, 148],
			164: [2, 148],
			168: [2, 148],
			173: [2, 148],
			174: [2, 148],
			175: [2, 148],
			176: [2, 148],
			177: [2, 148],
			178: [2, 148],
			179: [2, 148],
			180: [2, 148],
			181: [2, 148],
			182: [2, 148],
			183: [2, 148],
			187: [2, 148],
			188: [2, 148],
			189: [2, 148],
			190: [2, 148],
			191: [2, 148]
		}, {
			2: [2, 310],
			19: [2, 310],
			21: [2, 310],
			22: [2, 310],
			25: [2, 310],
			28: [2, 310],
			31: [2, 310],
			34: [2, 310],
			36: [2, 310],
			37: [2, 310],
			39: [2, 310],
			40: [2, 310],
			41: [2, 310],
			42: [2, 310],
			43: [2, 310],
			46: [2, 310],
			47: [2, 310],
			48: [2, 310],
			49: [2, 310],
			50: [2, 310],
			51: [2, 310],
			56: [2, 310],
			57: [2, 310],
			58: [2, 310],
			59: [2, 310],
			60: [2, 310],
			65: [2, 310],
			67: [2, 310],
			73: [2, 310],
			78: [2, 310],
			81: [2, 310],
			82: [2, 310],
			93: [2, 310],
			94: [2, 310],
			105: [2, 310],
			106: [2, 310],
			111: [2, 310],
			112: [2, 310],
			113: [2, 310],
			114: [2, 310],
			115: [2, 310],
			116: [2, 310],
			117: [2, 310],
			118: [2, 310],
			119: [2, 310],
			121: [2, 310],
			122: [2, 310],
			123: [2, 310],
			128: [2, 310],
			129: [2, 310],
			130: [2, 310],
			133: [2, 310],
			134: [2, 310],
			135: [2, 310],
			136: [2, 310],
			137: [2, 310],
			141: [2, 310],
			142: [2, 310],
			143: [2, 310],
			144: [2, 310],
			148: [2, 310],
			152: [2, 310],
			156: [2, 310],
			160: [2, 310],
			164: [2, 310],
			168: [2, 310],
			173: [2, 310],
			174: [2, 310],
			175: [2, 310],
			176: [2, 310],
			177: [2, 310],
			178: [2, 310],
			179: [2, 310],
			180: [2, 310],
			181: [2, 310],
			182: [2, 310],
			183: [2, 310],
			187: [2, 310],
			188: [2, 310],
			189: [2, 310],
			190: [2, 310],
			191: [2, 310]
		}, {
			2: [2, 311],
			19: [2, 311],
			21: [2, 311],
			22: [2, 311],
			25: [2, 311],
			28: [2, 311],
			31: [2, 311],
			34: [2, 311],
			36: [2, 311],
			37: [2, 311],
			39: [2, 311],
			40: [2, 311],
			41: [2, 311],
			42: [2, 311],
			43: [2, 311],
			46: [2, 311],
			47: [2, 311],
			48: [2, 311],
			49: [2, 311],
			50: [2, 311],
			51: [2, 311],
			56: [2, 311],
			57: [2, 311],
			58: [2, 311],
			59: [2, 311],
			60: [2, 311],
			65: [2, 311],
			67: [2, 311],
			73: [2, 311],
			78: [2, 311],
			81: [2, 311],
			82: [2, 311],
			93: [2, 311],
			94: [2, 311],
			105: [2, 311],
			106: [2, 311],
			111: [2, 311],
			112: [2, 311],
			113: [2, 311],
			114: [2, 311],
			115: [2, 311],
			116: [2, 311],
			117: [2, 311],
			118: [2, 311],
			119: [2, 311],
			121: [2, 311],
			122: [2, 311],
			123: [2, 311],
			128: [2, 311],
			129: [2, 311],
			130: [2, 311],
			133: [2, 311],
			134: [2, 311],
			135: [2, 311],
			136: [2, 311],
			137: [2, 311],
			141: [2, 311],
			142: [2, 311],
			143: [2, 311],
			144: [2, 311],
			148: [2, 311],
			152: [2, 311],
			156: [2, 311],
			160: [2, 311],
			164: [2, 311],
			168: [2, 311],
			173: [2, 311],
			174: [2, 311],
			175: [2, 311],
			176: [2, 311],
			177: [2, 311],
			178: [2, 311],
			179: [2, 311],
			180: [2, 311],
			181: [2, 311],
			182: [2, 311],
			183: [2, 311],
			187: [2, 311],
			188: [2, 311],
			189: [2, 311],
			190: [2, 311],
			191: [2, 311]
		}, {
			2: [2, 312],
			19: [2, 312],
			21: [2, 312],
			22: [2, 312],
			25: [2, 312],
			28: [2, 312],
			31: [2, 312],
			34: [2, 312],
			36: [2, 312],
			37: [2, 312],
			39: [2, 312],
			40: [2, 312],
			41: [2, 312],
			42: [2, 312],
			43: [2, 312],
			46: [2, 312],
			47: [2, 312],
			48: [2, 312],
			49: [2, 312],
			50: [2, 312],
			51: [2, 312],
			56: [2, 312],
			57: [2, 312],
			58: [2, 312],
			59: [2, 312],
			60: [2, 312],
			65: [2, 312],
			67: [2, 312],
			73: [2, 312],
			78: [2, 312],
			81: [2, 312],
			82: [2, 312],
			93: [2, 312],
			94: [2, 312],
			105: [2, 312],
			106: [2, 312],
			111: [2, 312],
			112: [2, 312],
			113: [2, 312],
			114: [2, 312],
			115: [2, 312],
			116: [2, 312],
			117: [2, 312],
			118: [2, 312],
			119: [2, 312],
			121: [2, 312],
			122: [2, 312],
			123: [2, 312],
			128: [2, 312],
			129: [2, 312],
			130: [2, 312],
			133: [2, 312],
			134: [2, 312],
			135: [2, 312],
			136: [2, 312],
			137: [2, 312],
			141: [2, 312],
			142: [2, 312],
			143: [2, 312],
			144: [2, 312],
			148: [2, 312],
			152: [2, 312],
			156: [2, 312],
			160: [2, 312],
			164: [2, 312],
			168: [2, 312],
			173: [2, 312],
			174: [2, 312],
			175: [2, 312],
			176: [2, 312],
			177: [2, 312],
			178: [2, 312],
			179: [2, 312],
			180: [2, 312],
			181: [2, 312],
			182: [2, 312],
			183: [2, 312],
			187: [2, 312],
			188: [2, 312],
			189: [2, 312],
			190: [2, 312],
			191: [2, 312]
		}, {
			2: [2, 313],
			19: [2, 313],
			21: [2, 313],
			22: [2, 313],
			25: [2, 313],
			28: [2, 313],
			31: [2, 313],
			34: [2, 313],
			36: [2, 313],
			37: [2, 313],
			39: [2, 313],
			40: [2, 313],
			41: [2, 313],
			42: [2, 313],
			43: [2, 313],
			46: [2, 313],
			47: [2, 313],
			48: [2, 313],
			49: [2, 313],
			50: [2, 313],
			51: [2, 313],
			56: [2, 313],
			57: [2, 313],
			58: [2, 313],
			59: [2, 313],
			60: [2, 313],
			65: [2, 313],
			67: [2, 313],
			73: [2, 313],
			78: [2, 313],
			81: [2, 313],
			82: [2, 313],
			93: [2, 313],
			94: [2, 313],
			105: [2, 313],
			106: [2, 313],
			111: [2, 313],
			112: [2, 313],
			113: [2, 313],
			114: [2, 313],
			115: [2, 313],
			116: [2, 313],
			117: [2, 313],
			118: [2, 313],
			119: [2, 313],
			121: [2, 313],
			122: [2, 313],
			123: [2, 313],
			128: [2, 313],
			129: [2, 313],
			130: [2, 313],
			133: [2, 313],
			134: [2, 313],
			135: [2, 313],
			136: [2, 313],
			137: [2, 313],
			141: [2, 313],
			142: [2, 313],
			143: [2, 313],
			144: [2, 313],
			148: [2, 313],
			152: [2, 313],
			156: [2, 313],
			160: [2, 313],
			164: [2, 313],
			168: [2, 313],
			173: [2, 313],
			174: [2, 313],
			175: [2, 313],
			176: [2, 313],
			177: [2, 313],
			178: [2, 313],
			179: [2, 313],
			180: [2, 313],
			181: [2, 313],
			182: [2, 313],
			183: [2, 313],
			187: [2, 313],
			188: [2, 313],
			189: [2, 313],
			190: [2, 313],
			191: [2, 313]
		}, {
			2: [2, 314],
			19: [2, 314],
			21: [2, 314],
			22: [2, 314],
			25: [2, 314],
			28: [2, 314],
			31: [2, 314],
			34: [2, 314],
			36: [2, 314],
			37: [2, 314],
			39: [2, 314],
			40: [2, 314],
			41: [2, 314],
			42: [2, 314],
			43: [2, 314],
			46: [2, 314],
			47: [2, 314],
			48: [2, 314],
			49: [2, 314],
			50: [2, 314],
			51: [2, 314],
			56: [2, 314],
			57: [2, 314],
			58: [2, 314],
			59: [2, 314],
			60: [2, 314],
			65: [2, 314],
			67: [2, 314],
			73: [2, 314],
			78: [2, 314],
			81: [2, 314],
			82: [2, 314],
			93: [2, 314],
			94: [2, 314],
			105: [2, 314],
			106: [2, 314],
			111: [2, 314],
			112: [2, 314],
			113: [2, 314],
			114: [2, 314],
			115: [2, 314],
			116: [2, 314],
			117: [2, 314],
			118: [2, 314],
			119: [2, 314],
			121: [2, 314],
			122: [2, 314],
			123: [2, 314],
			128: [2, 314],
			129: [2, 314],
			130: [2, 314],
			133: [2, 314],
			134: [2, 314],
			135: [2, 314],
			136: [2, 314],
			137: [2, 314],
			141: [2, 314],
			142: [2, 314],
			143: [2, 314],
			144: [2, 314],
			148: [2, 314],
			152: [2, 314],
			156: [2, 314],
			160: [2, 314],
			164: [2, 314],
			168: [2, 314],
			173: [2, 314],
			174: [2, 314],
			175: [2, 314],
			176: [2, 314],
			177: [2, 314],
			178: [2, 314],
			179: [2, 314],
			180: [2, 314],
			181: [2, 314],
			182: [2, 314],
			183: [2, 314],
			187: [2, 314],
			188: [2, 314],
			189: [2, 314],
			190: [2, 314],
			191: [2, 314]
		}, {
			2: [2, 315],
			19: [2, 315],
			21: [2, 315],
			22: [2, 315],
			25: [2, 315],
			28: [2, 315],
			31: [2, 315],
			34: [2, 315],
			36: [2, 315],
			37: [2, 315],
			39: [2, 315],
			40: [2, 315],
			41: [2, 315],
			42: [2, 315],
			43: [2, 315],
			46: [2, 315],
			47: [2, 315],
			48: [2, 315],
			49: [2, 315],
			50: [2, 315],
			51: [2, 315],
			56: [2, 315],
			57: [2, 315],
			58: [2, 315],
			59: [2, 315],
			60: [2, 315],
			65: [2, 315],
			67: [2, 315],
			73: [2, 315],
			78: [2, 315],
			81: [2, 315],
			82: [2, 315],
			93: [2, 315],
			94: [2, 315],
			105: [2, 315],
			106: [2, 315],
			111: [2, 315],
			112: [2, 315],
			113: [2, 315],
			114: [2, 315],
			115: [2, 315],
			116: [2, 315],
			117: [2, 315],
			118: [2, 315],
			119: [2, 315],
			121: [2, 315],
			122: [2, 315],
			123: [2, 315],
			128: [2, 315],
			129: [2, 315],
			130: [2, 315],
			133: [2, 315],
			134: [2, 315],
			135: [2, 315],
			136: [2, 315],
			137: [2, 315],
			141: [2, 315],
			142: [2, 315],
			143: [2, 315],
			144: [2, 315],
			148: [2, 315],
			152: [2, 315],
			156: [2, 315],
			160: [2, 315],
			164: [2, 315],
			168: [2, 315],
			173: [2, 315],
			174: [2, 315],
			175: [2, 315],
			176: [2, 315],
			177: [2, 315],
			178: [2, 315],
			179: [2, 315],
			180: [2, 315],
			181: [2, 315],
			182: [2, 315],
			183: [2, 315],
			187: [2, 315],
			188: [2, 315],
			189: [2, 315],
			190: [2, 315],
			191: [2, 315]
		}, {
			2: [2, 316],
			19: [2, 316],
			21: [2, 316],
			22: [2, 316],
			25: [2, 316],
			28: [2, 316],
			31: [2, 316],
			34: [2, 316],
			36: [2, 316],
			37: [2, 316],
			39: [2, 316],
			40: [2, 316],
			41: [2, 316],
			42: [2, 316],
			43: [2, 316],
			46: [2, 316],
			47: [2, 316],
			48: [2, 316],
			49: [2, 316],
			50: [2, 316],
			51: [2, 316],
			56: [2, 316],
			57: [2, 316],
			58: [2, 316],
			59: [2, 316],
			60: [2, 316],
			65: [2, 316],
			67: [2, 316],
			73: [2, 316],
			78: [2, 316],
			81: [2, 316],
			82: [2, 316],
			93: [2, 316],
			94: [2, 316],
			105: [2, 316],
			106: [2, 316],
			111: [2, 316],
			112: [2, 316],
			113: [2, 316],
			114: [2, 316],
			115: [2, 316],
			116: [2, 316],
			117: [2, 316],
			118: [2, 316],
			119: [2, 316],
			121: [2, 316],
			122: [2, 316],
			123: [2, 316],
			128: [2, 316],
			129: [2, 316],
			130: [2, 316],
			133: [2, 316],
			134: [2, 316],
			135: [2, 316],
			136: [2, 316],
			137: [2, 316],
			141: [2, 316],
			142: [2, 316],
			143: [2, 316],
			144: [2, 316],
			148: [2, 316],
			152: [2, 316],
			156: [2, 316],
			160: [2, 316],
			164: [2, 316],
			168: [2, 316],
			173: [2, 316],
			174: [2, 316],
			175: [2, 316],
			176: [2, 316],
			177: [2, 316],
			178: [2, 316],
			179: [2, 316],
			180: [2, 316],
			181: [2, 316],
			182: [2, 316],
			183: [2, 316],
			187: [2, 316],
			188: [2, 316],
			189: [2, 316],
			190: [2, 316],
			191: [2, 316]
		}, {
			2: [2, 317],
			19: [2, 317],
			21: [2, 317],
			22: [2, 317],
			25: [2, 317],
			28: [2, 317],
			31: [2, 317],
			34: [2, 317],
			36: [2, 317],
			37: [2, 317],
			39: [2, 317],
			40: [2, 317],
			41: [2, 317],
			42: [2, 317],
			43: [2, 317],
			46: [2, 317],
			47: [2, 317],
			48: [2, 317],
			49: [2, 317],
			50: [2, 317],
			51: [2, 317],
			56: [2, 317],
			57: [2, 317],
			58: [2, 317],
			59: [2, 317],
			60: [2, 317],
			65: [2, 317],
			67: [2, 317],
			73: [2, 317],
			78: [2, 317],
			81: [2, 317],
			82: [2, 317],
			93: [2, 317],
			94: [2, 317],
			105: [2, 317],
			106: [2, 317],
			111: [2, 317],
			112: [2, 317],
			113: [2, 317],
			114: [2, 317],
			115: [2, 317],
			116: [2, 317],
			117: [2, 317],
			118: [2, 317],
			119: [2, 317],
			121: [2, 317],
			122: [2, 317],
			123: [2, 317],
			128: [2, 317],
			129: [2, 317],
			130: [2, 317],
			133: [2, 317],
			134: [2, 317],
			135: [2, 317],
			136: [2, 317],
			137: [2, 317],
			141: [2, 317],
			142: [2, 317],
			143: [2, 317],
			144: [2, 317],
			148: [2, 317],
			152: [2, 317],
			156: [2, 317],
			160: [2, 317],
			164: [2, 317],
			168: [2, 317],
			173: [2, 317],
			174: [2, 317],
			175: [2, 317],
			176: [2, 317],
			177: [2, 317],
			178: [2, 317],
			179: [2, 317],
			180: [2, 317],
			181: [2, 317],
			182: [2, 317],
			183: [2, 317],
			187: [2, 317],
			188: [2, 317],
			189: [2, 317],
			190: [2, 317],
			191: [2, 317]
		}, {
			2: [2, 318],
			19: [2, 318],
			21: [2, 318],
			22: [2, 318],
			25: [2, 318],
			28: [2, 318],
			31: [2, 318],
			34: [2, 318],
			36: [2, 318],
			37: [2, 318],
			39: [2, 318],
			40: [2, 318],
			41: [2, 318],
			42: [2, 318],
			43: [2, 318],
			46: [2, 318],
			47: [2, 318],
			48: [2, 318],
			49: [2, 318],
			50: [2, 318],
			51: [2, 318],
			56: [2, 318],
			57: [2, 318],
			58: [2, 318],
			59: [2, 318],
			60: [2, 318],
			65: [2, 318],
			67: [2, 318],
			73: [2, 318],
			78: [2, 318],
			81: [2, 318],
			82: [2, 318],
			93: [2, 318],
			94: [2, 318],
			105: [2, 318],
			106: [2, 318],
			111: [2, 318],
			112: [2, 318],
			113: [2, 318],
			114: [2, 318],
			115: [2, 318],
			116: [2, 318],
			117: [2, 318],
			118: [2, 318],
			119: [2, 318],
			121: [2, 318],
			122: [2, 318],
			123: [2, 318],
			128: [2, 318],
			129: [2, 318],
			130: [2, 318],
			133: [2, 318],
			134: [2, 318],
			135: [2, 318],
			136: [2, 318],
			137: [2, 318],
			141: [2, 318],
			142: [2, 318],
			143: [2, 318],
			144: [2, 318],
			148: [2, 318],
			152: [2, 318],
			156: [2, 318],
			160: [2, 318],
			164: [2, 318],
			168: [2, 318],
			173: [2, 318],
			174: [2, 318],
			175: [2, 318],
			176: [2, 318],
			177: [2, 318],
			178: [2, 318],
			179: [2, 318],
			180: [2, 318],
			181: [2, 318],
			182: [2, 318],
			183: [2, 318],
			187: [2, 318],
			188: [2, 318],
			189: [2, 318],
			190: [2, 318],
			191: [2, 318]
		}, {
			2: [2, 319],
			19: [2, 319],
			21: [2, 319],
			22: [2, 319],
			25: [2, 319],
			28: [2, 319],
			31: [2, 319],
			34: [2, 319],
			36: [2, 319],
			37: [2, 319],
			39: [2, 319],
			40: [2, 319],
			41: [2, 319],
			42: [2, 319],
			43: [2, 319],
			46: [2, 319],
			47: [2, 319],
			48: [2, 319],
			49: [2, 319],
			50: [2, 319],
			51: [2, 319],
			56: [2, 319],
			57: [2, 319],
			58: [2, 319],
			59: [2, 319],
			60: [2, 319],
			65: [2, 319],
			67: [2, 319],
			73: [2, 319],
			78: [2, 319],
			81: [2, 319],
			82: [2, 319],
			93: [2, 319],
			94: [2, 319],
			105: [2, 319],
			106: [2, 319],
			111: [2, 319],
			112: [2, 319],
			113: [2, 319],
			114: [2, 319],
			115: [2, 319],
			116: [2, 319],
			117: [2, 319],
			118: [2, 319],
			119: [2, 319],
			121: [2, 319],
			122: [2, 319],
			123: [2, 319],
			128: [2, 319],
			129: [2, 319],
			130: [2, 319],
			133: [2, 319],
			134: [2, 319],
			135: [2, 319],
			136: [2, 319],
			137: [2, 319],
			141: [2, 319],
			142: [2, 319],
			143: [2, 319],
			144: [2, 319],
			148: [2, 319],
			152: [2, 319],
			156: [2, 319],
			160: [2, 319],
			164: [2, 319],
			168: [2, 319],
			173: [2, 319],
			174: [2, 319],
			175: [2, 319],
			176: [2, 319],
			177: [2, 319],
			178: [2, 319],
			179: [2, 319],
			180: [2, 319],
			181: [2, 319],
			182: [2, 319],
			183: [2, 319],
			187: [2, 319],
			188: [2, 319],
			189: [2, 319],
			190: [2, 319],
			191: [2, 319]
		}, {
			2: [2, 320],
			19: [2, 320],
			21: [2, 320],
			22: [2, 320],
			25: [2, 320],
			28: [2, 320],
			31: [2, 320],
			34: [2, 320],
			36: [2, 320],
			37: [2, 320],
			39: [2, 320],
			40: [2, 320],
			41: [2, 320],
			42: [2, 320],
			43: [2, 320],
			46: [2, 320],
			47: [2, 320],
			48: [2, 320],
			49: [2, 320],
			50: [2, 320],
			51: [2, 320],
			56: [2, 320],
			57: [2, 320],
			58: [2, 320],
			59: [2, 320],
			60: [2, 320],
			65: [2, 320],
			67: [2, 320],
			73: [2, 320],
			78: [2, 320],
			81: [2, 320],
			82: [2, 320],
			93: [2, 320],
			94: [2, 320],
			105: [2, 320],
			106: [2, 320],
			111: [2, 320],
			112: [2, 320],
			113: [2, 320],
			114: [2, 320],
			115: [2, 320],
			116: [2, 320],
			117: [2, 320],
			118: [2, 320],
			119: [2, 320],
			121: [2, 320],
			122: [2, 320],
			123: [2, 320],
			128: [2, 320],
			129: [2, 320],
			130: [2, 320],
			133: [2, 320],
			134: [2, 320],
			135: [2, 320],
			136: [2, 320],
			137: [2, 320],
			141: [2, 320],
			142: [2, 320],
			143: [2, 320],
			144: [2, 320],
			148: [2, 320],
			152: [2, 320],
			156: [2, 320],
			160: [2, 320],
			164: [2, 320],
			168: [2, 320],
			173: [2, 320],
			174: [2, 320],
			175: [2, 320],
			176: [2, 320],
			177: [2, 320],
			178: [2, 320],
			179: [2, 320],
			180: [2, 320],
			181: [2, 320],
			182: [2, 320],
			183: [2, 320],
			187: [2, 320],
			188: [2, 320],
			189: [2, 320],
			190: [2, 320],
			191: [2, 320]
		}, {
			2: [2, 321],
			19: [2, 321],
			21: [2, 321],
			22: [2, 321],
			25: [2, 321],
			28: [2, 321],
			31: [2, 321],
			34: [2, 321],
			36: [2, 321],
			37: [2, 321],
			39: [2, 321],
			40: [2, 321],
			41: [2, 321],
			42: [2, 321],
			43: [2, 321],
			46: [2, 321],
			47: [2, 321],
			48: [2, 321],
			49: [2, 321],
			50: [2, 321],
			51: [2, 321],
			56: [2, 321],
			57: [2, 321],
			58: [2, 321],
			59: [2, 321],
			60: [2, 321],
			65: [2, 321],
			67: [2, 321],
			73: [2, 321],
			78: [2, 321],
			81: [2, 321],
			82: [2, 321],
			93: [2, 321],
			94: [2, 321],
			105: [2, 321],
			106: [2, 321],
			111: [2, 321],
			112: [2, 321],
			113: [2, 321],
			114: [2, 321],
			115: [2, 321],
			116: [2, 321],
			117: [2, 321],
			118: [2, 321],
			119: [2, 321],
			121: [2, 321],
			122: [2, 321],
			123: [2, 321],
			128: [2, 321],
			129: [2, 321],
			130: [2, 321],
			133: [2, 321],
			134: [2, 321],
			135: [2, 321],
			136: [2, 321],
			137: [2, 321],
			141: [2, 321],
			142: [2, 321],
			143: [2, 321],
			144: [2, 321],
			148: [2, 321],
			152: [2, 321],
			156: [2, 321],
			160: [2, 321],
			164: [2, 321],
			168: [2, 321],
			173: [2, 321],
			174: [2, 321],
			175: [2, 321],
			176: [2, 321],
			177: [2, 321],
			178: [2, 321],
			179: [2, 321],
			180: [2, 321],
			181: [2, 321],
			182: [2, 321],
			183: [2, 321],
			187: [2, 321],
			188: [2, 321],
			189: [2, 321],
			190: [2, 321],
			191: [2, 321]
		}, {
			2: [2, 322],
			19: [2, 322],
			21: [2, 322],
			22: [2, 322],
			25: [2, 322],
			28: [2, 322],
			31: [2, 322],
			34: [2, 322],
			36: [2, 322],
			37: [2, 322],
			39: [2, 322],
			40: [2, 322],
			41: [2, 322],
			42: [2, 322],
			43: [2, 322],
			46: [2, 322],
			47: [2, 322],
			48: [2, 322],
			49: [2, 322],
			50: [2, 322],
			51: [2, 322],
			56: [2, 322],
			57: [2, 322],
			58: [2, 322],
			59: [2, 322],
			60: [2, 322],
			65: [2, 322],
			67: [2, 322],
			73: [2, 322],
			78: [2, 322],
			81: [2, 322],
			82: [2, 322],
			93: [2, 322],
			94: [2, 322],
			105: [2, 322],
			106: [2, 322],
			111: [2, 322],
			112: [2, 322],
			113: [2, 322],
			114: [2, 322],
			115: [2, 322],
			116: [2, 322],
			117: [2, 322],
			118: [2, 322],
			119: [2, 322],
			121: [2, 322],
			122: [2, 322],
			123: [2, 322],
			128: [2, 322],
			129: [2, 322],
			130: [2, 322],
			133: [2, 322],
			134: [2, 322],
			135: [2, 322],
			136: [2, 322],
			137: [2, 322],
			141: [2, 322],
			142: [2, 322],
			143: [2, 322],
			144: [2, 322],
			148: [2, 322],
			152: [2, 322],
			156: [2, 322],
			160: [2, 322],
			164: [2, 322],
			168: [2, 322],
			173: [2, 322],
			174: [2, 322],
			175: [2, 322],
			176: [2, 322],
			177: [2, 322],
			178: [2, 322],
			179: [2, 322],
			180: [2, 322],
			181: [2, 322],
			182: [2, 322],
			183: [2, 322],
			187: [2, 322],
			188: [2, 322],
			189: [2, 322],
			190: [2, 322],
			191: [2, 322]
		}, {
			2: [2, 323],
			19: [2, 323],
			21: [2, 323],
			22: [2, 323],
			25: [2, 323],
			28: [2, 323],
			31: [2, 323],
			34: [2, 323],
			36: [2, 323],
			37: [2, 323],
			39: [2, 323],
			40: [2, 323],
			41: [2, 323],
			42: [2, 323],
			43: [2, 323],
			46: [2, 323],
			47: [2, 323],
			48: [2, 323],
			49: [2, 323],
			50: [2, 323],
			51: [2, 323],
			56: [2, 323],
			57: [2, 323],
			58: [2, 323],
			59: [2, 323],
			60: [2, 323],
			65: [2, 323],
			67: [2, 323],
			73: [2, 323],
			78: [2, 323],
			81: [2, 323],
			82: [2, 323],
			93: [2, 323],
			94: [2, 323],
			105: [2, 323],
			106: [2, 323],
			111: [2, 323],
			112: [2, 323],
			113: [2, 323],
			114: [2, 323],
			115: [2, 323],
			116: [2, 323],
			117: [2, 323],
			118: [2, 323],
			119: [2, 323],
			121: [2, 323],
			122: [2, 323],
			123: [2, 323],
			128: [2, 323],
			129: [2, 323],
			130: [2, 323],
			133: [2, 323],
			134: [2, 323],
			135: [2, 323],
			136: [2, 323],
			137: [2, 323],
			141: [2, 323],
			142: [2, 323],
			143: [2, 323],
			144: [2, 323],
			148: [2, 323],
			152: [2, 323],
			156: [2, 323],
			160: [2, 323],
			164: [2, 323],
			168: [2, 323],
			173: [2, 323],
			174: [2, 323],
			175: [2, 323],
			176: [2, 323],
			177: [2, 323],
			178: [2, 323],
			179: [2, 323],
			180: [2, 323],
			181: [2, 323],
			182: [2, 323],
			183: [2, 323],
			187: [2, 323],
			188: [2, 323],
			189: [2, 323],
			190: [2, 323],
			191: [2, 323]
		}, {
			2: [2, 324],
			19: [2, 324],
			21: [2, 324],
			22: [2, 324],
			25: [2, 324],
			28: [2, 324],
			31: [2, 324],
			34: [2, 324],
			36: [2, 324],
			37: [2, 324],
			39: [2, 324],
			40: [2, 324],
			41: [2, 324],
			42: [2, 324],
			43: [2, 324],
			46: [2, 324],
			47: [2, 324],
			48: [2, 324],
			49: [2, 324],
			50: [2, 324],
			51: [2, 324],
			56: [2, 324],
			57: [2, 324],
			58: [2, 324],
			59: [2, 324],
			60: [2, 324],
			65: [2, 324],
			67: [2, 324],
			73: [2, 324],
			78: [2, 324],
			81: [2, 324],
			82: [2, 324],
			93: [2, 324],
			94: [2, 324],
			105: [2, 324],
			106: [2, 324],
			111: [2, 324],
			112: [2, 324],
			113: [2, 324],
			114: [2, 324],
			115: [2, 324],
			116: [2, 324],
			117: [2, 324],
			118: [2, 324],
			119: [2, 324],
			121: [2, 324],
			122: [2, 324],
			123: [2, 324],
			128: [2, 324],
			129: [2, 324],
			130: [2, 324],
			133: [2, 324],
			134: [2, 324],
			135: [2, 324],
			136: [2, 324],
			137: [2, 324],
			141: [2, 324],
			142: [2, 324],
			143: [2, 324],
			144: [2, 324],
			148: [2, 324],
			152: [2, 324],
			156: [2, 324],
			160: [2, 324],
			164: [2, 324],
			168: [2, 324],
			173: [2, 324],
			174: [2, 324],
			175: [2, 324],
			176: [2, 324],
			177: [2, 324],
			178: [2, 324],
			179: [2, 324],
			180: [2, 324],
			181: [2, 324],
			182: [2, 324],
			183: [2, 324],
			187: [2, 324],
			188: [2, 324],
			189: [2, 324],
			190: [2, 324],
			191: [2, 324]
		}, {
			2: [2, 325],
			19: [2, 325],
			21: [2, 325],
			22: [2, 325],
			25: [2, 325],
			28: [2, 325],
			31: [2, 325],
			34: [2, 325],
			36: [2, 325],
			37: [2, 325],
			39: [2, 325],
			40: [2, 325],
			41: [2, 325],
			42: [2, 325],
			43: [2, 325],
			46: [2, 325],
			47: [2, 325],
			48: [2, 325],
			49: [2, 325],
			50: [2, 325],
			51: [2, 325],
			56: [2, 325],
			57: [2, 325],
			58: [2, 325],
			59: [2, 325],
			60: [2, 325],
			65: [2, 325],
			67: [2, 325],
			73: [2, 325],
			78: [2, 325],
			81: [2, 325],
			82: [2, 325],
			93: [2, 325],
			94: [2, 325],
			105: [2, 325],
			106: [2, 325],
			111: [2, 325],
			112: [2, 325],
			113: [2, 325],
			114: [2, 325],
			115: [2, 325],
			116: [2, 325],
			117: [2, 325],
			118: [2, 325],
			119: [2, 325],
			121: [2, 325],
			122: [2, 325],
			123: [2, 325],
			128: [2, 325],
			129: [2, 325],
			130: [2, 325],
			133: [2, 325],
			134: [2, 325],
			135: [2, 325],
			136: [2, 325],
			137: [2, 325],
			141: [2, 325],
			142: [2, 325],
			143: [2, 325],
			144: [2, 325],
			148: [2, 325],
			152: [2, 325],
			156: [2, 325],
			160: [2, 325],
			164: [2, 325],
			168: [2, 325],
			173: [2, 325],
			174: [2, 325],
			175: [2, 325],
			176: [2, 325],
			177: [2, 325],
			178: [2, 325],
			179: [2, 325],
			180: [2, 325],
			181: [2, 325],
			182: [2, 325],
			183: [2, 325],
			187: [2, 325],
			188: [2, 325],
			189: [2, 325],
			190: [2, 325],
			191: [2, 325]
		}, {
			2: [2, 326],
			19: [2, 326],
			21: [2, 326],
			22: [2, 326],
			25: [2, 326],
			28: [2, 326],
			31: [2, 326],
			34: [2, 326],
			36: [2, 326],
			37: [2, 326],
			39: [2, 326],
			40: [2, 326],
			41: [2, 326],
			42: [2, 326],
			43: [2, 326],
			46: [2, 326],
			47: [2, 326],
			48: [2, 326],
			49: [2, 326],
			50: [2, 326],
			51: [2, 326],
			56: [2, 326],
			57: [2, 326],
			58: [2, 326],
			59: [2, 326],
			60: [2, 326],
			65: [2, 326],
			67: [2, 326],
			73: [2, 326],
			78: [2, 326],
			81: [2, 326],
			82: [2, 326],
			93: [2, 326],
			94: [2, 326],
			105: [2, 326],
			106: [2, 326],
			111: [2, 326],
			112: [2, 326],
			113: [2, 326],
			114: [2, 326],
			115: [2, 326],
			116: [2, 326],
			117: [2, 326],
			118: [2, 326],
			119: [2, 326],
			121: [2, 326],
			122: [2, 326],
			123: [2, 326],
			128: [2, 326],
			129: [2, 326],
			130: [2, 326],
			133: [2, 326],
			134: [2, 326],
			135: [2, 326],
			136: [2, 326],
			137: [2, 326],
			141: [2, 326],
			142: [2, 326],
			143: [2, 326],
			144: [2, 326],
			148: [2, 326],
			152: [2, 326],
			156: [2, 326],
			160: [2, 326],
			164: [2, 326],
			168: [2, 326],
			173: [2, 326],
			174: [2, 326],
			175: [2, 326],
			176: [2, 326],
			177: [2, 326],
			178: [2, 326],
			179: [2, 326],
			180: [2, 326],
			181: [2, 326],
			182: [2, 326],
			183: [2, 326],
			187: [2, 326],
			188: [2, 326],
			189: [2, 326],
			190: [2, 326],
			191: [2, 326]
		}, {
			2: [2, 327],
			19: [2, 327],
			21: [2, 327],
			22: [2, 327],
			25: [2, 327],
			28: [2, 327],
			31: [2, 327],
			34: [2, 327],
			36: [2, 327],
			37: [2, 327],
			39: [2, 327],
			40: [2, 327],
			41: [2, 327],
			42: [2, 327],
			43: [2, 327],
			46: [2, 327],
			47: [2, 327],
			48: [2, 327],
			49: [2, 327],
			50: [2, 327],
			51: [2, 327],
			56: [2, 327],
			57: [2, 327],
			58: [2, 327],
			59: [2, 327],
			60: [2, 327],
			65: [2, 327],
			67: [2, 327],
			73: [2, 327],
			78: [2, 327],
			81: [2, 327],
			82: [2, 327],
			93: [2, 327],
			94: [2, 327],
			105: [2, 327],
			106: [2, 327],
			111: [2, 327],
			112: [2, 327],
			113: [2, 327],
			114: [2, 327],
			115: [2, 327],
			116: [2, 327],
			117: [2, 327],
			118: [2, 327],
			119: [2, 327],
			121: [2, 327],
			122: [2, 327],
			123: [2, 327],
			128: [2, 327],
			129: [2, 327],
			130: [2, 327],
			133: [2, 327],
			134: [2, 327],
			135: [2, 327],
			136: [2, 327],
			137: [2, 327],
			141: [2, 327],
			142: [2, 327],
			143: [2, 327],
			144: [2, 327],
			148: [2, 327],
			152: [2, 327],
			156: [2, 327],
			160: [2, 327],
			164: [2, 327],
			168: [2, 327],
			173: [2, 327],
			174: [2, 327],
			175: [2, 327],
			176: [2, 327],
			177: [2, 327],
			178: [2, 327],
			179: [2, 327],
			180: [2, 327],
			181: [2, 327],
			182: [2, 327],
			183: [2, 327],
			187: [2, 327],
			188: [2, 327],
			189: [2, 327],
			190: [2, 327],
			191: [2, 327]
		}, {
			2: [2, 328],
			19: [2, 328],
			21: [2, 328],
			22: [2, 328],
			25: [2, 328],
			28: [2, 328],
			31: [2, 328],
			34: [2, 328],
			36: [2, 328],
			37: [2, 328],
			39: [2, 328],
			40: [2, 328],
			41: [2, 328],
			42: [2, 328],
			43: [2, 328],
			46: [2, 328],
			47: [2, 328],
			48: [2, 328],
			49: [2, 328],
			50: [2, 328],
			51: [2, 328],
			56: [2, 328],
			57: [2, 328],
			58: [2, 328],
			59: [2, 328],
			60: [2, 328],
			65: [2, 328],
			67: [2, 328],
			73: [2, 328],
			78: [2, 328],
			81: [2, 328],
			82: [2, 328],
			93: [2, 328],
			94: [2, 328],
			105: [2, 328],
			106: [2, 328],
			111: [2, 328],
			112: [2, 328],
			113: [2, 328],
			114: [2, 328],
			115: [2, 328],
			116: [2, 328],
			117: [2, 328],
			118: [2, 328],
			119: [2, 328],
			121: [2, 328],
			122: [2, 328],
			123: [2, 328],
			128: [2, 328],
			129: [2, 328],
			130: [2, 328],
			133: [2, 328],
			134: [2, 328],
			135: [2, 328],
			136: [2, 328],
			137: [2, 328],
			141: [2, 328],
			142: [2, 328],
			143: [2, 328],
			144: [2, 328],
			148: [2, 328],
			152: [2, 328],
			156: [2, 328],
			160: [2, 328],
			164: [2, 328],
			168: [2, 328],
			173: [2, 328],
			174: [2, 328],
			175: [2, 328],
			176: [2, 328],
			177: [2, 328],
			178: [2, 328],
			179: [2, 328],
			180: [2, 328],
			181: [2, 328],
			182: [2, 328],
			183: [2, 328],
			187: [2, 328],
			188: [2, 328],
			189: [2, 328],
			190: [2, 328],
			191: [2, 328]
		}, {
			2: [2, 329],
			19: [2, 329],
			21: [2, 329],
			22: [2, 329],
			25: [2, 329],
			28: [2, 329],
			31: [2, 329],
			34: [2, 329],
			36: [2, 329],
			37: [2, 329],
			39: [2, 329],
			40: [2, 329],
			41: [2, 329],
			42: [2, 329],
			43: [2, 329],
			46: [2, 329],
			47: [2, 329],
			48: [2, 329],
			49: [2, 329],
			50: [2, 329],
			51: [2, 329],
			56: [2, 329],
			57: [2, 329],
			58: [2, 329],
			59: [2, 329],
			60: [2, 329],
			65: [2, 329],
			67: [2, 329],
			73: [2, 329],
			78: [2, 329],
			81: [2, 329],
			82: [2, 329],
			93: [2, 329],
			94: [2, 329],
			105: [2, 329],
			106: [2, 329],
			111: [2, 329],
			112: [2, 329],
			113: [2, 329],
			114: [2, 329],
			115: [2, 329],
			116: [2, 329],
			117: [2, 329],
			118: [2, 329],
			119: [2, 329],
			121: [2, 329],
			122: [2, 329],
			123: [2, 329],
			128: [2, 329],
			129: [2, 329],
			130: [2, 329],
			133: [2, 329],
			134: [2, 329],
			135: [2, 329],
			136: [2, 329],
			137: [2, 329],
			141: [2, 329],
			142: [2, 329],
			143: [2, 329],
			144: [2, 329],
			148: [2, 329],
			152: [2, 329],
			156: [2, 329],
			160: [2, 329],
			164: [2, 329],
			168: [2, 329],
			173: [2, 329],
			174: [2, 329],
			175: [2, 329],
			176: [2, 329],
			177: [2, 329],
			178: [2, 329],
			179: [2, 329],
			180: [2, 329],
			181: [2, 329],
			182: [2, 329],
			183: [2, 329],
			187: [2, 329],
			188: [2, 329],
			189: [2, 329],
			190: [2, 329],
			191: [2, 329]
		}, {
			2: [2, 330],
			19: [2, 330],
			21: [2, 330],
			22: [2, 330],
			25: [2, 330],
			28: [2, 330],
			31: [2, 330],
			34: [2, 330],
			36: [2, 330],
			37: [2, 330],
			39: [2, 330],
			40: [2, 330],
			41: [2, 330],
			42: [2, 330],
			43: [2, 330],
			46: [2, 330],
			47: [2, 330],
			48: [2, 330],
			49: [2, 330],
			50: [2, 330],
			51: [2, 330],
			56: [2, 330],
			57: [2, 330],
			58: [2, 330],
			59: [2, 330],
			60: [2, 330],
			65: [2, 330],
			67: [2, 330],
			73: [2, 330],
			78: [2, 330],
			81: [2, 330],
			82: [2, 330],
			93: [2, 330],
			94: [2, 330],
			105: [2, 330],
			106: [2, 330],
			111: [2, 330],
			112: [2, 330],
			113: [2, 330],
			114: [2, 330],
			115: [2, 330],
			116: [2, 330],
			117: [2, 330],
			118: [2, 330],
			119: [2, 330],
			121: [2, 330],
			122: [2, 330],
			123: [2, 330],
			128: [2, 330],
			129: [2, 330],
			130: [2, 330],
			133: [2, 330],
			134: [2, 330],
			135: [2, 330],
			136: [2, 330],
			137: [2, 330],
			141: [2, 330],
			142: [2, 330],
			143: [2, 330],
			144: [2, 330],
			148: [2, 330],
			152: [2, 330],
			156: [2, 330],
			160: [2, 330],
			164: [2, 330],
			168: [2, 330],
			173: [2, 330],
			174: [2, 330],
			175: [2, 330],
			176: [2, 330],
			177: [2, 330],
			178: [2, 330],
			179: [2, 330],
			180: [2, 330],
			181: [2, 330],
			182: [2, 330],
			183: [2, 330],
			187: [2, 330],
			188: [2, 330],
			189: [2, 330],
			190: [2, 330],
			191: [2, 330]
		}, {
			2: [2, 331],
			19: [2, 331],
			21: [2, 331],
			22: [2, 331],
			25: [2, 331],
			28: [2, 331],
			31: [2, 331],
			34: [2, 331],
			36: [2, 331],
			37: [2, 331],
			39: [2, 331],
			40: [2, 331],
			41: [2, 331],
			42: [2, 331],
			43: [2, 331],
			46: [2, 331],
			47: [2, 331],
			48: [2, 331],
			49: [2, 331],
			50: [2, 331],
			51: [2, 331],
			56: [2, 331],
			57: [2, 331],
			58: [2, 331],
			59: [2, 331],
			60: [2, 331],
			65: [2, 331],
			67: [2, 331],
			73: [2, 331],
			78: [2, 331],
			81: [2, 331],
			82: [2, 331],
			93: [2, 331],
			94: [2, 331],
			105: [2, 331],
			106: [2, 331],
			111: [2, 331],
			112: [2, 331],
			113: [2, 331],
			114: [2, 331],
			115: [2, 331],
			116: [2, 331],
			117: [2, 331],
			118: [2, 331],
			119: [2, 331],
			121: [2, 331],
			122: [2, 331],
			123: [2, 331],
			128: [2, 331],
			129: [2, 331],
			130: [2, 331],
			133: [2, 331],
			134: [2, 331],
			135: [2, 331],
			136: [2, 331],
			137: [2, 331],
			141: [2, 331],
			142: [2, 331],
			143: [2, 331],
			144: [2, 331],
			148: [2, 331],
			152: [2, 331],
			156: [2, 331],
			160: [2, 331],
			164: [2, 331],
			168: [2, 331],
			173: [2, 331],
			174: [2, 331],
			175: [2, 331],
			176: [2, 331],
			177: [2, 331],
			178: [2, 331],
			179: [2, 331],
			180: [2, 331],
			181: [2, 331],
			182: [2, 331],
			183: [2, 331],
			187: [2, 331],
			188: [2, 331],
			189: [2, 331],
			190: [2, 331],
			191: [2, 331]
		}, {
			2: [2, 332],
			19: [2, 332],
			21: [2, 332],
			22: [2, 332],
			25: [2, 332],
			28: [2, 332],
			31: [2, 332],
			34: [2, 332],
			36: [2, 332],
			37: [2, 332],
			39: [2, 332],
			40: [2, 332],
			41: [2, 332],
			42: [2, 332],
			43: [2, 332],
			46: [2, 332],
			47: [2, 332],
			48: [2, 332],
			49: [2, 332],
			50: [2, 332],
			51: [2, 332],
			56: [2, 332],
			57: [2, 332],
			58: [2, 332],
			59: [2, 332],
			60: [2, 332],
			65: [2, 332],
			67: [2, 332],
			73: [2, 332],
			78: [2, 332],
			81: [2, 332],
			82: [2, 332],
			93: [2, 332],
			94: [2, 332],
			105: [2, 332],
			106: [2, 332],
			111: [2, 332],
			112: [2, 332],
			113: [2, 332],
			114: [2, 332],
			115: [2, 332],
			116: [2, 332],
			117: [2, 332],
			118: [2, 332],
			119: [2, 332],
			121: [2, 332],
			122: [2, 332],
			123: [2, 332],
			128: [2, 332],
			129: [2, 332],
			130: [2, 332],
			133: [2, 332],
			134: [2, 332],
			135: [2, 332],
			136: [2, 332],
			137: [2, 332],
			141: [2, 332],
			142: [2, 332],
			143: [2, 332],
			144: [2, 332],
			148: [2, 332],
			152: [2, 332],
			156: [2, 332],
			160: [2, 332],
			164: [2, 332],
			168: [2, 332],
			173: [2, 332],
			174: [2, 332],
			175: [2, 332],
			176: [2, 332],
			177: [2, 332],
			178: [2, 332],
			179: [2, 332],
			180: [2, 332],
			181: [2, 332],
			182: [2, 332],
			183: [2, 332],
			187: [2, 332],
			188: [2, 332],
			189: [2, 332],
			190: [2, 332],
			191: [2, 332]
		}, {
			2: [2, 333],
			19: [2, 333],
			21: [2, 333],
			22: [2, 333],
			25: [2, 333],
			28: [2, 333],
			31: [2, 333],
			34: [2, 333],
			36: [2, 333],
			37: [2, 333],
			39: [2, 333],
			40: [2, 333],
			41: [2, 333],
			42: [2, 333],
			43: [2, 333],
			46: [2, 333],
			47: [2, 333],
			48: [2, 333],
			49: [2, 333],
			50: [2, 333],
			51: [2, 333],
			56: [2, 333],
			57: [2, 333],
			58: [2, 333],
			59: [2, 333],
			60: [2, 333],
			65: [2, 333],
			67: [2, 333],
			73: [2, 333],
			78: [2, 333],
			81: [2, 333],
			82: [2, 333],
			93: [2, 333],
			94: [2, 333],
			105: [2, 333],
			106: [2, 333],
			111: [2, 333],
			112: [2, 333],
			113: [2, 333],
			114: [2, 333],
			115: [2, 333],
			116: [2, 333],
			117: [2, 333],
			118: [2, 333],
			119: [2, 333],
			121: [2, 333],
			122: [2, 333],
			123: [2, 333],
			128: [2, 333],
			129: [2, 333],
			130: [2, 333],
			133: [2, 333],
			134: [2, 333],
			135: [2, 333],
			136: [2, 333],
			137: [2, 333],
			141: [2, 333],
			142: [2, 333],
			143: [2, 333],
			144: [2, 333],
			148: [2, 333],
			152: [2, 333],
			156: [2, 333],
			160: [2, 333],
			164: [2, 333],
			168: [2, 333],
			173: [2, 333],
			174: [2, 333],
			175: [2, 333],
			176: [2, 333],
			177: [2, 333],
			178: [2, 333],
			179: [2, 333],
			180: [2, 333],
			181: [2, 333],
			182: [2, 333],
			183: [2, 333],
			187: [2, 333],
			188: [2, 333],
			189: [2, 333],
			190: [2, 333],
			191: [2, 333]
		}, {
			2: [2, 334],
			19: [2, 334],
			21: [2, 334],
			22: [2, 334],
			25: [2, 334],
			28: [2, 334],
			31: [2, 334],
			34: [2, 334],
			36: [2, 334],
			37: [2, 334],
			39: [2, 334],
			40: [2, 334],
			41: [2, 334],
			42: [2, 334],
			43: [2, 334],
			46: [2, 334],
			47: [2, 334],
			48: [2, 334],
			49: [2, 334],
			50: [2, 334],
			51: [2, 334],
			56: [2, 334],
			57: [2, 334],
			58: [2, 334],
			59: [2, 334],
			60: [2, 334],
			65: [2, 334],
			67: [2, 334],
			73: [2, 334],
			78: [2, 334],
			81: [2, 334],
			82: [2, 334],
			93: [2, 334],
			94: [2, 334],
			105: [2, 334],
			106: [2, 334],
			111: [2, 334],
			112: [2, 334],
			113: [2, 334],
			114: [2, 334],
			115: [2, 334],
			116: [2, 334],
			117: [2, 334],
			118: [2, 334],
			119: [2, 334],
			121: [2, 334],
			122: [2, 334],
			123: [2, 334],
			128: [2, 334],
			129: [2, 334],
			130: [2, 334],
			133: [2, 334],
			134: [2, 334],
			135: [2, 334],
			136: [2, 334],
			137: [2, 334],
			141: [2, 334],
			142: [2, 334],
			143: [2, 334],
			144: [2, 334],
			148: [2, 334],
			152: [2, 334],
			156: [2, 334],
			160: [2, 334],
			164: [2, 334],
			168: [2, 334],
			173: [2, 334],
			174: [2, 334],
			175: [2, 334],
			176: [2, 334],
			177: [2, 334],
			178: [2, 334],
			179: [2, 334],
			180: [2, 334],
			181: [2, 334],
			182: [2, 334],
			183: [2, 334],
			187: [2, 334],
			188: [2, 334],
			189: [2, 334],
			190: [2, 334],
			191: [2, 334]
		}, {
			2: [2, 335],
			19: [2, 335],
			21: [2, 335],
			22: [2, 335],
			25: [2, 335],
			28: [2, 335],
			31: [2, 335],
			34: [2, 335],
			36: [2, 335],
			37: [2, 335],
			39: [2, 335],
			40: [2, 335],
			41: [2, 335],
			42: [2, 335],
			43: [2, 335],
			46: [2, 335],
			47: [2, 335],
			48: [2, 335],
			49: [2, 335],
			50: [2, 335],
			51: [2, 335],
			56: [2, 335],
			57: [2, 335],
			58: [2, 335],
			59: [2, 335],
			60: [2, 335],
			65: [2, 335],
			67: [2, 335],
			73: [2, 335],
			78: [2, 335],
			81: [2, 335],
			82: [2, 335],
			93: [2, 335],
			94: [2, 335],
			105: [2, 335],
			106: [2, 335],
			111: [2, 335],
			112: [2, 335],
			113: [2, 335],
			114: [2, 335],
			115: [2, 335],
			116: [2, 335],
			117: [2, 335],
			118: [2, 335],
			119: [2, 335],
			121: [2, 335],
			122: [2, 335],
			123: [2, 335],
			128: [2, 335],
			129: [2, 335],
			130: [2, 335],
			133: [2, 335],
			134: [2, 335],
			135: [2, 335],
			136: [2, 335],
			137: [2, 335],
			141: [2, 335],
			142: [2, 335],
			143: [2, 335],
			144: [2, 335],
			148: [2, 335],
			152: [2, 335],
			156: [2, 335],
			160: [2, 335],
			164: [2, 335],
			168: [2, 335],
			173: [2, 335],
			174: [2, 335],
			175: [2, 335],
			176: [2, 335],
			177: [2, 335],
			178: [2, 335],
			179: [2, 335],
			180: [2, 335],
			181: [2, 335],
			182: [2, 335],
			183: [2, 335],
			187: [2, 335],
			188: [2, 335],
			189: [2, 335],
			190: [2, 335],
			191: [2, 335]
		}, {
			2: [2, 336],
			19: [2, 336],
			21: [2, 336],
			22: [2, 336],
			25: [2, 336],
			28: [2, 336],
			31: [2, 336],
			34: [2, 336],
			36: [2, 336],
			37: [2, 336],
			39: [2, 336],
			40: [2, 336],
			41: [2, 336],
			42: [2, 336],
			43: [2, 336],
			46: [2, 336],
			47: [2, 336],
			48: [2, 336],
			49: [2, 336],
			50: [2, 336],
			51: [2, 336],
			56: [2, 336],
			57: [2, 336],
			58: [2, 336],
			59: [2, 336],
			60: [2, 336],
			65: [2, 336],
			67: [2, 336],
			73: [2, 336],
			78: [2, 336],
			81: [2, 336],
			82: [2, 336],
			93: [2, 336],
			94: [2, 336],
			105: [2, 336],
			106: [2, 336],
			111: [2, 336],
			112: [2, 336],
			113: [2, 336],
			114: [2, 336],
			115: [2, 336],
			116: [2, 336],
			117: [2, 336],
			118: [2, 336],
			119: [2, 336],
			121: [2, 336],
			122: [2, 336],
			123: [2, 336],
			128: [2, 336],
			129: [2, 336],
			130: [2, 336],
			133: [2, 336],
			134: [2, 336],
			135: [2, 336],
			136: [2, 336],
			137: [2, 336],
			141: [2, 336],
			142: [2, 336],
			143: [2, 336],
			144: [2, 336],
			148: [2, 336],
			152: [2, 336],
			156: [2, 336],
			160: [2, 336],
			164: [2, 336],
			168: [2, 336],
			173: [2, 336],
			174: [2, 336],
			175: [2, 336],
			176: [2, 336],
			177: [2, 336],
			178: [2, 336],
			179: [2, 336],
			180: [2, 336],
			181: [2, 336],
			182: [2, 336],
			183: [2, 336],
			187: [2, 336],
			188: [2, 336],
			189: [2, 336],
			190: [2, 336],
			191: [2, 336]
		}, {
			2: [2, 337],
			19: [2, 337],
			21: [2, 337],
			22: [2, 337],
			25: [2, 337],
			28: [2, 337],
			31: [2, 337],
			34: [2, 337],
			36: [2, 337],
			37: [2, 337],
			39: [2, 337],
			40: [2, 337],
			41: [2, 337],
			42: [2, 337],
			43: [2, 337],
			46: [2, 337],
			47: [2, 337],
			48: [2, 337],
			49: [2, 337],
			50: [2, 337],
			51: [2, 337],
			56: [2, 337],
			57: [2, 337],
			58: [2, 337],
			59: [2, 337],
			60: [2, 337],
			65: [2, 337],
			67: [2, 337],
			73: [2, 337],
			78: [2, 337],
			81: [2, 337],
			82: [2, 337],
			93: [2, 337],
			94: [2, 337],
			105: [2, 337],
			106: [2, 337],
			111: [2, 337],
			112: [2, 337],
			113: [2, 337],
			114: [2, 337],
			115: [2, 337],
			116: [2, 337],
			117: [2, 337],
			118: [2, 337],
			119: [2, 337],
			121: [2, 337],
			122: [2, 337],
			123: [2, 337],
			128: [2, 337],
			129: [2, 337],
			130: [2, 337],
			133: [2, 337],
			134: [2, 337],
			135: [2, 337],
			136: [2, 337],
			137: [2, 337],
			141: [2, 337],
			142: [2, 337],
			143: [2, 337],
			144: [2, 337],
			148: [2, 337],
			152: [2, 337],
			156: [2, 337],
			160: [2, 337],
			164: [2, 337],
			168: [2, 337],
			173: [2, 337],
			174: [2, 337],
			175: [2, 337],
			176: [2, 337],
			177: [2, 337],
			178: [2, 337],
			179: [2, 337],
			180: [2, 337],
			181: [2, 337],
			182: [2, 337],
			183: [2, 337],
			187: [2, 337],
			188: [2, 337],
			189: [2, 337],
			190: [2, 337],
			191: [2, 337]
		}, {
			2: [2, 338],
			19: [2, 338],
			21: [2, 338],
			22: [2, 338],
			25: [2, 338],
			28: [2, 338],
			31: [2, 338],
			34: [2, 338],
			36: [2, 338],
			37: [2, 338],
			39: [2, 338],
			40: [2, 338],
			41: [2, 338],
			42: [2, 338],
			43: [2, 338],
			46: [2, 338],
			47: [2, 338],
			48: [2, 338],
			49: [2, 338],
			50: [2, 338],
			51: [2, 338],
			56: [2, 338],
			57: [2, 338],
			58: [2, 338],
			59: [2, 338],
			60: [2, 338],
			65: [2, 338],
			67: [2, 338],
			73: [2, 338],
			78: [2, 338],
			81: [2, 338],
			82: [2, 338],
			93: [2, 338],
			94: [2, 338],
			105: [2, 338],
			106: [2, 338],
			111: [2, 338],
			112: [2, 338],
			113: [2, 338],
			114: [2, 338],
			115: [2, 338],
			116: [2, 338],
			117: [2, 338],
			118: [2, 338],
			119: [2, 338],
			121: [2, 338],
			122: [2, 338],
			123: [2, 338],
			128: [2, 338],
			129: [2, 338],
			130: [2, 338],
			133: [2, 338],
			134: [2, 338],
			135: [2, 338],
			136: [2, 338],
			137: [2, 338],
			141: [2, 338],
			142: [2, 338],
			143: [2, 338],
			144: [2, 338],
			148: [2, 338],
			152: [2, 338],
			156: [2, 338],
			160: [2, 338],
			164: [2, 338],
			168: [2, 338],
			173: [2, 338],
			174: [2, 338],
			175: [2, 338],
			176: [2, 338],
			177: [2, 338],
			178: [2, 338],
			179: [2, 338],
			180: [2, 338],
			181: [2, 338],
			182: [2, 338],
			183: [2, 338],
			187: [2, 338],
			188: [2, 338],
			189: [2, 338],
			190: [2, 338],
			191: [2, 338]
		}, {
			2: [2, 339],
			19: [2, 339],
			21: [2, 339],
			22: [2, 339],
			25: [2, 339],
			28: [2, 339],
			31: [2, 339],
			34: [2, 339],
			36: [2, 339],
			37: [2, 339],
			39: [2, 339],
			40: [2, 339],
			41: [2, 339],
			42: [2, 339],
			43: [2, 339],
			46: [2, 339],
			47: [2, 339],
			48: [2, 339],
			49: [2, 339],
			50: [2, 339],
			51: [2, 339],
			56: [2, 339],
			57: [2, 339],
			58: [2, 339],
			59: [2, 339],
			60: [2, 339],
			65: [2, 339],
			67: [2, 339],
			73: [2, 339],
			78: [2, 339],
			81: [2, 339],
			82: [2, 339],
			93: [2, 339],
			94: [2, 339],
			105: [2, 339],
			106: [2, 339],
			111: [2, 339],
			112: [2, 339],
			113: [2, 339],
			114: [2, 339],
			115: [2, 339],
			116: [2, 339],
			117: [2, 339],
			118: [2, 339],
			119: [2, 339],
			121: [2, 339],
			122: [2, 339],
			123: [2, 339],
			128: [2, 339],
			129: [2, 339],
			130: [2, 339],
			133: [2, 339],
			134: [2, 339],
			135: [2, 339],
			136: [2, 339],
			137: [2, 339],
			141: [2, 339],
			142: [2, 339],
			143: [2, 339],
			144: [2, 339],
			148: [2, 339],
			152: [2, 339],
			156: [2, 339],
			160: [2, 339],
			164: [2, 339],
			168: [2, 339],
			173: [2, 339],
			174: [2, 339],
			175: [2, 339],
			176: [2, 339],
			177: [2, 339],
			178: [2, 339],
			179: [2, 339],
			180: [2, 339],
			181: [2, 339],
			182: [2, 339],
			183: [2, 339],
			187: [2, 339],
			188: [2, 339],
			189: [2, 339],
			190: [2, 339],
			191: [2, 339]
		}, {
			2: [2, 340],
			19: [2, 340],
			21: [2, 340],
			22: [2, 340],
			25: [2, 340],
			28: [2, 340],
			31: [2, 340],
			34: [2, 340],
			36: [2, 340],
			37: [2, 340],
			39: [2, 340],
			40: [2, 340],
			41: [2, 340],
			42: [2, 340],
			43: [2, 340],
			46: [2, 340],
			47: [2, 340],
			48: [2, 340],
			49: [2, 340],
			50: [2, 340],
			51: [2, 340],
			56: [2, 340],
			57: [2, 340],
			58: [2, 340],
			59: [2, 340],
			60: [2, 340],
			65: [2, 340],
			67: [2, 340],
			73: [2, 340],
			78: [2, 340],
			81: [2, 340],
			82: [2, 340],
			93: [2, 340],
			94: [2, 340],
			105: [2, 340],
			106: [2, 340],
			111: [2, 340],
			112: [2, 340],
			113: [2, 340],
			114: [2, 340],
			115: [2, 340],
			116: [2, 340],
			117: [2, 340],
			118: [2, 340],
			119: [2, 340],
			121: [2, 340],
			122: [2, 340],
			123: [2, 340],
			128: [2, 340],
			129: [2, 340],
			130: [2, 340],
			133: [2, 340],
			134: [2, 340],
			135: [2, 340],
			136: [2, 340],
			137: [2, 340],
			141: [2, 340],
			142: [2, 340],
			143: [2, 340],
			144: [2, 340],
			148: [2, 340],
			152: [2, 340],
			156: [2, 340],
			160: [2, 340],
			164: [2, 340],
			168: [2, 340],
			173: [2, 340],
			174: [2, 340],
			175: [2, 340],
			176: [2, 340],
			177: [2, 340],
			178: [2, 340],
			179: [2, 340],
			180: [2, 340],
			181: [2, 340],
			182: [2, 340],
			183: [2, 340],
			187: [2, 340],
			188: [2, 340],
			189: [2, 340],
			190: [2, 340],
			191: [2, 340]
		}, {
			2: [2, 341],
			19: [2, 341],
			21: [2, 341],
			22: [2, 341],
			25: [2, 341],
			28: [2, 341],
			31: [2, 341],
			34: [2, 341],
			36: [2, 341],
			37: [2, 341],
			39: [2, 341],
			40: [2, 341],
			41: [2, 341],
			42: [2, 341],
			43: [2, 341],
			46: [2, 341],
			47: [2, 341],
			48: [2, 341],
			49: [2, 341],
			50: [2, 341],
			51: [2, 341],
			56: [2, 341],
			57: [2, 341],
			58: [2, 341],
			59: [2, 341],
			60: [2, 341],
			65: [2, 341],
			67: [2, 341],
			73: [2, 341],
			78: [2, 341],
			81: [2, 341],
			82: [2, 341],
			93: [2, 341],
			94: [2, 341],
			105: [2, 341],
			106: [2, 341],
			111: [2, 341],
			112: [2, 341],
			113: [2, 341],
			114: [2, 341],
			115: [2, 341],
			116: [2, 341],
			117: [2, 341],
			118: [2, 341],
			119: [2, 341],
			121: [2, 341],
			122: [2, 341],
			123: [2, 341],
			128: [2, 341],
			129: [2, 341],
			130: [2, 341],
			133: [2, 341],
			134: [2, 341],
			135: [2, 341],
			136: [2, 341],
			137: [2, 341],
			141: [2, 341],
			142: [2, 341],
			143: [2, 341],
			144: [2, 341],
			148: [2, 341],
			152: [2, 341],
			156: [2, 341],
			160: [2, 341],
			164: [2, 341],
			168: [2, 341],
			173: [2, 341],
			174: [2, 341],
			175: [2, 341],
			176: [2, 341],
			177: [2, 341],
			178: [2, 341],
			179: [2, 341],
			180: [2, 341],
			181: [2, 341],
			182: [2, 341],
			183: [2, 341],
			187: [2, 341],
			188: [2, 341],
			189: [2, 341],
			190: [2, 341],
			191: [2, 341]
		}, {
			2: [2, 342],
			19: [2, 342],
			21: [2, 342],
			22: [2, 342],
			25: [2, 342],
			28: [2, 342],
			31: [2, 342],
			34: [2, 342],
			36: [2, 342],
			37: [2, 342],
			39: [2, 342],
			40: [2, 342],
			41: [2, 342],
			42: [2, 342],
			43: [2, 342],
			46: [2, 342],
			47: [2, 342],
			48: [2, 342],
			49: [2, 342],
			50: [2, 342],
			51: [2, 342],
			56: [2, 342],
			57: [2, 342],
			58: [2, 342],
			59: [2, 342],
			60: [2, 342],
			65: [2, 342],
			67: [2, 342],
			73: [2, 342],
			78: [2, 342],
			81: [2, 342],
			82: [2, 342],
			93: [2, 342],
			94: [2, 342],
			105: [2, 342],
			106: [2, 342],
			111: [2, 342],
			112: [2, 342],
			113: [2, 342],
			114: [2, 342],
			115: [2, 342],
			116: [2, 342],
			117: [2, 342],
			118: [2, 342],
			119: [2, 342],
			121: [2, 342],
			122: [2, 342],
			123: [2, 342],
			128: [2, 342],
			129: [2, 342],
			130: [2, 342],
			133: [2, 342],
			134: [2, 342],
			135: [2, 342],
			136: [2, 342],
			137: [2, 342],
			141: [2, 342],
			142: [2, 342],
			143: [2, 342],
			144: [2, 342],
			148: [2, 342],
			152: [2, 342],
			156: [2, 342],
			160: [2, 342],
			164: [2, 342],
			168: [2, 342],
			173: [2, 342],
			174: [2, 342],
			175: [2, 342],
			176: [2, 342],
			177: [2, 342],
			178: [2, 342],
			179: [2, 342],
			180: [2, 342],
			181: [2, 342],
			182: [2, 342],
			183: [2, 342],
			187: [2, 342],
			188: [2, 342],
			189: [2, 342],
			190: [2, 342],
			191: [2, 342]
		}, {
			2: [2, 343],
			19: [2, 343],
			21: [2, 343],
			22: [2, 343],
			25: [2, 343],
			28: [2, 343],
			31: [2, 343],
			34: [2, 343],
			36: [2, 343],
			37: [2, 343],
			39: [2, 343],
			40: [2, 343],
			41: [2, 343],
			42: [2, 343],
			43: [2, 343],
			46: [2, 343],
			47: [2, 343],
			48: [2, 343],
			49: [2, 343],
			50: [2, 343],
			51: [2, 343],
			56: [2, 343],
			57: [2, 343],
			58: [2, 343],
			59: [2, 343],
			60: [2, 343],
			65: [2, 343],
			67: [2, 343],
			73: [2, 343],
			78: [2, 343],
			81: [2, 343],
			82: [2, 343],
			93: [2, 343],
			94: [2, 343],
			105: [2, 343],
			106: [2, 343],
			111: [2, 343],
			112: [2, 343],
			113: [2, 343],
			114: [2, 343],
			115: [2, 343],
			116: [2, 343],
			117: [2, 343],
			118: [2, 343],
			119: [2, 343],
			121: [2, 343],
			122: [2, 343],
			123: [2, 343],
			128: [2, 343],
			129: [2, 343],
			130: [2, 343],
			133: [2, 343],
			134: [2, 343],
			135: [2, 343],
			136: [2, 343],
			137: [2, 343],
			141: [2, 343],
			142: [2, 343],
			143: [2, 343],
			144: [2, 343],
			148: [2, 343],
			152: [2, 343],
			156: [2, 343],
			160: [2, 343],
			164: [2, 343],
			168: [2, 343],
			173: [2, 343],
			174: [2, 343],
			175: [2, 343],
			176: [2, 343],
			177: [2, 343],
			178: [2, 343],
			179: [2, 343],
			180: [2, 343],
			181: [2, 343],
			182: [2, 343],
			183: [2, 343],
			187: [2, 343],
			188: [2, 343],
			189: [2, 343],
			190: [2, 343],
			191: [2, 343]
		}, {
			2: [2, 344],
			19: [2, 344],
			21: [2, 344],
			22: [2, 344],
			25: [2, 344],
			28: [2, 344],
			31: [2, 344],
			34: [2, 344],
			36: [2, 344],
			37: [2, 344],
			39: [2, 344],
			40: [2, 344],
			41: [2, 344],
			42: [2, 344],
			43: [2, 344],
			46: [2, 344],
			47: [2, 344],
			48: [2, 344],
			49: [2, 344],
			50: [2, 344],
			51: [2, 344],
			56: [2, 344],
			57: [2, 344],
			58: [2, 344],
			59: [2, 344],
			60: [2, 344],
			65: [2, 344],
			67: [2, 344],
			73: [2, 344],
			78: [2, 344],
			81: [2, 344],
			82: [2, 344],
			93: [2, 344],
			94: [2, 344],
			105: [2, 344],
			106: [2, 344],
			111: [2, 344],
			112: [2, 344],
			113: [2, 344],
			114: [2, 344],
			115: [2, 344],
			116: [2, 344],
			117: [2, 344],
			118: [2, 344],
			119: [2, 344],
			121: [2, 344],
			122: [2, 344],
			123: [2, 344],
			128: [2, 344],
			129: [2, 344],
			130: [2, 344],
			133: [2, 344],
			134: [2, 344],
			135: [2, 344],
			136: [2, 344],
			137: [2, 344],
			141: [2, 344],
			142: [2, 344],
			143: [2, 344],
			144: [2, 344],
			148: [2, 344],
			152: [2, 344],
			156: [2, 344],
			160: [2, 344],
			164: [2, 344],
			168: [2, 344],
			173: [2, 344],
			174: [2, 344],
			175: [2, 344],
			176: [2, 344],
			177: [2, 344],
			178: [2, 344],
			179: [2, 344],
			180: [2, 344],
			181: [2, 344],
			182: [2, 344],
			183: [2, 344],
			187: [2, 344],
			188: [2, 344],
			189: [2, 344],
			190: [2, 344],
			191: [2, 344]
		}, {
			2: [2, 345],
			19: [2, 345],
			21: [2, 345],
			22: [2, 345],
			25: [2, 345],
			28: [2, 345],
			31: [2, 345],
			34: [2, 345],
			36: [2, 345],
			37: [2, 345],
			39: [2, 345],
			40: [2, 345],
			41: [2, 345],
			42: [2, 345],
			43: [2, 345],
			46: [2, 345],
			47: [2, 345],
			48: [2, 345],
			49: [2, 345],
			50: [2, 345],
			51: [2, 345],
			56: [2, 345],
			57: [2, 345],
			58: [2, 345],
			59: [2, 345],
			60: [2, 345],
			65: [2, 345],
			67: [2, 345],
			73: [2, 345],
			78: [2, 345],
			81: [2, 345],
			82: [2, 345],
			93: [2, 345],
			94: [2, 345],
			105: [2, 345],
			106: [2, 345],
			111: [2, 345],
			112: [2, 345],
			113: [2, 345],
			114: [2, 345],
			115: [2, 345],
			116: [2, 345],
			117: [2, 345],
			118: [2, 345],
			119: [2, 345],
			121: [2, 345],
			122: [2, 345],
			123: [2, 345],
			128: [2, 345],
			129: [2, 345],
			130: [2, 345],
			133: [2, 345],
			134: [2, 345],
			135: [2, 345],
			136: [2, 345],
			137: [2, 345],
			141: [2, 345],
			142: [2, 345],
			143: [2, 345],
			144: [2, 345],
			148: [2, 345],
			152: [2, 345],
			156: [2, 345],
			160: [2, 345],
			164: [2, 345],
			168: [2, 345],
			173: [2, 345],
			174: [2, 345],
			175: [2, 345],
			176: [2, 345],
			177: [2, 345],
			178: [2, 345],
			179: [2, 345],
			180: [2, 345],
			181: [2, 345],
			182: [2, 345],
			183: [2, 345],
			187: [2, 345],
			188: [2, 345],
			189: [2, 345],
			190: [2, 345],
			191: [2, 345]
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 430,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 431,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 432,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 433,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 434,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 435,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 436,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 437,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 438,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 439,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 440,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 441,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 442,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 443,
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 444,
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 445,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 446,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 447,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			39: [1, 448]
		}, {
			19: [2, 72],
			21: [2, 72],
			22: [2, 72],
			28: [2, 72],
			34: [2, 72],
			36: [2, 72],
			37: [2, 72],
			40: [2, 72],
			41: [2, 72],
			42: [2, 72],
			43: [2, 72],
			47: [2, 72],
			48: [2, 72],
			49: [2, 72],
			50: [2, 72],
			51: [2, 72],
			56: [2, 72],
			58: [2, 72],
			59: [2, 72],
			60: [2, 72],
			65: [2, 72],
			67: [2, 72],
			73: [2, 72],
			78: [2, 72],
			81: [2, 72],
			94: [2, 72],
			105: [2, 72],
			106: [2, 72],
			111: [2, 72],
			112: [2, 72],
			113: [2, 72],
			114: [2, 72],
			115: [2, 72],
			116: [2, 72],
			117: [2, 72],
			118: [2, 72],
			119: [2, 72],
			122: [2, 72],
			174: [2, 72],
			187: [2, 72],
			188: [2, 72],
			189: [2, 72],
			190: [2, 72],
			191: [2, 72]
		}, {
			25: [1, 242],
			39: [1, 449]
		}, {
			19: [2, 73],
			21: [2, 73],
			22: [2, 73],
			28: [2, 73],
			34: [2, 73],
			36: [2, 73],
			37: [2, 73],
			40: [2, 73],
			41: [2, 73],
			42: [2, 73],
			43: [2, 73],
			47: [2, 73],
			48: [2, 73],
			49: [2, 73],
			50: [2, 73],
			51: [2, 73],
			56: [2, 73],
			58: [2, 73],
			59: [2, 73],
			60: [2, 73],
			65: [2, 73],
			67: [2, 73],
			73: [2, 73],
			78: [2, 73],
			81: [2, 73],
			94: [2, 73],
			105: [2, 73],
			106: [2, 73],
			111: [2, 73],
			112: [2, 73],
			113: [2, 73],
			114: [2, 73],
			115: [2, 73],
			116: [2, 73],
			117: [2, 73],
			118: [2, 73],
			119: [2, 73],
			122: [2, 73],
			174: [2, 73],
			187: [2, 73],
			188: [2, 73],
			189: [2, 73],
			190: [2, 73],
			191: [2, 73]
		}, {
			19: [2, 74],
			21: [2, 74],
			22: [2, 74],
			28: [2, 74],
			34: [2, 74],
			36: [2, 74],
			37: [2, 74],
			40: [2, 74],
			41: [2, 74],
			42: [2, 74],
			43: [2, 74],
			47: [2, 74],
			48: [2, 74],
			49: [2, 74],
			50: [2, 74],
			51: [2, 74],
			56: [2, 74],
			58: [2, 74],
			59: [2, 74],
			60: [2, 74],
			65: [2, 74],
			67: [2, 74],
			73: [2, 74],
			78: [2, 74],
			81: [2, 74],
			94: [2, 74],
			105: [2, 74],
			106: [2, 74],
			111: [2, 74],
			112: [2, 74],
			113: [2, 74],
			114: [2, 74],
			115: [2, 74],
			116: [2, 74],
			117: [2, 74],
			118: [2, 74],
			119: [2, 74],
			122: [2, 74],
			174: [2, 74],
			187: [2, 74],
			188: [2, 74],
			189: [2, 74],
			190: [2, 74],
			191: [2, 74]
		}, {
			19: [2, 75],
			21: [2, 75],
			22: [2, 75],
			28: [2, 75],
			34: [2, 75],
			36: [2, 75],
			37: [2, 75],
			40: [2, 75],
			41: [2, 75],
			42: [2, 75],
			43: [2, 75],
			47: [2, 75],
			48: [2, 75],
			49: [2, 75],
			50: [2, 75],
			51: [2, 75],
			56: [2, 75],
			58: [2, 75],
			59: [2, 75],
			60: [2, 75],
			62: 450,
			64: [1, 334],
			65: [2, 75],
			67: [2, 75],
			73: [2, 75],
			78: [2, 75],
			81: [2, 75],
			94: [2, 75],
			105: [2, 75],
			106: [2, 75],
			111: [2, 75],
			112: [2, 75],
			113: [2, 75],
			114: [2, 75],
			115: [2, 75],
			116: [2, 75],
			117: [2, 75],
			118: [2, 75],
			119: [2, 75],
			122: [2, 75],
			174: [2, 75],
			187: [2, 75],
			188: [2, 75],
			189: [2, 75],
			190: [2, 75],
			191: [2, 75]
		}, {
			19: [2, 76],
			21: [2, 76],
			22: [2, 76],
			28: [2, 76],
			34: [2, 76],
			36: [2, 76],
			37: [2, 76],
			40: [2, 76],
			41: [2, 76],
			42: [2, 76],
			43: [2, 76],
			47: [2, 76],
			48: [2, 76],
			49: [2, 76],
			50: [2, 76],
			51: [2, 76],
			56: [2, 76],
			58: [2, 76],
			59: [2, 76],
			60: [2, 76],
			65: [2, 76],
			67: [2, 76],
			73: [2, 76],
			78: [2, 76],
			81: [2, 76],
			94: [2, 76],
			105: [2, 76],
			106: [2, 76],
			111: [2, 76],
			112: [2, 76],
			113: [2, 76],
			114: [2, 76],
			115: [2, 76],
			116: [2, 76],
			117: [2, 76],
			118: [2, 76],
			119: [2, 76],
			122: [2, 76],
			174: [2, 76],
			187: [2, 76],
			188: [2, 76],
			189: [2, 76],
			190: [2, 76],
			191: [2, 76]
		}, {
			37: [1, 451]
		}, {
			4: 452,
			19: [1, 23]
		}, {
			2: [2, 278],
			25: [2, 278],
			34: [2, 278]
		}, {
			2: [2, 279],
			25: [2, 279],
			34: [2, 279]
		}, {
			57: [1, 453]
		}, {
			2: [2, 264],
			25: [2, 264],
			34: [2, 264],
			160: [1, 252],
			164: [2, 264],
			168: [2, 264]
		}, {
			25: [1, 242],
			82: [1, 454]
		}, {
			2: [2, 146],
			25: [2, 146],
			31: [2, 146],
			34: [2, 146],
			37: [2, 146],
			46: [2, 146],
			81: [2, 146],
			93: [2, 146],
			105: [2, 146],
			106: [2, 146],
			116: [2, 146],
			117: [2, 146],
			121: [2, 146],
			122: [2, 146],
			123: [2, 146],
			128: [2, 146],
			129: [2, 146],
			130: [2, 146],
			133: [2, 146],
			134: [2, 146],
			135: [2, 146],
			136: [2, 146],
			137: [2, 146],
			141: [2, 146],
			142: [2, 146],
			143: [2, 146],
			144: [2, 146],
			148: [2, 146],
			152: [2, 146],
			156: [2, 146],
			160: [2, 146],
			164: [2, 146],
			168: [2, 146],
			173: [2, 146],
			174: [2, 146],
			175: [2, 146],
			176: [2, 146],
			177: [2, 146],
			178: [2, 146],
			179: [2, 146],
			180: [2, 146],
			181: [2, 146],
			182: [2, 146],
			183: [2, 146]
		}, {
			2: [2, 147],
			19: [2, 147],
			21: [2, 147],
			22: [2, 147],
			25: [2, 147],
			28: [2, 147],
			31: [2, 147],
			34: [2, 147],
			36: [2, 147],
			37: [2, 147],
			39: [2, 147],
			40: [2, 147],
			41: [2, 147],
			42: [2, 147],
			43: [2, 147],
			46: [2, 147],
			47: [2, 147],
			48: [2, 147],
			49: [2, 147],
			50: [2, 147],
			51: [2, 147],
			56: [2, 147],
			57: [2, 147],
			58: [2, 147],
			59: [2, 147],
			60: [2, 147],
			65: [2, 147],
			67: [2, 147],
			73: [2, 147],
			78: [2, 147],
			81: [2, 147],
			82: [2, 147],
			93: [2, 147],
			94: [2, 147],
			105: [2, 147],
			106: [2, 147],
			111: [2, 147],
			112: [2, 147],
			113: [2, 147],
			114: [2, 147],
			115: [2, 147],
			116: [2, 147],
			117: [2, 147],
			118: [2, 147],
			119: [2, 147],
			121: [2, 147],
			122: [2, 147],
			123: [2, 147],
			128: [2, 147],
			129: [2, 147],
			130: [2, 147],
			133: [2, 147],
			134: [2, 147],
			135: [2, 147],
			136: [2, 147],
			137: [2, 147],
			141: [2, 147],
			142: [2, 147],
			143: [2, 147],
			144: [2, 147],
			148: [2, 147],
			152: [2, 147],
			156: [2, 147],
			160: [2, 147],
			164: [2, 147],
			168: [2, 147],
			173: [2, 147],
			174: [2, 147],
			175: [2, 147],
			176: [2, 147],
			177: [2, 147],
			178: [2, 147],
			179: [2, 147],
			180: [2, 147],
			181: [2, 147],
			182: [2, 147],
			183: [2, 147],
			187: [2, 147],
			188: [2, 147],
			189: [2, 147],
			190: [2, 147],
			191: [2, 147]
		}, {
			2: [2, 149],
			19: [2, 149],
			21: [2, 149],
			22: [2, 149],
			25: [2, 149],
			28: [2, 149],
			31: [2, 149],
			34: [2, 149],
			36: [2, 149],
			37: [2, 149],
			39: [2, 149],
			40: [2, 149],
			41: [2, 149],
			42: [2, 149],
			43: [2, 149],
			46: [2, 149],
			47: [2, 149],
			48: [2, 149],
			49: [2, 149],
			50: [2, 149],
			51: [2, 149],
			56: [2, 149],
			57: [2, 149],
			58: [2, 149],
			59: [2, 149],
			60: [2, 149],
			65: [2, 149],
			67: [2, 149],
			73: [2, 149],
			78: [2, 149],
			81: [2, 149],
			82: [2, 149],
			93: [2, 149],
			94: [2, 149],
			105: [2, 149],
			106: [2, 149],
			111: [2, 149],
			112: [2, 149],
			113: [2, 149],
			114: [2, 149],
			115: [2, 149],
			116: [2, 149],
			117: [2, 149],
			118: [2, 149],
			119: [2, 149],
			121: [2, 149],
			122: [2, 149],
			123: [2, 149],
			128: [2, 149],
			129: [2, 149],
			130: [2, 149],
			133: [2, 149],
			134: [2, 149],
			135: [2, 149],
			136: [2, 149],
			137: [2, 149],
			141: [2, 149],
			142: [2, 149],
			143: [2, 149],
			144: [2, 149],
			148: [2, 149],
			152: [2, 149],
			156: [2, 149],
			160: [2, 149],
			164: [2, 149],
			168: [2, 149],
			173: [2, 149],
			174: [2, 149],
			175: [2, 149],
			176: [2, 149],
			177: [2, 149],
			178: [2, 149],
			179: [2, 149],
			180: [2, 149],
			181: [2, 149],
			182: [2, 149],
			183: [2, 149],
			187: [2, 149],
			188: [2, 149],
			189: [2, 149],
			190: [2, 149],
			191: [2, 149]
		}, {
			25: [1, 456],
			39: [1, 455]
		}, {
			25: [2, 151],
			39: [2, 151]
		}, {
			2: [2, 258],
			25: [2, 258],
			34: [2, 258],
			156: [1, 258],
			160: [2, 258],
			164: [2, 258],
			168: [2, 258]
		}, {
			25: [1, 242],
			82: [1, 457]
		}, {
			2: [2, 133],
			25: [2, 133],
			31: [2, 133],
			34: [2, 133],
			37: [2, 133],
			46: [2, 133],
			81: [2, 133],
			93: [2, 133],
			105: [2, 133],
			106: [2, 133],
			116: [2, 133],
			117: [2, 133],
			121: [2, 133],
			122: [2, 133],
			123: [2, 133],
			128: [2, 133],
			129: [2, 133],
			130: [2, 133],
			133: [2, 133],
			134: [2, 133],
			135: [2, 133],
			136: [2, 133],
			137: [2, 133],
			141: [2, 133],
			142: [2, 133],
			143: [2, 133],
			144: [2, 133],
			148: [2, 133],
			152: [2, 133],
			156: [2, 133],
			160: [2, 133],
			164: [2, 133],
			168: [2, 133],
			173: [2, 133],
			174: [2, 133],
			175: [2, 133],
			176: [2, 133],
			177: [2, 133],
			178: [2, 133],
			179: [2, 133],
			180: [2, 133],
			181: [2, 133],
			182: [2, 133],
			183: [2, 133]
		}, {
			2: [2, 134],
			25: [2, 134],
			31: [2, 134],
			34: [2, 134],
			37: [2, 134],
			46: [2, 134],
			81: [2, 134],
			93: [2, 134],
			105: [2, 134],
			106: [2, 134],
			116: [2, 134],
			117: [2, 134],
			121: [2, 134],
			122: [2, 134],
			123: [2, 134],
			128: [2, 134],
			129: [2, 134],
			130: [2, 134],
			133: [2, 134],
			134: [2, 134],
			135: [2, 134],
			136: [2, 134],
			137: [2, 134],
			141: [2, 134],
			142: [2, 134],
			143: [2, 134],
			144: [2, 134],
			148: [2, 134],
			152: [2, 134],
			156: [2, 134],
			160: [2, 134],
			164: [2, 134],
			168: [2, 134],
			173: [2, 134],
			174: [2, 134],
			175: [2, 134],
			176: [2, 134],
			177: [2, 134],
			178: [2, 134],
			179: [2, 134],
			180: [2, 134],
			181: [2, 134],
			182: [2, 134],
			183: [2, 134]
		}, {
			2: [2, 252],
			25: [2, 252],
			34: [2, 252],
			152: [1, 259],
			156: [2, 252],
			160: [2, 252],
			164: [2, 252],
			168: [2, 252]
		}, {
			2: [2, 246],
			25: [2, 246],
			34: [2, 246],
			148: [1, 262],
			152: [2, 246],
			156: [2, 246],
			160: [2, 246],
			164: [2, 246],
			168: [2, 246]
		}, {
			2: [2, 102],
			19: [2, 102],
			21: [2, 102],
			22: [2, 102],
			25: [2, 102],
			28: [2, 102],
			31: [2, 102],
			34: [2, 102],
			36: [2, 102],
			37: [2, 102],
			39: [2, 102],
			40: [2, 102],
			41: [2, 102],
			42: [2, 102],
			43: [2, 102],
			46: [2, 102],
			47: [2, 102],
			48: [2, 102],
			49: [2, 102],
			50: [2, 102],
			51: [2, 102],
			56: [2, 102],
			57: [2, 102],
			58: [2, 102],
			59: [2, 102],
			60: [2, 102],
			65: [2, 102],
			67: [2, 102],
			73: [2, 102],
			78: [2, 102],
			81: [2, 102],
			82: [2, 102],
			93: [2, 102],
			94: [2, 102],
			105: [2, 102],
			106: [2, 102],
			111: [2, 102],
			112: [2, 102],
			113: [2, 102],
			114: [2, 102],
			115: [2, 102],
			116: [2, 102],
			117: [2, 102],
			118: [2, 102],
			119: [2, 102],
			121: [2, 102],
			122: [2, 102],
			123: [2, 102],
			128: [2, 102],
			129: [2, 102],
			130: [2, 102],
			133: [2, 102],
			134: [2, 102],
			135: [2, 102],
			136: [2, 102],
			137: [2, 102],
			141: [2, 102],
			142: [2, 102],
			143: [2, 102],
			144: [2, 102],
			148: [2, 102],
			152: [2, 102],
			156: [2, 102],
			160: [2, 102],
			164: [2, 102],
			168: [2, 102],
			173: [2, 102],
			174: [2, 102],
			175: [2, 102],
			176: [2, 102],
			177: [2, 102],
			178: [2, 102],
			179: [2, 102],
			180: [2, 102],
			181: [2, 102],
			182: [2, 102],
			183: [2, 102],
			187: [2, 102],
			188: [2, 102],
			189: [2, 102],
			190: [2, 102],
			191: [2, 102]
		}, {
			2: [2, 240],
			25: [2, 240],
			34: [2, 240],
			141: [1, 308],
			142: [1, 309],
			143: [1, 310],
			144: [1, 311],
			148: [2, 240],
			152: [2, 240],
			156: [2, 240],
			160: [2, 240],
			164: [2, 240],
			168: [2, 240]
		}, {
			2: [2, 104],
			19: [2, 104],
			21: [2, 104],
			22: [2, 104],
			25: [2, 104],
			28: [2, 104],
			31: [2, 104],
			34: [2, 104],
			36: [2, 104],
			37: [2, 104],
			39: [2, 104],
			40: [2, 104],
			41: [2, 104],
			42: [2, 104],
			43: [2, 104],
			46: [2, 104],
			47: [2, 104],
			48: [2, 104],
			49: [2, 104],
			50: [2, 104],
			51: [2, 104],
			56: [2, 104],
			57: [2, 104],
			58: [2, 104],
			59: [2, 104],
			60: [2, 104],
			65: [2, 104],
			67: [2, 104],
			73: [2, 104],
			78: [2, 104],
			81: [2, 104],
			82: [2, 104],
			93: [2, 104],
			94: [2, 104],
			105: [2, 104],
			106: [2, 104],
			111: [2, 104],
			112: [2, 104],
			113: [2, 104],
			114: [2, 104],
			115: [2, 104],
			116: [2, 104],
			117: [2, 104],
			118: [2, 104],
			119: [2, 104],
			121: [2, 104],
			122: [2, 104],
			123: [2, 104],
			128: [2, 104],
			129: [2, 104],
			130: [2, 104],
			133: [2, 104],
			134: [2, 104],
			135: [2, 104],
			136: [2, 104],
			137: [2, 104],
			141: [2, 104],
			142: [2, 104],
			143: [2, 104],
			144: [2, 104],
			148: [2, 104],
			152: [2, 104],
			156: [2, 104],
			160: [2, 104],
			164: [2, 104],
			168: [2, 104],
			173: [2, 104],
			174: [2, 104],
			175: [2, 104],
			176: [2, 104],
			177: [2, 104],
			178: [2, 104],
			179: [2, 104],
			180: [2, 104],
			181: [2, 104],
			182: [2, 104],
			183: [2, 104],
			187: [2, 104],
			188: [2, 104],
			189: [2, 104],
			190: [2, 104],
			191: [2, 104]
		}, {
			19: [2, 113],
			25: [2, 113],
			28: [2, 113],
			37: [2, 113],
			67: [2, 113],
			78: [2, 113],
			81: [2, 113],
			82: [2, 113],
			94: [2, 113],
			105: [2, 113],
			106: [2, 113],
			111: [2, 113],
			112: [2, 113],
			113: [2, 113],
			114: [2, 113],
			115: [2, 113],
			116: [2, 113],
			117: [2, 113],
			118: [2, 113],
			119: [2, 113],
			122: [2, 113],
			174: [2, 113],
			187: [2, 113],
			188: [2, 113],
			189: [2, 113],
			190: [2, 113],
			191: [2, 113]
		}, {
			25: [2, 109],
			82: [2, 109]
		}, {
			2: [2, 105],
			19: [2, 105],
			21: [2, 105],
			22: [2, 105],
			25: [2, 105],
			28: [2, 105],
			31: [2, 105],
			34: [2, 105],
			36: [2, 105],
			37: [2, 105],
			39: [2, 105],
			40: [2, 105],
			41: [2, 105],
			42: [2, 105],
			43: [2, 105],
			46: [2, 105],
			47: [2, 105],
			48: [2, 105],
			49: [2, 105],
			50: [2, 105],
			51: [2, 105],
			56: [2, 105],
			57: [2, 105],
			58: [2, 105],
			59: [2, 105],
			60: [2, 105],
			65: [2, 105],
			67: [2, 105],
			73: [2, 105],
			78: [2, 105],
			81: [2, 105],
			82: [2, 105],
			93: [2, 105],
			94: [2, 105],
			105: [2, 105],
			106: [2, 105],
			111: [2, 105],
			112: [2, 105],
			113: [2, 105],
			114: [2, 105],
			115: [2, 105],
			116: [2, 105],
			117: [2, 105],
			118: [2, 105],
			119: [2, 105],
			121: [2, 105],
			122: [2, 105],
			123: [2, 105],
			128: [2, 105],
			129: [2, 105],
			130: [2, 105],
			133: [2, 105],
			134: [2, 105],
			135: [2, 105],
			136: [2, 105],
			137: [2, 105],
			141: [2, 105],
			142: [2, 105],
			143: [2, 105],
			144: [2, 105],
			148: [2, 105],
			152: [2, 105],
			156: [2, 105],
			160: [2, 105],
			164: [2, 105],
			168: [2, 105],
			173: [2, 105],
			174: [2, 105],
			175: [2, 105],
			176: [2, 105],
			177: [2, 105],
			178: [2, 105],
			179: [2, 105],
			180: [2, 105],
			181: [2, 105],
			182: [2, 105],
			183: [2, 105],
			187: [2, 105],
			188: [2, 105],
			189: [2, 105],
			190: [2, 105],
			191: [2, 105]
		}, {
			19: [1, 129],
			25: [1, 179],
			28: [1, 128],
			32: 460,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			82: [1, 458],
			83: 459,
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 231],
			25: [2, 231],
			34: [2, 231],
			46: [1, 317],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 231],
			142: [2, 231],
			143: [2, 231],
			144: [2, 231],
			148: [2, 231],
			152: [2, 231],
			156: [2, 231],
			160: [2, 231],
			164: [2, 231],
			168: [2, 231]
		}, {
			2: [2, 232],
			25: [2, 232],
			34: [2, 232],
			46: [1, 317],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 232],
			142: [2, 232],
			143: [2, 232],
			144: [2, 232],
			148: [2, 232],
			152: [2, 232],
			156: [2, 232],
			160: [2, 232],
			164: [2, 232],
			168: [2, 232]
		}, {
			2: [2, 233],
			25: [2, 233],
			34: [2, 233],
			46: [1, 317],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 233],
			142: [2, 233],
			143: [2, 233],
			144: [2, 233],
			148: [2, 233],
			152: [2, 233],
			156: [2, 233],
			160: [2, 233],
			164: [2, 233],
			168: [2, 233]
		}, {
			2: [2, 234],
			25: [2, 234],
			34: [2, 234],
			46: [1, 317],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 234],
			142: [2, 234],
			143: [2, 234],
			144: [2, 234],
			148: [2, 234],
			152: [2, 234],
			156: [2, 234],
			160: [2, 234],
			164: [2, 234],
			168: [2, 234]
		}, {
			2: [2, 214],
			25: [2, 214],
			34: [2, 214],
			46: [2, 214],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 214],
			134: [2, 214],
			135: [2, 214],
			136: [2, 214],
			137: [2, 214],
			141: [2, 214],
			142: [2, 214],
			143: [2, 214],
			144: [2, 214],
			148: [2, 214],
			152: [2, 214],
			156: [2, 214],
			160: [2, 214],
			164: [2, 214],
			168: [2, 214]
		}, {
			2: [2, 215],
			25: [2, 215],
			34: [2, 215],
			46: [2, 215],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 215],
			134: [2, 215],
			135: [2, 215],
			136: [2, 215],
			137: [2, 215],
			141: [2, 215],
			142: [2, 215],
			143: [2, 215],
			144: [2, 215],
			148: [2, 215],
			152: [2, 215],
			156: [2, 215],
			160: [2, 215],
			164: [2, 215],
			168: [2, 215]
		}, {
			2: [2, 216],
			25: [2, 216],
			34: [2, 216],
			46: [2, 216],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 216],
			134: [2, 216],
			135: [2, 216],
			136: [2, 216],
			137: [2, 216],
			141: [2, 216],
			142: [2, 216],
			143: [2, 216],
			144: [2, 216],
			148: [2, 216],
			152: [2, 216],
			156: [2, 216],
			160: [2, 216],
			164: [2, 216],
			168: [2, 216]
		}, {
			2: [2, 217],
			25: [2, 217],
			34: [2, 217],
			46: [2, 217],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 217],
			134: [2, 217],
			135: [2, 217],
			136: [2, 217],
			137: [2, 217],
			141: [2, 217],
			142: [2, 217],
			143: [2, 217],
			144: [2, 217],
			148: [2, 217],
			152: [2, 217],
			156: [2, 217],
			160: [2, 217],
			164: [2, 217],
			168: [2, 217]
		}, {
			2: [2, 218],
			25: [2, 218],
			34: [2, 218],
			46: [2, 218],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 218],
			134: [2, 218],
			135: [2, 218],
			136: [2, 218],
			137: [2, 218],
			141: [2, 218],
			142: [2, 218],
			143: [2, 218],
			144: [2, 218],
			148: [2, 218],
			152: [2, 218],
			156: [2, 218],
			160: [2, 218],
			164: [2, 218],
			168: [2, 218]
		}, {
			2: [2, 219],
			25: [2, 219],
			34: [2, 219],
			46: [2, 219],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 219],
			134: [2, 219],
			135: [2, 219],
			136: [2, 219],
			137: [2, 219],
			141: [2, 219],
			142: [2, 219],
			143: [2, 219],
			144: [2, 219],
			148: [2, 219],
			152: [2, 219],
			156: [2, 219],
			160: [2, 219],
			164: [2, 219],
			168: [2, 219]
		}, {
			2: [2, 197],
			25: [2, 197],
			34: [2, 197],
			46: [2, 197],
			116: [1, 321],
			117: [1, 322],
			128: [2, 197],
			129: [2, 197],
			130: [2, 197],
			133: [2, 197],
			134: [2, 197],
			135: [2, 197],
			136: [2, 197],
			137: [2, 197],
			141: [2, 197],
			142: [2, 197],
			143: [2, 197],
			144: [2, 197],
			148: [2, 197],
			152: [2, 197],
			156: [2, 197],
			160: [2, 197],
			164: [2, 197],
			168: [2, 197]
		}, {
			2: [2, 198],
			25: [2, 198],
			34: [2, 198],
			46: [2, 198],
			116: [1, 321],
			117: [1, 322],
			128: [2, 198],
			129: [2, 198],
			130: [2, 198],
			133: [2, 198],
			134: [2, 198],
			135: [2, 198],
			136: [2, 198],
			137: [2, 198],
			141: [2, 198],
			142: [2, 198],
			143: [2, 198],
			144: [2, 198],
			148: [2, 198],
			152: [2, 198],
			156: [2, 198],
			160: [2, 198],
			164: [2, 198],
			168: [2, 198]
		}, {
			2: [2, 199],
			25: [2, 199],
			34: [2, 199],
			46: [2, 199],
			116: [1, 321],
			117: [1, 322],
			128: [2, 199],
			129: [2, 199],
			130: [2, 199],
			133: [2, 199],
			134: [2, 199],
			135: [2, 199],
			136: [2, 199],
			137: [2, 199],
			141: [2, 199],
			142: [2, 199],
			143: [2, 199],
			144: [2, 199],
			148: [2, 199],
			152: [2, 199],
			156: [2, 199],
			160: [2, 199],
			164: [2, 199],
			168: [2, 199]
		}, {
			2: [2, 190],
			25: [2, 190],
			34: [2, 190],
			46: [2, 190],
			116: [2, 190],
			117: [2, 190],
			121: [1, 323],
			122: [1, 324],
			123: [1, 325],
			128: [2, 190],
			129: [2, 190],
			130: [2, 190],
			133: [2, 190],
			134: [2, 190],
			135: [2, 190],
			136: [2, 190],
			137: [2, 190],
			141: [2, 190],
			142: [2, 190],
			143: [2, 190],
			144: [2, 190],
			148: [2, 190],
			152: [2, 190],
			156: [2, 190],
			160: [2, 190],
			164: [2, 190],
			168: [2, 190]
		}, {
			2: [2, 191],
			25: [2, 191],
			34: [2, 191],
			46: [2, 191],
			116: [2, 191],
			117: [2, 191],
			121: [1, 323],
			122: [1, 324],
			123: [1, 325],
			128: [2, 191],
			129: [2, 191],
			130: [2, 191],
			133: [2, 191],
			134: [2, 191],
			135: [2, 191],
			136: [2, 191],
			137: [2, 191],
			141: [2, 191],
			142: [2, 191],
			143: [2, 191],
			144: [2, 191],
			148: [2, 191],
			152: [2, 191],
			156: [2, 191],
			160: [2, 191],
			164: [2, 191],
			168: [2, 191]
		}, {
			2: [2, 183],
			25: [2, 183],
			34: [2, 183],
			46: [2, 183],
			116: [2, 183],
			117: [2, 183],
			121: [2, 183],
			122: [2, 183],
			123: [2, 183],
			128: [2, 183],
			129: [2, 183],
			130: [2, 183],
			133: [2, 183],
			134: [2, 183],
			135: [2, 183],
			136: [2, 183],
			137: [2, 183],
			141: [2, 183],
			142: [2, 183],
			143: [2, 183],
			144: [2, 183],
			148: [2, 183],
			152: [2, 183],
			156: [2, 183],
			160: [2, 183],
			164: [2, 183],
			168: [2, 183]
		}, {
			2: [2, 184],
			25: [2, 184],
			34: [2, 184],
			46: [2, 184],
			116: [2, 184],
			117: [2, 184],
			121: [2, 184],
			122: [2, 184],
			123: [2, 184],
			128: [2, 184],
			129: [2, 184],
			130: [2, 184],
			133: [2, 184],
			134: [2, 184],
			135: [2, 184],
			136: [2, 184],
			137: [2, 184],
			141: [2, 184],
			142: [2, 184],
			143: [2, 184],
			144: [2, 184],
			148: [2, 184],
			152: [2, 184],
			156: [2, 184],
			160: [2, 184],
			164: [2, 184],
			168: [2, 184]
		}, {
			2: [2, 185],
			25: [2, 185],
			34: [2, 185],
			46: [2, 185],
			116: [2, 185],
			117: [2, 185],
			121: [2, 185],
			122: [2, 185],
			123: [2, 185],
			128: [2, 185],
			129: [2, 185],
			130: [2, 185],
			133: [2, 185],
			134: [2, 185],
			135: [2, 185],
			136: [2, 185],
			137: [2, 185],
			141: [2, 185],
			142: [2, 185],
			143: [2, 185],
			144: [2, 185],
			148: [2, 185],
			152: [2, 185],
			156: [2, 185],
			160: [2, 185],
			164: [2, 185],
			168: [2, 185]
		}, {
			19: [1, 461]
		}, {
			25: [1, 463],
			39: [1, 462]
		}, {
			25: [2, 88],
			39: [2, 88]
		}, {
			19: [2, 21],
			21: [2, 21],
			22: [2, 21],
			25: [2, 21],
			28: [2, 21],
			34: [2, 21],
			36: [2, 21],
			37: [2, 21],
			40: [2, 21],
			41: [2, 21],
			42: [2, 21],
			43: [2, 21],
			47: [2, 21],
			48: [2, 21],
			49: [2, 21],
			50: [2, 21],
			51: [2, 21],
			56: [2, 21],
			58: [2, 21],
			59: [2, 21],
			60: [2, 21],
			65: [2, 21],
			67: [2, 21],
			73: [2, 21],
			78: [2, 21],
			81: [2, 21],
			94: [2, 21],
			105: [2, 21],
			106: [2, 21],
			111: [2, 21],
			112: [2, 21],
			113: [2, 21],
			114: [2, 21],
			115: [2, 21],
			116: [2, 21],
			117: [2, 21],
			118: [2, 21],
			119: [2, 21],
			122: [2, 21],
			174: [2, 21],
			187: [2, 21],
			188: [2, 21],
			189: [2, 21],
			190: [2, 21],
			191: [2, 21]
		}, {
			19: [2, 28],
			21: [2, 28],
			22: [2, 28],
			25: [2, 28],
			28: [2, 28],
			34: [2, 28],
			36: [2, 28],
			37: [2, 28],
			40: [2, 28],
			41: [2, 28],
			42: [2, 28],
			43: [2, 28],
			47: [2, 28],
			48: [2, 28],
			49: [2, 28],
			50: [2, 28],
			51: [2, 28],
			56: [2, 28],
			58: [2, 28],
			59: [2, 28],
			60: [2, 28],
			65: [2, 28],
			67: [2, 28],
			73: [2, 28],
			78: [2, 28],
			81: [2, 28],
			94: [2, 28],
			105: [2, 28],
			106: [2, 28],
			111: [2, 28],
			112: [2, 28],
			113: [2, 28],
			114: [2, 28],
			115: [2, 28],
			116: [2, 28],
			117: [2, 28],
			118: [2, 28],
			119: [2, 28],
			122: [2, 28],
			174: [2, 28],
			187: [2, 28],
			188: [2, 28],
			189: [2, 28],
			190: [2, 28],
			191: [2, 28]
		}, {
			3: 464,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 465,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			3: 466,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			34: [1, 468],
			37: [1, 55],
			38: 467,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			33: 469,
			37: [1, 55],
			45: 470,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 230,
			161: 229,
			165: 228,
			169: 227,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			34: [1, 471]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 472,
			39: [1, 473],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 475],
			34: [1, 474]
		}, {
			25: [2, 22],
			34: [2, 22],
			46: [1, 476]
		}, {
			25: [2, 26],
			30: 477,
			31: [1, 478],
			34: [2, 26],
			46: [2, 26]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 479,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			33: 480,
			37: [1, 55],
			45: 470,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 230,
			161: 229,
			165: 228,
			169: 227,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			33: 481,
			37: [1, 55],
			45: 470,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 230,
			161: 229,
			165: 228,
			169: 227,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 482,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 230,
			161: 483,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 484,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 485,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 486,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 487,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 488,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 489,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 490,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 491,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 492,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 493,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 494,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 495,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			37: [1, 55],
			45: 201,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 496,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 292],
			25: [2, 292],
			34: [2, 292],
			39: [2, 292],
			57: [2, 292],
			82: [2, 292]
		}, {
			2: [2, 272],
			19: [2, 272],
			21: [2, 272],
			22: [2, 272],
			25: [2, 272],
			28: [2, 272],
			34: [2, 272],
			36: [2, 272],
			37: [2, 272],
			39: [2, 272],
			40: [2, 272],
			41: [2, 272],
			42: [2, 272],
			43: [2, 272],
			47: [2, 272],
			48: [2, 272],
			49: [2, 272],
			50: [2, 272],
			51: [2, 272],
			56: [2, 272],
			57: [2, 272],
			58: [2, 272],
			59: [2, 272],
			60: [2, 272],
			65: [2, 272],
			67: [2, 272],
			73: [2, 272],
			78: [2, 272],
			81: [2, 272],
			82: [2, 272],
			94: [2, 272],
			105: [2, 272],
			106: [2, 272],
			111: [2, 272],
			112: [2, 272],
			113: [2, 272],
			114: [2, 272],
			115: [2, 272],
			116: [2, 272],
			117: [2, 272],
			118: [2, 272],
			119: [2, 272],
			122: [2, 272],
			174: [2, 272],
			187: [2, 272],
			188: [2, 272],
			189: [2, 272],
			190: [2, 272],
			191: [2, 272]
		}, {
			2: [2, 273],
			19: [2, 273],
			21: [2, 273],
			22: [2, 273],
			25: [2, 273],
			28: [2, 273],
			34: [2, 273],
			36: [2, 273],
			37: [2, 273],
			39: [2, 273],
			40: [2, 273],
			41: [2, 273],
			42: [2, 273],
			43: [2, 273],
			47: [2, 273],
			48: [2, 273],
			49: [2, 273],
			50: [2, 273],
			51: [2, 273],
			56: [2, 273],
			57: [2, 273],
			58: [2, 273],
			59: [2, 273],
			60: [2, 273],
			65: [2, 273],
			67: [2, 273],
			73: [2, 273],
			78: [2, 273],
			81: [2, 273],
			82: [2, 273],
			94: [2, 273],
			105: [2, 273],
			106: [2, 273],
			111: [2, 273],
			112: [2, 273],
			113: [2, 273],
			114: [2, 273],
			115: [2, 273],
			116: [2, 273],
			117: [2, 273],
			118: [2, 273],
			119: [2, 273],
			122: [2, 273],
			174: [2, 273],
			187: [2, 273],
			188: [2, 273],
			189: [2, 273],
			190: [2, 273],
			191: [2, 273]
		}, {
			57: [1, 497]
		}, {
			2: [2, 260],
			19: [2, 260],
			21: [2, 260],
			22: [2, 260],
			25: [2, 260],
			28: [2, 260],
			34: [2, 260],
			36: [2, 260],
			37: [2, 260],
			39: [2, 260],
			40: [2, 260],
			41: [2, 260],
			42: [2, 260],
			43: [2, 260],
			47: [2, 260],
			48: [2, 260],
			49: [2, 260],
			50: [2, 260],
			51: [2, 260],
			56: [2, 260],
			57: [2, 260],
			58: [2, 260],
			59: [2, 260],
			60: [2, 260],
			65: [2, 260],
			67: [2, 260],
			73: [2, 260],
			78: [2, 260],
			81: [2, 260],
			82: [2, 260],
			94: [2, 260],
			105: [2, 260],
			106: [2, 260],
			111: [2, 260],
			112: [2, 260],
			113: [2, 260],
			114: [2, 260],
			115: [2, 260],
			116: [2, 260],
			117: [2, 260],
			118: [2, 260],
			119: [2, 260],
			122: [2, 260],
			160: [1, 252],
			164: [2, 260],
			168: [2, 260],
			174: [2, 260],
			187: [2, 260],
			188: [2, 260],
			189: [2, 260],
			190: [2, 260],
			191: [2, 260]
		}, {
			25: [1, 242],
			82: [1, 498]
		}, {
			2: [2, 142],
			19: [2, 142],
			21: [2, 142],
			22: [2, 142],
			25: [2, 142],
			28: [2, 142],
			31: [2, 142],
			34: [2, 142],
			36: [2, 142],
			37: [2, 142],
			39: [2, 142],
			40: [2, 142],
			41: [2, 142],
			42: [2, 142],
			43: [2, 142],
			46: [2, 142],
			47: [2, 142],
			48: [2, 142],
			49: [2, 142],
			50: [2, 142],
			51: [2, 142],
			56: [2, 142],
			57: [2, 142],
			58: [2, 142],
			59: [2, 142],
			60: [2, 142],
			65: [2, 142],
			67: [2, 142],
			73: [2, 142],
			78: [2, 142],
			81: [2, 142],
			82: [2, 142],
			93: [2, 142],
			94: [2, 142],
			105: [2, 142],
			106: [2, 142],
			111: [2, 142],
			112: [2, 142],
			113: [2, 142],
			114: [2, 142],
			115: [2, 142],
			116: [2, 142],
			117: [2, 142],
			118: [2, 142],
			119: [2, 142],
			121: [2, 142],
			122: [2, 142],
			123: [2, 142],
			128: [2, 142],
			129: [2, 142],
			130: [2, 142],
			133: [2, 142],
			134: [2, 142],
			135: [2, 142],
			136: [2, 142],
			137: [2, 142],
			141: [2, 142],
			142: [2, 142],
			143: [2, 142],
			144: [2, 142],
			148: [2, 142],
			152: [2, 142],
			156: [2, 142],
			160: [2, 142],
			164: [2, 142],
			168: [2, 142],
			173: [2, 142],
			174: [2, 142],
			175: [2, 142],
			176: [2, 142],
			177: [2, 142],
			178: [2, 142],
			179: [2, 142],
			180: [2, 142],
			181: [2, 142],
			182: [2, 142],
			183: [2, 142],
			187: [2, 142],
			188: [2, 142],
			189: [2, 142],
			190: [2, 142],
			191: [2, 142]
		}, {
			2: [2, 254],
			19: [2, 254],
			21: [2, 254],
			22: [2, 254],
			25: [2, 254],
			28: [2, 254],
			34: [2, 254],
			36: [2, 254],
			37: [2, 254],
			39: [2, 254],
			40: [2, 254],
			41: [2, 254],
			42: [2, 254],
			43: [2, 254],
			47: [2, 254],
			48: [2, 254],
			49: [2, 254],
			50: [2, 254],
			51: [2, 254],
			56: [2, 254],
			57: [2, 254],
			58: [2, 254],
			59: [2, 254],
			60: [2, 254],
			65: [2, 254],
			67: [2, 254],
			73: [2, 254],
			78: [2, 254],
			81: [2, 254],
			82: [2, 254],
			94: [2, 254],
			105: [2, 254],
			106: [2, 254],
			111: [2, 254],
			112: [2, 254],
			113: [2, 254],
			114: [2, 254],
			115: [2, 254],
			116: [2, 254],
			117: [2, 254],
			118: [2, 254],
			119: [2, 254],
			122: [2, 254],
			156: [1, 258],
			160: [2, 254],
			164: [2, 254],
			168: [2, 254],
			174: [2, 254],
			187: [2, 254],
			188: [2, 254],
			189: [2, 254],
			190: [2, 254],
			191: [2, 254]
		}, {
			25: [1, 242],
			82: [1, 499]
		}, {
			2: [2, 129],
			19: [2, 129],
			21: [2, 129],
			22: [2, 129],
			25: [2, 129],
			28: [2, 129],
			31: [2, 129],
			34: [2, 129],
			36: [2, 129],
			37: [2, 129],
			39: [2, 129],
			40: [2, 129],
			41: [2, 129],
			42: [2, 129],
			43: [2, 129],
			46: [2, 129],
			47: [2, 129],
			48: [2, 129],
			49: [2, 129],
			50: [2, 129],
			51: [2, 129],
			56: [2, 129],
			57: [2, 129],
			58: [2, 129],
			59: [2, 129],
			60: [2, 129],
			65: [2, 129],
			67: [2, 129],
			73: [2, 129],
			78: [2, 129],
			81: [2, 129],
			82: [2, 129],
			93: [2, 129],
			94: [2, 129],
			105: [2, 129],
			106: [2, 129],
			111: [2, 129],
			112: [2, 129],
			113: [2, 129],
			114: [2, 129],
			115: [2, 129],
			116: [2, 129],
			117: [2, 129],
			118: [2, 129],
			119: [2, 129],
			121: [2, 129],
			122: [2, 129],
			123: [2, 129],
			128: [2, 129],
			129: [2, 129],
			130: [2, 129],
			133: [2, 129],
			134: [2, 129],
			135: [2, 129],
			136: [2, 129],
			137: [2, 129],
			141: [2, 129],
			142: [2, 129],
			143: [2, 129],
			144: [2, 129],
			148: [2, 129],
			152: [2, 129],
			156: [2, 129],
			160: [2, 129],
			164: [2, 129],
			168: [2, 129],
			173: [2, 129],
			174: [2, 129],
			175: [2, 129],
			176: [2, 129],
			177: [2, 129],
			178: [2, 129],
			179: [2, 129],
			180: [2, 129],
			181: [2, 129],
			182: [2, 129],
			183: [2, 129],
			187: [2, 129],
			188: [2, 129],
			189: [2, 129],
			190: [2, 129],
			191: [2, 129]
		}, {
			2: [2, 130],
			19: [2, 130],
			21: [2, 130],
			22: [2, 130],
			25: [2, 130],
			28: [2, 130],
			31: [2, 130],
			34: [2, 130],
			36: [2, 130],
			37: [2, 130],
			39: [2, 130],
			40: [2, 130],
			41: [2, 130],
			42: [2, 130],
			43: [2, 130],
			46: [2, 130],
			47: [2, 130],
			48: [2, 130],
			49: [2, 130],
			50: [2, 130],
			51: [2, 130],
			56: [2, 130],
			57: [2, 130],
			58: [2, 130],
			59: [2, 130],
			60: [2, 130],
			65: [2, 130],
			67: [2, 130],
			73: [2, 130],
			78: [2, 130],
			81: [2, 130],
			82: [2, 130],
			93: [2, 130],
			94: [2, 130],
			105: [2, 130],
			106: [2, 130],
			111: [2, 130],
			112: [2, 130],
			113: [2, 130],
			114: [2, 130],
			115: [2, 130],
			116: [2, 130],
			117: [2, 130],
			118: [2, 130],
			119: [2, 130],
			121: [2, 130],
			122: [2, 130],
			123: [2, 130],
			128: [2, 130],
			129: [2, 130],
			130: [2, 130],
			133: [2, 130],
			134: [2, 130],
			135: [2, 130],
			136: [2, 130],
			137: [2, 130],
			141: [2, 130],
			142: [2, 130],
			143: [2, 130],
			144: [2, 130],
			148: [2, 130],
			152: [2, 130],
			156: [2, 130],
			160: [2, 130],
			164: [2, 130],
			168: [2, 130],
			173: [2, 130],
			174: [2, 130],
			175: [2, 130],
			176: [2, 130],
			177: [2, 130],
			178: [2, 130],
			179: [2, 130],
			180: [2, 130],
			181: [2, 130],
			182: [2, 130],
			183: [2, 130],
			187: [2, 130],
			188: [2, 130],
			189: [2, 130],
			190: [2, 130],
			191: [2, 130]
		}, {
			2: [2, 248],
			19: [2, 248],
			21: [2, 248],
			22: [2, 248],
			25: [2, 248],
			28: [2, 248],
			34: [2, 248],
			36: [2, 248],
			37: [2, 248],
			39: [2, 248],
			40: [2, 248],
			41: [2, 248],
			42: [2, 248],
			43: [2, 248],
			47: [2, 248],
			48: [2, 248],
			49: [2, 248],
			50: [2, 248],
			51: [2, 248],
			56: [2, 248],
			57: [2, 248],
			58: [2, 248],
			59: [2, 248],
			60: [2, 248],
			65: [2, 248],
			67: [2, 248],
			73: [2, 248],
			78: [2, 248],
			81: [2, 248],
			82: [2, 248],
			94: [2, 248],
			105: [2, 248],
			106: [2, 248],
			111: [2, 248],
			112: [2, 248],
			113: [2, 248],
			114: [2, 248],
			115: [2, 248],
			116: [2, 248],
			117: [2, 248],
			118: [2, 248],
			119: [2, 248],
			122: [2, 248],
			152: [1, 259],
			156: [2, 248],
			160: [2, 248],
			164: [2, 248],
			168: [2, 248],
			174: [2, 248],
			187: [2, 248],
			188: [2, 248],
			189: [2, 248],
			190: [2, 248],
			191: [2, 248]
		}, {
			2: [2, 242],
			19: [2, 242],
			21: [2, 242],
			22: [2, 242],
			25: [2, 242],
			28: [2, 242],
			34: [2, 242],
			36: [2, 242],
			37: [2, 242],
			39: [2, 242],
			40: [2, 242],
			41: [2, 242],
			42: [2, 242],
			43: [2, 242],
			47: [2, 242],
			48: [2, 242],
			49: [2, 242],
			50: [2, 242],
			51: [2, 242],
			56: [2, 242],
			57: [2, 242],
			58: [2, 242],
			59: [2, 242],
			60: [2, 242],
			65: [2, 242],
			67: [2, 242],
			73: [2, 242],
			78: [2, 242],
			81: [2, 242],
			82: [2, 242],
			94: [2, 242],
			105: [2, 242],
			106: [2, 242],
			111: [2, 242],
			112: [2, 242],
			113: [2, 242],
			114: [2, 242],
			115: [2, 242],
			116: [2, 242],
			117: [2, 242],
			118: [2, 242],
			119: [2, 242],
			122: [2, 242],
			148: [1, 262],
			152: [2, 242],
			156: [2, 242],
			160: [2, 242],
			164: [2, 242],
			168: [2, 242],
			174: [2, 242],
			187: [2, 242],
			188: [2, 242],
			189: [2, 242],
			190: [2, 242],
			191: [2, 242]
		}, {
			28: [1, 378],
			39: [1, 500],
			69: 501
		}, {
			19: [1, 502]
		}, {
			25: [1, 463],
			39: [1, 503]
		}, {
			2: [2, 236],
			19: [2, 236],
			21: [2, 236],
			22: [2, 236],
			25: [2, 236],
			28: [2, 236],
			34: [2, 236],
			36: [2, 236],
			37: [2, 236],
			39: [2, 236],
			40: [2, 236],
			41: [2, 236],
			42: [2, 236],
			43: [2, 236],
			47: [2, 236],
			48: [2, 236],
			49: [2, 236],
			50: [2, 236],
			51: [2, 236],
			56: [2, 236],
			57: [2, 236],
			58: [2, 236],
			59: [2, 236],
			60: [2, 236],
			65: [2, 236],
			67: [2, 236],
			73: [2, 236],
			78: [2, 236],
			81: [2, 236],
			82: [2, 236],
			94: [2, 236],
			105: [2, 236],
			106: [2, 236],
			111: [2, 236],
			112: [2, 236],
			113: [2, 236],
			114: [2, 236],
			115: [2, 236],
			116: [2, 236],
			117: [2, 236],
			118: [2, 236],
			119: [2, 236],
			122: [2, 236],
			141: [1, 308],
			142: [1, 309],
			143: [1, 310],
			144: [1, 311],
			148: [2, 236],
			152: [2, 236],
			156: [2, 236],
			160: [2, 236],
			164: [2, 236],
			168: [2, 236],
			174: [2, 236],
			187: [2, 236],
			188: [2, 236],
			189: [2, 236],
			190: [2, 236],
			191: [2, 236]
		}, {
			2: [2, 115],
			19: [2, 115],
			21: [2, 115],
			22: [2, 115],
			25: [2, 115],
			28: [2, 115],
			31: [2, 115],
			34: [2, 115],
			36: [2, 115],
			37: [2, 115],
			39: [2, 115],
			40: [2, 115],
			41: [2, 115],
			42: [2, 115],
			43: [2, 115],
			46: [2, 115],
			47: [2, 115],
			48: [2, 115],
			49: [2, 115],
			50: [2, 115],
			51: [2, 115],
			56: [2, 115],
			57: [2, 115],
			58: [2, 115],
			59: [2, 115],
			60: [2, 115],
			65: [2, 115],
			67: [2, 115],
			73: [2, 115],
			78: [2, 115],
			81: [2, 115],
			82: [2, 115],
			93: [2, 115],
			94: [2, 115],
			105: [2, 115],
			106: [2, 115],
			111: [2, 115],
			112: [2, 115],
			113: [2, 115],
			114: [2, 115],
			115: [2, 115],
			116: [2, 115],
			117: [2, 115],
			118: [2, 115],
			119: [2, 115],
			121: [2, 115],
			122: [2, 115],
			123: [2, 115],
			128: [2, 115],
			129: [2, 115],
			130: [2, 115],
			133: [2, 115],
			134: [2, 115],
			135: [2, 115],
			136: [2, 115],
			137: [2, 115],
			141: [2, 115],
			142: [2, 115],
			143: [2, 115],
			144: [2, 115],
			148: [2, 115],
			152: [2, 115],
			156: [2, 115],
			160: [2, 115],
			164: [2, 115],
			168: [2, 115],
			173: [2, 115],
			174: [2, 115],
			175: [2, 115],
			176: [2, 115],
			177: [2, 115],
			178: [2, 115],
			179: [2, 115],
			180: [2, 115],
			181: [2, 115],
			182: [2, 115],
			183: [2, 115],
			187: [2, 115],
			188: [2, 115],
			189: [2, 115],
			190: [2, 115],
			191: [2, 115]
		}, {
			21: [1, 504],
			22: [1, 294],
			28: [1, 267],
			36: [1, 284],
			40: [1, 280],
			41: [1, 279],
			42: [1, 296],
			43: [1, 282],
			46: [1, 285],
			47: [1, 275],
			48: [1, 272],
			49: [1, 288],
			50: [1, 297],
			51: [1, 289],
			56: [1, 273],
			58: [1, 277],
			59: [1, 291],
			60: [1, 292],
			63: [1, 274],
			64: [1, 281],
			65: [1, 276],
			67: [1, 283],
			78: [1, 290],
			86: 505,
			87: 266,
			89: 268,
			90: 269,
			91: 270,
			94: [1, 287],
			101: 271,
			111: [1, 278],
			112: [1, 295],
			113: [1, 293],
			137: [1, 286],
			187: [1, 300],
			188: [1, 298],
			189: [1, 299],
			190: [1, 67],
			191: [1, 68],
			194: [1, 301],
			195: [1, 302],
			196: [1, 303],
			197: [1, 304],
			198: [1, 305],
			199: [1, 306],
			200: [1, 307]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 506,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			37: [1, 507]
		}, {
			2: [2, 221],
			19: [2, 221],
			21: [2, 221],
			22: [2, 221],
			25: [2, 221],
			28: [2, 221],
			34: [2, 221],
			36: [2, 221],
			37: [2, 221],
			39: [2, 221],
			40: [2, 221],
			41: [2, 221],
			42: [2, 221],
			43: [2, 221],
			46: [1, 317],
			47: [2, 221],
			48: [2, 221],
			49: [2, 221],
			50: [2, 221],
			51: [2, 221],
			56: [2, 221],
			57: [2, 221],
			58: [2, 221],
			59: [2, 221],
			60: [2, 221],
			65: [2, 221],
			67: [2, 221],
			73: [2, 221],
			78: [2, 221],
			81: [2, 221],
			82: [2, 221],
			94: [2, 221],
			105: [2, 221],
			106: [2, 221],
			111: [2, 221],
			112: [2, 221],
			113: [2, 221],
			114: [2, 221],
			115: [2, 221],
			116: [2, 221],
			117: [2, 221],
			118: [2, 221],
			119: [2, 221],
			122: [2, 221],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 221],
			142: [2, 221],
			143: [2, 221],
			144: [2, 221],
			148: [2, 221],
			152: [2, 221],
			156: [2, 221],
			160: [2, 221],
			164: [2, 221],
			168: [2, 221],
			174: [2, 221],
			187: [2, 221],
			188: [2, 221],
			189: [2, 221],
			190: [2, 221],
			191: [2, 221]
		}, {
			2: [2, 222],
			19: [2, 222],
			21: [2, 222],
			22: [2, 222],
			25: [2, 222],
			28: [2, 222],
			34: [2, 222],
			36: [2, 222],
			37: [2, 222],
			39: [2, 222],
			40: [2, 222],
			41: [2, 222],
			42: [2, 222],
			43: [2, 222],
			46: [1, 317],
			47: [2, 222],
			48: [2, 222],
			49: [2, 222],
			50: [2, 222],
			51: [2, 222],
			56: [2, 222],
			57: [2, 222],
			58: [2, 222],
			59: [2, 222],
			60: [2, 222],
			65: [2, 222],
			67: [2, 222],
			73: [2, 222],
			78: [2, 222],
			81: [2, 222],
			82: [2, 222],
			94: [2, 222],
			105: [2, 222],
			106: [2, 222],
			111: [2, 222],
			112: [2, 222],
			113: [2, 222],
			114: [2, 222],
			115: [2, 222],
			116: [2, 222],
			117: [2, 222],
			118: [2, 222],
			119: [2, 222],
			122: [2, 222],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 222],
			142: [2, 222],
			143: [2, 222],
			144: [2, 222],
			148: [2, 222],
			152: [2, 222],
			156: [2, 222],
			160: [2, 222],
			164: [2, 222],
			168: [2, 222],
			174: [2, 222],
			187: [2, 222],
			188: [2, 222],
			189: [2, 222],
			190: [2, 222],
			191: [2, 222]
		}, {
			2: [2, 223],
			19: [2, 223],
			21: [2, 223],
			22: [2, 223],
			25: [2, 223],
			28: [2, 223],
			34: [2, 223],
			36: [2, 223],
			37: [2, 223],
			39: [2, 223],
			40: [2, 223],
			41: [2, 223],
			42: [2, 223],
			43: [2, 223],
			46: [1, 317],
			47: [2, 223],
			48: [2, 223],
			49: [2, 223],
			50: [2, 223],
			51: [2, 223],
			56: [2, 223],
			57: [2, 223],
			58: [2, 223],
			59: [2, 223],
			60: [2, 223],
			65: [2, 223],
			67: [2, 223],
			73: [2, 223],
			78: [2, 223],
			81: [2, 223],
			82: [2, 223],
			94: [2, 223],
			105: [2, 223],
			106: [2, 223],
			111: [2, 223],
			112: [2, 223],
			113: [2, 223],
			114: [2, 223],
			115: [2, 223],
			116: [2, 223],
			117: [2, 223],
			118: [2, 223],
			119: [2, 223],
			122: [2, 223],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 223],
			142: [2, 223],
			143: [2, 223],
			144: [2, 223],
			148: [2, 223],
			152: [2, 223],
			156: [2, 223],
			160: [2, 223],
			164: [2, 223],
			168: [2, 223],
			174: [2, 223],
			187: [2, 223],
			188: [2, 223],
			189: [2, 223],
			190: [2, 223],
			191: [2, 223]
		}, {
			2: [2, 224],
			19: [2, 224],
			21: [2, 224],
			22: [2, 224],
			25: [2, 224],
			28: [2, 224],
			34: [2, 224],
			36: [2, 224],
			37: [2, 224],
			39: [2, 224],
			40: [2, 224],
			41: [2, 224],
			42: [2, 224],
			43: [2, 224],
			46: [1, 317],
			47: [2, 224],
			48: [2, 224],
			49: [2, 224],
			50: [2, 224],
			51: [2, 224],
			56: [2, 224],
			57: [2, 224],
			58: [2, 224],
			59: [2, 224],
			60: [2, 224],
			65: [2, 224],
			67: [2, 224],
			73: [2, 224],
			78: [2, 224],
			81: [2, 224],
			82: [2, 224],
			94: [2, 224],
			105: [2, 224],
			106: [2, 224],
			111: [2, 224],
			112: [2, 224],
			113: [2, 224],
			114: [2, 224],
			115: [2, 224],
			116: [2, 224],
			117: [2, 224],
			118: [2, 224],
			119: [2, 224],
			122: [2, 224],
			133: [1, 312],
			134: [1, 313],
			135: [1, 314],
			136: [1, 315],
			137: [1, 316],
			141: [2, 224],
			142: [2, 224],
			143: [2, 224],
			144: [2, 224],
			148: [2, 224],
			152: [2, 224],
			156: [2, 224],
			160: [2, 224],
			164: [2, 224],
			168: [2, 224],
			174: [2, 224],
			187: [2, 224],
			188: [2, 224],
			189: [2, 224],
			190: [2, 224],
			191: [2, 224]
		}, {
			2: [2, 201],
			19: [2, 201],
			21: [2, 201],
			22: [2, 201],
			25: [2, 201],
			28: [2, 201],
			34: [2, 201],
			36: [2, 201],
			37: [2, 201],
			39: [2, 201],
			40: [2, 201],
			41: [2, 201],
			42: [2, 201],
			43: [2, 201],
			46: [2, 201],
			47: [2, 201],
			48: [2, 201],
			49: [2, 201],
			50: [2, 201],
			51: [2, 201],
			56: [2, 201],
			57: [2, 201],
			58: [2, 201],
			59: [2, 201],
			60: [2, 201],
			65: [2, 201],
			67: [2, 201],
			73: [2, 201],
			78: [2, 201],
			81: [2, 201],
			82: [2, 201],
			94: [2, 201],
			105: [2, 201],
			106: [2, 201],
			111: [2, 201],
			112: [2, 201],
			113: [2, 201],
			114: [2, 201],
			115: [2, 201],
			116: [2, 201],
			117: [2, 201],
			118: [2, 201],
			119: [2, 201],
			122: [2, 201],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 201],
			134: [2, 201],
			135: [2, 201],
			136: [2, 201],
			137: [2, 201],
			141: [2, 201],
			142: [2, 201],
			143: [2, 201],
			144: [2, 201],
			148: [2, 201],
			152: [2, 201],
			156: [2, 201],
			160: [2, 201],
			164: [2, 201],
			168: [2, 201],
			174: [2, 201],
			187: [2, 201],
			188: [2, 201],
			189: [2, 201],
			190: [2, 201],
			191: [2, 201]
		}, {
			2: [2, 202],
			19: [2, 202],
			21: [2, 202],
			22: [2, 202],
			25: [2, 202],
			28: [2, 202],
			34: [2, 202],
			36: [2, 202],
			37: [2, 202],
			39: [2, 202],
			40: [2, 202],
			41: [2, 202],
			42: [2, 202],
			43: [2, 202],
			46: [2, 202],
			47: [2, 202],
			48: [2, 202],
			49: [2, 202],
			50: [2, 202],
			51: [2, 202],
			56: [2, 202],
			57: [2, 202],
			58: [2, 202],
			59: [2, 202],
			60: [2, 202],
			65: [2, 202],
			67: [2, 202],
			73: [2, 202],
			78: [2, 202],
			81: [2, 202],
			82: [2, 202],
			94: [2, 202],
			105: [2, 202],
			106: [2, 202],
			111: [2, 202],
			112: [2, 202],
			113: [2, 202],
			114: [2, 202],
			115: [2, 202],
			116: [2, 202],
			117: [2, 202],
			118: [2, 202],
			119: [2, 202],
			122: [2, 202],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 202],
			134: [2, 202],
			135: [2, 202],
			136: [2, 202],
			137: [2, 202],
			141: [2, 202],
			142: [2, 202],
			143: [2, 202],
			144: [2, 202],
			148: [2, 202],
			152: [2, 202],
			156: [2, 202],
			160: [2, 202],
			164: [2, 202],
			168: [2, 202],
			174: [2, 202],
			187: [2, 202],
			188: [2, 202],
			189: [2, 202],
			190: [2, 202],
			191: [2, 202]
		}, {
			2: [2, 203],
			19: [2, 203],
			21: [2, 203],
			22: [2, 203],
			25: [2, 203],
			28: [2, 203],
			34: [2, 203],
			36: [2, 203],
			37: [2, 203],
			39: [2, 203],
			40: [2, 203],
			41: [2, 203],
			42: [2, 203],
			43: [2, 203],
			46: [2, 203],
			47: [2, 203],
			48: [2, 203],
			49: [2, 203],
			50: [2, 203],
			51: [2, 203],
			56: [2, 203],
			57: [2, 203],
			58: [2, 203],
			59: [2, 203],
			60: [2, 203],
			65: [2, 203],
			67: [2, 203],
			73: [2, 203],
			78: [2, 203],
			81: [2, 203],
			82: [2, 203],
			94: [2, 203],
			105: [2, 203],
			106: [2, 203],
			111: [2, 203],
			112: [2, 203],
			113: [2, 203],
			114: [2, 203],
			115: [2, 203],
			116: [2, 203],
			117: [2, 203],
			118: [2, 203],
			119: [2, 203],
			122: [2, 203],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 203],
			134: [2, 203],
			135: [2, 203],
			136: [2, 203],
			137: [2, 203],
			141: [2, 203],
			142: [2, 203],
			143: [2, 203],
			144: [2, 203],
			148: [2, 203],
			152: [2, 203],
			156: [2, 203],
			160: [2, 203],
			164: [2, 203],
			168: [2, 203],
			174: [2, 203],
			187: [2, 203],
			188: [2, 203],
			189: [2, 203],
			190: [2, 203],
			191: [2, 203]
		}, {
			2: [2, 204],
			19: [2, 204],
			21: [2, 204],
			22: [2, 204],
			25: [2, 204],
			28: [2, 204],
			34: [2, 204],
			36: [2, 204],
			37: [2, 204],
			39: [2, 204],
			40: [2, 204],
			41: [2, 204],
			42: [2, 204],
			43: [2, 204],
			46: [2, 204],
			47: [2, 204],
			48: [2, 204],
			49: [2, 204],
			50: [2, 204],
			51: [2, 204],
			56: [2, 204],
			57: [2, 204],
			58: [2, 204],
			59: [2, 204],
			60: [2, 204],
			65: [2, 204],
			67: [2, 204],
			73: [2, 204],
			78: [2, 204],
			81: [2, 204],
			82: [2, 204],
			94: [2, 204],
			105: [2, 204],
			106: [2, 204],
			111: [2, 204],
			112: [2, 204],
			113: [2, 204],
			114: [2, 204],
			115: [2, 204],
			116: [2, 204],
			117: [2, 204],
			118: [2, 204],
			119: [2, 204],
			122: [2, 204],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 204],
			134: [2, 204],
			135: [2, 204],
			136: [2, 204],
			137: [2, 204],
			141: [2, 204],
			142: [2, 204],
			143: [2, 204],
			144: [2, 204],
			148: [2, 204],
			152: [2, 204],
			156: [2, 204],
			160: [2, 204],
			164: [2, 204],
			168: [2, 204],
			174: [2, 204],
			187: [2, 204],
			188: [2, 204],
			189: [2, 204],
			190: [2, 204],
			191: [2, 204]
		}, {
			2: [2, 205],
			19: [2, 205],
			21: [2, 205],
			22: [2, 205],
			25: [2, 205],
			28: [2, 205],
			34: [2, 205],
			36: [2, 205],
			37: [2, 205],
			39: [2, 205],
			40: [2, 205],
			41: [2, 205],
			42: [2, 205],
			43: [2, 205],
			46: [2, 205],
			47: [2, 205],
			48: [2, 205],
			49: [2, 205],
			50: [2, 205],
			51: [2, 205],
			56: [2, 205],
			57: [2, 205],
			58: [2, 205],
			59: [2, 205],
			60: [2, 205],
			65: [2, 205],
			67: [2, 205],
			73: [2, 205],
			78: [2, 205],
			81: [2, 205],
			82: [2, 205],
			94: [2, 205],
			105: [2, 205],
			106: [2, 205],
			111: [2, 205],
			112: [2, 205],
			113: [2, 205],
			114: [2, 205],
			115: [2, 205],
			116: [2, 205],
			117: [2, 205],
			118: [2, 205],
			119: [2, 205],
			122: [2, 205],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 205],
			134: [2, 205],
			135: [2, 205],
			136: [2, 205],
			137: [2, 205],
			141: [2, 205],
			142: [2, 205],
			143: [2, 205],
			144: [2, 205],
			148: [2, 205],
			152: [2, 205],
			156: [2, 205],
			160: [2, 205],
			164: [2, 205],
			168: [2, 205],
			174: [2, 205],
			187: [2, 205],
			188: [2, 205],
			189: [2, 205],
			190: [2, 205],
			191: [2, 205]
		}, {
			2: [2, 206],
			19: [2, 206],
			21: [2, 206],
			22: [2, 206],
			25: [2, 206],
			28: [2, 206],
			34: [2, 206],
			36: [2, 206],
			37: [2, 206],
			39: [2, 206],
			40: [2, 206],
			41: [2, 206],
			42: [2, 206],
			43: [2, 206],
			46: [2, 206],
			47: [2, 206],
			48: [2, 206],
			49: [2, 206],
			50: [2, 206],
			51: [2, 206],
			56: [2, 206],
			57: [2, 206],
			58: [2, 206],
			59: [2, 206],
			60: [2, 206],
			65: [2, 206],
			67: [2, 206],
			73: [2, 206],
			78: [2, 206],
			81: [2, 206],
			82: [2, 206],
			94: [2, 206],
			105: [2, 206],
			106: [2, 206],
			111: [2, 206],
			112: [2, 206],
			113: [2, 206],
			114: [2, 206],
			115: [2, 206],
			116: [2, 206],
			117: [2, 206],
			118: [2, 206],
			119: [2, 206],
			122: [2, 206],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 206],
			134: [2, 206],
			135: [2, 206],
			136: [2, 206],
			137: [2, 206],
			141: [2, 206],
			142: [2, 206],
			143: [2, 206],
			144: [2, 206],
			148: [2, 206],
			152: [2, 206],
			156: [2, 206],
			160: [2, 206],
			164: [2, 206],
			168: [2, 206],
			174: [2, 206],
			187: [2, 206],
			188: [2, 206],
			189: [2, 206],
			190: [2, 206],
			191: [2, 206]
		}, {
			2: [2, 193],
			19: [2, 193],
			21: [2, 193],
			22: [2, 193],
			25: [2, 193],
			28: [2, 193],
			34: [2, 193],
			36: [2, 193],
			37: [2, 193],
			39: [2, 193],
			40: [2, 193],
			41: [2, 193],
			42: [2, 193],
			43: [2, 193],
			46: [2, 193],
			47: [2, 193],
			48: [2, 193],
			49: [2, 193],
			50: [2, 193],
			51: [2, 193],
			56: [2, 193],
			57: [2, 193],
			58: [2, 193],
			59: [2, 193],
			60: [2, 193],
			65: [2, 193],
			67: [2, 193],
			73: [2, 193],
			78: [2, 193],
			81: [2, 193],
			82: [2, 193],
			94: [2, 193],
			105: [2, 193],
			106: [2, 193],
			111: [2, 193],
			112: [2, 193],
			113: [2, 193],
			114: [2, 193],
			115: [2, 193],
			116: [1, 321],
			117: [1, 322],
			118: [2, 193],
			119: [2, 193],
			122: [2, 193],
			128: [2, 193],
			129: [2, 193],
			130: [2, 193],
			133: [2, 193],
			134: [2, 193],
			135: [2, 193],
			136: [2, 193],
			137: [2, 193],
			141: [2, 193],
			142: [2, 193],
			143: [2, 193],
			144: [2, 193],
			148: [2, 193],
			152: [2, 193],
			156: [2, 193],
			160: [2, 193],
			164: [2, 193],
			168: [2, 193],
			174: [2, 193],
			187: [2, 193],
			188: [2, 193],
			189: [2, 193],
			190: [2, 193],
			191: [2, 193]
		}, {
			2: [2, 194],
			19: [2, 194],
			21: [2, 194],
			22: [2, 194],
			25: [2, 194],
			28: [2, 194],
			34: [2, 194],
			36: [2, 194],
			37: [2, 194],
			39: [2, 194],
			40: [2, 194],
			41: [2, 194],
			42: [2, 194],
			43: [2, 194],
			46: [2, 194],
			47: [2, 194],
			48: [2, 194],
			49: [2, 194],
			50: [2, 194],
			51: [2, 194],
			56: [2, 194],
			57: [2, 194],
			58: [2, 194],
			59: [2, 194],
			60: [2, 194],
			65: [2, 194],
			67: [2, 194],
			73: [2, 194],
			78: [2, 194],
			81: [2, 194],
			82: [2, 194],
			94: [2, 194],
			105: [2, 194],
			106: [2, 194],
			111: [2, 194],
			112: [2, 194],
			113: [2, 194],
			114: [2, 194],
			115: [2, 194],
			116: [1, 321],
			117: [1, 322],
			118: [2, 194],
			119: [2, 194],
			122: [2, 194],
			128: [2, 194],
			129: [2, 194],
			130: [2, 194],
			133: [2, 194],
			134: [2, 194],
			135: [2, 194],
			136: [2, 194],
			137: [2, 194],
			141: [2, 194],
			142: [2, 194],
			143: [2, 194],
			144: [2, 194],
			148: [2, 194],
			152: [2, 194],
			156: [2, 194],
			160: [2, 194],
			164: [2, 194],
			168: [2, 194],
			174: [2, 194],
			187: [2, 194],
			188: [2, 194],
			189: [2, 194],
			190: [2, 194],
			191: [2, 194]
		}, {
			2: [2, 195],
			19: [2, 195],
			21: [2, 195],
			22: [2, 195],
			25: [2, 195],
			28: [2, 195],
			34: [2, 195],
			36: [2, 195],
			37: [2, 195],
			39: [2, 195],
			40: [2, 195],
			41: [2, 195],
			42: [2, 195],
			43: [2, 195],
			46: [2, 195],
			47: [2, 195],
			48: [2, 195],
			49: [2, 195],
			50: [2, 195],
			51: [2, 195],
			56: [2, 195],
			57: [2, 195],
			58: [2, 195],
			59: [2, 195],
			60: [2, 195],
			65: [2, 195],
			67: [2, 195],
			73: [2, 195],
			78: [2, 195],
			81: [2, 195],
			82: [2, 195],
			94: [2, 195],
			105: [2, 195],
			106: [2, 195],
			111: [2, 195],
			112: [2, 195],
			113: [2, 195],
			114: [2, 195],
			115: [2, 195],
			116: [1, 321],
			117: [1, 322],
			118: [2, 195],
			119: [2, 195],
			122: [2, 195],
			128: [2, 195],
			129: [2, 195],
			130: [2, 195],
			133: [2, 195],
			134: [2, 195],
			135: [2, 195],
			136: [2, 195],
			137: [2, 195],
			141: [2, 195],
			142: [2, 195],
			143: [2, 195],
			144: [2, 195],
			148: [2, 195],
			152: [2, 195],
			156: [2, 195],
			160: [2, 195],
			164: [2, 195],
			168: [2, 195],
			174: [2, 195],
			187: [2, 195],
			188: [2, 195],
			189: [2, 195],
			190: [2, 195],
			191: [2, 195]
		}, {
			2: [2, 187],
			19: [2, 187],
			21: [2, 187],
			22: [2, 187],
			25: [2, 187],
			28: [2, 187],
			34: [2, 187],
			36: [2, 187],
			37: [2, 187],
			39: [2, 187],
			40: [2, 187],
			41: [2, 187],
			42: [2, 187],
			43: [2, 187],
			46: [2, 187],
			47: [2, 187],
			48: [2, 187],
			49: [2, 187],
			50: [2, 187],
			51: [2, 187],
			56: [2, 187],
			57: [2, 187],
			58: [2, 187],
			59: [2, 187],
			60: [2, 187],
			65: [2, 187],
			67: [2, 187],
			73: [2, 187],
			78: [2, 187],
			81: [2, 187],
			82: [2, 187],
			94: [2, 187],
			105: [2, 187],
			106: [2, 187],
			111: [2, 187],
			112: [2, 187],
			113: [2, 187],
			114: [2, 187],
			115: [2, 187],
			116: [2, 187],
			117: [2, 187],
			118: [2, 187],
			119: [2, 187],
			121: [1, 323],
			122: [1, 324],
			123: [1, 325],
			128: [2, 187],
			129: [2, 187],
			130: [2, 187],
			133: [2, 187],
			134: [2, 187],
			135: [2, 187],
			136: [2, 187],
			137: [2, 187],
			141: [2, 187],
			142: [2, 187],
			143: [2, 187],
			144: [2, 187],
			148: [2, 187],
			152: [2, 187],
			156: [2, 187],
			160: [2, 187],
			164: [2, 187],
			168: [2, 187],
			174: [2, 187],
			187: [2, 187],
			188: [2, 187],
			189: [2, 187],
			190: [2, 187],
			191: [2, 187]
		}, {
			2: [2, 188],
			19: [2, 188],
			21: [2, 188],
			22: [2, 188],
			25: [2, 188],
			28: [2, 188],
			34: [2, 188],
			36: [2, 188],
			37: [2, 188],
			39: [2, 188],
			40: [2, 188],
			41: [2, 188],
			42: [2, 188],
			43: [2, 188],
			46: [2, 188],
			47: [2, 188],
			48: [2, 188],
			49: [2, 188],
			50: [2, 188],
			51: [2, 188],
			56: [2, 188],
			57: [2, 188],
			58: [2, 188],
			59: [2, 188],
			60: [2, 188],
			65: [2, 188],
			67: [2, 188],
			73: [2, 188],
			78: [2, 188],
			81: [2, 188],
			82: [2, 188],
			94: [2, 188],
			105: [2, 188],
			106: [2, 188],
			111: [2, 188],
			112: [2, 188],
			113: [2, 188],
			114: [2, 188],
			115: [2, 188],
			116: [2, 188],
			117: [2, 188],
			118: [2, 188],
			119: [2, 188],
			121: [1, 323],
			122: [1, 324],
			123: [1, 325],
			128: [2, 188],
			129: [2, 188],
			130: [2, 188],
			133: [2, 188],
			134: [2, 188],
			135: [2, 188],
			136: [2, 188],
			137: [2, 188],
			141: [2, 188],
			142: [2, 188],
			143: [2, 188],
			144: [2, 188],
			148: [2, 188],
			152: [2, 188],
			156: [2, 188],
			160: [2, 188],
			164: [2, 188],
			168: [2, 188],
			174: [2, 188],
			187: [2, 188],
			188: [2, 188],
			189: [2, 188],
			190: [2, 188],
			191: [2, 188]
		}, {
			2: [2, 179],
			19: [2, 179],
			21: [2, 179],
			22: [2, 179],
			25: [2, 179],
			28: [2, 179],
			34: [2, 179],
			36: [2, 179],
			37: [2, 179],
			39: [2, 179],
			40: [2, 179],
			41: [2, 179],
			42: [2, 179],
			43: [2, 179],
			46: [2, 179],
			47: [2, 179],
			48: [2, 179],
			49: [2, 179],
			50: [2, 179],
			51: [2, 179],
			56: [2, 179],
			57: [2, 179],
			58: [2, 179],
			59: [2, 179],
			60: [2, 179],
			65: [2, 179],
			67: [2, 179],
			73: [2, 179],
			78: [2, 179],
			81: [2, 179],
			82: [2, 179],
			94: [2, 179],
			105: [2, 179],
			106: [2, 179],
			111: [2, 179],
			112: [2, 179],
			113: [2, 179],
			114: [2, 179],
			115: [2, 179],
			116: [2, 179],
			117: [2, 179],
			118: [2, 179],
			119: [2, 179],
			121: [2, 179],
			122: [2, 179],
			123: [2, 179],
			128: [2, 179],
			129: [2, 179],
			130: [2, 179],
			133: [2, 179],
			134: [2, 179],
			135: [2, 179],
			136: [2, 179],
			137: [2, 179],
			141: [2, 179],
			142: [2, 179],
			143: [2, 179],
			144: [2, 179],
			148: [2, 179],
			152: [2, 179],
			156: [2, 179],
			160: [2, 179],
			164: [2, 179],
			168: [2, 179],
			174: [2, 179],
			187: [2, 179],
			188: [2, 179],
			189: [2, 179],
			190: [2, 179],
			191: [2, 179]
		}, {
			2: [2, 180],
			19: [2, 180],
			21: [2, 180],
			22: [2, 180],
			25: [2, 180],
			28: [2, 180],
			34: [2, 180],
			36: [2, 180],
			37: [2, 180],
			39: [2, 180],
			40: [2, 180],
			41: [2, 180],
			42: [2, 180],
			43: [2, 180],
			46: [2, 180],
			47: [2, 180],
			48: [2, 180],
			49: [2, 180],
			50: [2, 180],
			51: [2, 180],
			56: [2, 180],
			57: [2, 180],
			58: [2, 180],
			59: [2, 180],
			60: [2, 180],
			65: [2, 180],
			67: [2, 180],
			73: [2, 180],
			78: [2, 180],
			81: [2, 180],
			82: [2, 180],
			94: [2, 180],
			105: [2, 180],
			106: [2, 180],
			111: [2, 180],
			112: [2, 180],
			113: [2, 180],
			114: [2, 180],
			115: [2, 180],
			116: [2, 180],
			117: [2, 180],
			118: [2, 180],
			119: [2, 180],
			121: [2, 180],
			122: [2, 180],
			123: [2, 180],
			128: [2, 180],
			129: [2, 180],
			130: [2, 180],
			133: [2, 180],
			134: [2, 180],
			135: [2, 180],
			136: [2, 180],
			137: [2, 180],
			141: [2, 180],
			142: [2, 180],
			143: [2, 180],
			144: [2, 180],
			148: [2, 180],
			152: [2, 180],
			156: [2, 180],
			160: [2, 180],
			164: [2, 180],
			168: [2, 180],
			174: [2, 180],
			187: [2, 180],
			188: [2, 180],
			189: [2, 180],
			190: [2, 180],
			191: [2, 180]
		}, {
			2: [2, 181],
			19: [2, 181],
			21: [2, 181],
			22: [2, 181],
			25: [2, 181],
			28: [2, 181],
			34: [2, 181],
			36: [2, 181],
			37: [2, 181],
			39: [2, 181],
			40: [2, 181],
			41: [2, 181],
			42: [2, 181],
			43: [2, 181],
			46: [2, 181],
			47: [2, 181],
			48: [2, 181],
			49: [2, 181],
			50: [2, 181],
			51: [2, 181],
			56: [2, 181],
			57: [2, 181],
			58: [2, 181],
			59: [2, 181],
			60: [2, 181],
			65: [2, 181],
			67: [2, 181],
			73: [2, 181],
			78: [2, 181],
			81: [2, 181],
			82: [2, 181],
			94: [2, 181],
			105: [2, 181],
			106: [2, 181],
			111: [2, 181],
			112: [2, 181],
			113: [2, 181],
			114: [2, 181],
			115: [2, 181],
			116: [2, 181],
			117: [2, 181],
			118: [2, 181],
			119: [2, 181],
			121: [2, 181],
			122: [2, 181],
			123: [2, 181],
			128: [2, 181],
			129: [2, 181],
			130: [2, 181],
			133: [2, 181],
			134: [2, 181],
			135: [2, 181],
			136: [2, 181],
			137: [2, 181],
			141: [2, 181],
			142: [2, 181],
			143: [2, 181],
			144: [2, 181],
			148: [2, 181],
			152: [2, 181],
			156: [2, 181],
			160: [2, 181],
			164: [2, 181],
			168: [2, 181],
			174: [2, 181],
			187: [2, 181],
			188: [2, 181],
			189: [2, 181],
			190: [2, 181],
			191: [2, 181]
		}, {
			3: 508,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 510],
			52: 509
		}, {
			19: [2, 77],
			21: [2, 77],
			22: [2, 77],
			28: [2, 77],
			34: [2, 77],
			36: [2, 77],
			37: [2, 77],
			40: [2, 77],
			41: [2, 77],
			42: [2, 77],
			43: [2, 77],
			47: [2, 77],
			48: [2, 77],
			49: [2, 77],
			50: [2, 77],
			51: [2, 77],
			56: [2, 77],
			58: [2, 77],
			59: [2, 77],
			60: [2, 77],
			65: [2, 77],
			67: [2, 77],
			73: [2, 77],
			78: [2, 77],
			81: [2, 77],
			94: [2, 77],
			105: [2, 77],
			106: [2, 77],
			111: [2, 77],
			112: [2, 77],
			113: [2, 77],
			114: [2, 77],
			115: [2, 77],
			116: [2, 77],
			117: [2, 77],
			118: [2, 77],
			119: [2, 77],
			122: [2, 77],
			174: [2, 77],
			187: [2, 77],
			188: [2, 77],
			189: [2, 77],
			190: [2, 77],
			191: [2, 77]
		}, {
			28: [1, 511]
		}, {
			19: [2, 79],
			21: [2, 79],
			22: [2, 79],
			28: [2, 79],
			34: [2, 79],
			36: [2, 79],
			37: [2, 79],
			40: [2, 79],
			41: [2, 79],
			42: [2, 79],
			43: [2, 79],
			47: [2, 79],
			48: [2, 79],
			49: [2, 79],
			50: [2, 79],
			51: [2, 79],
			56: [2, 79],
			58: [2, 79],
			59: [2, 79],
			60: [2, 79],
			65: [2, 79],
			67: [2, 79],
			73: [2, 79],
			78: [2, 79],
			81: [2, 79],
			94: [2, 79],
			105: [2, 79],
			106: [2, 79],
			111: [2, 79],
			112: [2, 79],
			113: [2, 79],
			114: [2, 79],
			115: [2, 79],
			116: [2, 79],
			117: [2, 79],
			118: [2, 79],
			119: [2, 79],
			122: [2, 79],
			174: [2, 79],
			187: [2, 79],
			188: [2, 79],
			189: [2, 79],
			190: [2, 79],
			191: [2, 79]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 512,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 145],
			25: [2, 145],
			31: [2, 145],
			34: [2, 145],
			37: [2, 145],
			46: [2, 145],
			81: [2, 145],
			93: [2, 145],
			105: [2, 145],
			106: [2, 145],
			116: [2, 145],
			117: [2, 145],
			121: [2, 145],
			122: [2, 145],
			123: [2, 145],
			128: [2, 145],
			129: [2, 145],
			130: [2, 145],
			133: [2, 145],
			134: [2, 145],
			135: [2, 145],
			136: [2, 145],
			137: [2, 145],
			141: [2, 145],
			142: [2, 145],
			143: [2, 145],
			144: [2, 145],
			148: [2, 145],
			152: [2, 145],
			156: [2, 145],
			160: [2, 145],
			164: [2, 145],
			168: [2, 145],
			173: [2, 145],
			174: [2, 145],
			175: [2, 145],
			176: [2, 145],
			177: [2, 145],
			178: [2, 145],
			179: [2, 145],
			180: [2, 145],
			181: [2, 145],
			182: [2, 145],
			183: [2, 145]
		}, {
			2: [2, 150],
			19: [2, 150],
			21: [2, 150],
			22: [2, 150],
			25: [2, 150],
			28: [2, 150],
			31: [2, 150],
			34: [2, 150],
			36: [2, 150],
			37: [2, 150],
			39: [2, 150],
			40: [2, 150],
			41: [2, 150],
			42: [2, 150],
			43: [2, 150],
			46: [2, 150],
			47: [2, 150],
			48: [2, 150],
			49: [2, 150],
			50: [2, 150],
			51: [2, 150],
			56: [2, 150],
			57: [2, 150],
			58: [2, 150],
			59: [2, 150],
			60: [2, 150],
			65: [2, 150],
			67: [2, 150],
			73: [2, 150],
			78: [2, 150],
			81: [2, 150],
			82: [2, 150],
			93: [2, 150],
			94: [2, 150],
			105: [2, 150],
			106: [2, 150],
			111: [2, 150],
			112: [2, 150],
			113: [2, 150],
			114: [2, 150],
			115: [2, 150],
			116: [2, 150],
			117: [2, 150],
			118: [2, 150],
			119: [2, 150],
			121: [2, 150],
			122: [2, 150],
			123: [2, 150],
			128: [2, 150],
			129: [2, 150],
			130: [2, 150],
			133: [2, 150],
			134: [2, 150],
			135: [2, 150],
			136: [2, 150],
			137: [2, 150],
			141: [2, 150],
			142: [2, 150],
			143: [2, 150],
			144: [2, 150],
			148: [2, 150],
			152: [2, 150],
			156: [2, 150],
			160: [2, 150],
			164: [2, 150],
			168: [2, 150],
			173: [2, 150],
			174: [2, 150],
			175: [2, 150],
			176: [2, 150],
			177: [2, 150],
			178: [2, 150],
			179: [2, 150],
			180: [2, 150],
			181: [2, 150],
			182: [2, 150],
			183: [2, 150],
			187: [2, 150],
			188: [2, 150],
			189: [2, 150],
			190: [2, 150],
			191: [2, 150]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 513,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 132],
			25: [2, 132],
			31: [2, 132],
			34: [2, 132],
			37: [2, 132],
			46: [2, 132],
			81: [2, 132],
			93: [2, 132],
			105: [2, 132],
			106: [2, 132],
			116: [2, 132],
			117: [2, 132],
			121: [2, 132],
			122: [2, 132],
			123: [2, 132],
			128: [2, 132],
			129: [2, 132],
			130: [2, 132],
			133: [2, 132],
			134: [2, 132],
			135: [2, 132],
			136: [2, 132],
			137: [2, 132],
			141: [2, 132],
			142: [2, 132],
			143: [2, 132],
			144: [2, 132],
			148: [2, 132],
			152: [2, 132],
			156: [2, 132],
			160: [2, 132],
			164: [2, 132],
			168: [2, 132],
			173: [2, 132],
			174: [2, 132],
			175: [2, 132],
			176: [2, 132],
			177: [2, 132],
			178: [2, 132],
			179: [2, 132],
			180: [2, 132],
			181: [2, 132],
			182: [2, 132],
			183: [2, 132]
		}, {
			2: [2, 106],
			19: [2, 106],
			21: [2, 106],
			22: [2, 106],
			25: [2, 106],
			28: [2, 106],
			31: [2, 106],
			34: [2, 106],
			36: [2, 106],
			37: [2, 106],
			39: [2, 106],
			40: [2, 106],
			41: [2, 106],
			42: [2, 106],
			43: [2, 106],
			46: [2, 106],
			47: [2, 106],
			48: [2, 106],
			49: [2, 106],
			50: [2, 106],
			51: [2, 106],
			56: [2, 106],
			57: [2, 106],
			58: [2, 106],
			59: [2, 106],
			60: [2, 106],
			65: [2, 106],
			67: [2, 106],
			73: [2, 106],
			78: [2, 106],
			81: [2, 106],
			82: [2, 106],
			93: [2, 106],
			94: [2, 106],
			105: [2, 106],
			106: [2, 106],
			111: [2, 106],
			112: [2, 106],
			113: [2, 106],
			114: [2, 106],
			115: [2, 106],
			116: [2, 106],
			117: [2, 106],
			118: [2, 106],
			119: [2, 106],
			121: [2, 106],
			122: [2, 106],
			123: [2, 106],
			128: [2, 106],
			129: [2, 106],
			130: [2, 106],
			133: [2, 106],
			134: [2, 106],
			135: [2, 106],
			136: [2, 106],
			137: [2, 106],
			141: [2, 106],
			142: [2, 106],
			143: [2, 106],
			144: [2, 106],
			148: [2, 106],
			152: [2, 106],
			156: [2, 106],
			160: [2, 106],
			164: [2, 106],
			168: [2, 106],
			173: [2, 106],
			174: [2, 106],
			175: [2, 106],
			176: [2, 106],
			177: [2, 106],
			178: [2, 106],
			179: [2, 106],
			180: [2, 106],
			181: [2, 106],
			182: [2, 106],
			183: [2, 106],
			187: [2, 106],
			188: [2, 106],
			189: [2, 106],
			190: [2, 106],
			191: [2, 106]
		}, {
			19: [1, 129],
			25: [1, 354],
			28: [1, 128],
			32: 515,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			82: [1, 514],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [2, 110],
			82: [2, 110]
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 516,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			19: [1, 518]
		}, {
			28: [1, 519]
		}, {
			19: [2, 33],
			21: [2, 33],
			22: [2, 33],
			28: [2, 33],
			34: [2, 33],
			36: [2, 33],
			37: [2, 33],
			40: [1, 520],
			41: [2, 33],
			42: [2, 33],
			43: [2, 33],
			47: [2, 33],
			48: [2, 33],
			49: [2, 33],
			50: [2, 33],
			51: [2, 33],
			56: [2, 33],
			58: [2, 33],
			59: [2, 33],
			60: [2, 33],
			65: [2, 33],
			67: [2, 33],
			73: [2, 33],
			78: [2, 33],
			81: [2, 33],
			94: [2, 33],
			105: [2, 33],
			106: [2, 33],
			111: [2, 33],
			112: [2, 33],
			113: [2, 33],
			114: [2, 33],
			115: [2, 33],
			116: [2, 33],
			117: [2, 33],
			118: [2, 33],
			119: [2, 33],
			122: [2, 33],
			174: [2, 33],
			187: [2, 33],
			188: [2, 33],
			189: [2, 33],
			190: [2, 33],
			191: [2, 33]
		}, {
			25: [1, 242],
			39: [1, 521]
		}, {
			19: [2, 37],
			21: [2, 37],
			22: [2, 37],
			28: [2, 37],
			34: [2, 37],
			36: [2, 37],
			37: [2, 37],
			40: [2, 37],
			41: [2, 37],
			42: [2, 37],
			43: [2, 37],
			47: [2, 37],
			48: [2, 37],
			49: [2, 37],
			50: [2, 37],
			51: [2, 37],
			56: [2, 37],
			58: [2, 37],
			59: [2, 37],
			60: [2, 37],
			65: [2, 37],
			67: [2, 37],
			73: [2, 37],
			78: [2, 37],
			81: [2, 37],
			94: [2, 37],
			105: [2, 37],
			106: [2, 37],
			111: [2, 37],
			112: [2, 37],
			113: [2, 37],
			114: [2, 37],
			115: [2, 37],
			116: [2, 37],
			117: [2, 37],
			118: [2, 37],
			119: [2, 37],
			122: [2, 37],
			174: [2, 37],
			187: [2, 37],
			188: [2, 37],
			189: [2, 37],
			190: [2, 37],
			191: [2, 37]
		}, {
			25: [1, 242],
			34: [1, 522]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 523,
			39: [1, 524],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [2, 294],
			34: [2, 294]
		}, {
			25: [2, 157],
			31: [1, 392],
			34: [2, 157],
			46: [2, 157],
			105: [1, 245],
			106: [1, 246],
			116: [2, 157],
			117: [2, 157],
			121: [2, 157],
			122: [2, 157],
			123: [2, 157],
			128: [2, 157],
			129: [2, 157],
			130: [2, 157],
			133: [2, 157],
			134: [2, 157],
			135: [2, 157],
			136: [2, 157],
			137: [2, 157],
			141: [2, 157],
			142: [2, 157],
			143: [2, 157],
			144: [2, 157],
			148: [2, 157],
			152: [2, 157],
			156: [2, 157],
			160: [2, 157],
			164: [2, 157],
			168: [2, 157],
			171: 393,
			173: [1, 149],
			174: [1, 150],
			175: [1, 151],
			176: [1, 152],
			177: [1, 153],
			178: [1, 154],
			179: [1, 155],
			180: [1, 156],
			181: [1, 157],
			182: [1, 158],
			183: [1, 159]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 525,
			39: [1, 526],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			39: [1, 527]
		}, {
			3: 528,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			34: [1, 530],
			37: [1, 55],
			38: 529,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			27: 531,
			28: [1, 390]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 532,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [2, 27],
			34: [2, 27],
			46: [2, 27]
		}, {
			19: [1, 129],
			28: [1, 128],
			33: 533,
			37: [1, 55],
			45: 470,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 230,
			161: 229,
			165: 228,
			169: 227,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			39: [1, 534]
		}, {
			25: [2, 275],
			34: [2, 275],
			46: [2, 275]
		}, {
			25: [2, 276],
			34: [2, 276],
			46: [2, 276]
		}, {
			57: [1, 535]
		}, {
			25: [2, 262],
			34: [2, 262],
			46: [2, 262],
			160: [1, 396],
			164: [2, 262],
			168: [2, 262]
		}, {
			25: [2, 256],
			34: [2, 256],
			46: [2, 256],
			156: [1, 397],
			160: [2, 256],
			164: [2, 256],
			168: [2, 256]
		}, {
			25: [2, 250],
			34: [2, 250],
			46: [2, 250],
			152: [1, 398],
			156: [2, 250],
			160: [2, 250],
			164: [2, 250],
			168: [2, 250]
		}, {
			25: [2, 244],
			34: [2, 244],
			46: [2, 244],
			148: [1, 399],
			152: [2, 244],
			156: [2, 244],
			160: [2, 244],
			164: [2, 244],
			168: [2, 244]
		}, {
			25: [2, 238],
			34: [2, 238],
			46: [2, 238],
			141: [1, 400],
			142: [1, 401],
			143: [1, 402],
			144: [1, 403],
			148: [2, 238],
			152: [2, 238],
			156: [2, 238],
			160: [2, 238],
			164: [2, 238],
			168: [2, 238]
		}, {
			25: [2, 226],
			34: [2, 226],
			46: [2, 226],
			133: [1, 404],
			134: [1, 405],
			135: [1, 406],
			136: [1, 407],
			137: [1, 408],
			141: [2, 226],
			142: [2, 226],
			143: [2, 226],
			144: [2, 226],
			148: [2, 226],
			152: [2, 226],
			156: [2, 226],
			160: [2, 226],
			164: [2, 226],
			168: [2, 226]
		}, {
			25: [2, 227],
			34: [2, 227],
			46: [2, 227],
			133: [1, 404],
			134: [1, 405],
			135: [1, 406],
			136: [1, 407],
			137: [1, 408],
			141: [2, 227],
			142: [2, 227],
			143: [2, 227],
			144: [2, 227],
			148: [2, 227],
			152: [2, 227],
			156: [2, 227],
			160: [2, 227],
			164: [2, 227],
			168: [2, 227]
		}, {
			25: [2, 228],
			34: [2, 228],
			46: [2, 228],
			133: [1, 404],
			134: [1, 405],
			135: [1, 406],
			136: [1, 407],
			137: [1, 408],
			141: [2, 228],
			142: [2, 228],
			143: [2, 228],
			144: [2, 228],
			148: [2, 228],
			152: [2, 228],
			156: [2, 228],
			160: [2, 228],
			164: [2, 228],
			168: [2, 228]
		}, {
			25: [2, 229],
			34: [2, 229],
			46: [2, 229],
			133: [1, 404],
			134: [1, 405],
			135: [1, 406],
			136: [1, 407],
			137: [1, 408],
			141: [2, 229],
			142: [2, 229],
			143: [2, 229],
			144: [2, 229],
			148: [2, 229],
			152: [2, 229],
			156: [2, 229],
			160: [2, 229],
			164: [2, 229],
			168: [2, 229]
		}, {
			25: [2, 208],
			34: [2, 208],
			46: [2, 208],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 208],
			134: [2, 208],
			135: [2, 208],
			136: [2, 208],
			137: [2, 208],
			141: [2, 208],
			142: [2, 208],
			143: [2, 208],
			144: [2, 208],
			148: [2, 208],
			152: [2, 208],
			156: [2, 208],
			160: [2, 208],
			164: [2, 208],
			168: [2, 208]
		}, {
			25: [2, 209],
			34: [2, 209],
			46: [2, 209],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 209],
			134: [2, 209],
			135: [2, 209],
			136: [2, 209],
			137: [2, 209],
			141: [2, 209],
			142: [2, 209],
			143: [2, 209],
			144: [2, 209],
			148: [2, 209],
			152: [2, 209],
			156: [2, 209],
			160: [2, 209],
			164: [2, 209],
			168: [2, 209]
		}, {
			25: [2, 210],
			34: [2, 210],
			46: [2, 210],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 210],
			134: [2, 210],
			135: [2, 210],
			136: [2, 210],
			137: [2, 210],
			141: [2, 210],
			142: [2, 210],
			143: [2, 210],
			144: [2, 210],
			148: [2, 210],
			152: [2, 210],
			156: [2, 210],
			160: [2, 210],
			164: [2, 210],
			168: [2, 210]
		}, {
			25: [2, 211],
			34: [2, 211],
			46: [2, 211],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 211],
			134: [2, 211],
			135: [2, 211],
			136: [2, 211],
			137: [2, 211],
			141: [2, 211],
			142: [2, 211],
			143: [2, 211],
			144: [2, 211],
			148: [2, 211],
			152: [2, 211],
			156: [2, 211],
			160: [2, 211],
			164: [2, 211],
			168: [2, 211]
		}, {
			25: [2, 212],
			34: [2, 212],
			46: [2, 212],
			128: [1, 318],
			129: [1, 319],
			130: [1, 320],
			133: [2, 212],
			134: [2, 212],
			135: [2, 212],
			136: [2, 212],
			137: [2, 212],
			141: [2, 212],
			142: [2, 212],
			143: [2, 212],
			144: [2, 212],
			148: [2, 212],
			152: [2, 212],
			156: [2, 212],
			160: [2, 212],
			164: [2, 212],
			168: [2, 212]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 536,
			37: [1, 55],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 141],
			19: [2, 141],
			21: [2, 141],
			22: [2, 141],
			25: [2, 141],
			28: [2, 141],
			31: [2, 141],
			34: [2, 141],
			36: [2, 141],
			37: [2, 141],
			39: [2, 141],
			40: [2, 141],
			41: [2, 141],
			42: [2, 141],
			43: [2, 141],
			46: [2, 141],
			47: [2, 141],
			48: [2, 141],
			49: [2, 141],
			50: [2, 141],
			51: [2, 141],
			56: [2, 141],
			57: [2, 141],
			58: [2, 141],
			59: [2, 141],
			60: [2, 141],
			65: [2, 141],
			67: [2, 141],
			73: [2, 141],
			78: [2, 141],
			81: [2, 141],
			82: [2, 141],
			93: [2, 141],
			94: [2, 141],
			105: [2, 141],
			106: [2, 141],
			111: [2, 141],
			112: [2, 141],
			113: [2, 141],
			114: [2, 141],
			115: [2, 141],
			116: [2, 141],
			117: [2, 141],
			118: [2, 141],
			119: [2, 141],
			121: [2, 141],
			122: [2, 141],
			123: [2, 141],
			128: [2, 141],
			129: [2, 141],
			130: [2, 141],
			133: [2, 141],
			134: [2, 141],
			135: [2, 141],
			136: [2, 141],
			137: [2, 141],
			141: [2, 141],
			142: [2, 141],
			143: [2, 141],
			144: [2, 141],
			148: [2, 141],
			152: [2, 141],
			156: [2, 141],
			160: [2, 141],
			164: [2, 141],
			168: [2, 141],
			173: [2, 141],
			174: [2, 141],
			175: [2, 141],
			176: [2, 141],
			177: [2, 141],
			178: [2, 141],
			179: [2, 141],
			180: [2, 141],
			181: [2, 141],
			182: [2, 141],
			183: [2, 141],
			187: [2, 141],
			188: [2, 141],
			189: [2, 141],
			190: [2, 141],
			191: [2, 141]
		}, {
			2: [2, 128],
			19: [2, 128],
			21: [2, 128],
			22: [2, 128],
			25: [2, 128],
			28: [2, 128],
			31: [2, 128],
			34: [2, 128],
			36: [2, 128],
			37: [2, 128],
			39: [2, 128],
			40: [2, 128],
			41: [2, 128],
			42: [2, 128],
			43: [2, 128],
			46: [2, 128],
			47: [2, 128],
			48: [2, 128],
			49: [2, 128],
			50: [2, 128],
			51: [2, 128],
			56: [2, 128],
			57: [2, 128],
			58: [2, 128],
			59: [2, 128],
			60: [2, 128],
			65: [2, 128],
			67: [2, 128],
			73: [2, 128],
			78: [2, 128],
			81: [2, 128],
			82: [2, 128],
			93: [2, 128],
			94: [2, 128],
			105: [2, 128],
			106: [2, 128],
			111: [2, 128],
			112: [2, 128],
			113: [2, 128],
			114: [2, 128],
			115: [2, 128],
			116: [2, 128],
			117: [2, 128],
			118: [2, 128],
			119: [2, 128],
			121: [2, 128],
			122: [2, 128],
			123: [2, 128],
			128: [2, 128],
			129: [2, 128],
			130: [2, 128],
			133: [2, 128],
			134: [2, 128],
			135: [2, 128],
			136: [2, 128],
			137: [2, 128],
			141: [2, 128],
			142: [2, 128],
			143: [2, 128],
			144: [2, 128],
			148: [2, 128],
			152: [2, 128],
			156: [2, 128],
			160: [2, 128],
			164: [2, 128],
			168: [2, 128],
			173: [2, 128],
			174: [2, 128],
			175: [2, 128],
			176: [2, 128],
			177: [2, 128],
			178: [2, 128],
			179: [2, 128],
			180: [2, 128],
			181: [2, 128],
			182: [2, 128],
			183: [2, 128],
			187: [2, 128],
			188: [2, 128],
			189: [2, 128],
			190: [2, 128],
			191: [2, 128]
		}, {
			19: [1, 537]
		}, {
			25: [1, 463],
			39: [1, 538]
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 539,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			19: [1, 540]
		}, {
			2: [2, 116],
			19: [2, 116],
			21: [2, 116],
			22: [2, 116],
			25: [2, 116],
			28: [2, 116],
			31: [2, 116],
			34: [2, 116],
			36: [2, 116],
			37: [2, 116],
			39: [2, 116],
			40: [2, 116],
			41: [2, 116],
			42: [2, 116],
			43: [2, 116],
			46: [2, 116],
			47: [2, 116],
			48: [2, 116],
			49: [2, 116],
			50: [2, 116],
			51: [2, 116],
			56: [2, 116],
			57: [2, 116],
			58: [2, 116],
			59: [2, 116],
			60: [2, 116],
			65: [2, 116],
			67: [2, 116],
			73: [2, 116],
			78: [2, 116],
			81: [2, 116],
			82: [2, 116],
			93: [2, 116],
			94: [2, 116],
			105: [2, 116],
			106: [2, 116],
			111: [2, 116],
			112: [2, 116],
			113: [2, 116],
			114: [2, 116],
			115: [2, 116],
			116: [2, 116],
			117: [2, 116],
			118: [2, 116],
			119: [2, 116],
			121: [2, 116],
			122: [2, 116],
			123: [2, 116],
			128: [2, 116],
			129: [2, 116],
			130: [2, 116],
			133: [2, 116],
			134: [2, 116],
			135: [2, 116],
			136: [2, 116],
			137: [2, 116],
			141: [2, 116],
			142: [2, 116],
			143: [2, 116],
			144: [2, 116],
			148: [2, 116],
			152: [2, 116],
			156: [2, 116],
			160: [2, 116],
			164: [2, 116],
			168: [2, 116],
			173: [2, 116],
			174: [2, 116],
			175: [2, 116],
			176: [2, 116],
			177: [2, 116],
			178: [2, 116],
			179: [2, 116],
			180: [2, 116],
			181: [2, 116],
			182: [2, 116],
			183: [2, 116],
			187: [2, 116],
			188: [2, 116],
			189: [2, 116],
			190: [2, 116],
			191: [2, 116]
		}, {
			21: [2, 118],
			25: [2, 118]
		}, {
			21: [2, 119],
			25: [2, 119]
		}, {
			28: [1, 543],
			39: [1, 541],
			88: 542
		}, {
			19: [2, 64],
			21: [2, 64],
			22: [2, 64],
			28: [2, 64],
			34: [2, 64],
			36: [2, 64],
			37: [2, 64],
			40: [2, 64],
			41: [2, 64],
			42: [2, 64],
			43: [2, 64],
			47: [2, 64],
			48: [2, 64],
			49: [2, 64],
			50: [2, 64],
			51: [2, 64],
			56: [2, 64],
			58: [2, 64],
			59: [2, 64],
			60: [2, 64],
			65: [2, 64],
			67: [2, 64],
			73: [2, 64],
			78: [2, 64],
			81: [2, 64],
			94: [2, 64],
			105: [2, 64],
			106: [2, 64],
			111: [2, 64],
			112: [2, 64],
			113: [2, 64],
			114: [2, 64],
			115: [2, 64],
			116: [2, 64],
			117: [2, 64],
			118: [2, 64],
			119: [2, 64],
			122: [2, 64],
			174: [2, 64],
			187: [2, 64],
			188: [2, 64],
			189: [2, 64],
			190: [2, 64],
			191: [2, 64]
		}, {
			19: [2, 65],
			21: [2, 65],
			22: [2, 65],
			28: [2, 65],
			34: [2, 65],
			36: [2, 65],
			37: [2, 65],
			40: [2, 65],
			41: [2, 65],
			42: [2, 65],
			43: [2, 65],
			47: [2, 65],
			48: [2, 65],
			49: [2, 65],
			50: [2, 65],
			51: [2, 65],
			56: [2, 65],
			58: [2, 65],
			59: [2, 65],
			60: [2, 65],
			65: [2, 65],
			67: [2, 65],
			73: [2, 65],
			78: [2, 65],
			81: [2, 65],
			94: [2, 65],
			105: [2, 65],
			106: [2, 65],
			111: [2, 65],
			112: [2, 65],
			113: [2, 65],
			114: [2, 65],
			115: [2, 65],
			116: [2, 65],
			117: [2, 65],
			118: [2, 65],
			119: [2, 65],
			122: [2, 65],
			174: [2, 65],
			187: [2, 65],
			188: [2, 65],
			189: [2, 65],
			190: [2, 65],
			191: [2, 65]
		}, {
			21: [2, 69],
			53: 544,
			56: [2, 69],
			58: [2, 69]
		}, {
			39: [1, 545]
		}, {
			2: [2, 270],
			25: [2, 270],
			34: [2, 270]
		}, {
			25: [2, 152],
			39: [2, 152]
		}, {
			2: [2, 107],
			19: [2, 107],
			21: [2, 107],
			22: [2, 107],
			25: [2, 107],
			28: [2, 107],
			31: [2, 107],
			34: [2, 107],
			36: [2, 107],
			37: [2, 107],
			39: [2, 107],
			40: [2, 107],
			41: [2, 107],
			42: [2, 107],
			43: [2, 107],
			46: [2, 107],
			47: [2, 107],
			48: [2, 107],
			49: [2, 107],
			50: [2, 107],
			51: [2, 107],
			56: [2, 107],
			57: [2, 107],
			58: [2, 107],
			59: [2, 107],
			60: [2, 107],
			65: [2, 107],
			67: [2, 107],
			73: [2, 107],
			78: [2, 107],
			81: [2, 107],
			82: [2, 107],
			93: [2, 107],
			94: [2, 107],
			105: [2, 107],
			106: [2, 107],
			111: [2, 107],
			112: [2, 107],
			113: [2, 107],
			114: [2, 107],
			115: [2, 107],
			116: [2, 107],
			117: [2, 107],
			118: [2, 107],
			119: [2, 107],
			121: [2, 107],
			122: [2, 107],
			123: [2, 107],
			128: [2, 107],
			129: [2, 107],
			130: [2, 107],
			133: [2, 107],
			134: [2, 107],
			135: [2, 107],
			136: [2, 107],
			137: [2, 107],
			141: [2, 107],
			142: [2, 107],
			143: [2, 107],
			144: [2, 107],
			148: [2, 107],
			152: [2, 107],
			156: [2, 107],
			160: [2, 107],
			164: [2, 107],
			168: [2, 107],
			173: [2, 107],
			174: [2, 107],
			175: [2, 107],
			176: [2, 107],
			177: [2, 107],
			178: [2, 107],
			179: [2, 107],
			180: [2, 107],
			181: [2, 107],
			182: [2, 107],
			183: [2, 107],
			187: [2, 107],
			188: [2, 107],
			189: [2, 107],
			190: [2, 107],
			191: [2, 107]
		}, {
			25: [2, 111],
			82: [2, 111]
		}, {
			21: [1, 546]
		}, {
			3: 5,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			21: [2, 90],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			66: 6,
			67: [1, 22],
			74: 4,
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 547,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			25: [2, 89],
			39: [2, 89]
		}, {
			3: 548,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [1, 550],
			34: [1, 549]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 551,
			39: [1, 552],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			39: [1, 553]
		}, {
			3: 554,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			39: [1, 555]
		}, {
			3: 556,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			3: 557,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 45],
			21: [2, 45],
			22: [2, 45],
			28: [2, 45],
			34: [2, 45],
			36: [2, 45],
			37: [2, 45],
			40: [2, 45],
			41: [2, 45],
			42: [2, 45],
			43: [2, 45],
			47: [2, 45],
			48: [2, 45],
			49: [2, 45],
			50: [2, 45],
			51: [2, 45],
			56: [2, 45],
			58: [2, 45],
			59: [2, 45],
			60: [2, 45],
			65: [2, 45],
			67: [2, 45],
			73: [2, 45],
			78: [2, 45],
			81: [2, 45],
			94: [2, 45],
			105: [2, 45],
			106: [2, 45],
			111: [2, 45],
			112: [2, 45],
			113: [2, 45],
			114: [2, 45],
			115: [2, 45],
			116: [2, 45],
			117: [2, 45],
			118: [2, 45],
			119: [2, 45],
			122: [2, 45],
			174: [2, 45],
			187: [2, 45],
			188: [2, 45],
			189: [2, 45],
			190: [2, 45],
			191: [2, 45]
		}, {
			25: [1, 242],
			34: [1, 558]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 559,
			39: [1, 560],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [2, 23],
			34: [2, 23]
		}, {
			25: [1, 242],
			39: [1, 561]
		}, {
			25: [2, 29],
			34: [2, 29],
			46: [2, 29]
		}, {
			3: 562,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [1, 129],
			28: [1, 128],
			33: 563,
			37: [1, 55],
			45: 470,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 235,
			138: 234,
			145: 233,
			149: 232,
			153: 231,
			157: 230,
			161: 229,
			165: 228,
			169: 227,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			2: [2, 266],
			19: [2, 266],
			21: [2, 266],
			22: [2, 266],
			25: [2, 266],
			28: [2, 266],
			34: [2, 266],
			36: [2, 266],
			37: [2, 266],
			39: [2, 266],
			40: [2, 266],
			41: [2, 266],
			42: [2, 266],
			43: [2, 266],
			47: [2, 266],
			48: [2, 266],
			49: [2, 266],
			50: [2, 266],
			51: [2, 266],
			56: [2, 266],
			57: [2, 266],
			58: [2, 266],
			59: [2, 266],
			60: [2, 266],
			65: [2, 266],
			67: [2, 266],
			73: [2, 266],
			78: [2, 266],
			81: [2, 266],
			82: [2, 266],
			94: [2, 266],
			105: [2, 266],
			106: [2, 266],
			111: [2, 266],
			112: [2, 266],
			113: [2, 266],
			114: [2, 266],
			115: [2, 266],
			116: [2, 266],
			117: [2, 266],
			118: [2, 266],
			119: [2, 266],
			122: [2, 266],
			174: [2, 266],
			187: [2, 266],
			188: [2, 266],
			189: [2, 266],
			190: [2, 266],
			191: [2, 266]
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 564,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			19: [1, 565]
		}, {
			21: [1, 566]
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 567,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			19: [1, 568]
		}, {
			39: [1, 569]
		}, {
			39: [2, 125]
		}, {
			21: [1, 570],
			54: 571,
			55: 572,
			56: [1, 574],
			58: [1, 573]
		}, {
			4: 575,
			19: [1, 23]
		}, {
			19: [2, 82],
			21: [2, 82],
			22: [2, 82],
			28: [2, 82],
			34: [2, 82],
			36: [2, 82],
			37: [2, 82],
			41: [2, 82],
			42: [2, 82],
			43: [2, 82],
			47: [2, 82],
			48: [2, 82],
			49: [2, 82],
			50: [2, 82],
			51: [2, 82],
			59: [2, 82],
			60: [2, 82],
			65: [2, 82],
			67: [2, 82],
			73: [2, 82],
			78: [2, 82],
			81: [2, 82],
			94: [2, 82],
			105: [2, 82],
			106: [2, 82],
			111: [2, 82],
			112: [2, 82],
			113: [2, 82],
			114: [2, 82],
			115: [2, 82],
			116: [2, 82],
			117: [2, 82],
			118: [2, 82],
			119: [2, 82],
			122: [2, 82],
			174: [2, 82],
			187: [2, 82],
			188: [2, 82],
			189: [2, 82],
			190: [2, 82],
			191: [2, 82]
		}, {
			21: [1, 576]
		}, {
			19: [2, 34],
			21: [2, 34],
			22: [2, 34],
			28: [2, 34],
			34: [2, 34],
			36: [2, 34],
			37: [2, 34],
			40: [2, 34],
			41: [2, 34],
			42: [2, 34],
			43: [2, 34],
			47: [2, 34],
			48: [2, 34],
			49: [2, 34],
			50: [2, 34],
			51: [2, 34],
			56: [2, 34],
			58: [2, 34],
			59: [2, 34],
			60: [2, 34],
			65: [2, 34],
			67: [2, 34],
			73: [2, 34],
			78: [2, 34],
			81: [2, 34],
			94: [2, 34],
			105: [2, 34],
			106: [2, 34],
			111: [2, 34],
			112: [2, 34],
			113: [2, 34],
			114: [2, 34],
			115: [2, 34],
			116: [2, 34],
			117: [2, 34],
			118: [2, 34],
			119: [2, 34],
			122: [2, 34],
			174: [2, 34],
			187: [2, 34],
			188: [2, 34],
			189: [2, 34],
			190: [2, 34],
			191: [2, 34]
		}, {
			19: [2, 35],
			21: [2, 35],
			22: [2, 35],
			28: [2, 35],
			34: [2, 35],
			36: [2, 35],
			37: [2, 35],
			40: [2, 35],
			41: [2, 35],
			42: [2, 35],
			43: [2, 35],
			47: [2, 35],
			48: [2, 35],
			49: [2, 35],
			50: [2, 35],
			51: [2, 35],
			56: [2, 35],
			58: [2, 35],
			59: [2, 35],
			60: [2, 35],
			65: [2, 35],
			67: [2, 35],
			73: [2, 35],
			78: [2, 35],
			81: [2, 35],
			94: [2, 35],
			105: [2, 35],
			106: [2, 35],
			111: [2, 35],
			112: [2, 35],
			113: [2, 35],
			114: [2, 35],
			115: [2, 35],
			116: [2, 35],
			117: [2, 35],
			118: [2, 35],
			119: [2, 35],
			122: [2, 35],
			174: [2, 35],
			187: [2, 35],
			188: [2, 35],
			189: [2, 35],
			190: [2, 35],
			191: [2, 35]
		}, {
			19: [2, 36],
			21: [2, 36],
			22: [2, 36],
			28: [2, 36],
			34: [2, 36],
			36: [2, 36],
			37: [2, 36],
			40: [2, 36],
			41: [2, 36],
			42: [2, 36],
			43: [2, 36],
			47: [2, 36],
			48: [2, 36],
			49: [2, 36],
			50: [2, 36],
			51: [2, 36],
			56: [2, 36],
			58: [2, 36],
			59: [2, 36],
			60: [2, 36],
			65: [2, 36],
			67: [2, 36],
			73: [2, 36],
			78: [2, 36],
			81: [2, 36],
			94: [2, 36],
			105: [2, 36],
			106: [2, 36],
			111: [2, 36],
			112: [2, 36],
			113: [2, 36],
			114: [2, 36],
			115: [2, 36],
			116: [2, 36],
			117: [2, 36],
			118: [2, 36],
			119: [2, 36],
			122: [2, 36],
			174: [2, 36],
			187: [2, 36],
			188: [2, 36],
			189: [2, 36],
			190: [2, 36],
			191: [2, 36]
		}, {
			25: [1, 242],
			39: [1, 577]
		}, {
			3: 578,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			3: 579,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 41],
			21: [2, 41],
			22: [2, 41],
			28: [2, 41],
			34: [2, 41],
			36: [2, 41],
			37: [2, 41],
			40: [2, 41],
			41: [2, 41],
			42: [2, 41],
			43: [2, 41],
			47: [2, 41],
			48: [2, 41],
			49: [2, 41],
			50: [2, 41],
			51: [2, 41],
			56: [2, 41],
			58: [2, 41],
			59: [2, 41],
			60: [2, 41],
			65: [2, 41],
			67: [2, 41],
			73: [2, 41],
			78: [2, 41],
			81: [2, 41],
			94: [2, 41],
			105: [2, 41],
			106: [2, 41],
			111: [2, 41],
			112: [2, 41],
			113: [2, 41],
			114: [2, 41],
			115: [2, 41],
			116: [2, 41],
			117: [2, 41],
			118: [2, 41],
			119: [2, 41],
			122: [2, 41],
			174: [2, 41],
			187: [2, 41],
			188: [2, 41],
			189: [2, 41],
			190: [2, 41],
			191: [2, 41]
		}, {
			3: 580,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 43],
			21: [2, 43],
			22: [2, 43],
			28: [2, 43],
			34: [2, 43],
			36: [2, 43],
			37: [2, 43],
			40: [2, 43],
			41: [2, 43],
			42: [2, 43],
			43: [2, 43],
			47: [2, 43],
			48: [2, 43],
			49: [2, 43],
			50: [2, 43],
			51: [2, 43],
			56: [2, 43],
			58: [2, 43],
			59: [2, 43],
			60: [2, 43],
			65: [2, 43],
			67: [2, 43],
			73: [2, 43],
			78: [2, 43],
			81: [2, 43],
			94: [2, 43],
			105: [2, 43],
			106: [2, 43],
			111: [2, 43],
			112: [2, 43],
			113: [2, 43],
			114: [2, 43],
			115: [2, 43],
			116: [2, 43],
			117: [2, 43],
			118: [2, 43],
			119: [2, 43],
			122: [2, 43],
			174: [2, 43],
			187: [2, 43],
			188: [2, 43],
			189: [2, 43],
			190: [2, 43],
			191: [2, 43]
		}, {
			19: [2, 44],
			21: [2, 44],
			22: [2, 44],
			28: [2, 44],
			34: [2, 44],
			36: [2, 44],
			37: [2, 44],
			40: [2, 44],
			41: [2, 44],
			42: [2, 44],
			43: [2, 44],
			47: [2, 44],
			48: [2, 44],
			49: [2, 44],
			50: [2, 44],
			51: [2, 44],
			56: [2, 44],
			58: [2, 44],
			59: [2, 44],
			60: [2, 44],
			65: [2, 44],
			67: [2, 44],
			73: [2, 44],
			78: [2, 44],
			81: [2, 44],
			94: [2, 44],
			105: [2, 44],
			106: [2, 44],
			111: [2, 44],
			112: [2, 44],
			113: [2, 44],
			114: [2, 44],
			115: [2, 44],
			116: [2, 44],
			117: [2, 44],
			118: [2, 44],
			119: [2, 44],
			122: [2, 44],
			174: [2, 44],
			187: [2, 44],
			188: [2, 44],
			189: [2, 44],
			190: [2, 44],
			191: [2, 44]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 581,
			39: [1, 582],
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			25: [1, 242],
			39: [1, 583]
		}, {
			3: 584,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			3: 585,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 50],
			21: [2, 50],
			22: [2, 50],
			28: [2, 50],
			34: [2, 50],
			36: [2, 50],
			37: [2, 50],
			40: [2, 50],
			41: [2, 50],
			42: [2, 50],
			43: [2, 50],
			47: [2, 50],
			48: [2, 50],
			49: [2, 50],
			50: [2, 50],
			51: [2, 50],
			56: [2, 50],
			58: [2, 50],
			59: [2, 50],
			60: [2, 50],
			65: [2, 50],
			67: [2, 50],
			73: [2, 50],
			78: [2, 50],
			81: [2, 50],
			94: [2, 50],
			105: [2, 50],
			106: [2, 50],
			111: [2, 50],
			112: [2, 50],
			113: [2, 50],
			114: [2, 50],
			115: [2, 50],
			116: [2, 50],
			117: [2, 50],
			118: [2, 50],
			119: [2, 50],
			122: [2, 50],
			174: [2, 50],
			187: [2, 50],
			188: [2, 50],
			189: [2, 50],
			190: [2, 50],
			191: [2, 50]
		}, {
			25: [2, 268],
			34: [2, 268],
			46: [2, 268]
		}, {
			21: [1, 586]
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 587,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			2: [2, 86],
			19: [2, 86],
			21: [2, 86],
			22: [2, 86],
			25: [2, 86],
			28: [2, 86],
			31: [2, 86],
			34: [2, 86],
			36: [2, 86],
			37: [2, 86],
			39: [2, 86],
			40: [2, 86],
			41: [2, 86],
			42: [2, 86],
			43: [2, 86],
			46: [2, 86],
			47: [2, 86],
			48: [2, 86],
			49: [2, 86],
			50: [2, 86],
			51: [2, 86],
			56: [2, 86],
			57: [2, 86],
			58: [2, 86],
			59: [2, 86],
			60: [2, 86],
			65: [2, 86],
			67: [2, 86],
			73: [2, 86],
			78: [2, 86],
			81: [2, 86],
			82: [2, 86],
			93: [2, 86],
			94: [2, 86],
			105: [2, 86],
			106: [2, 86],
			111: [2, 86],
			112: [2, 86],
			113: [2, 86],
			114: [2, 86],
			115: [2, 86],
			116: [2, 86],
			117: [2, 86],
			118: [2, 86],
			119: [2, 86],
			121: [2, 86],
			122: [2, 86],
			123: [2, 86],
			128: [2, 86],
			129: [2, 86],
			130: [2, 86],
			133: [2, 86],
			134: [2, 86],
			135: [2, 86],
			136: [2, 86],
			137: [2, 86],
			141: [2, 86],
			142: [2, 86],
			143: [2, 86],
			144: [2, 86],
			148: [2, 86],
			152: [2, 86],
			156: [2, 86],
			160: [2, 86],
			164: [2, 86],
			168: [2, 86],
			173: [2, 86],
			174: [2, 86],
			175: [2, 86],
			176: [2, 86],
			177: [2, 86],
			178: [2, 86],
			179: [2, 86],
			180: [2, 86],
			181: [2, 86],
			182: [2, 86],
			183: [2, 86],
			187: [2, 86],
			188: [2, 86],
			189: [2, 86],
			190: [2, 86],
			191: [2, 86]
		}, {
			21: [1, 588]
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 589,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			19: [1, 590]
		}, {
			19: [2, 66],
			21: [2, 66],
			22: [2, 66],
			28: [2, 66],
			34: [2, 66],
			36: [2, 66],
			37: [2, 66],
			40: [2, 66],
			41: [2, 66],
			42: [2, 66],
			43: [2, 66],
			47: [2, 66],
			48: [2, 66],
			49: [2, 66],
			50: [2, 66],
			51: [2, 66],
			56: [2, 66],
			58: [2, 66],
			59: [2, 66],
			60: [2, 66],
			65: [2, 66],
			67: [2, 66],
			73: [2, 66],
			78: [2, 66],
			81: [2, 66],
			94: [2, 66],
			105: [2, 66],
			106: [2, 66],
			111: [2, 66],
			112: [2, 66],
			113: [2, 66],
			114: [2, 66],
			115: [2, 66],
			116: [2, 66],
			117: [2, 66],
			118: [2, 66],
			119: [2, 66],
			122: [2, 66],
			174: [2, 66],
			187: [2, 66],
			188: [2, 66],
			189: [2, 66],
			190: [2, 66],
			191: [2, 66]
		}, {
			21: [2, 69],
			53: 591,
			56: [2, 69]
		}, {
			21: [2, 68],
			56: [2, 68],
			58: [2, 68]
		}, {
			57: [1, 592]
		}, {
			19: [1, 129],
			28: [1, 128],
			32: 111,
			37: [1, 55],
			38: 593,
			45: 113,
			67: [1, 126],
			70: 122,
			75: 121,
			76: 124,
			77: 125,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			92: 118,
			94: [1, 119],
			97: 115,
			99: 116,
			104: 136,
			105: [1, 84],
			106: [1, 85],
			108: 135,
			109: 137,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			120: 134,
			122: [1, 71],
			125: 133,
			127: 132,
			132: 131,
			140: 130,
			147: 127,
			151: 123,
			155: 120,
			159: 117,
			163: 114,
			167: 112,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 78],
			21: [2, 78],
			22: [2, 78],
			28: [2, 78],
			34: [2, 78],
			36: [2, 78],
			37: [2, 78],
			40: [2, 78],
			41: [2, 78],
			42: [2, 78],
			43: [2, 78],
			47: [2, 78],
			48: [2, 78],
			49: [2, 78],
			50: [2, 78],
			51: [2, 78],
			56: [2, 78],
			58: [2, 78],
			59: [2, 78],
			60: [2, 78],
			64: [2, 78],
			65: [2, 78],
			67: [2, 78],
			73: [2, 78],
			78: [2, 78],
			81: [2, 78],
			94: [2, 78],
			105: [2, 78],
			106: [2, 78],
			111: [2, 78],
			112: [2, 78],
			113: [2, 78],
			114: [2, 78],
			115: [2, 78],
			116: [2, 78],
			117: [2, 78],
			118: [2, 78],
			119: [2, 78],
			122: [2, 78],
			174: [2, 78],
			187: [2, 78],
			188: [2, 78],
			189: [2, 78],
			190: [2, 78],
			191: [2, 78]
		}, {
			19: [2, 83],
			21: [2, 83],
			22: [2, 83],
			28: [2, 83],
			34: [2, 83],
			36: [2, 83],
			37: [2, 83],
			41: [2, 83],
			42: [2, 83],
			43: [2, 83],
			47: [2, 83],
			48: [2, 83],
			49: [2, 83],
			50: [2, 83],
			51: [2, 83],
			59: [2, 83],
			60: [2, 83],
			65: [2, 83],
			67: [2, 83],
			73: [2, 83],
			78: [2, 83],
			81: [2, 83],
			94: [2, 83],
			105: [2, 83],
			106: [2, 83],
			111: [2, 83],
			112: [2, 83],
			113: [2, 83],
			114: [2, 83],
			115: [2, 83],
			116: [2, 83],
			117: [2, 83],
			118: [2, 83],
			119: [2, 83],
			122: [2, 83],
			174: [2, 83],
			187: [2, 83],
			188: [2, 83],
			189: [2, 83],
			190: [2, 83],
			191: [2, 83]
		}, {
			3: 594,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 39],
			21: [2, 39],
			22: [2, 39],
			28: [2, 39],
			34: [2, 39],
			36: [2, 39],
			37: [2, 39],
			40: [2, 39],
			41: [2, 39],
			42: [2, 39],
			43: [2, 39],
			47: [2, 39],
			48: [2, 39],
			49: [2, 39],
			50: [2, 39],
			51: [2, 39],
			56: [2, 39],
			58: [2, 39],
			59: [2, 39],
			60: [2, 39],
			65: [2, 39],
			67: [2, 39],
			73: [2, 39],
			78: [2, 39],
			81: [2, 39],
			94: [2, 39],
			105: [2, 39],
			106: [2, 39],
			111: [2, 39],
			112: [2, 39],
			113: [2, 39],
			114: [2, 39],
			115: [2, 39],
			116: [2, 39],
			117: [2, 39],
			118: [2, 39],
			119: [2, 39],
			122: [2, 39],
			174: [2, 39],
			187: [2, 39],
			188: [2, 39],
			189: [2, 39],
			190: [2, 39],
			191: [2, 39]
		}, {
			19: [2, 40],
			21: [2, 40],
			22: [2, 40],
			28: [2, 40],
			34: [2, 40],
			36: [2, 40],
			37: [2, 40],
			40: [2, 40],
			41: [2, 40],
			42: [2, 40],
			43: [2, 40],
			47: [2, 40],
			48: [2, 40],
			49: [2, 40],
			50: [2, 40],
			51: [2, 40],
			56: [2, 40],
			58: [2, 40],
			59: [2, 40],
			60: [2, 40],
			65: [2, 40],
			67: [2, 40],
			73: [2, 40],
			78: [2, 40],
			81: [2, 40],
			94: [2, 40],
			105: [2, 40],
			106: [2, 40],
			111: [2, 40],
			112: [2, 40],
			113: [2, 40],
			114: [2, 40],
			115: [2, 40],
			116: [2, 40],
			117: [2, 40],
			118: [2, 40],
			119: [2, 40],
			122: [2, 40],
			174: [2, 40],
			187: [2, 40],
			188: [2, 40],
			189: [2, 40],
			190: [2, 40],
			191: [2, 40]
		}, {
			19: [2, 42],
			21: [2, 42],
			22: [2, 42],
			28: [2, 42],
			34: [2, 42],
			36: [2, 42],
			37: [2, 42],
			40: [2, 42],
			41: [2, 42],
			42: [2, 42],
			43: [2, 42],
			47: [2, 42],
			48: [2, 42],
			49: [2, 42],
			50: [2, 42],
			51: [2, 42],
			56: [2, 42],
			58: [2, 42],
			59: [2, 42],
			60: [2, 42],
			65: [2, 42],
			67: [2, 42],
			73: [2, 42],
			78: [2, 42],
			81: [2, 42],
			94: [2, 42],
			105: [2, 42],
			106: [2, 42],
			111: [2, 42],
			112: [2, 42],
			113: [2, 42],
			114: [2, 42],
			115: [2, 42],
			116: [2, 42],
			117: [2, 42],
			118: [2, 42],
			119: [2, 42],
			122: [2, 42],
			174: [2, 42],
			187: [2, 42],
			188: [2, 42],
			189: [2, 42],
			190: [2, 42],
			191: [2, 42]
		}, {
			25: [1, 242],
			39: [1, 595]
		}, {
			3: 596,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			3: 597,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 49],
			21: [2, 49],
			22: [2, 49],
			28: [2, 49],
			34: [2, 49],
			36: [2, 49],
			37: [2, 49],
			40: [2, 49],
			41: [2, 49],
			42: [2, 49],
			43: [2, 49],
			47: [2, 49],
			48: [2, 49],
			49: [2, 49],
			50: [2, 49],
			51: [2, 49],
			56: [2, 49],
			58: [2, 49],
			59: [2, 49],
			60: [2, 49],
			65: [2, 49],
			67: [2, 49],
			73: [2, 49],
			78: [2, 49],
			81: [2, 49],
			94: [2, 49],
			105: [2, 49],
			106: [2, 49],
			111: [2, 49],
			112: [2, 49],
			113: [2, 49],
			114: [2, 49],
			115: [2, 49],
			116: [2, 49],
			117: [2, 49],
			118: [2, 49],
			119: [2, 49],
			122: [2, 49],
			174: [2, 49],
			187: [2, 49],
			188: [2, 49],
			189: [2, 49],
			190: [2, 49],
			191: [2, 49]
		}, {
			19: [2, 51],
			21: [2, 51],
			22: [2, 51],
			28: [2, 51],
			34: [2, 51],
			36: [2, 51],
			37: [2, 51],
			40: [2, 51],
			41: [2, 51],
			42: [2, 51],
			43: [2, 51],
			47: [2, 51],
			48: [2, 51],
			49: [2, 51],
			50: [2, 51],
			51: [2, 51],
			56: [2, 51],
			58: [2, 51],
			59: [2, 51],
			60: [2, 51],
			65: [2, 51],
			67: [2, 51],
			73: [2, 51],
			78: [2, 51],
			81: [2, 51],
			94: [2, 51],
			105: [2, 51],
			106: [2, 51],
			111: [2, 51],
			112: [2, 51],
			113: [2, 51],
			114: [2, 51],
			115: [2, 51],
			116: [2, 51],
			117: [2, 51],
			118: [2, 51],
			119: [2, 51],
			122: [2, 51],
			174: [2, 51],
			187: [2, 51],
			188: [2, 51],
			189: [2, 51],
			190: [2, 51],
			191: [2, 51]
		}, {
			2: [2, 84],
			19: [2, 84],
			21: [2, 84],
			22: [2, 84],
			25: [2, 84],
			28: [2, 84],
			31: [2, 84],
			34: [2, 84],
			36: [2, 84],
			37: [2, 84],
			39: [2, 84],
			40: [2, 84],
			41: [2, 84],
			42: [2, 84],
			43: [2, 84],
			46: [2, 84],
			47: [2, 84],
			48: [2, 84],
			49: [2, 84],
			50: [2, 84],
			51: [2, 84],
			56: [2, 84],
			57: [2, 84],
			58: [2, 84],
			59: [2, 84],
			60: [2, 84],
			65: [2, 84],
			67: [2, 84],
			73: [2, 84],
			78: [2, 84],
			81: [2, 84],
			82: [2, 84],
			93: [2, 84],
			94: [2, 84],
			105: [2, 84],
			106: [2, 84],
			111: [2, 84],
			112: [2, 84],
			113: [2, 84],
			114: [2, 84],
			115: [2, 84],
			116: [2, 84],
			117: [2, 84],
			118: [2, 84],
			119: [2, 84],
			121: [2, 84],
			122: [2, 84],
			123: [2, 84],
			128: [2, 84],
			129: [2, 84],
			130: [2, 84],
			133: [2, 84],
			134: [2, 84],
			135: [2, 84],
			136: [2, 84],
			137: [2, 84],
			141: [2, 84],
			142: [2, 84],
			143: [2, 84],
			144: [2, 84],
			148: [2, 84],
			152: [2, 84],
			156: [2, 84],
			160: [2, 84],
			164: [2, 84],
			168: [2, 84],
			173: [2, 84],
			174: [2, 84],
			175: [2, 84],
			176: [2, 84],
			177: [2, 84],
			178: [2, 84],
			179: [2, 84],
			180: [2, 84],
			181: [2, 84],
			182: [2, 84],
			183: [2, 84],
			187: [2, 84],
			188: [2, 84],
			189: [2, 84],
			190: [2, 84],
			191: [2, 84]
		}, {
			21: [1, 598]
		}, {
			2: [2, 87],
			19: [2, 87],
			21: [2, 87],
			22: [2, 87],
			25: [2, 87],
			28: [2, 87],
			31: [2, 87],
			34: [2, 87],
			36: [2, 87],
			37: [2, 87],
			39: [2, 87],
			40: [2, 87],
			41: [2, 87],
			42: [2, 87],
			43: [2, 87],
			46: [2, 87],
			47: [2, 87],
			48: [2, 87],
			49: [2, 87],
			50: [2, 87],
			51: [2, 87],
			56: [2, 87],
			57: [2, 87],
			58: [2, 87],
			59: [2, 87],
			60: [2, 87],
			65: [2, 87],
			67: [2, 87],
			73: [2, 87],
			78: [2, 87],
			81: [2, 87],
			82: [2, 87],
			93: [2, 87],
			94: [2, 87],
			105: [2, 87],
			106: [2, 87],
			111: [2, 87],
			112: [2, 87],
			113: [2, 87],
			114: [2, 87],
			115: [2, 87],
			116: [2, 87],
			117: [2, 87],
			118: [2, 87],
			119: [2, 87],
			121: [2, 87],
			122: [2, 87],
			123: [2, 87],
			128: [2, 87],
			129: [2, 87],
			130: [2, 87],
			133: [2, 87],
			134: [2, 87],
			135: [2, 87],
			136: [2, 87],
			137: [2, 87],
			141: [2, 87],
			142: [2, 87],
			143: [2, 87],
			144: [2, 87],
			148: [2, 87],
			152: [2, 87],
			156: [2, 87],
			160: [2, 87],
			164: [2, 87],
			168: [2, 87],
			173: [2, 87],
			174: [2, 87],
			175: [2, 87],
			176: [2, 87],
			177: [2, 87],
			178: [2, 87],
			179: [2, 87],
			180: [2, 87],
			181: [2, 87],
			182: [2, 87],
			183: [2, 87],
			187: [2, 87],
			188: [2, 87],
			189: [2, 87],
			190: [2, 87],
			191: [2, 87]
		}, {
			21: [1, 599]
		}, {
			19: [2, 93],
			21: [2, 93],
			22: [2, 93],
			28: [2, 93],
			34: [2, 93],
			36: [2, 93],
			37: [2, 93],
			41: [2, 93],
			42: [2, 93],
			43: [2, 93],
			47: [2, 93],
			48: [2, 93],
			49: [2, 93],
			50: [2, 93],
			51: [2, 93],
			59: [2, 93],
			60: [2, 93],
			65: [2, 93],
			67: [2, 93],
			68: 600,
			71: 517,
			78: [2, 93],
			81: [2, 93],
			94: [2, 93],
			105: [2, 93],
			106: [2, 93],
			111: [2, 93],
			112: [2, 93],
			113: [2, 93],
			114: [2, 93],
			115: [2, 93],
			116: [2, 93],
			117: [2, 93],
			118: [2, 93],
			119: [2, 93],
			122: [2, 93],
			174: [2, 93],
			187: [2, 93],
			188: [2, 93],
			189: [2, 93],
			190: [2, 93],
			191: [2, 93]
		}, {
			21: [1, 601],
			55: 572,
			56: [1, 574]
		}, {
			19: [2, 18],
			20: 602,
			21: [2, 18],
			22: [2, 18],
			28: [2, 18],
			34: [2, 18],
			36: [2, 18],
			37: [2, 18],
			41: [2, 18],
			42: [2, 18],
			43: [2, 18],
			47: [2, 18],
			48: [2, 18],
			49: [2, 18],
			50: [2, 18],
			51: [2, 18],
			56: [2, 18],
			59: [2, 18],
			60: [2, 18],
			65: [2, 18],
			78: [2, 18],
			81: [2, 18],
			94: [2, 18],
			105: [2, 18],
			106: [2, 18],
			111: [2, 18],
			112: [2, 18],
			113: [2, 18],
			114: [2, 18],
			115: [2, 18],
			116: [2, 18],
			117: [2, 18],
			118: [2, 18],
			119: [2, 18],
			122: [2, 18],
			174: [2, 18],
			187: [2, 18],
			188: [2, 18],
			189: [2, 18],
			190: [2, 18],
			191: [2, 18]
		}, {
			25: [1, 242],
			57: [1, 603]
		}, {
			19: [2, 38],
			21: [2, 38],
			22: [2, 38],
			28: [2, 38],
			34: [2, 38],
			36: [2, 38],
			37: [2, 38],
			40: [2, 38],
			41: [2, 38],
			42: [2, 38],
			43: [2, 38],
			47: [2, 38],
			48: [2, 38],
			49: [2, 38],
			50: [2, 38],
			51: [2, 38],
			56: [2, 38],
			58: [2, 38],
			59: [2, 38],
			60: [2, 38],
			65: [2, 38],
			67: [2, 38],
			73: [2, 38],
			78: [2, 38],
			81: [2, 38],
			94: [2, 38],
			105: [2, 38],
			106: [2, 38],
			111: [2, 38],
			112: [2, 38],
			113: [2, 38],
			114: [2, 38],
			115: [2, 38],
			116: [2, 38],
			117: [2, 38],
			118: [2, 38],
			119: [2, 38],
			122: [2, 38],
			174: [2, 38],
			187: [2, 38],
			188: [2, 38],
			189: [2, 38],
			190: [2, 38],
			191: [2, 38]
		}, {
			3: 604,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 47],
			21: [2, 47],
			22: [2, 47],
			28: [2, 47],
			34: [2, 47],
			36: [2, 47],
			37: [2, 47],
			40: [2, 47],
			41: [2, 47],
			42: [2, 47],
			43: [2, 47],
			47: [2, 47],
			48: [2, 47],
			49: [2, 47],
			50: [2, 47],
			51: [2, 47],
			56: [2, 47],
			58: [2, 47],
			59: [2, 47],
			60: [2, 47],
			65: [2, 47],
			67: [2, 47],
			73: [2, 47],
			78: [2, 47],
			81: [2, 47],
			94: [2, 47],
			105: [2, 47],
			106: [2, 47],
			111: [2, 47],
			112: [2, 47],
			113: [2, 47],
			114: [2, 47],
			115: [2, 47],
			116: [2, 47],
			117: [2, 47],
			118: [2, 47],
			119: [2, 47],
			122: [2, 47],
			174: [2, 47],
			187: [2, 47],
			188: [2, 47],
			189: [2, 47],
			190: [2, 47],
			191: [2, 47]
		}, {
			19: [2, 48],
			21: [2, 48],
			22: [2, 48],
			28: [2, 48],
			34: [2, 48],
			36: [2, 48],
			37: [2, 48],
			40: [2, 48],
			41: [2, 48],
			42: [2, 48],
			43: [2, 48],
			47: [2, 48],
			48: [2, 48],
			49: [2, 48],
			50: [2, 48],
			51: [2, 48],
			56: [2, 48],
			58: [2, 48],
			59: [2, 48],
			60: [2, 48],
			65: [2, 48],
			67: [2, 48],
			73: [2, 48],
			78: [2, 48],
			81: [2, 48],
			94: [2, 48],
			105: [2, 48],
			106: [2, 48],
			111: [2, 48],
			112: [2, 48],
			113: [2, 48],
			114: [2, 48],
			115: [2, 48],
			116: [2, 48],
			117: [2, 48],
			118: [2, 48],
			119: [2, 48],
			122: [2, 48],
			174: [2, 48],
			187: [2, 48],
			188: [2, 48],
			189: [2, 48],
			190: [2, 48],
			191: [2, 48]
		}, {
			2: [2, 85],
			19: [2, 85],
			21: [2, 85],
			22: [2, 85],
			25: [2, 85],
			28: [2, 85],
			31: [2, 85],
			34: [2, 85],
			36: [2, 85],
			37: [2, 85],
			39: [2, 85],
			40: [2, 85],
			41: [2, 85],
			42: [2, 85],
			43: [2, 85],
			46: [2, 85],
			47: [2, 85],
			48: [2, 85],
			49: [2, 85],
			50: [2, 85],
			51: [2, 85],
			56: [2, 85],
			57: [2, 85],
			58: [2, 85],
			59: [2, 85],
			60: [2, 85],
			65: [2, 85],
			67: [2, 85],
			73: [2, 85],
			78: [2, 85],
			81: [2, 85],
			82: [2, 85],
			93: [2, 85],
			94: [2, 85],
			105: [2, 85],
			106: [2, 85],
			111: [2, 85],
			112: [2, 85],
			113: [2, 85],
			114: [2, 85],
			115: [2, 85],
			116: [2, 85],
			117: [2, 85],
			118: [2, 85],
			119: [2, 85],
			121: [2, 85],
			122: [2, 85],
			123: [2, 85],
			128: [2, 85],
			129: [2, 85],
			130: [2, 85],
			133: [2, 85],
			134: [2, 85],
			135: [2, 85],
			136: [2, 85],
			137: [2, 85],
			141: [2, 85],
			142: [2, 85],
			143: [2, 85],
			144: [2, 85],
			148: [2, 85],
			152: [2, 85],
			156: [2, 85],
			160: [2, 85],
			164: [2, 85],
			168: [2, 85],
			173: [2, 85],
			174: [2, 85],
			175: [2, 85],
			176: [2, 85],
			177: [2, 85],
			178: [2, 85],
			179: [2, 85],
			180: [2, 85],
			181: [2, 85],
			182: [2, 85],
			183: [2, 85],
			187: [2, 85],
			188: [2, 85],
			189: [2, 85],
			190: [2, 85],
			191: [2, 85]
		}, {
			21: [2, 120],
			25: [2, 120]
		}, {
			21: [1, 605]
		}, {
			19: [2, 67],
			21: [2, 67],
			22: [2, 67],
			28: [2, 67],
			34: [2, 67],
			36: [2, 67],
			37: [2, 67],
			40: [2, 67],
			41: [2, 67],
			42: [2, 67],
			43: [2, 67],
			47: [2, 67],
			48: [2, 67],
			49: [2, 67],
			50: [2, 67],
			51: [2, 67],
			56: [2, 67],
			58: [2, 67],
			59: [2, 67],
			60: [2, 67],
			65: [2, 67],
			67: [2, 67],
			73: [2, 67],
			78: [2, 67],
			81: [2, 67],
			94: [2, 67],
			105: [2, 67],
			106: [2, 67],
			111: [2, 67],
			112: [2, 67],
			113: [2, 67],
			114: [2, 67],
			115: [2, 67],
			116: [2, 67],
			117: [2, 67],
			118: [2, 67],
			119: [2, 67],
			122: [2, 67],
			174: [2, 67],
			187: [2, 67],
			188: [2, 67],
			189: [2, 67],
			190: [2, 67],
			191: [2, 67]
		}, {
			3: 214,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			21: [2, 71],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			56: [2, 71],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}, {
			19: [2, 18],
			20: 606,
			21: [2, 18],
			22: [2, 18],
			28: [2, 18],
			34: [2, 18],
			36: [2, 18],
			37: [2, 18],
			41: [2, 18],
			42: [2, 18],
			43: [2, 18],
			47: [2, 18],
			48: [2, 18],
			49: [2, 18],
			50: [2, 18],
			51: [2, 18],
			56: [2, 18],
			58: [2, 18],
			59: [2, 18],
			60: [2, 18],
			65: [2, 18],
			78: [2, 18],
			81: [2, 18],
			94: [2, 18],
			105: [2, 18],
			106: [2, 18],
			111: [2, 18],
			112: [2, 18],
			113: [2, 18],
			114: [2, 18],
			115: [2, 18],
			116: [2, 18],
			117: [2, 18],
			118: [2, 18],
			119: [2, 18],
			122: [2, 18],
			174: [2, 18],
			187: [2, 18],
			188: [2, 18],
			189: [2, 18],
			190: [2, 18],
			191: [2, 18]
		}, {
			19: [2, 46],
			21: [2, 46],
			22: [2, 46],
			28: [2, 46],
			34: [2, 46],
			36: [2, 46],
			37: [2, 46],
			40: [2, 46],
			41: [2, 46],
			42: [2, 46],
			43: [2, 46],
			47: [2, 46],
			48: [2, 46],
			49: [2, 46],
			50: [2, 46],
			51: [2, 46],
			56: [2, 46],
			58: [2, 46],
			59: [2, 46],
			60: [2, 46],
			65: [2, 46],
			67: [2, 46],
			73: [2, 46],
			78: [2, 46],
			81: [2, 46],
			94: [2, 46],
			105: [2, 46],
			106: [2, 46],
			111: [2, 46],
			112: [2, 46],
			113: [2, 46],
			114: [2, 46],
			115: [2, 46],
			116: [2, 46],
			117: [2, 46],
			118: [2, 46],
			119: [2, 46],
			122: [2, 46],
			174: [2, 46],
			187: [2, 46],
			188: [2, 46],
			189: [2, 46],
			190: [2, 46],
			191: [2, 46]
		}, {
			21: [2, 121],
			25: [2, 121]
		}, {
			3: 214,
			4: 7,
			5: 8,
			6: 9,
			7: 10,
			8: 11,
			9: 12,
			10: 13,
			11: 14,
			12: 15,
			13: 16,
			14: 17,
			15: 18,
			16: 19,
			17: 20,
			18: 21,
			19: [1, 23],
			21: [2, 70],
			22: [1, 24],
			28: [1, 35],
			34: [1, 25],
			35: 26,
			36: [1, 27],
			37: [1, 55],
			41: [1, 28],
			42: [1, 29],
			43: [1, 30],
			47: [1, 31],
			48: [1, 32],
			49: [1, 33],
			50: [1, 34],
			51: [1, 36],
			56: [2, 70],
			58: [2, 70],
			59: [1, 37],
			60: [1, 38],
			65: [1, 39],
			76: 50,
			78: [1, 52],
			79: 53,
			80: 54,
			81: [1, 62],
			90: 60,
			91: 59,
			94: [1, 48],
			96: 47,
			98: 44,
			100: 45,
			103: 42,
			105: [1, 84],
			106: [1, 85],
			107: 77,
			109: 78,
			110: 76,
			111: [1, 79],
			112: [1, 80],
			113: [1, 81],
			114: [1, 82],
			115: [1, 83],
			116: [1, 86],
			117: [1, 87],
			118: [1, 88],
			119: [1, 89],
			122: [1, 71],
			124: 75,
			126: 74,
			131: 73,
			139: 70,
			146: 63,
			150: 56,
			154: 51,
			158: 49,
			162: 46,
			166: 43,
			170: 41,
			172: 40,
			174: [1, 72],
			184: 57,
			185: 58,
			186: 61,
			187: [1, 64],
			188: [1, 65],
			189: [1, 66],
			190: [1, 67],
			191: [1, 68],
			192: 69
		}],
		defaultActions: {
			3: [2, 91],
			71: [2, 308],
			72: [2, 309],
			543: [2, 125]
		},
		parseError: function parseError(str, hash) {
			if (hash.recoverable) {
				this.trace(str)
			} else {
				throw new Error(str)
			}
		},
		parse: function parse(input) {
			var self = this,
				stack = [0],
				vstack = [null],
				lstack = [],
				table = this.table,
				yytext = "",
				yylineno = 0,
				yyleng = 0,
				recovering = 0,
				TERROR = 2,
				EOF = 1;
			var args = lstack.slice.call(arguments, 1);
			this.lexer.setInput(input);
			this.lexer.yy = this.yy;
			this.yy.lexer = this.lexer;
			this.yy.parser = this;
			if (typeof this.lexer.yylloc == "undefined") {
				this.lexer.yylloc = {}
			}
			var yyloc = this.lexer.yylloc;
			lstack.push(yyloc);
			var ranges = this.lexer.options && this.lexer.options.ranges;
			if (typeof this.yy.parseError === "function") {
				this.parseError = this.yy.parseError
			} else {
				this.parseError = Object.getPrototypeOf(this).parseError
			}

			function popStack(n) {
				stack.length = stack.length - 2 * n;
				vstack.length = vstack.length - n;
				lstack.length = lstack.length - n
			}

			function lex() {
				var token;
				token = self.lexer.lex() || EOF;
				if (typeof token !== "number") {
					token = self.symbols_[token] || token
				}
				return token
			}
			var symbol, preErrorSymbol, state, action, a, r, yyval = {},
				p, len, newState, expected;
			while (true) {
				state = stack[stack.length - 1];
				if (this.defaultActions[state]) {
					action = this.defaultActions[state]
				} else {
					if (symbol === null || typeof symbol == "undefined") {
						symbol = lex()
					}
					action = table[state] && table[state][symbol]
				}
				_handle_error: if (typeof action === "undefined" || !action.length || !action[0]) {
					var error_rule_depth;
					var errStr = "";

					function locateNearestErrorRecoveryRule(state) {
						var stack_probe = stack.length - 1;
						var depth = 0;
						for (;;) {
							if (TERROR.toString() in table[state]) {
								return depth
							}
							if (state === 0 || stack_probe < 2) {
								return false
							}
							stack_probe -= 2;
							state = stack[stack_probe];
							++depth
						}
					}
					if (!recovering) {
						error_rule_depth = locateNearestErrorRecoveryRule(state);
						expected = [];
						for (p in table[state]) {
							if (this.terminals_[p] && p > TERROR) {
								expected.push("'" + this.terminals_[p] + "'")
							}
						}
						if (this.lexer.showPosition) {
							errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'"
						} else {
							errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'")
						}
						this.parseError(errStr, {
							text: this.lexer.match,
							token: this.terminals_[symbol] || symbol,
							line: this.lexer.yylineno,
							loc: yyloc,
							expected: expected,
							recoverable: error_rule_depth !== false
						})
					} else if (preErrorSymbol !== EOF) {
						error_rule_depth = locateNearestErrorRecoveryRule(state)
					}
					if (recovering == 3) {
						if (symbol === EOF || preErrorSymbol === EOF) {
							throw new Error(errStr || "Parsing halted while starting to recover from another error.")
						}
						yyleng = this.lexer.yyleng;
						yytext = this.lexer.yytext;
						yylineno = this.lexer.yylineno;
						yyloc = this.lexer.yylloc;
						symbol = lex()
					}
					if (error_rule_depth === false) {
						throw new Error(errStr || "Parsing halted. No suitable error recovery rule available.")
					}
					popStack(error_rule_depth);
					preErrorSymbol = symbol == TERROR ? null : symbol;
					symbol = TERROR;
					state = stack[stack.length - 1];
					action = table[state] && table[state][TERROR];
					recovering = 3
				}
				if (action[0] instanceof Array && action.length > 1) {
					throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol)
				}
				switch (action[0]) {
					case 1:
						stack.push(symbol);
						vstack.push(this.lexer.yytext);
						lstack.push(this.lexer.yylloc);
						stack.push(action[1]);
						symbol = null;
						if (!preErrorSymbol) {
							yyleng = this.lexer.yyleng;
							yytext = this.lexer.yytext;
							yylineno = this.lexer.yylineno;
							yyloc = this.lexer.yylloc;
							if (recovering > 0) {
								recovering--
							}
						} else {
							symbol = preErrorSymbol;
							preErrorSymbol = null
						}
						break;
					case 2:
						len = this.productions_[action[1]][1];
						yyval.$ = vstack[vstack.length - len];
						yyval._$ = {
							first_line: lstack[lstack.length - (len || 1)].first_line,
							last_line: lstack[lstack.length - 1].last_line,
							first_column: lstack[lstack.length - (len || 1)].first_column,
							last_column: lstack[lstack.length - 1].last_column
						};
						if (ranges) {
							yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]]
						}
						r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack].concat(args));
						if (typeof r !== "undefined") {
							return r
						}
						if (len) {
							stack = stack.slice(0, -1 * len * 2);
							vstack = vstack.slice(0, -1 * len);
							lstack = lstack.slice(0, -1 * len)
						}
						stack.push(this.productions_[action[1]][0]);
						vstack.push(yyval.$);
						lstack.push(yyval._$);
						newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
						stack.push(newState);
						break;
					case 3:
						return true
				}
			}
			return true
		}
	};


	function createSourceLocation(source, firstToken, lastToken) {
		return new SourceLocation(source, new Position(firstToken.first_line, firstToken.first_column), new Position(lastToken.last_line, lastToken.last_column));
	}

	function parseRegularExpressionLiteral(literal) {
		var last = literal.lastIndexOf("/");
		var body = literal.substring(1, last);
		var flags = literal.substring(last + 1);

		return new RegExp(body, flags);
	}

	function parseNumericLiteral(literal) {
		if (literal.charAt(0) === "0") {
			if (literal.charAt(1).toLowerCase() === "x") {
				return parseInt(literal, 16);
			} else if (literal.charAt(1) === ".") {
				return parseFloat(literal);
			} else {
				return parseInt(literal, 8);
			}
		} else {
			return Number(literal);
		}
	}

	/* Begin Parser Customization Methods */
	var _originalParseMethod = parser.parse;

	parser.parse = function(source, args) {
		parser.wasNewLine = false;
		parser.newLine = false;
		parser.restricted = false;

		return _originalParseMethod.call(this, source);
	};

	parser.parseError = function(str, hash) {
		//		alert(JSON.stringify(hash) + "\n\n\n" + parser.newLine + "\n" + parser.wasNewLine + "\n\n" + hash.expected.indexOf("';'"));
		if (!((hash.expected && hash.expected.indexOf("';'") >= 0) && (hash.token === "}" || hash.token === "EOF" || hash.token === "BR++" || hash.token === "BR--" || parser.newLine || parser.wasNewLine))) {
			throw new SyntaxError(str);
		}
	};
	/* End Parser Customization Methods */

	/* Begin AST Node Constructors */
	function ProgramNode(body, loc) {
		this.type = "Program";
		this.body = body;
		this.loc = loc;
	}

	function EmptyStatementNode(loc) {
		this.type = "EmptyStatement";
		this.loc = loc;
	}

	function BlockStatementNode(body, loc) {
		this.type = "BlockStatement";
		this.body = body;
		this.loc = loc;
	}

	function ExpressionStatementNode(expression, loc) {
		this.type = "ExpressionStatement";
		this.expression = expression;
		this.loc = loc;
	}

	function IfStatementNode(test, consequent, alternate, loc) {
		this.type = "IfStatement";
		this.test = test;
		this.consequent = consequent;
		this.alternate = alternate;
		this.loc = loc;
	}

	function LabeledStatementNode(label, body, loc) {
		this.type = "LabeledStatement";
		this.label = label;
		this.body = body;
		this.loc = loc;
	}

	function BreakStatementNode(label, loc) {
		this.type = "BreakStatement";
		this.label = label;
		this.loc = loc;
	}

	function ContinueStatementNode(label, loc) {
		this.type = "ContinueStatement";
		this.label = label;
		this.loc = loc;
	}

	function WithStatementNode(object, body, loc) {
		this.type = "WithStatement";
		this.object = object;
		this.body = body;
		this.loc = loc;
	}

	function SwitchStatementNode(discriminant, cases, loc) {
		this.type = "SwitchStatement";
		this.discriminant = discriminant;
		this.cases = cases;
		this.loc = loc;
	}

	function ReturnStatementNode(argument, loc) {
		this.type = "ReturnStatement";
		this.argument = argument;
		this.loc = loc;
	}

	function ThrowStatementNode(argument, loc) {
		this.type = "ThrowStatement";
		this.argument = argument;
		this.loc = loc;
	}

	function TryStatementNode(block, handlers, finalizer, loc) {
		this.type = "TryStatement";
		this.block = block;
		this.handlers = handlers; // Multiple catch clauses are SpiderMonkey specific
		this.finalizer = finalizer;
		this.loc = loc;
	}

	function WhileStatementNode(test, body, loc) {
		this.type = "WhileStatement";
		this.test = test;
		this.body = body;
		this.loc = loc;
	}

	function DoWhileStatementNode(body, test, loc) {
		this.type = "DoWhileStatement";
		this.body = body;
		this.test = test;
		this.loc = loc;
	}

	function ForStatementNode(init, test, update, body, loc) {
		this.type = "ForStatement";
		this.init = init;
		this.test = test;
		this.update = update;
		this.body = body;
		this.loc = loc;
	}

	function ForInStatementNode(left, right, body, loc) {
		this.type = "ForInStatement";
		this.left = left;
		this.right = right;
		this.body = body;
		this.loc = loc;
	}

	function DebugggerStatementNode(loc) {
		this.type = "DebuggerStatement";
		this.loc = loc;
	}

	function FunctionDeclarationNode(id, params, body, generator, expression, loc) {
		this.type = "FunctionDeclaration";
		this.id = id;
		this.params = params;
		this.body = body;
		this.generator = generator;
		this.expression = expression;
		this.loc = loc;
	}

	function VariableDeclarationNode(declarations, kind, loc) {
		this.type = "VariableDeclaration";
		this.declarations = declarations;
		this.kind = kind;
		this.loc = loc;
	}

	function VariableDeclaratorNode(id, init, loc) {
		this.type = "VariableDeclarator";
		this.id = id;
		this.init = init;
		this.loc = loc;
	}

	function ThisExpressionNode(loc) {
		this.type = "ThisExpression";
		this.loc = loc;
	}

	function ArrayExpressionNode(elements, loc) {
		this.type = "ArrayExpression";
		this.elements = elements;
		this.loc = loc;
	}

	function ObjectExpressionNode(properties, loc) {
		this.type = "ObjectExpression";
		this.properties = properties;
		this.loc = loc;
	}

	function FunctionExpressionNode(id, params, body, generator, expression, loc) {
		this.type = "FunctionExpression";
		this.id = id;
		this.params = params;
		this.body = body;
		this.generator = generator;
		this.expression = expression;
		this.loc = loc;
	}

	function SequenceExpressionNode(expressions, loc) {
		this.type = "SequenceExpression";
		this.expressions = expressions;
		this.loc = loc;
	}

	function UnaryExpressionNode(operator, prefix, argument, loc) {
		this.type = "UnaryExpression";
		this.operator = operator;
		this.prefix = prefix;
		this.argument = argument;
		this.loc = loc;
	}

	function BinaryExpressionNode(operator, left, right, loc) {
		this.type = "BinaryExpression";
		this.operator = operator;
		this.left = left;
		this.right = right;
		this.loc = loc;
	}

	function AssignmentExpressionNode(operator, left, right, loc) {
		this.type = "AssignmentExpression";
		this.operator = operator;
		this.left = left;
		this.right = right;
		this.loc = loc;
	}

	function UpdateExpressionNode(operator, argument, prefix, loc) {
		this.type = "UpdateExpression";
		this.operator = operator;
		this.argument = argument;
		this.prefix = prefix;
		this.loc = loc;
	}

	function LogicalExpressionNode(operator, left, right, loc) {
		this.type = "LogicalExpression";
		this.operator = operator;
		this.left = left;
		this.right = right;
		this.loc = loc;
	}

	function ConditionalExpressionNode(test, consequent, alternate, loc) {
		this.type = "ConditionalExpression";
		this.test = test;
		this.consequent = consequent;
		this.alternate = alternate;
		this.loc = loc;
	}

	function NewExpressionNode(callee, args, loc) {
		this.type = "NewExpression";
		this.callee = callee;
		this.arguments = args;
		this.loc = loc;
	}

	function CallExpressionNode(callee, args, loc) {
		this.type = "CallExpression";
		this.callee = callee;
		this.arguments = args;
		this.loc = loc;
	}

	function MemberExpressionNode(object, property, computed, loc) {
		this.type = "MemberExpression";
		this.object = object;
		this.property = property;
		this.computed = computed;
		this.loc = loc;
	}

	function SwitchCaseNode(test, consequent, loc) {
		this.type = "SwitchCase";
		this.test = test;
		this.consequent = consequent;
		this.loc = loc;
	}

	function CatchClauseNode(param, body, loc) {
		this.type = "CatchClause";
		this.param = param;
		this.guard = null; /* Firefox specific */
		this.body = body;
		this.loc = loc;
	}

	function IdentifierNode(name, loc) {
		this.type = "Identifier";
		this.name = name;
		this.loc = loc;
	}

	function LiteralNode(value, loc) {
		this.type = "Literal";
		this.value = value;
		this.loc = loc;
	}

	function SourceLocation(source, start, end) {
		this.source = source;
		this.start = start;
		this.end = end;
	}

	function Position(line, column) {
		this.line = line;
		this.column = column;
	}

	/* Object and Array patterns are not part of the ECMAScript Standard
	function ObjectPatternNode() {
		this.type = "ObjectPattern";
		this.properties = [];
	}

	function ArrayPatternNode() {
		this.type = "ArrayPattern";
		this.elements = [];
	}
	*/
	/* End AST Node Constructors */

	/* Expose the AST Node Constructors */
	parser.ast = {};
	parser.ast.ProgramNode = ProgramNode;
	parser.ast.EmptyStatementNode = EmptyStatementNode;
	parser.ast.BlockStatementNode = BlockStatementNode;
	parser.ast.ExpressionStatementNode = ExpressionStatementNode;
	parser.ast.IfStatementNode = IfStatementNode;
	parser.ast.LabeledStatementNode = LabeledStatementNode;
	parser.ast.BreakStatementNode = BreakStatementNode;
	parser.ast.ContinueStatementNode = ContinueStatementNode;
	parser.ast.WithStatementNode = WithStatementNode;
	parser.ast.SwitchStatementNode = SwitchStatementNode;
	parser.ast.ReturnStatementNode = ReturnStatementNode;
	parser.ast.ThrowStatementNode = ThrowStatementNode;
	parser.ast.TryStatementNode = TryStatementNode;
	parser.ast.WhileStatementNode = WhileStatementNode;
	parser.ast.DoWhileStatementNode = DoWhileStatementNode;
	parser.ast.ForStatementNode = ForStatementNode;
	parser.ast.ForInStatementNode = ForInStatementNode;
	parser.ast.DebugggerStatementNode = DebugggerStatementNode;
	parser.ast.FunctionDeclarationNode = FunctionDeclarationNode;
	parser.ast.VariableDeclarationNode = VariableDeclarationNode;
	parser.ast.VariableDeclaratorNode = VariableDeclaratorNode;
	parser.ast.ThisExpressionNode = ThisExpressionNode;
	parser.ast.ArrayExpressionNode = ArrayExpressionNode;
	parser.ast.ObjectExpressionNode = ObjectExpressionNode;
	parser.ast.FunctionExpressionNode = FunctionExpressionNode;
	parser.ast.SequenceExpressionNode = SequenceExpressionNode;
	parser.ast.UnaryExpressionNode = UnaryExpressionNode;
	parser.ast.BinaryExpressionNode = BinaryExpressionNode;
	parser.ast.AssignmentExpressionNode = AssignmentExpressionNode;
	parser.ast.UpdateExpressionNode = UpdateExpressionNode;
	parser.ast.LogicalExpressionNode = LogicalExpressionNode;
	parser.ast.ConditionalExpressionNode = ConditionalExpressionNode;
	parser.ast.NewExpressionNode = NewExpressionNode;
	parser.ast.CallExpressionNode = CallExpressionNode;
	parser.ast.MemberExpressionNode = MemberExpressionNode;
	parser.ast.SwitchCaseNode = SwitchCaseNode;
	parser.ast.CatchClauseNode = CatchClauseNode;
	parser.ast.IdentifierNode = IdentifierNode;
	parser.ast.LiteralNode = LiteralNode;
	/* generated by jison-lex 0.2.1 */
	var lexer = (function() {
		var lexer = {

			EOF: 1,

			parseError: function parseError(str, hash) {
				if (this.yy.parser) {
					this.yy.parser.parseError(str, hash)
				} else {
					throw new Error(str)
				}
			},

			// resets the lexer, sets new input
			setInput: function(input) {
				this._input = input;
				this._more = this._backtrack = this.done = false;
				this.yylineno = this.yyleng = 0;
				this.yytext = this.matched = this.match = "";
				this.conditionStack = ["INITIAL"];
				this.yylloc = {
					first_line: 1,
					first_column: 0,
					last_line: 1,
					last_column: 0
				};
				if (this.options.ranges) {
					this.yylloc.range = [0, 0]
				}
				this.offset = 0;
				return this
			},

			// consumes and returns one char from the input
			input: function() {
				var ch = this._input[0];
				this.yytext += ch;
				this.yyleng++;
				this.offset++;
				this.match += ch;
				this.matched += ch;
				var lines = ch.match(/(?:\r\n?|\n).*/g);
				if (lines) {
					this.yylineno++;
					this.yylloc.last_line++
				} else {
					this.yylloc.last_column++
				}
				if (this.options.ranges) {
					this.yylloc.range[1]++
				}
				this._input = this._input.slice(1);
				return ch
			},

			// unshifts one char (or a string) into the input
			unput: function(ch) {
				var len = ch.length;
				var lines = ch.split(/(?:\r\n?|\n)/g);
				this._input = ch + this._input;
				this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
				this.offset -= len;
				var oldLines = this.match.split(/(?:\r\n?|\n)/g);
				this.match = this.match.substr(0, this.match.length - 1);
				this.matched = this.matched.substr(0, this.matched.length - 1);
				if (lines.length - 1) {
					this.yylineno -= lines.length - 1
				}
				var r = this.yylloc.range;
				this.yylloc = {
					first_line: this.yylloc.first_line,
					last_line: this.yylineno + 1,
					first_column: this.yylloc.first_column,
					last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
				};
				if (this.options.ranges) {
					this.yylloc.range = [r[0], r[0] + this.yyleng - len]
				}
				this.yyleng = this.yytext.length;
				return this
			},

			// When called from action, caches matched text and appends it on next action
			more: function() {
				this._more = true;
				return this
			},

			// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
			reject: function() {
				if (this.options.backtrack_lexer) {
					this._backtrack = true
				} else {
					return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
						text: "",
						token: null,
						line: this.yylineno
					})
				}
				return this
			},

			// retain first n characters of the match
			less: function(n) {
				this.unput(this.match.slice(n))
			},

			// displays already matched input, i.e. for error messages
			pastInput: function() {
				var past = this.matched.substr(0, this.matched.length - this.match.length);
				return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "")
			},

			// displays upcoming input, i.e. for error messages
			upcomingInput: function() {
				var next = this.match;
				if (next.length < 20) {
					next += this._input.substr(0, 20 - next.length)
				}
				return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "")
			},

			// displays the character position where the lexing error occurred, i.e. for error messages
			showPosition: function() {
				var pre = this.pastInput();
				var c = new Array(pre.length + 1).join("-");
				return pre + this.upcomingInput() + "\n" + c + "^"
			},

			// test the lexed token: return FALSE when not a match, otherwise return token
			test_match: function(match, indexed_rule) {
				var token, lines, backup;
				if (this.options.backtrack_lexer) {
					backup = {
						yylineno: this.yylineno,
						yylloc: {
							first_line: this.yylloc.first_line,
							last_line: this.last_line,
							first_column: this.yylloc.first_column,
							last_column: this.yylloc.last_column
						},
						yytext: this.yytext,
						match: this.match,
						matches: this.matches,
						matched: this.matched,
						yyleng: this.yyleng,
						offset: this.offset,
						_more: this._more,
						_input: this._input,
						yy: this.yy,
						conditionStack: this.conditionStack.slice(0),
						done: this.done
					};
					if (this.options.ranges) {
						backup.yylloc.range = this.yylloc.range.slice(0)
					}
				}
				lines = match[0].match(/(?:\r\n?|\n).*/g);
				if (lines) {
					this.yylineno += lines.length
				}
				this.yylloc = {
					first_line: this.yylloc.last_line,
					last_line: this.yylineno + 1,
					first_column: this.yylloc.last_column,
					last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
				};
				this.yytext += match[0];
				this.match += match[0];
				this.matches = match;
				this.yyleng = this.yytext.length;
				if (this.options.ranges) {
					this.yylloc.range = [this.offset, this.offset += this.yyleng]
				}
				this._more = false;
				this._backtrack = false;
				this._input = this._input.slice(match[0].length);
				this.matched += match[0];
				token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
				if (this.done && this._input) {
					this.done = false
				}
				if (token) {
					return token
				} else if (this._backtrack) {
					for (var k in backup) {
						this[k] = backup[k]
					}
					return false
				}
				return false
			},

			// return next match in input
			next: function() {
				if (this.done) {
					return this.EOF
				}
				if (!this._input) {
					this.done = true
				}
				var token, match, tempMatch, index;
				if (!this._more) {
					this.yytext = "";
					this.match = ""
				}
				var rules = this._currentRules();
				for (var i = 0; i < rules.length; i++) {
					tempMatch = this._input.match(this.rules[rules[i]]);
					if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
						match = tempMatch;
						index = i;
						if (this.options.backtrack_lexer) {
							token = this.test_match(tempMatch, rules[i]);
							if (token !== false) {
								return token
							} else if (this._backtrack) {
								match = false;
								continue
							} else {
								return false
							}
						} else if (!this.options.flex) {
							break
						}
					}
				}
				if (match) {
					token = this.test_match(match, rules[index]);
					if (token !== false) {
						return token
					}
					return false
				}
				if (this._input === "") {
					return this.EOF
				} else {
					return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
						text: "",
						token: null,
						line: this.yylineno
					})
				}
			},

			// return next match that has a token
			lex: function lex() {
				var r = this.next();
				if (r) {
					return r
				} else {
					return this.lex()
				}
			},

			// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
			begin: function begin(condition) {
				this.conditionStack.push(condition)
			},

			// pop the previously active lexer condition state off the condition stack
			popState: function popState() {
				var n = this.conditionStack.length - 1;
				if (n > 0) {
					return this.conditionStack.pop()
				} else {
					return this.conditionStack[0]
				}
			},

			// produce the lexer rule set which is active for the currently active lexer condition state
			_currentRules: function _currentRules() {
				if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
					return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
				} else {
					return this.conditions["INITIAL"].rules
				}
			},

			// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
			topState: function topState(n) {
				n = this.conditionStack.length - 1 - Math.abs(n || 0);
				if (n >= 0) {
					return this.conditionStack[n]
				} else {
					return "INITIAL"
				}
			},

			// alias for begin(condition)
			pushState: function pushState(condition) {
				this.begin(condition)
			},

			// return the number of states currently on the stack
			stateStackSize: function stateStackSize() {
				return this.conditionStack.length
			},
			options: {
				"flex": true
			},
			performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START
				/**/
			) {

				var YYSTATE = YY_START;
				switch ($avoiding_name_collisions) {
					case 0:
						this.begin("INITIAL");
						return "REGEXP_LITERAL";

						break;
					case 1:
						return "BR++"; /* Handle restricted postfix production */
						break;
					case 2:
						return "BR--"; /* Handle restricted postfix production */
						break;
					case 3:
						if (yy_.yytext.match(/\r|\n/)) {
							parser.newLine = true;
						}

						if (parser.restricted && parser.newLine) {
							this.unput(yy_.yytext);
							parser.restricted = false;
							return ";";
						}

						break;
					case 4:
						if (yy_.yytext.match(/\r|\n/)) {
							parser.newLine = true;
						}

						if (parser.restricted && parser.newLine) {
							this.unput(yy_.yytext);
							parser.restricted = false;
							return ";";
						}

						break;
					case 5:
						if (yy_.yytext.match(/\r|\n/)) {
							parser.newLine = true;
						}

						if (parser.restricted && parser.newLine) {
							this.unput(yy_.yytext);
							parser.restricted = false;
							return ";";
						}

						break;
					case 6:
						parser.restricted = false;
						return "STRING_LITERAL";
						break;
					case 7:
						parser.restricted = true;
						return "BREAK";
						break;
					case 8:
						return "CASE";
						break;
					case 9:
						return "CATCH";
						break;
					case 10:
						parser.restricted = true;
						return "CONTINUE";
						break;
					case 11:
						return "DEBUGGER";
						break;
					case 12:
						return "DEFAULT";
						break;
					case 13:
						return "DELETE";
						break;
					case 14:
						return "DO";
						break;
					case 15:
						return "ELSE";
						break;
					case 16:
						return "FINALLY";
						break;
					case 17:
						return "FOR";
						break;
					case 18:
						return "FUNCTION";
						break;
					case 19:
						return "IF";
						break;
					case 20:
						return "IN";
						break;
					case 21:
						return "INSTANCEOF";
						break;
					case 22:
						parser.restricted = false;
						return "NEW";
						break;
					case 23:
						parser.restricted = true;
						return "RETURN";
						break;
					case 24:
						return "SWITCH";
						break;
					case 25:
						parser.restricted = false;
						return "THIS";
						break;
					case 26:
						parser.restricted = true;
						return "THROW";
						break;
					case 27:
						return "TRY";
						break;
					case 28:
						parser.restricted = false;
						return "TYPEOF";
						break;
					case 29:
						return "VAR";
						break;
					case 30:
						parser.restricted = false;
						return "VOID";
						break;
					case 31:
						return "WHILE";
						break;
					case 32:
						return "WITH";
						break;
					case 33:
						parser.restricted = false;
						return "TRUE";
						break;
					case 34:
						parser.restricted = false;
						return "FALSE";
						break;
					case 35:
						parser.restricted = false;
						return "NULL";
						break;
					case 36:
						return "CLASS";
						break;
					case 37:
						return "CONST";
						break;
					case 38:
						return "ENUM";
						break;
					case 39:
						return "EXPORT";
						break;
					case 40:
						return "EXTENDS";
						break;
					case 41:
						return "IMPORT";
						break;
					case 42:
						return "SUPER";
						break;
					case 43:
						parser.restricted = false;
						return "IDENTIFIER";
						break;
					case 44:
						parser.restricted = false;
						return "NUMERIC_LITERAL";
						break;
					case 45:
						parser.restricted = false;
						return "NUMERIC_LITERAL";
						break;
					case 46:
						parser.restricted = false;
						return "NUMERIC_LITERAL";
						break;
					case 47:
						parser.restricted = false;
						return "{";
						break;
					case 48:
						return "}";
						break;
					case 49:
						parser.restricted = false;
						return "(";
						break;
					case 50:
						return ")";
						break;
					case 51:
						parser.restricted = false;
						return "[";
						break;
					case 52:
						return "]";
						break;
					case 53:
						return ".";
						break;
					case 54:
						parser.restricted = false;
						return ";";
						break;
					case 55:
						return ",";
						break;
					case 56:
						return "?";
						break;
					case 57:
						return ":";
						break;
					case 58:
						return "===";
						break;
					case 59:
						return "==";
						break;
					case 60:
						return "=";
						break;
					case 61:
						return "!==";
						break;
					case 62:
						return "!=";
						break;
					case 63:
						parser.restricted = false;
						return "!";
						break;
					case 64:
						return "<<=";
						break;
					case 65:
						return "<<";
						break;
					case 66:
						return "<=";
						break;
					case 67:
						return "<";
						break;
					case 68:
						return ">>>=";
						break;
					case 69:
						return ">>>";
						break;
					case 70:
						return ">>=";
						break;
					case 71:
						return ">>";
						break;
					case 72:
						return ">=";
						break;
					case 73:
						return ">";
						break;
					case 74:
						return "+=";
						break;
					case 75:
						parser.restricted = false;
						return "++";
						break;
					case 76:
						return "+";
						break;
					case 77:
						return "-=";
						break;
					case 78:
						parser.restricted = false;
						return "--";
						break;
					case 79:
						return "-";
						break;
					case 80:
						return "*=";
						break;
					case 81:
						return "*";
						break;
					case 82:
						return "/=";
						break;
					case 83:
						return "/";
						break;
					case 84:
						return "%=";
						break;
					case 85:
						return "%";
						break;
					case 86:
						return "&&";
						break;
					case 87:
						return "&=";
						break;
					case 88:
						return "&";
						break;
					case 89:
						return "||";
						break;
					case 90:
						return "|=";
						break;
					case 91:
						return "|";
						break;
					case 92:
						return "^=";
						break;
					case 93:
						return "^";
						break;
					case 94:
						parser.restricted = false;
						return "~";
						break;
					case 95:
						return "EOF";
						break;
					case 96:
						return "ERROR";
						break;
					case 97:
						console.log(yy_.yytext);
						break;
				}
			},
			rules: [/^(?:(((([^\n\r\*\\\/\[])|(\\([^\n\r]))|(\[([^\n\r\]\\]|(\\([^\n\r])))*\]))(([^\n\r\\\/\[])|(\\([^\n\r]))|(\[([^\n\r\]\\]|(\\([^\n\r])))*\]))*)\/(((([\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc])|[$_a-zA-Z]|(\\[u]([0-9a-fA-F]){4}))|([\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19b0-\u19c0\u19c8\u19c9\u19d0-\u19d9\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1dc0-\u1de6\u1dfc-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f])|[0-9])*)))/, /^(?:(\r\n|\r|\n)+\s*\+\+)/, /^(?:(\r\n|\r|\n)+\s*--)/, /^(?:\s+)/, /^(?:\/\*(.|\r|\n)*?\*\/)/, /^(?:\/\/.*($|\r\n|\r|\n))/, /^(?:(("(([^\"\\\n\r]+)|(\\((([\'\"\\bfnrtv])|([^\'\"\\bfnrtv0-9xu]))|((?:[1-7][0-7]{0,2}|[0-7]{2,3}))|([x]([0-9a-fA-F]){2})|([u]([0-9a-fA-F]){4})))|(\\(\r\n|\r|\n)))*")|('(([^\'\\\n\r]+)|(\\((([\'\"\\bfnrtv])|([^\'\"\\bfnrtv0-9xu]))|((?:[1-7][0-7]{0,2}|[0-7]{2,3}))|([x]([0-9a-fA-F]){2})|([u]([0-9a-fA-F]){4})))|(\\(\r\n|\r|\n)))*')))/, /^(?:break)/, /^(?:case)/, /^(?:catch)/, /^(?:continue)/, /^(?:debugger)/, /^(?:default)/, /^(?:delete)/, /^(?:do)/, /^(?:else)/, /^(?:finally)/, /^(?:for)/, /^(?:function)/, /^(?:if)/, /^(?:in)/, /^(?:instanceof)/, /^(?:new)/, /^(?:return)/, /^(?:switch)/, /^(?:this)/, /^(?:throw)/, /^(?:try)/, /^(?:typeof)/, /^(?:var)/, /^(?:void)/, /^(?:while)/, /^(?:with)/, /^(?:true)/, /^(?:false)/, /^(?:null)/, /^(?:class)/, /^(?:const)/, /^(?:enum)/, /^(?:export)/, /^(?:extends)/, /^(?:import)/, /^(?:super)/, /^(?:((([\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc])|[$_a-zA-Z]|(\\[u]([0-9a-fA-F]){4}))((([\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc])|[$_a-zA-Z]|(\\[u]([0-9a-fA-F]){4}))|([\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc0-9\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19b0-\u19c0\u19c8\u19c9\u19d0-\u19d9\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf2-\u1cf4\u1dc0-\u1de6\u1dfc-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua880\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f1\ua900-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f])|[0-9])*))/, /^(?:((([0]|(([1-9])([0-9]+)*))\.([0-9]+)*(([eE])([+-]?[0-9]+))?)|(\.([0-9]+)(([eE])([+-]?[0-9]+))?)|(([0]|(([1-9])([0-9]+)*))(([eE])([+-]?[0-9]+))?)))/, /^(?:([0][xX]([0-9a-fA-F])+))/, /^(?:([0]([0-7])+))/, /^(?:\{)/, /^(?:\})/, /^(?:\()/, /^(?:\))/, /^(?:\[)/, /^(?:\])/, /^(?:\.)/, /^(?:;)/, /^(?:,)/, /^(?:\?)/, /^(?::)/, /^(?:===)/, /^(?:==)/, /^(?:=)/, /^(?:!==)/, /^(?:!=)/, /^(?:!)/, /^(?:<<=)/, /^(?:<<)/, /^(?:<=)/, /^(?:<)/, /^(?:>>>=)/, /^(?:>>>)/, /^(?:>>=)/, /^(?:>>)/, /^(?:>=)/, /^(?:>)/, /^(?:\+=)/, /^(?:\+\+)/, /^(?:\+)/, /^(?:-=)/, /^(?:--)/, /^(?:-)/, /^(?:\*=)/, /^(?:\*)/, /^(?:\/=)/, /^(?:\/)/, /^(?:%=)/, /^(?:%)/, /^(?:&&)/, /^(?:&=)/, /^(?:&)/, /^(?:\|\|)/, /^(?:\|=)/, /^(?:\|)/, /^(?:\^=)/, /^(?:\^)/, /^(?:~)/, /^(?:$)/, /^(?:.)/, /^(?:.)/],
			conditions: {
				"REGEXP": {
					"rules": [0],
					"inclusive": false
				},
				"INITIAL": {
					"rules": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
					"inclusive": true
				}
			}
		};
		/* Begin Lexer Customization Methods */
		var _originalLexMethod = lexer.lex;

		lexer.lex = function() {
			parser.wasNewLine = parser.newLine;
			parser.newLine = false;

			return _originalLexMethod.call(this);
		};
		/* End Lexer Customization Methods */
		;
		return lexer;
	})();
	parser.lexer = lexer;

	function Parser() {
		this.yy = {};
	}
	Parser.prototype = parser;
	parser.Parser = Parser;
	return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
	exports.parser = parser;
	exports.Parser = parser.Parser;
	exports.parse = function() {
		return parser.parse.apply(parser, arguments);
	};
	exports.main = function commonjsMain(args) {
		if (!args[1]) {
			console.log("Usage: " + args[0] + " FILE");
			process.exit(1)
		}
		var source = require("fs").readFileSync(require("path").normalize(args[1]), "utf8");
		return exports.parser.parse(source)
	};
	if (typeof module !== 'undefined' && require.main === module) {
		exports.main(process.argv.slice(1));
	}
}
}).call(this,require('_process'))
},{"_process":85,"fs":74,"path":83}],68:[function(require,module,exports){
'use strict';

let gpu = null;

module.exports = class Texture {

	/**
	 * @desc WebGl Texture implementation in JS
	 * @constructor Texture
	 * @param {Object} texture 
	 * @param {Array} size 
	 * @param {Array} dimensions 
	 * @param {Object} webGl
	 */
	constructor(texture, size, dimensions, webGl) {
		this.texture = texture;
		this.size = size;
		this.dimensions = dimensions;
		this.webGl = webGl;
	}

	/**
	 * @name toArray
	 * @function
	 * @memberOf Texture#
	 *
	 * @desc Converts the Texture into a JavaScript Array.
	 * 
	 * @param {Object} The `gpu` Object
	 *
	 */
	toArray(gpu) {
		if (!gpu) throw new Error('You need to pass the GPU object for toArray to work.');
		const copy = gpu.createKernel(function(x) {
			return x[this.thread.z][this.thread.y][this.thread.x];
		}).setDimensions(this.dimensions);

		return copy(this);
	}

	/**
	 * @name delete
	 * @desc Deletes the Texture.
	 * @function
	 * @memberOf Texture#
	 *
	 *
	 */
	delete() {
		return this.webGl.deleteTexture(this.texture);
	}
};
},{}],69:[function(require,module,exports){
'use strict';

/**
 *
 * @desc Reduced subset of Utils, used exclusively in gpu-core.js
 * Various utility functions / snippets of code that GPU.JS uses internally.\
 * This covers various snippets of code that is not entirely gpu.js specific (ie. may find uses elsewhere)
 * 
 * Note that all methods in this class is 'static' by nature `UtilsCore.functionName()`
 *
 * @class UtilsCore
 * 
 */

class UtilsCore {

	/**
	 * @typedef {Object} webGlContext
	 */

	/**
	 * @typedef {Object} CanvasDOMObject
	 */

	//-----------------------------------------------------------------------------
	//
	//  Canvas validation and support
	//
	//-----------------------------------------------------------------------------

	/**
	 * @name isCanvas
	 * @static
	 * @function
	 * @memberOf UtilsCore
	 * 
	 *
	 * @desc Return TRUE, on a valid DOM canvas object
	 *
	 * Note: This does just a VERY simply sanity check. And may give false positives.
	 *
	 * @param {CanvasDOMObject} canvasObj - Object to validate
	 *
	 * @returns {Boolean} TRUE if the object is a DOM canvas
	 *
	 */
	static isCanvas(canvasObj) {
		return (
			canvasObj !== null &&
			canvasObj.nodeName &&
			canvasObj.getContext &&
			canvasObj.nodeName.toUpperCase() === 'CANVAS'
		);
	}

	/**
	 * @name isCanvasSupported
	 * @function
	 * @static
	 * @memberOf UtilsCore
	 *
	 * @desc Return TRUE, if browser supports canvas
	 *
	 * @returns {Boolean} TRUE if browser supports canvas
	 *
	 */
	static isCanvasSupported() {
		return _isCanvasSupported;
	}

	/**
	 * @name initCanvas
	 * @function
	 * @static
	 * @memberOf UtilsCore
	 *
	 * @desc Initiate and returns a canvas, for usage in init_webgl.
	 * Returns only if canvas is supported by browser.
	 *
	 * @returns {CanvasDOMObject} CanvasDOMObject if supported by browser, else null
	 *
	 */
	static initCanvas() {
		// Fail fast if browser previously detected no support
		if (!_isCanvasSupported) {
			return null;
		}

		// Create a new canvas DOM
		const canvas = document.createElement('canvas');

		// Default width and height, to fix webgl issue in safari
		canvas.width = 2;
		canvas.height = 2;

		// Returns the canvas
		return canvas;
	}

	//-----------------------------------------------------------------------------
	//
	//  Webgl validation and support
	//
	//-----------------------------------------------------------------------------


	/**
	 * 
	 * @name isWebGl
	 * @function
	 * @static
	 * @memberOf UtilsCore
	 *
	 * @desc Return TRUE, on a valid webGlContext object
	 *
	 * Note: This does just a VERY simply sanity check. And may give false positives.
	 *
	 * @param {webGlContext} webGlObj - Object to validate
	 *
	 * @returns {Boolean} TRUE if the object is a webGlContext object
	 *
	 */
	static isWebGl(webGlObj) {
		return (
			webGlObj !== null &&
			(
				(
					webGlObj.__proto__ &&
					webGlObj.__proto__.hasOwnProperty('getExtension')
				) ||
				(
					webGlObj.prototype &&
					webGlObj.prototype.hasOwnProperty('getExtension')
				)
			)
		);
	}

	/**
	 * @name isWebGlSupported
	 * @function
	 * @static
	 * @memberOf UtilsCore
	 *
	 * @desc Return TRUE, if browser supports webgl
	 *
	 * @returns {Boolean} TRUE if browser supports webgl
	 *
	 */
	static isWebGlSupported() {
		return _isWebGlSupported;
	}

	static isWebGlDrawBuffersSupported() {
		return _isWebGlDrawBuffersSupported;
	}

	// Default webgl options to use
	static initWebGlDefaultOptions() {
		return {
			alpha: false,
			depth: false,
			antialias: false
		};
	}

	/**
	 * @name initWebGl
	 * @function
	 * @static
	 * @memberOf UtilsCore
	 *
	 * @desc Initiate and returns a webGl, from a canvas object
	 * Returns only if webGl is supported by browser.
	 *
	 * @param {CanvasDOMObject} canvasObj - Object to validate
	 *
	 * @returns {CanvasDOMObject} CanvasDOMObject if supported by browser, else null
	 *
	 */
	static initWebGl(canvasObj) {

		// First time setup, does the browser support check memorizer
		if (typeof _isCanvasSupported !== 'undefined' || canvasObj === null) {
			if (!_isCanvasSupported) {
				return null;
			}
		}

		// Fail fast for invalid canvas object
		if (!UtilsCore.isCanvas(canvasObj)) {
			throw new Error('Invalid canvas object - ' + canvasObj);
		}

		// Create a new canvas DOM
		const webGl = (
			canvasObj.getContext('experimental-webgl', UtilsCore.initWebGlDefaultOptions()) ||
			canvasObj.getContext('webgl', UtilsCore.initWebGlDefaultOptions())
		);

		// Get the extension that is needed
		webGl.OES_texture_float = webGl.getExtension('OES_texture_float');
		webGl.OES_texture_float_linear = webGl.getExtension('OES_texture_float_linear');
		webGl.OES_element_index_uint = webGl.getExtension('OES_element_index_uint');

		// Returns the canvas
		return webGl;
	}

}

//-----------------------------------------------------------------------------
//
//  Canvas & Webgl validation and support constants
//
//-----------------------------------------------------------------------------

const _isCanvasSupported = typeof document !== 'undefined' ? UtilsCore.isCanvas(document.createElement('canvas')) : false;
const _testingWebGl = UtilsCore.initWebGl(UtilsCore.initCanvas());
const _isWebGlSupported = UtilsCore.isWebGl(_testingWebGl);
const _isWebGlDrawBuffersSupported = _isWebGlSupported && Boolean(_testingWebGl.getExtension('WEBGL_draw_buffers'));

if (_isWebGlSupported) {
	UtilsCore.OES_texture_float = _testingWebGl.OES_texture_float;
	UtilsCore.OES_texture_float_linear = _testingWebGl.OES_texture_float_linear;
	UtilsCore.OES_element_index_uint = _testingWebGl.OES_element_index_uint;
} else {
	UtilsCore.OES_texture_float = false;
	UtilsCore.OES_texture_float_linear = false;
	UtilsCore.OES_element_index_uint = false;
}

module.exports = UtilsCore;
},{}],70:[function(require,module,exports){
'use strict';

/**
 * 
 * @classdesc Various utility functions / snippets of code that GPU.JS uses internally.\
 * This covers various snippets of code that is not entirely gpu.js specific (ie. may find uses elsewhere)
 *
 * Note that all methods in this class are *static* by nature `Utils.functionName()`
 * 
 * @class Utils
 * @extends UtilsCore
 *
 */

const UtilsCore = require("./utils-core");
const Texture = require('./texture');
// FUNCTION_NAME regex
const FUNCTION_NAME = /function ([^(]*)/;

// STRIP COMMENTS regex
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

// ARGUMENT NAMES regex
const ARGUMENT_NAMES = /([^\s,]+)/g;

const _systemEndianness = (() => {
	const b = new ArrayBuffer(4);
	const a = new Uint32Array(b);
	const c = new Uint8Array(b);
	a[0] = 0xdeadbeef;
	if (c[0] === 0xef) return 'LE';
	if (c[0] === 0xde) return 'BE';
	throw new Error('unknown endianness');
})();

let _isFloatReadPixelsSupported = null;

class Utils extends UtilsCore {

	//-----------------------------------------------------------------------------
	//
	//  System values support (currently only endianness)
	//
	//-----------------------------------------------------------------------------

	/**
	 * @memberOf Utils
	 * @name systemEndianness
	 * @function
	 * @static
	 *
	 * Gets the system endianness, and cache it
	 *
	 * @returns {String} 'LE' or 'BE' depending on system architecture
	 *
	 * Credit: https://gist.github.com/TooTallNate/4750953
	 */
	static systemEndianness() {
		return _systemEndianness;
	}

	//-----------------------------------------------------------------------------
	//
	//  Function and function string validations
	//
	//-----------------------------------------------------------------------------

	/**
	 * @memberOf Utils
	 * @name isFunction
	 * @function
	 * @static
	 *
	 * Return TRUE, on a JS function
	 *
	 * @param {Function} funcObj - Object to validate if its a function
	 *
	 * @returns	{Boolean} TRUE if the object is a JS function
	 *
	 */
	static isFunction(funcObj) {
		return typeof(funcObj) === 'function';
	}

	/**
	 * @memberOf Utils
	 * @name isFunctionString
	 * @function
	 * @static
	 *
	 * Return TRUE, on a valid JS function string
	 *
	 * Note: This does just a VERY simply sanity check. And may give false positives.
	 *
	 * @param {String} funcStr - String of JS function to validate
	 *
	 * @returns {Boolean} TRUE if the string passes basic validation
	 *
	 */
	static isFunctionString(funcStr) {
		if (funcStr !== null) {
			return (funcStr.toString()
				.slice(0, 'function'.length)
				.toLowerCase() === 'function');
		}
		return false;
	}

	/**
	 * @memberOf Utils
	 * @name getFunctionName_fromString
	 * @function
	 * @static
	 *
	 * Return the function name from a JS function string
	 *
	 * @param {String} funcStr - String of JS function to validate
	 *
	 * @returns {String} Function name string (if found)
	 *
	 */
	static getFunctionNameFromString(funcStr) {
		return FUNCTION_NAME.exec(funcStr)[1];
	}

	static getFunctionBodyFromString(funcStr) {
		return funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
	}

	/**
	 * @memberOf Utils
	 * @name getParamNames_fromString
	 * @function
	 * @static
	 *
	 * Return list of parameter names extracted from the JS function string
	 *
	 * @param {String} funcStr - String of JS function to validate
	 *
	 * @returns {String[]}  Array representing all the parameter names
	 *
	 */
	static getParamNamesFromString(func) {
		const fnStr = func.toString().replace(STRIP_COMMENTS, '');
		let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
		if (result === null)
			result = [];
		return result;
	}

	//-----------------------------------------------------------------------------
	//
	//  Object / function cloning and manipulation
	//
	//-----------------------------------------------------------------------------

	/**
	 * @memberOf Utils
	 * @name clone
	 * @function
	 * @static
	 *
	 * Returns a clone
	 *
	 * @param {Object} obj - Object to clone
	 *
	 * @returns {Object}  Cloned object
	 *
	 */
	static clone(obj) {
		if (obj === null || typeof obj !== 'object' || obj.hasOwnProperty('isActiveClone')) return obj;

		const temp = obj.constructor(); // changed

		for (let key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				obj.isActiveClone = null;
				temp[key] = Utils.clone(obj[key]);
				delete obj.isActiveClone;
			}
		}

		return temp;
	}

	/**
	 * @memberOf Utils
	 * @name newPromise
	 * @function
	 * @static
	 *
	 * Returns a `new Promise` object based on the underlying implmentation
	 *
	 * @param {Function} executor - Promise builder function
	 *
	 * @returns {Promise}  Promise object
	 *
	 */
	static newPromise(executor) {
		const simple = Promise || small_promise;
		if (simple === null) {
			throw TypeError('Browser is missing Promise implementation. Consider adding small_promise.js polyfill');
		}
		return (new simple(executor));
	}

	/**
	 * @memberOf Utils
	 * @name functionBinder
	 * @function
	 * @static
	 *
	 * Limited implementation of Function.bind, with fallback
	 *
	 * @param {Function} inFunc - to setup bind on
	 * @param {Object} thisObj - The this parameter to assume inside the binded function
	 *
	 * @returns {Function}  The binded function
	 *
	 */
	static functionBinder(inFunc, thisObj) {
		if (inFunc.bind) {
			return inFunc.bind(thisObj);
		}

		return function() {
			const args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
			return inFunc.apply(thisObj, args);
		}
	}

	/**
	 * @memberOf Utils
	 * @name isArray
	 * @function
	 * @static
	 *
	 * * Checks if is an array or Array-like object
	 *
	 * @param {Object} arg - The argument object to check if is array
	 *
	 * @returns {Boolean}  true if is array or Array-like object
	 *
	 */
	static isArray(array) {
		if(isNaN(array.length)) {
			return false;
		}
		
		return true;
	}

	/**
	 * @memberOf Utils
	 * @name getArgumentType
	 * @function
	 * @static
	 *
	 * Evaluate the argument type, to apply respective logic for it
	 *
	 * @param {Object} arg - The argument object to evaluate type
	 *
	 * @returns {String}  Argument type Array/Number/Texture/Unknown
	 *
	 */
	static getArgumentType(arg) {
		if (Utils.isArray(arg)) {
			return 'Array';
		} else if (typeof arg === 'number') {
			return 'Number';
		} else if (arg instanceof Texture) {
			return 'Texture';
		} else {
			return 'Unknown';
		}
	}
	/**
	 * @typedef {Object} gpuJSObject
	 */

	/**
	 * @memberOf Utils
	 * @name isFloatReadPixelsSupported
	 * @function
	 * @static
	 *
	 * Checks if the browser supports readPixels with float type
	 *
	 * @param {gpuJSObject} gpu - the gpu object
	 *
	 * @returns {Boolean} true if browser supports
	 *
	 */
	static isFloatReadPixelsSupported() {
		if (_isFloatReadPixelsSupported !== null) {
			return _isFloatReadPixelsSupported
		}

		const GPU = require('../index');
		const x = new GPU({
			mode: 'webgl-validator'
		}).createKernel(function() {
			return 1;
		}, {
			dimensions: [2],
			floatTextures: true,
			floatOutput: true,
			floatOutputForce: true
		})();

		_isFloatReadPixelsSupported = x[0] === 1;

		return _isFloatReadPixelsSupported;
	}


	static dimToTexSize(opt, dimensions, output) {
		let numTexels = dimensions[0];
		for (let i = 1; i < dimensions.length; i++) {
			numTexels *= dimensions[i];
		}

		if (opt.floatTextures && (!output || opt.floatOutput)) {
			numTexels = Math.ceil(numTexels / 4);
		}

		const w = Math.ceil(Math.sqrt(numTexels));
		return [w, w];
	}

	/**
	 * @memberOf Utils
	 * @name getDimensions
	 * @function
	 * @static
	 *
	 * Return the dimension of an array.
	 * 
	 * @param {Array} x - The array
	 * @param {number} pad - To include padding in the dimension calculation [Optional]
	 *
	 *
	 *
	 */

	static getDimensions(x, pad) {
		let ret;
		if (Utils.isArray(x)) {
			const dim = [];
			let temp = x;
			while (Utils.isArray(temp)) {
				dim.push(temp.length);
				temp = temp[0];
			}
			ret = dim.reverse();
		} else if (x instanceof Texture) {
			ret = x.dimensions;
		} else {
			throw 'Unknown dimensions of ' + x;
		}

		if (pad) {
			ret = Utils.clone(ret);
			while (ret.length < 3) {
				ret.push(1);
			}
		}

		return ret;
	}

	/**
	 * @memberOf Utils
	 * @name pad
	 * @function
	 * @static
	 *
	 * Pad an array AND its elements with leading and ending zeros
	 *
	 * @param {Array} arr - the array to pad zeros to
	 * @param {number} padding - amount of padding
	 *
	 * @returns {Array} Array with leading and ending zeros, and all the elements padded by zeros.
	 *
	 */
	static pad(arr, padding) {
		function zeros(n) {
			return Array.apply(null, new Array(n)).map(Number.prototype.valueOf, 0);
		}

		const len = arr.length + padding * 2;

		let ret = arr.map(function(x) {
			return [].concat(zeros(padding), x, zeros(padding));
		});

		for (let i = 0; i < padding; i++) {
			ret = [].concat([zeros(len)], ret, [zeros(len)]);
		}

		return ret;
	}

	/**
	 * @memberOf Utils
	 * @name flatten2dArrayTo
	 * @function
	 * @static
	 *
	 * Puts a nested 2d array into a one-dimensional target array
	 * @param {Array|*} array
	 * @param {Float32Array|Float64Array} target
	 */
	static flatten2dArrayTo(array, target) {
		let offset = 0;
		for (let y = 0; y < array.length; y++) {
			target.set(array[y], offset);
			offset += array[y].length;
		}
	}

	/**
	 * @memberOf Utils
	 * @name flatten3dArrayTo
	 * @function
	 * @static
	 *
	 * Puts a nested 3d array into a one-dimensional target array
	 * @param {Array|*} array
	 * @param {Float32Array|Float64Array} target
	 */
	static flatten3dArrayTo(array, target) {
		let offset = 0;
		for (let z = 0; z < array.length; z++) {
			for (let y = 0; y < array[z].length; y++) {
				target.set(array[z][y], offset);
				offset += array[z][y].length;
			}
		}
	}

	/**
	 * @memberOf Utils
	 * @name flatten3dArrayTo
	 * @function
	 * @static
	 *
	 * Puts a nested 1d, 2d, or 3d array into a one-dimensional target array
	 * @param {Array|*} array
	 * @param {Float32Array|Float64Array} target
	 */
	static flattenTo(array, target) {
		if (Utils.isArray(array[0])) {
			if (Utils.isArray(array[0][0])) {
				Utils.flatten3dArrayTo(array, target);
			} else {
				Utils.flatten2dArrayTo(array, target);
			}
		} else {
			target.set(array);
		}
	}

	/**
	 * @memberOf Utils
	 * @name splitArray
	 * @function
	 * @static
	 *
	 * Splits an array into smaller arrays.
	 * Number of elements in one small chunk is given by `part`
	 *
	 * @param {Array} array - The array to split into chunks
	 * @param {Array} part - elements in one chunk
	 *

	 * @returns {Array} An array of smaller chunks
	 *
	 */
	static splitArray(array, part) {
		const result = [];
		for (let i = 0; i < array.length; i += part) {
			result.push(array.slice(i, i + part));
		}
		return result;
	}

	static getAstString(source, ast) {
		let lines = Array.isArray(source) ? source : source.split(/\r?\n/g);
		const start = ast.loc.start;
		const end = ast.loc.end;
		const result = [];
		result.push(lines[start.line - 1].slice(start.column));
		for (let i = start.line; i < end.line - 1; i++) {
			result.push(lines[i]);
		}
		result.push(lines[end.line - 1].slice(0, end.column));
		return result.join('\n');
	}

	static allPropertiesOf(obj) {
		const props = [];

		do {
			props.push.apply(props, Object.getOwnPropertyNames(obj));
		} while (obj = Object.getPrototypeOf(obj));

		return props;
	}
}

// This ensure static methods are "inherited"
// See: https://stackoverflow.com/questions/5441508/how-to-inherit-static-methods-from-base-class-in-javascript
Object.assign(Utils, UtilsCore);

module.exports = Utils;
},{"../index":71,"./texture":68,"./utils-core":69}],71:[function(require,module,exports){
'use strict';

const GPU = require('./core/gpu');
const alias = require('./core/alias');
const utils = require('./core/utils');

const CPUFunctionBuilder = require('./backend/cpu/function-builder');
const CPUFunctionNode = require('./backend/cpu/function-node');
const CPUKernel = require('./backend/cpu/kernel');
const CPURunner = require('./backend/cpu/runner');

const WebGLFunctionBuilder = require('./backend/web-gl/function-builder');
const WebGLFunctionNode = require('./backend/web-gl/function-node');
const WebGLKernel = require('./backend/web-gl/kernel');
const WebGLRunner = require('./backend/web-gl/runner');

GPU.alias = alias;
GPU.utils = utils;

GPU.CPUFunctionBuilder = CPUFunctionBuilder;
GPU.CPUFunctionNode = CPUFunctionNode;
GPU.CPUKernel = CPUKernel;
GPU.CPURunner = CPURunner;

GPU.WebGLFunctionBuilder = WebGLFunctionBuilder;
GPU.WebGLFunctionNode = WebGLFunctionNode;
GPU.WebGLKernel = WebGLKernel;
GPU.WebGLRunner = WebGLRunner;

if (typeof module !== 'undefined') {
	module.exports = GPU;
}
if (typeof window !== 'undefined') {
	window.GPU = GPU;
}
},{"./backend/cpu/function-builder":46,"./backend/cpu/function-node":47,"./backend/cpu/kernel":49,"./backend/cpu/runner":50,"./backend/web-gl/function-builder":56,"./backend/web-gl/function-node":57,"./backend/web-gl/kernel":59,"./backend/web-gl/runner":60,"./core/alias":64,"./core/gpu":66,"./core/utils":70}],72:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],73:[function(require,module,exports){

},{}],74:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"dup":73}],75:[function(require,module,exports){
(function (global){
'use strict';

var buffer = require('buffer');
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":76}],76:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":72,"ieee754":79}],77:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":81}],78:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],79:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],80:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],81:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],82:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],83:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":85}],84:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":85}],85:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],86:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":78,"inherits":80,"readable-stream/duplex.js":87,"readable-stream/passthrough.js":94,"readable-stream/readable.js":95,"readable-stream/transform.js":96,"readable-stream/writable.js":97}],87:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":88}],88:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":90,"./_stream_writable":92,"core-util-is":77,"inherits":80,"process-nextick-args":84}],89:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":91,"core-util-is":77,"inherits":80}],90:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var StringDecoder;

util.inherits(Readable, Stream);

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = bufferShim.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'))
},{"./_stream_duplex":88,"./internal/streams/BufferList":93,"_process":85,"buffer":76,"buffer-shims":75,"core-util-is":77,"events":78,"inherits":80,"isarray":82,"process-nextick-args":84,"string_decoder/":98,"util":73}],91:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":88,"core-util-is":77,"inherits":80}],92:[function(require,module,exports){
(function (process){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = Buffer.isBuffer(chunk);

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    chunk = decodeChunk(state, chunk, encoding);
    if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
}).call(this,require('_process'))
},{"./_stream_duplex":88,"_process":85,"buffer":76,"buffer-shims":75,"core-util-is":77,"events":78,"inherits":80,"process-nextick-args":84,"util-deprecate":99}],93:[function(require,module,exports){
'use strict';

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return bufferShim.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = bufferShim.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};
},{"buffer":76,"buffer-shims":75}],94:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":89}],95:[function(require,module,exports){
(function (process){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
}

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":88,"./lib/_stream_passthrough.js":89,"./lib/_stream_readable.js":90,"./lib/_stream_transform.js":91,"./lib/_stream_writable.js":92,"_process":85}],96:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":91}],97:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":92}],98:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":76}],99:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
