#  Pdf from Oracle LOB
How to do it using node!
 
##Getting Started

First download and install any oracle drivers, headers, etc. anything you need to connect to oracle

Download and install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/). Just use homebrew and do:

    brew install imagemagick

Set environment variables


    export LD_LIBRARY_PATH=/opt/oracle/instantclient
    export TNS_ADMIN=/opt/oracle/tnsnames


Then run

    npm install 
    node lobtopdf.js
    
##Notes

*This requires that we make an image conversion from GIF to JPEG. lobtopdf.js makes use of Promise.delay to ensure that 
the images are fully written and converted before adding them to a pdf. The delay is currently set to 
 500 ms but may need to be adjusted.* 
 
*The config file (ommited) just has the database username, password, and connection string. Enjoy!*  
