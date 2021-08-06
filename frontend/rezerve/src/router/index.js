import React from 'react'
import { Route, Redirect } from 'react-router-dom'


export const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (localStorage.getItem('user') != null) {
                    console.log('User logged in')
                    return <Component {...props} />
                }
                else {
                    return <Redirect to={
                        {
                            pathname: "/",
                            state: {
                                from: props.location
                            }
                        }
                    }
                    />
                }

            }}
        />
    )
}
