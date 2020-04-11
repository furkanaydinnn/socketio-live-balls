app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
   indexFactory.connectSocket('http://localhost:3000',{
      reconnectionAttemps:3,
      reconnectionDelay:700
   }).then((socket)=>{
      console.log('connection success',socket);
   }).catch((err)=>{
      console.log(err);
   })
}]);