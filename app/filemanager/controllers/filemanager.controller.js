(function (angular, $) {
  'use strict';
  angular.module('dctmNgFileManager')
    .controller('FileManagerController', [
      '$scope', '$rootScope', '$window', '$translate','fileManagerConfig','item', 'permit','Templates','Task','toasty', 'fileNavigator', 'apiMiddleware', 'dctmClient', 'dctmConstants',
      function ($scope, $rootScope, $window, $translate,fileManagerConfig, Item, Permit,Templates, Task ,toasty,FileNavigator, ApiMiddleware, dctmClient, dctmConstants) {
        var $storage = $window.localStorage;
        $scope.config = fileManagerConfig;
        $scope.reverse = false;
        $scope.predicate = ['model.type', 'model.name'];
        $scope.order = function (predicate) {
          $scope.reverse = ($scope.predicate[1] === predicate) ? !$scope.reverse : false;
          $scope.predicate[1] = predicate;
        };
        $scope.query = '';
        $scope.search = '';
        $scope.fileNavigator = new FileNavigator();
        $scope.apiMiddleware = new ApiMiddleware();
        $scope.uploadFileList = [];
        $scope.viewTemplate = $storage.getItem('viewTemplate') || 'main-table.html';
        $scope.fileList = [];
        $scope.temps = [];
        $scope.dctmConstants = dctmConstants;
       
        $scope.taskGbl='';
        $scope.getRepositoryList = function () {
          $scope.apiMiddleware.listRepositories();
        };

        $scope.login = function () {
          $scope.apiMiddleware.login().then(function () {
            $scope.fileNavigator.refresh();
            $scope.modal('signin', true);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.logout = function () {
          $scope.apiMiddleware.logout();
          $scope.modal('signout', true);
        };
        
        $scope.uploadFiles = function (item) {
        	console.log("uploadFiles");
        	console.log(item);
        	
        	$scope.apiMiddleware.getConfigFile().then(function (result) {
        		
        		var loginInfo = {
        		            baseUri: result.gnosisRestServiceUrl,
        		            repoName: result.repositoryName,
        		            username: result.userName,
        		            password: atob(result.password),
        		            //password: result.password, 
        		            folderPath: result.gnosisFolderPath
        		          };
        		
             $scope.apiMiddleware.login(loginInfo).then(function () {
            	 	$scope.warning='';
     				$scope.error='';
     				$scope.success='';
	                $scope.fileNavigator.refresh();
	                $scope.modal('signin', true);
	             
	                var repoLink=loginInfo.baseUri+'/repositories/'+loginInfo.repoName;
	                var path =loginInfo.folderPath;
	             
	                if($scope.item.consannexid== undefined ){
	                	
	                	if($scope.uploadFileList[0].name.includes('.doc')){	                		
	                			$scope.apiMiddleware.getFolderObjectByPath(repoLink,path).then(function (feed) {   		              
	        		            $scope.apiMiddleware.upload($scope.uploadFileList, $scope.fileNavigator.currentPath, feed.data).then(function (respn) {
	        		            $scope.modal('uploadfile', true);
	        		            var link =respn.data.links[0];
	        		            var docLink = link.href;		            	        		            
	        		            console.log("Function calling from Template module") ;
	        		            $scope.item.tmpl_location=docLink;	        		            
	        		            Templates.update({ id:item.id },item).$promise.then(function(response){
	        		            	console.log(response);
	        		            	if(response.$promise.$$state.status==1)
	        		            		{
	        		            		toasty.success({
	        			           	        title: 'Success',
	        			           	        msg: 'Template Uploaded Successfully!',
	        			           	        showClose: true,
	        			           	        clickToClose: true,
	        			           	        timeout: 5000,
	        			           	        sound: false,
	        			           	        html: false,
	        			           	        shake: false,
	        			           	        theme: 'bootstrap'
	        			           	      });
	        		            		
	        		            		$scope.uploadFileList = [];
	        		            		}else{
	        		            			toasty.error({
	  	        		          	          title: 'Error',
	  	        		          	          msg: 'Internal server Error! Failed to update database ',
	  	        		          	          showClose: true,
	  	        		          	          clickToClose: true,
	  	        		          	          timeout: 6000,
	  	        		          	          sound: false,
	  	        		          	          html: false,
	  	        		          	          shake: false,
	  	        		          	          theme: 'bootstrap'
	  	        		          	        });
	        		            		
	        		            		}
	        		 		      }).catch(function(){
	        		 		    	 toasty.error({
	        		          	          title: 'Error',
	        		          	          msg: 'Internal server Error! Failed to update database ',
	        		          	          showClose: true,
	        		          	          clickToClose: true,
	        		          	          timeout: 6000,
	        		          	          sound: false,
	        		          	          html: false,
	        		          	          shake: false,
	        		          	          theme: 'bootstrap'
	        		          	        });
	        		     		    	
	        		       		      });        		                   		            
	        		          }, function (resp) {
	        		            var errorMsg = resp.data && resp.data.error || $translate.instant('error_uploading_files');
	        		            $scope.apiMiddleware.error = errorMsg;
	        		            toasty.error({
	          	          	          title: 'Repository Error',
	          	          	          msg: 'Template  not able to upload ! ',
	          	          	          showClose: true,
	          	          	          clickToClose: true,
	          	          	          timeout: 6000,
	          	          	          sound: false,
	          	          	          html: false,
	          	          	          shake: false,
	          	          	          theme: 'bootstrap'
	          	          	        });
	        		            
	        		          });	
	        	                }, function (resp) {
	        	                  self.apiMiddleware.parseError(resp.data);
	        	                });
	                		
	                	}else{
	                		$scope.error="Template should be .doc/.docx type";
	                		console.log("File type should be doc type");
	                	}
	                	
	                }else{
	                	
                		if($scope.uploadFileList[0].name.includes('.pdf')){
                			    $scope.apiMiddleware.getFolderObjectByPath(repoLink,path).then(function (feed) {   		              
            		            $scope.apiMiddleware.upload($scope.uploadFileList, $scope.fileNavigator.currentPath, feed.data).then(function (respn) {
            		            $scope.modal('uploadfile', true);
            		            var link =respn.data.links[0];
            		            var docLink = link.href;		            
            		            console.log("Function calling from Task module");
            		            $scope.item.consannexid.annnexlocation=docLink;
            		            $scope.item.taskstatus="COMPLETED";
            		            Task.update({ id:item.id },item).$promise.then(function(response){
	        		            	console.log(response);
	        		            	if(response.$promise.$$state.status==1)
	        		            		{
	        		            		toasty.success({
	        			           	        title: 'Success',
	        			           	        msg: 'Task Status Changed to COMPLETED',
	        			           	        showClose: true,
	        			           	        clickToClose: true,
	        			           	        timeout: 5000,
	        			           	        sound: false,
	        			           	        html: false,
	        			           	        shake: false,
	        			           	        theme: 'bootstrap'
	        			           	      });
	        		            		$scope.success= "File Uploaded Successfully!" ;
	        		            		$scope.uploadFileList = [];
	        		            		}else{
	        		            			toasty.error({
	  	        		          	          title: 'Error',
	  	        		          	          msg: 'Internal server Error! Failed to update database ',
	  	        		          	          showClose: true,
	  	        		          	          clickToClose: true,
	  	        		          	          timeout: 6000,
	  	        		          	          sound: false,
	  	        		          	          html: false,
	  	        		          	          shake: false,
	  	        		          	          theme: 'bootstrap'
	  	        		          	        });
	        		            		
	        		            		}
	        		 		      }).catch(function(){
	        		 		    	 toasty.error({
	        		          	          title: 'Error',
	        		          	          msg: 'Internal server Error! Failed to update database ',
	        		          	          showClose: true,
	        		          	          clickToClose: true,
	        		          	          timeout: 6000,
	        		          	          sound: false,
	        		          	          html: false,
	        		          	          shake: false,
	        		          	          theme: 'bootstrap'
	        		          	        });
	        		     		    	
	        		       		      });           		            
            		            
            		          }, function (resp) {
            		            var errorMsg = resp.data && resp.data.error || $translate.instant('error_uploading_files');
            		            $scope.apiMiddleware.error = errorMsg;
            		            toasty.error({
          	          	          title: 'Repository Error',
          	          	          msg: 'File is not able to upload ! ',
          	          	          showClose: true,
          	          	          clickToClose: true,
          	          	          timeout: 6000,
          	          	          sound: false,
          	          	          html: false,
          	          	          shake: false,
          	          	          theme: 'bootstrap'
          	          	        });
            		       
            		          });	
            	                }, function (resp) {
            	                  self.apiMiddleware.parseError(resp.data);
            	                });
                		
                	     }else{
                	    	 $scope.error="File should be .pdf type";
                	    	 console.log("File should be pdf type")
                	}
                	
                }	
             	}, function (resp) {
                     $scope.apiMiddleware.parseError(resp.data);
                     toasty.error({
            	          title: 'Error',
            	          msg: 'Repository Login error ! Uploading Failed',
            	          showClose: true,
            	          clickToClose: true,
            	          timeout: 6000,
            	          sound: false,
            	          html: false,
            	          shake: false,
            	          theme: 'bootstrap'
            	        });
                     
                   });
         	 
        	}, function (resp) {
                $scope.apiMiddleware.parseError(resp.data);
                toasty.error({
      	          title: 'Error',
      	          msg: 'Not able to read Configuration file! Uploading failed',
      	          showClose: true,
      	          clickToClose: true,
      	          timeout: 6000,
      	          sound: false,
      	          html: false,
      	          shake: false,
      	          theme: 'bootstrap'
      	        });                
               
            });
        	
        
        };
        
        $scope.uploadFilesR = function () {
        	console.log("uploadFilesR");
        	
        	$scope.apiMiddleware.getConfigFile().then(function (result) {
        		
        		var loginInfo = {
        		            baseUri: result.gnosisRestServiceUrl,
        		            repoName: result.repositoryName,
        		            username: result.userName,
        		            password: atob(result.password),
        		           // password: result.password, 
        		            folderPath: result.gnosisFolderPath
        		          };
        	
             $scope.apiMiddleware.login(loginInfo).then(function () {
	                $scope.fileNavigator.refresh();
	                $scope.modal('signin', true);
	             
	                var repoLink=loginInfo.baseUri+'/repositories/'+loginInfo.repoName;
	                var path =loginInfo.folderPath; 
	              
	                $scope.apiMiddleware.getFolderObjectByPath(repoLink,path).then(function (feed) {   		              
		            $scope.apiMiddleware.upload($scope.uploadFileList, $scope.fileNavigator.currentPath, feed.data).then(function (respn) {
		           
		            var link =respn.data.links[0];
		            var docLink = link.href;
		            	$scope.item.consannexid.revocationDocLink=docLink;
		            	toasty.success({
		           	        title: 'Success',
		           	        msg: 'File Uploaded Successfully!',
		           	        showClose: true,
		           	        clickToClose: true,
		           	        timeout: 5000,
		           	        sound: false,
		           	        html: false,
		           	        shake: false,
		           	        theme: 'bootstrap'
		           	      });
		            			           
		          }, function (resp) {
		            var errorMsg = resp.data && resp.data.error || $translate.instant('error_uploading_files');
		            $scope.apiMiddleware.error = errorMsg;
		            toasty.error({
	          	          title: 'Repository Error',
	          	          msg: 'File is not able to upload ! ',
	          	          showClose: true,
	          	          clickToClose: true,
	          	          timeout: 6000,
	          	          sound: false,
	          	          html: false,
	          	          shake: false,
	          	          theme: 'bootstrap'
	          	        });
		            
		          });	
	                }, function (resp) {
	                  self.apiMiddleware.parseError(resp.data);
	                });
	                              
              }, function (resp) {
                     $scope.apiMiddleware.parseError(resp.data);
                     toasty.error({
             	          title: 'Error',
             	          msg: 'Repository Login error ! Uploading Failed',
             	          showClose: true,
             	          clickToClose: true,
             	          timeout: 6000,
             	          sound: false,
             	          html: false,
             	          shake: false,
             	          theme: 'bootstrap'
             	        });
                     
                   });
           
        	}, function (resp) {
                $scope.apiMiddleware.parseError(resp.data);
                toasty.error({
      	          title: 'Error',
      	          msg: 'Not able to read Configuration file! Uploading failed',
      	          showClose: true,
      	          clickToClose: true,
      	          timeout: 6000,
      	          sound: false,
      	          html: false,
      	          shake: false,
      	          theme: 'bootstrap'
      	        });
                
            });
        	
        	
        
        };
        

       
        $scope.download = function (obj) {    		
    		$scope.link=obj;
    		console.log("$scope  "+$scope.link);
    		console.log("$scope  " , $scope.link.id);
    		console.log("$scope  "+$scope.link.consannexid);
    	
    		$scope.apiMiddleware.getConfigFile().then(function (result) {
        		
        		var loginInfo = {
        		            baseUri: result.gnosisRestServiceUrl,
        		            repoName: result.repositoryName,
        		            username: result.userName,
        		            password: atob(result.password),
        		           // password: result.password, 
        		            folderPath: result.gnosisFolderPath
        		          };
        		 
             $scope.apiMiddleware.login(loginInfo).then(function () {

        		 $scope.fileNavigator.refresh();
	             $scope.modal('signin', true);
        		var location;
        		if($scope.link.consannexid == undefined){
	        		console.log("Inside IF ");
	        		location=$scope.link.tmpl_location;
        		}else{
        			console.log("Inside ELSE ");
        			location=$scope.link.consannexid.annnexlocation;
        		}
        		console.log(location);
                $scope.apiMiddleware.getDocumentByLink(location).then(function (resp) {
                var doc=resp.data;
                return $scope.apiMiddleware.getDocumentDownload(doc).then(function (resp) {
                toasty.success({
           	        title: 'Success',
           	        msg: 'Downloaded Successfully!',
           	        showClose: true,
           	        clickToClose: true,
           	        timeout: 5000,
           	        sound: false,
           	        html: false,
           	        shake: false,
           	        theme: 'bootstrap'
           	      });
                });
                	});
        	
            	 
             }, function (resp) {
                 $scope.apiMiddleware.parseError(resp.data);
                 
                 console.log("File is not able to download ");
                 toasty.error({
          	          title: 'Error',
          	          msg: 'Repository Login error ! Downloading Failed',
          	          showClose: true,
          	          clickToClose: true,
          	          timeout: 6000,
          	          sound: false,
          	          html: false,
          	          shake: false,
          	          theme: 'bootstrap'
          	        });
               });
        	
          
        	}, function (resp) {
                $scope.apiMiddleware.parseError(resp.data);
                toasty.error({
        	          title: 'Error',
        	          msg: 'Not able to read Configuration file! Downloading failed',
        	          showClose: true,
        	          clickToClose: true,
        	          timeout: 6000,
        	          sound: false,
        	          html: false,
        	          shake: false,
        	          theme: 'bootstrap'
        	        });
            });
    		
    	
       };
       
       
       $scope.downloadCH = function (obj) {    		
   		$scope.link=obj;
   		console.log("$scope  "+$scope.link);
   		console.log("$scope  " , $scope.link.id);
   		
   			
		$scope.apiMiddleware.getConfigFile().then(function (result) {
    		
    		var loginInfo = {
    		            baseUri: result.gnosisRestServiceUrl,
    		            repoName: result.repositoryName,
    		            username: result.userName,
    		           // password: result.password, 
    		            password: atob(result.password),
    		            folderPath: result.gnosisFolderPath
    		          };
    		 
         $scope.apiMiddleware.login(loginInfo).then(function () {

       		 $scope.fileNavigator.refresh();
	             $scope.modal('signin', true);
       		
       		
	        	var location=$scope.link.annnexlocation;
	        	console.log(location);
               $scope.apiMiddleware.getDocumentByLink(location).then(function (resp) {
               var doc=resp.data;
               return $scope.apiMiddleware.getDocumentDownload(doc).then(function (resp) {
               toasty.success({
       	        title: 'Success',
       	        msg: 'Downloaded Successfully!',
       	        showClose: true,
       	        clickToClose: true,
       	        timeout: 5000,
       	        sound: false,
       	        html: false,
       	        shake: false,
       	        theme: 'bootstrap'
       	      });
               });
               
               console.log("File Downloaded Successfully");
               	});
       	
         }, function (resp) {
             $scope.apiMiddleware.parseError(resp.data);
            
             console.log("File is not able to download ");
             toasty.error({
   	          title: 'Error',
   	          msg: 'Repository Login error! Download Failed',
   	          showClose: true,
   	          clickToClose: true,
   	          timeout: 6000,
   	          sound: false,
   	          html: false,
   	          shake: false,
   	          theme: 'bootstrap'
   	        });
           });
       	 
    	}, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
            toasty.error({
  	          title: 'Error',
  	          msg: 'Not able to read Configuration file! Download failed',
  	          showClose: true,
  	          clickToClose: true,
  	          timeout: 6000,
  	          sound: false,
  	          html: false,
  	          shake: false,
  	          theme: 'bootstrap'
  	        });
        });
		
		
      }; 
      $scope.remove = function () {
          $scope.apiMiddleware.remove($scope.temps).then(function () {
            $scope.fileNavigator.refresh();
            $scope.modal('remove', true);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };      
      $scope.prepareNewFolder = function () {
          var item = new Item($scope.fileNavigator.folderObject, $scope.fileNavigator.currentPath);
          $scope.temps = [item];
          return item;
        };

        $scope.createFolder = function () {
          var itemLocal = $scope.singleSelection();
          var name = itemLocal.tempModel.name;
          itemLocal.tempModel.id = $scope.fileNavigator.folderId;
          itemLocal.tempModel.object = $scope.fileNavigator.folderObject;

          if (!name || $scope.fileNavigator.fileNameExists(name)) {
            return $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
          }

          $scope.apiMiddleware.createFolder(itemLocal.tempModel).then(function () {
            $scope.fileNavigator.refresh();
            $scope.modal('newfolder', true);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.nextPage = function () {
          if ($scope.search == '') {
            $scope.fileNavigator.nextPage();
          } else {
            if (!$scope.fileNavigator.hasNext()) {
              console.log('No More Pages');
              return;
            }
            $scope.fileNavigator.pageNumber++;
            return search();
          }
        };

        $scope.previousPage = function () {
          if ($scope.search == '') {
            $scope.fileNavigator.previousPage();
          } else {
            if (!$scope.fileNavigator.hasPrevious()) {
              console.log('No Previous Pages');
              return;
            }
            $scope.fileNavigator.pageNumber--;
            return search();
          }
        };

        $scope.ftSearch = function () {
          if ($scope.search == '') {
            $scope.fileNavigator.refresh();
          } else {
            return search();
          }
        };

        var search = function () {
          var currentFullPath = $scope.fileNavigator.currentFullPath();
          var currentPage = $scope.fileNavigator.pageNumber;
          var currentPageSize = $scope.fileNavigator.pageSize;
          return $scope.apiMiddleware.ftSearch($scope.search, currentFullPath, currentPage, currentPageSize)
            .then(function (resp) {
              var objects = $scope.apiMiddleware.parseEntries(resp.data);
              $scope.fileNavigator.fileList = (objects || []).map(function (file) {
                return new Item(file, '/');
              });
              $scope.fileNavigator.buildTree('/');
            }, function (resp) {
              $scope.apiMiddleware.parseError(resp.data);
            });
        };
        $scope.openImagePreview = function () {
          var item = $scope.singleSelection();
          $scope.apiMiddleware.inprocess = true;
          $scope.apiMiddleware.getContentMeta(item, true).then(function (resp) {
            var acsUrl = $scope.apiMiddleware.getLinkFromResource(resp.data, dctmConstants.LINK_RELATIONS.ENCLOSURE);
            $scope.modal('imagepreview', null, true)
              .find('#imagepreview-target')
              .attr('src', acsUrl)
              .unbind('load error')
              .on('load error', function () {
                $scope.apiMiddleware.inprocess = false;
                $scope.$apply();
              });
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.rename = function () {
          var item = $scope.singleSelection();
          var name = item.tempModel.name;
          var samePath = item.tempModel.path.join('') === item.model.path.join('');
          if (!name || (samePath && $scope.fileNavigator.fileNameExists(name))) {
            $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
            return false;
          }
          $scope.apiMiddleware.rename(item).then(function () {
            $scope.fileNavigator.refresh();
            $scope.modal('rename', true);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.openEditItem = function () {
          var item = $scope.singleSelection();
          $scope.apiMiddleware.getContent(item, false).then(function (resp) {
            item.tempModel.content = item.model.content = String.fromCharCode.apply(null, new Uint8Array(resp.data));
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
          $scope.modal('edit');
        };

        $scope.edit = function () {
          $scope.apiMiddleware.edit($scope.singleSelection()).then(function () {
            $scope.modal('edit', true);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.move = function () {
          var anyItem = $scope.singleSelection() || $scope.temps[0];
          if (anyItem && validateSamePath(anyItem)) {
            $scope.apiMiddleware.error = $translate.instant('error_cannot_move_same_path');
            return false;
          }
          $scope.apiMiddleware.move($scope.temps, $scope.fileNavigator.folderObject, $rootScope.selectedModalObject).then(function () {
            $scope.fileNavigator.refresh();
            $scope.modal('move', true);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.copy = function () {
          var item = $scope.singleSelection();
          if (item) {
            var name = item.tempModel.name.trim();
            var nameExists = $scope.fileNavigator.fileNameExists(name);
            if (nameExists && validateSamePath(item)) {
              $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
              return false;
            }
            if (!name) {
              $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
              return false;
            }
          }
          $scope.apiMiddleware.copy($scope.temps, $rootScope.selectedModalObject).then(function () {
            $scope.fileNavigator.refresh();
            $scope.modal('copy', true);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.getPermissions = function () {
          console.log('Get permissions for ' + $scope.temp.model.name);
          $scope.apiMiddleware.getPermissionSet($scope.temp).then(function (resp) {
            $scope.temp.tempModel.permit = new Permit(resp.data);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.changePermissions = function () {
          console.log('Change permissions for ' + $scope.temp.model.name);
          var grantedToUpdate = $scope.temp.tempModel.permit.toPermissionSet();
          $scope.apiMiddleware.setPermissionSet($scope.temp, grantedToUpdate).then(function (resp) {
            $scope.temp.tempModel.permit = new Permit(resp.data);
          }, function (resp) {
            $scope.apiMiddleware.parseError(resp.data);
          });
        };

        $scope.addTempPermission = function () {
          console.log('Add a new permission to ' + $scope.temp.model.name);
          $scope.temp.tempModel.permit.increase();
        };

        /************** line separator for implemented APIs ************/

        $scope.compress = function () {
          var name = $scope.temp.tempModel.name.trim();
          var nameExists = $scope.fileNavigator.fileNameExists(name);

          if (nameExists && validateSamePath($scope.temp)) {
            $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
            return false;
          }
          if (!name) {
            $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
            return false;
          }

          $scope.apiMiddleware.compress($scope.temps, name, $rootScope.selectedModalPath).then(function () {
            $scope.fileNavigator.refresh();
            if (! $scope.config.compressAsync) {
              return $scope.modal('compress', true);
            }
            $scope.apiMiddleware.asyncSuccess = true;
          }, function () {
            $scope.apiMiddleware.asyncSuccess = false;
          });
        };

        $scope.extract = function () {
          var item = $scope.temp;
          var name = $scope.temp.tempModel.name.trim();
          var nameExists = $scope.fileNavigator.fileNameExists(name);

          if (nameExists && validateSamePath($scope.temp)) {
            $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
            return false;
          }
          if (!name) {
            $scope.apiMiddleware.error = $translate.instant('error_invalid_filename');
            return false;
          }

          $scope.apiMiddleware.extract(item, name, $rootScope.selectedModalPath).then(function () {
            $scope.fileNavigator.refresh();
            if (! $scope.config.extractAsync) {
              return $scope.modal('extract', true);
            }
            $scope.apiMiddleware.asyncSuccess = true;
          }, function () {
            $scope.apiMiddleware.asyncSuccess = false;
          });
        };

        $scope.$watch('temps', function () {
          if ($scope.singleSelection()) {
            $scope.temp = $scope.singleSelection();
          } else {
            $scope.temp = new Item({rights: 644});
            $scope.temp.multiple = true;
          }
          $scope.temp.revert();
        });

        $scope.fileNavigator.onRefresh = function () {
          $scope.temps = [];
          $rootScope.selectedModalPath = $scope.fileNavigator.currentPath;
          $rootScope.selectedModalObject = $scope.fileNavigator.folderObject;
        };

        $scope.setTemplate = function (name) {
          $storage.setItem('viewTemplate', name);
          $scope.viewTemplate = name;
        };

        $scope.changeLanguage = function (locale) {
          if (locale) {
            $storage.setItem('language', locale);
            return $translate.use(locale);
          }
          $translate.use($storage.getItem('language') || fileManagerConfig.defaultLang);
        };

        $scope.isSelected = function (item) {
          return $scope.temps.indexOf(item) !== -1;
        };

       

        $scope.singleSelection = function () {
          return $scope.temps.length === 1 && $scope.temps[0];
        };

        $scope.totalSelecteds = function () {
          return {
            total: $scope.temps.length
          };
        };

        $scope.selectionHas = function (type) {
          return $scope.temps.find(function (item) {
            return item && item.model.type === type;
          });
        };

        $scope.smartClick = function (item) {
          if (item.isFolder()) {
            return $scope.fileNavigator.folderClick(item);
          }
          if (item.isImage()) {
            if ($scope.config.previewImagesInModal) {
              return $scope.openImagePreview(item);
            }
            return $scope.apiMiddleware.download(item, true);
          }
          if (item.isEditable()) {
            return $scope.openEditItem(item);
          }
        };       
        $scope.modal = function (id, hide, returnElement) {        	       
          var element = $('#' + id);
          element.modal(hide ? 'hide' : 'show');
          $scope.apiMiddleware.error = '';
          $scope.apiMiddleware.asyncSuccess = false;
          return returnElement ? element : true;
        };

        $scope.modalWithPathSelector = function (id) {
          $rootScope.selectedModalPath = $scope.fileNavigator.currentPath;
          $rootScope.selectedModalObject = $scope.fileNavigator.folderObject;
          return $scope.modal(id);
        };

        $scope.isInThisPath = function (path) {
          var currentPath = $scope.fileNavigator.currentPath.join('/');
          return currentPath.indexOf(path) !== -1;
        };

        var validateSamePath = function (item) {
          var selectedPath = $rootScope.selectedModalPath.join('');
          var selectedItemsPath = item && item.model.path.join('');
          return selectedItemsPath === selectedPath;
        };

        var getQueryParam = function (param) {
          var found = $window.location.search.substr(1).split('&').filter(function (item) {
            return param === item.split('=')[0];
          });
          return found[0] && found[0].split('=')[1] || undefined;
        };

        $scope.changeLanguage(getQueryParam('lang'));
        $scope.isWindows = getQueryParam('server') === 'Windows';
        if (fileManagerConfig.signedin) {
          $scope.fileNavigator.refresh();
        }else {
          $scope.modal('signin');
        }
      }]);
})(angular, jQuery);