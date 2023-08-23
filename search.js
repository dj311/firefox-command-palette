function fuzzysearchphrase(needle, haystack) {
    let score = 0;
    for (const word of needle.split(" ")) {
        if (fuzzysearch(word, haystack)) {
            score += 1;
        }
    }
    return score;
}


async function onChange(input) {
    input = input.toLowerCase().trim();

    var num_input_words;
    if (input.length === 0) num_input_words = 0;
    if (input.length !== 0) num_input_words = input.split(" ").length;

    // First it builds a list of suggestable commands, then it
    // uses fuzzysearchphrase to narrow suggests based on current input.

    // suggestions defaults to a list of commands
    let suggestions = commands;

    // if the input starts with an exact version of a command name, fetch
    // a list of suggested arguments from the command itself.
    const exact_matches = commands.filter(command => input.startsWith(command.name));
    if (exact_matches.length == 1) {
        command = exact_matches[0];
        args = input.substr(command.name.length).trim();

        suggestions = [{
            name: command.name,
            desc: command.desc
            // shortcuts for commands with args not supported for now
        }];
        const allowed_args = await command.args()
        suggestions = allowed_args.map((s) => Object({
            name: command.name + " " + s.content,
            desc: s.description
            // shortcuts for commands with args not supported for now
        }));

        input = args;
        if (input.length === 0) num_input_words = 0;
        if (input.length !== 0) num_input_words = input.split(" ").length;
    }

    suggestions = suggestions.map(cmd => Object({
        name: cmd.name.toLowerCase(),
        desc: cmd.desc.toLowerCase(),
        shortcut: cmd.shortcut && cmd.shortcut.toLowerCase()
    }));

    // whatever set of suggestions we've ended up with, narrow
    // them down using the user input
    const filtered_suggestions = suggestions
        .map(cmd => {
            cmd.score = fuzzysearchphrase(input, cmd.name) + fuzzysearchphrase(input, cmd.desc);
            return cmd;
        })
        .filter(cmd => cmd.score >= num_input_words)
        .sort((a, b) => b.score - a.score)
        .map(cmd => Object({
            content: cmd.name,
            description: cmd.desc,
            shortcut: cmd.shortcut
        }));

    return filtered_suggestions;
}


async function onEnter(input) {
    input = input.toLowerCase().trim();

    if (input == "") {input = "help"}

    for (const command of commands) {
        if (input.startsWith(command.name.toLowerCase())) {
            args = input.substr(command.name.length).trim();

            const allowed_args = (await command.args()).map(arg => arg.content);
            if (allowed_args.includes(args)) {
                await command.run(args);
            } else {
                await command.run();
            }
        };
    }
}
