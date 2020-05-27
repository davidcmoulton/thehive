type RenderPageHeader = () => Promise<string>;

export default (): RenderPageHeader => (
  async () => (`
    <header class="content-header">

      <h1>
        Untitled Publish Review Curate Platform
      </h1>

      <p>
        An experimental platform for multiple communities to provide post-publication peer review of scientific
        research.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `)
);