/**
 * Returns a copy of the object with all of the undefined properties removed
 */
module.exports.removeUndefined = (obj) => {
    const mod = { ...obj };
    Object.keys(mod).forEach(key => mod[key] === undefined ? delete mod[key] : {});
    return mod;
}

/**
 * Userful for waiting a little bit of time in an async function
 */
module.exports.sleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}