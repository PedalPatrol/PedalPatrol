const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

var bikeowner;
//var token;
const promises = [];

//firebase will act when bike data has been created, deleted or updated
exports.sendNotifications = functions.database.ref('/PProject/Bike/{BID}')
	.onWrite((change,context) => {
		//collect the bike information
		const bike = change.after.val();
		//console.log(bike);
		if(bike === null){
			return Promise.all(promises);
		}
		if(bike.stolen ===''||bike.found ===''){
			return Promise.all(promises);
		}
		//report found function 
		//when someone find the bike and report found to owner
		else if(bike.stolen === false&&bike.found === true){
		 //get uid from bike
		 var bikeowner = bike.owner;
		 var bid = bike.id;
			var payload = {notification: {
				title: 'your bike was found!!',
				body: 'model: '+bike.model+', colour: '+bike.colour
				},
				data:{ 
                'bid': bid}
			};
			//get device token from owner
			console.log(bikeowner);
			admin.database().ref('/PProject/Users').child(bikeowner).child('deviceToken').once('value').then(snapshot => {
				console.log('token is '+snapshot.val());
				var token = snapshot.val();
				console.log(token);
				admin.messaging().sendToDevice(token,payload);
				return Promise.all(promises);
		 }).catch((err) => { console.log("Error sending Push", err) });
		
			return Promise.all(promises);
		}
		//report lost functions
		//when someone lost bike and report lost, notifictions will be sent to users nearby.
		else if(bike.stolen === true&&bike.found === false){
			admin.database().ref('/PProject/Users').once('value').then(function(users){	
			//var users = snapshot.val();
			//console.log('users'+users);
				//notification style
				var payload = {notification: {
					title: 'a bike is stolen',
					body: 'model: '+bike.model+', colour: '+bike.colour
				}
				};
				//send notification to multiple users
				var tokens = [];
				users.forEach(function(reciever){
					//console.log(reciever);
					var user = reciever.val();
					console.log('user is: '+user.id);
					if(user.deviceToken!==''&&user.circle_r ===''){
						console.log('in if user id is： '+user.id);
						console.log('user circle is none'+user.deviceToken);
						admin.messaging().sendToDevice(user.deviceToken,payload);
						//return true;
					}
					else if(user.deviceToken!==''){
						console.log('user id is： '+user.id);
					//start is the location of users
					var start = (user.circle_lat,user.circle_long);
					//end is the location of lost bike
					var end = (bike.latitude, bike.longtitude);
					//radius will be set by users
						var radius = user.circle_r;
					//distance between user and lost bike
						var distance = getDistance(start,end);
					//find users near the lost bikes
						//if(distance<=radius){
							var receiver = user.val();
							//tokens.push(user.deviceToken);
						console.log('user is :'+user.deviceToken);
						admin.messaging().sendToDevice(user.deviceToken, payload);
						//}
						//return true;
					}
			
				
				
				//return Promise.all(promises);
			});
			return Promise.all(promises);
			
		}).catch((err) => { console.log("Error sending Push", err) });
		}
		else {
			return Promise.all(promises);
		}
		return Promise.all(promises);
});
//this function is used to calculate the distance between users and bike.
//this fucntion is not finished for now. 
//the details of how to calculate the distance between two location could be found 
//		in https://github.com/manuelbieh/Geolib
//the only problem for now is this.coords could not be used, may because missing import or something else.
function getDistance(start, end) {  
                  const accuracy = 0.00001;  
                  const precision = 0;  
                  const s = this.coords(start);  
                  const e = this.coords(end);    
                  let a = 6378137,  
                      b = 6356752.314245,  
                      f = 1 / 298.257223563; // WGS-84 ellipsoid params  
                  const L = (e.longitude - s.longitude).toRad();  
      
  
                  let cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM, sinSigma;  
      
  
                  const U1 = Math.atan((1 - f) * Math.tan(parseFloat(s.latitude).toRad()));  
                  const U2 = Math.atan((1 - f) * Math.tan(parseFloat(e.latitude).toRad()));  
                  let sinU1 = Math.sin(U1),  
                      cosU1 = Math.cos(U1);  
                  let sinU2 = Math.sin(U2),  
                      cosU2 = Math.cos(U2);  
      
  
                  let lambda = L,  
                      lambdaP,  
                      iterLimit = 100;  
                  do {  
                      let sinLambda = Math.sin(lambda),  
                          cosLambda = Math.cos(lambda);  
                      sinSigma = Math.sqrt(  
                          cosU2 * sinLambda * (cosU2 * sinLambda) +  
                              (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)  
                      );  
                      if (sinSigma === 0) {  
                          return (geolib.distance = 0); // co-incident points  
                      }  
      
  
                      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;  
                      sigma = Math.atan2(sinSigma, cosSigma);  
                      sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;  
                      cosSqAlpha = 1 - sinAlpha * sinAlpha;  
                      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;  
      
  
                      if (isNaN(cos2SigmaM)) {  
                          cos2SigmaM = 0; // equatorial line: cosSqAlpha=0 (§6)  
                      }  
                      const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));  
                      lambdaP = lambda;  
                      lambda =  
                          L +  
                          (1 - C) *  
                              f *  
                              sinAlpha *  
                              (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));  
                  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);  
      
  
                  if (iterLimit === 0) {  
                      return NaN; // formula failed to converge  
                  }  
      
  
                  const uSq = cosSqAlpha * (a * a - b * b) / (b * b);  
      
  
                  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));  
      
  
                  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));  
      
  
                  const deltaSigma =  
                      B *  
                      sinSigma *  
                      (cos2SigmaM +  
                          B /  
                              4 *  
                              (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -  
                                  B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));  
      
  
                  let distance = b * A * (sigma - deltaSigma);  
      
  
                  distance = distance.toFixed(precision); // round to 1mm precision  
      
  
                  //if (start.hasOwnProperty(elevation) && end.hasOwnProperty(elevation)) {  
                  if (typeof this.elevation(start) !== 'undefined' && typeof this.elevation(end) !== 'undefined') {  
                      const climb = Math.abs(this.elevation(start) - this.elevation(end));  
                      distance = Math.sqrt(distance * distance + climb * climb);  
                  }  
      
  
                  return (this.distance =  
                      Math.round(distance * Math.pow(10, precision) / accuracy) * accuracy / Math.pow(10, precision));  

	
	}
