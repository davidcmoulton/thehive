type RenderPageHeader = () => Promise<string>;

export default (): RenderPageHeader => (
  async () => (`
    <header class="home-page-header">

      <h1>
        The Hive
      </h1>

      <p>
        Where research is evaluated and curated by the communities you trust.<br><a href="/about" class="home-page-header__link">Learn more</a> about the platform.
      </p>

    </header>
  `)
);
