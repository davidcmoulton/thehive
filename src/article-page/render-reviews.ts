import renderReview from './render-review';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';

type RenderReviews = (doi: Doi) => Promise<string>;

export type GetReviews = (doi: Doi) => Promise<Array<{
  publicationDate: Date;
  summary: string;
  url: URL;
  editorialCommunityId: string;
  editorialCommunityName: string;
}>>;

export default (
  reviews: GetReviews,
  id: string,
): RenderReviews => async (doi) => {
  const renderedReviews = (await reviews(doi)).map((review, index) => (
    renderReview(review, `review-${index}`, 1500)
  ));
  if (renderedReviews.length === 0) {
    return '';
  }
  return `
    <section id="${id}">
      <h2 class="ui header">
        Reviews
      </h2>
      <ol class="ui very relaxed divided items">
        ${templateListItems(renderedReviews)}
      </ol>
    </section>
  `;
};