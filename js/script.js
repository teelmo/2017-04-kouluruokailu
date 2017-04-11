(function ($) {
  var plus;
  require('./libs/jquery.csvToTable.js');
  require('datatables.net')(window, $);
  var plusApp = {
    formatNr: function (x, addComma) {
      x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
      x = x.replace('.', ',');
      if (addComma === true && x.indexOf(',') === -1) {
        x = x + ',0';
      }
      return (x === '') ? 0 : x;
    },
    roundNr: function (x, d) {
      return parseFloat(x.toFixed(d));
    },
    setPath: function () {
      if (location.href.match('dev')) {
        plusApp.path = 'http://dev.yle.fi/2017/' + plusApp.projectName + '/public/';
      }
      else if (location.href.match('yle.fi/plus')) {
        plusApp.path = 'http://yle.fi/plus/yle/2017/' + plusApp.projectName + '/';
      }
      else {
        plusApp.path = 'http://plus.yle.fi/' + plusApp.projectName + '/';
      }
    },
    getScale: function () {
      var width = plus.width();
      if (width >= 600) {
        plus.addClass('wide');
        return true;
      }
      if (width < 600) {
        plus.removeClass('wide');
        return false;
      }
    },
    initMediaUrls: function () {
      $.each($('.handle_img', plus), function (i, el) {
        $(this).attr('src', plusApp.path + 'img/' + $(this).attr('data-src'));
      });
    },
    getData: function () {
      $('.table_container', plus).CSVToTable(plusApp.path + 'data/data.csv', {
        loadingImage:plusApp.path + 'img/ajax-loader.gif', 
        loadingText:'',
        startLine:0, 
        tbodyClass:'list',
        trClass:'row',
      }).bind('loadComplete', function() {
        $('tr td:nth-child(2), tr th:nth-child(2)', plus).addClass('number');
        
        $.each($('th', plus), function () {
          $(this).html($('<span>' + $(this).html() + '</span>'));
        });
        $.each($('td.number', plus), function () {
          $(this).attr('data-order', $(this).html());
          $(this).html(plusApp.formatNr($(this).html()));
        });
        plusApp.initSortTable();
      });
    },
    initSortTable: function () {
      $('.table_container table', plus).DataTable({
        retrieve: true,
        language: {
          searchPlaceholder: 'Hae taulukosta',
          url: plusApp.path + 'js/libs/Finnish.json'
        },
        order:[[0, 'asc']],
        paging: false,
        searching: true,
      });
    },
    initEvents: function () {
      $(window).on('resize', plusApp.getScale);
    },
    unmount: function () {
      $(window).off('resize', plusApp.getScale);
      if (plus !== undefined) {
        plus.unbind();
      }
      delete window.plusApp[plusApp.projectName];
    },
    mount: function () {
      plusApp.init();
      plusApp.isInitialized = true;
    },
    init: function () {
      plus = $('.plus-app.plus-app-' + plusApp.projectName);
      plusApp.setPath();
      plusApp.getScale();
      plusApp.initMediaUrls();
      plusApp.initEvents();
      plusApp.getData();
    },
    meta: {
      id:this.projectName,
      version:'1.0.0'
    }
  };
  plusApp.projectName = '2017-04-kouluruokailu';
  if (window.plusApp === undefined) {
    window.plusApp = {};
  }
  if (window.plusApp[plusApp.projectName] === undefined) {
    window.plusApp[plusApp.projectName] = plusApp;
    window.plusApp[plusApp.projectName].mount();
  }
})(jQuery);
