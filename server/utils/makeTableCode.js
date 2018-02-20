/**
 * @param {*} connection : MySQL Connection 
 * @param {*} tableName : Database Table Name
 * @param {*} code : 
 *      member_t = username, 
 *      community_t = comTitle, 
 *      board_t = comCode, 
 *      page_t = memCode,
 *      update_log_t = memCode
 * @return Promise
 */
export default function( connection, tableName, code ){
    const SQL = `SELECT no FROM ${tableName} ORDER BY no DESC LIMIT 1`;
    return new Promise((resolve, reject)=>{
        connection.query( SQL, (error, exist)=>{
            if( error ) return reject({errorCode: 400, error: error});
            if( !exist[0].no ) return reject({errorCode: 500, error: "Something broken!!!"});

            const index = exist[0].no + 1;
            const tableCode = "";
            switch( tableName.toLowerCase() ){
                case 'member':
                    tableCode = `mem@${code.substring(0,3)}#${index}`;
                    break;
                case 'community':
                    tableCode = `com@${code.substring(0,3)}#${index}`;
                    break;
                case 'board':
                    tableCode = `bod#${index}!${code}`;  // Here 'code' is 'comCode'
                    break;
                case 'page':
                    tableCode = `pag#${index}!${code}`;  // Here 'Code' is 'memCode'
                    break;
                case 'update_log':
                    tableCode = `log#${index}!${code}`;  // Here 'Code' is 'memCode'
                    break;
            }
            resolve( tableCode );
        });
    });
}