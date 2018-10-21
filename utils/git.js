const { resolve } = require('path');
const REPO = resolve('.');

const { execFile } = require('child_process');

function executeGit(cmd, args) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { cwd: REPO }, (err, stdout) => {
      if (err) {
        reject(err);
      }

      resolve(stdout.toString());
    });
  });
}

function parseHistoryItem(line) {
  const [hash, author, timestamp, msg] = line.split('\t');

  return {
    hash,
    author,
    timestamp,
    msg
  };
}

function gitHistory(page = 1, size = 10) {
  this.page = page > 0 ? page : 1;
  this.size = size > 0 ? size : 10;
  this.offset = (this.page - 1) * this.size;
  this.executeGit = this.executeGit || executeGit;

  return this.executeGit('git', [
    'log',
    '--pretty=format:%H%x09%an%x09%ad%x09%s',
    '--date=iso',
    '--skip',
    this.offset,
    '-n',
    this.size
  ]).then(data => {
    return data
      .split('\n')
      .filter(Boolean)
      .map(parseHistoryItem);
  }).catch(console.log);
}

function parseFileTreeItem(line) {
  const [info, path] = line.split('\t');
  const [, type, hash] = info.split(' ');
  return { type, hash, path };
}

function gitFileTree(hash, path) {
  this.params = ['ls-tree', hash];
  path && this.params.push(path);

  this.executeGit = this.executeGit || executeGit;

  return this.executeGit('git', this.params).then(data => {
    return data
      .split('\n')
      .filter(Boolean)
      .map(parseFileTreeItem);
  });
}

function gitFileContent(hash) {
  this.executeGit = this.executeGit || executeGit;
  return this.executeGit('git', ['show', hash]);
}

module.exports = {
  gitHistory,
  gitFileTree,
  gitFileContent,
};
