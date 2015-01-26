/**
 * wsol.accordion.js 3.5.0
 * http://github.com/websolutions/accordion
 */


if ( typeof WSOL == "undefined" ) {
  var WSOL = {"Accordions":[]};
} else {
  WSOL.Accordions = [];
}

WSOL.Accordions.push({});
WSOL.Accordions[0].Setting = [];
WSOL.Accordions[0].$Accordions = [];
WSOL.Accordions.i = 0;
WSOL.Accordions.init = true;

( function ( $, window, document, undefined ) {
  if ( !$.wsol ) {
    $.wsol = {};
  }

  $.wsol.accordion = function( el, options ) {
    var base = this;

    base.$el = $(el);
    base.el = el;
    base.$el.data("wsol.accordion", base);

    var EventSelector = "";

    base.WriteLog = function( message ) {
      if (WSOL.Accordions[WSOL.Accordions.i].Setting.Debug && console && console.log) {
        if (typeof message == 'string') {
          console.log('WSOL Accordion: "' + message + '"');
        }
        else {
          console.log(message);
        }
      }
      return false;
    };

    base.Init = function( options ) {
      if ( !WSOL.Accordions.init ) {
        WSOL.Accordions.push({});
      }
      WSOL.Accordions.init = false;
      var i = WSOL.Accordions.length - 1;


      // WSOL.Accordions[i].Setting = [];
      WSOL.Accordions[i].$Accordions = [];
      base.WriteLog(i, WSOL.Accordions);

      WSOL.Accordions[i].Setting = $.extend({}, $.wsol.accordion.defaultOptions, options);

      // if(typeof options !== "undefined") {
      //   WSOL.Accordions[i].Setting = $.extend(true, {}, defaults, options);
      // } else {
      //   WSOL.Accordions[i].Setting = defaults;
      // }

      base.WriteLog(base.$el);
      base.WriteLog(WSOL.Accordions[i].Setting);
      base.WriteLog("Initializing Accordions");

      base.$el.each( function(j) {

        if (typeof WSOL.Accordions[i].Setting.onPreLoad === "function") {
          base.WriteLog("Calling PreLoad");
          WSOL.Accordions[i].Setting.onPreLoad();
        }

        // Check if AccordionSelector is a jQuery Object otherwise assume string
        if (typeof WSOL.Accordions[i].Setting.AccordionSelector === "string") {
          WSOL.Accordions[i].$Accordions[j] = $(this).attr('data-accordion',i).attr('data-accordion-number',j).children(WSOL.Accordions[i].Setting.AccordionSelector);
          base.WriteLog(WSOL.Accordions[i].$Accordions);
        }

        if (WSOL.Accordions[i].$Accordions.length <= 0) {
          base.WriteLog("Error: No Accordions Found exiting");
          return;
        }

        // Check if HeaderSelector is a jQuery Object otherwise assume string
        if (typeof WSOL.Accordions[i].Setting.HeaderSelector === "string") {
          WSOL.Accordions[i].Setting.EventSelector = WSOL.Accordions[i].Setting.HeaderSelector;
          WSOL.Accordions[i].$Accordions[j].HeaderSelector = WSOL.Accordions[i].$Accordions[j].find(WSOL.Accordions[i].Setting.HeaderSelector);
          WSOL.Accordions[i].$Accordions[j].HeaderSelector.css("cursor", "pointer");
        }

        if (!(WSOL.Accordions[i].$Accordions[j].HeaderSelector instanceof jQuery) || WSOL.Accordions[i].$Accordions[j].HeaderSelector.length <= 0) {
          base.WriteLog("Error: No Headings found Exiting");
          return;
        }

        if (typeof WSOL.Accordions[i].Setting.onPostLoad === "function") {
          base.WriteLog("Calling PostLoad");
          WSOL.Accordions[i].Setting.onPostLoad();
        }

        if (typeof WSOL.Accordions[i].Setting.Sprite.SpriteContainer === "string") {
          var spriteText = WSOL.Accordions[i].Setting.StartCollapsed ? WSOL.Accordions[i].Setting.Sprite.SpriteCloseText : WSOL.Accordions[i].Setting.Sprite.SpriteOpenText;
          WSOL.Accordions[i].Setting.Sprite.SpriteSelector = "." + WSOL.Accordions[i].Setting.Sprite.SpriteClass;
          WSOL.Accordions[i].$Accordions[j].find(WSOL.Accordions[i].Setting.Sprite.SpriteContainer).append($("<a>" + spriteText + "</a>").addClass(WSOL.Accordions[i].Setting.Sprite.SpriteClass));
        }

        if (typeof WSOL.Accordions[i].Setting.TeaserSelector === "string") {
          WSOL.Accordions[i].Setting.EventSelector = WSOL.Accordions[i].Setting.EventSelector + ", " + WSOL.Accordions[i].Setting.TeaserSelector;
        }

        if (typeof WSOL.Accordions[i].Setting.BodySelector === "string" && WSOL.Accordions[i].Setting.StartCollapsed) {
          base.CloseAll($(this), true );
        }

        // If starting open, OpenAll() needs to set up accordion to close on first click
        if (!WSOL.Accordions[i].Setting.StartCollapsed) {
          base.OpenAll($(this));
        }

        WSOL.Accordions[i].$Accordions[j].find(WSOL.Accordions[i].Setting.EventSelector).click( function(e) {
          e.preventDefault();
          $(this).on("click", base.ClickHandler(this) );
        });

        if (typeof WSOL.Accordions[i].Setting.onLoadComplete === "function") {
          base.WriteLog("Calling LoadComplete");
          WSOL.Accordions[i].Setting.onLoadComplete();
        }

      });

      return true;
    };

    base.ClickHandler = function ( e ) {
      var i = $(e).closest('[data-accordion]').data('accordion');
      base.WriteLog("Click Handler");
      Setting = WSOL.Accordions[i].Setting;
      base.WriteLog(Setting);

      $parent = $(e).parents(Setting.AccordionSelector);
      $sprite = $parent.find(Setting.Sprite.SpriteSelector);
      $body = $parent.find(Setting.BodySelector);

      base.WriteLog($parent);
      base.WriteLog($sprite);
      base.WriteLog($body);

      if( $parent.hasClass(Setting.OpenClass) ) {
        base.CloseElm( $parent );
      } else {
        if ( Setting.StartCollapsed ) {
          if ( Setting.AutoCollapse ) {
            base.CloseAll($(e).closest('[data-accordion]'), false);
          }
        }

        base.OpenElm( $parent );
      }
    };

    base.OpenElm = function( elm ) {
      try {
        WSOL.Accordions[$(elm).parents("[data-accordion]").data('accordion')].Setting.onBeforeOpen();
      } catch (err) {
        base.WriteLog(err);
      }

      $(elm)
        .removeClass(Setting.CloseClass)
        .addClass(Setting.OpenClass);
      $(elm).find(Setting.Sprite.SpriteSelector)
        .removeClass(Setting.Sprite.SpriteCloseClass)
        .addClass(Setting.Sprite.SpriteOpenClass)
        .html(Setting.Sprite.SpriteOpenText);
      $(elm).find(Setting.BodySelector)
        .slideDown(Setting.ToggleSpeed);
    };

    base.CloseElm = function( elm ) {
      try {
        WSOL.Accordions[$(elm).parents("[data-accordion]").data('accordion')].Setting.onBeforeClose();
      } catch (err) {
        base.WriteLog(err);
      }

      $(elm)
        .removeClass(Setting.OpenClass)
        .addClass(Setting.CloseClass);
      $(elm).find(Setting.Sprite.SpriteSelector)
        .removeClass(Setting.Sprite.SpriteOpenClass)
        .addClass(Setting.Sprite.SpriteCloseClass)
        .html(Setting.Sprite.SpriteCloseText);
      $(elm).find(Setting.BodySelector)
        .slideUp(Setting.ToggleSpeed);
    };

    base.OpenAll = function( elm ) {
      var i = $(elm).data('accordion'),
        j = $(elm).data('accordion-number');

      Setting = WSOL.Accordions[i].Setting;

      WSOL.Accordions[i].$Accordions[j]
        .removeClass(Setting.CloseClass)
        .addClass(Setting.OpenClass);
      WSOL.Accordions[i].$Accordions[j].find(Setting.Sprite.SpriteSelector)
        .removeClass(Setting.Sprite.SpriteCloseClass)
        .addClass(Setting.Sprite.SpriteOpenClass)
        .html(Setting.Sprite.SpriteOpenText);
      WSOL.Accordions[i].$Accordions[j].find(Setting.BodySelector).slideDown(Setting.ToggleSpeed);
    };

    base.CloseAll = function( elm, firstRun ) {
      var i = $(elm).data('accordion'),
        j = $(elm).data('accordion-number'),
        $accordions_to_open = [],
        $accordions_to_close = [];

      if (firstRun) {
        WSOL.Accordions[i].$Accordions[j].each( function(index) {
          if ( WSOL.Accordions[i].Setting.Start1stOpen && index === 0 ) {
            $accordions_to_open.push( $(this) );
          } else {
            if ( $(this).data('expanded') ) {
              $accordions_to_open.push( $(this) );
            } else {
              $accordions_to_close.push( $(this) );
            }
          }
        });
      } else {
        $accordions_to_close = WSOL.Accordions[i].$Accordions[j];
      }

      Setting = WSOL.Accordions[i].Setting;

      for ( i = $accordions_to_close.length - 1; i >= 0; i-- ) {
        base.CloseElm( $accordions_to_close[i] );
      }

      for ( i = $accordions_to_open.length - 1; i >= 0; i-- ) {
        base.OpenElm( $accordions_to_open[i] );
      }
    };

    base.destroy = function() {
      i = $(this.$el).data('accordion');
      Setting = WSOL.Accordions[i].Setting;

      WSOL.Accordions[i].$Accordions[0].each( function() { 
        $(this).find( Setting.HeaderSelector ).off( "click" ).css( "cursor", "default" );
        $(this).find( Setting.TeaserSelector ).off( "click" ).css( "cursor", "default" );
        $(this).find( Setting.Sprite.SpriteSelector ).remove();
        $(this).find( Setting.BodySelector ).show();
        $(this).data( "accordion", null ).removeAttr( "data-accordion" );
        $(this).data( "accordion-number", null ).removeAttr( "data-accordion-number" );
      });

      if (typeof Setting.onDestroy === "function") {
        Setting.onDestroy();
      }
    };

    base.Init( options );
  };

  $.wsol.accordion.defaultOptions = {
    AccordionSelector: ".item",    // jQuery selector for accordion items
    HeaderSelector: ".header",     // jQuery selector for clickable header
    BodySelector: ".more",         // jQuery selector for content that will toggle
    TeaserSelector: ".info",       // jQuery selector for clickable teaser
    AutoCollapse: true,            // should other accordion items close when one is opened
    OpenClass: "open",             // class to be applied when accordion is open
    CloseClass: "close",           // class to be applied when accordion is closed
    StartCollapsed: true,          // should the accordions start in the closed state
    Start1stOpen: false,           // except for the first item
    Sprite: {
      SpriteContainer: ".sprite",  // jQuery selector for clickable sprite (+/-)
      SpriteOpenClass: "open",     // class to be applied when accordion is open
      SpriteCloseClass: "close",   // class to be applied when accordion is closed
      SpriteOpenText: "-",         // text to display when accordion is open ("" if an image will be used)
      SpriteCloseText: "+",        // text to display when accoridon is closed ("" if an image will be used)
      SpriteClass: "toggle-sprite" // class to be added to the sprite container
    },
    ToggleSpeed: 500,              // animation length (in ms)
    Debug: false,                  // output debug statments in the console
    onPreLoad: null,               // callback function
    onPostLoad: null,              // callback function
    onLoadComplete: null,          // callback function
    onDestroy: null,               // callback function
    onBeforeOpen: null,            // callback function
    onBeforeClose: null            // callback function
  };

  $.fn.wsol_accordion = function (options) {
    return this.each( function() {
      new $.wsol.accordion( this, options );
    });
  };

})(jQuery, window, document);
