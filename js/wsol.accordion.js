if ( typeof WSOL == "undefined" ) {
  var WSOL = {"Accordions":[]};
} else {
  WSOL.Accordions = [];
};

WSOL["Accordions"].push({});
WSOL["Accordions"][0].Setting = [];
WSOL["Accordions"][0].$Accordions = [];
WSOL["Accordions"].i = 0;
WSOL["Accordions"].init = true;

(function ($) {
  var defaults = {
    HeaderSelector: ".header",          // jQuery selector for clickable header
    BodySelector: ".more",      // jQuery selector for content that will toggle
    AccordionSelector: ".item", // jQuery selector for accordion items
    TeaserSelector: ".info",    // jQuery selector for clickable teaser
    AutoCollapse: true,            // should other accordion items close when one is opened
    OpenClass: "open",             // class to be applied when accordion is open
    CloseClass: "close",           // class to be applied when accordion is closed
    StartCollapsed: true,          // should the accordions start in the closed state
    Start1stOpen: false,             // except for the first item
    Sprite: {
      SpriteContainer: ".sprite",       // jQuery selector for clickable sprite (+/-)
      SpriteOpenClass: "open",     // class to be applied when accordion is open
      SpriteCloseClass: "close",   // class to be applied when accordion is closed
      SpriteOpenText: "-",         // text to display when accordion is open ("" if an image will be used)
      SpriteCloseText: "+",        // text to display when accoridon is closed ("" if an image will be used)
      SpriteClass: "toggle-sprite"  // class to be added to the sprite container
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

  var EventSelector = "",
    i = WSOL["Accordions"].i,
    init = WSOL["Accordions"].init;

  function WriteLog(message) {
    if (WSOL["Accordions"][i].Setting.Debug && console && console.log) {
      if (typeof message == 'string') {
        console.log('WSOL Accordion: "' + message + '"');
      }
      else {
        console.log(message);
      }
    }
    return false;
  }

  function Init(e, options) {
    if ( !init ) {
      WSOL["Accordions"].push({});
    };
    init = false;
    var i = WSOL["Accordions"].length - 1;

    WSOL["Accordions"][i].Setting = [];
    WSOL["Accordions"][i].$Accordions = [];
    WriteLog(i, WSOL["Accordions"]);

    if(typeof options !== "undefined") {
      WSOL["Accordions"][i].Setting = $.extend(true, {}, defaults, options);
    } else {
      WSOL["Accordions"][i].Setting = defaults;
    }

    WriteLog(e);
    WriteLog(WSOL["Accordions"][i].Setting);
    WriteLog("Initializing Accordions");

    e.each( function(j) {

      if (typeof WSOL["Accordions"][i].Setting.onPreLoad === "function") {
        WriteLog("Calling PreLoad");
        WSOL["Accordions"][i].Setting.onPreLoad();
      }

      // Check if AccordionSelector is a jQuery Object otherwise assume string
      if (typeof WSOL["Accordions"][i].Setting.AccordionSelector === "string") {
        WSOL["Accordions"][i].$Accordions[j] = $(this).attr('data-accordion',i).attr('data-accordion-number',j).children(WSOL["Accordions"][i].Setting.AccordionSelector);
        WriteLog(WSOL["Accordions"][i].$Accordions);
      }

      if (WSOL["Accordions"][i].$Accordions.length <= 0) {
        WriteLog("Error: No Accordions Found exiting");
        return;
      }

      // Check if HeaderSelector is a jQuery Object otherwise assume string
      if (typeof WSOL["Accordions"][i].Setting.HeaderSelector === "string") {
        WSOL["Accordions"][i].Setting.EventSelector = WSOL["Accordions"][i].Setting.HeaderSelector;
        WSOL["Accordions"][i].$Accordions[j].HeaderSelector = WSOL["Accordions"][i].$Accordions[j].find(WSOL["Accordions"][i].Setting.HeaderSelector);
        WSOL["Accordions"][i].$Accordions[j].HeaderSelector.css("cursor", "pointer");
      }

      if (!(WSOL["Accordions"][i].$Accordions[j].HeaderSelector instanceof jQuery) || WSOL["Accordions"][i].$Accordions[j].HeaderSelector.length <= 0) {
        WriteLog("Error: No Headings found Exiting");
        return;
      }

      if (typeof WSOL["Accordions"][i].Setting.onPostLoad === "function") {
        WriteLog("Calling PostLoad");
        WSOL["Accordions"][i].Setting.onPostLoad();
      }

      if (typeof WSOL["Accordions"][i].Setting.Sprite.SpriteContainer === "string") {
        var spriteText = WSOL["Accordions"][i].Setting.StartCollapsed ? WSOL["Accordions"][i].Setting.Sprite.SpriteCloseText : WSOL["Accordions"][i].Setting.Sprite.SpriteOpenText;
        WSOL["Accordions"][i].Setting.Sprite.SpriteSelector = "." + WSOL["Accordions"][i].Setting.Sprite.SpriteClass;
        WSOL["Accordions"][i].$Accordions[j].find(WSOL["Accordions"][i].Setting.Sprite.SpriteContainer).append($("<a>" + spriteText + "</a>").addClass(WSOL["Accordions"][i].Setting.Sprite.SpriteClass));
      }

      if (typeof WSOL["Accordions"][i].Setting.TeaserSelector === "string") {
        WSOL["Accordions"][i].Setting.EventSelector = WSOL["Accordions"][i].Setting.EventSelector + ", " + WSOL["Accordions"][i].Setting.TeaserSelector;
      }

      if (typeof WSOL["Accordions"][i].Setting.BodySelector === "string" && WSOL["Accordions"][i].Setting.StartCollapsed) {
        CloseAll($(this), true );
      }

      // If starting open, OpenAll() needs to set up accordion to close on first click
      if (!WSOL["Accordions"][i].Setting.StartCollapsed) {
        OpenAll($(this));
      }

      WSOL["Accordions"][i].$Accordions[j].find(WSOL["Accordions"][i].Setting.EventSelector).click( function(e) {
        e.preventDefault();
        $(this).on("click", ClickHandler(this) );
      });

      if (typeof WSOL["Accordions"][i].Setting.onLoadComplete === "function") {
        WriteLog("Calling LoadComplete");
        WSOL["Accordions"][i].Setting.onLoadComplete();
      }

    });

    return true;
  }

  function ClickHandler(e) {
    var i = $(e).closest('[data-accordion]').data('accordion');
    WriteLog("Click Handler");
    Setting = WSOL["Accordions"][i].Setting;
    WriteLog(Setting);

    $parent = $(e).parents(Setting.AccordionSelector);
    $sprite = $parent.find(Setting.Sprite.SpriteSelector);
    $body = $parent.find(Setting.BodySelector);

    WriteLog($parent);
    WriteLog($sprite);
    WriteLog($body);

    if( $parent.hasClass(Setting.OpenClass) ) {
      CloseElm( $parent );
    } else {
      if ( Setting.StartCollapsed ) {
        if ( Setting.AutoCollapse ) {
          CloseAll($(e).closest('[data-accordion]'), false);
        };
      };

      OpenElm( $parent );
    }
  }

  function OpenElm(elm) {
    try {
      WSOL["Accordions"][$(elm).parents("[data-accordion]").data('accordion')].Setting.onBeforeOpen();
    } catch (err) {
      WriteLog(err);
    };

    $(elm)
      .removeClass(Setting.CloseClass)
      .addClass(Setting.OpenClass);
    $(elm).find(Setting.Sprite.SpriteSelector)
      .removeClass(Setting.Sprite.SpriteCloseClass)
      .addClass(Setting.Sprite.SpriteOpenClass)
      .html(Setting.Sprite.SpriteOpenText);
    $(elm).find(Setting.BodySelector)
      .slideDown(Setting.ToggleSpeed);
  }

  function CloseElm(elm) {
    try {
      WSOL["Accordions"][$(elm).parents("[data-accordion]").data('accordion')].Setting.onBeforeClose();
    } catch (err) {
      WriteLog(err);
    };

    $(elm)
      .removeClass(Setting.OpenClass)
      .addClass(Setting.CloseClass);
    $(elm).find(Setting.Sprite.SpriteSelector)
      .removeClass(Setting.Sprite.SpriteOpenClass)
      .addClass(Setting.Sprite.SpriteCloseClass)
      .html(Setting.Sprite.SpriteCloseText);
    $(elm).find(Setting.BodySelector)
      .slideUp(Setting.ToggleSpeed);
  }

  function OpenAll(elm) {
    var i = $(elm).data('accordion'),
      j = $(elm).data('accordion-number');

    Setting = WSOL["Accordions"][i].Setting;

    WSOL["Accordions"][i].$Accordions[j]
      .removeClass(Setting.CloseClass)
      .addClass(Setting.OpenClass);
    WSOL["Accordions"][i].$Accordions[j].find(Setting.Sprite.SpriteSelector)
      .removeClass(Setting.Sprite.SpriteCloseClass)
      .addClass(Setting.Sprite.SpriteOpenClass)
      .html(Setting.Sprite.SpriteOpenText);
    WSOL["Accordions"][i].$Accordions[j].find(Setting.BodySelector).slideDown(Setting.ToggleSpeed);
  }

  function CloseAll(elm, firstRun) {
    var i = $(elm).data('accordion'),
      j = $(elm).data('accordion-number'),
      $accordions_to_open = [],
      $accordions_to_close = [];

    if (firstRun) {
      WSOL["Accordions"][i].$Accordions[j].each( function(index) {
        if ( WSOL["Accordions"][i].Setting.Start1stOpen && index == 0 ) {
          $accordions_to_open.push( $(this) );
        } else {
          if ( $(this).data('expanded') ) {
            $accordions_to_open.push( $(this) );
          } else {
            $accordions_to_close.push( $(this) );
          };
        };
      });
    } else {
      $accordions_to_close = WSOL["Accordions"][i].$Accordions[j];
    }

    Setting = WSOL["Accordions"][i].Setting;

    for (var i = $accordions_to_close.length - 1; i >= 0; i--) {
      CloseElm( $accordions_to_close[i] );
    };

    for (var i = $accordions_to_open.length - 1; i >= 0; i--) {
      OpenElm( $accordions_to_open[i] );
    };
  }

  function Destroy(i) {
    Setting = WSOL["Accordions"][i].Setting;

    WSOL["Accordions"][i].$Accordions.off("click", EventSelector, ClickHandler);
    WSOL["Accordions"][i].$Accordions.find(Setting.Sprite.SpriteSelector).remove();
    WSOL["Accordions"][i].$Accordions.find(Setting.BodySelector).slideDown(Setting.ToggleSpeed);

    if (typeof Setting.onDestroy === "function") {
      Setting.onDestroy();
    }
  }

  $.fn.accordion = function (method) {
    return Init(this, method);
  };
})(jQuery);