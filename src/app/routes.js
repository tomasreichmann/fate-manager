import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';

import SheetListView from './components/SheetListView';
import SheetEditView from './components/SheetEditView';
import SheetBlockView from './components/SheetBlockView';
import UserLogin from './components/user/login';
import UserLogout from './components/user/logout';
import UserRegister from './components/user/register';
import UserProfile from './components/user/profile';
import ResetPassword from './components/user/reset_password';
import requireAuth from './utils/authenticated';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={SheetListView} />
    <Route path="/edit/:sheetKey" component={SheetEditView} />
    <Route path="/block/:sheetKey" component={SheetBlockView} />
    <Route path="/login" component={UserLogin} />
    <Route path="/logout" component={UserLogout} />
    <Route path="/register" component={UserRegister} />
    <Route path="/reset" component={ResetPassword} />
    <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
  </Route>

);
