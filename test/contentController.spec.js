const { expect } = require('chai');
const contentController = require('./../controllers/contentController.js');
const { getPath } = require('./utils.js');

const params = {
  hash: '0000',
};

const gitFileContentResponse = 'some content';

const gitFileTreeResponse = [{
  type: 'blob',
  hash: '02fe732137bea2adfb6f650bce92aa0be2f5cd9d',
  path: 'controllers/filesController.js',
}];

const paths = ['', 'bla/bla', '////////path/////to/file///////'];

describe('contentController.js', () => {
  [[], [{ type: '!blob' }]].forEach((array) => {
    it('Calls next() when receives empty or invalid file', async () => {
      let nextWasCalled = false;

      const req = { params };
      const context = { gitFileTree: async () => array };
      const next = () => { nextWasCalled = true; };

      await contentController.call(context, req, null, next);
      expect(nextWasCalled).to.equal(true);
    });
  });

  paths.forEach((rpath) => {
    const req = { params: { ...params, 0: rpath } };
    const next = () => {};
    const res = {
      render: () => { },
    };

    it('Passes valid params to gitFileTree function', () => {
      let hash;
      let path;

      const context = { gitFileTree: async (h, p) => { hash = h; path = p; } };
      contentController.call(context, req, null, next);
      expect(path).to.equal(getPath.without(rpath));
      expect(hash).to.equal(req.params.hash);
    });

    it('Passes valid params to buildBreadcrumbs function', () => new Promise((resolve, reject) => {
      const context = {
        buildBreadcrumbs: (hash, path) => {
          try {
            expect(hash).to.equal(req.params.hash);
            expect(path).to.equal(getPath.without(rpath));
            resolve();
          } catch (err) {
            reject(err);
          }
          return 'buildBreadcrumbs';
        },
        gitFileTree: async () => gitFileTreeResponse,
        gitFileContent: async () => gitFileContentResponse,
      };

      contentController.call(context, req, res, next);
    }));
  });

  it('calls gitFileContent with valid parameter', async () => {
    let hash;

    const context = {
      gitFileTree: async () => gitFileTreeResponse,
      gitFileContent: (h) => { hash = h; },
    };

    const req = { params };
    const next = () => {};
    const res = { render: () => {} };

    await contentController.call(context, req, res, next);

    expect(hash).to.equal(gitFileTreeResponse[0].hash);
  });

  it('calls res.render with valid parameters', () => new Promise((resolve, reject) => {
    const context = {
      buildBreadcrumbs: () => 'buildBreadcrumbs',
      gitFileTree: async () => gitFileTreeResponse,
      gitFileContent: async () => gitFileContentResponse,
    };

    const req = { params };
    const next = () => {};

    const res = {
      render: (view, { content, title, breadcrumbs }) => {
        try {
          expect(view).to.equal('content');
          expect(title).to.equal('content');
          expect(content).to.equal(gitFileContentResponse);
          expect(breadcrumbs).to.equal(context.buildBreadcrumbs());
          resolve();
        } catch (err) {
          reject(err);
        }
      },
    };

    contentController.call(context, req, res, next);
  }));
});
