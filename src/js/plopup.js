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
	function plopup( _elem, _options, _id ) {
		var self = this;
		self.elem = _elem;
		self.id = _id;
		self.init( _elem, _options );
	}
	
	plopup.prototype.init = function( _elem, _options ) {
		var self = this;
		self.elem = _elem;
		
		//----------------------
		//	Set default options 
		//----------------------
		self.options = jQuery.extend({
			button:'close'
		}, _options);
		
		//----------------------------------------
		//	Instance scalar variables & constants
		//----------------------------------------
		self.obj = {
			id: null,
			HIDDEN: '-9999px'
		};
		
		self.create();
	}
	
	plopup.prototype.position = function() {
		var self = this;
		var left = ( $(window).width() - $( self.elem ).width() ) / 2;
		var top = ( $(window).height() - $( self.elem ).height() ) / 2;
		$( self.elem ).css({ 
			'display':'block',
			'position':'absolute',
			'z-index':'9999',
			'top':top+'px',
			'left':left+'px'
		});
	}
	
	plopup.prototype.popup = function() {
		var self = this;
		self.position();
		
		//---------------------------------------------------
		//	Broadcast pop-up event to all plopup instances
		//---------------------------------------------------
		$(document).trigger( 'PLOPUP-POPPED', self.obj['id'] );
		$(window).resize( function(){
			//------------------------------------------------------------
			//	Only resize if the popup is visible... duh...
			//------------------------------------------------------------
			if ( $(self.elem).css('display') == 'block' && $(self.elem).css('top') != self.obj['HIDDEN'] ) {
				self.position();
			}
		});
	}
	
	plopup.prototype.hide = function() {
		var self = this;
		$(self.elem).css({'top': self.obj['HIDDEN']});
	}
	
	plopup.prototype.create = function() {
		var self = this;
		
		//---------------
		//	Stash the id 
		//---------------
		self.obj['id'] = $( self.elem ).attr('id');
		
		//---------------------------------
		//	Make sure the element's hidden 
		//---------------------------------
		$( self.elem ).css({'display':'none'});
		
		//------------------------
		//	Create a close button 
		//------------------------
		//----------------------------------------
		//	Create a clear below the close button 
		//----------------------------------------
		var clear = $(document.createElement('div'));
		clear.css({'clear':'both'});
		$(self.elem).prepend(clear);
		
		//------------------------------------------------------------
		//  Create the close button
		//------------------------------------------------------------
		var close = $(document.createElement('a'));
		close.html(self.options['button']);
		close.attr('href', '#'+self.obj['id']+'-close');
		close.addClass('plopup');
		close.addClass('close');
		
		//----------------------------------
		//	Add the close button to the DOM 
		//----------------------------------
		$(self.elem).prepend(close);
		close.css({'clear':'both'});
		
		//--------------------------------------
		//	Click the button and hide the popup 
		//--------------------------------------
		close.click( function( _e ) {
			self.hide();
			_e.preventDefault();
		});
		
		//-------------------------------------------
		//	Register pause event listener for popups 
		//-------------------------------------------
		$(document).bind( 'PLOPUP-POPPED', function( _e, _href ) {
			//------------------------------------
			//	Only one pop-up at a time please. 
			//------------------------------------
			if ( _href != self.obj['id'] ) {
				if ( $(self.elem).css('display') == 'block' && $(self.elem).css('top') != self.obj['HIDDEN'] ) {
					$(self.elem).css({'top': self.obj['HIDDEN']});
				}
			}
		});
		
		//-------------------
		//	Intercept clicks 
		//-------------------
		$('a', document).click( function( _e ) {
			var href = $(this).attr('href');
			if (href == undefined) {
				return;
			}
			href = href.replace('#','');
			
			//--------------------------------------------------------
			//	If an anchor with element id hash has been clicked 
			//	show content in the center 
			//--------------------------------------------------------
			if ( href == self.obj['id'] ) {
				self.popup();
				_e.preventDefault();
			}
		});
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