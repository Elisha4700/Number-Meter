/*
 *	Number Meter - jQuery Plugin
 *	
 *	Animation for number simulating the old number meter
 *	Demos and documentation: http://dev.sinapsa.co.il
 *
 *	Version: 0.1
 *	Requires: jQuery v1.3.2+
 *	
 *	Copyright (c) 2012: Elisha Shapiro, elishas@sinapsa.co.il, @elisha_shapiro
 *	Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
$.fn.numberMeter = function( user_settings_obj ){

	// Private Static Attributes
	// var _total_digits_on_page;


	this._settings = {
			loops          : 0,         // Number of loops the digit will go to before it stops on the correct number. this is only relevant for: Plain and Equal effects. other effects override this option.		
			speed          : 1800,
			direction      : 'up',
			animation_type : 'plain',
			element_height : 0,
			seperate       : false,
			seperator_char : ',',       // seperator character 
			seperate_every : 3,         // puts seperator charachter every X digits - use this to acheve effect: 1220350 => 1,220,350
			onInit         : null,
			onBeforeAnimateDigit : null // occurs before animating digit. recieves arguments: $elem, distance, speed, direction.
		};

	this._digits = [];
	this._next_digits = [];
	this._number = 0;

	// Private Statioc Object
	var Effects = {
			
			// meter like in an old gas station a meter that shows you how much fuel you've taken
			// the one's digit must loop through all 10 digist - the tens moves +1 
			Meter : {

				getAnimationObject : function( digit_index, total_digits, digit, speed, loops, direction ) {
					var _speed        = Effects.Meter.calcSpeed( digit_index, speed ),
						_distance     = Effects.Meter.calcDistance( digit_index, digit ),
						_direction    = Effects.Meter.calcDirection( direction ),
						_animationObj = {
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, speed ) {
					var s = speed;
					s = (s / Math.pow(10, digit_index - 1 ));
					return Math.floor( s );
				},

				calcDistance : function( digit_index, digit ) {
					return digit + Math.pow(10, digit_index - 1 );
				},

				calcDirection : function( direction ) {
					return direction;
				}

			},


			// look like a slot machine:
			// all the numbers are running - the right digit stops, the others are still looping...
			Slot : {

				getAnimationObject : function( digit_index, total_digits, digit, speed, loops, direction ) {
					var _speed        = Effects.Slot.calcSpeed( digit_index, speed ),
						_distance     = Effects.Slot.calcDistance( digit ),
						_direction    = Effects.Slot.calcDirection( direction ),
						_animationObj = {
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, speed ) {
					var _mod = digit_index % 3, // will result in: 0 or 1 or 2.
						s = Math.floor(speed / 3); 

					if( _mod == 1 ) {
						return Math.floor(s * 0.4) ; 
					} else if( _mod == 2 ) {
						return Math.floor(s * 0.75) ; 
					}

					// _mod == 0
					return s;
				},

				calcDistance : function( digit ) {
					return 30 + digit;
				},

				calcDirection : function( direction ) {
					return direction;
				}

			},


			// Plain is the most natural effect - the numbers scrolls and stops when reaches the correct number
			// the number 8 will scroll twice as long then number 4.
			Plain : {

				getAnimationObject : function( digit_index, total_digits, digit, speed, loops, direction ) {
					var _speed        = Effects.Plain.calcSpeed( digit, speed ),
						_distance     = Effects.Plain.calcDistance( digit, loops ),
						_direction    = Effects.Plain.calcDirection( direction ),
						_animationObj = {
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit, speed ) {
					return Math.floor( (speed / 11) * digit );
				},

				calcDistance : function( digit, loops ) {
					return digit + ( loops * 10 );
				},

				calcDirection : function( direction ) {
					return direction;
				}

			},


			// each number will animate in a different speed, 
			// so that all the numbers will come to a hult at the same time
			Equal : {

				getAnimationObject : function( digit_index, total_digits, digit, speed, loops, direction ) {
					
					var _speed        = Effects.Equal.calcSpeed( speed ),
						_distance     = Effects.Equal.calcDistance( digit, loops ),
						_direction    = Effects.Equal.calcDirection( direction ),
						_animationObj = {
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( speed ) {
					return speed;
				},

				calcDistance : function( digit, loops ) {
					return digit + ( loops * 10 );
				},

				calcDirection : function( direction ) {
					return direction;
				}

			},


			// all numbers run in different speeds and in different directions
			// starts like chaos and ant the end of the animation - the number reveals
			Scramble : {

				getAnimationObject : function( digit_index, total_digits, digit, speed, loops, direction ) {
					var _speed        = Effects.Scramble.calcSpeed( speed ),
						_distance     = Effects.Scramble.calcDistance( digit ),
						_direction    = Effects.Scramble.calcDirection( digit_index ),
						_animationObj = {
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( speed ) {
					return Math.floor( ( speed / 11 ) * digit );
				},

				calcDistance : function( digit ) {
					return digit + Math.floor(Math.random() * 10) * 10;
				},

				calcDirection : function( digit_index ) {
					if( digit_index % 2 ) {
						return 'up';
					} else {
						return 'down';
					}
				}

			}
	
	};

	// private static function
	// this algorythms pushes the number right to left:
	// the number 6358 will result in array: [8,5,3,6] - which makes it easier to pop
	var numberToArray = function( number ) {

		var temp_number = 0,
			numbers_array = [];

		while( number > 0 ) {
			temp_number = number % 10;
			numbers_array.push( temp_number );
			number = Math.floor( number / 10 );
		}

		return numbers_array;
	};

	this.getAnimationObject = function( digit_index, total_digits, digit, effect ) {

		switch( effect ) {
			case 'slot':
				return Effects.Slot.getAnimationObject( digit_index, total_digits, digit, this._settings.speed, this._settings.loops, this._settings.direction );
				break;

			case 'meter':
				return Effects.Meter.getAnimationObject( digit_index, total_digits, digit, this._settings.speed, this._settings.loops, this._settings.direction );
				break;

			case 'scramble':
				return Effects.Scramble.getAnimationObject( digit_index, total_digits, digit, this._settings.speed, this._settings.loops, this._settings.direction );
				break;

			case 'equal':
				return Effects.Equal.getAnimationObject( digit_index, total_digits, digit, this._settings.speed, this._settings.loops, this._settings.direction );
				break;

			default:
				return Effects.Plain.getAnimationObject( digit_index, total_digits, digit, this._settings.speed, this._settings.loops, this._settings.direction );
				break;
		}
	
	};

	this.init = function( numeric_value, user_settings_obj ) {

		var temp_number = 0,
			number = parseInt( numeric_value );

		if( isNaN(number) ) {
			console.log( 'The value passed was not numeric' );
			return false;
		}
			
		$(this).attr('number', numeric_value).html('');

		this._number = number;

		// overrides the settigns object with the settings passed by the user.
		$.extend(this._settings, user_settings_obj);

		this._digits = numberToArray( number );

		this.calculateAnimation();

		if( typeof this._settings.onInit === 'function' )
			this._settings.onInit();

	};

	this.getTemplate = function( index, direction ) {
		var template_up = '<ul class="index-' + index + ' appended" data-dir="up"><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li></ul>',
			template_down = '<ul class="index-' + index + ' appended" data-dir="down"><li>0</li><li>9</li><li>8</li><li>7</li><li>6</li><li>5</li><li>4</li><li>3</li><li>2</li><li>1</li><li>0</li></ul>';
		return ( direction == 'up' ) ? template_up : template_down ;
	};

	this.getSeperator = function( seperator ) {
		return '<ul><li>' + this._settings.seperator_char +'</li></ul>';		
	};

	this.needsSeperator = function( digit_index ) {
		if( !this._settings.seperate || digit_index == 0 )
			return false;


		if( (digit_index % this._settings.seperate_every) == 0 ) {
			return true;
		}

		return false;
	}

	this.calculateAnimation = function() {

		var digit         = 0,
			speed         = this._settings.speed,
			template      = '',
			direction     = this._settings.direction,
			total_digits  = this._digits.length,
			digit_index   = 0,
			animationObj  = {};
		

		// loops all over the digits - calculates the distance, speed and direction according to effect.
		while( this._digits.length > 0 ) {
			
			// digit is the actual number 0 - 9
			digit = this._digits.shift();

			// object containing speed, direction, distance (how many steps to go until reaching the digit)
			animationObj = this.getAnimationObject( digit_index, total_digits, digit, this._settings.effect );

			if( this.needsSeperator( digit_index ) ) {
				$(this).prepend( this.getSeperator() );	
			} 

			// appending the element to the DOM.
			$(this).prepend( this.getTemplate( digit_index, animationObj.direction ) );

			// getting the appended element reference from the DOM.
			elem = $('.appended');
			elem.removeClass('appended').attr('digit', digit);

			// invoking the animation on this element.
			this.animateDigit( elem, animationObj.distance, animationObj.speed, animationObj.direction );

			digit_index += 1;
		}

	};

	this.animateDigit = function( $elem, distance, speed, direction ) {
		
		if( typeof this._settings.onBeforeAnimateDigit === 'function' ) {
			this._settings.onBeforeAnimateDigit( $elem, distance, speed, direction );
		}

		// will preform the animation algorythm - recieves the element to preform animation on and the parameters
		var dir = (direction == 'up') ? '-' : '+',
			_list_height = $elem.height(),
			_elem_height = Math.floor( _list_height / 11 );
			_element_reset = (direction == 'up') ? '0' : '-' + (_elem_height * 10)+ 'px' ;

		// Element Reset for starting position
		$elem.css('margin-top', _element_reset );	


		var loop = function( $elem, distance ) {

			var go_to = ( distance > 10 ) ? 10 : distance;

			$elem.animate({'margin-top': dir + '=' + ( _elem_height * go_to ) + 'px'}, speed, 'linear', function() {

				// Another loop is in order
				if ( distance > 10 ) {
					$elem.css( 'margin-top', _element_reset );
					distance -= 10;
					loop( $elem, distance );
				}
			});
		};


		loop( $elem, distance );

	};

	this.addNumber = function( addition ) {
		this._next_digits = numberToArray( this._number + addition );
		var new_digits = this._next_digits;

		$(this).find('ul').each(function(){
			
			var _d = new_digits.pop();

			if( $(this).attr('digit') != _d )
				console.log( _d, $(this) );

		});

	};

	this.subNumber = function( substraction ) {

	};

	this.restart = function( number, settings ) {
		var _n = $(this).attr('number'),
			_s = settings || {};


		if( typeof number === 'string' || typeof number === 'number' ) {
			_n = number;
		}

		if( typeof number === 'object' ) {
			_s = number;
		}

		this.init( _n, _s );	
	}


	// Initialization begins
	this.init( $(this).html(), user_settings_obj );

	return this;

};