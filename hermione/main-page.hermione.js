const title = 'History';

describe('Main page', () => {
  it('Displays correct title', function () {
    return this.browser
      .url('/')
      .textEquals('.breadcrumbs', title, true);
  });

  it('Has links to commits', function () {
    return this.browser
      .url('/')
      .hasElements('.commit a');
  });
});
