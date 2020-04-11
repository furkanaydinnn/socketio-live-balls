app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

   $scope.messages = [];
   $scope.players = { };

   $scope.init = ()=>{
      const username = prompt('Please enter a username');
      if(username)
         initSocket(username);
      else
         return false;
   };

   function scrollTop() {
      setTimeout(()=>{
         const element = document.getElementById('chat-area');
         element.scrollTop = element.scrollHeight;
      });
   }

   function showBubble(id, message) {
      $('#' + id).find('.message').show().html(message);

      setTimeout(()=>{
         $('#'+id).find('.message').hide();
      },2000);
   }

  async function initSocket(username) {
      try{
         const  socket = await indexFactory.connectSocket('http://localhost:3000',{
            reconnectionAttemps:3,
            reconnectionDelay:700
         });

         socket.on('initPlayers',(players)=>{
            $scope.players = players;
            $scope.$apply();
         });

         socket.emit('newUser',{username});

         socket.on('newUser',(data)=>{
            const messageData = {
               type: {
                  code:0, // server or user message
                  message:1 // login or disconnect message
               },
               username: data.username
            };
            $scope.messages.push(messageData);
            $scope.players[data.id] = data;
            scrollTop();
            $scope.$apply();
         });

         socket.on('disconnectUser',(data)=>{
            const messageData = {
               type: {
                  code:0, // server or user message
                  message:0 // login or disconnect message
               },
               username: data.username
            };
            $scope.messages.push(messageData);
            delete $scope.players[data.id];
            scrollTop();
            $scope.$apply();
         });

         socket.on('animate',(data)=>{
            $('#'+data.socketId).animate({'left':data.x, 'top':data.y},()=>{
               //animated = false;
            });
         });

         let animated = false;
         $scope.onClickPlayer = ($event) => {
            if(!animated){
               animated = true;
               let x = $event.offsetX;
               let y = $event.offsetY;

               socket.emit('animate',{x,y});

               $('#'+socket.id).animate({'left':x, 'top':y},()=>{
                  animated = false;
               });
            }
         };

         $scope.newMessage = () => {
            let message = $scope.message;
            const messageData = {
               type: {
                  code:1, // server or user message
               },
               username:username,
               text: message
            };
            $scope.messages.push(messageData);
            $scope.message = '';

            showBubble(socket.id,message);
            scrollTop();

            socket.emit('sendMessage',messageData);
         };

         socket.on('sendMessage',message=>{
            $scope.messages.push(message);
            $scope.$apply();
            showBubble(message.socketId,message.text);
            scrollTop();
         });
      }catch (e) {
         console.log(e);
      }
   }
}]);