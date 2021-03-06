;(function() {

	// const $window = $(window)

	// let lastPosition = $window.scrollTop();
	// const $header = $('#header-main');
	// const $body = $('body');

	// $window.on('scroll touchmove', e => {
	// 	if (window.screen.width < 1200) return true;

	// 	const currentPosition = $window.scrollTop() ;

	// 	if (currentPosition < 100) return true;

	// 	if (currentPosition < lastPosition) {
	// 		$header.removeClass('header--hidden');
	// 		$body.removeClass('no-header')
	// 	} else if (currentPosition > lastPosition) {
	// 		$header.addClass('header--hidden');
	// 		$body.addClass('no-header')
	// 	}

	// 	lastPosition = currentPosition;
	// })

}());
;(function() {

	/*	Code for validate only numbers
	*	Table with KEY-codes: https://keycode.info/
	*	8 - backspace/delete
	*	0 - key has no keycode
	*	13 - enter
	*	e < 48 || e > 57 - NOT NUMBERS
	*/

	$('.js-only-numbers').on('keypress', function(e) {
		if (e.which != 8 && e.which != 0 && e.which != 13 && (e.which < 48 || e.which > 57)) {
			return false;
		}
	});


	/* add max value for numeric input  */

	$('[data-max-val]').on('input', function(e) {
		let maxVal = Number($(this).attr('data-max-val') || 99);

		if ($(this).val() > maxVal) {
			$(this).val(maxVal);
		}
	});


	/* leave only positive values  */

	$('.js-only-positive').on('input', function(e) {
		if ($(this).val() === "") {
			return;
		}

		if ($(this).val() < 1) {
			$(this).val(1);
		}
	});

	$('.js-only-positive').on('blur', function(e) {
		if ($(this).val() === "") {
			$(this).val(1);
		}
	});
}());


;(function() {

	/*
	* <a href="#footer" class="js-anchor-link">scroll to...</a>
	*/

	$('.js-anchor-link').on('click', function(e) {
		e.preventDefault();

		let linkedSection = $($(this).attr('href'));

		if (linkedSection.length > 0) {
			$('html, body').animate({
				scrollTop: linkedSection.offset().top
			}, 500)
		}
	});

}());
;(function() {
	let accordionContainer = $('.js-accordion-container')
	let accordionToggler = $('.js-accordion-toggler');

	if (accordionToggler.length < 1) {
		return;
	}

	/*
	* accordionContainer - use it, if you need add one event listener , instead not for all accordions togglers
	* accordionToggler - accordion title, icon on some thing else.
	* accordion - accordion item container
	* accordionContent - content which animated
	*/

	if (accordionContainer.length) {
		accordionContainer.on('click', '.js-accordion-toggler', toggleAccordion);
	} else {
		accordionToggler.click(toggleAccordion);
	}

	function toggleAccordion() {
		let accordion = $(this).parents('.js-accordion');
		let accordionContent = accordion.find('.js-accordion-content');

		accordion.toggleClass('open');
		accordionContent.stop().slideToggle(400, function() {
			$(this).css('height', '');
		});
	}
}());

