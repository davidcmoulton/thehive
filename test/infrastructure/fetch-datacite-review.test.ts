import { literal } from '@rdfjs/data-model';
import { dcterms, schema } from '@tpluscode/rdf-ns-builders';
import clownface from 'clownface';
import datasetFactory from 'rdf-dataset-indexed';
import createFetchDataciteReview from '../../src/infrastructure/fetch-datacite-review';
import { FetchDataset } from '../../src/infrastructure/fetch-dataset';
import Doi from '../../src/types/doi';

const reviewDoi = new Doi('10.5281/zenodo.3678325');

describe('fetch-datacite-review', (): void => {
  describe('when the response contains Datacite data', () => {
    it('returns the review', async () => {
      const fetchDataset: FetchDataset = async (iri) => (
        clownface({ dataset: datasetFactory(), term: iri })
          .addOut(schema.datePublished, literal('2020-02-20', schema.Date))
          .addOut(schema.description, 'A summary')
      );
      const fetchReview = createFetchDataciteReview(fetchDataset);
      const review = await fetchReview(reviewDoi);

      expect(review).toMatchObject({
        summary: 'A summary',
        publicationDate: new Date('2020-02-20'),
      });
    });
  });

  describe('when the response contains Crossref data', () => {
    it('returns the correct date of the review', async () => {
      const fetchDataset: FetchDataset = async (iri) => (
        clownface({ dataset: datasetFactory(), term: iri })
          .addOut(dcterms.date, literal('2020-02-20', schema.Date))
      );
      const fetchReview = createFetchDataciteReview(fetchDataset);
      const review = await fetchReview(reviewDoi);

      expect(review.publicationDate).toStrictEqual(new Date('2020-02-20'));
    });
  });

  describe('when the review has no description', () => {
    it('returns the review without a summary', async () => {
      const fetchDataset: FetchDataset = async (iri) => (
        clownface({ dataset: datasetFactory(), term: iri })
      );
      const fetchReview = createFetchDataciteReview(fetchDataset);
      const review = await fetchReview(reviewDoi);

      expect(review.summary).toBeUndefined();
    });
  });
});
