import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../Screens/Login';

const AuthStack = createStackNavigator();

const AuthRoutes = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="SignIn" options={{  title:'' }} component={SignIn} />
    </AuthStack.Navigator>
)

export default AuthRoutes;