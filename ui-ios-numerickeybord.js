"use strict";
/**
 * ui-ios-numerickeybord
 * AngularJS 1.6.x向け
 * ディレクティブはポップアップ。クリックするとアラートを表示する。
 * 表示内容は ボタンの data-text の内容。
 * popup-target 属性にアラートボックスのセレクタを指定する(例： popup-target="#alert" )。
 */


var app_module = angular.module('ui-ios-numerickeybord', []);
app_module.directive('uiIosNumerickeybord', ["$compile", function ($compile) {
        return {
            link: function (scope, element, attrs, controller) {


                element.click(function (e) {
                    if (!isiOS()) {
                        return;
                    }

                    scope.numerickeybordTargetElement = element;

                    console.log(scope.numerickeybordTargetElement);

                    var unitType = $(this).attr("data-unit");
                    var dataType = $(this).attr("data-type");
                    var offset = $(this).offset();
                    var top = Math.ceil(offset.top) + 15;
                    var left = Math.ceil(offset.left);
                    var w = $(window).width();
                    var h = $(window).height();
                    var clientY = e.clientY;
                    if ((h / 2) < clientY) { // 384 < 261
                        top = Math.ceil(offset.top) - 325;
                    }
                    var clientX = e.clientX;
                    if (w - 160 < clientX) {
                        left = clientX - 160;
                        if (780 < left) {
                            left = 780;
                        }
                    }
                    //console.log(left);


                    $("#numkey").remove(); //全部削除
                    $(this).blur(); //フォーカスを外す

                    //数値とアルファベットの配列
                    var arr_numeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
                    var arr_numeric_tenkey = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', '`'];

                    if (unitType === '00') {
                        arr_numeric.push('円');
                    } else if (unitType === '01') {
                        arr_numeric.push('個');
                    } else {
                        arr_numeric.push('-');
                    }

                    var html = '';
                    html += '  <div class="numkey" id="numkey">';
                    html += '    <ul style="text-align:left;padding: 5px;">';
                    for (var i = 0; i < arr_numeric.length; i++) {
                        html += '      <li id="numerickey' + arr_numeric[i] + '" data-pushbutton=' + arr_numeric[i] + ' class="numerickey" unselectable="on">' + arr_numeric[i] + '</li>';
                    }
                    html += '    </ul>';
                    html += '    <div id="btwrap"><button id="numkeyclose" closebutton class="btn numerickey_button">閉じる</button><button id="numkeyclear" clearbutton class="btn numerickey_button">クリア</button> </div>';
                    html += '  </div>';

//
                    // 要素の追加
                    angular.element("body").append($compile($(html))(scope));
                    scope.$apply();

                    //if (isiOS()) {
                    $("#numkey").css({"top": top, "left": 700});
                    //} else {
                    //    $(".numkey").css({"top": top, "left": left});
                    //}





                    //テンキー以外をクリックしたらテンキーを削除する関数
                    var numkeyHidden = function (event) {
                        if (!$(event.target).closest('#numkey').length) {
                            $("#numkey").remove(); //全部削除
                            $("#numkey").trigger('blur');
                            $(document).off('click touchend', numkeyHidden);
                        }
                    };

                    // 上記関数をクリックとタッチイベントに設定
                    setTimeout(function () {
                        $(document).on('click touchend', numkeyHidden);
                    }, 150);



                });



                function isiOS() {
                    var ua = {};
                    ua.name = window.navigator.userAgent.toLowerCase();

                    ua.isiPhone = ua.name.indexOf('iphone') >= 0;
                    ua.isiPod = ua.name.indexOf('ipod') >= 0;
                    ua.isiPad = ua.name.indexOf('ipad') >= 0;
                    ua.isiOS = (ua.isiPhone || ua.isiPod || ua.isiPad);

                    if (ua.isiOS) {
                        return true;
                    }
                    return false;
                }
            }
        };

    }]);

app_module.directive("pushbutton", function () {
    return function (scope, element, attrs) {
        element.bind("click", function () {
            //console.log(attrs.pushbutton);
            //console.log(scope.numerickeybordTargetElement);
            //.val() = scope.numerickeybordTargetElement.val() + attrs.pushbutton;
            var val = scope.numerickeybordTargetElement.val();
            var type = $(scope.numerickeybordTargetElement).attr('data-type'); //入力タイプ 
            var maxlength = scope.numerickeybordTargetElement.attr('maxlength');
            if (maxlength === undefined || scope.numerickeybordTargetElement.val().length < maxlength) {
                if (type === 'string') {
                    scope.numerickeybordTargetElement.val(String(val) + String(attrs.pushbutton));
                } else {
                    scope.numerickeybordTargetElement.val(parseInt(val + attrs.pushbutton));
                }
            }
            $(scope.numerickeybordTargetElement).trigger('input');
            $(scope.numerickeybordTargetElement).trigger('blur');
        });
    };
});

app_module.directive("closebutton", function () {
    return function (scope, element, attrs) {
        element.bind("click", function () {
            $("#numkey").remove(); //全部削除
            $("#numkey").trigger('blur');
        });
    };
});

app_module.directive("clearbutton", function () {
    return function (scope, element, attrs) {
        element.bind("click", function () {
            scope.numerickeybordTargetElement.val("");
            $(scope.numerickeybordTargetElement).trigger('input');
            $(scope.numerickeybordTargetElement).trigger('blur');
        });
    };
});
