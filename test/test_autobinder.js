const { autobound, autobindMethods } = require("../");

exports.withoutBinding = {
  setUp: function(callback) {
    class NotBound {
      constructor(name) {
        this.name = name;
      }

      getName() {
        return this.name;
      }
    }
    this.NotBound = NotBound;
    callback();
  },

  testNotBoundByDefault: function(test) {
    const instance = new this.NotBound("name");
    const fn = instance.getName;
    let error = "";

    try {
      fn();
    } catch (e) {
      error = e.message;
    } finally {
      test.ok(error.match(/property.*name.*undefined/));
      test.done();
    }
  },

  testCanBeBoundToOther: function(test) {
    const instance = new this.NotBound();
    const fn = instance.getName.bind({ name: "other" });
    let error = "";

    const name = fn();
    test.equal(name, "other");
    test.done();
  },

  testCanBeBoundToSelf: function(test) {
    const instance = new this.NotBound("name");
    const fn = instance.getName.bind(instance);
    const name = fn();
    test.equal(name, "name");
    test.done();
  }
};

exports.withAutoboundMethods = {
  setUp: function(callback) {
    class AutoBound {
      constructor(name) {
        autobindMethods(this);
        this.name = name;
      }

      @autobound
      getName() {
        return this.name;
      }
    }
    this.AutoBound = AutoBound;
    callback();
  },

  testIsAutomaticallyBound: testIsAutomaticallyBound,
  testIgnoresRebinding: testIgnoresRebinding
};

exports.withAutoboundSubclasses = {
  setUp: function(callback) {
    class Parent {
      @autobound
      getName() {
        return this.name;
      }
    }

    @autobound
    class AutoBound extends Parent {
      constructor(name) {
        super();
        this.name = name;
      }

      @autobound
      getNameTwo() {
        return this.name;
      }
    }
    this.AutoBound = AutoBound;
    callback();
  },

  testIsAutomaticallyBound: testIsAutomaticallyBound,
  testIgnoresRebinding: testIgnoresRebinding,

  testAutoboundMethodsInSubclass: function(test) {
    const instance = new this.AutoBound("name");
    const fn = instance.getNameTwo;
    const name = fn();
    test.equal(name, "name");
    test.done();
  }
};

exports.withNonAutoboundSubclasses = {
  setUp: function(callback) {
    class Parent {
      @autobound
      getName() {
        return this.name;
      }
    }

    class AutoBound extends Parent {
      constructor(name) {
        super();
        this.name = name;
      }

      getNameTwo() {
        return this.name;
      }
    }
    this.AutoBound = AutoBound;
    callback();
  },

  testIsAutomaticallyBound: testIsAutomaticallyBound,
  testIgnoresRebinding: testIgnoresRebinding,

  testNonAutoboundMethodsInSubclassCanBeRebound: function(test) {
    const instance = new this.AutoBound("name");
    const fn = instance.getNameTwo.bind({ name: "other" });
    const name = fn();
    test.equal(name, "other");
    test.done();
  }
};

function testIsAutomaticallyBound(test) {
  const instance = new this.AutoBound("name");
  const fn = instance.getName;
  const name = fn();
  test.equal(name, "name");
  test.done();
}

function testIgnoresRebinding(test) {
  const instance = new this.AutoBound("name");
  const fn = instance.getName.bind({ name: "other" });
  const name = fn();
  test.equal(name, "name");
  test.done();
}
