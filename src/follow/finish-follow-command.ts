import { Middleware, ParameterizedContext } from 'koa';
import createFollowCommand, { CommitEvents, GetFollowList } from './follow-command';
import EditorialCommunityId from '../types/editorial-community-id';

interface Ports {
  commitEvents: CommitEvents;
  getFollowList: GetFollowList;
}

export default (ports: Ports): Middleware => {
  const followCommand = createFollowCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context: ParameterizedContext, next) => {
    if (context.session.command === 'follow' && context.session.editorialCommunityId) {
      const editorialCommunityId = new EditorialCommunityId(context.session.editorialCommunityId);
      await followCommand(context.state.user, editorialCommunityId);
    }

    await next();
  };
};
