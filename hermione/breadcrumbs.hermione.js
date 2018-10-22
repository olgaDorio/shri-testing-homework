const { getUrl, routes } = require('./test-paths.js');

const title = {
  file: 'content',
  directory: 'files',
  history: 'history',
};

const selector = {
  navigation: '.breadcrumbs',
  fileContent: '.file-content',
  content: '.content',
};

describe('Breadcrumbs', () => {
  const [hash, file] = routes.valid.routes[0];

  it('Navigate down', function () {
    const headerLinks = [];
    let buffer;

    return this.browser
      .url('/')

      // check content on /
      .titleEquals(title.history)
      .checkLinks(selector.navigation, headerLinks)
      .then(() => {
        buffer = 'history';
        headerLinks.push(buffer);
      })
      .then(() => this.browser.textContains(selector.navigation, buffer, true))
      .hasElements(selector.content)

      // check content on directory page
      .click(`a[href*="${hash}"]`)
      .titleEquals(title.directory)
      .checkLinks(selector.navigation, headerLinks)
      .then(() => {
        buffer = 'root';
        headerLinks.push(buffer);
      })
      .then(() => this.browser.textContains(selector.navigation, buffer, true))
      .hasElements(selector.content)
      .assertView('directory-plain', 'body')

      // check content on page with file
      .click(`a[href*="${file}"`)
      .urlContains(getUrl([hash, file], true))
      .titleEquals(title.file)
      .checkLinks(selector.navigation, headerLinks)
      .textContains(selector.navigation, file)
      .hasElements(selector.fileContent)
      .assertView('content-plain', 'body');
  });

  it('Navigate up', function () {
    const { rootLinks } = routes;
    const headerLinks = ['history', 'root'];
    let buffer;

    return this.browser
      .url(getUrl([hash, file], true))

      // check content on page with file
      .titleEquals(title.file)
      .checkLinks(selector.navigation, headerLinks)
      .textContains(selector.navigation, file)
      .hasElements(selector.fileContent)

      // check content on directory page
      .click(`a[href*="${hash}"]`)
      .then(() => { buffer = headerLinks.pop(); })
      .titleEquals(title.directory)
      .checkLinks(selector.navigation, headerLinks)
      .checkLinks(selector.content, rootLinks, '\n')
      .then(() => this.browser.textContains(selector.navigation, buffer, true))

      // check content on /
      .click('a[href=\'/\']')
      .then(() => { buffer = headerLinks.pop(); })
      .titleEquals(title.history)
      .checkLinks(selector.navigation, headerLinks)
      .then(() => this.browser.textContains(selector.navigation, buffer, true))
      .hasElements(selector.content);
  });
});
