# Accordion

Content accordions that toggle content when clicked.

## Installation

Install via [Bower](http://bower.io):
```
$ bower install websolutions/accordion --save
```

## Usage

The most basic example follows this DOM structure:
```html
<div class="accordion">
  <div class="item">
    <h3 class="header sprite-container">Accordion Item #1</h3>
    <div class="info">Teaser text.</div>
    <div class="more">
      <p>Accordion Content</p>
    </div>
  </div>
  <div class="item">
    <h3 class="header sprite-container">Accordion Item #2</h3>
    <div class="info">Teaser text.</div>
    <div class="more">
      <p>Accordion Content</p>
    </div>
  </div>
</div>
```

And is initialized like so:
```javascript
$(".accordion").wsol_accordion()
```

### Configuring

The jQuery plugin supports a number of configuration options:

Option                      | Type     | Description                                                          | Default
----------------------------|----------|----------------------------------------------------------------------|--------
`itemSelector`              | String   | Selector for accordion items                                         | `.item`
`headerSelector`            | String   | Selector for clickable header                                        | `.header`
`bodySelector`              | String   | Selector for content that will toggle                                | `.more`
`autoCollapse`              | Boolean  | Other accordion items should close when one is opened                | `true`
`openClass`                 | String   | Class name to apply when the accordion is opened                     | `open`
`closeClass`                | String   | Class name to apply when the accordion is closed                     | `close`
`startCollapsed`            | Boolean  | The accordion should be collapsed initially                          | `true`
`startFirstOpen`            | Boolean  | If the accordion should start collapsed, keep the first item open    | `false`
`spriteContainer`           | String   | Selector for the sprite container                                    | `.sprite-container`
`spriteClass`               | String   | Class name to apply to the sprite element                            | `toggle-sprite`
`customSprite`              | Function | Function to rebuild sprite contents                                  |
`toggleSpeed`               | Integer  | Animation length (ms)                                                | `500`
`beforeOpen`                | Function | Function called before the accordion item is opened                  | `null`
`beforeClose`               | Function | Function called before the accordion item is closed                  | `null`
`afterOpen`                 | Function | Function called after the accordion item is opened                   | `null`
`afterClose`                | Function | Function called after the accordion item is closed                   | `null`