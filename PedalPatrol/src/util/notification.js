import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import config from '../config/config.json';
import Database from './database';
import AuthState from './authenticationstate';

const uid = AuthState.getCurrentUserID();

class Notification extends Component{
constructor(props){
        super(props);
        //firebase.initializeApp(config);
        this.notification =null;
        this._callback = this._setDefaultCallback;
}
    _setDefaultCallback(msg){
        console.log(msg);
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
                this.getToken();
            }
            else{
                console.log('user does not have permission')
            }
}

/**
*  Request a device token
*/
async getToken(){
    const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            //console.log(`token is:${fcmToken}`)
            const fcm = fcmToken;
            const newData = {data:{}};
            newData.data.id = uid;
            newData.data.deviceToken = fcm ;
            //console.log(fcm);
            const prepareUpdate = newData.data;
            Database.writeProfileData(prepareUpdate, ()=>{this._callback(true)}, ()=>{this._callback(false)});
//            Database.editProfileData(prepareUpdate, (data) => {
//            this._callback(true);
//            },(error) => {
//            this._callback(false);
//            });
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
/**
 *  Delete device token
 */
async removeToken(){
    await firebase.messaging().deleteToken();
    const prepareUpdate = {};
    prepareUpdate.id = uid;
    prepareUpdate.deviceToken = "";
    Database.writeProfileData(prepareUpdate, ()=>{this._callback(true)}, ()=>{this._callback(false)});
}

deleteNotificationArea(){
    const prepareUpdate = {};
    prepareUpdate.id = uid;
    prepareUpdate.hasCircle = false;
    Database.writeProfileData(prepareUpdate, ()=>{this._callback(true)}, ()=>{this._callback(false)});
}


}

const NotificationMethod = new Notification();
export default NotificationMethod;