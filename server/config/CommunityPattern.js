const moment = require('moment');

module.exports = function( state ){
    this.state = state;

    this.getBoardNames = ()=>{return Object.keys( this.state.board )};
    this.getBoardURL = (boardName)=>{
        return (this.state.host+this.state.board[boardName]+this.state.pageQuery);
    }
    this.getBoardList = service[state.name].getBoardList;
    this.getContent = service[state.name].getContent.bind(this);
}
const service = {
    'YGOSU': {
        getBoardList: ($)=>{ return $('table.bd_list tbody > tr:not(.notice)') },
        getContent: function( $content ){
            let regDate = "2018-02-13 " + $content.children('.date').text();
            if( $content.children('#new').length > 0
                && new Date(regDate).getTime() > this.state.lastUpdate ){

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
            let regDate = "2018-02-13 " + $content.children('.wr-date').text().replace(/(\t|\n)/g, '');
            
            if( new Date(regDate).getTime() >= this.state.lastUpdate ){
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
            let regDate = $content.children('.li_date').text();

            if( new Date(regDate).getTime() >= this.state.lastUpdate ){
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