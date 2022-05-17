/**
 * wsol.accordion.js 5.1.0
 * http://github.com/websolutions/accordion
 */
 
 ;(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'), window, document);
  } else {
    factory(jQuery, window, document);
  }
}(function ($, window, document, undefined) {
    if (!$.wsol) {
        $.wsol = {};
    }

    /**
     * Accordion Item
     */
    $.wsol.accordionItem = function (el, options) {
        var base = this,
            uniqueId = Math.round( performance.now() * Date.now() * Math.random() ),
            counter = 1
            ;

        base.$el = $(el);
        base.el = el;

        base.$el.data("wsol.accordionItem", base);

        base.init = function () {
            var itemId = uniqueId + '-' + counter;
            base.options = $.extend({}, $.wsol.accordionItem.defaultOptions, options);

            base.$header = base.$el.find(base.options.headerSelector);
            base.$body = base.$el.find(base.options.bodySelector);
            base.$spriteContainer = base.$el.find(base.options.spriteContainer);
            base.$sprite = $("<div />").addClass(base.options.spriteClass).appendTo(base.$spriteContainer);
            
            if (base.$header.find('.expandable-header-wrap').length) {
                base.$header.wrapInner("<button class='accordion-button'></button>");
            } else {
                base.$header.wrapInner("<button class='accordion-button'><span class='expandable-header-wrap'></span></button>");
            }
            base.$headerButton = base.$header.find('button');
            base.$headerButton.attr('id', itemId).attr('aria-expanded', false);
            
            base.toggle(!base.options.startCollapsed);
            
            base.$body.attr('aria-labelledby', itemId);

            if (base.$body.attr('id') !== undefined) {
                itemId = base.$body.attr('id');
                base.$headerButton.attr('aria-controls', itemId);
            } else {
                base.$body.attr('id', itemId + '-' + 1 );
                base.$headerButton.attr('aria-controls', itemId + '-' + 1 );
            }            

            // Handle events
            base.$headerButton.on(base.options.triggerEvent + ".wsol.accordionItem", base._triggerHandler);
        };

        base._rebuildSprite = function () {
            if (base.options.customSprite != null) {
                base.$sprite.html(base.options.customSprite.call(base, base));
            }
        };

        base._triggerHandler = function (event) {
            event.preventDefault();

            base.toggle();
        };

        base.toggle = function (state) {
            state = typeof state !== 'undefined' ? state : !base.active;

            if (state) {
                base.open();
            } else {
                base.close();
            }
        };

        base.open = function () {
            base.active = true;
            if (base.options.beforeOpen != null) {
                base.options.beforeOpen.call(base, base);
            }

            base.$el
                .removeClass(base.options.closeClass)
                .addClass(base.options.openClass);

            base.$headerButton.attr('aria-expanded', true);

            base.$body.stop().slideDown(base.options.toggleSpeed, function () {
                base.$body.height('');
                if (base.options.afterOpen != null) {
                    base.options.afterOpen.call(base, base);
                }
            });

            base._rebuildSprite();
        };

        base.close = function () {
            base.active = false;
            if (base.options.beforeClose != null) {
                base.options.beforeClose.call(base, base);
            }

            base.$el
                .removeClass(base.options.openClass)
                .addClass(base.options.closeClass);

            base.$headerButton.attr('aria-expanded', false);

            base.$body.stop().slideUp(base.options.toggleSpeed, function () {
                base.$body.height('');
                if (base.options.afterClose != null) {
                    base.options.afterClose.call(base, base);
                }
            });

            base._rebuildSprite();
        };

        base.destroy = function () {
            base.$sprite.remove();
            base.$body.stop().css("display", "").attr('style', '').removeAttr('aria-labelledby');
            base.$headerButton.find('.expandable-header-wrap').unwrap();

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
        customSprite: function (item) {
            return "<i>" + (item.active ? "-" : "+") + "</i>";
        },
        beforeOpen: null,
        beforeClose: null,
        afterOpen: null,
        afterClose: null
    };

    $.fn.wsol_accordionItem = function (options) {
        return this.each(function () {
            new $.wsol.accordionItem(this, options);
        });
    };

    /**
     * Accordion
     */
    $.wsol.accordion = function (el, options) {
        var base = this;

        base.$el = $(el);
        base.el = el;

        base.$el.data("wsol.accordion", base);

        base.init = function () {
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
                .map(function () { return $(this).data("wsol.accordionItem") });

            if (base.options.startCollapsed && base.options.startFirstOpen) {
                base.items[0].open();
            }
        };

        base._openHandler = function (item) {
            if (base.options.autoCollapse) {
                base.items.each(function () {
                    if (this !== item) {
                        this.close();
                    }
                });
            }

            if (base.options.beforeOpen != null) {
                base.options.beforeOpen.call(base, item);
            }
        };

        base._closeHandler = function (item) {
            if (base.options.beforeClose != null) {
                base.options.beforeClose.call(base, item);
            }
        };

        base.destroy = function () {
            base.items.each(function () {
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

    $.fn.wsol_accordion = function (options) {
        return this.each(function () {
            new $.wsol.accordion(this, options);
        });
    };

}));
