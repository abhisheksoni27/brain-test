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
  output: [1]
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
const mnist = require('mnist');

const start = new Date();

net = new brain.NeuralNetworkGPU();

const set = mnist.set(1000, 1);
const trainingSet = set.training;
net.train(trainingSet, {
  log: true
}); 

const end = new Date();

console.log(end - start);
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