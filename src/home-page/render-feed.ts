import { Maybe } from 'true-myth';
import { FeedEvent, RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import { UserId } from '../types/user-id';

type RenderFeed = (userId: Maybe<UserId>) => Promise<string>;

export type GetEvents = (userId: UserId) => Promise<ReadonlyArray<FeedEvent>>;

export { FeedEvent } from './render-feed-item';

const loginInvitationMessage = async (): Promise<string> => Promise.resolve(`
  <p class="log-in-invitation">
    Log in to see your feed here or start building a new one by following some communities!
    <img src="/static/images/feed-screenshot.png" alt="Screenshot of a feed" width="100%">
  </p>
`);

const createFeed = (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
) => (
  async (userId: UserId) => (
    getEvents(userId)
      .then(async (es) => Promise.all(es.map(renderFeedItem)))
      .then(async (feedItems) => `
        <ol class="ui large feed" role="list">
          ${templateListItems(feedItems, 'event')}
        </ol>
      `)
  )
);

const formatAsSection = (contents: string): string => `
  <section>
    <h2 class="ui header">
      Feed
    </h2>
    ${contents}
  </section>
`;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => {
  const feed = createFeed(getEvents, renderFeedItem);
  return async (userId) => (
    userId
      .mapOrElse(loginInvitationMessage, feed)
      .then(formatAsSection)
  );
};
