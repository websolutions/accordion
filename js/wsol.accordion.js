/**
 * wsol.accordion.js 4.0.0
 * http://github.com/websolutions/accordion
 */

;(function ($, window, document, undefined) {
  if (!$.wsol) {
    $.wsol = {};
  }

  /**
   * Accordion Item
   */
  $.wsol.accordionItem = function(el, options) {
    var base = this;

    base.$el = $(el);
    base.el = el;

    base.$el.data("wsol.accordionItem", base);

    base.init = function() {
      base.options = $.extend({}, $.wsol.accordionItem.defaultOptions, options);

      base.$header = base.$el.find(base.options.headerSelector);
      base.$body = base.$el.find(base.options.bodySelector);
      base.$spriteContainer = base.$el.find(base.options.spriteContainer);
      base.$sprite = $("<div />").addClass(base.options.spriteClass).appendTo(base.$spriteContainer);
      base.toggle(!base.options.startCollapsed);

      // Handle events
      base.$header.on(base.options.triggerEvent + ".wsol.accordionItem", base._triggerHandler);
    };

    base._rebuildSprite = function() {
      if (base.options.customSprite != null) {
        base.$sprite.html(base.options.customSprite.call(base, base));
      }
    };

    base._triggerHandler = function(event) {
      $(this).is("a") && event.preventDefault();

      base.toggle();
    };

    base.toggle = function(state) {
      state = typeof state !== 'undefined' ? state : !base.active;

      if (state) {
        base.open();
      } else {
        base.close();
      }
    };

    base.open = function() {
      base.active = true;
      if (base.options.beforeOpen != null) {
        base.options.beforeOpen.call(base, base);
      }

      base.$el
        .removeClass(base.options.closeClass)
        .addClass(base.options.openClass)
      base.$body.stop().slideDown(base.options.toggleSpeed);
      base._rebuildSprite();
    };

    base.close = function() {
      base.active = false;
      if (base.options.beforeClose != null) {
        base.options.beforeClose.call(base, base);
      }

      base.$el
        .removeClass(base.options.openClass)
        .addClass(base.options.closeClass)
      base.$body.stop().slideUp(base.options.toggleSpeed);
      base._rebuildSprite();
    };

    base.destroy = function() {
      base.$sprite.remove();
      base.$body.stop().css("display", "");

      // Remove events
      base.$header.off(".wsol.accordionItem");
    };

    base.init();
  };

  $.wsol.accordionItem.defaultOptions = {
    headerSelector: ".header",
    bodySelector: ".more",
    openClass: "open",
    closeClass: "close",
    startCollapsed: true,
    toggleSpeed: 500,
    triggerEvent: "click",
    spriteContainer: ".sprite-container",
    spriteClass: "sprite",
    customSprite: function(item) {
      return "<i>" + (item.active ? "-" : "+") + "</i>";
    },
    beforeOpen: null,
    beforeClose: null
  };

  $.fn.wsol_accordionItem = function(options) {
    return this.each(function() {
      new $.wsol.accordionItem(this, options);
    });
  };

  /**
   * Accordion
   */
  $.wsol.accordion = function(el, options) {
    var base = this;

    base.$el = $(el);
    base.el = el;

    base.$el.data("wsol.accordion", base);

    base.init = function() {
      base.options = $.extend(
        {},
        $.wsol.accordionItem.defaultOptions,
        $.wsol.accordion.defaultOptions,
        options
      );
      base.items = base.$el.find(base.options.itemSelector)
        .wsol_accordionItem($.extend({}, base.options, {
          beforeOpen: base._openHandler,
          beforeClose: base._closeHandler
        }))
        .map(function() { return $(this).data("wsol.accordionItem") });

      if (!base.options.startCollapsed && base.options.startFirstOpen) {
        base.items.eq(0).open();
      }
    };

    base._openHandler = function(item) {
      if (base.options.autoCollapse) {
        base.items.each(function() {
          if (this !== item) {
            this.close();
          }
        });
      }

      if (base.options.beforeOpen != null) {
        base.options.beforeOpen.call(base, item);
      }
    };

    base._closeHandler = function(item) {
      if (base.options.beforeClose != null) {
        base.options.beforeClose.call(base, item);
      }
    };

    base.destroy = function() {
      base.items.each(function() {
        this.destroy();
      });
    };

    base.init();
  };

  $.wsol.accordion.defaultOptions = {
    itemSelector: "> .item",
    autoCollapse: true,
    startFirstOpen: false
  };

  $.fn.wsol_accordion = function(options) {
    return this.each(function() {
      new $.wsol.accordion(this, options);
    });
  };

})(jQuery, window, document);
