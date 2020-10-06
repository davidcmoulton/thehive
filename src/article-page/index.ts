import { URL } from 'url';
import { Maybe, Result } from 'true-myth';
import ensureBiorxivDoi from './ensure-biorxiv-doi';
import createGetFeedReviews, { FeedEvent, GetEditorialCommunity, GetReview } from './get-feed-reviews';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderFeed from './render-feed';
import createRenderFlavourAFeed from './render-flavour-a-feed';
import createRenderPage, { RenderPageError } from './render-page';
import createRenderPageHeader, { RenderPageHeader } from './render-page-header';
import createRenderReviewedEvent from './render-review-feed-item';
import createRenderVersionFeedItem from './render-version-feed-item';
import { Logger } from '../infrastructure/logger';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleVersionDoi = (articleVersionDoi: Doi) => Promise<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  occurredAt: Date;
}>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  fetchReview: GetReview;
  getEditorialCommunity: (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
    name: string;
    avatar: URL;
  }>>,
  findReviewsForArticleVersionDoi: FindReviewsForArticleVersionDoi;
  logger: Logger;
}

const buildRenderPageHeader = (ports: Ports): RenderPageHeader => createRenderPageHeader(
  ports.fetchArticle,
);

const buildRenderAbstract = (fetchAbstract: FetchExternalArticle): RenderArticleAbstract => {
  const abstractAdapter: GetArticleAbstract = async (articleDoi) => {
    const fetchedArticle = await fetchAbstract(articleDoi);
    return fetchedArticle.map((article) => ({ content: article.abstract }));
  };
  return createRenderArticleAbstract(abstractAdapter);
};

interface Params {
  doi?: string;
  flavour?: string;
}

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const renderPageHeader = buildRenderPageHeader(ports);
  const renderAbstract = buildRenderAbstract(ports.fetchArticle);
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap()
  );
  const getReviews = createGetFeedReviews(
    async (doi: Doi) => {
      const feedEvents: Array<FeedEvent> = Array.from(await ports.findReviewsForArticleVersionDoi(doi));

      if (doi.value === '10.1101/646810') {
        feedEvents.push({
          source: new URL(`https://www.biorxiv.org/content/${doi.value}v1?versioned=true`),
          postedAt: (await ports.fetchArticle(doi)).unsafelyUnwrap().publicationDate,
          version: 1,
        });
      }

      return feedEvents;
    },
    ports.fetchReview,
    getEditorialCommunity,
  );
  const renderFeed = createRenderFeed(
    getReviews,
    createRenderReviewedEvent(150),
    createRenderVersionFeedItem(),
  );
  const renderFlavourAFeed = createRenderFlavourAFeed();
  const renderPage = createRenderPage(
    renderPageHeader,
    renderAbstract,
    renderFeed,
  );
  const renderFlavourA = createRenderPage(
    renderPageHeader,
    renderAbstract,
    renderFlavourAFeed,
  );
  return async (params) => {
    let doi: Doi;
    try {
      doi = ensureBiorxivDoi(params.doi ?? '').unsafelyUnwrap();
    } catch (error: unknown) {
      return Result.err({
        type: 'not-found',
        content: `${params.doi ?? 'Article'} not found`,
      });
    }
    if (doi.value === '10.1101/646810' && params.flavour === 'a') {
      return renderFlavourA(doi);
    }
    return renderPage(doi);
  };
};
