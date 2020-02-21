# Hands on Webpack, Babel and React demonstration to build web development environment from scratch - @GBC

## Requirements

Node version >= 8.10 <br>
NPM version >5

## Getting started

### Basic setup

- Open terminal/command prompt and run following commands:

```
mkdir webpack-demo
cd webpack-demo
npm init -y
npm install webpack --save-dev
npm install webpack-cli --save-dev
```

create the following directory structure

- project

```
webpack-demo
|- package.json
|- index.html
|- /src
 |- index.js
```

- `src/index.js`

```javascript
function component() {
  const element = document.createElement("div");

  element.innerHTML = _.join(["Welcome", "to", "GBC"], " ");

  return element;
}

document.body.appendChild(component());
```

- `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Webpack demo</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```

- `package.json`

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.20.2",
    "webpack-cli": "^3.1.2"
  },
  "dependencies": {}
}
```

### Creating a bundle

adjust the directory structure as follows

- project

```
webpack-demo
  |- package.json
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

- install `lodash` locally

```s
npm install --save lodash
```

- import lodash into script

```js
import _ from "lodash";

function component() {
  const element = document.createElement("div");

  element.innerHTML = _.join(["Welcome", "to", "GBC"], " ");

  return element;
}

document.body.appendChild(component());
```

- `dist/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Getting Started</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

run `npx webpack` and open `index.html` in browser and you should see 'Welcome to GBC'.

### Adding Configuration

adjust the direcotory as follows

- project

```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

- webpack.config.js

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

Run `npx webpack --config webpack.config.js`. Refresh the page in the browser.

### NPM Scripts

adjust `package.json` as follows

- `package.json`

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.20.2",
    "webpack-cli": "^3.1.2"
  },
  "dependencies": {
    "lodash": "^4.17.5"
  }
}
```

run `npm run build` and check if output is still available after refreshing the page.

### Conclusion

your project structure will now look as follows.

- project

```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- main.js
  |- index.html
|- /src
  |- index.js
|- /node_modules
```

## Asset Management

### Setup

adjust files as follows

- `dist/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Webpack asset management demo</title>
  </head>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
```

- `webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

### Loading CSS

run `npm install --save-dev style-loader css-loader`

- `webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
```

let's add new `style.css`.

- project

```
webpack-demo
 |- package.json
 |- webpack.config.js
 |- /dist
   |- bundle.js
   |- index.html
 |- /src
   |- style.css
   |- index.js
 |- /node_modules
```

- `src/style.css`

```css
.gbc {
  color: red;
}
```

- `src/index.js`

```js
import _ from "lodash";
import "./style.css";

function component() {
  const element = document.createElement("div");

  // Lodash, now imported by this script
  element.innerHTML = _.join(["Welcome", "to", "GBC"], " ");
  element.classList.add("gbc");

  return element;
}

document.body.appendChild(component());
```

now run `npm run build` and verify the output.

### Loading Images

- install `file-loader

`npm run --save-dev file-loader`

- `webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
```

add an image to roject.

- project

```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

- `src/index.js`

```js
import _ from "lodash";
import "./style.css";
import Icon from "./icon.png";

function component() {
  const element = document.createElement("div");

  element.innerHTML = _.join(["Welcome", "to", "GBC"], " ");
  element.classList.add("gbc");

  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());
```

- `src/style.css`

```css
.gbc {
  color: red;
  background: url("./icon.png");
}
```

run `npm run build` and open up `index.html` file in browser.

### Loading fonts

- `webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  }
};
```

add some font-files to project

- project

```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- my-font.ttf
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

install fonts

- `src/style.css`

```css
@font-face {
  font-family: "MyFont";
  src: url("./my-font.ttf") format("trueType");
  font-weight: 600;
  font-style: normal;
}

.hello {
  color: red;
  font-family: "MyFont";
  background: url("./icon.png");
}
```

run `npm run build` and check the output whether `webpack` handled fonts!

### Loading data

- install data loaders

`npm install --save-dev csv-loader xml-loader`

- `webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(csv|tsv)$/,
        use: ["csv-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      }
    ]
  }
};
```

add data files

- project

```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- data.xml
    |- my-font.woff
    |- my-font.woff2
    |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

- `src/data.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<program>
  <name>BCDV</name>
  <institution>GBC</institution>
  <city>Toronto</city>
  <province>Ontario</province>
</program>
```

- `src/index.js`

