import { Maybe } from 'true-myth';
import { User } from '../types/user';

let googleAnalytics = '';
if (process.env.GOOGLE_ANALYTICS_TRACKING_ID) {
  googleAnalytics = `
    const script = document.createElement('script');
    script.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
    script.setAttribute('async', '');
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${process.env.GOOGLE_ANALYTICS_TRACKING_ID}');
  `;
}

const loggedInMenuItems = (user: User): string => `
  <li class="item">
    <a href="/users/${user.id}">My profile</a>
  </li>

  <li class="item">
    <a href="/log-out">Log out</a>
  </li>
`;

const loggedOutMenuItems = (): string => `
  <li class="item">
    <a href="/log-in">Log in</a>
  </li>
`;

export default (page: string, user: Maybe<User>): string => `<!doctype html>
<html lang="en">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>
    The Hive
  </title>
  <link rel="stylesheet" href="/static/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.css">

  <header class="u-full-width">
    <script>
      (function(window) {
        window.addEventListener('DOMContentLoaded', function () {
        
          const query = window.location.search;

          const logoNumber = parseInt(query.substring(query.indexOf('logo=') + 5, query.indexOf('logo=') + 6) || '1');
          if (logoNumber > 0 && logoNumber < 5) {
            const colourNumber = query.substring(query.indexOf('colour=') + 7, query.indexOf('colour=') + 8) || '1'
            document.querySelector('html').classList.add('logo-' + logoNumber, 'colour-' + colourNumber);
            document.getElementById('siteLogo').src = '/static/images/hive-ideas_colour_way_' + logoNumber + '.svg';
          } else if (logoNumber === 5) {
            document.getElementById('siteLogo').src = '/static/images/hive-ideas_idea-2.svg';
          } else if (logoNumber === 6) {
            document.getElementById('siteLogo').src = '/static/images/hive-ideas_idea-3.svg';
          }
        
        });
        
      }(window));
    </script>
    <img alt="" class="site-logo" id="siteLogo">
    <nav>

      <ul class="ui large text menu">

        <li class="item">
          <a href="/">Home</a>
        </li>

        <li class="item">
          <a href="/about">About</a>
        </li>

        ${user.mapOrElse(loggedOutMenuItems, loggedInMenuItems)}

        <li class="right item">
          <a href="https://eepurl.com/g7qqcv" class="ui primary button">Give us feedback</a>
        </li>

      </ul>

    </nav>

  </header>

  <main class="u-full-width">
    ${page}
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent/3.1.1/cookieconsent.min.js"></script>
  <script>
    function onConsent() {
        if (!this.hasConsented()) {
          return;
        }
        ${googleAnalytics}
    }

    window.cookieconsent.initialise({
      content: {
        message: 'This site uses cookies to deliver its services and analyse traffic. By using this site, you agree to its use of cookies.'
      },
      onInitialise: onConsent,
      onStatusChange: onConsent,
      palette: {
        popup: {
          background: 'rgb(0, 0, 0, 0.8)',
        }
      }
    });
  </script>
</html>
`;
