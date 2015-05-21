export function autobound(target, name, descriptor) {
  const { value } = descriptor;

  return {
    configurable: true,
    get() {
      const boundValue = value.bind(this);
      Object.defineProperty(this, name, {
        value: boundValue,
        configurable: true,
        writable: true
      });
      return boundValue;
    }
  };
}
