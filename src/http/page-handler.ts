import { Middleware, RouterContext } from '@koa/router';
import { NOT_FOUND, OK } from 'http-status-codes';
import { Next } from 'koa';
import { Result } from 'true-myth';
import applyStandardPageLayout from '../templates/apply-standard-page-layout';

type RenderPageError = {
  type: 'not-found',
  content: string
};

export type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
}) => Promise<string | Result<string, RenderPageError>>;

export default (
  renderPage: RenderPage,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const params = {
      ...ctx.params,
      ...ctx.query,
    };
    ctx.response.type = 'html';

    const page = await renderPage(params);

    if (typeof page === 'string') {
      ctx.response.status = OK;
      ctx.response.body = applyStandardPageLayout(page);
    } else {
      ctx.response.status = page.isOk() ? OK : NOT_FOUND;
      ctx.response.body = applyStandardPageLayout(page.unwrapOrElse((error) => error.content));
    }

    await next();
  }
);