import React from 'react';
import { Button, Form, Input, Select, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
const { Option } = Select;


/**
 * Login form component
 */
export const RegisterForm = (props) => {
    let history = useHistory();


    const registerOnServer = async (data) => {
        const targetUrl = 'http://localhost:5000/signup'
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
    const onRegister = values => {


        let data = {
            username: values.username,
            password: values.password,
            type: values.type,
            org_id: values.org_id
        }

        console.log(data)

        registerOnServer(data).then(res => {
            console.log(res)
            if (res.status === 200) {
                history.push('/')
                message.success('Account created!');
            }
            else {
                message.error('Account creation failed!');

            }

        })
    };


    return (
        <>
            <Form
                layout="vertical"
                name="login-form"
                onFinish={onRegister}
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
                <Row>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label={
                                <div>
                                    <span>Type</span>
                                </div>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter type',
                                }
                            ]}
                        >
                            <Select
                                placeholder="Type"
                            >
                                <Option value={0}>Teacher</Option>
                                <Option value={1}>Student</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="org_id"
                            label={
                                <div>
                                    <span>Organization</span>
                                </div>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter type',
                                }
                            ]}
                        >
                            <Select
                                placeholder="Organization"
                            >
                                <Option value="6002d0bae5e90927f49a1016">A</Option>
                                <Option value="6002d0bae5e90927f49a1017">B</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

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
                <Form.Item
                    name="confirm_password"
                    label={
                        <div>
                            <span>Confirm Password</span>
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
                        Sign Up
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


export default RegisterForm
