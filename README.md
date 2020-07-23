# Firefox Command Palette
Control Firefox with Sublime/helm-M-x style fuzzy complete. Use it from the omnibar with the `;` search prefix, or trigger a pop-up with `Ctrl+Space`. 

To build:

  1. Clone this repo and make sure you have node, npm and web-ext setup.
  2. `npm install fuzzysearch`
  3. `web-ext build`

## Credits
This extension uses the Terminal icon from [Font Awesome](https://fontawesome.com). It's [licensed](https://fontawesome.com/license/free) under Creative Commons [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Fuzzy completion is provided by Nicolas Bevacqua's `fuzzysearch` library. It is [MIT](https://github.com/bevacqua/fuzzysearch/blob/master/LICENSE/). licensed and its source code can be found on [GitHub](https://github.com/bevacqua/fuzzysearch/).

This extension, with the exception of the above, is licensed under GPL (see [LICENSE](./LICENSE)).
