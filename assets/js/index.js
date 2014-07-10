/**
 * Created on 2014/07/03.
 */

$(function(){

  // キーワードが未入力の場合は検索出来ないようにする
  $('#keyword').keyup(function(){
    if (this.value.length != 0) {
      $('.searchBtn').removeAttr('disabled');
    } else if (this.value.length === 0) {
      $('.searchBtn').attr('disabled', 'disabled');
    }
  });

});

function searchEvent(siteName){

  console.log('search');

  // 検索キーワード取得
  var keyword = $('#keyword').val();

  // 検索結果の最大出力データ数
  var count = 30;

  // 検索結果の該当件数
  var getCount = 0;

  // 現在時刻を取得(イベント日時との比較のため、ISO形式)
  var date = new Date();
  var today = date.toISOString();

  // ISO形式を日本時間にする際のオプション
  var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };

  // ローディング画像表示 通信処理終了時に消去
  $('#loading').html("<i class='fa fa-spinner fa-3x fa-spin'></i>");

  // 前回の画面表示を消す
  $('#message').empty();
  $('#message').css('display', 'none');
  $('#warning').empty();
  $('#warning').css('display', 'none');
  $('#result').empty();

  if (siteName.id === 'atnd') {

    var atndUrl = 'http://api.atnd.org/events/';
    var format = 'jsonp';

    var targetUrl = atndUrl + '?keyword=' + keyword + '&count=' + count +'&format=' + format;

    $.ajax({
      url: targetUrl,
      type: 'GET',
      cache: false,
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 10000,
      success: function (data) {

        var events = data.events;

        $.each(events, function(key) {

          var eventInfo = events[key];

          if (eventInfo.started_at < today) {
            // 既に終了したイベントは画面に出力しない
            return true;
          }

          eventInfo.started_at = new Date(eventInfo.started_at).toLocaleDateString('ja-JP', options);
          eventInfo.ended_at = new Date(eventInfo.ended_at).toLocaleDateString('ja-JP', options);

          var template = _.template([
            '<div class="panel panel-info">',
              '<div class="panel-heading">',
                '<h4><%- title %></h4>',
              '</div>',
              '<div class="panel-body">',
                '<p><b>URL：</b><a href="<%- event_url %>"><%- event_url %></a></p>',
                '<p><b>開催場所：</b><%- address %></p>',
                '<p><b>開催会場：</b><%- place %></p>',
                '<p><b>開催日時：</b><%- started_at %> ～ <%- ended_at %></p>',
              '</div>',
            '</div>',
          ].join(''));

          $('#result').append(template(eventInfo));

          getCount += 1;
        });
      },
      error: function() {
        showError();
      },
      complete: function() {
        showComplete(getCount);
      }
    });

  } else if (siteName.id === 'connpass') {

    var targetUrl = 'http://connpass.com/api/v1/event/' + '?keyword=' + keyword + '&count=' + count;

    $.ajax({
      url: targetUrl,
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 10000,
      success: function(data) {

        var events = data.events;

        $.each(events, function(key){

          var eventInfo = events[key];

          if (eventInfo.started_at < today) {
            // 既に終了したイベントは画面に出力しない
            return true;
          }

          if (eventInfo.event_url != null) {
            // 末尾の「/」を消す
            eventInfo.event_url.slice(0, -1);
          }

          eventInfo.started_at = new Date(eventInfo.started_at).toLocaleDateString('ja-JP', options);
          eventInfo.ended_at = new Date(eventInfo.ended_at).toLocaleDateString('ja-JP', options);

          var template = _.template([
            '<div class="panel panel-info">',
              '<div class="panel-heading">',
                '<h4><%- title %></h4>',
              '</div>',
              '<div class="panel-body">',
                '<p><b>URL：</b><a href="<%- event_url %>"><%- event_url %></a></p>',
                '<p><b>開催場所：</b><%- address %></p>',
                '<p><b>開催会場：</b><%- place %></p>',
                '<p><b>開催日時：</b><%- started_at %> ～ <%- ended_at %></p>',
              '</div>',
            '</div>',
          ].join(''));

          $('#result').append(template(eventInfo));

          getCount += 1;
        });
      },
      error: function() {
        showError();
      },
      complete: function() {
        showComplete(getCount);
      }
    });

  } else if (siteName.id === 'doorkeeper') {

    var targetUrl = 'http://api.doorkeeper.jp/events/' + '?q=' + keyword;

    $.ajax({
      url: targetUrl,
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 10000,
      success: function(data) {
        $.each(data, function(key) {

          var eventInfo = data[key]['event'];
          console.log(eventInfo);

          if (eventInfo.starts_at < today) {
            // 既に終了したイベントは画面に出力しない
            return true;
          }

          eventInfo.starts_at = new Date(eventInfo.starts_at).toLocaleDateString('ja-JP', options);
          eventInfo.ends_at = new Date(eventInfo.ends_at).toLocaleDateString('ja-JP', options);

          var template = _.template([
            '<div class="panel panel-info">',
              '<div class="panel-heading">',
                '<h4><%- title %></h4>',
              '</div>',
              '<div class="panel-body">',
                '<p><b>URL：</b><a href="<%- public_url %>"><%- public_url %></a></p>',
                '<p><b>開催場所：</b><%- address %></p>',
                '<p><b>開催会場：</b><%- venue_name %></p>',
                '<p><b>開催日時：</b><%- starts_at %> ～ <%- ends_at %></p>',
              '</div>',
            '</div>',
          ].join(''));

          $('#result').append(template(eventInfo));

          getCount += 1;
        });
      },
      error: function() {
        showError();
      },
      complete: function() {
        showComplete(getCount);
      }
    });
  }
}

/*
 * 検索失敗時の画面表示
 */
function showError() {
  $('#warning').css('display', 'block');
  $('#warning').append('検索エラーが発生しました。もう一度お試しください。');
}

/*
 * 検索完了時の画面表示
 */
function showComplete(getCount) {

  $('#loading').empty();

  $('#message').css('display', 'block');
  $('#message').append('検索が完了しました。');

  // 表示する内容が無かった場合の処理
  if (getCount === 0 ){
    $('#message').append('該当項目はありませんでした。');
  } else {
    $('#message').append('該当項目は' + getCount + '件です。');
  }

}
