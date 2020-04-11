app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

   $scope.init = ()=>{
      const username = prompt('Please enter a username');
      if(username)
         initSocket(username);
      else
         return false;
   }

   function initSocket(username) {
      indexFactory.connectSocket('http://localhost:3000',{
         reconnectionAttemps:3,
         reconnectionDelay:700
      }).then((socket)=>{
         socket.emit('newUser',{username});
        //console.log('connection success',socket);
      }).catch((err)=>{
         console.log(err);
      });
   }

}]);