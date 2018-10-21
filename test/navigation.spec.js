const { expect } = require('chai');
const { getExpectedBreadcrumbs } = require('./utils.js');
const {
  buildFileUrl, buildFolderUrl, buildObjectUrl, buildBreadcrumbs,
} = require('./../utils/navigation.js');

const folderPaths = [
  undefined, {}, [],
  'deeply/nested/directory',
  'one/more/deeply/nested/directory',
  'hermione-html-reporter/images/90a9343',
];

const hash = '0000';
const types = ['tree', 'blob', '', 'bla'];
const paths = ['', 'folder', 'deeply/nested', 'deeply/nested/folder'];

describe('buildObjectUrl', () => {
  types.forEach((type, index) => {
    it(`returns valid url - ${index}`, () => {
      const context = {
        buildFileUrl: () => 'fileUrl',
        buildFolderUrl: () => 'folderUrl',
      };

      const methods = {
        blob: 'buildFileUrl',
        tree: 'buildFolderUrl',
      };

      const method = methods[type] || '';
      const expected = method ? context[method]() : '#';
      const result = buildObjectUrl.call(context, '', { type });

      expect(result).to.equal(expected);
    });

    it('passes parentHash and path to nested functions', () => {
      let path;
      let parentHash;

      const context = {
        buildFileUrl: (a, b) => {
          path = b;
          parentHash = a;
        },
        buildFolderUrl: (a, b) => {
          path = b;
          parentHash = a;
        },
      };

      buildObjectUrl.call(context, '0000', { path: 'my/path', type });

      if (['tree', 'blob'].includes(type)) {
        expect(path).to.equal('my/path');
        expect(parentHash).to.equal('0000');
      } else {
        expect(path).to.equal(undefined);
        expect(parentHash).to.equal(undefined);
      }
    });
  });
});

describe('Breadcrumbs links', () => {
  it('Returns correct array when passing nothing', () => {
    expect(buildBreadcrumbs()).to.deep.equal(getExpectedBreadcrumbs());
  });

  paths.forEach((path, index) => {
    it(`Returns correct array when passing hash and path - ${index}`, () => {
      expect(buildBreadcrumbs(hash, path)).to.deep.equal(getExpectedBreadcrumbs(hash, path));
    });
  });
});

folderPaths.forEach((path, index) => {
  it(`Returns correct folder url - ${index}`, () => {
    const expectedFolderUrl = `/files/${hash}/${path || ''}`;
    const folderUrl = buildFolderUrl(hash, path);
    expect(folderUrl).to.equal(expectedFolderUrl);
  });
});

folderPaths.forEach((path, index) => {
  it(`Returns correct file url - ${index}`, () => {
    const expectedFile = `/content/${hash}/${path || ''}`;
    const fileUrl = buildFileUrl(hash, path);
    expect(fileUrl).to.equal(expectedFile);
  });
});

