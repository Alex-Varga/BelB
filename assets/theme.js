window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function () {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

theme.Product = (function () {
	let selectors = {
		addToCart: '[data-add-to-cart]',
		addToCartText: '[data-add-to-cart-text]',
		addToCartWrapper: '[data-add-to-cart-wrapper]',
		comparePrice: '[data-compare-price]',
		comparePriceText: '[data-compare-text]',
		originalSelectorId: '[data-product-select]',
		priceWrapper: '[data-price-wrapper]',
		productFeaturedImage: '[data-product-featured-image]',
		productJson: '[data-product-json]',
		productPrice: '[data-product-price]',
		productThumbs: '[data-product-single-thumbnail]',
		singleOptionSelector: '[data-single-option-selector]',
		variantSelector: '[data-product-variant]',
		variantLabel: '[data-value-id]',
		quantitySelector: '[data-product-quantity-selector]',
		quantityInput: '[data-product-quantity-input]',
		productSlider: '[data-product-slider]',
		slide: '[data-product-slide]',
		thumbnailsWrapper: '[data-product-thumbnails-wrapper]',
		thumbnailsSlider: '[data-product-thumbnails]',
		thumbnailsArrowPrev: '[data-product-thumbnails-arrow-prev]',
		thumbnailsArrowNext: '[data-product-thumbnails-arrow-next]',
		thumbnail: '[data-product-thumbnail]',
		productStickyCta: '[data-product-sticky-cta]',
		dataProductSwitch: '[data-product-switch]',
		dataProductSwitchInput: '[data-product-switch-input]',
		dataProductSwitchLabel: '[data-product-switch-label]',
		dataProductLabels: '[data-product-label]',
		dataProductStickyCtaThreshold: '[data-product-sticky-cta-threshold]',
		// Bundle
		bundleCustomizerButton: '[data-bundle-customizer-button]',
		bundleCustomizerClose: '[data-bundle-customizer-close]',
		bundleCustomizerPopup: '[data-bundle-customizer-popup]',
		bundleCustomizerPopupContent: '[data-bundle-customizer-content]',
	};

	const CLASSES = {
		THUMBNAILS_STATIC: 			'product-section__thumbnails-wrapper--static',
		THUMBNAIL_STATIC: 			'product-section__thumbnail',
		THUMBNAIL_ACTIVE:			'product-section__thumbnail--active',
		PRODUCT_STICKY_CTA_SHOW: 	'product-sticky-cta--show',
		VARIANT_LABEL_ACTIVE: 		'active',
		BUNDLE_POPUP_SHOWN: 		'bundle-customizer--shown',
		PROGRESS_ITEM_FILLED: 		'bundle-customizer__progress-item--filled'
	};

	/**
	 * Product section constructor. Runs on page load as well as Theme Editor
	 * `section:load` events.
	 * @param {string} container - selector for the section container DOM element
	 */
	function Product(container) {
		const self = this;

		this.$container = $(container);

		// Stop parsing if we don't have the product json script tag when loading
		// section in the Theme Editor
		if (!$(selectors.productJson, this.$container).html()) {
			return;
		}

		let sectionId 				= this.$container.attr('data-section-id');
		this.productSingleObject 	= JSON.parse($(selectors.productJson, this.$container).html());

		let options = {
			$container: this.$container,
			enableHistoryState: this.$container.data('enable-history-state') || false,
			singleOptionSelector: selectors.singleOptionSelector,
			originalSelectorId: selectors.originalSelectorId,
			product: this.productSingleObject
		};

		this.settings			= {};
		this.namespace 			= '.product';
		this.variants 			= new slate.Variants(options);
		this.currentVariant 	= this.variants.currentVariant;

		this.currentVariant 	= this.getActiveVariant();

		this.$productSlider 		= $(selectors.productSlider, this.$container);
		this.$productSlides			= $(selectors.slide, this.$container);
		this.$thumbnailsWrapper 	= $(selectors.thumbnailsWrapper, this.$container);
		this.$thumbnailsSlider 		= $(selectors.thumbnailsSlider, this.$container);
		this.$thumbnail 			= $(selectors.thumbnail, this.$container);
		this.$thumbnailsArrowPrev 	= $(selectors.thumbnailsArrowPrev, this.$container);
		this.$thumbnailsArrowNext 	= $(selectors.thumbnailsArrowNext, this.$container);

		if (this.$productSlider.length && this.$productSlides.length > 1) {
			const MAX_THUMBNAILS_TO_SHOW = 5;

			this.$productSlider.slick({
				infinite: true,
				slidesToShow: 1,
				draggable: true,
				swipe: true,
				arrows: false,
				dots: false
			});

			if (this.$productSlides.length > MAX_THUMBNAILS_TO_SHOW) {
				this.$productSlider.slick('slickSetOption', 'asNavFor', self.$thumbnailsSlider);

				this.$thumbnailsSlider.slick({
					infinite: true,
					slidesToShow: MAX_THUMBNAILS_TO_SHOW,
					slidesToScroll: 1,
					draggable: false,
					swipe: false,
					arrows: true,
					prevArrow: this.$thumbnailsArrowPrev,
					nextArrow: this.$thumbnailsArrowNext,
					dots: false,
					asNavFor: self.$productSlider,
					focusOnSelect: true
				});
			} else {
				this.$thumbnailsWrapper.addClass(CLASSES.THUMBNAILS_STATIC);
				this.$thumbnail.addClass(CLASSES.THUMBNAIL_STATIC);

				this.$thumbnail.first().addClass(CLASSES.THUMBNAIL_ACTIVE);

				this.$thumbnail.on('click', function() {
					let currentThumbnail 	= $(this);
					let index 				= currentThumbnail.attr('data-slick-index');

					self.$productSlider.slick('slickGoTo', index);

					self.$thumbnail.removeClass(CLASSES.THUMBNAIL_ACTIVE);
					currentThumbnail.addClass(CLASSES.THUMBNAIL_ACTIVE);
				});

				this.$productSlider.on('afterChange', function (slick, currentSlide) {
					let index = currentSlide.currentSlide;

					self.$thumbnail.removeClass(CLASSES.THUMBNAIL_ACTIVE);
					$(`[data-product-thumbnail][data-slick-index=${index}]`).addClass(CLASSES.THUMBNAIL_ACTIVE);
				});
			}
		}

		this.$container.on('variantChange' + this.namespace, (event) => {
			this.currentVariant = event.variant;
		});

		this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
		this.$container.on('variantChange' + this.namespace, this.updateQuantitySelector.bind(this));
		this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

		this.$price 					= $(selectors.productPrice, self.$container);

		this.$originalVariantSelector 	= $(selectors.originalSelectorId, this.$container);
		this.$variantSelector 			= $(selectors.variantSelector, this.$container);
		this.$variantLabel 				= $(selectors.variantLabel, this.$container);

		this.$variantSelector.on('change', (event) => {
			let variantId = parseInt(event.target.value);

			this.$originalVariantSelector.val(variantId);

			this.currentVariant = this.variants.product.variants.find(variant =>
				variant.id === variantId
			);

			this.$container.trigger({
				type: 'variantChange' + this.namespace,
				variant: this.currentVariant
			});

			this.$container.trigger({
				type: 'variantPriceChange' + this.namespace,
				variant: this.currentVariant
			});

			this.$variantLabel.removeClass(CLASSES.VARIANT_LABEL_ACTIVE);
			$(`[data-value-id='${this.currentVariant.id}']`).addClass(CLASSES.VARIANT_LABEL_ACTIVE);

			if (!history.replaceState || !this.currentVariant) {
				return;
			}

			let newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variantId;
			window.history.replaceState({path: newurl}, '', newurl);
		});

		this.$dataProductSwitch 		= $(selectors.dataProductSwitch, this.$container);
		this.$dataProductSwitchInput 	= $(selectors.dataProductSwitchInput, this.$container);
		this.$dataProductSwitchLabel 	= $(selectors.dataProductSwitchLabel, this.$container);
		this.dataProductLabels 			= $(selectors.dataProductLabels, this.$container);

		this.$dataProductSwitchInput.on('change', (e) => {
			let variantId = parseInt(e.target.value);

			this.$originalVariantSelector.val(variantId);

			this.currentVariant = this.variants.product.variants.find(variant =>
				variant.id === variantId
			);

			this.$container.trigger({
				type: 'variantChange' + this.namespace,
				variant: this.currentVariant
			});

			this.$container.trigger({
				type: 'variantPriceChange' + this.namespace,
				variant: this.currentVariant
			});

			let $currentInput = $(e.target);
			let condition = $currentInput.attr('data-checked');

			if (condition === 'true') {
				self.$dataProductSwitchLabel.addClass('checked');
				self.$dataProductSwitch.prop('checked', true);
			} else {
				self.$dataProductSwitchLabel.removeClass('checked');
				self.$dataProductSwitch.prop('checked', false);
			}

			this.dataProductLabels.removeClass('checked');
			$(`label[data-product-label-id=${variantId}]`).addClass('checked');
		});

		this.$dataProductSwitch.on('change', (e) => {
			let $this = $(e.target);
			let condition = $this.prop('checked');
			let $currentInput = $(`[data-product-switch-input][data-checked=${condition}]`);

			if (condition === true) {
				self.$dataProductSwitchLabel.addClass('checked');
			} else {
				self.$dataProductSwitchLabel.removeClass('checked');
			}

			$currentInput.prop('checked', true);

			let variantId = parseInt($currentInput.val());
			this.$originalVariantSelector.val(variantId);

			this.currentVariant = this.variants.product.variants.find(variant =>
				variant.id === variantId
			);

			this.$container.trigger({
				type: 'variantChange' + this.namespace,
				variant: this.currentVariant
			});

			this.$container.trigger({
				type: 'variantPriceChange' + this.namespace,
				variant: this.currentVariant
			});

			this.dataProductLabels.removeClass('checked');
			$(`label[data-product-label-id=${variantId}]`).addClass('checked');
		});

		this.$quantitySelector 	= $(selectors.quantitySelector, this.$container);
		this.$quantityInput		= $(selectors.quantityInput, this.$container);

		this.$quantityInput.on('change', function () {
			let updatedValue = $(this).val();

			self.$quantityInput.val(updatedValue);

			self.updateProductPrices();
		});

		(() => {
			this.$productStickyCta = $(selectors.productStickyCta, this.$container);

			if (!this.$productStickyCta.length) {
				return;
			}

			const buttonStickyBottom 	= 20;

			this.$lastPosBeforeSticky 	= null;

			$(window).on('scroll resize orientationchange', function (e) {
				if (window.innerWidth > 480) {
					$(selectors.productStickyCta, self.$container).removeClass(CLASSES.PRODUCT_STICKY_CTA_SHOW);

					return;
				}

				this.$currentPos 		= $(window).scrollTop() + window.innerHeight;
				this.$buttonBottomPos 	= $(selectors.dataProductStickyCtaThreshold, self.$container).offset().top + $(selectors.dataProductStickyCtaThreshold, self.$container).outerHeight();

				if (this.$currentPos >= this.$buttonBottomPos + buttonStickyBottom) {
					if (self.$lastPosBeforeSticky == null || e.type === 'resize' || e.type === 'orientationchange') {
						self.$lastPosBeforeSticky = this.$buttonBottomPos;
					}

					$(selectors.productStickyCta, self.$container).addClass(CLASSES.PRODUCT_STICKY_CTA_SHOW);
				}

				if (this.$currentPos < self.$lastPosBeforeSticky + buttonStickyBottom + $(selectors.productStickyCta, self.$container).outerHeight()) {
					$(selectors.productStickyCta, self.$container).removeClass(CLASSES.PRODUCT_STICKY_CTA_SHOW);

					self.$lastPosBeforeSticky = null;
				}
			});
		})();

		(() => {
			if (!this.isBundle()) {
				return;
			}

			this.$bundleCustomizerButton 		= $(selectors.bundleCustomizerButton, this.$container);
			this.$bundleCustomizerClose 		= $(selectors.bundleCustomizerClose, this.$container);
			this.$bundleCustomizerPopup 		= $(selectors.bundleCustomizerPopup, this.$container);
			this.$bundleCustomizerPopupContent 	= $(selectors.bundleCustomizerPopupContent, this.$container);

			if (!this.$bundleCustomizerButton.length) {
				return;
			}

			this.$bundleCustomizerButton.on('click', (event) => {
				event.preventDefault();

				let url = `/products/${this.productSingleObject.handle}?variant=${this.currentVariant.id}&view=bundle-customizer`;

				$.get(url, (response) => {
					this.$bundleCustomizerPopupContent.html(response);

					this.initBundleCustomizer();
				}).done(() => {
					this.$bundleCustomizerPopup.addClass(CLASSES.BUNDLE_POPUP_SHOWN);
					bodyScrollLock.disableBodyScroll(document.querySelector(selectors.bundleCustomizerPopup));
				});
			});

			$(document).on('bundleCustomizerReady', this.onBundleCustomizerReady.bind(this));
		})();
	}

	Product.prototype = $.extend({}, Product.prototype, {
		/**
		 * Updates the DOM state of the add to cart button
		 *
		 * @param {boolean} enabled - Decides whether cart is enabled or disabled
		 * @param {string} text - Updates the text notification content of the cart
		 */
		updateAddToCartState: function (event) {
			let variant = event.variant;

			if (variant) {
				$(selectors.priceWrapper, this.$container).removeClass('hide');
			} else {
				$(selectors.addToCart, this.$container).prop('disabled', true);
				$(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
				$(selectors.priceWrapper, this.$container).addClass('hide');
				return;
			}

			if (variant.available) {
				$(selectors.addToCart, this.$container).prop('disabled', false);
				$(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
			} else {
				$(selectors.addToCart, this.$container).prop('disabled', true);
				$(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
			}
		},

		/**
		 * Updates the DOM with specified prices
		 *
		 * @param {string} productPrice - The current price of the product
		 * @param {string} comparePrice - The original price of the product
		 */
		updateProductPrices: function (event) {
			let variant			= event ? event.variant : this.getActiveVariant();
			let quantity 		= $(selectors.quantityInput, this.$container).val() || 1;
			let $comparePrice 	= $(selectors.comparePrice, this.$container);
			let $compareEls 	= $comparePrice.add(selectors.comparePriceText, this.$container);

			let updatedPrice = variant.price * quantity;

			this.$price.html(slate.Currency.formatMoney(updatedPrice, theme.moneyFormat));

			if (variant.compare_at_price > variant.price) {
				let updatedCompareAtPrice = variant.compare_at_price * quantity;

				$comparePrice.html(slate.Currency.formatMoney(updatedCompareAtPrice, theme.moneyFormat));
				$compareEls.removeClass('hide');
			} else {
				$comparePrice.html('');
				$compareEls.addClass('hide');
			}
		},

		/**
		 * Updates the DOM state of the quantity selector
		 *
		 * @param {boolean} enabled - Decides whether quantity selector should be enabled or disabled
		 */
		updateQuantitySelector: function (event) {
			let variant 			= event.variant;
			let $quantitySelector 	= this.$quantitySelector;

			$quantitySelector.attr('data-disabled', !variant.available);
		},

		/**
		 * Updates the DOM with the specified image URL
		 *
		 * @param {string} src - Image src URL
		 */
		updateProductImage: function (event) {
			let variant = event.variant;
			let sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

			this.$featuredImage.attr('src', sizedImgUrl);
		},

		/**
		 * Event callback for Theme Editor `section:unload` event
		 */
		onUnload: function () {
			this.$container.off(this.namespace);
		},

		getActiveVariant: function () {
			let activeVariantId = $(selectors.originalSelectorId, this.$container).val();

			return this.variants.product.variants.find(variant =>
				variant.id === parseInt(activeVariantId)
			);
		},

		isBundle: function () {
			return theme.isTemplate('product.bundle');
		},

		initBundleCustomizer: function () {
			document.dispatchEvent(new CustomEvent('bundleCustomizerReady'));
		},

		onBundleCustomizerReady: function () {
			var sections = new slate.Sections();
			sections.register('bundle-customizer', theme.BundleCustomizer);
		}
	});

	return Product;
})();

theme.Header = (function ($) {
	const CLASSES = {
		BODY_SCROLLED: 		'scrolled',
		HEADER_SCROLLED: 	'header--scrolled',
		MENU_ACTIVE: 		'header-mobile-menu--open',
		MENU_BUTTON_ACTIVE: 'header__menu-button--open'
	};

	function Header(container) {
		this.$container		= $(container);
		this.$headerHeight 	= this.$container.innerHeight();
		this.$mobileMenu 	= this.$container.find('.js-mobile-menu');

		this.initMobileMenu();
		this.onResize();
		this.onScroll();
	}

	Header.prototype.initMobileMenu = function () {
		if (!this.$mobileMenu.length) {
			return;
		}

		this.$mobileMenuButton 	= $('.js-mobile-menu-button');
		this.$mobileMenuWrapper = $('.js-mobile-menu-wrapper');

		this.$container.on('click', '.js-mobile-menu-button', () => {
			this.$mobileMenuButton.toggleClass(CLASSES.MENU_BUTTON_ACTIVE);
			this.$mobileMenu.toggleClass(CLASSES.MENU_ACTIVE);

			if (this.$mobileMenu.hasClass(CLASSES.MENU_ACTIVE)) {
				bodyScrollLock.disableBodyScroll(this.$mobileMenuWrapper[0]);
			} else {
				bodyScrollLock.enableBodyScroll(this.$mobileMenuWrapper[0]);
			}
		});

		const closeMobileMenu = (e) => {
			let $target = $(e.target);

			if (!$target.closest(this.$mobileMenuButton.add(this.$mobileMenuWrapper)).length) {
				this.$mobileMenuButton.removeClass(CLASSES.MENU_BUTTON_ACTIVE);
				this.$mobileMenu.removeClass(CLASSES.MENU_ACTIVE);

				bodyScrollLock.enableBodyScroll(this.$mobileMenuWrapper[0]);
			}
		};

		document.addEventListener('click', closeMobileMenu);
	};

	Header.prototype.onResize = function () {
		$(window).on('resize', () => {
			if (window.innerWidth > 1199) {
				this.$mobileMenuButton.removeClass(CLASSES.MENU_BUTTON_ACTIVE);
				this.$mobileMenu.removeClass(CLASSES.MENU_ACTIVE);

				bodyScrollLock.clearAllBodyScrollLocks();
			}
		});
	};

	Header.prototype.onScroll = function () {
		const toggleHeaderClasses = () => {
			if ($(window).scrollTop() >= this.$headerHeight) {
				this.$container.addClass(CLASSES.HEADER_SCROLLED);
			} else {
				this.$container.removeClass(CLASSES.HEADER_SCROLLED);
			}
		};

		const toggleBodyClasses = () => {
			if ($(window).scrollTop() >= this.$headerHeight) {
				$('body').addClass(CLASSES.BODY_SCROLLED);
			} else {
				$('body').removeClass(CLASSES.BODY_SCROLLED);
			}
		};

		$(window).on('scroll', () => {
			toggleHeaderClasses();
			toggleBodyClasses();
		})
	};

	return Header;
})(jQuery);

theme.BundleCustomizer = (function ($) {
	const CLASSES = {
		BUNDLE_POPUP_SHOWN: 	'bundle-customizer--shown',
		PROGRESS_ITEM_FILLED: 	'bundle-customizer__progress-item--filled',
		ADD_TO_CART_SUCCESS:	'product-card__button--success'
	};

	const CLASS_SELECTORS = {
		PROGRESS_ITEM_FILLED: 	'.bundle-customizer__progress-item--filled',
		PRODUCT_CARD_SELECT:	'.js-product-card-select',
		PRODUCT_CARD_BUTTON:	'.js-product-card-atc-button'
	};

	let selectors = {
		productCard: 						'[data-product-card]',
		addToCart: 							'[data-add-to-cart]',
		propertyInputs:						'[data-bundle-property]',
		bundleCustomizerButton: 			'[data-bundle-customizer-button]',
		bundleCustomizerClose: 				'[data-bundle-customizer-close]',
		bundleCustomizerPopup: 				'[data-bundle-customizer-popup]',
		bundleCustomizerPopupContent: 		'[data-bundle-customizer-content]',
		bundleCustomizer: 					'[data-bundle-customizer]',
		bundleIngredient: 					'[data-bundle-ingredient]',
		ingredientQuantityInput: 			'[data-bundle-ingredient-quantity]',
		ingredientQuantityControl: 			'[data-bundle-ingredient-quantity-control]',
		ingredientQuantityControlAdd: 		`[data-bundle-ingredient-quantity-control='add']`,
		ingredientQuantityControlRemove: 	`[data-bundle-ingredient-quantity-control='remove']`,
		bundleProgressItem: 				'[data-bundle-customizer-progress-item]'
	};

	function BundleCustomizer (container) {
		this.$container	= $(container);

		this.$bundleCustomizerPopup = this.$container;

		if (!this.$bundleCustomizerPopup.length) {
			return;
		}

		this.$bundleCustomizerPopupContent 	= $(selectors.bundleCustomizerPopupContent, this.$container);
		this.$bundleCustomizerClose 		= $(selectors.bundleCustomizerClose, this.$container);
		this.ingredients					= {};

		document.dispatchEvent(new CustomEvent('initQuantitySelector', {
			detail: {
				container
			}
		}));

		this.initBundleCustomizer();
	}

	BundleCustomizer.prototype.initBundleCustomizer = function () {
		let self = this;

		this.$bundleCustomizerClose.on('click', (event) => {
			event.preventDefault();

			this.$bundleCustomizerPopup.removeClass(CLASSES.BUNDLE_POPUP_SHOWN);
			bodyScrollLock.enableBodyScroll(this.$bundleCustomizerPopup[0]);
		});

		this.$bundleAddToCart = $(selectors.addToCart, this.$container);

		this.$bundleAddToCart.attr('disabled', 'disabled');

		this.$bundleCustomizer 	= $(selectors.bundleCustomizer, this.$container);
		this.bundleVariantId 	= this.$bundleCustomizer.attr('data-bundle-variant-id');
		this.$bundleSize 		= parseInt(this.$bundleCustomizer.attr('data-bundle-size'));

		this.$ingredientsQuantity 		= 0;
		this.$ingredientQuantityInput 	= $(selectors.ingredientQuantityInput, this.$container);
		this.$bundleProgressItem		= $(selectors.bundleProgressItem, this.$container);

		this.$ingredientQuantityInput.on('change', function () {
			const $ingredientQuantityHolder = $(this);
			const ingredientQuantity 		= parseInt($ingredientQuantityHolder.val());
			const $ingredientContainer 		= $ingredientQuantityHolder.closest(selectors.bundleIngredient);
			const ingredientHandle 			= $ingredientContainer.attr('data-bundle-ingredient');
			const ingredientVariantId		= $ingredientContainer.attr('data-ingredient-variant-id');
			const propertyInput 			= $(`[data-bundle-ingredient-property='${ingredientHandle}']`);

			propertyInput.val(ingredientQuantity);

			self.$ingredientsQuantity = 0;

			self.$ingredientQuantityInput.each(function () {
				let currentIngredientQuantity = parseInt($(this).val());
				self.$ingredientsQuantity += currentIngredientQuantity;
			});

			self.ingredients[ingredientVariantId] = ingredientQuantity;

			let subtractionResult = self.$bundleSize - self.$ingredientsQuantity;

			if (subtractionResult === 0) {
				self.$bundleAddToCart.removeAttr('disabled');
				$('.js-product-quantity-add').attr('disabled', 'disabled');
			} else {
				self.$bundleAddToCart.attr('disabled', 'disabled');
				$('.js-product-quantity-add').removeAttr('disabled');
			}

			self.updateBundleProgress(self);
		});

		let productCardParent = this.$container.parents(selectors.productCard);

		// if (productCardParent.length) {
			this.enableAjaxAddToCart();
		// } else {
		// 	this.$bundleAddToCart.on('click', () => {
		// 		const items = this.getAddToCartItems();
		//
		// 		document.dispatchEvent(new CustomEvent("products:add", {
		// 			detail: {
		// 				items,
		// 				redirectToCart: false
		// 			}
		// 		}));
		//
		// 		return false;
		// 	});
		// }
	};


	BundleCustomizer.prototype.getAddToCartItems = function () {
		const ingredientsKeys = Object.keys(this.ingredients);
		const hashString = ingredientsKeys.sort().reduce((hashString, key) => {
			return `${hashString}_${key}_${this.ingredients[key]}`;
		},'');

		const hash = window.sha256(hashString);

		return [
			...ingredientsKeys.reduce((ingredients, ingredient) => {
				const quantity = this.ingredients[ingredient];

				ingredients.push({
					id: ingredient,
					quantity,
					properties: {
						"_for-bundle-hash": hash,
						"_bundle-quantity": quantity
					}
				});

				return ingredients;
			}, []),
			{
				id: this.bundleVariantId,
				quantity: 1,
				properties: {
					"_bundle-hash": hash
				}
			}
		];
	};

	BundleCustomizer.prototype.enableAjaxAddToCart = function () {
		let productCard = this.$container.parents(selectors.productCard);

		this.$bundleAddToCart.on('click', () => {
			const productCardButton = $(CLASS_SELECTORS.PRODUCT_CARD_BUTTON, productCard);
			const items 			= this.getAddToCartItems();

			document.dispatchEvent(new CustomEvent("products:add", {
				detail: {
					items,
					redirectToCart: false,
					callback: async () => {
						productCardButton.addClass(CLASSES.ADD_TO_CART_SUCCESS);

						this.updateCartCount();

						setTimeout(() => {
							productCardButton.removeClass(CLASSES.ADD_TO_CART_SUCCESS);
						}, 2000);

						this.$bundleCustomizerPopup.removeClass(CLASSES.BUNDLE_POPUP_SHOWN);
						bodyScrollLock.enableBodyScroll(this.$bundleCustomizerPopup[0]);
					}
				},
			}));

			setTimeout(() => {
				$.ajax({
					type: 'GET',
					url: '/cart.js',
					dataType: 'json',
					success: (cart) => {
						let htmlItems = '';
						let productsCount = 0;
						let itemsHTML = $('#cartItems .cart-wrapping');
						let countProductsHTML = $('.cart__header .cart-indicator');
						let countMiniCart = $('.header__secondary-menu-cart-count');
						let cartTotalHTML = $('.cart__totalcost-amout');

						cart.items.forEach((el, index) => {
							let addictedProducts = '';

							if (el.product_title.includes('Bundle') && el.properties != null && el.properties.hasOwnProperty('_bundle-hash')) {
								cart.items.forEach((adds, idx) => {
									if (!adds.product_title.includes('Bundle') && adds.properties != null && adds.properties.hasOwnProperty('_for-bundle-hash')) {
										if (adds.properties['_for-bundle-hash'] == el.properties['_bundle-hash']) {
											addictedProducts += `
												<li data-line="${idx}" data-qty="${parseInt(adds.properties['_bundle-quantity'])}">${adds.product_title} (${adds.properties['_bundle-quantity']})</li>
											`;
										}
									}
								});
							}

							if (el.product_title.includes('Bundle') && el.properties != null && el.properties.hasOwnProperty('_bundle-hash')) {
								productsCount += el.quantity;

								htmlItems += `
									<div class="cart__item" data-variant="${el.variant_id}" data-hash="${el.properties['_bundle-hash']}" data-line="${index + 1}">
										<img src="${el.featured_image.url}" alt="item 1" class="cart__item-img">
										
										<div class="cart__item-options">
											<h3 class="cart__item-title">${el.title}</h3>
											
											<div class="cart__item-qty">
												<span>qty</span>
												<button type="button" class="cart__item-qty-minus">-</button>
												<input class="cart__item-input-qty" type="number" name="cart-input-qty" value="${el.quantity}" data-price="100" id="input-id2">
												<button type="button" class="cart__item-qty-plus">+</button>
												<div class="cart__item-price">$${el.price.toString().substring(0, el.price.toString().length - 2) * el.quantity}</div>
											</div>
											<div class="cart__item-descr">
												<ul class="cart__item-descr-par">
													${addictedProducts}
												</ul>
											</div>
										</div>
										
										<button type="button" class="btn__cart-close btn__cart-item-close" data-cart-remove-variant="${el.variant_id}"></button>
									</div>
								`;
							} else if (el.properties == null || !el.properties.hasOwnProperty('_bundle-hash') && !el.properties.hasOwnProperty('_for-bundle-hash')) {
								productsCount += el.quantity;

								htmlItems += `
									<div class="cart__item" data-variant="${el.variant_id}" data-line="${index + 1}">
										<img src="${el.featured_image.url}" alt="item 1" class="cart__item-img">
										
										<div class="cart__item-options">
											<h3 class="cart__item-title">${el.title}</h3>
											
											<div class="cart__item-qty">
												<span>qty</span>
												<button type="button" class="cart__item-qty-minus">-</button>
												<input class="cart__item-input-qty" type="number" name="cart-input-qty" value="${el.quantity}" data-price="100" id="input-id2">
												<button type="button" class="cart__item-qty-plus">+</button>
												<div class="cart__item-price">$${el.price.toString().substring(0, el.price.toString().length - 2) * el.quantity}</div>
											</div>
										</div>
										
										<button type="button" class="btn__cart-close btn__cart-item-close" data-cart-remove-variant="${el.variant_id}"></button>
									</div>
								`;
							}
						});

						cartTotalHTML.text(cart.total_price.toString().substring(0, cart.total_price.toString().length - 2));
						countProductsHTML.text(' (' + productsCount + ')');
						countMiniCart.text(productsCount);
						itemsHTML.html(htmlItems);

						if (productsCount == 0) {
							$('.cart__items-empty-img').removeClass('hidden');
							$('.cart__empty-wrapper').removeClass('hidden');

							if (!$('.cart__checkout-total').hasClass('hidden')) {
								$('.cart__checkout-total').addClass('hidden')
							}
							if (!$('.cart-ajax .cart__header').hasClass('hidden')) {
								$('.cart-ajax .cart__header').addClass('hidden');
							}
						} else {
							if (!$('.cart__items-empty-img').hasClass('hidden')) {
								$('.cart__items-empty-img').addClass('hidden');
							}

							if (!$('.cart__empty-wrapper').hasClass('hidden')) {
								$('.cart__empty-wrapper').addClass('hidden');
							}

							$('.cart__checkout-total').removeClass('hidden');
							$('.cart-ajax .cart__header').removeClass('hidden');
						}
					}
				});

				$('.btn-cart')[0].click();
			}, 1500);

			return false;
		});
	};

	BundleCustomizer.prototype.updateCartCount = function () {
		$.ajax({
			type: 'GET',
			url: '/cart.js',
			dataType: 'json',
			success: (cart) => {
				const cartCountLabels = $('[data-cart-items-count]');

				if (!cartCountLabels.length) {
					return;
				}

				cartCountLabels.each((i, elem) => {
					let label = $(elem);

					const itemsCount = cart.items.reduce((quantity, item) => {
						if(!item.properties || !item.properties.hasOwnProperty("_for-bundle-hash")) {
							quantity += item.quantity;
						}

						return quantity;
					}, 0);

					const formattedCartCount = (itemsCount > 99) ? '99+' : (itemsCount > 0) ? itemsCount : 0;

					label.text(formattedCartCount);
				});
			}
		});
	};

	BundleCustomizer.prototype.updateBundleProgress = function (self) {
		self.$bundleProgressItem.each(function (index) {
			$(this).removeClass(CLASSES.PROGRESS_ITEM_FILLED);

			if (index < self.$ingredientsQuantity) {
				$(this).addClass(CLASSES.PROGRESS_ITEM_FILLED);
			}
		});
	};

	return BundleCustomizer;
})(jQuery);

/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Cart = (function() {
  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Cart(container) {
    document.dispatchEvent(new CustomEvent("init:cart"));
  }

  return Cart;
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);
  sections.register('header', theme.Header);
  sections.register('cart', theme.Cart);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

});
