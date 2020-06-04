import Doi from '../../data/doi';
import templateListItems from '../../templates/list-items';

interface ReviewedArticle {
  doi: Doi;
  title: string;
}

const templateTeaser = (article: ReviewedArticle): string => (`
 <a href="/articles/${article.doi}">${article.title}</a>
`);

export default (reviewedArticles: Array<ReviewedArticle>): string => (`
  <section class="editorial-community-reviewed-articles">

    <h2 class="ui header">
      Recently reviewed articles
    </h2>

    <ol class="u-normalised-list article-listing">
      ${templateListItems(reviewedArticles.map(templateTeaser))}
    </ol>

  </section>
`);
