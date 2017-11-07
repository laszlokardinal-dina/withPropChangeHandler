
# `withPropChangeHandler()`


Higher order component for React, that calls the handler function if any of the props that are specified in the first parameter change.

If the first parameter is null, the handler will be called on every change.

The handler will be called
 * before mount with an empty object as previousProps,
 * on prop change with the next and previous props,
 * before unmount with an empty object as nextProps.

Signature:

```js
withPropChangeHandler(
  keys: Array<string> | null,
  propChangeHandler: (nextProps:Object, previousProps:Object) => void
): HigherOrderComponent
```

Usage example:

```js
const enhance = withPropChangeHandler(
  ["groupId", "userId"],
  (
    { groupId, userId, loadPosts },
    { groupId: previousGroupId, userId: previousUserId, unloadPosts }
  ) => {
    if (previousGroupId && previousUserId) {
      unloadPosts(previousGroupId, previousUserId);
    }

    if (groupId && userId) {
      loadPosts(groupId, userId);
    }
  }
);

const Posts = enhance(
  ({ posts }) =>
    posts && (
      <div>{posts.map(({ id, content }) => <div key={id}>{content}</div>)}</div>
    )
);
```

Install:

```
npm install with-prop-change-handler --save
```
