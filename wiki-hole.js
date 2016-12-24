var webdriver = require('selenium-webdriver');
var By = webdriver.By;

var driver = new webdriver.Builder()
  .withCapabilities({ 'browserName': 'phantomjs' })
  .build();

var hops = typeof process.argv[2] !== 'undefined' && process.argv[2];

wikiHole(hops);

async function wikiHole(hops) {
  hops = hops || true;
  var randomURL = 'http://en.wikipedia.org/wiki/Special:Random';
  await driver.get(randomURL);
  await logTitle('Start');

  var i = 1;
  while (hops === true || i <= hops) {
    var randomArticle = await getRandomArticle();
    try { randomArticle.click(); }
    catch(e) { console.log(e); }
    logTitle(i);
    i++;
  }
}

async function getRandomArticle() {
  var articleSelector = '#mw-content-text > p a[href^="/wiki/"]';
  var seeAlsoSelector = '#mw-content-text > p ~ ul a[href^="/wiki/"]';
  var articles = await driver.findElements(By.css(articleSelector));

  if (!articles.length) {
    articles = await driver.findElements(By.css(seeAlsoSelector));
  }

  while (true) {
    var randomArticle = articles[Math.floor(Math.random() * articles.length)];
    var href = await randomArticle.getAttribute('href');

    if (!/\/wiki\/.*\:.*/.test(href)) {
      return randomArticle;
    }
  }
}

async function logTitle(n) {
  n = n || '*';
  var titleSelector = '#firstHeading';
  var title = await driver.findElement(By.css(titleSelector)).getText();
  console.log(`${n}: ${title}`);
}
