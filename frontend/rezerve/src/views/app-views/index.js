import React, { useEffect, useState } from 'react'
import {
    Card, Row, Col, Spin, Tooltip, Button, Divider, Modal, Form, Input, Select, Collapse, Statistic, message, PageHeader
} from 'antd';
import { useHistory } from "react-router-dom";


import { CalendarOutlined } from '@ant-design/icons';
const { Option } = Select;
const { Panel } = Collapse;
const { Countdown } = Statistic;

const dailyDates = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
    '20:00-21:00',
    '21:00-22:00',
]


const AddNewBookingForm = ({ visible, onCreate, onCancel, room }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            title={room.name}
            visible={visible}
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                name="addBookingForm"
                layout="vertical"
            >
                <Form.Item
                    label={'Booking date'}
                    name="date"

                >
                    <Select
                        dropdownRender={menu => (
                            <div>
                                {menu}
                            </div>
                        )}
                    >
                        {room.noBookings && room.noBookings.map((item, index) => (
                            <Option key={index} value={dailyDates.indexOf(item)}>{item}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label={'Reason'}
                    name="reason"
                    rules={
                        [
                            {
                                require: true,
                                message: 'Please enter reason!'
                            }
                        ]
                    }
                >
                    <Input />
                </Form.Item>



            </Form>
        </Modal >
    )
}


const AppViews = () => {
    const [user] = useState(() => {
        let userInfo = JSON.parse(localStorage.getItem("user"))
        return userInfo
    })
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false);
    let history = useHistory();


    const showModal = () => {
        setIsModalVisible(true);
    };


    const handleCancel = () => {
        setSelectedRoom({})
        setIsModalVisible(false);
    };


    const addBookingOnServer = async (data) => {
        const targetUrl = 'http://localhost:5000/booking'
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

    const addBooking = (values) => {
        console.log(values)
        let data = {
            end_at: values.date,
            start_at: values.date,
            reason: values.reason,
            user_id: user.id,
            room_id: selectedRoom.id
        }
        console.log(data)
        addBookingOnServer(data).then(res => {
            console.log(res)
            if (res.status === 200) {

                console.log('BOOKING MADE')
                message.success('Booking added!')
            } else {
                message.error('Booking failed!')

            }
        })
        setSelectedRoom({})
        setIsModalVisible(false)
        setIsLoading(true)
        getClassrooms()


    }

    const getClassroomsFromServer = async () => {
        const targetUrl = 'http://localhost:5000/classrooms'
        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                org_id: user.org_id
            })
        }
        );
        return res
    }

    const calculateNoBookingList = (bookings) => {

        let noBookings = [...dailyDates]
        if (bookings != null)
            bookings.forEach((booking) => {
                noBookings.splice(booking.start_at, 1)
            })
        return noBookings
    }

    const calculateTimmerValue = (bookings, startAt) => {
        let ok = true
        let count = 0
        while (ok) {
            ok = false
            bookings.forEach((booking) => {
                if (booking.start_at === startAt + count + 1) {
                    ok = true
                    count++
                }
            })
        }
        console.log(count)

        return count

    }


    const calculateIfRoomIsOccupied = (bookings) => {
        let currentTime = new Date()
        let deadline
        let timeStamp

        console.log(currentTime.getHours())
        let isOccupied = false
        if (bookings != null)
            bookings.forEach((booking) => {
                if (booking.start_at === currentTime.getHours() - 8) {
                    console.log('here')
                    isOccupied = true

                    deadline = Date.now() + calculateTimmerValue(bookings, booking.start_at) * 1000 * 60 * 60 + ((60 - currentTime.getMinutes()) * 1000 * 60) + (60 - currentTime.getSeconds()) * 1000

                }
            })



        return ({
            isOccupied: isOccupied,
            deadline: deadline,
            timeStamp: timeStamp
        })
    }

    const getClassrooms = () => {
        getClassroomsFromServer().then(res => {
            console.log(res)
            if (res.status === 200) {

                res.json().then(res => {
                    console.log(res)
                    let roomList = []
                    res.forEach(room => {

                        roomList.push({
                            ...room,
                            noBookings: calculateNoBookingList(room.bookings),
                            isOccupied: calculateIfRoomIsOccupied(room.bookings).isOccupied,
                            deadline: calculateIfRoomIsOccupied(room.bookings).deadline,
                            timeStamp: calculateIfRoomIsOccupied(room.bookings).timeStamp,
                        })
                    });
                    console.log(roomList)
                    setRooms(roomList)
                })
            }

            setIsLoading(false)
        })
    }

    useEffect(() => {
        getClassrooms()

    }, [])

    return (
        <>
            <PageHeader
                onBack={() => {
                    window.history.back();
                    localStorage.clear()
                }}
                title="ROOMS"
            />

            <Spin
                size='large'
                tip="Loading..."
                spinning={isLoading}
            >
                <Row gutter={[16, 16]}>
                    <Col span={22} offset={1}>
                        <Row gutter={[16, 16]}>
                            {rooms.map((room) => (
                                <Col span={12} key={room.id}>
                                    <Card
                                        style={!room.isOccupied ? { borderColor: 'rgb(91,181,115)' } : { borderColor: 'rgb(245,34,45)' }}
                                        title={room.name}
                                        actions={user.type === 0 && [
                                            <Tooltip id="book" title={'Add Booking'}>
                                                <Button
                                                    type="link"
                                                    shape="circle"
                                                    icon={<CalendarOutlined />}
                                                    onClick={() => {
                                                        setSelectedRoom(room)
                                                        showModal()

                                                    }}
                                                />
                                            </Tooltip>
                                        ]}
                                    >
                                        <h4>{room.description}</h4>
                                        {
                                            room.isOccupied &&
                                            <Countdown title="Occupied" value={room.deadline} />

                                        }
                                        <Collapse accordion>
                                            <Panel header="Check program" key="1">
                                                {
                                                    dailyDates.map((date, index) => {
                                                        let booked = false
                                                        let bookingDescription = ""
                                                        let bookingName = ""
                                                        if (room.bookings)
                                                            room.bookings.forEach(booking => {
                                                                if (booking.start_at === index) {
                                                                    booked = true
                                                                    bookingDescription = booking.reason
                                                                    bookingName = booking.User.username
                                                                }
                                                            })

                                                        return (
                                                            <Card style={booked ? { backgroundColor: '#ffa39e' } : { backgroundColor: '#b7eb8f' }}>
                                                                <h3>{date}</h3>
                                                                {
                                                                    booked &&
                                                                    <h5>{bookingDescription} - {bookingName}</h5>
                                                                }
                                                            </Card>
                                                        )
                                                    })
                                                }
                                            </Panel>
                                            <Panel header="Booking History" key="2">
                                                {
                                                    room.bookings &&
                                                    room.bookings.map((booking) => (
                                                        <Card >
                                                            <h5>{booking.User.username} - {booking.reason} - {dailyDates[booking.start_at]} </h5>
                                                        </Card>
                                                    ))
                                                }
                                            </Panel>
                                        </Collapse>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Spin>
            <AddNewBookingForm visible={isModalVisible} onCreate={addBooking} onCancel={handleCancel} room={selectedRoom} />
        </>

    )
}

export default AppViews
