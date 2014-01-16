# plopup

plopup creates a horizontally and vertically centered popup window.
Use it for good and not evil.
Good would be warning or tool boxes for web applications.
Bad would be for advertising.

# Requirements
* jQuery

# Installation
	git clone http://github.com/caesarfeta/plopup.git plopup

# Use

Here's the mark you'd need.

	<a href="#plopup">Click to see the pop-up</a>
	<div id="plopup">
		<h1>plopup</h1>
		<p>Plopped-Up! Whoooo-eeee!</p>
	</div>

Here's the Javascript constructor.

	$(document).ready( function() {
		$('#plopup').plopup();
	});
