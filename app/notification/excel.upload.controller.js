
(function () {
    'use strict';
    angular
        .module('gcms.notification')
        .controller('ExcelCtrl', ExcelUploadController);

    ExcelUploadController.$inject = ['$rootScope', '$scope', 'FileUploader', 'ExcelFileMonitor', 'PlaceHolder', 'localeMapper', 'toasty', '$sce','PreTemplates','item','SendEmailItem'];

    function ExcelUploadController($rootScope, $scope, FileUploader, ExcelFileMonitor, PlaceHolder, localeMapper, toasty, sce,PreTemplates,item,SendEmailItem) {

        console.log("Inside Excel Upload controller");
        $scope.itemsByPage = 10;
        $scope.uploads = [];
        $scope.alerts = [];
        $scope.locale = localeMapper.getCurrentISOCode();
        $scope.userID = $rootScope.loggedInUserRoleId;
        $scope.selectedTemplateType = '';
        $scope.placeHolderResult = {};
        $scope.placeHolderList = '';
        $scope.datamodel = [{ "PlaceHolderName": "", "FieldName": "", "FreeText": "" }];
        $scope.fieldlist = [];
        $scope.exceldata = [];
        $scope.emailMessage = '';
        $scope.filterExceldata = [];
        $scope.SearchText = '';
        $scope.newExcelData = '';
        $scope.htmldata = '';
        $scope.finaldata = [];
        $scope.finalmodel = { "placeHolderName": "", "fieldNames": "", "fieldValues": "" };
        $scope.istemplatevalid = false;
        $scope.data = '';
        $scope.dataobj = { "countryCode": "AUG", "templatetype": "intro", "emailListData": [], "excelData": [] };
        $scope.searchparam = null;
        $scope.testselect = {};
        $scope.emailTemplateName = '';
        $scope.curPage = null,
        $scope.itemsPerPage = null,
        $scope.maxSize = null;
        $scope.items = '';
        $scope.filteredItems = '';
        $scope.selectedIndexNumber = '';
        $scope.selectedValueField = [];
        $scope.isPreviewEmail = true;
        $scope.uploadFileList = [];
        $scope.dataTableFields = [];
        $scope.sendAllButton = false;
        $scope.selectedData = {};
        $scope.countyCode = localStorage.getItem("countryCode");

        $scope.filterExpression = function(testselect) {
            return (testselect.cntry_id.isoCode == $scope.countyCode);
        };
        $scope.PreTemplate = [];
    
        /*DataTable creation*/
        $scope.getHeaderData = function () {
            $scope.str = '';
            $scope.dataTableFields.forEach(item => {
                $scope.str += '<th>' + item + '</th>';
            })
            return $scope.str;
        }

        $scope.getBodyData = function () {
            $scope.str1 = '';
            $scope.str2 = '';
            angular.forEach($scope.exceldata, function(item2, key){
            $scope.dataTableFields.forEach(item => {
                    if(JSON.parse($scope.selectedData).Email == item2.Email){
                        $scope.str2 +=  '<td>' + $scope.exceldata[key][item] + '</td>' ;
                    }
                })
                $scope.str1 += '<tr>' + $scope.str2 + '</tr>';
                $scope.str2 = '';
            })
            return $scope.str1;
        }

        $scope.selectDataTableFields = function (fld, active) {
            if (active) {
                $scope.dataTableFields.push(fld);
            }
            else {
                $scope.dataTableFields.splice($scope.dataTableFields.indexOf(fld), 1);
            }
        }

        $scope.createDataTable = function () {
        	$scope.selectedData = JSON.stringify($scope.filterExceldata[$scope.selectedIndexNumber]);
            console.log("selected Data:" + JSON.stringify($scope.exceldata[$scope.selectedIndexNumber]));
            $scope.html = '<table class="table table-bordered">' +
                '<thead><tr>' + $scope.getHeaderData() + '</tr></thead>' +
                '<tbody><tr>' + $scope.getBodyData() + '</tr></tbody>' +
                '</table>';
            $scope.trustedHtml = sce.trustAsHtml($scope.html);
            return $scope.html;
        }

        $scope.loadPlaceholder = function () {
        	$scope.selectedRow = null;
        	$scope.dataTableFields = [];
            $scope.datamodel = [{ "PlaceHolderName": "", "FieldName": "", "FreeText": "" }];

            if ($scope.showPreviewButton == true) {
                $scope.showPreviewButton = false;
            }
            if($scope.sendAllButton == true){
                $scope.sendAllButton = false;
            }
            $scope.reset();
            PlaceHoldercall();
        }
    
        $scope.objectnames = function () {
            var keynames = Object.keys($scope.exceldata[0]);
            $scope.fieldlist = keynames;
            $scope.fieldlist.push('Custom Value');

        }

        /* PlaceHolder start */
        var PlaceHoldercall = function () {
            return PlaceHolder.query({ temptype:JSON.parse($scope.testselect).tmpl_type,emailTemplateName:JSON.parse($scope.testselect).tmpl_name}).$promise.then(function (result) {
                $scope.Result = result;
                console.log($scope.Result[0]);
                $scope.placeHolderList = $scope.Result[0].placeHolderList;
                $scope.emailMessage = $scope.Result[0].message;
                $scope.htmldata = sce.trustAsHtml($scope.emailMessage);
            }).catch(function () {
                $scope.uploader.clearQueue();
                console.log("found error in placeholder call")

            });
        };

        /* validate button start */
        $scope.validate = function () {
            $scope.columnslist = '';
            const regex = /[!@#%$^&()-\d_=0123456789??.,><:;"\d'']/g;
            var keepgoing = true;
            angular.forEach($scope.datamodel, function (value, key) {
                if (keepgoing) {
                    $scope.istemplatevalid = false;
                    $scope.finalfieldvalue = "";
                    if (value.FreeText !== '' && value.FreeText != undefined) {
                        $scope.finalfieldvalue = value.FreeText;
                    }
                    else if (value.FieldName !== '' && value.FieldName !== undefined) {
                        $scope.finalfieldvalue = value.FieldName;
                    }
                    else if (value.FieldName == '' || value.FieldName == undefined) {
                        $scope.finalfieldvalue = "";
                    }

                    if (keepgoing) {
                        var ismultiplecolumns = $scope.finalfieldvalue.indexOf('+');
                        if (ismultiplecolumns > -1) {
                            var colslist = $scope.finalfieldvalue.split('+');
                            for (var i = 0; i < colslist.length; i++) {
                                if ($scope.fieldlist.includes(colslist[i], 0) == false) {
                                    alert('Field Name not exist in excel' + colslist[i]);
                                    $scope.istemplatevalid = false;
                                    keepgoing = false;
                                    break;
                                }
                            }
                            $scope.columnslist = $scope.columnslist + $scope.finalfieldvalue + ',';
                        }
                        else {
                            $scope.columnslist = $scope.columnslist + $scope.finalfieldvalue + ',';
                        }

                        $scope.finalmodel.placeHolderName = value.PlaceHolderName;
                        if (keepgoing) { $scope.istemplatevalid = true; }
                    }

                }
            });
            if ($scope.istemplatevalid == true && keepgoing == true) {
                $scope.filterexcel();
            }
        };
        /* validate button end */

        $scope.patterntest = function () {
            console.log("Inside patterntest method");
            const paragraph = 'a1<>,.:";';
            const regex = /[!@#%$^&()-\d_=0123456789??.,><:;"\d'']/g;
            const found = paragraph.match(regex);
            alert(found.length);
        }

        $scope.filterexcel = function () {
            console.log("filterexcel method");
            $scope.finaldata = [];
            const regex = /[!@#%$^&()-\d_=0123456789??.,><:;"\d'']/g;
            var keepgoing = true;
            if (JSON.parse($scope.testselect).tmpl_type == "tov") {
                $scope.dataTable = $scope.createDataTable();
            }
            for (var i = 0; i < $scope.filterExceldata.length; i++) {
                $scope.filterdata = [];
                angular.forEach($scope.datamodel, function (value, key) {
                    if (keepgoing) {
                        $scope.finalmodel = {};
                        $scope.finalmodel.placeHolderName = '';
                        $scope.finalmodel.fieldValues = '';
                        $scope.finalfieldvalue = '';
                        $scope.finalmodel.placeHolderName = value.PlaceHolderName;
                        if (value.FreeText !== '' && value.FreeText !== undefined) {
                            $scope.finalfieldvalue = value.FreeText;
                        }
                        else if (value.FieldName !== '' && value.FieldName !== undefined) {
                            $scope.finalfieldvalue = value.FieldName;
                        }
                        else if (value.FieldName !== undefined) {
                            $scope.finalfieldvalue = "";
                        }
                        else if (value.FieldName === 'Custom Value') {
                            $scope.finalfieldvalue = value.FreeText;
                        }
                        $scope.finalmodel.placeHolderName = value.PlaceHolderName;
                        $scope.finalmodel.fieldNames = $scope.finalfieldvalue;
                        if ($scope.finalmodel.placeHolderName == 'DATA_TABLE') {
                            $scope.finalmodel.fieldNames = $scope.dataTableFields.toString();
                        }
                        if (keepgoing) {
                            var ismultiplecolumns = $scope.finalfieldvalue.indexOf('+');
                            if (ismultiplecolumns > -1) {

                                var colslist = $scope.finalfieldvalue.split('+');
                                for (var i1 = 0; i1 < colslist.length; i1++) {
                                    $scope.finalmodel = $scope.finalmodel.fieldValues + $scope.filterExceldata[i][colslist[i1]] + ' ';
                                }
                                colslist = [];
                            }
                            else if (value.FreeText !== "" && value.FreeText != undefined) {
                                $scope.finalmodel.fieldValues = value.FreeText;
                            }
                            else {
                                $scope.finalmodel.fieldValues = $scope.filterExceldata[i][$scope.finalfieldvalue];
                            }
                        }
                        $scope.filterdata.push($scope.finalmodel);
                    }
                });
                if ($scope.finalmodel.PlaceHolderName == 'DATA_TABLE') {
                }

                $scope.finaldata.push({ "email": $scope.filterExceldata[i].Email, "uniqueId": $scope.filterExceldata[i].UniqueID, "data": $scope.filterdata });
                /*console.log("$scope.filterdata"+ JSON.stringify($scope.finaldata));*/
            }

            $scope.dataobj.countryCode = $scope.locale;
            $scope.dataobj.templatetype = JSON.parse($scope.testselect).tmpl_type;
            $scope.dataobj.message = $scope.emailMessage;
            $scope.dataobj.emailListData = [];
            $scope.dataobj.emailListData.push(...$scope.finaldata);
            $scope.dataobj.excelData.push(...$scope.filterExceldata);
            console.log("uniqueFinaldata:" + JSON.stringify($scope.dataobj.emailListData));

            for (var p = 0; p < $scope.placeHolderList.length; p++) {
                for (var m = 0; m < $scope.finaldata[$scope.selectedIndexNumber].data.length; m++) {
                    if ($scope.finaldata[$scope.selectedIndexNumber].data[m].placeHolderName === $scope.placeHolderList[p]) {
                        $scope.message = $scope.emailMessage.replaceAll('#' + $scope.placeHolderList[p] + '#', $scope.finaldata[$scope.selectedIndexNumber].data[m].fieldValues);
                        $scope.emailMessage = $scope.message;
                    }
                    if ($scope.placeHolderList[p] == 'DATA_TABLE') {
                        $scope.message = $scope.emailMessage.replaceAll('#DATA_TABLE#', $scope.dataTable);
                        $scope.emailMessage = $scope.message;
                    }
                }
            }
            $scope.htmldata = sce.trustAsHtml($scope.emailMessage);
            $scope.sendAllButton = true;
            PlaceHoldercall();
        }

        $scope.showPreviewButton = false;
        $scope.previewValid = false;
        
        $scope.selectedRow = null;
        $scope.getIndexNumber = function (indexNumber,c) {
            $scope.selectedIndexNumber = indexNumber + (($scope.curPage - 1) * $scope.itemsPerPage);
            
            let totalCount= $scope.datamodel.length;
            let processdCount =0;
            if(JSON.parse($scope.testselect).tmpl_type == "intro"){
                for(var i=0; i<$scope.datamodel.length; i++){
                    if($scope.datamodel[i].FieldName == null || $scope.datamodel[i].FieldName == undefined || $scope.datamodel[i].FieldName == ""){
                        $scope.previewValid = false;
                       // alert("Please replace placeholder for "+  $scope.datamodel[i].PlaceHolderName);
                        toasty.warning({
							title: 'Action Required:',
							msg: 'Please replace placeholder for '+  $scope.datamodel[i].PlaceHolderName,
							showClose: true,
							clickToClose: true,
							timeout: 15000,
							sound: false,
							html: false,
							shake: false,
							theme: 'bootstrap'
						});
                        break;
                    }
                    else if($scope.datamodel[i].FieldName == 'Custom Value' && $scope.datamodel[i].FreeText == "" && ($scope.selectedIndexNumber != null || $scope.selectedIndexNumber!=undefined)){
                        $scope.previewValid = false;
                        //alert("Please provide custom value for " + $scope.datamodel[i].PlaceHolderName); 
                        toasty.warning({
							title: 'Action Required:',
							msg: 'Please provide custom value for '+  $scope.datamodel[i].PlaceHolderName,
							showClose: true,
							clickToClose: true,
							timeout: 15000,
							sound: false,
							html: false,
							shake: false,
							theme: 'bootstrap'
						});
                        break;              
                    }
                    else{
                        processdCount++;
                        $scope.previewValid = true;
                    }
                }
                if($scope.previewValid && processdCount == totalCount) {
                	/*$scope.isSelectedRow = $scope.selectedIndexNumber;*/
                	$scope.selectedRow =c;
                    $scope.showPreviewButton = true;
                }
            }
            if(JSON.parse($scope.testselect).tmpl_type == "tov"){
                for(var i=0; i<$scope.datamodel.length; i++){
                    if(($scope.datamodel[i].FieldName == null || $scope.datamodel[i].FieldName == undefined || $scope.datamodel[i].FieldName == "") && $scope.datamodel[i].PlaceHolderName != 'DATA_TABLE'){
                        //alert("Please replace placeholder for "+  $scope.datamodel[i].PlaceHolderName);
                    	toasty.warning({
							title: 'Action Required:',
							msg: 'Please replace placeholder for '+  $scope.datamodel[i].PlaceHolderName,
							showClose: true,
							clickToClose: true,
							timeout: 15000,
							sound: false,
							html: false,
							shake: false,
							theme: 'bootstrap'
						});
                        break;
                    }
                    else if($scope.datamodel[i].FieldName =='Custom Value' && $scope.datamodel[i].FreeText == "" && ($scope.selectedIndexNumber != null || $scope.selectedIndexNumber!=undefined) && $scope.datamodel[i].PlaceHolderName != 'DATA_TABLE'){
                        $scope.previewValid = false;
                        //alert("Please provide custom value for " + $scope.datamodel[i].PlaceHolderName);
                        toasty.warning({
							title: 'Action Required:',
							msg: 'Please provide custom value for '+  $scope.datamodel[i].PlaceHolderName,
							showClose: true,
							clickToClose: true,
							timeout: 15000,
							sound: false,
							html: false,
							shake: false,
							theme: 'bootstrap'
						});
                        break;
                    }
                    else if($scope.datamodel[i].PlaceHolderName == 'DATA_TABLE' && $scope.dataTableFields.length <= 0){
                        $scope.previewValid = false;
                        //alert("Please select placeholder from data table");
                        toasty.warning({
							title: 'Action Required:',
							msg: 'Please select placeholder from data table ',
							showClose: true,
							clickToClose: true,
							timeout: 15000,
							sound: false,
							html: false,
							shake: false,
							theme: 'bootstrap'
						});
                        break;
                    }
                    else{
                        processdCount++;
                        $scope.previewValid = true;
                    }
                }

                if($scope.previewValid && processdCount == totalCount) {
                	/*$scope.isSelectedRow = $scope.selectedIndexNumber;*/
                	$scope.selectedRow =c;
                    $scope.showPreviewButton = true;

                }

            }
        }

        $scope.getPlaceHolderValueSelect = function (dropDownValue) {
        	$scope.showPreviewButton = false
        }

        $scope.isRadOnly = function (FieldName) {
            if (FieldName == 'Custom Value') {
                return false;
            }
            else {
                return true;
            }
        }

        $scope.reset = function () {
            $scope.placeHolderList = "";
            $scope.selectedValueField = [];
            $scope.showPreviewButton = false;
            // $scope.datamodel = [{ "PlaceHolderName": "", "FieldName": "", "FreeText": "" }];
        }
        $scope.clearSearch = function () {
            $scope.SearchText = "";
            $scope.filteredItems =$scope.filteredItemsCopy;
        }

        /*FileUploader*/
        $scope.uploader = new FileUploader({
            
            filters: [{
                fn: function (item) {
                    var flag = false;
                    for (var i in this.queue) {
                        if (item.name === this.queue[i].file.name) {
                            flag = true;
                        }
                    }
                    if (flag) {
                        item.name += '(' + (this.queue.length + 1) + ')';
                    }
                    return true;
                }
            }],

            url: '../gcms-service/' + $scope.locale + '/excel-upload'

        });
        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

 
        $scope.upload = function () {
            console.log("Inside upload");
            $scope.a = false;
            if ($scope.uploader.progress == 100) {
                $scope.success = '';
                $scope.error = '';
                return ExcelFileMonitor.query({ userid: $scope.userID }).$promise.then(function (result) {
                    $scope.Result = result;
                    $scope.a = result.$resolved;
                    $scope.exceldata = $scope.Result[0].data;
                    $scope.filterExceldata = uniqueData($scope.exceldata, 'Email');
                    const allMandatoryColumnsExists = checkMadatoryColumnExistence($scope.exceldata);
                    if(allMandatoryColumnsExists){
                        const checkValidCountryCode = validateCountryCode($scope.exceldata);
                        const missingEmailandUniqueIdandRecipientName = checkMissingEmailUniqueIdRecipientName($scope.exceldata);
                        const uniqueEmailIdValidationData = findConflicts($scope.Result[0].data);
                        const isValidEmail = checkValidEmail($scope.Result[0].data);

                        if(missingEmailandUniqueIdandRecipientName == false || checkValidCountryCode == false || uniqueEmailIdValidationData == false || isValidEmail == false){
                            // $scope.a=false;
                            // $scope.filterExceldata = "";
                            // $scope.excelData ="";
                            $scope.filteredItems ="";
                            toasty.error({
                                            title: 'Error',
                                            msg: 'Error occured in file upload ! Please check in view data',
                                            showClose: true,
                                            clickToClose: true,
                                            timeout: 10000,
                                            sound: false,
                                            html: false,
                                            shake: false,
                                            theme: 'bootstrap'
                                        });
                                        $scope.uploader.clearQueue();
                        }
                        
                        if(missingEmailandUniqueIdandRecipientName != false && checkValidCountryCode != false && uniqueEmailIdValidationData != false && isValidEmail != false) {
                            toasty.success({
                                title: 'Success',
                                msg: 'File Processed ! See results',
                                showClose: true,
                                clickToClose: true,
                                timeout: 15000,
                                sound: false,
                                html: false,
                                shake: false,
                                theme: 'bootstrap'
                            });
                            $scope.objectnames();
                        /*pagination s*/
                        $scope.curPage = 1;
                        $scope.itemsPerPage = 10;
                        $scope.maxSize = 5;
                        // $scope.items =$scope.item;[]
                        
                        $scope.numOfPages = Math.ceil($scope.filterExceldata.length / $scope.itemsPerPage);
                    
                        $scope.pageChanged = function() {
                        console.log('Page changed to: ' + $scope.curPage);
                        };
                    
                        $scope.$watch('curPage + numOfPages', function () {

                            $scope.filteredItems = $scope.filterExceldata.slice((($scope.curPage-1)*$scope.itemsPerPage), (($scope.curPage)*$scope.itemsPerPage));
                            $scope.filteredItemsCopy = angular.copy($scope.filteredItems);
                        });
                        }
                        $scope.uploader.clearQueue();
                    }
                    
                        
                    }).catch(function () {
                        $scope.uploader.clearQueue();
                        toasty.error({
                            title: 'Error',
                            msg: 'Error occured in file upload ! Please upload a excel file',
                            showClose: true,
                            clickToClose: true,
                            timeout: 5000,
                            sound: false,
                            html: false,
                            shake: false,
                            theme: 'bootstrap'
                        });
                        $scope.a = false;
                    });
                };
        }
        
        function findConflicts(data){
            const emailToIds = {};
            const idToEmails ={};
            const conflictedEmails = new Set();
            const conflictedIds = new Set();
            let emailConflict;
            let idConflict;
            data.forEach(item =>{
                if(!emailToIds[item.Email]){
                    emailToIds[item.Email] = [item.UniqueID];
                }else if(!emailToIds[item.Email].includes(item.UniqueID)){
                    conflictedEmails.add(item.Email);
                }
                if(!idToEmails[item.UniqueID]){
                    idToEmails[item.UniqueID] = [item.Email];
                }else if(!idToEmails[item.UniqueID].includes(item.Email)){
                    conflictedIds.add(item.UniqueID);
                }
            });
            data.forEach(item =>{
                if(conflictedEmails.has(item.Email)){
                    emailConflict = true
                }
                if(conflictedIds.has(item.UniqueID)){
                    idConflict = true;
                }
            });
            if(emailConflict || idConflict){
                return false;
            }
            
        }
        function checkMissingEmailUniqueIdRecipientName(array){
            for(var i=0; i<array.length ; i++){
                if((array[i].Email == null ||array[i].Email == undefined) || (array[i].UniqueID == null || array[i].UniqueID == undefined) ||  (array[i].RecipientName == null || array[i].RecipientName == undefined)){
                    return false;
                }
            }
        }
        function checkValidEmail(data){
            for(var i=0; i<data.length ; i++){ 
                if(data[i].Email != null || data[i].Email !=undefined){
                    let email = data[i].Email.replace(/^\s+|\s+$/gm,'');
                    var EMAIL_REGEX = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
                    + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
                    if(!email.match(EMAIL_REGEX)){
                        return false;
                    }
                }
            } 
        }
        function checkMadatoryColumnExistence(array){
            $scope.columns = Object.keys(array[0]);
           if($scope.columns.indexOf("Country") == -1){
            $scope.a=false;
            $scope.filterExceldata = "";
            $scope.excelData ="";
            $scope.filteredItems ="";
            toasty.error({
                            title: 'Error',
                            msg: 'Error occured in file upload ! Country is mising from data',
                            showClose: true,
                            clickToClose: true,
                            timeout: 10000,
                            sound: false,
                            html: false,
                            shake: false,
                            theme: 'bootstrap'
                        });
                        $scope.uploader.clearQueue();
           }
           if($scope.columns.indexOf("Email") == -1){
            $scope.a=false;
            $scope.filterExceldata = "";
            $scope.excelData ="";
            $scope.filteredItems ="";
            toasty.error({
                            title: 'Error',
                            msg: 'Error occured in file upload ! Email is mising from data',
                            showClose: true,
                            clickToClose: true,
                            timeout: 10000,
                            sound: false,
                            html: false,
                            shake: false,
                            theme: 'bootstrap'
                        });
                        $scope.uploader.clearQueue();
           }
           if($scope.columns.indexOf("UniqueID") == -1){
            $scope.a=false;
            $scope.filterExceldata = "";
            $scope.excelData ="";
            $scope.filteredItems ="";
            toasty.error({
                            title: 'Error',
                            msg: 'Error occured in file upload ! UniqueID is mising from data',
                            showClose: true,
                            clickToClose: true,
                            timeout: 10000,
                            sound: false,
                            html: false,
                            shake: false,
                            theme: 'bootstrap'
                        });
                        $scope.uploader.clearQueue();
           }
           if($scope.columns.indexOf("RecipientName") == -1){
            $scope.a=false;
            $scope.filterExceldata = "";
            $scope.excelData ="";
            $scope.filteredItems ="";
            toasty.error({
                            title: 'Error',
                            msg: 'Error occured in file upload ! RecipientName is mising from data',
                            showClose: true,
                            clickToClose: true,
                            timeout: 10000,
                            sound: false,
                            html: false,
                            shake: false,
                            theme: 'bootstrap'
                        });
                        $scope.uploader.clearQueue();
           }
           if($scope.columns.indexOf("Country") == -1 || $scope.columns.indexOf("Email") == -1 || $scope.columns.indexOf("UniqueID") == -1 || $scope.columns.indexOf("RecipientName") == -1){
            return false;
           }
           else{
            return true;
           }
        }
        function validateCountryCode(array){
            for(var i=0; i<array.length ; i++){
                if(angular.lowercase(array[i].Country) != $scope.locale ){
                    return false;
                }
            }
        }
 
     
        var getPreTemplateData = function(){			  
	  		PreTemplates.query().$promise.then(function(template){	
	  		     $scope.PreTemplates = template;
	  		     for(var i in $scope.PreTemplates){
	  		    	 if($scope.PreTemplates[i].dates_rages == 'Y'){
	  		    	 if(i != "$promise" || i != "$resolve"){
	 				$scope.PreTemplates[i].validity_start_date = moment($scope.PreTemplates[i].validity_start_date,'YYYY-MM-DD');
	 				$scope.PreTemplates[i].validity_end_date = moment($scope.PreTemplates[i].validity_end_date,'YYYY-MM-DD')  ;
	 				$scope.PreTemplates[i].validity_start_date = moment.tz($scope.PreTemplates[i].validity_start_date,moment.tz.guess());   			
	 				$scope.PreTemplates[i].validity_end_date = moment.tz($scope.PreTemplates[i].validity_end_date,moment.tz.guess());
	 				$scope.PreTemplates[i].validity_start_date = moment($scope.PreTemplates[i].validity_start_date).format('DD-MM-YYYY');
	 				$scope.PreTemplates[i].validity_end_date = moment($scope.PreTemplates[i].validity_end_date).format('DD-MM-YYYY')  ;
	 				$scope.PreTemplates[i].startDate = $scope.PreTemplates[i].validity_start_date;
	 				$scope.PreTemplates[i].endDate = $scope.PreTemplates[i].validity_end_date;
	 				$scope.date($scope.PreTemplates[i]);
	  		    	 }
	  		    	 }
	  		    	 } 
	  		       });
	  	};
	  	getPreTemplateData();
	  		
        $scope.startOver = function() {
            location.reload();
        }
	  	  
	  	  /*check for null tmpl_location*/
        $scope.filterNullValues = function(temp){
            return temp.tmpl_location !== null;
        }
	  	  
	  	function uniqueData(array, key) {
            var uniqueArray = [];
            var map = new Map();
            array.forEach((user,index) => {
              if(index == 0) {
                map.set(array[index].Email, array[index].Email);
                uniqueArray.push(array[index]);
              }
                if (!map.get(user[key])) {
                map.set(user[key], user[key]);
                uniqueArray.push(user);
              }
            });
            return uniqueArray;
        }
	  	
        $scope.searchInItem = function(searchText){
            if(searchText != null && searchText!= undefined && searchText!= ""){
                $scope.filteredItems =  $scope.filterExceldata;
            }
            else{
                $scope.filteredItems =$scope.filteredItemsCopy;
            }
        }
        
		$scope.sendAll = function(item){
			$scope.success = '';
			$scope.error = '';
			var EMAIL_REGEX = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
            + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
			
			let emailListCopy =[];
			$scope.item.emailListData.forEach(Element =>{
				if(Element.email.match(EMAIL_REGEX)){
					emailListCopy.push(Element);
				}
			});
			if($scope.item.emailListData.length == emailListCopy.length){
				return SendEmailItem.query(item).$promise.then(function(result){
					console.log(result[0].errors);
					if(result[0].errors == null){
							toasty.success({
							title: 'Success',
						 	msg: 'Email successfully sent to all recipients ',
						 	showClose: true,
						 	clickToClose: true,
						 	timeout: 5000,
						 	sound: false,
						 	html: false,
						 	shake: false,
						 	theme: 'bootstrap'
						 });
						$scope.ok(item);
					}
					else{
						toasty.error({
							title: 'Error',
							msg: 'Error',
							showClose: true,
							clickToClose: true,
							timeout: 15000,
							sound: false,
							html: false,
							shake: false,
							theme: 'bootstrap'
						});
					}
					
				});
			}
			else{
				toasty.error({
					title: 'Error',
					msg: 'Recipient list contains Invalid Emails....',
					showClose: true,
					clickToClose: true,
					timeout: 15000,
					sound: false,
					html: false,
					shake: false,
					theme: 'bootstrap'
				});
			}
		};
    }
})();