const generateHistory = (length = 1, full) => Array.from({ length }, () => {
  const hash = '0000';
  const author = 'author';
  const message = 'message';
  const time = new Date().toLocaleDateString();

  return `${full ? hash : ''}\t${author}\t${full ? time : ''}\t${message}`;
}).join('\n');

const generateFileTree = (length = 1, full) => Array.from({ length }, () => {
  const mode = '0000';
  const type = 'blob';
  const object = '1111';
  const file = '.filename';

  return `${full ? mode : ''} ${type} ${full ? object : ''}\t${file}`;
}).join('\n');

// TODO: rename to Array
const generateHistoryArray = length => Array.from({ length }, () => ({
  hash: '091a8c3099bf60a80a98c4f9d71dfbc53f4a97a0',
  author: 'olgaDorio',
  timestamp: '2018-10-17 15:44:41 +0300',
  msg: 'add eslint',
}));

// TODO: rename to Array
const generateFileTreeArray = length => Array.from({ length }, () => ({
  type: 'blob',
  hash: 'c9d18582f6c7fb78fb2c611bcd6c0d5f87304072',
  path: 'controllers/contentController.js',
}));

const getPath = {
  with: (path = '') => path.replace(/^\/+/, '')
    .replace(/.$/, m => `${m}/`)
    .replace(/\/+/g, '/'),

  without: (path = '') => path.replace(/^\/+/, '')
    .replace(/.$/, m => `${m}/`)
    .replace(/\/+/g, '/')
    .replace(/\/$/, ''),
};

const getExpectedBreadcrumbs = (shash, spath = '') => {
  const array = [];
  const path = spath.split('/');

  array.push({ href: shash ? '/' : undefined, text: 'HISTORY' });
  if (shash) array.push({ href: spath.length ? `/files/${shash}/` : undefined, text: 'ROOT' });

  path.forEach((text, index, { length }) => {
    if (!text) return;
    const object = { text };
    if (index < length - 1) object.href = `/files/${shash}/${path.slice(0, index + 1).join('/')}/`;
    array.push(object);
  });

  return array;
};

module.exports = {
  getPath,
  generateHistory,
  generateFileTree,
  generateHistoryArray,
  generateFileTreeArray,
  getExpectedBreadcrumbs,
};
