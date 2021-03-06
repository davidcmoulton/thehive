import { URL } from 'url';
import EditorialCommunityId from './editorial-community-id';

export interface EditorialCommunity {
  id: EditorialCommunityId;
  name: string;
  avatar: URL;
  descriptionPath: string;
}