;(function() {
	let popupLinks = $('.js-open-popup');
	let popupOpenClass = 'popup--open';
	let popupCloseButton = $('.js-close-popup');
	let popupAutoShow = $('.js-auto-show-popup');
	let showAutoPopup = popupAutoShow.data('show');

	/* Custom Events */

	$(document).on('popup:open', function(e, popup, popupId) {
		popup.addClass(popupOpenClass);

		setTimeout(() => {
			bodyScrollLock.disableBodyScroll(popup[0]);
		}, 100);

		popup.on('click', function(e) {
			let $target = $(e.target);

			if (!$target.closest('.popup__container').length) {
				$(document).trigger('popup:close', [popup, popupId]);

				popup.removeClass(popupOpenClass);

				if (popup.find('.popup__iframe-wrapper').length > 0) {
					popup.find('.popup__iframe-wrapper').remove();
				}
			}
		});
	});

	$(document).on('popup:close', function(e, popup, popupId) {
		bodyScrollLock.clearAllBodyScrollLocks();
	});


	/* Custom POPUP */

	popupLinks.on('click', function(e) {
		e.preventDefault();

		let popupId = $(this).attr('data-popup-id');
		let popup = $('#' + popupId);
		let youtubeLink = $(this).attr('data-popup-youtube');

		if (popup.length < 1) {
			return;
		}

		if (youtubeLink) {
			let youtubeVideoId = youtube_id_parser(youtubeLink);

			let iframe = `
				<div class="popup__iframe-wrapper">
					<iframe
						src="https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&controls=1&fs=1&iv_load_policy=3&autoplay=1&mute=0&rel=0&showinfo=0&loop=0&start=0"
						frameborder="0"
						allow="autoplay"
						allowfullscreen
					>
					</iframe>
				</div>
			`;

			popup.find('.popup__content').append(iframe);
		}

		$(document).trigger('popup:open', [popup, popupId]);
	});

	popupCloseButton.on('click', function(e) {
		let popup = $(this).parents('.js-popup');
		let popupId = popup.attr('id');

		$(document).trigger('popup:close', [popup, popupId]);

		popup.removeClass(popupOpenClass);

		if (popup.find('.popup__iframe-wrapper').length > 0) {
			popup.find('.popup__iframe-wrapper').remove();
		}
	});


	function youtube_id_parser (url) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		var match = url.match(regExp);

		return (match&&match[7].length==11)? match[7] : false;
	}

	/* Auto Show Popup */

	$(document).ready(function () {
		if (!popupAutoShow.length) {
			return;
		}

		if (getCookie('show_auto_popup') === 'once' && getCookie('show_auto_popup') === showAutoPopup) {
			return;
		}

		setTimeout(function () {
			popupAutoShow.addClass(popupOpenClass);
			bodyScrollLock.disableBodyScroll(popupAutoShow[0]);

			$(document).on('popup:close', function () {
				setCookie('show_auto_popup', showAutoPopup);
			});
		}, popupAutoShow.data('delay') * 1000);
	});

	/* Cookie's functions */

	function getCookie(name) {
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookie(name, value, options = {}) {
		options = {
			path: '/',
			secure: false,
			...options
		};
		if (options.expires instanceof Date) {
			options.expires = options.expires.toUTCString();
		}
		let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
		for (let [key, value] of Object.entries(options)) {
			updatedCookie += "; " + key;
			if (value !== true) {
				updatedCookie += "=" + value;
			}
		}
		document.cookie = updatedCookie;
	}
}());

;(function() {
	/*
	*
	*	Lazy load images script with CACHE check.
	*	If images in cache - lazy load would not start.
	*
	*	If you don't need a feature with caches image - comment code.
	*
	*	HTML basic structure
	*	<picture class="lazy">
	*		<source data-srcset="img-src-for-1x-screen 1x, img-src-for-2x-screen 2x" >
	*		<img src="img-src-thumbnail-40x-resolution" data-srcset="img-src-default-resolution" srcset="img-src-thumbnail-40x-resolution" alt="">
	*	</picture>
	*/

	document.addEventListener("DOMContentLoaded", lazyLoadImages);
	document.addEventListener("lazyLoadImages", lazyLoadImages);

	function lazyLoadImages() {
		if (window.caches) {
			var lazyImages = [].slice.call(
				document.querySelectorAll(".lazy [data-srcset]")
			);

			Promise.all(lazyImages.map(img => {
				const src = img.getAttribute('data-srcset');

				return window.caches.match(src).then(response => {
					if (response) {
						img.setAttribute('srcset', src);
						img.removeAttribute('data-srcset');
						img.parentElement.classList.remove("lazy");
					}
				})
			})).then(lazyLoadPictures);
		} else {
			lazyLoadPictures();
		}

		function lazyLoadPictures() {
			var lazyImages = [].slice.call(
				document.querySelectorAll(".lazy [data-srcset]")
			);

			if (lazyImages.length < 1) {
				return;
			}

			if ("IntersectionObserver" in window) {
				let lazyImageObserver =
					new IntersectionObserver(function (entries, observer) {
						entries.forEach(function (entry) {
							if (entry.isIntersecting) {
								let lazyImage = entry.target;
								lazyImage.srcset = lazyImage.dataset.srcset;

								caches.open('images').then(function(cache) {
									cache.addAll([lazyImage.dataset.srcset]).then(function() {});
								});

								lazyImage.parentElement.classList.remove("lazy");
								lazyImageObserver.unobserve(lazyImage);
							}
						});
					});

				lazyImages.forEach(function (lazyImage) {
					lazyImageObserver.observe(lazyImage);
				});
			} else {
				// Not supported, load all images immediately
				lazyImages.forEach(function (image) {
					image.srcset = image.dataset.srcset;
				});
			}
		}
	}
}());

