
var Num = {
 	settings : {
 		animation_speed : 1000,
 		list_template : '<ul id="--index--"><li class="first">0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li class="nine">9</li><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li class="nine">9</li></ul>',
 		effect : 'plain', // can be: 'meter', 'plain', 'slot', 'linear', 'random'
 		direction : 'up' // direction the numbers scroll: can be either: 'up' or 'down'
 	},

	init : function() {

		$('#ok')   .on( 'click', function(){ Num.setNumber(); });
		$('#go')   .on( 'click', function(){ Num.goTo( $('#goto-n').val() ); });
		$('#loop') .on( 'click', function(){ Num.startAnimating( $('#n-loops').val() ); });
		$('#reset').on( 'click', function(){ Num.reset(); });

	},

	setNumber : function() {
		var $elem = $('#number'),
			number = $('#n').val(),
			temp_number = 0,
			counter = 1;

			$elem.html('');
		
		while( number > 0 ) {
			temp_number = number % 10;
			console.log( temp_number );
			var template = Num.settings.list_template;
			template = template.replace('--index--', 'index-' + counter );
			$elem.append( template );
			Num.goTo( $('#index-' + counter), temp_number );
			number = Math.floor( number / 10 );
			counter += 1;
		}

	},

	reset : function() {
		$('#index-1').css('margin-top', '0');
	},

	startAnimating : function( loops ) {

		var $this = $('#index-1'),
			list_height = $this.height() / 2 ;

		var f = function($this, count) {

			$this.animate({'margin-top': '-' + list_height + 'px'}, Num.settings.animation_speed, 'linear',function() {
				$this.append($("#index-1 li").slice(0,10)).css('margin-top', '0');

				if (count > 1) {
					count = count - 1;
					f($this, count);
				}
			});
		};

		f($this, loops );

	},

	goTo : function( $this, number ) {
		var item_height = $this.find('li').height(),
			animation_height = (number * item_height),
			speed = ( Num.settings.animation_speed / 10 ) * number;

		$this.animate({'margin-top': '-' + animation_height + 'px'}, speed, 'linear',function() {
			// $this.append($("#index-1 li").slice(0,10)).css('margin-top', '0');
		});

	}



}

$(document).ready(function(){
	Num.init();
});