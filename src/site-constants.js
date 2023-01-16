/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://pt-br.reactjs.org';
const version = '17.0.2';
=======
const urlRoot = 'https://reactjs.org';
const version = '18.2.0';
>>>>>>> 38bf76a4a7bec6072d086ce8efdeef9ebb7af227
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