;(function () {
  const $klaviyoForms = $("form[data-klaviyo='true']");

  KlaviyoSubscribe.attachToForms('#subscription_form', {
    success_message: 'THANK YOU! LOREM IPSUM DOLOR',
    success: function () {
      $("#subscription_form").find(".js-form-wrapper").hide();
    }
  });

  if (!$klaviyoForms.length) {
    return null;
  }

  $klaviyoForms.on('submit', (e) => {
    let $target = $(e.currentTarget);
    let $errors = $target.find(".error_message");
    let valid = true;

    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    $errors.hide().empty();

    $target.find("input[data-validate='email']").each((index, element) => {
      let email = $(element).val();

      if ((new RegExp(regex)).test(email)) {
        $(element).removeClass("input--error");
      } else {
        $(element).addClass("input--error");
        $errors.text("Incorrect email").show();
        valid = false;
      }
    });

    return valid;
  });
})();

;(function () {
	window.addEventListener("DOMContentLoaded", () => {
		initDiscoverSlider();
	});

	function initDiscoverSlider() {
		const discoverSlider = document.querySelector(".js-discover-slider");

		if (!discoverSlider) {
			return;
		}

		if (!discoverSlider) {
			return;
		}

		const slides = discoverSlider.querySelector(".js-discover-slider-slides");

		if (!slides) {
			return;
		}

		const sliderOptions = {
			dots: false,
			speed: 800,
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			adaptiveHeight: true,
			arrows: true,
			prevArrow: discoverSlider.querySelector(".js-discover-slider-prev"),
			nextArrow: discoverSlider.querySelector(".js-discover-slider-next")
		};

		$(slides).slick(sliderOptions);

		initDiscoverTabs(slides);
	}

	function initDiscoverTabs(slider) {
		const tabs = document.querySelectorAll(".js-card-tab");
		const currentTab = document.querySelector(".js-card-tab.card-tabs__tab--active");

		if (!currentTab) {
			return;
		}

		const collectionName = currentTab.dataset.collection;

		if (!collectionName) {
			return;
		}

		$(slider).slick("slickFilter", `[data-collection='${collectionName}']`);

		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const collectionName = tab.dataset.collection;

				tabs.forEach((currentTab) => {
					currentTab.classList.remove("card-tabs__tab--active");
				});

				$(slider).slick("slickUnfilter");
				$(slider).slick("slickFilter", `[data-collection='${collectionName}']`);

				tab.classList.add("card-tabs__tab--active");
			});
		});
	}
})();

;(function () {
  window.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };

    const callback = function() {
      const reviewsButtonWrapper = document.querySelector(".yotpo.testimonials");

      if (!reviewsButtonWrapper) {
        return;
      }

      const button = reviewsButtonWrapper.querySelector(".yotpo-testimonials.yotpo-testimonials-btn");

      if (!button) {
        return;
      }

      const svgStar = `
        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-3.93402e-07 9L6.21885 6.97937L6.21885 0.44049L10.0623 5.73056L16.2812 3.70993L12.4377 9L16.2812 14.2901L10.0623 12.2694L6.21885 17.5595L6.21885 11.0206L-3.93402e-07 9Z" fill="#FFB92D"/>
        </svg>
      `;

      button.innerHTML = `${button.innerHTML.replace("???", svgStar)}`;

      observer.disconnect();
    };

    const observer = new MutationObserver(callback);

    observer.observe(body, config);
  });
})();

