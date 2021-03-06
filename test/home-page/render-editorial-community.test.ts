import { URL } from 'url';
import { Maybe } from 'true-myth';
import createRenderEditorialCommunity from '../../src/home-page/render-editorial-community';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-editorial-community', (): void => {
  it('renders the name of the community', async (): Promise<void> => {
    const community = {
      id: new EditorialCommunityId('A'),
      name: 'Editorial Community A',
      avatar: new URL('http://example.com'),
    };
    const renderEditorialCommunity = createRenderEditorialCommunity(
      async () => '',
    );
    const rendered = await renderEditorialCommunity(Maybe.nothing(), community);

    expect(rendered).toContain('Editorial Community A');
  });

  it.todo('displays a follow toggle');
});
