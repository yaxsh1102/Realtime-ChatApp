"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignGravatr = void 0;
const assignGravatr = (gender) => {
    const mens = ['boy', 'uncle', 'handsome', 'james', 'katherine', 'james'];
    const womens = ['girl', 'women', 'margot', 'sydney'];
    if (gender === "male") {
        const num = Math.floor(Math.random() * (5 - 0 + 1) + 0);
        return mens[num];
    }
    else {
        const num = Math.floor(Math.random() * (3 - 0 + 1) + 0);
        return mens[num];
    }
};
exports.assignGravatr = assignGravatr;