;(function () {
	initFeaturedProductsSlider();

	function initFeaturedProductsSlider() {
		let sliderWrapper = $('.js-featured-products-slider');

		const sliderOptions = {
			dots: true,
			speed: 500,
			slidesToShow: 4,
			slidesToScroll: 1,
			infinite: false,
			arrows: true,
			prevArrow: $(".js-featured-products-slider-prev"),
			nextArrow: $(".js-featured-products-slider-next"),
			responsive: [
				{
					breakpoint: 1199,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 2
					}
				}
			]
		};

		$(sliderWrapper).slick(sliderOptions);
	}
})();

;(function () {
	window.addEventListener("DOMContentLoaded", globalInitQuantitySelector);
	document.addEventListener("initQuantitySelector", initQuantitySelectorFromEvent);

	function initQuantitySelectorFromEvent(e) {
		if (!e.detail) {
			return null;
		}

		const container = e.detail.container;

		if (!container) {
			return null;
		}

		const quantities = container.querySelectorAll(".js-product-quantity");

		initQuantity(quantities);
	}

	function globalInitQuantitySelector() {
		const quantities = document.querySelectorAll(".js-product-quantity");

		initQuantity(quantities);
	}

	function initQuantity(quantityContainers) {
		quantityContainers.forEach(quantityContainer => {
			const addButton = quantityContainer.querySelector(".js-product-quantity-add");
			const removeButton = quantityContainer.querySelector(".js-product-quantity-remove");
			const input = quantityContainer.querySelector(".js-product-quantity-input");
			const maxValue = (input && input.dataset.maxVal) ? +input.dataset.maxVal : 99;
			const minValue = (input && input.dataset.minVal) ? +input.dataset.minVal : 1;

			if (+input.value - 1 < 1) {
				removeButton.disabled = true;
			}

			addButton.addEventListener("click", () => {
				input.value = Math.min(+input.value + 1, maxValue);

				addButton.disabled = false;
				removeButton.disabled = false;

				if (+input.value + 1 > maxValue) {
					addButton.disabled = true;
				}

				input.dispatchEvent(
					new Event("change")
				);
			});

			removeButton.addEventListener("click", () => {
				input.value = Math.max(minValue, +input.value - 1);

				addButton.disabled = false;
				removeButton.disabled = false;

				if (input.classList.contains('js-bundle-popup-quantity-input')) {
					if (+input.value - 1 < 0) {
						removeButton.disabled = true;
					}
				} else {
					if (+input.value - 1 < 1) {
						removeButton.disabled = true;
					}
				}

				input.dispatchEvent(
					new Event("change")
				);
			});
		});
	}
}());

