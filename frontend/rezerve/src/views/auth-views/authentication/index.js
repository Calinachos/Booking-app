import React from 'react'
import LoginForm from '../components/LoginForm'

import { Card, Row, Col, Button } from "antd";

import { CloseOutlined } from '@ant-design/icons';



const contentContainerStyle = {
    height: '92vh'
}

const Login = props => {
    return (
        <div className="h-100">
            <div className="container d-flex flex-column justify-content-center" style={contentContainerStyle}>
                <Row justify="center">
                    <Col xs={20} sm={20} md={20} lg={10}>
                        <Card>
                            <div className="my-4">
                                <div className="text-center">
                                    <h1>Rezervari Clase Universitate Politehnica</h1>
                                    <p>Don't have an account yet? <a href="/register">Sign Up</a></p>
                                </div>
                                <Row justify="center">
                                    <Col xs={24} sm={24} md={20} lg={20}>
                                        <LoginForm {...props} />
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Login
