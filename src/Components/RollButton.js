import React from "react";



export default function RollButton(props){

    return(

        <button disabled={props.disabled} onClick={()=>props.handleClick()}>Roll</button>

    )
    }