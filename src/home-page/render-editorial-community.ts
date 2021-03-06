import { URL } from 'url';
import { Maybe } from 'true-myth';
import { RenderFollowToggle } from './render-follow-toggle';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type Community = {
  avatar: URL;
  id: EditorialCommunityId;
  name: string;
};

export type RenderEditorialCommunity = (userId: Maybe<UserId>, community: Community) => Promise<string>;

export default (
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunity => async (userId, community) => `
  <div class="editorial-community">
    <a href="/editorial-communities/${community.id.value}" class="editorial-community__link">
      <img src="${community.avatar.toString()}" alt="" class="editorial-community__avatar">
      <div class="editorial-community__name">
        ${community.name}
      </div>
    </a>
    <div class="editorial-community__toggle_wrapper">
      ${await renderFollowToggle(userId, community.id, community.name)}
    </div>
  </div>
`;
