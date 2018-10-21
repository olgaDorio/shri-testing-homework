const { gitFileTree } = require('../utils/git');
const { buildObjectUrl, buildBreadcrumbs } = require('../utils/navigation');

module.exports = function(req, res, next) {
  const { hash } = req.params;
  const pathParam = (req.params[0] || '').split('/').filter(Boolean);
  const path = pathParam.length ? pathParam.join('/') + '/' : '';

  this.gitFileTree = this.gitFileTree || gitFileTree;
  this.buildObjectUrl = this.buildObjectUrl || buildObjectUrl;
  this.buildBreadcrumbs = this.buildBreadcrumbs || buildBreadcrumbs;

  return this.gitFileTree(hash, path).then(
    list => {
      const files = list.map(item => ({
        ...item,
        name: item.path.split('/').pop(),
        href: this.buildObjectUrl(hash, item),
      }));

      res.render('files', {
        files,
        title: 'files',
        breadcrumbs: this.buildBreadcrumbs(hash, pathParam.join('/')),
      });
    },
    err => next(err)
  );
};
