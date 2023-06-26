/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */

function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  Rectangle.prototype.getArea = function get() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

/* eslint max-classes-per-file: "off" */
const ERR_DOUBLE = 'Element, id and pseudo-element should not occur more then one time inside the selector';
const ERR_ORDER = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';

class CssSelector {
  constructor(
    {
      element, id, className, attr, pseudoClass, pseudoElement,
    },
  ) {
    this.Xelement = null;
    this.Xid = null;
    this.Xclasses = [];
    this.Xattrs = [];
    this.XpseudoClasses = [];
    this.XpseudoElement = null;

    if (element) this.Xelement = element;
    if (id) this.Xid = id;
    if (className) this.Xclasses.push(className);
    if (attr) this.Xattrs.push(attr);
    if (pseudoClass) this.XpseudoClasses.push(pseudoClass);
    if (pseudoElement) this.XpseudoElement = pseudoElement;
  }

  element(val) {
    if (this.Xelement) throw new Error(ERR_DOUBLE);
    if (this.Xid || this.Xclasses.length || this.Xattrs.length
        || this.XpseudoClasses.length || this.XpseudoElement) throw new Error(ERR_ORDER);
    this.Xelement = val;
    return this;
  }

  id(val) {
    if (this.Xid) throw new Error(ERR_DOUBLE);
    if (this.Xclasses.length || this.Xattrs.length
        || this.XpseudoClasses.length || this.XpseudoElement) throw new Error(ERR_ORDER);
    this.Xid = val;
    return this;
  }

  class(val) {
    if (this.Xattrs.length || this.XpseudoClasses.length
      || this.XpseudoElement) throw new Error(ERR_ORDER);
    this.Xclasses.push(val);
    return this;
  }

  attr(val) {
    if (this.XpseudoClasses.length || this.XpseudoElement) throw new Error(ERR_ORDER);
    this.Xattrs.push(val);
    return this;
  }

  pseudoClass(val) {
    if (this.XpseudoElement) throw new Error(ERR_ORDER);
    this.XpseudoClasses.push(val);
    return this;
  }

  pseudoElement(val) {
    if (this.XpseudoElement) throw new Error(ERR_DOUBLE);
    this.XpseudoElement = val;
    return this;
  }

  stringify() {
    const result = [];
    if (this.Xelement) result.push(this.Xelement);
    if (this.Xid) result.push(`#${this.Xid}`);
    if (this.Xclasses.length) result.push(this.Xclasses.map((v) => `.${v}`));
    if (this.Xattrs.length) result.push(this.Xattrs.map((v) => `[${v}]`));
    if (this.XpseudoClasses.length) result.push(this.XpseudoClasses.map((v) => `:${v}`));
    if (this.XpseudoElement) result.push(`::${this.XpseudoElement}`);

    return result.flat().join('');
  }
}

class CssCombinator {
  constructor(selector1, combinator, selector2) {
    this.selector1 = selector1;
    this.combinator = combinator;
    this.selector2 = selector2;
  }

  stringify() {
    return `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector({ element: value });
  },

  id(value) {
    return new CssSelector({ id: value });
  },

  class(value) {
    return new CssSelector({ className: value });
  },

  attr(value) {
    return new CssSelector({ attr: value });
  },

  pseudoClass(value) {
    return new CssSelector({ pseudoClass: value });
  },

  pseudoElement(value) {
    return new CssSelector({ pseudoElement: value });
  },

  combine(selector1, combinator, selector2) {
    return new CssCombinator(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
