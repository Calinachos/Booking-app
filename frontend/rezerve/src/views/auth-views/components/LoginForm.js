import React, { useEffect } from 'react';
import { Button, Form, Input, Alert, message } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"




/**
 * Login form component
 */
export const LoginForm = (props) => {
    let history = useHistory();

    const loginOnServer = async (data) => {
        const targetUrl = 'http://localhost:5000/login'
        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        );
        return res
    }


    /**
     * Constructs data and passes it to JwtAuthService.login function
     * Then gets the response and stores the values from the server to localStorage
     * @param {[JSON]} values [login form values]
     */
    const onLogin = values => {
        // Here we need to hash the password
        // let hash = sha256.create()
        // hash.update(values.password)
        // let password_hash = hash.hex()

        let data = {
            username: values.username,
            password: values.password
        }

        console.log(data)
        loginOnServer(data).then(res => {
            console.log(res)
            if (res.status === 200) {

                res.json().then(res => {
                    console.log(res)
                    localStorage.setItem('user', JSON.stringify(res))
                    message.success('Logged in!');

                    history.push('/app')
                })
            } else {
                message.error('Login Failed!');

            }
        })
    };


    return (
        <>
            {/* <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                    opacity: showMessage ? 1 : 0,
                    marginBottom: showMessage ? 20 : 0
                }}>
                <Alert type="error" showIcon message={message}></Alert>
            </motion.div> */}
            <Form
                layout="vertical"
                name="login-form"
                onFinish={onLogin}
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username',
                        }
                    ]}>
                    <Input placeholder="Username" prefix={<UserOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label={
                        <div>
                            <span>Password</span>
                        </div>
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password',
                        }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Sign In
					</Button>
                </Form.Item>
                {/* {
                    otherSignIn ? renderOtherSignIn : null
                }
                {extra} */}
            </Form>
        </>
    )
}


export default LoginForm
