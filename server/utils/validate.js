export default {
    pattern:{
        // Authentications
        // 최소 5자, 최대 12자 첫 글자는 문자
        username: /^[a-zA-Z]{1}[a-zA-Z0-9]{4,12}$/,
        // 최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
        password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
        // 초소 2자, 최대 8자
        nickname: /^[a-zA-Z0-9가-힣]{2,12}$/,
        email: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
    
        // DEFAULT
        title: /[0-9a-zA-Zㄱ-ㅎ가-힣\~\!\@\#\'\^\(\)]{1,12}/,
        number: /^[1-9][0-9]*$/
    },
    description:{
        username: '최소 5자, 최대 12자 첫 글자는 문자',
        password: '최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자',
        nickname: '초소 2자, 최대 8자',
        email: '기본 이메일 형식 ex) admin@gmail.com'    
    },
    check: function( type, text ){
        if( typeof text !== 'string' || text.length === 0 ){
            return false;
        }
        return this.pattern[type].test( text ) ? text : false;
    }
}