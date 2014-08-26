window.gitdAlcoholMapApp = window.gitdAlcoholMapApp || {};

(function( app ) {

  'use strict';

  app.main = (function() {

    return {

      init: function( d ) {
        app.map.setup( d );
        $( '#map' ).on( 'mapReady', function() {
          $( '.spinner' ).remove();
          $( '.intro-screen' ).addClass( 'visible' );
          $( '.intro-screen button' ).on( 'click', function() {
            $( '.intro-screen' ).removeClass( 'visible' );
            $( '.navBar' ).addClass( 'visible' );
            setTimeout( function() {
              $( '.intro-screen' ).remove();
            }, 400 );
          });
        });

      },

    };

  })();


  // ----------------- Utilities -----------------

  function fixScrolling() {

    $( 'input' ).on( 'blur', function() {
      window.scrollTo( 0, 0 );
      document.body.scrollTop = 0;
    });

    $( document ).on( 'touchmove', function( e ) {
      e.preventDefault();
    });

  }


  // ----------------- Data Loading and Startup -----------------

  $( document ).ready( function() {

    fixScrolling();

    d3.csv( 'data/alcohol-per-country.csv', function( data ) {

      var parsedData = [], countryData;
      data.map(function( d ) {
        countryData = {};
        for ( var p in d ) {
          countryData[ p ] = ( p !== 'name' && p !== 'id' )? +d[ p ] : d[ p ];
        }
        parsedData.push( countryData );
      });

      app.main.init( parsedData );

    });

  });

})( window.gitdAlcoholMapApp );