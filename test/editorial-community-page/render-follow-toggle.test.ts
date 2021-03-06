import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import createRenderFollowToggle, { Follows } from '../../src/editorial-community-page/render-follow-toggle';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import toUserId from '../../src/types/user-id';

describe('render-follow-toggle', () => {
  describe('the user is logged in', () => {
    describe('when the community is currently followed', () => {
      it('shows an unfollow button', async () => {
        const userId = toUserId('u1');
        const editorialCommunityId = new EditorialCommunityId('');

        const follows: Follows = async () => true;
        const renderFollowToggle = createRenderFollowToggle(follows);

        const rendered = JSDOM.fragment(
          await renderFollowToggle(Maybe.just(userId), editorialCommunityId),
        );

        const button = rendered.querySelector('button');
        const buttonText = button?.textContent;

        expect(buttonText).toBe('Unfollow');
      });
    });

    describe('when the community is not currently followed', () => {
      it('shows a follow button', async () => {
        const userId = toUserId('u1');
        const editorialCommunityId = new EditorialCommunityId('');

        const follows: Follows = async () => false;
        const renderFollowToggle = createRenderFollowToggle(follows);

        const rendered = JSDOM.fragment(await renderFollowToggle(Maybe.just(userId), editorialCommunityId));

        const button = rendered.querySelector('button');
        const buttonText = button?.textContent;

        expect(buttonText).toBe('Follow');
      });
    });
  });

  describe('the user is not logged in', () => {
    it('shows a follow button', async () => {
      const editorialCommunityId = new EditorialCommunityId('');

      const follows: Follows = async () => false;
      const renderFollowToggle = createRenderFollowToggle(follows);

      const rendered = JSDOM.fragment(await renderFollowToggle(Maybe.nothing(), editorialCommunityId));

      const button = rendered.querySelector('button');
      const buttonText = button?.textContent;

      expect(buttonText).toBe('Follow');
    });
  });
});
