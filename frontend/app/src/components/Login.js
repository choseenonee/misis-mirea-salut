import React from 'react';
import { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import show from '../assets/icons/show.svg'
import hide from '../assets/icons/hide.svg'


import line from "../assets/icons/Line.svg"
import green_ball from "../assets/icons/green_ball.svg"
import blue_ball from "../assets/icons/blue_ball.svg"
import red_ball from "../assets/icons/red_ball.svg"
import purple_ball from "../assets/icons/purple_ball.svg"

function Login() {

    let navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState("");
    const [value, setValue] = useState('');
    const [isShown, setIsShown] = useState(false);

    function handleLogin(str) {
        console.log(str);
        setLogin(str);
    }

    function handlePassword(str) {
        setPassword(str);
    }

    function handleLoginBtn(e) {
        e.preventDefault();
        if (login == 'vdmk' && password == '123') {
            // TODO: store this into cookie?
            setErr('');
            setLogin('');
            setPassword('');
            navigate('/');
        } else {
            if (login == '' || password == '') {
                setErr('Пожалуйтса, заполните все поля');
            } else {
                setErr('Неправильный логин или пароль!');
            }
        }
    }

    function handleFocus() {
        setErr(false); // Reset error state when input is focused
    }

    function handleBlur() {
        if (value.trim() === '') {
          setErr('Пожалуйтса, заполните все поля'); // Set error state if input is empty
        }
    }

    function handleClickLogin(valueC) {
        handleLogin(valueC)
        
        setValue(valueC)
    }

    function handleClickPassword (valueC) {
            handlePassword(valueC)
            setValue(valueC)
    }

    return(
        <div className='back-ground'>
            <div className='empty-div-login'>
                <img src={blue_ball} className='blue_ball'></img>
                <img src={green_ball} className='green_ball'></img>
                <img src={red_ball} className='red_ball'></img>
                <img src={purple_ball} className='purple_ball'></img>
                <div className='conteiner'>
                
                    <div className='inside-cont'>
                        <div className='label'>
                            <p>Вход в систему</p>
                            <p>Админ-панели <span className='avito'>Avito</span></p>
                        </div>
                        <img src={line} className='line'></img>
                        <div className='input-field'>
                            <input  className='input' value={login} placeholder="example@gmail.com" onFocus={handleFocus}
                                    onBlur={handleBlur} onChange={(e) => handleClickLogin(e.target.value)} />
                                    
                                    <div className='form'>
                                                        <input type={isShown ? "text" : "password"} className='input' value={password} placeholder="Введите пароль" onFocus={handleFocus}
                                    onBlur={handleBlur} onChange={(e) => handleClickPassword(e.target.value)} />
                                    <img onClick={() => setIsShown(!isShown)} src={isShown ? hide : show}/>
                                    </div>

        
                            <div onClick={(e) => handleLoginBtn(e)} className='enter-button'><p>Войти</p></div>
                            <h4 className='error'>{err}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;