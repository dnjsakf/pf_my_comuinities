import { GET_CONTENT } from './../actions/ActionTypes.js'

const initialize = {
    status: "INIT",
    doUpdate: false,
    info: {},
    contents: []
}
export default function( state = initialize, action ){
    switch( action.type ){
        case GET_CONTENT.READY:
            return Object.assign({}, state, {
                status: 'READY',
                doUpdate: initialize.doUpdate,
                info: initialize.info,
                contents: initialize.contents
            });
        case GET_CONTENT.SUCCESS:
            return Object.assign({}, state, {
                status: 'SUCCESS',
                doUpdate: action.data.contents.length > 0,
                info: action.data.board,
                contents: action.data.contents
            });
        case GET_CONTENT.FAILURE:
            return Object.assign({}, state, initialize);
        default:
            return state;
    }
}