;(function () {
	window.addEventListener('pageshow', function (evt) {
		if (evt.persisted) {
			setTimeout(() => {
				window.location.reload();
			}, 10);
		}
	}, false);

	window.addEventListener("DOMContentLoaded", () => {
		const productCards = document.querySelectorAll(".product-card");

		if (!productCards.length) {
			return;
		}

		const CLASSES = {
			BUNDLE_POPUP_SHOWN: 'bundle-customizer--shown'
		};

		productCards.forEach((card) => {
			const select = card.querySelector(".js-product-card-select");
			const price = card.querySelector(".js-product-card-price");
			const options = card.querySelectorAll(".js-product-card-option");
			const swatch = card.querySelector(".js-product-card-swatch");
			const atcButton = card.querySelector(".js-product-card-atc-button");
			const customizerOpenerButton = card.querySelector(".js-product-card-customize-button");
			// const quantityInput = card.querySelector(".js-product-quantity-input");
			// const ctaWrapper = card.querySelector(".js-product-card-cta");
			// const quantityRemove = card.querySelector(".js-product-quantity-remove");
			// const quantityAdd = card.querySelector(".js-product-quantity-add");
			// const addedToCartClass = "product-card-atc--added";
			const addedToCartClass = "product-card__button--success";

			const isBundle = card.hasAttribute('data-bundle');
			const productHandle = card.dataset.productHandle;

			if (options.length) {
				options.forEach((option) => {
					option.addEventListener("change", () => {
						select.value = option.value;

						const selectedOption = select.options[select.selectedIndex];
						const variantQuantity = +selectedOption.dataset.variantQuantity;

						price.innerText = selectedOption.dataset.variantPrice;

						// ctaWrapper.classList.remove("product-card-cta--disabled");
						atcButton.removeAttribute("disabled");
						// quantityInput.removeAttribute("disabled");
						// quantityRemove.removeAttribute("disabled");
						// quantityAdd.removeAttribute("disabled");

						if (variantQuantity <= 0 && !isBundle) {
							// ctaWrapper.classList.add("product-card-cta--disabled");
							atcButton.setAttribute("disabled", "disabled");
							// quantityInput.setAttribute("disabled", "disabled");
							// quantityRemove.setAttribute("disabled", "disabled");
							// quantityAdd.setAttribute("disabled", "disabled");
						}

						const swatchCheckedState = option.dataset.checked;

						swatch.checked = (swatchCheckedState === "true");
					});
				});

				swatch.addEventListener("change", () => {
					const targetOption = card.querySelector(`[data-checked='${swatch.checked}']`);

					if (targetOption) {
						targetOption.click();
					}
				});
			}

			atcButton && atcButton.addEventListener("click", function () {
				if (isBundle) {
					const selectedOption = select.options[select.selectedIndex];
					const variantId = +selectedOption.dataset.variantId;

					let bundleCustomizerPopup = $(card).find('[data-bundle-customizer-popup]');
					let bundleUrl = `/products/${productHandle}?variant=${variantId}&view=bundle-customizer`;

					if (!bundleCustomizerPopup.length) {
						return;
					}

					let bundleCustomizerPopupContent = bundleCustomizerPopup.find('[data-bundle-customizer-content]');

					$.get(bundleUrl, (response) => {
						bundleCustomizerPopupContent.html(response);

						initBundleCustomizer();
					}).done(() => {
						bundleCustomizerPopup.addClass(CLASSES.BUNDLE_POPUP_SHOWN);
						bodyScrollLock.disableBodyScroll(bundleCustomizerPopup[0]);
					});
				} else {
					const selectedOption = select.options[select.selectedIndex];
					const variantId = +selectedOption.dataset.variantId;

					// atcButton.setAttribute("disabled", "disabled");

					document.dispatchEvent(new CustomEvent("products:add", {
						detail: {
							items: [
								{
									id: variantId,
									quantity: 1
								}
							],
							callback: async () => {
								atcButton.classList.add(addedToCartClass);

								updateCartCount();

								setTimeout(() => {
									atcButton.classList.remove(addedToCartClass);
								}, 2000);
							}
						},
					}));
				}
			});
		});

		updateCartCount();

		function updateCartCount() {
			$.ajax({
				type: 'GET',
				url: '/cart.js',
				dataType: 'json',
				success: (cart) => {
					const cartCountLabels = document.querySelectorAll("[data-cart-items-count]");

					if (!cartCountLabels.length) {
						return;
					}

					cartCountLabels.forEach((label) => {
						const itemsCount = cart.items.reduce((quantity, item) => {
							if(!item.properties || !item.properties.hasOwnProperty("_for-bundle-hash")) {
								quantity += item.quantity;
							}

							return quantity;
						}, 0);

						label.innerText = (itemsCount > 99) ? "99+" : (itemsCount > 0) ? itemsCount : 0;
					});
				}
			});
		}

		$(document).on('bundleCustomizerReady', onBundleCustomizerReady);

		function initBundleCustomizer() {
			document.dispatchEvent(new CustomEvent('bundleCustomizerReady'));
		}

		function onBundleCustomizerReady() {
			var sections = new slate.Sections();
			sections.register('bundle-customizer', theme.BundleCustomizer);
		}
	});
})();

window.addEventListener("DOMContentLoaded", initSelect);
window.addEventListener("custom-select:init", initSelect);

