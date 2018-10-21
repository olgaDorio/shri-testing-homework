const { expect } = require('chai');
const filesController = require('./../controllers/filesController.js');
const { generateFileTreeArray, getPath } = require('./utils.js');

const gitFileTreeResponse = generateFileTreeArray(5);

const paths = [null, 'directory', 'deeply/nested/directory', '//deeply/nested//directory///'];

const reqParams = paths.map((path) => {
  const object = { hash: '0000' };
  if (path) object[0] = path;
  return object;
});

describe('filesController', () => {
  reqParams.forEach((params) => {
    const req = { params };
    const res = { render: () => {} };

    it('Passes valid hash and path to gitFileTree', () => {
      let hash;
      let path;

      const gitFileTree = async (h, p) => {
        hash = h;
        path = p;
        return [];
      };

      filesController.call({ gitFileTree }, req, res);

      expect(hash).to.equal(params.hash);
      expect(path).to.equal(getPath.with(params[0]));
    });

    it('Calls buildBreadcrumbs function with valid parameters', async () => {
      let hash;
      let path;

      const gitFileTree = async () => ([]);

      const buildBreadcrumbs = (h, p) => {
        hash = h;
        path = p;
        return [];
      };

      await filesController.call({ gitFileTree, buildBreadcrumbs }, req, res);

      expect(hash).to.equal(params.hash);
      expect(path).to.equal(getPath.without(params[0]).replace(/\/$/, ''));
    });
  });

  it('Passes valid view parameter to res.render function', async () => {
    let view;
    const gitFileTree = async () => ([]);

    const req = { params: reqParams[0] };
    const res = {
      render: (v) => {
        view = v;
      },
    };

    await filesController.call({ gitFileTree }, req, res);
    expect(view).to.equal('files');
  });

  it('Passes locales parameter with valid properties to res.render function', async () => {
    let locales;
    const gitFileTree = async () => ([]);

    const req = { params: reqParams[0] };
    const res = {
      render: (v, l) => {
        locales = l;
      },
    };

    await filesController.call({ gitFileTree }, req, res);
    expect(locales).to.have.all.keys('files', 'title', 'breadcrumbs');
  });

  it('Calls buildBreadcrumbs function', async () => {
    let breadcrumbs;

    const gitFileTree = async () => ([]);
    const buildBreadcrumbs = () => ('breadcrumbs fake response');
    const req = { params: reqParams[0] };
    const res = {
      render: (v, l) => {
        ({ breadcrumbs } = l);
      },
    };

    await filesController.call({ gitFileTree, buildBreadcrumbs }, req, res);

    expect(breadcrumbs).to.equal(buildBreadcrumbs());
  });

  it('passes valid files array to res.render function', async () => {
    const context = {
      buildBreadcrumbs: () => '',
      buildObjectUrl: () => 'buildObjectUrl',
      gitFileTree: async () => gitFileTreeResponse,
    };

    let files;

    const req = { params: reqParams[0] };
    const res = {
      render: (a, b) => {
        ({ files } = b);
      },
    };

    await filesController.call(context, req, res);

    const expected = gitFileTreeResponse.map(i => ({
      ...i,
      href: context.buildObjectUrl(),
      name: i.path.split('/').pop(),
    }));

    expect(files).to.deep.equal(expected);
  });

  it('when mapping, calls buildObjectUrl with valid params', async () => {
    const args = [];

    const context = {
      buildBreadcrumbs: () => '',
      buildObjectUrl: (hash, item) => {
        args.push({ hash, item });
        return 'buildObjectUrl';
      },
      gitFileTree: async () => gitFileTreeResponse,
    };

    const req = { params: reqParams[0] };

    const res = {
      render: () => {},
    };

    await filesController.call(context, req, res);
    expect(gitFileTreeResponse.map(item => ({ item, hash: req.params.hash }))).to.deep.equal(args);
  });
});

