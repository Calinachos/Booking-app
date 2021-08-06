import React, { useState } from 'react'
import RegisterForm from '../components/RegisterForm'
import { Card, Row, Col, Button } from "antd";
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';

import { useHistory } from "react-router-dom";



const contentContainerStyle = {
    height: '92vh'
}

const Register = props => {
    // const [page, setPage] = useState(1);
    // const [progress, setProgress] = useState(33);
    // const history = useHistory();

    // const goBack = () => {
    //     if (page === 1)
    //         history.push("/");

    //     else if (page === 2) {
    //         setProgress(33)
    //         setPage(1)
    //     }
    //     else if (page === 3) {
    //         setProgress(66)
    //         setPage(2)
    //     }
    // }
    // const nextPage = (page) => {
    //     setPage(page)
    //     if (page === 1)
    //         setProgress(33)
    //     else if (page === 2)
    //         setProgress(66)
    //     else if (page === 3)
    //         setProgress(100)
    // }

    return (
        <div className="h-100">
            <div className="container d-flex flex-column justify-content-center" style={contentContainerStyle}>
                <Row justify="center">
                    <Col xs={20} sm={20} md={20} lg={10}>
                        <Card>
                            <Col span={1} offset={20}>
                                <Button type="link" icon={<CloseOutlined />} href='/' />
                            </Col>

                            <div className="my-2">
                                <div className="text-center">
                                    <h1>Register</h1>

                                    <p className="text-muted">Create a new account:</p>
                                </div>
                                <Row justify="center">
                                    <Col xs={24} sm={24} md={20} lg={20}>
                                        <RegisterForm {...props} />
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

export default Register
