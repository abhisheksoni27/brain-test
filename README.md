# Usage

**Step 1.** Clone `gpu.js` and `brain.js`

* **gpu.js**: `https://github.com/gpujs/gpu.js.git`

* **brain.js**: `https://github.com/harthur-org/brain.js.git`

**Step 2.** `cd` into the cloned repositories one by one and run `yarn link` (or `npm link`).

**Step 3.** Clone this repository.

**Step 4.** `npm install` 

**Step 5.** `cd` into `brain-test` and run `yarn link brain.js gpu.js` (or `npm link brain.js gpu.js`)

**Step 6.** `node app.js`

**Step 7.** In another terminal/terminal tab, run `sudo watchify -p [ browserify-livereload ] index.js -o bundle.js`

Go to [localhost:3000](localhost:3000)