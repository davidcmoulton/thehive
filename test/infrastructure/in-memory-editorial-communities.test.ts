import createEditorialCommunities from '../../src/infrastructure/in-memory-editorial-communities';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import dummyLogger from '../dummy-logger';

const editorialCommunityId = '530812a5-838a-4fb2-95b6-eb4828f0d37c';

describe('in-memory-editorial-communities', () => {
  let repository: EditorialCommunityRepository;

  beforeEach(async () => {
    repository = createEditorialCommunities(dummyLogger);
    await repository.add({
      id: editorialCommunityId,
      name: 'My pals',
      logo: 'https://example.com/images/1',
      description: 'We do cool stuff',
    });
  });

  describe('lookup', () => {
    it('returns nothing when the editorial community does not exist', async () => {
      expect((await repository.lookup('no-such-thing')).isNothing()).toBe(true);
    });

    it('returns the editorial community when it does exist', async () => {
      const actual = await repository.lookup(editorialCommunityId);

      expect(actual.isNothing()).toBe(false);
    });
  });
});