import { SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchDatasetError } from '../api/fetch-dataset';
import { FetchReviewedArticle } from '../api/fetch-reviewed-article';
import Doi from '../data/doi';
import createLogger from '../logger';
import templateArticlePage from '../templates/article-page';
import { ReviewedArticle } from '../types/reviewed-article';

const log = createLogger('handler:article');

const biorxivPrefix = '10.1101';

export default (fetchReviewedArticle: FetchReviewedArticle): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi: Doi = ctx.prc.articleDoi;

    if (!(doi.hasPrefix(biorxivPrefix))) {
      log(`Article ${doi} is not from bioRxiv`);
      throw new NotFound('Not a bioRxiv DOI.');
    }

    let reviewedArticle: ReviewedArticle;
    try {
      reviewedArticle = await fetchReviewedArticle(doi);
    } catch (e) {
      if (e instanceof FetchDatasetError) {
        log(`Failed to load article ${doi}: (${e})`);
        ctx.response.status = SERVICE_UNAVAILABLE;
        ctx.response.body = 'Article temporarily unavailable. Please try refreshing.';
        return;
      }
      log(`Article ${doi} not found: (${e})`);
      throw new NotFound(`${doi} not found`);
    }

    const page = templateArticlePage(reviewedArticle);

    ctx.response.type = 'html';
    ctx.response.body = page;

    await next();
  }
);
