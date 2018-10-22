const routes = {
  valid: {
    className: 'file-content',
    fileSelector: '.content div',
    dirSelector: '.content ul li',

    routes: [
      ['90180910fc27a11272a3e5caeeb119a51e5c0545', 'app.js'],
      ['cc2284293758e32c50fa952da2f487c8c5e8d023', 'controllers', 'contentController.js'],
    ],
  },

  invalid: {
    500: {
      message: '500 - Command failed',
      selector: '.container',

      routes: [
        [null, 'app.js'],
        [null, 'controllers', 'contentController.js'],
      ],
    },

    404: {
      message: '404 - Not found',
      selector: '.container',

      routes: [
        ['90180910fc27a11272a3e5caeeb119a51e5c0545', null],
        ['cc2284293758e32c50fa952da2f487c8c5e8d023', null, null],
        ['cc2284293758e32c50fa952da2f487c8c5e8d023', 'controllers', null],
        ['cc2284293758e32c50fa952da2f487c8c5e8d023', null, 'contentController.js'],
      ],
    },
  },

  rootLinks: [
    '.gitignore', 'README.md', 'app.js', 'bin', 'controllers',
    'package-lock.json', 'package.json', 'public', 'utils', 'views',
  ],
};

const getUrl = (route, full) => {
  let url = full ? '/content' : '/files';
  route.slice(0, route.length - (full ? 0 : 1)).forEach((path) => {
    url += `/${path}`;
  });
  if (!full) url += '/';
  return url;
};

module.exports = {
  routes,
  getUrl,
};
