module.exports = function( board ){
    this.state = board;
   
    this.getBoardList = service[this.state.comTitle].getBoardList;
    this.getContent = service[this.state.comTitle].getContent.bind(this);
}
const service = {
    '와이고수': {
        getBoardList: ( $ )=>{ return $('table.bd_list tbody > tr:not(.notice)') },
        getContent: function( $content ){
            const cntDate = $content.children('.date').text();
            const regDate = `${this.state.today} ${cntDate}`;

            if( new Date(regDate).getTime() >= this.state.updated ){
                let cnt = {}
                cnt.no = $content.children('.no').text();
                cnt.title = $content.children('.tit').text().replace(/(\t\d?|\n\d?)/g, '');;
                cnt.writer = $content.children('.name').text().replace(/(\t\d?|\n\d?)/g, '');;
                cnt.regDate = regDate;
                cnt.url = this.state.host + $content.find('.tit > a[href]').first().attr('href');
                return cnt;
            }
            return false;
        }
    },
    '개집넷': {
        getBoardList: ($)=>{ return $('#list-body .list-item:not(.bg-light)') },
        getContent: function($content){
            const cntDate = $content.children('.wr-date').text().replace(/(\t|\n)/g, '');
            const regDate = `${this.state.today} ${cntDate}`;
            
            if( new Date(regDate).getTime() >= this.state.updated ){
                let cnt = {}
                cnt.no = $content.children('.wr-num').text();
                cnt.title = $content.find('.wr-subject > a.item-subject').text().replace(/(\t\d?|\n\d?)/g, '');
                cnt.writer = $content.find('.wr-name').text().replace(/(\t\d?|\n\d?)/g, '');
                cnt.regDate = regDate;
                cnt.url = $content.find('.wr-subject > a[href]').first().attr('href');
                return cnt;
            }
            return false;
        }
    },
    '웃긴대학': {
        getBoardList: ($)=>{return $('#cnts_list_new > div:first-child > table:not(.list_hd2) > tbody > tr[id]')},
        getContent: function( $content ){
            let $wrDate = $content.children('.li_date');
            const regDate = ( $wrDate.children('.w_date').text() + " " + $wrDate.children('.w_time').text()).replace(/\r?\n$/,'');

            if( new Date(regDate).getTime() >= this.state.updated ){
                let cnt = {}
                cnt.no = $content.attr('id').replace('li_chk_pds-','');
                cnt.title = $content.children('.li_sbj').text();
                cnt.writer = $content.find('.li_icn .hu_nick_txt').text();
                cnt.regDate = regDate;
                cnt.url = $content.find('.li_sbj > a[href]').first().attr('href');
                return cnt;
            }
            return false;
        }
    },
}