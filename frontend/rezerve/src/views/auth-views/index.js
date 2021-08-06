import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Spin } from "antd";
export const AppViews = ({ match }) => {
    return (
        <Suspense fallback={<Spin />}>
            <Switch>
                <Route exact path={`${match.url}`} component={lazy(() => import(`./authentication`))} />
                <Route path={`${match.url}register`} component={lazy(() => import(`./register`))} />
            </Switch>
        </Suspense>
    )
}

export default AppViews;
