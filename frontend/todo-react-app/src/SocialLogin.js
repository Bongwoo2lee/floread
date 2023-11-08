import React from "react";
import { Navigate } from "react-router-dom";

const SocialLogin = (props) => {
    const getUrlParameter = (name) => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        return params.get(name)
    };

    const token = getUrlParameter("token");
    //console.log("토큰 " + token);

    if (token) {
        //console.log("로컬에 저장" +token);
        localStorage.setItem("ACCESS_TOKEN", token);
        return (
            <Navigate
                to={{
                    pathname: "/",
                    state: { from: props.location },
                }}
            />
        );
    } else {
        return (
            <Navigate
                to={{
                    pathname: "/login",
                    state: { from: props.location },
                }}
            />
        );
    }
};

export default SocialLogin;