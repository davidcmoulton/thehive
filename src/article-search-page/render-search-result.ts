import Doi from '../data/doi';

export interface SearchResult {
  doi: Doi;
  title: string;
  authors: string;
}

export type GetCommentCount = (doi: Doi) => Promise<number>;

export type RenderSearchResult = (result: SearchResult) => Promise<string>;

export type GetEndorsingEditorialCommunities = (doi: Doi) => Promise<Array<string>>;

const getHardCodedEndorsingEditorialCommunities: GetEndorsingEditorialCommunities = async (doi) => (
  doi.value === '10.1101/209320' ? ['PeerJ'] : []
);

export default (
  getCommentCount: GetCommentCount,
  getReviewCount: (articleVersionDoi: Doi) => number,
): RenderSearchResult => (
  async (result) => {
    const reviewCount = getReviewCount(result.doi);
    const commentCount = await getCommentCount(result.doi).catch(() => 'n/a');
    const endorsingEditorialCommunities = await getHardCodedEndorsingEditorialCommunities(result.doi);

    let endorsement = '';
    if (endorsingEditorialCommunities.length) {
      endorsement = `
        <div class="ui label">
          Endorsed by
          <span class="detail">${endorsingEditorialCommunities.join(', ')}</span>
        </div>
      `;
    }

    return `
      <div class="content">
        <a class="header" href="/articles/${result.doi.value}">${result.title}</a>
        <div class="meta">
          ${result.authors}
        </div>
        <div class="extra">
          <div class="ui label">
            Reviews
            <span class="detail">${reviewCount}</span>
          </div>
          <div class="ui label">
            Comments
            <span class="detail">${commentCount}</span>
          </div>
          ${endorsement}
        </div>
      </div>
    `;
  }
);
