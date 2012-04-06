/*
 *	Number Meter - jQuery Plugin
 *	
 *	Animation for number simulating the old number meter
 *	Demos and documentation: http://dev.sinapsa.co.il
 *
 *	Version: 0.1
 *	Requires: jQuery v1.7.1+
 *	
 *	Copyright (c) 2012: Elisha Shapiro, elishas@sinapsa.co.il, @elisha_shapiro
 *	Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
$.fn.numberMeter = function(settings){

	var $number = $(this), 
		_digits = [],
		_number = 0,
		_settings = {
			speed : 1000,
			animation_type : 'plain',
			direction      : 'up',
			element_height : 0,
			loops          : 0 // Number of loops the digit will go to before it stops on the correct number. this is only relevant for: Plain and Equal effects. other effects override this option.		
		};

	
	var Effects = {
			
			// meter like in an old gas station a meter that shows you how much fuel you've taken
			// the one's digit must loop through all 10 digist - the tens moves +1 
			Meter : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Meter.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Meter.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Meter.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect    : 'meter',
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					var s = Num.settings.speed;
					s = (s / Math.pow(10, digit_index - 1 ));
					return Math.floor( s );
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + Math.pow(10, digit_index - 1 );
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// look like a slot machine:
			// all the numbers are running - the right digit stops, the others are still looping...
			Slot : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Slot.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Slot.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Slot.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect    : 'slot',
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					var _mod = digit_index % 3,
						s = Num.settings.speed / 3; // will result in: 0 or 1 or 2.

					if( _mod == 0 ) {
						return Math.floor(s * 0.4) ; 
					} else if( _mod == 1 ) {
						return Math.floor(s * 0.75) ; 
					}

					return s;

				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return 30 + digit;
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// Plain is the most natural effect - the numbers scrolls and stops when reaches the correct number
			// the number 8 will scroll twice as long then number 4.
			Plain : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Plain.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Plain.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Plain.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect : 'plain',
							speed : _speed,
							direction : _direction,
							distance : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					return Math.floor( ( Num.settings.speed / 11 ) * digit );
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + ( Num.settings.loops * 10 );
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// each number will animate in a different speed, 
			// so that all the numbers will come to a hult at the same time
			Equal : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Equal.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Equal.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Equal.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect    : 'equal',
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					return Num.settings.speed;
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + ( Num.settings.loops * 10 );
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// all numbers run in different speeds and in different directions
			// starts like chaos and ant the end of the animation - the number reveals
			Scramble : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Scramble.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Scramble.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Scramble.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							speed : _speed,
							direction : _direction,
							distance : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					return Math.floor( ( Num.settings.speed / 11 ) * digit );
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + Math.floor(Math.random() * 10) * 10;
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					if( digit_index % 2 ) {
						return 'up';
					} else {
						return 'down';
					}
				}

			}		
	
	};


	this.getAnimationObject = function( digit_index, total_digits, digit, effect ) {
		switch(effect) {
			case 'slot':
				return Effects.Slot.getAnimationObject( digit_index, total_digits, digit );
				break;

			case 'meter':
				return Effects.Meter.getAnimationObject( digit_index, total_digits, digit );
				break;

			case 'scramble':
				return Effects.Scramble.getAnimationObject( digit_index, total_digits, digit );
				break;

			case 'equal':
				return Effects.Equal.getAnimationObject( digit_index, total_digits, digit );
				break;

			default:
				return Effects.Plain.getAnimationObject( digit_index, total_digits, digit );
				break;
		}
	};

	this.init = function( numeric_value ) {

		var tempnumber = 0,
			number = parseInt( numeric_value );

		if( isNaN(number) ) {
			console.log( 'The value passed was not numeric' );
			return false;
		}
		

		_number = number;


		// this algorythms pushes the number right to left:
		// the number 6358 will result in array: [8,5,3,6] - which makes it easier to pop
		while( number > 0 ) {
			tempnumber = number % 10;
			_digits.push( tempnumber );
			number = Math.floor( number / 10 );
		}

		console.log( _digits );

	};

	this.getTemplate = function( index, direction ) {
		var template_up = '<ul id="index-' + index + '" data-dir="up"><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li></ul>',
			template_down = '<ul id="index-' + index + '" data-dir="down"><li>0</li><li>9</li><li>8</li><li>7</li><li>6</li><li>5</li><li>4</li><li>3</li><li>2</li><li>1</li><li>0</li></ul>';
		return ( direction == 'up' ) ? template_up : template_down ;
	};

	this.calculateAnimation = function() {

		var digit         = 0,
			speed         = Num.settings.speed,
			template      = '',
			direction     = Num.settings.direction,
			total_digits  = Num._digits.length,
			digit_index   = 1, 
			animationObj  = {};
		

		// loops all over the digits - calculates the distance, speed and direction according to effect.
		while( this._digits.length > 0 ) {
			
			// digit is the actual number 0 - 9
			digit = this._digits.pop();

			// object containing speed, direction, distance (how many steps to go until reaching the digit)
			animationObj = this.getAnimationObject( digit_index, total_digits, digit, _settings.effect );

			// appending the element to the DOM.
			$number.append( this.getTemplate( digit_index, animationObj.direction ) );

			// getting the appended element reference from the DOM.
			elem = $('#index-' + digit_index);

			// invoking the animation on this element.
			this.animateDigit( elem, animationObj.distance, animationObj.speed, animationObj.direction );

			digit_index += 1;
		
		}


	};

	this.animateDigit = function( $elem, distance, speed, direction ) {
			
		// will preform the animation algorythm - recieves the element to preform animation on and the parameters
		var dir = (direction == 'up') ? '-' : '+',
			_list_height = $elem.height(),
			_elem_height = Math.floor( _list_height / 11 );
			_element_reset = (direction == 'up') ? '0' : '-' + (_elem_height * 10)+ 'px' ;

		

		// $elem.animate({'margin-top': dir + '=' + (_elem_height * distance) + 'px'}, speed, 'linear' );


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

	}




	var Num = {

		// will contain the digits - split into an array.
		_digits : [],

		// the default settings - this will be overriden by user settings if supplied.
		settings : {
			speed : 1000,
			animation_type : 'plain',
			direction      : 'up',
			element_height : 0,
			loops          : 0 // Number of loops the digit will go to before it stops on the correct number. this is only relevant for: Plain and Equal effects. other effects override this option.
		},


		effects : {

			getAnimationSettings : function( digit_index, total_digits, digit, effect ) {

				switch(effect) {
					case 'slot':
						return Num.effects.Slot.getAnimationObject( digit_index, total_digits, digit );
						break;

					case 'meter':
						return Num.effects.Meter.getAnimationObject( digit_index, total_digits, digit );
						break;

					case 'scramble':
						return Num.effects.Scramble.getAnimationObject( digit_index, total_digits, digit );
						break;

					case 'equal':
						return Num.effects.Equal.getAnimationObject( digit_index, total_digits, digit );
						break;

					default:
						return Num.effects.Plain.getAnimationObject( digit_index, total_digits, digit );
						break;
				}

			},


			// meter like in an old gas station a meter that shows you how much fuel you've taken
			// the one's digit must loop through all 10 digist - the tens moves +1 
			Meter : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Meter.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Meter.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Meter.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect    : 'meter',
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					var s = Num.settings.speed;
					s = (s / Math.pow(10, digit_index - 1 ));
					return Math.floor( s );
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + Math.pow(10, digit_index - 1 );
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// look like a slot machine:
			// all the numbers are running - the right digit stops, the others are still looping...
			Slot : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Slot.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Slot.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Slot.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect    : 'slot',
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					var _mod = digit_index % 3,
						s = Num.settings.speed / 3; // will result in: 0 or 1 or 2.

					if( _mod == 0 ) {
						return Math.floor(s * 0.4) ; 
					} else if( _mod == 1 ) {
						return Math.floor(s * 0.75) ; 
					}

					return s;

				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return 30 + digit;
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// Plain is the most natural effect - the numbers scrolls and stops when reaches the correct number
			// the number 8 will scroll twice as long then number 4.
			Plain : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Plain.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Plain.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Plain.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect : 'plain',
							speed : _speed,
							direction : _direction,
							distance : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					return Math.floor( ( Num.settings.speed / 11 ) * digit );
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + ( Num.settings.loops * 10 );
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// each number will animate in a different speed, 
			// so that all the numbers will come to a hult at the same time
			Equal : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Equal.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Equal.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Equal.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							effect    : 'equal',
							speed     : _speed,
							direction : _direction,
							distance  : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					return Num.settings.speed;
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + ( Num.settings.loops * 10 );
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					return Num.settings.direction;
				}

			},


			// all numbers run in different speeds and in different directions
			// starts like chaos and ant the end of the animation - the number reveals
			Scramble : {

				getAnimationObject : function( digit_index, total_digits, digit ) {
					var _speed = Num.effects.Scramble.calcSpeed( digit_index, total_digits, digit ),
						_distance = Num.effects.Scramble.calcDistance( digit_index, total_digits, digit ),
						_direction = Num.effects.Scramble.calcDirection( digit_index, total_digits, digit ),
						_animationObj = {
							speed : _speed,
							direction : _direction,
							distance : _distance
						};

					return _animationObj;
				},

				calcSpeed : function( digit_index, total_digits, digit ) {
					return Math.floor( ( Num.settings.speed / 11 ) * digit );
				},

				calcDistance : function( digit_index, total_digits, digit ) {
					return digit + Math.floor(Math.random() * 10) * 10;
				},

				calcDirection : function( digit_index, total_digits, digit ) {
					if( digit_index % 2 ) {
						return 'up';
					} else {
						return 'down';
					}
				}

			}

		},


		init : function( number, settings ) {

			console.log( number );

			$.extend( Num.settings, settings );


			

			// $('#ok').on( 'click', function(){ 
			// 	Num.setup();
			// });
			

			// $('#n').keydown(function(event) {
			// 	if (event.which != 13)
			// 		return;

			// 	Num.setup();
			// });
			
			Num.setup( number );

		}, 

		// more like setup and run. Runs the setup and the Runs the numbers.
		setup : function( num ) {

			// setup data
			var tempnumber = 0,
				number = num; 
				// $('#n').val();

			// this algorythms pushes the number right to left:
			// the number 6358 will result in array: [8,5,3,6] - which makes it easier to pop
			while( number > 0 ) {
				tempnumber = number % 10;
				Num._digits.push( tempnumber );
				number = Math.floor( number / 10 );
			}


			// setup animation effect
			// Num.settings.effect = $('#effect').val();
			

			// setup speed
			// Num.settings.speed = parseInt( $('#speed').val() );


			// setup direction
			// Num.settings.direction = ($('#up').is(':checked')) ? 'up' : 'down' ;


			// setup loops - if you want it to go through X loops before it stops.
			// Num.settings.loops = parseInt( $('#n-loops').val() );


			// console.log( Num.settings );
			$number.html('');

			// Run the Numbers Please 
			Num.calculateAnimation(); 

		},

		getTemplate : function( index, direction ) {
			var template_up = '<ul id="index-' + index + '" data-dir="up"><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li></ul>',
				template_down = '<ul id="index-' + index + '" data-dir="down"><li>0</li><li>9</li><li>8</li><li>7</li><li>6</li><li>5</li><li>4</li><li>3</li><li>2</li><li>1</li><li>0</li></ul>';
			return ( direction == 'up' ) ? template_up : template_down ;
		},


		calculateAnimation : function() {

			var digit         = 0,
				speed         = Num.settings.speed,
				template      = '',
				direction     = Num.settings.direction,
				total_digits  = Num._digits.length,
				digit_index   = 1, 
				animationObj  = {};
			

			// loops all over the digits - calculates the distance, speed and direction according to effect.
			while( Num._digits.length > 0 ) {
				
				// digit is the actual number 0 - 9
				digit = Num._digits.pop();

				// object containing speed, direction, distance (how many steps to go until reaching the digit)
				animationObj = Num.effects.getAnimationSettings( digit_index, total_digits, digit, Num.settings.effect );

				// appending the element to the DOM.
				$number.append( Num.getTemplate( digit_index, animationObj.direction ) );

				// getting the appended element reference from the DOM.
				elem = $('#index-' + digit_index);

				// invoking the animation on this element.
				Num.animateDigit( elem, animationObj.distance, animationObj.speed, animationObj.direction );

				digit_index += 1;
			
			}


			// Num.settings.element_height = $('#index-1 li').height();

		},

		animateDigit : function( $elem, distance, speed, direction ) {
			
			// will preform the animation algorythm - recieves the element to preform animation on and the parameters
			var dir = (direction == 'up') ? '-' : '+',
				_list_height = $elem.height(),
				_elem_height = Math.floor( _list_height / 11 );
				_element_reset = (direction == 'up') ? '0' : '-' + (_elem_height * 10)+ 'px' ;

			

			// $elem.animate({'margin-top': dir + '=' + (_elem_height * distance) + 'px'}, speed, 'linear' );


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

		}


	}


	this.init( $number.html(), settings );

}