function initSelect() {
  const select = $(".js-custom-select");
  const selectDefaultValues = document.querySelectorAll(".js-custom-select .custom-select__default");
  const selectOptions = document.querySelectorAll(".js-custom-select .custom-select__item");

  window.addEventListener("mouseup", (e) => {
    if (!select.is(e.target) && select.has(e.target).length === 0) {
      $('.custom-select').removeClass("custom-select--open");
    }
  });

  selectDefaultValues.forEach((selectDefaultValue) => {
    selectDefaultValue.addEventListener("click", () => {
      const select = selectDefaultValue.closest(".js-custom-select");

      if (!select.classList.contains("custom-select--open")) {
        select.classList.add("custom-select--open");
      } else {
        select.classList.remove("custom-select--open");
      }
    });
  });

  selectOptions.forEach((selectOption) => {
    selectOption.addEventListener("click", (e) => {
      const selectOptionValue = e.target.innerText;
      const selectOptionList = selectOption.parentElement;
      const select = selectOptionList.parentElement;
      const selectDefaultValue = selectOptionList.previousElementSibling.querySelector(".custom-select__default-value");

      selectDefaultValue.innerText = selectOptionValue;
      select.classList.remove("custom-select--open");

      let event = new CustomEvent("custom-select:change", {
        detail: {
          selectedOption: e.target
        }
      });

      select.dispatchEvent(event);
    });
  });
}

;(function () {
  window.addEventListener("DOMContentLoaded", () => {
    const collectionSort = document.querySelector(".js-collection-sort");

    if (!collectionSort) {
      return;
    }

    setCurrentSortOption();

    collectionSort.addEventListener("custom-select:change", sortProducts);

    function setCurrentSortOption() {
      const defaultOption = collectionSort.querySelector(".custom-select__default-value");
      const selectedOption = collectionSort.querySelector("[data-selected]");

      if (!selectedOption) {
        return;
      }

      defaultOption.innerText = selectedOption.innerText;
    }

    function sortProducts(e) {
      const selectedSortByOption = e.detail.selectedOption;
      const selectedSortByOptionValue = selectedSortByOption.dataset.value;
      const paramsString = window.location.search;
      const searchParams = new URLSearchParams(paramsString);

      searchParams.set("sort_by", selectedSortByOptionValue);

      window.location.search = searchParams.toString();
    }
  });
})();

;(function () {
	let loadProductRecommendationsIntoSection = function () {
		// Look for an element with class 'product-recommendations'
		let productRecommendationsSection = document.querySelector(".js-product-recommendations");

		if (productRecommendationsSection === null) {
			return;
		}

		let productId 	= productRecommendationsSection.dataset.productId;
		let limit 		= productRecommendationsSection.dataset.limit;
		let baseUrl 	= productRecommendationsSection.dataset.baseUrl;

		// Build request URL
		let requestUrl = `${baseUrl}?section_id=product-recommendations&limit=${limit}&product_id=${productId}`;

		// Create request and submit it using Ajax
		let request = new XMLHttpRequest();

		request.open("GET", requestUrl);

		request.onload = function () {
			if (request.status >= 200 && request.status < 300) {
				let container = document.createElement("div");
				container.innerHTML = request.response;
				productRecommendationsSection.parentElement.innerHTML = container.querySelector(".product-recommendations").innerHTML;
			}
		};

		request.send();
	};

	// If your section has theme settings, the theme editor
	// reloads the section as you edit those settings. When that happens, the
	// recommendations need to be fetched again.
	// See https://help.shopify.com/en/themes/development/sections/integration-with-theme-editor
	document.addEventListener("shopify:section:load", function (event) {
		if (event.detail.sectionId === "product-recommendations") {
			loadProductRecommendationsIntoSection();
		}
	});

	// Fetching the recommendations on page load
	loadProductRecommendationsIntoSection();
})();

;(function() {
	initIngredientsPopup();

	function initIngredientsPopup() {
		let $popupWrapper = $('.js-ingredients-popup');
		let $popupOpen = $('.js-ingredients-popup-open');
		let $popupClose = $('.js-ingredients-popup-close');

		if (!$popupWrapper.length) {
			return;
		}

		$popupOpen.on('click', function (e) {
			e.preventDefault();
			$popupWrapper.addClass('ingredients-popup--shown');

			setTimeout(() => {
				bodyScrollLock.disableBodyScroll($popupWrapper[0]);
			}, 100);
		});

		$popupClose.on('click', function (e) {
			e.preventDefault();
			$popupWrapper.removeClass('ingredients-popup--shown');

			setTimeout(() => {
				bodyScrollLock.enableBodyScroll($popupWrapper[0]);
			}, 100);
		})
	}
}());

