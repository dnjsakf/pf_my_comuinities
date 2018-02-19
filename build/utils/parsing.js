'use strict';

// export default {
module.exports = {
    'ygosu': {
        getBoardList: function getBoardList($) {
            return $('table.bd_list tbody > tr:not(.notice, .notice + tr)');
        },
        getContent: function getContent($content) {
            var cntDate = $content.children('.date').text();
            var regDate = this.state.today + ' ' + cntDate;

            var cnt = {};
            cnt.no = $content.children('.no').text();
            if (cnt.no > this.state.content_id) {
                cnt.title = $content.children('.tit').text().replace(/(\t\d?|\n\d?)/g, '');;
                cnt.writer = $content.children('.name').text().replace(/(\t\d?|\n\d?)/g, '');;
                cnt.regDate = regDate;
                cnt.url = this.state.host + $content.find('.tit > a[href]').first().attr('href');
                return cnt;
            }
            return false;
        }
    },
    'gezip': {
        getBoardList: function getBoardList($) {
            return $('#list-body .list-item:not(.bg-light)');
        },
        getContent: function getContent($content) {
            var cntDate = $content.children('.wr-date').text().replace(/(\t|\n)/g, '');
            var regDate = this.state.today + ' ' + cntDate;

            var cnt = {};
            cnt.no = $content.children('.wr-num').text();
            if (cnt.no > this.state.content_id) {
                cnt.title = $content.find('.wr-subject > a.item-subject').text().replace(/(\t\d?|\n\d?)/g, '');
                cnt.writer = $content.find('.wr-name').text().replace(/(\t\d?|\n\d?)/g, '');
                cnt.regDate = regDate;
                cnt.url = $content.find('.wr-subject > a[href]').first().attr('href');
                return cnt;
            }
            return false;
        }
    },
    'humoruniv': {
        getBoardList: function getBoardList($) {
            return $('#cnts_list_new > div:first-child > table:not(.list_hd2) > tbody > tr[id]');
        },
        getContent: function getContent($content) {
            var $wrDate = $content.children('.li_date');
            var regDate = ($wrDate.children('.w_date').text() + " " + $wrDate.children('.w_time').text()).replace(/\r?\n$/, '');

            var cnt = {};
            cnt.no = $content.attr('id').replace('li_chk_pds-', '');
            if (cnt.no > this.state.content_id) {
                cnt.title = $content.children('.li_sbj').text();
                cnt.writer = $content.find('.li_icn .hu_nick_txt').text();
                cnt.regDate = regDate;
                cnt.url = $content.find('.li_sbj > a[href]').first().attr('href');
                return cnt;
            }
            return false;
        }
    }
};
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }
}();

;