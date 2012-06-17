/*! jQuery Modals is just another lightbox plugin – by @drublic */

/*global log */
(function ($) {

	$.fn.modals = function (options) {

		// Set some defaults
		var defaults = {
			hasNav: true,
			navTemplate: '<div class="nav"><a href="{{prev}}" data-target="{{prev_target}}" class="prev">&larr;</a><a href="{{next}}" data-target="{{next_target}}" class="next">&rarr;</a></div>'
		};

		// Merge them with the options passed
		var settings = $.extend(defaults, options);

		// Navigation
		var Navigation = function () {

			// Method for rendering navigation
			var render = function (data) {
				var key;

				for (key in data) {
					settings.navTemplate = settings.navTemplate.replace('{{' + key + '}}', data[key]);
				}

				return settings.navTemplate;
			};


			// Add a navigation to modals
			return {
				createNav: function ($el) {
					$el.each(function() {
						var $nav, $target,
							data = {},
							$that = $(this).closest('article');

						if ($that.next().size() > 0) {
							$target = $that.next().find('a[data-target]');
							data.next = $target.attr('href');
							data.next_target = $target.data('target');
						}

						if ($that.prev().size() > 0) {
							$target = $that.prev().find('a[data-target]');
							data.prev = $target.attr('href');
							data.prev_target = $target.data('target');
						}

						// Render navigation
						$nav = render(data);

						$(this).append($nav);
					});

				},

				events: function () {

					// Keyboard navigation
					$(document).on('keyup', function(e) {
						if ($('.modal.in').size() > 0) {
							if (e.which === 37 && $('.modal.in .prev[href^="#"]').size() > 0) {
								$('.modal.in .prev').trigger('click');
							}

							if (e.which === 39 && $('.modal.in .next[href^="#"]').size() > 0) {
								$('.modal.in .next').trigger('click');
							}
						}
					});
				}
			};
		};


		// The backdrop/overlay
		var Backdrop = function () {

			var attributes = {
				identifier: 'backdrop'
			};

			// Events for backdrop
			var events =  function () {
				$(document)

					// Click
					.on('click', '.' + attributes.identifier, function (e) {
						modal.hide();
					})

					// ESC-key
					.on('keyup', function (e) {
						if (e.keyCode === 27) {
							modal.hide();
						}
					});
			};

			return {

				// Show it
				show: function () {

					// Check if it already exists
					if ($('.' + attributes.identifier).size() < 1) {
						$('<div>', {
							'class': attributes.identifier
						}).appendTo('body');

						events();
					}

					// And show it
					$('.' + attributes.identifier).addClass('in');
				},

				// Hide the backdrop
				hide: function () {
					$('.' + attributes.identifier).fadeOut( function() {
						$(this).remove();
					});
				}
			};
		};

		// Create instance of Backdrop
		var backdrop = new Backdrop();

		// Stuff for modals
		var Modal = function () {

			var events = function () {

				// Call modal
				$('a[data-target]').on('click', function (e) {
					e.stopImmediatePropagation();
					modal.show( $(this).data('target') );
				});

				// When clicking close
				$(document).on('click', '.modal .close', function (e) {
					e.stopImmediatePropagation();
					modal.hide();
				});

			};

			// Self evoking init-function
			var init = function () {
				events();

				// Create a navigation
				var navigation = (settings.hasNav) ? new Navigation() : false;

				// Move all modals at end of page
				var $container = $('<div>', {
					id : 'modal-container'
				});

				$('.modal').each(function () {

					// Append the nav
					if (navigation) {
						navigation.createNav( $(this) );
					}

					// Append to container
					$(this).appendTo( $container );
				});

				// Append container to body
				$container.appendTo('body');

				// Init events for navigation
				if (navigation) {
					navigation.events();
				}

			} ();

			return {

				// Show it
				show: function (el) {

					if ($('.modal.in').size() > 0) {
						$('.modal.in').removeClass('in');

						setTimeout( function () {
							$(el).addClass('in');
						}, 500);
					} else {
						$(el).addClass('in');
					}

					backdrop.show();
				},

				// Hide it
				hide: function () {
					backdrop.hide();
					$('.modal.in').removeClass('in');
				}
			};

		};

		// Create instance of modals
		var modal = new Modal();

	};


}(jQuery));