;(function() {
	initBundleComposition();

	const CLASSES = {
		COMPOSITION_WRAPPER_OBJECT: '.js-bundle-composition-wrapper',
		COMPOSITION_ITEM_OPEN: 'bundle-composition__item-wrapper--open'
	};

	function initBundleComposition() {
		let $toggles = $('.js-bundle-composition-toggle');
		let $wrappers = $('.js-bundle-composition-wrapper')

		if (!$toggles.length) {
			return;
		}

		$toggles.on('mouseover', function (e) {
			let $this = $(this);
			let $wrapper = $this.siblings(CLASSES.COMPOSITION_WRAPPER_OBJECT);

			$wrappers.removeClass(CLASSES.COMPOSITION_ITEM_OPEN);
			$wrapper.addClass(CLASSES.COMPOSITION_ITEM_OPEN);
		});

		$toggles.on('mouseout', function (e) {
			$wrappers.removeClass(CLASSES.COMPOSITION_ITEM_OPEN);
		});
	}
}());

;(function () {
  window.addEventListener("DOMContentLoaded", () => {
    const quantityInputs = document.querySelectorAll(".cart .js-product-quantity-input");

    if (!quantityInputs.length) {
      return;
    }

    quantityInputs.forEach((input) => {
      const form = input.closest("form");

      if (!form) {
        return;
      }

      input.addEventListener("change", () => {
        if (input.value !== "") {
          form.submit();
        }
      });
    });
  });
})();

;(function () {
	initContactUsForms();

	function initContactUsForms() {
		let $contactUsSelect = $(".js-contact-us-forms");

		if (!$contactUsSelect.length) {
			return;
		}

		$contactUsSelect.on("custom-select:change", function (event) {
			let $selectOption = $(event.detail.selectedOption);
			let value = $selectOption.attr('data-value');
			let $currentTab = $(`[data-tab-value='${value}']`);
			let $formTabs = $('.js-form-tab');

			$formTabs.removeClass('about-contact__form-tab--show');
			$currentTab.addClass('about-contact__form-tab--show');
		});
	}
})();

;(function () {
	document.addEventListener("cart:item_count", updateCartCount);

	function updateCartCount(event) {
		let itemsCount = $('[data-cart-items-count]');

		let cartCount 			= event.detail.item_count;
		let formattedCartCount 	= (cartCount > 99) ? '99+' : (cartCount > 0) ? cartCount : 0;

		itemsCount.html(formattedCartCount);
	}
})();
;(function () {
	initArticleSlider();

	function initArticleSlider() {
		let slider = $('[data-article-slider]');

		if (!slider.length) {
			return;
		}

		const SLIDES_TO_SHOW 	= 3;
		const SLIDES_TO_SCROLL 	= 1;

		let sliderArrowPrev = $('[data-article-slider-arrow-prev]');
		let sliderArrowNext = $('[data-article-slider-arrow-next]');

		slider.slick({
			infinite: true,
			slidesToShow: SLIDES_TO_SHOW,
			slidesToScroll: SLIDES_TO_SCROLL,
			draggable: false,
			swipe: false,
			arrows: true,
			prevArrow: sliderArrowPrev,
			nextArrow: sliderArrowNext,
			dots: false,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						draggable: true,
						swipe: true
					}
				},
				{
					breakpoint: 481,
					settings: {
						slidesToShow: 1
					}
				}
			]
		});
	}
})();
;(function () {
	const redirect = (targetLocation) => {
		return window.location.replace(targetLocation);
	}

	const redirectFrom 	= ['/collections', '/products'];
	const redirectTo 	= '/collections/shop';

	let currentLocation = window.location.pathname;

	if (redirectFrom.includes(currentLocation)) {
		redirect(redirectTo);
	}
})();
;(function () {
	const head 		= $('head');
	const metaTag 	= '<meta name="robots" content="noindex">';

	const appendNoIndexMeta = () => {
		return head.append(metaTag);
	}

	const noIndexPages 	= ['/collections/facebook-catalog', '/blogs/blog'];
	let currentLocation = window.location.pathname;

	if (noIndexPages.includes(currentLocation)) {
		appendNoIndexMeta();
	}
})();
