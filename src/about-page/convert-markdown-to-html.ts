import { Context, Middleware, Next } from 'koa';
import showdown from 'showdown';

export default (): Middleware => {
  const converter = new showdown.Converter();
  return async (ctx: Context, next: Next): Promise<void> => {
    const text: string = ctx.state.markdown;
    ctx.state.html = converter.makeHtml(text);

    await next();
  };
};