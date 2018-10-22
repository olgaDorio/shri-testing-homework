const { expect } = require('chai');
const { generateHistoryArray } = require('./utils.js');
const indexController = require('./../controllers/indexController.js');

describe('Index controller', () => {
  it('Passes valid page and size to gitHistory', async () => {
    let page;
    let size;

    const gitHistory = async (p, s) => {
      page = p;
      size = s;
      return generateHistoryArray(20);
    };

    const res = {
      render: () => {},
    };

    await indexController.call({ gitHistory }, {}, res);

    expect(page).to.equal(1);
    expect(size).to.equal(20);
  });

  it('Passes two parameters to res.render', async () => {
    let view;
    let locals;

    const res = { render: (v, l) => { view = v; locals = l; } };
    const gitHistory = async () => generateHistoryArray(20);

    await indexController.call({ gitHistory }, {}, res);

    expect(view).to.be.a('string');
    expect(locals).to.be.an('object');
  });

  it('Passes valid view name to res.render', async () => {
    let view;

    const res = { render: (v) => { view = v; } };
    const gitHistory = async () => generateHistoryArray(20);

    await indexController.call({ gitHistory }, {}, res);

    expect(view).to.equal('index');
  });

  it('Passes valid locales to res.render', async () => {
    let list;
    let title;
    let breadcrumbs;

    const buildFolderUrl = hash => (`${hash}/folder/url`);
    const buildBreadcrumbs = () => ('breadcrumbs');
    const gitHistory = async () => generateHistoryArray(20);
    const res = {
      render: (v, locals) => {
        ({ list, title, breadcrumbs } = locals);
      },
    };

    await indexController.call({
      gitHistory,
      buildFolderUrl,
      buildBreadcrumbs,
    }, {}, res);

    expect(title).to.equal('history');
    expect(breadcrumbs).to.equal(buildBreadcrumbs());
    expect(list).to.be.an('array').to.have.lengthOf(20);

    expect(list[0]).to.be.an('object');
    expect(list[0].href).to.equal(buildFolderUrl(list[0].hash));
    expect(list[0]).to.have.all.keys('hash', 'author', 'timestamp', 'msg', 'href');
  });
});
