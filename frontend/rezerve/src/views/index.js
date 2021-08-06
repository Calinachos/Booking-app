import React, { lazy } from "react";
import { Route, Switch } from "react-router-dom";
// import AppLayout from "layouts/app-layout";
import AuthLayout from '../layouts/auth-layout';
import AppViews from './app-views';

import { ProtectedRoute } from '../router'



export const Views = (props) => {
    return (

        <Switch>
            <ProtectedRoute exact path="/app"
                component={AppViews}
            />
            <Route path="/">
                <AuthLayout />
            </Route>


        </Switch>
    )
}

export default Views
