
Seinfeld Calendar
=================

This is an implementation of the Seinfeld calendar concept as a standalone
webpage. It uses javascript for user interaction and saving and loading the
file.

Status
------

This is still in development. You cannot add, rename or delete with
hand editing the html. The style sheets needs serious work.

Installation
------------

Run ``install.sh`` with the installation directory as the only argument::

   ./install.sh <install path>

The script will create the directory, copy the files over to it and download a
version of jquery using ``wget``.

To have a look point firefox at ``<install_path>/index.html``.

Features
--------

* Support for multiple projects

Bugs
----

* Fills out the table with days without regard for the end of the month.
* Only really works in Firefox as the save code is browser specific. Would not
  be too hard to copy the code for IE saving from Tiddly-wiki as well.

Credits
-------

The project uses jQuery to make life a little easier. The implementation is
inspired by and borrows code from Tiddly-wiki.

Links
-----

* Kalsey's CSS Tabs - http://kalsey.com/tools/csstabs/
* JQuery - http://jquery.com/
* Tiddly-wiki - http://www.tiddlywiki.com/

Fork me.

