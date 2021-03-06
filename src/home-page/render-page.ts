import { Maybe } from 'true-myth';
import { UserId } from '../types/user-id';

type RenderPage = (userId: Maybe<UserId>) => Promise<string>;

type Component = (userId: Maybe<UserId>) => Promise<string>;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderSearchForm: Component,
  renderFeed: Component,
): RenderPage => async (userId) => `
      <div class="hive-grid hive-grid--home u-full-width">
        ${await renderPageHeader(userId)}

        <div class="home-page-feed-container">
          ${await renderFeed(userId)}
        </div>

        <div class="home-page-side-bar">
          ${await renderSearchForm(userId)}
          ${await renderEditorialCommunities(userId)}
        </div>

      </div>
    `;
