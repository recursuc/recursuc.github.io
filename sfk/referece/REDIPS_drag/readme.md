REDIPS.drag 4.7.3
============

## What's REDIPS.drag?

REDIPS.drag is a JavaScript drag and drop library focused on dragging table content and table rows. Here are minimal steps to enable content dragging or row dragging in HTML table:

* put **&lt;script type="text/javascript" src="redips-drag.js">&lt;/script>** to the head section
* initialize REDIPS.drag library: **&lt;body onload="REDIPS.drag.init()">**
* place table(s) inside **&lt;div id="drag">** to enable content dragging
* place **&lt;div class="drag">Hello World&lt;/div>** to the table cell

## Features

* dragging table content/row
* dropping modes: multiple, single, switch, switching, overwrite and shift
* 4 shift modes (horizontal1, horizontal2, vertical1 and vertical2)
* multiple drop options can drop to cell top or bottom
* using custom event handlers
* autoscroll
* content cloning
* support for scrollable DIV containers
* sticky tables and DIV containers
* unlimit nested tables support
* dropping rules (like allowed and forbidden table cells)
* animation (move element/row to the destination cell/row)
* "noautoscoll" option for drag containers
* "nolayout" option for tables (table in DIV element can be dragged as any other content)
* takes care about rows with style display='none'
* support for dynamical creation of table layout (inner table inside DIV element can be moved and accept other DIV elements)
* works in touch devices (tested on Android 2.3.3)

## Public methods

* REDIPS.drag.init() - drag container initialization
* REDIPS.drag.enable_drag() - enables / disables one or all DIV elements in tables
* REDIPS.drag.enable_table() - enables / disables tables selected by class name
* REDIPS.drag.clone_div() - clones DIV element and returns reference of the cloned element
* REDIPS.drag.save_content() - scans table and prepares table content as query string or JSON object
* REDIPS.drag.relocate() - relocates all child nodes from source table cell to the target table cell
* REDIPS.drag.empty_cell() - removes elements from table cell
* REDIPS.drag.move_object() - method will calculate parameters and start animation (DIV element to the destination table cell)
* REDIPS.drag.shift_cells() - method shifts table content horizontally or vertically (REDIPS.drag.shift_option defines the way of how content will be shifted)
* REDIPS.drag.delete_object() - method deletes DIV element (input parameter is DIV reference or element id)
* REDIPS.drag.get_position() - returns DIV element position as array (tableIndex, rowIndex and cellIndex)
* REDIPS.drag.row_opacity() - sets opacity to table row (el, opacity, color)
* REDIPS.drag.row_empty() - marks selected row as empty (tbl_id, row_idx, [color])
* REDIPS.drag.getScrollPosition() - returns scroll positions as array [ scrollX, scrollY ]
* REDIPS.drag.get_style() - returns style value of requested object and style name
* REDIPS.drag.find_parent() - returns a reference of the required parent element
* REDIPS.drag.find_cell() - returns data for first or last table cell (cell reference, row index and column index)

## Documentation

A reference documentation with a list of public properties and methods contained in REDIPS.drag library.

* [REDIPS.drag documentation](http://www.redips.net/javascript/redips-drag-documentation/)
* [REDIPS.drag documentation - Appendix A](http://www.redips.net/javascript/redips-drag-documentation-appendix-a/)

## Demos

Live demo shows REDIPS.drag library in action: 

* [Drag and drop table content plus animation](http://www.redips.net/javascript/drag-and-drop-table-content-animation/)
* [JavaScript drag and drop plus content shift](http://www.redips.net/javascript/drag-and-drop-content-shift/)
* [Drag and drop table rows](http://www.redips.net/javascript/drag-and-drop-table-content/)
* [Drag and Drop table content](http://www.redips.net/javascript/drag-and-drop-table-row/)

## YouTube

Screencast of several examples contained in REDIPS.drag package:

* [Drag and drop table content with JavaScript](http://www.youtube.com/watch?v=8LtMk4DwLzA)
* [Drag and drop table rows with JavaScript](http://www.youtube.com/watch?v=5YuS6S0bFTU)
* [Drag and drop table content with JavaScript - School timetable](http://www.youtube.com/watch?v=ToJk1End4C4)
