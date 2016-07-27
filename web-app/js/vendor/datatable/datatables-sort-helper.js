jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "date-eu-pre": function ( date ) {
        var extractedDate = date.match("../../....")[0];
        var dateTokens = extractedDate.split("/");
        var dateObject = new Date(dateTokens[2], dateTokens[1], dateTokens[0]);
        return dateObject.getTime();
    },

    "date-eu-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-eu-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});


