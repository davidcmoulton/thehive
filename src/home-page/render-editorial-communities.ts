import { Maybe } from 'true-myth';
import { RenderFollowToggle } from './render-follow-toggle';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type RenderEditorialCommunities = (userId: Maybe<UserId>) => Promise<string>;

export type GetAllEditorialCommunities = () => Promise<Array<{
  id: EditorialCommunityId;
  name: string;
}>>;

export default (
  editorialCommunities: GetAllEditorialCommunities,
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunities => async (userId) => {
  const editorialCommunityLinks = await Promise.all((await editorialCommunities())
    .map(async (editorialCommunity) => (`
        <a href="/editorial-communities/${editorialCommunity.id.value}" class="editorial-community">
          <img src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="" class="editorial-community__avatar">
          <div class="editorial-community__name">
            ${editorialCommunity.name}
          </div>
<!--        <div class="editorial-community__featured_event">-->
<!--          <div><b>reviewed</b></div>-->
<!--          <div>A statistical framework for assessing pharmacological response and biomarkers using uncertainty estimates</div>-->
<!--        </div>-->
        <object class="editorial-community__toggle_wrapper">${await renderFollowToggle(userId, editorialCommunity.id)}</object>
      </a>
    `)));

  return `
      <section>
        <h2 class="editorial-community-list-heading">
          Editorial communities
        </h2>
        <ol class="editorial-community-list" role="list">
          ${templateListItems(editorialCommunityLinks, 'home-page-community-list__item')}
        </ol>
      </section>
    `;
};
