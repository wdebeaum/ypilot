const parse = require('./parser.js').parse;
const tryToParseString = require('./parser-utils.js').tryToParseString;
const compile = require('./compile.js');
const $ = require('jquery');
const Clock = require('./clock.js');
const errors = require('./errors.js');

function loadFromAST(ast, sourceURL) {
  return compile(ast).then(jsText => {
    if (sourceURL) {
      jsText += "\n//# sourceURL=" + sourceURL + "\n";
    }
    var script = document.createElement('script');
    script.setAttribute('id', 'game-script');
    script.setAttribute('type', 'text/javascript');
    script.text = jsText;
    $('head').append(script);
    router.configURL = sourceURL;
  });
}

function loadFromString(ypText, sourceURL) {
  try {
    var ast = tryToParseString(ypText, sourceURL);
    return loadFromAST(ast, sourceURL);
  } catch (e) {
    return Promise.reject(e);
  }
}

function loadFromProfile(gameIndex) {
  return new Promise((resolve, reject) => {
    var url = profile.games[gameIndex].url;
    $.get(url).
    done((data, textStatus, jqXHR) => {
      loadFromString(jqXHR.responseText, url).then(resolve).catch(reject);
    }).
    fail((jqXHR, textStatus, errorThrown) => {
      errors.reportError(textStatus, "while fetching config file:\n");
      errors.convertFailToReject(textStatus, errorThrown, reject);
    });
  });
}

function unload() {
  deleteToUnload.forEach(x => { delete window[x]; });
  deleteToUnload.length = 0;
  $('#game-script').remove();
}

module.exports = {
  loadFromAST: loadFromAST,
  loadFromString: loadFromString,
  loadFromProfile: loadFromProfile,
  unload: unload
};
