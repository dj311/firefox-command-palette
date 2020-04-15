/* Omnibox Integration ---------------------------------- */
browser.omnibox.setDefaultSuggestion({
    description: "Command Palette: Search for a command or type `help` for more information."
});


browser.omnibox.onInputChanged.addListener(async (input, suggest) => {
    const suggestions = await onChange(input);
    suggest(suggestions);
});


browser.omnibox.onInputEntered.addListener(async (input, disposition) => {
    return await onEnter(input);
});
