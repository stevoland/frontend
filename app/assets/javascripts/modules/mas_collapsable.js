define(['jquery', 'common'], function($, MAS) {
  'use strict';

  var defaults = {
    name: 'not set',

    // Setup
    triggerEl: '.collapsible',
    targetEl: '.collapsible-section',
    targetType: 'class', // class / href / data-attr
    targetItems: '.item',
    viewAllButton: '.view-all',
    activeClass: 'is-on',
    inactiveClass: 'is-off',
    numberItemsToDisplay: 6,
    closeOffFocus: false,
    parentWrapper: false,
    accordion: false,
    showOnlyFirst: false,

    // Display options
    showText: true,
    showIcon: false,
    headingIcon: '<span class="icon icon--toggle"></span>',
    headingText: '<span class="visually-hidden js-collapsable-hidden">{{txt}}</span>',
    useButton: false,

    // Localised text strings
    textString: {
      showThisSection: MAS.text.show || 'Show',
      hideThisSection: MAS.text.hide || 'Hide'
    },

    // Callbacks
    onSelect: false,
    onFocusout: false
  };

  var Collapsible = function(opts) {
    this.o = $.extend({}, defaults, opts);
    this.sections = [];
    this.selected = false;

    var _this = this,
        triggers = $(this.o.triggerEl),
        l = triggers.length,
        i = 0;

    if (l === 0) {
      return MAS.warn && MAS.warn('mas_collapsible => no trigger elements in page: ' + this.o.triggerEl);
    }

    for (i; i < l; i++) {
      this._setupEach.call(this, i, triggers[i]);
    }

    if (this.o.closeOffFocus) {
      this.$parent = $(this.o.parentWrapper);

      if (!this.o.parentWrapper || !this.$parent.length) {
        MAS.warn && MAS.warn('options.parentWrapper should be set & valid for closeOffFocus to work');
        return;
      }

      this.$parent.on('focusout', $.proxy(_this._delayDomCheck, _this));
    }
  };

  var _isHidden = function(target, opts) {
    if (target.hasClass(opts.inactiveClass)) return true;
    if (target.hasClass(opts.activeClass)) return false;
    return target.is(':hidden');
  };

  var _getTarget = function($el, opts) {
    switch (opts.targetType) {
      case 'class':
        var $immediateSibling = $el.next(opts.targetEl),
            targetIsImmediateSibling = !!$immediateSibling.length;
        return (targetIsImmediateSibling) ? $immediateSibling : $el.siblings(opts.targetEl);
      case 'href':
        var href = $el.attr('href'),
            $t = $(href);
        return ($t.length) ? $t : false;
      default:
        return false;
    }
  };

  var _getItems = function($el, opt) {
    return $el.find(opt.targetItems);
  };

  var _getViewAll = function($el, opt) {
    return $el.find(opt.viewAllButton);
  };

  Collapsible.prototype._delayDomCheck = function() {
    setTimeout($.proxy(function() {
      if (this.$parent.find(document.activeElement).length === 0 && this.selected !== false) {
        // Callback
        if (typeof this.o.onFocusout === 'function') this.o.onFocusout(this);
        // Action
        this.hide(this.selected);
      }
    }, this), 300);
  };

  Collapsible.prototype._modifyButtonHTML = function(i) {
    var icon, txt;
    var trigger = this.sections[i].trigger;

    if (this.o.showText) {
      txt = this.o.headingText.replace('{{txt}}', this.o.textString.showThisSection);
    } else {
      txt = '';
    }

    if (this.o.showIcon) {
      icon = this.o.headingIcon;
    } else {
      icon = '';
    }

    if (this.o.useButton) {
      var buttonTitle = trigger.text();

      if (trigger[0].nodeName === 'A') {
        // Anchor => replace elemnt
        var newEl = $('<a></a>')
          .addClass(trigger[0].className)
          .attr('id', trigger[0])
          .text(icon + txt + buttonTitle);
        // add new
        trigger.after(newEl);
        // remove old
        trigger.remove();
        trigger = newEl;
      } else {
        // Anything else => insert button inside
        trigger.html('<button class="unstyled-button">' + icon + txt + buttonTitle + '</button>');
      }
    } else {
      // Use aria-role
      trigger.attr('aria-role', 'button');
      trigger.attr('tabindex', '0');
      trigger.prepend(icon);
      trigger.prepend(txt);
    }

    if (this.o.showIcon) this.sections[i].icon = trigger.find('.icon');
    if (this.o.showText) this.sections[i].txt = trigger.find('.js-collapsable-hidden');
  };

  Collapsible.prototype._setupEach = function(i, el) {
    var $el = $(el),
        _this = this,
        _target = _getTarget($el, _this.o),
        _items = _getItems(_target, _this.o),
        _viewAll = _getViewAll(_target, _this.o);

    this.sections[i] = {
      index: i,
      items:  _items,
      trigger: $el,
      target: _target,
      viewAll: _viewAll,
      hidden: _isHidden(_target, _this.o)
    };

    // Dont modify or bind events if no target element
    if (!this.sections[i].target.length) return;

    // Set show / hide states based on options
    if (this.o.showOnlyFirst) {
      this.sections[i].hidden = (i === 0) ? false : true;
    }

    // For accordions, if there is a selected item, hide other items
    if (this.o.accordion && this.selected !== false && this.sections[i].hidden) {
      this.sections[i].hidden = true;
    }

    // Update Button HTML to make accessible
    this._modifyButtonHTML(i);

    // Set initial state
    this.setVisibility(!this.sections[i].hidden, i);

    // Bind events
    this.sections[i].trigger.on('click', i, function(e) {
      e.preventDefault();
      // Check for callbacks
      if (typeof _this.o.onSelect === 'function') _this.o.onSelect(_this.sections[i]);
      _this.setVisibility(_this.sections[i].hidden, i);

      if (_this.sections[i].items.length <= _this.o.numberItemsToDisplay) {
        hideElement(_this.sections[i].viewAll, _this);
      }
    });

    this.sections[i].viewAll.on('click', i, function(e) {
      e.preventDefault();
      showElement(_this.sections[i].items, _this);
      hideElement(_this.sections[i].viewAll, _this);
    });

    // Accessibility support for spacebar
    this.sections[i].trigger.on('keypress', function(e) {
      if (e.which === 32) {
        if (_this.sections[i].trigger[0].nodeName !== 'BUTTON') {
          if (!_this.o.useButton) {
            e.preventDefault();
            _this.sections[i].trigger.trigger('click');
          }
        }
      }
    });
    return this;
  };

  Collapsible.prototype.setVisibility = function(show, i) {
    var method = (show) ? 'show' : 'hide';
    this[method](i);
    return this;
  };

  function publishEvent(userInitiated, data) {
    if (userInitiated) {
      data.module = 'collapsable';
      MAS.publish('collapsable', data);
      MAS.publish('analytics:trigger', data);
    }
  }

  Collapsible.prototype.show = function(i, userInitiated) {
    publishEvent(userInitiated, {
      name: this.o.name,
      index: i,
      action: 'show'
    });

    var section = this.sections[i];
    var itemsToDisplay = section.items.slice(0, this.o.numberItemsToDisplay);

    section.trigger.removeClass(this.o.inactiveClass).addClass(this.o.activeClass);

    showElement(section.target, this);
    showElement(itemsToDisplay, this);
    showElement(section.viewAll, this);

    section.hidden = false;
    if (this.o.showText) section.txt.text(this.o.textString.hideThisSection + ' ');
    if (this.o.accordion && (this.selected !== false && this.selected !== i)) {
      this.hide(this.selected, false);
    }
    this.selected = i;
    return this;
  };

  function hideElement(element, conf) {
    element.removeClass(conf.o.activeClass).addClass(conf.o.inactiveClass);
    element.attr('aria-hidden', 'true');
  }

  function showElement(element, conf) {
    element.removeClass(conf.o.inactiveClass).addClass(conf.o.activeClass);
    element.attr('aria-hidden', 'false');
  }

  Collapsible.prototype.hide = function(i, userInitiated) {
    publishEvent(userInitiated, {
      name: this.o.name,
      index: i,
      action: 'hide'
    });

    var section = this.sections[i];
    var items = section.items;
    section.trigger.removeClass(this.o.activeClass).addClass(this.o.inactiveClass);

    hideElement(section.target, this);
    hideElement(section.viewAll, this);
    hideElement(items, this);

    section.hidden = true;

    if (this.o.showText) {
      section.txt.text(this.o.textString.showThisSection + ' ');
    }

    return this;
  };

  return Collapsible;
});
