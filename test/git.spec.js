const { expect } = require('chai');
const { generateFileTree, generateHistory } = require('./utils.js');
const { gitHistory, gitFileTree, gitFileContent } = require('./../utils/git.js');

const hash = '0000';
const outputs = ['', generateHistory(20), generateHistory(20, true)];
const pages = [-2, -1, 0, 1, 2];
const sizes = pages.map(p => p * 10);

describe('gitHistory', () => {
  outputs.forEach((history, index) => {
    let result;
    const executeGit = async () => history;

    it(`Returns valid array - ${index}`, async () => {
      await gitHistory.call({ executeGit }).then((a) => { result = a; });

      const expectedLength = history ? history.split('\n').length : 0;
      expect(result.length).to.equal(expectedLength);

      if (expectedLength) {
        const [expHash, author, timestamp, msg] = history.split(/\s/);
        expect(result[0]).to.deep.equal({
          msg, author, timestamp, hash: expHash,
        });
      }
    });
  });

  pages.forEach((p) => {
    sizes.forEach((s) => {
      it(`properly calculates offset and size (${p}, ${s})`, async () => {
        const expPage = p > 0 ? p : 1;
        const expSize = s > 0 ? s : 10;
        const expOffset = (expPage - 1) * expSize;

        let receivedCmd;
        let receivedArgs;

        const executeGit = async (cmd, args) => {
          receivedCmd = cmd;
          receivedArgs = args;
          return '';
        };

        await gitHistory.call({ executeGit }, p, s);

        expect(receivedCmd).to.equal('git');
        expect(receivedArgs).to.deep.equal([
          'log',
          '--pretty=format:%H%x09%an%x09%ad%x09%s',
          '--date=iso',
          '--skip',
          expOffset,
          '-n',
          expSize,
        ]);
      });
    });
  });
});

describe('getFileTree', () => {
  const trees = ['', generateFileTree(20), generateFileTree(20, true)];

  trees.forEach((tree, index) => {
    let result;
    const executeGit = async () => tree;

    it(`Returns valid array - ${index}`, async () => {
      await gitFileTree.call({ executeGit }).then((r) => { result = r; });

      const expectedLength = tree ? tree.split('\n').length : 0;
      expect(result.length).to.equal(expectedLength);

      if (expectedLength) {
        const [, type, expHash, path] = tree.split(/\s/);
        expect(result[0]).to.deep.equal({ type, path, hash: expHash });
      }
    });
  });

  [undefined, null, '', 'path/to/file'].forEach((path) => {
    it('properly calculates params', async () => {
      let receivedCmd;
      let receivedParams;

      const executeGit = async (cmd, params) => {
        receivedCmd = cmd;
        receivedParams = params;
        return '';
      };

      await gitFileTree.call({ executeGit }, hash, path);

      expect(receivedCmd).to.equal('git');
      expect(receivedParams).to.deep.equal(['ls-tree', hash, path].filter(Boolean));
    });
  });
});

describe('gitFileContent', () => {
  it('passes proper params to executeGit function', async () => {
    let receivedCmd;
    let receivedParams;

    const executeGit = async (cmd, params) => {
      receivedCmd = cmd;
      receivedParams = params;
    };

    await gitFileContent.call({ executeGit }, hash);

    expect(receivedCmd).to.equal('git');
    expect(receivedParams).to.deep.equal(['show', hash]);
  });
});