```js
import _ from "lodash";
import "./style.css";
import Icon from "./icon.png";
import Data from "./data.xml";

function component() {
  const element = document.createElement("div");

  element.innerHTML = _.join(["Welcome", "to", "GBC"], " ");
  element.classList.add("gbc");

  const myIcon = new Image();
  myIcon.src = Icon;

  element.appendChild(myIcon);

  console.log(Data);

  return element;
}

document.body.appendChild(component());
```

Re-run the `npm run build` command.

### Clean up

- project

```
 webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- index.js
  |- /node_modules
```

- `webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

- `src/index.js`

```js
import _ from "lodash";

function component() {
  const element = document.createElement("div");

  return element;
}

document.body.appendChild(component());
```

## Output Management

### Preparation

- project

```
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
    |- print.js
  |- /node_modules
```

- `src/print.js`

```js
export default function printMe() {
  console.log("I get called from print.js!");
}
```

- `src/index.js`

```js
import _ from "lodash";
import printMe from "./print.js";

function component() {
  const element = document.createElement("div");
  const btn = document.createElement("button");

  element.innerHTML = _.join(["Welcome", "to", "GBC"], " ");

  btn.innerHTML = "Click me and check the console!";
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());
```

- `dist/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Output Management</title>
    <script src="./print.bundle.js"></script>
  </head>
  <body>
    <script src="./app.bundle.js"></script>
  </body>
</html>
```

- `webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

now re-run `npm run build`. Observe the contents of `dist` folder.

### Setting up `HtmlWebpackPlugin`

- installation

`npm install --save-dev html-webpack-plugin`

- `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

run `npm run build` and observer the `index.html` file under `dist` folder.

### Cleaning up the `/dist` folder

- installation

`npm install --save-dev clean-webpack-plugin`

- `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

re-run `npm run build` and `dist/` should have all old files removed!

## Development

- `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Development"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

### Using source-maps

Eases out to track down errors and warnings

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  devtool: "inline-source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Development"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

- `src/print.js`

```js
export default function printMe() {
  cosnole.log("I get called from print.js!");
}
```

run `npm run build` and open `index.html` . Inspect the browser console and you can see this error

```error
Uncaught ReferenceError: cosnole is not defined
   at HTMLButtonElement.printMe (print.js:2)
```

## Choosing a developemnt tool

### using watch mode

- `package.json`

```json
{
  "name": "development",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^0.28.4",
    "csv-loader": "^2.1.1",
    "file-loader": "^0.11.2",
    "html-webpack-plugin": "^2.29.0",
    "style-loader": "^0.18.2",
    "webpack": "^4.30.0",
    "xml-loader": "^1.2.1"
  }
}
```

run `npm run watch` and it will not exit command line as script is watching your files.

- `src/print.js`

```js
export default function printMe() {
  console.log("I get called from print.js!");
}
```

### using webpack-dev-server

`npm install --save-dev webpack-dev-server`

- `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Development"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

- `package.json`

```json
{
  "name": "development",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
    "start": "webpack-dev-server --open",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^0.28.4",
    "csv-loader": "^2.1.1",
    "file-loader": "^0.11.2",
    "html-webpack-plugin": "^2.29.0",
    "style-loader": "^0.18.2",
    "webpack": "^4.30.0",
    "xml-loader": "^1.2.1"
  }
}
```

### using webpack-ev-middleware

`webpack-dev-middleware` is a wrapper that will emit files processed by webpack to a server.

- Installation

`npm install --save-dev express webpack-dev-middleware`

- `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  }
};
```

- project

```
webpack-demo
 |- package.json
 |- webpack.config.js
 |- server.js
 |- /dist
 |- /src
   |- index.js
   |- print.js
 |- /node_modules
```

- server.js

```js
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const config = require("./webpack.config.js");
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);

// Serve the files on port 3000.
app.listen(3000, function() {
  console.log("Example app listening on port 3000!\n");
});
```

- `package.json`

```json
{
  "name": "development",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
    "start": "webpack-dev-server --open",
    "server": "node server.js",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^0.28.4",
    "csv-loader": "^2.1.1",
    "express": "^4.15.3",
    "file-loader": "^0.11.2",
    "html-webpack-plugin": "^2.29.0",
    "style-loader": "^0.18.2",
    "webpack": "^4.30.0",
    "webpack-dev-middleware": "^1.12.0",
    "xml-loader": "^1.2.1"
  }
}
```

run `npm run server` and navigate to `http://localhost:3000`.

### Bundle Analysis

