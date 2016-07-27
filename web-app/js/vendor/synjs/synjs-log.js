var SynJS = SynJS || {};

SynJS.log = {
    tryConsole: function () {
        "use strict";
        var returnedValue = false;
//        if (window.console && SynJS.utils.getEnv() === "DEVELOPMENT" && !$.browser.msie) {
        if (window.console && SynJS.utils.getEnv() === "DEVELOPMENT") {
            returnedValue = true;
        }
        return returnedValue;
    },
    info: function () {
        "use strict";

        if (SynJS.log.tryConsole()) {
            console.info.apply(window.console, arguments);
        }
    },
    warn: function () {
        "use strict";

        if (SynJS.log.tryConsole()) {
            console.warn.apply(window.console, arguments);
        }
    },
    error: function () {
        "use strict";

        if (SynJS.log.tryConsole()) {
            console.error.apply(window.console, arguments);
        }
    },
    time: function () {
        "use strict";

        if (SynJS.log.tryConsole()) {
            console.time.apply(window.console, arguments);
        }
    },
    timeEnd: function () {
        "use strict";

        if (SynJS.log.tryConsole()) {
            console.timeEnd.apply(window.console, arguments);
        }
    },
    group: function () {
        "use strict";

        if (SynJS.log.tryConsole()) {
            console.groupCollapsed.apply(window.console, arguments);
        }
    },
    groupEnd: function () {
        "use strict";

        if (SynJS.log.tryConsole()) {
            console.groupEnd.apply(window.console, arguments);
        }
    }
};