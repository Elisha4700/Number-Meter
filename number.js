
var Num = {
 	settings : {
 		animation_speed    : 1000,
 		// list_template_up   : '<ul id="--index--" data-dir="up"><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li></ul>',
 		// list_template_down : '<ul id="--index--" data-dir="down"><li>9</li><li>8</li><li>7</li><li>6</li><li>5</li><li>4</li><li>3</li><li>2</li><li>1</li><li>0</li><li>9</li><li>8</li><li>7</li><li>6</li><li>5</li><li>4</li><li>3</li><li>2</li><li>1</li><li>0</li></ul>',
 		list_template_up   : '<ul id="--index--" data-dir="up"><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>0</li></ul>',
 		list_template_down : '<ul id="--index--" data-dir="down"><li>9</li><li>8</li><li>7</li><li>6</li><li>5</li><li>4</li><li>3</li><li>2</li><li>1</li><li>0</li></ul>',
 		effect             : 'plain', // can be: 'meter', 'plain', 'slot', 'linear'
 		direction          : 'up' // direction the numbers scroll: can be either: 'up', 'down', 'alternate'
 	},

	init : function() {

		$('#ok').on( 'click', function(){ 
			Num.setDirection(); 
			Num.setDigits(); 
		});
		
		$('#go').on( 'click', function(){ 
			Num.goTo( $('#goto-n').val() ); 
		});
		
		$('#loop').on( 'click', function(){ 
			Num.startAnimating( $('#n-loops').val() ); 
		});
		
		$('#reset').on( 'click', function(){ 
			Num.reset(); 
		});

		$('#n').keydown(function(event) {
			if (event.which == 13) {
				Num.setDirection(); 
				Num.setDigits(); 
			}
		});


	},

	setDirection : function() {
		Num.settings.direction = ($('#up').is(':checked')) ? 'up' : 'down' ;
	},

	setDigits : function() {
		var $elem = $('#number'),
			number = $('#n').val(),
			temp_number = 0,
			counter = 1,
			dir = Num.settings.direction;

		$elem.html('');
		
		while( number > 0 ) {
			temp_number = number % 10;
			$elem.prepend( Num.getTemplate( dir, counter ) );
			
			// e = just prepended element
			var e = $('#index-' + counter );

			if( dir != 'up' ) {
				e.css('margin-top', '-' + (( e.height() / 20 ) * 19 ) + 'px');
			}

			e.attr('goto', temp_number );

			number = Math.floor( number / 10 );
			counter += 1;
		}

		$('#number ul').each(function(){
			Num.animateDigit( $(this) );
		});

		( $('#index-' + counter), temp_number );
	},

	reset : function() {
		$('#number ul').css('margin-top', '0');
	},

	getTemplate : function( direction, index ) {
		direction = direction || 'up';
		var template = '';

		if( direction == 'up' ) {
			template = Num.settings.list_template_up;
		} else {
			template = Num.settings.list_template_down;
		}
		
		return template.replace('--index--', 'index-' + index );
	},

	startAnimating : function( loops ) {

		var $this = $('#index-1'),
			list_height = ($this.height() / 11 ) * 10;

		var f = function($this, count) {

			$this.animate({'margin-top': '-' + list_height + 'px'}, 2500, 'linear',function() {
				$this.css('margin-top', '0');

				if (count > 1) {
					count = count - 1;
					f($this, count);
				}
			});
		};


		f($this, loops );

	},

	animateDigit : function( $this ) {
		var item_height      = $this.find('li').height(),
			number           = $this.attr('goto'),
			animation_height = (number * item_height),
			speed            = ( Num.settings.animation_speed / 10 ) * number,
			direction        = ( $this.data('dir') == 'up' ) ? '-' : '+' ;


		$this.animate({'margin-top' : direction + '=' + animation_height + 'px'}, speed, 'linear' );

	}, 

	loopDigit : function( $this, speed ) {
		var item_height      = $this.find('li').height(),
			count            = $this.attr('goto'),
			animation_height = (number * item_height),
			speed            = ( Num.settings.animation_speed / 10 ) * number,
			direction        = ( $this.data('dir') == 'up' ) ? '-' : '+' ;

		
		var f = function($this, count) {

			$this.animate({'margin-top': direction + '=' + animation_height + 'px'}, speed, 'linear',function() {
				
				if( count > 10 )
					$this.append(  $this.find('li').slice(0,10) ).css('margin-top', '0');

				if (count > 0) {
					count -= 10;
					f($this, count);
				}
			});
		};

		f( $this, count );
	}

}


$( Num.init );