- installation

`npm run --save-dev webpack-bundle-analyzer`

- `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
      statsOptions: { source: false }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  }
};
```

- `package.json`

```json
  "name": "development",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
    "start": "webpack-dev-server --open",
    "server": "node server.js",
    "build": "webpack",
    "bundle-report" : "webpack-bundle-analyzer --port 4200 dist/stats.json"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^0.28.4",
    "csv-loader": "^2.1.1",
    "express": "^4.15.3",
    "file-loader": "^0.11.2",
    "html-webpack-plugin": "^2.29.0",
    "style-loader": "^0.18.2",
    "webpack": "^4.30.0",
        "webpack-bundle-analyzer": "^3.4.1",
    "webpack-dev-middleware": "^1.12.0",
    "xml-loader": "^1.2.1"
  }
}
```

Now run `npm run build` and you'll see `stats.json` in `dist/`.<br>
Run `npm run bundle-report` to fire-up an interactive bundle report analyzer.

## Setting Babel 7

- install

`npm install @babel/core @babel/preset-env @babel/preset-react babel-loader --save-dev`

- project

```
webpack-demo
 |- package.json
 |- webpack.config.js
 |- .babelrc
 |- server.js
 |- /dist
 |- /src
   |- index.js
   |- print.js
 |- /node_modules
```

- `.babelrc`

```js
{
  "presets": ["@babel/env", "@babel/react"]
}
```

- webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
      statsOptions: { source: false }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```

## Setting React

- installation

`npm install --save-dev react react-dom`

### Connection React component to DOM

- project

```
webpack-demo
 |- package.json
 |- webpack.config.js
 |- .babelrc
 |- server.js
 |- /dist
 |- /src
   |- index.js
   |- print.js
   |- index.html
   |- components
      |- app.js
      |- app.scss
 |- /node_modules
```

- `src/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>React, Webpack, Babel Starter Pack</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <!-- your react app will render here -->
    <div id="app"></div>
  </body>
</html>
```

- `src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";

ReactDOM.render(<App />, document.getElementById("app"));
```

- `src/components/app.js`

```js
import React from "react";
import "./app.scss";

const App = () => {
  return (
    <div className="full-screen">
      <div>
        <h1>Welcome to GBC</h1>
        <br />
        <a
          className="button-line"
          href="https://github.com/dhruvinparikh93"
          target="_blank"
        >
          Click Me
        </a>
      </div>
    </div>
  );
};

export default App;
```

- `src/components/app.scss`

```scss
body {
  background: linear-gradient(253deg, #0cc898, #1797d2, #864fe1);
  background-size: 300% 300%;
  -webkit-animation: Background 25s ease infinite;
  -moz-animation: Background 25s ease infinite;
  animation: Background 25s ease infinite;
}

.full-screen {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url("../../assests/image/background.png");
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  text-align: center;
}

h1 {
  color: #fff;
  font-family: "Open Sans", sans-serif;
  font-weight: 800;
  font-size: 4em;
  letter-spacing: -2px;
  text-align: center;
  text-shadow: 1px 2px 1px rgba(0, 0, 0, 0.6);

  &:after {
    display: block;
    color: #fff;
    letter-spacing: 1px;
    font-family: "Poiret One", sans-serif;
    content: "Webpack, Babel 7 & React Demo for GBC BCDV students";
    font-size: 0.4em;
    text-align: center;
  }
}

.button-line {
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  text-align: center;
  font-size: 1.4em;
  opacity: 0.8;
  padding: 20px 40px;
  text-decoration: none;
  transition: all 0.5s ease;
  margin: 0 auto;
  display: block;

  &:hover {
    opacity: 1;
    background-color: #fff;
    color: grey;
  }
}

@-webkit-keyframes Background {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@-moz-keyframes Background {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes Background {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```

- webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
      statsOptions: { source: false }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  }
};
```

### Configuration for SASS

- installation

`npm install sass-loader mini-css-extract-plugin node-sass --save-dev`

- `webpack.config.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js",
    print: "./src/print.js"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      generateStatsFile: true,
      statsOptions: { source: false }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name]-[hash:8].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      {
        test: /.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  }
};
```

Now run `npm run start` and verify the output.

### Handling react class components and static class properties

- installation

`npm install file-loader @babel/plugin-proposal-class-properties --save-dev`

- `.babelrc`

```js
{
  "presets": ["@babel/env", "@babel/react"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```
Run `npm run start` to make sure everything is working.