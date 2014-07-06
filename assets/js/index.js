/**
 * Created on 2014/07/03.
 */
function searchEvent(siteName){

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

    var targetUrl = atndUrl + '?keyword=' + keyword + '&count=' + count + '&format=' + format;

    $.ajax({
      url: targetUrl,
      type: 'GET',
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 10000,
      success: function(data) {

        var eventInfo = data.events;

        $.each(eventInfo, function(key, value) {

          if (eventInfo[key]['started_at'] < today) {
            // 既に終了したイベントは画面に出力しない
            return true;
          }

          var eventTime = new Date(eventInfo[key]['started_at']);
          $('#result').append('<h4>' + eventInfo[key]['title'] + '</h4>');
          $('#result').append('<p>URL：' + '<a href=' + eventInfo[key]['event_url'] + '>' + eventInfo[key]['event_url'] + '</a>' + '</p>');
          $('#result').append('<p>開催場所：' + eventInfo[key]['place'] + '</p>');
          $('#result').append('<p>開催日時：' + eventTime.toLocaleDateString('ja-JP', options) + '</p>');
          $('#result').append('<hr>');

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
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 10000,
      success: function(data) {

        var eventInfo = data.events;

        $.each(eventInfo, function(key, value){

          if (eventInfo[key]['started_at'] < today) {
            // 既に終了したイベントは画面に出力しない
            return true;
          }

          var eventTime = new Date(eventInfo[key]['started_at']);
          $('#result').append('<h4>' + eventInfo[key]['title'] + '</h4>');
          $('#result').append('<p>URL：' + '<a href=' + eventInfo[key]['event_url'] + '>' + eventInfo[key]['event_url'] + '</a>' + '</p>');
          $('#result').append('<p>開催場所：' + eventInfo[key]['place'] + '</p>');
          $('#result').append('<p>開催日時：' + eventTime.toLocaleDateString('ja-JP', options) + '</p>');
          $('#result').append('<hr>');

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
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 10000,
      success: function(data) {

        var eventInfo = data;

        $.each(eventInfo, function(key) {

          if (eventInfo[key]['event']['starts_at'] < today) {
            // 既に終了したイベントは画面に出力しない
            return true;
          }

          var eventTime = new Date(eventInfo[key]['event']['starts_at']);

          $('#result').append('<h4>' + eventInfo[key]['event']['title'] + '</h4>');
          $('#result').append('<p>URL：' + '<a href=' + eventInfo[key]['event']['public_url'] + '>' + eventInfo[key]['event']['public_url'] + '</a>' + '</p>');
          $('#result').append('<p>開催場所：' + eventInfo[key]['event']['address'] + '</p>');
          $('#result').append('<p>開催日時：' + eventTime.toLocaleDateString('ja-JP', options) + '</p>');
          $('#result').append('<hr>');

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
