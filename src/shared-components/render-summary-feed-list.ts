import { Maybe } from 'true-myth';
import templateListItems from './list-items';

export type RenderSummaryFeedList<T> = (events: ReadonlyArray<T>) => Promise<Maybe<string>>;

type RenderSummaryFeedItem<T> = (event: T) => Promise<string>;

export default <T>(
  renderSummaryFeedItem: RenderSummaryFeedItem<T>,
): RenderSummaryFeedList<T> => async (events) => {
  if (events.length === 0) {
    return Maybe.nothing();
  }
  const items = await Promise.all(events.map(renderSummaryFeedItem));
  return Maybe.just(`
    <ol class="summary-feed-list" role="list">
      ${templateListItems(items, 'summary-feed-list__list_item')}
    </ol>
  `);
};
