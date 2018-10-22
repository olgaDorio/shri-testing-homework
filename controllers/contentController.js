const { gitFileContent, gitFileTree } = require('../utils/git');
const { buildBreadcrumbs } = require('../utils/navigation');

module.exports = function(req, res, next) {
  const { hash } = req.params;
  const path = (req.params[0] || '').split('/').filter(Boolean);

  this.gitFileTree = this.gitFileTree || gitFileTree;
  this.gitFileContent = this.gitFileContent || gitFileContent;
  this.buildBreadcrumbs = this.buildBreadcrumbs || buildBreadcrumbs;

  this.gitFileTree(hash, path.join('/'))
    .then(([file]) => {
      if (!file || file.type !== 'blob') {
        next();
        return;
      }
      return this.gitFileContent(file.hash);
    })
    .then(
      content => {
        if (content) {
          res.render('content', {
            content,
            title: 'content',
            breadcrumbs: this.buildBreadcrumbs(hash, path.join('/')),
          });
        }
      },
      err => next(err)
    );
};
