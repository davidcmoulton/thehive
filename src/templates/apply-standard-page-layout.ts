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

        function injectLogo(path) {
          document.getElementById('logo-wrapper').innerHTML = '<img alt="" class="site-logo" id="siteLogo" src="' + path + '">';
        }
        
        window.addEventListener('DOMContentLoaded', function () {
          
          const links = document.querySelectorAll('a[href]');
          Array.prototype.forEach.call(links, function (link) {
            link.addEventListener('click', function(e) {
              const option = !isNaN(parseInt(query.substring(query.indexOf('option=') + 7, query.indexOf('option=') + 8))) ? 'option=' + parseInt(query.substring(query.indexOf('option=') + 7, query.indexOf('option=') + 8)) :
              '';
              const logo = !isNaN(parseInt(query.substring(query.indexOf('logo=') + 5, query.indexOf('logo=') + 6))) ? 'logo=' + parseInt(query.substring(query.indexOf('logo=') + 5, query.indexOf('logo=') + 6)) :
              '';
              const font = !isNaN(parseInt(query.substring(query.indexOf('font=') + 5, query.indexOf('font=') + 6))) ? 'font=' + parseInt(query.substring(query.indexOf('font=') + 5, query.indexOf('font=') + 6)) :
              '';
              const colour = !isNaN(parseInt(query.substring(query.indexOf('colour=') + 7, query.indexOf('colour=') + 8))) ? 'colour=' + parseInt(query.substring(query.indexOf('colour=') + 7, query.indexOf('colour=') + 8)) :
              '';
              const iteration = !isNaN(parseInt(query.substring(query.indexOf('iteration=') + 10, query.indexOf('iteration=') + 11))) ? 'iteration=' + parseInt(query.substring(query.indexOf('iteration=') + 10, query.indexOf('iteration=') + 11)) :
              '';
              let newHref = e.target.getAttribute('href') + '?' + iteration + '&' + option + '&' + logo + '&' + colour + '&' + font;
              while (newHref.indexOf('&&') > -1) {
                newHref = newHref.replace('&&', '&');
              }
              e.target.href = newHref;
            });
          });
          
          const query = window.location.search;
          const designIteration = parseInt(query.substring(query.indexOf('iteration=') + 10, query.indexOf('iteration=') + 11) || 1);
          const htmlElement = document.querySelector('html');
          let colourNumber = '';
          
          if (designIteration === 1) {
            
            const optionNumber = parseInt(query.substring(query.indexOf('option=') + 7, query.indexOf('option=') + 8) || -1);
            let logoNumber = parseInt(query.substring(query.indexOf('logo=') + 5, query.indexOf('logo=') + 6) || '1');
            if (optionNumber === 1) {
              logoNumber = 1;
              colourNumber = 1;
            } else if (optionNumber === 2) {
              logoNumber = 2;
              colourNumber = 2;
            } else if (optionNumber === 3) {
              logoNumber = 3;
              colourNumber = 3
            } else if (optionNumber === 4) {
              logoNumber = 4;
              colourNumber = 2;
            }
            if (logoNumber > 0 && logoNumber < 5) {
              if (!colourNumber) {
                colourNumber = query.substring(query.indexOf('colour=') + 7, query.indexOf('colour=') + 8) || '1'
              }
              htmlElement.classList.add('logo-' + logoNumber, 'colour-' + colourNumber);
              injectLogo('/static/images/hive-ideas_colour_way_' + logoNumber + '.svg')
            } else if (logoNumber === 5) {
              injectLogo('/static/images/hive-ideas_idea-2.svg');
            } else if (logoNumber === 6) {
              injectLogo('/static/images/hive-ideas_idea-3.svg');
            }
        
          } else if (designIteration === 2) {
            const optionNumber = parseInt(query.substring(query.indexOf('option=') + 7, query.indexOf('option=') + 8)) ?? 0;
              0;
            let logoPath = '';
            switch (optionNumber) {
              case 1:
                logoPath = '/static/images/hive-ideas-refinements_00796B-option.svg'
                colourNumber = 1;
                break;
              case 2:
                logoPath = '/static/images/hive-ideas-refinements_00796B-option-2.svg'
                colourNumber = 1;
                break;
              case 3:
                logoPath = '/static/images/hive-ideas-refinements_283593-option.svg'
                colourNumber = 2;
                break;
              case 4:
                logoPath = '/static/images/hive-ideas-refinements_C1390F-option.svg'
                colourNumber = 3;
                break;
              default:
                colourNumber = 0;
            }
            htmlElement.classList.add('iteration-2', 'colour-' + colourNumber);
            if (logoPath) {
              injectLogo(logoPath);
            }
            
            const fontNumber = !isNaN(parseInt(query.substring(query.indexOf('font=') + 5, query.indexOf('font=') + 6))) ? parseInt(query.substring(query.indexOf('font=') + 5, query.indexOf('font=') + 6)) :
            '';
            if (fontNumber) {
              htmlElement.classList.add('font-' + fontNumber);
            }
          }
          
        });
        
      }(window));
    </script>
    <div id="logo-wrapper"></div>

    <nav class="site-header">

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

  <script src="/static/behaviour.js"></script>
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
