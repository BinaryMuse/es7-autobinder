function autobound(target, name, descriptor) {
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

module.exports = { autobound };
