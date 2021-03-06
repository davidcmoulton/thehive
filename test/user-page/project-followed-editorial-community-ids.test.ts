import EditorialCommunityId from '../../src/types/editorial-community-id';
import { generate } from '../../src/types/event-id';
import userId from '../../src/types/user-id';
import createProjectFollowedEditorialCommunityIds, { GetAllEvents } from '../../src/user-page/project-followed-editorial-community-ids';

describe('project-followed-editorial-community-ids', () => {
  const getAllEvents: GetAllEvents = async () => [
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      id: generate(),
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someone'),
      editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    },
    {
      type: 'EditorialCommunityJoined',
      date: new Date(),
      editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    },
    {
      id: generate(),
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someoneelse'),
      editorialCommunityId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    },
    {
      id: generate(),
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: userId('someoneelse'),
      editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    },
  ];

  it('returns a list', async () => {
    const projectFollowedEditorialCommunityIds = createProjectFollowedEditorialCommunityIds(getAllEvents);

    const actual = await projectFollowedEditorialCommunityIds(userId('someone'));
    const expected = [
      new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
      new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
      new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    ];

    expect(actual).toStrictEqual(expected);
  });
});
