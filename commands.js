/* Command Listing -----------------------------------------
 *
 * Each command is defined by four fields:
 *  1. name :: the text typed to invoke the command, i.e. this
 *      command is invoked whenever "; <name> [optional-args]"
 *      is typed, then return is pressed in the omnibar.
 *  2. desc :: an explanation of this command for humans.
 *  3. run :: the function that is run when the command is
 *      invoked. if a valid argument string is given, it
 *      will be given in its raw form as the first paramenter
 *      of this function.
 *  4. args :: a function which is expected to return all
 *      valid argument strings to this command. this is used
 *      for autocomplete and to validate inputs.
 *
 */

commands = [
    {
        name: "help",
        desc: "",
        run: () => {browser.tabs.create({url: "help.html"})},
        args: () => []
    },
    {
        name: "open new tab",
        desc: "",
        run: (url) => {
            if (url !== undefined) {
                browser.tabs.create({url: url});
            } else {
                browser.tabs.create({});
            }
        },
        args: () => []
    },
    {
        name: "reload this tab",
        desc: "",
        run: () => {browser.tabs.reload()},
        args: () => []
    },
    {
        name: "put this tab to sleep",
        desc: "",
        run: async () => {
            const tabs = await browser.tabs.query({currentWindow: true, discarded: false});
            const active_tab = tabs.filter(tab => (tab.active === true))[0];
            const other_tabs = tabs.filter(tab => (tab.id !== active_tab.id));

            if (other_tabs.length > 0) {
                tab_to_switch_to = other_tabs[other_tabs.length-1];

                browser.tabs.update(tab_to_switch_to.id, {active: true});
                browser.tabs.discard(active_tab.id);
            }
        },
        args: () => []
    },
    {
        name: "put other tabs to sleep",
        desc: "",
        run: async () => {
            const tabs = await browser.tabs .query({currentWindow: true, discarded: false, pinned: false, active: false});
            tabs.map(tab => {browser.tabs.discard(tab.id)});
        },
        args: () => []
    },
    {
        name: "mute this tab",
        desc: "",
        run: () => {browser.tabs.update({muted: true})},
        args: () => []
    },
    {
        name: "unmute this tab",
        desc: "",
        run: () => {browser.tabs.update({muted: false})},
        args: () => []
    },
    {
        name: "pin this tab",
        desc: "",
        run: () => {browser.tabs.update({pinned: true})},
        args: () => []
    },
    {
        name: "unpin this tab",
        desc: "",
        run: () => {browser.tabs.update({pinned: false})},
        args: () => []
    },
    {
        name: "close this tab",
        desc: "",
        run: async () => {
            const tabs = await browser.tabs.query({active: true, currentWindow: true});
            tabs.map(tab => {
                browser.tabs.remove(tab.id)
            });
        },
        args: () => []
    },
    {
        name: "open new window",
        desc: "",
        run: () => {browser.windows.create({})},
        args: () => []
    },
    {
        name: "open new private window",
        desc: "",
        run: () => {browser.windows.create({incognito: true})},
        args: () => []
    },
    {
        name: "close this window",
        desc: "",
        run: async () => {
            const current_window = await browser.windows.getCurrent();
            browser.windows.remove(current_window.id);
        },
        args: () => []
    },
    {
        name: "toggle reader mode in this tab",
        desc: "",
        run: () => {browser.tabs.toggleReaderMode();},
        args: () => []
    },
    {
        name: "save this tab as pdf",
        desc: "",
        run: () => {browser.tabs.saveAsPDF({});},
        args: () => []
    },
    {
        name: "move this tab to container",
        desc: "",
        run: async (container_id) => {
            const tabs = await browser.tabs.query({currentWindow: true, active: true});
            const tab = tabs[0];
            if (container_id !== undefined) {
                browser.tabs.create({
                    cookieStoreId: container_id,
                    url: tab.url,
                });
                browser.tabs.remove(tab.id);
            }
        },
        args: async () => {
            const containers = await browser.contextualIdentities.query({});
            return containers.map(container => Object({
                content: container.cookieStoreId,
                description: container.name,
            }));
        }
    },
    {
        name: "open tab in container",
        desc: "",
        run: (container_id) => {
            if (container_id !== undefined) {
                browser.tabs.create({cookieStoreId: container_id});
            }
        },
        args: async () => {
            const containers = await browser.contextualIdentities.query({});
            return containers.map(container => Object({
                content: container.cookieStoreId,
                description: container.name,
            }));
        }
    },
    {
        name: "open tab in temporary container",
        desc: "",
        run: () => browser.runtime.sendMessage('{c607c8df-14a7-4f28-894f-29e8722976af}', {'method': 'createTabInTempContainer'}),
        args: async () => []
    },
    {
        name: "move this tab to temporary container",
        desc: "",
        run: async () => {
            const tabs = await browser.tabs.query({currentWindow: true, active: true});
            const tab = tabs[0];
            browser.runtime.sendMessage('{c607c8df-14a7-4f28-894f-29e8722976af}', {
                'method': 'createTabInTempContainer',
                'active': true,
                'deletesHistory': false,
                'url': tab.url
            })
            browser.tabs.remove(tab.id);
        },
        args: async () => {
            const containers = await browser.contextualIdentities.query({});
            return containers.map(container => Object({
                content: container.cookieStoreId,
                description: container.name,
            }));
        }
    },
    {
        name: "go to tab",
        desc: "",
        run: (tab_id) => {
            if (tab_id !== undefined) {
                browser.tabs.update(Number(tab_id), {active: true});
            }
        },
        args: async () => {
            const tabs = await browser.tabs.query({currentWindow: true});
            return tabs.map(tab => Object({
                content: String(tab.id),
                description: tab.title,
            }));
        }
    },
    {
        name: "move this tab to a new window",
        desc: "",
        run: async () => {
            const active_tabs = await browser.tabs.query({currentWindow: true, active: true});
            const active_tab = active_tabs[0];

            browser.windows.create({
                tabId: active_tab.id,
            });
        },
        args: () => []
    },
    {
        name: "move this tab to popup window",
        desc: "",
        run: async () => {
            const active_tabs = await browser.tabs.query({currentWindow: true, active: true});
            const active_tab = active_tabs[0];

            browser.windows.create({
                tabId: active_tab.id,
                type: "popup"
            });
        },
        args: () => []
    },
];
