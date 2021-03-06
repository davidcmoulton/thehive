type RenderFindArticle = () => Promise<string>;

export default (): RenderFindArticle => (
  async () => (`
    <section class="search-form">
      <form method="get" action="/articles">

        <h3>
          Search bioRxiv content
        </h3>

        <div class="search-form__inputs">
          <input type="text" size="19" name="query" placeholder="Keywords, author name, DOI ..." class="search-form__input" required><button type="submit" class="search-form__button"><img src="/static/images/search-icon.svg" alt=""></button>
        </div>

      </form>
    </section>
  `)
);
