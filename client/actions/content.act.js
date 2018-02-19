import axios from 'axios'

import { GET_CONTENT } from './ActionTypes.js'

export function getContent( params ){
    return ( dispatch )=>{
        dispatch( ready() );
        
        const request = axios.get( `/api/crawler/${params.commu}/${params.board}` );
        request.then((response)=>{
            console.log( response );
            dispatch( success( response.data ) );
        });
        request.catch((error)=>{
            dispatch( failure( error.response.data ) );
        });
    }
}

function failure( error ){
    return {
        type: GET_CONTENT.FAILURE,
        result: "error",
        data: error
    }
}
function success( data ){
    return {
        type: GET_CONTENT.SUCCESS,
        result: "success",
        data: data
    }
}
function ready(){
    return {
        type: GET_CONTENT.READY
    }
}