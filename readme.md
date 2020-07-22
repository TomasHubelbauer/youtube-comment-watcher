# YouTube Comments Watcher

## Running

```sh
npm install
npm start
```

## Testing

`npm test` or invoke through `npm start`

## Usage

```js
import run from './index.js';

// …
const result = await run(code);
```

The result:

- `{}`
  - `title`: the title of the page
  - `count`: the comment count string (e.g.: *10 Comments*)
  - `comments[]`: the array of top-level comments (excluding replies)
    - `author`
    - `content`
    - `date`
    - `link`
    - `heart`
    - `replies[]`
      - `author`
      - `content`
      - `date`
      - `link`

## To-Do

### Fix not all comments being scraped (seems random across runs)

I'm starting to experience issues on videos with 10+ comments. Sometimes it only
gets 10, sometimes 14, never 15 that there is.

### Find a way to sort by new and do it for better diffing and notifications
