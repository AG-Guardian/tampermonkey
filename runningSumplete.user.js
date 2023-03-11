// ==UserScript==
// @name         Running Sumplete
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add running sums to Sumplete
// @author       Zach Greer
// @match        https://sumplete.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sumplete.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/AG-Guardian/tampermonkey/main/runningSumplete.user.js
// @updateURL  https://raw.githubusercontent.com/AG-Guardian/tampermonkey/main/runningSumplete.user.js
// ==/UserScript==

(function() {
    'use strict';
    const styleElem = document.createElement("style");
    const style = '.hanswer { white-space: nowrap; justify-content: normal; }';
    styleElem.innerText = style;
    document.head.appendChild(styleElem);

    function getRunningSums() {
        const hanswers = Array.from(document.getElementsByClassName("hanswer"));
        const vanswers = Array.from(document.getElementsByClassName("vanswer"));
        const numbers = Array.from(document.getElementsByClassName("number"));
        const size = Math.sqrt(numbers.length);

        let rows = [];
        let cols = [];

        for (let i = 0; i < numbers.length; i+= size) {
            rows.push(numbers.slice(i, i + size));
        }

        cols = rows[0].map((col, c) => rows.map((row, r) => rows[r][c]));

        function add(accumulator, element) {
            if (!element.classList.contains("delete")) {
                return accumulator + parseInt(element.innerHTML);
            }
            return accumulator;
        }

        for (const [index, hanswer] of hanswers.entries()) {
            const sum = rows[index].reduce(add, 0);
            hanswer.innerHTML = `&ensp;${hanswer.innerText.trim().replace("&ensp;", "").split(' ')[0]} (${sum})`;
        }

        for (const [index, vanswer] of vanswers.entries()) {
            const sum = cols[index].reduce(add, 0);
            vanswer.innerHTML = `${vanswer.innerHTML.trim().split("<br>")[0]}<br/>(${sum})`;
        }
    }

    getRunningSums();
    document.addEventListener("click", getRunningSums);
})();
