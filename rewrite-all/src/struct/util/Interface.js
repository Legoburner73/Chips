'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const ensureAbstract = require('../../deps/functions/ensureAbstractF').default();

const Interface = class Interface {
  constructor() {
    ensureAbstract(this, Interface);
    this.constructor.isImplemented(this);
  }

  static isImplemented(object) {
    for (const k in object.funcs) {
      if (typeof object.constructor.prototype[k] === 'function' && !object[k]) {
        throw new Error(`Missing interface function ${k}`);
      }
    }
    return object;
  }
};

exports.Interface = Interface;
