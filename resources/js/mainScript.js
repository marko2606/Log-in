/*
FOR SOME REASON NG-MODEL IS NOT UPDATING ON PART OF MY CODE, THAT IS WHY I AM STILL USING JQUERY SELECTORS FOR GETTING/SETTING DATA ON THIS APPLICATION. I HAVE MADE ALL OF THE OTHER CHANGES YOU SUGGUSTED.   
*/

// define Angular app 
var app = angular.module("myApp", ["ngRoute"]);
// define root scope
app.run(function($rootScope) {
     $rootScope.userData = [
        {
        name: 'Marko Markovic',
        email: 'marko@mail.com',
        password: 'marko',
        registrationDate: '12/14/2016 at 15:00:00h',
        lastChangeDate: '12/14/2016 at 15:00:00h',
        permission: 'admin'
        },
        {
        name: 'Petar Petrovic',
        email: 'petar@mail.com',
        password: 'petar',
        registrationDate: '12/14/2016 at 16:00:00h',
        lastChangeDate: '12/14/2016 at 16:00:00h',
        permission: 'user' 
        }
     ];    
});
// define Angular route
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "pages/login.html"   
    })
    .when("/register", {
        templateUrl : "pages/register.html"
    })
    .when("/myProfile", {
        templateUrl: "pages/myProfile.html"
    })
    .when("/admin", {
        templateUrl: "pages/admin.html"
    })
    .when("/viewUser", {
        templateUrl: "pages/viewUser.html"
    })
    .otherwise({
        template: "<h1>eror page not found</h1>"
    });
});

