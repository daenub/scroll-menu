# 📜 scroll-menu

A "simple" scroll menu using IntersectionObserver and smooth scrolling

## Requirements

To use this script you have to include the following two polyfills into your code:

* [smoothscroll-polyfill](https://github.com/iamdustan/smoothscroll)
* [intersection-observer](https://github.com/w3c/IntersectionObserver/tree/master/polyfill)

## Example usage

#### JavaScript
Import the script…
```javascript
import {ScrollMenu} from "scroll-menu";
```
and then instantiate the `ScrollMenu` class to kick off the menu.
```javascript
new ScrollMenu({
    links: linkList,
    offsetMediaQueries: [
      {
        mediaQuery: "(min-width: 768px)",
        scrollOffset: -100,
        rootMargin: "-100px 0px 0px 0px",
      },
      {
        mediaQuery: "(min-width: 0px)",
        scrollOffset: -55,
        rootMargin: "-55px 0px 0px 0px",
      },
    ],
})
```

#### CSS
The script sets the `data-active` attribute of an anchor element to `true` when its target intersects the device viewport.
```css
a[data-active="true"] {
   color: #abcdef; 
}
```

#### HTML

Just make sure that every link that you pass to the class links to an element that exists inside the document.
```html
<a href="#section-1">Section 1</a>
<a href="#section-2">Section 2</a>
<a href="#section-3">Section 3</a>

<section id="#section-1">…</section
<section id="#section-2">…</section
<section id="#section-3">…</section
```

## Options

#### links
The `links` argument has to be an array of anchor elements.
#### offsetMediaQueries (optional)
If you have a sticky header you probably want to set an offset so the first bit of the target you're navigating to isn't hidden by the overlaying header.
You can set that with the `offsetMediaQueries` argument.

Just pass an array of objects which contain…
* `mediaQuery` – string – condition when to apply the following values
* `scrollOffset` – number – is applied when navigating to a target
* [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin) – string – for the IntersectionObserver

The order of the array is important. The script just looks for the first matching media query.

```js
offsetMediaQueries: [
  {
    mediaQuery: "(min-width: 768px)",
    scrollOffset: -100,
    rootMargin: "-100px 0px 0px 0px",
  },
  {
    mediaQuery: "(min-width: 0px)",
    scrollOffset: -55,
    rootMargin: "-55px 0px 0px 0px",
  },
],
```
