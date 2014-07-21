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
    <h3 class="header sprite">Accordion Item #1</h3>
    <div class="info">Teaser text.</div>
    <div class="more">
      <p>Accordion Content</p>
    </div>
  </div>
  <div class="item">
    <h3 class="header sprite">Accordion Item #2</h3>
    <div class="info">Teaser text.</div>
    <div class="more">
      <p>Accordion Content</p>
    </div>
  </div>
</div>
```

And is initialized like so:
```javascript
$(".accordion").accordion()
```

### Configuring

The jQuery plugin supports a number of configuration options:

Option                      | Type     | Description                                                          | Default
----------------------------|----------|----------------------------------------------------------------------|--------
`HeaderSelector`            | String   | Selector for clickable header                                        | `.header`
`BodySelector`              | String   | Selector for content that will toggle                                | `.more`
`AccordionSelector`         | String   | Selector for accordion items                                         | `.item`
`TeaserSelector`            | String   | Selector for clickable teaser                                        | `.info`
`AutoCollapse`              | Boolean  | Other accordion items should close when one is opened                | `true`
`OpenClass`                 | String   | Class name to apply when the accordion is opened                     | `open`
`CloseClass`                | String   | Class name to apply when the accordion is closed                     | `close`
`StartCollapsed`            | Boolean  | The accordion should be collapsed initially                          | `true`
`Start1stOpen`              | Boolean  | If the accordion should start collapsed, keep the first item open    | `false`
`Sprite`                    | Object   | Configuration options for accordion sprites                          | (see below)
`ToggleSpeed`               | Integer  | Animation length (ms)                                                | `500`
`Debug`                     | Boolean  | Output debug statements in the console                               | `false`
`onPreLoad`                 | Function | Function called before the accordion is initialized                  | `null`
`onPostLoad`                | Function | Function called after the accordion passes all initialization tests  | `null`
`onLoadComplete`            | Function | Function called after the accordion is completely initialized        | `null`
`onDestroy`                 | Function | Function called before the accordion is destroyed                    | `null`
`onBeforeOpen`              | Function | Function called before the accordion item is opened                  | `null`
`onBeforeClose`             | Function | Function called before the accordion item is closed                  | `null`

#### Sprites

The `Sprite` object above can be configured as such:

Option                      | Type     | Description                                                          | Default
----------------------------|----------|----------------------------------------------------------------------|--------
`SpriteContainer`           | String   | Selector for clickable sprite (+/-)                                  | `.sprite`
`SpriteOpenClass`           | String   | Class name to apply when the accordion is opened                     | `open`
`SpriteCloseClass`          | String   | Class name to apply when the accordion is closed                     | `close`
`SpriteOpenText`            | String   | Text to display when the accordion is opened                         | `+`
`SpriteCloseText`           | String   | Text to display when the accordion is closed                         | `-`
`SpriteClass`               | String   | Class name to apply to the sprite container                          | `toggle-sprite`
