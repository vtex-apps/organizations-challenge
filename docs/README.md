# Permission Challenge

> Challenge that checks if a user is permitted to view the content

## Usage

Add this app to your theme dependencies:

```js
// manifest.json
// ...
  "dependencies": {
    // ...
    "vtex.challenge-permission": "0.x"
  }
```

Wrap the blocks you want to be visible only to logged in users with `challenge-permission`.

Example:

```diff
 "store.product": {
   "blocks": [
     "flex-layout.row#product-main",
+     "challenge-permission#description",
     "shelf.relatedProducts#accessories"
   ],
 },
+ "challenge-permission#description": {
+   "blocks": [
+     "allowed-content#description",
+     "disallowed-content#description"
+   ]
+ },
+ "allowed-content#description": {
+   "children": [
+     "product-description"
+   ]
+ },
+ "disallowed-content#description": {
+   "children": [
+     "rich-text#challenge-description"
+   ]
+ },
+ "rich-text#challenge-description": {
+   "props": {
+     "text": "You are not allowed to view the description",
+     "blockClass": "challengeDescription"
+   }
+ }
```

This component will check if the user has permission see the `allowed-content`, otherwise he will see the `disallowed-content`.

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.challenge-permission.css` inside the `styles/css` folder. Add your custom styles:

```css
.challengeContentWrapper {
  margin-top: 10px;
}
```

#### CSS namespaces

Below, we describe the namespaces that are defined in the `PermissionChallenge`.

| Class name               | Description                                                                    | Component Source                                                                             |
| ------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `challengeContentWrapper`              | The main container of the `Content`                              |  |
