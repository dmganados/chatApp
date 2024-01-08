import React from 'react'
import {format} from 'timeago.js'

export default function Chatbox({chat, ownMsg})  {
       
    return(
        <>
            <main id='auto-scroll' className={ownMsg ? "messageBox ownMsg" : "messageBox"} >
                <div className="message"><p className="text">{chat.message}</p></div>
                <div className="time">{format(chat.createdAt)}</div>
            </main>   
        </>
    );
}