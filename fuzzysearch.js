'use strict';

/* Search -------------------------------------------------------- */
function fuzzysearchphrase(needle, haystack) {
    let score = 0;
    for (const word of needle.split(" ")) {
        if (fuzzysearch(word, haystack)) {
            score += 1;
        }
    }
    return score;
}


/* # fuzzysearch
 * tiny and blazing-fast fuzzy search in javascript
 *
 * source: https://github.com/bevacqua/fuzzysearch
 * license:
 *   the mit license (mit)
 *
 *   copyright © 2015 nicolas bevacqua
 *
 *   permission is hereby granted, free of charge, to any person obtaining a copy of
 *   this software and associated documentation files (the "software"), to deal in
 *   the software without restriction, including without limitation the rights to
 *   use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 *   the software, and to permit persons to whom the software is furnished to do so,
 *   subject to the following conditions:
 *   the above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the software.
 *
 *   the software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability, fitness
 *   for a particular purpose and noninfringement. in no event shall the authors or
 *   copyright holders be liable for any claim, damages or other liability, whether
 *   in an action of contract, tort or otherwise, arising from, out of or in
 *   connection with the software or the use or other dealings in the software.
 *  code:
 *  */

function fuzzysearch (needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}
