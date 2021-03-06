import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents): Follows => (
  async (userId, editorialCommunityId) => {
    const result = new Set<string>();

    (await getAllEvents()).forEach((event) => {
      if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
        result.add(event.editorialCommunityId.value);
      } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
        result.delete(event.editorialCommunityId.value);
      }
    });

    return Array.from(result).some((item) => item === editorialCommunityId.value);
  }
);
