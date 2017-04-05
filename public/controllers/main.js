var instApp = angular.module('instApp');

instApp.controller('mainController', function($scope, $http, $location){

	console.log('mainController loaded...');

	$scope.getUser = function(){
		$http.get('/data/user').then(function(response) {
			$scope.user = response.data[0];
		}, function(response){
			$location.url(response.data);
		})
	}

	$scope.getMedias = function(){
		$http.get('/data/medias').then(function(response) {
			$scope.medias = response.data;
		}, function(response){
			$location.url(response.data);
		})
	}

	$scope.openphoto = function() {
		//swal({ title: '', text: this.media.caption.text, imageUrl: this.media.images.standard_resolution.url})

		var caption;
		if(this.media.caption===null)
			caption = '';
		else {
			caption = this.media.caption.text;
		}
		var timestamp = new Date(this.media.created_time*1000);

		var date = timestamp.toLocaleDateString()+' ';
		var time = timestamp.toLocaleTimeString();

		var first = '<h6><pre><i class="fa fa-calendar" aria-hidden="true"> </i> ' + date
						+'   <i class="fa fa-clock-o" aria-hidden="true"> </i> ' + time +'</pre></h6>'
							+'<img class=\"bigphoto img-responsive\"src="'+this.media.images.standard_resolution.url+'"></img>'

		var second='<h3><i class="fa fa-heart" style="color: #D8315B" aria-hidden="true"></i> '+ this.media.likes.count+'</h3><br/>';

		swal({
  			title: first,
  			text: "<p>"+second+caption+"</p>",
  			html: true,
			confirmButtonText: "Back",
			imageSize: "640x640"
		});
		console.log(this);
	}
});
