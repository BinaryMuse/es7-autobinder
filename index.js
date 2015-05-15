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
  target.constructor[autobindMethodsMarker] = target.constructor[autobindMethodsMarker] || [];
  target.constructor[autobindMethodsMarker].push(name);
  return descriptor;
}

function autobound(target, name, descriptor) {
  if (name) {
    return autobindMethod(target, name, descriptor);
  } else {
    return autobindClass(target);
  }
}

module.exports = { autobound, autobindMethods };
