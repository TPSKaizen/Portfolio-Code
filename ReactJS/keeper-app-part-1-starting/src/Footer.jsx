import React from "react"

function Footer(){
    let d = new Date();

    return(
        <footer className="footer"> 
           <p> Keeper App {d.getFullYear()}</p> 
        </footer>
    )
}


export default Footer;