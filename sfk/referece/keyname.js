/* --------- BEGIN LICENSE NOTICE ---------
 * Copyright 2011 Extentech Inc. All Rights Reserved.
 *
 * This file is a part of the Sheetster Web Application.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * If you would like to redistribute this software in a closed-source
 * application, dual-licensed commercial versions are available. For a
 * fully supported and redistributable commercial license, please visit
 * <http://www.extentech.com> or contact us at:
 * 
 * sales@extentech.com
 * Extentech Inc.
 * 1032 Irving Street #910
 * San Francisco, CA 94122
 * 415-759-5292
 * ---------- END LICENSE NOTICE ----------
 */

/** Utility for generating consistent names for key sequences.
 * 
 * <p>For naming specific keys this tool uses Key Values as defined in the
 * Last Call Working Draft of the W3C DOM3 Events specification released on
 * 7 September 2010.</p>
 */
var KeyName = {
	haveDOM3: document.implementation.hasFeature( "Events.keydown", "3.0" ),
	
	key: function (event) {
		// IE9 doesn't return the key name when modifiers are held
		// for now, just use the DOM0 system
		//if (typeof event.key === 'string') return event.key;
		
		var mapping = this.codeMap[ event.keyCode ];
		if (typeof mapping === 'undefined') return 'Unidentified';
		if (typeof mapping === 'string') return mapping;
		
		
		if (event.shiftKey && typeof mapping.shift === 'string')
			return mapping.shift;
		
		return mapping.key;
	},

	combo: function (event) {
		var key = this.key( event );
		var mods = '';
		
		if (event.ctrlKey  && key != 'Control') mods += 'C';
		if (event.altKey   && key != 'Alt'    ) mods += 'A';
		if (event.shiftKey && key != 'Shift'  ) mods += 'S';
		if (event.metaKey  && key != 'Meta'   ) mods += 'M';
		
		return (mods != '' ? mods + '-' : '') + key;
	},
	
	codeMap: {
		/*********************************************************************
		 * Control (Non-Printing) Keys                                       *
		 *********************************************************************/

		   27: 'Esc'
		, 112: 'F1'
		, 113: 'F2'
		, 114: 'F3'
		, 115: 'F4'
		, 116: 'F5'
		, 117: 'F6'
		, 118: 'F7'
		, 119: 'F8'
		, 120: 'F9'
		, 121: 'F10'
		, 122: 'F11'
		, 123: 'F12'
		,  44: 'PrintScreen'
		, 145: 'Scroll' // Scroll Lock
		,  19: 'Pause'  // Pause/Break
		,   8: 'Backspace'
		,   9: 'Tab'
		,  17: 'Control' // location
		,  16: 'Shift'   // location
		,  91: 'Win'     // location(left)
		,  92: 'Win'     // location(right)
		,  18: 'Alt'     // location
		,  32: 'Spacebar'
		,  93: 'Apps' // Context Menu Key
		,  13: 'Enter'
		,  37: 'Left'
		,  38: 'Up'
		,  39: 'Right'
		,  40: 'Down'
		, 144: 'NumLock'
		, 111: 'Divide'   // char='/' location=NUMPAD
		, 106: 'Multiply' // char='*' location=NUMPAD
		, 109: 'Subtract' // char='-' location=NUMPAD
		, 107: 'Add'      // char='+' location=NUMPAD
		, 110: 'Decimal'  // char='.' location=NUMPAD
		,  45: 'Insert'
		,  36: 'Home'
		,  33: 'PageUp'
		,  46: 'Del'
		,  35: 'End'
		,  34: 'PageDown'
		,  12: 'Clear' // NumPad 5 w/o NumLock
		,  20: 'CapsLock'

		/*********************************************************************
		 * Printable Characters                                              *
		 *********************************************************************/

		, 192: { key: '`', shift: '~' }
		,  49: { key: '1', shift: '!' }
		,  50: { key: '2', shift: '@' }
		,  51: { key: '3', shift: '#' }
		,  52: { key: '4', shift: '$' }
		,  53: { key: '5', shift: '%' }
		,  54: { key: '6', shift: '^' }
		,  55: { key: '7', shift: '&' }
		,  56: { key: '8', shift: '*' }
		,  57: { key: '9', shift: '(' }
		,  48: { key: '0', shift: ')' }
		, 189: { key: '-', shift: '_' }
		, 187: { key: '=', shift: '+' }
		,  65: { key: 'a', shift: 'A' }
		,  66: { key: 'b', shift: 'B' }
		,  67: { key: 'c', shift: 'C' }
		,  68: { key: 'd', shift: 'D' }
		,  69: { key: 'e', shift: 'E' }
		,  70: { key: 'f', shift: 'F' }
		,  71: { key: 'g', shift: 'G' }
		,  72: { key: 'h', shift: 'H' }
		,  73: { key: 'i', shift: 'I' }
		,  74: { key: 'j', shift: 'J' }
		,  75: { key: 'k', shift: 'K' }
		,  76: { key: 'l', shift: 'L' }
		,  77: { key: 'm', shift: 'M' }
		,  78: { key: 'n', shift: 'N' }
		,  79: { key: 'o', shift: 'O' }
		,  80: { key: 'p', shift: 'P' }
		,  81: { key: 'q', shift: 'Q' }
		,  82: { key: 'r', shift: 'R' }
		,  83: { key: 's', shift: 'S' }
		,  84: { key: 't', shift: 'T' }
		,  85: { key: 'u', shift: 'U' }
		,  86: { key: 'v', shift: 'V' }
		,  87: { key: 'w', shift: 'W' }
		,  88: { key: 'x', shift: 'X' }
		,  89: { key: 'y', shift: 'Y' }
		,  90: { key: 'z', shift: 'Z' }
		, 219: { key: '[', shift: '{' }
		, 221: { key: ']', shift: '}' }
		, 220: { key: '\\', shift: '|' }
		, 186: { key: ';', shift: ':' }
		, 222: { key: '\'', shift: '"' }
		, 188: { key: ',', shift: '<' }
		, 190: { key: '.', shift: '>' }
		, 191: { key: '/', shift: '?' }
		,  96: '0' // location=NUMPAD
		,  97: '1' // location=NUMPAD
		,  98: '2' // location=NUMPAD
		,  99: '3' // location=NUMPAD
		, 100: '4' // location=NUMPAD
		, 101: '5' // location=NUMPAD
		, 102: '6' // location=NUMPAD
		, 103: '7' // location=NUMPAD
		, 104: '8' // location=NUMPAD
		, 105: '9' // location=NUMPAD
	}
};

// Properties of KeyName will be in scope, but newly declared variables will
// be in an anonymous scope. To declare properties of KeyName, qualify them.
with (KeyName) with ({}) {
	// All Gecko-based browsers
	if (typeof navigator.product === 'string'
			&& navigator.product === 'Gecko') {
		//delete KeyName.codeMap.189; // normally Hyphen/Underbar
		//delete KeyName.codeMap.187; // normally Equals/Plus
		//delete KeyName.codemap.186; // normally Semicolon/Colon
		
		codeMap[ '109' ] = { key: '-', shift: '_' };
		codeMap[ '59'  ] = { key: ';', shift: ':' };
		
		// Linux
		if (navigator.platform.indexOf( "Linux" ) != -1) {
			codeMap[ '61' ] = { key: '=', shift: '+' };
		}
		
		// other platforms
		// currently only tested on Windows
		else {
			codeMap[ '107' ] = { key: '=', shift: '+' };
		}
	}
}
