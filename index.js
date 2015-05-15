const autobindMarker = Symbol("autobindMarker");
const autobindMethodsMarker = Symbol("autobindMethods");

function autobindMethods(target) {
  if (target.constructor[autobindMethodsMarker]) {
    for (let methodName of target.constructor[autobindMethodsMarker]) {
      target[methodName] = target[methodName].bind(target);
    }
  }

  return target;
}

function autobindClass(target) {
  class AutoBound extends target {
    constructor(...args) {
      super(...args);
      autobindMethods(this);
    }
  }

  return AutoBound;
}

function autobindMethod(target, name, descriptor) {
  const { value } = descriptor;

  return {
    configurable: true,
    get() {
      const fn = value.bind(this);
      Object.defineProperty(this, name, {
        value: fn,
        configurable: true,
        writable: true
      });
      return fn;
    }
  };
}

function autobound(target, name, descriptor) {
  if (name) {
    return autobindMethod(target, name, descriptor);
  } else {
    return autobindClass(target);
  }
}

module.exports = { autobound, autobindMethods };
