const { expect } = require('chai');
const assert = require('assert');

module.exports = (hermione) => {
  hermione.on(hermione.events.NEW_BROWSER, (browser) => {
    browser.addCommand('textEquals', (selector, expectedString, ignoreCase) => browser
      .getText(selector)
      .then((foundString) => {
        const a = ignoreCase ? foundString.toLowerCase() : foundString;
        const b = ignoreCase ? expectedString.toLowerCase() : expectedString;
        assert.equal(a, b);
      }));

    browser.addCommand('textContains', (selector, expectedString, ignoreCase) => browser
      .getText(selector)
      .then((foundString) => {
        const a = ignoreCase ? foundString.toLowerCase() : foundString;
        const b = ignoreCase ? expectedString.toLowerCase() : expectedString;
        expect(a).to.contain(b);
      }));

    browser.addCommand('hasElements', (selector, amount = 1) => browser
      .elements(selector)
      .then(({ value }) => {
        expect(value.length).to.be.at.least(amount);
      }));

    browser.addCommand('hasClass', (selector, className) => browser
      .getAttribute(selector, 'class')
      .then((value) => {
        assert.equal(value, className);
      }));

    browser.addCommand('titleEquals', expectedTitle => browser
      .getTitle()
      .then((title) => {
        assert.equal(title, expectedTitle);
      }));

    browser.addCommand('urlContains', expectedUrl => browser
      .getUrl()
      .then((url) => {
        expect(url).to.contains(expectedUrl);
      }));

    browser.addCommand('checkLinks', (selector, links, separator = ' / ') => browser
      .elements(`${selector} a`)
      .then(({ value }) => {
        assert.equal(value.length, links.length);
      })
      .textContains(selector, links.join(separator), true));
  });
};
