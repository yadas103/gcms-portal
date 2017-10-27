(function (angular) {
  'use strict';
  angular.module('dctmNgFileManager')
    .provider('fileManagerConfig', function () {
      var values = {
        appName: 'Documentum AngularJS File Manager for Documentum REST Sample',
        defaultLang: 'en',

      //  rootContext: 'http://dctmrest-dev.pfizer.com/dctm-rest',
      //  repositories: ['gnosis71_dev'],
      //  repositoryName: 'gnosis71_dev',
      // repository: 'gnosis71_dev',
      //  username: 'srvamr-gcmsacct',
     //   password: 'Pfe26811',
        signedin: false,
     //   repoLink:'http://dctmrest-dev.pfizer.com/dctm-rest/repositories/gnosis71_dev',
     //   folderPath:'/GCMS Consent Forms Repository/Consent docs',
        searchForm: true,
        sidebar: true,
        breadcrumb: true,
        allowedActions: {
          upload: true,
          rename: true,
          copy: true,
          move: true,
          edit: true,
          changePermissions: true,
          compress: false,
          compressChooseName: false,
          extract: false,
          download: true,
          preview: true,
          remove: true
        },

        showSizeForDirectories: false,
        hideDate: false,
        hidePermissions: false,
        useBinarySizePrefixes: false,

        previewImagesInModal: true,
        enablePermissionsRecursive: true,
        compressAsync: true,
        extractAsync: true,

        isEditableFilePattern: /\.(txt|html?|aspx?|ini|pl|py|md|css|js|log|htaccess|htpasswd|json|sql|xml|xslt?|sh|rb|as|bat|cmd|coffee|php[3-6]?|java|c|cbl|go|h|scala|vb)$/i,
        isImageFilePattern: /\.(jpe?g|gif|bmp|png|svg|tiff?)$/i,
        isExtractableFilePattern: /\.(gz|tar|rar|g?zip)$/i,
        isPdfFilePattern: /\.(pdf)$/i,
        tplPath: 'app/filemanager/templates'
      };

      return {
        $get: function () {
          return values;
        },
        set: function (constants) {
          angular.extend(values, constants);
        }
      }
    })
})(angular);
