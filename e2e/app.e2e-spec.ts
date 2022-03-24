import { GMISTemplatePage } from './app.po';

describe('GMIS App', function() {
  let page: GMISTemplatePage;

  beforeEach(() => {
    page = new GMISTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
