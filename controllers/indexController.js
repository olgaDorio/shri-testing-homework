const { gitHistory } = require('../utils/git');
const { buildFolderUrl, buildBreadcrumbs } = require('../utils/navigation');

module.exports = function(req, res) {
  this.gitHistory = this.gitHistory || gitHistory;
  this.buildFolderUrl = this.buildFolderUrl || buildFolderUrl;
  this.buildBreadcrumbs = this.buildBreadcrumbs || buildBreadcrumbs;

  this.gitHistory(1, 20).then(
    history => {

      const list = history.map(item => ({
        ...item,
        href: this.buildFolderUrl(item.hash, '')
      }));

      res.render('index', {
        list,
        title: 'history',
        breadcrumbs: this.buildBreadcrumbs(),
      });
    },
    err => next(err)
  );
};
