import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import config from '../config/config.json';




class Notification extends Component{
constructor(props){
        super(props);
        //firebase.initializeApp(config);
        this.notification =null;
}


/**
*  Check if user has permission to receive notification
*  if has permission, then ask for a device token
*  if not, rejected the request and user will not receive notification
*/
async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    //enabled: ask firebase if user has permission to request firebase messaging
            if (enabled){
                return this.getToken();
            }
            else{
                return false;
            }

}

/**
*  Request a device token
*/
async getToken(){
    const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            console.log(`token is:${fcmToken}`)
            return fcmToken;
        } else {
            // user doesn't have a device token yet
            console.log('user doesnt have a device token yet');
            return false;
        }
}

/**
*  Create a new channel for Android user to receive notification
*/
createChannel(){
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
                    .setDescription('My apps test channel');
    return (channel);
}


}

const NotificationMethod = new Notification();
export default NotificationMethod;