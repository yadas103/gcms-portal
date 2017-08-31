 (function () {
	  'use strict';

	  angular
	    .module('gcms.administration')
	    .controller('AdminRoleCtrl', IdCon);

	    IdCon.$inject = ['$rootScope', '$scope'];

	 
  
  
    $scope.tableRowExpanded = false;
    $scope.tableRowIndexCurrExpanded = "";
    $scope.tableRowIndexPrevExpanded = "";
    $scope.storeIdExpanded = "";
    $scope.dayDataCollapse = [];
   

    $scope.dayDataCollapseFn = function () {
        for (var i = 0; $scope.dataModel.ConsentAnnex.length - 1; i += 1) {
            $scope.dayDataCollapse.append('true');
            
        }
    };
    
  
    
    $scope.selectTableRow = function (index, storeId) {
      
      

      if ($scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapse = $scope.dayDataCollapseFn();
            
      } else {
    
    if ($scope.tableRowExpanded === false && $scope.tableRowIndexCurrExpanded === "" && $scope.storeIdExpanded === "") {
                $scope.tableRowIndexPrevExpanded = "";
                $scope.tableRowExpanded = true;
                $scope.tableRowIndexCurrExpanded = index;
                $scope.storeIdExpanded = storeId;
                $scope.dayDataCollapse[index] = true;
    
    }else if ($scope.tableRowExpanded === true) {
      if ($scope.tableRowIndexCurrExpanded === index && $scope.storeIdExpanded === storeId) {
        
                 $scope.tableRowExpanded = false;
                    $scope.tableRowIndexCurrExpanded = "";
                    $scope.storeIdExpanded = "";
                    $scope.dayDataCollapse[index] = false;
     
       }else{
         
                 $scope.tableRowIndexPrevExpanded = $scope.tableRowIndexCurrExpanded;
                    $scope.tableRowIndexCurrExpanded = index;
                    $scope.storeIdExpanded = storeId;
                    $scope.dayDataCollapse[$scope.tableRowIndexPrevExpanded] = false;
                    $scope.dayDataCollapse[$scope.tableRowIndexCurrExpanded] = true;
         
         
       }
     
      
    }
        
      }  
    };
    
    
    $scope.profileModle={
      
    "BusinessProfile" : [
{   "profileId": "sdvgfsdg",
"Name": "zsdgfvsdg",
"Phone": "dghdfhydfh",
"Address": "emen\mujhfy",
},
{   
"profileId": "sdgsdgg",
"Name": "xsdgsdgdg",
"Phone": "dfhdfhd",
"Address": "emen\mujhfy",
},
{   
"profileId": "gghgg",
"Name": "xdfghdfh",
"Phone": "dfhdfjcjudfj",
"Address": "emen\mujhfy",
},
]
      
    };
    
    
  
  
  $scope.dataModel ={
  
    "ConsentAnnex": [
{   
"ConsentId" : "001",
"Country" : "UK",
"EventName" : "Event1",
"StartDate": "2013-07-01",
            "EndDate": "2013-07-02",
"ConsentLocation":"filepath1",
"BusinessProfile":
{
"profileId": "1000",
"Name": "Store 1",
"Phone": "+46 31 1234567",
"Address": "Avenyn 1",
"storeCity": "Gothenburg"
},
 "ConsentData":
           {
"ConsentName": "CND" ,
"ConsentStatus": "Consented"
           }
 
},
{   
"ConsentId" : "002",
"Country" : "GE" ,
"EventName" : "Event2" ,
"StartDate": "2013-07-01",
            "EndDate": "2013-07-02",
"ConsentLocation":"filepath2",
"BusinessProfile":
{
"profileId": "2000",
"Name": "Store 2",
"Phone": "+46 31 1234567",
"Address": "Avenyn 1",
"storeCity": "Gothenburg"
},
"ConsentData":
{
"ConsentName": "NCND",
"ConsentStatus": "NotConsented"
}
},
{   
"ConsentId" : "003",
"Country" : "US" ,
"EventName" : "Event3",
"StartDate": "2013-07-01",
      "EndDate": "2013-07-02",
"ConsentLocation":"filepath3",
"BusinessProfile":
{
"profileId": "3000",
"Name": "Store 3",
"Phone": "+46 31 1234567",
"Address": "Avenyn 1",
"storeCity": "Gothenburg"
} ,
"ConsentData":
{
"ConsentName": "CND",
"ConsentStatus": "Consented"
}
},
{   
"ConsentId" : "004",
"Country" : "SZ",
"EventName" : "Event4",
"StartDate": "2013-07-01",
            "EndDate": "2013-07-02",
"ConsentLocation":"filepath4",
"BusinessProfile": 
{
"profileId": "4000",
"Name": "Store 4",
"Phone": "+46 31 1234567",
"Address": "Avenyn 1",
"storeCity": "Gothenburg"
},
"ConsentData":
{
"ConsentName": "NCND",
"ConsentStatus": "NotConsented"
}
},
{   
"ConsentId" : "005",
"Country" : "SZ",
"EventName" : "Event5",
"StartDate": "2013-07-01",
            "EndDate": "2013-07-02",
"ConsentLocation":"filepath5",
"BusinessProfile": 
{
"profileId": "4000",
"Name": "Store 4",
"Phone": "+46 31 1234567",
"Address": "Avenyn 1",
"storeCity": "Gothenburg"
},
"ConsentData":
{
"ConsentName": "NCND",
"ConsentStatus": "NotConsented"
}
}
]
};
  
  
});


