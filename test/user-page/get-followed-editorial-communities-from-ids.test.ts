import { URL } from 'url';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import userId from '../../src/types/user-id';
import createGetFollowedEditorialCommunitiesFromIds, { GetEditorialCommunity, GetFollowedEditorialCommunityIds } from '../../src/user-page/get-followed-editorial-communities-from-ids';

describe('get-followed-editorial-communities-from-ids adapter', () => {
  it('provides a list of communities', async () => {
    const getFollowedEditorialCommunityIds: GetFollowedEditorialCommunityIds = async () => [
      new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
      new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
      new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    ];
    const getEditorialCommunity: GetEditorialCommunity = async () => ({
      name: 'Name',
      avatar: new URL('http://example.com/avatar.png'),
    });
    const adapter = createGetFollowedEditorialCommunitiesFromIds(
      getFollowedEditorialCommunityIds,
      getEditorialCommunity,
    );
    const editorialCommunities = await adapter(userId('someone'));

    expect(editorialCommunities).toHaveLength(3);
  });
});
