ES7 Autobinder
==============

[![Build Status](https://travis-ci.org/BinaryMuse/es7-autobinder.svg?branch=master)](https://travis-ci.org/BinaryMuse/es7-autobinder)

ES7 Autobinder allows you to declaratively and automatically bind methods on ES6 classes to `this` when called.

It uses ES7 decorators to mark classes and methods, and so requires an ES7-capable environment with the following features:

* Classes
* Decorators
* Symbols
* Rest Arguments

The [Babel](http://babeljs.io/) project with [stage 1 experimental features](http://babeljs.io/docs/usage/experimental/) enabled and the [Babel polyfill](http://babeljs.io/docs/usage/polyfill/) supplied can provide this.

API
---

* **`require("es7-autobinder").autobound`**

A decorator used to mark a class or method as autobound. If you use this decorator on your class, you do not need to use `autobindMethods`, but your class is wrapped by another class that performs the autobinding.

```javascript
@autobound
class MyClass {
  @autobound
  myMethod() {
    // ...
  }
}
```

* **`require("es7-autobinder").autobindMethods`**

A method that will iterate over every method in the class marked as autobound and then bind it. Can be used in place of marking a class with `autobound`, which prevents your class from being wrapped.

```javascript
class MyClass {
  constructor() {
    autobindMethods(this);
  }

  @autobound
  myMethod() {
    // ...
  }
}
```

Examples
--------

Say you have a class with a method you always want to be bound to the instance of the class.

```javascript
class Clicker {
  constructor(selector) {
    this.onClickText = "clicked!";
    $(selector).click(this.handleClick);
  }

  handleClick() {
    console.log(this.onClickText);
  }
}

const instance = new Clicker(".element");
```

Since `handleClick` is called from a jQuery event handler, `this` is the element that was clicked, and not the `Clicker` instance. You can fix this manually by either binding to the target when referring to the method:

```javascript
$(selector).click(this.handleClick.bind(this));
```

or by manually binding the method to the instance:

```javascript
this.handleClick = this.handleClick.bind(this);
$(selector).click(this.handleClick);
```

However, when there are many methods on the class you need to bind in this fashion, it's easy to forget, or to mistakenly create many such bound functions (such as in a React `render` method).

ES7 Autobinder allows you to use decorators to declaratively specify methods that should be automatically bound to the instance.

```javascript
const { autobound } = require("es7-autobinder");

class Clicker {
  constructor(selector) {
    this.onClickText = "clicked!";
    $(selector).click(this.handleClick);
  }

  @autobound
  handleClick() {
    console.log(this.onClickText);
  }
}

const instance = new Clicker(".element");
```

In addition to decorating the method, you must either decorate the class:

```javascript
const { autobound } = require("es7-autobinder");

@autobound
class Clicker {
  constructor(selector) {
    this.onClickText = "clicked!";
    $(selector).click(this.handleClick);
  }

  @autobound
  handleClick() {
    console.log(this.onClickText);
  }
}

const instance = new Clicker(".element");
```

or manually call `autobindMethods` in the class's constructor:

```javascript
const { autobound, autobindMethods } = require("es7-autobinder");

class Clicker {
  constructor(selector) {
    autobindMethods(this);
    this.onClickText = "clicked!";
    $(selector).click(this.handleClick);
  }

  @autobound
  handleClick() {
    console.log(this.onClickText);
  }
}

const instance = new Clicker(".element");
```
