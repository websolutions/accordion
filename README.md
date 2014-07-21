# Accordion

Content accordions that toggle content when clicked.

## Usage

Example DOM structure:
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

Initialize with jQuery:
```javascript
$(".accordion").accordion()
```