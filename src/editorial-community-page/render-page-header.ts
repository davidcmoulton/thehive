export type RenderPageHeader = (editorialCommunityId: string) => Promise<string>;

export type GetEditorialCommunity = (editorialCommunityId: string) => Promise<{
  name: string;
  description: string;
  logo?: string;
}>;

export default (
  getEditorialCommunity: GetEditorialCommunity,
): RenderPageHeader => (
  async (editorialCommunityId) => {
    const editorialCommunity = await getEditorialCommunity(editorialCommunityId);
    let h1: string;
    if (editorialCommunity.logo !== undefined) {
      h1 = `<img src="${editorialCommunity.logo}" alt="${editorialCommunity.name}" class="ui image">`;
    } else {
      h1 = editorialCommunity.name;
    }
    return `
      <header class="ui basic padded vertical segment">
        <h1 class="ui header">
          ${h1}
        </h1>
      </header>
      <section class="ui basic vertical segment">
        ${editorialCommunity.description}
      </section>
    `;
  }
);