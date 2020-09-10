import { Maybe } from 'true-myth';
import { FeedEvent, RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: Maybe<UserId>) => Promise<string>;

export type GetEvents = (userId: UserId) => Promise<ReadonlyArray<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

const loginInvitationMessage = `
  <p class="log-in-invitation">
    Log in to see your feed here or start building a new one by following some communities!
    <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" width="100%">
  </p>
`;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async (userId) => (
    userId.mapOr(
      Promise.resolve(loginInvitationMessage),
      async (u) => (
        getEvents(u)
          .then(async (es) => Promise.all(es.map(renderFeedItem)))
          .then(async (feedItems) => `
            <ol class="ui large feed" role="list">
              ${templateListItems(feedItems, 'event')}
            </ol>
          `)
      ),
    ).then((contents) => `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        ${contents}
      </section>
    `)
  )
);
