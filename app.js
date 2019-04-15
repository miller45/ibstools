(() => {
    'use strict';


    /**
     * Wrapper functionality.
     */
    let wrapperDef = {
        templateUrl: 'wrapper-tpl.html'
    };


    var ibsFuCallComponentDef = {
        templateUrl: 'ibs-fu-call-tpl.html',
        controller: function IbsFuCallController() {
            var ctrl = this;

            // This would be loaded by $http etc.
            ctrl.list = [
                {
                    name: 'Superman',
                    location: ''
                },
                {
                    name: 'Batman',
                    location: 'Wayne Manor'
                }
            ];
            ctrl.data = {
                name: 'Spawn'
            };
            ctrl.codein = "E_NO_TBR(6,1,19,78,\"NIX\",puaFarbe[1],hctFeld,lz21,\"tb_hct_fk()\",hctHead,.T.,,hctEdit,;\n" +
                "      ,{|nZahl| TBSkip(nZahl,\"gruppe + STR(internnr,7) + objekt + storey\",hctGre) };\n" +
                "      ,{|| TBGOTOP(\"hctAnf\")},{|| TBGOBOTTOM(\"hctEnd\")},,,,,,,,,cbUntAnz,{|| NMZHCLFUNC() } )";
            ctrl.codeout = "";
            ctrl.showParamMapping = function () {
                var paras = splitParametersExpressions(this.codein);
                this.codeout = JSON.stringify(paras, null, 4);
            }
        }

    };

    function appConfig($stateProvider, $urlServiceProvider) {
        $urlServiceProvider.rules.otherwise({state: 'home'});

        $stateProvider.state({
            name: 'home',
            url: '/',
            //template:'<h1>Hello t</h1>'
            component: 'ibsfucall'
        });
    }

    angular
        .module('playgroundApp', ['ui.router'])
        .config(appConfig)
        .component('ibsfucall', ibsFuCallComponentDef);
})();