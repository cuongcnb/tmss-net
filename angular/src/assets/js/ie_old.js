$(document).ready(function () {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");
  const html =  "<style>body" +
    "{font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f6f6 !important;" +
    "font-size: 82.5%; margin: 0; min-width: 400px; overflow-x: auto; overflow-y: scroll; text-align: center;}" +
    ".unsupportedContent {margin: auto; max-width: 480px; padding: 24px; position: relative; text-align: center;}" +
    ".unsupportedText, .downloadLink {margin: 56px 24px;}" +
    ".unsupportedText {font-size: 1.5em; line-height: 1.5em;}" +
    ".downloadLink {background: #0574AF; border-radius: 2px; cursor: pointer; display: inline-block; font-size: 1.2em; " +
    "font-weight: bold; margin-top: 0; padding: 12px 72px; text-transform: uppercase;}" +
    ".buttonContainer .downloadLink {display: inline-block;}button {border: 0; color: white;}" +
    "</style>" +
    "<div class=\"unsupportedContent\"><p class=\"unsupportedText\">Oops, your browser is not supported. <br>This website works best on Chrome or Firefox." +
    "</p><div class=\"buttonContainer\"><button class=\"downloadLink\" onclick=\"location.href='https:\/\/www.google.com\/chrome\/browser\/?hl\x3den'\">Download Google Chrome</button>" +
    "<button class=\"downloadLink\" onclick=\"location.href='https:\/\/www.firefox.com'\">Download Firefox</button></div></div>"

    // If IE, return version number.
  if (Idx > 0) {
    $('body').html(html)
  }

  // If IE 11 then look for Updated user agent string.
  else if (!!navigator.userAgent.match(/Trident\/7\./)) {
    $('body').html(html)
  }
  else {
    return 0
  }
});
