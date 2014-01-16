/*!
 * plopup - plopup
 * http://adamtavares.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
;(function($) {
	function plopup( elem, options, id ) {
		var self = this;
		self.elem = elem;
		self.id = id;
		self.init( elem, options );
	}
	plopup.prototype.init = function( context, options ) {
		
		//----------------------
		//	Set default options 
		//----------------------
		options = jQuery.extend({
			close_button:'close'
		}, options);
		
		//----------------------------------------
		//	Instance scalar variables & constants
		//----------------------------------------
		obj = {
			id:null,
			HIDDEN:'-9999px'
		};
		plopup.prototype.create( context, options, obj );
	}
	
	plopup.prototype.position = function( context, options, obj ) {
		var left = ( $(window).width() - $(context).width() ) / 2;
		var top = ( $(window).height() - $(context).height() ) / 2;
		$( context ).css({ 
			'display':'block',
			'position':'absolute',
			'z-index':'1000',
			'top':top+'px',
			'left':left+'px'
		});
	}
	
	plopup.prototype.create = function( context, options, obj ) {
		//---------------
		//	Stash the id 
		//---------------
		obj['id'] = $( context ).attr('id');
		
		//---------------------------------
		//	Make sure the element's hidden 
		//---------------------------------
		$( context ).css({'display':'none' });
		
		//------------------------
		//	Create a close button 
		//------------------------
		//----------------------------------------
		//	Create a clear below the close button 
		//----------------------------------------
		var clear = $(document.createElement('div'));
		clear.css( {'clear':'both'} );
		$(context).prepend( clear );
		var close = $(document.createElement('a'));
		close.html( options['close_button'] );
		close.attr( 'href', '#'+obj['id']+'-close' );
		close.addClass('plopup');
		close.addClass('close');
		
		//----------------------------------
		//	Add the close button to the DOM 
		//----------------------------------
		$(context).prepend( close );
		close.css( {'clear':'both'} );
		
		//--------------------------------------
		//	Click the button and hide the popup 
		//--------------------------------------
		close.click( function(e) {
			$(this).parent().css( {'top':obj['HIDDEN']} );
			e.preventDefault();
		});
		
		//-------------------------------------------
		//	Register pause event listener for popups 
		//-------------------------------------------
		$(document).bind( 'PLOPUP-POPPED', function( e, href ) {
			//------------------------------------
			//	Only one pop-up at a time please. 
			//------------------------------------
			if ( href != obj['id'] ) {
				if ( $(context).css('display') == 'block' && $(context).css('top') != obj['HIDDEN'] ) {
					$(context).css( {'top':obj['HIDDEN']} );
				}
			}
		});
		
		//-------------------
		//	Intercept clicks 
		//-------------------
		$('a', document).click( function(e) {
			var href = $(this).attr('href');
			href = href.replace('#','');
			
			//--------------------------------------------------------
			//	If an anchor with element id hash has been clicked 
			//	show content in the center 
			//--------------------------------------------------------
			if ( href == obj['id'] ) {
				plopup.prototype.position( context, options, obj );
				
				//---------------------------------------------------
				//	Broadcast pop-up event to all plopup instances
				//---------------------------------------------------
				$(document).trigger( 'PLOPUP-POPPED', [href] );
				
				$(window).resize( function(){
					//------------------------------------------------------------
					//	Only resize if the popup is visible... duh...
					//------------------------------------------------------------
					if ( $(context).css('display') == 'block' && $(context).css('top') != obj['HIDDEN'] ) {
						plopup.prototype.position( context, options, obj );
					}
				});
				e.preventDefault();
			}
		})
	}

	//----------------
	//	Extend JQuery 
	//----------------
	jQuery(document).ready( function($) {
		jQuery.fn.plopup = function( options ) {
			var id = jQuery(this).selector;
			return this.each( function() {
				jQuery.data( this, id, new plopup( this, options, id ) );
			});
		};
	})
})(jQuery);