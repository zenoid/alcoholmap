window.gitdAlcoholMapApp = window.gitdAlcoholMapApp || {};

(function( app ) {

  'use strict';

  app.map = (function() {

    var map, data, width, height, countryInfo;

    function showMap( topology ) {
      d3.select( '#map' ).node().appendChild( topology.documentElement );
      map = d3.select( '#map svg' );
      setupSize();
      data.forEach(function( d ){
        map.selectAll( '[cc=' + d.id + ']' )
          .data( [ d.id ] )
          .on( 'mouseover', showCountryInfo );
      });
      $( '#map' ).trigger( 'mapReady' );
    }

    function setupSize() {
      width = window.innerWidth;
      height = window.innerHeight;
      map.attr('width', width)
        .attr('height', height);
    }


    // ----------------- Country Info -----------------

    function getIcon( iconId ) {
      var node = d3.select( '#' + iconId ).node(),
        icon = d3.select( node.parentNode.insertBefore( node.cloneNode( true ), node.nextSibling ) ).attr( 'id', null );
      return icon[ 0 ][ 0 ];
    }

    function addGlass( el, iconName ) {
      var icon = $( getIcon( iconName ) );
      el.append( icon );
    }

    function addHalfGlass( el, iconName, levelName, quantity ) {
      var icon = $( getIcon( iconName ) );
      el.append( icon );
      var alcoholLevel = icon.find( levelName ).eq(0),
        alcoholHeight = +alcoholLevel.attr( 'height' ),
        alcoholNewHeight = alcoholHeight * quantity;
      alcoholLevel.attr( 'height', alcoholNewHeight + 'px')
        .attr( 'y', +alcoholLevel.attr( 'y' ) + ( alcoholHeight - alcoholNewHeight ) );
    }

    function showCountryInfo( c ) {

      var countryPath = map.selectAll( '[cc=' + c + ']' )[ 0 ][ 0 ],
        countryData, countryDetailsText,

        wineAmount = $( '#wineAmount' ),
        wineVolume = 0.12,
        wineGlassSize = 0.215 / 2,
        wineQuantity, wineGlasses, wineFullGlasses,

        beerAmount = $( '#beerAmount' ),
        beerVolume = 0.05,
        beerGlassSize = 0.568 * 0.95,
        beerQuantity, beerGlasses, beerFullGlasses,

        spiritsAmount = $( '#spiritsAmount' ),
        spiritsVolume = 0.40,
        spiritsGlassSize = 0.044,
        spiritsQuantity, spiritsGlasses, spiritsFullGlasses,

        i, l;

      // Get Country Data

      for ( i = 0, l = data.length; i < l; i++ ) {
        if ( data[ i ].id === c ) {
          countryData = data[ i ];
          break;
        }
      }

      // Country Name

      $( '#countryName' ).text( countryData.name );

      // Wine Amount

      wineQuantity = countryData.intake * ( countryData.wine / 100 ) / wineVolume / 52;
      wineGlasses = Math.ceil( wineQuantity / wineGlassSize * 10 ) / 10;
      wineFullGlasses = Math.floor( wineGlasses );

      wineAmount.empty();

      for ( i = 0; i < wineFullGlasses; i++ ) {
        addGlass( wineAmount, 'wineGlassIcon' );
      }

      if ( wineGlasses - wineFullGlasses > 0.15 ) {
        addHalfGlass( wineAmount, 'wineGlassIcon', '#wineGlassLevel', wineGlasses - wineFullGlasses );
      }

      countryDetailsText = 'Wine: ' + Math.ceil( wineQuantity * 1000 ) + ' ml<br/>';

      // Beer Amount

      beerQuantity = countryData.intake * ( countryData.beer / 100 ) / beerVolume / 52;
      beerGlasses = Math.ceil( beerQuantity / beerGlassSize * 10 ) / 10;
      beerFullGlasses = Math.floor( beerGlasses );

      beerAmount.empty();

      for ( i = 0; i < beerFullGlasses; i++ ) {
        addGlass( beerAmount, 'beerGlassIcon' );
      }

      if ( beerGlasses - beerFullGlasses > 0.15 ) {
        addHalfGlass( beerAmount, 'beerGlassIcon', '#beerGlassLevel', beerGlasses - beerFullGlasses );
      }

      countryDetailsText += 'Beer: ' + Math.ceil( beerQuantity * 1000 ) + ' ml<br/>';

      // Spirits Amount

      spiritsQuantity = countryData.intake * ( countryData.spirits / 100 ) / spiritsVolume / 52;
      spiritsGlasses = Math.ceil( spiritsQuantity / spiritsGlassSize * 10 ) / 10;
      spiritsFullGlasses = Math.floor( spiritsGlasses );

      spiritsAmount.empty();

      for ( i = 0; i < spiritsFullGlasses; i++ ) {
        addGlass( spiritsAmount, 'spiritsGlassIcon' );
      }

      if ( spiritsGlasses - spiritsFullGlasses > 0.15 ) {
        addHalfGlass( spiritsAmount, 'spiritsGlassIcon', '#spiritsGlassLevel', spiritsGlasses - spiritsFullGlasses );
      }

      countryDetailsText += 'Spirits: ' + Math.ceil( spiritsQuantity * 1000 ) + ' ml<br/>every week';

      // Country Details

      $( '#countryInfoDetails' ).html( countryDetailsText );

      $( '.topBar' ).addClass( 'visible' );

    }



    // ----------------- Map Coloring -----------------

    var color_zero = '#FFF',
      color_wine = '#990012',
      color_beer = '#F19800',
      color_spirits = '#00BBCC';

    function showWine( e ) {
      if ( !setActiveButton( $( e.target ) ) ) {
        return;
      }
      var min = d3.min( data.map( function( d ) { return d.wine * d.intake; } ) ),
        max = d3.max( data.map( function( d ) { return d.wine * d.intake; } ) ),
        scale = d3.scale.pow().exponent( 0.7 ).domain( [ min, max ] ).range( [ color_zero, color_wine ] );
      for ( var i = 0, l = data.length; i < l; i++ ) {
        map.selectAll( '[cc=' + data[ i ].id + ']' ).style( 'fill', scale( data[ i ].wine * data[ i ].intake ) );
      }
    }

    function showBeer( e ) {
      if ( !setActiveButton( $( e.target ) ) ) {
        return;
      }
      var min = d3.min( data.map( function( d ) { return d.beer * d.intake; } ) ),
        max = d3.max( data.map( function( d ) { return d.beer * d.intake; } ) ),
        scale = d3.scale.pow().exponent( 0.7 ).domain( [ min, max ] ).range( [ color_zero, color_beer ] );
      for ( var i = 0, l = data.length; i < l; i++ ) {
        map.selectAll( '[cc=' + data[ i ].id + ']' ).style( 'fill', scale( data[ i ].beer * data[ i ].intake ) );
      }
    }

    function showSpirits( e ) {
      if ( !setActiveButton( $( e.target ) ) ) {
        return;
      }
      var min = d3.min( data.map( function( d ) { return d.spirits * d.intake; } ) ),
        max = d3.max( data.map( function( d ) { return d.spirits * d.intake; } ) ),
        scale = d3.scale.pow().exponent( 0.7 ).domain( [ min, max ] ).range( [ color_zero, color_spirits ] );
      for ( var i = 0, l = data.length; i < l; i++ ) {
        map.selectAll( '[cc=' + data[ i ].id + ']' ).style( 'fill', scale( data[ i ].spirits * data[ i ].intake ) );
      }
    }

    function showFavorites( e ) {
      if ( !setActiveButton( $( e.target ) ) ) {
        return;
      }
      var maxWine = d3.max( data.map( function( d ) { return d.wine * d.intake; } ) ),
        scaleWine = d3.scale.pow().exponent( 0.9 ).domain( [ 0, maxWine ] ).range( [ color_zero, color_wine ] ),
        maxBeer = d3.max( data.map( function( d ) { return d.beer * d.intake; } ) ),
        scaleBeer = d3.scale.pow().exponent( 0.9 ).domain( [ 0, maxBeer ] ).range( [ color_zero, color_beer ] ),
        maxSpirits = d3.max( data.map( function( d ) { return d.spirits * d.intake; } ) ),
        scaleSpirits = d3.scale.pow().exponent( 0.9 ).domain( [ 0, maxSpirits ] ).range( [ color_zero, color_spirits ] ),
        w, b, s;
      for ( var i = 0, l = data.length; i < l; i++ ) {
        map.selectAll( '[cc=' + data[ i ].id + ']' ).style( 'fill', function( d ) {
          w = data[ i ].wine * data[ i ].intake;
          b = data[ i ].beer * data[ i ].intake;
          s = data[ i ].spirits * data[ i ].intake;
          if ( w > b && w > s ) {
            return scaleWine( w );
          } else if ( b > w && b > s ) {
            return scaleBeer( b );
          } else if ( s > w && s > b ) {
            return scaleSpirits( s );
          } else {
            return color_zero;
          }
        });
      }
    }

    function setActiveButton( btn ) {
      $( '.topBar' ).removeClass( 'visible' );
      if ( btn.hasClass( 'selected' ) ) {
        btn.removeClass( 'selected' );
        resetMap();
        return false;
      } else {
        $( '.navBar button' ).removeClass( 'selected' );
        btn.addClass( 'selected' );
        return true;
      }
    }

    function resetMap() {
      map.selectAll( '[cc]' ).style( 'fill', null );
    }



    // ----------------- Resize listener -----------------

    var resizeEndTimeout;

    function setupResizeListener() {
      $( window ).on( 'resize', function() {
        clearTimeout( resizeEndTimeout );
        resizeEndTimeout = setTimeout( resize, 500 );
      });
    }

    function resize() {
      setupSize();
    }


    // ----------------- Public Methods -----------------

    return {

      setup: function( d ) {
        data = d;
        countryInfo = $( '#countryInfo' );
        setupResizeListener();
        d3.xml( 'map/worldmap.svg', 'image/svg+xml', showMap );
        $( '#btn-wine' ).on( 'click', showWine );
        $( '#btn-beer' ).on( 'click', showBeer );
        $( '#btn-spirits' ).on( 'click', showSpirits );
        $( '#btn-favorites' ).on( 'click', showFavorites );
      },

    };

  })();

})( window.gitdAlcoholMapApp );