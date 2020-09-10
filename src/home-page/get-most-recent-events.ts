import { FeedEvent, GetEvents } from './render-feed';
import {
  DomainEvent,
  isEditorialCommunityEndorsedArticleEvent,
  isEditorialCommunityJoinedEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;
export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

export default (
  getAllEvents: GetAllEvents,
  follows: Follows,
  maxCount: number,
): GetEvents => (
  async (userId) => {
    const isFollowedEvent = async (event: DomainEvent): Promise<boolean> => {
      if (isEditorialCommunityJoinedEvent(event)) {
        return true;
      }

      const userFollows = follows(userId, event.editorialCommunityId);
      return (isEditorialCommunityEndorsedArticleEvent(event) && userFollows)
        || (isEditorialCommunityReviewedArticleEvent(event) && userFollows);
    };

    const allEvents = (await getAllEvents())
      .slice()
      .reverse();
    const filtering = await Promise.all(allEvents.map(isFollowedEvent));
    return allEvents.filter((event, i): event is FeedEvent => filtering[i])
      .slice(0, maxCount);
  }
);
