import { Grid, TextField, Typography, Container, Button } from "@mui/material";
import React from "react";
import { music, signin, socialLogin } from "./service/ApiService";
import { Link } from "react-router-dom";

function Mypage() {
    fetch('http://localhost:8080/mypage', {
            method: 'get',
            headers: {
                //'Content-Type': 'multipart/form-data',
                'Authorization': "Bearer "+localStorage.getItem("ACCESS_TOKEN")
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    response.text();
                    console.log(response);
                }
                else if(response.status === 403) {
                    window.location.href = "/login"; //로그인페이지로 리다이렉트
                } else if(response.status === 401) {
                    window.location.href = "/login";
                }
                else {
                    Promise.reject(response);
                    throw Error(response);
                }
            })
            .then((data) => {
                alert('1');
            })
            .catch((error) => {
              if(error.message===500){
                alert('2');
                return;
              }
              alert('3');
            });
};

export default Mypage;