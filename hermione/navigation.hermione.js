const { routes, getUrl } = require('./test-paths.js');

describe('Navigation', () => {
  routes.valid.routes.forEach((route) => {
    const directoryName = route[route.length - 2];
    const { dirSelector } = routes.valid;

    it(`Displays directory content ${directoryName} on valid route`, function () {
      const directoryUrl = getUrl(route);

      return this.browser
        .url(directoryUrl)
        .hasElements(dirSelector);
    });
  });

  routes.valid.routes.forEach((route) => {
    const fileName = route[route.length - 1];
    const { fileSelector } = routes.valid;

    it(`Displays file ${fileName} on valid route`, function () {
      const fileUrl = getUrl(route, true);

      return this.browser
        .url(fileUrl)
        .hasClass(fileSelector, routes.valid.className);
    });
  });

  routes.invalid[404].routes.forEach((route, index) => {
    it(`Displays 404 message on invalid route - ${index}`, function () {
      const { selector, message } = routes.invalid[404];

      return this.browser
        .url(getUrl(route, true))
        .textContains(selector, message, true);
    });
  });

  routes.invalid[500].routes.forEach((route, index) => {
    it(`Displays 500 message on invalid route - ${index}`, function () {
      const { selector, message } = routes.invalid[500];

      return this.browser
        .url(getUrl(route, true))
        .textContains(selector, message, true);
    });
  });
});