// define Angular controller
app.controller('mainController', function($scope, $location) {  
// define local storage data and create admin account

// put userData array in local storage
localStorage.setItem('$scope.userData', JSON.stringify($scope.userData));

// watch for changes in userData and update local storage
$scope.$watch('userData', function(newVal, oldVal) {
    localStorage.setItem('$scope.userData', JSON.stringify($scope.userData));
}, true);
// get date function
var today = new Date();
function setCurrentDate() {
    today = new Date();
    var day = today.getDate();
    var month = today.getMonth()+1; 
    var year = today.getFullYear();
    var hour = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    if(day<10) {
        day = '0' + day;
    } 
    else if(month < 10) {
        month = '0' + month;
    } 
    else if(seconds < 10) {
        seconds = '0' + seconds;
    }
    today = month + '/' + day + '/' +year + ' at ' + hour + ':' + minutes + ':' + seconds + 'h';
    return today;
}  
// validate email address 
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
    
// CREATE (REGISTER) NEW USER
    
$scope.createNewUser = function(){
    // get full date
    setCurrentDate();
    // add user to localStorage
    // check if every input on register page is provided
    if($('.js-nameRegister').val() === '' || $('.js-emailRegister').val() === '' || $('.js-passwordRegister').val() === '') {
        alert('Please enter all the information needed to register your account');
        return;
    }else if(validateEmail($('.js-emailRegister').val())===false) {
       alert('Your email address is invalid, please try again.');
       return;
   }
    $scope.userData.push(
        {
            name: $('.js-nameRegister').val(),
            email: $('.js-emailRegister').val(),
            password: $('.js-passwordRegister').val(),
            registrationDate: setCurrentDate(),
            lastChangeDate: setCurrentDate(),
            permission: 'user'
        }
    );
    alert('You have succesfully created your account. You can now log in.');
    // go to login page
    $location.path('/');
};
    // LOGIN USER
    
    $scope.myProfileBlock = true; // disable input in myProfile
    $scope.myProfileBlockOn = true; // always disable input for registration date/last change date
    $scope.myProfileSaveChangesDisplay = true; // hide save changes button in myProfile
    var currentUser = -1; // set current user
    $scope.userLogin = function() {
        //!!!!!!
        var logInEmail = $('.js-logInEmail').val(); // get login email
        // find if there is an email match in userData and return index
        function checkEmailLogIn(user) {
            return user.email === logInEmail;
        }
        currentUser = $scope.userData.findIndex(checkEmailLogIn); // get current user index
        // check email match with password
        var logInPassword = $('.js-logInPassword').val(); // get user password
        // if email excist in userData and there is a match with user password
        if(currentUser>=0 && logInPassword===$scope.userData[currentUser].password) {
            // check if user has admin credentials
            if($scope.userData[currentUser].permission==='admin') {
                // go to admin page
                $location.path('/admin');
                return;
            }
            // set current user My Profile page - get data from userData
            $scope.myProfileName = $scope.userData[currentUser].name;
            $scope.myProfileEmail = $scope.userData[currentUser].email;
            $scope.myProfilePassword = $scope.userData[currentUser].password;
            $scope.myProfileRegistrationDate = $scope.userData[currentUser].registrationDate;
            $scope.myProfileLastChange = $scope.userData[currentUser].lastChangeDate;
            // go to myProfile page
            $location.path('/myProfile');
        } else {
            alert ("Wrong email or password, please try again.");
        }
    };
    // enable input in myProfile
    $scope.enableInputMyProfile = function() {
        $scope.myProfileBlock = false; // alow changes to be made in my profile page input
        $scope.myProfileSaveChangesDisplay = false; //show myProfile save changes button
    };
    // save changes in my Profile
    $scope.saveChangesMyProfile = function() {
        $scope.userData[currentUser].name = $('.js-myProfileName').val();
        $scope.userData[currentUser].email = $('.js-myProfileEmail').val();
        $scope.userData[currentUser].password = $('.js-myProfilePassword').val();
        $scope.userData[currentUser].lastChangeDate = setCurrentDate();
        $scope.myProfileSaveChangesDisplay = true; // hide myProfile save changes button
        $scope.myProfileBlock = true; // block any more changes to my Profile page input
    };
    var selectedUserAdminView = -1; // get index of selected user from view user admin page
    $scope.viewUserBlock = true;
    $scope.viewUserBlockOn = true;
    // get index of selected user from admin page and go to view user page/set data
    $scope.adminViewUser = function(sel) {
        function findUserIndex(user) {
            return user.email === sel.email;
        }
        // set data to view user page
        selectedUserAdminView = $scope.userData.findIndex(findUserIndex);
        $scope.viewUserName = $scope.userData[selectedUserAdminView].name;
        $scope.viewUserEmail = $scope.userData[selectedUserAdminView].email;
        $scope.viewUserPassword = $scope.userData[selectedUserAdminView].password;
        $scope.viewUserRegistrationDate = $scope.userData[selectedUserAdminView].registrationDate;
        $scope.viewUserLastChange = $scope.userData[selectedUserAdminView].lastChangeDate;
        // check permission
        if($scope.userData[selectedUserAdminView].permission==='admin') {
            $scope.viewUserPermission = true;
        } else {
            $scope.viewUserPermission = false;
        }
        // go to viewUser page
        $location.path('/viewUser');
    };
    $scope.viewUserSaveChangesDisplay = true; // hide save changes button
    // enabe edit user on view user page
    $scope.viewUserEdit = function() {
        $scope.viewUserBlock = false;
        $scope.viewUserSaveChangesDisplay = false;
    };
    // save changes on view user admin page
    $scope.viewUserSaveChanges = function() {
        $scope.userData[selectedUserAdminView].name = $('.js-viewUserName').val();
        $scope.userData[selectedUserAdminView].email = $('.js-viewUserEmail').val();
        $scope.userData[selectedUserAdminView].password = $('.js-viewUserPassword').val();
        $scope.userData[selectedUserAdminView].lastChangeDate = setCurrentDate();
        // check and set admin permission
        if($('.js-viewUserPermission').is(':checked')) {
            $scope.userData[selectedUserAdminView].permission = 'admin';
        } else {
            $scope.userData[selectedUserAdminView].permission = 'user';
        }
        $scope.viewUserSaveChangesDisplay = true;
        $scope.viewUserBlock = true;
    };
    // logout button
    $scope.logout = function() {
        currentUser = -1;
        $scope.myProfileBlock = true; // disable editting
        $scope.myProfileSaveChangesDisplay = true; //hide save changes button
        $location.path('/');
    };
    // go back button
    $scope.goBack = function() {
        $location.path('/admin');
        $scope.viewUserSaveChangesDisplay = true;
        $scope.viewUserBlock = true;
    };
});
