#!/bin/sh

if [ "$1" = "" ]
then
	echo "Please provide an install path"
	echo "./install.sh <install path>"
	exit
fi

install_path=$1

if [ -e $install_path ]
then
	echo -n "Directory '"$install_path"' already exists. Continue? (y/[n]) "
	read answer
	continue=0
	answer=`echo $answer | cut -c 1`
	if [ "${answer}" = "y" ]
	then
		continue=1
	fi

	if [ "$continue" = "0" ]
	then
		exit
	fi
else 
	mkdir $install_path
fi

echo Installing to $install_path

cp src/index.html $install_path
cp src/calendar.js $install_path

cd $install_path

echo Getting jquery-1.3.1 from google code
wget http://jqueryjs.googlecode.com/files/jquery-1.3.1.js > /dev/null

ln -s jquery-1.3.1.js jquery.js

