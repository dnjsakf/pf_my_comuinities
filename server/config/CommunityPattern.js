const moment = require('moment');

module.exports = function( state ){
    this.state = {
        host: state.host,
        title: state.title,
        update: state.board.update,
        today: state.today
    }
    this.getBoardList = service[state.title].getBoardList;
    this.getContent = service[state.title].getContent.bind(this);
}
const service = {
    'YGOSU': {
        getBoardList: ( $ )=>{ return $('table.bd_list tbody > tr:not(.notice)') },
        getContent: function( $content ){
            const cntDate = $content.children('.date').text();
            const regDate = `${this.state.today} ${cntDate}`;

            if( new Date(regDate).getTime() >= this.state.update ){
                let cnt = {}
                cnt.no = $content.children('.no').text();
                cnt.title = $content.children('.tit').text();
                cnt.writer = $content.children('.name').text();
                cnt.regDate = regDate;
                cnt.url = this.state.host + $content.find('.tit > a[href]').first().attr('href');
                return cnt;
            }
            return null;
        }
    },
    'GEZIP': {
        getBoardList: ($)=>{ return $('#list-body .list-item:not(.bg-light)') },
        getContent: function($content){
            const cntDate = $content.children('.wr-date').text().replace(/(\t|\n)/g, '');
            const regDate = `${this.state.today} ${cntDate}`;
            
            if( new Date(regDate).getTime() >= this.state.update ){
                let cnt = {}
                cnt.no = $content.children('.wr-num').text();
                cnt.title = $content.find('.wr-subject > a.item-subject').text().replace(/(\t\d?|\n\d?)/g, '');
                cnt.writer = $content.find('.wr-name').text().replace(/(\t|\n)/g, '');
                cnt.regDate = regDate;
                cnt.url = $content.find('.wr-subject > a[href]').first().attr('href');
                return cnt;
            }
            return null;
        }
    },
    'HUMORUNIV': {
        getBoardList: ($)=>{return $('#cnts_list_new table').eq(1).find('tr')},
        getContent: function($content){
            const regDate = $content.children('.li_date').text();

            if( new Date(regDate).getTime() >= this.state.update ){
                let cnt = {}
                cnt.no = $content.attr('id').replace('li_chk_pds-','');
                cnt.title = $content.children('.li_sbj').text();
                cnt.writer = $content.find('.li_icn .hu_nick_txt').text();
                cnt.regDate = regDate;
                cnt.url = $content.find('.li_sbj > a[href]').first().attr('href');
                return cnt;
            }
            return null;
        }
    },
}